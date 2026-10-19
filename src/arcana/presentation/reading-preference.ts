export interface ReadingPreference {
  readonly version: 1;
  readonly size: 'normal' | 'large';
  readonly contrast: boolean;
}
const defaults: ReadingPreference = Object.freeze({ version: 1, size: 'normal', contrast: false });
export const readingPreferenceKey = (owner: string | null) =>
  `arcana:reading:v1:${owner ?? 'welcome'}`;
/** Optional per-owner device preference, not a credential or an economic state. */
export function readReadingPreference(
  owner: string | null,
  storage?: Pick<Storage, 'getItem'>,
): ReadingPreference {
  try {
    const raw = storage?.getItem(readingPreferenceKey(owner));
    if (!raw) return defaults;
    const value = JSON.parse(raw);
    return value?.version === 1 &&
      ['normal', 'large'].includes(value.size) &&
      typeof value.contrast === 'boolean'
      ? { version: 1, size: value.size, contrast: value.contrast }
      : defaults;
  } catch {
    return defaults;
  }
}
export function saveReadingPreference(
  owner: string | null,
  value: ReadingPreference,
  storage?: Pick<Storage, 'setItem'>,
): void {
  try {
    storage?.setItem(readingPreferenceKey(owner), JSON.stringify(value));
  } catch {
    /* Optional preference. */
  }
}
