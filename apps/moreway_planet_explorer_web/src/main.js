import './style.css';
import * as THREE from 'three';
import { BASE_POINT_SIZE, DATASET_BASE, DEFAULT_TEXTURE_MODE } from './config.js';
import {
  assetCardUrl,
  compactMetaLabel,
  inferDocKind,
  loadText,
  nbssObjectUrl,
} from './content_runtime.js';
import {
  ensureVisibleChunks,
  loadJson,
} from './dataset_loader.js';
import { createFocusSystem } from './focus_system.js';
import { createMaterialRuntime } from './material_runtime.js';
import { buildPlanetMaterialTexture } from './material_texture_builder.js';
import {
  createPlanetShaderMaterial,
  createSurfaceDataTexture,
} from './planet_shader.js';
import { createResultsPanel } from './results_panel.js';
import {
  createSceneRuntime,
  updateControlBounds,
  updateControlResponsiveness,
  updatePlanetScale,
} from './scene_runtime.js';
import {
  applyPlanetSurfaceRelief,
  buildPlanetTexture,
  computePointShellRadius,
} from './planet_surface.js';

const statusEl = document.getElementById('status');
const resultsSummaryEl = document.getElementById('results-summary');
const resultsListEl = document.getElementById('results-list');
const sceneRoot = document.getElementById('scene-root');
const overlayLayerEl = document.getElementById('overlay-layer');
const focusRegionBoxEl = document.getElementById('focus-region-box');
const focusRegionToggleEl = document.getElementById('focus-region-toggle');
const planetTextureModeEl = document.getElementById('planet-texture-mode');

let planetRadius = 10.0;
let pointRadius = 10.08;
const {
  renderer,
  composer,
  scene,
  camera,
  controls,
  planet,
  atmosphere,
  planetBasePositions,
} = createSceneRuntime(sceneRoot);

function deriveDisplayRadii(bounds, surfaceMap = null) {
  const [minX, minY, minZ] = bounds.min;
  const [maxX, maxY, maxZ] = bounds.max;
  const corners = [
    [minX, minY, minZ],
    [minX, minY, maxZ],
    [minX, maxY, minZ],
    [minX, maxY, maxZ],
    [maxX, minY, minZ],
    [maxX, minY, maxZ],
    [maxX, maxY, minZ],
    [maxX, maxY, maxZ],
  ];
  let maxRadius = 0;
  for (let i = 0; i < corners.length; i += 1) {
    const corner = corners[i];
    const radius = Math.sqrt(corner[0] * corner[0] + corner[1] * corner[1] + corner[2] * corner[2]);
    if (radius > maxRadius) maxRadius = radius;
  }
  planetRadius = Math.max(0.1, maxRadius - 0.08);
  pointRadius = surfaceMap
    ? computePointShellRadius(surfaceMap, planetRadius, maxRadius)
    : maxRadius;
  updatePlanetScale(planet, atmosphere, planetRadius);
  updateControlBounds(camera, controls, planetRadius, pointRadius);
}

function buildStarTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.28, 'rgba(255,255,255,0.95)');
  gradient.addColorStop(0.55, 'rgba(180,220,255,0.55)');
  gradient.addColorStop(1, 'rgba(180,220,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let manifest = null;
let materialRules = null;
let loadedChunks = new Map();
let pointMeshes = [];
let selectedPayload = null;
const starTexture = buildStarTexture();
const textureLoader = new THREE.TextureLoader();
let focusRegionVisible = true;
const resultsPanel = createResultsPanel({
  resultsSummaryEl,
  resultsListEl,
  inferDocKind,
  compactMetaLabel,
  nbssObjectUrl,
  assetCardUrl,
  getSelectedPayload: () => selectedPayload,
  loadText,
});
const materialRuntime = createMaterialRuntime({
  dataSetBase: DATASET_BASE,
  manifestRef: () => manifest,
  planet,
  textureLoader,
  buildPlanetMaterialTexture: (map, path) => buildPlanetMaterialTexture(map, path, materialRules),
  createPlanetShaderMaterial,
  createSurfaceDataTexture,
  get materialRules() { return materialRules; },
  setStatus,
  onFallbackMode: (mode) => {
    currentTextureMode = mode;
    if (planetTextureModeEl) {
      planetTextureModeEl.value = mode;
    }
  },
});
let currentTextureMode = 'planet_shader';
const focusSystem = createFocusSystem({
  scene,
  camera,
  controls,
  renderer,
  overlayLayerEl,
  focusRegionBoxEl,
  pointMeshes,
  starTexture,
  planet,
  basePointSize: BASE_POINT_SIZE,
  getSelectedPayload: () => selectedPayload,
  onResultsChanged: () => {
    resultsPanel.renderFocusResults(focusSystem.getFocusResults());
    resultsPanel.hydrateFocusResultsContent(
      focusSystem.getFocusResults(),
      (force) => resultsPanel.renderFocusResults(focusSystem.getFocusResults(), force),
    );
  },
});

function setStatus(text) {
  statusEl.textContent = text;
}

function setSelection(payload) {
  selectedPayload = payload || null;
  resultsPanel.renderFocusResults(focusSystem.getFocusResults());
}

function syncFocusRegionVisibility() {
  focusRegionBoxEl.classList.toggle('is-hidden', !focusRegionVisible);
  focusRegionToggleEl.textContent = focusRegionVisible ? '隐藏视觉中心框' : '显示视觉中心框';
}

async function bootstrap() {
  try {
    console.log('[BOOTSTRAP] Fetching latest.json...');
    const latest = await loadJson(`${DATASET_BASE}/latest.json`);
    console.log('[BOOTSTRAP] latest.json loaded:', latest.manifest_path);
    
    manifest = await loadJson(`${DATASET_BASE}/${latest.manifest_path}`);
    console.log('[BOOTSTRAP] manifest loaded.');

    console.log('[BOOTSTRAP] Fetching material_rules.json...');
    materialRules = await loadJson('/src/material_rules.json');
    console.log('[BOOTSTRAP] material_rules.json loaded.');

    deriveDisplayRadii(manifest.bounds, manifest.planet?.surface_map || null);
    if (manifest.planet?.surface_map) {
      applyPlanetSurfaceRelief(planet, planetBasePositions, manifest.planet.surface_map);
      const baseSurfaceTexture = buildPlanetTexture(manifest.planet.surface_map, materialRules);
      materialRuntime.setBaseSurfaceTexture(baseSurfaceTexture);
      planet.material.map = baseSurfaceTexture;
      planet.material.needsUpdate = true;
    }
    await ensureVisibleChunks({
      manifest,
      loadedChunks,
      pointMeshes,
      scene,
      dataSetBase: DATASET_BASE,
      camera,
      pointRadius,
      basePointSize: BASE_POINT_SIZE,
      starTexture,
      setStatus,
    });
    setSelection(null);
    focusSystem.updateFocusResults();
    await materialRuntime.applyPlanetTextureMode(currentTextureMode);
    console.log('[BOOTSTRAP] bootstrap complete.');
  } catch (error) {
    console.error('[BOOTSTRAP ERROR]', error);
    setStatus(`加载失败：${error.message}\n${error.stack}`);
  }
}

renderer.domElement.addEventListener('pointerdown', (event) => {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(pointMeshes, false);
  if (!intersects.length) {
    setSelection(null);
    return;
  }
  let payload = null;
  for (const hit of intersects) {
    const index = hit.index;
    const worldPoint = hit.point.clone();
    if (!focusSystem.isWorldPointVisible(worldPoint)) continue;
    payload = hit.object.userData.payloads?.[index] || null;
    if (payload) break;
  }
  setSelection(payload || null);
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

let lastChunkRefresh = 0;
let lastFocusRefresh = 0;
function animate(now = 0) {
  requestAnimationFrame(animate);
  updateControlResponsiveness(controls, pointMeshes, BASE_POINT_SIZE);
  controls.update();

  if (planet.material && planet.material.uniforms) {
    if (planet.material.uniforms.cameraPos) {
      planet.material.uniforms.cameraPos.value.copy(camera.position);
    }
    if (planet.material.uniforms.time) {
      planet.material.uniforms.time.value = now * 0.001;
    }
  }

  if (manifest && now - lastChunkRefresh > 1200) {
    lastChunkRefresh = now;
    ensureVisibleChunks({
      manifest,
      loadedChunks,
      pointMeshes,
      scene,
      dataSetBase: DATASET_BASE,
      camera,
      pointRadius,
      basePointSize: BASE_POINT_SIZE,
      starTexture,
      setStatus,
    });
  }
  if (manifest && now - lastFocusRefresh > 280) {
    lastFocusRefresh = now;
    focusSystem.updateFocusResults();
  }
  focusSystem.updateFocusLabels();
  focusSystem.updateTopFocusHighlight();
  composer.render();
}

bootstrap();
focusRegionToggleEl.addEventListener('click', () => {
  focusRegionVisible = !focusRegionVisible;
  syncFocusRegionVisibility();
});
planetTextureModeEl.addEventListener('change', () => {
  currentTextureMode = planetTextureModeEl.value;
  materialRuntime.applyPlanetTextureMode(planetTextureModeEl.value);
});
syncFocusRegionVisibility();
animate();
