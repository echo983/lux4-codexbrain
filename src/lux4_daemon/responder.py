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
                turn = self._run_user_reply_turn(
                    message=message,
                    session=session,
                    prompt=prompt,
                    context=context,
                    current_session_id=current_session_id,
                )
            except CodexResumeError:
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
        final_session_id = self._run_post_reply_memory_phase(
            message=message,
            context=context,
            session_id=turn.session_id,
        )

        if self._debug_sessions:
            LOGGER.info(
                "codex session debug: finished turn "
                "message_id=%s session_key=%s stored_codex_session_id=%s "
                "returned_codex_session_id=%s resume_attempted=%s resume_restarted=%s",
                message.message_id,
                session.session_key,
                current_session_id,
                final_session_id,
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
            codex_session_id=final_session_id,
            resume_attempted=resume_attempted,
            resume_restarted=resume_restarted,
        )

    def _run_user_reply_turn(
        self,
        *,
        message: IncomingMessage,
        session: ConversationSession,
        prompt: str,
        context: dict[str, str],
        current_session_id: str | None,
    ) -> Any:
        if current_session_id:
            try:
                return self._client.run_turn(
                    prompt,
                    session_id=current_session_id,
                    debug_label=message.message_id,
                    context=context,
                    on_event=self._build_event_logger(message),
                )
            except CodexResumeError:
                self._store.clear_active_codex_session(session.session_key)
                raise
        return self._client.run_turn(
            prompt,
            debug_label=message.message_id,
            context=context,
            on_event=self._build_event_logger(message),
        )

    def _run_post_reply_memory_phase(
        self,
        *,
        message: IncomingMessage,
        context: dict[str, str],
        session_id: str,
    ) -> str:
        memory_prompt = self._build_memory_followup_prompt(message)
        try:
            turn = self._client.run_turn(
                memory_prompt,
                session_id=session_id,
                debug_label=f"{message.message_id}-memory",
                context=context,
                on_event=self._build_event_logger(message),
            )
            return turn.session_id
        except CodexResumeError as exc:
            LOGGER.warning(
                "post-reply memory phase failed; keeping prior session id",
                extra={"message_id": message.message_id, "session_id": session_id, "detail": str(exc)},
            )
            return session_id

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

    def _build_memory_followup_prompt(self, message: IncomingMessage) -> str:
        return "\n".join([
            "System post-reply command. This is not user speech.",
            "The user-facing reply phase is complete.",
            "Do not send any user-facing message in this phase.",
            "Evaluate whether the just-finished turn contains durable memory worth writing to long-term memory.",
            "If durable memory is justified, write it now.",
            "If no durable memory is justified, do nothing.",
            "Keep the final output empty.",
            f"Latest user message: {message.text}",
            f"User ID: {message.sender_user_id}",
            f"Username: {message.sender_username}",
        ])
