# Moreway Planet Material Pipeline

`Moreway Planet` 现在已经不是“页面打开时现场拼材质”的实验原型，而是一个分层的正式处理流程。

## 目标

- 地貌真相来自知识库数据，而不是图像模型自由发挥
- 视觉材质当前正式只使用 OpenAI 材质源
- 页面打开时优先秒级加载预烘焙贴图，不把重计算压到用户首屏

## 分层职责

### 1. 数据层

负责决定星球的几何和地表分区：

- LanceDB 文档向量
- UMAP 3D 降维
- 球壳映射
- 社区聚类与大陆生成
- `surface_map`

这部分由：

- [build_moreway_planet_dataset.py](/root/lux4-codexbrain/scripts/build_moreway_planet_dataset.py)
- [src.moreway_planet_explorer.build_utils](/root/lux4-codexbrain/src/moreway_planet_explorer/build_utils.py)

完成。

### 2. 材质源层

负责生成可复用的地形材质瓦片，不决定大陆形状。

当前正式材质源：

- OpenAI 材质源
  - 正式资产目录：`var/planet_material_assets/openai/v1/`
  - 实验生成目录：`var/openai_image_experiments/materials/`
    - 仅作为素材产出源，随后同步进正式资产库

当前正式材质类别：

- `deep_ocean`
- `mid_ocean`
- `shallow_ocean`
- `coastal_water`
- `coast_wet`
- `coast_dry`
- `lowland_grass`
- `lowland_forest`
- `upland_temperate`
- `upland_dry`
- `mountain_rock`
- `mountain_snow`
- `north_pole`
- `south_pole`

正式资产库里每个 family 目录下按通道命名，例如：

- `deep_ocean/albedo_01.png`
- `deep_ocean/albedo_02.png`
- `deep_ocean/albedo_03.png`

OpenAI 材质源生成与实验：

- [openai_image_generate.py](/root/lux4-codexbrain/scripts/openai_image_generate.py)
- [openai_planet_texture_experiment.py](/root/lux4-codexbrain/scripts/openai_planet_texture_experiment.py)
- [openai_planet_material_set_experiment.py](/root/lux4-codexbrain/scripts/openai_planet_material_set_experiment.py)
- [sync_openai_planet_material_asset_set.py](/root/lux4-codexbrain/scripts/sync_openai_planet_material_asset_set.py)

### 3. 离线预烘焙层

负责把：

- `surface_map`
- 材质瓦片

组合成最终可直接上屏的 planet texture PNG。

脚本：

- [bake_moreway_planet_material_textures.py](/root/lux4-codexbrain/scripts/bake_moreway_planet_material_textures.py)

输出位置：

- `var/moreway_planet_dataset/builds/<build_id>/textures/openai_materials.png`

同时会把贴图路径回写到：

- `manifest.json`
  - `planet.baked_textures`

### 4. 前端显示层

前端优先读取预烘焙贴图：

- `manifest.planet.baked_textures`

如果 manifest 还没写回，也会按约定路径尝试：

- `builds/<build_id>/textures/<mode>.png`

只有缓存缺失时，才回退到浏览器内运行时合成。

对应前端入口：

- [main.js](/root/lux4-codexbrain/apps/moreway_planet_explorer_web/src/main.js)

## 正式处理流程

### 日常更新流程

1. 新文档进入 LanceDB
2. 运行 [build_moreway_planet_dataset.py](/root/lux4-codexbrain/scripts/build_moreway_planet_dataset.py)
3. 脚本生成新的：
   - Arrow chunks
   - `manifest.json`
   - 预烘焙材质贴图
4. 更新 `latest.json`
5. 前端读取新 build，直接加载缓存贴图

### 无变化时

如果 `source_signature` 没变：

- `build_moreway_planet_dataset.py` 会跳过
- 也不会重建 dataset
- 也不会重新烘焙贴图

### 数据变化时是否要重新付模型费用

不一定。

如果只是知识库数据变化，但材质源没变：

- 只需要重新构建 dataset
- 只需要重新烘焙最终贴图
- 不需要重新调用 OpenAI 生成材质瓦片

只有在你想重新做材质源时，才需要重新付模型调用成本。

## 当前默认使用方式

前端默认地表模式：

- `OpenAI 材质`

如果不可用：

- 自动降级到 `原始贴图`

## 为什么这样设计

原来的运行时流程会在浏览器里做两件重活：

- 下载整套材质图
- 逐像素合成整张 planet texture

这会把十秒级等待压到用户首屏。

现在的正式流程把重成本移动到离线阶段：

- 构建时慢一点可以接受
- 用户打开页面时应尽量接近秒开

这就是当前正式架构的核心取舍。
