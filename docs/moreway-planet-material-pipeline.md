# Moreway Planet Material Pipeline

`Moreway Planet` 现在已经不是“页面打开时现场拼材质”的实验原型，而是一个分层的正式处理流程。

## 目标

- 地貌真相来自知识库数据，而不是图像模型自由发挥
- 视觉材质可以来自不同模型源，例如 OpenAI 或 Cloudflare FLUX
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

当前有两套正式材质源：

- OpenAI 材质源
  - 目录：`var/openai_image_experiments/materials/`
- Cloudflare FLUX 材质源
  - 目录：`var/cloudflare_image_experiments/materials/`

当前使用的材质类别：

- `deep_ocean`
- `shallow_ocean`
- `coast`
- `lowland`
- `upland`
- `mountain_snow`
- `north_pole`
- `south_pole`

其中主材质允许存在多个变体，例如：

- `deep_ocean.png`
- `deep_ocean_02.png`
- `deep_ocean_03.png`

Cloudflare 正式生成脚本：

- [cloudflare_flux_image_generate.py](/root/lux4-codexbrain/scripts/cloudflare_flux_image_generate.py)
- [cloudflare_planet_material_set_experiment.py](/root/lux4-codexbrain/scripts/cloudflare_planet_material_set_experiment.py)

说明：

- 虽然文件名里保留了 `experiment`，但当前这条链已经被正式纳入处理流程。
- 这些脚本的职责已经稳定，不再只是一次性 smoke。

### 3. 离线预烘焙层

负责把：

- `surface_map`
- 材质瓦片

组合成最终可直接上屏的 planet texture PNG。

脚本：

- [bake_moreway_planet_material_textures.py](/root/lux4-codexbrain/scripts/bake_moreway_planet_material_textures.py)

输出位置：

- `var/moreway_planet_dataset/builds/<build_id>/textures/openai_materials.png`
- `var/moreway_planet_dataset/builds/<build_id>/textures/cloudflare_materials.png`

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
- 不需要重新调用 OpenAI / Cloudflare 生成材质瓦片

只有在你想重新做材质源时，才需要重新付模型调用成本。

## 当前默认使用方式

前端默认地表模式：

- `OpenAI 材质`

如果不可用：

- 自动降级到 `原始贴图`

前端也支持：

- `Cloudflare 材质`

用于效果对比。

## 为什么这样设计

原来的运行时流程会在浏览器里做两件重活：

- 下载整套材质图
- 逐像素合成整张 planet texture

这会把十秒级等待压到用户首屏。

现在的正式流程把重成本移动到离线阶段：

- 构建时慢一点可以接受
- 用户打开页面时应尽量接近秒开

这就是当前正式架构的核心取舍。
