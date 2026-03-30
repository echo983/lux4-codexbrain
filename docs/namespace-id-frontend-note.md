# Namespace ID Frontend Note

这份说明给前端。

目标很简单：

- 用一个明确的 `namespaceId`
- 标记不同用户 / 不同用途的资产卡内容
- 不改原始文档模型

注意：

- `namespaceId` 只对资产卡生效
- 原始文档 `raw_text` 不要求带这个字段

## 这次后端已经完成的部分

后端已经支持：

1. 写入手机视觉资产卡时接收 `namespaceId`
2. 新资产读服务搜索接口强制要求 `namespaceId`
3. 新资产读服务详情接口强制要求 `namespace_id`
4. recent / planet view 也强制要求 namespace
5. 搜索结果和详情结果都返回 `namespaceId`

## 前端要改哪些地方

前端只需要改 3 处。

### 1. 资产卡写入

接口：

- `POST /api/v1/visual-cards`

新增字段：

```json
{
  "namespaceId": "user_a"
}
```

完整示例：

```json
{
  "capturedAt": "2026-03-30T10:34:56Z",
  "captureLocation": {
    "latitude": 40.4168,
    "longitude": -3.7038
  },
  "objectHint": "名片",
  "groupNote": "正反面",
  "sourceClient": "android-apk",
  "namespaceId": "user_a",
  "images": [
    {
      "contentBase64": "<base64>",
      "mimeType": "image/jpeg",
      "order": 1,
      "role": "front"
    }
  ]
}
```

成功响应现在也会带：

- 顶层 `namespaceId`
- 顶层 `capturedAt`
- 顶层 `captureLocation`
- `card.namespaceId`

所以前端写入成功后可以直接保留这个值，不需要自己推导。

### 2. 搜索

接口：

- `POST /api/v1/mobile/search`

当前建议接入服务：

- `moreway_asset_service`

新增必填字段：

```json
{
  "query": "Laboratorio",
  "namespaceId": "user_a"
}
```

成功响应会带：

- 顶层 `namespaceId`
- 每条结果里的 `namespaceId`

返回示例：

```json
{
  "ok": true,
  "query": "Laboratorio",
  "namespaceId": "user_a",
  "results": [
    {
      "id": "mobile_capture_xxx",
      "docKind": "asset_card",
      "cardSchema": "mobile_capture_asset_card_v1",
      "namespaceId": "user_a",
      "title": "..."
    }
  ]
}
```

### 3. 详情

接口：

- `GET /api/v1/mobile/cards/{id}?source_table=...&namespace_id=...`

注意这里当前参数名是：

- `namespace_id`

不是 camelCase。

请求示例：

```http
GET /api/v1/mobile/cards/mobile_capture_xxx?source_table=mobile_capture_asset_cards&namespace_id=user_a
```

详情返回也会带：

- `namespaceId`

## 前端应该怎么传

建议前端把 `namespaceId` 当成会话上下文或当前用户上下文的一部分。

规则建议固定为：

1. 写入时透传当前 `namespaceId`
2. 搜索时透传同一个 `namespaceId`
3. 点进详情时继续透传同一个 `namespaceId`

不要让页面各自自由决定 namespace。

## 当前后端行为边界

这是最重要的一条：

- 新的 `moreway_asset_service` 不兼容无 namespace 的用户态读请求
- `namespaceId` 缺失时会直接返回 `400 missing_namespace_id`
- 带了 `namespaceId` 后，后端只返回匹配该 `namespaceId` 的资产卡
- 没有 namespace 的原始文档不会混进来

这样做的目的不是强隔离，而是避免不同用户的内容在资产卡层混淆。

## 原始文档怎么处理

原始文档目前不要求带 `namespaceId`。

也就是说：

- `raw_text` 本身不承诺 namespace 语义
- 新的 `moreway_asset_service` 面向用户态接口时，实际返回以 namespace-aware 资产卡为主

前端不要尝试给原始文档补 namespace。

## 前端推荐实现

建议前端统一做一个字段：

```ts
type NamespaceId = string
```

然后在下面三类请求里都透传：

- asset ingest
- mobile search
- mobile detail

## 空值规则

在新的 `moreway_asset_service` 上，`namespaceId` 不是可选字段。

规则：

- 没有当前 namespace，就不要调用用户态资产读接口
- 不要传空字符串
- 不要依赖后端兜底成“全局搜索”

## 命名规范建议

推荐 `namespaceId` 使用：

- 短
- 稳定
- 可读
- 不直接暴露真实身份信息

推荐格式：

```text
ns_<kind>_<token>
```

例如：

- `ns_user_a13f09cd`
- `ns_team_42d91ab0`
- `ns_demo_20260327`

### 推荐做法

- `kind` 使用短类别：
  - `user`
  - `team`
  - `demo`
  - `lab`
- `token` 使用稳定短标识
  - 推荐 8 位十六进制短 hash
  - 或者一个稳定的短 token

推荐生成方式：

```text
ns_user_<sha1(stable_user_id)[:8]>
```

例如：

- `ns_user_7f3a2c9d`

### 不推荐

不推荐直接使用：

- 用户真实姓名
- 邮箱
- 手机号
- 会频繁变化的展示名

例如下面这些都不推荐：

- `zhangsan`
- `alice@gmail.com`
- `madrid-lab-visible-name`

### 一句话建议

如果前端或上游系统需要自己生成：

- 优先用 `ns_user_<8hex>`
- 不要用敏感明文标识

## 一句话规则

前端现在只要做到：

- 写入传 `namespaceId`
- 搜索传 `namespaceId`
- recent 传 `namespace_id`
- 详情传 `namespace_id`
- planet view 传 `namespace_id`

就可以把不同用户 / 不同用途的资产卡内容标记并筛开。
