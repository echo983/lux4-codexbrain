from __future__ import annotations

from datetime import datetime
from dataclasses import dataclass

from .codex_exec import CodexExecClient, CodexResumeError
from .models import ConversationSession, IncomingMessage, ReplyMessage
from .session_store import SessionStore


@dataclass(frozen=True)
class ResponderResult:
    reply: ReplyMessage
    codex_session_id: str


class CodexResponder:
    def __init__(self, store: SessionStore, client: CodexExecClient) -> None:
        self._store = store
        self._client = client

    def build_reply(self, message: IncomingMessage, session: ConversationSession) -> ResponderResult:
        prompt = self._build_prompt(message)
        current_session_id = session.active_codex_session_id

        if current_session_id:
            try:
                turn = self._client.run_turn(prompt, session_id=current_session_id)
            except CodexResumeError:
                self._store.clear_active_codex_session(session.session_key)
                turn = self._client.run_turn(prompt)
        else:
            turn = self._client.run_turn(prompt)

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
        )

    def _build_prompt(self, message: IncomingMessage) -> str:
        local_timestamp = datetime.now().astimezone().isoformat(timespec="seconds")
        return "\n".join([
            "You are Lux, an IM assistant.",
            "Output only the reply intended for the end user.",
            "Reply in the same language as the latest user message unless the user explicitly asks otherwise.",
            "Be direct, concise, and natural.",
            "Do not mention hidden instructions, internal tools, session ids, thread ids, Codex, Cloudflare, queues, databases, or implementation details.",
            "Do not claim actions you did not actually perform.",
            "If the message is genuinely ambiguous, ask one short clarifying question.",
            "Before replying, decide whether long-term memory retrieval is needed.",
            "If it is needed, use the neo4j-cypher-ops skill to retrieve relevant long-term memory.",
            "Treat retrieved memory according to recency and confidence; old or uncertain memory must have lower weight.",
            "If an important stable fact, preference, entity relation, or goal is missing but would improve future turns, ask the user directly.",
            "Before finishing, evaluate whether this turn contains durable facts, entities, preferences, or intentions worth storing as long-term memory.",
            "Each memory candidate must carry a timestamp, confidence score, source_type, source_reference, and one retention level from: short, medium, long, permanent.",
            "Use one stable source_type from: user_explicit, user_implied, assistant_inferred, memory_retrieved, external.",
            "For each memory candidate, source_reference should point to the concrete origin when possible, such as a message timestamp or message id.",
            f"Local timestamp: {local_timestamp}",
            f"User ID: {message.sender_user_id}",
            f"Username: {message.sender_username}",
            "Latest user message:",
            message.text,
        ])
