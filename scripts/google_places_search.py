#!/usr/bin/env python3
"""Minimal Google Places Text Search primitive."""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from dotenv import load_dotenv


API_URL = "https://places.googleapis.com/v1/places:searchText"
FIELD_MASK = ",".join(
    [
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.location",
        "places.primaryType",
        "places.primaryTypeDisplayName",
        "places.rating",
        "places.userRatingCount",
        "places.regularOpeningHours.openNow",
        "places.googleMapsUri",
        "places.websiteUri",
        "places.nationalPhoneNumber",
        "places.priceLevel",
        "places.editorialSummary",
        "places.generativeSummary",
    ]
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Search places with Google Places API.")
    parser.add_argument("query", help="Free-form search query")
    parser.add_argument("--language-code", default="zh-CN")
    parser.add_argument("--region-code", default="ES")
    parser.add_argument("--max-results", type=int, default=5)
    parser.add_argument("--price-level", choices=["PRICE_LEVEL_FREE", "PRICE_LEVEL_INEXPENSIVE", "PRICE_LEVEL_MODERATE", "PRICE_LEVEL_EXPENSIVE", "PRICE_LEVEL_VERY_EXPENSIVE"])
    parser.add_argument("--open-now", action="store_true")
    return parser.parse_args()


def load_env() -> None:
    load_dotenv(Path.cwd() / ".env", override=False)


def get_api_key() -> str:
    api_key = os.environ.get("GOOGLE_MAPS_API_KEY")
    if not api_key:
        raise SystemExit("Missing GOOGLE_MAPS_API_KEY in environment or current working directory .env")
    return api_key


def build_payload(args: argparse.Namespace) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "textQuery": args.query,
        "languageCode": args.language_code,
        "regionCode": args.region_code,
        "pageSize": args.max_results,
    }
    if args.open_now:
        payload["openNow"] = True
    if args.price_level:
        payload["priceLevels"] = [args.price_level]
    return payload


def search_places(api_key: str, payload: dict[str, Any]) -> dict[str, Any]:
    body = json.dumps(payload).encode("utf-8")
    request = Request(
        API_URL,
        data=body,
        headers={
            "Content-Type": "application/json",
            "X-Goog-Api-Key": api_key,
            "X-Goog-FieldMask": FIELD_MASK,
        },
        method="POST",
    )
    try:
        with urlopen(request, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise SystemExit(f"Google Places API request failed: HTTP {exc.code}: {detail}") from exc
    except URLError as exc:
        raise SystemExit(f"Google Places API request failed: {exc}") from exc


def normalize_place(place: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": place.get("id"),
        "name": (place.get("displayName") or {}).get("text"),
        "address": place.get("formattedAddress"),
        "latitude": (place.get("location") or {}).get("latitude"),
        "longitude": (place.get("location") or {}).get("longitude"),
        "primary_type": place.get("primaryType"),
        "primary_type_display_name": ((place.get("primaryTypeDisplayName") or {}).get("text")),
        "rating": place.get("rating"),
        "user_rating_count": place.get("userRatingCount"),
        "open_now": (((place.get("regularOpeningHours") or {}).get("openNow"))),
        "price_level": place.get("priceLevel"),
        "google_maps_uri": place.get("googleMapsUri"),
        "website_uri": place.get("websiteUri"),
        "phone_number": place.get("nationalPhoneNumber"),
        "editorial_summary": ((place.get("editorialSummary") or {}).get("text")),
        "generative_summary": (((place.get("generativeSummary") or {}).get("overview") or {}).get("text")),
    }


def main() -> int:
    args = parse_args()
    load_env()
    api_key = get_api_key()
    raw = search_places(api_key, build_payload(args))
    normalized = {
        "query": args.query,
        "count": len(raw.get("places", [])),
        "places": [normalize_place(place) for place in raw.get("places", [])],
    }
    json.dump(normalized, sys.stdout, ensure_ascii=False, indent=2)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
