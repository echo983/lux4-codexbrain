from __future__ import annotations

from io import BytesIO
import json
import subprocess
import tempfile
import threading
import time
import unittest
from pathlib import Path
from unittest import mock

from lux4_daemon.codex_mcp import CodexExecClient, CodexExecError, CodexResumeError, CodexTurnResult
from lux4_daemon.config import Config, load_dotenv_file
from lux4_daemon.http import read_json_body
from lux4_daemon.models import ReplyMessage
from lux4_daemon.publisher import CloudflareQueueReplyPublisher
from lux4_daemon.responder import CodexResponder
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
            session = store.get_session(normalized.session_key)
            self.assertIsNotNone(session)
            assert session is not None
            self.assertEqual(session.sender_user_id, "user-1")
            self.assertEqual(session.last_message_id, "msg-1")
            self.assertIsNone(session.active_codex_session_id)

            service.stop()


class ConfigShapeTest(unittest.TestCase):
    def test_config_defaults(self) -> None:
        config = Config()
        self.assertEqual(config.port, 18473)
        self.assertEqual(config.codex_timeout_seconds, 3600.0)
        self.assertFalse(config.debug_sessions)
        self.assertFalse(config.debug_codex_jsonl)
        self.assertFalse(config.debug_flow_logs)

    def test_startup_validation_requires_cloudflare_queue_config(self) -> None:
        with self.assertRaisesRegex(RuntimeError, "LUX4_CF_ACCOUNT_ID, LUX4_CF_QUEUE_ID, LUX4_CF_API_TOKEN"):
            Config().validate_for_startup()

    def test_loads_values_from_dotenv_file(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            env_path = Path(tmpdir) / ".env"
            env_path.write_text(
                "\n".join([
                    "LUX4_CF_ACCOUNT_ID=acct-123",
                    "LUX4_CF_QUEUE_ID='queue-456'",
                    'LUX4_CF_API_TOKEN="token-789"',
                ]),
                encoding="utf-8",
            )

            values = load_dotenv_file(env_path)

        self.assertEqual(values["LUX4_CF_ACCOUNT_ID"], "acct-123")
        self.assertEqual(values["LUX4_CF_QUEUE_ID"], "queue-456")
        self.assertEqual(values["LUX4_CF_API_TOKEN"], "token-789")

    def test_process_env_overrides_dotenv(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            env_path = Path(tmpdir) / ".env"
            env_path.write_text(
                "\n".join([
                    "LUX4_CF_ACCOUNT_ID=acct-from-file",
                    "LUX4_CF_QUEUE_ID=queue-from-file",
                    "LUX4_CF_API_TOKEN=token-from-file",
                ]),
                encoding="utf-8",
            )

            with mock.patch("lux4_daemon.config.Path.cwd", return_value=Path(tmpdir)):
                with mock.patch.dict("os.environ", {"LUX4_CF_QUEUE_ID": "queue-from-env"}, clear=False):
                    config = Config.from_env()

        self.assertEqual(config.cloudflare_account_id, "acct-from-file")
        self.assertEqual(config.cloudflare_queue_id, "queue-from-env")
        self.assertEqual(config.cloudflare_api_token, "token-from-file")

    def test_loads_neo4j_values_from_dotenv_aliases(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            env_path = Path(tmpdir) / ".env"
            env_path.write_text(
                "\n".join([
                    "NEO4J_BOLT_URL=bolt://graph.example:7687",
                    "NEO4J_USER=neo4j-user",
                    "NEO4J_PASSWORD=secret-pass",
                    "NEO4J_DATABASE=neo4j",
                ]),
                encoding="utf-8",
            )

            with mock.patch("lux4_daemon.config.Path.cwd", return_value=Path(tmpdir)):
                config = Config.from_env()

        self.assertEqual(config.neo4j_uri, "bolt://graph.example:7687")
        self.assertEqual(config.neo4j_username, "neo4j-user")
        self.assertEqual(config.neo4j_password, "secret-pass")
        self.assertEqual(config.neo4j_database, "neo4j")

    def test_reads_boolean_debug_flag(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            env_path = Path(tmpdir) / ".env"
            env_path.write_text(
                "LUX4_DEBUG_SESSIONS=true\n"
                "LUX4_DEBUG_CODEX_JSONL=1\n"
                "LUX4_DEBUG_FLOW_LOGS=on\n",
                encoding="utf-8",
            )

            with mock.patch("lux4_daemon.config.Path.cwd", return_value=Path(tmpdir)):
                config = Config.from_env()

        self.assertTrue(config.debug_sessions)
        self.assertTrue(config.debug_codex_jsonl)
        self.assertTrue(config.debug_flow_logs)

    def test_resolves_codex_binary_to_absolute_path(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            env_path = Path(tmpdir) / ".env"
            env_path.write_text("LUX4_CODEX_BINARY=codex\n", encoding="utf-8")

            with mock.patch("lux4_daemon.config.Path.cwd", return_value=Path(tmpdir)):
                with mock.patch("lux4_daemon.config.shutil.which", return_value="/usr/local/bin/codex"):
                    config = Config.from_env()

        self.assertEqual(config.codex_binary, "/usr/local/bin/codex")

    def test_keeps_explicit_absolute_codex_binary(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            env_path = Path(tmpdir) / ".env"
            env_path.write_text("LUX4_CODEX_BINARY=/opt/bin/codex\n", encoding="utf-8")

            with mock.patch("lux4_daemon.config.Path.cwd", return_value=Path(tmpdir)):
                config = Config.from_env()

        self.assertEqual(config.codex_binary, "/opt/bin/codex")


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


class CloudflareQueueReplyPublisherTest(unittest.TestCase):
    def test_publishes_reply_message_to_cloudflare_queue(self) -> None:
        config = Config(
            cloudflare_account_id="acct-123",
            cloudflare_queue_id="queue-456",
            cloudflare_api_token="token-789",
        )
        publisher = CloudflareQueueReplyPublisher(config)
        message = ReplyMessage(
            version=1,
            kind="reply_message",
            source="rocketchat",
            siteUrl="https://rocket.example.com",
            roomId="room-1",
            replyMode="message",
            text="hello",
        )

        response = mock.MagicMock()
        response.__enter__.return_value.status = 200

        with mock.patch("lux4_daemon.publisher.request.urlopen", return_value=response) as urlopen_mock:
            publisher.publish(message)

        outbound = urlopen_mock.call_args.args[0]
        self.assertEqual(
            outbound.full_url,
            "https://api.cloudflare.com/client/v4/accounts/acct-123/queues/queue-456/messages",
        )
        self.assertEqual(outbound.get_method(), "POST")
        self.assertEqual(outbound.headers["Authorization"], "Bearer token-789")
        self.assertEqual(outbound.headers["Content-type"], "application/json")
        self.assertEqual(json.loads(outbound.data), {
            "body": {
                "version": 1,
                "kind": "reply_message",
                "source": "rocketchat",
                "siteUrl": "https://rocket.example.com",
                "roomId": "room-1",
                "replyMode": "message",
                "text": "hello",
            },
            "content_type": "json",
        })


class SessionStoreTest(unittest.TestCase):
    def test_creates_and_updates_conversation_session(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            store = SessionStore(str(Path(tmpdir) / "daemon.sqlite3"))
            message = _build_incoming_message(message_id="msg-1", text="hello")

            session = store.get_or_create_session(message)

            self.assertEqual(session.session_key, message.session_key)
            self.assertEqual(session.status, "active")
            self.assertIsNone(session.active_codex_session_id)
            self.assertEqual(session.last_message_id, "msg-1")

            updated = store.set_active_codex_session(message.session_key, "codex-session-1")
            self.assertEqual(updated.active_codex_session_id, "codex-session-1")
            self.assertEqual(updated.status, "active")

            next_message = _build_incoming_message(message_id="msg-2", text="followup")
            next_session = store.get_or_create_session(next_message)
            self.assertEqual(next_session.active_codex_session_id, "codex-session-1")
            self.assertEqual(next_session.last_message_id, "msg-2")

    def test_can_clear_active_codex_session(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            store = SessionStore(str(Path(tmpdir) / "daemon.sqlite3"))
            message = _build_incoming_message()
            store.get_or_create_session(message)
            store.set_active_codex_session(message.session_key, "codex-session-1")

            cleared = store.clear_active_codex_session(message.session_key)

            self.assertIsNone(cleared.active_codex_session_id)
            self.assertEqual(cleared.status, "reset_required")

    def test_can_enqueue_and_mark_outbox_message(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            store = SessionStore(str(Path(tmpdir) / "daemon.sqlite3"))
            message = _build_incoming_message()
            store.get_or_create_session(message)

            queued = store.enqueue_outbox_message(
                session_key=message.session_key,
                source=message.source,
                site_url=message.site_url,
                room_id=message.room_id,
                sender_user_id=message.sender_user_id,
                sender_username=message.sender_username,
                trigger_message_id=message.message_id,
                text="follow up from agent",
            )

            pending = store.get_pending_outbox_messages(message.session_key)
            self.assertEqual(len(pending), 1)
            self.assertEqual(pending[0].outbox_id, queued.outbox_id)
            self.assertEqual(pending[0].text, "follow up from agent")

            store.mark_outbox_message_sent(queued.outbox_id)
            self.assertEqual(store.get_pending_outbox_messages(message.session_key), [])

    def test_can_append_and_read_recent_consciousness_entries(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            store = SessionStore(str(Path(tmpdir) / "daemon.sqlite3"))
            message = _build_incoming_message()
            session = store.get_or_create_session(message)

            first = store.append_consciousness_stream_entry(
                session_key=session.session_key,
                trigger_message_id="msg-1",
                text="第一条意识流",
            )
            second = store.append_consciousness_stream_entry(
                session_key=session.session_key,
                trigger_message_id="msg-2",
                text="第二条意识流",
            )
            third = store.append_consciousness_stream_entry(
                session_key=session.session_key,
                trigger_message_id="msg-3",
                text="第三条意识流",
            )

            recent = store.get_recent_consciousness_stream_entries(session.session_key, limit=2)

        self.assertEqual([entry.entry_id for entry in recent], [second.entry_id, third.entry_id])
        self.assertEqual([entry.text for entry in recent], ["第二条意识流", "第三条意识流"])


class CodexExecClientTest(unittest.TestCase):
    def test_run_turn_parses_thread_id_and_reply(self) -> None:
        config = Config(
            codex_api_key="api-key",
            database_path="var/test.sqlite3",
            neo4j_uri="bolt://graph.example:7687",
            neo4j_username="neo4j-user",
            neo4j_password="secret-pass",
        )
        client = CodexExecClient(config)
        fake_response = {
            "result": {
                "structuredContent": {
                    "threadId": "thread-123",
                    "content": "hello from codex",
                },
                "content": [{"type": "text", "text": "hello from codex"}],
            }
        }

        with mock.patch.object(client, "_call_tool", return_value=(fake_response, ['{"jsonrpc":"2.0"}'])) as call_mock:
            result = client.run_turn("reply please", context={"LUX4_AGENT_ROOM_ID": "room-1"})

        arguments = call_mock.call_args.args[1]
        env = client._build_env()
        context_payload = json.loads(client._context_file_path.read_text(encoding="utf-8"))

        self.assertEqual(result.session_id, "thread-123")
        self.assertEqual(result.reply_text, "hello from codex")
        self.assertEqual(arguments["approval-policy"], "never")
        self.assertEqual(arguments["sandbox"], "workspace-write")
        self.assertEqual(arguments["cwd"], str(Path.cwd()))
        self.assertIn("lux4-send-message", arguments["developer-instructions"])
        self.assertIn("所有面向用户的消息，包括中间更新、澄清问题、阶段结果和最终答案，都必须通过 `lux4-send-message` 发送。", arguments["developer-instructions"])
        self.assertEqual(env["CODEX_API_KEY"], "api-key")
        self.assertEqual(env["NEO4J_URI"], "bolt://graph.example:7687")
        self.assertEqual(env["NEO4J_USERNAME"], "neo4j-user")
        self.assertEqual(env["NEO4J_PASSWORD"], "secret-pass")
        self.assertEqual(env["LUX4_AGENT_DB_PATH"], "var/test.sqlite3")
        self.assertEqual(context_payload["LUX4_AGENT_ROOM_ID"], "room-1")

    def test_writes_debug_jsonl_when_enabled(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            config = Config(
                neo4j_uri="bolt://graph.example:7687",
                neo4j_username="neo4j-user",
                neo4j_password="secret-pass",
                debug_codex_jsonl=True,
                debug_codex_jsonl_dir=tmpdir,
            )
            client = CodexExecClient(config)
            fake_response = {
                "result": {
                    "structuredContent": {
                        "threadId": "thread-123",
                        "content": "hello from codex",
                    }
                }
            }

            with mock.patch.object(
                client,
                "_call_tool",
                return_value=(fake_response, ['{"jsonrpc":"2.0","id":2}', '{"jsonrpc":"2.0","id":2,"result":{}}']),
            ):
                client.run_turn("reply please", debug_label="msg-1")

            files = sorted(Path(tmpdir).glob("*.jsonl"))
            self.assertEqual(len(files), 1)
            self.assertIn('"jsonrpc":"2.0"', files[0].read_text(encoding="utf-8"))

    def test_forwards_codex_event_notifications_to_callback(self) -> None:
        client = CodexExecClient(Config(
            database_path="var/test.sqlite3",
            neo4j_uri="bolt://graph.example:7687",
            neo4j_username="neo4j-user",
            neo4j_password="secret-pass",
        ))
        seen: list[dict[str, object]] = []
        event_payload = {
            "jsonrpc": "2.0",
            "method": "codex/event",
            "params": {"msg": {"type": "task_started"}},
        }
        fake_response = {
            "result": {
                "structuredContent": {
                    "threadId": "thread-123",
                    "content": "hello",
                }
            }
        }

        def fake_call(tool_name, arguments, *, on_event=None):
            if on_event is not None:
                on_event(event_payload)
            return fake_response, ['{"jsonrpc":"2.0","method":"codex/event"}']

        with mock.patch.object(client, "_call_tool", side_effect=fake_call):
            result = client.run_turn("reply please", on_event=seen.append)

        self.assertEqual(result.reply_text, "hello")
        self.assertEqual(seen, [event_payload])

    def test_resume_uses_codex_reply_tool(self) -> None:
        client = CodexExecClient(Config(
            database_path="var/test.sqlite3",
            neo4j_uri="bolt://graph.example:7687",
            neo4j_username="neo4j-user",
            neo4j_password="secret-pass",
        ))
        fake_response = {
            "result": {
                "structuredContent": {
                    "threadId": "thread-123",
                    "content": "hello again",
                }
            }
        }

        with mock.patch.object(client, "_call_tool", return_value=(fake_response, ['{"jsonrpc":"2.0"}'])) as call_mock:
            result = client.run_turn("reply please", session_id="thread-123")

        self.assertEqual(result.session_id, "thread-123")
        self.assertEqual(result.reply_text, "hello again")
        self.assertEqual(call_mock.call_args.args[0], "codex-reply")
        self.assertEqual(call_mock.call_args.args[1]["threadId"], "thread-123")
        self.assertNotIn("sandbox", call_mock.call_args.args[1])
        self.assertIn("lux4-send-message", call_mock.call_args.args[1]["developer-instructions"])

    def test_run_turn_allows_explicit_developer_instructions_override(self) -> None:
        client = CodexExecClient(Config(
            database_path="var/test.sqlite3",
            neo4j_uri="bolt://graph.example:7687",
            neo4j_username="neo4j-user",
            neo4j_password="secret-pass",
        ))
        fake_response = {
            "result": {
                "structuredContent": {
                    "threadId": "thread-123",
                    "content": "hello override",
                }
            }
        }

        with mock.patch.object(client, "_call_tool", return_value=(fake_response, ['{"jsonrpc":"2.0"}'])) as call_mock:
            client.run_turn("reply please", developer_instructions="SYSTEM TASK ONLY")

        arguments = call_mock.call_args.args[1]
        self.assertEqual(arguments["developer-instructions"], "SYSTEM TASK ONLY")

    def test_resume_failure_raises_specific_error(self) -> None:
        client = CodexExecClient(Config(
            neo4j_uri="bolt://graph.example:7687",
            neo4j_username="neo4j-user",
            neo4j_password="secret-pass",
        ))
        with mock.patch.object(client, "_call_tool", side_effect=CodexExecError("resume failed")):
            with self.assertRaises(CodexResumeError):
                client.run_turn("reply please", session_id="thread-123")

    def test_resume_error_result_raises_specific_error(self) -> None:
        client = CodexExecClient(Config(
            neo4j_uri="bolt://graph.example:7687",
            neo4j_username="neo4j-user",
            neo4j_password="secret-pass",
        ))
        fake_response = {
            "result": {
                "isError": True,
                "structuredContent": {
                    "threadId": "thread-123",
                    "content": "Session not found for thread_id: thread-123",
                },
                "content": [{"type": "text", "text": "Session not found for thread_id: thread-123"}],
            }
        }
        with mock.patch.object(client, "_call_tool", return_value=(fake_response, ['{"jsonrpc":"2.0"}'])):
            with self.assertRaisesRegex(CodexResumeError, "Session not found"):
                client.run_turn("reply please", session_id="thread-123")

    def test_resume_timeout_raises_specific_error(self) -> None:
        client = CodexExecClient(Config(
            neo4j_uri="bolt://graph.example:7687",
            neo4j_username="neo4j-user",
            neo4j_password="secret-pass",
            codex_timeout_seconds=12,
        ))
        with mock.patch.object(client, "_call_tool", side_effect=CodexExecError("codex MCP timed out after 12.0 seconds")):
            with self.assertRaisesRegex(CodexResumeError, "timed out after 12.0 seconds"):
                client.run_turn("reply please", session_id="thread-123")

    def test_run_turn_fails_fast_when_neo4j_config_is_missing(self) -> None:
        client = CodexExecClient(Config())

        with mock.patch.object(client, "_call_tool") as call_mock:
            with self.assertRaisesRegex(CodexExecError, "Missing required Neo4j configuration"):
                client.run_turn("reply please")

        call_mock.assert_not_called()


class CodexResponderTest(unittest.TestCase):
    def test_starts_new_codex_session_when_none_exists(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            store = SessionStore(str(Path(tmpdir) / "daemon.sqlite3"))
            message = _build_incoming_message()
            session = store.get_or_create_session(message)
            client = mock.Mock()
            client.run_turn.side_effect = [
                CodexTurnResult(session_id="thread-123", reply_text="hello from codex"),
                CodexTurnResult(session_id="thread-123", reply_text="本轮意识流"),
            ]
            responder = CodexResponder(store=store, client=client)

            result = responder.build_reply(message, session)
            stream_entries = store.get_recent_consciousness_stream_entries(message.session_key)

        self.assertEqual(client.run_turn.call_count, 2)
        self.assertNotIn("session_id", client.run_turn.call_args_list[0].kwargs)
        self.assertEqual(client.run_turn.call_args_list[1].kwargs["session_id"], "thread-123")
        self.assertIn("System consciousness-stream command", client.run_turn.call_args_list[1].args[0])
        self.assertEqual(result.codex_session_id, "thread-123")
        self.assertEqual(result.reply.text, "hello from codex")
        self.assertFalse(result.resume_attempted)
        self.assertFalse(result.resume_restarted)
        self.assertEqual(len(stream_entries), 1)
        self.assertEqual(stream_entries[0].text, "本轮意识流")

    def test_resume_failure_clears_session_and_restarts(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            store = SessionStore(str(Path(tmpdir) / "daemon.sqlite3"))
            message = _build_incoming_message()
            store.get_or_create_session(message)
            session = store.set_active_codex_session(message.session_key, "thread-old")
            client = mock.Mock()
            client.run_turn.side_effect = [
                CodexResumeError("resume failed"),
                CodexTurnResult(session_id="thread-new", reply_text="fresh reply"),
                CodexTurnResult(session_id="thread-new", reply_text="恢复后的意识流"),
            ]
            responder = CodexResponder(store=store, client=client)

            result = responder.build_reply(message, session)
            reset_session = store.get_session(message.session_key)
            stream_entries = store.get_recent_consciousness_stream_entries(message.session_key)

        self.assertEqual(client.run_turn.call_count, 3)
        self.assertEqual(client.run_turn.call_args_list[0].kwargs["session_id"], "thread-old")
        self.assertNotIn("session_id", client.run_turn.call_args_list[1].kwargs)
        self.assertEqual(client.run_turn.call_args_list[2].kwargs["session_id"], "thread-new")
        assert reset_session is not None
        self.assertIsNone(reset_session.active_codex_session_id)
        self.assertEqual(reset_session.status, "reset_required")
        self.assertEqual(result.codex_session_id, "thread-new")
        self.assertTrue(result.resume_attempted)
        self.assertTrue(result.resume_restarted)
        self.assertEqual(stream_entries[-1].text, "恢复后的意识流")

    def test_resume_timeout_clears_session_and_restarts(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            store = SessionStore(str(Path(tmpdir) / "daemon.sqlite3"))
            message = _build_incoming_message()
            store.get_or_create_session(message)
            session = store.set_active_codex_session(message.session_key, "thread-old")
            client = mock.Mock()
            client.run_turn.side_effect = [
                CodexResumeError("codex exec timed out after 240.0 seconds"),
                CodexTurnResult(session_id="thread-new", reply_text="fresh reply"),
                CodexTurnResult(session_id="thread-new", reply_text="超时恢复意识流"),
            ]
            responder = CodexResponder(store=store, client=client)

            result = responder.build_reply(message, session)
            reset_session = store.get_session(message.session_key)
            stream_entries = store.get_recent_consciousness_stream_entries(message.session_key)

        self.assertEqual(client.run_turn.call_count, 3)
        self.assertEqual(client.run_turn.call_args_list[0].kwargs["session_id"], "thread-old")
        self.assertNotIn("session_id", client.run_turn.call_args_list[1].kwargs)
        self.assertEqual(client.run_turn.call_args_list[2].kwargs["session_id"], "thread-new")
        assert reset_session is not None
        self.assertIsNone(reset_session.active_codex_session_id)
        self.assertEqual(reset_session.status, "reset_required")
        self.assertEqual(result.codex_session_id, "thread-new")
        self.assertTrue(result.resume_attempted)
        self.assertTrue(result.resume_restarted)
        self.assertEqual(stream_entries[-1].text, "超时恢复意识流")

    def test_prompt_is_minimal_turn_input(self) -> None:
        store = mock.Mock()
        store.get_recent_consciousness_stream_entries.return_value = []
        responder = CodexResponder(store=store, client=mock.Mock())
        message = _build_incoming_message()
        session = mock.Mock(session_key=message.session_key)

        prompt = responder._build_prompt(message, session)

        self.assertIn("Local timestamp: ", prompt)
        self.assertIn("Room ID: room-1", prompt)
        self.assertIn("User ID: user-1", prompt)
        self.assertIn("Username: alice", prompt)
        self.assertIn("Latest user message:\nhello echo", prompt)
        self.assertNotIn("Recent consciousness stream records:", prompt)
        self.assertNotIn("lux4-send-message", prompt)
        self.assertNotIn("You are Lux, an IM assistant.", prompt)
        self.assertNotIn("neo4j-cypher-ops", prompt)

    def test_prompt_includes_recent_consciousness_entries(self) -> None:
        entry_one = mock.Mock(created_at="2026-03-22T01:00:00+00:00", text="第一条意识流")
        entry_two = mock.Mock(created_at="2026-03-22T01:01:00+00:00", text="第二条意识流")
        store = mock.Mock()
        store.get_recent_consciousness_stream_entries.return_value = [entry_one, entry_two]
        responder = CodexResponder(store=store, client=mock.Mock())
        message = _build_incoming_message()
        session = mock.Mock(session_key=message.session_key)

        prompt = responder._build_prompt(message, session)

        self.assertIn("Recent consciousness stream records:", prompt)
        self.assertIn("[2026-03-22T01:00:00+00:00] 第一条意识流", prompt)
        self.assertIn("[2026-03-22T01:01:00+00:00] 第二条意识流", prompt)

    def test_debug_logging_includes_session_fields(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            store = SessionStore(str(Path(tmpdir) / "daemon.sqlite3"))
            message = _build_incoming_message()
            session = store.get_or_create_session(message)
            client = mock.Mock()
            client.run_turn.side_effect = [
                CodexTurnResult(session_id="thread-123", reply_text="hello from codex"),
                CodexTurnResult(session_id="thread-123", reply_text="意识流日志"),
            ]
            responder = CodexResponder(store=store, client=client, config=Config(debug_sessions=True))

            with self.assertLogs("lux4_daemon.responder", level="INFO") as logs:
                responder.build_reply(message, session)

        joined = "\n".join(logs.output)
        self.assertIn("codex session debug: starting turn", joined)
        self.assertIn("message_id=msg-1", joined)
        self.assertIn("stored_codex_session_id=None", joined)
        self.assertIn("returned_codex_session_id=thread-123", joined)

    def test_memory_phase_failure_does_not_break_reply(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            store = SessionStore(str(Path(tmpdir) / "daemon.sqlite3"))
            message = _build_incoming_message()
            session = store.get_or_create_session(message)
            client = mock.Mock()
            client.run_turn.side_effect = [
                CodexTurnResult(session_id="thread-123", reply_text="hello from codex"),
                CodexResumeError("memory write phase failed"),
            ]
            responder = CodexResponder(store=store, client=client)

            result = responder.build_reply(message, session)
            stream_entries = store.get_recent_consciousness_stream_entries(message.session_key)

        self.assertEqual(result.reply.text, "hello from codex")
        self.assertEqual(result.codex_session_id, "thread-123")
        self.assertEqual(client.run_turn.call_count, 2)
        self.assertEqual(len(stream_entries), 1)
        self.assertEqual(stream_entries[0].text, "没有内容")


class DaemonOutboxFlowTest(unittest.TestCase):
    def test_service_publishes_pending_outbox_messages(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            store = SessionStore(str(Path(tmpdir) / "daemon.sqlite3"))
            publisher = CapturingPublisher()
            responder = mock.Mock()
            responder.build_reply.return_value = mock.Mock(
                reply=ReplyMessage(
                    version=1,
                    kind="reply_message",
                    source="rocketchat",
                    siteUrl="https://rocket.example.com",
                    roomId="room-1",
                    replyMode="message",
                    text="final reply",
                ),
                codex_session_id="thread-123",
            )
            service = DaemonService(store=store, publisher=publisher, responder=responder)
            service.start()

            message = _build_incoming_message()
            session = store.get_or_create_session(message)
            store.enqueue_outbox_message(
                session_key=session.session_key,
                source=message.source,
                site_url=message.site_url,
                room_id=message.room_id,
                sender_user_id=message.sender_user_id,
                sender_username=message.sender_username,
                trigger_message_id=message.message_id,
                text="agent proactive message",
            )

            service.accept(message)
            service._queue.join()

            self.assertEqual([m.text for m in publisher.messages], ["agent proactive message", "final reply"])
            self.assertEqual(store.get_pending_outbox_messages(message.session_key), [])
            service.stop()

    def test_service_publishes_new_outbox_message_while_turn_is_still_running(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            store = SessionStore(str(Path(tmpdir) / "daemon.sqlite3"))
            publisher = CapturingPublisher()
            final_release = threading.Event()
            proactive_published = threading.Event()
            message = _build_incoming_message()

            class ObservingPublisher(CapturingPublisher):
                def publish(self, outgoing: ReplyMessage) -> None:
                    super().publish(outgoing)
                    if outgoing.text == "agent proactive message":
                        proactive_published.set()

            publisher = ObservingPublisher()

            def slow_build_reply(incoming, session, *, debug_logger=None):
                self.assertFalse(proactive_published.is_set())
                queued = store.enqueue_outbox_message(
                    session_key=session.session_key,
                    source=incoming.source,
                    site_url=incoming.site_url,
                    room_id=incoming.room_id,
                    sender_user_id=incoming.sender_user_id,
                    sender_username=incoming.sender_username,
                    trigger_message_id=incoming.message_id,
                    text="agent proactive message",
                )
                self.assertIsNotNone(queued.outbox_id)
                self.assertTrue(proactive_published.wait(timeout=2))
                final_release.wait(timeout=2)
                return mock.Mock(
                    reply=ReplyMessage(
                        version=1,
                        kind="reply_message",
                        source="rocketchat",
                        siteUrl="https://rocket.example.com",
                        roomId="room-1",
                        replyMode="message",
                        text="final reply",
                    ),
                    codex_session_id="thread-123",
                )

            responder = mock.Mock()
            responder.build_reply.side_effect = slow_build_reply
            service = DaemonService(store=store, publisher=publisher, responder=responder)
            service.start()

            service.accept(message)
            self.assertTrue(proactive_published.wait(timeout=3))
            self.assertEqual([m.text for m in publisher.messages], ["agent proactive message"])
            final_release.set()
            service._queue.join()

            self.assertEqual([m.text for m in publisher.messages], ["agent proactive message", "final reply"])
            service.stop()

    def test_service_writes_debug_flow_log_when_enabled(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            store = SessionStore(str(Path(tmpdir) / "daemon.sqlite3"))
            publisher = CapturingPublisher()
            responder = mock.Mock()
            responder.build_reply.return_value = mock.Mock(
                reply=ReplyMessage(
                    version=1,
                    kind="reply_message",
                    source="rocketchat",
                    siteUrl="https://rocket.example.com",
                    roomId="room-1",
                    replyMode="message",
                    text="final reply",
                ),
                codex_session_id="thread-123",
                resume_attempted=False,
                resume_restarted=False,
            )
            config = Config(debug_flow_logs=True, debug_flow_logs_dir=str(Path(tmpdir) / "flow"))
            service = DaemonService(store=store, publisher=publisher, responder=responder, config=config)
            service.start()

            message = _build_incoming_message()
            service.accept(message)
            service._queue.join()
            service.stop()

            files = sorted((Path(tmpdir) / "flow" / "main").glob("*.jsonl"))
            self.assertEqual(len(files), 1)
            log_text = files[0].read_text(encoding="utf-8")
            self.assertIn('"event": "message_received"', log_text)
            self.assertIn('"event": "reply_phase_start"', log_text)
            self.assertIn('"event": "reply_phase_complete"', log_text)
            self.assertIn('"event": "reply_published"', log_text)


def _build_incoming_message(message_id: str = "msg-1", text: str = "hello echo"):
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
        "receivedAt": "2026-03-17T12:00:00Z",
    })
    assert normalized is not None
    return normalized


if __name__ == "__main__":
    unittest.main()
