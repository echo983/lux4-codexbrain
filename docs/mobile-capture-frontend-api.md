# Mobile Capture Frontend API Spec

本文档面向前端 / Android 开发，定义 `mobile_capture_asset_card_v1` 的前端功能要求与 HTTP 对接规范。

适用对象：

- Android APK
- 其他调用 `visual_asset_card_service` 的前端或上游 Worker

当前 v1 目标：

- 让前端把“同一现实对象”的 1 到 N 张图片作为一次请求提交
- 由后端生成一张对象级资产卡
- 后端将图片写入 NBSS，将资产卡写入 LanceDB
- 写入成功后直接返回统一 `card` detail payload，前端可直接展示

## Scope

v1 仅支持：

- 创建并提交一次对象级采集请求
- 获取同步写入结果

v1 不支持：

- 单独创建 `capture_group` 资源
- 单独上传图片后再二次绑定
- 轮询任务状态
- 查询单张已写入卡片详情
- 前端直接访问 LanceDB 或 NBSS 写接口

## Core Rule

前端必须遵守一条核心规则：

**一次请求只对应一个现实对象。**

例如：

- 一张菜单的 4 张连续照片：可以同请求提交
- 一张公告的上下两半：可以同请求提交
- 两张完全不同对象的图片：不能放在同一请求

## Frontend Requirements

前端至少需要实现以下功能。

### 1. 对象级分组

用户必须能明确选择：

- 这些图片属于同一个对象

系统不自动聚类。

### 2. 图片顺序调整

前端必须允许用户调整顺序。

原因：

- 后端会按顺序把多图交给模型
- 顺序错误会直接影响正文质量

### 3. 可选对象提示

前端应允许用户选填 `objectHint`。

推荐候选值：

- 菜单
- 名片
- 海报
- 公告
- 药盒
- 单据
- 其他

### 4. 可选补充备注

前端应允许用户选填 `groupNote`。

典型用途：

- “正面两张，反面一张”
- “只拍到了右下角”
- “文字很小，已经尽量拍清楚”

### 5. 上传前图片处理

前端应在本地先做轻量处理再上传：

- 裁切到目标对象
- 去掉无关背景
- 保留用户指定顺序
- 压缩到适合上传的体积

推荐：

- 长边控制在 `1280` 到 `1600 px`
- 使用 `jpeg`
- 保证文字仍可读

不建议：

- 上传原始大图
- 上传未裁切的整张相册照片

### 6. 结果反馈

前端应向用户展示：

- 上传中
- 成功
- 失败

成功后至少保存：

- `cardId`
- `namespaceId`
- `captureGroupId`
- `groupImageFids`

## Endpoint

### `POST /api/v1/visual-cards`

提交一次对象级视觉采集请求。

#### Request Headers

```http
Content-Type: application/json
```

#### Request Body

```json
{
  "objectHint": "菜单",
  "groupNote": "正面两张，反面一张",
  "sourceClient": "android-apk",
  "namespaceId": "ns_user_a13f09cd",
  "images": [
    {
      "contentBase64": "<base64>",
      "mimeType": "image/jpeg",
      "order": 1,
      "role": "front_1"
    },
    {
      "contentBase64": "<base64>",
      "mimeType": "image/jpeg",
      "order": 2,
      "role": "front_2"
    }
  ]
}
```

#### Field Rules

##### `objectHint`

- type: `string`
- optional
- 推荐传

说明：

- 这是用户给出的对象提示，不是真实标签保证
- 后端会把它作为生成提示的一部分

##### `groupNote`

- type: `string`
- optional

说明：

- 用户补充上下文
- 不应写成很长的自由文本

##### `sourceClient`

- type: `string`
- optional but recommended

建议值：

- `android-apk`

##### `namespaceId`

- type: `string`
- optional but recommended

说明：

- 这是资产卡的逻辑 namespace
- 后续 search / recent / detail / planet view 都会依赖它做用户视图过滤

##### `images`

- type: `array`
- required
- must be non-empty

每个元素字段：

- `contentBase64`
  - type: `string`
  - required
  - 图片字节的 base64 编码
- `mimeType`
  - type: `string`
  - required
  - 当前推荐 `image/jpeg`
- `order`
  - type: `integer`
  - required
  - 从 `1` 开始
- `role`
  - type: `string`
  - optional

#### Request Semantics

后端收到请求后会做这些事：

1. 校验请求体
2. 将图片写入 NBSS
3. 生成服务端 `captureGroupId`
4. 调用视觉模型生成对象级资产卡
5. embedding
6. 将卡片全文 + metadata + vector 写入 LanceDB

