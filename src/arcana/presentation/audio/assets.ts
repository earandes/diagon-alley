export const soundAssets = {
  'cast-order': new URL('./assets/cast-order.wav', import.meta.url).href,
  'cast-death': new URL('./assets/cast-death.wav', import.meta.url).href,
  'cast-creatures': new URL('./assets/cast-creatures.wav', import.meta.url).href,
  'cast-phoenix': new URL('./assets/cast-phoenix.wav', import.meta.url).href,
  'cast-hippogriff': new URL('./assets/cast-hippogriff.wav', import.meta.url).href,
  'cast-unicorn': new URL('./assets/cast-unicorn.wav', import.meta.url).href,
  'cast-dragon': new URL('./assets/cast-dragon.wav', import.meta.url).href,

  ambient: new URL('./assets/ambient.wav', import.meta.url).href,
  'cast-fire': new URL('./assets/cast-fire.wav', import.meta.url).href,
  'cast-alchemy': new URL('./assets/cast-alchemy.wav', import.meta.url).href,
  'cast-shadows': new URL('./assets/cast-shadows.wav', import.meta.url).href,
  'cast-neutral': new URL('./assets/cast-neutral.wav', import.meta.url).href,
  impact: new URL('./assets/impact.wav', import.meta.url).href,
  miss: new URL('./assets/miss.wav', import.meta.url).href,
  heal: new URL('./assets/heal.wav', import.meta.url).href,
  burn: new URL('./assets/burn.wav', import.meta.url).href,
} as const;
export type SoundAsset = keyof typeof soundAssets;
