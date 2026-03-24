export function computeLandEcology({ su, sv, compressed, distortion }, rules) {
  const ecology = rules.land.ecology;
  const latitude = Math.abs(sv * 2 - 1);
  const distortionN = (distortion + 1) * 0.5;
  const moisture = clamp(
    ecology.moisture_base
      - latitude * ecology.moisture_latitude_penalty
      - distortionN * ecology.moisture_distortion_penalty
      + (1 - compressed) * ecology.moisture_lowland_bonus
      + Math.sin((su * ecology.moisture_wave_u + sv * ecology.moisture_wave_v) * Math.PI * 2)
        * ecology.moisture_wave_amplitude,
    0,
    1,
  );
  const dryness = clamp(1 - moisture + compressed * ecology.dryness_height_bonus, 0, 1);
  const vegetation = clamp(
    moisture * ecology.vegetation_moisture_scale
      + (1 - latitude) * ecology.vegetation_latitude_bonus
      - compressed * ecology.vegetation_height_penalty,
    0,
    1,
  );
  const coldness = clamp(
    latitude * ecology.coldness_latitude_scale
      + compressed * ecology.coldness_height_bonus
      - moisture * ecology.coldness_moisture_penalty,
    0,
    1,
  );
  return {
    latitude,
    moisture,
    dryness,
    vegetation,
    coldness,
  };
}

export function clamp(value, low, high) {
  return Math.max(low, Math.min(high, value));
}

export function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / Math.max(edge1 - edge0, 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
}

export function computeDistortion(su, sv) {
  return Math.sin((su * 7.0 + sv * 3.0) * Math.PI * 2) * 0.5
    + Math.cos((su * 4.0 - sv * 5.0) * Math.PI * 2) * 0.5;
}

export function computeLandBandWeights(compressed, rules) {
  const landRules = rules.land;
  if (compressed < landRules.coast_end) {
    return { coast: 1, lowland: 0, upland: 0, mountain: 0 };
  }
  if (compressed < landRules.lowland_end) {
    const t = smoothstep(landRules.coast_end, landRules.lowland_end, compressed);
    return { coast: 1 - t, lowland: t, upland: 0, mountain: 0 };
  }
  if (compressed < landRules.upland_end) {
    const t = smoothstep(landRules.lowland_end, landRules.upland_end, compressed);
    return { coast: 0, lowland: 1 - t, upland: t, mountain: 0 };
  }
  const t = smoothstep(landRules.upland_end, 1.0, compressed);
  return { coast: 0, lowland: 0, upland: 1 - t, mountain: t };
}
