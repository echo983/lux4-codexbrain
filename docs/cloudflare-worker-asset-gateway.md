# Cloudflare Worker Asset Gateway

这份文档定义手机 App 面向 Cloudflare Worker 的统一资产 API 门面。

目标：

- 手机 App 只对接一个域名和一套认证
- Worker 对外暴露统一的资产接口
- Worker 在内部转发到两个现有后端服务
  - `visual_asset_card_service`
  - `moreway_asset_service`

当前建议：

- 内部后端不合并
- Cloudflare Worker 作为统一网关
- `namespaceId` 由 Worker 统一注入或校验，不依赖客户端随意指定

## 服务分工

### 1. 写服务

- 内部服务：`visual_asset_card_service`
- 作用：
  - 接收图片字节
  - 写入 NBSS
  - 调 OpenAI 生成资产卡
  - embedding
  - 写入 LanceDB

当前内部接口：

- `POST /api/v1/visual-cards`
- `GET /healthz`

### 2. 读服务

- 内部服务：`moreway_asset_service`
- 作用：
  - 移动搜索
  - recent cards
  - card detail
  - namespace-aware planet view

当前内部接口：

- `POST /api/v1/mobile/search`
- `GET /api/v1/mobile/cards/recent`
- `GET /api/v1/mobile/cards/{id}`
- `GET /api/v1/planet/view`
- `GET /healthz`

关键规则：

- 用户态读请求必须带 `namespaceId` / `namespace_id`
- 缺失时内部服务会直接返回 `400 missing_namespace_id`

## 推荐的 Worker 对外路由

建议 Worker 统一暴露：

- `POST /api/v1/assets/ingest`
- `POST /api/v1/assets/search`
- `GET /api/v1/assets/recent`
- `GET /api/v1/assets/cards/{id}`
- `GET /api/v1/assets/planet/view`
- `GET /api/v1/assets/healthz`

## 路由映射

### 写入

#### 对外

`POST /api/v1/assets/ingest`

#### 对内

`POST /api/v1/visual-cards`

#### Worker 责任

- 校验用户认证
- 推导当前 `namespaceId`
- 将 `namespaceId` 注入 JSON body
- 将 `capturedAt` 透传到下游
- 如有位置数据，将组级 `captureLocation` 透传到下游
- 转发到写服务

### 搜索

#### 对外

`POST /api/v1/assets/search`

#### 对内

`POST /api/v1/mobile/search`

#### Worker 责任

- 校验用户认证
- 推导当前 `namespaceId`
- 覆盖或注入 `namespaceId`
- 转发到读服务

### Recent

#### 对外

`GET /api/v1/assets/recent`

#### 对内

`GET /api/v1/mobile/cards/recent`

#### Worker 责任

- 校验用户认证
- 推导当前 `namespaceId`
- 在 query string 中注入 `namespace_id`
- 透传 `cursor`、`limit`

### Detail

#### 对外

`GET /api/v1/assets/cards/{id}`

#### 对内

`GET /api/v1/mobile/cards/{id}`

#### Worker 责任

- 校验用户认证
- 推导当前 `namespaceId`
- 强制附带 `namespace_id`
- 透传 `source_table`

### Planet View

#### 对外

`GET /api/v1/assets/planet/view`

#### 对内

`GET /api/v1/planet/view`

#### Worker 责任

- 校验用户认证
- 推导当前 `namespaceId`
- 强制附带 `namespace_id`
- 透传 `limit`
- 透传可选 `source_table`

## 推荐的 Worker 认证与 namespace 策略

### 原则

- 不信任客户端任意传入的 `namespaceId`
- 默认由 Worker 从用户身份推导 `namespaceId`
- 只有内部调试模式才允许显式覆写

### 推荐做法

1. App 带登录态或 access token 到 Worker
2. Worker 解析出稳定用户 ID
3. Worker 推导 `namespaceId`
4. Worker 把该 `namespaceId` 注入下游请求

推荐命名规则：

- `ns_user_<8hex>`

例如：

- `ns_user_a13f09cd`

## 对外 API 建议

### 1. `POST /api/v1/assets/ingest`

请求体建议基本沿用当前写服务：

```json
{
  "capturedAt": "2026-03-30T10:34:56Z",
  "captureLocation": {
    "latitude": 40.4168,
    "longitude": -3.7038
  },
  "objectHint": "名片",
  "groupNote": "正面一张",
  "sourceClient": "android-apk",
  "images": [
    {
      "contentBase64": "<base64>",
      "mimeType": "image/jpeg",
      "order": 1,
      "role": "front_1"
    }
  ]
}
```

说明：

- `capturedAt` 是必填
- `captureLocation` 是可选的组级位置
- 客户端不必显式传 `namespaceId`
- Worker 统一注入

### 2. `POST /api/v1/assets/search`

请求体：

```json
{
  "query": "Laboratorio",
  "tags": [],
  "page": 1,
  "limit": 20,
  "minScore": 0.1
}
```

说明：

- 客户端不必传 `namespaceId`
- Worker 统一注入并转成后端要求的 `namespaceId`
- 为了对外统一风格，Worker 可把 `minScore` 映射为内部的 `min_score`

### 3. `GET /api/v1/assets/recent`

Query：

- `cursor`
- `limit`

说明：

- `namespace_id` 由 Worker 自动补

### 4. `GET /api/v1/assets/cards/{id}`

Query：

- `source_table`

说明：

- `namespace_id` 由 Worker 自动补

### 5. `GET /api/v1/assets/planet/view`

Query：

- `limit`
- `source_table`

说明：

- `namespace_id` 由 Worker 自动补

## 错误格式建议

建议 Worker 对外统一成一套错误风格，不把内部服务的细节直接暴露给客户端。

推荐格式：

```json
{
  "ok": false,
  "error": "invalid_request",
  "detail": "missing image data"
}
```

推荐对外错误码：

- `400 invalid_request`
- `401 unauthorized`
- `403 forbidden`
- `404 not_found`
- `429 rate_limited`
- `502 upstream_error`

说明：

- Worker 可以记录内部原始错误
- 但对 App 返回时应收敛成统一风格

## 健康检查建议

### 对外

`GET /api/v1/assets/healthz`

### Worker 可做的事

- 检查自身运行
- 并行探测：
  - `visual_asset_card_service /healthz`
  - `moreway_asset_service /healthz`

返回示例：

```json
{
  "ok": true,
  "service": "asset-gateway",
  "upstreams": {
    "visualAssetCardService": "ok",
    "morewayAssetService": "ok"
  }
}
```

## 一句话建议

现在最稳的方案就是：

- 内部后端继续分成写服务和读服务
- Cloudflare Worker 对外提供统一资产 API
- `namespaceId` 由 Worker 统一注入和管控
