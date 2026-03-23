# Moreway Planet Material Redesign Technical Design

## Goal

Translate the material redesign requirements into a concrete, buildable technical plan that fits the current `Moreway Planet` pipeline.

This design assumes:

- `surface_map` remains the terrain truth,
- continent geometry generation remains unchanged,
- offline baking remains the primary delivery path,
- frontend runtime composition remains only as a fallback.

## Current Baseline

The current pipeline has these stages:

1. LanceDB source table read
2. UMAP 3D projection
3. sphere mapping
4. community clustering and landmass generation
5. `surface_map` export into `manifest.json`
6. offline baked texture generation
7. frontend loads baked textures by mode

The redesign will only change stages 6 and the support data needed by stage 6.

## Proposed Architecture

### A. Terrain Truth Layer

No change in ownership.

Inputs:

- `surface_map.values`
- `surface_map.land_threshold`
- planet latitude / longitude
- build metadata

Outputs:

- terrain band assignment
- sea vs. land
- normalized land elevation

This layer decides:

- where continents are,
- where coasts are,
- where highlands and mountain regions are.

It does **not** decide final ecological style.

### B. Region Style Layer

Add a new derived layer that controls the ecological style of each area.

This layer should produce low-frequency control values, independent from fine texture detail.

Recommended fields:

- `continent_id`
  - derived from cluster identity / dominant landmass region
- `latitude_band`
  - normalized latitude from equator to pole
- `regional_variation`
  - low-frequency pseudo-random field, deterministic per world
- `dryness`
  - derived field
- `vegetation`
  - derived field
- `coldness`
  - derived field

The bake pipeline should use these fields to choose between material families.

### C. Material Family Layer

Replace the current coarse families with a more explicit taxonomy.

Recommended initial file-level taxonomy:

- Oceans
  - `deep_ocean`
  - `mid_ocean`
  - `shallow_ocean`
  - `coastal_water`

- Coasts
  - `coast_wet`
  - `coast_dry`

- Lowlands
  - `lowland_grass`
  - `lowland_forest`

- Highlands
  - `upland_temperate`
  - `upland_dry`

- Mountains
  - `mountain_rock`
  - `mountain_snow`

- Polar
  - `north_pole`
  - `south_pole`

Each material family should support multiple variants:

- `*_01`
- `*_02`
- `*_03`

The first phase may keep oceans simpler if necessary, but land families must become more differentiated.

## Derived Control Fields

### 1. Latitude

Already implicit in UV.

Use:

- `equatorialness = 1 - latitude`
- `polarness = latitude`

This controls:

- polar materials
- coldness bias
- vegetation suppression near poles

### 2. Continent Identity

Use the already available cluster / landmass identity if possible.

If not currently exported, add a coarse `continent_id_map` or similar derived raster during dataset build.

Simplest acceptable first implementation:

- derive nearest dominant cluster center for each land pixel
- write a low-resolution continent assignment map into `manifest`

Why this matters:

- different continents need distinct ecological tendencies
- otherwise the whole planet still reads as one blended super-biome

### 3. Regional Variation Field

Generate a deterministic low-frequency scalar field using a simple seeded noise function.

Requirements:

- low frequency only
- deterministic from build metadata or explicit seed
- stable across the same build

This field should not move coastlines.
It should only bias material selection inside already-valid terrain bands.

### 4. Derived Biome Weights

For each land pixel, derive:

- `dryness`
- `vegetation`
- `coldness`

Example conceptual formulas:

- `coldness = polarness * 0.75 + elevation_component * 0.25`
- `dryness = continent_bias + regional_variation * 0.4`
- `vegetation = clamp(1 - dryness - coldness * 0.6)`

Exact coefficients can evolve, but the system should be built around this style of weighted control, not a single hardcoded material choice.

## Terrain Band Assignment

Continue using `surface_map` to assign broad terrain bands.

Recommended base bands:

- sea deep
- sea mid
- sea shallow
- coast
- lowland
- upland
- mountain
- snow

These bands remain geometry-driven.

## Material Selection Rules

### Oceans

Use sea depth plus latitude:

