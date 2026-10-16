// All thematic selection is presentation-only. Server IDs, snapshots and rules never change.
import metadata from './arcana/pack.json' with { type: 'json' };
import messages from './arcana/messages.json' with { type: 'json' };
import characters from './arcana/characters.json' with { type: 'json' };
import assets from './arcana/assets.json' with { type: 'json' };
import narratives from './arcana/narratives.json' with { type: 'json' };
import diagonMetadata from './diagon-alley/pack.json' with { type: 'json' };
import diagonMessages from './diagon-alley/messages.json' with { type: 'json' };
import diagonCharacters from './diagon-alley/characters.json' with { type: 'json' };
import diagonAssets from './diagon-alley/assets.json' with { type: 'json' };
import diagonNarratives from './diagon-alley/narratives.json' with { type: 'json' };
import defaults from './default.json' with { type: 'json' };
import { characterLabel, type Bilingual, type ContentPack } from './contract.ts';
import type { Language } from '../../domain/collection/wizards.ts';

export type ContentPackId = 'diagon-alley' | 'arcana';
export const CONTENT_PACK_PREFERENCE_KEY = 'arcana.presentation.content-pack.v1';
export const CONTENT_PACK_CHANGED_EVENT = 'arcana:content-pack-changed';
const arcanaPack = { ...metadata, messages, characters, assets, narratives };
const diagonPack = {
  ...diagonMetadata,
  messages: { ...messages, ...diagonMessages },
  characters: diagonCharacters,
  assets: diagonAssets,
  narratives: diagonNarratives,
};
const packs = { arcana: arcanaPack, 'diagon-alley': diagonPack };
export const DEFAULT_CONTENT_PACK_ID: ContentPackId =
  defaults.id === 'arcana' ? 'arcana' : 'diagon-alley';
export const contentPackOptions = Object.freeze([
  { id: 'diagon-alley' as const, name: { es: 'Callejón Diagón', en: 'Diagon Alley' } },
  { id: 'arcana' as const, name: { es: 'ARCANA', en: 'ARCANA' } },
]);
const isContentPackId = (id: string): id is ContentPackId => Object.hasOwn(packs, id);
function initialPackId(): ContentPackId {
  try {
    const recorded =
      typeof window === 'undefined'
        ? null
        : window.localStorage.getItem(CONTENT_PACK_PREFERENCE_KEY);
    return recorded && isContentPackId(recorded) ? recorded : DEFAULT_CONTENT_PACK_ID;
  } catch {
    return DEFAULT_CONTENT_PACK_ID;
  }
}
let selectedId = initialPackId();
// Live binding: labels, palette and asset lookup resolve the latest selected skin.
export let activePack = packs[selectedId];
const listeners = new Set<() => void>();
export function selectedContentPackId(): ContentPackId {
  return selectedId;
}
export function getContentPack(id: ContentPackId) {
  return packs[id];
}
export function subscribeContentPack(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
/** Never fetches, spends, edits a snapshot, or reloads an in-flight operation. */
export function setContentPack(id: ContentPackId): boolean {
  if (!isContentPackId(id)) return false;
  if (id === selectedId) return true;
  selectedId = id;
  activePack = packs[id];
  try {
    if (typeof window !== 'undefined') window.localStorage.setItem(CONTENT_PACK_PREFERENCE_KEY, id);
  } catch {
    /* Session remains usable when preferences are blocked. */
  }
  for (const listener of listeners) listener();
  if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined')
    window.dispatchEvent(new CustomEvent(CONTENT_PACK_CHANGED_EVENT, { detail: { id } }));
  return true;
}
/** URL metadata does not request artwork bytes until the relevant scene is visible. */
export function packAssetUrls() {
  return import.meta.glob('./{arcana,diagon-alley}/art/**/*.{webp,png,svg}', {
    eager: true,
    query: '?url',
    import: 'default',
  });
}
export function wizardName(
  recorded: { readonly id: string; readonly name: Bilingual },
  language: Language,
) {
  return characterLabel(activePack, recorded, language);
}
export function wizardContext(
  recorded: { readonly id: string; readonly context: Bilingual },
  language: Language,
) {
  return (
    (activePack.characters as ContentPack['characters'])[recorded.id]?.context[language] ??
    recorded.context[language]
  );
}

export function themedName(id: string | undefined, fallback: string, language: Language) {
  return id
    ? ((activePack.characters as ContentPack['characters'])[id]?.name[language] ?? fallback)
    : fallback;
}
export function narrativeText(
  recorded: { readonly version: number; readonly text: Bilingual },
  language: Language,
) {
  return (
    activePack.narratives.find(
      (n) =>
        n.sourceVersion === recorded.version &&
        n.source.es === recorded.text.es &&
        n.source.en === recorded.text.en,
    )?.text[language] ?? recorded.text[language]
  );
}

/** Visual identity by authoritative zone ID; this registry cannot unlock or generate a route. */
export function regionAppearance(zoneId: string, language: Language) {
  const region = (activePack.regions as ContentPack['regions'])?.[zoneId];
  return {
    name: region?.name[language] ?? activePack.messages.unlockedLocation[language],
    mapAsset: region?.mapAsset ?? 'scene.boulevard',
  };
}
