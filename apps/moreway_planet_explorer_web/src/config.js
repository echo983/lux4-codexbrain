export const DATASET_BASE = '/var/moreway_planet_dataset';
export const BASE_POINT_SIZE = 0.08;
export const DEFAULT_TEXTURE_MODE = 'openai_materials';

export const INITIAL_CAMERA = {
  fov: 50,
  near: 0.1,
  far: 500,
  position: [0, 20, 40],
};

export const PLANET_COLORS = {
  background: 0x050a0f,
  atmosphere: 0x4fbfff,
  ambientLight: 0x9abde0,
  directionalLight: 0xcde7ff,
};

export const BLOOM_PARAMS = {
  strength: 1.05,
  radius: 0.38,
  threshold: 0.1,
};
