import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { tableFromIPC } from 'apache-arrow';

const DATASET_BASE = '/var/moreway_planet_dataset';
const statusEl = document.getElementById('status');
const selectionEl = document.getElementById('selection');
const sceneRoot = document.getElementById('scene-root');
const overlayLayerEl = document.getElementById('overlay-layer');

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
sceneRoot.appendChild(renderer.domElement);

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
  new THREE.SphereGeometry(10, 96, 96),
  new THREE.MeshStandardMaterial({
    color: 0x17455e,
    emissive: 0x0d2230,
    roughness: 0.95,
    metalness: 0.05,
  }),
);
scene.add(planet);

const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(10.4, 64, 64),
  new THREE.MeshBasicMaterial({
    color: 0x4fbfff,
    transparent: true,
    opacity: 0.08,
    side: THREE.BackSide,
  }),
);
scene.add(atmosphere);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let manifest = null;
let loadedChunks = new Map();
let pointMeshes = [];
let selectedPayload = null;
let selectedPosition = null;

const pointLabelEl = document.createElement('div');
pointLabelEl.className = 'point-label hidden';
overlayLayerEl.appendChild(pointLabelEl);

function setStatus(text) {
  statusEl.textContent = text;
}

function setSelection(payload) {
  if (!payload) {
    selectedPayload = null;
    selectedPosition = null;
    pointLabelEl.className = 'point-label hidden';
    pointLabelEl.textContent = '';
    selectionEl.className = 'selection empty';
    selectionEl.textContent = '点击星球上的点查看文档。';
    return;
  }
  const title = payload.title || payload.path_in_snapshot || payload.doc_id || 'Untitled';
  selectedPayload = payload;
  selectionEl.className = 'selection';
  selectionEl.innerHTML = `
    <h2>${escapeHtml(title)}</h2>
    <div class="meta">${escapeHtml(payload.table || '')} · ${escapeHtml(payload.doc_kind || 'unknown')} · ${escapeHtml(payload.source_type || 'unknown')}</div>
    <p class="preview">${escapeHtml(payload.text_preview || '')}</p>
  `;
  pointLabelEl.className = 'point-label';
  pointLabelEl.textContent = title;
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
    positions.push(row.surface_x, row.surface_y, row.surface_z);
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
    size: 0.22,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
  });
  const points = new THREE.Points(geometry, material);
  points.userData.payloads = payloads;
  return points;
}

function updatePointLabelPosition() {
  if (!selectedPayload || !selectedPosition) {
    pointLabelEl.className = 'point-label hidden';
    return;
  }

  const projected = selectedPosition.clone().project(camera);
  const visible = projected.z >= -1 && projected.z <= 1;
  if (!visible) {
    pointLabelEl.className = 'point-label hidden';
    return;
  }

  const screenX = ((projected.x + 1) / 2) * window.innerWidth;
  const screenY = ((-projected.y + 1) / 2) * window.innerHeight;
  pointLabelEl.className = 'point-label';
  pointLabelEl.style.left = `${screenX}px`;
  pointLabelEl.style.top = `${screenY}px`;
}

async function bootstrap() {
  try {
    const latest = await loadJson(`${DATASET_BASE}/latest.json`);
    manifest = await loadJson(`${DATASET_BASE}/${latest.manifest_path}`);
    await ensureVisibleChunks();
    setSelection(null);
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
  if (payload && Number.isInteger(index)) {
    const positions = hit.object.geometry.getAttribute('position');
    selectedPosition = new THREE.Vector3(
      positions.getX(index),
      positions.getY(index),
      positions.getZ(index),
    );
  } else {
    selectedPosition = null;
  }
  setSelection(payload || null);
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

let lastChunkRefresh = 0;
function animate(now = 0) {
  requestAnimationFrame(animate);
  controls.update();
  if (manifest && now - lastChunkRefresh > 1200) {
    lastChunkRefresh = now;
    ensureVisibleChunks();
  }
  updatePointLabelPosition();
  renderer.render(scene, camera);
}

bootstrap();
animate();
