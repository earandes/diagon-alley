import type { Combat } from '../domain/combat/engine';
import type { BeanFlavour } from '../domain/combat/beans';
import type { Affinity } from '../domain/combat/synergies';

type UnitFact = { readonly sequence: number; readonly actorId: string; readonly wizardId: string };
export type BossBattleFact =
  | (UnitFact & { readonly kind: 'bean'; readonly flavour: BeanFlavour })
  | (UnitFact & {
      readonly kind: 'healing';
      readonly source: 'alchemy' | 'equipment' | 'house' | 'order';
      readonly amount: number;
    })
  | {
      readonly kind: 'synergy';
      readonly sequence: number;
      readonly affinity: Affinity;
      readonly members: number;
    };

/** Read-only recollection, not a score or a counterfactual explanation of the outcome. */
export function bossBattleFacts(combat: Combat | null | undefined): readonly BossBattleFact[] {
  if (!combat) return Object.freeze([]);
  const players = new Map(combat.input.player.map((unit) => [unit.id, unit]));
  let bean: BossBattleFact | undefined;
  let healing: BossBattleFact | undefined;
  let synergy: BossBattleFact | undefined;
  for (const event of combat.events) {
    if (!bean && event.kind === 'bean-activated') {
      const actor = players.get(event.actorId);
      if (actor)
        bean = Object.freeze({
          kind: 'bean',
          sequence: event.sequence,
          actorId: actor.id,
          wizardId: actor.wizardId,
          flavour: event.flavour,
        });
    } else if (!healing && event.kind === 'healed' && event.amount > 0) {
      const actor = players.get(event.actorId);
      if (actor)
        healing = Object.freeze({
          kind: 'healing',
          sequence: event.sequence,
          actorId: actor.id,
          wizardId: actor.wizardId,
          source: event.source,
          amount: event.amount,
        });
    } else if (
      !synergy &&
      event.kind === 'synergy-activated' &&
      event.team === 'player' &&
      event.affinity !== 'neutral'
    ) {
      synergy = Object.freeze({
        kind: 'synergy',
        sequence: event.sequence,
        affinity: event.affinity,
        members: event.members,
      });
    }
  }
  return Object.freeze(
    [bean, healing, synergy]
      .filter((fact): fact is BossBattleFact => fact !== undefined)
      .slice(0, 2),
  );
}
