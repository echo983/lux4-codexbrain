from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from scripts.sync_openai_planet_material_asset_set import copy_family_assets


class SyncOpenAIPlanetMaterialAssetSetTests(unittest.TestCase):
    def test_copy_family_assets_writes_meta_and_canonical_albedo_name(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source_root = root / "source"
            target_root = root / "target"
            source_root.mkdir(parents=True, exist_ok=True)
            (source_root / "lowland_grass.png").write_bytes(b"fake")

            summary = copy_family_assets(source_root, "lowland_grass", target_root)

            self.assertEqual(summary["variants"], 1)
            self.assertEqual(summary["variant_count"], 1)
            family_dir = target_root / "lowland_grass"
            self.assertTrue((family_dir / "albedo_01.png").exists())
            meta = json.loads((family_dir / "meta.json").read_text(encoding="utf-8"))
            self.assertEqual(meta["family"], "lowland_grass")
            self.assertEqual(meta["provider"], "openai")
            self.assertEqual(meta["variant_count"], 1)


if __name__ == "__main__":
    unittest.main()
