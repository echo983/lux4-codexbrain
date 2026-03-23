import * as THREE from 'three';

export function surfaceDisplacementFromValue(surfaceMap, value) {
  const threshold = surfaceMap.land_threshold;
  if (value < threshold) {
    const seaLevel = value / Math.max(threshold, 1);
    return -0.006 * (1 - seaLevel);
  }
  const landLevel = (value - threshold) / Math.max(255 - threshold, 1);
  const compressed = Math.pow(landLevel, 1.28);
  return 0.028 * compressed;
}

export function computePointShellRadius(surfaceMap, planetRadius, fallbackPointRadius) {
  const values = Array.isArray(surfaceMap?.values) ? surfaceMap.values : [];
  if (!values.length) return fallbackPointRadius;
  let maxDisplacement = -Infinity;
  for (const value of values) {
    const displacement = surfaceDisplacementFromValue(surfaceMap, value);
    if (displacement > maxDisplacement) {
      maxDisplacement = displacement;
    }
  }
  const reliefOuterRadius = planetRadius * (1 + Math.max(maxDisplacement, 0));
  return Math.max(fallbackPointRadius, reliefOuterRadius + 0.14);
}

export function sampleSurfaceValueBilinear(surfaceMap, u, v) {
  const width = surfaceMap.lon_steps;
  const height = surfaceMap.lat_steps;
  const x = ((u % 1) + 1) % 1 * width;
  const y = Math.max(0, Math.min(height - 1, v * (height - 1)));

  const x0 = Math.floor(x) % width;
  const x1 = (x0 + 1) % width;
  const y0 = Math.floor(y);
  const y1 = Math.min(height - 1, y0 + 1);
  const tx = x - Math.floor(x);
  const ty = y - y0;

  const i00 = y0 * width + x0;
  const i10 = y0 * width + x1;
  const i01 = y1 * width + x0;
  const i11 = y1 * width + x1;

  const v00 = surfaceMap.values[i00];
  const v10 = surfaceMap.values[i10];
  const v01 = surfaceMap.values[i01];
  const v11 = surfaceMap.values[i11];

  const top = v00 + (v10 - v00) * tx;
  const bottom = v01 + (v11 - v01) * tx;
  return top + (bottom - top) * ty;
}

export function applyPlanetSurfaceRelief(planet, planetBasePositions, surfaceMap) {
  const geometry = planet.geometry;
  const position = geometry.attributes.position;

  for (let i = 0; i < position.count; i += 1) {
    const baseX = planetBasePositions[i * 3];
    const baseY = planetBasePositions[i * 3 + 1];
    const baseZ = planetBasePositions[i * 3 + 2];
    const baseVec = new THREE.Vector3(baseX, baseY, baseZ).normalize();

    const u = 0.5 + Math.atan2(baseVec.z, baseVec.x) / (Math.PI * 2);
    const v = 0.5 - Math.asin(THREE.MathUtils.clamp(baseVec.y, -1, 1)) / Math.PI;
    const value = sampleSurfaceValueBilinear(surfaceMap, u, v);
    const displacement = surfaceDisplacementFromValue(surfaceMap, value);

    const scale = 1 + displacement;
    position.setXYZ(i, baseVec.x * scale, baseVec.y * scale, baseVec.z * scale);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
}

export function buildPlanetTexture(surfaceMap) {
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
        rgb = seaLevel < 0.55
          ? mixColor(deepSea, sea, deepBand)
          : mixColor(sea, shallowSea, shallowBand);
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
