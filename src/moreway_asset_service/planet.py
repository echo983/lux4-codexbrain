from __future__ import annotations

from typing import Any

from moreway_search_service.search import (
    _coerce_string_list,
    _coerce_tags,
    _extract_card_created_at,
    _extract_namespace_id,
    _extract_title,
    _normalize_doc_kind,
    _parse_frontmatter,
    _build_snippet,
)
from scripts.build_notfinder_snapshot_static_site import nbss_object_url, resolve_nbss_server_endpoint
from scripts.lancedb_local_api import post_json, resolve_lancedb_url
from src.moreway_planet_explorer.build_utils import compute_bounds, estimate_density, map_points_to_planet_surface, normalize_points


ZERO_VECTOR_DIM = 1024


def _project_vector_to_3d(vector: list[float]) -> tuple[float, float, float]:
    if not vector:
        return (0.0, 0.0, 0.0)
    size = len(vector)
    first = vector[: max(1, size // 3)]
    second = vector[max(1, size // 3) : max(2, (size * 2) // 3)]
    third = vector[max(2, (size * 2) // 3) :]

    def mean(values: list[float]) -> float:
        if not values:
            return 0.0
        return float(sum(values) / len(values))

    return (mean(first), mean(second), mean(third))


def list_planet_points(
    *,
    tables: list[str],
    namespace_id: str,
    limit: int = 200,
    source_table: str = "",
    scan_limit: int = 400,
) -> dict[str, Any]:
    if not namespace_id.strip():
        raise ValueError("missing namespace_id")
    candidate_tables = [source_table.strip()] if source_table.strip() else list(tables)
    fallback_tables = [table for table in tables if table not in candidate_tables]
    ordered_tables = candidate_tables + fallback_tables
    zero_vector = [0.0] * ZERO_VECTOR_DIM
    effective_scan_limit = max(1, min(scan_limit, 100))
    server_endpoint = resolve_nbss_server_endpoint()
    rows: list[dict[str, Any]] = []

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
            if _normalize_doc_kind(raw_id, metadata, frontmatter) != "asset_card":
                continue
            item_namespace_id = _extract_namespace_id(metadata, frontmatter)
            if item_namespace_id != namespace_id:
                continue
            vector = item.get("vector") or []
            if not isinstance(vector, list) or not vector:
                continue
            rows.append(
                {
                    "id": raw_id,
                    "source_table": table,
                    "namespace_id": item_namespace_id,
                    "title": _extract_title(text, metadata, frontmatter),
                    "summary": _build_snippet(text),
                    "doc_kind": "asset_card",
                    "source_type": str(metadata.get("source_type") or frontmatter.get("source_type") or ""),
                    "card_schema": str(metadata.get("card_schema") or frontmatter.get("card_schema") or ""),
                    "created_at": str(metadata.get("created_at") or frontmatter.get("created_at") or ""),
                    "card_created_at": _extract_card_created_at(metadata, frontmatter),
                    "tags": _coerce_tags(frontmatter, metadata),
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
                    "keep_md_fid": str(metadata.get("keep_md_fid") or ""),
                    "vector3": _project_vector_to_3d([float(v) for v in vector]),
                }
            )

    rows.sort(
        key=lambda item: (
            str(item.get("card_created_at") or ""),
            str(item.get("id") or ""),
            str(item.get("source_table") or ""),
        ),
        reverse=True,
    )
    limited = rows[: max(1, min(limit, 500))]
    reduced = [item["vector3"] for item in limited]
    normalized = normalize_points(reduced)
    densities = estimate_density(normalized)
    surface = map_points_to_planet_surface(normalized, densities)

    points: list[dict[str, Any]] = []
    for item, position in zip(limited, surface):
        keep_md_fid = str(item.get("keep_md_fid") or "").strip()
        points.append(
            {
                "id": item["id"],
                "docKind": item["doc_kind"],
                "cardSchema": item["card_schema"],
                "sourceType": item["source_type"],
                "sourceTable": item["source_table"],
                "namespaceId": item["namespace_id"],
                "title": item["title"],
                "summary": item["summary"],
                "createdAt": item["card_created_at"] or item["created_at"],
                "cardCreatedAt": item["card_created_at"],
                "tags": item["tags"],
                "imageRefs": item["group_image_fids"],
                "contentCompleteness": item["content_completeness"],
                "observationConfidence": item["observation_confidence"],
                "mdUrl": nbss_object_url(keep_md_fid, server_endpoint=server_endpoint) if keep_md_fid else "",
                "position": {
                    "x": float(position[0]),
                    "y": float(position[1]),
                    "z": float(position[2]),
                },
            }
        )

    return {
        "namespace_id": namespace_id,
        "point_count": len(points),
        "points": points,
        "bounds": compute_bounds([tuple(point["position"].values()) for point in points]) if points else compute_bounds([]),
    }
