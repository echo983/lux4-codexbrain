#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Iterable

from src.moreway_planet_explorer.material_bake_core import bake_texture


REPO_ROOT = Path(__file__).resolve().parent.parent
DATASET_ROOT = REPO_ROOT / "var" / "moreway_planet_dataset"

MATERIAL_SOURCES = {
    "openai_materials": REPO_ROOT / "var" / "openai_image_experiments" / "materials",
}


def load_manifest(manifest_path: Path) -> dict:
    return json.loads(manifest_path.read_text(encoding="utf-8"))


def write_manifest(manifest_path: Path, manifest: dict) -> None:
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")


def bake_for_manifest(manifest_path: Path, modes: Iterable[str] | None = None) -> dict[str, str]:
    manifest = load_manifest(manifest_path)
    build_dir = manifest_path.parent
    textures_dir = build_dir / "textures"
    textures_dir.mkdir(parents=True, exist_ok=True)
    surface_map = manifest["planet"]["surface_map"]
    modes = list(modes or MATERIAL_SOURCES.keys())
    baked: dict[str, str] = dict(manifest.get("planet", {}).get("baked_textures") or {})
    for mode in modes:
        material_root = MATERIAL_SOURCES[mode]
        if not material_root.exists():
            continue
        image = bake_texture(surface_map, material_root)
        output_path = textures_dir / f"{mode}.png"
        image.save(output_path)
        baked[mode] = str(output_path.relative_to(build_dir.parent.parent))
    manifest.setdefault("planet", {})["baked_textures"] = baked
    write_manifest(manifest_path, manifest)
    return baked


def main() -> int:
    parser = argparse.ArgumentParser(description="Bake Moreway planet material textures into static PNG files.")
    parser.add_argument("--manifest", default="", help="Path to manifest.json. Default: latest build manifest.")
    parser.add_argument("--modes", default="", help="Comma-separated modes to bake. Default: all available material sources.")
    args = parser.parse_args()

    if args.manifest:
        manifest_path = Path(args.manifest).expanduser().resolve()
    else:
        latest = json.loads((DATASET_ROOT / "latest.json").read_text(encoding="utf-8"))
        manifest_path = (DATASET_ROOT / latest["manifest_path"]).resolve()
    modes = [part.strip() for part in args.modes.split(",") if part.strip()] or None
    baked = bake_for_manifest(manifest_path, modes=modes)
    print(json.dumps({"manifest": str(manifest_path), "baked_textures": baked}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
