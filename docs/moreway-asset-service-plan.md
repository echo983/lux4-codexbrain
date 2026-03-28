# Moreway Asset Service Plan

## Goal

Introduce a new read-side service, `moreway_asset_service`, without deleting or breaking the existing `moreway_search_service`.

This new service will gradually become the unified asset data service for:

- mobile search
- recent cards
- card detail
- future namespace-aware planet views

The write path remains separate:

- `visual_asset_card_service` continues to own ingest, OCR/LLM orchestration, embedding, and LanceDB upsert

## Current Constraints

### 1. Source-of-truth asset data already supports namespace-aware read APIs

Existing `moreway_search_service` already supports:

- `POST /api/v1/mobile/search`
- `GET /api/v1/mobile/cards/{id}`
- `GET /api/v1/mobile/cards/recent`

with:

- `namespace_id`
- `card_created_at`
- unified mobile detail payloads

### 2. Moreway Planet is still backed by a static dataset build

Current planet dataset build only includes:

- `google_keep_asset_cards_directmd_eval200`

Current build does **not** write these payload fields:

- `namespace_id`
- `card_created_at`

As a result, namespace-aware planet rendering cannot work correctly from the current dataset alone.

### 3. Verified mismatch

For `namespace_id = ns_user_d9f487fc`:

- source read API has 2 asset cards
- current planet dataset has 0 matching points

So the problem is architectural, not just frontend filtering.

## Service Boundary

`moreway_asset_service` is a read service only.

It owns:

- asset-card search views
- recent-card feeds
- card detail views
- future planet views

It does not own:

- card creation
- image processing
- embedding generation
- LanceDB writes

## Migration Strategy

### Phase 1. Parallel service skeleton

Create `src/moreway_asset_service/` with:

- `__main__.py`
- `app.py`
- `config.py`
- `http.py`

Re-expose the existing read APIs in parallel:

- `POST /api/v1/mobile/search`
- `GET /api/v1/mobile/cards/{id}`
- `GET /api/v1/mobile/cards/recent`

Implementation may reuse current query logic from `moreway_search_service.search`.

### Phase 2. Shared read primitives

Extract and reuse shared logic for:

- namespace filtering
- search/recent/detail item shaping
- card detail payload serialization
- asset row loading from LanceDB

The immediate goal is logical consolidation, not a risky full rewrite.

### Phase 3. Planet view API

Add a namespace-aware read API for planet consumers.

Initial contract direction:

- `GET /api/v1/planet/view?namespace_id=...`

The first version can be a contract stub plus normalized response builder.

The deeper question of static dataset vs dynamic asset-backed planet view stays explicitly open.

## Initial Design Principles

1. `namespace_id` is a user-view boundary, not a security boundary.
2. All user-facing asset-card read APIs should be namespace-aware.
3. Raw documents are not required to carry namespace semantics.
4. Planet should evolve from static global dataset assumptions toward namespace-aware read views.
5. Web and Android should ultimately consume the same read-side asset service.

## First Deliverable

The first deliverable for this branch is:

- a runnable `moreway_asset_service`
- existing mobile read APIs available in parallel
- a documented planet-view direction
- focused tests proving the new service reuses current behavior correctly
