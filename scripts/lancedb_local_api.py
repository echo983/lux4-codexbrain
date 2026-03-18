from __future__ import annotations

import json
import os
from pathlib import Path
from urllib import error, request


DEFAULT_LANCEDB_URL = "http://127.0.0.1:24681"


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
        value = raw_value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
            value = value[1:-1]
        values[key] = value
    return values


def resolve_lancedb_url() -> str:
    repo_root = Path(__file__).resolve().parent.parent
    cwd_env = load_dotenv_file(Path.cwd() / ".env")
    repo_env = load_dotenv_file(repo_root / ".env")

    for key in ("LUX4_LANCEDB_URL", "LANCEDB_URL"):
        value = os.getenv(key)
        if value is not None and value.strip():
            return value.strip().rstrip("/")
    for source in (cwd_env, repo_env):
        for key in ("LUX4_LANCEDB_URL", "LANCEDB_URL"):
            value = source.get(key)
            if value is not None and value.strip():
                return value.strip().rstrip("/")
    return DEFAULT_LANCEDB_URL


def post_json(url: str, payload: dict) -> dict:
    req = request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with request.urlopen(req, timeout=30) as response:
            body = response.read().decode("utf-8")
    except error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"LanceDB request failed with HTTP {exc.code}: {detail}") from exc
    except error.URLError as exc:
        raise RuntimeError(f"LanceDB request failed: {exc}") from exc
    return json.loads(body)
