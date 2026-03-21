#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

try:
    from scripts.cloudflare_bge_m3_embed import get_embeddings, resolve_config as resolve_embedding_config
    from scripts.google_keep_deep_asset_card_pipeline import (
        DEFAULT_PREPARE_WORKERS,
        KeepNoteSource,
        PipelineProgress,
        build_note_signature,
        collect_keep_note_sources,
        default_progress_path,
        filter_changed_notes,
        format_nbss_ref,
        load_asset_index,
        note_changed,
        prepare_keep_note_source,
        latest_records_by_path,
    )
    from scripts.google_keep_json_to_md import fetch_source_text
    from scripts.lancedb_local_api import post_json, resolve_lancedb_url
except ModuleNotFoundError:
    from cloudflare_bge_m3_embed import get_embeddings, resolve_config as resolve_embedding_config
    from google_keep_deep_asset_card_pipeline import (
        DEFAULT_PREPARE_WORKERS,
        KeepNoteSource,
        PipelineProgress,
        build_note_signature,
        collect_keep_note_sources,
        default_progress_path,
        filter_changed_notes,
        format_nbss_ref,
        load_asset_index,
        note_changed,
        prepare_keep_note_source,
        latest_records_by_path,
    )
    from google_keep_json_to_md import fetch_source_text
    from lancedb_local_api import post_json, resolve_lancedb_url


DEFAULT_RAW_TABLE = "google_keep_raw_md"
RAW_DOC_KIND = "raw_text"
GOOGLE_KEEP_SOURCE_TYPE = "google_keep"
MAX_EMBED_CHARS = 9000


def default_index_path(output_dir: Path | None, table: str) -> Path:
    base = output_dir if output_dir is not None else Path("var")
    return base / f".{table}.asset_index.json"


@dataclass
class RawMarkdownEntry:
    id: str
    note_title: str
    path: str
    keep_json_fid: str
    keep_md_fid: str
    keep_html_fid: str
    attachment_fids: list[str]
    created_at: str
    source_snapshot_fid: str
    markdown: str
    tags: list[str]


