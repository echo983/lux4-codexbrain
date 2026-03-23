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
const planetTextureModeEl = document.getElementById('planet-texture-mode');

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

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`failed to load image: ${url}`));
    img.src = url;
  });
}

function sampleImageData(imageData, width, height, u, v) {
  const x = ((u % 1) + 1) % 1;
  const y = ((v % 1) + 1) % 1;
  const ix = Math.min(width - 1, Math.floor(x * width));
  const iy = Math.min(height - 1, Math.floor(y * height));
  const index = (iy * width + ix) * 4;
  return [
    imageData[index],
    imageData[index + 1],
    imageData[index + 2],
  ];
}

function sampleImageDataBilinear(imageData, width, height, u, v) {
  const x = ((u % 1) + 1) % 1 * width;
  const y = ((v % 1) + 1) % 1 * height;
  const x0 = Math.floor(x) % width;
  const x1 = (x0 + 1) % width;
  const y0 = Math.floor(y) % height;
  const y1 = (y0 + 1) % height;
  const tx = x - Math.floor(x);
  const ty = y - Math.floor(y);

  const c00 = sampleImageData(imageData, width, height, x0 / width, y0 / height);
  const c10 = sampleImageData(imageData, width, height, x1 / width, y0 / height);
  const c01 = sampleImageData(imageData, width, height, x0 / width, y1 / height);
  const c11 = sampleImageData(imageData, width, height, x1 / width, y1 / height);

  return [
    Math.round((c00[0] * (1 - tx) + c10[0] * tx) * (1 - ty) + (c01[0] * (1 - tx) + c11[0] * tx) * ty),
    Math.round((c00[1] * (1 - tx) + c10[1] * tx) * (1 - ty) + (c01[1] * (1 - tx) + c11[1] * tx) * ty),
    Math.round((c00[2] * (1 - tx) + c10[2] * tx) * (1 - ty) + (c01[2] * (1 - tx) + c11[2] * tx) * ty),
  ];
}

function sampleSurfaceValueBilinear(surfaceMap, u, v) {
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

function blendRgb(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function multiplyRgb(a, b) {
  return [
    Math.round((a[0] * b[0]) / 255),
    Math.round((a[1] * b[1]) / 255),
    Math.round((a[2] * b[2]) / 255),
  ];
}

function luminance(rgb) {
  return (rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114) / 255;
}

async function loadMaterialVariants(materialBasePath, key, variantCount = 3) {
  const variants = [];
  let loadedFormal = false;
  for (let index = 0; index < variantCount; index += 1) {
    const url = `${materialBasePath}/${key}/albedo_${String(index + 1).padStart(2, '0')}.png`;
    try {
      const img = await loadImage(url);
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      variants.push({
        width: img.width,
        height: img.height,
        data: ctx.getImageData(0, 0, img.width, img.height).data,
      });
      loadedFormal = true;
    } catch {
      if (index === 0) break;
    }
  }
  if (loadedFormal) {
    return variants;
  }
  for (let index = 0; index < variantCount; index += 1) {
    const suffix = index === 0 ? '' : `_${String(index + 1).padStart(2, '0')}`;
    const url = `${materialBasePath}/${key}${suffix}.png`;
    try {
      const img = await loadImage(url);
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      variants.push({
        width: img.width,
        height: img.height,
        data: ctx.getImageData(0, 0, img.width, img.height).data,
      });
    } catch {
      if (index === 0) {
        throw new Error(`failed to load base material texture: ${url}`);
      }
    }
  }
  return variants;
}

function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / Math.max(edge1 - edge0, 1e-6)));
  return t * t * (3 - 2 * t);
}

function sampleVariant(texture, u, v, distortion = 0) {
  const base = sampleImageDataBilinear(texture.data, texture.width, texture.height, u, v);
  const shifted = sampleImageDataBilinear(
    texture.data,
    texture.width,
    texture.height,
    u + 0.37 + distortion * 0.11,
    v + 0.21 - distortion * 0.07,
  );
  const skewed = sampleImageDataBilinear(
    texture.data,
    texture.width,
    texture.height,
    u * 0.83 - v * 0.17 + 0.19 + distortion * 0.05,
    v * 0.79 + u * 0.19 + 0.13 - distortion * 0.03,
  );
  return blendRgb(blendRgb(base, shifted, 0.34), skewed, 0.18);
}

