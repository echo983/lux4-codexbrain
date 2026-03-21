#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import re
import time
from collections import deque
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Any
from urllib import error, request

try:
    from scripts.cloudflare_bge_m3_embed import get_embeddings, resolve_config as resolve_embedding_config
    from scripts.cloudflare_qwen3_chat import chat, chat_completion_data, resolve_config as resolve_qwen_config
    from scripts.google_keep_json_to_md import fetch_source_text, keep_note_to_markdown
    from scripts.lancedb_local_api import post_json, resolve_lancedb_url
    from scripts.parse_notfinder_llm_snapshot import fetch_snapshot_text, parse_snapshot_text
except ModuleNotFoundError:
    from cloudflare_bge_m3_embed import get_embeddings, resolve_config as resolve_embedding_config
    from cloudflare_qwen3_chat import chat, chat_completion_data, resolve_config as resolve_qwen_config
    from google_keep_json_to_md import fetch_source_text, keep_note_to_markdown
    from lancedb_local_api import post_json, resolve_lancedb_url
    from parse_notfinder_llm_snapshot import fetch_snapshot_text, parse_snapshot_text


DEFAULT_CARD_TABLE = "google_keep_asset_cards"
DEFAULT_GENERATE_WORKERS = 32
DEFAULT_EMBED_WORKERS = 32
DEFAULT_PREPARE_WORKERS = 16
MAX_CARD_CHARS = 28000
MAX_SOURCE_CHARS = 10000
ASSET_DOC_KIND = "asset_card"
ASSET_CARD_SCHEMA = "deep_asset_card_v1"
GOOGLE_KEEP_SOURCE_TYPE = "google_keep"


@dataclass
class KeepNoteSource:
    card_id: str
    path: str
    note_title: str
    json_fid: str
    html_fid: str
    attachment_fids: list[str]
    created_at: str
    raw_json: dict[str, Any]
    markdown: str
    markdown_fid: str
    snapshot_fid: str


@dataclass
class PipelineProgress:
    path: Path
    snapshot_source: str
    table: str
    started_at: str
    notes_processed: int
    notes_selected_for_generation: int
    notes_skipped_unchanged: int
    generated: int = 0
    upserted: int = 0
    failed: int = 0
    status: str = "running"
    last_generated_path: str = ""
    last_upserted_path: str = ""
    last_error_path: str = ""
    last_error: str = ""
    recent_generated_paths: deque[str] | None = None
    recent_upserted_paths: deque[str] | None = None

    def __post_init__(self) -> None:
        if self.recent_generated_paths is None:
            self.recent_generated_paths = deque(maxlen=10)
        if self.recent_upserted_paths is None:
            self.recent_upserted_paths = deque(maxlen=10)
        self.write()

    def _payload(self) -> dict[str, Any]:
        return {
            "snapshot_source": self.snapshot_source,
            "table": self.table,
            "started_at": self.started_at,
            "updated_at": datetime.now(tz=UTC).isoformat(),
            "status": self.status,
            "notes_processed": self.notes_processed,
            "notes_selected_for_generation": self.notes_selected_for_generation,
            "notes_skipped_unchanged": self.notes_skipped_unchanged,
            "generated": self.generated,
            "upserted": self.upserted,
            "failed": self.failed,
            "last_generated_path": self.last_generated_path,
            "last_upserted_path": self.last_upserted_path,
            "last_error_path": self.last_error_path,
            "last_error": self.last_error,
            "recent_generated_paths": list(self.recent_generated_paths or []),
            "recent_upserted_paths": list(self.recent_upserted_paths or []),
        }

    def write(self) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(json.dumps(self._payload(), ensure_ascii=False, indent=2), encoding="utf-8")

    def mark_generated(self, note: KeepNoteSource) -> None:
        self.generated += 1
        self.last_generated_path = note.path
        if self.recent_generated_paths is not None:
            self.recent_generated_paths.append(note.path)
        self.write()

    def mark_upserted(self, note: KeepNoteSource) -> None:
        self.upserted += 1
        self.last_upserted_path = note.path
        if self.recent_upserted_paths is not None:
            self.recent_upserted_paths.append(note.path)
        self.write()

    def mark_failed(self, note: KeepNoteSource | None, exc: Exception) -> None:
        self.failed += 1
        self.status = "failed"
        self.last_error_path = note.path if note is not None else ""
        self.last_error = str(exc)
        self.write()

    def mark_completed(self) -> None:
        self.status = "completed"
        self.write()


