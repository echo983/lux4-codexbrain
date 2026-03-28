# Mobile Recent Cards API

## Goal

提供一个给 Android “Recent Cards” 页面使用的独立接口。

该页面用于：

- 展示当前 `namespaceId` 下最近生成的资产卡
- 按时间倒序加载
- 支持无限滚动
- 点击后跳转现有详情页

## Endpoint

`GET /api/v1/mobile/cards/recent`

当前建议接入：

- `moreway_asset_service`

## Query Parameters

- `namespace_id`: 必填
- `cursor`: 可选
- `limit`: 可选，默认 `20`，最大 `50`
- `doc_kind`: 可选，当前仅支持 `asset_card`
- `source_table`: 可选，保留参数

## Current Backend Rules

当前版本已经定死：

- 只返回 `asset_card`
- `namespace_id` 必填
- 只依赖 `card_created_at`
- 排序：
  - `card_created_at DESC`
  - `id DESC`
  - `source_table DESC` 作为稳定 tie-break

说明：

- 没有 `card_created_at` 的旧卡不会进入 recent feed
- 这意味着 recent 页面天然更适合展示新写入的手机视觉资产卡
- 这是 namespace-aware 用户视图接口，不兼容旧的无 namespace 调用

## Response Shape

返回结构尽量贴近当前移动搜索结果 item shape：

```json
{
  "ok": true,
  "namespaceId": "ns_user_ab12cd34",
  "items": [
    {
      "id": "mobile_capture_xxx",
      "docKind": "asset_card",
      "cardSchema": "mobile_capture_asset_card_v1",
      "sourceType": "mobile_photo_group",
      "sourceTable": "mobile_capture_asset_cards",
      "namespaceId": "ns_user_ab12cd34",
      "title": "Example title",
      "summary": "Example summary",
      "subtitle": "mobile_photo_group",
      "createdAt": "2026-03-28T18:01:25Z",
      "cardCreatedAt": "2026-03-28T18:01:25Z",
      "tags": [],
      "score": null,
      "imageRefs": ["NBSS:0x1234"],
      "contentCompleteness": "partial",
      "observationConfidence": "medium",
      "mdUrl": ""
    }
  ],
  "nextCursor": "",
  "hasMore": false
}
```

## Cursor

前端不要解析 cursor。

它是后端生成的 opaque token。

前端只需要：

- 首次请求不传
- 下次请求带上 `nextCursor`

## Detail Navigation

列表项已经包含跳详情需要的字段：

- `id`
- `sourceTable`
- `namespaceId`

详情仍然使用现有接口：

`GET /api/v1/mobile/cards/{id}?source_table=...&namespace_id=...`

## Error Handling

当前建议按下面处理：

- `400 missing_namespace_id`
- `400 invalid_cursor`
- `400 invalid_limit`
- `400 unsupported_doc_kind`
- `200 OK` + 空 `items`

## Frontend Notes

- 列表页可以直接复用现有移动搜索结果卡片 UI
- recent item 的 `score` 当前为 `null`，前端不要依赖它
- 推荐把 `namespaceId` 作为当前页面上下文持有，不要在各个页面临时拼接不同值
- 推荐展示：
  - `title`
  - `summary`
  - `imageRefs[0]`
  - `createdAt`
  - `contentCompleteness`

## Current Known Limitation

当前 `summary` 仍复用了通用摘要逻辑。

对 `mobile_capture_asset_card_v1` 来说，它有时会偏长。

这不影响接口可用性，但后面可能会再单独优化 recent/search 的 summary 截断策略。
