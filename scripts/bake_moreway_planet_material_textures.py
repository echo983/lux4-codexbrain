#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Iterable

from PIL import Image


REPO_ROOT = Path(__file__).resolve().parent.parent
DATASET_ROOT = REPO_ROOT / "var" / "moreway_planet_dataset"

MATERIAL_SOURCES = {
    "openai_materials": REPO_ROOT / "var" / "openai_image_experiments" / "materials",
}
PRIMARY_KEYS = ["deep_ocean", "shallow_ocean", "coast", "lowland", "upland", "mountain_snow"]


def clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def smoothstep(edge0: float, edge1: float, x: float) -> float:
    t = clamp((x - edge0) / max(edge1 - edge0, 1e-6), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def blend_rgb(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return tuple(round(a[idx] + (b[idx] - a[idx]) * t) for idx in range(3))


def multiply_rgb(a: tuple[int, int, int], b: tuple[int, int, int]) -> tuple[int, int, int]:
    return tuple(round((a[idx] * b[idx]) / 255.0) for idx in range(3))


def luminance(rgb: tuple[int, int, int]) -> float:
    return (rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114) / 255.0


def tune_material_color(rgb: tuple[int, int, int], *, saturation: float, gain: float, lift: float) -> tuple[int, int, int]:
    luma = luminance(rgb) * 255.0
    lifted = [channel * gain + lift for channel in rgb]
    tuned = [luma + (channel - luma) * saturation for channel in lifted]
    return tuple(max(0, min(255, round(channel))) for channel in tuned)


def apply_material_detail(base_rgb: tuple[int, int, int], detail_rgb: tuple[int, int, int], amount: float) -> tuple[int, int, int]:
    detail_luma = luminance(detail_rgb)
    neutralized = blend_rgb((128, 128, 128), detail_rgb, 0.82)
    multiplied = multiply_rgb(base_rgb, neutralized)
    contrast_amount = clamp(amount * (0.55 + abs(detail_luma - 0.5) * 0.7), 0.0, 1.0)
    return blend_rgb(base_rgb, multiplied, contrast_amount)


def load_manifest(manifest_path: Path) -> dict:
    return json.loads(manifest_path.read_text(encoding="utf-8"))


def sample_surface_value(surface_map: dict, u: float, v: float) -> float:
    width = int(surface_map["lon_steps"])
    height = int(surface_map["lat_steps"])
    values = surface_map["values"]
    x = ((u % 1.0) + 1.0) % 1.0 * width
    y = clamp(v * (height - 1), 0.0, height - 1)
    x0 = int(x) % width
    x1 = (x0 + 1) % width
    y0 = int(y)
    y1 = min(height - 1, y0 + 1)
    tx = x - int(x)
    ty = y - y0
    i00 = y0 * width + x0
    i10 = y0 * width + x1
    i01 = y1 * width + x0
    i11 = y1 * width + x1
    top = values[i00] + (values[i10] - values[i00]) * tx
    bottom = values[i01] + (values[i11] - values[i01]) * tx
    return top + (bottom - top) * ty


def load_variants(material_root: Path, key: str, variant_count: int) -> list[Image.Image]:
    variants: list[Image.Image] = []
    for index in range(variant_count):
        suffix = "" if index == 0 else f"_{index + 1:02d}"
        path = material_root / f"{key}{suffix}.png"
        if not path.exists():
            if index == 0:
                raise FileNotFoundError(path)
            continue
        variants.append(Image.open(path).convert("RGB"))
    return variants


def sample_image_bilinear(image: Image.Image, u: float, v: float) -> tuple[int, int, int]:
    width, height = image.size
    x = ((u % 1.0) + 1.0) % 1.0 * width
    y = ((v % 1.0) + 1.0) % 1.0 * height
    x0 = int(x) % width
    x1 = (x0 + 1) % width
    y0 = int(y) % height
    y1 = (y0 + 1) % height
    tx = x - int(x)
    ty = y - int(y)
    px = image.load()
    c00 = px[x0, y0]
    c10 = px[x1, y0]
    c01 = px[x0, y1]
    c11 = px[x1, y1]
    return tuple(
        round((c00[idx] * (1 - tx) + c10[idx] * tx) * (1 - ty) + (c01[idx] * (1 - tx) + c11[idx] * tx) * ty)
        for idx in range(3)
    )


def sample_variant(texture: Image.Image, u: float, v: float, distortion: float = 0.0) -> tuple[int, int, int]:
    base = sample_image_bilinear(texture, u, v)
    shifted = sample_image_bilinear(texture, u + 0.37 + distortion * 0.11, v + 0.21 - distortion * 0.07)
    skewed = sample_image_bilinear(
        texture,
        u * 0.83 - v * 0.17 + 0.19 + distortion * 0.05,
        v * 0.79 + u * 0.19 + 0.13 - distortion * 0.03,
    )
    return blend_rgb(blend_rgb(base, shifted, 0.34), skewed, 0.18)


def sample_material(variants: list[Image.Image], u: float, v: float, distortion: float = 0.0) -> tuple[int, int, int]:
    if len(variants) == 1:
        return sample_variant(variants[0], u, v, distortion)

    def center_weight(x: float, y: float) -> float:
        fx = 1.0 - abs((((x % 1.0) + 1.0) % 1.0) - 0.5) * 2.0
        fy = 1.0 - abs((((y % 1.0) + 1.0) % 1.0) - 0.5) * 2.0
        return max(0.0, fx) * max(0.0, fy)

    accum = [0.0, 0.0, 0.0]
    total = 0.0
    for index, texture in enumerate(variants):
        offset_u = u + index * 0.173 + distortion * (0.04 + index * 0.01)
        offset_v = v + index * 0.127 - distortion * (0.03 + index * 0.008)
        sample = sample_variant(texture, offset_u, offset_v, distortion * (1.0 + index * 0.15))
        weight = 0.18 + center_weight(offset_u, offset_v)
        for channel in range(3):
            accum[channel] += sample[channel] * weight
        total += weight
    return tuple(round(channel / max(total, 1e-6)) for channel in accum)


def bake_texture(surface_map: dict, material_root: Path, scale: int = 12) -> Image.Image:
    loaded = {key: load_variants(material_root, key, 3) for key in PRIMARY_KEYS}
    north_pole = load_variants(material_root, "north_pole", 1)[0]
    south_pole = load_variants(material_root, "south_pole", 1)[0]

    width = int(surface_map["lon_steps"]) * scale
    height = int(surface_map["lat_steps"]) * scale
    threshold = float(surface_map["land_threshold"])
    image = Image.new("RGB", (width, height))
    px = image.load()

    for y in range(height):
        sv = y / height
        latitude = abs(sv * 2.0 - 1.0)
        polar_blend = smoothstep(0.72, 0.96, latitude)
        polar_cap_blend = smoothstep(0.84, 1.0, latitude)
        is_north = sv < 0.5
        polar_extent = 0.28
        polar_radius = min(1.0, (sv / polar_extent) if is_north else ((1.0 - sv) / polar_extent))
        for x in range(width):
            su = x / width
            value = sample_surface_value(surface_map, su, sv)
            polar_theta = su * 3.141592653589793 * 2.0
            polar_u = 0.5 + __import__("math").cos(polar_theta) * polar_radius * 0.5
            polar_v = 0.5 + __import__("math").sin(polar_theta) * polar_radius * 0.5
            pole_rgb = sample_image_bilinear(north_pole if is_north else south_pole, polar_u, polar_v)

            detail_u = su * 6.5 + sv * 0.7
            detail_v = sv * 4.5 + su * 0.35
            detail_u2 = su * 12.0 - sv * 0.9
            detail_v2 = sv * 8.0 + su * 0.6
            micro_u = su * 22.0 + sv * 1.4
            micro_v = sv * 18.0 - su * 1.1
            broad_u = su * 1.6 + sv * 0.15
            broad_v = sv * 1.4 + su * 0.08
            broad_u2 = su * 2.4 - sv * 0.18
            broad_v2 = sv * 2.0 + su * 0.11
            distortion = (
                __import__("math").sin((su * 7.0 + sv * 3.0) * 3.141592653589793 * 2.0) * 0.5
                + __import__("math").cos((su * 4.0 - sv * 5.0) * 3.141592653589793 * 2.0) * 0.5
            )

            if value < threshold:
                sea_level = value / max(threshold, 1.0)
                ocean_detail = (
                    sample_material(loaded["deep_ocean"], detail_u, detail_v, distortion)
                    if sea_level < 0.58
                    else blend_rgb(
                        sample_material(loaded["deep_ocean"], detail_u, detail_v, distortion),
                        sample_material(loaded["shallow_ocean"], detail_u2, detail_v2, distortion),
                        smoothstep(0.58, 1.0, sea_level),
                    )
                )
                ocean_micro = (
                    sample_material(loaded["deep_ocean"], micro_u, micro_v, distortion * 1.3)
                    if sea_level < 0.58
                    else blend_rgb(
                        sample_material(loaded["deep_ocean"], micro_u, micro_v, distortion * 1.3),
                        sample_material(loaded["shallow_ocean"], micro_v, micro_u, distortion * 1.3),
                        smoothstep(0.58, 1.0, sea_level),
                    )
                )
                broad_rgb = (
                    sample_material(loaded["deep_ocean"], broad_u, broad_v, distortion * 0.5)
                    if sea_level < 0.58
                    else blend_rgb(
                        sample_material(loaded["deep_ocean"], broad_u, broad_v, distortion * 0.5),
                        sample_material(loaded["shallow_ocean"], broad_u2, broad_v2, distortion * 0.5),
                        smoothstep(0.58, 1.0, sea_level),
                    )
                )
                rgb = blend_rgb(broad_rgb, ocean_detail, 0.44)
                rgb = apply_material_detail(rgb, ocean_micro, 0.16)
                if polar_blend > 0.0:
                    rgb = blend_rgb(rgb, broad_rgb, polar_blend * 0.9)
                if polar_cap_blend > 0.05:
                    icy_ocean = blend_rgb(broad_rgb, (220, 235, 245), polar_cap_blend * 0.45)
                    rgb = blend_rgb(rgb, icy_ocean, polar_cap_blend * 0.65)
                if polar_blend > 0.08:
                    rgb = blend_rgb(rgb, pole_rgb, polar_blend * 0.82)
                rgb = tune_material_color(rgb, saturation=1.08, gain=1.08, lift=6)
            else:
                land_level = (value - threshold) / max(255.0 - threshold, 1.0)
                compressed = land_level ** 1.55
                if compressed < 0.18:
                    detail_rgb = sample_material(loaded["coast"], detail_u, detail_v, distortion)
                    micro_rgb = sample_material(loaded["coast"], micro_u, micro_v, distortion * 1.15)
                    broad_rgb = sample_material(loaded["coast"], broad_u, broad_v, distortion * 0.5)
                elif compressed < 0.58:
                    t = smoothstep(0.18, 0.58, compressed)
                    detail_rgb = blend_rgb(
                        sample_material(loaded["coast"], detail_u, detail_v, distortion),
                        sample_material(loaded["lowland"], detail_u2, detail_v2, distortion),
                        t,
                    )
                    micro_rgb = blend_rgb(
                        sample_material(loaded["coast"], micro_u, micro_v, distortion * 1.15),
                        sample_material(loaded["lowland"], micro_v, micro_u, distortion * 1.15),
                        t,
                    )
                    broad_rgb = blend_rgb(
                        sample_material(loaded["coast"], broad_u, broad_v, distortion * 0.5),
                        sample_material(loaded["lowland"], broad_u2, broad_v2, distortion * 0.5),
                        t,
                    )
                elif compressed < 0.86:
                    t = smoothstep(0.58, 0.86, compressed)
                    detail_rgb = blend_rgb(
                        sample_material(loaded["lowland"], detail_u, detail_v, distortion),
                        sample_material(loaded["upland"], detail_u2, detail_v2, distortion),
                        t,
                    )
                    micro_rgb = blend_rgb(
                        sample_material(loaded["lowland"], micro_u, micro_v, distortion * 1.15),
                        sample_material(loaded["upland"], micro_v, micro_u, distortion * 1.15),
                        t,
                    )
                    broad_rgb = blend_rgb(
                        sample_material(loaded["lowland"], broad_u, broad_v, distortion * 0.5),
                        sample_material(loaded["upland"], broad_u2, broad_v2, distortion * 0.5),
                        t,
                    )
                else:
                    t = smoothstep(0.86, 1.0, compressed)
                    detail_rgb = blend_rgb(
                        sample_material(loaded["upland"], detail_u, detail_v, distortion),
                        sample_material(loaded["mountain_snow"], detail_u2, detail_v2, distortion),
                        t,
                    )
                    micro_rgb = blend_rgb(
                        sample_material(loaded["upland"], micro_u, micro_v, distortion * 1.15),
                        sample_material(loaded["mountain_snow"], micro_v, micro_u, distortion * 1.15),
                        t,
                    )
                    broad_rgb = blend_rgb(
                        sample_material(loaded["upland"], broad_u, broad_v, distortion * 0.5),
                        sample_material(loaded["mountain_snow"], broad_u2, broad_v2, distortion * 0.5),
                        t,
                    )
                rgb = blend_rgb(broad_rgb, detail_rgb, 0.48)
                rgb = apply_material_detail(rgb, micro_rgb, 0.28)
                if polar_blend > 0.0:
                    rgb = blend_rgb(rgb, broad_rgb, polar_blend * 0.92)
                if polar_cap_blend > 0.05:
                    snow_cap = blend_rgb(broad_rgb, (242, 246, 250), polar_cap_blend * 0.88)
                    rgb = blend_rgb(rgb, snow_cap, polar_cap_blend * 0.72)
                if polar_blend > 0.08:
                    polar_land = blend_rgb(pole_rgb, broad_rgb, 0.22)
                    rgb = blend_rgb(rgb, polar_land, polar_blend * 0.88)
                rgb = tune_material_color(rgb, saturation=1.12, gain=1.07, lift=5)

            px[x, y] = rgb
    return image


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
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
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
