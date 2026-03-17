import os
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from scripts import google_geocode


class GoogleGeocodeTests(unittest.TestCase):
    def test_load_env_reads_cwd_dotenv(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            cwd = Path(tmpdir)
            env_file = cwd / ".env"
            env_file.write_text("GOOGLE_MAPS_API_KEY=test-key\n", encoding="utf-8")
            with mock.patch.dict(os.environ, {}, clear=True):
                original = Path.cwd()
                os.chdir(cwd)
                try:
                    google_geocode.load_env()
                    self.assertEqual(os.environ.get("GOOGLE_MAPS_API_KEY"), "test-key")
                finally:
                    os.chdir(original)

    def test_normalize_result(self) -> None:
        result = {
            "formatted_address": "Sagrada Familia, Barcelona, Spain",
            "place_id": "abc123",
            "geometry": {
                "location": {"lat": 41.4036, "lng": 2.1744},
                "location_type": "ROOFTOP",
            },
            "types": ["tourist_attraction", "point_of_interest"],
        }
        self.assertEqual(
            google_geocode.normalize_result(result),
            {
                "formatted_address": "Sagrada Familia, Barcelona, Spain",
                "place_id": "abc123",
                "latitude": 41.4036,
                "longitude": 2.1744,
                "location_type": "ROOFTOP",
                "types": ["tourist_attraction", "point_of_interest"],
            },
        )


if __name__ == "__main__":
    unittest.main()
