#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from scripts.cloudflare_flux_image_generate import DEFAULT_MODEL, generate_image  # noqa: E402


MATERIAL_PROMPTS = {
    "deep_ocean": (
        "Seamless square tileable top-down material texture for deep ocean water. "
        "Rich dark blue water, subtle broad currents, premium cartographic realism, no land, no horizon, no labels."
    ),
    "shallow_ocean": (
        "Seamless square tileable top-down material texture for shallow ocean water. "
        "Turquoise and cyan shallows, subtle reef-like variation, premium cartographic realism, no land, no horizon, no labels."
    ),
    "coast": (
        "Seamless square tileable top-down material texture for sandy coasts. "
        "Pale sand, sediment variation, dry littoral terrain, premium cartographic realism, no water, no labels."
    ),
    "lowland": (
        "Seamless square tileable top-down material texture for temperate lowland terrain. "
        "Muted green plains and gentle variation, premium cartographic realism, no roads, no structures, no labels."
    ),
    "upland": (
        "Seamless square tileable top-down material texture for upland and rocky plateau terrain. "
        "Olive-brown and stone tones, subdued ridges, premium cartographic realism, no structures, no labels."
    ),
    "mountain_snow": (
        "Seamless square tileable top-down material texture for alpine mountains and snow peaks. "
        "Rock ridges, snow caps, icy channels, premium cartographic realism, no labels."
    ),
    "north_pole": (
        "Seamless square tileable top-down material texture for an arctic polar cap viewed from above. "
        "Cold ocean, drifting sea ice, bright broken ice sheets, premium cartographic realism, no labels."
    ),
    "south_pole": (
        "Seamless square tileable top-down material texture for an antarctic polar cap viewed from above. "
        "Massive ice sheet, blue-white palette, glacial fracture patterns, premium cartographic realism, no labels."
    ),
}

PRIMARY_MATERIAL_KEYS = {
    "deep_ocean",
    "shallow_ocean",
    "coast",
    "lowland",
    "upland",
    "mountain_snow",
}


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate a Cloudflare FLUX terrain material set for the Moreway planet.")
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--width", type=int, default=1024)
    parser.add_argument("--height", type=int, default=1024)
    parser.add_argument("--steps", type=int, default=25)
    parser.add_argument("--variants", type=int, default=2, help="Variant count for non-polar primary materials.")
    parser.add_argument("--output-dir", default=str((REPO_ROOT / "var" / "cloudflare_image_experiments" / "materials").resolve()))
    parser.add_argument("--print-json", action="store_true")
    args = parser.parse_args()

    output_dir = Path(args.output_dir).expanduser().resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    generated: dict[str, str] = {}
    for key, prompt in MATERIAL_PROMPTS.items():
        variant_count = max(1, args.variants) if key in PRIMARY_MATERIAL_KEYS else 1
        for index in range(variant_count):
            suffix = "" if index == 0 else f"_{index + 1:02d}"
            variation_prompt = prompt
            if variant_count > 1:
                variation_prompt = (
                    f"{prompt} "
                    f"Create a distinct but compatible variation for a shared planet material set. "
                    f"Keep the same biome identity while varying fine texture rhythm, flow, and local patterning. "
                    f"Variation index {index + 1} of {variant_count}."
                )
            output = output_dir / f"{key}{suffix}.png"
            result = generate_image(
                prompt=variation_prompt,
                output=output,
                model=args.model,
                width=args.width,
                height=args.height,
                steps=args.steps,
                seed=None,
                input_images=[],
            )
            generated[f"{key}{suffix}"] = result["output_path"]

    if args.print_json:
        print(json.dumps(generated, ensure_ascii=False, indent=2))
    else:
        for key, path in generated.items():
            print(f"{key}: {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
