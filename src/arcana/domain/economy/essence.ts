import { ArcanaError } from '../errors';

export interface Essence {
  readonly points: number;
  readonly cursor: number;
}

export const ESSENCE_CAPACITY = 50;
export const COMBAT_ESSENCE_COST = 5;
export const ESSENCE_INTERVAL_MS = 12 * 60 * 1_000;

function validateTime(time: number): void {
  if (!Number.isSafeInteger(time) || time < 0) throw new ArcanaError('INVALID_TIME');
}

export function createEssence(points: number, cursor: number): Essence {
  if (!Number.isSafeInteger(points) || points < 0 || points > ESSENCE_CAPACITY)
    throw new ArcanaError('INVALID_ESSENCE');
  validateTime(cursor);
  return Object.freeze({ points, cursor });
}

export function regenerateEssence(essence: Essence, now: number): Essence {
  createEssence(essence.points, essence.cursor);
  validateTime(now);
  if (now < essence.cursor) return createEssence(essence.points, essence.cursor);
  const intervals = Math.floor((now - essence.cursor) / ESSENCE_INTERVAL_MS);
  const points = Math.min(ESSENCE_CAPACITY, essence.points + intervals);
  // Capacity is a cap, not a queue of credits that can be claimed after spending.
  const cursor =
    points === ESSENCE_CAPACITY ? now : essence.cursor + intervals * ESSENCE_INTERVAL_MS;
  return createEssence(points, cursor);
}

export function spendCombatEssence(essence: Essence, now: number): Essence {
  const regenerated = regenerateEssence(essence, now);
  if (regenerated.points < COMBAT_ESSENCE_COST) throw new ArcanaError('INSUFFICIENT_ESSENCE');
  return createEssence(regenerated.points - COMBAT_ESSENCE_COST, regenerated.cursor);
}
