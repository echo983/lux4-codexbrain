from __future__ import annotations

import json
import logging
from typing import Protocol
from urllib import error, request

from .config import Config
from .models import ReplyMessage

LOGGER = logging.getLogger(__name__)


class ReplyPublisher(Protocol):
    def publish(self, message: ReplyMessage) -> None: ...


class HttpReplyPublisher:
    def __init__(self, config: Config) -> None:
        self._url = config.reply_push_url
        self._token = config.reply_push_token
        self._timeout = config.request_timeout_seconds

    def publish(self, message: ReplyMessage) -> None:
        if not self._url:
            LOGGER.info("reply push url not configured; skipping outbound publish", extra={"reply": message.as_dict()})
            return

        body = json.dumps(message.as_dict()).encode("utf-8")
        headers = {"content-type": "application/json"}
        if self._token:
            headers["authorization"] = f"Bearer {self._token}"

        outbound = request.Request(self._url, data=body, headers=headers, method="POST")

        try:
            with request.urlopen(outbound, timeout=self._timeout) as response:
                if response.status < 200 or response.status >= 300:
                    raise RuntimeError(f"reply push failed with status {response.status}")
        except error.HTTPError as exc:
            raise RuntimeError(f"reply push failed with status {exc.code}") from exc
        except error.URLError as exc:
            raise RuntimeError(f"reply push failed: {exc.reason}") from exc
