from __future__ import annotations

from io import BytesIO
import tempfile
import unittest
from pathlib import Path

from lux4_daemon.config import Config
from lux4_daemon.http import read_json_body
from lux4_daemon.models import ReplyMessage
from lux4_daemon.service import DaemonService
from lux4_daemon.session_store import SessionStore


class CapturingPublisher:
    def __init__(self) -> None:
        self.messages: list[ReplyMessage] = []

    def publish(self, message: ReplyMessage) -> None:
        self.messages.append(message)


class EchoFlowTest(unittest.TestCase):
    def test_echo_path(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            database_path = str(Path(tmpdir) / "daemon.sqlite3")
            store = SessionStore(database_path)
            publisher = CapturingPublisher()
            service = DaemonService(store=store, publisher=publisher)
            service.start()

            message = {
                "version": 1,
                "kind": "incoming_message",
                "source": "rocketchat",
                "siteUrl": "https://rocket.example.com",
                "roomId": "room-1",
                "senderUsername": "alice",
                "senderUserId": "user-1",
                "messageId": "msg-1",
                "text": "hello echo",
                "receivedAt": "2026-03-17T12:00:00Z",
            }

            from lux4_daemon.normalize import normalize_incoming_message

            normalized = normalize_incoming_message(message)
            assert normalized is not None
            service.accept(normalized)
            service._queue.join()

            self.assertEqual(len(publisher.messages), 1)
            self.assertEqual(publisher.messages[0].as_dict(), {
                "version": 1,
                "kind": "reply_message",
                "source": "rocketchat",
                "siteUrl": "https://rocket.example.com",
                "roomId": "room-1",
                "replyMode": "message",
                "text": "hello echo",
            })

            service.stop()


class ConfigShapeTest(unittest.TestCase):
    def test_config_defaults(self) -> None:
        config = Config()
        self.assertEqual(config.port, 18473)


class RequestBodyParsingTest(unittest.TestCase):
    def test_reads_content_length_json(self) -> None:
        payload = b'{"hello":"world"}'
        headers = {"content-length": str(len(payload))}
        self.assertEqual(read_json_body(headers, BytesIO(payload)), {"hello": "world"})

    def test_reads_chunked_json(self) -> None:
        body = (
            b"7\r\n"
            b'{"a":1,' b"\r\n"
            b"6\r\n"
            b'"b":2}' b"\r\n"
            b"0\r\n"
            b"\r\n"
        )
        headers = {"transfer-encoding": "chunked"}
        self.assertEqual(read_json_body(headers, BytesIO(body)), {"a": 1, "b": 2})

    def test_rejects_missing_body_headers(self) -> None:
        self.assertIsNone(read_json_body({}, BytesIO(b"{}")))


if __name__ == "__main__":
    unittest.main()
