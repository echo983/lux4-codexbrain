import * as THREE from 'three';

export function createFocusSystem({
  scene,
  camera,
  controls,
  renderer,
  overlayLayerEl,
  focusRegionBoxEl,
  pointMeshes,
  starTexture,
  planet,
  basePointSize,
  getSelectedPayload,
  onResultsChanged,
}) {
  let focusResults = [];
  let focusLabelEntries = [];
  const focusLabelEls = [];
  let focusResultHistory = new Map();
  let focusResultsSignature = '';

  function buildRingTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(64, 64, 60, 0, Math.PI * 2);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  function zoomProfile() {
    const distance = camera.position.length();
    const normalized = THREE.MathUtils.clamp((distance - 14) / 46, 0, 1);
    const curved = Math.pow(normalized, 2.6);
    return {
      labelOffsetY: THREE.MathUtils.lerp(16, 1, curved),
      pointZoneRadius: THREE.MathUtils.lerp(24, 14, normalized),
    };
  }

  function currentPointSize() {
    const distance = controls.getDistance();
    const span = Math.max(controls.maxDistance - controls.minDistance, 0.001);
    const normalized = THREE.MathUtils.clamp((distance - controls.minDistance) / span, 0, 1);
    const eased = normalized * normalized * (3 - 2 * normalized);
    const pointSizeScale = THREE.MathUtils.lerp(0.72, 2.35, Math.pow(eased, 0.85));
    return basePointSize * pointSizeScale;
  }

  const topFocusHighlight = new THREE.Points(
    new THREE.BufferGeometry(),
    new THREE.PointsMaterial({
      size: 0.18,
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
      size: 0.3,
      transparent: true,
      opacity: 0.45,
      map: starTexture,
      alphaMap: starTexture,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: 0xffffff,
    }),
  );
  topFocusGlow.visible = false;
  scene.add(topFocusGlow);

  const ringTexture = buildRingTexture();
  const topFocusRing = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      map: ringTexture,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: 0x00ccff,
    })
  );
  topFocusRing.visible = false;
  scene.add(topFocusRing);

  function isWorldPointFrontFacing(worldPoint) {
    const cameraHemisphere = camera.position.clone().normalize();
    const surfaceNormal = worldPoint.clone().normalize();
    return surfaceNormal.dot(cameraHemisphere) > 0.0;
  }

  function isOccludedByPlanet(worldPoint) {
    const planetRadius = planet.scale.x;
    const cameraPos = camera.position.clone();
    const toPoint = worldPoint.clone().sub(cameraPos);
    const segLenSq = toPoint.lengthSq();
    if (segLenSq <= 1e-9) return false;
    const t = THREE.MathUtils.clamp(-cameraPos.dot(toPoint) / segLenSq, 0, 1);
    const closest = cameraPos.add(toPoint.multiplyScalar(t));
    return closest.lengthSq() < (planetRadius * planetRadius);
  }

  function isWorldPointVisible(worldPoint) {
    return isWorldPointFrontFacing(worldPoint) && !isOccludedByPlanet(worldPoint);
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
        if (!isWorldPointVisible(world)) continue;
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
    const { labelOffsetY, pointZoneRadius } = zoomProfile();
    const occupiedRects = [];
    const occupiedPointZones = focusLabelEntries.map((entry) => {
      const projected = entry.position.clone().project(camera);
      const screenX = canvasRect.left + ((projected.x + 1) / 2) * canvasRect.width;
      const screenY = canvasRect.top + ((-projected.y + 1) / 2) * canvasRect.height;
      return {
        left: screenX - pointZoneRadius,
        right: screenX + pointZoneRadius,
        top: screenY - pointZoneRadius,
        bottom: screenY + pointZoneRadius,
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
      const visible = isWorldPointVisible(entry.position)
        && projected.z >= -1 && projected.z <= 1
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
      const labelTop = screenY + labelOffsetY;
      labelEl.style.left = `${screenX}px`;
      labelEl.style.top = `${labelTop}px`;
      labelEl.style.display = 'block';

      const width = labelEl.offsetWidth || 120;
      const height = labelEl.offsetHeight || 26;
      const labelRect = {
        left: screenX - width / 2,
        right: screenX + width / 2,
        top: labelTop,
        bottom: labelTop + height,
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
      const isPrimary = i === 0;
      if (!isPrimary && (overlapsLabels || overlapsPoints)) {
        labelEl.style.display = 'none';
        continue;
      }

      occupiedRects.push(labelRect);
    }
  }

  function updateTopFocusHighlight() {
    const top = focusResults[0];
    // Relaxed visibility check for the highlight to prevent disappearance on zoom
    if (!top || !isWorldPointFrontFacing(top.position)) {
      topFocusHighlight.visible = false;
      topFocusGlow.visible = false;
      topFocusRing.visible = false;
      return;
    }
    
    // Update basic point highlight
    const geometry = topFocusHighlight.geometry;
    geometry.setAttribute('position', new THREE.Float32BufferAttribute([top.position.x, top.position.y, top.position.z], 3));
    geometry.computeBoundingSphere(); // Important for frustum culling
    topFocusHighlight.visible = true;

    const glowGeometry = topFocusGlow.geometry;
    glowGeometry.setAttribute('position', new THREE.Float32BufferAttribute([top.position.x, top.position.y, top.position.z], 3));
    glowGeometry.computeBoundingSphere();
    topFocusGlow.visible = true;

    // Update Scanner Ring
    topFocusRing.position.copy(top.position);
    topFocusRing.lookAt(0, 0, 0);
    topFocusRing.visible = true;

    const baseSize = currentPointSize();
    const t = performance.now() * 0.001;
    
    // Breathing animation: from 1.0X to 1.5X
    const breatheCycle = (1.0 + Math.sin(t * 2.5)) / 2.0; 
    const easedBreathe = Math.pow(breatheCycle, 1.5);

    // Update main highlight point (Range: 1.0 to 1.5)
    topFocusHighlight.material.size = baseSize * (1.0 + 0.5 * easedBreathe);
    topFocusHighlight.material.opacity = 0.75 + 0.25 * easedBreathe;
    
    // Update outer glow (Scaled proportionally)
    topFocusGlow.material.size = topFocusHighlight.material.size * 2.0;
    topFocusGlow.material.opacity = 0.2 + 0.3 * easedBreathe;
    topFocusGlow.material.color.lerpColors(
      new THREE.Color(0xffffff), 
      new THREE.Color(0x85e3ff), 
      easedBreathe
    );

    // Update Scanner Ring
    const wave = (t * 0.8) % 1.0;
    topFocusRing.scale.setScalar(baseSize * 10.0 * wave);
    topFocusRing.material.opacity = 0.6 * (1.0 - wave);
  }

  return {
    updateFocusResults,
    updateFocusLabels,
    updateTopFocusHighlight,
    getFocusResults: () => focusResults,
    isWorldPointVisible,
  };
}
