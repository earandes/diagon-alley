import { afterEach, expect, it, vi } from 'vitest';
import config from '../../../src/arcana/content/trial-v1.json';
import reference from '../../../src/arcana/presentation/content-packs/arcana/messages.json';
import {
  DEFAULT_CONTENT_PACK_ID,
  CONTENT_PACK_PREFERENCE_KEY,
  activePack,
  getContentPack,
  selectedContentPackId,
  setContentPack,
  subscribeContentPack,
  wizardName,
  wizardContext,
  narrativeText,
} from '../../../src/arcana/presentation/content-packs/active';
import {
  characterLabel,
  packMessage,
  validateContentPack,
} from '../../../src/arcana/presentation/content-packs/contract';
import { visualAsset } from '../../../src/arcana/presentation/content-packs/art';

afterEach(() => {
  vi.unstubAllGlobals();
  setContentPack(DEFAULT_CONTENT_PACK_ID);
});
it('defaults to Diagon Alley and validates all thirty IDs, translations and presentation fields', () => {
  expect(DEFAULT_CONTENT_PACK_ID).toBe('diagon-alley');
  for (const id of ['arcana', 'diagon-alley'] as const) {
    const pack = getContentPack(id);
    expect(() =>
      validateContentPack(
        pack,
        config.catalog.wizards.map((w) => w.id),
        reference,
      ),
    ).not.toThrow();
    expect(Object.keys(pack.characters)).toHaveLength(30);
  }
  expect(getContentPack('diagon-alley').characters.apprentice.name.en).toBe('Harry Potter');
});
it('switches language and thematic projection without mutating recorded character, operation or game state', () => {
  const game = structuredClone(config);
  const before = JSON.stringify(game);
  const recorded = Object.freeze({
    id: 'merlin',
    name: Object.freeze({ es: 'Merlín guardado', en: 'Recorded Merlin' }),
    context: Object.freeze({ es: 'Contexto guardado', en: 'Recorded context' }),
    stars: 4,
  });
  setContentPack('diagon-alley');
  expect(wizardName(recorded, 'es')).toBe('Albus Dumbledore');
  expect(wizardContext(recorded, 'en')).toContain('Hogwarts');
  expect(packMessage(activePack, 'en', 'buyCocoaToad', { value: 10 })).toContain('Chocolate Frog');
  expect(visualAsset('character.merlin.portrait')?.url).toBeTruthy();
  setContentPack('arcana');
  expect(wizardName(recorded, 'es')).toBe('Merlín');
  expect(packMessage(activePack, 'en', 'buyCocoaToad', { value: 10 })).toBe(
    'Buy Cocoa Toad · 10 Crowns',
  );
  expect(JSON.stringify(game)).toBe(before);
  expect(recorded.name.en).toBe('Recorded Merlin');
  expect(recorded.stars).toBe(4);
});
it('writes only the presentation preference and notifies subscribers once per change', () => {
  setContentPack('arcana');
  const writes: unknown[] = [];
  const fakeStorage = {
    setItem: (key: string, value: string) => writes.push([key, value]),
    getItem: () => null,
  };
  vi.stubGlobal('window', { localStorage: fakeStorage, dispatchEvent: vi.fn() });
  const listener = vi.fn();
  const unsubscribe = subscribeContentPack(listener);
  setContentPack('diagon-alley');
  expect(selectedContentPackId()).toBe('diagon-alley');
  expect(writes).toEqual([[CONTENT_PACK_PREFERENCE_KEY, 'diagon-alley']]);
  expect(listener).toHaveBeenCalledTimes(1);
  setContentPack('diagon-alley');
  expect(listener).toHaveBeenCalledTimes(1);
  unsubscribe();
  expect(setContentPack('unknown' as 'arcana')).toBe(false);
  expect(selectedContentPackId()).toBe('diagon-alley');
});
it('keeps unknown snapshots readable and translates only recognized narrative source versions', () => {
  setContentPack('diagon-alley');
  expect(
    characterLabel(
      activePack,
      { id: 'old-identity', name: { es: 'Guardado', en: 'Recorded' } },
      'en',
    ),
  ).toBe('Recorded');
  expect(
    narrativeText({ version: 99, text: { es: 'Relato antiguo', en: 'Old story' } }, 'en'),
  ).toBe('Old story');
});
it('keeps the selected presentation usable when local preferences are blocked', () => {
  vi.stubGlobal('window', {
    get localStorage() {
      throw Error('Storage blocked');
    },
    dispatchEvent: vi.fn(),
  });
  expect(() => setContentPack('arcana')).not.toThrow();
  expect(selectedContentPackId()).toBe('arcana');
});

it('restores a valid local preference on a fresh module without consulting authority', async () => {
  vi.stubGlobal('window', {
    localStorage: { getItem: () => 'arcana' },
    dispatchEvent: vi.fn(),
  });
  vi.resetModules();
  const fresh = await import('../../../src/arcana/presentation/content-packs/active');
  expect(fresh.selectedContentPackId()).toBe('arcana');
  expect(fresh.activePack.brand).toBe('ARCANA');
});
it('ignores an unknown persisted theme on reload', async () => {
  vi.stubGlobal('window', {
    localStorage: { getItem: () => 'untrusted-pack' },
    dispatchEvent: vi.fn(),
  });
  vi.resetModules();
  const fresh = await import('../../../src/arcana/presentation/content-packs/active');
  expect(fresh.selectedContentPackId()).toBe(DEFAULT_CONTENT_PACK_ID);
});
