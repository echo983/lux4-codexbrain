from __future__ import annotations

import unittest

from scripts.openai_planet_texture_experiment import build_planet_texture_prompt


class OpenAIPlanetTextureExperimentTests(unittest.TestCase):
    def test_build_prompt_mentions_equirectangular_texture(self) -> None:
        prompt = build_planet_texture_prompt(mode="apple", style="quiet premium cartography", notes="preserve broad oceans")
        self.assertIn("equirectangular", prompt)
        self.assertIn("not a rendered 3D globe", prompt)
        self.assertIn("Apple-like industrial design finish", prompt)
        self.assertIn("preserve broad oceans", prompt)


if __name__ == "__main__":
    unittest.main()
