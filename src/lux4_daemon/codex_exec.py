from __future__ import annotations

import json
import os
import subprocess
import tempfile
from dataclasses import dataclass
from datetime import datetime, UTC
from pathlib import Path

from .config import Config


@dataclass(frozen=True)
class CodexTurnResult:
    session_id: str
    reply_text: str


class CodexExecError(RuntimeError):
    pass


class CodexResumeError(CodexExecError):
    pass


class CodexExecClient:
    def __init__(self, config: Config) -> None:
        self._binary = config.codex_binary
        self._model = config.codex_model
        self._api_key = config.codex_api_key
        self._neo4j_uri = config.neo4j_uri
        self._neo4j_username = config.neo4j_username
        self._neo4j_password = config.neo4j_password
        self._neo4j_database = config.neo4j_database
        self._timeout = config.codex_timeout_seconds
        self._debug_codex_jsonl = config.debug_codex_jsonl
        self._debug_codex_jsonl_dir = Path(config.debug_codex_jsonl_dir)

    def run_turn(
        self,
        prompt: str,
        session_id: str | None = None,
        *,
        debug_label: str | None = None,
    ) -> CodexTurnResult:
        output_path = self._make_output_path()
        command = self._build_command(prompt, output_path, session_id)
        completed = subprocess.run(
            command,
            cwd=str(Path.cwd()),
            env=self._build_env(),
            capture_output=True,
            text=True,
            timeout=self._timeout,
            check=False,
        )

        stdout_text = completed.stdout
        stderr_text = completed.stderr

        if self._debug_codex_jsonl:
            self._write_debug_jsonl(stdout_text, debug_label)

        if completed.returncode != 0:
            raise self._build_error(session_id, completed.returncode, stdout_text, stderr_text)

        thread_id = _parse_thread_id(stdout_text)
        if not thread_id:
            raise CodexExecError(f"codex exec did not emit thread id: {stdout_text.strip()}")

        reply_text = output_path.read_text(encoding="utf-8").strip()
        if not reply_text:
            raise CodexExecError("codex exec returned an empty final reply")

        return CodexTurnResult(session_id=thread_id, reply_text=reply_text)

    def _build_command(self, prompt: str, output_path: Path, session_id: str | None) -> list[str]:
        if session_id:
            command = [self._binary, "exec", "resume", session_id]
        else:
            command = [self._binary, "exec"]
            command.append("--full-auto")

        command.extend(["--json", "-o", str(output_path)])
        if self._model:
            command.extend(["--model", self._model])
        command.append(prompt)
        return command

    def _build_env(self) -> dict[str, str]:
        missing = []
        if not self._neo4j_uri:
            missing.append("NEO4J_URI or NEO4J_BOLT_URL")
        if not self._neo4j_username:
            missing.append("NEO4J_USERNAME or NEO4J_USER")
        if not self._neo4j_password:
            missing.append("NEO4J_PASSWORD")
        if missing:
            raise CodexExecError(
                "Missing required Neo4j configuration. "
                "Set it in the process environment or the current working directory .env file: "
                + ", ".join(missing)
            )

        env = os.environ.copy()
        if self._api_key and "CODEX_API_KEY" not in env:
            env["CODEX_API_KEY"] = self._api_key
        env["NEO4J_URI"] = self._neo4j_uri
        env["NEO4J_USERNAME"] = self._neo4j_username
        env["NEO4J_PASSWORD"] = self._neo4j_password
        if self._neo4j_database:
            env["NEO4J_DATABASE"] = self._neo4j_database
        return env

    def _build_error(
        self,
        session_id: str | None,
        returncode: int,
        stdout_text: str,
        stderr_text: str,
    ) -> CodexExecError:
        detail = _truncate_for_error(stderr_text.strip() or stdout_text.strip())
        message = f"codex exec failed with exit code {returncode}"
        if detail:
            message = f"{message}: {detail}"
        if session_id:
            return CodexResumeError(message)
        return CodexExecError(message)

    def _make_output_path(self) -> Path:
        fd, raw_path = tempfile.mkstemp(prefix="lux4-codex-", suffix=".txt")
        os.close(fd)
        return Path(raw_path)

    def _write_debug_jsonl(self, stdout_text: str, debug_label: str | None) -> None:
        self._debug_codex_jsonl_dir.mkdir(parents=True, exist_ok=True)
        timestamp = datetime.now(UTC).strftime("%Y%m%dT%H%M%SZ")
        safe_label = _sanitize_debug_label(debug_label or "turn")
        path = self._debug_codex_jsonl_dir / f"{timestamp}-{safe_label}.jsonl"
        path.write_text(stdout_text, encoding="utf-8")


def _parse_thread_id(stdout_text: str) -> str | None:
    for line in stdout_text.splitlines():
        if not line.strip():
            continue
        try:
            event = json.loads(line)
        except json.JSONDecodeError:
            continue
        if event.get("type") == "thread.started":
            thread_id = event.get("thread_id")
            if isinstance(thread_id, str) and thread_id.strip():
                return thread_id.strip()
    return None


def _truncate_for_error(text: str, limit: int = 400) -> str:
    compact = " ".join(text.split())
    if len(compact) <= limit:
        return compact
    return compact[:limit].rstrip() + "..."


def _sanitize_debug_label(label: str) -> str:
    cleaned = "".join(char if char.isalnum() or char in {"-", "_"} else "-" for char in label.strip())
    cleaned = cleaned.strip("-")
    return cleaned or "turn"
