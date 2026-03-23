from __future__ import annotations

import unittest

from scripts.openai_planet_material_set_experiment import DEFAULT_FAMILIES, MATERIAL_PROMPTS, output_path_for


class OpenAIPlanetMaterialSetExperimentTests(unittest.TestCase):
    def test_material_prompts_cover_expected_biomes(self) -> None:
        self.assertTrue(set(DEFAULT_FAMILIES).issubset(set(MATERIAL_PROMPTS)))
        self.assertIn("coast_wet", MATERIAL_PROMPTS)
        self.assertIn("coast_dry", MATERIAL_PROMPTS)
        self.assertIn("mid_ocean", MATERIAL_PROMPTS)
        self.assertIn("coastal_water", MATERIAL_PROMPTS)
        self.assertIn("lowland_grass", MATERIAL_PROMPTS)
        self.assertIn("lowland_forest", MATERIAL_PROMPTS)
        self.assertIn("upland_temperate", MATERIAL_PROMPTS)
        self.assertIn("upland_dry", MATERIAL_PROMPTS)
        self.assertIn("mountain_rock", MATERIAL_PROMPTS)

    def test_output_path_for_variant_suffix(self) -> None:
        from pathlib import Path
        root = Path("/tmp/materials")
        self.assertEqual(str(output_path_for(root, "lowland_grass", 0)), "/tmp/materials/lowland_grass.png")
        self.assertEqual(str(output_path_for(root, "lowland_grass", 1)), "/tmp/materials/lowland_grass_02.png")


if __name__ == "__main__":
    unittest.main()
