#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any

try:
    from scripts.cloudflare_bge_m3_embed import get_embeddings, resolve_config as resolve_embedding_config
    from scripts.google_keep_deep_asset_card_pipeline import (
        ASSET_CARD_SCHEMA,
        ASSET_DOC_KIND,
        GOOGLE_KEEP_SOURCE_TYPE,
        default_index_path,
    )
    from scripts.lancedb_local_api import post_json, resolve_lancedb_url
except ModuleNotFoundError:
    from cloudflare_bge_m3_embed import get_embeddings, resolve_config as resolve_embedding_config
    from google_keep_deep_asset_card_pipeline import (
        ASSET_CARD_SCHEMA,
        ASSET_DOC_KIND,
        GOOGLE_KEEP_SOURCE_TYPE,
        default_index_path,
    )
    from lancedb_local_api import post_json, resolve_lancedb_url


FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n", re.S)


def _parse_frontmatter(text: str) -> tuple[dict[str, Any], str]:
    match = FRONTMATTER_RE.match(text)
    if not match:
        return {}, text
    payload: dict[str, Any] = {}
    for line in match.group(1).splitlines():
        if ":" not in line:
            continue
        key, raw_value = line.split(":", 1)
        key = key.strip()
        value = raw_value.strip()
        if value.startswith("[") and value.endswith("]"):
            try:
                payload[key] = json.loads(value)
                continue
            except json.JSONDecodeError:
                pass
        if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
            value = value[1:-1]
        payload[key] = value
    return payload, text[match.end() :]


def _yaml_value(value: Any) -> str:
    if isinstance(value, list):
        return json.dumps(value, ensure_ascii=False)
    if isinstance(value, str):
        if value == "":
            return '""'
        if any(ch in value for ch in [":", "#", "[", "]", "{", "}", ",", '"', "'"]) or value != value.strip():
            escaped = value.replace("\\", "\\\\").replace('"', '\\"')
            return f'"{escaped}"'
        return value
    return str(value)


def _render_frontmatter(frontmatter: dict[str, Any], body: str) -> str:
    preferred_order = [
        "id",
        "doc_kind",
        "source_type",
        "card_schema",
        "tags",
        "retrieval_terms",
        "category_path",
        "created_at",
        "priority",
        "source_snapshot_fid",
        "keep_json_fid",
        "keep_md_fid",
        "keep_html_fid",
        "attachment_fids",
        "path_in_snapshot",
        "note_title",
    ]
    lines = ["---"]
    seen: set[str] = set()
    for key in preferred_order:
        if key in frontmatter:
            lines.append(f"{key}: {_yaml_value(frontmatter[key])}")
            seen.add(key)
    for key, value in frontmatter.items():
        if key in seen:
            continue
        lines.append(f"{key}: {_yaml_value(value)}")
    lines.append("---")
    return "\n".join(lines) + "\n\n" + body.lstrip("\n")


def _build_metadata(frontmatter: dict[str, Any]) -> dict[str, Any]:
    metadata = {
        "doc_kind": ASSET_DOC_KIND,
        "source_type": GOOGLE_KEEP_SOURCE_TYPE,
        "card_schema": ASSET_CARD_SCHEMA,
        "source_snapshot_fid": str(frontmatter.get("source_snapshot_fid") or ""),
        "keep_json_fid": str(frontmatter.get("keep_json_fid") or ""),
        "keep_md_fid": str(frontmatter.get("keep_md_fid") or ""),
        "keep_html_fid": str(frontmatter.get("keep_html_fid") or ""),
        "attachment_fids": frontmatter.get("attachment_fids") if isinstance(frontmatter.get("attachment_fids"), list) else [],
        "path_in_snapshot": str(frontmatter.get("path_in_snapshot") or ""),
        "note_title": str(frontmatter.get("note_title") or ""),
        "created_at": str(frontmatter.get("created_at") or ""),
        "tags": frontmatter.get("tags") if isinstance(frontmatter.get("tags"), list) else [],
        "category_path": str(frontmatter.get("category_path") or ""),
        "priority": str(frontmatter.get("priority") or ""),
    }
    return metadata


