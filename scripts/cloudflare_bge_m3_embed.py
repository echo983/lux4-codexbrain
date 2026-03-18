#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from urllib import error, request


DEFAULT_MODEL = "@cf/baai/bge-m3"


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


def resolve_config() -> tuple[str, str, str]:
    repo_root = Path(__file__).resolve().parent.parent
    cwd_env = load_dotenv_file(Path.cwd() / ".env")
    repo_env = load_dotenv_file(repo_root / ".env")

    def read_value(*keys: str, default: str = "") -> str:
        for key in keys:
            value = os.getenv(key)
            if value is not None:
                return value.strip()
        for source in (cwd_env, repo_env):
            for key in keys:
                value = source.get(key)
                if value is not None:
                    return value.strip()
        return default.strip()

    account_id = read_value("CF_ACCOUNT_ID", "LUX4_CF_ACCOUNT_ID")
    token = read_value("CF_AUTH_TOKEN", "LUX4_CF_API_TOKEN")
    model = read_value("CF_EMBEDDING_MODEL", default=DEFAULT_MODEL)
    return account_id, token, model


def get_embeddings(texts: list[str], *, account_id: str, token: str, model: str) -> list[list[float]]:
    if not account_id:
        raise RuntimeError("Missing Cloudflare account id. Set CF_ACCOUNT_ID or LUX4_CF_ACCOUNT_ID.")
    if not token:
        raise RuntimeError("Missing Cloudflare auth token. Set CF_AUTH_TOKEN or LUX4_CF_API_TOKEN.")
    if not texts:
        raise RuntimeError("Provide at least one text value.")

    url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run/{model}"
    payload = json.dumps({"text": texts}).encode("utf-8")
    req = request.Request(
        url,
        data=payload,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with request.urlopen(req, timeout=60) as response:
            body = response.read().decode("utf-8")
    except error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Cloudflare embedding request failed with HTTP {exc.code}: {detail}") from exc
    except error.URLError as exc:
        raise RuntimeError(f"Cloudflare embedding request failed: {exc}") from exc

    data = json.loads(body)
    if not data.get("success"):
        raise RuntimeError(f"Cloudflare embedding request was not successful: {data.get('errors')}")
    result = data.get("result", {})
    vectors = result.get("data")
    if not isinstance(vectors, list):
        raise RuntimeError(f"Cloudflare embedding response did not contain result.data: {data}")
    return vectors


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate embeddings with Cloudflare Workers AI BGE-M3.")
    parser.add_argument("text", nargs="*", help="One or more text values to embed.")
    parser.add_argument("--stdin", action="store_true", help="Read one text per line from stdin.")
    parser.add_argument("--model", default="", help="Override the embedding model.")
    args = parser.parse_args()

    texts = list(args.text)
    if args.stdin:
        texts.extend(line.rstrip("\n") for line in sys.stdin if line.strip())

    account_id, token, model = resolve_config()
    if args.model:
        model = args.model

    vectors = get_embeddings(texts, account_id=account_id, token=token, model=model)
    json.dump(vectors, sys.stdout, ensure_ascii=False)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
