from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from PIL import Image

from scripts.bake_moreway_planet_material_textures import (
    bake_for_manifest,
    choose_land_families,
    derive_region_style_fields,
    load_variants,
    resolve_family_variants,
)


class BakeMorewayPlanetMaterialTexturesTests(unittest.TestCase):
    def test_bake_for_manifest_preserves_existing_baked_textures(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            build_dir = root / "builds" / "build-1"
            build_dir.mkdir(parents=True, exist_ok=True)
            manifest_path = build_dir / "manifest.json"
            manifest_path.write_text(
                json.dumps(
                    {
                        "build_id": "build-1",
                        "planet": {
                            "surface_map": {
                                "lat_steps": 2,
                                "lon_steps": 2,
                                "land_threshold": 128,
                                "values": [0, 64, 192, 255],
                            },
                            "baked_textures": {
                                "openai_materials": "builds/build-1/textures/openai_materials.png",
                            },
                        },
                    },
                    ensure_ascii=False,
                    indent=2,
                ),
                encoding="utf-8",
            )

            class FakeImage:
                def save(self, path: Path) -> None:
                    Path(path).write_bytes(b"fake")

            with patch("scripts.bake_moreway_planet_material_textures.bake_texture", return_value=FakeImage()):
                baked = bake_for_manifest(manifest_path, modes=["openai_materials"])

            self.assertEqual(
                baked["openai_materials"],
                "builds/build-1/textures/openai_materials.png",
            )

            written = json.loads(manifest_path.read_text(encoding="utf-8"))
            self.assertEqual(
                written["planet"]["baked_textures"]["openai_materials"],
                "builds/build-1/textures/openai_materials.png",
            )
            self.assertEqual(written["planet"]["material_style"]["version"], "v2")
            self.assertEqual(written["planet"]["material_style"]["provider"], "openai")
            self.assertIn("lowland_forest", written["planet"]["material_style"]["families"])
            self.assertIn("vegetation", written["planet"]["material_style"]["style_fields"])

    def test_region_style_fields_and_land_family_selection_use_new_taxonomy(self) -> None:
        lush = derive_region_style_fields(u=0.18, v=0.52, compressed_land=0.32)
        dry = derive_region_style_fields(u=0.82, v=0.44, compressed_land=0.32, continent_bias=0.8)
        cold = derive_region_style_fields(u=0.11, v=0.96, compressed_land=0.94)

        self.assertGreaterEqual(lush["vegetation"], 0.0)
        self.assertLessEqual(lush["vegetation"], 1.0)
        self.assertGreater(dry["dryness"], lush["dryness"])

        lush_primary, lush_secondary = choose_land_families(0.32, lush)
        dry_primary, dry_secondary = choose_land_families(0.32, dry)
        cold_primary, cold_secondary = choose_land_families(0.94, cold)

        self.assertIn(lush_primary, {"lowland_forest", "lowland_grass"})
        self.assertIn(lush_secondary, {"lowland_forest", "lowland_grass"})
        self.assertIn(dry_primary, {"lowland_forest", "lowland_grass"})
        self.assertIn(cold_primary, {"mountain_snow", "mountain_rock"})
        self.assertNotEqual(cold_primary, cold_secondary)

    def test_load_variants_supports_formal_asset_layout(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            family_dir = root / "mid_ocean"
            family_dir.mkdir(parents=True, exist_ok=True)
            Image.new("RGB", (1, 1), (12, 34, 56)).save(family_dir / "albedo_01.png")
            variants = load_variants(root, "mid_ocean", 3)
            self.assertEqual(len(variants), 1)
            self.assertEqual(variants[0][2:], (1, 1))

    def test_resolve_family_variants_prefers_dedicated_family_before_legacy_alias(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            dedicated = root / "mid_ocean"
            legacy = root / "deep_ocean"
            dedicated.mkdir(parents=True, exist_ok=True)
            legacy.mkdir(parents=True, exist_ok=True)
            Image.new("RGB", (1, 1), (10, 20, 30)).save(dedicated / "albedo_01.png")
            Image.new("RGB", (1, 1), (200, 210, 220)).save(legacy / "albedo_01.png")

            variants = resolve_family_variants(root, "mid_ocean", 3)
            self.assertEqual(variants[0][1][0, 0], (10, 20, 30))


if __name__ == "__main__":
    unittest.main()