def _chunk_documents(documents: list[dict[str, Any]], max_docs: int, max_total_chars: int) -> list[list[dict[str, Any]]]:
    chunks: list[list[dict[str, Any]]] = []
    current: list[dict[str, Any]] = []
    current_chars = 0
    for item in documents:
        text_len = len(item["text"])
        if current and (len(current) >= max_docs or current_chars + text_len > max_total_chars):
            chunks.append(current)
            current = []
            current_chars = 0
        current.append(item)
        current_chars += text_len
    if current:
        chunks.append(current)
    return chunks


def migrate_asset_cards(*, output_dir: Path, table: str, batch_size: int) -> dict[str, Any]:
    index_path = default_index_path(output_dir, table)
    index = json.loads(index_path.read_text(encoding="utf-8")) if index_path.exists() else {}
    card_files = sorted(output_dir.glob("keep_*.md"))
    account_id, token, model = resolve_embedding_config()

    updated_docs: list[dict[str, Any]] = []
    touched_files = 0
    for path in card_files:
        text = path.read_text(encoding="utf-8", errors="replace")
        frontmatter, body = _parse_frontmatter(text)
        if not frontmatter:
            continue
        frontmatter["doc_kind"] = ASSET_DOC_KIND
        frontmatter["source_type"] = GOOGLE_KEEP_SOURCE_TYPE
        frontmatter["card_schema"] = ASSET_CARD_SCHEMA
        rendered = _render_frontmatter(frontmatter, body)
        if rendered != text:
            path.write_text(rendered, encoding="utf-8")
            touched_files += 1
        metadata = _build_metadata(frontmatter)
        updated_docs.append(
            {
                "id": str(frontmatter.get("id") or path.stem),
                "text": rendered,
                "metadata": metadata,
                "path_in_snapshot": metadata["path_in_snapshot"],
            }
        )
        if metadata["path_in_snapshot"] in index:
            index[metadata["path_in_snapshot"]]["doc_kind"] = ASSET_DOC_KIND
            index[metadata["path_in_snapshot"]]["source_type"] = GOOGLE_KEEP_SOURCE_TYPE
            index[metadata["path_in_snapshot"]]["card_schema"] = ASSET_CARD_SCHEMA

    upserted = 0
    for batch in _chunk_documents(updated_docs, max_docs=batch_size, max_total_chars=15000):
        vectors = get_embeddings([item["text"] for item in batch], account_id=account_id, token=token, model=model)
        documents = []
        for item, vector in zip(batch, vectors, strict=True):
            documents.append(
                {
                    "id": item["id"],
                    "text": item["text"],
                    "vector": vector,
                    "metadata": item["metadata"],
                }
            )
        response = post_json(
            f"{resolve_lancedb_url()}/upsert",
            {
                "table": table,
                "documents": documents,
            },
        )
        upserted += int(response.get("rows_written", 0))

    if index_path.exists():
        index_path.write_text(json.dumps(index, ensure_ascii=False, indent=2, sort_keys=True), encoding="utf-8")

    return {
        "table": table,
        "output_dir": str(output_dir),
        "card_files": len(card_files),
        "touched_files": touched_files,
        "rows_upserted": upserted,
        "index_path": str(index_path),
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Add explicit asset-card markers to existing Google Keep asset cards and re-upsert them into "
            "LanceDB using fresh embeddings. This script does not call any LLM or regenerate asset content."
        )
    )
    parser.add_argument("--table", default="google_keep_asset_cards_directmd_eval200")
    parser.add_argument("--output-dir", default="var/google_keep_asset_cards_directmd_eval200")
    parser.add_argument("--batch-size", type=int, default=32)
    args = parser.parse_args()

    result = migrate_asset_cards(
        output_dir=Path(args.output_dir),
        table=args.table,
        batch_size=args.batch_size,
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
