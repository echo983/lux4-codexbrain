# Asset Gateway Backend Contract

这份文档定义 Cloudflare Worker 网关接入现有后端服务时，需要依赖的最小协议约束。

目标：

- 不改内部服务边界
- 只约束 Worker 必须知道和必须遵守的后端事实
- 保证移动端可以稳定使用统一网关

## 一、当前内部后端

### 1. `visual_asset_card_service`

角色：

- 写服务

职责：

- 接收图片字节
- 写 NBSS
- 生成 `mobile_capture_asset_card_v1`
- embedding
- upsert LanceDB

当前接口：

- `GET /healthz`
- `POST /api/v1/visual-cards`

当前成功状态码：

- `202 Accepted`

### 2. `moreway_asset_service`

角色：

- 读服务

职责：

- 搜索
- recent
- detail
- planet view

当前接口：

- `GET /healthz`
- `POST /api/v1/mobile/search`
- `GET /api/v1/mobile/cards/recent`
- `GET /api/v1/mobile/cards/{id}`
- `GET /api/v1/planet/view`

## 二、namespace 约束

这是最重要的约束。

### 读服务

`moreway_asset_service` 当前要求：

- `POST /api/v1/mobile/search`
  - body 必须有 `namespaceId`
- `GET /api/v1/mobile/cards/recent`
  - query 必须有 `namespace_id`
- `GET /api/v1/mobile/cards/{id}`
  - query 必须有 `namespace_id`
- `GET /api/v1/planet/view`
  - query 必须有 `namespace_id`

缺失时返回：

```json
{
  "ok": false,
  "error": "missing_namespace_id"
}
```

### 写服务

`visual_asset_card_service` 当前对 `namespaceId` 不是强制的，但建议 Worker 总是传。

原因：

- 后续 search / recent / detail / planet view 都依赖它
- 没 namespace 的资产卡会更难进入用户态视图

另外：

- `capturedAt` 现在是写服务必填字段
- `captureLocation` 是可选组级位置字段

## 三、Worker 必须做的字段映射

### 1. 写入

Worker -> `visual_asset_card_service`

必须保证 body 至少包含：

- `capturedAt`
- `sourceClient`
- `images`
- `namespaceId`

可选透传：

- `captureLocation`
- `objectHint`
- `groupNote`

建议：

- `sourceClient` 由 Worker 统一补成固定值
  - 例如 `android-apk-worker`

### 2. 搜索

Worker -> `moreway_asset_service`

必须保证 body 至少包含：

- `namespaceId`
- `query`

可选透传：

- `tags`
- `page`
- `limit`
- `min_score`

### 3. Recent

Worker -> `moreway_asset_service`

必须保证 query 至少包含：

- `namespace_id`

可选透传：

- `cursor`
- `limit`
- `doc_kind`
- `source_table`

### 4. Detail

Worker -> `moreway_asset_service`

必须保证 query 至少包含：

- `namespace_id`

建议透传：

- `source_table`

### 5. Planet View

Worker -> `moreway_asset_service`

必须保证 query 至少包含：

- `namespace_id`

可选透传：

- `limit`
- `source_table`

## 四、Worker 不应做的事

### 1. 不应让客户端随意指定任意 namespace

更稳的做法：

- Worker 根据用户身份推导 namespace
- 再把它注入后端请求

### 2. 不应改写后端的核心业务字段

例如：

- 不要自己生成 `cardCreatedAt`
- 不要自己生成 `cardId`
- 不要自己拼 `detail.blocks`

这些都应由后端产生。

### 3. 不应把两个后端的错误原样暴露给 App

建议：

- Worker 记录原始后端错误
- 对客户端返回统一错误风格

## 五、当前读服务返回契约

### 搜索结果项

Worker 可以依赖这些稳定字段：

- `id`
- `docKind`
- `cardSchema`
- `sourceType`
- `sourceTable`
- `namespaceId`
- `title`
- `summary`
- `subtitle`
- `createdAt`
- `capturedAt`
- `cardCreatedAt`
- `captureLocation`
- `tags`
- `score`
- `imageRefs`
- `contentCompleteness`
- `observationConfidence`
- `mdUrl`

### 详情

Worker 可以依赖这些稳定字段：

- `id`
- `docKind`
- `cardSchema`
- `sourceType`
- `sourceTable`
- `namespaceId`
- `title`
- `summary`
- `createdAt`
- `capturedAt`
- `cardCreatedAt`
- `captureLocation`
- `tags`
- `imageRefs`
- `mdUrl`
- `markdown`
- `detail.highlights`
- `detail.meta`
- `detail.blocks`

### Recent

Worker 可以依赖这些稳定字段：

- `namespaceId`
- `items`
- `nextCursor`
- `hasMore`

每个 `item` 的 shape 贴近搜索结果项。

### Planet View

Worker 可以依赖这些稳定字段：

- `namespaceId`
- `pointCount`
- `points`
- `bounds`

每个 `point` 当前至少包含：

- `id`
- `docKind`
- `cardSchema`
- `sourceType`
- `sourceTable`
- `namespaceId`
- `title`
- `summary`
- `createdAt`
- `capturedAt`
- `cardCreatedAt`
- `captureLocation`
- `tags`
- `imageRefs`
- `contentCompleteness`
- `observationConfidence`
- `mdUrl`
- `position.x`
- `position.y`
- `position.z`

## 六、健康检查约束

Worker 可以通过：

- `visual_asset_card_service /healthz`
- `moreway_asset_service /healthz`

来判断基础可用性。

当前返回：

### 写服务

```json
{
  "ok": true,
  "service": "visual-asset-card-service"
}
```

### 读服务

```json
{
  "ok": true,
  "service": "moreway-asset-service"
}
```

## 七、给 Worker 实现者的一句话

Worker 最好只做四件事：

- 认证
- namespace 推导与注入
- 路由转发
- 错误收敛

不要把业务生成逻辑搬到 Worker 里。