def make_card_id(path: str) -> str:
    digest = hashlib.sha1(path.encode("utf-8")).hexdigest()[:16]
    return f"keep_{digest}"


def format_nbss_ref(fid: str) -> str:
    if fid.startswith("NBSS:"):
        return fid
    return f"NBSS:{fid}"


def nbss_put_bytes(data: bytes) -> dict[str, Any]:
    req = request.Request(
        "http://127.0.0.1:8080/nbss",
        data=data,
        method="PUT",
        headers={"Content-Type": "application/octet-stream"},
    )
    try:
        with request.urlopen(req, timeout=60) as response:
            return json.loads(response.read().decode("utf-8"))
    except error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"NBSS PUT failed with HTTP {exc.code}: {detail}") from exc
    except error.URLError as exc:
        raise RuntimeError(f"NBSS PUT failed: {exc}") from exc


def normalize_data_fid(ref: str) -> str:
    if ref.startswith("D:"):
        return ref.split(":", 2)[1]
    return ref


def parse_note_created_at(note: dict[str, Any]) -> str:
    value = note.get("createdTimestampUsec")
    if not value:
        return ""
    try:
        return datetime.fromtimestamp(int(value) / 1_000_000, tz=UTC).date().isoformat()
    except (TypeError, ValueError, OSError):
        return ""


def looks_like_google_keep_note(note: dict[str, Any]) -> bool:
    if not isinstance(note, dict):
        return False
    required = {"createdTimestampUsec", "userEditedTimestampUsec", "isArchived", "isPinned", "isTrashed"}
    if not required.issubset(note.keys()):
        return False
    return any(key in note for key in ("textContent", "listContent", "textContentHtml"))


def latest_records_by_path(snapshot_source: str) -> tuple[dict[str, dict[str, Any]], dict[int, str]]:
    text = fetch_snapshot_text(snapshot_source)
    parsed = parse_snapshot_text(text)
    path_map = parsed["path_map"]
    latest: dict[str, dict[str, Any]] = {}
    for record in parsed["records"]:
        path = path_map.get(record["pid"], "")
        if not isinstance(path, str) or not path:
            continue
        if record.get("size", 0) <= 0:
            continue
        prev = latest.get(path)
        if prev is None or int(record["ts"]) > int(prev["ts"]):
            latest[path] = record
    return latest, path_map


def prepare_keep_note_source(
    *,
    snapshot_fid: str,
    latest_by_path: dict[str, dict[str, Any]],
    json_path: str,
) -> KeepNoteSource | None:
    html_path = re.sub(r"\.json$", ".html", json_path)
    if html_path not in latest_by_path:
        return None

    json_ref = latest_by_path[json_path].get("base_ref") or latest_by_path[json_path].get("fid")
    html_ref = latest_by_path[html_path].get("base_ref") or latest_by_path[html_path].get("fid")
    if not isinstance(json_ref, str) or not isinstance(html_ref, str):
        return None

    json_fid = normalize_data_fid(json_ref)
    raw_json = json.loads(fetch_source_text(f"NBSS:{json_fid}"))
    if not looks_like_google_keep_note(raw_json):
        return None

    stem = json_path[:-5]
    attachment_fids: list[str] = []
    for sibling_path, sibling_record in latest_by_path.items():
        if sibling_path in {json_path, html_path}:
            continue
        if sibling_path.startswith(stem + "."):
            sibling_ref = sibling_record.get("base_ref") or sibling_record.get("fid")
            if isinstance(sibling_ref, str):
                attachment_fids.append(normalize_data_fid(sibling_ref))

    markdown = keep_note_to_markdown(raw_json, title_fallback=Path(stem).name or "Untitled")
    md_put = nbss_put_bytes(markdown.encode("utf-8"))
    markdown_fid = md_put["fid"]
    note_title = str(raw_json.get("title") or "").strip() or Path(stem).name or "Untitled"
    created_at = parse_note_created_at(raw_json)
    card_id = make_card_id(json_path)
    return KeepNoteSource(
        card_id=card_id,
        path=json_path,
        note_title=note_title,
        json_fid=json_fid,
        html_fid=normalize_data_fid(html_ref),
        attachment_fids=sorted(set(attachment_fids)),
        created_at=created_at,
        raw_json=raw_json,
        markdown=markdown,
        markdown_fid=markdown_fid,
        snapshot_fid=snapshot_fid,
    )


