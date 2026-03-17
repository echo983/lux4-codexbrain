from __future__ import annotations

import json
from typing import Any

from .models import IncomingMessage


def normalize_incoming_message(raw: Any) -> IncomingMessage | None:
    if isinstance(raw, str):
        try:
            raw = json.loads(raw)
        except json.JSONDecodeError:
            return None

    candidates = _collect_candidate_objects(raw)

    kind = _pick_string(candidates, "kind")
    if kind and kind != "incoming_message":
        return None

    source = _pick_string(candidates, "source")
    if source and source != "rocketchat":
        return None

    site_url = _pick_string(candidates, "siteUrl", "siteURL", "site_url")
    room_id = _pick_string(candidates, "roomId", "rid", "room_id")
    message_id = _pick_string(candidates, "messageId", "msgId", "_id", "id")
    text = _pick_string(candidates, "text", "message", "msg", "content")
    sender_username = _pick_string(candidates, "senderUsername", "username", "user_name")
    sender_user_id = _pick_string(candidates, "senderUserId", "userId", "sender_id", "uid")
    received_at = _pick_string(candidates, "receivedAt", "createdAt", "ts")

    if not all((site_url, room_id, message_id, text, sender_username, sender_user_id)):
        return None

    return IncomingMessage(
        source="rocketchat",
        site_url=site_url,
        room_id=room_id,
        message_id=message_id,
        text=text,
        sender_username=sender_username,
        sender_user_id=sender_user_id,
        received_at=received_at,
    )


def _collect_candidate_objects(raw: Any) -> list[dict[str, Any]]:
    if not isinstance(raw, dict):
        return []

    candidates = [raw]
    for key in ("payload", "message", "data", "event"):
        value = raw.get(key)
        if isinstance(value, dict):
            candidates.append(value)
    return candidates


def _pick_string(candidates: list[dict[str, Any]], *keys: str) -> str | None:
    for candidate in candidates:
        for key in keys:
            value = candidate.get(key)
            if isinstance(value, str):
                trimmed = value.strip()
                if trimmed:
                    return trimmed
    return None
