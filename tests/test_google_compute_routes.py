import argparse
import os
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from scripts import google_compute_routes


class GoogleComputeRoutesTests(unittest.TestCase):
    def test_load_env_reads_cwd_dotenv(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            cwd = Path(tmpdir)
            env_file = cwd / ".env"
            env_file.write_text("GOOGLE_MAPS_API_KEY=test-key\n", encoding="utf-8")
            with mock.patch.dict(os.environ, {}, clear=True):
                original = Path.cwd()
                os.chdir(cwd)
                try:
                    google_compute_routes.load_env()
                    self.assertEqual(os.environ.get("GOOGLE_MAPS_API_KEY"), "test-key")
                finally:
                    os.chdir(original)

    def test_build_payload_drive(self) -> None:
        args = argparse.Namespace(
            origin="Madrid, Spain",
            destination="Barcelona, Spain",
            travel_mode="DRIVE",
            language_code="en",
            region_code="ES",
            units="METRIC",
            departure_time="now",
        )
        self.assertEqual(
            google_compute_routes.build_payload(args),
            {
                "origin": {"address": "Madrid, Spain"},
                "destination": {"address": "Barcelona, Spain"},
                "travelMode": "DRIVE",
                "languageCode": "en",
                "regionCode": "ES",
                "units": "METRIC",
                "routingPreference": "TRAFFIC_AWARE",
            },
        )

    def test_build_payload_transit(self) -> None:
        args = argparse.Namespace(
            origin="Madrid, Spain",
            destination="Barcelona, Spain",
            travel_mode="TRANSIT",
            language_code="en",
            region_code="ES",
            units="METRIC",
            departure_time="2026-03-17T12:00:00Z",
        )
        self.assertEqual(
            google_compute_routes.build_payload(args),
            {
                "origin": {"address": "Madrid, Spain"},
                "destination": {"address": "Barcelona, Spain"},
                "travelMode": "TRANSIT",
                "languageCode": "en",
                "regionCode": "ES",
                "units": "METRIC",
                "departureTime": "2026-03-17T12:00:00Z",
            },
        )

    def test_normalize_route(self) -> None:
        route = {
            "distanceMeters": 1000,
            "duration": "600s",
            "polyline": {"encodedPolyline": "abcd"},
            "legs": [
                {
                    "distanceMeters": 1000,
                    "duration": "600s",
                    "steps": [
                        {
                            "distanceMeters": 300,
                            "staticDuration": "120s",
                            "travelMode": "WALK",
                            "navigationInstruction": {"instructions": "Head north"},
                        },
                        {
                            "distanceMeters": 700,
                            "staticDuration": "480s",
                            "travelMode": "TRANSIT",
                            "transitDetails": {
                                "headsign": "Downtown",
                                "stopCount": 4,
                                "transitLine": {"nameShort": "14"},
                            },
                        },
                    ],
                }
            ],
        }
        self.assertEqual(
            google_compute_routes.normalize_route(route),
            {
                "distance_meters": 1000,
                "duration": "600s",
                "leg_distance_meters": 1000,
                "leg_duration": "600s",
                "polyline": "abcd",
                "steps": [
                    {
                        "distance_meters": 300,
                        "duration": "120s",
                        "travel_mode": "WALK",
                        "instruction": "Head north",
                        "transit_line": None,
                        "transit_headsign": "",
                        "stop_count": None,
                    },
                    {
                        "distance_meters": 700,
                        "duration": "480s",
                        "travel_mode": "TRANSIT",
                        "instruction": None,
                        "transit_line": "14",
                        "transit_headsign": "Downtown",
                        "stop_count": 4,
                    },
                ],
            },
        )


if __name__ == "__main__":
    unittest.main()
