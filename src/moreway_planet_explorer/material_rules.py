from __future__ import annotations

import json
import math
from pathlib import Path


RULES_PATH = Path(__file__).resolve().parents[2] / "apps" / "moreway_planet_explorer_web" / "src" / "material_rules.json"
MATERIAL_RULES = json.loads(RULES_PATH.read_text(encoding="utf-8"))
BAKE_CHANNELS = tuple(MATERIAL_RULES.get("bake_channels", ("albedo", "normal", "roughness")))
OPENAI_MATERIAL_ASSET_ROOT = Path(__file__).resolve().parents[2] / "var" / "planet_material_assets" / "openai" / "v1"


def clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def smoothstep(edge0: float, edge1: float, x: float) -> float:
    t = clamp((x - edge0) / max(edge1 - edge0, 1e-6), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def compute_distortion(su: float, sv: float) -> float:
    return math.sin((su * 7.0 + sv * 3.0) * math.pi * 2.0) * 0.5 + math.cos((su * 4.0 - sv * 5.0) * math.pi * 2.0) * 0.5


def compute_land_ecology(su: float, sv: float, compressed: float, distortion: float, rules: dict | None = None) -> dict[str, float]:
    rules = rules or MATERIAL_RULES
    ecology = rules["land"]["ecology"]
    latitude = abs(sv * 2.0 - 1.0)
    distortion_n = (distortion + 1.0) * 0.5
    moisture = clamp(
        ecology["moisture_base"]
        - latitude * ecology["moisture_latitude_penalty"]
        - distortion_n * ecology["moisture_distortion_penalty"]
        + (1.0 - compressed) * ecology["moisture_lowland_bonus"]
        + math.sin((su * ecology["moisture_wave_u"] + sv * ecology["moisture_wave_v"]) * math.pi * 2.0)
        * ecology["moisture_wave_amplitude"],
        0.0,
        1.0,
    )
    dryness = clamp(1.0 - moisture + compressed * ecology["dryness_height_bonus"], 0.0, 1.0)
    vegetation = clamp(
        moisture * ecology["vegetation_moisture_scale"]
        + (1.0 - latitude) * ecology["vegetation_latitude_bonus"]
        - compressed * ecology["vegetation_height_penalty"],
        0.0,
        1.0,
    )
    coldness = clamp(
        latitude * ecology["coldness_latitude_scale"]
        + compressed * ecology["coldness_height_bonus"]
        - moisture * ecology["coldness_moisture_penalty"],
        0.0,
        1.0,
    )
    return {
        "latitude": latitude,
        "moisture": moisture,
        "dryness": dryness,
        "vegetation": vegetation,
        "coldness": coldness,
    }


def compute_land_band_weights(compressed: float, rules: dict | None = None) -> dict[str, float]:
    rules = rules or MATERIAL_RULES
    land_rules = rules["land"]
    if compressed < land_rules["coast_end"]:
        return {"coast": 1.0, "lowland": 0.0, "upland": 0.0, "mountain": 0.0}
    if compressed < land_rules["lowland_end"]:
        t = smoothstep(land_rules["coast_end"], land_rules["lowland_end"], compressed)
        return {"coast": 1.0 - t, "lowland": t, "upland": 0.0, "mountain": 0.0}
    if compressed < land_rules["upland_end"]:
        t = smoothstep(land_rules["lowland_end"], land_rules["upland_end"], compressed)
        return {"coast": 0.0, "lowland": 1.0 - t, "upland": t, "mountain": 0.0}
    t = smoothstep(land_rules["upland_end"], 1.0, compressed)
    return {"coast": 0.0, "lowland": 0.0, "upland": 1.0 - t, "mountain": t}
