import { ArcanaError } from '../errors';
import { validDomainId } from '../identifiers';
import type { RandomTickets } from '../combat/random';
import { equipmentSnapshot, type Equipment } from './equipment';
import {
  inventorySnapshot,
  validateInventory,
  type Inventory,
  type ProductKind,
} from './inventory';
import { grantReward, validateReward, type Reward } from './rewards';
export type EquipmentBlueprint =
  | Omit<Extract<Equipment, { kind: 'wand' }>, 'id' | 'version'>
  | Omit<Extract<Equipment, { kind: 'broom' }>, 'id' | 'version'>;
export interface WandRecipe {
  readonly id: string;
  readonly crowns: number;
  readonly wood: Extract<Equipment, { kind: 'wand' }>['wood'];
  readonly core: Exclude<Extract<Equipment, { kind: 'wand' }>['core'], null>;
  readonly powerBonus: number;
  readonly multiplier: number;
}
export interface ForgeCatalog {
  readonly version: number;
  readonly recipes: readonly WandRecipe[];
}
export interface VaultCatalog {
  readonly version: number;
  readonly entries: readonly {
    readonly id: string;
    readonly weight: number;
    readonly loot: {
      readonly crowns: number;
      readonly products: readonly ProductKind[];
      readonly equipment: readonly EquipmentBlueprint[];
    };
  }[];
}
export interface CommerceCatalogs {
  readonly forge: ForgeCatalog;
  readonly vault: VaultCatalog;
}
export interface ForgeWandRequest {
  readonly recipeId: string;
  readonly catalogVersion: number;
}
export interface OpenVaultRequest {
  readonly tableVersion: number;
}
const validVersion = (n: number) => Number.isSafeInteger(n) && n > 0;
const validCrowns = (n: number) => Number.isSafeInteger(n) && n >= 0;
export function hasForgeFunds(inventory: Inventory, recipe: WandRecipe): boolean {
  return inventory.crowns >= recipe.crowns;
}
export function hasVaultKey(inventory: Inventory): boolean {
  return (inventory.goldKeys ?? 0) >= 1;
}
function blueprintSnapshot(blueprint: EquipmentBlueprint): EquipmentBlueprint {
  const {
    id: _id,
    version: _version,
    ...value
  } = equipmentSnapshot([{ ...blueprint, id: 'validation', version: 1 }])[0];
  return Object.freeze(value);
}
export function forgeCatalogSnapshot(catalog: ForgeCatalog): ForgeCatalog {
  try {
    if (
      !validVersion(catalog.version) ||
      !Array.isArray(catalog.recipes) ||
      !catalog.recipes.length ||
      catalog.recipes.length > 1000 ||
      new Set(catalog.recipes.map((r) => r.id)).size !== catalog.recipes.length
    )
      throw Error();
    const recipes = catalog.recipes.map((r) => {
      if (
        !validDomainId(r.id) ||
        !validCrowns(r.crowns) ||
        !['dragon', 'phoenix', 'wyvern'].includes(r.core)
      )
        throw Error();
      const gear = equipmentSnapshot([
        {
          id: r.id,
          version: catalog.version,
          kind: 'wand',
          wood: r.wood,
          core: r.core,
          powerBonus: r.powerBonus,
          multiplier: r.multiplier,
        },
      ])[0];
      if (gear.kind !== 'wand') throw Error();
      return Object.freeze({
        id: r.id,
        crowns: r.crowns,
        wood: gear.wood,
        core: r.core,
        powerBonus: gear.powerBonus,
        multiplier: gear.multiplier,
      });
    });
    return Object.freeze({ version: catalog.version, recipes: Object.freeze(recipes) });
  } catch {
    throw new ArcanaError('INVALID_WORKSHOP');
  }
}
export function vaultCatalogSnapshot(catalog: VaultCatalog): VaultCatalog {
  try {
    if (
      !validVersion(catalog.version) ||
      !Array.isArray(catalog.entries) ||
      !catalog.entries.length ||
      catalog.entries.length > 1000 ||
      new Set(catalog.entries.map((e) => e.id)).size !== catalog.entries.length
    )
      throw Error();
    let total = 0;
    const entries = catalog.entries.map((e) => {
      if (
        !validDomainId(e.id) ||
        !Number.isSafeInteger(e.weight) ||
        e.weight < 1 ||
        !validCrowns(e.loot.crowns) ||
        !Array.isArray(e.loot.equipment) ||
        e.loot.equipment.length > 5
      )
        throw Error();
      validateReward({ crowns: e.loot.crowns, goldKeys: 0, products: e.loot.products });
      if (e.loot.crowns === 0 && e.loot.products.length === 0 && e.loot.equipment.length === 0)
        throw Error();
      total += e.weight;
      return Object.freeze({
        id: e.id,
        weight: e.weight,
        loot: Object.freeze({
          crowns: e.loot.crowns,
          products: Object.freeze([...e.loot.products]),
          equipment: Object.freeze(e.loot.equipment.map(blueprintSnapshot)),
        }),
      });
    });
    if (!Number.isSafeInteger(total) || total > 2 ** 32) throw Error();
    return Object.freeze({ version: catalog.version, entries: Object.freeze(entries) });
  } catch {
    throw new ArcanaError('INVALID_WORKSHOP');
  }
}
export function commerceSnapshot(catalogs: CommerceCatalogs): CommerceCatalogs {
  return Object.freeze({
    forge: forgeCatalogSnapshot(catalogs.forge),
    vault: vaultCatalogSnapshot(catalogs.vault),
  });
}
function validateOperation(key: string) {
  if (!validDomainId(key) || key.length > 100) throw new ArcanaError('INVALID_OPERATION');
}
function addEquipment(inventory: Inventory, gear: readonly Equipment[]): Inventory {
  if (gear.some((item) => inventory.equipment?.some((owned) => owned.id === item.id)))
    throw new ArcanaError('DUPLICATE_UNIT');
  return inventorySnapshot({ ...inventory, equipment: [...(inventory.equipment ?? []), ...gear] });
}
export function forgeWand(
  inventory: Inventory,
  catalog: ForgeCatalog,
  request: ForgeWandRequest,
  key: string,
): { readonly inventory: Inventory; readonly equipment: Equipment; readonly spentCrowns: number } {
  validateInventory(inventory);
  validateOperation(key);
  const forge = forgeCatalogSnapshot(catalog);
  if (request.catalogVersion !== forge.version) throw new ArcanaError('STALE_WORKSHOP');
  const recipe = forge.recipes.find((r) => r.id === request.recipeId);
  if (!recipe) throw new ArcanaError('RECIPE_UNAVAILABLE');
  if (!hasForgeFunds(inventory, recipe)) throw new ArcanaError('INSUFFICIENT_CROWNS');
  const equipment = equipmentSnapshot([
    {
      id: `${key}:equipment:0`,
      version: forge.version,
      kind: 'wand',
      wood: recipe.wood,
      core: recipe.core,
      powerBonus: recipe.powerBonus,
      multiplier: recipe.multiplier,
    },
  ])[0];
  return Object.freeze({
    inventory: addEquipment({ ...inventory, crowns: inventory.crowns - recipe.crowns }, [
      equipment,
    ]),
    equipment,
    spentCrowns: recipe.crowns,
  });
}
export function openVault(
  inventory: Inventory,
  catalog: VaultCatalog,
  request: OpenVaultRequest,
  key: string,
  random: RandomTickets,
): {
  readonly inventory: Inventory;
  readonly entryId: string;
  readonly reward: Reward;
  readonly equipment: readonly Equipment[];
  readonly spentKeys: 1;
} {
  validateInventory(inventory);
  validateOperation(key);
  const vault = vaultCatalogSnapshot(catalog);
  if (request.tableVersion !== vault.version) throw new ArcanaError('STALE_WORKSHOP');
  if (!hasVaultKey(inventory)) throw new ArcanaError('INSUFFICIENT_KEYS');
  const total = vault.entries.reduce((n, e) => n + e.weight, 0),
    ticket = random.ticket(total);
  if (!Number.isSafeInteger(ticket) || ticket < 0 || ticket >= total)
    throw new ArcanaError('INVALID_RANDOM_TICKET');
  let remaining = ticket;
  const selected = vault.entries.find((e) => {
    if (remaining < e.weight) return true;
    remaining -= e.weight;
    return false;
  })!;
  const reward = Object.freeze({
    crowns: selected.loot.crowns,
    goldKeys: 0,
    products: Object.freeze([...selected.loot.products]),
  });
  const equipment = equipmentSnapshot(
    selected.loot.equipment.map((blueprint, index) => ({
      ...blueprint,
      id: `${key}:equipment:${index}`,
      version: vault.version,
    })),
  );
  const delivered = grantReward(
    { ...inventory, goldKeys: (inventory.goldKeys ?? 0) - 1 },
    reward,
    key,
  );
  return Object.freeze({
    inventory: addEquipment(delivered, equipment),
    entryId: selected.id,
    reward,
    equipment,
    spentKeys: 1,
  });
}
