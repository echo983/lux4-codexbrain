from __future__ import annotations

import json
import logging
from io import BufferedIOBase
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
        path = _normalize_path(urlparse(self.path).path)
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
        path = _normalize_path(urlparse(self.path).path)
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
        return read_json_body(self.headers, self.rfile)

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


def read_json_body(headers: Any, rfile: BufferedIOBase) -> dict[str, Any] | str | None:
    body = read_request_body(headers, rfile)
    if body is None:
        return None

    try:
        return json.loads(body)
    except json.JSONDecodeError:
        return None


def read_request_body(headers: Any, rfile: BufferedIOBase) -> bytes | None:
    transfer_encoding = headers.get("transfer-encoding", "")
    if "chunked" in transfer_encoding.lower():
        return _read_chunked_body(rfile)

    content_length = headers.get("content-length")
    if not content_length:
        return None

    try:
        length = int(content_length)
    except ValueError:
        return None

    if length < 0:
        return None

    return rfile.read(length)


def _read_chunked_body(rfile: BufferedIOBase) -> bytes | None:
    chunks: list[bytes] = []

    while True:
        size_line = rfile.readline()
        if not size_line:
            return None

        size_text = size_line.strip().split(b";", 1)[0]
        try:
            chunk_size = int(size_text, 16)
        except ValueError:
            return None

        if chunk_size == 0:
            while True:
                trailer_line = rfile.readline()
                if trailer_line in (b"", b"\r\n", b"\n"):
                    return b"".join(chunks)

        chunk = rfile.read(chunk_size)
        if len(chunk) != chunk_size:
            return None
        chunks.append(chunk)

        line_end = rfile.read(2)
        if line_end != b"\r\n":
            return None


def _normalize_path(path: str) -> str:
    if path != "/" and path.endswith("/"):
        return path.rstrip("/")
    return path