function sampleMaterialRgb(textures, u, v, distortion = 0) {
  const variants = Array.isArray(textures) ? textures : [textures];
  if (variants.length === 1) {
    return sampleVariant(variants[0], u, v, distortion);
  }
  const centerWeight = (x, y) => {
    const fx = 1 - Math.abs((((x % 1) + 1) % 1) - 0.5) * 2;
    const fy = 1 - Math.abs((((y % 1) + 1) % 1) - 0.5) * 2;
    return Math.max(0, fx) * Math.max(0, fy);
  };
  let accum = [0, 0, 0];
  let total = 0;
  variants.forEach((texture, index) => {
    const offsetU = u + index * 0.173 + distortion * (0.04 + index * 0.01);
    const offsetV = v + index * 0.127 - distortion * (0.03 + index * 0.008);
    const sample = sampleVariant(texture, offsetU, offsetV, distortion * (1 + index * 0.15));
    const weight = 0.18 + centerWeight(offsetU, offsetV);
    accum = [
      accum[0] + sample[0] * weight,
      accum[1] + sample[1] * weight,
      accum[2] + sample[2] * weight,
    ];
    total += weight;
  });
  return [
    Math.round(accum[0] / Math.max(total, 1e-6)),
    Math.round(accum[1] / Math.max(total, 1e-6)),
    Math.round(accum[2] / Math.max(total, 1e-6)),
  ];
}

function applyMaterialDetail(baseRgb, detailRgb, amount = 0.25) {
  const detailLuma = luminance(detailRgb);
  const neutralized = blendRgb([128, 128, 128], detailRgb, 0.82);
  const multiplied = multiplyRgb(baseRgb, neutralized);
  const contrastAmount = Math.max(0, Math.min(1, amount * (0.55 + Math.abs(detailLuma - 0.5) * 0.7)));
  return blendRgb(baseRgb, multiplied, contrastAmount);
}

function tuneMaterialColor(rgb, { saturation = 1.1, gain = 1.06, lift = 4 } = {}) {
  const luma = luminance(rgb) * 255;
  const lifted = rgb.map((channel) => channel * gain + lift);
  const tuned = lifted.map((channel) => luma + (channel - luma) * saturation);
  return tuned.map((channel) => Math.max(0, Math.min(255, Math.round(channel))));
}

const MATERIAL_FAMILY_ALIASES = {
  deep_ocean: ['deep_ocean'],
  mid_ocean: ['mid_ocean', 'deep_ocean'],
  shallow_ocean: ['shallow_ocean'],
  coastal_water: ['coastal_water', 'shallow_ocean'],
  coast_wet: ['coast_wet', 'coast'],
  coast_dry: ['coast_dry', 'coast'],
  lowland_grass: ['lowland_grass', 'lowland'],
  lowland_forest: ['lowland_forest', 'lowland'],
  upland_temperate: ['upland_temperate', 'upland'],
  upland_dry: ['upland_dry', 'upland'],
  mountain_rock: ['mountain_rock', 'upland'],
  mountain_snow: ['mountain_snow'],
};

const PRIMARY_FAMILIES = [
  'deep_ocean',
  'mid_ocean',
  'shallow_ocean',
  'coastal_water',
  'coast_wet',
  'coast_dry',
  'lowland_grass',
  'lowland_forest',
  'upland_temperate',
  'upland_dry',
  'mountain_rock',
  'mountain_snow',
];

function regionalVariation(u, v) {
  return (
    Math.sin((u * 1.73 + v * 0.41) * Math.PI * 2) * 0.35
    + Math.cos((u * 0.67 - v * 1.21) * Math.PI * 2) * 0.25
    + Math.sin((u * 0.19 + v * 0.14) * Math.PI * 6) * 0.10
  );
}

