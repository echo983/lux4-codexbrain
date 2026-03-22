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


@dataclass(frozen=True)
class SurfaceGenerationConfig:
    lat_steps: int = 72
    lon_steps: int = 144
    smoothing_passes: int = 1
    land_fraction: float = 0.29
    cluster_iterations: int = 6
    keep_top_clusters: int = 4
    angular_bins: int = 48
    tail_quantile: float = 0.88
    tail_multiplier: float = 1.08
    point_cutoff: float = 0.90
    point_power: float = 4.4
    outer_extension_cutoff: float = 0.84
    outer_extension_weight: float = 0.26


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


def _dot(a: tuple[float, float, float], b: tuple[float, float, float]) -> float:
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]


def _cross(a: tuple[float, float, float], b: tuple[float, float, float]) -> tuple[float, float, float]:
    return (
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    )


def _add(a: tuple[float, float, float], b: tuple[float, float, float]) -> tuple[float, float, float]:
    return (a[0] + b[0], a[1] + b[1], a[2] + b[2])


def _project_to_local_plane(
    point: tuple[float, float, float],
    center: tuple[float, float, float],
    tangent_x: tuple[float, float, float],
    tangent_y: tuple[float, float, float],
) -> tuple[float, float]:
    return (_dot(point, tangent_x), _dot(point, tangent_y))


def _quantile(values: list[float], q: float) -> float:
    if not values:
        return 0.0
    ordered = sorted(values)
    if len(ordered) == 1:
        return ordered[0]
    q = min(max(q, 0.0), 1.0)
    pos = q * (len(ordered) - 1)
    lo = int(math.floor(pos))
    hi = int(math.ceil(pos))
    if lo == hi:
        return ordered[lo]
    t = pos - lo
    return ordered[lo] * (1.0 - t) + ordered[hi] * t


def _point_in_polygon(point: tuple[float, float], polygon: list[tuple[float, float]]) -> bool:
    x, y = point
    inside = False
    j = len(polygon) - 1
    for i in range(len(polygon)):
        xi, yi = polygon[i]
        xj, yj = polygon[j]
        intersects = ((yi > y) != (yj > y)) and (
            x < (xj - xi) * (y - yi) / max((yj - yi), 1e-12) + xi
        )
        if intersects:
            inside = not inside
        j = i
    return inside


def _cluster_seed_count(direction_count: int) -> int:
    return max(6, min(18, round(math.sqrt(direction_count) / 3)))


def _smooth_surface_values(values: list[float], *, lat_steps: int, lon_steps: int) -> list[float]:
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


def _normalize_surface_values(values: list[float]) -> list[int]:
    min_value = min(values)
    max_value = max(values)
    if max_value <= min_value:
        return [128 for _ in values]
    return [
        int(round(((value - min_value) / (max_value - min_value)) * 255.0))
        for value in values
    ]


def _cluster_surface_directions(
    directions: list[tuple[float, float, float]],
    *,
    cluster_count: int | None = None,
    iterations: int = 6,
    keep_top_clusters: int = 4,
    angular_bins: int = 48,
    tail_quantile: float = 0.88,
    tail_multiplier: float = 1.08,
) -> list[dict[str, Any]]:
    if not directions:
        return []
    if cluster_count is None:
        cluster_count = _cluster_seed_count(len(directions))
    cluster_count = max(1, min(cluster_count, len(directions)))

    seeds = [directions[0]]
    while len(seeds) < cluster_count:
        best_direction = None
        best_distance = -1.0
        for direction in directions:
            nearest = max(_dot(direction, seed) for seed in seeds)
            distance = 1.0 - nearest
            if distance > best_distance:
                best_distance = distance
                best_direction = direction
        assert best_direction is not None
        seeds.append(best_direction)

    centers = seeds[:]
    assignments = [0 for _ in directions]
    for _ in range(iterations):
        groups = [[] for _ in centers]
        for index, direction in enumerate(directions):
            best_idx = max(range(len(centers)), key=lambda i: _dot(direction, centers[i]))
            assignments[index] = best_idx
            groups[best_idx].append(direction)

        next_centers: list[tuple[float, float, float]] = []
        for i, group in enumerate(groups):
            if not group:
                next_centers.append(centers[i])
                continue
            summed = (0.0, 0.0, 0.0)
            for direction in group:
                summed = _add(summed, direction)
            next_centers.append(_normalize_direction(summed))
        centers = next_centers

    groups = [[] for _ in centers]
    for direction, assignment in zip(directions, assignments):
        groups[assignment].append(direction)

    clusters: list[dict[str, Any]] = []
    total = float(len(directions))
    north = (0.0, 1.0, 0.0)
    east = (1.0, 0.0, 0.0)
    for center, group in zip(centers, groups):
        if len(group) < 3:
            continue
        tangent_x = _cross(north, center)
        if math.sqrt(_dot(tangent_x, tangent_x)) < 1e-6:
            tangent_x = _cross(east, center)
        tangent_x = _normalize_direction(tangent_x)
        tangent_y = _normalize_direction(_cross(center, tangent_x))

        member_radii: list[float] = []
        projected_members: list[tuple[int, float, tuple[float, float]]] = []
        for member in group:
            px, py = _project_to_local_plane(member, center, tangent_x, tangent_y)
            angle = math.atan2(py, px)
            radius = math.sqrt(px * px + py * py)
            if radius <= 1e-6:
                continue
            member_radii.append(radius)
            bin_index = int(((angle + math.pi) / (2.0 * math.pi)) * angular_bins) % angular_bins
            projected_members.append((bin_index, radius, (px, py)))

        if len(projected_members) < 3:
            continue

        # Truncate long-tail outliers so a few extreme points do not create
        # unnatural spikes or stretched peninsulas in the continental hull.
        radius_cap = _quantile(member_radii, tail_quantile) * tail_multiplier
        bin_best: dict[int, tuple[float, tuple[float, float]]] = {}
        for bin_index, radius, point in projected_members:
            if radius > radius_cap and radius > 0.0:
                scale = radius_cap / radius
                point = (point[0] * scale, point[1] * scale)
                radius = radius_cap
            best = bin_best.get(bin_index)
            if best is None or radius > best[0]:
                bin_best[bin_index] = (radius, point)

        polygon = [
            point for _, point in sorted(bin_best.values(), key=lambda item: math.atan2(item[1][1], item[1][0]))
        ]
        if len(polygon) < 3:
            continue

        clusters.append(
            {
                "center": center,
                "weight": len(group) / total,
                "members": group,
                "tangent_x": tangent_x,
                "tangent_y": tangent_y,
                "polygon": polygon,
            }
        )
    clusters.sort(key=lambda cluster: cluster["weight"], reverse=True)
    return clusters[: max(1, keep_top_clusters)]


