import { validDomainId } from '../identifiers';
import { ArcanaError } from '../errors';
import { createEssence, type Essence } from './essence';
import { equipmentSnapshot, validateEquipment, type Equipment } from './equipment';

export type ProductKind = 'cacao-toad' | 'random-beans';
export interface ProductUnit {
  readonly id: string;
  readonly kind: ProductKind;
  readonly status: 'available' | 'consumed';
  readonly operationId?: string;
}
export interface Inventory {
  readonly crowns: number;
  readonly goldKeys?: number;
  readonly essence: Essence;
  readonly products: readonly ProductUnit[];
  readonly equipment?: readonly Equipment[];
}
export interface ShopCatalog {
  readonly version: number;
  readonly products: readonly { readonly kind: ProductKind; readonly crowns: number }[];
}
export interface PurchaseRequest {
  readonly product: ProductKind;
  readonly quantity: number;
  readonly priceVersion: number;
}
const validCrowns = (value: number) => Number.isSafeInteger(value) && value >= 0;
const kinds: readonly ProductKind[] = ['cacao-toad', 'random-beans'];

export function validateInventory(inventory: Inventory): void {
  createEssence(inventory.essence.points, inventory.essence.cursor);
  validateEquipment(inventory.equipment ?? []);
  if (
    !validCrowns(inventory.crowns) ||
    (inventory.goldKeys !== undefined && !validCrowns(inventory.goldKeys)) ||
    !Array.isArray(inventory.products) ||
    new Set(inventory.products.map((unit) => unit.id)).size !== inventory.products.length ||
    inventory.products.some(
      (unit) =>
        !validDomainId(unit.id) ||
        !kinds.includes(unit.kind) ||
        !['available', 'consumed'].includes(unit.status) ||
        (unit.status === 'available'
          ? unit.operationId !== undefined
          : !validDomainId(unit.operationId)),
    )
  )
    throw new ArcanaError('INVALID_INVENTORY');
}

export function validateShop(shop: ShopCatalog): void {
  if (
    !Number.isSafeInteger(shop.version) ||
    shop.version < 1 ||
    !Array.isArray(shop.products) ||
    !shop.products.length ||
    new Set(shop.products.map((product) => product.kind)).size !== shop.products.length ||
    shop.products.some((product) => !kinds.includes(product.kind) || !validCrowns(product.crowns))
  )
    throw new ArcanaError('INVALID_SHOP');
}

export function inventorySnapshot(inventory: Inventory): Inventory {
  return Object.freeze({
    crowns: inventory.crowns,
    goldKeys: inventory.goldKeys ?? 0,
    essence: createEssence(inventory.essence.points, inventory.essence.cursor),
    products: Object.freeze(inventory.products.map((unit) => Object.freeze({ ...unit }))),
    equipment: equipmentSnapshot(inventory.equipment ?? []),
  });
}

export function createInventory(now: number): Inventory {
  return inventorySnapshot({ crowns: 50, essence: createEssence(50, now), products: [] });
}

export function purchaseProduct(
  inventory: Inventory,
  shop: ShopCatalog,
  request: PurchaseRequest,
  operationId: string,
): Inventory {
  validateInventory(inventory);
  validateShop(shop);
  // Bound a single transaction's allocation; production prices remain versioned data.
  if (
    !Number.isSafeInteger(request.quantity) ||
    request.quantity < 1 ||
    request.quantity > 1000 ||
    !validDomainId(operationId)
  )
    throw new ArcanaError('INVALID_PURCHASE');
  if (shop.version !== request.priceVersion) throw new ArcanaError('STALE_PRICE');
  const price = shop.products.find((product) => product.kind === request.product)?.crowns;
  if (price === undefined) throw new ArcanaError('INVALID_PURCHASE');
  const cost = price * request.quantity;
  if (!Number.isSafeInteger(cost)) throw new ArcanaError('INVALID_PURCHASE');
  if (cost > inventory.crowns) throw new ArcanaError('INSUFFICIENT_CROWNS');
  const units = Array.from(
    { length: request.quantity },
    (_, index): ProductUnit => ({
      id: `${operationId}:${index}`,
      kind: request.product,
      status: 'available',
    }),
  );
  if (units.some((unit) => !validDomainId(unit.id))) throw new ArcanaError('INVALID_PURCHASE');
  if (units.some((unit) => inventory.products.some((existing) => existing.id === unit.id)))
    throw new ArcanaError('DUPLICATE_UNIT');
  return inventorySnapshot({
    ...inventory,
    crowns: inventory.crowns - cost,
    products: [...inventory.products, ...units],
  });
}

export function consumeToad(inventory: Inventory, unitId: string, operationId: string): Inventory {
  validateInventory(inventory);
  if (!validDomainId(operationId)) throw new ArcanaError('INVALID_PURCHASE');
  const unit = inventory.products.find((unit) => unit.id === unitId && unit.kind === 'cacao-toad');
  if (!unit || unit.status !== 'available') throw new ArcanaError('UNIT_UNAVAILABLE');
  return inventorySnapshot({
    ...inventory,
    products: inventory.products.map((existing) =>
      existing.id === unit.id ? { ...existing, status: 'consumed', operationId } : existing,
    ),
  });
}
