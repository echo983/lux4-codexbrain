# lux4-codexbrain

`lux4-codexbrain` 是一个长期运行的 Python daemon。

它的职责是：

1. 接收上游项目转发过来的 IM 入站消息。
2. 依据用户和房间信息定位会话。
3. 生成回复。
4. 将回复按统一结构推送到上游配置的 reply queue 接口。

当前版本已经接入 `codex exec`，并支持按用户会话续接已有 Codex session。

此外，仓库现在还提供一组直接调用 Google Maps / Weather API 的原语脚本，给后续 skill 和日常地图问答使用。

---

## 当前状态

- 已实现 HTTP API，供 Cloudflare worker 或其他上游项目调用
- 已实现消息标准化，兼容参考项目中的 `incoming_message` 结构
- 已实现异步后台处理
- 已实现本地 SQLite 会话记录
- 已实现基于 `codex exec` 的回复生成
- 已实现本地会话到 Codex session id 的续接
- 已实现 reply 出站推送
- reply 出站目标固定为 Cloudflare Queue push API
- 助手行为由项目根目录 [AGENT.md](/root/lux4-codexbrain/AGENT.md) 约束
- 已实现 5 个 Google 地图原语脚本：
  - [google_places_search.py](/root/lux4-codexbrain/scripts/google_places_search.py)
  - [google_place_details.py](/root/lux4-codexbrain/scripts/google_place_details.py)
  - [google_geocode.py](/root/lux4-codexbrain/scripts/google_geocode.py)
  - [google_compute_routes.py](/root/lux4-codexbrain/scripts/google_compute_routes.py)
  - [google_weather.py](/root/lux4-codexbrain/scripts/google_weather.py)

---

## 启动方式

```bash
LUX4_CF_ACCOUNT_ID='your-account-id' \
LUX4_CF_QUEUE_ID='your-queue-id' \
LUX4_CF_API_TOKEN='your-api-token' \
CODEX_API_KEY='your-codex-api-key' \
PYTHONPATH=src python3 -m lux4_daemon
```

也可以在当前运行目录放一个 `.env` 文件：

```dotenv
LUX4_CF_ACCOUNT_ID=your-account-id
LUX4_CF_QUEUE_ID=your-queue-id
LUX4_CF_API_TOKEN=your-api-token
CODEX_API_KEY=your-codex-api-key
LUX4_PORT=18473
```

然后直接运行：

```bash
PYTHONPATH=src python3 -m lux4_daemon
```

默认监听：

- Host: `0.0.0.0`
- Port: `18473`

配置读取顺序：

1. 先读进程环境变量
2. 如果某个配置项没有在进程环境里出现，再从当前运行目录的 `.env` 文件读取

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
| `LUX4_CODEX_BINARY` | `codex` | Codex CLI 可执行文件路径 |
| `LUX4_CODEX_MODEL` | 空 | 可选，显式指定 Codex model |
| `LUX4_CODEX_TIMEOUT_SECONDS` | `120` | 单次 Codex 调用超时 |
| `LUX4_DEBUG_SESSIONS` | `0` | 打开后输出会话续接调试日志 |
| `CODEX_API_KEY` | 无 | Codex API key，会透传给 `codex exec` |
| `LUX4_REQUEST_TIMEOUT_SECONDS` | `10` | reply 出站 HTTP 超时秒数 |
| `GOOGLE_MAPS_API_KEY` | 无 | Google Maps / Routes / Geocoding / Weather API key |

说明：

- `LUX4_CF_ACCOUNT_ID`、`LUX4_CF_QUEUE_ID`、`LUX4_CF_API_TOKEN` 是启动必需项。
- 缺少任意一个时，daemon 会在启动时直接报错退出，不会进入“只接收入站不发 reply”的半工作状态。
- `.env` 文件只补充缺失项，不覆盖已经存在的进程环境变量。
- 如果本机没有可复用的 Codex 登录态，建议显式配置 `CODEX_API_KEY`。
- `LUX4_DEBUG_SESSIONS=1` 时，会输出本轮使用的 `stored_codex_session_id`、返回的 `returned_codex_session_id`、是否尝试了 `resume`，以及是否发生了重建。
- 如果要使用 Google 原语脚本，当前项目 `.env` 里还需要配置 `GOOGLE_MAPS_API_KEY`。

---

## Google 原语脚本

这组脚本不依赖当前 Maps MCP 的参数绑定，而是直接调用 Google 官方 API。

当前已经实测可用的原语有：

- 地点搜索：[google_places_search.py](/root/lux4-codexbrain/scripts/google_places_search.py)
- 地点详情：[google_place_details.py](/root/lux4-codexbrain/scripts/google_place_details.py)
- 地理编码：[google_geocode.py](/root/lux4-codexbrain/scripts/google_geocode.py)
- 路线规划：[google_compute_routes.py](/root/lux4-codexbrain/scripts/google_compute_routes.py)
- 天气查询：[google_weather.py](/root/lux4-codexbrain/scripts/google_weather.py)

