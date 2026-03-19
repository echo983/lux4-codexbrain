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


DEFAULT_MODEL = "@cf/openai/whisper-large-v3-turbo"


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
    model = read_value("CF_AUDIO_MODEL", default=DEFAULT_MODEL)
    return account_id, token, model


class AudioClient:
    def __init__(self, account_id: str | None = None, token: str | None = None, model: str | None = None, max_parallel: int = 32):
        default_account_id, default_token, default_model = resolve_config()
        self.account_id = account_id or default_account_id
        self.token = token or default_token
        self.model = model or default_model
        self.max_parallel = max_parallel
        self.session = requests.Session()
        self.preprocessor = AudioPreprocessor()

    def transcribe(
        self,
        audio_bytes: bytes,
        *,
        language: str | None = None,
        task: str = "transcribe",
        vad_filter: bool = True,
        initial_prompt: str | None = None,
        prefix: str | None = None,
        condition_on_previous_text: bool = False,
        no_speech_threshold: float = 0.6,
        compression_ratio_threshold: float = 2.4,
        log_prob_threshold: float = -1,
    ) -> dict:
        if not self.account_id:
            raise RuntimeError("Missing Cloudflare account id. Set CF_ACCOUNT_ID or LUX4_CF_ACCOUNT_ID.")
        if not self.token:
            raise RuntimeError("Missing Cloudflare auth token. Set CF_AUTH_TOKEN or LUX4_CF_API_TOKEN.")

        processed_audio = self.preprocessor.normalize(audio_bytes)
        url = f"https://api.cloudflare.com/client/v4/accounts/{self.account_id}/ai/run/{self.model}"
        payload: dict[str, object] = {
            "audio": base64.b64encode(processed_audio).decode("utf-8"),
            "task": task,
            "vad_filter": vad_filter,
            "condition_on_previous_text": condition_on_previous_text,
            "no_speech_threshold": no_speech_threshold,
            "compression_ratio_threshold": compression_ratio_threshold,
            "log_prob_threshold": log_prob_threshold,
        }
        if language:
            payload["language"] = language
        if initial_prompt:
            payload["initial_prompt"] = initial_prompt
        if prefix:
            payload["prefix"] = prefix

        response = self.session.post(
            url,
            headers={"Authorization": f"Bearer {self.token}"},
            json=payload,
            timeout=180,
        )
        response.raise_for_status()
        data = response.json()
        if data.get("success"):
            return data["result"]
        raise RuntimeError(f"Audio API error: {data.get('errors')}")

    def transcribe_many(self, items: list[dict | bytes], max_workers: int | None = None) -> list[dict]:
        items = list(items or [])
        if not items:
            return []
        results: list[dict | None] = [None] * len(items)
        workers = min(max_workers or self.max_parallel, len(items))
        with ThreadPoolExecutor(max_workers=workers) as executor:
            futures = {}
            for idx, item in enumerate(items):
                if isinstance(item, dict):
                    payload = dict(item)
                    audio_bytes = payload.pop("audio_bytes")
                    kwargs = payload
                else:
                    audio_bytes = item
                    kwargs = {}
                futures[executor.submit(self.transcribe, audio_bytes, **kwargs)] = idx
            for future in as_completed(futures):
                results[futures[future]] = future.result()
        return [item for item in results if item is not None]


def main() -> int:
    parser = argparse.ArgumentParser(description="Transcribe audio bytes via Cloudflare Whisper.")
    parser.add_argument("audio_file")
    parser.add_argument("--language", default="")
    args = parser.parse_args()
    with open(args.audio_file, "rb") as file:
        audio_data = file.read()
    result = AudioClient().transcribe(audio_data, language=args.language or None)
    print(json.dumps(result, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