def _cluster_landmass_strength(
    cluster: dict[str, Any],
    cell: tuple[float, float, float],
    *,
    point_cutoff: float,
    point_power: float,
    outer_extension_cutoff: float,
    outer_extension_weight: float,
) -> float:
    local_point = _project_to_local_plane(
        cell,
        cluster["center"],
        cluster["tangent_x"],
        cluster["tangent_y"],
    )
    inside_polygon = _point_in_polygon(local_point, cluster["polygon"])
    edge_growth = 0.0
    for member in cluster["members"]:
        dot = max(-1.0, min(1.0, _dot(member, cell)))
        proximity = (dot + 1.0) * 0.5
        if proximity <= point_cutoff:
            continue
        local = (proximity - point_cutoff) / max(1.0 - point_cutoff, 1e-9)
        edge_growth += local ** point_power

    density_shape = edge_growth ** 0.58 if edge_growth > 0.0 else 0.0
    if inside_polygon:
        return (0.50 + density_shape * 0.82) * (0.7 + cluster["weight"] ** 0.55)
    if density_shape <= 0.0:
        return 0.0

    center_dot = max(-1.0, min(1.0, _dot(cluster["center"], cell)))
    center_proximity = (center_dot + 1.0) * 0.5
    if center_proximity <= outer_extension_cutoff:
        return 0.0
    outer_bias = (center_proximity - outer_extension_cutoff) / max(1.0 - outer_extension_cutoff, 1e-9)
    return (
        density_shape
        * outer_bias
        * outer_extension_weight
        * (0.72 + cluster["weight"] ** 0.5)
    )


def build_surface_density_map(
    points: list[tuple[float, float, float]],
    *,
    lat_steps: int = 72,
    lon_steps: int = 144,
    smoothing_passes: int = 1,
    land_fraction: float = 0.29,
) -> dict[str, Any]:
    config = SurfaceGenerationConfig(
        lat_steps=lat_steps,
        lon_steps=lon_steps,
        smoothing_passes=smoothing_passes,
        land_fraction=land_fraction,
    )
    return build_surface_density_map_with_config(points, config)


def build_surface_density_map_with_config(
    points: list[tuple[float, float, float]],
    config: SurfaceGenerationConfig,
) -> dict[str, Any]:
    if not points:
        values = [0 for _ in range(config.lat_steps * config.lon_steps)]
        return {
            "lat_steps": config.lat_steps,
            "lon_steps": config.lon_steps,
            "values": values,
            "land_threshold": 128,
        }

    directions = [_normalize_direction(point) for point in points]
    clusters = _cluster_surface_directions(
        directions,
        iterations=config.cluster_iterations,
        keep_top_clusters=config.keep_top_clusters,
        angular_bins=config.angular_bins,
        tail_quantile=config.tail_quantile,
        tail_multiplier=config.tail_multiplier,
    )
    raw_values: list[float] = []
    for lat_idx in range(config.lat_steps):
        v = (lat_idx + 0.5) / config.lat_steps
        theta = v * math.pi
        sin_theta = math.sin(theta)
        cos_theta = math.cos(theta)
        for lon_idx in range(config.lon_steps):
            u = (lon_idx + 0.5) / config.lon_steps
            phi = u * (2.0 * math.pi)
            cell = (
                -math.cos(phi) * sin_theta,
                cos_theta,
                math.sin(phi) * sin_theta,
            )
            land = 0.0
            for cluster in clusters:
                candidate = _cluster_landmass_strength(
                    cluster,
                    cell,
                    point_cutoff=config.point_cutoff,
                    point_power=config.point_power,
                    outer_extension_cutoff=config.outer_extension_cutoff,
                    outer_extension_weight=config.outer_extension_weight,
                )
                if candidate > land:
                    land = candidate
            raw_values.append(land)

    values = raw_values
    for _ in range(config.smoothing_passes):
        values = _smooth_surface_values(values, lat_steps=config.lat_steps, lon_steps=config.lon_steps)

    normalized = _normalize_surface_values(values)

    sorted_values = sorted(normalized)
    # Earth-like land/ocean split: about 29% land, 71% ocean.
    land_fraction = min(max(config.land_fraction, 0.01), 0.99)
    threshold_index = int(len(sorted_values) * (1.0 - land_fraction))
    threshold_index = min(max(threshold_index, 0), len(sorted_values) - 1)
    land_threshold = sorted_values[threshold_index]
    return {
        "lat_steps": config.lat_steps,
        "lon_steps": config.lon_steps,
        "values": normalized,
        "land_threshold": land_threshold,
        "land_fraction": land_fraction,
        "cluster_count": len(clusters),
    }
