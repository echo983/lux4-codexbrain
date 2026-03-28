# Mobile Card Frontend Integration

这份文档给前端说明一个关键变化：

- 手机视觉资产卡写入接口
- 手机搜索详情接口

现在已经统一使用同一套 card detail payload。

## 结论

前端现在可以依赖同一套详情结构处理两种场景：

1. 刚写入完成，直接展示返回结果
2. 从搜索结果进入详情页，再请求详情接口

统一后的 card payload 顶层字段：

```json
{
  "id": "mobile_capture_xxx",
  "docKind": "asset_card",
  "cardSchema": "mobile_capture_asset_card_v1",
  "sourceType": "mobile_photo_group",
  "sourceTable": "mobile_capture_asset_cards",
  "namespaceId": "ns_user_a13f09cd",
  "title": "某公司联系人名片",
  "summary": "卡片摘要",
  "createdAt": "",
  "cardCreatedAt": "2026-03-28T18:01:25Z",
  "tags": [],
  "imageRefs": ["NBSS:0x..."],
  "mdUrl": "",
  "markdown": "...",
  "detail": {
    "schemaVersion": "mobile_capture_asset_card_v1",
    "highlights": {
      "coreView": "",
      "intent": "",
      "cognitiveAsset": ""
    },
    "meta": {
      "contentCompleteness": "partial",
      "observationConfidence": "medium",
      "categoryPath": "",
      "priority": ""
    },
    "blocks": [
      {
        "type": "section",
        "title": "这是什么",
        "markdown": "..."
      }
    ]
  }
}
```

## 接口一：写入接口

`POST /api/v1/visual-cards`

成功响应现在分两层：

1. 写入结果字段
2. 可直接渲染的 `card`

示例：

```json
{
  "ok": true,
  "cardId": "mobile_capture_xxx",
  "cardSchema": "mobile_capture_asset_card_v1",
  "status": "written",
  "captureGroupId": "cg_xxx",
  "groupImageFids": ["NBSS:0xA", "NBSS:0xB"],
  "rowsWritten": 1,
  "table": "mobile_capture_asset_cards",
  "card": {
    "id": "mobile_capture_xxx",
    "docKind": "asset_card",
    "cardSchema": "mobile_capture_asset_card_v1",
    "sourceType": "mobile_photo_group",
    "sourceTable": "mobile_capture_asset_cards",
    "namespaceId": "ns_user_a13f09cd",
    "title": "某公司联系人名片",
    "summary": "名片",
    "createdAt": "",
    "cardCreatedAt": "2026-03-28T18:01:25Z",
    "tags": [],
    "imageRefs": ["NBSS:0xA", "NBSS:0xB"],
    "mdUrl": "",
    "markdown": "...",
    "detail": {
      "schemaVersion": "mobile_capture_asset_card_v1",
      "highlights": {
        "coreView": "",
        "intent": "",
        "cognitiveAsset": ""
      },
      "meta": {
        "contentCompleteness": "partial",
        "observationConfidence": "medium",
        "categoryPath": "",
        "priority": ""
      },
      "blocks": [
        {
          "type": "section",
          "title": "这是什么",
          "markdown": "名片"
        }
      ]
    }
  }
}
```

前端建议：

- 写入成功后，如果要立刻进入详情页，直接使用 `card`
- 不必立刻再调一次详情接口

## 接口二：搜索详情接口

`GET /api/v1/mobile/cards/{id}?source_table=...&namespace_id=...`

这个接口返回的就是同一套 card payload，只是外层带一个：

```json
{
  "ok": true,
  "...": "same card fields"
}
```

所以前端可以这样实现：

- 写入完成页：使用 `response.card`
- 搜索详情页：使用详情接口返回体本身

两边最终渲染逻辑可以复用同一个 `CardDetailViewModel`。

## 推荐前端映射

列表页优先使用：

- `title`
- `summary`
- `imageRefs[0]`
- `cardCreatedAt`
- `detail.meta.contentCompleteness`

详情页优先使用：

- `title`
- `summary`
- `imageRefs`
- `detail.blocks`

如果需要原样展示全文：

- 使用 `markdown`

如果只需要结构化展示：

- 使用 `detail.blocks`

## 字段语义

### `imageRefs`

- NBSS 图片 FID 列表
- 可直接走现有 NBSS 取图链路

### `detail.blocks`

- 后端解析出的块结构
- 当前 block 类型主要是 `section`
- 应优先按 `title + markdown` 渲染

### `detail.highlights`

- 通用高价值字段
- 某些 schema 里可能为空字符串
- 为空时前端不要显示占位 UI

### `detail.meta.contentCompleteness`

建议作为显式状态展示：

- `complete`
- `partial`
- 空字符串

### `detail.meta.observationConfidence`

建议作为辅助信号展示：

- `high`
- `medium`
- `low`
- 空字符串

## 前端实现建议

- 不要把写入接口和详情接口当成两套不同模型
- 定义一套统一类型，例如 `MobileCardDetail`
- 写入后直接消费 `response.card`
- 搜索详情直接消费详情接口响应
- 对未知 schema，仍按 `detail.blocks` 通用渲染

## 当前边界

现在统一的是 detail payload，不是所有业务字段。

也就是说：

- 不同 schema 仍然可能有不同内容
- 但前端至少可以依赖统一外壳和统一 `detail.blocks`

这就是当前版本的稳定契约。
