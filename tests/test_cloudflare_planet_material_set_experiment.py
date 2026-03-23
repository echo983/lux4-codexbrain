from __future__ import annotations

import unittest

from scripts.cloudflare_planet_material_set_experiment import MATERIAL_PROMPTS


class CloudflarePlanetMaterialSetExperimentTests(unittest.TestCase):
    def test_material_prompts_cover_expected_biomes(self) -> None:
        self.assertEqual(
            set(MATERIAL_PROMPTS),
            {"deep_ocean", "shallow_ocean", "coast", "lowland", "upland", "mountain_snow", "north_pole", "south_pole"},
        )


if __name__ == "__main__":
    unittest.main()
