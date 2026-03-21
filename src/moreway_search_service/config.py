from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


DEFAULT_HOST = "0.0.0.0"
DEFAULT_PORT = 18561
DEFAULT_TABLES = [
    "google_keep_asset_cards_directmd_eval200",
    "google_keep_raw_md",
]
DEFAULT_VECTOR_LIMIT = 50
DEFAULT_PER_PAGE = 20
DEFAULT_MIN_SCORE = 0.4


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
    tables: list[str]
    vector_limit: int
    per_page: int
    min_score: float

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

        def read_float(key: str, default: float) -> float:
            raw = read_value(key, str(default))
            try:
                return float(raw)
            except ValueError:
                return default

        def read_list(key: str, default: list[str]) -> list[str]:
            raw = read_value(key, ",".join(default))
            items = [part.strip() for part in raw.split(",") if part.strip()]
            return items or list(default)

        return cls(
            host=read_value("MOREWAY_HOST", DEFAULT_HOST) or DEFAULT_HOST,
            port=read_int("MOREWAY_PORT", DEFAULT_PORT),
            tables=read_list("MOREWAY_SEARCH_TABLES", DEFAULT_TABLES),
            vector_limit=read_int("MOREWAY_VECTOR_LIMIT", DEFAULT_VECTOR_LIMIT),
            per_page=read_int("MOREWAY_PER_PAGE", DEFAULT_PER_PAGE),
            min_score=read_float("MOREWAY_MIN_SCORE", DEFAULT_MIN_SCORE),
        )
