# Mobile Capture Asset Card Architecture

本文档定义面向手机随手拍视觉信息的对象级资产卡方案。

目标对象包括但不限于：

- 公告
- 菜单
- 名片
- 广告
- 海报
- 药盒
- 医院单据
- 其他手机拍到的文字密集或版面型现实对象

该方案的核心约束：

- 对象是一级单位，图片不是
- 同一对象的多图分组由采集者明确指定，系统不自动聚类
- 输入不完整时允许输出不完整，不做事实补全
- 默认追求工程可用、成本可控、速度可接受

## Schema

最终对象级资产卡使用：

```yaml
doc_kind: asset_card
card_schema: mobile_capture_asset_card_v1
source_type: mobile_photo_group
```

## Why A Separate Daemon

该能力应作为独立写入服务存在，而不是挂到：

- `moreway_search_service`
- `lux4_daemon`

原因：

- 它不是搜索职责，而是 ingest / generation / persistence 职责
- `lux4` 只是未来调用方之一，不应成为服务归属边界
- 该链路会包含图像输入、LLM 生成、embedding、LanceDB upsert，天然比只读搜索更重

推荐新服务：

- `visual_asset_card_service`

推荐目录：

- `src/visual_asset_card_service/__main__.py`
- `src/visual_asset_card_service/app.py`
- `src/visual_asset_card_service/http.py`
- `src/visual_asset_card_service/service.py`
- `src/visual_asset_card_service/config.py`

## High-Level Flow

```text
Android / Cloudflare Worker
↓
visual_asset_card_service
↓
store uploaded images in NBSS
↓
LLM input assembly
↓
Object-level card generation
↓
Frontmatter + metadata completion
↓
Embedding
↓
LanceDB document upsert
↓
moreway_search_service / Moreway Planet / other readers
```

## Core Data Objects

建议明确 2 个持久化对象，以及 1 个请求内临时结构。

### 1. StoredCaptureImage

单张留档图，块数据保存在 NBSS。

建议字段：

```yaml
image_fid:
sha256:
capture_time:
import_time:
width:
height:
mime_type:
```

原则：

- Android 端先做裁切、顺序整理和基础压缩，再上传图片字节
- 后端不保留手机原始全分辨率照片
- 后端仅保留可分析、可回看的压缩留档图
- 留档图同时服务于 LLM 分析和人工复核
- 图像块数据进入 NBSS，不写本地磁盘文件

### 2. RequestGroup

一次请求内的临时组结构，不单独持久化。

建议字段：

```yaml
group_note:
object_hint:
group_images:
  - image_bytes:
    order:
    role:
```

说明：

- `order` 很重要，必须由采集端保留
- `role` 可选，例如 `front_1`、`back_1`、`detail_1`
- `object_hint` 可选，例如 `菜单`、`公告`、`名片`
- 该结构只服务于本次 ingest，不作为独立资源存储
- 服务端可以为本次请求生成 `capture_group_id` 并写入最终 card metadata

### 3. AssetCard

最终检索对象。

建议字段：

```yaml
card_id:
card_schema:
capture_group_id:
markdown_body:
metadata:
embedding:
```

原则：

- 资产卡文档不写本地 markdown 文件
- 资产卡全文、metadata、vector 直接写入 LanceDB

## Service Modules

建议拆成 6 个模块。

### M1. Request Ingest

职责：

- 接收采集者明确指定的一组图片
- 接收图片字节
- 校验组内顺序、可选角色和人工备注
- 规范化请求体

建议接口：

```text
POST /api/v1/visual-cards
```

### M2. Image Storage

职责：

- 留档图入库存储
- 生成稳定引用
- 记录 sha256、尺寸、时间等基础信息

原则：

- 不保留原始全分辨率手机照片
- 仅保留压缩后的留档图
- 后续分析和前端回看都依赖留档图引用
- 留档图块数据进入 NBSS

### M3. Group Metadata

职责：

- 在本次请求上下文中维护组关系
- 生成最终写入 card metadata 的组级字段

该层不单独持久化为独立资源。

### M4. Image Normalize

职责：

- 将手机端上传的留档图规格化为模型输入

推荐只做轻量操作：

- 长边控制在约 `1280` 到 `1600 px`
- 必要时再做一次轻量压缩
- 轻微对比度增强
- 可选自动旋正

不做重型视觉管线：

- 不做复杂透视矫正
- 不做自动分块 OCR 拼接
- 不做自动聚类

工程建议：

- Android 上传的图如果已经满足规格，可以直接进入 LLM 输入构造
- 不额外引入独立 `AnalysisImage` 对象
- 不保留“原图”和“分析图”两套文件
- v1 不做图像增强策略分支

### M5. LLM Input Builder

职责：

- 将一组图片组装成单次模型输入
- 明确告诉模型这是一组同一对象的分段照片

推荐输入结构：

```text
对象组 ID: cg_xxx
对象提示: 菜单
用户备注: 正面两张，反面两张

图片顺序：
1. 图1：front_1
2. 图2：front_2
3. 图3：back_1
4. 图4：back_2
```

### M6. Card Generator + Persistence

