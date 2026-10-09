import { describe, it, expect } from 'vitest';
import { configuration } from '../../src/content/configuration';
import { validateConfiguration, parseExport } from '../../src/domain/validation';
import { initialize, selectIdentity } from '../../src/domain/opening';
describe('versioned content and import boundaries', () => {
  it('covers exactly the 40 controlled tickets of A18', () => {
    const counts: Record<string, number> = {};
    for (let t = 0; t < 40; t++) {
      const id = selectIdentity(configuration, t).id;
      counts[id] = (counts[id] ?? 0) + 1;
    }
    expect(counts).toEqual({ C01: 14, C02: 14, C03: 5, O03: 5, C04: 1, O04: 1 });
  });
  it.each([0, -1, 0.5, NaN, Infinity, 1000001])('rejects weight %s', (weight) => {
    const c = structuredClone(configuration);
    c.table.entries[0].weight = weight;
    expect(() => validateConfiguration(c)).toThrow('INVALID_CONFIG');
  });
  it('rejects duplicate IDs, unknown references, flavours, gifts and absent language', () => {
    for (const edit of [
      (c: typeof configuration) => {
        c.catalog.identities[0].id = 'C02';
      },
      (c: typeof configuration) => {
        c.table.entries[0].identityId = 'C99';
      },
      (c: typeof configuration) => {
        c.table.entries[0].identityId = 'S01';
      },
      (c: typeof configuration) => {
        c.table.entries[0].identityId = 'O01';
      },
      (c: typeof configuration) => {
        c.catalog.identities[0].name.en = '';
      },
    ]) {
      const c = structuredClone(configuration);
      edit(c);
      expect(() => validateConfiguration(c)).toThrow('INVALID_CONFIG');
    }
  });
  it('changed weights derive different odds, not duplicated percentages', () => {
    const c = structuredClone(configuration);
    c.table.version++;
    c.table.entries[0].weight = 4;
    const valid = validateConfiguration(c);
    expect(
      valid.table.entries[0].weight / valid.table.entries.reduce((n, e) => n + e.weight, 0),
    ).toBeCloseTo(4 / 30);
  });
  it('validates schema and cross-references before restoring', () => {
    const valid = {
      format: 'magic-i1',
      schemaVersion: 1,
      state: initialize('run', 'en', configuration),
      configurations: [configuration],
    };
    expect(parseExport(JSON.stringify(valid)).state.language).toBe('en');
    for (const edit of [
      (v: typeof valid) => {
        v.state.copies.push(v.state.copies[0]);
      },
      (v: typeof valid) => {
        v.state.units[0].status = 'consumed';
      },
      (v: typeof valid) => {
        v.state.copies[0].identity.rarityId = 'R03';
      },
      (v: typeof valid) => {
        v.state.copies[0].sourceId = 'unknown';
      },
      (v: typeof valid) => {
        v.schemaVersion = 2;
      },
    ]) {
      const v = structuredClone(valid);
      edit(v);
      expect(() => parseExport(JSON.stringify(v))).toThrow('INVALID_IMPORT');
    }
    expect(() => parseExport('{')).toThrow('INVALID_IMPORT');
    expect(() => parseExport('x'.repeat(262145))).toThrow('INVALID_IMPORT');
  });
});
