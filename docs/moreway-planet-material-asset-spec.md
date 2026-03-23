# Moreway Planet Material Asset Specification

## Purpose

Define a stable, versioned material asset specification for `Moreway Planet` so that AI-generated material sources can become a long-lived asset library instead of repeated ad hoc generations.

The main goal is to make image generation cost as close to a **one-time asset production cost** as possible.

This specification is designed to support:

- current albedo-only workflows,
- future normal / roughness / height extensions,
- multiple providers such as OpenAI and Cloudflare,
- offline baking,
- and frontend material loading with minimal protocol churn.

## Design Principles

1. Material sources are reusable assets, not temporary experiment outputs.
2. Taxonomy should be stable even if not every slot is filled immediately.
3. Asset structure must already reserve space for future channels.
4. Every generated asset must retain provenance metadata.
5. Future expansion should add files, not force a naming reset.

## Asset Taxonomy

The target taxonomy for terrain material families is:

- `deep_ocean`
- `mid_ocean`
- `shallow_ocean`
- `coastal_water`
- `coast_wet`
- `coast_dry`
- `lowland_grass`
- `lowland_forest`
- `upland_temperate`
- `upland_dry`
- `mountain_rock`
- `mountain_snow`
- `north_pole`
- `south_pole`

Not every family needs to exist in the first production pass, but the names should be considered reserved.

## Provider Namespaces

Material assets must be grouped by provider and material-set version.

Recommended top-level layout:

```text
var/
  planet_material_assets/
    openai/
      v1/
```

For the current formal pipeline, OpenAI is the only active provider.
The namespace remains versioned so future expansion does not require a structural reset.

## Per-Family Directory Layout

Each material family should live in its own directory.

Example:

```text
var/planet_material_assets/openai/v1/lowland_grass/
  meta.json
  albedo_01.png
  albedo_02.png
  albedo_03.png
  normal_01.png
  roughness_01.png
  height_01.png
```

Even if only albedo exists initially, the structure should still follow this pattern.

## Required Channels

### Phase 1 Required

- `albedo`

### Reserved for Future

- `normal`
- `roughness`
- `height`
- `mask`

The pipeline must assume these channel names may appear later.

If a channel is absent, the bake process should simply fall back safely.

## Variant Naming

Variants must use explicit numeric suffixes.

Required naming form:

- `albedo_01.png`
- `albedo_02.png`
- `albedo_03.png`

Avoid mixed styles such as:

- `foo.png`
- `foo_02.png`

For new material packs, all variants should use the same explicit numeric style.

Legacy compatibility can be handled in code if needed, but new assets should follow the normalized naming convention.

## Metadata Requirements

Each material family directory must include `meta.json`.

Minimum required fields:

```json
{
  "family": "lowland_grass",
  "provider": "openai",
  "material_set_version": "v1",
  "channels": ["albedo"],
  "variant_count": 3,
  "tileable": true,
  "created_at": "2026-03-23T00:00:00Z"
}
```

### Provenance Fields

Recommended additional fields:

- `model`
- `prompt`
- `revised_prompt`
- `seed`
- `source_images`
- `notes`
- `generation_script`
- `generation_cost_estimate`

Example:

```json
{
  "family": "lowland_grass",
  "provider": "openai",
  "material_set_version": "v1",
  "channels": ["albedo"],
  "variant_count": 3,
  "tileable": true,
  "model": "gpt-image-1.5",
  "prompt": "...",
  "revised_prompt": "...",
  "generation_script": "scripts/openai_planet_material_set_experiment.py",
  "created_at": "2026-03-23T00:00:00Z",
  "notes": "Wet green lowland terrain for temperate continental interiors."
}
```

## Material Set Manifest

At the provider/version level, include a manifest file:

```text
var/planet_material_assets/openai/v1/material_set.json
```

This file should describe:

- provider
- version
- available families
- available channels
- default bake mapping

Example structure:

```json
{
  "provider": "openai",
  "version": "v1",
  "families": {
    "lowland_grass": {
      "channels": ["albedo"],
      "variants": 3
    },
    "lowland_forest": {
      "channels": ["albedo"],
      "variants": 3
    }
  }
}
```

## Bake Contract

The bake pipeline must not hardcode one-off file names.

Instead, it should:

1. resolve a material set manifest,
2. resolve family directories,
3. resolve channel variants from metadata,
4. choose channels dynamically if present.

This allows the same bake logic to support:

- albedo-only packs,
- albedo + normal packs,
- provider-specific packs,
- future higher fidelity replacements.

## Compatibility Expectations

The asset spec must support:

- current baked texture generation,
- current frontend baked texture loading,
- current runtime fallback composition,
- future normal-map-aware rendering,
- future roughness-aware rendering.

It must not require changing the taxonomy every time a new rendering feature is added.

## Generation Policy

To minimize model cost:

1. generate primary families once,
2. archive prompts and metadata,
3. only regenerate when:
   - taxonomy changes,
   - quality is clearly insufficient,
   - or a new rendering channel is required.

Do not regenerate all assets just because:

- the knowledge dataset changed,
- the `surface_map` changed,
- or a new planet build was produced.

Planet builds should reuse the same material asset library whenever possible.

## Versioning Policy

Use explicit version directories:

- `v1`
- `v2`
- `v3`

Increment the material set version when:

- taxonomy meaning changes,
- prompt semantics change substantially,
- or provider output strategy changes enough that old and new assets should not be mixed silently.

Do not silently replace assets inside an existing version unless they are clearly marked as a corrected patch and the downstream bake process is expected to treat them as equivalent.

## Migration Guidance

The current experiment directory under:

- `var/openai_image_experiments/materials`

should be treated as transitional.

The formal next step should be to migrate it into:

- `var/planet_material_assets/openai/v1/...`

with proper metadata manifests.

## Success Criteria

This asset specification is successful if:

- new rendering channels can be added without renaming the whole library,
- prompts and provenance remain traceable,
- bake scripts can consume provider/versioned material packs consistently,
- and material source generation becomes an intentional asset production workflow rather than repeated experimentation.
