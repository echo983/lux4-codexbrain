# lux4-codexbrain

`lux4-codexbrain` 是一个长期运行的 Python daemon。

它的职责是：

1. 接收上游项目转发过来的 IM 入站消息。
2. 依据用户和房间信息定位会话。
3. 生成回复。
4. 将回复按统一结构推送到上游配置的 reply queue 接口。

当前是第一阶段实现，回复逻辑为 `echo`，即用户发什么，就回什么。

---

## 当前状态

- 已实现 HTTP API，供 Cloudflare worker 或其他上游项目调用
- 已实现消息标准化，兼容参考项目中的 `incoming_message` 结构
- 已实现异步后台处理
- 已实现本地 SQLite 会话记录
- 已实现 reply 出站推送
- reply 出站目标固定为 Cloudflare Queue push API
- 当前回复策略：原样 echo

---

## 启动方式

```bash
LUX4_CF_ACCOUNT_ID='your-account-id' \
LUX4_CF_QUEUE_ID='your-queue-id' \
LUX4_CF_API_TOKEN='your-api-token' \
PYTHONPATH=src python3 -m lux4_daemon
```

默认监听：

- Host: `0.0.0.0`
- Port: `18473`

---

## 环境变量

| 变量名 | 默认值 | 说明 |
|---|---:|---|
| `LUX4_HOST` | `0.0.0.0` | HTTP 服务监听地址 |
| `LUX4_PORT` | `18473` | HTTP 服务监听端口 |
| `LUX4_DB_PATH` | `var/lux4_daemon.sqlite3` | SQLite 数据库文件路径 |
| `LUX4_CF_ACCOUNT_ID` | 无 | Cloudflare Account ID |
| `LUX4_CF_QUEUE_ID` | 无 | Cloudflare Queue ID |
| `LUX4_CF_API_TOKEN` | 无 | Cloudflare API Token，需有队列写权限 |
| `LUX4_REQUEST_TIMEOUT_SECONDS` | `10` | reply 出站 HTTP 超时秒数 |

说明：

- `LUX4_CF_ACCOUNT_ID`、`LUX4_CF_QUEUE_ID`、`LUX4_CF_API_TOKEN` 是启动必需项。
- 缺少任意一个时，daemon 会在启动时直接报错退出，不会进入“只接收入站不发 reply”的半工作状态。

---

## HTTP API 总览

### 1. 健康检查

`GET /healthz`

用途：

- 给上游项目或部署系统做健康检查。

成功返回：

```json
{
  "ok": true,
  "service": "lux4-daemon"
}
```

示例：

```bash
curl -sS http://127.0.0.1:18473/healthz
```

---

### 2. 服务说明

`GET /`

用途：

- 快速确认服务在线以及暴露了哪些接口。

成功返回：

```json
{
  "ok": true,
  "service": "lux4-daemon",
  "endpoints": [
    "/healthz",
    "/api/v1/messages/incoming"
  ]
}
```

---

### 3. 接收入站消息

`POST /api/v1/messages/incoming`

这是上游项目最主要调用的接口。

用途：

- 上游在收到用户 IM 消息后，将消息转发给本 daemon。
- daemon 收到后立即返回 `202 Accepted`。
- 真正的消息处理和 reply 推送在后台线程异步执行。

这意味着：

- 上游不需要等待大模型或业务逻辑执行完成。
- 只要 daemon 成功接受这条消息，上游就可以结束本次转发请求。

---

## 请求要求

### Content-Type

建议：

```http
Content-Type: application/json
```

### 请求体

请求体需要是 JSON，对应一个入站消息。

当前 daemon 期望的标准字段如下：

```json
{
  "version": 1,
  "kind": "incoming_message",
  "source": "rocketchat",
  "siteUrl": "https://rocket.example.com",
  "roomId": "room-1",
  "senderUsername": "alice",
  "senderUserId": "user-1",
  "messageId": "msg-1",
  "text": "hello",
  "receivedAt": "2026-03-17T12:00:00Z"
}
```

### 必填字段

| 字段 | 类型 | 说明 |
|---|---|---|
| `siteUrl` | string | IM 站点 URL，用于区分不同部署 |
| `roomId` | string | 会话房间 ID |
| `senderUsername` | string | 发送者用户名 |
| `senderUserId` | string | 发送者用户 ID |
| `messageId` | string | 消息唯一 ID |
| `text` | string | 用户消息正文 |

### 推荐字段

| 字段 | 类型 | 说明 |
|---|---|---|
| `version` | number | 建议传 `1` |
| `kind` | string | 建议传 `incoming_message` |
| `source` | string | 当前建议传 `rocketchat` |
| `receivedAt` | string | 建议使用 ISO 8601 时间戳 |

### 当前兼容性

为了兼容上游不同 payload 形状，daemon 也会尝试识别以下别名字段：

| 标准字段 | 可兼容别名 |
|---|---|
| `siteUrl` | `siteURL`, `site_url` |
| `roomId` | `rid`, `room_id` |
| `messageId` | `msgId`, `_id`, `id` |
| `text` | `message`, `msg`, `content` |
| `senderUsername` | `username`, `user_name` |
| `senderUserId` | `userId`, `sender_id`, `uid` |
| `receivedAt` | `createdAt`, `ts` |

