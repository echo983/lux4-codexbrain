#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from scripts.openai_image_generate import DEFAULT_OUTPUT_DIR, DEFAULT_IMAGE_MODEL, generate_with_image_api, resolve_config  # noqa: E402


MATERIAL_PROMPTS = {
    "deep_ocean": (
        "Create a seamless square tileable top-down material texture for deep ocean water. "
        "Premium cartographic finish, rich deep blue water, subtle large-scale currents, no coastlines, no land, no horizon, no objects, no text."
    ),
    "shallow_ocean": (
        "Create a seamless square tileable top-down material texture for shallow ocean water seen from above. "
        "Premium cartographic finish, clear azure and cyan shallows with subtle depth variation, natural marine texture, no coastlines, no land, no horizon, no objects, no text. "
        "Avoid neon colors, avoid mint-green muddiness, avoid yellow cast."
    ),
    "mid_ocean": (
        "Create a seamless square tileable top-down material texture for mid-depth ocean water. "
        "Premium cartographic finish, balanced blue ocean, subtle current structures, no coastlines, no land, no horizon, no objects, no text."
    ),
    "coastal_water": (
        "Create a seamless square tileable top-down material texture for coastal water and littoral shallows seen from above. "
        "Premium cartographic finish, natural blue-to-aqua coastal sea with gentle suspended sediment diffusion, soft surf-zone variation, no visible land masses, no horizon, no objects, no text. "
        "Keep it oceanic, not swampy; avoid olive, beige, or gray-green tones."
    ),
    "coast_wet": (
        "Create a seamless square tileable top-down material texture for wet coastlines and lush littoral terrain. "
        "Premium cartographic finish, damp sand, vegetated shoreline transitions, estuary-like richness, no open water bodies, no objects, no text."
    ),
    "coast_dry": (
        "Create a seamless square tileable top-down material texture for dry coastlines and sandy littoral terrain. "
        "Premium cartographic finish, pale sand, dry sediment, sparse scrub hints, no open water bodies, no objects, no text."
    ),
    "lowland_grass": (
        "Create a seamless square tileable top-down material texture for temperate grassy lowland terrain. "
        "Premium cartographic finish, healthy green grassland, gentle field variation, no roads, no buildings, no text."
    ),
    "lowland_forest": (
        "Create a seamless square tileable top-down material texture for dense temperate forest lowland terrain. "
        "Premium cartographic finish, layered green canopy, darker forest patches, rich vegetated texture, no roads, no buildings, no text."
    ),
    "upland_temperate": (
        "Create a seamless square tileable top-down material texture for temperate upland and rocky plateau terrain. "
        "Premium cartographic finish, green-brown uplands, stony ridges, subdued relief, no buildings, no labels, no text."
    ),
    "upland_dry": (
        "Create a seamless square tileable top-down material texture for dry upland and semi-arid plateau terrain. "
        "Premium cartographic finish, dusty stone, sparse dry vegetation, weathered rocky surfaces, no buildings, no labels, no text."
    ),
    "mountain_rock": (
        "Create a seamless square tileable top-down material texture for rocky mountain terrain. "
        "Premium cartographic finish, exposed rock strata, cold rugged slopes, minimal snow, no horizon, no text, no objects."
    ),
    "mountain_snow": (
        "Create a seamless square tileable top-down material texture for alpine mountains and snow peaks. "
        "Premium cartographic finish, rock strata, snow caps, icy ridgelines, no horizon, no text, no objects."
    ),
    "north_pole": (
        "Create a seamless square tileable top-down material texture for an arctic polar cap seen from above. "
        "Premium cartographic finish, cold ocean, floating sea ice, bright ice sheets, fractured ice patterns, subdued polar land hints, no labels, no objects, no horizon."
    ),
    "south_pole": (
        "Create a seamless square tileable top-down material texture for an antarctic polar cap seen from above. "
        "Premium cartographic finish, massive ice sheet, colder blue-white palette, glacial fracture structures, sparse exposed rock, surrounding polar ocean hints, no labels, no objects, no horizon."
    ),
}

DEFAULT_FAMILIES = [
    "deep_ocean",
    "mid_ocean",
    "shallow_ocean",
    "coastal_water",
    "coast_wet",
    "coast_dry",
    "lowland_grass",
    "lowland_forest",
    "upland_temperate",
    "upland_dry",
    "mountain_rock",
    "mountain_snow",
    "north_pole",
    "south_pole",
]


def output_path_for(output_dir: Path, family: str, variant_index: int) -> Path:
    suffix = "" if variant_index == 0 else f"_{variant_index + 1:02d}"
    return output_dir / f"{family}{suffix}.png"


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate a small OpenAI terrain material set for the Moreway planet.")
    parser.add_argument("--quality", default="low", choices=("low", "medium", "high"))
    parser.add_argument("--size", default="1024x1024")
    parser.add_argument("--model", default=DEFAULT_IMAGE_MODEL)
    parser.add_argument("--output-dir", default=str((DEFAULT_OUTPUT_DIR / "materials").resolve()))
    parser.add_argument("--families", default=",".join(DEFAULT_FAMILIES), help="Comma-separated material families to generate.")
    parser.add_argument("--variants", type=int, default=1, help="How many variants to generate per family.")
    parser.add_argument("--print-json", action="store_true")
    args = parser.parse_args()

    api_key, base_url = resolve_config()
    if not api_key:
        raise SystemExit("Missing OPENAI_API_KEY in env or .env.")

    output_dir = Path(args.output_dir).expanduser().resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    generated: dict[str, str] = {}
    families = [part.strip() for part in args.families.split(",") if part.strip()]
    unknown = [family for family in families if family not in MATERIAL_PROMPTS]
    if unknown:
        raise SystemExit(f"Unknown material families: {', '.join(unknown)}")
    if args.variants < 1:
        raise SystemExit("--variants must be >= 1")

    for family in families:
        prompt = MATERIAL_PROMPTS[family]
        for variant_index in range(args.variants):
            output = output_path_for(output_dir, family, variant_index)
            prompt_with_variant = prompt if args.variants == 1 else (
                f"{prompt} Keep it distinct from sibling variants in the same family. "
                f"This is variant {variant_index + 1} of {args.variants}."
            )
            result = generate_with_image_api(
                api_key=api_key,
                base_url=base_url,
                prompt=prompt_with_variant,
                model=args.model,
                output=output,
                size=args.size,
                quality=args.quality,
                background="opaque",
                output_format="png",
                output_compression=None,
                moderation=None,
                n=1,
                input_images=[],
                mask=None,
                input_fidelity=None,
            )
            generated[output.name] = result["output_paths"][0]

    if args.print_json:
        sys.stdout.write(json.dumps(generated, ensure_ascii=False, indent=2))
        sys.stdout.write("\n")
    else:
        for key, path in generated.items():
            print(f"{key}: {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
