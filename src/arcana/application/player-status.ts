import { gameSnapshot, type GameState } from './game';
import {
  COMBAT_ESSENCE_COST,
  ESSENCE_CAPACITY,
  ESSENCE_INTERVAL_MS,
  regenerateEssence,
} from '../domain/economy/essence';
import { ArcanaError } from '../domain/errors';
export interface PlayerStatus {
  readonly state: GameState;
  readonly serverTime: number;
  readonly energy: {
    readonly points: number;
    readonly maximum: number;
    readonly combatCost: number;
    readonly nextPointAt: number | null;
  };
}
/** Read-only authority projection. The stored cursor is only changed by transactional commands. */
export function projectPlayerStatus(state: GameState, serverTime: number): PlayerStatus {
  const regenerated = regenerateEssence(state.inventory.essence, serverTime);
  return playerStatusSnapshot({
    state,
    serverTime,
    energy: {
      points: regenerated.points,
      maximum: ESSENCE_CAPACITY,
      combatCost: COMBAT_ESSENCE_COST,
      nextPointAt:
        regenerated.points === ESSENCE_CAPACITY ? null : regenerated.cursor + ESSENCE_INTERVAL_MS,
    },
  });
}
/** Structural transport validation, without trusting the browser to regenerate or spend energy. */
export function playerStatusSnapshot(value: unknown): PlayerStatus {
  const view = value as PlayerStatus;
  const state = gameSnapshot(view?.state),
    energy = view.energy;
  if (
    !Number.isSafeInteger(view.serverTime) ||
    view.serverTime < 0 ||
    !energy ||
    !Number.isSafeInteger(energy.points) ||
    energy.points < state.inventory.essence.points ||
    energy.points > ESSENCE_CAPACITY ||
    energy.maximum !== ESSENCE_CAPACITY ||
    energy.combatCost !== COMBAT_ESSENCE_COST ||
    (energy.points === ESSENCE_CAPACITY
      ? energy.nextPointAt !== null
      : !Number.isSafeInteger(energy.nextPointAt) || energy.nextPointAt! <= view.serverTime)
  )
    throw new ArcanaError('INVALID_GAME');
  return Object.freeze({
    state,
    serverTime: view.serverTime,
    energy: Object.freeze({
      points: energy.points,
      maximum: energy.maximum,
      combatCost: energy.combatCost,
      nextPointAt: energy.nextPointAt,
    }),
  });
}
