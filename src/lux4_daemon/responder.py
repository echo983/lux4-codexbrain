from __future__ import annotations

import logging
from datetime import datetime
from dataclasses import dataclass
from typing import Any

from .codex_mcp import CodexExecClient, CodexResumeError
from .config import Config
from .models import ConversationSession, IncomingMessage, ReplyMessage
from .session_store import SessionStore

LOGGER = logging.getLogger(__name__)


@dataclass(frozen=True)
class ResponderResult:
    reply: ReplyMessage
    codex_session_id: str
    resume_attempted: bool
    resume_restarted: bool


class CodexResponder:
    def __init__(
        self,
        store: SessionStore,
        client: CodexExecClient,
        config: Config | None = None,
    ) -> None:
        self._store = store
        self._client = client
        self._debug_sessions = bool(config.debug_sessions) if config is not None else False

    def close(self) -> None:
        self._client.close()

    def build_reply(self, message: IncomingMessage, session: ConversationSession) -> ResponderResult:
        prompt = self._build_prompt(message)
        context = {
            "LUX4_AGENT_SESSION_KEY": session.session_key,
            "LUX4_AGENT_SOURCE": message.source,
            "LUX4_AGENT_SITE_URL": message.site_url,
            "LUX4_AGENT_ROOM_ID": message.room_id,
            "LUX4_AGENT_SENDER_USER_ID": message.sender_user_id,
            "LUX4_AGENT_SENDER_USERNAME": message.sender_username,
            "LUX4_AGENT_TRIGGER_MESSAGE_ID": message.message_id,
        }
        current_session_id = session.active_codex_session_id
        resume_attempted = bool(current_session_id)
        resume_restarted = False

        if self._debug_sessions:
            LOGGER.info(
                "codex session debug: starting turn "
                "message_id=%s session_key=%s stored_codex_session_id=%s resume_attempted=%s",
                message.message_id,
                session.session_key,
                current_session_id,
                resume_attempted,
            )

        if current_session_id:
            try:
                turn = self._client.run_turn(
                    prompt,
                    session_id=current_session_id,
                    debug_label=message.message_id,
                    context=context,
                    on_event=self._build_event_logger(message),
                )
            except CodexResumeError:
                self._store.clear_active_codex_session(session.session_key)
                resume_restarted = True
                turn = self._client.run_turn(
                    prompt,
                    debug_label=message.message_id,
                    context=context,
                    on_event=self._build_event_logger(message),
                )
        else:
            turn = self._client.run_turn(
                prompt,
                debug_label=message.message_id,
                context=context,
                on_event=self._build_event_logger(message),
            )

        if self._debug_sessions:
            LOGGER.info(
                "codex session debug: finished turn "
                "message_id=%s session_key=%s stored_codex_session_id=%s "
                "returned_codex_session_id=%s resume_attempted=%s resume_restarted=%s",
                message.message_id,
                session.session_key,
                current_session_id,
                turn.session_id,
                resume_attempted,
                resume_restarted,
            )

        return ResponderResult(
            reply=ReplyMessage(
                version=1,
                kind="reply_message",
                source=message.source,
                siteUrl=message.site_url,
                roomId=message.room_id,
                replyMode="message",
                text=turn.reply_text,
            ),
            codex_session_id=turn.session_id,
            resume_attempted=resume_attempted,
            resume_restarted=resume_restarted,
        )

    def _build_event_logger(self, message: IncomingMessage):
        def on_event(payload: dict[str, Any]) -> None:
            if not self._debug_sessions:
                return
            params = payload.get("params")
            if not isinstance(params, dict):
                return
            msg = params.get("msg")
            if not isinstance(msg, dict):
                return
            event_type = msg.get("type")
            if isinstance(event_type, str):
                LOGGER.info(
                    "codex mcp event: message_id=%s type=%s",
                    message.message_id,
                    event_type,
                )

        return on_event

    def _build_prompt(self, message: IncomingMessage) -> str:
        local_timestamp = datetime.now().astimezone().isoformat(timespec="seconds")
        return "\n".join([
            f"Local timestamp: {local_timestamp}",
            f"Room ID: {message.room_id}",
            f"User ID: {message.sender_user_id}",
            f"Username: {message.sender_username}",
            "Latest user message:",
            message.text,
        ])
