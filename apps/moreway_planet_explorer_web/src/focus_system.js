import * as THREE from 'three';

export function createFocusSystem({
  scene,
  camera,
  renderer,
  overlayLayerEl,
  focusRegionBoxEl,
  pointMeshes,
  starTexture,
  getSelectedPayload,
  onResultsChanged,
}) {
  let focusResults = [];
  let focusLabelEntries = [];
  const focusLabelEls = [];
  let focusResultHistory = new Map();
  let focusResultsSignature = '';

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
      const key = candidate.key;
      if (!key || seen.has(key)) continue;
      seen.add(key);
      unique.push(candidate);
      if (unique.length >= 48) break;
    }
    focusLabelEntries = unique;
    focusResults = unique.slice(0, 10);
    focusResultHistory = new Map(unique.map((entry) => [entry.key, entry.rawDistance]));
    const selectedPayload = getSelectedPayload();
    const nextSignature = JSON.stringify({
      keys: focusResults.map((entry) => entry.key),
      selected: selectedPayload?.keep_md_fid || selectedPayload?.doc_id || '',
    });
    const changed = nextSignature !== focusResultsSignature;
    focusResultsSignature = nextSignature;
    if (changed) {
      onResultsChanged(focusResults);
    }
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

  return {
    updateFocusResults,
    updateFocusLabels,
    updateTopFocusHighlight,
    getFocusResults: () => focusResults,
  };
}
