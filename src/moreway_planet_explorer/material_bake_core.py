from __future__ import annotations

import math
from dataclasses import dataclass
from pathlib import Path

from PIL import Image

from .material_rules import (
    MATERIAL_RULES,
    clamp,
    compute_distortion,
    compute_land_band_weights,
    compute_land_ecology,
    smoothstep,
)
PRIMARY_KEYS = [
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


@dataclass(frozen=True)
class PixelContext:
    su: float
    sv: float
    value: float
    polar_blend: float
    polar_cap_blend: float
    pole_rgb: tuple[int, int, int]
    detail_u: float
    detail_v: float
    detail_u2: float
    detail_v2: float
    micro_u: float
    micro_v: float
    broad_u: float
    broad_v: float
    broad_u2: float
    broad_v2: float
    distortion: float
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


def load_variants(material_root: Path, key: str, variant_count: int, channel: str = "albedo") -> list[Image.Image]:
    variants: list[Image.Image] = []
    family_dir = material_root / key
    for index in range(variant_count):
        numeric_suffix = f"_{index + 1:02d}"
        if family_dir.is_dir():
            path = family_dir / f"{channel}{numeric_suffix}.png"
        else:
            if channel != "albedo":
                if index == 0:
                    raise FileNotFoundError(family_dir / f"{channel}{numeric_suffix}.png")
                continue
            suffix = "" if index == 0 else f"_{index + 1:02d}"
            path = material_root / f"{key}{suffix}.png"
        if not path.exists():
            if index == 0:
                raise FileNotFoundError(path)
            continue
        variants.append(Image.open(path).convert("RGB"))
    return variants


def load_material_bundle(
    material_root: Path,
    channel: str = "albedo",
) -> tuple[dict[str, list[Image.Image]], list[Image.Image], list[Image.Image]]:
    loaded = {
        key: load_variants(material_root, key, int(MATERIAL_RULES["variant_count"]), channel=channel)
        for key in PRIMARY_KEYS
    }
    north_pole = load_variants(material_root, "north_pole", int(MATERIAL_RULES["variant_count"]), channel=channel)
    south_pole = load_variants(material_root, "south_pole", int(MATERIAL_RULES["variant_count"]), channel=channel)
    return loaded, north_pole, south_pole


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


def build_pixel_context(
    surface_map: dict,
    x: int,
    y: int,
    width: int,
    height: int,
    north_pole: list[Image.Image],
    south_pole: list[Image.Image],
) -> PixelContext:
    su = x / width
    sv = y / height
    value = sample_surface_value(surface_map, su, sv)
    latitude = abs(sv * 2.0 - 1.0)
    polar_blend = smoothstep(MATERIAL_RULES["polar"]["blend_start"], MATERIAL_RULES["polar"]["blend_end"], latitude)
    polar_cap_blend = smoothstep(MATERIAL_RULES["polar"]["cap_start"], MATERIAL_RULES["polar"]["cap_end"], latitude)
    is_north = sv < 0.5
    polar_extent = MATERIAL_RULES["polar"]["extent"]
    polar_radius = min(1.0, (sv / polar_extent) if is_north else ((1.0 - sv) / polar_extent))
    polar_theta = su * math.pi * 2.0
    polar_u = 0.5 + math.cos(polar_theta) * polar_radius * 0.5
    polar_v = 0.5 + math.sin(polar_theta) * polar_radius * 0.5
    pole_rgb = sample_material(north_pole if is_north else south_pole, polar_u, polar_v, 0.0)
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
    distortion = compute_distortion(su, sv)
    return PixelContext(
        su=su,
        sv=sv,
        value=value,
        polar_blend=polar_blend,
        polar_cap_blend=polar_cap_blend,
        pole_rgb=pole_rgb,
        detail_u=detail_u,
        detail_v=detail_v,
        detail_u2=detail_u2,
        detail_v2=detail_v2,
        micro_u=micro_u,
        micro_v=micro_v,
        broad_u=broad_u,
        broad_v=broad_v,
        broad_u2=broad_u2,
        broad_v2=broad_v2,
        distortion=distortion,
    )


def bake_ocean_rgb(
    loaded: dict[str, list[Image.Image]],
    threshold: float,
    ctx: PixelContext,
    channel: str = "albedo",
) -> tuple[int, int, int]:
    sea_level = ctx.value / max(threshold, 1.0)
    ocean_rules = MATERIAL_RULES["ocean"]
    def sample_ocean_family(u1: float, v1: float, u2: float, v2: float, distortion: float) -> tuple[int, int, int]:
        if sea_level < ocean_rules["deep_end"]:
            return sample_material(loaded["deep_ocean"], u1, v1, distortion)
        if sea_level < ocean_rules["mid_end"]:
            return blend_rgb(
                sample_material(loaded["deep_ocean"], u1, v1, distortion),
                sample_material(loaded["mid_ocean"], u2, v2, distortion),
                smoothstep(ocean_rules["deep_end"], ocean_rules["mid_end"], sea_level),
            )
        if sea_level < ocean_rules["shallow_end"]:
            return blend_rgb(
                sample_material(loaded["mid_ocean"], u1, v1, distortion),
                sample_material(loaded["shallow_ocean"], u2, v2, distortion),
                smoothstep(ocean_rules["mid_end"], ocean_rules["shallow_end"], sea_level),
            )
        return blend_rgb(
            sample_material(loaded["shallow_ocean"], u1, v1, distortion),
            sample_material(loaded["coastal_water"], u2, v2, distortion),
            smoothstep(ocean_rules["shallow_end"], 1.0, sea_level),
        )

    ocean_detail = sample_ocean_family(ctx.detail_u, ctx.detail_v, ctx.detail_u2, ctx.detail_v2, ctx.distortion)
    ocean_micro = sample_ocean_family(ctx.micro_u, ctx.micro_v, ctx.micro_v, ctx.micro_u, ctx.distortion * 1.3)
    broad_rgb = sample_ocean_family(ctx.broad_u, ctx.broad_v, ctx.broad_u2, ctx.broad_v2, ctx.distortion * 0.5)
    rgb = blend_rgb(broad_rgb, ocean_detail, ocean_rules["detail_mix"])
    if channel == "albedo":
        rgb = apply_material_detail(rgb, ocean_micro, ocean_rules["detail_amount"])
        if ctx.polar_blend > 0.0:
            rgb = blend_rgb(rgb, broad_rgb, ctx.polar_blend * 0.9)
        if ctx.polar_cap_blend > 0.05:
            icy_ocean = blend_rgb(broad_rgb, (220, 235, 245), ctx.polar_cap_blend * 0.45)
            rgb = blend_rgb(rgb, icy_ocean, ctx.polar_cap_blend * 0.65)
        if ctx.polar_blend > 0.08:
            rgb = blend_rgb(rgb, ctx.pole_rgb, ctx.polar_blend * 0.82)
        return tune_material_color(rgb, **ocean_rules["tone"])
    rgb = blend_rgb(rgb, ocean_micro, ocean_rules["detail_amount"] * 0.55)
    if ctx.polar_blend > 0.05:
        rgb = blend_rgb(rgb, ctx.pole_rgb, ctx.polar_blend * 0.72)
    if ctx.polar_cap_blend > 0.1:
        rgb = blend_rgb(rgb, ctx.pole_rgb, ctx.polar_cap_blend * 0.45)
    return rgb


def bake_land_rgb(
    loaded: dict[str, list[Image.Image]],
    threshold: float,
    ctx: PixelContext,
    channel: str = "albedo",
) -> tuple[int, int, int]:
    land_rules = MATERIAL_RULES["land"]
    land_level = (ctx.value - threshold) / max(255.0 - threshold, 1.0)
    compressed = land_level ** land_rules["exponent"]
    ecology = compute_land_ecology(ctx.su, ctx.sv, compressed, ctx.distortion, MATERIAL_RULES)
    dryness = ecology["dryness"]
    vegetation = ecology["vegetation"]
    coldness = ecology["coldness"]
    ecology_rules = land_rules["ecology"]

    def sample_coast(u: float, v: float, distortion: float) -> tuple[int, int, int]:
        return blend_rgb(
            sample_material(loaded["coast_wet"], u, v, distortion),
            sample_material(loaded["coast_dry"], u + ecology_rules["coast_offset_u"], v + ecology_rules["coast_offset_v"], distortion),
            dryness,
        )

    def sample_lowland(u: float, v: float, distortion: float) -> tuple[int, int, int]:
        forest_weight = smoothstep(ecology_rules["vegetation_blend_start"], ecology_rules["vegetation_blend_end"], vegetation)
        return blend_rgb(
            sample_material(loaded["lowland_grass"], u, v, distortion),
            sample_material(loaded["lowland_forest"], u + ecology_rules["lowland_offset_u"], v + ecology_rules["lowland_offset_v"], distortion),
            forest_weight,
        )

    def sample_upland(u: float, v: float, distortion: float) -> tuple[int, int, int]:
        return blend_rgb(
            sample_material(loaded["upland_temperate"], u, v, distortion),
            sample_material(loaded["upland_dry"], u + 0.021, v - 0.029, distortion),
            smoothstep(0.32, 0.78, dryness),
        )

    def sample_mountain(u: float, v: float, distortion: float) -> tuple[int, int, int]:
        snow_weight = smoothstep(
            ecology_rules["snow_blend_start"],
            ecology_rules["snow_blend_end"],
            coldness + compressed * ecology_rules["coldness_height_bonus"],
        )
        return blend_rgb(
            sample_material(loaded["mountain_rock"], u, v, distortion),
            sample_material(loaded["mountain_snow"], u + ecology_rules["mountain_offset_u"], v + ecology_rules["mountain_offset_v"], distortion),
            snow_weight,
        )

    weights = compute_land_band_weights(compressed, MATERIAL_RULES)
    if weights["coast"] == 1.0:
        detail_rgb = sample_coast(ctx.detail_u, ctx.detail_v, ctx.distortion)
        micro_rgb = sample_coast(ctx.micro_u, ctx.micro_v, ctx.distortion * 1.15)
        broad_rgb = sample_coast(ctx.broad_u, ctx.broad_v, ctx.distortion * 0.5)
    elif weights["coast"] > 0.0 and weights["lowland"] > 0.0:
        detail_rgb = blend_rgb(
            sample_coast(ctx.detail_u, ctx.detail_v, ctx.distortion),
            sample_lowland(ctx.detail_u2, ctx.detail_v2, ctx.distortion),
            weights["lowland"],
        )
        micro_rgb = blend_rgb(
            sample_coast(ctx.micro_u, ctx.micro_v, ctx.distortion * 1.15),
            sample_lowland(ctx.micro_v, ctx.micro_u, ctx.distortion * 1.15),
            weights["lowland"],
        )
        broad_rgb = blend_rgb(
            sample_coast(ctx.broad_u, ctx.broad_v, ctx.distortion * 0.5),
            sample_lowland(ctx.broad_u2, ctx.broad_v2, ctx.distortion * 0.5),
            weights["lowland"],
        )
    elif weights["lowland"] > 0.0 and weights["upland"] > 0.0:
        detail_rgb = blend_rgb(
            sample_lowland(ctx.detail_u, ctx.detail_v, ctx.distortion),
            sample_upland(ctx.detail_u2, ctx.detail_v2, ctx.distortion),
            weights["upland"],
        )
        micro_rgb = blend_rgb(
            sample_lowland(ctx.micro_u, ctx.micro_v, ctx.distortion * 1.15),
            sample_upland(ctx.micro_v, ctx.micro_u, ctx.distortion * 1.15),
            weights["upland"],
        )
        broad_rgb = blend_rgb(
            sample_lowland(ctx.broad_u, ctx.broad_v, ctx.distortion * 0.5),
            sample_upland(ctx.broad_u2, ctx.broad_v2, ctx.distortion * 0.5),
            weights["upland"],
        )
    else:
        detail_rgb = blend_rgb(
            sample_upland(ctx.detail_u, ctx.detail_v, ctx.distortion),
            sample_mountain(ctx.detail_u2, ctx.detail_v2, ctx.distortion),
            weights["mountain"],
        )
        micro_rgb = blend_rgb(
            sample_upland(ctx.micro_u, ctx.micro_v, ctx.distortion * 1.15),
            sample_mountain(ctx.micro_v, ctx.micro_u, ctx.distortion * 1.15),
            weights["mountain"],
        )
        broad_rgb = blend_rgb(
            sample_upland(ctx.broad_u, ctx.broad_v, ctx.distortion * 0.5),
            sample_mountain(ctx.broad_u2, ctx.broad_v2, ctx.distortion * 0.5),
            weights["mountain"],
        )
    rgb = blend_rgb(broad_rgb, detail_rgb, land_rules["detail_mix"])
    if channel == "albedo":
        rgb = apply_material_detail(rgb, micro_rgb, land_rules["detail_amount"])
        if ctx.polar_blend > 0.0:
            rgb = blend_rgb(rgb, broad_rgb, ctx.polar_blend * 0.92)
        if ctx.polar_cap_blend > 0.05:
            snow_cap = blend_rgb(broad_rgb, (242, 246, 250), ctx.polar_cap_blend * 0.88)
            rgb = blend_rgb(rgb, snow_cap, ctx.polar_cap_blend * 0.72)
        if ctx.polar_blend > 0.08:
            polar_land = blend_rgb(ctx.pole_rgb, broad_rgb, 0.22)
            rgb = blend_rgb(rgb, polar_land, ctx.polar_blend * 0.88)
        return tune_material_color(rgb, **land_rules["tone"])
    rgb = blend_rgb(rgb, micro_rgb, land_rules["detail_amount"] * 0.55)
    if ctx.polar_blend > 0.05:
        rgb = blend_rgb(rgb, ctx.pole_rgb, ctx.polar_blend * 0.76)
    if ctx.polar_cap_blend > 0.1:
        rgb = blend_rgb(rgb, ctx.pole_rgb, ctx.polar_cap_blend * 0.48)
    return rgb


def bake_texture(surface_map: dict, material_root: Path, scale: int | None = None, channel: str = "albedo") -> Image.Image:
    loaded, north_pole, south_pole = load_material_bundle(material_root, channel=channel)

    scale = int(scale or MATERIAL_RULES["texture_scale"])
    width = int(surface_map["lon_steps"]) * scale
    height = int(surface_map["lat_steps"]) * scale
    threshold = float(surface_map["land_threshold"])
    image = Image.new("RGB", (width, height))
    px = image.load()

    for y in range(height):
        for x in range(width):
            ctx = build_pixel_context(surface_map, x, y, width, height, north_pole, south_pole)
            px[x, y] = (
                bake_ocean_rgb(loaded, threshold, ctx, channel=channel)
                if ctx.value < threshold
                else bake_land_rgb(loaded, threshold, ctx, channel=channel)
            )
    return image
