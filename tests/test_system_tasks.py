from __future__ import annotations

import tempfile
import unittest
from datetime import UTC, datetime, timedelta
from pathlib import Path
from unittest import mock

from lux4_daemon.codex_mcp import CodexExecError, CodexTurnResult
from lux4_daemon.session_store import SessionStore
from lux4_daemon.system_tasks import SystemTaskRunner


class SessionStoreRecentActivityTests(unittest.TestCase):
    def test_recent_activity_and_task_runs(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            store = SessionStore(str(Path(tmpdir) / "daemon.sqlite3"))
            message = _build_incoming_message()
            session = store.get_or_create_session(message)

            active = store.get_recently_active_sessions(since=datetime.now(UTC) - timedelta(minutes=10))
            self.assertEqual([item.session_key for item in active], [session.session_key])

            run = store.record_system_task_run(
                task_type="memory_extraction",
                session_key=session.session_key,
                window_started_at="2026-03-17T20:00:00+00:00",
                window_ended_at="2026-03-17T20:10:00+00:00",
                started_at=datetime.now(UTC).isoformat(),
                completed_at=datetime.now(UTC).isoformat(),
                status="succeeded",
                codex_session_id="thread-123",
                log_path="var/system_task_logs/example.log",
                summary="stored one fact",
            )
            recent_runs = store.get_recent_system_task_runs(
                task_type="memory_extraction",
                since=datetime.now(UTC) - timedelta(hours=1),
                status="succeeded",
            )
            self.assertEqual([item.task_run_id for item in recent_runs], [run.task_run_id])

    def test_system_task_lock_excludes_parallel_run_and_allows_release(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            store = SessionStore(str(Path(tmpdir) / "daemon.sqlite3"))
            expires_at = (datetime.now(UTC) + timedelta(minutes=5)).isoformat()

            acquired = store.acquire_system_task_lock(
                task_type="memory_extraction",
                owner_id="owner-1",
                expires_at=expires_at,
            )
            blocked = store.acquire_system_task_lock(
                task_type="memory_extraction",
                owner_id="owner-2",
                expires_at=expires_at,
            )
            lock = store.get_system_task_lock("memory_extraction")

            self.assertTrue(acquired)
            self.assertFalse(blocked)
            self.assertIsNotNone(lock)
            self.assertEqual(lock.owner_id, "owner-1")

            store.release_system_task_lock(task_type="memory_extraction", owner_id="owner-1")

            reacquired = store.acquire_system_task_lock(
                task_type="memory_extraction",
                owner_id="owner-2",
                expires_at=expires_at,
            )
            self.assertTrue(reacquired)

    def test_recent_messages_filters_by_time_window(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            store = SessionStore(str(Path(tmpdir) / "daemon.sqlite3"))
            old_message = _build_incoming_message(message_id="old-msg", text="old", received_at="2026-03-17T19:00:00+00:00")
            store.get_or_create_session(old_message)
            new_message = _build_incoming_message(message_id="new-msg", text="new", received_at="2026-03-17T20:00:00+00:00")
            store.get_or_create_session(new_message)

            messages = store.get_recent_messages(
                new_message.session_key,
                since=datetime.fromisoformat("2026-03-17T19:30:00+00:00"),
            )

            self.assertEqual(len(messages), 1)
            self.assertEqual(messages[0]["message_id"], "new-msg")


class SystemTaskRunnerTests(unittest.TestCase):
    def test_memory_extraction_skips_when_no_recent_activity(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            store = SessionStore(str(Path(tmpdir) / "daemon.sqlite3"))
            runner = SystemTaskRunner(store, mock.Mock(), log_dir=str(Path(tmpdir) / "logs"))

            result = runner.run_memory_extraction(window_minutes=10)

            self.assertTrue(result.skipped)
            self.assertEqual(result.processed_sessions, 0)
            self.assertTrue(Path(result.batch_log_path).exists())
            self.assertIn("no session activity", Path(result.batch_log_path).read_text(encoding="utf-8"))

    def test_memory_extraction_runs_for_active_session(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            store = SessionStore(str(Path(tmpdir) / "daemon.sqlite3"))
            message = _build_incoming_message()
            store.record_reply(message, "I know your preferred name is Edwin.")
            session = store.get_or_create_session(message)
            client = mock.Mock()
            client.run_turn.return_value = CodexTurnResult(
                session_id="thread-123",
                reply_text="## Actions\nstored one fact",
            )
            runner = SystemTaskRunner(store, client, log_dir=str(Path(tmpdir) / "logs"))

            result = runner.run_memory_extraction(window_minutes=10)

            self.assertFalse(result.skipped)
            self.assertEqual(result.processed_sessions, 1)
            self.assertEqual(len(result.runs), 1)
            self.assertEqual(result.runs[0].status, "succeeded")
            self.assertTrue(Path(result.batch_log_path).exists())
            prompt = client.run_turn.call_args.args[0]
            self.assertIn("System framework command. This is not user speech.", prompt)
            self.assertIn("Task: memory_extraction", prompt)
            self.assertIn("Recent conversation transcript:", prompt)
            self.assertIn("incoming msg-1: hello", prompt)
            self.assertIn("reply reply::msg-1: I know your preferred name is Edwin.", prompt)
            self.assertEqual(client.run_turn.call_args.kwargs["session_id"], session.active_codex_session_id)
            self.assertTrue(Path(result.runs[0].log_path).exists())
            log_text = Path(result.runs[0].log_path).read_text(encoding="utf-8")
            self.assertIn("prompt:", log_text)
            self.assertIn("Task: memory_extraction", log_text)
            self.assertIn("context:", log_text)
            self.assertIn("LUX4_AGENT_ROOM_ID=room-1", log_text)
            persisted_runs = store.get_recent_system_task_runs(
                task_type="memory_extraction",
                since=datetime.now(UTC) - timedelta(hours=1),
                status="succeeded",
            )
            self.assertEqual(len(persisted_runs), 1)

    def test_memory_consolidation_skips_without_recent_extraction(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            store = SessionStore(str(Path(tmpdir) / "daemon.sqlite3"))
            runner = SystemTaskRunner(store, mock.Mock(), log_dir=str(Path(tmpdir) / "logs"))

            result = runner.run_memory_consolidation(window_hours=4)

            self.assertTrue(result.skipped)
            self.assertEqual(result.processed_sessions, 0)
            self.assertTrue(Path(result.batch_log_path).exists())

    def test_memory_consolidation_runs_and_injects_insight(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            store = SessionStore(str(Path(tmpdir) / "daemon.sqlite3"))
            message = _build_incoming_message()
            session = store.get_or_create_session(message)
            now = datetime.now(UTC)
            store.record_system_task_run(
                task_type="memory_extraction",
                session_key=session.session_key,
                window_started_at=(now - timedelta(minutes=10)).isoformat(),
                window_ended_at=now.isoformat(),
                started_at=now.isoformat(),
                completed_at=now.isoformat(),
                status="succeeded",
                codex_session_id=session.active_codex_session_id,
                log_path=str(Path(tmpdir) / "logs" / "extract.log"),
                summary="stored one fact",
            )
            client = mock.Mock()
            client.run_turn.side_effect = [
                CodexTurnResult(
                    session_id="thread-123",
                    reply_text="## Actions\nconsolidated\n\n## Insight For Session\nThe user has stable biographical memory and prefers direct answers.",
                ),
                CodexTurnResult(
                    session_id="thread-123",
                    reply_text="",
                ),
            ]
            runner = SystemTaskRunner(store, client, log_dir=str(Path(tmpdir) / "logs"))

            result = runner.run_memory_consolidation(window_hours=4)

            self.assertFalse(result.skipped)
            self.assertEqual(result.processed_sessions, 1)
            self.assertEqual(len(result.runs), 2)
            self.assertTrue(Path(result.batch_log_path).exists())
            self.assertEqual(result.runs[0].task_type, "memory_consolidation")
            self.assertEqual(result.runs[1].task_type, "memory_insight_injection")
            consolidation_prompt = client.run_turn.call_args_list[0].args[0]
            injection_prompt = client.run_turn.call_args_list[1].args[0]
            self.assertIn("Task: memory_consolidation_sleep", consolidation_prompt)
            self.assertIn("Task: memory_insight_injection", injection_prompt)
            self.assertIn("The user has stable biographical memory", injection_prompt)

    def test_failed_memory_extraction_is_recorded(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            store = SessionStore(str(Path(tmpdir) / "daemon.sqlite3"))
            store.get_or_create_session(_build_incoming_message())
            client = mock.Mock()
            client.run_turn.side_effect = CodexExecError("boom")
            runner = SystemTaskRunner(store, client, log_dir=str(Path(tmpdir) / "logs"))

            result = runner.run_memory_extraction(window_minutes=10)

            self.assertFalse(result.skipped)
            self.assertEqual(result.runs[0].status, "failed")
            self.assertIn("boom", result.runs[0].error_detail)

    def test_memory_extraction_skips_when_same_task_is_already_running(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            store = SessionStore(str(Path(tmpdir) / "daemon.sqlite3"))
            store.acquire_system_task_lock(
                task_type="memory_extraction",
                owner_id="existing-owner",
                expires_at=(datetime.now(UTC) + timedelta(minutes=5)).isoformat(),
            )
            runner = SystemTaskRunner(store, mock.Mock(), log_dir=str(Path(tmpdir) / "logs"))

            result = runner.run_memory_extraction(window_minutes=10)

            self.assertTrue(result.skipped)
            self.assertIn("already in progress", result.reason)
            self.assertEqual(result.processed_sessions, 0)
            self.assertEqual(result.runs, [])


def _build_incoming_message(message_id: str = "msg-1", text: str = "hello", received_at: str | None = None):
    from lux4_daemon.normalize import normalize_incoming_message

    normalized = normalize_incoming_message({
        "version": 1,
        "kind": "incoming_message",
        "source": "rocketchat",
        "siteUrl": "https://rocket.example.com",
        "roomId": "room-1",
        "senderUsername": "alice",
        "senderUserId": "user-1",
        "messageId": message_id,
        "text": text,
        "receivedAt": received_at or datetime.now(UTC).isoformat(),
    })
    assert normalized is not None
    return normalized


if __name__ == "__main__":
    unittest.main()
