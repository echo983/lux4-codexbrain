#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

try:
    from scripts.lancedb_rerank_search import search_with_rerank
except ModuleNotFoundError:
    from lancedb_rerank_search import search_with_rerank


DEFAULT_TABLE = "google_keep_asset_cards"
DEFAULT_TABLE_CANDIDATES = (
    "google_keep_asset_cards_directmd_eval200",
    "google_keep_asset_cards",
    "google_keep_asset_cards_eval100",
    "google_keep_asset_cards_smoke",
)


def _dedupe_and_normalize_results(results: list[dict[str, Any]]) -> list[dict[str, Any]]:
    normalized: list[dict[str, Any]] = []
    seen: set[tuple[str | None, str | None, str | None]] = set()
    for item in results:
        metadata = dict(item.get("metadata") or {})
        dedupe_key = (
            item.get("id"),
            metadata.get("keep_md_fid"),
            metadata.get("path_in_snapshot"),
        )
        if dedupe_key in seen:
            continue
        seen.add(dedupe_key)

        normalized_item = dict(item)
        normalized_item["metadata"] = metadata
        normalized_item["title"] = metadata.get("note_title")
        normalized_item["path_in_snapshot"] = metadata.get("path_in_snapshot")
        normalized_item["keep_md_fid"] = metadata.get("keep_md_fid")
        normalized_item["keep_json_fid"] = metadata.get("keep_json_fid")
        normalized_item["keep_html_fid"] = metadata.get("keep_html_fid")
        normalized_item["source_type"] = metadata.get("source_type")
        normalized.append(normalized_item)
    return normalized


def resolve_default_table(explicit_table: str | None = None) -> str:
    if explicit_table and explicit_table.strip():
        return explicit_table.strip()
    for candidate in DEFAULT_TABLE_CANDIDATES:
        if (Path("/opt/lancedb/data") / f"{candidate}.lance").exists():
            return candidate
    return DEFAULT_TABLE_CANDIDATES[0]


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Search Google Keep Deep Asset Cards from LanceDB with embedding + reranking."
    )
    parser.add_argument("query", help="Natural-language retrieval query")
    parser.add_argument("--table", default="")
    parser.add_argument("--vector-limit", type=int, default=12)
    parser.add_argument("--limit", type=int, default=5)
    parser.add_argument("--output", default="", help="Optional path to write JSON output")
    args = parser.parse_args()

    result = search_with_rerank(
        args.query,
        table=resolve_default_table(args.table),
        vector_limit=args.vector_limit,
        rerank_top_k=args.limit,
    )
    result = dict(result)
    result["results"] = _dedupe_and_normalize_results(list(result.get("results") or []))
    result["rerank_count"] = len(result["results"])
    text = json.dumps(result, ensure_ascii=False, indent=2)
    if args.output:
        Path(args.output).write_text(text, encoding="utf-8")
    print(text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
