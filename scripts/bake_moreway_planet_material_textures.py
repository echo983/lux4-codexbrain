#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import math
from pathlib import Path
from typing import Iterable

from PIL import Image


REPO_ROOT = Path(__file__).resolve().parent.parent
DATASET_ROOT = REPO_ROOT / "var" / "moreway_planet_dataset"
PLANET_MATERIAL_ASSET_ROOT = REPO_ROOT / "var" / "planet_material_assets" / "openai" / "v1"

MATERIAL_SOURCES = {
    "openai_materials": PLANET_MATERIAL_ASSET_ROOT,
}
MATERIAL_FAMILY_ALIASES = {
    "deep_ocean": ("deep_ocean",),
    "mid_ocean": ("mid_ocean", "deep_ocean"),
    "shallow_ocean": ("shallow_ocean",),
    "coastal_water": ("coastal_water", "shallow_ocean"),
    "coast_wet": ("coast_wet", "coast"),
    "coast_dry": ("coast_dry", "coast"),
    "lowland_grass": ("lowland_grass", "lowland"),
    "lowland_forest": ("lowland_forest", "lowland"),
    "upland_temperate": ("upland_temperate", "upland"),
    "upland_dry": ("upland_dry", "upland"),
    "mountain_rock": ("mountain_rock", "upland"),
    "mountain_snow": ("mountain_snow",),
}
PRIMARY_FAMILIES = [
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
]

TextureVariant = tuple[Image.Image, object, int, int]


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


def load_variants(material_root: Path, key: str, variant_count: int) -> list[TextureVariant]:
    variants: list[TextureVariant] = []
    family_dir = material_root / key
    if family_dir.is_dir():
        for index in range(variant_count):
            filename = family_dir / f"albedo_{index + 1:02d}.png"
            if not filename.exists():
                if index == 0:
                    raise FileNotFoundError(filename)
                continue
            image = Image.open(filename).convert("RGB")
            variants.append((image, image.load(), image.size[0], image.size[1]))
        return variants
    for index in range(variant_count):
        suffix = "" if index == 0 else f"_{index + 1:02d}"
        path = material_root / f"{key}{suffix}.png"
        if not path.exists():
            if index == 0:
                raise FileNotFoundError(path)
            continue
        image = Image.open(path).convert("RGB")
        variants.append((image, image.load(), image.size[0], image.size[1]))
    return variants


def resolve_family_variants(material_root: Path, family: str, variant_count: int = 3) -> list[TextureVariant]:
    for alias in MATERIAL_FAMILY_ALIASES[family]:
        try:
            return load_variants(material_root, alias, variant_count)
        except FileNotFoundError:
            continue
    raise FileNotFoundError(f"No texture variants found for family '{family}' in {material_root}")


def regional_variation(u: float, v: float) -> float:
    return (
        math.sin((u * 1.73 + v * 0.41) * math.pi * 2.0) * 0.35
        + math.cos((u * 0.67 - v * 1.21) * math.pi * 2.0) * 0.25
        + math.sin((u * 0.19 + v * 0.14) * math.pi * 6.0) * 0.10
    )


def derive_region_style_fields(*, u: float, v: float, compressed_land: float, continent_bias: float = 0.0) -> dict[str, float]:
    latitude = abs(v * 2.0 - 1.0)
    variation = regional_variation(u, v)
    dryness = clamp(0.46 + continent_bias * 0.22 + variation * 0.45 - compressed_land * 0.08, 0.0, 1.0)
    coldness = clamp(latitude * 0.82 + compressed_land * 0.18, 0.0, 1.0)
    vegetation = clamp(1.0 - dryness * 0.92 - coldness * 0.58, 0.0, 1.0)
    return {
        "latitude": latitude,
        "regional_variation": variation,
        "dryness": dryness,
        "coldness": coldness,
        "vegetation": vegetation,
    }