职责：

- 调用多模态 LLM
- 生成对象级资产卡正文
- 直接完成 embedding 和 LanceDB upsert

硬要求：

- 多图视为同一对象
- 只写可见内容
- 输入不完整时允许输出不完整
- 明确记录缺失范围、不确定性和风险

建议正文区块：

```markdown
# 这是什么
# 直接可见信息
# 关键信息提炼
# 限制与风险
```

建议最小 frontmatter：

```yaml
doc_kind: asset_card
card_schema: mobile_capture_asset_card_v1
source_type: mobile_photo_group
capture_group_id: cg_xxx
group_image_fids: [fid_a, fid_b]
group_size: 2
group_note: "公告上半张和下半张"
object_hint: "公告"
content_completeness: partial
observation_confidence: medium
```

说明：

- `interpretation_confidence` 在 v1 先不上
- 卡片文档不落本地磁盘
- 图像块数据与文档索引分别进入 NBSS 和 LanceDB

### Search & Render

职责：

- 搜索时按 `asset_card` 处理
- 前端优先展示对象级结果，而不是单图结果

前端建议突出：

- 这是什么
- 关键信息提炼
- 检索锚点
- 限制与风险
- 留档图数量
- 回看组内留档图入口
- 完整性标记

## API Shape

建议最小实时接口：

```text
POST /api/v1/visual-cards
```

请求体建议：

```json
{
  "objectHint": "菜单",
  "groupNote": "正面两张，反面两张",
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
  ],
  "sourceClient": "android-apk"
}
```

响应体建议：

```json
{
  "ok": true,
  "cardId": "mobile_capture_xxx",
  "cardSchema": "mobile_capture_asset_card_v1",
  "status": "written",
  "captureGroupId": "cg_xxx",
  "groupImageFids": ["NBSS:0xAAA", "NBSS:0xBBB"],
  "rowsWritten": 1
}
```

说明：

- `captureGroupId` 由服务端为本次请求生成
- `groupImageFids` 是服务端写入 NBSS 后返回的图像引用

v1 仅提供：

- `POST /api/v1/visual-cards`
- `GET /healthz`

v1 不提供以下接口：

- `GET /api/v1/visual-cards/{card_id}`
- `POST /api/v1/visual-cards/preview`

## Failure Policy

必须允许部分成功。

### Partial success

例如：

- 能识别对象类别
- 但正文提取不完整

仍然出卡，但 metadata 标记：

```yaml
content_completeness: partial
observation_confidence: low
```

### Explicit low-confidence output

例如：

- 图像过糊
- 过暗
- 严重遮挡

也允许写卡，但正文必须诚实：

```markdown
# 这是什么
无法高置信识别的手机拍照信息对象。

# 直接可见信息
仅能看出局部文字或版面，无法可靠提取完整正文。

# 限制与风险
图像模糊严重，当前结果不可作为可靠转写。
```

## Android APK Responsibilities

Android 端应承担采集端职责，不承担知识生成职责。

推荐 Android 负责：

- 让用户明确指定多图属于同一对象
- 维护组内顺序
- 可选填写 `object_hint`
- 可选填写 `group_note`
- 采集拍照时间、设备基础元数据
- 上传裁切压缩后的留档图
- 展示上传状态、失败重试和组内预览

Android 端不建议负责：

- 自动聚类同一对象
- 最终资产卡生成
- embedding
- LanceDB 写入
- 最终检索逻辑
- 复杂视觉后处理

推荐 Android 最小交互：

1. 用户创建一个对象组
2. 连续加入 1~N 张图片
3. 调整顺序
4. 选填对象提示
5. 选填备注
6. 点击上传

## Backend Responsibilities

后端 daemon 负责：

- 接收 visual card ingest 请求
- 校验 payload
- 将留档图写入 NBSS，并保存图像引用与组元数据
- 构造多图 LLM 输入
- 生成 `mobile_capture_asset_card_v1`
- embedding
- LanceDB upsert
- 对外暴露状态与错误信息

## Recommended Build Order

### Phase 1

- `visual_asset_card_service` daemon skeleton
- `POST /api/v1/visual-cards`
- `GET /healthz`
- NBSS image persistence
- stored capture image normalization
- LLM card generation
- LanceDB upsert

### Phase 2

- stored image gallery support
- front-end card rendering for new schema
- completeness display

### Phase 3

- richer metadata
- optional OCR assist path
- human review path
- rate limiting / auth / quota

## Immediate Engineering Plan

仓库内建议先做以下最小闭环：

1. 新建 `src/visual_asset_card_service/`
2. 提供 HTTP daemon 骨架
3. 定义 `mobile_capture_asset_card_v1` frontmatter
4. 先支持输入为已排序的留档图片字节，而不是先做复杂 APK 上传协议
5. 先直接 upsert LanceDB
6. 再让 `moreway_search_service` 认识新 schema 并展示

一句话总结：

**采集端负责明确“这几张图是同一个对象”，后端 daemon 负责把整组图写入 NBSS、生成一张诚实的不补全现实的对象级资产卡，并直接写入 LanceDB 检索系统。**
