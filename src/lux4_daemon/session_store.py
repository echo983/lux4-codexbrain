from __future__ import annotations

import os
import sqlite3
import threading
from datetime import UTC, datetime

from .models import IncomingMessage


class SessionStore:
    def __init__(self, database_path: str) -> None:
        self._database_path = database_path
        self._lock = threading.Lock()
        self._ensure_parent_dir()
        self._initialize()

    def _ensure_parent_dir(self) -> None:
        parent = os.path.dirname(self._database_path)
        if parent:
            os.makedirs(parent, exist_ok=True)

    def _connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self._database_path)
        connection.row_factory = sqlite3.Row
        return connection

    def _initialize(self) -> None:
        with self._connect() as connection:
            connection.executescript(
                """
                CREATE TABLE IF NOT EXISTS sessions (
                    session_key TEXT PRIMARY KEY,
                    source TEXT NOT NULL,
                    site_url TEXT NOT NULL,
                    room_id TEXT NOT NULL,
                    sender_user_id TEXT NOT NULL,
                    sender_username TEXT NOT NULL,
                    last_message_id TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS messages (
                    message_id TEXT PRIMARY KEY,
                    session_key TEXT NOT NULL,
                    direction TEXT NOT NULL,
                    text TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY(session_key) REFERENCES sessions(session_key)
                );
                """
            )

    def record_incoming(self, message: IncomingMessage) -> None:
        now = _utc_now()
        created_at = message.received_at or now
        with self._lock, self._connect() as connection:
            connection.execute(
                """
                INSERT INTO sessions (
                    session_key,
                    source,
                    site_url,
                    room_id,
                    sender_user_id,
                    sender_username,
                    last_message_id,
                    updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(session_key) DO UPDATE SET
                    sender_username = excluded.sender_username,
                    last_message_id = excluded.last_message_id,
                    updated_at = excluded.updated_at
                """,
                (
                    message.session_key,
                    message.source,
                    message.site_url,
                    message.room_id,
                    message.sender_user_id,
                    message.sender_username,
                    message.message_id,
                    now,
                ),
            )
            connection.execute(
                """
                INSERT OR REPLACE INTO messages (
                    message_id,
                    session_key,
                    direction,
                    text,
                    created_at
                ) VALUES (?, ?, ?, ?, ?)
                """,
                (
                    message.message_id,
                    message.session_key,
                    "incoming",
                    message.text,
                    created_at,
                ),
            )

    def record_reply(self, message: IncomingMessage, reply_text: str) -> None:
        with self._lock, self._connect() as connection:
            connection.execute(
                """
                INSERT OR REPLACE INTO messages (
                    message_id,
                    session_key,
                    direction,
                    text,
                    created_at
                ) VALUES (?, ?, ?, ?, ?)
                """,
                (
                    f"reply::{message.message_id}",
                    message.session_key,
                    "reply",
                    reply_text,
                    _utc_now(),
                ),
            )


def _utc_now() -> str:
    return datetime.now(UTC).isoformat()
