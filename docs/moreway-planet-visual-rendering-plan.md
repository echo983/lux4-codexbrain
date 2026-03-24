# Moreway Planet Visual Rendering Plan

## View

The current planet is no longer blocked by data. The document-driven world model is already in place:

- LanceDB provides the document corpus
- UMAP provides a 3D semantic distribution
- the offline builder produces a `surface_map`
- Arrow chunks and octree indexing already support scalable loading

What is still weak is presentation, not truth.

The correct direction is:

- keep our own data truth
- reuse as much rendering craft as possible from `refs/threejs-procedural-planets`

In other words:

- knowledge distribution determines the terrain
- a mature rendering pipeline determines the visual quality

We should not replace our data-driven planet with a random procedural planet.
We should instead replace the current rough rendering shell with a refined shader-based rendering stack.

## Principles

1. Data truth stays local to this repository
- Keep LanceDB, UMAP, Arrow chunks, octree, and `surface_map` as the source of truth.

2. Rendering quality should be borrowed, not reinvented
- Reuse proven shader structure, lighting logic, atmosphere, bloom, and skybox techniques from `threejs-procedural-planets`.

3. Procedural noise is allowed only as visual micro-detail
- Noise must not replace document-derived land/ocean structure.
- It may be used later for coastline perturbation, bump detail, or subtle terrain roughness.

4. Presentation comes before interaction polish
- For this phase, the priority is to make the planet itself feel like a finished object.
- Viewer-centric interaction refinements can come afterwards.

## Plan

### Phase 1: Rendering architecture cleanup

Split the current front-end planet rendering into clearer layers:

- dataset loader
- planet material
- atmosphere
- postprocessing
- scene composition

Goal:
- remove the current "all logic in one file" feeling
- make it easy to swap the rough surface renderer for a refined shader renderer

### Phase 2: Replace the current surface renderer

Keep our `surface_map`, but feed it into a more mature shader-driven planet surface model.

Borrow from `threejs-procedural-planets`:

- multi-layer terrain coloring
- narrow transition bands
- stronger coastline treatment
- directional light + ambient + specular balance
- bump or pseudo-bump normal treatment where appropriate

Adaptation rule:
- where the reference project uses procedural terrain height, use our own height texture instead

Goal:
- keep semantic landmass placement from our data
- gain refined color transitions and lighting from the reference renderer

### Phase 3: Atmosphere

Integrate the reference atmosphere approach:

- particle atmosphere shell
- shader-based visibility
- radius/thickness adapted to our current planet scale

Goal:
- give the planet an actual atmospheric presence
- reduce the current bare-sphere look

### Phase 4: Postprocessing and environment

Integrate:

- `EffectComposer`
- `RenderPass`
- `UnrealBloomPass`
- `OutputPass`
- skybox environment

Goal:
- lift the whole scene from "debug viewport" to "finished planet"

### Phase 5: Optional micro-detail

Only after the above is stable, add subtle procedural detail:

- slight coastline perturbation
- local bump detail
- mountain roughness
- shallow water variation

Constraint:
- these details must decorate document-derived geography, not overwrite it

## Priority Order

1. Refine the planet surface shader
2. Add atmosphere
3. Add bloom and skybox
4. Add micro-detail noise
5. Return later to interaction polish

## Expected Outcome

After this work, the planet should feel like:

- a refined knowledge world
- shaped by document distribution
- rendered with a mature visual pipeline

The target is not "a 3D sphere with data on it".
The target is "a finished planet whose geography clearly emerges from the knowledge field".