此外，如果上游把消息包在以下对象里，daemon 也会尝试解析：

- `payload`
- `message`
- `data`
- `event`

但是，建议上游仍然优先发送标准结构，不要依赖这些兼容分支。

---

## 成功响应

HTTP 状态码：

```http
202 Accepted
```

返回体：

```json
{
  "ok": true,
  "status": "accepted",
  "messageId": "msg-1",
  "sessionKey": "rocketchat::https://rocket.example.com::room-1::user-1"
}
```

字段说明：

| 字段 | 说明 |
|---|---|
| `ok` | 是否成功接受 |
| `status` | 固定为 `accepted` |
| `messageId` | 入站消息 ID |
| `sessionKey` | daemon 内部用于串联用户会话的键 |

注意：

- `202` 仅表示 daemon 已接收这条消息并进入后台处理队列。
- `202` 不代表 reply 已经推送成功。
- 当前版本如果后台推送失败，会记录日志，但不会同步回传给这次 HTTP 调用。

---

## 失败响应

### 1. JSON 非法

HTTP 状态码：

```http
400 Bad Request
```

返回体：

```json
{
  "ok": false,
  "error": "invalid_json"
}
```

出现条件：

- 请求体不是合法 JSON
- 或请求体为空

### 2. 消息结构不合法

HTTP 状态码：

```http
400 Bad Request
```

返回体：

```json
{
  "ok": false,
  "error": "invalid_incoming_message"
}
```

出现条件：

- 缺少关键字段
- `kind` 明确传了但不是 `incoming_message`
- `source` 明确传了但不是 `rocketchat`

### 3. 路径不存在

HTTP 状态码：

```http
404 Not Found
```

返回体：

```json
{
  "ok": false,
  "error": "not_found"
}
```

---

## 上游项目调用示例

### curl 示例

```bash
curl -sS \
  -X POST \
  http://127.0.0.1:18473/api/v1/messages/incoming \
  -H 'Content-Type: application/json' \
  -d '{
    "version": 1,
    "kind": "incoming_message",
    "source": "rocketchat",
    "siteUrl": "https://rocket.example.com",
    "roomId": "room-1",
    "senderUsername": "alice",
    "senderUserId": "user-1",
    "messageId": "msg-1",
    "text": "hello",
    "receivedAt": "2026-03-17T12:00:00Z"
  }'
```

预期返回：

```json
{
  "ok": true,
  "status": "accepted",
  "messageId": "msg-1",
  "sessionKey": "rocketchat::https://rocket.example.com::room-1::user-1"
}
```

---

## Reply 出站格式

daemon 后台处理完成后，会向 Cloudflare Queue push API 发起一个 HTTP `POST` 请求。

目标地址：

```text
https://api.cloudflare.com/client/v4/accounts/{account_id}/queues/{queue_id}/messages
```

请求头：

```http
Content-Type: application/json
```

鉴权头：

```http
Authorization: Bearer <token>
```

请求体格式如下：

```json
{
  "body": {
    "version": 1,
    "kind": "reply_message",
    "source": "rocketchat",
    "siteUrl": "https://rocket.example.com",
    "roomId": "room-1",
    "replyMode": "message",
    "text": "hello"
  },
  "content_type": "json"
}
```

字段说明：

| 字段 | 说明 |
|---|---|
| `body` | 实际入队消息内容，即 `reply_message` 对象 |
| `content_type` | 当前固定为 `json` |

`body` 内部字段说明：

| 字段 | 说明 |
|---|---|
| `version` | 当前固定为 `1` |
| `kind` | 固定为 `reply_message` |
| `source` | 当前固定为 `rocketchat` |
| `siteUrl` | 原始消息所在站点 |
| `roomId` | 原始消息所在房间 |
| `replyMode` | 当前固定为 `message` |
| `text` | 要发送给用户的回复正文 |

第一阶段里，`text` 与用户原始输入完全一致。

---

## 对接时序

建议上游按下面流程集成：

1. 上游收到用户 IM 消息。
2. 上游把消息转成本文档中的 `incoming_message` JSON。
3. 上游调用 `POST /api/v1/messages/incoming`。
4. 如果收到 `202 Accepted`，说明 daemon 已接受处理。
5. daemon 在后台执行回复逻辑。
6. daemon 把 `reply_message` 推送到 Cloudflare Queue。
7. 上游 reply queue 消费者再把消息真正发回 IM 平台。

---

## 当前行为边界

这版是第一阶段最小实现，调用方需要知道下面几点：

- 当前不会同步返回 reply 内容
- 当前不会通过 HTTP 直接把最终结果回传给上游调用方
- 当前回复逻辑只是 echo
- 当前没有对重复 `messageId` 做严格幂等去重
- 当前后台推送失败只写日志，不会自动回调上游

这些都是下一阶段会继续补的内容。

---

## 测试

```bash
PYTHONPATH=src python3 -m unittest discover -s tests -v
```

---

## 下一阶段规划

- 将 `echo` 替换为真正的 assistant reply 生成流程
- 接入 `codex-cli`
- 利用 `sessionKey` 续接历史会话
- 增加幂等、重试、失败投递和更完整的日志/指标
