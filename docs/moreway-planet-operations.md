# Moreway Planet Operations

这份文档只关注日常操作，不解释底层设计细节。

## 1. 新知识更新后怎么刷新

标准做法：

```bash
cd /root/lux4-codexbrain
python3 scripts/run_moreway_planet_refresh.py --tables google_keep_asset_cards_directmd_eval200
```

这一步会：

- 检查源数据签名是否变化
- 有变化时重建 planet dataset
- 离线重烘焙 planet 贴图缓存
- 没变化时自动跳过

## 2. 如何强制重建

```bash
cd /root/lux4-codexbrain
python3 scripts/run_moreway_planet_refresh.py --tables google_keep_asset_cards_directmd_eval200 --force
```

适用于：

- 你更新了材质源，但数据行数没变
- 你想强制重烘焙贴图
- 你想做一次完整确认

## 3. 如何查看当前状态

```bash
cd /root/lux4-codexbrain
python3 scripts/check_moreway_planet_status.py
```

输出会包含：

- 当前 `build_id`
- `source_signature`
- 文档数和 chunk 数
- `surface_map` 是否存在
- `openai_materials` / `cloudflare_materials` 贴图缓存是否存在
- 前端是否能通过 HTTP 访问关键资源

## 4. 关键文件

当前 build 入口：

- [run_moreway_planet_refresh.py](/root/lux4-codexbrain/scripts/run_moreway_planet_refresh.py)

底层 dataset build：

- [build_moreway_planet_dataset.py](/root/lux4-codexbrain/scripts/build_moreway_planet_dataset.py)

贴图离线预烘焙：

- [bake_moreway_planet_material_textures.py](/root/lux4-codexbrain/scripts/bake_moreway_planet_material_textures.py)

状态检查：

- [check_moreway_planet_status.py](/root/lux4-codexbrain/scripts/check_moreway_planet_status.py)

当前 latest：

- `var/moreway_planet_dataset/latest.json`

当前 build manifest：

- `var/moreway_planet_dataset/builds/<build_id>/manifest.json`

缓存贴图：

- `var/moreway_planet_dataset/builds/<build_id>/textures/openai_materials.png`
- `var/moreway_planet_dataset/builds/<build_id>/textures/cloudflare_materials.png`

## 5. 什么时候需要重新付模型费用

仅当你想重新生成材质源时。

例如：

- 重新生成 OpenAI 材质瓦片
- 重新生成 Cloudflare FLUX 材质瓦片
- 更换视觉风格

如果只是知识数据变化：

- 不需要重新调用图像模型
- 只需要重建 dataset 和重烘焙最终贴图

## 6. 建议的 cron 入口

正式 cron 建议调用：

```bash
cd /root/lux4-codexbrain
python3 scripts/run_cron_moreway_planet_build.py
```

它内部仍然复用正式 dataset build。

如果以后希望人和 cron 完全统一入口，也可以改成直接调用：

```bash
python3 scripts/run_moreway_planet_refresh.py
```

当前两者都成立。
