import { activePack, packAssetUrls } from './active';
import type { ContentPack } from './contract';
const urls = packAssetUrls();
/** Eager URL metadata does not fetch image bytes; components request only visible artwork. */
export function visualAsset(key: string) {
  const record = (activePack.assets as ContentPack['assets'])[key];
  if (!record) return null;
  const url = urls[`./${record.sourcePack ?? activePack.id}/${record.path}`];
  return typeof url === 'string' ? { ...record, url } : null;
}
