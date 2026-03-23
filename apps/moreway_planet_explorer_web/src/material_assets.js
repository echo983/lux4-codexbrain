export const OPENAI_MATERIAL_ASSET_BASE = '/var/planet_material_assets/openai/v1';
export const DEFAULT_TEXTURE_MODE = 'openai_materials';

export const BAKE_CHANNELS = [
  { channel: 'albedo', keySuffix: '', materialProperty: 'map' },
  { channel: 'normal', keySuffix: '_normal', materialProperty: 'normalMap' },
  { channel: 'roughness', keySuffix: '_roughness', materialProperty: 'roughnessMap' },
];

export const TEXTURE_MODE_SPECS = {
  surface_map: {
    mode: 'surface_map',
    usesBakedTextures: false,
    assetBase: null,
  },
  openai_materials: {
    mode: 'openai_materials',
    usesBakedTextures: true,
    assetBase: OPENAI_MATERIAL_ASSET_BASE,
  },
};

export function bakedTextureKey(mode, channel) {
  const channelConfig = BAKE_CHANNELS.find((entry) => entry.channel === channel);
  if (!channelConfig) {
    throw new Error(`unknown bake channel: ${channel}`);
  }
  return `${mode}${channelConfig.keySuffix}`;
}

export function getTextureModeSpec(mode) {
  const spec = TEXTURE_MODE_SPECS[mode];
  if (!spec) {
    throw new Error(`unknown texture mode: ${mode}`);
  }
  return spec;
}

export function getBakedTextureUrls({ dataSetBase, manifest, mode }) {
  const spec = getTextureModeSpec(mode);
  if (!spec.usesBakedTextures) {
    return null;
  }
  return Object.fromEntries(
    BAKE_CHANNELS.map(({ channel }) => {
      const key = bakedTextureKey(mode, channel);
      const relative = manifest?.planet?.baked_textures?.[key];
      const url = relative
        ? `${dataSetBase}/${relative}`
        : manifest?.build_id
          ? `${dataSetBase}/builds/${manifest.build_id}/textures/${key}.png`
          : '';
      return [channel, url];
    }),
  );
}
