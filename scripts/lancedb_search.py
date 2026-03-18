#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sys

try:
    from scripts.lancedb_local_api import post_json, resolve_lancedb_url
except ModuleNotFoundError:
    from lancedb_local_api import post_json, resolve_lancedb_url


def main() -> int:
    parser = argparse.ArgumentParser(description="Search the local LanceDB service with a query vector.")
    parser.add_argument("--table", default="documents")
    parser.add_argument("--query-vector-json", required=True, help="JSON array of floats.")
    parser.add_argument("--limit", type=int, default=5)
    args = parser.parse_args()

    try:
        query_vector = json.loads(args.query_vector_json)
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Invalid --query-vector-json: {exc}") from exc
    if not isinstance(query_vector, list) or not query_vector:
        raise SystemExit("--query-vector-json must be a non-empty JSON array.")

    payload = {
        "table": args.table,
        "query_vector": query_vector,
        "limit": args.limit,
    }
    response = post_json(f"{resolve_lancedb_url()}/search", payload)
    json.dump(response, sys.stdout, ensure_ascii=False)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
