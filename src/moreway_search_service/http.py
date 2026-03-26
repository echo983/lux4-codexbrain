from __future__ import annotations

import html
import json
import logging
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any
from urllib.parse import parse_qs, urlparse, urlencode

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
    params: dict[str, Any] = {"q": query}
    if tags:
        params["tag"] = ",".join(tags)
    if page > 1:
        params["page"] = page
    params["min_score"] = f"{min_score:g}"
    return f"/search?{urlencode(params)}"


def _load_asset_card_markdown(config: Config, card_id: str) -> str | None:
    safe_id = card_id.strip()
    if not safe_id:
        return None
    candidate = (config.asset_card_dir / f"{safe_id}.md").resolve()
    try:
        candidate.relative_to(config.asset_card_dir)
    except ValueError:
        return None
    if not candidate.exists() or not candidate.is_file():
        return None
    return candidate.read_text(encoding="utf-8")


def _toggle_tag(current_tags: list[str], target_tag: str) -> list[str]:
    normalized_target = target_tag.strip()
    if not normalized_target:
        return current_tags
    
    # We use case-insensitive matching for toggling but preserve original if possible?
    # Actually, let's just keep it simple.
    tags = [t.strip() for t in current_tags if t.strip()]
    if normalized_target in tags:
        return [t for t in tags if t != normalized_target]
    
    # Check case-insensitively
    lower_tags = [t.lower() for t in tags]
    if normalized_target.lower() in lower_tags:
        return [t for t in tags if t.lower() != normalized_target.lower()]
    
    return tags + [normalized_target]


def _render_tag_links(query: str, tags: list[str], available_tags: list[dict[str, Any]], min_score: float) -> str:
    tag_items = []
    for item in available_tags:
        tag_name = item["tag"]
        is_active = any(t.lower() == tag_name.lower() for t in tags)
        new_tags = _toggle_tag(tags, tag_name)
        url = _build_page_url(query, new_tags, 1, min_score)
        cls = "tag active" if is_active else "tag"
        tag_items.append(
            f"<a class='{cls}' href='{html.escape(url)}'>{html.escape(tag_name)} <span>{item['count']}</span></a>"
        )
    return "".join(tag_items)


def _render_chip_links(query: str, tags: list[str], item_tags: list[str], min_score: float) -> str:
    return "".join(
        f"<a class='chip' href='{html.escape(_build_page_url(query, _toggle_tag(tags, t), 1, min_score))}'>{html.escape(t)}</a>"
        for t in item_tags
    )


def _render_asset_card_result(item: dict[str, Any], chips_html: str) -> str:
    md_url = str(item.get("md_url") or "").strip()
    card_url = str(item.get("card_url") or "").strip()
    title_html = (
        f"<div class='title'><a href='{html.escape(md_url or '#')}' target='_blank' class='source-link' title='查看笔记原文'>"
        f"{html.escape(item['title'])}</a></div>"
    )
    action_btn = ""
    if card_url:
        action_btn = (
            f"<a href='{html.escape(card_url)}' class='btn-pill-action' target='_blank'>"
            f"<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='display:inline-block; vertical-align:middle; margin-right:4px;'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>"
            f"<span>查看 AI 分析</span>"
            f"</a>"
        )
    details_list = []
    if item.get("core_view"):
        details_list.append(f"<div class='asset-line'><span class='asset-key'>核心观点</span><span class='asset-value'>{html.escape(item['core_view'])}</span></div>")
    if item.get("intent"):
        details_list.append(f"<div class='asset-line'><span class='asset-key'>意图识别</span><span class='asset-value'>{html.escape(item['intent'])}</span></div>")
    if item.get("cognitive_asset"):
        details_list.append(f"<div class='asset-line'><span class='asset-key'>认知资产</span><span class='asset-value'>{html.escape(item['cognitive_asset'])}</span></div>")
    details_html = "".join(details_list)
    if not details_html and item.get("snippet"):
        details_html = f"<div class='snippet'>{html.escape(item['snippet'])}</div>"
    info_line = " · ".join(filter(None, [item.get("category_path"), item.get("created_at")]))
    return (
        "<div class='card asset-card'>"
        f"  <div class='card-header'><span class='badge asset'>资产卡</span>{title_html}{action_btn}</div>"
        f"  <div class='card-body'><div class='asset-details'>{details_html}</div><div class='chips'>{chips_html}</div></div>"
        f"  <div class='card-footer'><span>推荐度 {item['rerank_score']:.3f}</span><span>{info_line}</span><span class='path-assist'>{html.escape(item['path_in_snapshot'])}</span></div>"
        "</div>"
    )


