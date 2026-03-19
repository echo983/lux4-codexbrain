#!/usr/bin/env python3
from __future__ import annotations

import argparse
import base64
import json
import os
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import requests

try:
    from scripts.nbss_audio_preprocessor import AudioPreprocessor
except ModuleNotFoundError:
    from nbss_audio_preprocessor import AudioPreprocessor


DEFAULT_MODEL = "@cf/pipecat-ai/smart-turn-v2"


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
    model = read_value("CF_TURN_MODEL", default=DEFAULT_MODEL)
    return account_id, token, model


class SmartTurnDetector:
    def __init__(self, account_id: str | None = None, token: str | None = None, model: str | None = None, max_parallel: int = 32):
        default_account_id, default_token, default_model = resolve_config()
        self.account_id = account_id or default_account_id
        self.token = token or default_token
        self.model = model or default_model
        self.max_parallel = max_parallel
        self.session = requests.Session()
        self.preprocessor = AudioPreprocessor()

    def detect(self, audio_bytes: bytes) -> dict:
        if not self.account_id:
            raise RuntimeError("Missing Cloudflare account id. Set CF_ACCOUNT_ID or LUX4_CF_ACCOUNT_ID.")
        if not self.token:
            raise RuntimeError("Missing Cloudflare auth token. Set CF_AUTH_TOKEN or LUX4_CF_API_TOKEN.")

        processed_audio, preprocessed = self.preprocessor.ensure_normalized(audio_bytes)
        url = f"https://api.cloudflare.com/client/v4/accounts/{self.account_id}/ai/run/{self.model}"
        response = self.session.post(
            url,
            headers={"Authorization": f"Bearer {self.token}"},
            json={"audio": base64.b64encode(processed_audio).decode("utf-8")},
            timeout=180,
        )
        response.raise_for_status()
        data = response.json()
        if not data.get("success"):
            raise RuntimeError(f"Turn detection API error: {data.get('errors')}")
        result = data["result"]
        result["preprocessed"] = preprocessed
        return result

    def detect_many(self, audio_items: list[bytes], max_workers: int | None = None) -> list[dict]:
        audio_items = list(audio_items or [])
        if not audio_items:
            return []
        results: list[dict | None] = [None] * len(audio_items)
        workers = min(max_workers or self.max_parallel, len(audio_items))
        with ThreadPoolExecutor(max_workers=workers) as executor:
            futures = {executor.submit(self.detect, item): idx for idx, item in enumerate(audio_items)}
            for future in as_completed(futures):
                results[futures[future]] = future.result()
        return [item for item in results if item is not None]


def main() -> int:
    parser = argparse.ArgumentParser(description="Run Cloudflare smart-turn-v2 on audio.")
    parser.add_argument("audio_file")
    args = parser.parse_args()
    with open(args.audio_file, "rb") as file:
        audio_data = file.read()
    result = SmartTurnDetector().detect(audio_data)
    print(json.dumps(result, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
