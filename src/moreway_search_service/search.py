from __future__ import annotations

import json
import re
from base64 import urlsafe_b64decode, urlsafe_b64encode
from collections import Counter
from dataclasses import dataclass
from typing import Any

from scripts.cloudflare_bge_m3_embed import get_embeddings, resolve_config as resolve_embedding_config
from scripts.cloudflare_bge_reranker_base import rerank, resolve_config as resolve_reranker_config
from scripts.build_notfinder_snapshot_static_site import nbss_object_url, resolve_nbss_server_endpoint
from scripts.lancedb_local_api import post_json, resolve_lancedb_url


FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n", re.S)
TITLE_RE = re.compile(r"^#\s+(.+?)\s*$", re.M)
CARD_FIELD_RE = re.compile(r"^\>\s+\*\*(核心观点|意图识别|认知资产)\*\*：\s*(.+?)\s*$", re.M)
ZERO_VECTOR_DIM = 1024


@dataclass(frozen=True)
class SearchHit:
    id: str
    title: str
    note_title: str
    path_in_snapshot: str
    snippet: str
    rerank_score: float | None
    distance: float | None
    source_table: str
    doc_kind: str
    source_type: str
    card_schema: str
    created_at: str
    captured_at: str
    card_created_at: str
    tags: list[str]
    category_path: str
    priority: str
    keep_md_fid: str
    keep_json_fid: str
    core_view: str
    intent: str
    cognitive_asset: str
    group_image_fids: list[str]
    content_completeness: str
    observation_confidence: str
    namespace_id: str
    capture_address: str
    capture_place_id: str
    capture_location_type: str
    capture_result_types: list[str]
    capture_location_latitude: float | None
    capture_location_longitude: float | None


def _prefer_hit(left: SearchHit, right: SearchHit) -> SearchHit:
    if left.doc_kind == right.doc_kind:
        left_score = left.rerank_score if left.rerank_score is not None else float("-inf")
        right_score = right.rerank_score if right.rerank_score is not None else float("-inf")
        return left if left_score >= right_score else right
    if left.doc_kind == "asset_card":
        return left
    if right.doc_kind == "asset_card":
        return right
    return left


def _parse_frontmatter(text: str) -> dict[str, Any]:
    match = FRONTMATTER_RE.match(text)
    if not match:
        return {}
    data: dict[str, Any] = {}
    for raw_line in match.group(1).splitlines():
        if ":" not in raw_line:
            continue
        key, raw_value = raw_line.split(":", 1)
        key = key.strip()
        value = raw_value.strip()
        if value.startswith("[") and value.endswith("]"):
            try:
                data[key] = json.loads(value)
                continue
            except json.JSONDecodeError:
                pass
        if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
            value = value[1:-1]
        data[key] = value
    return data


def _extract_body(text: str) -> str:
    match = FRONTMATTER_RE.match(text)
    return text[match.end() :].strip() if match else text.strip()


def _extract_section_text(text: str, section_title: str) -> str:
    current_title = ""
    current_lines: list[str] = []
    for line in _extract_body(text).splitlines():
        stripped = line.strip()
        if stripped.startswith("#"):
            if current_title == section_title:
                return "\n".join(current_lines).strip()
            current_title = stripped.lstrip("#").strip()
            current_lines = []
            continue
        current_lines.append(line)
    if current_title == section_title:
        return "\n".join(current_lines).strip()
    return ""


def _derive_mobile_display_title(text: str) -> str:
    subject = _extract_section_text(text, "这是什么")
    subject = re.sub(r"\s+", " ", subject).strip()
    if subject:
        subject = re.split(r"[。！？\n]", subject, maxsplit=1)[0].strip()
    subject = re.sub(r"^这是一[张份个组]\s*", "", subject)
    subject = re.sub(r"^一[张份个组]\s*", "", subject)
    subject = re.sub(r"^某[张份个]\s*", "", subject)
    subject = re.sub(r"[，,:：；。！？]+$", "", subject).strip()
    if len(subject) > 32:
        subject = subject[:32].rstrip()
    return subject


