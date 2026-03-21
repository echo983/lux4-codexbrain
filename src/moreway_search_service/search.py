from __future__ import annotations

import json
import re
from collections import Counter
from dataclasses import dataclass
from typing import Any

from scripts.cloudflare_bge_m3_embed import get_embeddings, resolve_config as resolve_embedding_config
from scripts.cloudflare_bge_reranker_base import rerank, resolve_config as resolve_reranker_config
from scripts.google_keep_json_to_md import fetch_source_text
from scripts.lancedb_local_api import post_json, resolve_lancedb_url


FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n", re.S)
TITLE_RE = re.compile(r"^#\s+(.+?)\s*$", re.M)


@dataclass(frozen=True)
class SearchHit:
    id: str
    title: str
    note_title: str
    path_in_snapshot: str
    snippet: str
    rerank_score: float | None
    distance: float | None
    source_type: str
    created_at: str
    tags: list[str]
    category_path: str
    priority: str
    keep_md_fid: str
    keep_json_fid: str


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


def _extract_title(text: str, metadata: dict[str, Any], frontmatter: dict[str, Any]) -> str:
    for candidate in (
        str(frontmatter.get("note_title") or "").strip(),
        str(metadata.get("note_title") or "").strip(),
    ):
        if candidate:
            return candidate
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


def _fetch_keep_labels(keep_json_fid: str, cache: dict[str, list[str]]) -> list[str]:
    if not keep_json_fid:
        return []
    if keep_json_fid in cache:
        return cache[keep_json_fid]
    try:
        raw = json.loads(fetch_source_text(keep_json_fid))
    except Exception:
        cache[keep_json_fid] = []
        return []
    labels = [
        str(item.get("name", "")).strip()
        for item in (raw.get("labels") or [])
        if isinstance(item, dict) and str(item.get("name", "")).strip()
    ]
    cache[keep_json_fid] = labels
    return labels


def _normalize_tags(tag_values: list[str]) -> set[str]:
    return {tag.strip().casefold() for tag in tag_values if tag.strip()}


def _coerce_tags(frontmatter: dict[str, Any], labels: list[str]) -> list[str]:
    front_tags = frontmatter.get("tags")
    tag_values: list[str] = []
    if isinstance(front_tags, list):
        tag_values.extend(str(item).strip() for item in front_tags if str(item).strip())
    tag_values.extend(labels)
    deduped: list[str] = []
    seen: set[str] = set()
    for item in tag_values:
        key = item.casefold()
        if key in seen:
            continue
        seen.add(key)
        deduped.append(item)
    return deduped


def search_keep_cards(
    query: str,
    *,
    table: str,
    vector_limit: int,
    result_limit: int,
    required_tags: list[str] | None = None,
) -> dict[str, Any]:
    emb_account_id, emb_token, emb_model = resolve_embedding_config()
    rerank_account_id, rerank_token, rerank_model = resolve_reranker_config()
    query_vector = get_embeddings([query], account_id=emb_account_id, token=emb_token, model=emb_model)[0]

    search_response = post_json(
        f"{resolve_lancedb_url()}/search",
        {
            "table": table,
            "query_vector": query_vector,
            "limit": vector_limit,
        },
    )
    raw_results = list(search_response.get("results") or [])
    label_cache: dict[str, list[str]] = {}
    required = _normalize_tags(required_tags or [])
    tag_counts: Counter[str] = Counter()

    filtered_candidates: list[dict[str, Any]] = []
    for item in raw_results:
        text = str(item.get("text", ""))
        metadata = dict(item.get("metadata") or {})
        frontmatter = _parse_frontmatter(text)
        labels = _fetch_keep_labels(str(metadata.get("keep_json_fid") or ""), label_cache)
        tags = _coerce_tags(frontmatter, labels)
        for tag in tags:
            tag_counts[tag] += 1
        normalized = _normalize_tags(tags)
        if required and not required.issubset(normalized):
            continue
        filtered_candidates.append(
            {
                "raw": item,
                "text": text,
                "metadata": metadata,
                "frontmatter": frontmatter,
                "tags": tags,
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
            top_k=result_limit,
        )
        for score_item in reranked_scores:
            idx = score_item.get("id")
            if not isinstance(idx, int) or idx < 0 or idx >= len(filtered_candidates):
                continue
            candidate = filtered_candidates[idx]
            metadata = candidate["metadata"]
            frontmatter = candidate["frontmatter"]
            text = candidate["text"]
            reranked_hits.append(
                SearchHit(
                    id=str(candidate["raw"].get("id") or ""),
                    title=_extract_title(text, metadata, frontmatter),
                    note_title=str(metadata.get("note_title") or ""),
                    path_in_snapshot=str(metadata.get("path_in_snapshot") or ""),
                    snippet=_build_snippet(text),
                    rerank_score=float(score_item.get("score", 0.0)),
                    distance=float(candidate["raw"].get("_distance", 0.0)) if candidate["raw"].get("_distance") is not None else None,
                    source_type=str(metadata.get("source_type") or frontmatter.get("source_type") or ""),
                    created_at=str(metadata.get("created_at") or frontmatter.get("created_at") or ""),
                    tags=candidate["tags"],
                    category_path=str(frontmatter.get("category_path") or ""),
                    priority=str(frontmatter.get("priority") or ""),
                    keep_md_fid=str(metadata.get("keep_md_fid") or ""),
                    keep_json_fid=str(metadata.get("keep_json_fid") or ""),
                )
            )

    return {
        "query": query,
        "table": table,
        "vector_limit": vector_limit,
        "result_limit": result_limit,
        "required_tags": required_tags or [],
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
                "source_type": hit.source_type,
                "created_at": hit.created_at,
                "tags": hit.tags,
                "category_path": hit.category_path,
                "priority": hit.priority,
                "keep_md_fid": hit.keep_md_fid,
                "keep_json_fid": hit.keep_json_fid,
            }
            for hit in reranked_hits
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

