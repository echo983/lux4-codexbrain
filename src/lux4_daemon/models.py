from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Any


@dataclass(frozen=True)
class IncomingMessage:
    source: str
    site_url: str
    room_id: str
    message_id: str
    text: str
    sender_username: str
    sender_user_id: str
    received_at: str | None = None

    @property
    def session_key(self) -> str:
        return "::".join((self.source, self.site_url, self.room_id, self.sender_user_id))


@dataclass(frozen=True)
class ReplyMessage:
    version: int
    kind: str
    source: str
    siteUrl: str
    roomId: str
    replyMode: str
    text: str

    def as_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(frozen=True)
class OutboxMessage:
    outbox_id: str
    session_key: str
    source: str
    site_url: str
    room_id: str
    sender_user_id: str
    sender_username: str
    trigger_message_id: str
    text: str
    created_at: str
    status: str


@dataclass(frozen=True)
class ConsciousnessStreamEntry:
    entry_id: str
    session_key: str
    trigger_message_id: str
    text: str
    created_at: str


@dataclass(frozen=True)
class SystemTaskRun:
    task_run_id: str
    task_type: str
    session_key: str
    window_started_at: str
    window_ended_at: str
    started_at: str
    completed_at: str
    status: str
    codex_session_id: str | None
    log_path: str | None
    summary: str
    error_detail: str


@dataclass(frozen=True)
class SystemTaskLock:
    task_type: str
    owner_id: str
    acquired_at: str
    expires_at: str


@dataclass(frozen=True)
class SystemTaskSession:
    session_key: str
    task_type: str
    codex_session_id: str | None
    status: str
    created_at: str
    updated_at: str


@dataclass(frozen=True)
class ConversationSession:
    session_key: str
    source: str
    site_url: str
    room_id: str
    sender_user_id: str
    sender_username: str
    active_codex_session_id: str | None
    status: str
    created_at: str
    updated_at: str
    last_message_id: str
    last_message_at: str