def _render_raw_text_result(item: dict[str, Any], chips_html: str) -> str:
    md_url = str(item.get("md_url") or "").strip()
    info_line = " · ".join(filter(None, [item.get("category_path"), item.get("created_at")]))
    title_html = f"<div class='title'><a href='{html.escape(md_url or '#')}' target='_blank'>{html.escape(item['title'])}</a></div>"
    return (
        "<div class='card'>"
        f"  <div class='card-header'><span class='badge raw'>原始文档</span>{title_html}</div>"
        f"  <div class='card-body'><div class='snippet'>{html.escape(item['snippet'])}</div><div class='chips'>{chips_html}</div></div>"
        f"  <div class='card-footer'><span>推荐度 {item['rerank_score']:.3f}</span><span>{info_line}</span><span class='path-assist'>{html.escape(item['path_in_snapshot'])}</span></div>"
        "</div>"
    )


def _render_pagination(query: str, tags: list[str], page: int, total_pages: int, min_score: float) -> str:
    if total_pages <= 1:
        return ""
    links: list[str] = []
    if page > 1:
        prev_url = _build_page_url(query, tags, page - 1, min_score)
        links.append(f"<a class='page' href='{html.escape(prev_url)}'>上一页</a>")

    start_page = max(1, page - 2)
    end_page = min(total_pages, page + 2)
    if start_page > 1:
        links.append(f"<a class='page' href='{html.escape(_build_page_url(query, tags, 1, min_score))}'>1</a>")
        if start_page > 2:
            links.append("<span class='gap'>...</span>")

    for p in range(start_page, end_page + 1):
        cls = "page current" if p == page else "page"
        links.append(f"<a class='{cls}' href='{html.escape(_build_page_url(query, tags, p, min_score))}'>{p}</a>")

    if end_page < total_pages:
        if end_page < total_pages - 1:
            links.append("<span class='gap'>...</span>")
        links.append(f"<a class='page' href='{html.escape(_build_page_url(query, tags, total_pages, min_score))}'>{total_pages}</a>")

    if page < total_pages:
        next_url = _build_page_url(query, tags, page + 1, min_score)
        links.append(f"<a class='page' href='{html.escape(next_url)}'>下一页</a>")
    return f"<div class='pagination'>{''.join(links)}</div>"


