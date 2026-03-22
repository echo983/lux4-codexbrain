#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image


REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_DATASET_ROOT = REPO_ROOT / "var" / "moreway_planet_dataset"
DEFAULT_OUTPUT_DIR = REPO_ROOT / "var" / "openai_image_experiments"


def load_latest_manifest(dataset_root: Path) -> tuple[str, dict]:
    latest = json.loads((dataset_root / "latest.json").read_text(encoding="utf-8"))
    build_id = str(latest["build_id"])
    manifest = json.loads((dataset_root / "builds" / build_id / "manifest.json").read_text(encoding="utf-8"))
    return build_id, manifest


def build_surface_reference_image(surface_map: dict) -> Image.Image:
    width = int(surface_map["lon_steps"])
    height = int(surface_map["lat_steps"])
    threshold = int(surface_map["land_threshold"])
    values = list(surface_map["values"])

    def smoothstep(edge0: float, edge1: float, x: float) -> float:
        if edge1 <= edge0:
            return 0.0
        t = max(0.0, min(1.0, (x - edge0) / (edge1 - edge0)))
        return t * t * (3.0 - 2.0 * t)

    def lerp(a: float, b: float, t: float) -> float:
        return a + (b - a) * t

    def mix_color(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
        return (
            round(lerp(a[0], b[0], t)),
            round(lerp(a[1], b[1], t)),
            round(lerp(a[2], b[2], t)),
        )

    deep_sea = (6, 22, 64)
    sea = (18, 66, 128)
    shallow_sea = (72, 126, 178)
    coast = (201, 181, 129)
    lowland = (86, 122, 74)
    upland = (118, 104, 76)
    mountain = (148, 142, 138)
    snow = (245, 247, 250)

    image = Image.new("RGB", (width, height))
    pixels = image.load()
    assert pixels is not None

    for lat in range(height):
        for lon in range(width):
            idx = lat * width + lon
            value = int(values[idx])
            if value < threshold:
                sea_level = value / max(threshold, 1)
                if sea_level < 0.55:
                    rgb = mix_color(deep_sea, sea, smoothstep(0.0, 0.55, sea_level))
                else:
                    rgb = mix_color(sea, shallow_sea, smoothstep(0.55, 1.0, sea_level))
            else:
                land_level = (value - threshold) / max(255 - threshold, 1)
                compressed = land_level ** 1.55
                if compressed < 0.18:
                    rgb = mix_color(coast, lowland, smoothstep(0.0, 0.18, compressed))
                elif compressed < 0.58:
                    rgb = mix_color(lowland, upland, smoothstep(0.18, 0.58, compressed))
                elif compressed < 0.86:
                    rgb = mix_color(upland, mountain, smoothstep(0.58, 0.86, compressed))
                else:
                    rgb = mix_color(mountain, snow, smoothstep(0.86, 1.0, compressed))
            pixels[lon, lat] = rgb
    return image


def main() -> int:
    parser = argparse.ArgumentParser(description="Export the current Moreway planet surface_map as a reference PNG.")
    parser.add_argument("--dataset-root", default=str(DEFAULT_DATASET_ROOT))
    parser.add_argument("--output", default="", help="PNG output path.")
    args = parser.parse_args()

    dataset_root = Path(args.dataset_root).expanduser().resolve()
    build_id, manifest = load_latest_manifest(dataset_root)
    surface_map = manifest["planet"]["surface_map"]
    image = build_surface_reference_image(surface_map)

    output = Path(args.output).expanduser().resolve() if args.output else (DEFAULT_OUTPUT_DIR / f"surface_reference_{build_id}.png").resolve()
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output, format="PNG")
    print(output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
