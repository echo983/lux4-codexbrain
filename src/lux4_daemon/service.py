from __future__ import annotations

import logging
import queue
import threading

from .models import IncomingMessage, ReplyMessage
from .publisher import ReplyPublisher
from .session_store import SessionStore

LOGGER = logging.getLogger(__name__)


class EchoService:
    def build_reply(self, message: IncomingMessage) -> ReplyMessage:
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

    def accept(self, message: IncomingMessage) -> None:
        self._store.record_incoming(message)
        self._queue.put(message)

    def _run(self) -> None:
        while not self._stop_event.is_set():
            item = self._queue.get()
            if item is _STOP:
                return

            try:
                reply = self._responder.build_reply(item)
                self._publisher.publish(reply)
                self._store.record_reply(item, reply.text)
            except Exception:
                LOGGER.exception("failed to process incoming message", extra={"message_id": item.message_id})
            finally:
                self._queue.task_done()


_STOP = IncomingMessage(
    source="rocketchat",
    site_url="stop",
    room_id="stop",
    message_id="stop",
    text="stop",
    sender_username="stop",
    sender_user_id="stop",
)
