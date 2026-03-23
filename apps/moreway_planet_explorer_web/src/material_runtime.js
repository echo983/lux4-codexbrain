import * as THREE from 'three';

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
  let openaiMaterialTexture = null;
  let currentTextureMode = 'openai_materials';

  async function loadExternalTexture(url) {
    if (textureCache.has(url)) {
      return textureCache.get(url);
    }
    const texture = await new Promise((resolve, reject) => {
      textureLoader.load(
        url,
        (loaded) => resolve(loaded),
        undefined,
        (err) => reject(err || new Error(`failed to load texture: ${url}`)),
      );
    });
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    textureCache.set(url, texture);
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
          planet.material.needsUpdate = true;
        }
        return;
      }
      if (mode === 'openai_materials') {
        const manifest = manifestRef();
        if (!manifest?.planet?.surface_map) {
          throw new Error('surface_map unavailable');
        }
        if (!openaiMaterialTexture) {
          const bakedUrl = bakedTextureUrl('openai_materials');
          if (bakedUrl) {
            setStatus('正在加载 OpenAI 预烘焙地表材质…');
            openaiMaterialTexture = await loadExternalTexture(bakedUrl);
          } else {
            setStatus('正在构建 OpenAI 地表材质…');
            openaiMaterialTexture = await buildPlanetMaterialTexture(
              manifest.planet.surface_map,
              '/var/openai_image_experiments/materials',
            );
          }
        }
        if (currentTextureMode !== mode) return;
        planet.material.map = openaiMaterialTexture;
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
