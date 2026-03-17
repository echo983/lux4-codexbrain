#!/usr/bin/env python3
"""Minimal Google geocoding primitive."""

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


API_URL = "https://maps.googleapis.com/maps/api/geocode/json"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Geocode a place or address with Google Geocoding API.")
    parser.add_argument("address", help="Free-form address or place name")
    parser.add_argument("--language", default="zh-CN")
    parser.add_argument("--region", default="es")
    return parser.parse_args()


def load_env() -> None:
    load_dotenv(Path.cwd() / ".env", override=False)


def get_api_key() -> str:
    api_key = os.environ.get("GOOGLE_MAPS_API_KEY")
    if not api_key:
        raise SystemExit("Missing GOOGLE_MAPS_API_KEY in environment or current working directory .env")
    return api_key


def geocode(api_key: str, address: str, language: str, region: str) -> dict[str, Any]:
    query = urlencode(
        {
            "address": address,
            "language": language,
            "region": region,
            "key": api_key,
        }
    )
    url = f"{API_URL}?{query}"
    try:
        with urlopen(url, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise SystemExit(f"Google Geocoding API request failed: HTTP {exc.code}: {detail}") from exc
    except URLError as exc:
        raise SystemExit(f"Google Geocoding API request failed: {exc}") from exc


def normalize_result(result: dict[str, Any]) -> dict[str, Any]:
    location = (((result.get("geometry") or {}).get("location")) or {})
    return {
        "formatted_address": result.get("formatted_address"),
        "place_id": result.get("place_id"),
        "latitude": location.get("lat"),
        "longitude": location.get("lng"),
        "location_type": ((result.get("geometry") or {}).get("location_type")),
        "types": result.get("types"),
    }


def main() -> int:
    args = parse_args()
    load_env()
    raw = geocode(get_api_key(), args.address, args.language, args.region)
    payload = {
        "query": args.address,
        "status": raw.get("status"),
        "count": len(raw.get("results", [])),
        "results": [normalize_result(result) for result in raw.get("results", [])],
    }
    json.dump(payload, sys.stdout, ensure_ascii=False, indent=2)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
