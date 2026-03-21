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


def _build_page_url(query: str, tags: list[str], page: int, min_score: float) -> str:
    tag_param = ",".join(tags)
    return (
        f"/search?q={html.escape(query)}"
        f"&tag={html.escape(tag_param)}"
        f"&page={page}"
        f"&min_score={min_score:g}"
    )


def _render_search_page(config: Config, query: str, tags: list[str], result: dict[str, Any] | None = None) -> str:
    escaped_query = html.escape(query)
    escaped_tags = html.escape(", ".join(tags))
    tag_links = ""
    result_items = ""
    meta_summary = ""
    pagination = ""
    if result is not None:
        meta_summary = (
            f"<div class='meta'>约 {result['total_results']} 条结果 · 第 {result['page']} 页，共 {result['total_pages']} 页</div>"
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
            title_html = html.escape(item["title"])
            md_url = str(item.get("md_url") or "").strip()
            if md_url:
                title_html = (
                    f"<a href='{html.escape(md_url)}' target='_blank' rel='noopener noreferrer'>"
                    f"{title_html}</a>"
                )
            is_asset_card = item.get("doc_kind") == "asset_card"
            if is_asset_card:
                info_bits = []
                if item.get("category_path"):
                    info_bits.append(f"分类 {html.escape(item['category_path'])}")
                if item.get("priority"):
                    info_bits.append(f"优先级 {html.escape(item['priority'])}")
                if item.get("created_at"):
                    info_bits.append(f"创建于 {html.escape(item['created_at'])}")
                info_line = " · ".join(info_bits)
                asset_details = []
                if item.get("core_view"):
                    asset_details.append(
                        f"<div class='asset-line'><span class='asset-key'>核心观点</span><span class='asset-value'>{html.escape(item['core_view'])}</span></div>"
                    )
                if item.get("intent"):
                    asset_details.append(
                        f"<div class='asset-line'><span class='asset-key'>意图识别</span><span class='asset-value'>{html.escape(item['intent'])}</span></div>"
                    )
                if item.get("cognitive_asset"):
                    asset_details.append(
                        f"<div class='asset-line'><span class='asset-key'>认知资产</span><span class='asset-value'>{html.escape(item['cognitive_asset'])}</span></div>"
                    )
                rendered_results.append(
                    "<div class='result asset-result'>"
                    f"<div class='title'><span class='card-badge'>资产卡</span>{title_html}</div>"
                    f"<div class='asset-meta'>{info_line}</div>"
                    f"<div class='path'>{html.escape(item['path_in_snapshot'])}</div>"
                    f"<div class='asset-details'>{''.join(asset_details)}</div>"
                    f"<div class='snippet asset-snippet'><span class='asset-key'>原始摘录</span><span class='asset-value'>{html.escape(item['snippet'])}</span></div>"
                    f"<div class='attrs'>score={item['rerank_score']:.4f} · table={html.escape(item.get('source_table') or '')}</div>"
                    f"<div class='chips'>{chips}</div>"
                    "</div>"
                )
            else:
                rendered_results.append(
                    "<div class='result'>"
                    f"<div class='title'>{title_html}</div>"
                    f"<div class='path'>{html.escape(item['path_in_snapshot'])}</div>"
                    f"<div class='snippet'>{html.escape(item['snippet'])}</div>"
                    f"<div class='attrs'>score={item['rerank_score']:.4f} · created_at={html.escape(item['created_at'] or '')} · table={html.escape(item.get('source_table') or '')}</div>"
                    f"<div class='chips'>{chips}</div>"
                    "</div>"
                )
        result_items = "".join(rendered_results)
        if result["total_pages"] > 1:
            current = int(result["page"])
            total_pages = int(result["total_pages"])
            links: list[str] = []
            if current > 1:
                links.append(f"<a class='page' href='{_build_page_url(query, tags, current - 1, float(result['min_score']))}'>上一页</a>")
            for page_number in range(1, total_pages + 1):
                cls = "page current" if page_number == current else "page"
                links.append(
                    f"<a class='{cls}' href='{_build_page_url(query, tags, page_number, float(result['min_score']))}'>{page_number}</a>"
                )
            if current < total_pages:
                links.append(f"<a class='page' href='{_build_page_url(query, tags, current + 1, float(result['min_score']))}'>下一页</a>")
            pagination = f"<div class='pagination'>{''.join(links)}</div>"
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
    .asset-result {{ background: #fffdfa; border: 1px solid #e6dccb; border-radius: 18px; padding: 18px 18px 16px; margin: 14px 0; box-shadow: 0 1px 0 rgba(0,0,0,0.02); }}
    .title {{ font-size: 22px; margin-bottom: 6px; display:flex; align-items:center; gap:10px; flex-wrap:wrap; }}
    .card-badge {{ font-size: 12px; background:#171717; color:#fff; padding:3px 8px; border-radius:999px; letter-spacing:0.02em; }}
    .asset-meta {{ color: #5f5a51; font-size: 13px; margin-bottom: 8px; }}
    .path {{ color: #6b665e; font-size: 13px; margin-bottom: 8px; }}
    .snippet {{ line-height: 1.55; }}
    .asset-snippet {{ margin-top: 10px; display: grid; gap: 6px; }}
    .asset-details {{ display: grid; gap: 8px; margin: 12px 0 10px; }}
    .asset-line {{ display: grid; gap: 4px; }}
    .asset-key {{ font-size: 12px; color: #7b756b; letter-spacing: 0.02em; }}
    .asset-value {{ line-height: 1.55; }}
    .attrs {{ margin-top: 8px; color: #6b665e; font-size: 13px; }}
    .chips {{ display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }}
    .chip {{ background: #f0ece3; color: #534f48; padding: 4px 8px; border-radius: 999px; font-size: 12px; }}
    .pagination {{ display: flex; gap: 8px; flex-wrap: wrap; margin: 24px 0; }}
    .page {{ text-decoration: none; color: #2a2a2a; background: #ece5d8; padding: 8px 12px; border-radius: 999px; }}
    .page.current {{ background: #171717; color: white; }}
  </style>
</head>
<body>
  <div class="shell">
    <div class="brand">moreway</div>
    <form class="searchbar" method="get" action="/search">
      <input type="text" name="q" value="{escaped_query}" placeholder="搜索你的长期笔记资产">
      <input type="text" name="tag" value="{escaped_tags}" placeholder="标签过滤，逗号分隔">
      <input type="hidden" name="min_score" value="{result['min_score'] if result is not None else config.min_score}">
      <button type="submit">搜索</button>
    </form>
    {meta_summary}
    <div class="tagrail">{tag_links}</div>
    {pagination}
    <div class="results">{result_items}</div>
    {pagination}
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
            page = max(1, int((params.get("page") or ["1"])[0]))
            min_score = float((params.get("min_score") or [str(self.config.min_score)])[0])
            result = None
            if query:
                result = search_keep_cards(
                    query,
                    tables=self.config.tables,
                    vector_limit=self.config.vector_limit,
                    per_page=self.config.per_page,
                    page=page,
                    min_score=min_score,
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
        per_page = int(payload.get("limit") or payload.get("per_page") or self.config.per_page)
        page = max(1, int(payload.get("page") or 1))
        min_score = float(payload.get("min_score") or self.config.min_score)
        result = search_keep_cards(
            query,
            tables=self.config.tables,
            vector_limit=vector_limit,
            per_page=per_page,
            page=page,
            min_score=min_score,
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