建议在当前项目 `.env` 中配置：

```dotenv
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

建议在 Google Cloud 中启用这些 API：

- `Places API (New)`
- `Geocoding API`
- `Routes API`
- `Weather API`

### 1. 地点搜索

示例：

```bash
python3 scripts/google_places_search.py \
  'coffee shops near Sagrada Familia, Barcelona, Spain' \
  --language-code en --region-code ES --max-results 3
```

返回字段包括：

- `id`
- `name`
- `address`
- `latitude` / `longitude`
- `primary_type`
- `rating`
- `google_maps_uri`
- `website_uri`

适合问题：

- 附近有哪些好吃的
- 某地附近有哪些咖啡馆
- 某个邮编附近有哪些靠谱餐厅

### 2. 地点详情

示例：

```bash
python3 scripts/google_place_details.py \
  ChIJt5ayg9ujpBIRB-x8NP5gU0k \
  --language-code en --region-code ES
```

返回字段包括：

- `name`
- `address`
- `primary_type`
- `types`
- `rating`
- `business_status`
- `website_uri`
- `regular_opening_hours`

适合问题：

- 这家店是做什么的
- 这个地方现在还开着吗
- 这家店的营业时间和网址是什么

### 3. 地理编码

示例：

```bash
python3 scripts/google_geocode.py \
  'Sagrada Familia, Barcelona, Spain' \
  --language en --region es
```

返回字段包括：

- `formatted_address`
- `place_id`
- `latitude`
- `longitude`
- `location_type`

适合问题：

- 把地点名转成坐标
- 给路线、天气、附近搜索提供统一定位入口

### 4. 路线规划

示例：

步行：

```bash
python3 scripts/google_compute_routes.py \
  'Sagrada Familia, Barcelona, Spain' \
  'Blackbird Coffee Corner - Sagrada Familia, Barcelona, Spain' \
  --travel-mode WALK --language-code en --region-code ES
```

公交：

```bash
python3 scripts/google_compute_routes.py \
  'Sagrada Familia, Barcelona, Spain' \
  'Blackbird Coffee Corner - Sagrada Familia, Barcelona, Spain' \
  --travel-mode TRANSIT --language-code en --region-code ES
```

返回字段包括：

- `distance_meters`
- `duration`
- `steps[].instruction`
- `steps[].travel_mode`
- `steps[].transit_line`
- `steps[].transit_headsign`

适合问题：

- 去某个商店怎么走
- 坐多少路公交车
- 大概要多久

### 5. 天气查询

示例：

当前天气：

```bash
python3 scripts/google_weather.py \
  'Barcelona, Spain' \
  --mode current --language-code en --units-system METRIC
```

未来两天天气：

```bash
python3 scripts/google_weather.py \
  'Barcelona, Spain' \
  --mode daily --language-code en --units-system METRIC --days 2
