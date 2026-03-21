from __future__ import annotations

import logging
import queue
import threading
import time

from .models import ConversationSession, IncomingMessage, ReplyMessage
from .publisher import ReplyPublisher
from .session_store import SessionStore

LOGGER = logging.getLogger(__name__)
OUTBOX_POLL_INTERVAL_SECONDS = 0.2


class EchoService:
    def build_reply(self, message: IncomingMessage, session: ConversationSession) -> ReplyMessage:
        return ReplyMessage(
            version=1,
            kind="reply_message",
            source=message.source,
            siteUrl=message.site_url,
            roomId=message.room_id,
            replyMode="message",
            text=message.text,
        )


class DaemonService:
    def __init__(
        self,
        store: SessionStore,
        publisher: ReplyPublisher,
        responder: EchoService | None = None,
    ) -> None:
        self._store = store
        self._publisher = publisher
        self._responder = responder or EchoService()
        self._queue: queue.Queue[IncomingMessage] = queue.Queue()
        self._stop_event = threading.Event()
        self._worker = threading.Thread(target=self._run, name="lux4-daemon-worker", daemon=True)

    def start(self) -> None:
        if not self._worker.is_alive():
            self._worker.start()

    def stop(self) -> None:
        self._stop_event.set()
        self._queue.put(_STOP)
        self._worker.join(timeout=5)
        close = getattr(self._responder, "close", None)
        if callable(close):
            close()

    def accept(self, message: IncomingMessage) -> None:
        self._queue.put(message)

    def _run(self) -> None:
        while not self._stop_event.is_set():
            item = self._queue.get()
            if item is _STOP:
                return

            try:
                session = self._store.get_or_create_session(item)
                publish_stop = threading.Event()
                publish_thread = threading.Thread(
                    target=self._outbox_publish_loop,
                    args=(item.session_key, publish_stop),
                    name=f"lux4-outbox-{item.message_id}",
                    daemon=True,
                )
                publish_thread.start()
                try:
                    response = self._responder.build_reply(item, session)
                finally:
                    publish_stop.set()
                    publish_thread.join(timeout=1)
                if isinstance(response, ReplyMessage):
                    reply = response
                    codex_session_id = None
                else:
                    reply = response.reply
                    codex_session_id = response.codex_session_id

                if codex_session_id:
                    self._store.set_active_codex_session(item.session_key, codex_session_id)
                self._publish_pending_outbox(item.session_key)
                if reply.text.strip():
                    self._publisher.publish(reply)
                    self._store.record_reply(item, reply.text)
            except Exception:
                LOGGER.exception("failed to process incoming message", extra={"message_id": item.message_id})
            finally:
                self._queue.task_done()

    def _outbox_publish_loop(self, session_key: str, stop_event: threading.Event) -> None:
        while not stop_event.is_set():
            self._publish_pending_outbox(session_key)
            stop_event.wait(OUTBOX_POLL_INTERVAL_SECONDS)

    def _publish_pending_outbox(self, session_key: str) -> None:
        for outbox_message in self._store.get_pending_outbox_messages(session_key):
            reply = ReplyMessage(
                version=1,
                kind="reply_message",
                source=outbox_message.source,
                siteUrl=outbox_message.site_url,
                roomId=outbox_message.room_id,
                replyMode="message",
                text=outbox_message.text,
            )
            try:
                self._publisher.publish(reply)
                self._store.mark_outbox_message_sent(outbox_message.outbox_id)
            except Exception as exc:
                self._store.mark_outbox_message_failed(outbox_message.outbox_id, str(exc))
                LOGGER.exception(
                    "failed to publish outbox message",
                    extra={"outbox_id": outbox_message.outbox_id, "session_key": session_key},
                )


_STOP = IncomingMessage(
    source="rocketchat",
    site_url="stop",
    room_id="stop",
    message_id="stop",
    text="stop",
    sender_username="stop",
    sender_user_id="stop",
)
