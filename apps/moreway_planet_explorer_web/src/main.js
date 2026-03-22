import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { tableFromIPC } from 'apache-arrow';

const DATASET_BASE = '/var/moreway_planet_dataset';
const statusEl = document.getElementById('status');
const resultsSummaryEl = document.getElementById('results-summary');
const resultsListEl = document.getElementById('results-list');
const sceneRoot = document.getElementById('scene-root');
const overlayLayerEl = document.getElementById('overlay-layer');
const focusRegionBoxEl = document.getElementById('focus-region-box');
const focusRegionToggleEl = document.getElementById('focus-region-toggle');

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
sceneRoot.appendChild(renderer.domElement);

let planetRadius = 10.0;
let pointRadius = 10.08;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050b10);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 16, 28);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.minDistance = 13;
controls.maxDistance = 60;
controls.autoRotate = false;
controls.autoRotateSpeed = 0.0;

scene.add(new THREE.AmbientLight(0x9abde0, 1.5));
const dirLight = new THREE.DirectionalLight(0xcde7ff, 1.1);
dirLight.position.set(18, 12, 14);
scene.add(dirLight);

const planet = new THREE.Mesh(
  new THREE.SphereGeometry(1, 96, 96),
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x0d2230,
    roughness: 0.95,
    metalness: 0.05,
  }),
);
scene.add(planet);

const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 64, 64),
  new THREE.MeshBasicMaterial({
    color: 0x4fbfff,
    transparent: true,
    opacity: 0.08,
    side: THREE.BackSide,
  }),
);
scene.add(atmosphere);

function updatePlanetScale() {
  planet.scale.setScalar(planetRadius);
  atmosphere.scale.setScalar(planetRadius + 0.45);
}

function updateControlBounds() {
  const nearestSurface = Math.max(pointRadius, planetRadius + 0.08);
  controls.minDistance = nearestSurface + 0.9;

  const verticalHalfFov = THREE.MathUtils.degToRad(camera.fov * 0.5);
  const horizontalHalfFov = Math.atan(Math.tan(verticalHalfFov) * camera.aspect);
  const limitingHalfFov = Math.min(verticalHalfFov, horizontalHalfFov);
  const requiredDistance = nearestSurface / Math.sin(Math.max(limitingHalfFov, 0.01));
  controls.maxDistance = Math.max(requiredDistance * 1.08, controls.minDistance + 6);

  if (controls.getDistance() < controls.minDistance) {
    const dir = camera.position.clone().normalize();
    camera.position.copy(dir.multiplyScalar(controls.minDistance));
  } else if (controls.getDistance() > controls.maxDistance) {
    const dir = camera.position.clone().normalize();
    camera.position.copy(dir.multiplyScalar(controls.maxDistance));
  }
  controls.update();
}

function deriveDisplayRadii(bounds) {
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
  for (const [x, y, z] of corners) {
    const radius = Math.sqrt(x * x + y * y + z * z);
    if (radius > maxRadius) maxRadius = radius;
  }
  pointRadius = maxRadius;
  planetRadius = Math.max(0.1, maxRadius - 0.08);
  updatePlanetScale();
  updateControlBounds();
}

