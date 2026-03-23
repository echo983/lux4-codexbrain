from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from scripts.bake_moreway_planet_material_textures import bake_for_manifest


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
                baked = bake_for_manifest(manifest_path, modes=["cloudflare_materials"])

            self.assertEqual(
                baked["openai_materials"],
                "builds/build-1/textures/openai_materials.png",
            )
            self.assertEqual(
                baked["cloudflare_materials"],
                "builds/build-1/textures/cloudflare_materials.png",
            )

            written = json.loads(manifest_path.read_text(encoding="utf-8"))
            self.assertEqual(
                written["planet"]["baked_textures"]["openai_materials"],
                "builds/build-1/textures/openai_materials.png",
            )
            self.assertEqual(
                written["planet"]["baked_textures"]["cloudflare_materials"],
                "builds/build-1/textures/cloudflare_materials.png",
            )


if __name__ == "__main__":
    unittest.main()
