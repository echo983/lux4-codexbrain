#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from lux4_daemon.codex_mcp import CodexExecClient
from lux4_daemon.config import Config
from lux4_daemon.session_store import SessionStore
from lux4_daemon.system_tasks import SystemTaskRunner


def main() -> int:
    parser = argparse.ArgumentParser(description="Run the 4-hour memory consolidation cron task.")
    parser.add_argument("--window-hours", type=int, default=4)
    parser.add_argument("--log-dir", default="var/system_task_logs")
    args = parser.parse_args()

    config = Config.from_env()
    store = SessionStore(config.database_path)
    client = CodexExecClient(config)
    runner = SystemTaskRunner(store, client, log_dir=args.log_dir)
    try:
        result = runner.run_memory_consolidation(window_hours=args.window_hours)
    finally:
        client.close()
    json.dump(
        {
            "task_type": result.task_type,
            "processed_sessions": result.processed_sessions,
            "skipped": result.skipped,
            "reason": result.reason,
            "batch_log_path": result.batch_log_path,
            "runs": [
                {
                    "task_run_id": run.task_run_id,
                    "session_key": run.session_key,
                    "status": run.status,
                    "log_path": run.log_path,
                }
                for run in result.runs
            ],
        },
        sys.stdout,
        ensure_ascii=False,
        indent=2,
    )
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