## Success Response

HTTP status:

```http
202 Accepted
```

Response body:

```json
{
  "ok": true,
  "cardId": "mobile_capture_a32d1a0235224dcf",
  "cardSchema": "mobile_capture_asset_card_v1",
  "status": "written",
  "namespaceId": "ns_user_a13f09cd",
  "captureGroupId": "cg_ecdc7ea1d53ce0c2",
  "groupImageFids": [
    "NBSS:0xB14623759A454DBD"
  ],
  "rowsWritten": 1,
  "table": "mobile_capture_asset_cards",
  "cardCreatedAt": "2026-03-28T18:01:25Z",
  "card": {
    "id": "mobile_capture_a32d1a0235224dcf",
    "docKind": "asset_card",
    "cardSchema": "mobile_capture_asset_card_v1",
    "sourceType": "mobile_photo_group",
    "sourceTable": "mobile_capture_asset_cards",
    "namespaceId": "ns_user_a13f09cd",
    "title": "某餐厅菜单照片",
    "summary": "菜单内容摘要",
    "createdAt": "",
    "cardCreatedAt": "2026-03-28T18:01:25Z",
    "tags": [],
    "imageRefs": ["NBSS:0xB14623759A454DBD"],
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
}
```

#### Response Field Meaning

- `cardId`
  - 新生成资产卡的唯一 ID
- `cardSchema`
  - 当前固定为 `mobile_capture_asset_card_v1`
- `status`
  - 当前固定为 `written`
- `namespaceId`
  - 本次写入资产卡的 namespace
- `captureGroupId`
  - 服务端为本次请求生成的组标识
- `groupImageFids`
  - 写入 NBSS 后返回的图片 FID 列表
- `cardCreatedAt`
  - 后端生成的稳定卡片创建时间
- `card`
  - 与移动详情接口统一的详情 payload
  - 写入成功后前端可直接消费，不必立刻二次请求详情
- `rowsWritten`
  - LanceDB 写入条数
- `table`
  - 写入的 LanceDB 表

## Error Responses

### Invalid JSON

```http
400 Bad Request
```

```json
{
  "ok": false,
  "error": "invalid_json"
}
```

### Invalid Request

```http
400 Bad Request
```

```json
{
  "ok": false,
  "error": "invalid_request",
  "detail": "images must be a non-empty array"
}
```

常见 `detail`：

- `payload must be a JSON object`
- `images must be a non-empty array`
- `each image must be an object`
- `contentBase64 is required`
- `contentBase64 is not valid base64`
- `contentBase64 decoded to empty bytes`
- `image order must be an integer`

### Ingest Failed

```http
500 Internal Server Error
```

```json
{
  "ok": false,
  "error": "ingest_failed",
  "detail": "..."
}
```

可能原因：

- NBSS 写入失败
- OpenAI 视觉请求失败
- embedding 失败
- LanceDB upsert 失败

## Health Check

### `GET /healthz`

成功响应：

```json
{
  "ok": true,
  "service": "visual-asset-card-service"
}
```

## Frontend Implementation Checklist

前端交付前至少确认：

- 能从相机或相册选择多张图片
- 能保证“同一对象一次提交”
- 能调整图片顺序
- 能填写 `objectHint`
- 能填写 `groupNote`
- 能把图片压缩后转成 base64
- 能调用 `POST /api/v1/visual-cards`
- 能处理 `202 / 400 / 500`
- 能显示成功后的 `cardId`
- 能保存 `groupImageFids`

## UX Recommendations

推荐交互流程：

1. 用户创建一次对象采集
2. 加入 1 到 N 张图片
3. 调整顺序
4. 选填对象类型
5. 选填备注
6. 点击提交
7. 显示处理中
8. 显示成功或失败

推荐前端文案：

- 上传前：
  - “请只选择同一个对象的图片”
- 顺序提示：
  - “图片顺序会影响识别结果”
- 失败提示：
  - “识别失败，请稍后重试”
- 成功提示：
  - “对象卡已生成”

## Non-Goals For Frontend

前端当前不负责：

- 自动判断图片是否属于同一对象
- 本地生成资产卡正文
- 本地 embedding
- 直接写 LanceDB
- 直接写 NBSS
- 解释模型输出是否真实

## Versioning

当前固定：

- `cardSchema = mobile_capture_asset_card_v1`

如果后端后续升级 schema：

- 会通过 `cardSchema` 返回值体现
- 前端不应假设未来永远只有一个 schema
