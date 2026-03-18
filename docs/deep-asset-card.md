# Deep Asset Card for Google Keep Notes

This document defines the repository-standard Deep Asset Card used for Google Keep note retrieval.

The Deep Asset Card is the **only** content that is embedded and stored in the vector index for Keep-note retrieval.

The original Keep note data remains the source of truth, but retrieval happens through the card.

## Purpose

The card should maximize future recall quality by combining:

- hard-filter metadata
- semantic interpretation
- raw source excerpts
- retrieval anchors
- source-asset linkage

## Source of Truth

For each Keep note:

1. The Keep `.json` is converted to `.md`.
2. The generated `.md` is the source material for LLM card generation.
3. The card markdown is embedded and stored in LanceDB.

The original Keep JSON is **not** embedded directly.

## Required Source Linkage

Each card must carry the internal source identifiers for the note and its siblings.

These fields are mandatory in metadata:

- `source_type`
- `source_snapshot_fid`
- `keep_json_fid`
- `keep_md_fid`
- `keep_html_fid`
- `attachment_fids`
- `path_in_snapshot`
- `note_title`

Notes:

- These must be internal filesystem or NBSS identifiers.
- External URLs are not substitutes for source linkage.
- If a note has no attachments, `attachment_fids` should be an empty list.

## Token Budget

The generated card may be long if useful for recall, but it must stay under:

- **8K tokens**

This cap should be enforced by the pipeline, not only by prompt wording.

## Card Structure

Template:

```md
---
# Metadata Layer: for hard filtering
id: keep_20260318_001
source_type: google_keep
tags: [装修, 灯具, 选型决策]
retrieval_terms: [3000K, 客厅主灯, 居然之家, 老李推荐, 灯具比价]
category_path: "生活/家居/硬装/照明"
created_at: 2026-03-18
priority: "决策参考"

source_snapshot_fid: NBSS:0x...
keep_json_fid: NBSS:0x...
keep_md_fid: NBSS:0x...
keep_html_fid: NBSS:0x...
attachment_fids: []
path_in_snapshot: "客厅灯具选型.json"
note_title: "客厅灯具选型"
---

# [Title] 客厅灯具选型：3000K 色温偏好与渠道锁定

> ### 🧠 资产解读 (Interpretation & Perspective)
> **核心观点**：用户在灯具色温上已形成明确偏好（3000K），倾向于通过“熟人推荐+线下体验”的模式进行决策。
> **意图识别**：处于装修决策的中后期，正在进行具体的选品对比和价格核算。
> **认知资产**：建立了“3000K = 理想氛围”的审美标准。

## 📝 原始内容 (Raw Content)
- [x] 主灯：3000K 暖白光
- [ ] 射灯：重点照亮背景墙
- **备注**：老李说那家店在居然之家二楼，记得去对比下价格。

## 🔍 召回增强 (Retrieval Anchors)
- **提及实体**：老李 (推荐源), 居然之家 (线下渠道), 3000K (关键技术参数)
- **关联场景**：客厅装修、氛围营造、价格比对
- **来源上下文**：Google Keep (手机端随手记)
```

## Recommended Metadata Fields

These fields should be present when possible:

- `id`
- `source_type`
- `tags`
- `retrieval_terms`
- `category_path`
- `created_at`
- `priority`
- `source_snapshot_fid`
- `keep_json_fid`
- `keep_md_fid`
- `keep_html_fid`
- `attachment_fids`
- `path_in_snapshot`
- `note_title`

## Generation Pipeline

Recommended pipeline:

1. Confirm the snapshot is a Google Keep takeout snapshot.
2. Resolve each note's source linkage:
   - `.json`
   - `.md`
   - `.html`
   - attachments
3. Convert Keep JSON to Markdown.
4. Call LLM on the Markdown source to generate the Deep Asset Card.
   - default generation parallelism: `32`
   - configurable
5. Embed the final card markdown.
   - default embedding parallelism: `32`
   - configurable
6. Store into LanceDB with:
   - card markdown
   - vector
   - metadata

## Why This Design

This design improves recall by ensuring that the vectorized content is:

- semantically enriched
- structurally stable
- tied to the original note assets
- suitable for both hard filtering and semantic search

It also prevents raw, messy note exports from becoming the direct retrieval surface.
