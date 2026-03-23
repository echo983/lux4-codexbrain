#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import shutil
import sys
from datetime import UTC, datetime
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from scripts.openai_planet_material_set_experiment import DEFAULT_IMAGE_MODEL, MATERIAL_PROMPTS

SOURCE_ROOT = REPO_ROOT / "var" / "openai_image_experiments" / "materials"
ASSET_SET_ROOT = REPO_ROOT / "var" / "planet_material_assets" / "openai" / "v1"

FAMILIES = [
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


def atomic_copy_file(source: Path, target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    temp = target.with_name(f".{target.name}.tmp")
    shutil.copy2(source, temp)
    os.replace(temp, target)


def atomic_write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_name(f".{path.name}.tmp")
    temp.write_text(content, encoding="utf-8")
    os.replace(temp, path)


def copy_family_assets(source_root: Path, family: str, target_root: Path) -> dict:
    family_dir = target_root / family
    family_dir.mkdir(parents=True, exist_ok=True)
    copied = 0
    for index in range(1, 100):
        source = source_root / (f"{family}.png" if index == 1 else f"{family}_{index:02d}.png")
        if not source.exists():
            if index == 1:
                raise FileNotFoundError(source)
            break
        target = family_dir / f"albedo_{index:02d}.png"
        atomic_copy_file(source, target)
        copied += 1

    meta = {
        "family": family,
        "provider": "openai",
        "material_set_version": "v1",
        "channels": ["albedo"],
        "variant_count": copied,
        "tileable": True,
        "model": DEFAULT_IMAGE_MODEL,
        "prompt": MATERIAL_PROMPTS.get(family, ""),
        "generation_script": "scripts/openai_planet_material_set_experiment.py",
        "created_at": datetime.now(UTC).isoformat().replace("+00:00", "Z"),
        "notes": f"Formalized OpenAI terrain material asset for {family}.",
    }
    atomic_write_text(
        family_dir / "meta.json",
        json.dumps(meta, ensure_ascii=False, indent=2),
    )
    return {"channels": ["albedo"], "variants": copied, "variant_count": copied}


def main() -> int:
    parser = argparse.ArgumentParser(description="Sync the current OpenAI planet material files into the formal asset-set layout.")
    parser.add_argument("--source-root", default=str(SOURCE_ROOT))
    parser.add_argument("--target-root", default=str(ASSET_SET_ROOT))
    parser.add_argument("--print-json", action="store_true")
    args = parser.parse_args()

    source_root = Path(args.source_root).expanduser().resolve()
    target_root = Path(args.target_root).expanduser().resolve()
    target_root.mkdir(parents=True, exist_ok=True)

    families: dict[str, dict] = {}
    for family in FAMILIES:
        families[family] = copy_family_assets(source_root, family, target_root)

    material_set = {
        "provider": "openai",
        "version": "v1",
        "generated_at": datetime.now(UTC).isoformat().replace("+00:00", "Z"),
        "families": families,
    }
    atomic_write_text(
        target_root / "material_set.json",
        json.dumps(material_set, ensure_ascii=False, indent=2),
    )

    if args.print_json:
        print(json.dumps({"asset_root": str(target_root), "family_count": len(families)}, ensure_ascii=False, indent=2))
    else:
        print(str(target_root))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
