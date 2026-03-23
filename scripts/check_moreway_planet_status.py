#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path
from urllib import error, request

REPO_ROOT = Path(__file__).resolve().parent.parent
DATASET_ROOT = REPO_ROOT / "var" / "moreway_planet_dataset"


def http_ok(url: str) -> bool:
    try:
        req = request.Request(url, method="HEAD")
        with request.urlopen(req, timeout=5) as response:
            return 200 <= getattr(response, "status", 200) < 400
    except error.URLError:
        return False


def main() -> int:
    parser = argparse.ArgumentParser(description="Report the current health and artifact completeness of Moreway Planet.")
    parser.add_argument("--base-url", default="http://127.0.0.1:18571", help="Planet web frontend base URL for lightweight resource checks.")
    args = parser.parse_args()

    latest_path = DATASET_ROOT / "latest.json"
    if not latest_path.exists():
        print(json.dumps({"task": "check_moreway_planet_status", "status": "missing", "reason": "latest.json not found"}, ensure_ascii=False, indent=2))
        return 1

    latest = json.loads(latest_path.read_text(encoding="utf-8"))
    manifest_path = DATASET_ROOT / latest["manifest_path"]
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    baked = dict(manifest.get("planet", {}).get("baked_textures") or {})
    textures = {}
    for key, relative in baked.items():
        texture_path = DATASET_ROOT / relative
        textures[key] = {
            "relative_path": relative,
            "exists": texture_path.exists(),
            "size_bytes": texture_path.stat().st_size if texture_path.exists() else 0,
            "http_ok": http_ok(f"{args.base_url}/var/moreway_planet_dataset/{relative}"),
        }

    output = {
        "task": "check_moreway_planet_status",
        "status": "ok",
        "build_id": latest.get("build_id"),
        "generated_at": latest.get("generated_at"),
        "source_tables": latest.get("source_tables"),
        "source_signature": latest.get("source_signature"),
        "document_count": latest.get("document_count"),
        "chunk_count": latest.get("chunk_count"),
        "manifest_exists": manifest_path.exists(),
        "surface_map_present": bool(manifest.get("planet", {}).get("surface_map")),
        "baked_textures": textures,
        "frontend_latest_json_ok": http_ok(f"{args.base_url}/var/moreway_planet_dataset/latest.json"),
    }
    print(json.dumps(output, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