function buildPlanetTexture(surfaceMap) {
  const width = surfaceMap.lon_steps;
  const height = surfaceMap.lat_steps;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const image = ctx.createImageData(width, height);
  const threshold = surfaceMap.land_threshold;

  function smoothstep(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / Math.max(edge1 - edge0, 1e-6)));
    return t * t * (3 - 2 * t);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function mixColor(a, b, t) {
    return [
      Math.round(lerp(a[0], b[0], t)),
      Math.round(lerp(a[1], b[1], t)),
      Math.round(lerp(a[2], b[2], t)),
    ];
  }

  const deepSea = [6, 22, 64];
  const sea = [18, 66, 128];
  const shallowSea = [72, 126, 178];
  const coast = [201, 181, 129];
  const lowland = [86, 122, 74];
  const upland = [118, 104, 76];
  const mountain = [148, 142, 138];
  const snow = [245, 247, 250];

  for (let lat = 0; lat < height; lat += 1) {
    for (let lon = 0; lon < width; lon += 1) {
      const idx = lat * width + lon;
      const value = surfaceMap.values[idx];
      const pixel = idx * 4;
      let rgb;

      if (value < threshold) {
        const seaLevel = value / Math.max(threshold, 1);
        const deepBand = smoothstep(0.0, 0.55, seaLevel);
        const shallowBand = smoothstep(0.55, 1.0, seaLevel);
        if (seaLevel < 0.55) {
          rgb = mixColor(deepSea, sea, deepBand);
        } else {
          rgb = mixColor(sea, shallowSea, shallowBand);
        }
      } else {
        const landLevel = (value - threshold) / Math.max(255 - threshold, 1);
        const compressed = Math.pow(landLevel, 1.55);
        if (compressed < 0.18) {
          rgb = mixColor(coast, lowland, smoothstep(0.0, 0.18, compressed));
        } else if (compressed < 0.58) {
          rgb = mixColor(lowland, upland, smoothstep(0.18, 0.58, compressed));
        } else if (compressed < 0.86) {
          rgb = mixColor(upland, mountain, smoothstep(0.58, 0.86, compressed));
        } else {
          rgb = mixColor(mountain, snow, smoothstep(0.86, 1.0, compressed));
        }
      }

      image.data[pixel] = rgb[0];
      image.data[pixel + 1] = rgb[1];
      image.data[pixel + 2] = rgb[2];
      image.data[pixel + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let manifest = null;
let loadedChunks = new Map();
let pointMeshes = [];
let selectedPayload = null;
let focusResults = [];
let focusLabelEntries = [];
const focusLabelEls = [];
let focusResultHistory = new Map();
const starTexture = buildStarTexture();
const topFocusHighlight = new THREE.Points(
  new THREE.BufferGeometry(),
  new THREE.PointsMaterial({
    size: 0.16,
    transparent: true,
    opacity: 1,
    map: starTexture,
    alphaMap: starTexture,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: 0xffffff,
  }),
);
topFocusHighlight.visible = false;
scene.add(topFocusHighlight);
let focusRegionVisible = true;

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

function setStatus(text) {
  statusEl.textContent = text;
}

function setSelection(payload) {
  selectedPayload = payload || null;
  renderFocusResults();
}

function syncFocusRegionVisibility() {
  focusRegionBoxEl.classList.toggle('is-hidden', !focusRegionVisible);
  focusRegionToggleEl.textContent = focusRegionVisible ? '隐藏视觉中心框' : '显示视觉中心框';
}

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

async function loadJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.json();
}

async function loadArrow(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  const buffer = await response.arrayBuffer();
  return tableFromIPC(buffer);
}

function visibleChunks() {
  if (!manifest) return [];
  const cameraDir = camera.position.clone().normalize();
  return manifest.chunks.filter((chunk) => {
    const c = new THREE.Vector3(...chunk.center).normalize();
    return cameraDir.dot(c) > -0.2 || chunk.depth <= 1;
  });
}

async function ensureVisibleChunks() {
  for (const chunk of visibleChunks()) {
    if (loadedChunks.has(chunk.chunk_id)) continue;
    const table = await loadArrow(`${DATASET_BASE}/builds/${manifest.build_id}/${chunk.path}`);
    const rows = table.toArray().map((row) => row.toJSON());
    const mesh = buildChunkPoints(rows);
    scene.add(mesh);
    loadedChunks.set(chunk.chunk_id, { rows, mesh });
    pointMeshes.push(mesh);
  }
  setStatus(`Build ${manifest.build_id} · ${loadedChunks.size}/${manifest.chunks.length} chunks loaded · ${manifest.document_count} docs`);
}

function buildChunkPoints(rows) {
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];
  const payloads = [];
  const color = new THREE.Color();

  for (const row of rows) {
    const direction = new THREE.Vector3(row.surface_x, row.surface_y, row.surface_z).normalize();
    const displayed = direction.multiplyScalar(pointRadius);
    positions.push(displayed.x, displayed.y, displayed.z);
    if (row.doc_kind === 'asset_card') {
      color.setRGB(0.54, 0.86, 1.0);
    } else {
      color.setRGB(1.0, 0.77, 0.48);
    }
    colors.push(color.r, color.g, color.b);
    payloads.push(row);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    map: starTexture,
    alphaMap: starTexture,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geometry, material);
  points.userData.payloads = payloads;
  return points;
}

function ensureFocusLabelPool(size) {
  while (focusLabelEls.length < size) {
    const el = document.createElement('div');
    el.className = 'focus-point-label';
    el.style.display = 'none';
    overlayLayerEl.appendChild(el);
    focusLabelEls.push(el);
  }
}

function updateFocusResults() {
  const center = new THREE.Vector2(0, 0);
  const candidates = [];
  const cameraHemisphere = camera.position.clone().normalize();
  const focusRect = focusRegionBoxEl.getBoundingClientRect();
  const canvasRect = renderer.domElement.getBoundingClientRect();
  const focusLeft = focusRect.left - canvasRect.left;
  const focusRight = focusRect.right - canvasRect.left;
  const focusTop = focusRect.top - canvasRect.top;
  const focusBottom = focusRect.bottom - canvasRect.top;

  for (const mesh of pointMeshes) {
    const positions = mesh.geometry.getAttribute('position');
    const payloads = mesh.userData.payloads || [];
    for (let index = 0; index < positions.count; index += 1) {
      const world = new THREE.Vector3(
        positions.getX(index),
        positions.getY(index),
        positions.getZ(index),
      );
      const surfaceNormal = world.clone().normalize();
      if (surfaceNormal.dot(cameraHemisphere) <= 0.0) continue;
      const projected = world.clone().project(camera);
      if (projected.z < -1 || projected.z > 1) continue;
      if (Math.abs(projected.x) > 1 || Math.abs(projected.y) > 1) continue;
      const screenX = ((projected.x + 1) / 2) * canvasRect.width;
      const screenY = ((-projected.y + 1) / 2) * canvasRect.height;
      if (screenX < focusLeft || screenX > focusRight || screenY < focusTop || screenY > focusBottom) continue;

      const payload = payloads[index];
      if (!payload) continue;

      const distance = center.distanceTo(new THREE.Vector2(projected.x, projected.y));
      const key = payload.keep_md_fid || payload.doc_id || payload.path_in_snapshot || payload.title;
      const previous = focusResultHistory.get(key);
      const stableDistance = previous == null
        ? distance
        : distance * 0.72 + previous * 0.28;
      candidates.push({
        payload,
        distance: stableDistance,
        rawDistance: distance,
        position: world,
        key,
      });
    }
  }

  candidates.sort((a, b) => a.distance - b.distance);
  const unique = [];
  const seen = new Set();
  for (const candidate of candidates) {
    const payload = candidate.payload;
    const key = candidate.key;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(candidate);
    if (unique.length >= 48) break;
  }
  focusLabelEntries = unique;
  focusResults = unique.slice(0, 10);
  focusResultHistory = new Map(unique.map((entry) => [entry.key, entry.rawDistance]));
  renderFocusResults();
}

function renderFocusResults() {
  if (!focusResults.length) {
    resultsSummaryEl.textContent = '当前视锥中心附近暂无可见文档。';
    resultsListEl.innerHTML = '<div class="results-empty">转动或缩放星球，列表会按视觉中心实时更新。</div>';
    return;
  }

  resultsSummaryEl.textContent = `视觉中心附近文档 ${focusResults.length} 条，按屏幕中心距离排序。`;
  resultsListEl.innerHTML = focusResults.map((entry, idx) => {
    const payload = entry.payload;
    const title = payload.title || payload.path_in_snapshot || payload.doc_id || 'Untitled';
    const meta = [
      payload.table || '',
      payload.doc_kind || 'unknown',
      payload.source_type || 'unknown',
    ].filter(Boolean).join(' · ');
    const selectedClass = selectedPayload && (
      (selectedPayload.keep_md_fid && payload.keep_md_fid && selectedPayload.keep_md_fid === payload.keep_md_fid) ||
      (selectedPayload.doc_id && payload.doc_id && selectedPayload.doc_id === payload.doc_id)
    ) ? ' is-selected' : '';
    return `
      <article class="result-card${selectedClass}">
        <div class="result-rank">#${idx + 1} · 中心距离 ${entry.distance.toFixed(3)}</div>
        <h2 class="result-title">${escapeHtml(title)}</h2>
        <div class="result-meta">${escapeHtml(meta)}</div>
        <p class="result-preview">${escapeHtml(payload.text_preview || '')}</p>
      </article>
    `;
  }).join('');
}

function updateFocusLabels() {
  ensureFocusLabelPool(focusLabelEntries.length);
  const canvasRect = renderer.domElement.getBoundingClientRect();
  const occupiedRects = [];
  const occupiedPointZones = focusLabelEntries.map((entry) => {
    const projected = entry.position.clone().project(camera);
    const screenX = canvasRect.left + ((projected.x + 1) / 2) * canvasRect.width;
    const screenY = canvasRect.top + ((-projected.y + 1) / 2) * canvasRect.height;
    return {
      left: screenX - 18,
      right: screenX + 18,
      top: screenY - 18,
      bottom: screenY + 18,
    };
  });
  for (let i = 0; i < focusLabelEls.length; i += 1) {
    const labelEl = focusLabelEls[i];
    const entry = focusLabelEntries[i];
    if (!entry) {
      labelEl.style.display = 'none';
      continue;
    }

    const projected = entry.position.clone().project(camera);
    const visible = projected.z >= -1 && projected.z <= 1
      && Math.abs(projected.x) <= 1
      && Math.abs(projected.y) <= 1;
    if (!visible) {
      labelEl.style.display = 'none';
      continue;
    }

    const screenX = canvasRect.left + ((projected.x + 1) / 2) * canvasRect.width;
    const screenY = canvasRect.top + ((-projected.y + 1) / 2) * canvasRect.height;
    const title = entry.payload.title || entry.payload.path_in_snapshot || entry.payload.doc_id || 'Untitled';
    labelEl.textContent = title;
    labelEl.style.left = `${screenX}px`;
    labelEl.style.top = `${screenY}px`;
    labelEl.style.display = 'block';

    const width = labelEl.offsetWidth || 120;
    const height = labelEl.offsetHeight || 26;
    const labelRect = {
      left: screenX - width / 2,
      right: screenX + width / 2,
      top: screenY + 26,
      bottom: screenY + 26 + height,
    };
    const overlapsLabels = occupiedRects.some((other) => !(
      labelRect.right < other.left ||
      labelRect.left > other.right ||
      labelRect.bottom < other.top ||
      labelRect.top > other.bottom
    ));
    const overlapsPoints = occupiedPointZones.some((other, otherIndex) => otherIndex !== i && !(
      labelRect.right < other.left ||
      labelRect.left > other.right ||
      labelRect.bottom < other.top ||
      labelRect.top > other.bottom
    ));
    const overlapsOwnPoint = !(
      labelRect.right < occupiedPointZones[i].left ||
      labelRect.left > occupiedPointZones[i].right ||
      labelRect.bottom < occupiedPointZones[i].top ||
      labelRect.top > occupiedPointZones[i].bottom
    );
    const isPrimary = i === 0;
    if (!isPrimary && (overlapsLabels || overlapsPoints || overlapsOwnPoint)) {
      labelEl.style.display = 'none';
      continue;
    }

    occupiedRects.push(labelRect);
  }
}

function updateTopFocusHighlight() {
  const top = focusResults[0];
  if (!top) {
    topFocusHighlight.visible = false;
    return;
  }
  const geometry = topFocusHighlight.geometry;
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(
      [top.position.x, top.position.y, top.position.z],
      3,
    ),
  );
  geometry.computeBoundingSphere();
  topFocusHighlight.visible = true;
}

