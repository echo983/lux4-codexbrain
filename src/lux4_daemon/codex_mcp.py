from __future__ import annotations

import json
import os
import queue
import subprocess
import tempfile
import threading
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Any, Callable

from .config import Config


@dataclass(frozen=True)
class CodexTurnResult:
    session_id: str
    reply_text: str


@dataclass(frozen=True)
class _StdoutMessage:
    raw_line: str
    payload: dict[str, Any]


class CodexExecError(RuntimeError):
    pass


class CodexResumeError(CodexExecError):
    pass


class CodexExecClient:
    def __init__(self, config: Config) -> None:
        self._database_path = config.database_path
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
        self._developer_instructions_path = Path.cwd() / "docs" / "lux-runtime-developer-instructions.md"

        self._lock = threading.Lock()
        self._request_id = 0
        self._process: subprocess.Popen[str] | None = None
        self._stdout_messages: queue.Queue[_StdoutMessage] = queue.Queue()
        self._stderr_lines: list[str] = []
        self._stderr_lock = threading.Lock()
        self._context_file_path = self._make_context_file_path()
        self._initialized = False

    def run_turn(
        self,
        prompt: str,
        session_id: str | None = None,
        *,
        debug_label: str | None = None,
        context: dict[str, str] | None = None,
        on_event: Callable[[dict[str, Any]], None] | None = None,
    ) -> CodexTurnResult:
        self._validate_required_env()

        tool_name = "codex-reply" if session_id else "codex"
        arguments: dict[str, Any] = {"prompt": prompt}
        if session_id:
            arguments["threadId"] = session_id
        else:
            arguments["approval-policy"] = "never"
            arguments["sandbox"] = "workspace-write"
            arguments["cwd"] = str(Path.cwd())
            if self._model:
                arguments["model"] = self._model
        developer_instructions = self._load_developer_instructions()
        if developer_instructions:
            arguments["developer-instructions"] = developer_instructions

        with self._lock:
            self._write_context_file(context or {})
            try:
                response, raw_lines = self._call_tool(tool_name, arguments, on_event=on_event)
            except CodexExecError as exc:
                if session_id:
                    raise CodexResumeError(str(exc)) from exc
                raise
            except Exception as exc:  # pragma: no cover - defensive wrapper
                raise self._build_error(session_id, f"codex MCP request failed: {exc}") from exc

        if self._debug_codex_jsonl:
            self._write_debug_jsonl(raw_lines, debug_label)

        result = response.get("result")
        if not isinstance(result, dict):
            raise self._build_error(session_id, f"codex MCP returned invalid result payload: {response}")
        if result.get("isError") is True:
            detail = self._extract_reply_text(result, result.get("structuredContent") if isinstance(result.get("structuredContent"), dict) else {})
            if not detail:
                detail = _truncate_for_error(json.dumps(result, ensure_ascii=False))
            raise self._build_error(session_id, detail)

        structured = result.get("structuredContent")
        if not isinstance(structured, dict):
            raise self._build_error(session_id, f"codex MCP missing structuredContent: {response}")

        thread_id = structured.get("threadId")
        if not isinstance(thread_id, str) or not thread_id.strip():
            raise self._build_error(session_id, f"codex MCP missing threadId: {response}")

        reply_text = self._extract_reply_text(result, structured)
        return CodexTurnResult(session_id=thread_id.strip(), reply_text=reply_text)

    def close(self) -> None:
        with self._lock:
            self._close_process()

    def _call_tool(
        self,
        tool_name: str,
        arguments: dict[str, Any],
        *,
        on_event: Callable[[dict[str, Any]], None] | None = None,
    ) -> tuple[dict[str, Any], list[str]]:
        self._ensure_started()
        request_id = self._next_request_id()
        raw_lines: list[str] = []
        self._send(
            {
                "jsonrpc": "2.0",
                "id": request_id,
                "method": "tools/call",
                "params": {
                    "name": tool_name,
                    "arguments": arguments,
                },
            }
        )
        response = self._wait_for_response(request_id, raw_lines, on_event=on_event)
        if "error" in response:
            detail = _truncate_for_error(json.dumps(response["error"], ensure_ascii=False))
            raise self._build_error(None if tool_name == "codex" else arguments.get("threadId"), detail)
        return response, raw_lines

    def _ensure_started(self) -> None:
        if self._process is not None and self._process.poll() is None and self._initialized:
            return

        self._close_process()
        self._stderr_lines = []
        self._stdout_messages = queue.Queue()

        process = subprocess.Popen(
            [self._binary, "mcp-server"],
            cwd=str(Path.cwd()),
            env=self._build_env(),
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1,
        )
        self._process = process

        assert process.stdout is not None
        assert process.stderr is not None
        threading.Thread(
            target=self._stdout_reader,
            args=(process.stdout,),
            name="lux4-codex-mcp-stdout",
            daemon=True,
        ).start()
        threading.Thread(
            target=self._stderr_reader,
            args=(process.stderr,),
            name="lux4-codex-mcp-stderr",
            daemon=True,
        ).start()

        initialize_id = self._next_request_id()
        self._send(
            {
                "jsonrpc": "2.0",
                "id": initialize_id,
                "method": "initialize",
                "params": {
                    "protocolVersion": "2025-03-26",
                    "capabilities": {},
                    "clientInfo": {
                        "name": "lux4-daemon",
                        "version": "0.1",
                    },
                },
            }
        )
        self._wait_for_response(initialize_id, [])
        self._send({"jsonrpc": "2.0", "method": "notifications/initialized", "params": {}})
        self._initialized = True

    def _stdout_reader(self, stream: Any) -> None:
        for raw_line in stream:
            line = raw_line.strip()
            if not line:
                continue
            try:
                payload = json.loads(line)
            except json.JSONDecodeError:
                continue
            if isinstance(payload, dict):
                self._stdout_messages.put(_StdoutMessage(raw_line=line, payload=payload))

    def _stderr_reader(self, stream: Any) -> None:
        for raw_line in stream:
            line = raw_line.rstrip("\n")
            if not line:
                continue
            with self._stderr_lock:
                self._stderr_lines.append(line)
                if len(self._stderr_lines) > 200:
                    self._stderr_lines = self._stderr_lines[-200:]

    def _wait_for_response(
        self,
        request_id: int,
        raw_lines: list[str],
        *,
        on_event: Callable[[dict[str, Any]], None] | None = None,
    ) -> dict[str, Any]:
        deadline = _monotonic_deadline(self._timeout)
        while True:
            if deadline.reached():
                self._close_process()
                raise CodexExecError(f"codex MCP timed out after {self._timeout:.1f} seconds")

            timeout = deadline.remaining_seconds(default=0.1)
            try:
                message = self._stdout_messages.get(timeout=timeout)
            except queue.Empty:
                if self._process is not None and self._process.poll() is not None:
                    detail = self._recent_stderr() or "codex MCP server exited unexpectedly"
                    self._close_process()
                    raise CodexExecError(_truncate_for_error(detail))
                continue

            raw_lines.append(message.raw_line)
            payload = message.payload
            if payload.get("method") == "codex/event" and on_event is not None:
                on_event(payload)
            if payload.get("id") == request_id:
                return payload

    def _send(self, payload: dict[str, Any]) -> None:
        process = self._process
        if process is None or process.stdin is None:
            raise CodexExecError("codex MCP server is not running")
        try:
            process.stdin.write(json.dumps(payload, ensure_ascii=False) + "\n")
            process.stdin.flush()
        except BrokenPipeError as exc:
            self._close_process()
            raise CodexExecError("codex MCP server pipe closed unexpectedly") from exc

    def _build_env(self) -> dict[str, str]:
        env = os.environ.copy()
        if self._api_key and "CODEX_API_KEY" not in env:
            env["CODEX_API_KEY"] = self._api_key
        env["NEO4J_URI"] = self._neo4j_uri
        env["NEO4J_USERNAME"] = self._neo4j_username
        env["NEO4J_PASSWORD"] = self._neo4j_password
        if self._neo4j_database:
            env["NEO4J_DATABASE"] = self._neo4j_database
        env["LUX4_AGENT_DB_PATH"] = self._database_path
        env["LUX4_AGENT_CONTEXT_FILE"] = str(self._context_file_path)
        return env

    def _validate_required_env(self) -> None:
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

    def _load_developer_instructions(self) -> str:
        path = self._developer_instructions_path
        if not path.exists():
            return ""
        return path.read_text(encoding="utf-8").strip()

    def _write_context_file(self, context: dict[str, str]) -> None:
        self._context_file_path.parent.mkdir(parents=True, exist_ok=True)
        self._context_file_path.write_text(
            json.dumps(context, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

    def _next_request_id(self) -> int:
        self._request_id += 1
        return self._request_id

    def _recent_stderr(self) -> str:
        with self._stderr_lock:
            return "\n".join(self._stderr_lines[-20:])

    def _close_process(self) -> None:
        process = self._process
        self._initialized = False
        self._process = None
        if process is None:
            return
        try:
            if process.stdin is not None:
                process.stdin.close()
        except OSError:
            pass
        if process.poll() is None:
            process.terminate()
            try:
                process.wait(timeout=2)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait(timeout=2)

    def _extract_reply_text(self, result: dict[str, Any], structured: dict[str, Any]) -> str:
        content = structured.get("content")
        if isinstance(content, str):
            return content.strip()

        raw_content = result.get("content")
        if isinstance(raw_content, list):
            for item in raw_content:
                if isinstance(item, dict) and item.get("type") == "text":
                    text = item.get("text")
                    if isinstance(text, str):
                        return text.strip()
        return ""

    def _write_debug_jsonl(self, raw_lines: list[str], debug_label: str | None) -> None:
        self._debug_codex_jsonl_dir.mkdir(parents=True, exist_ok=True)
        timestamp = datetime.now(UTC).strftime("%Y%m%dT%H%M%SZ")
        safe_label = _sanitize_debug_label(debug_label or "turn")
        path = self._debug_codex_jsonl_dir / f"{timestamp}-{safe_label}.jsonl"
        text = "\n".join(raw_lines)
        if text and not text.endswith("\n"):
            text += "\n"
        path.write_text(text, encoding="utf-8")

    def _build_error(self, session_id: str | None, detail: str) -> CodexExecError:
        message = f"codex MCP request failed: {detail}"
        if session_id:
            return CodexResumeError(message)
        return CodexExecError(message)

    def _make_context_file_path(self) -> Path:
        fd, raw_path = tempfile.mkstemp(prefix="lux4-codex-context-", suffix=".json")
        os.close(fd)
        return Path(raw_path)


@dataclass(frozen=True)
class _Deadline:
    end_monotonic: float

    def reached(self) -> bool:
        return self.remaining_seconds(default=0.0) <= 0.0

    def remaining_seconds(self, *, default: float) -> float:
        import time

        if not self.end_monotonic:
            return default
        return max(0.0, self.end_monotonic - time.monotonic())


def _monotonic_deadline(timeout_seconds: float) -> _Deadline:
    import time

    return _Deadline(end_monotonic=time.monotonic() + timeout_seconds)


def _truncate_for_error(text: str, limit: int = 400) -> str:
    compact = " ".join(text.split())
    if len(compact) <= limit:
        return compact
    return compact[:limit].rstrip() + "..."


def _sanitize_debug_label(label: str) -> str:
    cleaned = "".join(char if char.isalnum() or char in {"-", "_"} else "-" for char in label.strip())
    cleaned = cleaned.strip("-")
    return cleaned or "turn"
