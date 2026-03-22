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


def _normalize_direction(point: tuple[float, float, float]) -> tuple[float, float, float]:
    x, y, z = point
    length = math.sqrt(x * x + y * y + z * z)
    if length == 0:
        return (0.0, 1.0, 0.0)
    return (x / length, y / length, z / length)


def build_surface_density_map(
    points: list[tuple[float, float, float]],
    *,
    lat_steps: int = 72,
    lon_steps: int = 144,
    smoothing_passes: int = 1,
    land_fraction: float = 0.29,
) -> dict[str, Any]:
    if not points:
        values = [0 for _ in range(lat_steps * lon_steps)]
        return {
            "lat_steps": lat_steps,
            "lon_steps": lon_steps,
            "values": values,
            "land_threshold": 128,
        }

    directions = [_normalize_direction(point) for point in points]
    raw_values: list[float] = []
    for lat_idx in range(lat_steps):
        v = (lat_idx + 0.5) / lat_steps
        theta = v * math.pi
        sin_theta = math.sin(theta)
        cos_theta = math.cos(theta)
        for lon_idx in range(lon_steps):
            u = (lon_idx + 0.5) / lon_steps
            phi = u * (2.0 * math.pi)
            cell = (
                -math.cos(phi) * sin_theta,
                cos_theta,
                math.sin(phi) * sin_theta,
            )
            density = 0.0
            for direction in directions:
                dot = max(-1.0, min(1.0, direction[0] * cell[0] + direction[1] * cell[1] + direction[2] * cell[2]))
                # Strong local contribution near points, fast decay elsewhere.
                density += ((dot + 1.0) * 0.5) ** 14
            raw_values.append(density)

    def smooth(values: list[float]) -> list[float]:
        smoothed: list[float] = []
        for lat_idx in range(lat_steps):
            for lon_idx in range(lon_steps):
                total = 0.0
                weight = 0.0
                for lat_offset in (-1, 0, 1):
                    for lon_offset in (-1, 0, 1):
                        neighbor_lat = min(max(lat_idx + lat_offset, 0), lat_steps - 1)
                        neighbor_lon = (lon_idx + lon_offset) % lon_steps
                        idx = neighbor_lat * lon_steps + neighbor_lon
                        local_weight = 2.0 if lat_offset == 0 and lon_offset == 0 else 1.0
                        total += values[idx] * local_weight
                        weight += local_weight
                smoothed.append(total / weight)
        return smoothed

    values = raw_values
    for _ in range(smoothing_passes):
        values = smooth(values)

    min_value = min(values)
    max_value = max(values)
    if max_value <= min_value:
        normalized = [128 for _ in values]
    else:
        normalized = [
            int(round(((value - min_value) / (max_value - min_value)) * 255.0))
            for value in values
        ]

    sorted_values = sorted(normalized)
    # Earth-like land/ocean split: about 29% land, 71% ocean.
    land_fraction = min(max(land_fraction, 0.01), 0.99)
    threshold_index = int(len(sorted_values) * (1.0 - land_fraction))
    threshold_index = min(max(threshold_index, 0), len(sorted_values) - 1)
    land_threshold = sorted_values[threshold_index]
    return {
        "lat_steps": lat_steps,
        "lon_steps": lon_steps,
        "values": normalized,
        "land_threshold": land_threshold,
        "land_fraction": land_fraction,
    }