async function bootstrap() {
  try {
    const latest = await loadJson(`${DATASET_BASE}/latest.json`);
    manifest = await loadJson(`${DATASET_BASE}/${latest.manifest_path}`);
    deriveDisplayRadii(manifest.bounds);
    if (manifest.planet?.surface_map) {
      planet.material.map = buildPlanetTexture(manifest.planet.surface_map);
      planet.material.needsUpdate = true;
    }
    await ensureVisibleChunks();
    setSelection(null);
    updateFocusResults();
  } catch (error) {
    setStatus(`加载失败：${error.message}`);
  }
}

window.addEventListener('pointerdown', (event) => {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(pointMeshes, false);
  if (!intersects.length) {
    setSelection(null);
    return;
  }
  const hit = intersects[0];
  const index = hit.index;
  const payload = hit.object.userData.payloads?.[index];
  setSelection(payload || null);
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

let lastChunkRefresh = 0;
let lastFocusRefresh = 0;
function animate(now = 0) {
  requestAnimationFrame(animate);
  controls.update();
  if (manifest && now - lastChunkRefresh > 1200) {
    lastChunkRefresh = now;
    ensureVisibleChunks();
  }
  if (manifest && now - lastFocusRefresh > 280) {
    lastFocusRefresh = now;
    updateFocusResults();
  }
  updateFocusLabels();
  updateTopFocusHighlight();
  renderer.render(scene, camera);
}

bootstrap();
focusRegionToggleEl.addEventListener('click', () => {
  focusRegionVisible = !focusRegionVisible;
  syncFocusRegionVisibility();
});
syncFocusRegionVisibility();
animate();
