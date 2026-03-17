from __future__ import annotations

import os
import sqlite3
import threading
import uuid
from contextlib import closing
from datetime import UTC, datetime

from .models import ConversationSession, IncomingMessage, OutboxMessage, SystemTaskLock, SystemTaskRun


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

                    CREATE TABLE IF NOT EXISTS outbox_messages (
                        outbox_id TEXT PRIMARY KEY,
                        session_key TEXT NOT NULL,
                        source TEXT NOT NULL,
                        site_url TEXT NOT NULL,
                        room_id TEXT NOT NULL,
                        sender_user_id TEXT NOT NULL,
                        sender_username TEXT NOT NULL,
                        trigger_message_id TEXT NOT NULL,
                        text TEXT NOT NULL,
                        created_at TEXT NOT NULL,
                        published_at TEXT,
                        status TEXT NOT NULL DEFAULT 'pending',
                        failure_detail TEXT NOT NULL DEFAULT '',
                        FOREIGN KEY(session_key) REFERENCES sessions(session_key)
                    );

                    CREATE TABLE IF NOT EXISTS system_task_runs (
                        task_run_id TEXT PRIMARY KEY,
                        task_type TEXT NOT NULL,
                        session_key TEXT NOT NULL,
                        window_started_at TEXT NOT NULL,
                        window_ended_at TEXT NOT NULL,
                        started_at TEXT NOT NULL,
                        completed_at TEXT NOT NULL,
                        status TEXT NOT NULL,
                        codex_session_id TEXT,
                        log_path TEXT,
                        summary TEXT NOT NULL DEFAULT '',
                        error_detail TEXT NOT NULL DEFAULT '',
                        FOREIGN KEY(session_key) REFERENCES sessions(session_key)
                    );

                    CREATE TABLE IF NOT EXISTS system_task_locks (
                        task_type TEXT PRIMARY KEY,
                        owner_id TEXT NOT NULL,
                        acquired_at TEXT NOT NULL,
                        expires_at TEXT NOT NULL
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

    def enqueue_outbox_message(
        self,
        *,
        session_key: str,
        source: str,
        site_url: str,
        room_id: str,
        sender_user_id: str,
        sender_username: str,
        trigger_message_id: str,
        text: str,
    ) -> OutboxMessage:
        now = _utc_now()
        outbox_id = uuid.uuid4().hex
        with self._lock, closing(self._connect()) as connection:
            with connection:
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
                        session_key,
                        source,
                        site_url,
                        room_id,
                        sender_user_id,
                        sender_username,
                        trigger_message_id,
                        text,
                        now,
                    ),
                )
        message = self.get_outbox_message(outbox_id)
        if message is None:
            raise RuntimeError(f"failed to load outbox message after insert: {outbox_id}")
        return message

    def get_pending_outbox_messages(self, session_key: str) -> list[OutboxMessage]:
        with self._lock, closing(self._connect()) as connection:
            rows = connection.execute(
                """
                SELECT
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
                    status
                FROM outbox_messages
                WHERE session_key = ? AND status = 'pending'
                ORDER BY created_at ASC, outbox_id ASC
                """,
                (session_key,),
            ).fetchall()
        return [_outbox_from_row(row) for row in rows]

    def mark_outbox_message_sent(self, outbox_id: str) -> None:
        now = _utc_now()
        with self._lock, closing(self._connect()) as connection:
            with connection:
                row = connection.execute(
                    """
                    SELECT
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
                        status
                    FROM outbox_messages
                    WHERE outbox_id = ?
                    """,
                    (outbox_id,),
                ).fetchone()
                if row is None:
                    raise RuntimeError(f"outbox message not found: {outbox_id}")
                connection.execute(
                    """
                    UPDATE outbox_messages
                    SET status = 'sent', published_at = ?, failure_detail = ''
                    WHERE outbox_id = ?
                    """,
                    (now, outbox_id),
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
                        f"outbox::{outbox_id}",
                        row["session_key"],
                        "reply",
                        row["text"],
                        now,
                    ),
                )

    def mark_outbox_message_failed(self, outbox_id: str, detail: str) -> None:
        now = _utc_now()
        with self._lock, closing(self._connect()) as connection:
            with connection:
                connection.execute(
                    """
                    UPDATE outbox_messages
                    SET status = 'failed', published_at = ?, failure_detail = ?
                    WHERE outbox_id = ?
                    """,
                    (now, detail[:500], outbox_id),
                )

    def get_outbox_message(self, outbox_id: str) -> OutboxMessage | None:
        with self._lock, closing(self._connect()) as connection:
            row = connection.execute(
                """
                SELECT
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
                    status
                FROM outbox_messages
                WHERE outbox_id = ?
                """,
                (outbox_id,),
            ).fetchone()
        if row is None:
            return None
        return _outbox_from_row(row)

    def get_recently_active_sessions(self, *, since: datetime) -> list[ConversationSession]:
        cutoff = since.astimezone(UTC)
        with self._lock, closing(self._connect()) as connection:
            session_keys = [
                row["session_key"]
                for row in connection.execute(
                    """
                    SELECT session_key, MAX(created_at) AS latest_created_at
                    FROM messages
                    GROUP BY session_key
                    ORDER BY latest_created_at DESC
                    """
                ).fetchall()
                if _parse_iso8601(row["latest_created_at"]) >= cutoff
            ]
        sessions: list[ConversationSession] = []
        for session_key in session_keys:
            session = self.get_session(session_key)
            if session is not None:
                sessions.append(session)
        return sessions

    def get_recent_messages(self, session_key: str, *, since: datetime) -> list[dict[str, str]]:
        cutoff = since.astimezone(UTC)
        with self._lock, closing(self._connect()) as connection:
            rows = connection.execute(
                """
                SELECT message_id, direction, text, created_at
                FROM messages
                WHERE session_key = ?
                ORDER BY created_at ASC
                """,
                (session_key,),
            ).fetchall()
        messages = []
        for row in rows:
            created_at = _parse_iso8601(row["created_at"])
            if created_at < cutoff:
                continue
            messages.append(
                {
                    "message_id": row["message_id"],
                    "direction": row["direction"],
                    "text": row["text"],
                    "created_at": row["created_at"],
                }
            )
        return messages

    def record_system_task_run(
        self,
        *,
        task_type: str,
        session_key: str,
        window_started_at: str,
        window_ended_at: str,
        started_at: str,
        completed_at: str,
        status: str,
        codex_session_id: str | None,
        log_path: str | None,
        summary: str,
        error_detail: str = "",
    ) -> SystemTaskRun:
        task_run_id = uuid.uuid4().hex
        with self._lock, closing(self._connect()) as connection:
            with connection:
                connection.execute(
                    """
                    INSERT INTO system_task_runs (
                        task_run_id,
                        task_type,
                        session_key,
                        window_started_at,
                        window_ended_at,
                        started_at,
                        completed_at,
                        status,
                        codex_session_id,
                        log_path,
                        summary,
                        error_detail
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        task_run_id,
                        task_type,
                        session_key,
                        window_started_at,
                        window_ended_at,
                        started_at,
                        completed_at,
                        status,
                        codex_session_id,
                        log_path,
                        summary,
                        error_detail,
                    ),
                )
        run = self.get_system_task_run(task_run_id)
        if run is None:
            raise RuntimeError(f"failed to load system task run after insert: {task_run_id}")
        return run

    def get_system_task_run(self, task_run_id: str) -> SystemTaskRun | None:
        with self._lock, closing(self._connect()) as connection:
            row = connection.execute(
                """
                SELECT
                    task_run_id,
                    task_type,
                    session_key,
                    window_started_at,
                    window_ended_at,
                    started_at,
                    completed_at,
                    status,
                    codex_session_id,
                    log_path,
                    summary,
                    error_detail
                FROM system_task_runs
                WHERE task_run_id = ?
                """,
                (task_run_id,),
            ).fetchone()
        if row is None:
            return None
        return _system_task_run_from_row(row)

    def get_recent_system_task_runs(self, *, task_type: str, since: datetime, status: str | None = None) -> list[SystemTaskRun]:
        cutoff = since.astimezone(UTC)
        with self._lock, closing(self._connect()) as connection:
            rows = connection.execute(
                """
                SELECT
                    task_run_id,
                    task_type,
                    session_key,
                    window_started_at,
                    window_ended_at,
                    started_at,
                    completed_at,
                    status,
                    codex_session_id,
                    log_path,
                    summary,
                    error_detail
                FROM system_task_runs
                WHERE task_type = ?
                ORDER BY started_at DESC
                """,
                (task_type,),
            ).fetchall()
        runs = []
        for row in rows:
            started_at = _parse_iso8601(row["started_at"])
            if started_at < cutoff:
                continue
            if status is not None and row["status"] != status:
                continue
            runs.append(_system_task_run_from_row(row))
        return runs

    def acquire_system_task_lock(
        self,
        *,
        task_type: str,
        owner_id: str,
        expires_at: str,
    ) -> bool:
        now = _utc_now()
        with self._lock, closing(self._connect()) as connection:
            with connection:
                existing = connection.execute(
                    """
                    SELECT task_type, owner_id, acquired_at, expires_at
                    FROM system_task_locks
                    WHERE task_type = ?
                    """,
                    (task_type,),
                ).fetchone()
                if existing is not None and _parse_iso8601(existing["expires_at"]) > _parse_iso8601(now):
                    return False
                connection.execute(
                    """
                    INSERT OR REPLACE INTO system_task_locks (
                        task_type,
                        owner_id,
                        acquired_at,
                        expires_at
                    ) VALUES (?, ?, ?, ?)
                    """,
                    (task_type, owner_id, now, expires_at),
                )
        return True

    def release_system_task_lock(self, *, task_type: str, owner_id: str) -> None:
        with self._lock, closing(self._connect()) as connection:
            with connection:
                connection.execute(
                    """
                    DELETE FROM system_task_locks
                    WHERE task_type = ? AND owner_id = ?
                    """,
                    (task_type, owner_id),
                )

    def get_system_task_lock(self, task_type: str) -> SystemTaskLock | None:
        with self._lock, closing(self._connect()) as connection:
            row = connection.execute(
                """
                SELECT task_type, owner_id, acquired_at, expires_at
                FROM system_task_locks
                WHERE task_type = ?
                """,
                (task_type,),
            ).fetchone()
        if row is None:
            return None
        return SystemTaskLock(
            task_type=row["task_type"],
            owner_id=row["owner_id"],
            acquired_at=row["acquired_at"],
            expires_at=row["expires_at"],
        )


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


def _outbox_from_row(row: sqlite3.Row) -> OutboxMessage:
    return OutboxMessage(
        outbox_id=row["outbox_id"],
        session_key=row["session_key"],
        source=row["source"],
        site_url=row["site_url"],
        room_id=row["room_id"],
        sender_user_id=row["sender_user_id"],
        sender_username=row["sender_username"],
        trigger_message_id=row["trigger_message_id"],
        text=row["text"],
        created_at=row["created_at"],
        status=row["status"],
    )


def _system_task_run_from_row(row: sqlite3.Row) -> SystemTaskRun:
    return SystemTaskRun(
        task_run_id=row["task_run_id"],
        task_type=row["task_type"],
        session_key=row["session_key"],
        window_started_at=row["window_started_at"],
        window_ended_at=row["window_ended_at"],
        started_at=row["started_at"],
        completed_at=row["completed_at"],
        status=row["status"],
        codex_session_id=row["codex_session_id"],
        log_path=row["log_path"],
        summary=row["summary"],
        error_detail=row["error_detail"],
    )


def _utc_now() -> str:
    return datetime.now(UTC).isoformat()


def _parse_iso8601(value: str) -> datetime:
    normalized = value.strip()
    if normalized.endswith("Z"):
        normalized = normalized[:-1] + "+00:00"
    parsed = datetime.fromisoformat(normalized)
    if parsed.tzinfo is None:
        return parsed.replace(tzinfo=UTC)
    return parsed.astimezone(UTC)
