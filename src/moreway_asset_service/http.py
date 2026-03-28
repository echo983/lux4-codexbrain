from __future__ import annotations

import io
import json
from http import HTTPStatus
from http.server import ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

from moreway_search_service.http import AppHandler

from .config import Config
from .planet import list_planet_points


class AssetHandler(AppHandler):
    config: Config

    def _write_namespace_required(self) -> None:
        self._write_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "missing_namespace_id"})

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/healthz":
            self._write_json(HTTPStatus.OK, {"ok": True, "service": "moreway-asset-service"})
            return
        if parsed.path in {"/", "/search", "/asset-card"}:
            self._write_json(HTTPStatus.NOT_FOUND, {"ok": False, "error": "not_found"})
            return
        if parsed.path == "/api/v1/mobile/cards/recent":
            params = parse_qs(parsed.query, keep_blank_values=False)
            namespace_id = (params.get("namespace_id") or [""])[0].strip()
            if not namespace_id:
                self._write_namespace_required()
                return
            super().do_GET()
            return
        if parsed.path.startswith("/api/v1/mobile/cards/"):
            params = parse_qs(parsed.query, keep_blank_values=False)
            namespace_id = (params.get("namespace_id") or [""])[0].strip()
            if not namespace_id:
                self._write_namespace_required()
                return
            super().do_GET()
            return
        if parsed.path == "/api/v1/planet/view":
            params = parse_qs(parsed.query, keep_blank_values=False)
            namespace_id = (params.get("namespace_id") or [""])[0].strip()
            if not namespace_id:
                self._write_namespace_required()
                return
            source_table = (params.get("source_table") or [""])[0].strip()
            try:
                limit = int((params.get("limit") or ["200"])[0])
            except ValueError:
                self._write_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "invalid_limit"})
                return
            result = list_planet_points(
                tables=self.config.tables,
                namespace_id=namespace_id,
                source_table=source_table,
                limit=limit,
            )
            self._write_json(
                HTTPStatus.OK,
                {
                    "ok": True,
                    "namespaceId": result["namespace_id"],
                    "pointCount": result["point_count"],
                    "points": result["points"],
                    "bounds": result["bounds"],
                },
            )
            return
        super().do_GET()

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/v1/search":
            self._write_json(HTTPStatus.NOT_FOUND, {"ok": False, "error": "not_found"})
            return
        if parsed.path == "/api/v1/mobile/search":
            payload = self._read_json_body()
            if payload is None:
                self._write_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "invalid_json"})
                return
            namespace_id = str(payload.get("namespaceId") or "").strip()
            if not namespace_id:
                self._write_namespace_required()
                return
            body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
            self.rfile = io.BytesIO(body)
            self.headers.replace_header("content-length", str(len(body)))
            super().do_POST()
            return
        self._write_json(HTTPStatus.NOT_FOUND, {"ok": False, "error": "not_found"})


def build_server(config: Config) -> ThreadingHTTPServer:
    handler = type("MorewayAssetHandler", (AssetHandler,), {"config": config})
    return ThreadingHTTPServer((config.host, config.port), handler)
