#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

try:
    from scripts.lancedb_rerank_search import search_with_rerank
except ModuleNotFoundError:
    from lancedb_rerank_search import search_with_rerank


DEFAULT_TABLE = "google_keep_asset_cards"


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Search Google Keep Deep Asset Cards from LanceDB with embedding + reranking."
    )
    parser.add_argument("query", help="Natural-language retrieval query")
    parser.add_argument("--table", default=DEFAULT_TABLE)
    parser.add_argument("--vector-limit", type=int, default=12)
    parser.add_argument("--limit", type=int, default=5)
    parser.add_argument("--output", default="", help="Optional path to write JSON output")
    args = parser.parse_args()

    result = search_with_rerank(
        args.query,
        table=args.table,
        vector_limit=args.vector_limit,
        rerank_top_k=args.limit,
    )
    text = json.dumps(result, ensure_ascii=False, indent=2)
    if args.output:
        Path(args.output).write_text(text, encoding="utf-8")
    print(text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