```

返回字段包括：

- `weather_condition`
- `temperature`
- `feels_like_temperature`
- `humidity`
- `uv_index`
- `wind_speed`
- `precipitation`
- `sunrise_time`
- `sunset_time`

适合问题：

- 那天去某城市玩合适不合适
- 明天会不会下雨
- 未来几天冷不冷

### 说明

- 当前 Maps MCP 的 `search_places` 已可用，但 `compute_routes` 和 `lookup_weather` 在这台机器的 Codex 工具绑定里仍有参数编组兼容问题。
- 因此目前更稳的方式是直接使用这组仓库内脚本。
- 相关调查和参考见 [maps-mcp-notes.md](/root/lux4-codexbrain/docs/maps-mcp-notes.md)。

---

## 系统认知 Cron

项目现在提供两类后台系统任务入口，它们是系统框架命令，不是用户发言。

### Cron A: 10 分钟记忆提炼

用途：

- 每 10 分钟触发一次
- 只有最近 10 分钟内确实有会话活动时才继续
- 它会进入已有 Codex 会话，对最近窗口内的对话进行审视
- 提炼值得纳入长期记忆的：
  - 事实
  - 实体
  - 意图
- 并把这些内容写入 Neo4j

运行：

```bash
python3 scripts/run_cron_memory_extraction.py
```

可选：

```bash
python3 scripts/run_cron_memory_extraction.py --window-minutes 10 --log-dir var/system_task_logs
```

### Cron B: 4 小时睡眠整理

用途：

- 每 4 小时触发一次
- 只有过去 4 小时内确实发生过成功的 Cron A 时才继续
- 它会围绕最近 4 小时的记忆活动做阶段性整理：
  - 整理
  - 合并
  - 重估
  - 删减
  - 调整置信度
  - 更新实体状态
- 必要时可使用 Neo4j / GDS
- 会留下完整日志
- 并生成一段内部“感知和洞察”，再注入回用户会话上下文

运行：

```bash
python3 scripts/run_cron_memory_consolidation.py
```

可选：

```bash
python3 scripts/run_cron_memory_consolidation.py --window-hours 4 --log-dir var/system_task_logs
```

### 日志与记录

- SQLite 会保存 `system_task_runs`
- 两类 cron 都会先尝试获取 SQLite 任务锁，避免同类任务重叠执行
- 即使因为“无活动”或“已有同类任务运行中”而跳过，也会单独落一份 batch log
- 本地日志默认写入：

```text
var/system_task_logs/
```

- 单次 session run log 会记录：
  - 任务类型
  - 会话路由信息
  - 时间窗口
  - 注入给 Codex 的完整 context
  - 发给 Codex 的完整 prompt
  - 返回 summary
  - 错误细节
- 每次批处理还会生成单独的 batch log，记录：
  - 是否 skipped
  - skipped 原因
  - 命中的 run 数
  - 每个 run 的 `task_run_id`、`session_key`、状态、log 路径
- 这些任务不会被当作用户消息处理
- 这些任务是系统框架命令，不是用户发言

---

## 运行方式

当前回复链路不是简单 echo，而是：

1. daemon 收到入站消息
2. 用 `source + site_url + room_id + sender_user_id` 定位本地会话
3. 如果没有现有 Codex session，则执行新的 `codex exec`
4. 如果已有 Codex session，则执行 `codex exec resume <SESSION_ID>`
5. 将最新 `thread_id` 回写到本地 SQLite
6. 将最终回复推送到 Cloudflare Queue

当前实现里，daemon 调用 Codex 时会显式带上：

```bash
--full-auto
```

这个自动执行参数只用于新的 `codex exec` 会话启动。

对已有会话的续接：

```bash
codex exec resume <SESSION_ID>
```

不会再错误附带不兼容参数，否则 `resume` 会失败并触发会话重建。

也就是说，当前 Codex 新会话以 `--full-auto` 启动，但 `resume` 子命令保持最小必要参数。

本地数据库默认在：

```text
var/lux4_daemon.sqlite3
```

会话里会保存：

- `session_key`
- `active_codex_session_id`
- `status`
- `last_message_id`
- `last_message_at`

如果 `resume` 失败，daemon 会清掉旧的 Codex session id，并自动新建一轮会话。

如果你想手动清空本地会话历史，重新开始新的 Codex session，而不碰 Neo4j 长期记忆，可以运行：

```bash
python3 scripts/reset_local_sessions.py --yes
```

可选指定数据库路径：

```bash
python3 scripts/reset_local_sessions.py --db-path var/lux4_daemon.sqlite3 --yes
```

---

## Codex 约束

项目根目录的 [AGENT.md](/root/lux4-codexbrain/AGENT.md) 定义了统一的助手行为边界。

核心约束包括：

- 角色是 IM 助手，不是 coding agent
- 只输出给最终用户的正文
- 默认跟随用户语言
- 不暴露内部实现、session id、Codex、Cloudflare、数据库和队列细节
- 不编造已经执行的动作

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
- 真正的消息处理、Codex 会话续接和 reply 推送在后台线程异步执行。

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

当前版本里，`text` 是 Codex 生成的最终用户回复。

---

## 对接时序

建议上游按下面流程集成：

1. 上游收到用户 IM 消息。
2. 上游把消息转成本文档中的 `incoming_message` JSON。
3. 上游调用 `POST /api/v1/messages/incoming`。
4. 如果收到 `202 Accepted`，说明 daemon 已接受处理。
5. daemon 在后台执行回复逻辑。
6. daemon 用 `codex exec` 或 `codex exec resume` 生成回复。
7. daemon 把 `reply_message` 推送到 Cloudflare Queue。
8. 上游 reply queue 消费者再把消息真正发回 IM 平台。

---

## 当前行为边界

当前版本的行为边界如下：

- 当前不会同步返回 reply 内容
- 当前不会通过 HTTP 直接把最终结果回传给上游调用方
- 当前依赖本机可用的 `codex` CLI
- 当前没有对重复 `messageId` 做严格幂等去重
- 当前后台推送失败只写日志，不会自动回调上游

后续还会继续补更完整的恢复和观测能力。

---

## 测试

```bash
PYTHONPATH=src python3 -m unittest discover -s tests -v
```

---

## 下一阶段规划

- 增加更完整的多轮上下文装配
- 增加幂等、重试、失败投递和更完整的日志/指标
- 增加更细的 Codex 失败分类和恢复策略
- 视需要引入结构化输出 schema
