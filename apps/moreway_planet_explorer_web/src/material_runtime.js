import * as THREE from 'three';
import materialRules from './material_rules.json' with { type: 'json' };
import {
  BAKE_CHANNELS,
  DEFAULT_TEXTURE_MODE,
  getBakedTextureUrls,
  getTextureModeSpec,
} from './material_assets.js';

export function createMaterialRuntime({
  dataSetBase,
  manifestRef,
  planet,
  textureLoader,
  buildPlanetMaterialTexture,
  createPlanetShaderMaterial,
  createSurfaceDataTexture,
  setStatus,
  onFallbackMode,
}) {
  const textureCache = new Map();
  let baseSurfaceTexture = null;
  let openaiMaterialTextures = null;
  let currentTextureMode = DEFAULT_TEXTURE_MODE;
  
  const originalMaterial = planet.material;
  let shaderMaterial = null;

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

  function applyTextureSet(textureSet) {
    if (planet.material !== originalMaterial) {
      planet.material = originalMaterial;
    }
    BAKE_CHANNELS.forEach(({ materialProperty, channel }) => {
      planet.material[materialProperty] = textureSet?.[channel] ?? null;
    });
    planet.material.needsUpdate = true;
  }

  async function loadBakedTextureSet(mode) {
    const urls = getBakedTextureUrls({
      dataSetBase,
      manifest: manifestRef(),
      mode,
    });
    if (!urls || !Object.values(urls).every(Boolean)) {
      return null;
    }
    setStatus('正在加载 OpenAI 预烘焙地表材质…');
    const entries = await Promise.all(
      BAKE_CHANNELS.map(async ({ channel }) => [
        channel,
        await loadExternalTexture(
          urls[channel],
          channel === 'albedo' ? { colorSpace: THREE.SRGBColorSpace } : {},
        ),
      ]),
    );
    return Object.fromEntries(entries);
  }

  async function loadTextureMode(mode) {
    const spec = getTextureModeSpec(mode);
    const manifest = manifestRef();
    if (!manifest?.planet?.surface_map) {
      throw new Error('surface_map unavailable');
    }

    if (mode === 'planet_shader') {
      if (!shaderMaterial) {
        setStatus('正在初始化着色器材质…');
        const surfaceMapTexture = createSurfaceDataTexture(manifest.planet.surface_map);
        shaderMaterial = createPlanetShaderMaterial({
          surfaceMapTexture,
          landThreshold: manifest.planet.surface_map.land_threshold,
          palette: materialRules.raw_palette,
          materialRules,
        });
      }
      planet.material = shaderMaterial;
      return { _isShader: true };
    }

    if (mode === 'surface_map') {
      return baseSurfaceTexture ? { albedo: baseSurfaceTexture } : null;
    }

    if (mode === 'openai_materials') {
      if (!openaiMaterialTextures) {
        openaiMaterialTextures = await loadBakedTextureSet(mode);
        if (!openaiMaterialTextures) {
          setStatus('正在构建 OpenAI 地表材质…');
          const map = await buildPlanetMaterialTexture(
            manifest.planet.surface_map,
            spec.assetBase,
          );
          openaiMaterialTextures = { albedo: map };
        }
      }
      return openaiMaterialTextures;
    }
    throw new Error(`unknown texture mode: ${mode}`);
  }

  async function applyPlanetTextureMode(mode) {
    currentTextureMode = mode;
    try {
      const textureSet = await loadTextureMode(mode);
      if (currentTextureMode !== mode || !textureSet) return;
      if (textureSet._isShader) return;
      applyTextureSet(textureSet);
    } catch (error) {
      setStatus(`材质不可用，已降级原始贴图：${error.message}`);
      currentTextureMode = 'surface_map';
      onFallbackMode('surface_map');
      if (baseSurfaceTexture) {
        applyTextureSet({ albedo: baseSurfaceTexture });
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