function deriveRegionStyleFields(u, v, compressedLand, continentBias = 0) {
  const latitude = Math.abs(v * 2 - 1);
  const variation = regionalVariation(u, v);
  const dryness = Math.max(0, Math.min(1, 0.46 + continentBias * 0.22 + variation * 0.45 - compressedLand * 0.08));
  const coldness = Math.max(0, Math.min(1, latitude * 0.82 + compressedLand * 0.18));
  const vegetation = Math.max(0, Math.min(1, 1 - dryness * 0.92 - coldness * 0.58));
  return { latitude, regional_variation: variation, dryness, coldness, vegetation };
}

function chooseLandFamilies(compressedLand, styleFields) {
  const { dryness, vegetation, coldness } = styleFields;
  if (compressedLand < 0.18) {
    return [dryness > 0.58 ? 'coast_dry' : 'coast_wet', dryness > 0.72 ? 'coast_dry' : 'coast_wet'];
  }
  if (compressedLand < 0.58) {
    const primary = vegetation > 0.44 ? 'lowland_forest' : 'lowland_grass';
    return [primary, primary === 'lowland_forest' ? 'lowland_grass' : 'lowland_forest'];
  }
  if (compressedLand < 0.86) {
    const primary = dryness > 0.55 ? 'upland_dry' : 'upland_temperate';
    return [primary, primary === 'upland_dry' ? 'upland_temperate' : 'upland_dry'];
  }
  return coldness > 0.52 ? ['mountain_snow', 'mountain_rock'] : ['mountain_rock', 'mountain_snow'];
}

function chooseOceanFamilies(seaLevel, latitude) {
  if (seaLevel < 0.36) return ['deep_ocean', 'mid_ocean'];
  if (seaLevel < 0.72) return ['mid_ocean', 'deep_ocean'];
  if (latitude > 0.78) return ['coastal_water', 'shallow_ocean'];
  return ['shallow_ocean', 'coastal_water'];
}

async function loadResolvedMaterialVariants(materialBasePath, family, variantCount = 3) {
  for (const alias of MATERIAL_FAMILY_ALIASES[family]) {
    try {
      return await loadMaterialVariants(materialBasePath, alias, variantCount);
    } catch (error) {
      if (alias === MATERIAL_FAMILY_ALIASES[family].at(-1)) {
        throw error;
      }
    }
  }
  throw new Error(`failed to resolve material family: ${family}`);
}

