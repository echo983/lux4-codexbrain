from __future__ import annotations

import os
import shutil
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Config:
    host: str = "0.0.0.0"
    port: int = 18473
    database_path: str = "var/lux4_daemon.sqlite3"
    cloudflare_account_id: str = ""
    cloudflare_queue_id: str = ""
    cloudflare_api_token: str = ""
    codex_binary: str = "codex"
    codex_model: str = ""
    codex_api_key: str = ""
    neo4j_uri: str = ""
    neo4j_username: str = ""
    neo4j_password: str = ""
    neo4j_database: str = ""
    codex_timeout_seconds: float = 3600.0
    debug_sessions: bool = False
    debug_codex_jsonl: bool = False
    debug_codex_jsonl_dir: str = "var/codex_jsonl"
    request_timeout_seconds: float = 10.0

    @classmethod
    def from_env(cls) -> "Config":
        dotenv_values = load_dotenv_file(Path.cwd() / ".env")
        configured_codex_binary = read_config_value("LUX4_CODEX_BINARY", dotenv_values, "codex")
        return cls(
            host=read_config_value("LUX4_HOST", dotenv_values, "0.0.0.0"),
            port=int(read_config_value("LUX4_PORT", dotenv_values, "18473")),
            database_path=read_config_value("LUX4_DB_PATH", dotenv_values, "var/lux4_daemon.sqlite3"),
            cloudflare_account_id=read_config_value("LUX4_CF_ACCOUNT_ID", dotenv_values, ""),
            cloudflare_queue_id=read_config_value("LUX4_CF_QUEUE_ID", dotenv_values, ""),
            cloudflare_api_token=read_config_value("LUX4_CF_API_TOKEN", dotenv_values, ""),
            codex_binary=resolve_executable(configured_codex_binary),
            codex_model=read_config_value("LUX4_CODEX_MODEL", dotenv_values, ""),
            codex_api_key=read_config_value("CODEX_API_KEY", dotenv_values, ""),
            neo4j_uri=read_config_alias(("NEO4J_URI", "NEO4J_BOLT_URL"), dotenv_values, ""),
            neo4j_username=read_config_alias(("NEO4J_USERNAME", "NEO4J_USER"), dotenv_values, ""),
            neo4j_password=read_config_value("NEO4J_PASSWORD", dotenv_values, ""),
            neo4j_database=read_config_value("NEO4J_DATABASE", dotenv_values, ""),
            codex_timeout_seconds=float(read_config_value("LUX4_CODEX_TIMEOUT_SECONDS", dotenv_values, "3600")),
            debug_sessions=read_config_flag("LUX4_DEBUG_SESSIONS", dotenv_values, False),
            debug_codex_jsonl=read_config_flag("LUX4_DEBUG_CODEX_JSONL", dotenv_values, False),
            debug_codex_jsonl_dir=read_config_value("LUX4_DEBUG_CODEX_JSONL_DIR", dotenv_values, "var/codex_jsonl"),
            request_timeout_seconds=float(read_config_value("LUX4_REQUEST_TIMEOUT_SECONDS", dotenv_values, "10")),
        )

    def validate_for_startup(self) -> None:
        missing = []
        if not self.cloudflare_account_id:
            missing.append("LUX4_CF_ACCOUNT_ID")
        if not self.cloudflare_queue_id:
            missing.append("LUX4_CF_QUEUE_ID")
        if not self.cloudflare_api_token:
            missing.append("LUX4_CF_API_TOKEN")

        if missing:
            raise RuntimeError(
                "Missing required Cloudflare Queue configuration: " + ", ".join(missing)
            )


def read_config_value(key: str, dotenv_values: dict[str, str], default: str) -> str:
    value = os.getenv(key)
    if value is not None:
        return value.strip()
    return dotenv_values.get(key, default).strip()


def read_config_alias(keys: tuple[str, ...], dotenv_values: dict[str, str], default: str) -> str:
    for key in keys:
        value = os.getenv(key)
        if value is not None:
            return value.strip()
    for key in keys:
        value = dotenv_values.get(key)
        if value is not None:
            return value.strip()
    return default.strip()


def load_dotenv_file(path: Path) -> dict[str, str]:
    if not path.exists():
        return {}

    values: dict[str, str] = {}
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue

        if line.startswith("export "):
            line = line[7:].strip()

        if "=" not in line:
            continue

        key, raw_value = line.split("=", 1)
        key = key.strip()
        if not key:
            continue

        values[key] = parse_dotenv_value(raw_value.strip())

    return values


def parse_dotenv_value(raw_value: str) -> str:
    if len(raw_value) >= 2 and raw_value[0] == raw_value[-1] and raw_value[0] in {"'", '"'}:
        return raw_value[1:-1]
    return raw_value


def read_config_flag(key: str, dotenv_values: dict[str, str], default: bool) -> bool:
    raw_default = "1" if default else "0"
    value = read_config_value(key, dotenv_values, raw_default).lower()
    return value in {"1", "true", "yes", "on"}


def resolve_executable(command: str) -> str:
    candidate = command.strip()
    if not candidate:
        return candidate

    if os.path.sep in candidate:
        return candidate

    resolved = shutil.which(candidate)
    if resolved:
        return resolved

    fallback = Path("/usr/local/bin") / candidate
    if fallback.exists():
        return str(fallback)

    return candidate
