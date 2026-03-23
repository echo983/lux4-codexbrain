import test from 'node:test';
import assert from 'node:assert/strict';

import { createMaterialRuntime } from '../src/material_runtime.js';

function makeTexture(name) {
  return { name, wrapS: null, wrapT: null, colorSpace: null };
}

test('material runtime loads baked OpenAI texture and applies it', async () => {
  const baseTexture = makeTexture('base');
  const loadedTexture = makeTexture('baked');
  const planet = { material: { map: null, needsUpdate: false } };
  const urls = [];

  const runtime = createMaterialRuntime({
    dataSetBase: '/var/moreway_planet_dataset',
    manifestRef: () => ({
      build_id: 'build123',
      planet: { surface_map: {}, baked_textures: { openai_materials: 'builds/build123/textures/openai_materials.png' } },
    }),
    planet,
    textureLoader: {
      load(url, onLoad) {
        urls.push(url);
        onLoad(loadedTexture);
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

  assert.equal(urls[0], '/var/moreway_planet_dataset/builds/build123/textures/openai_materials.png');
  assert.equal(planet.material.map, loadedTexture);
  assert.equal(planet.material.needsUpdate, true);
});

test('material runtime falls back to surface texture on failure', async () => {
  const baseTexture = makeTexture('base');
  const planet = { material: { map: null, needsUpdate: false } };
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
  assert.match(status, /OpenAI 材质不可用/);
});