def choose_land_families(compressed_land: float, style_fields: dict[str, float]) -> tuple[str, str]:
    dryness = style_fields["dryness"]
    vegetation = style_fields["vegetation"]
    coldness = style_fields["coldness"]
    if compressed_land < 0.18:
        return ("coast_dry" if dryness > 0.58 else "coast_wet", "coast_dry" if dryness > 0.72 else "coast_wet")
    if compressed_land < 0.58:
        primary = "lowland_forest" if vegetation > 0.44 else "lowland_grass"
        secondary = "lowland_grass" if primary == "lowland_forest" else "lowland_forest"
        return primary, secondary
    if compressed_land < 0.86:
        primary = "upland_dry" if dryness > 0.55 else "upland_temperate"
        secondary = "upland_temperate" if primary == "upland_dry" else "upland_dry"
        return primary, secondary
    if coldness > 0.52:
        return "mountain_snow", "mountain_rock"
    return "mountain_rock", "mountain_snow"


def choose_ocean_families(sea_level: float, latitude: float) -> tuple[str, str]:
    if sea_level < 0.36:
        return "deep_ocean", "mid_ocean"
    if sea_level < 0.72:
        return "mid_ocean", "deep_ocean"
    if latitude > 0.78:
        return "coastal_water", "shallow_ocean"
    return "shallow_ocean", "coastal_water"


def material_style_metadata() -> dict:
    return {
        "version": "v2",
        "provider": "openai",
        "families": PRIMARY_FAMILIES,
        "style_fields": [
            "latitude",
            "regional_variation",
            "dryness",
            "coldness",
            "vegetation",
        ],
    }


def sample_image_bilinear(texture: TextureVariant, u: float, v: float) -> tuple[int, int, int]:
    _, px, width, height = texture
    x = ((u % 1.0) + 1.0) % 1.0 * width
    y = ((v % 1.0) + 1.0) % 1.0 * height
    x0 = int(x) % width
    x1 = (x0 + 1) % width
    y0 = int(y) % height
    y1 = (y0 + 1) % height
    tx = x - int(x)
    ty = y - int(y)
    c00 = px[x0, y0]
    c10 = px[x1, y0]
    c01 = px[x0, y1]
    c11 = px[x1, y1]
    return tuple(
        round((c00[idx] * (1 - tx) + c10[idx] * tx) * (1 - ty) + (c01[idx] * (1 - tx) + c11[idx] * tx) * ty)
        for idx in range(3)
    )


def sample_variant(texture: TextureVariant, u: float, v: float, distortion: float = 0.0) -> tuple[int, int, int]:
    base = sample_image_bilinear(texture, u, v)
    shifted = sample_image_bilinear(texture, u + 0.37 + distortion * 0.11, v + 0.21 - distortion * 0.07)
    skewed = sample_image_bilinear(
        texture,
        u * 0.83 - v * 0.17 + 0.19 + distortion * 0.05,
        v * 0.79 + u * 0.19 + 0.13 - distortion * 0.03,
    )
    return blend_rgb(blend_rgb(base, shifted, 0.34), skewed, 0.18)


