from __future__ import annotations

import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Config:
    host: str = "0.0.0.0"
    port: int = 18473
    database_path: str = "var/lux4_daemon.sqlite3"
    reply_push_url: str = ""
    reply_push_token: str = ""
    request_timeout_seconds: float = 10.0

    @classmethod
    def from_env(cls) -> "Config":
        return cls(
            host=os.getenv("LUX4_HOST", "0.0.0.0"),
            port=int(os.getenv("LUX4_PORT", "18473")),
            database_path=os.getenv("LUX4_DB_PATH", "var/lux4_daemon.sqlite3"),
            reply_push_url=os.getenv("LUX4_REPLY_PUSH_URL", "").strip(),
            reply_push_token=os.getenv("LUX4_REPLY_PUSH_TOKEN", "").strip(),
            request_timeout_seconds=float(os.getenv("LUX4_REQUEST_TIMEOUT_SECONDS", "10")),
        )
