from __future__ import annotations

import unittest

from src.moreway_planet_explorer.material_rules import (
    compute_distortion,
    compute_land_band_weights,
    compute_land_ecology,
)


class MaterialRulesTests(unittest.TestCase):
    def test_compute_distortion_wraps_with_longitude_period(self) -> None:
        self.assertAlmostEqual(compute_distortion(0.1, 0.3), compute_distortion(1.1, 0.3))

    def test_compute_land_ecology_returns_clamped_fields(self) -> None:
        fields = compute_land_ecology(0.25, 0.4, 0.6, 0.3)
        for key in ("moisture", "dryness", "vegetation", "coldness"):
            self.assertGreaterEqual(fields[key], 0.0)
            self.assertLessEqual(fields[key], 1.0)

    def test_compute_land_band_weights_only_blends_adjacent_bands(self) -> None:
        coast_lowland = compute_land_band_weights(0.3)
        self.assertGreater(coast_lowland["coast"], 0.0)
        self.assertGreater(coast_lowland["lowland"], 0.0)
        self.assertEqual(coast_lowland["upland"], 0.0)
        self.assertEqual(coast_lowland["mountain"], 0.0)

        upland_mountain = compute_land_band_weights(0.95)
        self.assertEqual(upland_mountain["coast"], 0.0)
        self.assertEqual(upland_mountain["lowland"], 0.0)
        self.assertGreater(upland_mountain["upland"], 0.0)
        self.assertGreater(upland_mountain["mountain"], 0.0)


if __name__ == "__main__":
    unittest.main()
