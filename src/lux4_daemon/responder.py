from __future__ import annotations

import logging
from datetime import datetime
from dataclasses import dataclass
from typing import Any

from .codex_mcp import CodexExecClient, CodexExecError, CodexResumeError
from .config import Config
from .flow_debug import NullFlowDebugLogger
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
    DEFAULT_CONSCIOUSNESS_ENTRY = "没有内容"

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

    def build_reply(self, message: IncomingMessage, session: ConversationSession, *, debug_logger=None) -> ResponderResult:
        debug_logger = debug_logger or NullFlowDebugLogger()
        prompt = self._build_prompt(message, session)
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
                debug_logger.event("reply_turn_resume_attempt", session_id=current_session_id, prompt=prompt, context=context)
                turn = self._run_user_reply_turn(
                    message=message,
                    session=session,
                    prompt=prompt,
                    context=context,
                    current_session_id=current_session_id,
                )
            except CodexResumeError:
                resume_restarted = True
                debug_logger.event("reply_turn_resume_restarted", prior_session_id=current_session_id)
                turn = self._client.run_turn(
                    prompt,
                    debug_label=message.message_id,
                    context=context,
                    on_event=self._build_event_logger(message),
                )
        else:
            debug_logger.event("reply_turn_new_session", prompt=prompt, context=context)
            turn = self._client.run_turn(
                prompt,
                debug_label=message.message_id,
                context=context,
                on_event=self._build_event_logger(message),
            )
        final_session_id = self._run_post_reply_memory_phase(
            message=message,
            session=session,
            context=context,
            session_id=turn.session_id,
            debug_logger=debug_logger,
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
        session: ConversationSession,
        context: dict[str, str],
        session_id: str,
        debug_logger,
    ) -> str:
        memory_prompt = self._build_memory_followup_prompt(message)
        try:
            debug_logger.event("consciousness_phase_start", session_id=session_id, prompt=memory_prompt, context=context)
            turn = self._client.run_turn(
                memory_prompt,
                session_id=session_id,
                debug_label=f"{message.message_id}-memory",
                context=context,
                on_event=self._build_event_logger(message),
            )
            entry_text = turn.reply_text.strip() or self.DEFAULT_CONSCIOUSNESS_ENTRY
            self._store.append_consciousness_stream_entry(
                session_key=session.session_key,
                trigger_message_id=message.message_id,
                text=entry_text,
            )
            debug_logger.event(
                "consciousness_phase_complete",
                session_id=turn.session_id,
                entry_text=entry_text,
            )
            return turn.session_id
        except CodexExecError as exc:
            self._store.append_consciousness_stream_entry(
                session_key=session.session_key,
                trigger_message_id=message.message_id,
                text=self.DEFAULT_CONSCIOUSNESS_ENTRY,
            )
            debug_logger.event(
                "consciousness_phase_failed",
                session_id=session_id,
                error=str(exc),
                fallback_entry=self.DEFAULT_CONSCIOUSNESS_ENTRY,
            )
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

    def _build_prompt(self, message: IncomingMessage, session: ConversationSession) -> str:
        local_timestamp = datetime.now().astimezone().isoformat(timespec="seconds")
        lines = [
            f"Local timestamp: {local_timestamp}",
            f"Room ID: {message.room_id}",
            f"User ID: {message.sender_user_id}",
            f"Username: {message.sender_username}",
        ]
        recent_entries = self._store.get_recent_consciousness_stream_entries(session.session_key, limit=2)
        if recent_entries:
            lines.extend([
                "Recent consciousness stream records:",
                *[
                    f"- [{entry.created_at}] {entry.text}"
                    for entry in recent_entries
                ],
            ])
        lines.extend([
            "Latest user message:",
            message.text,
        ])
        return "\n".join(lines)

    def _build_memory_followup_prompt(self, message: IncomingMessage) -> str:
        return "\n".join([
            "System consciousness-stream command. This is not user speech.",
            "The user-facing reply phase is complete.",
            "Do not send any user-facing message in this phase.",
            "Write exactly one internal consciousness-stream record for the just-finished turn.",
            "This record is mandatory. You must always produce one record.",
            "Summarize the turn as a short, concrete stream-of-consciousness internal note that may help the next turn.",
            "If there is no meaningful internal note, output exactly: 没有内容",
            "Do not output JSON.",
            "Do not output explanations, headings, or multiple items.",
            "Output only the single record text.",
            f"Latest user message: {message.text}",
            f"User ID: {message.sender_user_id}",
            f"Username: {message.sender_username}",
        ])
