from __future__ import annotations

import os
import sqlite3
import threading
from contextlib import closing
from datetime import UTC, datetime

from .models import ConversationSession, IncomingMessage


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
        with closing(self._connect()) as connection:
            with connection:
                connection.executescript(
                    """
                    CREATE TABLE IF NOT EXISTS sessions (
                        session_key TEXT PRIMARY KEY,
                        source TEXT NOT NULL,
                        site_url TEXT NOT NULL,
                        room_id TEXT NOT NULL,
                        sender_user_id TEXT NOT NULL,
                        sender_username TEXT NOT NULL,
                        active_codex_session_id TEXT,
                        status TEXT NOT NULL DEFAULT 'active',
                        created_at TEXT NOT NULL DEFAULT '',
                        last_message_id TEXT NOT NULL,
                        last_message_at TEXT NOT NULL DEFAULT '',
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
                self._ensure_session_columns(connection)

    def _ensure_session_columns(self, connection: sqlite3.Connection) -> None:
        columns = {
            row["name"]
            for row in connection.execute("PRAGMA table_info(sessions)")
        }
        if "active_codex_session_id" not in columns:
            connection.execute("ALTER TABLE sessions ADD COLUMN active_codex_session_id TEXT")
        if "status" not in columns:
            connection.execute("ALTER TABLE sessions ADD COLUMN status TEXT NOT NULL DEFAULT 'active'")
        if "created_at" not in columns:
            connection.execute("ALTER TABLE sessions ADD COLUMN created_at TEXT NOT NULL DEFAULT ''")
        if "last_message_at" not in columns:
            connection.execute("ALTER TABLE sessions ADD COLUMN last_message_at TEXT NOT NULL DEFAULT ''")

    def record_incoming(self, message: IncomingMessage) -> None:
        now = _utc_now()
        created_at = message.received_at or now
        with self._lock, closing(self._connect()) as connection:
            with connection:
                connection.execute(
                    """
                    INSERT INTO sessions (
                        session_key,
                        source,
                        site_url,
                        room_id,
                        sender_user_id,
                        sender_username,
                        active_codex_session_id,
                        status,
                        created_at,
                        last_message_id,
                        last_message_at,
                        updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, NULL, 'active', ?, ?, ?, ?)
                    ON CONFLICT(session_key) DO UPDATE SET
                        sender_username = excluded.sender_username,
                        last_message_id = excluded.last_message_id,
                        last_message_at = excluded.last_message_at,
                        status = excluded.status,
                        updated_at = excluded.updated_at
                    """,
                    (
                        message.session_key,
                        message.source,
                        message.site_url,
                        message.room_id,
                        message.sender_user_id,
                        message.sender_username,
                        created_at,
                        message.message_id,
                        created_at,
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
        now = _utc_now()
        with self._lock, closing(self._connect()) as connection:
            with connection:
                connection.execute(
                    """
                    UPDATE sessions
                    SET updated_at = ?, status = 'active'
                    WHERE session_key = ?
                    """,
                    (now, message.session_key),
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
                        f"reply::{message.message_id}",
                        message.session_key,
                        "reply",
                        reply_text,
                        now,
                    ),
                )

    def get_or_create_session(self, message: IncomingMessage) -> ConversationSession:
        self.record_incoming(message)
        session = self.get_session(message.session_key)
        if session is None:
            raise RuntimeError(f"failed to load session after upsert: {message.session_key}")
        return session

    def get_session(self, session_key: str) -> ConversationSession | None:
        with self._lock, closing(self._connect()) as connection:
            row = connection.execute(
                """
                SELECT
                    session_key,
                    source,
                    site_url,
                    room_id,
                    sender_user_id,
                    sender_username,
                    active_codex_session_id,
                    status,
                    created_at,
                    updated_at,
                    last_message_id,
                    last_message_at
                FROM sessions
                WHERE session_key = ?
                """,
                (session_key,),
            ).fetchone()

        if row is None:
            return None
        return _session_from_row(row)

    def set_active_codex_session(
        self,
        session_key: str,
        codex_session_id: str,
        *,
        status: str = "active",
    ) -> ConversationSession:
        now = _utc_now()
        with self._lock, closing(self._connect()) as connection:
            with connection:
                connection.execute(
                    """
                    UPDATE sessions
                    SET active_codex_session_id = ?, status = ?, updated_at = ?
                    WHERE session_key = ?
                    """,
                    (codex_session_id, status, now, session_key),
                )
        session = self.get_session(session_key)
        if session is None:
            raise RuntimeError(f"failed to load session after codex session update: {session_key}")
        return session

    def clear_active_codex_session(self, session_key: str, *, status: str = "reset_required") -> ConversationSession:
        now = _utc_now()
        with self._lock, closing(self._connect()) as connection:
            with connection:
                connection.execute(
                    """
                    UPDATE sessions
                    SET active_codex_session_id = NULL, status = ?, updated_at = ?
                    WHERE session_key = ?
                    """,
                    (status, now, session_key),
                )
        session = self.get_session(session_key)
        if session is None:
            raise RuntimeError(f"failed to load session after codex session clear: {session_key}")
        return session


def _session_from_row(row: sqlite3.Row) -> ConversationSession:
    return ConversationSession(
        session_key=row["session_key"],
        source=row["source"],
        site_url=row["site_url"],
        room_id=row["room_id"],
        sender_user_id=row["sender_user_id"],
        sender_username=row["sender_username"],
        active_codex_session_id=row["active_codex_session_id"],
        status=row["status"],
        created_at=row["created_at"],
        updated_at=row["updated_at"],
        last_message_id=row["last_message_id"],
        last_message_at=row["last_message_at"],
    )


def _utc_now() -> str:
    return datetime.now(UTC).isoformat()
