from __future__ import annotations

import html
import json
import logging
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any
from urllib.parse import parse_qs, urlparse

from .config import Config
from .search import search_keep_cards


LOGGER = logging.getLogger(__name__)


def _parse_tag_values(values: list[str]) -> list[str]:
    tags: list[str] = []
    for value in values:
        for part in value.split(","):
            part = part.strip()
            if part:
                tags.append(part)
    return tags


def _render_search_page(config: Config, query: str, tags: list[str], result: dict[str, Any] | None = None) -> str:
    escaped_query = html.escape(query)
    escaped_tags = html.escape(", ".join(tags))
    tag_links = ""
    result_items = ""
    meta_summary = ""
    if result is not None:
        meta_summary = (
            f"<div class='meta'>检索到 {result['filtered_hit_count']} 条候选，"
            f"返回 {len(result['results'])} 条结果。</div>"
        )
        tag_links = "".join(
            f"<a class='tag' href='/search?q={html.escape(query)}&tag={html.escape(item['tag'])}'>{html.escape(item['tag'])} <span>{item['count']}</span></a>"
            for item in result.get("available_tags", [])
        )
        rendered_results: list[str] = []
        for item in result.get("results", []):
            chips = "".join(
                f"<span class='chip'>{html.escape(tag)}</span>"
                for tag in item.get("tags", [])
            )
            rendered_results.append(
                "<div class='result'>"
                f"<div class='title'>{html.escape(item['title'])}</div>"
                f"<div class='path'>{html.escape(item['path_in_snapshot'])}</div>"
                f"<div class='snippet'>{html.escape(item['snippet'])}</div>"
                f"<div class='attrs'>score={item['rerank_score']:.4f} · created_at={html.escape(item['created_at'] or '')} · priority={html.escape(item['priority'] or '')}</div>"
                f"<div class='chips'>{chips}</div>"
                "</div>"
            )
        result_items = "".join(rendered_results)
    return f"""<!doctype html>
<html lang="zh">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>moreway search</title>
  <style>
    body {{ font-family: Georgia, 'Noto Serif SC', serif; margin: 0; background: #f7f6f2; color: #191919; }}
    .shell {{ max-width: 980px; margin: 0 auto; padding: 36px 24px 80px; }}
    .brand {{ font-size: 38px; margin: 32px 0 28px; letter-spacing: -0.04em; }}
    .searchbar {{ display: grid; grid-template-columns: 1fr 220px 120px; gap: 12px; }}
    input {{ font: inherit; padding: 14px 16px; border: 1px solid #cfc8bb; border-radius: 999px; background: #fffdf9; }}
    button {{ font: inherit; padding: 14px 18px; border: 0; border-radius: 999px; background: #171717; color: white; cursor: pointer; }}
    .meta {{ margin: 18px 0; color: #5f5a51; }}
    .tagrail {{ display: flex; gap: 10px; flex-wrap: wrap; margin: 18px 0 24px; }}
    .tag {{ text-decoration: none; color: #2a2a2a; background: #ece5d8; padding: 7px 12px; border-radius: 999px; }}
    .tag span {{ color: #7b756b; }}
    .result {{ padding: 18px 0; border-top: 1px solid #ddd5c6; }}
    .title {{ font-size: 22px; margin-bottom: 6px; }}
    .path {{ color: #6b665e; font-size: 13px; margin-bottom: 8px; }}
    .snippet {{ line-height: 1.55; }}
    .attrs {{ margin-top: 8px; color: #6b665e; font-size: 13px; }}
    .chips {{ display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }}
    .chip {{ background: #f0ece3; color: #534f48; padding: 4px 8px; border-radius: 999px; font-size: 12px; }}
  </style>
</head>
<body>
  <div class="shell">
    <div class="brand">moreway</div>
    <form class="searchbar" method="get" action="/search">
      <input type="text" name="q" value="{escaped_query}" placeholder="搜索你的长期笔记资产">
      <input type="text" name="tag" value="{escaped_tags}" placeholder="标签过滤，逗号分隔">
      <button type="submit">搜索</button>
    </form>
    {meta_summary}
    <div class="tagrail">{tag_links}</div>
    <div class="results">{result_items}</div>
  </div>
</body>
</html>"""


class AppHandler(BaseHTTPRequestHandler):
    config: Config

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/healthz":
            self._write_json(HTTPStatus.OK, {"ok": True, "service": "moreway-search-service"})
            return
        if parsed.path == "/":
            self._write_html(HTTPStatus.OK, _render_search_page(self.config, "", []))
            return
        if parsed.path == "/search":
            params = parse_qs(parsed.query, keep_blank_values=False)
            query = (params.get("q") or [""])[0].strip()
            tags = _parse_tag_values(params.get("tag") or [])
            result = None
            if query:
                result = search_keep_cards(
                    query,
                    table=self.config.table,
                    vector_limit=self.config.vector_limit,
                    result_limit=self.config.result_limit,
                    required_tags=tags,
                )
            self._write_html(HTTPStatus.OK, _render_search_page(self.config, query, tags, result))
            return
        self._write_json(HTTPStatus.NOT_FOUND, {"ok": False, "error": "not_found"})

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path != "/api/v1/search":
            self._write_json(HTTPStatus.NOT_FOUND, {"ok": False, "error": "not_found"})
            return
        payload = self._read_json_body()
        if payload is None:
            self._write_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "invalid_json"})
            return
        query = str(payload.get("query") or "").strip()
        if not query:
            self._write_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "missing_query"})
            return
        tags_raw = payload.get("tags") or []
        tags = [str(item).strip() for item in tags_raw if str(item).strip()] if isinstance(tags_raw, list) else []
        vector_limit = int(payload.get("vector_limit") or self.config.vector_limit)
        result_limit = int(payload.get("limit") or self.config.result_limit)
        result = search_keep_cards(
            query,
            table=self.config.table,
            vector_limit=vector_limit,
            result_limit=result_limit,
            required_tags=tags,
        )
        self._write_json(HTTPStatus.OK, result)

    def log_message(self, fmt: str, *args: Any) -> None:
        LOGGER.info("%s - %s", self.address_string(), fmt % args)

    def _read_json_body(self) -> dict[str, Any] | None:
        content_length = self.headers.get("content-length")
        if not content_length:
            return None
        try:
            length = int(content_length)
        except ValueError:
            return None
        body = self.rfile.read(length)
        try:
            payload = json.loads(body)
        except json.JSONDecodeError:
            return None
        return payload if isinstance(payload, dict) else None

    def _write_json(self, status: HTTPStatus, payload: dict[str, Any]) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("content-type", "application/json; charset=utf-8")
        self.send_header("content-length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _write_html(self, status: HTTPStatus, html_text: str) -> None:
        body = html_text.encode("utf-8")
        self.send_response(status)
        self.send_header("content-type", "text/html; charset=utf-8")
        self.send_header("content-length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def build_server(config: Config) -> ThreadingHTTPServer:
    handler = type("MorewayHandler", (AppHandler,), {"config": config})
    return ThreadingHTTPServer((config.host, config.port), handler)
