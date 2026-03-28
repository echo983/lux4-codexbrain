# Moreway Asset Service

## Goal

`moreway_asset_service` 是新的读侧资产服务。

它已经落地，当前目标是：

- 作为新的 namespace-aware 用户态资产读服务
- 不删除旧的 `moreway_search_service`
- 逐步承接移动端和未来新渲染界面的读需求

当前它承接的能力包括：

- mobile search
- recent cards
- card detail
- namespace-aware planet view

写路径仍然单独保留：

- `visual_asset_card_service` continues to own ingest, OCR/LLM orchestration, embedding, and LanceDB upsert

## Current Status

当前已经提供：

- `POST /api/v1/mobile/search`
- `GET /api/v1/mobile/cards/{id}`
- `GET /api/v1/mobile/cards/recent`
- `GET /api/v1/planet/view`
- `GET /healthz`

当前规则：

- `namespace_id`
- `card_created_at`
- unified mobile detail payloads
- strict namespace enforcement

当前不兼容：

- `GET /`
- `GET /search`
- `GET /asset-card`
- `POST /api/v1/search`

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

## Namespace Rule

这是当前最重要的规则：

- 新服务不兼容无 namespace 的用户态调用
- `namespace_id` / `namespaceId` 缺失时直接拒绝服务
- 这里的 namespace 是用户视图边界，不是强安全边界

错误形式：

- `400` + `missing_namespace_id`

## Current Planet Role

`planet view` 已经不是 stub。

当前：

- `GET /api/v1/planet/view?namespace_id=...&limit=...`
- 会实时从 LanceDB 取 namespace 内资产卡
- 生成轻量点位坐标和边界盒
- 返回给未来的新 Web/Android 渲染界面

同时要注意：

- 现有 `Moreway Planet Explorer` Web 仍然吃旧的静态 dataset
- 新渲染界面应优先考虑接这个 `planet view` 接口

## Design Principles

1. `namespace_id` is a user-view boundary, not a security boundary.
2. All user-facing asset-card read APIs should be namespace-aware.
3. Raw documents are not required to carry namespace semantics.
4. Planet view should live in the read-side asset service, not the write service.
5. Web and Android 的未来新渲染界面应最终共用这一读服务。

## Current Deliverables

当前已经落下来的交付包括：

- runnable `moreway_asset_service`
- mobile search / recent / detail 并行可用
- 统一 card detail payload
- real namespace-aware `planet view`
- focused tests for the new service
