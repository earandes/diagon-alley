import { ArcanaError } from '../errors';
import { inventorySnapshot, type Inventory, type ProductKind } from './inventory';
import { validDomainId } from '../identifiers';

export interface Reward {
  readonly crowns: number;
  readonly goldKeys: number;
  readonly products: readonly ProductKind[];
}
export type RewardRounding = 'floor' | 'ceil';
export const NO_REWARD: Reward = Object.freeze({
  crowns: 0,
  goldKeys: 0,
  products: Object.freeze([]),
});
export function validateReward(reward: Reward): void {
  if (
    !reward ||
    ![reward.crowns, reward.goldKeys].every((n) => Number.isSafeInteger(n) && n >= 0) ||
    !Array.isArray(reward.products) ||
    reward.products.length > 1000 ||
    reward.products.some((kind) => !['cacao-toad', 'random-beans'].includes(kind))
  )
    throw new ArcanaError('INVALID_CAMPAIGN');
}
export function victoryReward(
  base: Reward,
  firstVictory: boolean,
  rounding: RewardRounding,
): Reward {
  validateReward(base);
  if (!['floor', 'ceil'].includes(rounding)) throw new ArcanaError('INVALID_CAMPAIGN');
  return firstVictory
    ? { ...base, products: [...base.products] }
    : { crowns: Math[rounding](base.crowns / 10), goldKeys: 0, products: [] };
}
export function grantReward(inventory: Inventory, reward: Reward, key: string): Inventory {
  validateReward(reward);
  const crowns = inventory.crowns + reward.crowns,
    goldKeys = (inventory.goldKeys ?? 0) + reward.goldKeys;
  if (!Number.isSafeInteger(crowns) || !Number.isSafeInteger(goldKeys))
    throw new ArcanaError('INVALID_INVENTORY');
  const products = reward.products.map((kind, index) => ({
    id: `${key}:loot:${index}`,
    kind,
    status: 'available' as const,
  }));
  if (products.some((u) => !validDomainId(u.id) || inventory.products.some((p) => p.id === u.id)))
    throw new ArcanaError('DUPLICATE_UNIT');
  return inventorySnapshot({
    ...inventory,
    crowns,
    goldKeys,
    products: [...inventory.products, ...products],
  });
}
