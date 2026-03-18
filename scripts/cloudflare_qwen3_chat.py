#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from urllib import error, request


DEFAULT_MODEL = "@cf/qwen/qwen3-30b-a3b-fp8"
DEFAULT_SYSTEM = "You are a helpful assistant."


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
    model = read_value("CF_MODEL", "CF_QWEN_MODEL", default=DEFAULT_MODEL)
    return account_id, token, model


def chat(prompt: str, *, system: str, account_id: str, token: str, model: str) -> str:
    if not account_id:
        raise RuntimeError("Missing Cloudflare account id. Set CF_ACCOUNT_ID or LUX4_CF_ACCOUNT_ID.")
    if not token:
        raise RuntimeError("Missing Cloudflare auth token. Set CF_AUTH_TOKEN or LUX4_CF_API_TOKEN.")
    if not prompt.strip():
        raise RuntimeError("Provide a non-empty prompt.")

    url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run/{model}"
    payload = json.dumps(
        {
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": prompt},
            ]
        }
    ).encode("utf-8")
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
        with request.urlopen(req, timeout=120) as response:
            body = response.read().decode("utf-8")
    except error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Cloudflare Qwen request failed with HTTP {exc.code}: {detail}") from exc
    except error.URLError as exc:
        raise RuntimeError(f"Cloudflare Qwen request failed: {exc}") from exc

    data = json.loads(body)
    if not data.get("success"):
        raise RuntimeError(f"Cloudflare Qwen request was not successful: {data.get('errors')}")

    choices = (((data.get("result") or {}).get("choices")) or [])
    if not choices:
        raise RuntimeError(f"Cloudflare Qwen response did not contain result.choices: {data}")
    message = choices[0].get("message") or {}
    content = message.get("content")
    if not isinstance(content, str):
        raise RuntimeError(f"Cloudflare Qwen response did not contain a text message: {data}")
    return content


def main() -> int:
    parser = argparse.ArgumentParser(description="Call Cloudflare Workers AI Qwen3 chat model.")
    parser.add_argument("prompt", nargs="*", help="User prompt text.")
    parser.add_argument("--stdin", action="store_true", help="Read user prompt from stdin and append it.")
    parser.add_argument("--system", default=DEFAULT_SYSTEM, help="System prompt.")
    parser.add_argument("--model", default="", help="Override the Cloudflare model.")
    args = parser.parse_args()

    prompt_parts = list(args.prompt)
    if args.stdin:
        stdin_text = sys.stdin.read().strip()
        if stdin_text:
            prompt_parts.append(stdin_text)
    prompt = "\n".join(part for part in prompt_parts if part.strip())

    account_id, token, model = resolve_config()
    if args.model:
        model = args.model

    response_text = chat(prompt, system=args.system, account_id=account_id, token=token, model=model)
    sys.stdout.write(response_text)
    if not response_text.endswith("\n"):
        sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
