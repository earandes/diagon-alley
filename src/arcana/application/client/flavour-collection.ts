import { BEAN_FLAVOURS, type BeanFlavour } from '../../domain/combat/beans';
import type { GameState } from '../game';

export interface FlavourDiscovery {
  readonly operationId: string;
  readonly beanUnitId: string;
  readonly battleId: string;
  readonly rulesVersion: number;
}
export interface FlavourCollectionEntry {
  readonly flavour: BeanFlavour;
  readonly discovered: boolean;
  readonly activations: number;
  readonly firstDiscovery: FlavourDiscovery | null;
}

/**
 * An album of actual tastes, derived from durable receipts rather than a second inventory.
 * No configuration, theme or random source participates in recovering a discovery.
 */
export function flavourCollection(state: GameState): readonly FlavourCollectionEntry[] {
  const entries = new Map<
    BeanFlavour,
    { activations: number; firstDiscovery: FlavourDiscovery | null }
  >(BEAN_FLAVOURS.map((flavour) => [flavour, { activations: 0, firstDiscovery: null }]));
  const countedUnits = new Set<string>();
  const products = new Map((state.inventory?.products ?? []).map((unit) => [unit.id, unit]));
  for (const receipt of state.receipts ?? []) {
    if (
      receipt?.kind !== 'advance-node' ||
      !receipt.battle ||
      !Array.isArray(receipt.request?.assignments) ||
      !Array.isArray(receipt.battle.events) ||
      !Array.isArray(receipt.battle.input?.player) ||
      !Array.isArray(receipt.battle.input.rules?.beans?.entries) ||
      !Number.isSafeInteger(receipt.battle.input.rules?.beans?.version) ||
      receipt.battle.input.rules.beans.version < 1 ||
      receipt.battle.id !== `${receipt.id}:battle`
    )
      continue;
    const { battle } = receipt;
    for (const event of battle.events) {
      if (event?.kind !== 'bean-activated') continue;
      const entry = entries.get(event.flavour),
        product = products.get(event.unitId);
      if (
        !entry ||
        countedUnits.has(event.unitId) ||
        !battle.input.rules.beans.entries.some(
          (candidate) => candidate?.flavour === event.flavour && candidate.weight > 0,
        ) ||
        product?.kind !== 'random-beans' ||
        product.status !== 'consumed' ||
        product.operationId !== receipt.id ||
        !receipt.request.assignments.some(
          (assignment) =>
            assignment?.beanId === event.unitId && assignment.unitId === event.actorId,
        ) ||
        !battle.input.player.some(
          (unit) => unit?.id === event.actorId && unit.hp > 0 && unit.beanUnitId === event.unitId,
        )
      )
        continue;
      countedUnits.add(event.unitId);
      entry.activations += 1;
      entry.firstDiscovery ??= Object.freeze({
        operationId: receipt.id,
        beanUnitId: event.unitId,
        battleId: battle.id,
        rulesVersion: battle.input.rules.beans.version,
      });
    }
  }
  return Object.freeze(
    BEAN_FLAVOURS.map((flavour) => {
      const entry = entries.get(flavour)!;
      return Object.freeze({ flavour, discovered: entry.activations > 0, ...entry });
    }),
  );
}
