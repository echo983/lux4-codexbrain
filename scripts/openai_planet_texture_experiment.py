#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from scripts.export_moreway_surface_map_reference import main as export_surface_map_main  # noqa: E402
from scripts.openai_image_generate import (  # noqa: E402
    DEFAULT_OUTPUT_DIR,
    DEFAULT_IMAGE_MODEL,
    generate_with_image_api,
    resolve_config,
)


def build_planet_texture_prompt(*, mode: str, style: str, notes: str) -> str:
    base = [
        "Create a seamless equirectangular planetary surface texture map for a knowledge planet.",
        "This is a top-down cartographic texture for wrapping onto a sphere, not a rendered 3D globe.",
        "No stars, no black background, no perspective, no globe outline, no labels, no UI, no text.",
        "Deep oceans, shallow coasts, continents, mountain ranges, plateaus, and subtle large-scale terrain variation.",
        "Keep the horizontal wrap seamless from left edge to right edge.",
    ]
    if mode == "terrain":
        base.append("Prioritize physically plausible terrain and coastlines over decorative fantasy patterns.")
    elif mode == "stylized":
        base.append("Use stylized but elegant cartographic color separation with clear coastlines and readable terrain bands.")
    elif mode == "apple":
        base.append("Aim for an Apple-like industrial design finish: restrained, crisp, premium, tactile, and visually calm.")

    if style.strip():
        base.append(f"Visual style direction: {style.strip()}.")
    if notes.strip():
        base.append(f"Additional constraints: {notes.strip()}")
    return " ".join(base)


def main() -> int:
    parser = argparse.ArgumentParser(description="Run an OpenAI image-generation experiment for planet surface textures.")
    parser.add_argument("--mode", choices=("terrain", "stylized", "apple"), default="apple")
    parser.add_argument("--style", default="highly refined cartographic texture with elegant oceans and snowcapped mountains")
    parser.add_argument("--notes", default="")
    parser.add_argument("--output", default="", help="Output image path.")
    parser.add_argument("--model", default=DEFAULT_IMAGE_MODEL)
    parser.add_argument("--size", default="1536x1024")
    parser.add_argument("--quality", default="high")
    parser.add_argument("--background", default="opaque")
    parser.add_argument("--output-format", default="png", choices=("png", "jpeg", "webp"))
    parser.add_argument("--reference-image", action="append", default=[], help="Optional reference texture/image for edit mode.")
    parser.add_argument("--use-current-surface-map", action="store_true", help="Export the current Moreway surface_map and use it as the edit reference.")
    parser.add_argument("--print-json", action="store_true")
    args = parser.parse_args()

    api_key, base_url = resolve_config()
    if not api_key:
        raise SystemExit("Missing OPENAI_API_KEY in env or .env.")

    prompt = build_planet_texture_prompt(mode=args.mode, style=args.style, notes=args.notes)
    output = Path(args.output).expanduser().resolve() if args.output else (DEFAULT_OUTPUT_DIR / "planet_texture_experiment.png").resolve()
    reference_images = [Path(path).expanduser().resolve() for path in args.reference_image]
    if args.use_current_surface_map:
        auto_reference = (DEFAULT_OUTPUT_DIR / "surface_reference_current.png").resolve()
        old_argv = sys.argv[:]
        try:
            sys.argv = ["export_moreway_surface_map_reference.py", "--output", str(auto_reference)]
            export_surface_map_main()
        finally:
            sys.argv = old_argv
        reference_images.append(auto_reference)
    for path in reference_images:
        if not path.exists():
            raise SystemExit(f"Reference image not found: {path}")

    result = generate_with_image_api(
        api_key=api_key,
        base_url=base_url,
        prompt=prompt,
        model=args.model,
        output=output,
        size=args.size,
        quality=args.quality,
        background=args.background,
        output_format=args.output_format,
        output_compression=None,
        moderation=None,
        n=1,
        input_images=reference_images,
        mask=None,
        input_fidelity="high" if reference_images else None,
    )

    summary = {
        "prompt": prompt,
        "output_paths": result["output_paths"],
        "mode": args.mode,
        "used_edit_mode": bool(reference_images),
    }
    if args.print_json:
        sys.stdout.write(json.dumps(summary, ensure_ascii=False, indent=2))
        sys.stdout.write("\n")
    else:
        sys.stdout.write(f"{result['output_paths'][0]}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