def _truncate_for_embedding(text: str, max_chars: int = MAX_EMBED_CHARS) -> tuple[str, bool]:
    source = text.strip()
    if len(source) <= max_chars:
        return source, False
    head = source[: max_chars // 2].rstrip()
    tail = source[-max_chars // 3 :].lstrip()
    return f"{head}\n\n[...TRUNCATED FOR EMBEDDING...]\n\n{tail}", True


def _extract_labels(raw_json: dict[str, Any]) -> list[str]:
    labels = []
    for item in (raw_json.get("labels") or []):
        if not isinstance(item, dict):
            continue
        value = str(item.get("name") or "").strip()
        if value:
            labels.append(value)
    deduped: list[str] = []
    seen: set[str] = set()
    for item in labels:
        key = item.casefold()
        if key in seen:
            continue
        seen.add(key)
        deduped.append(item)
    return deduped


def _build_metadata(entry: RawMarkdownEntry) -> dict[str, Any]:
    embedding_text, embedding_truncated = _truncate_for_embedding(entry.markdown)
    return {
        "doc_kind": RAW_DOC_KIND,
        "source_type": GOOGLE_KEEP_SOURCE_TYPE,
        "source_snapshot_fid": entry.source_snapshot_fid,
        "keep_json_fid": entry.keep_json_fid,
        "keep_md_fid": entry.keep_md_fid,
        "keep_html_fid": entry.keep_html_fid,
        "attachment_fids": entry.attachment_fids,
        "path_in_snapshot": entry.path,
        "note_title": entry.note_title,
        "created_at": entry.created_at,
        "tags": entry.tags,
        "category_path": "",
        "priority": "",
        "embedding_input_chars": len(embedding_text),
        "embedding_input_truncated": embedding_truncated,
    }


def _make_raw_id(path_in_snapshot: str) -> str:
    stem = Path(path_in_snapshot).stem
    return f"rawmd::{stem}"


def _existing_note_from_index(
    *,
    snapshot_source: str,
    latest_by_path: dict[str, dict[str, Any]],
    json_path: str,
    existing: dict[str, Any],
) -> KeepNoteSource | None:
    html_path = json_path[:-5] + ".html"
    if html_path not in latest_by_path:
        return None
    keep_json_fid = str(existing.get("keep_json_fid") or "").strip()
    keep_md_fid = str(existing.get("keep_md_fid") or "").strip()
    keep_html_fid = str(existing.get("keep_html_fid") or "").strip()
    if not (keep_json_fid and keep_md_fid and keep_html_fid):
        return None
    raw_json = json.loads(fetch_source_text(keep_json_fid))
    markdown = fetch_source_text(keep_md_fid)
    note_title = str(existing.get("note_title") or "").strip() or Path(json_path).stem
    created_at = str(existing.get("created_at") or "").strip()
    attachment_fids = [str(item).strip() for item in (existing.get("attachment_fids") or []) if str(item).strip()]
    return KeepNoteSource(
        card_id=_make_raw_id(json_path),
        path=json_path,
        note_title=note_title,
        json_fid=keep_json_fid.removeprefix("NBSS:"),
        html_fid=keep_html_fid.removeprefix("NBSS:"),
        attachment_fids=[item.removeprefix("NBSS:") for item in attachment_fids],
        created_at=created_at,
        raw_json=raw_json,
        markdown=markdown,
        markdown_fid=keep_md_fid.removeprefix("NBSS:"),
        snapshot_fid=snapshot_source,
    )


def collect_keep_markdown_sources(
    snapshot_source: str,
    *,
    existing_keep_index: dict[str, dict[str, Any]] | None = None,
    limit: int | None = None,
    prepare_workers: int = DEFAULT_PREPARE_WORKERS,
) -> list[KeepNoteSource]:
    latest_by_path, _ = latest_records_by_path(snapshot_source)
    snapshot_fid = snapshot_source if snapshot_source.startswith("NBSS:") else ""
    existing_keep_index = existing_keep_index or {}
    json_paths = sorted(path for path in latest_by_path if path.endswith(".json"))
    candidate_paths = json_paths[:limit] if limit is not None else json_paths

    reused: list[KeepNoteSource] = []
    to_prepare: list[str] = []
    for json_path in candidate_paths:
        existing = existing_keep_index.get(json_path)
        note = None
        if existing:
            note = _existing_note_from_index(
                snapshot_source=snapshot_fid,
                latest_by_path=latest_by_path,
                json_path=json_path,
                existing=existing,
            )
        if note is not None:
            reused.append(note)
        else:
            to_prepare.append(json_path)

    prepared: list[KeepNoteSource] = []
    with ThreadPoolExecutor(max_workers=max(1, prepare_workers)) as executor:
        futures = {
            executor.submit(
                prepare_keep_note_source,
                snapshot_fid=snapshot_fid,
                latest_by_path=latest_by_path,
                json_path=json_path,
            ): json_path
            for json_path in to_prepare
        }
        for future in as_completed(futures):
            note = future.result()
            if note is None:
                continue
            note.card_id = _make_raw_id(note.path)
            prepared.append(note)

    items = reused + prepared
    items.sort(key=lambda item: item.path)
    return items


def update_raw_index(
    *,
    index_path: Path,
    previous_index: dict[str, dict[str, Any]],
    note: KeepNoteSource,
) -> dict[str, dict[str, Any]]:
    updated = dict(previous_index)
    entry = build_note_signature(note)
    entry.update(
        {
            "doc_kind": RAW_DOC_KIND,
            "source_type": GOOGLE_KEEP_SOURCE_TYPE,
            "keep_md_fid": format_nbss_ref(note.markdown_fid),
            "tags": _extract_labels(note.raw_json),
            "updated_at": datetime.now(tz=UTC).isoformat(),
        }
    )
    updated[note.path] = entry
    index_path.parent.mkdir(parents=True, exist_ok=True)
    index_path.write_text(json.dumps(updated, ensure_ascii=False, indent=2, sort_keys=True), encoding="utf-8")
    return updated


def _embed_and_upsert_single(entry: RawMarkdownEntry, *, table: str) -> dict[str, Any]:
    account_id, token, model = resolve_embedding_config()
    embedding_text, _ = _truncate_for_embedding(entry.markdown)
    last_error: Exception | None = None
    for attempt in range(3):
        try:
            vector = get_embeddings([embedding_text], account_id=account_id, token=token, model=model)[0]
            response = post_json(
                f"{resolve_lancedb_url()}/upsert",
                {
                    "table": table,
                    "documents": [
                        {
                            "id": entry.id,
                            "text": entry.markdown,
                            "vector": vector,
                            "metadata": _build_metadata(entry),
                        }
                    ],
                },
            )
            break
        except Exception as exc:
            last_error = exc
            if attempt == 2:
                raise
            time.sleep(0.5 * (attempt + 1))
    if last_error is not None and "response" not in locals():
        raise last_error
    return {
        "id": entry.id,
        "rows_written": int(response.get("rows_written", 0)),
        "table": response.get("table", table),
    }


def run_pipeline(
    snapshot_source: str,
    *,
    table: str,
    limit: int | None,
    prepare_workers: int,
    embed_workers: int,
    output_dir: Path | None,
    incremental: bool,
    index_path: Path | None,
    progress_path: Path | None,
    existing_keep_index_path: Path | None,
) -> dict[str, Any]:
    existing_keep_index = load_asset_index(existing_keep_index_path) if existing_keep_index_path and existing_keep_index_path.exists() else {}
    notes = collect_keep_markdown_sources(
        snapshot_source,
        existing_keep_index=existing_keep_index,
        limit=limit,
        prepare_workers=prepare_workers,
    )
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

    raw_entries: list[RawMarkdownEntry] = []
    for note in notes_to_process:
        entry = RawMarkdownEntry(
            id=note.card_id,
            note_title=note.note_title,
            path=note.path,
            keep_json_fid=format_nbss_ref(note.json_fid),
            keep_md_fid=format_nbss_ref(note.markdown_fid),
            keep_html_fid=format_nbss_ref(note.html_fid),
            attachment_fids=[format_nbss_ref(fid) for fid in note.attachment_fids],
            created_at=note.created_at,
            source_snapshot_fid=note.snapshot_fid,
            markdown=note.markdown,
            tags=_extract_labels(note.raw_json),
        )
        raw_entries.append(entry)
        if output_dir is not None:
            output_dir.mkdir(parents=True, exist_ok=True)
            (output_dir / f"{entry.id}.md").write_text(entry.markdown, encoding="utf-8")
        progress.mark_generated(note)

    raw_entries.sort(key=lambda item: item.id)
    note_by_id = {note.card_id: note for note in notes_to_process}
    upserts: list[dict[str, Any]] = []
    with ThreadPoolExecutor(max_workers=max(1, embed_workers)) as executor:
        futures = {executor.submit(_embed_and_upsert_single, entry, table=table): entry for entry in raw_entries}
        for future in as_completed(futures):
            entry = futures[future]
            note = note_by_id[entry.id]
            try:
                result = future.result()
            except Exception as exc:
                progress.mark_failed(note, exc)
                raise
            upserts.append(result)
            previous_index = update_raw_index(index_path=resolved_index_path, previous_index=previous_index, note=note)
            progress.mark_upserted(note)

    upserts.sort(key=lambda item: item["id"])
    progress.mark_completed()
    return {
        "snapshot_source": snapshot_source,
        "table": table,
        "notes_processed": len(notes),
        "notes_selected_for_generation": len(notes_to_process),
        "notes_skipped_unchanged": skipped_unchanged,
        "rows_upserted": sum(item["rows_written"] for item in upserts),
        "documents_upserted": len(upserts),
        "incremental": incremental,
        "index_path": str(resolved_index_path),
        "progress_path": str(resolved_progress_path),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Ingest raw Google Keep markdown into LanceDB without altering the source markdown content.")
    parser.add_argument("snapshot_source", help="A notFinder snapshot source, typically NBSS:0x...")
    parser.add_argument("--table", default=DEFAULT_RAW_TABLE)
    parser.add_argument("--limit", type=int, default=None)
    parser.add_argument("--prepare-workers", type=int, default=DEFAULT_PREPARE_WORKERS)
    parser.add_argument("--embed-workers", type=int, default=16)
    parser.add_argument("--output-dir", default="var/google_keep_raw_md")
    parser.add_argument("--index-path", default="")
    parser.add_argument("--progress-path", default="")
    parser.add_argument("--existing-keep-index-path", default="var/google_keep_asset_cards_directmd_eval200/.google_keep_asset_cards_directmd_eval200.asset_index.json")
    parser.add_argument("--full-refresh", action="store_true", help="Disable incremental filtering and re-embed all selected notes.")
    args = parser.parse_args()

    result = run_pipeline(
        args.snapshot_source,
        table=args.table,
        limit=args.limit,
        prepare_workers=args.prepare_workers,
        embed_workers=args.embed_workers,
        output_dir=Path(args.output_dir) if args.output_dir else None,
        incremental=not args.full_refresh,
        index_path=Path(args.index_path) if args.index_path else None,
        progress_path=Path(args.progress_path) if args.progress_path else None,
        existing_keep_index_path=Path(args.existing_keep_index_path) if args.existing_keep_index_path else None,
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