def _extract_title(text: str, metadata: dict[str, Any], frontmatter: dict[str, Any]) -> str:
    for candidate in (
        str(frontmatter.get("display_title") or "").strip(),
        str(metadata.get("display_title") or "").strip(),
        str(frontmatter.get("note_title") or "").strip(),
        str(metadata.get("note_title") or "").strip(),
    ):
        if candidate:
            return candidate
    mobile_title = _derive_mobile_display_title(text)
    if mobile_title:
        return mobile_title
    body = _extract_body(text)
    title_match = TITLE_RE.search(body)
    if title_match:
        return title_match.group(1).strip()
    return "Untitled"


def _build_snippet(text: str, max_chars: int = 220) -> str:
    body = TITLE_RE.sub("", _extract_body(text), count=1).strip()
    body = re.sub(r"\s+", " ", body)
    if len(body) <= max_chars:
        return body
    return body[: max_chars - 1].rstrip() + "…"


def _extract_card_fields(text: str) -> tuple[str, str, str]:
    core_view = ""
    intent = ""
    cognitive_asset = ""
    for label, value in CARD_FIELD_RE.findall(text):
        cleaned = re.sub(r"\s+", " ", value).strip()
        if not cleaned:
            continue
        if label == "核心观点" and not core_view:
            core_view = cleaned
        elif label == "意图识别" and not intent:
            intent = cleaned
        elif label == "认知资产" and not cognitive_asset:
            cognitive_asset = cleaned
    return core_view, intent, cognitive_asset


def _normalize_tags(tag_values: list[str]) -> set[str]:
    return {tag.strip().casefold() for tag in tag_values if tag.strip()}


def _coerce_tags(frontmatter: dict[str, Any], metadata: dict[str, Any]) -> list[str]:
    tag_values: list[str] = []
    front_tags = frontmatter.get("tags")
    if isinstance(front_tags, list):
        tag_values.extend(str(item).strip() for item in front_tags if str(item).strip())
    metadata_tags = metadata.get("tags")
    if isinstance(metadata_tags, list):
        tag_values.extend(str(item).strip() for item in metadata_tags if str(item).strip())
    deduped: list[str] = []
    seen: set[str] = set()
    for item in tag_values:
        key = item.casefold()
        if key in seen:
            continue
        seen.add(key)
        deduped.append(item)
    return deduped


def _coerce_string_list(*values: Any) -> list[str]:
    for value in values:
        if isinstance(value, list):
            items = [str(item).strip() for item in value if str(item).strip()]
            if items:
                return items
    return []


def _normalize_doc_kind(raw_id: str, metadata: dict[str, Any], frontmatter: dict[str, Any]) -> str:
    explicit = str(metadata.get("doc_kind") or frontmatter.get("doc_kind") or "").strip()
    if explicit:
        return explicit
    if raw_id.startswith("rawmd::"):
        return "raw_text"
    if raw_id.startswith("keep_"):
        return "asset_card"
    return ""


def _extract_namespace_id(metadata: dict[str, Any], frontmatter: dict[str, Any]) -> str:
    return str(metadata.get("namespace_id") or frontmatter.get("namespace_id") or "").strip()


def _extract_card_created_at(metadata: dict[str, Any], frontmatter: dict[str, Any]) -> str:
    return str(metadata.get("card_created_at") or frontmatter.get("card_created_at") or "").strip()


def _extract_captured_at(metadata: dict[str, Any], frontmatter: dict[str, Any]) -> str:
    return str(
        metadata.get("captured_at")
        or frontmatter.get("captured_at")
        or metadata.get("created_at")
        or frontmatter.get("created_at")
        or ""
    ).strip()


def _extract_capture_location_coordinate(metadata: dict[str, Any], frontmatter: dict[str, Any], key: str) -> float | None:
    value = metadata.get(key)
    if value in (None, ""):
        value = frontmatter.get(key)
    if value in (None, ""):
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _extract_capture_address_field(metadata: dict[str, Any], frontmatter: dict[str, Any], key: str) -> str:
    return str(metadata.get(key) or frontmatter.get(key) or "").strip()


