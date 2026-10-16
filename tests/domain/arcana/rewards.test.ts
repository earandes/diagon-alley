import { describe, expect, it } from 'vitest';
import { grantReward, victoryReward } from '../../../src/arcana/domain/economy/rewards';
import { createInventory } from '../../../src/arcana/domain/economy/inventory';
describe('ARCANA diminishing victory rewards', () => {
  const base = {
    crowns: 105,
    goldKeys: 1,
    products: ['cacao-toad' as const, 'random-beans' as const],
  };
  it('grants complete first victory and only ten percent crowns on repeat with explicit rounding', () => {
    expect(victoryReward(base, true, 'floor')).toEqual(base);
    expect(victoryReward(base, false, 'floor')).toEqual({ crowns: 10, goldKeys: 0, products: [] });
    expect(victoryReward(base, false, 'ceil')).toEqual({ crowns: 11, goldKeys: 0, products: [] });
    expect(base.products).toHaveLength(2);
  });
  it('grants crowns, keys and uniquely named product units without mutating prior state', () => {
    const before = createInventory(0),
      after = grantReward(before, base, 'victory');
    expect(after).toMatchObject({
      crowns: 155,
      goldKeys: 1,
      products: [
        { id: 'victory:loot:0', kind: 'cacao-toad' },
        { id: 'victory:loot:1', kind: 'random-beans' },
      ],
    });
    expect(before.crowns).toBe(50);
    expect(before.products).toHaveLength(0);
    expect(() => grantReward(after, base, 'victory')).toThrow('DUPLICATE_UNIT');
  });
  it('rejects invalid rewards and safe-integer overflow rather than minting invalid balances', () => {
    const inventory = createInventory(0);
    expect(() => victoryReward({ ...base, crowns: -1 }, true, 'floor')).toThrow('INVALID_CAMPAIGN');
    expect(() =>
      grantReward({ ...inventory, crowns: Number.MAX_SAFE_INTEGER }, base, 'victory'),
    ).toThrow('INVALID_INVENTORY');
    expect(() =>
      grantReward({ ...inventory, goldKeys: Number.MAX_SAFE_INTEGER }, base, 'victory'),
    ).toThrow('INVALID_INVENTORY');
  });
});
