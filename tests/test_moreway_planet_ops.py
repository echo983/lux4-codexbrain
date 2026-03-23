from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from scripts.check_moreway_planet_status import http_ok


class MorewayPlanetOpsTests(unittest.TestCase):
    def test_http_ok_returns_false_on_url_error(self) -> None:
        self.assertFalse(http_ok("http://127.0.0.1:9/nope"))

    def test_status_payload_shape_from_temp_files(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            dataset_root = root / "var" / "moreway_planet_dataset"
            build_dir = dataset_root / "builds" / "build-1"
            textures_dir = build_dir / "textures"
            textures_dir.mkdir(parents=True, exist_ok=True)
            (textures_dir / "openai_materials.png").write_bytes(b"png")
            manifest = {
                "planet": {
                    "surface_map": {"lat_steps": 2, "lon_steps": 2, "land_threshold": 128, "values": [0, 1, 2, 3]},
                    "baked_textures": {
                        "openai_materials": "builds/build-1/textures/openai_materials.png",
                    },
                },
                "chunks": [1, 2],
            }
            latest = {
                "build_id": "build-1",
                "generated_at": "2026-03-23T00:00:00+00:00",
                "source_tables": ["google_keep_asset_cards_directmd_eval200"],
                "source_signature": "google_keep_asset_cards_directmd_eval200:1",
                "manifest_path": "builds/build-1/manifest.json",
                "document_count": 1,
                "chunk_count": 2,
            }
            (dataset_root / "latest.json").parent.mkdir(parents=True, exist_ok=True)
            (dataset_root / "latest.json").write_text(json.dumps(latest), encoding="utf-8")
            (build_dir / "manifest.json").write_text(json.dumps(manifest), encoding="utf-8")

            import scripts.check_moreway_planet_status as mod

            with patch.object(mod, "DATASET_ROOT", dataset_root), patch.object(mod, "http_ok", return_value=True):
                latest_loaded = json.loads((dataset_root / "latest.json").read_text(encoding="utf-8"))
                manifest_loaded = json.loads((build_dir / "manifest.json").read_text(encoding="utf-8"))
                self.assertEqual(latest_loaded["build_id"], "build-1")
                self.assertTrue(manifest_loaded["planet"]["surface_map"])
                self.assertEqual(
                    manifest_loaded["planet"]["baked_textures"]["openai_materials"],
                    "builds/build-1/textures/openai_materials.png",
                )


if __name__ == "__main__":
    unittest.main()
