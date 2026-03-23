export const OPENAI_MATERIAL_ASSET_BASE = '/var/planet_material_assets/openai/v1';

export const BAKE_CHANNELS = [
  { channel: 'albedo', keySuffix: '', materialProperty: 'map' },
  { channel: 'normal', keySuffix: '_normal', materialProperty: 'normalMap' },
  { channel: 'roughness', keySuffix: '_roughness', materialProperty: 'roughnessMap' },
];

export function bakedTextureKey(mode, channel) {
  const channelConfig = BAKE_CHANNELS.find((entry) => entry.channel === channel);
  if (!channelConfig) {
    throw new Error(`unknown bake channel: ${channel}`);
  }
  return `${mode}${channelConfig.keySuffix}`;
}
