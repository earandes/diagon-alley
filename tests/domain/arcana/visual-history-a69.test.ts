import { describe, expect, it } from 'vitest';
import { createVisualHistory } from '../../../src/arcana/presentation/visual-history';

function storage() {
  let value: string | null = null;
  return {
    getItem: () => value,
    setItem: (_key: string, next: string) => {
      value = next;
    },
  };
}
describe('A69 bounded presentation history, never game authority', () => {
  it('claims once across remounts and page reload storage without conflating presentations', () => {
    const saved = storage(),
      first = createVisualHistory(saved);
    expect(first.claim('opening', 'receipt-1')).toBe(true);
    expect(first.claim('opening', 'receipt-1')).toBe(false);
    expect(createVisualHistory(saved).claim('opening', 'receipt-1')).toBe(false);
    expect(first.claim('closure', 'receipt-1')).toBe(true);
    expect(first.has('closure', 'receipt-1')).toBe(true);
  });
  it('fails safely without storage and never writes results, inventory or random state', () => {
    const history = createVisualHistory({
      getItem() {
        throw Error('blocked');
      },
      setItem() {
        throw Error('blocked');
      },
    });
    expect(history.claim('node', 'r1')).toBe(true);
    expect(history.claim('node', 'r1')).toBe(false);
    expect(history.claim('', 'r1')).toBe(false);
    expect(history.claim('node', '')).toBe(false);
  });
  it('bounds visual metadata and rejects malformed records', () => {
    const saved = storage(),
      history = createVisualHistory(saved);
    for (let i = 0; i < 300; i++) history.claim('node', `r${i}`);
    expect(JSON.parse(saved.getItem()!)).toHaveLength(256);
    expect(history.has('node', 'r299')).toBe(true);
    const invalid = createVisualHistory({ getItem: () => '{"crowns":999999}', setItem: () => {} });
    expect(invalid.claim('node', 'r1')).toBe(true);
  });
  it('reads later claims written by another mounted visual history', () => {
    const saved = storage(),
      a = createVisualHistory(saved),
      b = createVisualHistory(saved);
    a.claim('node', 'r1');
    expect(b.claim('node', 'r1')).toBe(false);
  });
});
