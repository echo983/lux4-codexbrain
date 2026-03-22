from __future__ import annotations

import json
from typing import Protocol
from urllib import error, request

from .config import Config
from .models import ReplyMessage

class ReplyPublisher(Protocol):
    def publish(self, message: ReplyMessage) -> None: ...


class CloudflareQueueReplyPublisher:
    def __init__(self, config: Config) -> None:
        self._account_id = config.cloudflare_account_id
        self._queue_id = config.cloudflare_queue_id
        self._token = config.cloudflare_api_token
        self._timeout = config.request_timeout_seconds

    def publish(self, message: ReplyMessage) -> None:
        body = json.dumps({
            "body": _normalized_reply_payload(message),
            "content_type": "json",
        }).encode("utf-8")
        headers = {
            "content-type": "application/json",
            "authorization": f"Bearer {self._token}",
        }
        outbound = request.Request(self._build_push_url(), data=body, headers=headers, method="POST")

        try:
            with request.urlopen(outbound, timeout=self._timeout) as response:
                if response.status < 200 or response.status >= 300:
                    raise RuntimeError(f"cloudflare queue push failed with status {response.status}")
        except error.HTTPError as exc:
            raise RuntimeError(f"cloudflare queue push failed with status {exc.code}") from exc
        except error.URLError as exc:
            raise RuntimeError(f"cloudflare queue push failed: {exc.reason}") from exc

    def _build_push_url(self) -> str:
        return (
            "https://api.cloudflare.com/client/v4"
            f"/accounts/{self._account_id}/queues/{self._queue_id}/messages"
        )


def _normalized_reply_payload(message: ReplyMessage) -> dict[str, object]:
    payload = message.as_dict()
    text = payload.get("text")
    if isinstance(text, str):
        payload["text"] = _normalize_user_facing_text(text)
    return payload


def _normalize_user_facing_text(text: str) -> str:
    normalized = text
    normalized = normalized.replace("\\r\\n", "\n")
    normalized = normalized.replace("\\n", "\n")
    normalized = normalized.replace("\\t", "\t")
    normalized = normalized.replace("\\r", "\r")
    return normalized
