import { describe, expect, it, vi } from 'vitest';
import {
  drawWizard,
  validateToadTable,
  wizardSnapshot,
} from '../../../src/arcana/domain/collection/wizards';
import { catalogFixture, toadFixture } from './support/fixtures';

describe('A85 cosmetic enchanted finish', () => {
  const table = { ...toadFixture, finish: { version: 1 as const, enchanted: 1, total: 100 } };
  it('draws identity first and the independent finish once; preserves stats and rarity', () => {
    const random = { ticket: vi.fn().mockReturnValueOnce(0).mockReturnValueOnce(0) };
    const wizard = drawWizard(catalogFixture, table, random);
    expect(wizard.finish).toEqual({ id: 'enchanted', version: 1 });
    expect(wizard.stats).toEqual(catalogFixture.wizards[0].stats);
    expect(wizard.rarity).toBe(catalogFixture.wizards[0].rarity);
    expect(random.ticket.mock.calls).toEqual([
      [toadFixture.entries.reduce((s, e) => s + e.weight, 0)],
      [100],
    ]);
    expect(wizardSnapshot(wizard)).toEqual(wizard);
  });
  it('has exact one-in-one-hundred finish tickets per eligible identity and no legacy reroll', () => {
    const results = Array.from({ length: 100 }, (_, finish) => {
      let call = 0;
      return drawWizard(catalogFixture, table, { ticket: () => (call++ ? finish : 0) });
    });
    expect(results.filter((w) => w.finish?.id === 'enchanted')).toHaveLength(1);
    const legacy = { ticket: vi.fn(() => 0) };
    expect(drawWizard(catalogFixture, toadFixture, legacy).finish).toBeUndefined();
    expect(legacy.ticket).toHaveBeenCalledTimes(1);
  });
  it('rejects malformed odds before requesting a draw and preserves frozen finish provenance', () => {
    for (const finish of [
      { version: 2, enchanted: 1, total: 100 },
      { version: 1, enchanted: -1, total: 100 },
      { version: 1, enchanted: 101, total: 100 },
      { version: 1, enchanted: 1, total: 0 },
    ])
      expect(() => validateToadTable(catalogFixture, { ...table, finish })).toThrow(
        'INVALID_TOAD_TABLE',
      );
    const wizard = drawWizard(catalogFixture, table, { ticket: () => 0 });
    expect(Object.isFrozen(wizard.finish)).toBe(true);
  });
});
