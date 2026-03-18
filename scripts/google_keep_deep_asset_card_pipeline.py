#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Any
from urllib import error, request

try:
    from scripts.cloudflare_bge_m3_embed import get_embeddings, resolve_config as resolve_embedding_config
    from scripts.cloudflare_qwen3_chat import chat, resolve_config as resolve_qwen_config
    from scripts.google_keep_json_to_md import fetch_source_text, keep_note_to_markdown
    from scripts.lancedb_local_api import post_json, resolve_lancedb_url
    from scripts.parse_notfinder_llm_snapshot import fetch_snapshot_text, parse_snapshot_text
except ModuleNotFoundError:
    from cloudflare_bge_m3_embed import get_embeddings, resolve_config as resolve_embedding_config
    from cloudflare_qwen3_chat import chat, resolve_config as resolve_qwen_config
    from google_keep_json_to_md import fetch_source_text, keep_note_to_markdown
    from lancedb_local_api import post_json, resolve_lancedb_url
    from parse_notfinder_llm_snapshot import fetch_snapshot_text, parse_snapshot_text


DEFAULT_CARD_TABLE = "google_keep_asset_cards"
DEFAULT_GENERATE_WORKERS = 32
DEFAULT_EMBED_WORKERS = 32
MAX_CARD_CHARS = 28000
MAX_SOURCE_CHARS = 16000
ALLOWED_PRIORITIES = {"low", "medium", "high", "critical"}


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


def collect_keep_note_sources(snapshot_source: str, *, limit: int | None = None) -> list[KeepNoteSource]:
    latest_by_path, _ = latest_records_by_path(snapshot_source)
    snapshot_fid = snapshot_source if snapshot_source.startswith("NBSS:") else ""

    json_paths = sorted(path for path in latest_by_path if path.endswith(".json"))
    items: list[KeepNoteSource] = []

    for json_path in json_paths:
        html_path = re.sub(r"\.json$", ".html", json_path)
        if html_path not in latest_by_path:
            continue

        json_ref = latest_by_path[json_path].get("base_ref") or latest_by_path[json_path].get("fid")
        html_ref = latest_by_path[html_path].get("base_ref") or latest_by_path[html_path].get("fid")
        if not isinstance(json_ref, str) or not isinstance(html_ref, str):
            continue

        json_fid = normalize_data_fid(json_ref)
        raw_json = json.loads(fetch_source_text(f"NBSS:{json_fid}"))
        if not looks_like_google_keep_note(raw_json):
            continue

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

        items.append(
            KeepNoteSource(
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
        )

        if limit is not None and len(items) >= limit:
            break

    return items


def default_index_path(output_dir: Path | None, table: str) -> Path:
    base = output_dir if output_dir is not None else Path("var")
    return base / f".{table}.asset_index.json"


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
    current = build_note_signature(note)
    for key in ("keep_json_fid", "keep_html_fid", "attachment_fids", "source_snapshot_fid", "note_title", "created_at"):
        if existing.get(key) != current.get(key):
            return True
    return False


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
) -> None:
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


