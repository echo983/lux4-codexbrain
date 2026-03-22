from __future__ import annotations

import logging
import uuid
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from pathlib import Path

from .codex_mcp import CodexExecClient, CodexExecError, CodexResumeError
from .flow_debug import build_flow_debug_logger
from .models import ConversationSession, SystemTaskRun
from .session_store import SessionStore

LOGGER = logging.getLogger(__name__)


@dataclass(frozen=True)
class SystemTaskBatchResult:
    task_type: str
    processed_sessions: int
    skipped: bool
    reason: str
    runs: list[SystemTaskRun]
    batch_log_path: str | None = None


class SystemTaskRunner:
    def __init__(
        self,
        store: SessionStore,
        client: CodexExecClient,
        *,
        log_dir: str = "var/system_task_logs",
        debug_flow_logs: bool = False,
        debug_flow_logs_dir: str = "var/flow_debug",
    ) -> None:
        self._store = store
        self._client = client
        self._log_dir = Path(log_dir)
        self._debug_flow_logs = debug_flow_logs
        self._debug_flow_logs_dir = debug_flow_logs_dir
        self._developer_instructions = self._load_system_task_instructions()

    def run_memory_extraction(self, *, window_minutes: int = 10) -> SystemTaskBatchResult:
        owner_id = uuid.uuid4().hex
        now = datetime.now(UTC)
        since = now - timedelta(minutes=window_minutes)
        expires_at = now + timedelta(minutes=max(window_minutes, 10))
        if not self._store.acquire_system_task_lock(
            task_type="memory_extraction",
            owner_id=owner_id,
            expires_at=expires_at.isoformat(),
        ):
            return self._build_batch_result(
                task_type="memory_extraction",
                skipped=True,
                reason="another memory_extraction run is already in progress",
                runs=[],
                window_started_at=since,
                window_ended_at=now,
            )

        sessions = self._store.get_recently_active_sessions(since=since)
        try:
            if not sessions:
                return self._build_batch_result(
                    task_type="memory_extraction",
                    skipped=True,
                    reason=f"no session activity in the last {window_minutes} minutes",
                    runs=[],
                    window_started_at=since,
                    window_ended_at=now,
                )

            runs = []
            for session in sessions:
                run = self._run_single_task(
                    task_type="memory_extraction",
                    session=session,
                    window_started_at=since,
                    window_ended_at=now,
                    prompt=self._build_memory_extraction_prompt(session, since, now),
                )
                runs.append(run)
            return self._build_batch_result(
                task_type="memory_extraction",
                skipped=False,
                reason="processed active sessions",
                runs=runs,
                window_started_at=since,
                window_ended_at=now,
            )
        finally:
            self._store.release_system_task_lock(task_type="memory_extraction", owner_id=owner_id)

    def run_memory_consolidation(self, *, window_hours: int = 4) -> SystemTaskBatchResult:
        owner_id = uuid.uuid4().hex
        now = datetime.now(UTC)
        since = now - timedelta(hours=window_hours)
        expires_at = now + timedelta(hours=max(window_hours, 4))
        if not self._store.acquire_system_task_lock(
            task_type="memory_consolidation",
            owner_id=owner_id,
            expires_at=expires_at.isoformat(),
        ):
            return self._build_batch_result(
                task_type="memory_consolidation",
                skipped=True,
                reason="another memory_consolidation run is already in progress",
                runs=[],
                window_started_at=since,
                window_ended_at=now,
            )

        extraction_runs = self._store.get_recent_system_task_runs(
            task_type="memory_extraction",
            since=since,
            status="succeeded",
        )
        try:
            if not extraction_runs:
                return self._build_batch_result(
                    task_type="memory_consolidation",
                    skipped=True,
                    reason=f"no successful memory extraction in the last {window_hours} hours",
                    runs=[],
                    window_started_at=since,
                    window_ended_at=now,
                )

            sessions_by_key: dict[str, ConversationSession] = {}
            for run in extraction_runs:
                session = self._store.get_session(run.session_key)
                if session is not None:
                    sessions_by_key[session.session_key] = session

            runs = []
            for session in sessions_by_key.values():
                consolidation_run = self._run_single_task(
                    task_type="memory_consolidation",
                    session=session,
                    window_started_at=since,
                    window_ended_at=now,
                    prompt=self._build_memory_consolidation_prompt(session, since, now),
                )
                runs.append(consolidation_run)
                insight = _extract_insight_block(consolidation_run.summary)
                if insight:
                    insight_run = self._run_single_task(
                        task_type="memory_insight_injection",
                        session=session,
                        window_started_at=since,
                        window_ended_at=now,
                        prompt=self._build_insight_injection_prompt(insight),
                    )
                    runs.append(insight_run)
            return self._build_batch_result(
                task_type="memory_consolidation",
                skipped=False,
                reason="processed sessions with recent memory extraction activity",
                runs=runs,
                window_started_at=since,
                window_ended_at=now,
            )
        finally:
            self._store.release_system_task_lock(task_type="memory_consolidation", owner_id=owner_id)

    def _run_single_task(
        self,
        *,
        task_type: str,
        session: ConversationSession,
        window_started_at: datetime,
        window_ended_at: datetime,
        prompt: str,
    ) -> SystemTaskRun:
        started_at = datetime.now(UTC)
        status = "succeeded"
        latest_session = self._store.get_session(session.session_key) or session
        latest_task_session = self._store.get_system_task_session(latest_session.session_key, task_type)
        previous_codex_session_id = latest_task_session.codex_session_id if latest_task_session is not None else None
        codex_session_id = previous_codex_session_id
        error_detail = ""
        summary = ""
        log_path: str | None = None
        context = self._build_context(latest_session)
        debug_logger = build_flow_debug_logger(
            enabled=self._debug_flow_logs,
            root_dir=self._debug_flow_logs_dir,
            category="system_tasks",
            flow_id=f"{task_type}-{latest_session.last_message_id}",
        )
        debug_logger.event(
            "system_task_start",
            task_type=task_type,
            session_key=latest_session.session_key,
            prompt=prompt,
            context=context,
            previous_codex_session_id=previous_codex_session_id,
            window_started_at=window_started_at.isoformat(),
            window_ended_at=window_ended_at.isoformat(),
        )

        try:
            turn = self._run_task_turn(
                task_type=task_type,
                session=latest_session,
                prompt=prompt,
                context=context,
            )
            codex_session_id = turn.session_id
            summary = turn.reply_text.strip()
            self._store.set_system_task_codex_session(latest_session.session_key, task_type, turn.session_id)
            debug_logger.event(
                "system_task_complete",
                task_type=task_type,
                session_key=latest_session.session_key,
                resulting_codex_session_id=codex_session_id,
                summary=summary,
            )
        except CodexExecError as exc:
            status = "failed"
            error_detail = str(exc)
            summary = ""
            debug_logger.event(
                "system_task_failed",
                task_type=task_type,
                session_key=latest_session.session_key,
                error=error_detail,
            )
            LOGGER.exception("system task failed", extra={"task_type": task_type, "session_key": latest_session.session_key})

        completed_at = datetime.now(UTC)
        log_path = self._write_log(
            task_type=task_type,
            session=latest_session,
            window_started_at=window_started_at,
            window_ended_at=window_ended_at,
            started_at=started_at,
            completed_at=completed_at,
            status=status,
            previous_codex_session_id=previous_codex_session_id,
            resulting_codex_session_id=codex_session_id,
            context=context,
            prompt=prompt,
            summary=summary,
            error_detail=error_detail,
        )
        return self._store.record_system_task_run(
            task_type=task_type,
            session_key=session.session_key,
            window_started_at=window_started_at.isoformat(),
            window_ended_at=window_ended_at.isoformat(),
            started_at=started_at.isoformat(),
            completed_at=completed_at.isoformat(),
            status=status,
            codex_session_id=codex_session_id,
            log_path=log_path,
            summary=summary,
            error_detail=error_detail,
        )

    def _run_task_turn(
        self,
        *,
        task_type: str,
        session: ConversationSession,
        prompt: str,
        context: dict[str, str],
    ):
        task_session = self._store.get_system_task_session(session.session_key, task_type)
        current_session_id = task_session.codex_session_id if task_session is not None else None
        debug_label = f"{task_type}-{session.last_message_id}"
        if current_session_id:
            try:
                return self._client.run_turn(
                    prompt,
                    session_id=current_session_id,
                    debug_label=debug_label,
                    context=context,
                    developer_instructions=self._developer_instructions,
                )
            except CodexResumeError:
                self._store.clear_system_task_codex_session(session.session_key, task_type)
                return self._client.run_turn(
                    prompt,
                    debug_label=debug_label,
                    context=context,
                    developer_instructions=self._developer_instructions,
                )
        return self._client.run_turn(
            prompt,
            debug_label=debug_label,
            context=context,
            developer_instructions=self._developer_instructions,
        )

    def _build_context(self, session: ConversationSession) -> dict[str, str]:
        return {
            "LUX4_AGENT_SESSION_KEY": session.session_key,
            "LUX4_AGENT_SOURCE": session.source,
            "LUX4_AGENT_SITE_URL": session.site_url,
            "LUX4_AGENT_ROOM_ID": session.room_id,
            "LUX4_AGENT_SENDER_USER_ID": session.sender_user_id,
            "LUX4_AGENT_SENDER_USERNAME": session.sender_username,
            "LUX4_AGENT_TRIGGER_MESSAGE_ID": session.last_message_id,
        }

    def _load_system_task_instructions(self) -> str:
        path = Path.cwd() / "docs" / "system-task-runtime-developer-instructions.md"
        if not path.exists():
            return ""
        return path.read_text(encoding="utf-8").strip()

    def _build_batch_result(
        self,
        *,
        task_type: str,
        skipped: bool,
        reason: str,
        runs: list[SystemTaskRun],
        window_started_at: datetime,
        window_ended_at: datetime,
    ) -> SystemTaskBatchResult:
        batch_log_path = self._write_batch_log(
            task_type=task_type,
            skipped=skipped,
            reason=reason,
            runs=runs,
            window_started_at=window_started_at,
            window_ended_at=window_ended_at,
        )
        self._write_batch_debug_log(
            task_type=task_type,
            skipped=skipped,
            reason=reason,
            runs=runs,
            window_started_at=window_started_at,
            window_ended_at=window_ended_at,
        )
        return SystemTaskBatchResult(
            task_type=task_type,
            processed_sessions=len({run.session_key for run in runs}),
            skipped=skipped,
            reason=reason,
            runs=runs,
            batch_log_path=batch_log_path,
        )

    def _write_log(
        self,
        *,
        task_type: str,
        session: ConversationSession,
        window_started_at: datetime,
        window_ended_at: datetime,
        started_at: datetime,
        completed_at: datetime,
        status: str,
        previous_codex_session_id: str | None,
        resulting_codex_session_id: str | None,
        context: dict[str, str],
        prompt: str,
        summary: str,
        error_detail: str,
    ) -> str:
        self._log_dir.mkdir(parents=True, exist_ok=True)
        filename = (
            f"{started_at.strftime('%Y%m%dT%H%M%SZ')}"
            f"-{task_type}-{_sanitize_for_filename(session.sender_user_id)}.log"
        )
        path = self._log_dir / filename
        path.write_text(
            "\n".join(
                [
                    f"task_type: {task_type}",
                    f"session_key: {session.session_key}",
                    f"source: {session.source}",
                    f"site_url: {session.site_url}",
                    f"room_id: {session.room_id}",
                    f"sender_user_id: {session.sender_user_id}",
                    f"sender_username: {session.sender_username}",
                    f"last_message_id: {session.last_message_id}",
                    f"last_message_at: {session.last_message_at}",
                    f"window_started_at: {window_started_at.isoformat()}",
                    f"window_ended_at: {window_ended_at.isoformat()}",
                    f"started_at: {started_at.isoformat()}",
                    f"completed_at: {completed_at.isoformat()}",
                    f"status: {status}",
                    f"previous_codex_session_id: {previous_codex_session_id or '(none)'}",
                    f"resulting_codex_session_id: {resulting_codex_session_id or '(none)'}",
                    "",
                    "context:",
                    *(f"{key}={value}" for key, value in sorted(context.items())),
                    "",
                    "prompt:",
                    prompt,
                    "",
                    "summary:",
                    summary or "(empty)",
                    "",
                    "error_detail:",
                    error_detail or "(none)",
                ]
            ),
            encoding="utf-8",
        )
        return str(path)

    def _write_batch_log(
        self,
        *,
        task_type: str,
        skipped: bool,
        reason: str,
        runs: list[SystemTaskRun],
        window_started_at: datetime,
        window_ended_at: datetime,
    ) -> str:
        self._log_dir.mkdir(parents=True, exist_ok=True)
        started_at = datetime.now(UTC)
        path = self._log_dir / (
            f"{started_at.strftime('%Y%m%dT%H%M%SZ')}-batch-{task_type}.log"
        )
        path.write_text(
            "\n".join(
                [
                    f"task_type: {task_type}",
                    f"batch_started_at: {started_at.isoformat()}",
                    f"window_started_at: {window_started_at.isoformat()}",
                    f"window_ended_at: {window_ended_at.isoformat()}",
                    f"skipped: {str(skipped).lower()}",
                    f"reason: {reason}",
                    f"run_count: {len(runs)}",
                    "",
                    "runs:",
                    *(
                        f"- task_run_id={run.task_run_id} session_key={run.session_key} status={run.status} log_path={run.log_path or '(none)'}"
                        for run in runs
                    ),
                ]
            ),
            encoding="utf-8",
        )
        return str(path)

    def _write_batch_debug_log(
        self,
        *,
        task_type: str,
        skipped: bool,
        reason: str,
        runs: list[SystemTaskRun],
        window_started_at: datetime,
        window_ended_at: datetime,
    ) -> None:
        debug_logger = build_flow_debug_logger(
            enabled=self._debug_flow_logs,
            root_dir=self._debug_flow_logs_dir,
            category="system_task_batches",
            flow_id=f"{task_type}-{window_ended_at.strftime('%Y%m%dT%H%M%SZ')}",
        )
        debug_logger.event(
            "batch_result",
            task_type=task_type,
            skipped=skipped,
            reason=reason,
            processed_sessions=len({run.session_key for run in runs}),
            window_started_at=window_started_at.isoformat(),
            window_ended_at=window_ended_at.isoformat(),
            runs=[
                {
                    "task_run_id": run.task_run_id,
                    "session_key": run.session_key,
                    "status": run.status,
                    "log_path": run.log_path,
                }
                for run in runs
            ],
        )

    def _build_memory_extraction_prompt(
        self,
        session: ConversationSession,
        window_started_at: datetime,
        window_ended_at: datetime,
    ) -> str:
        recent_messages = self._store.get_recent_messages(session.session_key, since=window_started_at)
        recent_consciousness = self._store.get_consciousness_stream_entries_since(
            session.session_key,
            since=window_started_at,
        )
        transcript = "\n".join(
            f"- [{item['created_at']}] {item['direction']} {item['message_id']}: {item['text']}"
            for item in recent_messages
        ) or "- (no recent messages found)"
        consciousness_log = "\n".join(
            f"- [{entry.created_at}] {entry.trigger_message_id}: {entry.text}"
            for entry in recent_consciousness
        ) or "- (no consciousness stream records found)"
        return "\n".join(
            [
                "System framework command. This is not user speech.",
                "Task: memory_extraction",
                "Do not send any user-facing message.",
                "Use the existing conversation session plus the recent conversation transcript and the recent consciousness-stream records below.",
                "Review the recent window and write durable facts, entities, and intentions worth keeping to long-term memory in Neo4j.",
                "Only store memory that is actually justified by the recent conversation.",
                "Each memory item must include timestamp, confidence, retention level, source type, and source reference.",
                "If nothing is worth storing, say so in the internal task log.",
                "Return an internal task log with clear sections for actions, memories written, memories skipped, and conflicts.",
                f"Window start: {window_started_at.isoformat()}",
                f"Window end: {window_ended_at.isoformat()}",
                f"Session key: {session.session_key}",
                f"User ID: {session.sender_user_id}",
                f"Username: {session.sender_username}",
                "Recent conversation transcript:",
                transcript,
                "Recent consciousness stream records in this window:",
                consciousness_log,
            ]
        )

    def _build_memory_consolidation_prompt(
        self,
        session: ConversationSession,
        window_started_at: datetime,
        window_ended_at: datetime,
    ) -> str:
        return "\n".join(
            [
                "System framework command. This is not user speech.",
                "Task: memory_consolidation_sleep",
                "Do not send any user-facing message.",
                "Inspect the user's recent long-term memory activity in Neo4j for the last 4 hours.",
                "Consolidate, merge, reassess, deduplicate, delete low-value or incorrect items, and adjust confidence where needed.",
                "You may use GDS if it materially helps the consolidation work.",
                "Leave a complete internal log.",
                "At the end of the log, include a section exactly titled '## Insight For Session' containing a short internal perception/insight block to inject back into the session.",
                f"Window start: {window_started_at.isoformat()}",
                f"Window end: {window_ended_at.isoformat()}",
                f"Session key: {session.session_key}",
                f"User ID: {session.sender_user_id}",
                f"Username: {session.sender_username}",
            ]
        )

    def _build_insight_injection_prompt(self, insight: str) -> str:
        return "\n".join(
            [
                "System framework command. This is not user speech.",
                "Task: memory_insight_injection",
                "Do not send any user-facing message.",
                "Absorb the following internal perception and insight into the current session state for future reasoning.",
                "Keep the final output empty.",
                "",
                "Insight:",
                insight.strip(),
            ]
        )


def _extract_insight_block(summary: str) -> str:
    marker = "## Insight For Session"
    if marker not in summary:
        return ""
    _, block = summary.split(marker, 1)
    return block.strip()


def _sanitize_for_filename(value: str) -> str:
    cleaned = "".join(ch if ch.isalnum() or ch in {"-", "_"} else "-" for ch in value)
    return cleaned.strip("-") or "session"
