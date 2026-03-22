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
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.rotateSpeed = 0.7;
controls.zoomSpeed = 0.9;

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

function updateControlResponsiveness() {
  const distance = controls.getDistance();
  const span = Math.max(controls.maxDistance - controls.minDistance, 0.001);
  const normalized = THREE.MathUtils.clamp((distance - controls.minDistance) / span, 0, 1);
  const eased = normalized * normalized * (3 - 2 * normalized);
  controls.rotateSpeed = THREE.MathUtils.lerp(0.14, 0.72, eased);
  controls.zoomSpeed = THREE.MathUtils.lerp(0.55, 1.0, eased);
  controls.dampingFactor = THREE.MathUtils.lerp(0.12, 0.07, eased);
  const pointSizeScale = THREE.MathUtils.lerp(0.72, 2.35, Math.pow(eased, 0.85));
  for (const mesh of pointMeshes) {
    if (mesh?.material) {
      mesh.material.size = BASE_POINT_SIZE * pointSizeScale;
    }
  }
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
let focusResultsSignature = '';
const resultContentCache = new Map();
const BASE_POINT_SIZE = 0.08;
const starTexture = buildStarTexture();
const topFocusHighlight = new THREE.Points(
  new THREE.BufferGeometry(),
  new THREE.PointsMaterial({
    size: 0.22,
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

const topFocusGlow = new THREE.Points(
  new THREE.BufferGeometry(),
  new THREE.PointsMaterial({
    size: 0.42,
    transparent: true,
    opacity: 0.45,
    map: starTexture,
    alphaMap: starTexture,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: 0xffe6a3,
  }),
);
topFocusGlow.visible = false;
scene.add(topFocusGlow);
let focusRegionVisible = true;

function nbssObjectUrl(fid) {
  const value = String(fid || '').trim();
  const match = value.match(/^NBSS:0x([0-9A-Fa-f]+)$/);
  if (!match) return '';
  return `http://${window.location.hostname}:8080/nbss/0x${match[1].toUpperCase()}`;
}

function inferDocKind(payload) {
  if (payload.doc_kind === 'asset_card') return 'asset_card';
  if (payload.card_schema === 'deep_asset_card_v1') return 'asset_card';
  if (payload.table === 'google_keep_asset_cards_directmd_eval200') return 'asset_card';
  if (String(payload.doc_id || '').startsWith('keep_')) return 'asset_card';
  return 'raw_text';
}

function assetCardUrl(payload) {
  if (inferDocKind(payload) !== 'asset_card' || !payload.doc_id) return '';
  return `/var/google_keep_asset_cards_directmd_eval200/${encodeURIComponent(payload.doc_id)}.md`;
}

function compactMetaLabel(payload) {
  const source = payload.source_type === 'google_keep' ? 'keep' : String(payload.source_type || 'doc').slice(0, 6);
  const date = String(payload.created_at || '').trim();
  const normalized = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!normalized) return source;
  return `${source}${normalized[1].slice(2)}${normalized[2]}${normalized[3]}`;
}

function stripFrontmatter(markdown) {
  const text = String(markdown || '');
  if (!text.startsWith('---\n')) return text;
  const end = text.indexOf('\n---\n', 4);
  if (end === -1) return text;
  return text.slice(end + 5);
}

function compactLines(text, maxLines = 4) {
  return String(text || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, maxLines)
    .join('\n');
}

function parseAssetCardSummary(markdown, fallbackPreview = '') {
  const body = stripFrontmatter(markdown);
  const coreView = body.match(/\*\*核心观点\*\*[：:]\s*(.+)/)?.[1]?.trim() || '';
  const intent = body.match(/\*\*意图识别\*\*[：:]\s*(.+)/)?.[1]?.trim() || '';
  const cognitiveAsset = body.match(/\*\*认知资产\*\*[：:]\s*(.+)/)?.[1]?.trim() || '';
  const rawContent = body
    .replace(/^# .+$/m, '')
    .replace(/^>.+$/gm, '')
    .replace(/^## .+$/gm, '')
    .trim();
  const preview = compactLines(rawContent || fallbackPreview, 5);
  return { coreView, intent, cognitiveAsset, preview };
}

function parseRawMarkdownPreview(text) {
  const raw = String(text || '');
  const lines = raw.split(/\r?\n/);
  const sliced = lines.slice(11).join('\n');
  return compactLines(sliced || raw, 5);
}

async function loadText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.text();
}

async function hydrateFocusResultsContent() {
  const targets = focusResults.slice(0, 10);
  const jobs = targets.map(async (entry) => {
    const payload = entry.payload;
    const key = payload.keep_md_fid || payload.doc_id || payload.path_in_snapshot || payload.title;
    if (!key || resultContentCache.has(key)) return;
    if (inferDocKind(payload) === 'asset_card') {
      const url = assetCardUrl(payload);
      if (!url) {
        resultContentCache.set(key, parseAssetCardSummary('', payload.text_preview || ''));
        return;
      }
      try {
        const markdown = await loadText(url);
        resultContentCache.set(key, parseAssetCardSummary(markdown, payload.text_preview || ''));
      } catch {
        resultContentCache.set(key, parseAssetCardSummary('', payload.text_preview || ''));
      }
      return;
    }
    const mdUrl = nbssObjectUrl(payload.keep_md_fid);
    if (!mdUrl) {
      resultContentCache.set(key, {
        coreView: '',
        intent: '',
        cognitiveAsset: '',
        preview: parseRawMarkdownPreview(payload.text_preview || ''),
      });
      return;
    }
    try {
      const markdown = await loadText(mdUrl);
      resultContentCache.set(key, {
        coreView: '',
        intent: '',
        cognitiveAsset: '',
        preview: parseRawMarkdownPreview(markdown),
      });
    } catch {
      resultContentCache.set(key, {
        coreView: '',
        intent: '',
        cognitiveAsset: '',
        preview: parseRawMarkdownPreview(payload.text_preview || ''),
      });
    }
  });
  await Promise.all(jobs);
  renderFocusResults(true);
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
    size: BASE_POINT_SIZE,
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
  const nextSignature = JSON.stringify({
    keys: focusResults.map((entry) => entry.key),
    selected: selectedPayload?.keep_md_fid || selectedPayload?.doc_id || '',
  });
  const changed = nextSignature !== focusResultsSignature;
  focusResultsSignature = nextSignature;
  if (changed) {
    renderFocusResults();
    hydrateFocusResultsContent();
  }
}

function renderFocusResults(force = false) {
  if (!focusResults.length) {
    resultsSummaryEl.textContent = '当前视锥中心附近暂无可见文档。';
    resultsListEl.innerHTML = '<div class="results-empty">转动或缩放星球，列表会按视觉中心实时更新。</div>';
    return;
  }

  resultsSummaryEl.textContent = `视觉中心附近文档 ${focusResults.length} 条，按屏幕中心距离排序。`;
  resultsListEl.innerHTML = focusResults.map((entry, idx) => {
    const payload = entry.payload;
    const title = payload.title || payload.path_in_snapshot || payload.doc_id || 'Untitled';
    const isAssetCard = inferDocKind(payload) === 'asset_card';
    const badgeLabel = isAssetCard ? '资产卡' : '原始文档';
    const badgeClass = isAssetCard ? 'asset' : 'raw';
    const compactMeta = compactMetaLabel(payload);
    const mdUrl = nbssObjectUrl(payload.keep_md_fid);
    const cardUrl = assetCardUrl(payload);
    const cacheKey = payload.keep_md_fid || payload.doc_id || payload.path_in_snapshot || payload.title;
    const cached = resultContentCache.get(cacheKey) || null;
    const preview = cached?.preview || parseRawMarkdownPreview(payload.text_preview || '');
    const selectedClass = selectedPayload && (
      (selectedPayload.keep_md_fid && payload.keep_md_fid && selectedPayload.keep_md_fid === payload.keep_md_fid) ||
      (selectedPayload.doc_id && payload.doc_id && selectedPayload.doc_id === payload.doc_id)
    ) ? ' is-selected' : '';
    const assetLines = isAssetCard ? `
      <div class="result-asset-lines">
        ${cached?.coreView ? `<div class="result-asset-line"><div class="result-asset-key">核心观点</div><div class="result-asset-value">${escapeHtml(cached.coreView)}</div></div>` : ''}
        ${cached?.intent ? `<div class="result-asset-line"><div class="result-asset-key">意图识别</div><div class="result-asset-value">${escapeHtml(cached.intent)}</div></div>` : ''}
        ${cached?.cognitiveAsset ? `<div class="result-asset-line"><div class="result-asset-key">认知资产</div><div class="result-asset-value">${escapeHtml(cached.cognitiveAsset)}</div></div>` : ''}
      </div>
    ` : '';
    const links = `
      <div class="result-links">
        ${mdUrl ? `<a class="result-link" href="${escapeHtml(mdUrl)}" target="_blank" rel="noreferrer">查看笔记原文</a>` : ''}
        ${cardUrl ? `<a class="result-link" href="${escapeHtml(cardUrl)}" target="_blank" rel="noreferrer">查看 AI 分析</a>` : ''}
      </div>
    `;
    return `
      <article class="result-card${selectedClass}${isAssetCard ? ' is-asset-card' : ''}">
        <div class="result-rank">
          <span>#${idx + 1} · 中心距离 ${entry.distance.toFixed(3)}</span>
          <span class="result-rank-meta">${escapeHtml(compactMeta)}</span>
        </div>
        <div class="result-header">
          <span class="result-badge ${badgeClass}">${badgeLabel}</span>
          <div class="result-title-wrap">
            <h2 class="result-title">${mdUrl ? `<a href="${escapeHtml(mdUrl)}" target="_blank" rel="noreferrer">${escapeHtml(title)}</a>` : escapeHtml(title)}</h2>
            ${links}
          </div>
        </div>
        ${assetLines}
        ${!isAssetCard ? `<p class="result-preview">${escapeHtml(preview)}</p>` : ''}
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
    labelEl.classList.toggle('is-primary', i === 0);
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
    topFocusGlow.visible = false;
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

  const glowGeometry = topFocusGlow.geometry;
  glowGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(
      [top.position.x, top.position.y, top.position.z],
      3,
    ),
  );
  glowGeometry.computeBoundingSphere();
  topFocusGlow.visible = true;
  const glowPulse = 0.5 + 0.5 * Math.sin(performance.now() * 0.008);
  topFocusGlow.material.size = 0.34 + 0.18 * glowPulse;
  topFocusGlow.material.opacity = 0.18 + 0.24 * (0.5 + 0.5 * Math.sin(performance.now() * 0.012));
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
  updateControlResponsiveness();
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
