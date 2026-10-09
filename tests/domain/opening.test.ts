import { describe, it, expect, vi } from 'vitest';
import { initialize, openFrog, addCopy } from '../../src/domain/opening';
import { configuration } from '../../src/content/configuration';
import { parseExport } from '../../src/domain/validation';
const request = (runId = 'run') => ({
  runId,
  unitId: `${runId}:frog`,
  kind: 'welcome-frog' as const,
  catalogVersion: 1,
  tableVersion: 1,
});
describe('I1 atomic transition', () => {
  it('initializes four known gifts, a frog and reserved beans', () => {
    const s = initialize('run', 'es', configuration);
    expect(s.copies.map((c) => c.identity.id)).toEqual(['O01', 'O02', 'S01', 'S02']);
    expect(s.units.map((u) => u.status)).toEqual(['available', 'available']);
    expect(s.operations).toEqual([]);
  });
  it('delivers one new identity and replays without drawing again', () => {
    const random = vi.fn(() => 0);
    const s = initialize('run', 'es', configuration);
    const next = openFrog(s, 'op', request(), configuration, random);
    expect(next.copies).toHaveLength(5);
    expect(next.operations[0].identity.id).toBe('C01');
    expect(next.units[0].status).toBe('consumed');
    expect(openFrog(next, 'op', request(), configuration, random)).toEqual(next);
    expect(random).toHaveBeenCalledTimes(1);
    const invalid = structuredClone(configuration);
    invalid.table.entries[0].weight = 0;
    expect(openFrog(next, 'op', request(), invalid, random)).toEqual(next);
    expect(() =>
      openFrog(next, 'op', { ...request(), tableVersion: 2 }, configuration, random),
    ).toThrow('CONFLICT');
    expect(() => openFrog(next, 'other', request(), configuration, random)).toThrow('EXHAUSTED');
    expect(random).toHaveBeenCalledTimes(1);
  });
  it('rejects stale versions, incompatible welcome and invalid tickets without changes', () => {
    const s = initialize('run', 'es', configuration),
      random = vi.fn(() => 0);
    expect(() =>
      openFrog(s, 'op', { ...request(), tableVersion: 2 }, configuration, random),
    ).toThrow('STALE_CONFIG');
    expect(random).not.toHaveBeenCalled();
    expect(() => openFrog(s, 'op', request(), configuration, () => 40)).toThrow('INVALID_RANDOM');
    expect(s.copies).toHaveLength(4);
    const incompatible = addCopy(s, configuration.catalog.identities[0], 'fixture', 'test');
    expect(() => openFrog(incompatible, 'op', request(), configuration, random)).toThrow(
      'NO_NEW_CANDIDATES',
    );
  });
  it.each([0, 14, 28, 33, 38, 39])(
    'controlled ticket %i covers every result/range, not real statistics',
    (ticket) => {
      const s = openFrog(
        initialize('run', 'en', configuration),
        'op',
        request(),
        configuration,
        () => ticket,
      );
      expect(s.operations[0].isNew).toBe(true);
      expect(
        parseExport(
          JSON.stringify({
            format: 'magic-i1',
            schemaVersion: 1,
            state: s,
            configurations: [configuration],
          }),
        ).state,
      ).toEqual(s);
    },
  );
  it('controlled normal fixture counts a duplicate as duplicate', () => {
    const s = initialize('run', 'es', configuration);
    const repeated = addCopy(s, s.copies[0].identity, 'fixture-normal', 'test');
    expect(repeated.copies.filter((c) => c.identity.id === 'O01')).toHaveLength(2);
    expect(new Set(repeated.copies.map((c) => c.identity.id)).size).toBe(4);
  });
});
