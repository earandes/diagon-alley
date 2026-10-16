import { ArcanaError } from '../errors';
import { validDomainId } from '../identifiers';
export type EquipmentSlot = 'wand' | 'broom';
export type Equipment =
  | {
      readonly id: string;
      readonly version: number;
      readonly kind: 'wand';
      readonly wood: 'birch' | 'willow' | 'elder';
      readonly core: 'dragon' | 'phoenix' | 'wyvern' | null;
      readonly powerBonus: number;
      readonly multiplier: number;
      readonly initiativeBonus?: number;
      readonly healing?: number;
    }
  | {
      readonly id: string;
      readonly version: number;
      readonly kind: 'broom';
      readonly model: 'cadet-zephyr' | 'zephyr-2000' | 'wind-arrow';
      readonly initiative: number;
    };
export function validateEquipment(items: readonly Equipment[]): void {
  if (!Array.isArray(items) || new Set(items.map((item) => item.id)).size !== items.length)
    throw new ArcanaError('INVALID_EQUIPMENT');
  for (const item of items) {
    if (!validDomainId(item.id) || !Number.isSafeInteger(item.version) || item.version < 1)
      throw new ArcanaError('INVALID_EQUIPMENT');
    if (item.kind === 'wand') {
      if (
        !['birch', 'willow', 'elder'].includes(item.wood) ||
        ![null, 'dragon', 'phoenix', 'wyvern'].includes(item.core) ||
        !Number.isFinite(item.powerBonus) ||
        item.powerBonus < 0 ||
        !Number.isFinite(item.multiplier) ||
        item.multiplier <= 0 ||
        [item.initiativeBonus, item.healing].some(
          (value) => value !== undefined && (!Number.isFinite(value) || value < 0 || value > 10),
        )
      )
        throw new ArcanaError('INVALID_EQUIPMENT');
    } else if (item.kind === 'broom') {
      if (
        !['cadet-zephyr', 'zephyr-2000', 'wind-arrow'].includes(item.model) ||
        !Number.isFinite(item.initiative) ||
        item.initiative < 0
      )
        throw new ArcanaError('INVALID_EQUIPMENT');
    } else throw new ArcanaError('INVALID_EQUIPMENT');
  }
}
export function equipmentSnapshot(items: readonly Equipment[]): readonly Equipment[] {
  validateEquipment(items);
  return Object.freeze(
    items.map((item) =>
      item.kind === 'wand'
        ? Object.freeze({
            id: item.id,
            version: item.version,
            kind: item.kind,
            wood: item.wood,
            core: item.core,
            powerBonus: item.powerBonus,
            multiplier: item.multiplier,
            ...(item.initiativeBonus === undefined
              ? {}
              : { initiativeBonus: item.initiativeBonus }),
            ...(item.healing === undefined ? {} : { healing: item.healing }),
          })
        : Object.freeze({
            id: item.id,
            version: item.version,
            kind: item.kind,
            model: item.model,
            initiative: item.initiative,
          }),
    ),
  );
}
export function starterEquipment(): readonly Equipment[] {
  return equipmentSnapshot([
    {
      id: 'starter:wand',
      version: 1,
      kind: 'wand',
      wood: 'birch',
      core: null,
      powerBonus: 2,
      multiplier: 1,
    },
    { id: 'starter:broom', version: 1, kind: 'broom', model: 'cadet-zephyr', initiative: 3 },
  ]);
}