def _extract_capture_result_types(metadata: dict[str, Any], frontmatter: dict[str, Any]) -> list[str]:
    value = metadata.get("capture_result_types")
    if not isinstance(value, list):
        value = frontmatter.get("capture_result_types")
    if not isinstance(value, list):
        return []
    return [str(item).strip() for item in value if str(item).strip()]


def _encode_recent_cursor(card_created_at: str, item_id: str, source_table: str) -> str:
    raw = json.dumps({"card_created_at": card_created_at, "id": item_id, "source_table": source_table}, ensure_ascii=False).encode("utf-8")
    return urlsafe_b64encode(raw).decode("ascii").rstrip("=")


def _decode_recent_cursor(cursor: str) -> tuple[str, str, str]:
    padded = cursor + "=" * (-len(cursor) % 4)
    try:
        decoded = urlsafe_b64decode(padded.encode("ascii")).decode("utf-8")
        payload = json.loads(decoded)
    except Exception as exc:
        raise ValueError("invalid cursor") from exc
    card_created_at = str(payload.get("card_created_at") or "").strip()
    item_id = str(payload.get("id") or "").strip()
    source_table = str(payload.get("source_table") or "").strip()
    if not card_created_at or not item_id:
        raise ValueError("invalid cursor")
    return card_created_at, item_id, source_table


