# Mobile Search Result Type Handling

这份文档给前端说明：

- 搜索结果里如何判断返回的是什么类型
- 不同类型应该怎么处理
- `deep_asset_card_v1` 该怎么按当前规则解析

当前默认语境：

- 用户态移动搜索接口优先来自 `moreway_asset_service`
- 请求必须带当前 `namespaceId`

## 一、先看哪几个字段

移动端搜索结果里，前端先看这 3 个字段：

- `docKind`
- `cardSchema`
- `sourceType`

判断顺序建议固定为：

1. 先看 `docKind`
2. 如果 `docKind === "asset_card"`，再看 `cardSchema`
3. `sourceType` 只作为来源信息，不作为主分流条件

## 二、类型判断规则

### 1. 原始文档

判断条件：

```json
{
  "docKind": "raw_text"
}
```

处理方式：

- 不需要做 schema 解析
- 直接把它当普通原始文档展示
- 列表页直接用：
  - `title`
  - `summary`
- 详情页直接展示：
  - `markdown`
  - 或直接展示 `detail.blocks`

前端不要做额外字段拆解。

这类结果的原则就是：

- 不解释
- 不结构化提炼
- 不猜测它属于哪种资产卡

### 2. `deep_asset_card_v1`

判断条件：

```json
{
  "docKind": "asset_card",
  "cardSchema": "deep_asset_card_v1"
}
```

这类卡是现在的 Google Keep 深度资产卡。

前端应该按它自己的规则处理，不要当成普通原始文档，也不要按手机视觉卡规则处理。

### 3. `mobile_capture_asset_card_v1`

判断条件：

```json
{
  "docKind": "asset_card",
  "cardSchema": "mobile_capture_asset_card_v1"
}
```

处理方式：

- 继续按当前已经约定的统一 detail payload 处理
- 不需要额外改规则
- 直接使用：
  - `title`
  - `summary`
  - `imageRefs`
  - `detail.meta`
  - `detail.blocks`

## 三、`deep_asset_card_v1` 的解析规则

这是前端这次最需要注意的部分。

后端当前不是任意解析整张 Markdown，而是只稳定抽取 3 个关键字段：

- `核心观点`
- `意图识别`
- `认知资产`

这些字段来自卡正文里的固定格式行。

后端当前使用的真实匹配规则是：

```md
> **核心观点**：...
> **意图识别**：...
> **认知资产**：...
```

也就是说，只有当文本行接近这个结构时，后端才会稳定提取。

它不是宽松的自然语言理解抽取，而是明确依赖这三个标签。

### 后端当前提取方法

后端正则匹配的是这类行：

- 行首是 `>`
- 后面是粗体标签
- 标签必须是下面三个之一
  - `核心观点`
  - `意图识别`
  - `认知资产`
- 中间使用中文冒号 `：`

后端只取每个标签的第一个命中值。

所以前端对 `deep_asset_card_v1` 的处理应该建立在这三个字段上，而不是重新去扫全文。

## 四、前端如何处理 `deep_asset_card_v1`

### 列表页

优先使用：

- `title`
- `summary`
- `subtitle`

其中当前后端给列表页的映射是：

- `summary` 优先来自 `coreView`
- `subtitle` 会优先拼接：
  - `intent`
  - `cognitiveAsset`
  - `categoryPath`

如果没有这些字段，才会退回其他信息。

所以对 `deep_asset_card_v1`，列表页不需要自己再解析。

直接用搜索接口返回的：

- `summary`
- `subtitle`

就行。

### 详情页

建议优先展示：

1. `detail.highlights.coreView`
2. `detail.highlights.intent`
3. `detail.highlights.cognitiveAsset`
4. `detail.blocks`
5. 如有需要，再展示 `markdown`

也就是说，前端应该把 `deep_asset_card_v1` 看成：

- 上面有 3 个高价值摘要字段
- 下面有全文块结构

推荐 UI 顺序：

1. 标题
2. 三个高价值字段
3. 块结构正文

### 为空时怎么处理

如果以下字段为空字符串：

- `detail.highlights.coreView`
- `detail.highlights.intent`
- `detail.highlights.cognitiveAsset`

前端不要显示空占位字段。

这时直接展示：

- `detail.blocks`
- 或 `markdown`

## 五、`mobile_capture_asset_card_v1` 的处理

这个不用改，继续按你们现在的实现：

- 列表页：
  - `title`
  - `summary`
  - `imageRefs[0]`
  - `detail.meta.contentCompleteness`
- 详情页：
  - `title`
  - `summary`
  - `imageRefs`
  - `cardCreatedAt`
  - `detail.blocks`
  - 必要时展示 `markdown`

它和 `deep_asset_card_v1` 的区别是：

- `deep_asset_card_v1` 的重点是 `highlights`
- `mobile_capture_asset_card_v1` 的重点是 `blocks + meta + imageRefs`

## 六、推荐前端分流逻辑

建议前端写成明确分流：

```ts
if (docKind !== "asset_card") {
  renderRawDocument(card)
} else if (cardSchema === "deep_asset_card_v1") {
  renderDeepAssetCard(card)
} else if (cardSchema === "mobile_capture_asset_card_v1") {
  renderMobileCaptureCard(card)
} else {
  renderGenericAssetCard(card)
}
```

## 七、通用兜底规则

如果未来出现新的资产卡 schema，前端暂时还没专门适配：

- 仍按 `asset_card` 处理
- 直接展示：
  - `title`
  - `summary`
  - `detail.blocks`
  - `markdown`

不要因为 schema 未知就把它当原始文档。

更稳的兜底原则是：

- `raw_text`：直接展示原文
- `asset_card`：优先展示摘要和块结构

## 八、一句话规则

前端当前只需要这样记：

- `raw_text`：直接展示，不解析
- `deep_asset_card_v1`：优先按 `核心观点 / 意图识别 / 认知资产` 这 3 个字段展示
- `mobile_capture_asset_card_v1`：按当前统一 detail payload 展示，不用改

补充：

- 所有新的用户态读请求都应带上当前 `namespaceId`
