#!/usr/bin/env python3
"""Minimal Google Place Details primitive."""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode, quote
from urllib.request import Request, urlopen

from dotenv import load_dotenv


API_BASE_URL = "https://places.googleapis.com/v1/places"
FIELD_MASK = ",".join(
    [
        "id",
        "displayName",
        "formattedAddress",
        "location",
        "primaryType",
        "primaryTypeDisplayName",
        "types",
        "rating",
        "userRatingCount",
        "regularOpeningHours",
        "googleMapsUri",
        "websiteUri",
        "nationalPhoneNumber",
        "priceLevel",
        "editorialSummary",
        "generativeSummary",
        "businessStatus",
        "currentOpeningHours",
    ]
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Fetch Google Place Details by place id.")
    parser.add_argument("place_id", help="Google place id, for example ChIJ...")
    parser.add_argument("--language-code", default="zh-CN")
    parser.add_argument("--region-code", default="ES")
    return parser.parse_args()


def load_env() -> None:
    load_dotenv(Path.cwd() / ".env", override=False)


def get_api_key() -> str:
    api_key = os.environ.get("GOOGLE_MAPS_API_KEY")
    if not api_key:
        raise SystemExit("Missing GOOGLE_MAPS_API_KEY in environment or current working directory .env")
    return api_key


def fetch_place_details(api_key: str, place_id: str, language_code: str, region_code: str) -> dict[str, Any]:
    query = urlencode({"languageCode": language_code, "regionCode": region_code})
    url = f"{API_BASE_URL}/{quote(place_id, safe='')}?{query}"
    request = Request(
        url,
        headers={
            "X-Goog-Api-Key": api_key,
            "X-Goog-FieldMask": FIELD_MASK,
        },
        method="GET",
    )
    try:
        with urlopen(request, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise SystemExit(f"Google Place Details request failed: HTTP {exc.code}: {detail}") from exc
    except URLError as exc:
        raise SystemExit(f"Google Place Details request failed: {exc}") from exc


def normalize_place(place: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": place.get("id"),
        "name": (place.get("displayName") or {}).get("text"),
        "address": place.get("formattedAddress"),
        "latitude": (place.get("location") or {}).get("latitude"),
        "longitude": (place.get("location") or {}).get("longitude"),
        "primary_type": place.get("primaryType"),
        "primary_type_display_name": ((place.get("primaryTypeDisplayName") or {}).get("text")),
        "types": place.get("types"),
        "rating": place.get("rating"),
        "user_rating_count": place.get("userRatingCount"),
        "open_now": (((place.get("currentOpeningHours") or {}).get("openNow"))),
        "price_level": place.get("priceLevel"),
        "business_status": place.get("businessStatus"),
        "google_maps_uri": place.get("googleMapsUri"),
        "website_uri": place.get("websiteUri"),
        "phone_number": place.get("nationalPhoneNumber"),
        "editorial_summary": ((place.get("editorialSummary") or {}).get("text")),
        "generative_summary": (((place.get("generativeSummary") or {}).get("overview") or {}).get("text")),
        "regular_opening_hours": (place.get("regularOpeningHours") or {}).get("weekdayDescriptions"),
        "current_opening_hours": (place.get("currentOpeningHours") or {}).get("weekdayDescriptions"),
    }


def main() -> int:
    args = parse_args()
    load_env()
    api_key = get_api_key()
    raw = fetch_place_details(api_key, args.place_id, args.language_code, args.region_code)
    json.dump(normalize_place(raw), sys.stdout, ensure_ascii=False, indent=2)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
