import os
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from scripts import google_place_details


class GooglePlaceDetailsTests(unittest.TestCase):
    def test_load_env_reads_cwd_dotenv(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            cwd = Path(tmpdir)
            env_file = cwd / ".env"
            env_file.write_text("GOOGLE_MAPS_API_KEY=test-key\n", encoding="utf-8")
            with mock.patch.dict(os.environ, {}, clear=True):
                original = Path.cwd()
                os.chdir(cwd)
                try:
                    google_place_details.load_env()
                    self.assertEqual(os.environ.get("GOOGLE_MAPS_API_KEY"), "test-key")
                finally:
                    os.chdir(original)

    def test_normalize_place(self) -> None:
        place = {
            "id": "abc123",
            "displayName": {"text": "Cafe Example"},
            "formattedAddress": "Example Street 1",
            "location": {"latitude": 41.4, "longitude": 2.17},
            "primaryType": "coffee_shop",
            "primaryTypeDisplayName": {"text": "Coffee shop"},
            "types": ["coffee_shop", "food", "point_of_interest"],
            "rating": 4.7,
            "userRatingCount": 128,
            "currentOpeningHours": {
                "openNow": True,
                "weekdayDescriptions": ["Monday: 8:00 AM – 6:00 PM"],
            },
            "regularOpeningHours": {
                "weekdayDescriptions": ["Monday: 8:00 AM – 6:00 PM"],
            },
            "priceLevel": "PRICE_LEVEL_MODERATE",
            "businessStatus": "OPERATIONAL",
            "googleMapsUri": "https://maps.google.com/example",
            "websiteUri": "https://example.com",
            "nationalPhoneNumber": "+34 123 456 789",
            "editorialSummary": {"text": "A small cafe."},
            "generativeSummary": {"overview": {"text": "Popular for brunch."}},
        }
        self.assertEqual(
            google_place_details.normalize_place(place),
            {
                "id": "abc123",
                "name": "Cafe Example",
                "address": "Example Street 1",
                "latitude": 41.4,
                "longitude": 2.17,
                "primary_type": "coffee_shop",
                "primary_type_display_name": "Coffee shop",
                "types": ["coffee_shop", "food", "point_of_interest"],
                "rating": 4.7,
                "user_rating_count": 128,
                "open_now": True,
                "price_level": "PRICE_LEVEL_MODERATE",
                "business_status": "OPERATIONAL",
                "google_maps_uri": "https://maps.google.com/example",
                "website_uri": "https://example.com",
                "phone_number": "+34 123 456 789",
                "editorial_summary": "A small cafe.",
                "generative_summary": "Popular for brunch.",
                "regular_opening_hours": ["Monday: 8:00 AM – 6:00 PM"],
                "current_opening_hours": ["Monday: 8:00 AM – 6:00 PM"],
            },
        )


if __name__ == "__main__":
    unittest.main()
