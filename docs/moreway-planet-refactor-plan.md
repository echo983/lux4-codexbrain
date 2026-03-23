# Moreway Planet Refactor Plan

## Objective

Refactor `Moreway Planet` into a cleaner, more maintainable structure without changing its validated user-facing behavior.

This refactor is **not** a visual redesign and **not** a new interaction experiment. The purpose is to preserve the current working behavior while reducing coupling, clarifying ownership, and making future rendering/material work safer to implement.

## Current Problems

### Frontend

The current frontend entry file:

- [main.js](/root/lux4-codexbrain/apps/moreway_planet_explorer_web/src/main.js)

has accumulated too many responsibilities:

- Three.js scene bootstrapping
- camera and controls
- point/chunk loading
- focus ranking
- focus labels
- selection behavior
- material mode switching
- baked texture loading
- runtime fallback material synthesis
- terrain relief application
- light setup
- status UI updates

This makes it hard to:

- reason about regressions
- change one subsystem without touching others
- compare behavior against the stable mainline

### Bake Pipeline

The current bake entry:

- [bake_moreway_planet_material_textures.py](/root/lux4-codexbrain/scripts/bake_moreway_planet_material_textures.py)

mixes together:

- asset discovery
- material family resolution
- weighting logic
- albedo/normal/roughness composition
- file writing

This is still workable, but it is no longer a good long-term shape.

## Refactor Principles

1. Preserve current validated behavior.
2. Do not change the landmass algorithm in this phase.
3. Do not introduce new visual experiments in this phase.
4. Keep runtime fallback behavior available.
5. Make the system easier to test by isolating logic into narrower modules.

## Non-Goals

This refactor does **not** aim to:

- redesign the material taxonomy
- change OpenAI material assets
- redesign the focus UI
- revisit the abandoned fixed-sun globe-rotation interaction model
- add new rendering features such as atmosphere overhaul, TAA, or new postprocessing

## Scope

### In Scope

- Split frontend `main.js` into smaller modules
- Split bake pipeline internals into clearer stages
- Extract stable configuration values into central config objects/modules
- Reduce duplication between offline bake logic and runtime fallback logic
- Keep current default behavior:
  - default texture mode is `OpenAI 材质`
  - `原始贴图` remains fallback
  - small terrain relief remains enabled

### Out of Scope

- new material generation
- new clustering or landmass logic
- new interaction paradigms
- removal of the existing fallback path

## Target Frontend Structure

Proposed modules under:

- `apps/moreway_planet_explorer_web/src/`

Suggested split:

- `config.js`
  - constants, defaults, thresholds, URLs
- `scene.js`
  - renderer, scene, camera, lights, planet mesh, atmosphere
- `planet-surface.js`
  - surface relief, baked texture application, runtime material fallback
- `dataset-loader.js`
  - latest/manifest loading, chunk loading, Arrow parsing
- `focus-system.js`
  - focus ranking, labels, top highlight, visibility filtering
- `selection-system.js`
  - raycast selection and payload selection state
- `interaction.js`
  - controls tuning, pointer behavior, resize handling
- `main.js`
  - thin bootstrap only

The exact file split can vary, but the result should leave `main.js` as orchestration rather than a large implementation dump.

## Target Bake Structure

Suggested internal split for the bake logic:

- asset loading/resolution
- family/style weighting
- albedo composition
- normal composition
- roughness composition
- output writing

This can remain in one top-level script entry, but the script should call narrower helper functions rather than carry all logic in one flow.

## Phase Plan

### Phase 1: Frontend Structural Split

Goal:

- reduce `main.js` size and responsibility concentration

Deliverables:

- move stable scene bootstrapping into dedicated helpers/modules
- move focus logic out of the bootstrap file
- move baked material loading/runtime fallback helpers out of the bootstrap file
- keep browser behavior unchanged

Success criteria:

- `npm run build` passes
- no observable regression in:
  - point rendering
  - focus labels
  - selection
  - default OpenAI material loading

### Phase 2: Bake Structure Split

Goal:

- make the material bake pipeline easier to reason about and test

Deliverables:

- narrower helper functions
- explicit albedo/normal/roughness stages
- reduced coupling between asset resolution and image composition

Success criteria:

- current baked outputs still generate successfully
- existing bake tests still pass

### Phase 3: Shared Logic Consolidation

Goal:

- reduce drift between offline bake and runtime fallback

Deliverables:

- shared weighting/config helpers
- shared family resolution/config where practical

Success criteria:

- fallback remains visually aligned with baked behavior
- duplicated threshold logic is reduced

## Immediate Working Assumptions

This branch begins with the current validated baseline behavior already present in the working tree:

- default `OpenAI 材质`
- farther initial camera distance
- small terrain relief enabled

These are treated as preserved behavior, not new experimental changes.

## Deliverable Definition

This refactor phase is complete when:

- frontend responsibilities are split into smaller modules
- bake code has clearer stage separation
- configuration is more centralized
- tests/build still pass
- visual output remains materially the same to the user
