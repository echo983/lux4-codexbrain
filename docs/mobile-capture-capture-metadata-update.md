# Mobile Capture API Update

这份说明给手机前端 / Android 开发。

这次 `visual_asset_card_service` 的写入协议新增了“采集元数据”。

目标：

- 让每张手机视觉资产卡都明确知道：
  - 这组内容是什么时间拍到的
  - 这组内容大致在哪拍到的

## 这次改了什么

### 1. `capturedAt` 现在是必填

写入接口：

- `POST /api/v1/visual-cards`

现在请求体必须带：

```json
{
  "capturedAt": "2026-03-30T10:34:56Z"
}
```

要求：

- 必须是 ISO 8601 时间戳
- 必须带时区

推荐：

- 直接传 UTC，例如 `2026-03-30T10:34:56Z`

不推荐：

- 只传本地时间字符串
- 不带时区

### 2. `captureLocation` 现在支持了

这是可选字段。

它是“组级位置”，不是每张图各自的位置。

请求示例：

```json
{
  "captureLocation": {
    "latitude": 40.4168,
    "longitude": -3.7038
  }
}
```

说明：

- 如果当前没有位置，就不传
- 一次对象采集只需要传一组位置

### 3. `groupNote` 继续保留

这次没有改。

它继续表示：

- 手动备注
- 补充上下文
- 例如“只拍到了右半边”

## 新的最小请求示例

```json
{
  "capturedAt": "2026-03-30T10:34:56Z",
  "captureLocation": {
    "latitude": 40.4168,
    "longitude": -3.7038
  },
  "objectHint": "名片",
  "groupNote": "真实世界测试样本",
  "sourceClient": "android-apk",
  "namespaceId": "ns_user_a13f09cd",
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

## 成功响应新增了什么

现在成功响应会新增：

- 顶层 `capturedAt`
- 顶层 `captureLocation`

并且 `card` 里也会带：

- `createdAt`
- `capturedAt`
- `cardCreatedAt`
- `captureLocation`

### 响应示例

```json
{
  "ok": true,
  "cardId": "mobile_capture_xxx",
  "cardSchema": "mobile_capture_asset_card_v1",
  "status": "written",
  "namespaceId": "ns_user_a13f09cd",
  "capturedAt": "2026-03-30T10:34:56Z",
  "captureLocation": {
    "latitude": 40.4168,
    "longitude": -3.7038
  },
  "captureGroupId": "cg_xxx",
  "groupImageFids": ["NBSS:0x..."],
  "cardCreatedAt": "2026-03-30T15:30:07Z",
  "rowsWritten": 1,
  "table": "mobile_capture_asset_cards",
  "card": {
    "id": "mobile_capture_xxx",
    "namespaceId": "ns_user_a13f09cd",
    "title": "某公司联系人名片",
    "summary": "名片摘要",
    "createdAt": "2026-03-30T10:34:56Z",
    "capturedAt": "2026-03-30T10:34:56Z",
    "cardCreatedAt": "2026-03-30T15:30:07Z",
    "captureLocation": {
      "latitude": 40.4168,
      "longitude": -3.7038
    }
  }
}
```

## 前端应该怎么理解这几个时间字段

### `capturedAt`

- 这组对象内容被拍到的时间
- 这是现实世界时间

### `createdAt`

对手机视觉资产卡来说，当前应理解为：

- 采集时间

也就是它和 `capturedAt` 现在会对齐。

### `cardCreatedAt`

- 后端真正生成资产卡并写库的时间
- 这不是拍照时间

## 前端需要改哪些地方

### 必改

1. 写入请求必须传 `capturedAt`
2. 如果有位置信息，可以传 `captureLocation`

### 建议改

1. 详情页或列表页可以展示：
   - `createdAt`
   - 或 `capturedAt`
2. 如果有位置展示需求，可以使用：
   - `captureLocation`

## 错误行为

如果不传 `capturedAt`，后端会返回 `400 invalid_request`。

常见 detail 会类似：

```json
{
  "ok": false,
  "error": "invalid_request",
  "detail": "capturedAt is required"
}
```

## 一句话结论

这次前端最重要的改动只有两条：

1. 写入时必须传 `capturedAt`
2. 有位置就传组级 `captureLocation`
