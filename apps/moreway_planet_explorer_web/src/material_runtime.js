import * as THREE from 'three';
import { BAKE_CHANNELS, OPENAI_MATERIAL_ASSET_BASE, bakedTextureKey } from './material_assets.js';

export function createMaterialRuntime({
  dataSetBase,
  manifestRef,
  planet,
  textureLoader,
  buildPlanetMaterialTexture,
  setStatus,
  onFallbackMode,
}) {
  const textureCache = new Map();
  let baseSurfaceTexture = null;
  let openaiMaterialTextures = null;
  let currentTextureMode = 'openai_materials';

  async function loadExternalTexture(url, { colorSpace = THREE.NoColorSpace } = {}) {
    const cacheKey = `${url}::${colorSpace}`;
    if (textureCache.has(cacheKey)) {
      return textureCache.get(cacheKey);
    }
    const texture = await new Promise((resolve, reject) => {
      textureLoader.load(
        url,
        (loaded) => resolve(loaded),
        undefined,
        (err) => reject(err || new Error(`failed to load texture: ${url}`)),
      );
    });
    texture.colorSpace = colorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    textureCache.set(cacheKey, texture);
    return texture;
  }

  function bakedTextureUrl(mode) {
    const manifest = manifestRef();
    const relative = manifest?.planet?.baked_textures?.[mode];
    if (relative) {
      return `${dataSetBase}/${relative}`;
    }
    if (!manifest?.build_id) return '';
    return `${dataSetBase}/builds/${manifest.build_id}/textures/${mode}.png`;
  }

  async function applyPlanetTextureMode(mode) {
    currentTextureMode = mode;
    try {
      if (mode === 'surface_map') {
        if (baseSurfaceTexture) {
          planet.material.map = baseSurfaceTexture;
          planet.material.normalMap = null;
          planet.material.roughnessMap = null;
          planet.material.needsUpdate = true;
        }
        return;
      }
      if (mode === 'openai_materials') {
        const manifest = manifestRef();
        if (!manifest?.planet?.surface_map) {
          throw new Error('surface_map unavailable');
        }
        if (!openaiMaterialTextures) {
          const bakedUrls = Object.fromEntries(
            BAKE_CHANNELS.map(({ channel }) => [channel, bakedTextureUrl(bakedTextureKey('openai_materials', channel))]),
          );
          if (Object.values(bakedUrls).every(Boolean)) {
            setStatus('正在加载 OpenAI 预烘焙地表材质…');
            const [map, normalMap, roughnessMap] = await Promise.all([
              loadExternalTexture(bakedUrls.albedo, { colorSpace: THREE.SRGBColorSpace }),
              loadExternalTexture(bakedUrls.normal),
              loadExternalTexture(bakedUrls.roughness),
            ]);
            openaiMaterialTextures = { map, normalMap, roughnessMap };
          } else {
            setStatus('正在构建 OpenAI 地表材质…');
            const map = await buildPlanetMaterialTexture(
              manifest.planet.surface_map,
              OPENAI_MATERIAL_ASSET_BASE,
            );
            openaiMaterialTextures = { map, normalMap: null, roughnessMap: null };
          }
        }
        if (currentTextureMode !== mode) return;
        planet.material.map = openaiMaterialTextures.map;
        planet.material.normalMap = openaiMaterialTextures.normalMap;
        planet.material.roughnessMap = openaiMaterialTextures.roughnessMap;
        planet.material.needsUpdate = true;
        return;
      }
      throw new Error(`unknown texture mode: ${mode}`);
    } catch (error) {
      setStatus(`OpenAI 材质不可用，已降级原始贴图：${error.message}`);
      currentTextureMode = 'surface_map';
      onFallbackMode('surface_map');
      if (baseSurfaceTexture) {
        planet.material.map = baseSurfaceTexture;
        planet.material.normalMap = null;
        planet.material.roughnessMap = null;
        planet.material.needsUpdate = true;
      }
    }
  }

  return {
    getCurrentTextureMode: () => currentTextureMode,
    setBaseSurfaceTexture: (texture) => {
      baseSurfaceTexture = texture;
    },
    applyPlanetTextureMode,
  };
}