def collect_keep_note_sources(
    snapshot_source: str,
    *,
    limit: int | None = None,
    prepare_workers: int = DEFAULT_PREPARE_WORKERS,
) -> list[KeepNoteSource]:
    latest_by_path, _ = latest_records_by_path(snapshot_source)
    snapshot_fid = snapshot_source if snapshot_source.startswith("NBSS:") else ""

    json_paths = sorted(path for path in latest_by_path if path.endswith(".json"))
    items: list[KeepNoteSource] = []
    candidate_paths = json_paths[:limit] if limit is not None else json_paths
    with ThreadPoolExecutor(max_workers=max(1, prepare_workers)) as executor:
        futures = {
            executor.submit(
                prepare_keep_note_source,
                snapshot_fid=snapshot_fid,
                latest_by_path=latest_by_path,
                json_path=json_path,
            ): json_path
            for json_path in candidate_paths
        }
        for future in as_completed(futures):
            note = future.result()
            if note is not None:
                items.append(note)

    items.sort(key=lambda item: item.path)
    return items


def default_index_path(output_dir: Path | None, table: str) -> Path:
    base = output_dir if output_dir is not None else Path("var")
    return base / f".{table}.asset_index.json"


def default_progress_path(output_dir: Path | None, table: str) -> Path:
    base = output_dir if output_dir is not None else Path("var")
    return base / f".{table}.progress.json"


def load_asset_index(index_path: Path) -> dict[str, dict[str, Any]]:
    if not index_path.exists():
        return {}
    return json.loads(index_path.read_text(encoding="utf-8"))


def build_note_signature(note: KeepNoteSource) -> dict[str, Any]:
    return {
        "card_id": note.card_id,
        "path_in_snapshot": note.path,
        "keep_json_fid": format_nbss_ref(note.json_fid),
        "keep_html_fid": format_nbss_ref(note.html_fid),
        "attachment_fids": [format_nbss_ref(fid) for fid in note.attachment_fids],
        "source_snapshot_fid": note.snapshot_fid,
        "note_title": note.note_title,
        "created_at": note.created_at,
    }


def note_changed(note: KeepNoteSource, existing: dict[str, Any] | None) -> bool:
    if not existing:
        return True
    return existing.get("keep_json_fid") != format_nbss_ref(note.json_fid)


def filter_changed_notes(
    notes: list[KeepNoteSource],
    *,
    index: dict[str, dict[str, Any]],
) -> tuple[list[KeepNoteSource], int]:
    changed: list[KeepNoteSource] = []
    skipped = 0
    for note in notes:
        if note_changed(note, index.get(note.path)):
            changed.append(note)
        else:
            skipped += 1
    return changed, skipped


