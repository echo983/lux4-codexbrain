#!/usr/bin/env python3
"""Minimal Google Weather API primitive."""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import urlopen

from dotenv import load_dotenv

SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

import google_geocode


BASE_URL = "https://weather.googleapis.com/v1"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Fetch weather with Google Weather API.")
    parser.add_argument("location", help="Free-form place name or address")
    parser.add_argument("--mode", default="current", choices=["current", "hourly", "daily"])
    parser.add_argument("--units-system", default="METRIC", choices=["METRIC", "IMPERIAL"])
    parser.add_argument("--language-code", default="zh-CN")
    parser.add_argument("--hours", type=int, default=12)
    parser.add_argument("--days", type=int, default=3)
    return parser.parse_args()


def load_env() -> None:
    load_dotenv(Path.cwd() / ".env", override=False)


def get_api_key() -> str:
    api_key = os.environ.get("GOOGLE_MAPS_API_KEY")
    if not api_key:
        raise SystemExit("Missing GOOGLE_MAPS_API_KEY in environment or current working directory .env")
    return api_key


def build_url(mode: str, latitude: float, longitude: float, args: argparse.Namespace, api_key: str) -> str:
    path = {
        "current": "currentConditions:lookup",
        "hourly": "forecast/hours:lookup",
        "daily": "forecast/days:lookup",
    }[mode]
    query: dict[str, Any] = {
        "key": api_key,
        "location.latitude": latitude,
        "location.longitude": longitude,
        "languageCode": args.language_code,
        "unitsSystem": args.units_system,
    }
    if mode == "hourly":
        query["hours"] = args.hours
        query["pageSize"] = args.hours
    if mode == "daily":
        query["days"] = args.days
        query["pageSize"] = args.days
    return f"{BASE_URL}/{path}?{urlencode(query)}"


def fetch_json(url: str) -> dict[str, Any]:
    try:
        with urlopen(url, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise SystemExit(f"Google Weather API request failed: HTTP {exc.code}: {detail}") from exc
    except URLError as exc:
        raise SystemExit(f"Google Weather API request failed: {exc}") from exc


def normalize_temperature(value: dict[str, Any] | None) -> dict[str, Any] | None:
    if not value:
        return None
    return {"degrees": value.get("degrees"), "unit": value.get("unit")}


def normalize_current(payload: dict[str, Any]) -> dict[str, Any]:
    return {
        "current_time": payload.get("currentTime"),
        "time_zone": ((payload.get("timeZone") or {}).get("id")),
        "is_daytime": payload.get("isDaytime"),
        "weather_condition": ((payload.get("weatherCondition") or {}).get("description", {}).get("text")),
        "temperature": normalize_temperature(payload.get("temperature")),
        "feels_like_temperature": normalize_temperature(payload.get("feelsLikeTemperature")),
        "humidity": payload.get("relativeHumidity"),
        "uv_index": payload.get("uvIndex"),
        "wind_speed": payload.get("wind", {}).get("speed"),
        "visibility": payload.get("visibility"),
        "cloud_cover": payload.get("cloudCover"),
        "precipitation": payload.get("precipitation"),
    }


def normalize_hour(entry: dict[str, Any]) -> dict[str, Any]:
    return {
        "interval_start": entry.get("interval", {}).get("startTime"),
        "weather_condition": ((entry.get("weatherCondition") or {}).get("description", {}).get("text")),
        "temperature": normalize_temperature(entry.get("temperature")),
        "feels_like_temperature": normalize_temperature(entry.get("feelsLikeTemperature")),
        "precipitation": entry.get("precipitation"),
        "wind_speed": entry.get("wind", {}).get("speed"),
    }


def normalize_day(entry: dict[str, Any]) -> dict[str, Any]:
    return {
        "interval_start": entry.get("interval", {}).get("startTime"),
        "interval_end": entry.get("interval", {}).get("endTime"),
        "weather_condition": ((entry.get("daytimeForecast") or {}).get("weatherCondition", {}).get("description", {}).get("text")),
        "night_weather_condition": ((entry.get("nighttimeForecast") or {}).get("weatherCondition", {}).get("description", {}).get("text")),
        "max_temperature": normalize_temperature((entry.get("maxTemperature"))),
        "min_temperature": normalize_temperature((entry.get("minTemperature"))),
        "sunrise_time": entry.get("sunEvents", {}).get("sunriseTime"),
        "sunset_time": entry.get("sunEvents", {}).get("sunsetTime"),
        "precipitation": ((entry.get("daytimeForecast") or {}).get("precipitation")),
    }


def main() -> int:
    args = parse_args()
    load_env()
    api_key = get_api_key()
    geo = google_geocode.geocode(api_key, args.location, args.language_code, "es")
    results = geo.get("results") or []
    if not results:
        raise SystemExit(f"Geocoding failed for location: {args.location}")
    first = results[0]
    lat = first["geometry"]["location"]["lat"]
    lng = first["geometry"]["location"]["lng"]
    raw = fetch_json(build_url(args.mode, lat, lng, args, api_key))
    if args.mode == "current":
        body: Any = normalize_current(raw)
    elif args.mode == "hourly":
        body = [normalize_hour(entry) for entry in raw.get("forecastHours", [])]
    else:
        body = [normalize_day(entry) for entry in raw.get("forecastDays", [])]
    payload = {
        "query": args.location,
        "resolved_location": first.get("formatted_address"),
        "latitude": lat,
        "longitude": lng,
        "mode": args.mode,
        "data": body,
    }
    json.dump(payload, sys.stdout, ensure_ascii=False, indent=2)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
