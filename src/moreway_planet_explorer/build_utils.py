from __future__ import annotations

import hashlib
import math
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any

DEFAULT_PLANET_RADIUS = 10.0
DEFAULT_SHELL_THICKNESS = 2.5


@dataclass(frozen=True)
class PointRecord:
    doc_id: str
    table: str
    position: tuple[float, float, float]
    payload: dict[str, Any]


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def make_build_id(source_signature: str) -> str:
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    suffix = hashlib.sha1(source_signature.encode("utf-8")).hexdigest()[:10]
    return f"{stamp}-{suffix}"


def normalize_points(points: list[tuple[float, float, float]]) -> list[tuple[float, float, float]]:
    if not points:
        return []
    count = float(len(points))
    centroid = (
        sum(point[0] for point in points) / count,
        sum(point[1] for point in points) / count,
        sum(point[2] for point in points) / count,
    )
    centered = [
        (x - centroid[0], y - centroid[1], z - centroid[2])
        for x, y, z in points
    ]
    max_abs = max(max(abs(v) for v in point) for point in centered)
    if max_abs == 0:
        return [(0.0, 0.0, 0.0) for _ in points]
    return [(x / max_abs, y / max_abs, z / max_abs) for x, y, z in centered]


def estimate_density(points: list[tuple[float, float, float]], *, k: int = 8) -> list[float]:
    if not points:
        return []
    if len(points) == 1:
        return [1.0]

    densities: list[float] = []
    for i, p in enumerate(points):
        distances: list[float] = []
        for j, q in enumerate(points):
            if i == j:
                continue
            distances.append(math.dist(p, q))
        distances.sort()
        neighbors = distances[: max(1, min(k, len(distances)))]
        mean_dist = sum(neighbors) / len(neighbors)
        densities.append(1.0 / max(mean_dist, 1e-9))
    return densities


def _density_radius(density: float, min_density: float, max_density: float) -> float:
    if max_density <= min_density:
        return DEFAULT_PLANET_RADIUS + DEFAULT_SHELL_THICKNESS * 0.5
    norm = (density - min_density) / (max_density - min_density)
    return DEFAULT_PLANET_RADIUS + (0.25 + 0.75 * norm) * DEFAULT_SHELL_THICKNESS


def map_points_to_planet_surface(
    points: list[tuple[float, float, float]],
    densities: list[float],
) -> list[tuple[float, float, float]]:
    if not points:
        return []
    min_density = min(densities) if densities else 1.0
    max_density = max(densities) if densities else 1.0
    mapped: list[tuple[float, float, float]] = []
    for point, density in zip(points, densities):
        x, y, z = point
        length = math.sqrt(x * x + y * y + z * z)
        if length == 0:
            direction = (0.0, 1.0, 0.0)
        else:
            direction = (x / length, y / length, z / length)
        radius = _density_radius(density, min_density, max_density)
        mapped.append(tuple(component * radius for component in direction))
    return mapped


def compute_bounds(points: list[tuple[float, float, float]]) -> dict[str, list[float]]:
    if not points:
        return {"min": [0.0, 0.0, 0.0], "max": [0.0, 0.0, 0.0]}
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    zs = [p[2] for p in points]
    return {
        "min": [min(xs), min(ys), min(zs)],
        "max": [max(xs), max(ys), max(zs)],
    }


def compute_center(bounds: dict[str, list[float]]) -> list[float]:
    mins = bounds["min"]
    maxs = bounds["max"]
    return [(a + b) / 2.0 for a, b in zip(mins, maxs)]


def child_index_for_point(point: tuple[float, float, float], center: list[float]) -> int:
    idx = 0
    if point[0] >= center[0]:
        idx |= 1
    if point[1] >= center[1]:
        idx |= 2
    if point[2] >= center[2]:
        idx |= 4
    return idx


def subdivide_bounds(bounds: dict[str, list[float]], child_index: int) -> dict[str, list[float]]:
    mins = bounds["min"]
    maxs = bounds["max"]
    center = compute_center(bounds)
    child_min = mins[:]
    child_max = maxs[:]
    for axis in range(3):
        bit = 1 << axis
        if child_index & bit:
            child_min[axis] = center[axis]
        else:
            child_max[axis] = center[axis]
    return {"min": child_min, "max": child_max}


def build_octree(
    records: list[PointRecord],
    *,
    max_leaf_points: int,
    max_depth: int,
) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    chunk_specs: list[dict[str, Any]] = []
    all_points = [record.position for record in records]
    root_bounds = compute_bounds(all_points)

    def walk(node_records: list[PointRecord], bounds: dict[str, list[float]], depth: int, path: str) -> dict[str, Any]:
        center = compute_center(bounds)
        node: dict[str, Any] = {
            "path": path,
            "depth": depth,
            "point_count": len(node_records),
            "bounds": bounds,
            "center": center,
        }
        if len(node_records) <= max_leaf_points or depth >= max_depth:
            chunk_id = f"chunk-{path.replace('/', '-')}"
            node["chunk_id"] = chunk_id
            chunk_specs.append(
                {
                    "chunk_id": chunk_id,
                    "path": f"chunks/{chunk_id}.arrow",
                    "depth": depth,
                    "point_count": len(node_records),
                    "bounds": bounds,
                    "center": center,
                    "records": node_records,
                }
            )
            return node

        groups: dict[int, list[PointRecord]] = {}
        for record in node_records:
            idx = child_index_for_point(record.position, center)
            groups.setdefault(idx, []).append(record)

        children: list[dict[str, Any]] = []
        for idx in sorted(groups):
            child_bounds = subdivide_bounds(bounds, idx)
            children.append(walk(groups[idx], child_bounds, depth + 1, f"{path}/{idx}"))
        node["children"] = children
        return node

    return walk(records, root_bounds, 0, "root"), chunk_specs
