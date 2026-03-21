#!/usr/bin/env python3
"""Queue an agent-authored outbound message for the current lux4 session."""

from __future__ import annotations

import argparse
import json
import os
import sqlite3
import sys
import uuid
from datetime import UTC, datetime
from pathlib import Path


REQUIRED_ENV_KEYS = [
    "LUX4_AGENT_DB_PATH",
    "LUX4_AGENT_SESSION_KEY",
    "LUX4_AGENT_SOURCE",
    "LUX4_AGENT_SITE_URL",
    "LUX4_AGENT_ROOM_ID",
    "LUX4_AGENT_SENDER_USER_ID",
    "LUX4_AGENT_SENDER_USERNAME",
    "LUX4_AGENT_TRIGGER_MESSAGE_ID",
]
CONTEXT_FILE_ENV_KEY = "LUX4_AGENT_CONTEXT_FILE"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Enqueue an outbound message for the current lux4 conversation.")
    parser.add_argument("--text", required=True, help="Message text to send to the current user/room")
    return parser.parse_args()


def _load_context_file(path: Path) -> dict[str, str]:
    if not path.exists():
        raise SystemExit(f"Lux4 agent context file not found: {path}")
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Lux4 agent context file is not valid JSON: {path}") from exc
    if not isinstance(payload, dict):
        raise SystemExit(f"Lux4 agent context file must contain a JSON object: {path}")
    return {
        key: str(value).strip()
        for key, value in payload.items()
        if isinstance(key, str) and str(value).strip()
    }


def require_context() -> dict[str, str]:
    context: dict[str, str] = {}
    context_file = os.environ.get(CONTEXT_FILE_ENV_KEY, "").strip()
    if context_file:
        context.update(_load_context_file(Path(context_file)))
    for key in REQUIRED_ENV_KEYS:
        value = os.environ.get(key)
        if value:
            context[key] = value
    missing = [key for key in REQUIRED_ENV_KEYS if not context.get(key)]
    if missing:
        raise SystemExit("Missing required lux4 agent context: " + ", ".join(missing))
    return {key: context[key] for key in REQUIRED_ENV_KEYS}


def enqueue_message(text: str, context: dict[str, str]) -> dict[str, str]:
    db_path = Path(context["LUX4_AGENT_DB_PATH"])
    if not db_path.exists():
        raise SystemExit(f"Database not found: {db_path}")
    now = datetime.now(UTC).isoformat()
    outbox_id = uuid.uuid4().hex
    with sqlite3.connect(db_path) as connection:
        connection.execute(
            """
            INSERT INTO outbox_messages (
                outbox_id,
                session_key,
                source,
                site_url,
                room_id,
                sender_user_id,
                sender_username,
                trigger_message_id,
                text,
                created_at,
                status,
                failure_detail
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', '')
            """,
            (
                outbox_id,
                context["LUX4_AGENT_SESSION_KEY"],
                context["LUX4_AGENT_SOURCE"],
                context["LUX4_AGENT_SITE_URL"],
                context["LUX4_AGENT_ROOM_ID"],
                context["LUX4_AGENT_SENDER_USER_ID"],
                context["LUX4_AGENT_SENDER_USERNAME"],
                context["LUX4_AGENT_TRIGGER_MESSAGE_ID"],
                text,
                now,
            ),
        )
    return {
        "outbox_id": outbox_id,
        "session_key": context["LUX4_AGENT_SESSION_KEY"],
        "room_id": context["LUX4_AGENT_ROOM_ID"],
        "text": text,
        "status": "pending",
    }


def main() -> int:
    args = parse_args()
    text = args.text.strip()
    if not text:
        raise SystemExit("Message text must not be empty")
    payload = enqueue_message(text, require_context())
    json.dump(payload, sys.stdout, ensure_ascii=False, indent=2)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
