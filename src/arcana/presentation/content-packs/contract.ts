import type { Language } from '../../domain/collection/wizards.ts';

export interface Bilingual {
  readonly es: string;
  readonly en: string;
}
export interface VisualAsset {
  /** Explicit shared artwork, never a source for recorded game identity or rules. */
  readonly sourcePack?: string;
  readonly path: string;
  readonly width: number;
  readonly height: number;
  readonly alpha: boolean;
  readonly pivot: readonly number[];
  readonly alt: Bilingual;
}
export interface ContentPack {
  readonly id: string;
  readonly version: number;
  readonly brand: string;
  readonly direction: string;
  readonly arenaAppearances?: {
    readonly rivals: readonly string[];
    readonly boss: string;
    readonly bossPosition: number;
  };
  readonly regions?: Readonly<
    Record<string, { readonly name: Bilingual; readonly mapAsset: string }>
  >;
  readonly palette: Readonly<Record<string, string>>;
  readonly messages: Readonly<Record<string, Bilingual>>;
  readonly characters: Readonly<
    Record<string, { readonly name: Bilingual; readonly context: Bilingual }>
  >;
  readonly narratives?: readonly {
    readonly id: string;
    readonly sourceVersion: number;
    readonly source: Bilingual;
    readonly text: Bilingual;
  }[];
  readonly assets: Readonly<Record<string, VisualAsset>>;
  readonly animations: {
    readonly opening: {
      readonly sealMs: number;
      readonly lidMs: number;
      readonly subjectMs: number;
      readonly cardMs: number;
      readonly holdMs: number;
    };
    readonly celebration: { readonly durationMs: number; readonly count: number };
    readonly arena: { readonly eventMs: number; readonly entryMs: number };
    readonly feedback: { readonly durationMs: number };
  };
}
const parameters = (value: string) =>
  [...value.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
function bilingual(value: Bilingual, label: string) {
  if (
    !value ||
    typeof value.es !== 'string' ||
    !value.es.trim() ||
    typeof value.en !== 'string' ||
    !value.en.trim()
  )
    throw Error(`Incomplete es/en: ${label}`);
  if (JSON.stringify(parameters(value.es)) !== JSON.stringify(parameters(value.en)))
    throw Error(`Translation parameter mismatch: ${label}`);
}
/** Presentation-only configuration: never a source for economic or combat authority. */
export function validateContentPack(
  pack: ContentPack,
  requiredIds: readonly string[],
  reference: Readonly<Record<string, Bilingual>>,
) {
  if (
    !/^[a-z][a-z0-9-]*$/.test(pack.id) ||
    !Number.isSafeInteger(pack.version) ||
    pack.version < 1 ||
    !pack.brand.trim()
  )
    throw Error('Invalid pack identity');
  const allowed = [
    'id',
    'version',
    'brand',
    'direction',
    'palette',
    'messages',
    'characters',
    'assets',
    'animations',
    'narratives',
    'arenaAppearances',
    'regions',
  ];
  for (const key of Object.keys(pack))
    if (!allowed.includes(key)) throw Error(`Unknown presentation field: ${key}`);
  for (const [key, original] of Object.entries(reference)) {
    const value = pack.messages[key];
    bilingual(value, key);
    if (JSON.stringify(parameters(value.es)) !== JSON.stringify(parameters(original.es)))
      throw Error(`Translation parameter mismatch: ${key}`);
  }
  for (const id of requiredIds) if (!pack.characters[id]) throw Error(`Missing character: ${id}`);
  for (const [id, character] of Object.entries(pack.characters)) {
    if (Object.keys(character).some((key) => key !== 'name' && key !== 'context'))
      throw Error(`Authority field in character: ${id}`);
    bilingual(character.name, `${id}.name`);
    bilingual(character.context, `${id}.context`);
  }
  for (const narrative of pack.narratives ?? []) {
    bilingual(narrative.source, narrative.id + '.source');
    bilingual(narrative.text, narrative.id + '.text');
  }
  for (const [key, asset] of Object.entries(pack.assets)) {
    if (
      Object.keys(asset).some(
        (field) =>
          !['path', 'width', 'height', 'alpha', 'pivot', 'alt', 'sourcePack'].includes(field),
      ) ||
      !/^art\/[a-z0-9/_-]+\.(webp|png|svg)$/.test(asset.path) ||
      (asset.sourcePack !== undefined && !/^[a-z][a-z0-9-]*$/.test(asset.sourcePack)) ||
      !Number.isSafeInteger(asset.width) ||
      asset.width < 1 ||
      !Number.isSafeInteger(asset.height) ||
      asset.height < 1 ||
      typeof asset.alpha !== 'boolean' ||
      asset.pivot.length !== 2 ||
      asset.pivot.some((p) => !Number.isFinite(p) || p < 0 || p > 1)
    )
      throw Error(`Invalid visual asset: ${key}`);
    bilingual(asset.alt, `${key}.alt`);
  }
  for (const [id, region] of Object.entries(pack.regions ?? {})) {
    if (
      !/^[a-z][a-z0-9-]*$/.test(id) ||
      Object.keys(region).some((key) => key !== 'name' && key !== 'mapAsset') ||
      !pack.assets[region.mapAsset]
    )
      throw Error(`Invalid region presentation: ${id}`);
    bilingual(region.name, `${id}.name`);
  }
  for (const [key, value] of Object.entries(pack.palette))
    if (!/^#[a-f0-9]{6}$/i.test(value)) throw Error(`Invalid palette: ${key}`);
  for (const [group, values] of Object.entries(pack.animations))
    for (const [key, value] of Object.entries(values))
      if (!Number.isFinite(value) || value < 0 || value > (key === 'count' ? 64 : 3000))
        throw Error(`Invalid animation: ${group}.${key}`);
}
export function characterLabel(
  pack: ContentPack,
  recorded: { readonly id: string; readonly name: Bilingual },
  language: Language,
) {
  return pack.characters[recorded.id]?.name[language] ?? recorded.name[language];
}
export function packMessage(
  pack: ContentPack,
  language: Language,
  key: string,
  values: Record<string, string | number> = {},
) {
  const message = pack.messages[key];
  if (!message) throw Error(`Unknown translation: ${key}`);
  return message[language].replace(/\{(\w+)\}/g, (_match, parameter: string) => {
    if (values[parameter] === undefined) throw Error('Missing translation parameter: ' + parameter);
    return String(values[parameter]);
  });
}
