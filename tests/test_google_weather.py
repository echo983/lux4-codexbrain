import unittest

from scripts import google_weather


class GoogleWeatherTests(unittest.TestCase):
    def test_build_url_current(self) -> None:
        class Args:
            language_code = "en"
            units_system = "METRIC"
            hours = 12
            days = 3

        url = google_weather.build_url("current", 41.4, 2.17, Args(), "test-key")
        self.assertIn("https://weather.googleapis.com/v1/currentConditions:lookup?", url)
        self.assertIn("location.latitude=41.4", url)
        self.assertIn("location.longitude=2.17", url)
        self.assertIn("languageCode=en", url)
        self.assertIn("unitsSystem=METRIC", url)
        self.assertIn("key=test-key", url)

    def test_normalize_current(self) -> None:
        payload = {
            "currentTime": "2026-03-17T10:00:00Z",
            "timeZone": {"id": "Europe/Madrid"},
            "isDaytime": True,
            "weatherCondition": {"description": {"text": "Sunny"}},
            "temperature": {"degrees": 18, "unit": "CELSIUS"},
            "feelsLikeTemperature": {"degrees": 19, "unit": "CELSIUS"},
            "relativeHumidity": 45,
            "uvIndex": 4,
            "wind": {"speed": {"value": 12, "unit": "KILOMETERS_PER_HOUR"}},
            "visibility": {"distance": 10, "unit": "KILOMETERS"},
            "cloudCover": 20,
            "precipitation": {"probability": {"percent": 5}},
        }
        self.assertEqual(
            google_weather.normalize_current(payload),
            {
                "current_time": "2026-03-17T10:00:00Z",
                "time_zone": "Europe/Madrid",
                "is_daytime": True,
                "weather_condition": "Sunny",
                "temperature": {"degrees": 18, "unit": "CELSIUS"},
                "feels_like_temperature": {"degrees": 19, "unit": "CELSIUS"},
                "humidity": 45,
                "uv_index": 4,
                "wind_speed": {"value": 12, "unit": "KILOMETERS_PER_HOUR"},
                "visibility": {"distance": 10, "unit": "KILOMETERS"},
                "cloud_cover": 20,
                "precipitation": {"probability": {"percent": 5}},
            },
        )


if __name__ == "__main__":
    unittest.main()
