#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent


def main() -> int:
    parser = argparse.ArgumentParser(description="Unified entrypoint for refreshing the Moreway Planet dataset and baked textures.")
    parser.add_argument("--tables", default="", help="Comma-separated LanceDB table names.")
    parser.add_argument("--force", action="store_true", help="Force dataset rebuild even if the source signature did not change.")
    args = parser.parse_args()

    cmd = [sys.executable, str(REPO_ROOT / "scripts" / "build_moreway_planet_dataset.py")]
    if args.tables.strip():
      cmd.extend(["--tables", args.tables.strip()])
    if args.force:
      cmd.append("--force")

    completed = subprocess.run(
        cmd,
        cwd=REPO_ROOT,
        text=True,
        capture_output=True,
        check=False,
    )
    if completed.returncode != 0:
        if completed.stdout:
            print(completed.stdout.strip())
        if completed.stderr:
            print(completed.stderr.strip(), file=sys.stderr)
        return completed.returncode

    parsed = json.loads(completed.stdout)
    latest_path = REPO_ROOT / "var" / "moreway_planet_dataset" / "latest.json"
    latest = json.loads(latest_path.read_text(encoding="utf-8")) if latest_path.exists() else {}
    manifest_path = REPO_ROOT / "var" / "moreway_planet_dataset" / latest.get("manifest_path", "")
    baked = {}
    if manifest_path.exists():
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        baked = dict(manifest.get("planet", {}).get("baked_textures") or {})

    output = {
        "task": "moreway_planet_refresh",
        "status": parsed.get("status"),
        "reason": parsed.get("reason"),
        "build_id": parsed.get("build_id") or parsed.get("latest_build_id"),
        "source_tables": parsed.get("source_tables") or latest.get("source_tables"),
        "source_signature": parsed.get("source_signature") or latest.get("source_signature"),
        "document_count": parsed.get("document_count") or latest.get("document_count"),
        "chunk_count": parsed.get("chunk_count") or latest.get("chunk_count"),
        "baked_textures": baked,
    }
    print(json.dumps(output, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
