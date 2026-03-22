#!/usr/bin/env python3
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent


def main() -> int:
    cmd = [
        sys.executable,
        str(REPO_ROOT / "scripts" / "build_moreway_planet_dataset.py"),
    ]
    completed = subprocess.run(
        cmd,
        cwd=REPO_ROOT,
        text=True,
        capture_output=True,
        check=False,
    )
    if completed.stdout:
        print(completed.stdout.strip())
    if completed.returncode != 0:
        if completed.stderr:
            print(completed.stderr.strip(), file=sys.stderr)
        return completed.returncode
    try:
        parsed = json.loads(completed.stdout)
    except json.JSONDecodeError:
        return 0
    print(
        json.dumps(
            {
                "task": "moreway_planet_build",
                "status": parsed.get("status"),
                "build_id": parsed.get("build_id") or parsed.get("latest_build_id"),
                "document_count": parsed.get("document_count"),
                "chunk_count": parsed.get("chunk_count"),
            },
            ensure_ascii=False,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
