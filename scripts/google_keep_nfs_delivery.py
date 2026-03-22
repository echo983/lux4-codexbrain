#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import re
from datetime import UTC, datetime
from pathlib import Path
from typing import Any
from urllib import error, request

try:
    from scripts.build_notfinder_snapshot_static_site import (
        build_snapshot_static_site,
        nbss_put_bytes,
        resolve_nbss_server_endpoint,
    )
    from scripts.lancedb_local_api import resolve_lancedb_url
    from scripts.lancedb_rerank_search import search_with_rerank
except ModuleNotFoundError:
    from build_notfinder_snapshot_static_site import (
        build_snapshot_static_site,
        nbss_put_bytes,
        resolve_nbss_server_endpoint,
    )
    from lancedb_local_api import resolve_lancedb_url
    from lancedb_rerank_search import search_with_rerank


DEFAULT_TABLE_CANDIDATES = (
    "google_keep_asset_cards",
    "google_keep_asset_cards_directmd_eval200",
    "google_keep_asset_cards_eval100",
    "google_keep_asset_cards_smoke",
)


def fetch_lancedb_tables() -> list[str]:
    url = f"{resolve_lancedb_url().rstrip('/')}/tables"
    req = request.Request(url, method="GET")
    try:
        with request.urlopen(req, timeout=15) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except (error.HTTPError, error.URLError, json.JSONDecodeError):
        return []
    tables = payload.get("tables", [])
    return [str(item) for item in tables if isinstance(item, str)]


def resolve_default_table(explicit_table: str | None = None) -> str:
    if explicit_table and explicit_table.strip():
        return explicit_table.strip()
    env_table = os.getenv("LUX4_KEEP_CARD_TABLE", "").strip()
    if env_table:
        return env_table
    existing = set(fetch_lancedb_tables())
    for candidate in DEFAULT_TABLE_CANDIDATES:
        if candidate in existing:
            return candidate
    return DEFAULT_TABLE_CANDIDATES[0]


def fetch_nbss_size(fid: str, *, server_endpoint: str) -> int:
    clean = fid[5:] if fid.startswith("NBSS:") else fid
    req = request.Request(f"{server_endpoint.rstrip('/')}/nbss/{clean}", method="HEAD")
    with request.urlopen(req, timeout=30) as response:
        return int(response.headers.get("Content-Length") or "0")


def strip_wrapping_quotes(value: str) -> str:
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
        return value[1:-1]
    return value


def sanitize_filename(name: str) -> str:
    cleaned = re.sub(r'[\\/:*?"<>|]+', "_", name).strip()
    cleaned = cleaned.strip(".")
    return cleaned or "untitled"


def select_results(
    query: str,
    *,
    table: str,
    vector_limit: int,
    limit: int,
) -> dict[str, Any]:
    return search_with_rerank(
        query,
        table=resolve_default_table(table),
        vector_limit=vector_limit,
        rerank_top_k=limit,
    )


def build_delivery_snapshot(
    *,
    query: str,
    table: str,
    limit: int,
    vector_limit: int,
    folder_name: str | None = None,
) -> dict[str, Any]:
    server_endpoint = resolve_nbss_server_endpoint()
    search_result = select_results(
        query,
        table=table,
        vector_limit=vector_limit,
        limit=limit,
    )
    results = search_result.get("results", [])
    if not results:
        raise RuntimeError("No retrieval results found for the requested query.")

    now_ms = int(datetime.now(tz=UTC).timestamp() * 1000)
    folder = sanitize_filename(folder_name or query)[:80]
    files: list[tuple[str, str, int, dict[str, Any]]] = []

    for item in results:
        metadata = dict(item.get("metadata") or {})
        keep_md_fid = str(metadata.get("keep_md_fid") or "").strip()
        if not keep_md_fid:
            continue
        note_title = strip_wrapping_quotes(str(metadata.get("note_title") or "").strip())
        path_in_snapshot = strip_wrapping_quotes(str(metadata.get("path_in_snapshot") or "").strip())
        file_name_base = sanitize_filename(note_title or Path(path_in_snapshot).stem or item.get("id") or "note")
        file_path = f"{folder}/{file_name_base}.md"
        file_size = fetch_nbss_size(keep_md_fid, server_endpoint=server_endpoint)
        files.append((file_path, keep_md_fid, file_size, metadata))

    if not files:
        raise RuntimeError("Retrieval results did not contain any keep_md_fid values.")

    lines = [
        f"endpoint: {server_endpoint}",
        f"internal_name: {query} - nfs打包交付",
        "version: 2",
        "head_fid: 0x0000000000000000",
        f"exported_at_ms: {now_ms}",
        "columns: pid\tvid\tprev\tfid\tsize\tmode\tts",
        "paths:",
    ]
    for idx, (file_path, _, _, _) in enumerate(files, start=1):
        lines.append(f"{idx}\t{file_path}")
    for idx, (_, fid, size, _) in enumerate(files, start=1):
        clean = fid[5:] if fid.startswith("NBSS:") else fid
        lines.append(f"{idx}\t1\t-\t0x{clean.replace('0x', '').upper()}\t{size}\t0\t{now_ms}")

    manifest = "\n".join(lines) + "\n"
    manifest_put = nbss_put_bytes(
        manifest.encode("utf-8"),
        server_endpoint=server_endpoint,
        content_type="text/plain; charset=utf-8",
    )
    snapshot_source = f"NBSS:{manifest_put['fid']}"
    site = build_snapshot_static_site(snapshot_source, server_endpoint=server_endpoint)

    delivered_notes = []
    for file_path, fid, size, metadata in files:
        delivered_notes.append(
            {
                "file_path": file_path,
                "keep_md_fid": fid,
                "size": size,
                "note_title": strip_wrapping_quotes(str(metadata.get("note_title") or "")),
                "path_in_snapshot": strip_wrapping_quotes(str(metadata.get("path_in_snapshot") or "")),
                "keep_json_fid": str(metadata.get("keep_json_fid") or ""),
            }
        )

    return {
        "query": query,
        "table": table,
        "requested_limit": limit,
        "selected_count": len(delivered_notes),
        "snapshot_source": snapshot_source,
        "site_fid": site["site_fid"],
        "site_url": site["site_url"],
        "nbss_server_endpoint": server_endpoint,
        "delivered_notes": delivered_notes,
        "retrieval": {
            "vector_limit": vector_limit,
            "result_count": len(results),
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Retrieve Google Keep notes by topic and nfs-package-deliver them as a browsable notFinder snapshot site."
    )
    parser.add_argument("query", help="Natural-language retrieval query")
    parser.add_argument("--table", default="")
    parser.add_argument("--vector-limit", type=int, default=20)
    parser.add_argument("--limit", type=int, default=3)
    parser.add_argument("--folder-name", default="", help="Optional folder name inside the delivered snapshot")
    parser.add_argument("--output", default="", help="Optional path to write JSON output")
    args = parser.parse_args()

    result = build_delivery_snapshot(
        query=args.query,
        table=resolve_default_table(args.table),
        limit=args.limit,
        vector_limit=args.vector_limit,
        folder_name=args.folder_name or None,
    )
    text = json.dumps(result, ensure_ascii=False, indent=2)
    if args.output:
        Path(args.output).write_text(text, encoding="utf-8")
    print(text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
