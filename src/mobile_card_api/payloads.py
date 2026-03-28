from __future__ import annotations

from typing import Any, Mapping


def _extract_markdown_body(markdown_text: str) -> str:
    if markdown_text.startswith("---\n"):
        end = markdown_text.find("\n---\n", 4)
        if end != -1:
            return markdown_text[end + 5 :].strip()
    return markdown_text.strip()


def _build_markdown_blocks(markdown_text: str) -> list[dict[str, str]]:
    body = _extract_markdown_body(markdown_text)
    lines = body.splitlines()
    blocks: list[dict[str, str]] = []
    current_title = ""
    current_lines: list[str] = []
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("#"):
            if current_title or current_lines:
                blocks.append(
                    {
                        "type": "section",
                        "title": current_title,
                        "markdown": "\n".join(current_lines).strip(),
                    }
                )
            current_title = stripped.lstrip("#").strip()
            current_lines = []
            continue
        current_lines.append(line)
    if current_title or current_lines:
        blocks.append(
            {
                "type": "section",
                "title": current_title,
                "markdown": "\n".join(current_lines).strip(),
            }
        )
    cleaned = [block for block in blocks if block["title"] or block["markdown"]]
    if cleaned:
        return cleaned
    if body:
        return [{"type": "section", "title": "", "markdown": body}]
    return []


def _normalize_string_list(value: Any) -> list[str]:
    return [str(item).strip() for item in (value or []) if str(item).strip()]


def _derive_title(item: Mapping[str, Any], blocks: list[dict[str, str]]) -> str:
    title = str(item.get("title") or "").strip()
    if title:
        return title
    if blocks and blocks[0]["title"]:
        return blocks[0]["title"]
    return "Untitled"


def _derive_summary(item: Mapping[str, Any], blocks: list[dict[str, str]], title: str) -> str:
    for key in ("core_view", "snippet"):
        value = str(item.get(key) or "").strip()
        if value:
            return value
    for block in blocks:
        text = str(block.get("markdown") or "").strip()
        if text:
            return text.splitlines()[0].strip()
    return title


def build_mobile_card_detail_response(item: Mapping[str, Any], *, ok: bool = True) -> dict[str, Any]:
    markdown = str(item.get("markdown") or "").strip()
    blocks = _build_markdown_blocks(markdown)
    title = _derive_title(item, blocks)
    summary = _derive_summary(item, blocks, title)
    return {
        "ok": ok,
        "id": str(item.get("id") or ""),
        "docKind": str(item.get("doc_kind") or ""),
        "cardSchema": str(item.get("card_schema") or ""),
        "sourceType": str(item.get("source_type") or ""),
        "sourceTable": str(item.get("source_table") or ""),
        "namespaceId": str(item.get("namespace_id") or ""),
        "title": title,
        "summary": summary,
        "createdAt": str(item.get("card_created_at") or item.get("created_at") or ""),
        "cardCreatedAt": str(item.get("card_created_at") or ""),
        "tags": _normalize_string_list(item.get("tags")),
        "imageRefs": _normalize_string_list(item.get("group_image_fids")),
        "mdUrl": str(item.get("md_url") or ""),
        "markdown": markdown,
        "detail": {
            "schemaVersion": str(item.get("card_schema") or ""),
            "highlights": {
                "coreView": str(item.get("core_view") or ""),
                "intent": str(item.get("intent") or ""),
                "cognitiveAsset": str(item.get("cognitive_asset") or ""),
            },
            "meta": {
                "contentCompleteness": str(item.get("content_completeness") or ""),
                "observationConfidence": str(item.get("observation_confidence") or ""),
                "categoryPath": str(item.get("category_path") or ""),
                "priority": str(item.get("priority") or ""),
            },
            "blocks": blocks,
        },
    }