def sample_material(variants: list[TextureVariant], u: float, v: float, distortion: float = 0.0) -> tuple[int, int, int]:
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
    loaded = {family: resolve_family_variants(material_root, family, 3) for family in PRIMARY_FAMILIES}
    north_pole = load_variants(material_root, "north_pole", 1)[0]
    south_pole = load_variants(material_root, "south_pole", 1)[0]

    width = int(surface_map["lon_steps"]) * scale
    height = int(surface_map["lat_steps"]) * scale
    threshold = float(surface_map["land_threshold"])
    image = Image.new("RGB", (width, height))
    px = image.load()

    def render_ocean_rgb(
        value: float,
        latitude: float,
        polar_blend: float,
        polar_cap_blend: float,
        pole_rgb: tuple[int, int, int],
        detail_u: float,
        detail_v: float,
        detail_u2: float,
        detail_v2: float,
        micro_u: float,
        micro_v: float,
        broad_u: float,
        broad_v: float,
        broad_u2: float,
        broad_v2: float,
        distortion: float,
    ) -> tuple[int, int, int]:
        sea_level = value / max(threshold, 1.0)
        primary_family, secondary_family = choose_ocean_families(sea_level, latitude)
        ocean_detail = (
            sample_material(loaded[primary_family], detail_u, detail_v, distortion)
            if sea_level < 0.58
            else blend_rgb(
                sample_material(loaded[primary_family], detail_u, detail_v, distortion),
                sample_material(loaded[secondary_family], detail_u2, detail_v2, distortion),
                smoothstep(0.58, 1.0, sea_level),
            )
        )
        ocean_micro = (
            sample_material(loaded[primary_family], micro_u, micro_v, distortion * 1.3)
            if sea_level < 0.58
            else blend_rgb(
                sample_material(loaded[primary_family], micro_u, micro_v, distortion * 1.3),
                sample_material(loaded[secondary_family], micro_v, micro_u, distortion * 1.3),
                smoothstep(0.58, 1.0, sea_level),
            )
        )
        broad_rgb = (
            sample_material(loaded[primary_family], broad_u, broad_v, distortion * 0.5)
            if sea_level < 0.58
            else blend_rgb(
                sample_material(loaded[primary_family], broad_u, broad_v, distortion * 0.5),
                sample_material(loaded[secondary_family], broad_u2, broad_v2, distortion * 0.5),
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
        return tune_material_color(rgb, saturation=1.08, gain=1.08, lift=6)

    def render_land_rgb(
        value: float,
        su: float,
        sv: float,
        polar_blend: float,
        polar_cap_blend: float,
        pole_rgb: tuple[int, int, int],
        detail_u: float,
        detail_v: float,
        detail_u2: float,
        detail_v2: float,
        micro_u: float,
        micro_v: float,
        broad_u: float,
        broad_v: float,
        broad_u2: float,
        broad_v2: float,
        distortion: float,
    ) -> tuple[int, int, int]:
        land_level = (value - threshold) / max(255.0 - threshold, 1.0)
        compressed = land_level ** 1.55
        style_fields = derive_region_style_fields(u=su, v=sv, compressed_land=compressed)
        primary_family, secondary_family = choose_land_families(compressed, style_fields)
        detail_rgb = sample_material(loaded[primary_family], detail_u, detail_v, distortion)
        secondary_rgb = sample_material(loaded[secondary_family], detail_u2, detail_v2, distortion)
        micro_rgb = sample_material(loaded[primary_family], micro_u, micro_v, distortion * 1.15)
        broad_rgb = sample_material(loaded[primary_family], broad_u, broad_v, distortion * 0.5)
        if primary_family != secondary_family:
            band_mix = smoothstep(0.0, 1.0, compressed)
            detail_rgb = blend_rgb(detail_rgb, secondary_rgb, band_mix * 0.28)
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
        return tune_material_color(rgb, saturation=1.12, gain=1.07, lift=5)

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
                math.sin((su * 7.0 + sv * 3.0) * math.pi * 2.0) * 0.5
                + math.cos((su * 4.0 - sv * 5.0) * math.pi * 2.0) * 0.5
            )

            if value < threshold:
                rgb = render_ocean_rgb(
                    value,
                    latitude,
                    polar_blend,
                    polar_cap_blend,
                    pole_rgb,
                    detail_u,
                    detail_v,
                    detail_u2,
                    detail_v2,
                    micro_u,
                    micro_v,
                    broad_u,
                    broad_v,
                    broad_u2,
                    broad_v2,
                    distortion,
                )
            else:
                rgb = render_land_rgb(
                    value,
                    su,
                    sv,
                    polar_blend,
                    polar_cap_blend,
                    pole_rgb,
                    detail_u,
                    detail_v,
                    detail_u2,
                    detail_v2,
                    micro_u,
                    micro_v,
                    broad_u,
                    broad_v,
                    broad_u2,
                    broad_v2,
                    distortion,
                )

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
    planet = manifest.setdefault("planet", {})
    planet["baked_textures"] = baked
    planet["material_style"] = material_style_metadata()
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
