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
        "Create a seamless square tileable top-down material texture for shallow tropical ocean water. "
        "Premium cartographic finish, turquoise and cyan shallows, subtle wave patterns, no coastlines, no land, no horizon, no objects, no text."
    ),
    "coast": (
        "Create a seamless square tileable top-down material texture for sandy coastlines and dry littoral terrain. "
        "Premium cartographic finish, pale sand, subtle sediment variation, sparse shoreline texture hints, no water bodies, no objects, no text."
    ),
    "lowland": (
        "Create a seamless square tileable top-down material texture for temperate lowland terrain. "
        "Premium cartographic finish, muted green and olive grassland, subtle field-like variation, no roads, no buildings, no text."
    ),
    "upland": (
        "Create a seamless square tileable top-down material texture for upland and rocky plateau terrain. "
        "Premium cartographic finish, olive-brown and stone tones, subdued ridges, no buildings, no labels, no text."
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


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate a small OpenAI terrain material set for the Moreway planet.")
    parser.add_argument("--quality", default="low", choices=("low", "medium", "high"))
    parser.add_argument("--size", default="1024x1024")
    parser.add_argument("--model", default=DEFAULT_IMAGE_MODEL)
    parser.add_argument("--output-dir", default=str((DEFAULT_OUTPUT_DIR / "materials").resolve()))
    parser.add_argument("--print-json", action="store_true")
    args = parser.parse_args()

    api_key, base_url = resolve_config()
    if not api_key:
        raise SystemExit("Missing OPENAI_API_KEY in env or .env.")

    output_dir = Path(args.output_dir).expanduser().resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    generated: dict[str, str] = {}
    for key, prompt in MATERIAL_PROMPTS.items():
        output = output_dir / f"{key}.png"
        result = generate_with_image_api(
            api_key=api_key,
            base_url=base_url,
            prompt=prompt,
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
        generated[key] = result["output_paths"][0]

    if args.print_json:
        sys.stdout.write(json.dumps(generated, ensure_ascii=False, indent=2))
        sys.stdout.write("\n")
    else:
        for key, path in generated.items():
            print(f"{key}: {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