async function buildPlanetMaterialTexture(surfaceMap, materialBasePath) {
  const loadedEntries = await Promise.all([
    ...PRIMARY_FAMILIES.map(async (family) => [family, await loadResolvedMaterialVariants(materialBasePath, family, 3)]),
    ['north_pole', (await loadMaterialVariants(materialBasePath, 'north_pole', 1))[0]],
    ['south_pole', (await loadMaterialVariants(materialBasePath, 'south_pole', 1))[0]],
  ]);
  const loaded = Object.fromEntries(loadedEntries);

  const scale = 12;
  const width = surfaceMap.lon_steps * scale;
  const height = surfaceMap.lat_steps * scale;
  const threshold = surfaceMap.land_threshold;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const image = ctx.createImageData(width, height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const su = x / width;
      const sv = y / height;
      const value = sampleSurfaceValueBilinear(surfaceMap, su, sv);
      const latitude = Math.abs(sv * 2 - 1);
      const polarBlend = smoothstep(0.72, 0.96, latitude);
      const polarCapBlend = smoothstep(0.84, 1.0, latitude);
      const isNorth = sv < 0.5;
      const polarExtent = 0.28;
      const polarRadius = isNorth
        ? Math.min(1, sv / polarExtent)
        : Math.min(1, (1 - sv) / polarExtent);
      const polarTheta = su * Math.PI * 2;
      const polarU = 0.5 + Math.cos(polarTheta) * polarRadius * 0.5;
      const polarV = 0.5 + Math.sin(polarTheta) * polarRadius * 0.5;
      const polarTexture = isNorth ? loaded.north_pole : loaded.south_pole;
      const poleRgb = sampleImageData(polarTexture.data, polarTexture.width, polarTexture.height, polarU, polarV);

      const detailU = su * 6.5 + sv * 0.7;
      const detailV = sv * 4.5 + su * 0.35;
      const detailU2 = su * 12.0 - sv * 0.9;
      const detailV2 = sv * 8.0 + su * 0.6;
      const microU = su * 22.0 + sv * 1.4;
      const microV = sv * 18.0 - su * 1.1;
      const broadU = su * 1.6 + sv * 0.15;
      const broadV = sv * 1.4 + su * 0.08;
      const broadU2 = su * 2.4 - sv * 0.18;
      const broadV2 = sv * 2.0 + su * 0.11;
      const distortion = Math.sin((su * 7.0 + sv * 3.0) * Math.PI * 2) * 0.5
        + Math.cos((su * 4.0 - sv * 5.0) * Math.PI * 2) * 0.5;

      let rgb;
      let broadRgb;
      if (value < threshold) {
        const seaLevel = value / Math.max(threshold, 1);
        const [primaryFamily, secondaryFamily] = chooseOceanFamilies(seaLevel, latitude);
        const oceanDetail = seaLevel < 0.58
          ? sampleMaterialRgb(loaded[primaryFamily], detailU, detailV, distortion)
          : blendRgb(
            sampleMaterialRgb(loaded[primaryFamily], detailU, detailV, distortion),
            sampleMaterialRgb(loaded[secondaryFamily], detailU2, detailV2, distortion),
            smoothstep(0.58, 1.0, seaLevel),
          );
        const oceanMicro = seaLevel < 0.58
          ? sampleMaterialRgb(loaded[primaryFamily], microU, microV, distortion * 1.3)
          : blendRgb(
            sampleMaterialRgb(loaded[primaryFamily], microU, microV, distortion * 1.3),
            sampleMaterialRgb(loaded[secondaryFamily], microV, microU, distortion * 1.3),
            smoothstep(0.58, 1.0, seaLevel),
          );
        broadRgb = seaLevel < 0.58
          ? sampleMaterialRgb(loaded[primaryFamily], broadU, broadV, distortion * 0.5)
          : blendRgb(
            sampleMaterialRgb(loaded[primaryFamily], broadU, broadV, distortion * 0.5),
            sampleMaterialRgb(loaded[secondaryFamily], broadU2, broadV2, distortion * 0.5),
            smoothstep(0.58, 1.0, seaLevel),
          );
        rgb = blendRgb(broadRgb, oceanDetail, 0.44);
        rgb = applyMaterialDetail(rgb, oceanMicro, 0.16);
        if (polarBlend > 0) {
          rgb = blendRgb(rgb, broadRgb, polarBlend * 0.9);
        }
        if (polarCapBlend > 0.05) {
          const icyOcean = blendRgb(broadRgb, [220, 235, 245], polarCapBlend * 0.45);
          rgb = blendRgb(rgb, icyOcean, polarCapBlend * 0.65);
        }
        if (polarBlend > 0.08) {
          rgb = blendRgb(rgb, poleRgb, polarBlend * 0.82);
        }
      } else {
        const landLevel = (value - threshold) / Math.max(255 - threshold, 1);
        const compressed = Math.pow(landLevel, 1.55);
        const styleFields = deriveRegionStyleFields(su, sv, compressed);
        const [primaryFamily, secondaryFamily] = chooseLandFamilies(compressed, styleFields);
        let detailRgb = sampleMaterialRgb(loaded[primaryFamily], detailU, detailV, distortion);
        const secondaryRgb = sampleMaterialRgb(loaded[secondaryFamily], detailU2, detailV2, distortion);
        const microRgb = sampleMaterialRgb(loaded[primaryFamily], microU, microV, distortion * 1.15);
        broadRgb = sampleMaterialRgb(loaded[primaryFamily], broadU, broadV, distortion * 0.5);
        if (primaryFamily !== secondaryFamily) {
          const bandMix = smoothstep(0, 1, compressed);
          detailRgb = blendRgb(detailRgb, secondaryRgb, bandMix * 0.28);
        }
        rgb = blendRgb(broadRgb, detailRgb, 0.48);
        rgb = applyMaterialDetail(rgb, microRgb, 0.28);
        if (polarBlend > 0) {
          rgb = blendRgb(rgb, broadRgb, polarBlend * 0.92);
        }
        if (polarCapBlend > 0.05) {
          const snowCap = blendRgb(broadRgb, [242, 246, 250], polarCapBlend * 0.88);
          rgb = blendRgb(rgb, snowCap, polarCapBlend * 0.72);
        }
        if (polarBlend > 0.08) {
          const polarLand = blendRgb(poleRgb, broadRgb, 0.22);
          rgb = blendRgb(rgb, polarLand, polarBlend * 0.88);
        }
      }

      rgb = tuneMaterialColor(rgb, value < threshold
        ? { saturation: 1.08, gain: 1.08, lift: 6 }
        : { saturation: 1.12, gain: 1.07, lift: 5 });

      const pixel = (y * width + x) * 4;
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
const textureLoader = new THREE.TextureLoader();
const textureCache = new Map();
let baseSurfaceTexture = null;
let openaiMaterialTexture = null;
let currentTextureMode = 'surface_map';
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

async function loadExternalTexture(url) {
  if (textureCache.has(url)) {
    return textureCache.get(url);
  }
  const texture = await new Promise((resolve, reject) => {
    textureLoader.load(
      url,
      (loaded) => resolve(loaded),
      undefined,
      (err) => reject(err || new Error(`failed to load texture: ${url}`)),
    );
  });
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  textureCache.set(url, texture);
  return texture;
}

function bakedTextureUrl(mode) {
  const relative = manifest?.planet?.baked_textures?.[mode];
  if (relative) {
    return `${DATASET_BASE}/${relative}`;
  }
  if (!manifest?.build_id) return '';
  return `${DATASET_BASE}/builds/${manifest.build_id}/textures/${mode}.png`;
}

async function applyPlanetTextureMode(mode) {
  currentTextureMode = mode;
  try {
    if (mode === 'surface_map') {
      if (baseSurfaceTexture) {
        planet.material.map = baseSurfaceTexture;
        planet.material.needsUpdate = true;
      }
      return;
    }
    if (mode === 'openai_materials') {
      if (!manifest?.planet?.surface_map) {
        throw new Error('surface_map unavailable');
      }
      if (!openaiMaterialTexture) {
        const bakedUrl = bakedTextureUrl('openai_materials');
        if (bakedUrl) {
          setStatus('正在加载 OpenAI 预烘焙地表材质…');
          openaiMaterialTexture = await loadExternalTexture(bakedUrl);
        } else {
          setStatus('正在构建 OpenAI 地表材质…');
          openaiMaterialTexture = await buildPlanetMaterialTexture(
            manifest.planet.surface_map,
            '/var/planet_material_assets/openai/v1',
          );
        }
      }
      if (currentTextureMode !== mode) return;
      planet.material.map = openaiMaterialTexture;
      planet.material.needsUpdate = true;
      return;
    }
    throw new Error(`unknown texture mode: ${mode}`);
  } catch (error) {
    setStatus(`OpenAI 材质不可用，已降级原始贴图：${error.message}`);
    currentTextureMode = 'surface_map';
    if (planetTextureModeEl) {
      planetTextureModeEl.value = 'surface_map';
    }
    if (baseSurfaceTexture) {
      planet.material.map = baseSurfaceTexture;
      planet.material.needsUpdate = true;
    }
  }
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
      baseSurfaceTexture = buildPlanetTexture(manifest.planet.surface_map);
      planet.material.map = baseSurfaceTexture;
      planet.material.needsUpdate = true;
    }
    await ensureVisibleChunks();
    setSelection(null);
    updateFocusResults();
    await applyPlanetTextureMode(currentTextureMode);
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
planetTextureModeEl.addEventListener('change', () => {
  applyPlanetTextureMode(planetTextureModeEl.value);
});
syncFocusRegionVisibility();
animate();
