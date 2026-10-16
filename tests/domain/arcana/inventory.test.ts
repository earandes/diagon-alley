import { describe, expect, it } from 'vitest';
import {
  createInventory,
  purchaseProduct,
  consumeToad,
  type ShopCatalog,
} from '../../../src/arcana/domain/economy/inventory';
// Prices here are controlled test data, not ARCANA production prices.
export const shopFixture: ShopCatalog = {
  version: 1,
  products: [
    { kind: 'cacao-toad', crowns: 10 },
    { kind: 'random-beans', crowns: 5 },
  ],
};
describe('ARCANA InventoryEconomy atomic transitions', () => {
  it('starts with the specified 50 Crowns and full Essence', () => {
    expect(createInventory(0)).toMatchObject({
      crowns: 50,
      essence: { points: 50, cursor: 0 },
      products: [],
    });
  });
  it('buys units and deducts the displayed price without mutating source', () => {
    const before = createInventory(0);
    const after = purchaseProduct(
      before,
      shopFixture,
      { product: 'cacao-toad', quantity: 2, priceVersion: 1 },
      'op',
    );
    expect(after.crowns).toBe(30);
    expect(after.products).toEqual([
      { id: 'op:0', kind: 'cacao-toad', status: 'available' },
      { id: 'op:1', kind: 'cacao-toad', status: 'available' },
    ]);
    expect(before.products).toEqual([]);
    expect(before.crowns).toBe(50);
  });
  it('rejects an insufficient balance and stale inspected prices', () => {
    expect(() =>
      purchaseProduct(
        createInventory(0),
        shopFixture,
        { product: 'cacao-toad', quantity: 6, priceVersion: 1 },
        'op',
      ),
    ).toThrow('INSUFFICIENT_CROWNS');
    expect(() =>
      purchaseProduct(
        createInventory(0),
        shopFixture,
        { product: 'cacao-toad', quantity: 1, priceVersion: 2 },
        'op',
      ),
    ).toThrow('STALE_PRICE');
  });
  it.each([0, -1, 0.5, NaN, Infinity, 1001])('rejects invalid batch quantity %s', (quantity) => {
    expect(() =>
      purchaseProduct(
        createInventory(0),
        shopFixture,
        { product: 'cacao-toad', quantity, priceVersion: 1 },
        'op',
      ),
    ).toThrow('INVALID_PURCHASE');
  });
  it('does not reinterpret a beans unit as a toad or consume a used unit twice', () => {
    const bought = purchaseProduct(
      createInventory(0),
      shopFixture,
      { product: 'cacao-toad', quantity: 1, priceVersion: 1 },
      'op',
    );
    const opened = consumeToad(bought, 'op:0', 'opening');
    expect(opened.products[0]).toMatchObject({ status: 'consumed', operationId: 'opening' });
    expect(() => consumeToad(opened, 'op:0', 'other')).toThrow('UNIT_UNAVAILABLE');
    const beans = purchaseProduct(
      createInventory(0),
      shopFixture,
      { product: 'random-beans', quantity: 1, priceVersion: 1 },
      'beans',
    );
    expect(() => consumeToad(beans, 'beans:0', 'opening')).toThrow('UNIT_UNAVAILABLE');
    expect(bought.products[0].status).toBe('available');
  });
  it('rejects duplicate generated units rather than accidentally granting twice', () => {
    const request = { product: 'cacao-toad' as const, quantity: 1, priceVersion: 1 };
    const bought = purchaseProduct(createInventory(0), shopFixture, request, 'op');
    expect(() => purchaseProduct(bought, shopFixture, request, 'op')).toThrow('DUPLICATE_UNIT');
  });
  it('validates price data and safe costs', () => {
    for (const shop of [
      { ...shopFixture, version: 0 },
      { ...shopFixture, products: [shopFixture.products[0], shopFixture.products[0]] },
      { ...shopFixture, products: [{ kind: 'cacao-toad' as const, crowns: -1 }] },
      {
        ...shopFixture,
        products: [{ kind: 'cacao-toad' as const, crowns: Number.MAX_SAFE_INTEGER }],
      },
    ])
      expect(() =>
        purchaseProduct(
          createInventory(0),
          shop,
          { product: 'cacao-toad', quantity: 2, priceVersion: 1 },
          'op',
        ),
      ).toThrow(/INVALID_/);
  });
});
