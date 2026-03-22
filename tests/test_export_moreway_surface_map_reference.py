from __future__ import annotations

import unittest

from scripts.export_moreway_surface_map_reference import build_surface_reference_image


class ExportMorewaySurfaceMapReferenceTests(unittest.TestCase):
    def test_build_surface_reference_image_dimensions(self) -> None:
        image = build_surface_reference_image(
            {
                "lat_steps": 2,
                "lon_steps": 3,
                "land_threshold": 100,
                "values": [0, 50, 99, 100, 180, 255],
            }
        )
        self.assertEqual(image.size, (3, 2))


if __name__ == "__main__":
    unittest.main()
