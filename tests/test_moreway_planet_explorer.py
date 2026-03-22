from __future__ import annotations

import unittest

from src.moreway_planet_explorer.build_utils import (
    PointRecord,
    SurfaceGenerationConfig,
    _cluster_surface_directions,
    build_octree,
    build_surface_density_map,
    build_surface_density_map_with_config,
    estimate_density,
    make_build_id,
    map_points_to_planet_surface,
    normalize_points,
)
from scripts.build_moreway_planet_dataset import build_records


class MorewayPlanetExplorerTests(unittest.TestCase):
    def test_normalize_points_scales_to_unit_range(self) -> None:
        points = [(2.0, 0.0, 0.0), (-1.0, 1.0, 0.5)]
        normalized = normalize_points(points)
        self.assertTrue(all(-1.0 <= v <= 1.0 for point in normalized for v in point))

    def test_normalize_points_centers_offset_cluster(self) -> None:
        points = [(10.0, 10.0, 10.0), (12.0, 10.0, 10.0), (10.0, 12.0, 10.0)]
        normalized = normalize_points(points)
        xs = [p[0] for p in normalized]
        ys = [p[1] for p in normalized]
        self.assertLess(min(xs), 0.0)
        self.assertGreater(max(xs), 0.0)
        self.assertLess(min(ys), 0.0)
        self.assertGreater(max(ys), 0.0)

    def test_estimate_density_returns_value_per_point(self) -> None:
        densities = estimate_density([(0.0, 0.0, 0.0), (1.0, 0.0, 0.0), (0.0, 1.0, 0.0)])
        self.assertEqual(len(densities), 3)
        self.assertTrue(all(value > 0 for value in densities))

    def test_map_points_to_planet_surface_keeps_points_outside_planet_radius(self) -> None:
        points = [(1.0, 0.0, 0.0), (0.0, 2.0, 0.0)]
        mapped = map_points_to_planet_surface(points, [0.5, 1.0])
        self.assertTrue(all((x * x + y * y + z * z) ** 0.5 >= 10.0 for x, y, z in mapped))

    def test_build_octree_splits_records(self) -> None:
        records = [
            PointRecord(str(i), "docs", (float(i), float(i), float(i)), {"title": f"doc-{i}"})
            for i in range(6)
        ]
        octree, chunks = build_octree(records, max_leaf_points=2, max_depth=4)
        self.assertEqual(octree["depth"], 0)
        self.assertGreater(len(chunks), 1)
        self.assertEqual(sum(chunk["point_count"] for chunk in chunks), 6)

    def test_make_build_id_contains_hash_suffix(self) -> None:
        build_id = make_build_id("table-a:10|table-b:20")
        self.assertIn("-", build_id)
        self.assertGreaterEqual(len(build_id.split("-")[-1]), 10)

    def test_build_surface_density_map_shape(self) -> None:
        surface_map = build_surface_density_map(
            [(1.0, 0.0, 0.0), (0.9, 0.1, 0.0), (-1.0, 0.0, 0.0)],
            lat_steps=8,
            lon_steps=16,
            smoothing_passes=1,
        )
        self.assertEqual(surface_map["lat_steps"], 8)
        self.assertEqual(surface_map["lon_steps"], 16)
        self.assertEqual(len(surface_map["values"]), 8 * 16)
        self.assertTrue(all(isinstance(v, int) for v in surface_map["values"]))
        self.assertGreaterEqual(surface_map["land_threshold"], 0)
        self.assertLessEqual(surface_map["land_threshold"], 255)
        self.assertEqual(surface_map["land_fraction"], 0.29)

    def test_build_surface_density_map_with_config_matches_wrapper(self) -> None:
        points = [(1.0, 0.0, 0.0), (0.9, 0.1, 0.0), (-1.0, 0.0, 0.0), (-0.9, -0.1, 0.0)]
        config = SurfaceGenerationConfig(lat_steps=8, lon_steps=16, smoothing_passes=1, land_fraction=0.29)
        direct = build_surface_density_map_with_config(points, config)
        wrapped = build_surface_density_map(points, lat_steps=8, lon_steps=16, smoothing_passes=1, land_fraction=0.29)
        self.assertEqual(direct["values"], wrapped["values"])
        self.assertEqual(direct["land_threshold"], wrapped["land_threshold"])

    def test_cluster_surface_directions_keeps_top5_by_weight(self) -> None:
        directions = []
        center_groups = [
            [(1.0, 0.0, 0.0), (0.98, 0.10, 0.08), (0.98, -0.09, 0.06), (0.98, 0.05, -0.08)],
            [(0.0, 1.0, 0.0), (0.10, 0.98, 0.08), (-0.09, 0.98, 0.06), (0.05, 0.98, -0.08)],
            [(0.0, 0.0, 1.0), (0.10, 0.08, 0.98), (-0.09, 0.06, 0.98), (0.05, -0.08, 0.98)],
            [(-1.0, 0.0, 0.0), (-0.98, 0.10, 0.08), (-0.98, -0.09, 0.06), (-0.98, 0.05, -0.08)],
            [(0.0, -1.0, 0.0), (0.10, -0.98, 0.08), (-0.09, -0.98, 0.06), (0.05, -0.98, -0.08)],
        ]
        counts = [10, 8, 6, 4, 2]
        for group, count in zip(center_groups, counts):
            for i in range(count):
                raw = group[i % len(group)]
                length = sum(v * v for v in raw) ** 0.5
                directions.append(tuple(v / length for v in raw))
        clusters = _cluster_surface_directions(directions, cluster_count=5, iterations=2, keep_top_clusters=5)
        self.assertLessEqual(len(clusters), 5)
        self.assertGreaterEqual(len(clusters), 1)
        weights = [cluster["weight"] for cluster in clusters]
        self.assertEqual(weights, sorted(weights, reverse=True))

    def test_build_records_accepts_json_string_metadata(self) -> None:
        class FakeArray:
            def __init__(self, rows):
                self._rows = rows

            def tolist(self):
                return self._rows

        class FakeUMAP:
            class UMAP:
                def __init__(self, **kwargs):
                    pass

                def fit_transform(self, matrix):
                    return FakeArray([[1.0, 0.0, 0.0], [0.0, 1.0, 0.0]])

        class FakeNumpy:
            @staticmethod
            def array(rows, dtype=float):
                return rows

        rows = [
            {
                "id": "doc-a",
                "_table": "docs",
                "text": "alpha text",
                "vector": [0.1, 0.2],
                "metadata": '{"note_title":"Alpha","path_in_snapshot":"Alpha.json","source_type":"google_keep"}',
            },
            {
                "id": "doc-b",
                "_table": "docs",
                "text": "beta text",
                "vector": [0.3, 0.4],
                "metadata": '{"note_title":"Beta","path_in_snapshot":"Beta.json","source_type":"google_keep"}',
            },
        ]
        records = build_records(rows, FakeNumpy(), FakeUMAP())
        self.assertEqual(records[0].payload["title"], "Alpha")
        self.assertEqual(records[0].payload["path_in_snapshot"], "Alpha.json")
        self.assertEqual(records[0].payload["source_type"], "google_keep")


if __name__ == "__main__":
    unittest.main()