def truncate_source_markdown(markdown: str, max_chars: int = MAX_SOURCE_CHARS) -> str:
    text = markdown.strip()
    if len(text) <= max_chars:
        return text
    head = text[: max_chars // 2].rstrip()
    tail = text[-max_chars // 3 :].lstrip()
    return f"{head}\n\n[...TRUNCATED FOR CARD GENERATION...]\n\n{tail}"


def normalize_text(value: Any) -> str:
    if value is None:
        return ""
    text = str(value).strip()
    return re.sub(r"\s+", " ", text)


def normalize_list(value: Any, *, max_items: int, lowercase: bool = False) -> list[str]:
    if not isinstance(value, list):
        return []
    items: list[str] = []
    seen: set[str] = set()
    for raw in value:
        item = normalize_text(raw)
        if not item:
            continue
        if lowercase:
            item = item.lower()
        key = item.casefold()
        if key in seen:
            continue
        seen.add(key)
        items.append(item)
        if len(items) >= max_items:
            break
    return items


def normalize_priority(value: Any) -> str:
    text = normalize_text(value).lower()
    if text in ALLOWED_PRIORITIES:
        return text
    if text in {"1", "p1", "urgent", "very high"}:
        return "critical"
    if text in {"2", "p2", "important"}:
        return "high"
    if text in {"3", "p3", "normal", "default", "general", "medium"}:
        return "medium"
    if text in {"4", "5", "p4", "p5", "minor"}:
        return "low"
    return "medium"


def slugify_segment(value: str) -> str:
    text = normalize_text(value)
    if not text:
        return ""
    text = text.replace("_", " ").replace("-", " ")
    text = re.sub(r"[^\w\u4e00-\u9fff\s/]", " ", text, flags=re.UNICODE)
    text = re.sub(r"\s+", "-", text).strip("-")
    return text.lower()


def normalize_category_path(value: Any) -> str:
    if isinstance(value, list):
        parts = [slugify_segment(str(item)) for item in value]
    else:
        raw = normalize_text(value)
        raw = raw.strip("[]")
        raw = raw.replace(">", "/").replace("\\", "/").replace(",", "/")
        parts = [slugify_segment(part) for part in raw.split("/")]
    parts = [part for part in parts if part]
    if not parts:
        return "notes/google-keep"
    return "/".join(parts[:4])


def ensure_substantive_sentence(value: Any, fallback: str) -> str:
    text = normalize_text(value)
    if not text:
        return fallback
    if len(text.split()) <= 3 and not any("\u4e00" <= ch <= "\u9fff" for ch in text):
        return fallback
    return text


def normalize_raw_content_md(value: Any, fallback_markdown: str) -> str:
    text = str(value or "").strip()
    if not text:
        text = truncate_source_markdown(fallback_markdown, max_chars=1200)
    text = text.replace("```", "")
    if len(text) > 2000:
        text = text[:2000].rstrip() + "\n\n[...TRUNCATED...]"
    return text


def build_default_source_context(note: KeepNoteSource) -> str:
    labels = [
        normalize_text(item.get("name"))
        for item in (note.raw_json.get("labels") or [])
        if isinstance(item, dict)
    ]
    labels = [item for item in labels if item]
    label_text = f"，labels: {', '.join(labels[:5])}" if labels else ""
    return f"Google Keep note, path: {note.path}, title: {note.note_title}{label_text}"


def normalize_generated_card(note: KeepNoteSource, card: dict[str, Any]) -> dict[str, Any]:
    return {
        "title": normalize_text(card.get("title")) or note.note_title,
        "tags": normalize_list(card.get("tags"), max_items=8, lowercase=True),
        "retrieval_terms": normalize_list(card.get("retrieval_terms"), max_items=10),
        "category_path": normalize_category_path(card.get("category_path")),
        "priority": normalize_priority(card.get("priority")),
        "core_view": ensure_substantive_sentence(card.get("core_view"), "这条笔记记录了一个可供后续检索的核心观点。"),
        "intent": ensure_substantive_sentence(card.get("intent"), "保留关键背景与线索，便于后续按问题重新召回。"),
        "cognitive_asset": ensure_substantive_sentence(card.get("cognitive_asset"), "形成可被后续复用的结构化知识资产。"),
        "raw_content_md": normalize_raw_content_md(card.get("raw_content_md"), note.markdown),
        "mentioned_entities": normalize_list(card.get("mentioned_entities"), max_items=12),
        "related_scenarios": normalize_list(card.get("related_scenarios"), max_items=8),
        "source_context": normalize_text(card.get("source_context")) or build_default_source_context(note),
    }


def extract_json_object(text: str) -> str:
    candidate = text.strip()
    if candidate.startswith("{") and candidate.endswith("}"):
        return candidate
    start = candidate.find("{")
    end = candidate.rfind("}")
    if start != -1 and end != -1 and end > start:
        return candidate[start : end + 1]
    return candidate


def parse_card_json_response(response: str) -> dict[str, Any]:
    return json.loads(extract_json_object(response))


def build_card_generation_prompt(note: KeepNoteSource) -> str:
    source_md = truncate_source_markdown(note.markdown)
    labels = [
        item.get("name", "")
        for item in (note.raw_json.get("labels") or [])
        if isinstance(item, dict) and str(item.get("name", "")).strip()
    ]

    payload = {
        "card_id": note.card_id,
        "note_title": note.note_title,
        "created_at": note.created_at,
        "path_in_snapshot": note.path,
        "labels": labels,
        "source_snapshot_fid": note.snapshot_fid,
        "keep_json_fid": format_nbss_ref(note.json_fid),
        "keep_md_fid": format_nbss_ref(note.markdown_fid),
        "keep_html_fid": format_nbss_ref(note.html_fid),
        "attachment_fids": [format_nbss_ref(fid) for fid in note.attachment_fids],
        "source_md": source_md,
    }
    return (
        "Generate a Deep Asset Card draft for retrieval. "
        "The source note is usually Chinese. Default to Chinese unless the note itself is dominantly English technical content. "
        "Return strict JSON only with these fields: "
        "title, tags, retrieval_terms, category_path, priority, core_view, intent, cognitive_asset, "
        "raw_content_md, mentioned_entities, related_scenarios, source_context. "
        "Use concise but retrieval-friendly language. Keep tags and retrieval_terms short. "
        "Use priority from this enum only: low, medium, high, critical. "
        "category_path must be a slash-delimited stable taxonomy string with 2 to 4 levels, lowercase, and never a list literal. "
        "core_view, intent, and cognitive_asset must each be one specific sentence, not placeholders, not single English keywords, and not vague abstractions. "
        "raw_content_md should be a compact markdown excerpt, not the full source. "
        "Prefer concrete entities, concepts, methods, and scenarios that improve future retrieval. "
        "Do not include code fences.\n\n"
        + json.dumps(payload, ensure_ascii=False, indent=2)
    )


def render_card_markdown(note: KeepNoteSource, card: dict[str, Any]) -> str:
    normalized = normalize_generated_card(note, card)
    title = normalized["title"]
    tags = normalized["tags"]
    retrieval_terms = normalized["retrieval_terms"]
    category_path = normalized["category_path"]
    priority = normalized["priority"]
    core_view = normalized["core_view"]
    intent = normalized["intent"]
    cognitive_asset = normalized["cognitive_asset"]
    raw_content_md = normalized["raw_content_md"]
    source_context = normalized["source_context"]

    entities = normalized["mentioned_entities"]
    scenarios = normalized["related_scenarios"]

    lines = [
        "---",
        f"id: {note.card_id}",
        "source_type: google_keep",
        f"tags: {json.dumps(tags, ensure_ascii=False)}",
        f"retrieval_terms: {json.dumps(retrieval_terms, ensure_ascii=False)}",
        f'category_path: "{category_path}"',
        f"created_at: {note.created_at or ''}",
        f'priority: "{priority}"',
        f"source_snapshot_fid: {note.snapshot_fid}",
        f"keep_json_fid: {format_nbss_ref(note.json_fid)}",
        f"keep_md_fid: {format_nbss_ref(note.markdown_fid)}",
        f"keep_html_fid: {format_nbss_ref(note.html_fid)}",
        f"attachment_fids: {json.dumps([format_nbss_ref(fid) for fid in note.attachment_fids], ensure_ascii=False)}",
        f'path_in_snapshot: "{note.path}"',
        f'note_title: "{note.note_title}"',
        "---",
        "",
        f"# {title}",
        "",
        "> ### 🧠 资产解读 (Interpretation & Perspective)",
        f"> **核心观点**：{core_view}",
        f"> **意图识别**：{intent}",
        f"> **认知资产**：{cognitive_asset}",
        "",
        "## 📝 原始内容 (Raw Content)",
        raw_content_md or "- 无",
        "",
        "## 🔍 召回增强 (Retrieval Anchors)",
        f"- **提及实体**：{', '.join(str(x) for x in entities) if entities else '无'}",
        f"- **关联场景**：{', '.join(str(x) for x in scenarios) if scenarios else '无'}",
        f"- **来源上下文**：{source_context}",
        "",
    ]
    markdown = "\n".join(lines)
    if len(markdown) > MAX_CARD_CHARS:
        markdown = markdown[: MAX_CARD_CHARS - 32].rstrip() + "\n\n[TRUNCATED]\n"
    return markdown


def generate_single_card(note: KeepNoteSource) -> dict[str, Any]:
    account_id, token, model = resolve_qwen_config()
    prompt = build_card_generation_prompt(note)
    system = (
        "You generate Deep Asset Card drafts for retrieval systems. "
        "Return valid JSON only, no markdown fences, no commentary."
    )
    response = chat(
        prompt,
        system=system,
        account_id=account_id,
        token=token,
        model=model,
    )
    try:
        parsed = parse_card_json_response(response)
    except json.JSONDecodeError:
        repaired = chat(
            (
                "Repair the following malformed JSON into valid JSON. "
                "Return JSON only, preserving the same schema and content as much as possible.\n\n"
                + response
            ),
            system="Return valid JSON only.",
            account_id=account_id,
            token=token,
            model=model,
        )
        parsed = parse_card_json_response(repaired)
    card = normalize_generated_card(note, parsed)
    markdown = render_card_markdown(note, card)
    return {
        "id": note.card_id,
        "note_title": note.note_title,
        "path": note.path,
        "card_markdown": markdown,
        "card_fields": card,
        "metadata": {
            "source_type": "google_keep",
            "source_snapshot_fid": note.snapshot_fid,
            "keep_json_fid": format_nbss_ref(note.json_fid),
            "keep_md_fid": format_nbss_ref(note.markdown_fid),
            "keep_html_fid": format_nbss_ref(note.html_fid),
            "attachment_fids": [format_nbss_ref(fid) for fid in note.attachment_fids],
            "path_in_snapshot": note.path,
            "note_title": note.note_title,
            "created_at": note.created_at,
            "tags": card["tags"],
            "retrieval_terms": card["retrieval_terms"],
            "category_path": card["category_path"],
            "priority": card["priority"],
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
    generate_workers: int,
    embed_workers: int,
    output_dir: Path | None,
    incremental: bool,
    index_path: Path | None,
) -> dict[str, Any]:
    notes = collect_keep_note_sources(snapshot_source, limit=limit)
    resolved_index_path = index_path or default_index_path(output_dir, table)
    previous_index = load_asset_index(resolved_index_path) if incremental else {}
    skipped_unchanged = 0
    notes_to_process = notes
    if incremental:
        notes_to_process, skipped_unchanged = filter_changed_notes(notes, index=previous_index)

    generated_cards: list[dict[str, Any]] = []
    with ThreadPoolExecutor(max_workers=max(1, generate_workers)) as executor:
        futures = {executor.submit(generate_single_card, note): note for note in notes_to_process}
        for future in as_completed(futures):
            generated_cards.append(future.result())

    generated_cards.sort(key=lambda item: item["id"])

    if output_dir is not None:
        output_dir.mkdir(parents=True, exist_ok=True)
        for card in generated_cards:
            (output_dir / f"{card['id']}.md").write_text(card["card_markdown"], encoding="utf-8")

    upserts: list[dict[str, Any]] = []
    with ThreadPoolExecutor(max_workers=max(1, embed_workers)) as executor:
        futures = {executor.submit(embed_and_upsert_single, card, table=table): card for card in generated_cards}
        for future in as_completed(futures):
            upserts.append(future.result())

    upserts.sort(key=lambda item: item["id"])
    update_asset_index(
        index_path=resolved_index_path,
        previous_index=previous_index,
        notes=notes_to_process,
        cards=generated_cards,
    )
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
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Build Deep Asset Cards for Google Keep notes and ingest them into LanceDB.")
    parser.add_argument("snapshot_source", help="A notFinder snapshot source, typically NBSS:0x...")
    parser.add_argument("--table", default=DEFAULT_CARD_TABLE)
    parser.add_argument("--limit", type=int, default=None)
    parser.add_argument("--generate-workers", type=int, default=DEFAULT_GENERATE_WORKERS)
    parser.add_argument("--embed-workers", type=int, default=DEFAULT_EMBED_WORKERS)
    parser.add_argument("--output-dir", default="var/google_keep_asset_cards")
    parser.add_argument("--index-path", default="")
    parser.add_argument("--full-refresh", action="store_true", help="Disable incremental filtering and regenerate all selected notes.")
    args = parser.parse_args()

    result = run_pipeline(
        args.snapshot_source,
        table=args.table,
        limit=args.limit,
        generate_workers=args.generate_workers,
        embed_workers=args.embed_workers,
        output_dir=Path(args.output_dir) if args.output_dir else None,
        incremental=not args.full_refresh,
        index_path=Path(args.index_path) if args.index_path else None,
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
