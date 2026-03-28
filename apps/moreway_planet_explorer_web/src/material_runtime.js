import * as THREE from 'three';
import { getBakedTextureUrls } from './material_assets.js';
import { createPlanetShaderMaterial, createSurfaceDataTexture } from './planet_shader.js';

export function createMaterialRuntime({
  dataSetBase,
  planet,
  textureLoader,
  manifestRef,
  materialRules,
  setStatus,
}) {
  let shaderMaterial = null;

  function applyFallbackMaterial() {
    const fallbackMaterial = new THREE.MeshPhongMaterial({
      color: 0x2b5166,
      emissive: 0x08131a,
      shininess: 18,
      flatShading: false,
    });
    planet.material = fallbackMaterial;
  }

  async function loadBakedAlbedo() {
    const urls = getBakedTextureUrls({
      dataSetBase,
      manifest: manifestRef(),
      mode: 'openai_materials',
    });
    if (!urls || !urls.albedo) {
      throw new Error('Albedo texture URL not found');
    }
    const texture = await textureLoader.loadAsync(urls.albedo);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }

  async function initialize() {
    const manifest = manifestRef();
    if (!manifest?.planet?.surface_map) {
      throw new Error('surface_map unavailable');
    }

    try {
      setStatus('正在加载写实地表材质…');
      const albedoTexture = await loadBakedAlbedo();
      const surfaceMapTexture = createSurfaceDataTexture(manifest.planet.surface_map);
      
      shaderMaterial = createPlanetShaderMaterial({
        surfaceMapTexture,
        albedoTexture,
        landThreshold: manifest.planet.surface_map.land_threshold,
        materialRules,
      });

      planet.material = shaderMaterial;
      setStatus('就绪');
    } catch (error) {
      console.error('Material initialization failed:', error);
      applyFallbackMaterial();
      setStatus(`渲染初始化失败: ${error.message}`);
    }
  }

  return {
    initialize,
    // Keep these for backward compatibility during transition if needed
    applyPlanetTextureMode: async () => {}, 
    setBaseSurfaceTexture: () => {},
  };
}
