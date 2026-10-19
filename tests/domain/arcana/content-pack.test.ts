import assets from '../../../src/arcana/presentation/content-packs/arcana/assets.json';
import { expect, it } from 'vitest';
import rawPack from '../../../src/arcana/presentation/content-packs/arcana/pack.json';
import messages from '../../../src/arcana/presentation/content-packs/arcana/messages.json';
import characters from '../../../src/arcana/presentation/content-packs/arcana/characters.json';
import config from '../../../src/arcana/content/trial-v1.json';
import {
  validateContentPack,
  characterLabel,
  packMessage,
} from '../../../src/arcana/presentation/content-packs/contract';

const pack = { ...rawPack, messages, characters, assets };
it('covers current IDs and bilingual UI without containing any authority fields', () => {
  expect(() =>
    validateContentPack(
      pack,
      config.catalog.wizards.map((w) => w.id),
      messages,
    ),
  ).not.toThrow();
  expect(Object.keys(characters)).toHaveLength(34);
  expect(Object.values(characters).every((c) => !('stats' in c))).toBe(true);
});
it('rejects missing IDs, translation parameters and unbounded choreography', () => {
  const broken = structuredClone(pack);
  delete (broken.characters as Record<string, unknown>).merlin;
  expect(() => validateContentPack(broken, ['merlin'], messages)).toThrow(/merlin/);
  expect(() =>
    validateContentPack(
      { ...pack, messages: { ...messages, buyCocoaToad: { es: 'Comprar {value}', en: 'Buy' } } },
      [],
      messages,
    ),
  ).toThrow(/buyCocoaToad/);
  expect(() =>
    validateContentPack(
      {
        ...pack,
        animations: { ...pack.animations, celebration: { durationMs: Infinity, count: 28 } },
      },
      [],
      messages,
    ),
  ).toThrow(/celebration/);
});
it('changes labels while leaving the frozen awarded snapshot intact', () => {
  const snapshot = Object.freeze({
    id: 'merlin',
    name: Object.freeze({ es: 'Nombre guardado', en: 'Recorded name' }),
    stars: 1,
  });
  const alternate = {
    ...pack,
    characters: {
      ...characters,
      merlin: { ...characters.merlin, name: { es: 'Otro mago', en: 'Another wizard' } },
    },
  };
  expect(characterLabel(alternate, snapshot, 'es')).toBe('Otro mago');
  expect(snapshot.name.es).toBe('Nombre guardado');
  expect(snapshot.stars).toBe(1);
  expect(packMessage(alternate, 'en', 'buyCocoaToad', { value: 10 })).toBe(
    'Buy Cocoa Toad · 10 Crowns',
  );
});
it('keeps recorded identities unavailable in the active pack readable', () => {
  expect(
    characterLabel(pack, { id: 'legacy-id', name: { es: 'Guardado', en: 'Recorded' } }, 'en'),
  ).toBe('Recorded');
});

it('region artwork is presentation only and requires an existing asset', () => {
  expect(() =>
    validateContentPack(
      {
        ...pack,
        regions: { pasaje: { name: { es: 'Pasaje', en: 'Passage' }, mapAsset: 'absent' } },
      },
      [],
      messages,
    ),
  ).toThrow(/region/);
  const invalid = { ...pack, regions: { pasaje: { ...pack.regions.pasaje, difficulty: 2 } } };
  expect(() => validateContentPack(invalid, [], messages)).toThrow(/region/);
});

it('rejects authority fields and path escapes in shared artwork metadata', () => {
  const original = Object.entries(pack.assets)[0];
  const key = original[0],
    asset = original[1];
  expect(() =>
    validateContentPack(
      { ...pack, assets: { ...pack.assets, [key]: { ...asset, cost: 99 } } },
      [],
      messages,
    ),
  ).toThrow(/visual asset/);
  expect(() =>
    validateContentPack(
      { ...pack, assets: { ...pack.assets, [key]: { ...asset, sourcePack: '../other' } } },
      [],
      messages,
    ),
  ).toThrow(/visual asset/);
});
