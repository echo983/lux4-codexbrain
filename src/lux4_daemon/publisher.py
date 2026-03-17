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
            "body": message.as_dict(),
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
