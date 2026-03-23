from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from scripts.bake_moreway_planet_material_textures import bake_for_manifest
from src.moreway_planet_explorer.material_bake_core import build_pixel_context, load_material_bundle


class BakeMorewayPlanetMaterialTexturesTests(unittest.TestCase):
    def test_load_material_bundle_loads_primary_and_poles(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for name in [
                "deep_ocean",
                "mid_ocean",
                "shallow_ocean",
                "coastal_water",
                "coast_wet",
                "coast_dry",
                "lowland_grass",
                "lowland_forest",
                "upland_temperate",
                "upland_dry",
                "mountain_rock",
                "mountain_snow",
                "north_pole",
                "north_pole_02",
                "south_pole",
                "south_pole_02",
            ]:
                from PIL import Image
                if name.startswith("north_pole") or name.startswith("south_pole"):
                    family = name.split("_02")[0]
                    channel_name = "albedo_02.png" if name.endswith("_02") else "albedo_01.png"
                else:
                    family = name
                    channel_name = "albedo_01.png"
                family_dir = root / family
                family_dir.mkdir(parents=True, exist_ok=True)
                Image.new("RGB", (2, 2), color=(10, 20, 30)).save(family_dir / channel_name)

            loaded, north_pole, south_pole = load_material_bundle(root)

            self.assertEqual(
                sorted(loaded.keys()),
                [
                    "coast_dry",
                    "coast_wet",
                    "coastal_water",
                    "deep_ocean",
                    "lowland_forest",
                    "lowland_grass",
                    "mid_ocean",
                    "mountain_rock",
                    "mountain_snow",
                    "shallow_ocean",
                    "upland_dry",
                    "upland_temperate",
                ],
            )
            self.assertEqual(len(north_pole), 2)
            self.assertEqual(len(south_pole), 2)
            self.assertEqual(north_pole[0].size, (2, 2))
            self.assertEqual(south_pole[0].size, (2, 2))

    def test_build_pixel_context_produces_expected_ranges(self) -> None:
        from PIL import Image

        surface_map = {
            "lat_steps": 2,
            "lon_steps": 2,
            "land_threshold": 128,
            "values": [0, 64, 192, 255],
        }
        pole = [Image.new("RGB", (4, 4), color=(10, 20, 30))]
        ctx = build_pixel_context(surface_map, 1, 1, 8, 8, pole, pole)

        self.assertGreaterEqual(ctx.su, 0.0)
        self.assertGreaterEqual(ctx.sv, 0.0)
        self.assertGreaterEqual(ctx.value, 0.0)
        self.assertLessEqual(ctx.value, 255.0)
        self.assertEqual(len(ctx.pole_rgb), 3)

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

    def test_bake_for_manifest_writes_normal_and_roughness_outputs(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            asset_root = root / "assets"
            asset_root.mkdir(parents=True, exist_ok=True)
            build_dir = root / "builds" / "build-2"
            build_dir.mkdir(parents=True, exist_ok=True)
            manifest_path = build_dir / "manifest.json"
            manifest_path.write_text(
                json.dumps(
                    {
                        "build_id": "build-2",
                        "planet": {
                            "surface_map": {
                                "lat_steps": 2,
                                "lon_steps": 2,
                                "land_threshold": 128,
                                "values": [0, 64, 192, 255],
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

            with patch.dict("scripts.bake_moreway_planet_material_textures.MATERIAL_SOURCES", {"openai_materials": asset_root}), patch(
                "scripts.bake_moreway_planet_material_textures.bake_texture",
                side_effect=lambda surface_map, material_root, scale=None, channel="albedo": FakeImage(),
            ) as bake_mock:
                baked = bake_for_manifest(manifest_path, modes=["openai_materials"])

            self.assertEqual(
                {
                    "openai_materials",
                    "openai_materials_normal",
                    "openai_materials_roughness",
                },
                set(baked.keys()),
            )
            self.assertEqual(
                ["albedo", "normal", "roughness"],
                [call.kwargs["channel"] for call in bake_mock.call_args_list],
            )


if __name__ == "__main__":
    unittest.main()
