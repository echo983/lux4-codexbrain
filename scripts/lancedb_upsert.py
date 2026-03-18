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
    parser = argparse.ArgumentParser(description="Upsert a single document into the local LanceDB service.")
    parser.add_argument("--table", default="documents")
    parser.add_argument("--id", required=True)
    parser.add_argument("--text", required=True)
    parser.add_argument("--vector-json", required=True, help="JSON array of floats.")
    parser.add_argument("--metadata-json", default="{}", help="Optional JSON object.")
    args = parser.parse_args()

    try:
        vector = json.loads(args.vector_json)
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Invalid --vector-json: {exc}") from exc
    if not isinstance(vector, list) or not vector:
        raise SystemExit("--vector-json must be a non-empty JSON array.")

    try:
        metadata = json.loads(args.metadata_json)
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Invalid --metadata-json: {exc}") from exc
    if not isinstance(metadata, dict):
        raise SystemExit("--metadata-json must be a JSON object.")

    payload = {
        "table": args.table,
        "documents": [
            {
                "id": args.id,
                "text": args.text,
                "vector": vector,
                "metadata": metadata,
            }
        ],
    }
    response = post_json(f"{resolve_lancedb_url()}/upsert", payload)
    json.dump(response, sys.stdout, ensure_ascii=False)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
