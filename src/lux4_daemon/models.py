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
