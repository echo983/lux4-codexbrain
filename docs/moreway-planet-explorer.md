# Moreway Planet Explorer

`moreway_planet_explorer` 是一个新的子项目，用于把 LanceDB 中的文档映射到浏览器中的可交互虚拟星球上，供用户探索式发现。

## 目标

- 在浏览器中提供一个可旋转、缩放、探索的星球界面。
- 把 LanceDB 中的文档向量统一降到 3D。
- 将 3D 空间映射到球壳表面附近，而不是简单平面散点图。
- 用 `Apache Arrow + 自定义八叉树` 进行空间分块，按需加载数据。
- 用 cron 固定间隔检测数据变化，并在需要时重建探索数据集。

## 第一版设计取舍

第一版遵循这几个明确原则：

- 默认收录所有非 `_smoke` LanceDB 表。
- 默认保留 UMAP 的 3D 空间关系，再映射到球壳表面，不把点直接粗暴压扁到球皮。
- 默认以前端视角触发分块加载，而不是一次性把全部点送到浏览器。
- cron 第一版做“变更检测 + 必要时全量重建”，不宣称已经实现真正的在线增量 UMAP。

## 参考来源

视觉和交互参考：

- [refs/threejs-procedural-planets](/root/lux4-codexbrain/refs/threejs-procedural-planets)

重点借鉴：

- `Three.js`
- `OrbitControls`
- 球体与大气层表现
- Vite 前端项目结构

## 子项目结构

- `src/moreway_planet_explorer/`
  - Python 构建逻辑与八叉树帮助函数
- `scripts/build_moreway_planet_dataset.py`
  - 离线构建入口
- `scripts/run_cron_moreway_planet_build.py`
  - cron 入口
- `apps/moreway_planet_explorer_web/`
  - 浏览器端星球探索界面

## 数据流

### 1. 离线构建

输入：

- LanceDB 中的文档
- 默认包含字段：
  - `id`
  - `text`
  - `vector`
  - `metadata`

处理步骤：

1. 读取目标表的全部文档。
2. 过滤掉无向量的文档。
3. 以向量做 UMAP 降维，得到 3D 坐标。
4. 计算局部密度。
5. 将 3D 坐标映射到球壳表面：
   - 方向来自降维后的 3D 向量方向
   - 半径由局部密度调节
6. 对球壳坐标建立八叉树。
7. 将叶子节点写成多个 `.arrow` 文件。
8. 生成 `manifest.json` 和 `latest.json`。

输出：

- `builds/<build_id>/manifest.json`
- `builds/<build_id>/chunks/*.arrow`
- `latest.json`

### 2. 浏览器探索

浏览器加载：

1. `latest.json`
2. 当前 build 的 `manifest.json`
3. 根据相机方向和距离按需请求 `.arrow` chunk
4. 将文档点绘制在星球表面附近
5. 用户 hover / click 查看文档信息

## Manifest 结构

`manifest.json` 第一版包含：

- `build_id`
- `generated_at`
- `source_tables`
- `document_count`
- `octree`
- `chunks`
- `bounds`
- `planet`

每个 chunk 至少包含：

- `chunk_id`
- `path`
- `point_count`
- `bounds`
- `center`
- `depth`

## 每条文档点的最小字段

每个点写入 Arrow 时保留：

- `doc_id`
- `table`
- `title`
- `doc_kind`
- `source_type`
- `card_schema`
- `created_at`
- `path_in_snapshot`
- `keep_md_fid`
- `surface_x`
- `surface_y`
- `surface_z`
- `umap_x`
- `umap_y`
- `umap_z`
- `density`
- `text_preview`

## 增量策略

第一版增量策略：

- 读取目标 LanceDB 表名和基础统计
- 生成一个 source signature
- 若 signature 未变化，则跳过构建
- 若 signature 变化，则重建整个可视化数据集

这是一种“变更检测 + 全量重建”策略，不是严格的在线增量 UMAP。

## cron

推荐固定间隔执行：

- 每小时或每 4 小时执行一次
- 仅在 source signature 变化时重建

cron 入口：

- [build_moreway_planet_dataset.py](/root/lux4-codexbrain/scripts/build_moreway_planet_dataset.py)
- [run_cron_moreway_planet_build.py](/root/lux4-codexbrain/scripts/run_cron_moreway_planet_build.py)

## 第一版边界

第一版暂不做：

- 真正在线增量 UMAP
- 文档聚类标签自动命名
- 复杂搜索和筛选 UI
- 多星球 / 多图层世界观

第一版先做到：

- 星球可交互
- 数据可加载
- 文档可探索
- 构建链路可持续重建
