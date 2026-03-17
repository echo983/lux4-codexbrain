from __future__ import annotations

import io
import json
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest import mock

from lux4_daemon.config import Config
from lux4_daemon.system_tasks import SystemTaskBatchResult
from scripts import run_cron_memory_consolidation, run_cron_memory_extraction


class CronScriptTests(unittest.TestCase):
    def test_extraction_script_prints_skip_payload(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            fake_result = SystemTaskBatchResult(
                task_type="memory_extraction",
                processed_sessions=0,
                skipped=True,
                reason="no session activity in the last 10 minutes",
                runs=[],
                batch_log_path="var/system_task_logs/batch-extract.log",
            )
            stdout = io.StringIO()
            with mock.patch.object(run_cron_memory_extraction.Config, "from_env", return_value=Config(database_path=str(Path(tmpdir) / "db.sqlite3"))):
                with mock.patch.object(run_cron_memory_extraction, "SessionStore"):
                    with mock.patch.object(run_cron_memory_extraction, "CodexExecClient"):
                        with mock.patch.object(run_cron_memory_extraction, "SystemTaskRunner") as runner_cls:
                            runner_cls.return_value.run_memory_extraction.return_value = fake_result
                            with mock.patch("sys.argv", ["run_cron_memory_extraction.py"]):
                                with redirect_stdout(stdout):
                                    exit_code = run_cron_memory_extraction.main()
            self.assertEqual(exit_code, 0)
            payload = json.loads(stdout.getvalue())
            self.assertTrue(payload["skipped"])
            self.assertEqual(payload["task_type"], "memory_extraction")
            self.assertEqual(payload["batch_log_path"], "var/system_task_logs/batch-extract.log")

    def test_consolidation_script_prints_run_payload(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            fake_run = mock.Mock(task_run_id="run-1", session_key="session-1", status="succeeded", log_path="var/system_task_logs/a.log")
            fake_result = SystemTaskBatchResult(
                task_type="memory_consolidation",
                processed_sessions=1,
                skipped=False,
                reason="processed sessions with recent memory extraction activity",
                runs=[fake_run],
                batch_log_path="var/system_task_logs/batch-consolidate.log",
            )
            stdout = io.StringIO()
            with mock.patch.object(run_cron_memory_consolidation.Config, "from_env", return_value=Config(database_path=str(Path(tmpdir) / "db.sqlite3"))):
                with mock.patch.object(run_cron_memory_consolidation, "SessionStore"):
                    with mock.patch.object(run_cron_memory_consolidation, "CodexExecClient"):
                        with mock.patch.object(run_cron_memory_consolidation, "SystemTaskRunner") as runner_cls:
                            runner_cls.return_value.run_memory_consolidation.return_value = fake_result
                            with mock.patch("sys.argv", ["run_cron_memory_consolidation.py"]):
                                with redirect_stdout(stdout):
                                    exit_code = run_cron_memory_consolidation.main()
            self.assertEqual(exit_code, 0)
            payload = json.loads(stdout.getvalue())
            self.assertFalse(payload["skipped"])
            self.assertEqual(payload["processed_sessions"], 1)
            self.assertEqual(payload["batch_log_path"], "var/system_task_logs/batch-consolidate.log")
            self.assertEqual(payload["runs"][0]["task_run_id"], "run-1")


if __name__ == "__main__":
    unittest.main()
