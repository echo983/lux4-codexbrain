from __future__ import annotations

import json
import logging
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any
from urllib.parse import urlparse

from .normalize import normalize_incoming_message
from .service import DaemonService

LOGGER = logging.getLogger(__name__)


class AppHandler(BaseHTTPRequestHandler):
    daemon_service: DaemonService

    def do_GET(self) -> None:
        path = urlparse(self.path).path
        if path == "/healthz":
            self._write_json(HTTPStatus.OK, {"ok": True, "service": "lux4-daemon"})
            return

        if path == "/":
            self._write_json(
                HTTPStatus.OK,
                {
                    "ok": True,
                    "service": "lux4-daemon",
                    "endpoints": ["/healthz", "/api/v1/messages/incoming"],
                },
            )
            return

        self._write_json(HTTPStatus.NOT_FOUND, {"ok": False, "error": "not_found"})

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        if path != "/api/v1/messages/incoming":
            self._write_json(HTTPStatus.NOT_FOUND, {"ok": False, "error": "not_found"})
            return

        payload = self._read_json_body()
        if payload is None:
            self._write_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "invalid_json"})
            return

        message = normalize_incoming_message(payload)
        if message is None:
            self._write_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "invalid_incoming_message"})
            return

        self.daemon_service.accept(message)
        self._write_json(
            HTTPStatus.ACCEPTED,
            {
                "ok": True,
                "status": "accepted",
                "messageId": message.message_id,
                "sessionKey": message.session_key,
            },
        )

    def log_message(self, fmt: str, *args: Any) -> None:
        LOGGER.info("%s - %s", self.address_string(), fmt % args)

    def _read_json_body(self) -> dict[str, Any] | str | None:
        content_length = self.headers.get("content-length")
        if not content_length:
            return None

        try:
            length = int(content_length)
        except ValueError:
            return None

        body = self.rfile.read(length)
        try:
            return json.loads(body)
        except json.JSONDecodeError:
            return None

    def _write_json(self, status: HTTPStatus, payload: dict[str, Any]) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("content-type", "application/json; charset=utf-8")
        self.send_header("content-length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def build_server(host: str, port: int, daemon_service: DaemonService) -> ThreadingHTTPServer:
    handler = type("Lux4Handler", (AppHandler,), {"daemon_service": daemon_service})
    return ThreadingHTTPServer((host, port), handler)
