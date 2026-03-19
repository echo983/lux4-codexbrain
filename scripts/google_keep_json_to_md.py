#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import UTC, datetime
from pathlib import Path
from urllib import error, request


NBSS_PREFIX = "NBSS:"
DEFAULT_NBSS_BASE_URL = "http://127.0.0.1:8080/nbss"


def fetch_source_text(source: str) -> str:
    if source.startswith(NBSS_PREFIX):
        fid = source[len(NBSS_PREFIX) :].strip()
        if not fid:
            raise RuntimeError("NBSS source must include a FID after NBSS:.")
        req = request.Request(f"{DEFAULT_NBSS_BASE_URL}/{fid}", method="GET")
        try:
            with request.urlopen(req, timeout=30) as response:
                return response.read().decode("utf-8")
        except error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"NBSS fetch failed with HTTP {exc.code}: {detail}") from exc
        except error.URLError as exc:
            raise RuntimeError(f"NBSS fetch failed: {exc}") from exc

    path = Path(source)
    if not path.exists():
        raise RuntimeError(f"Source not found: {source}")
    return path.read_text(encoding="utf-8")


def format_usec_timestamp(value: object) -> str:
    if value in (None, "", 0, "0"):
        return ""
    try:
        dt = datetime.fromtimestamp(int(value) / 1_000_000, tz=UTC)
    except (TypeError, ValueError, OSError):
        return str(value)
    return dt.isoformat()


def clean_list_item_text(text: str) -> str:
    cleaned = text.strip()
    if cleaned.startswith("• "):
        cleaned = cleaned[2:].strip()
    return cleaned


def normalize_text_content(text: str) -> str:
    normalized = text.replace("\r\n", "\n")
    normalized = re.sub(r"(?i)^\s*<br\s*/?>\s*\n?", "", normalized)
    normalized = re.sub(r"(?i)\n?<br\s*/?>\n?", "\n\n", normalized)
    return normalized.strip()


def keep_note_to_markdown(note: dict[str, object], *, title_fallback: str = "Untitled") -> str:
    title = str(note.get("title") or "").strip() or title_fallback
    lines: list[str] = [f"# {title}", ""]

    meta_lines: list[str] = []
    for key, value in (
        ("Created", format_usec_timestamp(note.get("createdTimestampUsec"))),
        ("Edited", format_usec_timestamp(note.get("userEditedTimestampUsec"))),
        ("Color", str(note.get("color") or "")),
        ("Pinned", "true" if note.get("isPinned") else "false"),
        ("Archived", "true" if note.get("isArchived") else "false"),
        ("Trashed", "true" if note.get("isTrashed") else "false"),
    ):
        if value:
            meta_lines.append(f"- {key}: {value}")

    labels = note.get("labels")
    if isinstance(labels, list) and labels:
        names = [str(item.get("name", "")).strip() for item in labels if isinstance(item, dict) and str(item.get("name", "")).strip()]
        if names:
            meta_lines.append(f"- Labels: {', '.join(names)}")

    if meta_lines:
        lines.extend(meta_lines)
        lines.append("")

    text_content = normalize_text_content(str(note.get("textContent") or ""))
    if text_content.strip():
        lines.append("## Content")
        lines.append("")
        lines.append(text_content.strip())
        lines.append("")

    list_content = note.get("listContent")
    if isinstance(list_content, list) and list_content:
        lines.append("## Checklist")
        lines.append("")
        for item in list_content:
            if not isinstance(item, dict):
                continue
            text = clean_list_item_text(str(item.get("text") or ""))
            checkbox = "[x]" if item.get("isChecked") else "[ ]"
            lines.append(f"- {checkbox} {text}".rstrip())
        lines.append("")

    annotations = note.get("annotations")
    if isinstance(annotations, list) and annotations:
        lines.append("## Annotations")
        lines.append("")
        for item in annotations:
            if not isinstance(item, dict):
                continue
            title_text = str(item.get("title") or "").strip()
            url = str(item.get("url") or "").strip()
            source = str(item.get("source") or "").strip()
            description = str(item.get("description") or "").strip()

            if title_text and url:
                lines.append(f"- [{title_text}]({url})")
            elif url:
                lines.append(f"- {url}")
            elif title_text:
                lines.append(f"- {title_text}")
            if source:
                lines.append(f"  source: {source}")
            if description:
                lines.append(f"  description: {description}")
        lines.append("")

    return "\n".join(lines).rstrip() + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description="Convert a Google Keep note JSON file or NBSS object to Markdown.")
    parser.add_argument("source", help="Local JSON path or NBSS:0x... source.")
    parser.add_argument("--title-fallback", default="Untitled", help="Fallback title when the note title is empty.")
    parser.add_argument("--output", default="", help="Optional output Markdown path. Defaults to stdout.")
    args = parser.parse_args()

    note = json.loads(fetch_source_text(args.source))
    markdown = keep_note_to_markdown(note, title_fallback=args.title_fallback)

    if args.output:
        Path(args.output).write_text(markdown, encoding="utf-8")
    else:
        sys.stdout.write(markdown)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
