from __future__ import annotations

import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Config:
    host: str = "0.0.0.0"
    port: int = 18473
    database_path: str = "var/lux4_daemon.sqlite3"
    cloudflare_account_id: str = ""
    cloudflare_queue_id: str = ""
    cloudflare_api_token: str = ""
    request_timeout_seconds: float = 10.0

    @classmethod
    def from_env(cls) -> "Config":
        return cls(
            host=os.getenv("LUX4_HOST", "0.0.0.0"),
            port=int(os.getenv("LUX4_PORT", "18473")),
            database_path=os.getenv("LUX4_DB_PATH", "var/lux4_daemon.sqlite3"),
            cloudflare_account_id=os.getenv("LUX4_CF_ACCOUNT_ID", "").strip(),
            cloudflare_queue_id=os.getenv("LUX4_CF_QUEUE_ID", "").strip(),
            cloudflare_api_token=os.getenv("LUX4_CF_API_TOKEN", "").strip(),
            request_timeout_seconds=float(os.getenv("LUX4_REQUEST_TIMEOUT_SECONDS", "10")),
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
