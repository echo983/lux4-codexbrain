from __future__ import annotations

import json
import logging
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any
from urllib.parse import urlparse

from lux4_daemon.http import read_json_body

from .service import VisualAssetCardService


LOGGER = logging.getLogger(__name__)


class AppHandler(BaseHTTPRequestHandler):
    visual_asset_card_service: VisualAssetCardService

    def do_GET(self) -> None:
        path = _normalize_path(urlparse(self.path).path)
        if path == "/healthz":
            self._write_json(HTTPStatus.OK, {"ok": True, "service": "visual-asset-card-service"})
            return
        if path == "/":
            self._write_json(
                HTTPStatus.OK,
                {
                    "ok": True,
                    "service": "visual-asset-card-service",
                    "endpoints": ["/healthz", "/api/v1/visual-cards"],
                },
            )
            return
        self._write_json(HTTPStatus.NOT_FOUND, {"ok": False, "error": "not_found"})

    def do_POST(self) -> None:
        path = _normalize_path(urlparse(self.path).path)
        if path != "/api/v1/visual-cards":
            self._write_json(HTTPStatus.NOT_FOUND, {"ok": False, "error": "not_found"})
            return
        payload = read_json_body(self.headers, self.rfile)
        if payload is None:
            self._write_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "invalid_json"})
            return
        try:
            response = self.visual_asset_card_service.ingest(payload)
        except ValueError as exc:
            self._write_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "invalid_request", "detail": str(exc)})
            return
        except Exception as exc:
            LOGGER.exception("visual asset card ingest failed")
            self._write_json(HTTPStatus.INTERNAL_SERVER_ERROR, {"ok": False, "error": "ingest_failed", "detail": str(exc)})
            return
        self._write_json(HTTPStatus.ACCEPTED, response)

    def log_message(self, fmt: str, *args: Any) -> None:
        LOGGER.info("%s - %s", self.address_string(), fmt % args)

    def _write_json(self, status: HTTPStatus, payload: dict[str, Any]) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("content-type", "application/json; charset=utf-8")
        self.send_header("content-length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def build_server(host: str, port: int, visual_asset_card_service: VisualAssetCardService) -> ThreadingHTTPServer:
    handler = type(
        "VisualAssetCardHandler",
        (AppHandler,),
        {"visual_asset_card_service": visual_asset_card_service},
    )
    return ThreadingHTTPServer((host, port), handler)


def _normalize_path(path: str) -> str:
    if path != "/" and path.endswith("/"):
        return path.rstrip("/")
    return path

