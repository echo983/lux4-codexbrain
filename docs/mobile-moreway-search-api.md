# Mobile Moreway Search API

这份文档定义手机端接入 `moreway_asset_service` 时应使用的正式搜索接口。

目标很明确：

- 给 Android / 其他移动端一个稳定 JSON 契约
- 不直接暴露 Web 搜索页的偶然字段
- 允许后端继续接入不同类型的资产卡 schema
- 所有用户态读请求都明确带 `namespaceId`

当前主接口：

- `POST /api/v1/mobile/search`

同时提供详情接口：

- `GET /api/v1/mobile/cards/{id}?source_table=...&namespace_id=...`

健康检查继续复用：

- `GET /healthz`

## 设计原则

- 搜索结果面向“移动端卡片列表”，不是 Web 页面渲染模型
- 同一种结果结构应同时兼容：
  - `deep_asset_card_v1`
  - `mobile_capture_asset_card_v1`
  - 其他后续资产卡
- 新服务不兼容旧的无 namespace 调用
- 前端需要的图片入口直接通过 `imageRefs` 返回

## Endpoint

### `POST /api/v1/mobile/search`

用途：

- 给手机端执行统一搜索
- 返回移动端专用的归一化结果列表

请求头：

```http
Content-Type: application/json
```

请求体：

```json
{
  "namespaceId": "ns_user_a13f09cd",
  "query": "Laboratorio Echevarne Barcelona 检验 报告",
  "tags": ["medical"],
  "page": 1,
  "limit": 20,
  "min_score": 0.1
}
```

字段说明：

- `namespaceId`: 必填，当前用户视图 namespace
- `query`: 必填，搜索词
- `tags`: 可选，标签过滤
- `page`: 可选，页码，从 `1` 开始
- `limit`: 可选，单页结果数
- `min_score`: 可选，rerank 最低分阈值

成功响应：

```json
{
  "ok": true,
  "namespaceId": "ns_user_a13f09cd",
  "query": "Laboratorio Echevarne Barcelona 检验 报告",
  "page": 1,
  "pageSize": 20,
  "totalPages": 1,
  "totalResults": 1,
  "appliedTags": ["medical"],
  "results": [
    {
      "id": "mobile_capture_1e393de41d014127",
      "docKind": "asset_card",
      "cardSchema": "mobile_capture_asset_card_v1",
      "sourceType": "mobile_photo_group",
      "sourceTable": "mobile_capture_asset_cards",
      "namespaceId": "ns_user_a13f09cd",
      "title": "Laboratorio Echevarne 检验报告领取说明单",
      "summary": "西班牙巴塞罗那实验室的检验结果领取与线上查询说明。",
      "subtitle": "mobile_photo_group",
      "createdAt": "2026-03-26",
      "cardCreatedAt": "2026-03-28T18:01:25Z",
      "tags": [],
      "score": 0.93,
      "imageRefs": [
        "NBSS:0x6A15E856AF448635",
        "NBSS:0x39A7EEAF58498600"
      ],
      "contentCompleteness": "partial",
      "observationConfidence": "medium",
      "mdUrl": ""
    }
  ]
}
```

结果字段说明：

- `id`: 卡片主键
- `docKind`: 文档类型，例如 `asset_card` / `raw_text`
- `cardSchema`: 资产卡 schema；非资产卡可能为空
- `sourceType`: 来源类型
- `sourceTable`: LanceDB 表名
- `namespaceId`: 当前命中的资产卡 namespace
- `title`: 结果标题
- `summary`: 移动端列表主摘要
- `subtitle`: 次级说明，可能来自卡片字段、分类路径或 source type
- `createdAt`: 创建时间
- `cardCreatedAt`: 资产卡稳定创建时间，recent/feed 更应优先用它
- `tags`: 标签列表
- `score`: rerank 分数
- `imageRefs`: 关联图片的 NBSS FID 列表；没有则为空数组
- `contentCompleteness`: 内容完整度，例如 `complete` / `partial`
- `observationConfidence`: 观察置信度，例如 `high` / `medium` / `low`
- `mdUrl`: 原始 Markdown 链接；没有则为空字符串

错误响应：

```json
{
  "ok": false,
  "error": "missing_query"
}
```

当前错误码语义：

- `400` + `invalid_json`
- `400` + `missing_namespace_id`
- `400` + `missing_query`
- `404` + `not_found`

### `GET /api/v1/mobile/cards/{id}`

用途：

- 给手机端拉取单张卡片的详情数据
- 返回统一外壳和 schema 专属 `detail` payload

查询参数：

- `source_table`: 可选，但推荐传；移动端可直接复用搜索结果里的 `sourceTable`
- `namespace_id`: 必填；必须与当前用户视图 namespace 一致

请求示例：

```http
GET /api/v1/mobile/cards/mobile_capture_1e393de41d014127?source_table=mobile_capture_asset_cards&namespace_id=ns_user_a13f09cd
```

成功响应：

```json
{
  "ok": true,
  "id": "mobile_capture_1e393de41d014127",
  "docKind": "asset_card",
  "cardSchema": "mobile_capture_asset_card_v1",
  "sourceType": "mobile_photo_group",
  "sourceTable": "mobile_capture_asset_cards",
  "namespaceId": "ns_user_a13f09cd",
  "title": "Laboratorio Echevarne 检验报告领取说明单",
  "summary": "西班牙巴塞罗那实验室的检验结果领取说明。",
  "createdAt": "",
  "cardCreatedAt": "2026-03-28T18:01:25Z",
  "tags": [],
  "imageRefs": [
    "NBSS:0x6A15E856AF448635",
    "NBSS:0x39A7EEAF58498600"
  ],
  "mdUrl": "",
  "markdown": "---\\n...完整卡片 markdown ...",
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

说明：

- `markdown` 返回完整卡片正文，前端如需原样展示可以直接使用
- `detail.blocks` 返回后端预解析好的块结构，便于按 schema 渲染
- `detail.highlights` 是通用高价值字段；没有则为空字符串

错误响应：

```json
{
  "ok": false,
  "error": "card_not_found"
}
```

当前常见错误码：

- `400` + `missing_namespace_id`
- `404` + `card_not_found`

## 前端使用建议

- 所有用户态请求都带上当前 `namespaceId`
- 搜索列表页优先使用：
  - `title`
  - `summary`
  - `subtitle`
  - `imageRefs[0]`
- 如果 `imageRefs` 非空，可以通过现有 NBSS 取图链路显示缩略图
- 结果排序以后端 `score` 为准
- 不要依赖 Web 搜索接口 `/api/v1/search` 的字段 shape

## 非目标

当前 v1 不包含：

- 服务端高亮片段
- 服务端聚合 facets
- schema 专属最终 UI 协议

说明：

- 详情接口已经提供
- `detail.blocks` 是当前稳定的通用块结构
- 新服务是 `moreway_asset_service`
- 旧的 `moreway_search_service` 仍保留，但不应再作为新的移动端主接入点
