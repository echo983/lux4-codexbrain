#!/usr/bin/env python3
"""Minimal Google Routes API primitive."""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import UTC, datetime
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from dotenv import load_dotenv


API_URL = "https://routes.googleapis.com/directions/v2:computeRoutes"
FIELD_MASK = ",".join(
    [
        "routes.distanceMeters",
        "routes.duration",
        "routes.legs.distanceMeters",
        "routes.legs.duration",
        "routes.polyline.encodedPolyline",
        "routes.legs.steps.distanceMeters",
        "routes.legs.steps.staticDuration",
        "routes.legs.steps.travelMode",
        "routes.legs.steps.navigationInstruction",
        "routes.legs.steps.transitDetails",
    ]
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Compute routes with Google Routes API.")
    parser.add_argument("origin", help="Origin address or place name")
    parser.add_argument("destination", help="Destination address or place name")
    parser.add_argument("--travel-mode", default="DRIVE", choices=["DRIVE", "WALK", "TRANSIT", "BICYCLE"])
    parser.add_argument("--language-code", default="zh-CN")
    parser.add_argument("--region-code", default="ES")
    parser.add_argument("--units", default="METRIC", choices=["METRIC", "IMPERIAL"])
    parser.add_argument("--departure-time", default="now", help="'now' or RFC3339 timestamp")
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
        "origin": {"address": args.origin},
        "destination": {"address": args.destination},
        "travelMode": args.travel_mode,
        "languageCode": args.language_code,
        "regionCode": args.region_code,
        "units": args.units,
    }
    if args.travel_mode == "TRANSIT":
        payload["departureTime"] = normalize_departure_time(args.departure_time)
    elif args.travel_mode == "DRIVE":
        payload["routingPreference"] = "TRAFFIC_AWARE"
    return payload


def normalize_departure_time(value: str) -> str:
    if value == "now":
        return datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    return value


def compute_routes(api_key: str, payload: dict[str, Any]) -> dict[str, Any]:
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
        raise SystemExit(f"Google Routes API request failed: HTTP {exc.code}: {detail}") from exc
    except URLError as exc:
        raise SystemExit(f"Google Routes API request failed: {exc}") from exc


def normalize_step(step: dict[str, Any]) -> dict[str, Any]:
    transit = step.get("transitDetails") or {}
    line = ((transit.get("transitLine") or {}).get("nameShort")) or ((transit.get("transitLine") or {}).get("name"))
    headsign = (((transit.get("headsign")) or ""))
    return {
        "distance_meters": step.get("distanceMeters"),
        "duration": step.get("staticDuration"),
        "travel_mode": step.get("travelMode"),
        "instruction": ((step.get("navigationInstruction") or {}).get("instructions")),
        "transit_line": line,
        "transit_headsign": headsign,
        "stop_count": transit.get("stopCount"),
    }


def normalize_route(route: dict[str, Any]) -> dict[str, Any]:
    legs = route.get("legs") or []
    first_leg = legs[0] if legs else {}
    return {
        "distance_meters": route.get("distanceMeters"),
        "duration": route.get("duration"),
        "leg_distance_meters": first_leg.get("distanceMeters"),
        "leg_duration": first_leg.get("duration"),
        "polyline": ((route.get("polyline") or {}).get("encodedPolyline")),
        "steps": [normalize_step(step) for step in (first_leg.get("steps") or [])],
    }


def main() -> int:
    args = parse_args()
    load_env()
    raw = compute_routes(get_api_key(), build_payload(args))
    payload = {
        "origin": args.origin,
        "destination": args.destination,
        "travel_mode": args.travel_mode,
        "count": len(raw.get("routes", [])),
        "routes": [normalize_route(route) for route in raw.get("routes", [])],
    }
    json.dump(payload, sys.stdout, ensure_ascii=False, indent=2)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
