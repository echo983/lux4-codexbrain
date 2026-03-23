import test from 'node:test';
import assert from 'node:assert/strict';

import { createMaterialRuntime } from '../src/material_runtime.js';

function makeTexture(name) {
  return { name, wrapS: null, wrapT: null, colorSpace: null };
}

test('material runtime loads baked OpenAI texture and applies it', async () => {
  const baseTexture = makeTexture('base');
  const loadedTexture = makeTexture('baked');
  const loadedNormal = makeTexture('normal');
  const loadedRoughness = makeTexture('roughness');
  const planet = { material: { map: null, normalMap: null, roughnessMap: null, needsUpdate: false } };
  const urls = [];

  const runtime = createMaterialRuntime({
    dataSetBase: '/var/moreway_planet_dataset',
    manifestRef: () => ({
      build_id: 'build123',
      planet: {
        surface_map: {},
        baked_textures: {
          openai_materials: 'builds/build123/textures/openai_materials.png',
          openai_materials_normal: 'builds/build123/textures/openai_materials_normal.png',
          openai_materials_roughness: 'builds/build123/textures/openai_materials_roughness.png',
        },
      },
    }),
    planet,
    textureLoader: {
      load(url, onLoad) {
        urls.push(url);
        if (url.endsWith('_normal.png')) onLoad(loadedNormal);
        else if (url.endsWith('_roughness.png')) onLoad(loadedRoughness);
        else onLoad(loadedTexture);
      },
    },
    buildPlanetMaterialTexture: async () => {
      throw new Error('should not build fallback');
    },
    setStatus() {},
    onFallbackMode() {},
  });

  runtime.setBaseSurfaceTexture(baseTexture);
  await runtime.applyPlanetTextureMode('openai_materials');

  assert.deepEqual(urls, [
    '/var/moreway_planet_dataset/builds/build123/textures/openai_materials.png',
    '/var/moreway_planet_dataset/builds/build123/textures/openai_materials_normal.png',
    '/var/moreway_planet_dataset/builds/build123/textures/openai_materials_roughness.png',
  ]);
  assert.equal(planet.material.map, loadedTexture);
  assert.equal(planet.material.normalMap, loadedNormal);
  assert.equal(planet.material.roughnessMap, loadedRoughness);
  assert.equal(planet.material.needsUpdate, true);
});

test('material runtime falls back to surface texture on failure', async () => {
  const baseTexture = makeTexture('base');
  const planet = { material: { map: null, normalMap: null, roughnessMap: null, needsUpdate: false } };
  let fallbackMode = '';
  let status = '';

  const runtime = createMaterialRuntime({
    dataSetBase: '/var/moreway_planet_dataset',
    manifestRef: () => ({ build_id: 'build123', planet: { surface_map: {} } }),
    planet,
    textureLoader: {
      load(_url, _onLoad, _onProgress, onError) {
        onError(new Error('boom'));
      },
    },
    buildPlanetMaterialTexture: async () => {
      throw new Error('boom');
    },
    setStatus(text) {
      status = text;
    },
    onFallbackMode(mode) {
      fallbackMode = mode;
    },
  });

  runtime.setBaseSurfaceTexture(baseTexture);
  await runtime.applyPlanetTextureMode('openai_materials');

  assert.equal(fallbackMode, 'surface_map');
  assert.equal(runtime.getCurrentTextureMode(), 'surface_map');
  assert.equal(planet.material.map, baseTexture);
  assert.equal(planet.material.normalMap, null);
  assert.equal(planet.material.roughnessMap, null);
  assert.match(status, /OpenAI 材质不可用/);
});
