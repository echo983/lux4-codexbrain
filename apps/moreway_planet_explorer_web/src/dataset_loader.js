import * as THREE from 'three';
import { tableFromIPC } from 'apache-arrow';

export async function loadJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.json();
}

export async function loadArrow(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  const buffer = await response.arrayBuffer();
  return tableFromIPC(buffer);
}

export function visibleChunks(manifest, camera) {
  if (!manifest) return [];
  const cameraDir = camera.position.clone().normalize();
  return manifest.chunks.filter((chunk) => {
    const c = new THREE.Vector3(...chunk.center).normalize();
    return cameraDir.dot(c) > -0.2 || chunk.depth <= 1;
  });
}

export function buildChunkPoints(rows, pointRadius, basePointSize, starTexture) {
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
      color.setRGB(0.45, 0.78, 1.0);
    } else {
      color.setRGB(0.9, 0.7, 0.45);
    }
    colors.push(color.r, color.g, color.b);
    payloads.push(row);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: basePointSize,
    vertexColors: true,
    transparent: true,
    opacity: 0.72,
    map: starTexture,
    alphaMap: starTexture,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geometry, material);
  points.userData.payloads = payloads;
  return points;
}

export async function ensureVisibleChunks({
  manifest,
  loadedChunks,
  pointMeshes,
  scene,
  dataSetBase,
  camera,
  pointRadius,
  basePointSize,
  starTexture,
  setStatus,
}) {
  for (const chunk of visibleChunks(manifest, camera)) {
    if (loadedChunks.has(chunk.chunk_id)) continue;
    const table = await loadArrow(`${dataSetBase}/builds/${manifest.build_id}/${chunk.path}`);
    const rows = table.toArray().map((row) => row.toJSON());
    const mesh = buildChunkPoints(rows, pointRadius, basePointSize, starTexture);
    scene.add(mesh);
    loadedChunks.set(chunk.chunk_id, { rows, mesh });
    pointMeshes.push(mesh);
  }
  setStatus(`Build ${manifest.build_id} · ${loadedChunks.size}/${manifest.chunks.length} chunks loaded · ${manifest.document_count} docs`);
}
