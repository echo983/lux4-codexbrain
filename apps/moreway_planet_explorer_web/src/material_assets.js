export const OPENAI_MATERIAL_ASSET_BASE = '/var/planet_material_assets/openai/v1';

export const BAKE_CHANNELS = [
  { channel: 'albedo', keySuffix: '', materialProperty: 'map' },
];

export const TEXTURE_MODE_SPECS = {
  openai_materials: {
    mode: 'openai_materials',
    usesBakedTextures: true,
    assetBase: OPENAI_MATERIAL_ASSET_BASE,
  },
};

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
      const key = `${mode}${channel === 'albedo' ? '' : `_${channel}`}`;
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
