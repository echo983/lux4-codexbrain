export const DATASET_BASE = '/var/moreway_planet_dataset';
export const BASE_POINT_SIZE = 0.16;
export const DEFAULT_TEXTURE_MODE = 'planet_shader';

export const INITIAL_CAMERA = {
  fov: 52,
  near: 0.1,
  far: 800,
  position: [0, 20, 42],
};

export const PLANET_COLORS = {
  background: 0x05080b,
  atmosphere: 0x4fbfff,
  ambientLight: 0x9abde0,
  directionalLight: 0xffffff,
};

export const BLOOM_PARAMS = {
  strength: 1.2,
  radius: 0.4,
  threshold: 0.85, // High threshold to keep space dark but glow the highlights
};