def search_keep_cards(
    query: str,
    *,
    tables: list[str],
    vector_limit: int,
    per_page: int,
    page: int = 1,
    min_score: float = 0.4,
    required_tags: list[str] | None = None,
    namespace_id: str = "",
) -> dict[str, Any]:
    server_endpoint = resolve_nbss_server_endpoint()
    emb_account_id, emb_token, emb_model = resolve_embedding_config()
    rerank_account_id, rerank_token, rerank_model = resolve_reranker_config()
    query_vector = get_embeddings([query], account_id=emb_account_id, token=emb_token, model=emb_model)[0]

    raw_results: list[dict[str, Any]] = []
    for table in tables:
        search_response = post_json(
            f"{resolve_lancedb_url()}/search",
            {
                "table": table,
                "query_vector": query_vector,
                "limit": vector_limit,
            },
        )
        for item in list(search_response.get("results") or []):
            copied = dict(item)
            copied["_source_table"] = table
            raw_results.append(copied)
    required = _normalize_tags(required_tags or [])
    tag_counts: Counter[str] = Counter()

    filtered_candidates: list[dict[str, Any]] = []
    seen_candidates: set[tuple[str, str]] = set()
    for item in raw_results:
        raw_id = str(item.get("id") or "")
        text = str(item.get("text", ""))
        metadata = dict(item.get("metadata") or {})
        frontmatter = _parse_frontmatter(text)
        doc_kind = _normalize_doc_kind(raw_id, metadata, frontmatter)
        item_namespace_id = _extract_namespace_id(metadata, frontmatter)
        tags = _coerce_tags(frontmatter, metadata)
        for tag in tags:
            tag_counts[tag] += 1
        normalized = _normalize_tags(tags)
        if required and not required.issubset(normalized):
            continue
        if namespace_id:
            if doc_kind != "asset_card":
                continue
            if item_namespace_id != namespace_id:
                continue
        dedupe_key = (
            doc_kind,
            str(metadata.get("path_in_snapshot") or ""),
            item_namespace_id,
        )
        if dedupe_key in seen_candidates:
            continue
        seen_candidates.add(dedupe_key)
        filtered_candidates.append(
            {
                "raw": item,
                "text": text,
                "metadata": metadata,
                "frontmatter": frontmatter,
                "tags": tags,
                "doc_kind": doc_kind,
            }
        )

    reranked_hits: list[SearchHit] = []
    candidate_texts = [item["text"] for item in filtered_candidates]
    if candidate_texts:
        reranked_scores = rerank(
            query,
            candidate_texts,
            account_id=rerank_account_id,
            token=rerank_token,
            model=rerank_model,
            top_k=None,
        )
        for score_item in reranked_scores:
            idx = score_item.get("id")
            if not isinstance(idx, int) or idx < 0 or idx >= len(filtered_candidates):
                continue
            score = float(score_item.get("score", 0.0))
            if score < min_score:
                continue
            candidate = filtered_candidates[idx]
            metadata = candidate["metadata"]
            frontmatter = candidate["frontmatter"]
            text = candidate["text"]
            doc_kind = str(candidate.get("doc_kind") or "")
            item_namespace_id = _extract_namespace_id(metadata, frontmatter)
            core_view, intent, cognitive_asset = _extract_card_fields(text)
            reranked_hits.append(
                SearchHit(
                    id=str(candidate["raw"].get("id") or ""),
                    title=_extract_title(text, metadata, frontmatter),
                    note_title=str(metadata.get("note_title") or ""),
                    path_in_snapshot=str(metadata.get("path_in_snapshot") or ""),
                    snippet=_build_snippet(text),
                    rerank_score=score,
                    distance=float(candidate["raw"].get("_distance", 0.0)) if candidate["raw"].get("_distance") is not None else None,
                    source_table=str(candidate["raw"].get("_source_table") or ""),
                    doc_kind=doc_kind,
                    source_type=str(metadata.get("source_type") or frontmatter.get("source_type") or ""),
                    card_schema=str(metadata.get("card_schema") or frontmatter.get("card_schema") or ""),
                    created_at=str(metadata.get("created_at") or frontmatter.get("created_at") or ""),
                    captured_at=_extract_captured_at(metadata, frontmatter),
                    card_created_at=_extract_card_created_at(metadata, frontmatter),
                    tags=candidate["tags"],
                    category_path=str(metadata.get("category_path") or frontmatter.get("category_path") or ""),
                    priority=str(metadata.get("priority") or frontmatter.get("priority") or ""),
                    keep_md_fid=str(metadata.get("keep_md_fid") or ""),
                    keep_json_fid=str(metadata.get("keep_json_fid") or ""),
                    core_view=core_view,
                    intent=intent,
                    cognitive_asset=cognitive_asset,
                    group_image_fids=_coerce_string_list(
                        metadata.get("group_image_fids"),
                        frontmatter.get("group_image_fids"),
                    ),
                    content_completeness=str(
                        metadata.get("content_completeness") or frontmatter.get("content_completeness") or ""
                    ),
                    observation_confidence=str(
                        metadata.get("observation_confidence") or frontmatter.get("observation_confidence") or ""
                    ),
                    namespace_id=item_namespace_id,
                    capture_address=_extract_capture_address_field(metadata, frontmatter, "capture_address"),
                    capture_place_id=_extract_capture_address_field(metadata, frontmatter, "capture_place_id"),
                    capture_location_type=_extract_capture_address_field(
                        metadata, frontmatter, "capture_location_type"
                    ),
                    capture_result_types=_extract_capture_result_types(metadata, frontmatter),
                    capture_location_latitude=_extract_capture_location_coordinate(
                        metadata, frontmatter, "capture_location_latitude"
                    ),
                    capture_location_longitude=_extract_capture_location_coordinate(
                        metadata, frontmatter, "capture_location_longitude"
                    ),
                )
            )

    # Merge logic to combine (Raw Note MD) and (Asset Card MD)
    # Prefer a stable source key:
    # 1. keep_md_fid
    # 2. path_in_snapshot
    # 3. note_title + created_at fallback
    by_note_key: dict[str, SearchHit] = {}
    
    for hit in reranked_hits:
        base_title = hit.note_title if hit.note_title else hit.path_in_snapshot.replace(".json", "").replace(".md", "")
        key = (
            hit.keep_md_fid.strip()
            or hit.path_in_snapshot.strip()
            or f"{base_title.strip().lower()}::{hit.created_at}"
        )
        
        existing = by_note_key.get(key)
        if existing is None:
            by_note_key[key] = hit
        else:
            by_note_key[key] = _prefer_hit(existing, hit)

    deduped_hits = sorted(by_note_key.values(), key=lambda h: h.rerank_score or 0, reverse=True)

    total_results = len(deduped_hits)
    current_page = max(1, page)
    page_size = max(1, per_page)
    total_pages = max(1, (total_results + page_size - 1) // page_size) if total_results else 1
    if current_page > total_pages:
        current_page = total_pages
    start = (current_page - 1) * page_size
    end = start + page_size
    paged_hits = deduped_hits[start:end]

    return {
        "query": query,
        "tables": tables,
        "vector_limit": vector_limit,
        "per_page": page_size,
        "page": current_page,
        "total_pages": total_pages,
        "total_results": total_results,
        "min_score": min_score,
        "required_tags": required_tags or [],
        "namespace_id": namespace_id,
        "vector_hit_count": len(raw_results),
        "filtered_hit_count": len(filtered_candidates),
        "results": [
            {
                "id": hit.id,
                "title": hit.title,
                "note_title": hit.note_title,
                "path_in_snapshot": hit.path_in_snapshot,
                "snippet": hit.snippet,
                "rerank_score": hit.rerank_score,
                "distance": hit.distance,
                "source_table": hit.source_table,
                "doc_kind": hit.doc_kind,
                "source_type": hit.source_type,
                "card_schema": hit.card_schema,
                "created_at": hit.created_at,
                "captured_at": hit.captured_at,
                "card_created_at": hit.card_created_at,
                "tags": hit.tags,
                "category_path": hit.category_path,
                "priority": hit.priority,
                "keep_md_fid": hit.keep_md_fid,
                "md_url": nbss_object_url(hit.keep_md_fid, server_endpoint=server_endpoint) if hit.keep_md_fid else "",
                "card_url": f"/asset-card?id={hit.id}" if hit.doc_kind == "asset_card" and hit.id and hit.card_schema == "deep_asset_card_v1" else "",
                "keep_json_fid": hit.keep_json_fid,
                "core_view": hit.core_view,
                "intent": hit.intent,
                "cognitive_asset": hit.cognitive_asset,
                "group_image_fids": hit.group_image_fids,
                "content_completeness": hit.content_completeness,
                "observation_confidence": hit.observation_confidence,
                "namespace_id": hit.namespace_id,
                "capture_address": hit.capture_address,
                "capture_place_id": hit.capture_place_id,
                "capture_location_type": hit.capture_location_type,
                "capture_result_types": hit.capture_result_types,
                "capture_location_latitude": hit.capture_location_latitude,
                "capture_location_longitude": hit.capture_location_longitude,
            }
            for hit in paged_hits
        ],
        "available_tags": [
            {"tag": tag, "count": count}
            for tag, count in tag_counts.most_common(30)
        ],
        "models": {
            "embedding": emb_model,
            "reranker": rerank_model,
        },
    }


def fetch_card_by_id(
    card_id: str,
    *,
    tables: list[str],
    source_table: str = "",
    scan_limit: int = 100,
    namespace_id: str = "",
) -> dict[str, Any] | None:
    target_id = str(card_id or "").strip()
    if not target_id:
        return None
    server_endpoint = resolve_nbss_server_endpoint()
    candidate_tables = [source_table.strip()] if source_table.strip() else list(tables)
    fallback_tables = [table for table in tables if table not in candidate_tables]
    ordered_tables = candidate_tables + fallback_tables
    zero_vector = [0.0] * ZERO_VECTOR_DIM
    for table in ordered_tables:
        search_response = post_json(
            f"{resolve_lancedb_url()}/search",
            {
                "table": table,
                "query_vector": zero_vector,
                "limit": scan_limit,
            },
        )
        for item in list(search_response.get("results") or []):
            if str(item.get("id") or "").strip() != target_id:
                continue
            text = str(item.get("text", ""))
            metadata = dict(item.get("metadata") or {})
            frontmatter = _parse_frontmatter(text)
            item_namespace_id = _extract_namespace_id(metadata, frontmatter)
            if namespace_id and _normalize_doc_kind(target_id, metadata, frontmatter) == "asset_card" and item_namespace_id != namespace_id:
                continue
            core_view, intent, cognitive_asset = _extract_card_fields(text)
            return {
                "id": target_id,
                "title": _extract_title(text, metadata, frontmatter),
                "doc_kind": _normalize_doc_kind(target_id, metadata, frontmatter),
                "source_type": str(metadata.get("source_type") or frontmatter.get("source_type") or ""),
                "card_schema": str(metadata.get("card_schema") or frontmatter.get("card_schema") or ""),
                "created_at": str(metadata.get("created_at") or frontmatter.get("created_at") or ""),
                "captured_at": _extract_captured_at(metadata, frontmatter),
                "card_created_at": _extract_card_created_at(metadata, frontmatter),
                "tags": _coerce_tags(frontmatter, metadata),
                "category_path": str(metadata.get("category_path") or frontmatter.get("category_path") or ""),
                "priority": str(metadata.get("priority") or frontmatter.get("priority") or ""),
                "keep_md_fid": str(metadata.get("keep_md_fid") or ""),
                "keep_json_fid": str(metadata.get("keep_json_fid") or ""),
                "capture_address": _extract_capture_address_field(metadata, frontmatter, "capture_address"),
                "capture_place_id": _extract_capture_address_field(metadata, frontmatter, "capture_place_id"),
                "capture_location_type": _extract_capture_address_field(
                    metadata, frontmatter, "capture_location_type"
                ),
                "capture_result_types": _extract_capture_result_types(metadata, frontmatter),
                "capture_location_latitude": _extract_capture_location_coordinate(
                    metadata, frontmatter, "capture_location_latitude"
                ),
                "capture_location_longitude": _extract_capture_location_coordinate(
                    metadata, frontmatter, "capture_location_longitude"
                ),
                "group_image_fids": _coerce_string_list(
                    metadata.get("group_image_fids"),
                    frontmatter.get("group_image_fids"),
                ),
                "content_completeness": str(
                    metadata.get("content_completeness") or frontmatter.get("content_completeness") or ""
                ),
                "observation_confidence": str(
                    metadata.get("observation_confidence") or frontmatter.get("observation_confidence") or ""
                ),
                "core_view": core_view,
                "intent": intent,
                "cognitive_asset": cognitive_asset,
                "source_table": table,
                "md_url": nbss_object_url(str(metadata.get("keep_md_fid") or ""), server_endpoint=server_endpoint)
                if str(metadata.get("keep_md_fid") or "").strip()
                else "",
                "markdown": text,
                "snippet": _build_snippet(text),
                "namespace_id": item_namespace_id,
            }
    return None


def list_recent_cards(
    *,
    tables: list[str],
    namespace_id: str,
    limit: int,
    cursor: str = "",
    doc_kind: str = "asset_card",
    source_table: str = "",
    scan_limit: int = 100,
) -> dict[str, Any]:
    if not namespace_id.strip():
        raise ValueError("missing namespace_id")
    normalized_doc_kind = doc_kind.strip() or "asset_card"
    if normalized_doc_kind != "asset_card":
        raise ValueError("unsupported doc_kind")
    cursor_key: tuple[str, str, str] | None = None
    if cursor.strip():
        cursor_key = _decode_recent_cursor(cursor.strip())

    candidate_tables = [source_table.strip()] if source_table.strip() else list(tables)
    fallback_tables = [table for table in tables if table not in candidate_tables]
    ordered_tables = candidate_tables + fallback_tables
    zero_vector = [0.0] * ZERO_VECTOR_DIM
    items: list[dict[str, Any]] = []
    effective_scan_limit = max(1, min(scan_limit, 100))

    for table in ordered_tables:
        search_response = post_json(
            f"{resolve_lancedb_url()}/search",
            {
                "table": table,
                "query_vector": zero_vector,
                "limit": effective_scan_limit,
            },
        )
        for item in list(search_response.get("results") or []):
            raw_id = str(item.get("id") or "").strip()
            if not raw_id:
                continue
            text = str(item.get("text", ""))
            metadata = dict(item.get("metadata") or {})
            frontmatter = _parse_frontmatter(text)
            item_doc_kind = _normalize_doc_kind(raw_id, metadata, frontmatter)
            if item_doc_kind != normalized_doc_kind:
                continue
            item_namespace_id = _extract_namespace_id(metadata, frontmatter)
            if item_namespace_id != namespace_id:
                continue
            card_created_at = _extract_card_created_at(metadata, frontmatter)
            if not card_created_at:
                continue
            sort_key = (card_created_at, raw_id, table)
            if cursor_key is not None and sort_key >= cursor_key:
                continue
            core_view, intent, cognitive_asset = _extract_card_fields(text)
            items.append(
                {
                    "id": raw_id,
                    "title": _extract_title(text, metadata, frontmatter),
                    "note_title": str(metadata.get("note_title") or ""),
                    "path_in_snapshot": str(metadata.get("path_in_snapshot") or ""),
                    "snippet": _build_snippet(text),
                    "rerank_score": None,
                    "distance": float(item.get("_distance", 0.0)) if item.get("_distance") is not None else None,
                    "source_table": table,
                    "doc_kind": item_doc_kind,
                    "source_type": str(metadata.get("source_type") or frontmatter.get("source_type") or ""),
                    "card_schema": str(metadata.get("card_schema") or frontmatter.get("card_schema") or ""),
                    "created_at": str(metadata.get("created_at") or frontmatter.get("created_at") or ""),
                    "captured_at": _extract_captured_at(metadata, frontmatter),
                    "card_created_at": card_created_at,
                    "tags": _coerce_tags(frontmatter, metadata),
                    "category_path": str(metadata.get("category_path") or frontmatter.get("category_path") or ""),
                    "priority": str(metadata.get("priority") or frontmatter.get("priority") or ""),
                    "keep_md_fid": str(metadata.get("keep_md_fid") or ""),
                    "md_url": nbss_object_url(str(metadata.get("keep_md_fid") or ""), server_endpoint=resolve_nbss_server_endpoint())
                    if str(metadata.get("keep_md_fid") or "").strip()
                    else "",
                    "keep_json_fid": str(metadata.get("keep_json_fid") or ""),
                    "core_view": core_view,
                    "intent": intent,
                    "cognitive_asset": cognitive_asset,
                    "group_image_fids": _coerce_string_list(metadata.get("group_image_fids"), frontmatter.get("group_image_fids")),
                    "content_completeness": str(metadata.get("content_completeness") or frontmatter.get("content_completeness") or ""),
                    "observation_confidence": str(metadata.get("observation_confidence") or frontmatter.get("observation_confidence") or ""),
                    "namespace_id": item_namespace_id,
                    "capture_address": _extract_capture_address_field(metadata, frontmatter, "capture_address"),
                    "capture_place_id": _extract_capture_address_field(metadata, frontmatter, "capture_place_id"),
                    "capture_location_type": _extract_capture_address_field(
                        metadata, frontmatter, "capture_location_type"
                    ),
                    "capture_result_types": _extract_capture_result_types(metadata, frontmatter),
                    "capture_location_latitude": _extract_capture_location_coordinate(
                        metadata, frontmatter, "capture_location_latitude"
                    ),
                    "capture_location_longitude": _extract_capture_location_coordinate(
                        metadata, frontmatter, "capture_location_longitude"
                    ),
                }
            )

    items.sort(key=lambda item: (str(item.get("card_created_at") or ""), str(item.get("id") or ""), str(item.get("source_table") or "")), reverse=True)
    sliced = items[: max(1, min(limit, 50))]
    has_more = len(items) > len(sliced)
    next_cursor = ""
    if has_more and sliced:
        last = sliced[-1]
        next_cursor = _encode_recent_cursor(
            str(last.get("card_created_at") or ""),
            str(last.get("id") or ""),
            str(last.get("source_table") or ""),
        )
    return {
        "namespace_id": namespace_id,
        "items": sliced,
        "next_cursor": next_cursor,
        "has_more": has_more,
        "limit": max(1, min(limit, 50)),
    }
