# Moreway Planet Material Redesign Requirements

## Objective

Redesign the AI-assisted planet material system so that the final rendered planet:

- preserves the existing data truth from `surface_map`,
- looks more natural and regionally varied,
- avoids a globally over-sandy or over-brown land appearance,
- and remains compatible with the current offline baking pipeline.

This redesign is about **material semantics and regional variation**, not about changing the underlying landmass geometry.

## Current Problem

The current material system is too coarse. Even after aligning terrain thresholds, the baked `OpenAI` material output still tends to render large portions of land in yellow-brown tones.

Observed root causes:

- land material categories are too broad,
- one `lowland` material is currently expected to represent many different ecological appearances,
- randomization exists at the texture-tiling level, but not enough at the **regional semantic** level,
- the material source set is not sufficiently differentiated between wet, temperate, dry, and cold land.

As a result:

- landmass geometry is correct,
- but ecological appearance is not convincing,
- and the perceived green coverage diverges too much from the intended terrain logic.

## Design Principles

1. Geometry truth remains owned by `surface_map`.
2. AI models provide **material sources**, not final global map truth.
3. Variation must be **structured**, not purely random.
4. The same altitude band should support multiple ecological appearances.
5. Final rendering should remain bakeable offline into cached textures.

## Required Redesign

### 1. Material Taxonomy Expansion

Replace the current coarse land material taxonomy with a more semantically differentiated one.

Minimum recommended target taxonomy:

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

This list may be adjusted, but the redesign must introduce materially different land appearances beyond a single `lowland` and `upland`.

### 2. Regional Style Fields

Introduce one or more region-level control fields that select or weight material families.

At minimum, the redesign should support regional variation based on:

- continent / cluster identity,
- latitude,
- a low-frequency regional variation field.

These fields should influence whether a region trends toward:

- wetter / greener,
- drier / harsher,
- colder / more barren,
- more forested vs. more open grassland.

This must not alter the coastline geometry itself. It only alters appearance selection inside the existing terrain truth.

### 3. Layered Material Logic

Final material assignment should be controlled by three stacked dimensions:

1. Terrain band
   - sea / coast / lowland / upland / mountain
2. Regional ecological style
   - wet / temperate / dry / cold
3. Tileable texture variation
   - multiple source variants per class

The system must not rely on a single prompt-generated texture for an entire terrain band.

### 4. Randomness Policy

Randomness is required, but must be constrained.

Allowed randomness:

- tile variation mixing,
- low-frequency regional drift,
- mild continent-level style differences.

Disallowed randomness:

- anything that changes continent boundaries,
- anything that makes adjacent pixels change style too abruptly,
- anything that overrides the global terrain truth from `surface_map`.

## Rendering Requirements

The redesigned system must still support:

- offline baking into cached final textures,
- fast frontend loading using baked textures,
- runtime fallback composition when baked textures are unavailable.

The new material system must continue to work with:

- `OpenAI` material source sets,
- and the current baked texture workflow.

## Success Criteria

The redesign is successful if:

- continents remain geometrically consistent with the current `surface_map`,
- large land areas no longer default to a monotonous sand-brown appearance,
- lowlands visually read as meaningfully greener where appropriate,
- different continents or large regions can exhibit distinct ecological character,
- and the final result looks more like a coherent world than a single repeated material family.

## Recommended Implementation Order

1. Define the new taxonomy and file naming scheme.
2. Add region-style control fields to the bake pipeline.
3. Rework baked texture composition logic to use:
   - terrain band,
   - regional style,
   - multi-variant tiling.
4. Regenerate only the most important material classes first:
   - coast,
   - lowland,
   - upland,
   - mountain.
5. Re-evaluate visual output before expanding further.

## Non-Goals

This redesign does not attempt to:

- change UMAP logic,
- change continent generation logic,
- change document point placement,
- or replace the offline bake architecture.

Those systems are assumed correct enough for this phase.
