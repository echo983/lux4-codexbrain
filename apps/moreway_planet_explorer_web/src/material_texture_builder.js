import * as THREE from 'three';
import { sampleSurfaceValueBilinear } from './planet_surface.js';
import {
  computeDistortion,
  computeLandBandWeights,
  computeLandEcology,
  smoothstep,
} from './material_ecology.js';

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
  for (let index = 0; index < variantCount; index += 1) {
    const suffix = index === 0 ? '' : `_${String(index + 1).padStart(2, '0')}`;
    const url = `${materialBasePath}/${key}${suffix}.png`;
    try {
      const img = await loadImage(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
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

export async function buildPlanetMaterialTexture(surfaceMap, materialBasePath, materialRules) {
  const materialKeys = [
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
  const loadedEntries = await Promise.all([
    ...materialKeys.map(async (key) => [key, await loadMaterialVariants(materialBasePath, key, materialRules.variant_count)]),
    ['north_pole', await loadMaterialVariants(materialBasePath, 'north_pole', materialRules.variant_count)],
    ['south_pole', await loadMaterialVariants(materialBasePath, 'south_pole', materialRules.variant_count)],
  ]);
  const loaded = Object.fromEntries(loadedEntries);

  const scale = materialRules.texture_scale;
  const width = surfaceMap.lon_steps * scale;
  const height = surfaceMap.lat_steps * scale;
  const threshold = surfaceMap.land_threshold;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const image = ctx.createImageData(width, height);

  function sampleOceanFamilyRgb(seaLevel, u1, v1, u2, v2, distortion) {
    if (seaLevel < materialRules.ocean.deep_end) {
      return sampleMaterialRgb(loaded.deep_ocean, u1, v1, distortion);
    }
    if (seaLevel < materialRules.ocean.mid_end) {
      return blendRgb(
        sampleMaterialRgb(loaded.deep_ocean, u1, v1, distortion),
        sampleMaterialRgb(loaded.mid_ocean, u2, v2, distortion),
        smoothstep(materialRules.ocean.deep_end, materialRules.ocean.mid_end, seaLevel),
      );
    }
    if (seaLevel < materialRules.ocean.shallow_end) {
      return blendRgb(
        sampleMaterialRgb(loaded.mid_ocean, u1, v1, distortion),
        sampleMaterialRgb(loaded.shallow_ocean, u2, v2, distortion),
        smoothstep(materialRules.ocean.mid_end, materialRules.ocean.shallow_end, seaLevel),
      );
    }
    return blendRgb(
      sampleMaterialRgb(loaded.shallow_ocean, u1, v1, distortion),
      sampleMaterialRgb(loaded.coastal_water, u2, v2, distortion),
      smoothstep(materialRules.ocean.shallow_end, 1.0, seaLevel),
    );
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const su = x / width;
      const sv = y / height;
      const value = sampleSurfaceValueBilinear(surfaceMap, su, sv);
      const latitude = Math.abs(sv * 2 - 1);
      const polarBlend = smoothstep(materialRules.polar.blend_start, materialRules.polar.blend_end, latitude);
      const polarCapBlend = smoothstep(materialRules.polar.cap_start, materialRules.polar.cap_end, latitude);
      const isNorth = sv < 0.5;
      const polarExtent = materialRules.polar.extent;
      const polarRadius = isNorth
        ? Math.min(1, sv / polarExtent)
        : Math.min(1, (1 - sv) / polarExtent);
      const polarTheta = su * Math.PI * 2;
      const polarU = 0.5 + Math.cos(polarTheta) * polarRadius * 0.5;
      const polarV = 0.5 + Math.sin(polarTheta) * polarRadius * 0.5;
      const polarTexture = isNorth ? loaded.north_pole : loaded.south_pole;
      const poleRgb = sampleMaterialRgb(polarTexture, polarU, polarV, 0);

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
      const distortion = computeDistortion(su, sv);

      let rgb;
      let broadRgb;
      if (value < threshold) {
        const seaLevel = value / Math.max(threshold, 1);
        const oceanDetail = sampleOceanFamilyRgb(seaLevel, detailU, detailV, detailU2, detailV2, distortion);
        const oceanMicro = sampleOceanFamilyRgb(seaLevel, microU, microV, microV, microU, distortion * 1.3);
        broadRgb = sampleOceanFamilyRgb(seaLevel, broadU, broadV, broadU2, broadV2, distortion * 0.5);
        rgb = blendRgb(broadRgb, oceanDetail, materialRules.ocean.detail_mix);
        rgb = applyMaterialDetail(rgb, oceanMicro, materialRules.ocean.detail_amount);
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
        const compressed = Math.pow(landLevel, materialRules.land.exponent);
        const {
          dryness,
          vegetation,
          coldness,
        } = computeLandEcology({ su, sv, compressed, distortion }, materialRules);
        const ecologyRules = materialRules.land.ecology;
        const sampleCoast = (u, v, d) => blendRgb(
          sampleMaterialRgb(loaded.coast_wet, u, v, d),
          sampleMaterialRgb(loaded.coast_dry, u + ecologyRules.coast_offset_u, v + ecologyRules.coast_offset_v, d),
          dryness,
        );
        const sampleLowland = (u, v, d) => blendRgb(
          sampleMaterialRgb(loaded.lowland_grass, u, v, d),
          sampleMaterialRgb(loaded.lowland_forest, u + ecologyRules.lowland_offset_u, v + ecologyRules.lowland_offset_v, d),
          smoothstep(ecologyRules.vegetation_blend_start, ecologyRules.vegetation_blend_end, vegetation),
        );
        const sampleUpland = (u, v, d) => blendRgb(
          sampleMaterialRgb(loaded.upland_temperate, u, v, d),
          sampleMaterialRgb(loaded.upland_dry, u + ecologyRules.upland_offset_u, v + ecologyRules.upland_offset_v, d),
          smoothstep(0.32, 0.78, dryness),
        );
        const sampleMountain = (u, v, d) => blendRgb(
          sampleMaterialRgb(loaded.mountain_rock, u, v, d),
          sampleMaterialRgb(loaded.mountain_snow, u + ecologyRules.mountain_offset_u, v + ecologyRules.mountain_offset_v, d),
          smoothstep(ecologyRules.snow_blend_start, ecologyRules.snow_blend_end, coldness + compressed * ecologyRules.coldness_height_bonus),
        );
        const weights = computeLandBandWeights(compressed, materialRules);
        let detailRgb;
        let microRgb;
        if (weights.coast === 1) {
          detailRgb = sampleCoast(detailU, detailV, distortion);
          microRgb = sampleCoast(microU, microV, distortion * 1.15);
          broadRgb = sampleCoast(broadU, broadV, distortion * 0.5);
        } else if (weights.coast > 0 && weights.lowland > 0) {
          detailRgb = blendRgb(
            sampleCoast(detailU, detailV, distortion),
            sampleLowland(detailU2, detailV2, distortion),
            weights.lowland,
          );
          microRgb = blendRgb(
            sampleCoast(microU, microV, distortion * 1.15),
            sampleLowland(microV, microU, distortion * 1.15),
            weights.lowland,
          );
          broadRgb = blendRgb(
            sampleCoast(broadU, broadV, distortion * 0.5),
            sampleLowland(broadU2, broadV2, distortion * 0.5),
            weights.lowland,
          );
        } else if (weights.lowland > 0 && weights.upland > 0) {
          detailRgb = blendRgb(
            sampleLowland(detailU, detailV, distortion),
            sampleUpland(detailU2, detailV2, distortion),
            weights.upland,
          );
          microRgb = blendRgb(
            sampleLowland(microU, microV, distortion * 1.15),
            sampleUpland(microV, microU, distortion * 1.15),
            weights.upland,
          );
          broadRgb = blendRgb(
            sampleLowland(broadU, broadV, distortion * 0.5),
            sampleUpland(broadU2, broadV2, distortion * 0.5),
            weights.upland,
          );
        } else {
          detailRgb = blendRgb(
            sampleUpland(detailU, detailV, distortion),
            sampleMountain(detailU2, detailV2, distortion),
            weights.mountain,
          );
          microRgb = blendRgb(
            sampleUpland(microU, microV, distortion * 1.15),
            sampleMountain(microV, microU, distortion * 1.15),
            weights.mountain,
          );
          broadRgb = blendRgb(
            sampleUpland(broadU, broadV, distortion * 0.5),
            sampleMountain(broadU2, broadV2, distortion * 0.5),
            weights.mountain,
          );
        }
        rgb = blendRgb(broadRgb, detailRgb, materialRules.land.detail_mix);
        rgb = applyMaterialDetail(rgb, microRgb, materialRules.land.detail_amount);
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

      rgb = tuneMaterialColor(rgb, value < threshold ? materialRules.ocean.tone : materialRules.land.tone);

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
