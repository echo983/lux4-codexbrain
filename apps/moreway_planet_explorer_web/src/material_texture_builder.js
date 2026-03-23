import * as THREE from 'three';
import { sampleSurfaceValueBilinear } from './planet_surface.js';

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

export async function buildPlanetMaterialTexture(surfaceMap, materialBasePath) {
  const materialKeys = ['deep_ocean', 'shallow_ocean', 'coast', 'lowland', 'upland', 'mountain_snow'];
  const loadedEntries = await Promise.all([
    ...materialKeys.map(async (key) => [key, await loadMaterialVariants(materialBasePath, key, 3)]),
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
        const oceanDetail = seaLevel < 0.58
          ? sampleMaterialRgb(loaded.deep_ocean, detailU, detailV, distortion)
          : blendRgb(
            sampleMaterialRgb(loaded.deep_ocean, detailU, detailV, distortion),
            sampleMaterialRgb(loaded.shallow_ocean, detailU2, detailV2, distortion),
            smoothstep(0.58, 1.0, seaLevel),
          );
        const oceanMicro = seaLevel < 0.58
          ? sampleMaterialRgb(loaded.deep_ocean, microU, microV, distortion * 1.3)
          : blendRgb(
            sampleMaterialRgb(loaded.deep_ocean, microU, microV, distortion * 1.3),
            sampleMaterialRgb(loaded.shallow_ocean, microV, microU, distortion * 1.3),
            smoothstep(0.58, 1.0, seaLevel),
          );
        broadRgb = seaLevel < 0.58
          ? sampleMaterialRgb(loaded.deep_ocean, broadU, broadV, distortion * 0.5)
          : blendRgb(
            sampleMaterialRgb(loaded.deep_ocean, broadU, broadV, distortion * 0.5),
            sampleMaterialRgb(loaded.shallow_ocean, broadU2, broadV2, distortion * 0.5),
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
        let detailRgb;
        let microRgb;
        if (compressed < 0.18) {
          detailRgb = sampleMaterialRgb(loaded.coast, detailU, detailV, distortion);
          microRgb = sampleMaterialRgb(loaded.coast, microU, microV, distortion * 1.15);
          broadRgb = sampleMaterialRgb(loaded.coast, broadU, broadV, distortion * 0.5);
        } else if (compressed < 0.58) {
          detailRgb = blendRgb(
            sampleMaterialRgb(loaded.coast, detailU, detailV, distortion),
            sampleMaterialRgb(loaded.lowland, detailU2, detailV2, distortion),
            smoothstep(0.18, 0.58, compressed),
          );
          microRgb = blendRgb(
            sampleMaterialRgb(loaded.coast, microU, microV, distortion * 1.15),
            sampleMaterialRgb(loaded.lowland, microV, microU, distortion * 1.15),
            smoothstep(0.18, 0.58, compressed),
          );
          broadRgb = blendRgb(
            sampleMaterialRgb(loaded.coast, broadU, broadV, distortion * 0.5),
            sampleMaterialRgb(loaded.lowland, broadU2, broadV2, distortion * 0.5),
            smoothstep(0.18, 0.58, compressed),
          );
        } else if (compressed < 0.86) {
          detailRgb = blendRgb(
            sampleMaterialRgb(loaded.lowland, detailU, detailV, distortion),
            sampleMaterialRgb(loaded.upland, detailU2, detailV2, distortion),
            smoothstep(0.58, 0.86, compressed),
          );
          microRgb = blendRgb(
            sampleMaterialRgb(loaded.lowland, microU, microV, distortion * 1.15),
            sampleMaterialRgb(loaded.upland, microV, microU, distortion * 1.15),
            smoothstep(0.58, 0.86, compressed),
          );
          broadRgb = blendRgb(
            sampleMaterialRgb(loaded.lowland, broadU, broadV, distortion * 0.5),
            sampleMaterialRgb(loaded.upland, broadU2, broadV2, distortion * 0.5),
            smoothstep(0.58, 0.86, compressed),
          );
        } else {
          detailRgb = blendRgb(
            sampleMaterialRgb(loaded.upland, detailU, detailV, distortion),
            sampleMaterialRgb(loaded.mountain_snow, detailU2, detailV2, distortion),
            smoothstep(0.86, 1.0, compressed),
          );
          microRgb = blendRgb(
            sampleMaterialRgb(loaded.upland, microU, microV, distortion * 1.15),
            sampleMaterialRgb(loaded.mountain_snow, microV, microU, distortion * 1.15),
            smoothstep(0.86, 1.0, compressed),
          );
          broadRgb = blendRgb(
            sampleMaterialRgb(loaded.upland, broadU, broadV, distortion * 0.5),
            sampleMaterialRgb(loaded.mountain_snow, broadU2, broadV2, distortion * 0.5),
            smoothstep(0.86, 1.0, compressed),
          );
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
