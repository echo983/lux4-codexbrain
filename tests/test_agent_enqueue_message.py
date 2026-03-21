import os
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from scripts import agent_enqueue_message
from lux4_daemon.session_store import SessionStore


class AgentEnqueueMessageTests(unittest.TestCase):
    def test_enqueue_message_writes_pending_outbox_row(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            db_path = Path(tmpdir) / "daemon.sqlite3"
            store = SessionStore(str(db_path))
            store.get_or_create_session(_incoming())

            env = {
                "LUX4_AGENT_DB_PATH": str(db_path),
                "LUX4_AGENT_SESSION_KEY": "rocketchat::https://rocket.example.com::room-1::user-1",
                "LUX4_AGENT_SOURCE": "rocketchat",
                "LUX4_AGENT_SITE_URL": "https://rocket.example.com",
                "LUX4_AGENT_ROOM_ID": "room-1",
                "LUX4_AGENT_SENDER_USER_ID": "user-1",
                "LUX4_AGENT_SENDER_USERNAME": "alice",
                "LUX4_AGENT_TRIGGER_MESSAGE_ID": "msg-1",
            }

            with mock.patch.dict(os.environ, env, clear=False):
                payload = agent_enqueue_message.enqueue_message("hello from tool", env)

            self.assertEqual(payload["status"], "pending")
            pending = store.get_pending_outbox_messages(env["LUX4_AGENT_SESSION_KEY"])
            self.assertEqual(len(pending), 1)
            self.assertEqual(pending[0].text, "hello from tool")

    def test_require_context_supports_context_file(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            context_path = Path(tmpdir) / "agent-context.json"
            context_path.write_text(
                """
{
  "LUX4_AGENT_DB_PATH": "/tmp/daemon.sqlite3",
  "LUX4_AGENT_SESSION_KEY": "session-1",
  "LUX4_AGENT_SOURCE": "rocketchat",
  "LUX4_AGENT_SITE_URL": "https://rocket.example.com",
  "LUX4_AGENT_ROOM_ID": "room-1",
  "LUX4_AGENT_SENDER_USER_ID": "user-1",
  "LUX4_AGENT_SENDER_USERNAME": "alice",
  "LUX4_AGENT_TRIGGER_MESSAGE_ID": "msg-1"
}
                """.strip(),
                encoding="utf-8",
            )
            with mock.patch.dict(
                os.environ,
                {agent_enqueue_message.CONTEXT_FILE_ENV_KEY: str(context_path)},
                clear=False,
            ):
                context = agent_enqueue_message.require_context()

        self.assertEqual(context["LUX4_AGENT_SESSION_KEY"], "session-1")
        self.assertEqual(context["LUX4_AGENT_ROOM_ID"], "room-1")


def _incoming():
    from lux4_daemon.normalize import normalize_incoming_message

    normalized = normalize_incoming_message({
        "version": 1,
        "kind": "incoming_message",
        "source": "rocketchat",
        "siteUrl": "https://rocket.example.com",
        "roomId": "room-1",
        "senderUsername": "alice",
        "senderUserId": "user-1",
        "messageId": "msg-1",
        "text": "hello",
        "receivedAt": "2026-03-17T12:00:00Z",
    })
    assert normalized is not None
    return normalized


if __name__ == "__main__":
    unittest.main()
