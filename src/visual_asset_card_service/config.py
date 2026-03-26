from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


DEFAULT_HOST = "0.0.0.0"
DEFAULT_PORT = 18574
DEFAULT_TABLE = "mobile_capture_asset_cards"


def _load_dotenv_file(path: Path) -> dict[str, str]:
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
        value = raw_value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
            value = value[1:-1]
        values[key] = value
    return values


@dataclass(frozen=True)
class Config:
    host: str
    port: int
    table: str

    @classmethod
    def from_env(cls) -> "Config":
        repo_root = Path(__file__).resolve().parent.parent.parent
        cwd_env = _load_dotenv_file(Path.cwd() / ".env")
        repo_env = _load_dotenv_file(repo_root / ".env")

        def read_value(key: str, default: str = "") -> str:
            value = os.getenv(key)
            if value is not None:
                return value.strip()
            for source in (cwd_env, repo_env):
                value = source.get(key)
                if value is not None:
                    return value.strip()
            return default.strip()

        def read_int(key: str, default: int) -> int:
            raw = read_value(key, str(default))
            try:
                return int(raw)
            except ValueError:
                return default

        return cls(
            host=read_value("VISUAL_ASSET_HOST", DEFAULT_HOST) or DEFAULT_HOST,
            port=read_int("VISUAL_ASSET_PORT", DEFAULT_PORT),
            table=read_value("VISUAL_ASSET_TABLE", DEFAULT_TABLE) or DEFAULT_TABLE,
        )