def update_asset_index(
    *,
    index_path: Path,
    previous_index: dict[str, dict[str, Any]],
    notes: list[KeepNoteSource],
    cards: list[dict[str, Any]],
) -> dict[str, dict[str, Any]]:
    by_id = {card["id"]: card for card in cards}
    updated = dict(previous_index)
    for note in notes:
        card = by_id.get(note.card_id)
        entry = build_note_signature(note)
        if card is not None:
            entry.update(
                {
                    "tags": card["metadata"].get("tags", []),
                    "retrieval_terms": card["metadata"].get("retrieval_terms", []),
                    "category_path": card["metadata"].get("category_path", ""),
                    "priority": card["metadata"].get("priority", ""),
                    "updated_at": datetime.now(tz=UTC).isoformat(),
                }
            )
        updated[note.path] = entry
    index_path.parent.mkdir(parents=True, exist_ok=True)
    index_path.write_text(json.dumps(updated, ensure_ascii=False, indent=2, sort_keys=True), encoding="utf-8")
    return updated


def truncate_source_markdown(markdown: str, max_chars: int = MAX_SOURCE_CHARS) -> str:
    text = markdown.strip()
    if len(text) <= max_chars:
        return text
    head = text[: max_chars // 2].rstrip()
    tail = text[-max_chars // 3 :].lstrip()
    return f"{head}\n\n[...TRUNCATED FOR CARD GENERATION...]\n\n{tail}"


def yaml_quote(value: str) -> str:
    escaped = value.replace("\\", "\\\\").replace('"', '\\"')
    return f'"{escaped}"'


def truncate_card_body(markdown: str) -> str:
    text = markdown.strip().replace("\r\n", "\n")
    if len(text) <= MAX_CARD_CHARS:
        return text
    return text[: MAX_CARD_CHARS - 32].rstrip() + "\n\n[TRUNCATED]\n"


def build_card_generation_prompt(note: KeepNoteSource) -> str:
    source_md = truncate_source_markdown(note.markdown)
    labels = [
        item.get("name", "")
        for item in (note.raw_json.get("labels") or [])
        if isinstance(item, dict) and str(item.get("name", "")).strip()
    ]
    labels_text = ", ".join(labels[:8]) if labels else "none"
    return (
        "Write a Deep Asset Card in markdown for retrieval. "
        "Use the source markdown as the only semantic source. "
        "Default to Chinese unless the source is dominantly English technical content. "
        "Output markdown only. Do not output JSON. Do not use code fences. "
        "Stay within roughly 8K tokens. Be complete and retrieval-friendly, but avoid filler. "
        "The card body must contain these sections in this order:\n"
        f"# {note.note_title}\n"
        "> ### 🧠 资产解读 (Interpretation & Perspective)\n"
        "> **核心观点**：...\n"
        "> **意图识别**：...\n"
        "> **认知资产**：...\n"
        "## 📝 原始内容 (Raw Content)\n"
        "## 🔍 召回增强 (Retrieval Anchors)\n"
        "- **提及实体**：...\n"
        "- **关联场景**：...\n"
        "- **来源上下文**：...\n\n"
        "Requirements:\n"
        "- Make it optimized for future retrieval, not for literary style.\n"
        "- Mention concrete entities, methods, terms, people, places, systems, constraints, and scenarios when present.\n"
        "- Under Raw Content, keep substantial original content in markdown form, compressed if needed.\n"
        "- Under Retrieval Anchors, include concise retrieval anchors, but do not invent facts not grounded in the source.\n"
        "- Avoid placeholders and empty abstractions.\n"
        "- If the note is short, still produce a useful card without over-expanding wildly.\n\n"
        "Source metadata:\n"
        f"- note_title: {note.note_title}\n"
        f"- created_at: {note.created_at or 'unknown'}\n"
        f"- path_in_snapshot: {note.path}\n"
        f"- labels: {labels_text}\n\n"
        "Source markdown:\n\n"
        f"{source_md}\n"
    )


def build_card_frontmatter(note: KeepNoteSource) -> str:
    lines = [
        "---",
        f"id: {note.card_id}",
        f"doc_kind: {ASSET_DOC_KIND}",
        f"source_type: {GOOGLE_KEEP_SOURCE_TYPE}",
        f"card_schema: {ASSET_CARD_SCHEMA}",
        "tags: []",
        "retrieval_terms: []",
        'category_path: "notes/google-keep"',
        f"created_at: {note.created_at or ''}",
        'priority: "medium"',
        f"source_snapshot_fid: {note.snapshot_fid}",
        f"keep_json_fid: {format_nbss_ref(note.json_fid)}",
        f"keep_md_fid: {format_nbss_ref(note.markdown_fid)}",
        f"keep_html_fid: {format_nbss_ref(note.html_fid)}",
        f"attachment_fids: {json.dumps([format_nbss_ref(fid) for fid in note.attachment_fids], ensure_ascii=False)}",
        f"path_in_snapshot: {yaml_quote(note.path)}",
        f"note_title: {yaml_quote(note.note_title)}",
        "---",
    ]
    return "\n".join(lines)


def generate_card_body_once(note: KeepNoteSource) -> str:
    account_id, token, model = resolve_qwen_config()
    prompt = build_card_generation_prompt(note)
    system = (
        "You write Deep Asset Cards in markdown for retrieval systems. "
        "Return markdown only."
    )
    data = chat_completion_data(
        prompt,
        system=system,
        account_id=account_id,
        token=token,
        model=model,
    )
    choice = (((data.get("result") or {}).get("choices")) or [{}])[0]
    message = choice.get("message") or {}
    content = message.get("content")
    if isinstance(content, str) and content.strip():
        return content.strip()
    raise RuntimeError(f"Cloudflare Qwen did not return markdown content: {data}")


def generate_single_card(note: KeepNoteSource) -> dict[str, Any]:
    last_error: Exception | None = None
    body = ""
    for attempt in range(2):
        try:
            body = generate_card_body_once(note)
            break
        except Exception as exc:  # call-level retry only
            last_error = exc
            if attempt == 1:
                raise
            time.sleep(0.2)
    if not body:
        raise RuntimeError(f"Failed to generate card body for {note.path}: {last_error}")
    markdown = build_card_frontmatter(note) + "\n\n" + truncate_card_body(body)
    return {
            "id": note.card_id,
            "note_title": note.note_title,
            "path": note.path,
            "card_markdown": markdown,
            "metadata": {
            "doc_kind": ASSET_DOC_KIND,
            "source_type": GOOGLE_KEEP_SOURCE_TYPE,
            "card_schema": ASSET_CARD_SCHEMA,
            "source_snapshot_fid": note.snapshot_fid,
            "keep_json_fid": format_nbss_ref(note.json_fid),
            "keep_md_fid": format_nbss_ref(note.markdown_fid),
            "keep_html_fid": format_nbss_ref(note.html_fid),
            "attachment_fids": [format_nbss_ref(fid) for fid in note.attachment_fids],
            "path_in_snapshot": note.path,
            "note_title": note.note_title,
            "created_at": note.created_at,
        },
    }


def embed_and_upsert_single(card_entry: dict[str, Any], *, table: str) -> dict[str, Any]:
    account_id, token, model = resolve_embedding_config()
    vector = get_embeddings([card_entry["card_markdown"]], account_id=account_id, token=token, model=model)[0]
    response = post_json(
        f"{resolve_lancedb_url()}/upsert",
        {
            "table": table,
            "documents": [
                {
                    "id": card_entry["id"],
                    "text": card_entry["card_markdown"],
                    "vector": vector,
                    "metadata": card_entry["metadata"],
                }
            ],
        },
    )
    return {
        "id": card_entry["id"],
        "rows_written": response.get("rows_written", 0),
        "table": response.get("table", table),
    }


def run_pipeline(
    snapshot_source: str,
    *,
    table: str,
    limit: int | None,
    prepare_workers: int,
    generate_workers: int,
    embed_workers: int,
    output_dir: Path | None,
    incremental: bool,
    index_path: Path | None,
    progress_path: Path | None,
) -> dict[str, Any]:
    notes = collect_keep_note_sources(snapshot_source, limit=limit, prepare_workers=prepare_workers)
    resolved_index_path = index_path or default_index_path(output_dir, table)
    resolved_progress_path = progress_path or default_progress_path(output_dir, table)
    previous_index = load_asset_index(resolved_index_path) if incremental else {}
    skipped_unchanged = 0
    notes_to_process = notes
    if incremental:
        notes_to_process, skipped_unchanged = filter_changed_notes(notes, index=previous_index)

    progress = PipelineProgress(
        path=resolved_progress_path,
        snapshot_source=snapshot_source,
        table=table,
        started_at=datetime.now(tz=UTC).isoformat(),
        notes_processed=len(notes),
        notes_selected_for_generation=len(notes_to_process),
        notes_skipped_unchanged=skipped_unchanged,
    )

    generated_cards: list[dict[str, Any]] = []
    generated_by_id: dict[str, dict[str, Any]] = {}
    note_by_card_id: dict[str, KeepNoteSource] = {}
    with ThreadPoolExecutor(max_workers=max(1, generate_workers)) as executor:
        futures = {executor.submit(generate_single_card, note): note for note in notes_to_process}
        for future in as_completed(futures):
            note = futures[future]
            try:
                card = future.result()
            except Exception as exc:
                progress.mark_failed(note, exc)
                raise
            generated_cards.append(card)
            generated_by_id[card["id"]] = card
            note_by_card_id[card["id"]] = note
            if output_dir is not None:
                output_dir.mkdir(parents=True, exist_ok=True)
                (output_dir / f"{card['id']}.md").write_text(card["card_markdown"], encoding="utf-8")
            progress.mark_generated(note)

    generated_cards.sort(key=lambda item: item["id"])

    upserts: list[dict[str, Any]] = []
    with ThreadPoolExecutor(max_workers=max(1, embed_workers)) as executor:
        futures = {executor.submit(embed_and_upsert_single, card, table=table): card for card in generated_cards}
        for future in as_completed(futures):
            card = futures[future]
            note = note_by_card_id[card["id"]]
            try:
                result = future.result()
            except Exception as exc:
                progress.mark_failed(note, exc)
                raise
            upserts.append(result)
            previous_index = update_asset_index(
                index_path=resolved_index_path,
                previous_index=previous_index,
                notes=[note],
                cards=[generated_by_id[card["id"]]],
            )
            progress.mark_upserted(note)

    upserts.sort(key=lambda item: item["id"])
    progress.mark_completed()
    return {
        "snapshot_source": snapshot_source,
        "table": table,
        "notes_processed": len(notes),
        "notes_selected_for_generation": len(notes_to_process),
        "notes_skipped_unchanged": skipped_unchanged,
        "cards_generated": len(generated_cards),
        "upserts": upserts,
        "incremental": incremental,
        "index_path": str(resolved_index_path),
        "progress_path": str(resolved_progress_path),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Build Deep Asset Cards for Google Keep notes and ingest them into LanceDB.")
    parser.add_argument("snapshot_source", help="A notFinder snapshot source, typically NBSS:0x...")
    parser.add_argument("--table", default=DEFAULT_CARD_TABLE)
    parser.add_argument("--limit", type=int, default=None)
    parser.add_argument("--prepare-workers", type=int, default=DEFAULT_PREPARE_WORKERS)
    parser.add_argument("--generate-workers", type=int, default=DEFAULT_GENERATE_WORKERS)
    parser.add_argument("--embed-workers", type=int, default=DEFAULT_EMBED_WORKERS)
    parser.add_argument("--output-dir", default="var/google_keep_asset_cards")
    parser.add_argument("--index-path", default="")
    parser.add_argument("--progress-path", default="")
    parser.add_argument("--full-refresh", action="store_true", help="Disable incremental filtering and regenerate all selected notes.")
    args = parser.parse_args()

    result = run_pipeline(
        args.snapshot_source,
        table=args.table,
        limit=args.limit,
        prepare_workers=args.prepare_workers,
        generate_workers=args.generate_workers,
        embed_workers=args.embed_workers,
        output_dir=Path(args.output_dir) if args.output_dir else None,
        incremental=not args.full_refresh,
        index_path=Path(args.index_path) if args.index_path else None,
        progress_path=Path(args.progress_path) if args.progress_path else None,
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