- deeper oceans use `deep_ocean` or `mid_ocean`
- shallower coasts use `shallow_ocean` or `coastal_water`
- polar oceans bias toward colder versions

### Coasts

Use:

- coast band
- dryness

If dryness is high:

- bias toward `coast_dry`

Else:

- bias toward `coast_wet`

### Lowlands

Use:

- lowland band
- vegetation
- dryness

If vegetation is high:

- bias toward `lowland_forest`

Else:

- bias toward `lowland_grass`

### Highlands

Use:

- upland band
- dryness
- coldness

This determines whether the region trends toward:

- `upland_temperate`
- `upland_dry`

### Mountains

Use:

- mountain band
- coldness

Mix between:

- `mountain_rock`
- `mountain_snow`

Do not use a single snow threshold everywhere without biome context.

## Bake Pipeline Changes

### Existing Script

Primary script:

- `scripts/bake_moreway_planet_material_textures.py`

This script should be extended, not replaced.

### New Responsibilities

It should:

1. read `surface_map`
2. derive terrain bands
3. derive region style fields
4. select material families
5. sample multiple variants
6. compose final baked texture

### Internal Refactor Recommendation

Split the bake logic into explicit phases:

- `derive_terrain_bands(surface_map, ...)`
- `derive_region_style_fields(surface_map, manifest, ...)`
- `select_material_family(terrain_band, style_fields, ...)`
- `sample_material_stack(...)`
- `compose_baked_texture(...)`

This is preferable to leaving all logic in one large nested loop.

## Manifest Changes

Add a new optional section under `planet`, for example:

```json
{
  "planet": {
    "surface_map": { "...": "..." },
    "material_style": {
      "version": "v2",
      "seed": "....",
      "continent_style_count": 5,
      "fields": [
        "latitude",
        "regional_variation",
        "dryness",
        "vegetation",
        "coldness"
      ]
    }
  }
}
```

This does not need to store every full-resolution field immediately, but it should at least record enough metadata to identify the baked material logic used.

## Frontend Impact

Minimal frontend change is preferred.

The frontend should continue to:

- prefer baked textures,
- load a single baked PNG per material mode,
- use runtime composition only as fallback.

Only fallback composition needs to learn the new taxonomy and style fields if baked textures are unavailable.

For the normal path, frontend complexity should stay low.

## Material Asset Naming Convention

Recommended naming:

- `deep_ocean.png`
- `deep_ocean_02.png`
- `deep_ocean_03.png`
- `lowland_grass.png`
- `lowland_grass_02.png`
- `lowland_grass_03.png`

Avoid overloading current names like `lowland` if the semantic meaning changes substantially.

It is acceptable to keep backward compatibility temporarily by mapping old names to new categories in code, but the target naming should be explicit.

## Rollout Plan

### Phase 1

Implement the new taxonomy in code, but only regenerate:

- `coast_wet`
- `coast_dry`
- `lowland_grass`
- `lowland_forest`
- `upland_temperate`
- `upland_dry`
- `mountain_rock`
- `mountain_snow`

Keep ocean categories simpler if needed.

### Phase 2

Add region-style fields:

- deterministic regional variation
- continent-aware style bias
- latitude-aware biome bias

### Phase 3

Refine oceans and polar blending.

### Phase 4

Evaluate whether the OpenAI material set should split into multiple stylistic sub-packs, or remain a single unified pack with richer regional control.

## Validation Criteria

The redesign is working if:

- continents keep the same geometry,
- different continents can visibly differ in ecological character,
- lowland areas can be green without forcing the entire world into one uniform look,
- deserts and dry coasts appear where stylistically justified,
- and the planet no longer looks like one sand-heavy material family repeated everywhere.

## Recommended First Implementation Target

The first concrete implementation target should be:

- keep the current bake architecture,
- add continent-aware style bias,
- split `lowland` into `lowland_grass` and `lowland_forest`,
- split `coast` into `coast_wet` and `coast_dry`,
- split `upland` into `upland_temperate` and `upland_dry`,
- and re-evaluate the world before expanding further.

This provides meaningful improvement without forcing a complete rewrite in one step.