def _render_search_page(config: Config, query: str, tags: list[str], result: dict[str, Any] | None = None) -> str:
    escaped_query = html.escape(query)
    escaped_tags = html.escape(", ".join(tags))
    tag_links = ""
    result_items = ""
    meta_summary = ""
    pagination = ""
    
    min_score = result["min_score"] if result is not None else config.min_score
    
    if result is not None:
        meta_summary = (
            f"<div class='meta'>约 {result['total_results']} 条结果 · 第 {result['page']} 页，共 {result['total_pages']} 页</div>"
        )
        
        tag_links = _render_tag_links(query, tags, result.get("available_tags", []), min_score)
        
        rendered_results: list[str] = []
        for item in result.get("results", []):
            chips_html = _render_chip_links(query, tags, item.get("tags", []), min_score)
            if item.get("doc_kind") == "asset_card":
                rendered_results.append(_render_asset_card_result(item, chips_html))
            else:
                rendered_results.append(_render_raw_text_result(item, chips_html))
        
        result_items = "".join(rendered_results)
        pagination = _render_pagination(query, tags, int(result["page"]), int(result["total_pages"]), min_score)

    return f"""<!doctype html>
<html lang="zh">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>moreway search</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
    :root {{
      --primary: #009688;
      --primary-dark: #00796b;
      --accent: #ffc107;
      --bg: #eeeeee;
      --surface: #ffffff;
      --text-main: #212121;
      --text-muted: #757575;
      --divider: #bdbdbd;
      --shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
      --shadow-hover: 0 8px 17px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
    }}
    body {{ font-family: 'Roboto', -apple-system, sans-serif; margin: 0; background: var(--bg); color: var(--text-main); line-height: 1.6; }}
    
    .app-bar {{ background: var(--primary); color: white; padding: 16px 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); position: sticky; top: 0; z-index: 100; }}
    .app-bar .brand {{ font-size: 24px; font-weight: 500; text-decoration: none; color: inherit; letter-spacing: 0.5px; }}
    
    .container {{ max-width: 840px; margin: 0 auto; padding: 24px 16px 100px; }}
    
    .search-panel {{ background: var(--surface); padding: 24px; border-radius: 4px; box-shadow: var(--shadow); margin-bottom: 24px; }}
    .search-row {{ display: flex; flex-wrap: wrap; gap: 16px; }}
    .input-field {{ flex: 1; min-width: 200px; position: relative; }}
    .input-field input {{ width: 100%; border: none; border-bottom: 2px solid var(--divider); padding: 8px 0; font-size: 16px; outline: none; background: transparent; transition: border-color 0.3s; }}
    .input-field input:focus {{ border-bottom-color: var(--primary); }}
    .input-field label {{ font-size: 12px; color: var(--text-muted); display: block; }}
    
    .btn {{ background: var(--primary); color: white; border: none; padding: 10px 24px; border-radius: 2px; text-transform: uppercase; font-weight: 500; cursor: pointer; box-shadow: 0 2px 2px rgba(0,0,0,0.2); transition: 0.3s; }}
    .btn:hover {{ background: var(--primary-dark); box-shadow: 0 4px 8px rgba(0,0,0,0.3); }}
    .btn.secondary {{ background: transparent; color: var(--text-muted); box-shadow: none; }}
    .btn.secondary:hover {{ background: rgba(0,0,0,0.05); }}

    .meta {{ font-size: 14px; color: var(--text-muted); margin-bottom: 16px; padding: 0 8px; }}
    
    .tagrail {{ display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }}
    .tag {{ text-decoration: none; color: var(--text-main); background: #e0e0e0; padding: 6px 16px; border-radius: 16px; font-size: 13px; transition: 0.2s; }}
    .tag:hover {{ background: #d5d5d5; }}
    .tag.active {{ background: var(--primary); color: white; }}
    .tag span {{ margin-left: 4px; opacity: 0.7; }}
    
    /* Result Card Styles */
    .card {{ background: var(--surface); border-radius: 4px; box-shadow: var(--shadow); margin-bottom: 24px; transition: 0.3s; overflow: hidden; position: relative; }}
    .card:hover {{ box-shadow: var(--shadow-hover); }}
    .card.asset-card {{ border-left: 4px solid var(--accent); }}
    
    .card-header {{ padding: 16px 20px; display: flex; align-items: flex-start; gap: 12px; }}
    .card-header .title {{ flex: 1; font-size: 18px; font-weight: 500; }}
    .card-header .title a {{ color: inherit; text-decoration: none; }}
    .card-header .title a:hover {{ color: var(--primary); }}
    
    .badge {{ font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 6px; border-radius: 2px; letter-spacing: 0.5px; }}
    .badge.asset {{ background: #fff8e1; color: #ffa000; border: 1px solid #ffecb3; }}
    .badge.raw {{ background: #f5f5f5; color: #757575; }}
    
    .btn-pill-action {{ display: flex; align-items: center; gap: 8px; background: #f5f5f5; padding: 6px 12px; border-radius: 20px; text-decoration: none; color: var(--text-muted); font-size: 13px; font-weight: 500; transition: 0.2s; border: 1px solid #e0e0e0; flex-shrink: 0; }}
    .btn-pill-action:hover {{ background: var(--primary); color: white; border-color: var(--primary); box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
    .btn-pill-action svg {{ width: 16px; height: 16px; fill: currentColor; }}
    
    .card-body {{ padding: 0 20px 16px; }}
    .source-link {{ color: inherit; text-decoration: none; border-bottom: 1px solid transparent; transition: 0.3s; }}
    .source-link:hover {{ border-bottom-color: var(--primary); color: var(--primary); }}
    
    .asset-details {{ background: #fafafa; border-radius: 4px; padding: 12px; margin-bottom: 16px; border: 1px solid #f0f0f0; }}
    .asset-line {{ margin-bottom: 8px; }}
    .asset-key {{ font-size: 11px; color: var(--primary); font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 2px; }}
    .asset-value {{ font-size: 14px; color: #424242; }}
    
    .snippet {{ font-size: 14px; line-height: 1.6; color: #424242; }}
    .snippet-label {{ font-size: 11px; font-weight: 700; color: #9e9e9e; text-transform: uppercase; margin-right: 8px; border: 1px solid #e0e0e0; padding: 1px 4px; border-radius: 2px; }}
    
    .chips {{ display: flex; gap: 6px; flex-wrap: wrap; margin-top: 16px; }}
    .chip {{ background: #f5f5f5; color: var(--text-muted); padding: 2px 10px; border-radius: 12px; font-size: 12px; text-decoration: none; transition: 0.2s; border: 1px solid #e0e0e0; }}
    .chip:hover {{ background: var(--primary); color: white; border-color: var(--primary); }}
    
    .card-footer {{ padding: 12px 20px; border-top: 1px solid #f0f0f0; display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted); background: #fafafa; gap: 12px; }}
    .path-assist {{ font-style: italic; opacity: 0.7; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 300px; }}
    
    .pagination {{ display: flex; justify-content: center; gap: 4px; margin: 40px 0; }}
    .page {{ text-decoration: none; color: var(--text-main); min-width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: 0.2s; }}
    .page:hover {{ background: rgba(0,0,0,0.05); }}
    .page.current {{ background: var(--primary); color: white; font-weight: 500; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }}
    .gap {{ align-self: center; padding: 0 8px; color: var(--text-muted); }}

    @media (max-width: 600px) {{
      .search-row {{ flex-direction: column; }}
      .card-header {{ flex-wrap: wrap; }}
      .btn-fab-mini {{ order: -1; margin-left: auto; }}
    }}
  </style>
</head>
<body>
  <div class="app-bar">
    <a href="/" class="brand">moreway</a>
  </div>
  
  <div class="container">
    <div class="search-panel">
      <form method="get" action="/search">
        <div class="search-row">
          <div class="input-field">
            <label>搜索关键词</label>
            <input type="text" name="q" value="{escaped_query}" placeholder="搜索你的资产..." autofocus>
          </div>
          <div class="input-field">
            <label>标签过滤</label>
            <input type="text" name="tag" value="{escaped_tags}" placeholder="例如: AI, 笔记">
          </div>
        </div>
        <input type="hidden" name="min_score" value="{min_score}">
        <div style="margin-top: 20px; display: flex; gap: 12px;">
          <button type="submit" class="btn">立即搜索</button>
          <button type="button" class="btn secondary" onclick="window.location.href='/'">清空重置</button>
        </div>
      </form>
    </div>
    
    {meta_summary}
    <div class="tagrail">{tag_links}</div>
    
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
        if parsed.path == "/asset-card":
            params = parse_qs(parsed.query, keep_blank_values=False)
            card_id = (params.get("id") or [""])[0].strip()
            markdown = _load_asset_card_markdown(self.config, card_id)
            if markdown is None:
                self._write_json(HTTPStatus.NOT_FOUND, {"ok": False, "error": "asset_card_not_found"})
                return
            self._write_markdown(HTTPStatus.OK, markdown)
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

    def _write_markdown(self, status: HTTPStatus, markdown_text: str) -> None:
        body = markdown_text.encode("utf-8")
        self.send_response(status)
        self.send_header("content-type", "text/markdown; charset=utf-8")
        self.send_header("content-length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def build_server(config: Config) -> ThreadingHTTPServer:
    handler = type("MorewayHandler", (AppHandler,), {"config": config})
    return ThreadingHTTPServer((config.host, config.port), handler)
