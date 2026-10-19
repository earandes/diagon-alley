import type { Combat } from '../../domain/combat/engine';
import type { BeanFlavour } from '../../domain/combat/beans';
import type { Affinity } from '../../domain/combat/synergies';
import type { House } from '../../domain/collection/traits';
import type { BondGroup } from '../../domain/combat/bonds';
import type { IntentionChoice } from '../../domain/exploration/intentions';

type UnitFact = { readonly sequence: number; readonly actorId: string; readonly wizardId: string };
export type BattleFact =
  | (UnitFact & { readonly kind: 'bean'; readonly flavour: BeanFlavour })
  | (UnitFact & {
      readonly kind: 'healing';
      readonly source: 'alchemy' | 'equipment' | 'house' | 'order';
      readonly amount: number;
    })
  | (UnitFact & { readonly kind: 'guard'; readonly amount: number })
  | {
      readonly kind: 'house';
      readonly sequence: number;
      readonly house: House;
      readonly members: number;
      readonly tier: 1 | 2;
    }
  | {
      readonly kind: 'bond';
      readonly sequence: number;
      readonly group: BondGroup;
      readonly members: number;
      readonly tier: 1 | 2;
    }
  | {
      readonly kind: 'synergy';
      readonly sequence: number;
      readonly affinity: Affinity;
      readonly members: number;
    };

function matchesPlan(fact: BattleFact, plan: IntentionChoice): boolean {
  if (plan.kind === 'company')
    return (
      (plan.focus === 'house' && fact.kind === 'house' && fact.house === plan.house) ||
      (plan.focus === 'bond' && fact.kind === 'bond' && fact.group === plan.group)
    );
  if (plan.kind === 'bean') return fact.kind === 'bean';
  if (plan.kind === 'synergy') return fact.kind === 'synergy' && fact.affinity === plan.affinity;
  return 'wizardId' in fact && fact.wizardId === plan.wizardId;
}

/** Read-only recollection of committed events, never a counterfactual explanation or new calculation. */
export function battleFacts(
  combat: Combat | null | undefined,
  preferred?: IntentionChoice | null,
): readonly BattleFact[] {
  if (!combat) return Object.freeze([]);
  const players = new Map(combat.input.player.map((unit) => [unit.id, unit]));
  const found = new Map<BattleFact['kind'], BattleFact>();
  for (const event of combat.events) {
    let fact: BattleFact | undefined;
    if (event.kind === 'bean-activated') {
      const actor = players.get(event.actorId);
      if (actor)
        fact = {
          kind: 'bean',
          sequence: event.sequence,
          actorId: actor.id,
          wizardId: actor.wizardId,
          flavour: event.flavour,
        };
    } else if (event.kind === 'healed' && event.amount > 0) {
      const actor = players.get(event.actorId);
      if (actor)
        fact = {
          kind: 'healing',
          sequence: event.sequence,
          actorId: actor.id,
          wizardId: actor.wizardId,
          source: event.source,
          amount: event.amount,
        };
    } else if (event.kind === 'spell-cast' && !event.missed && (event.guarded ?? 0) > 0) {
      // Protection belongs to the target, even when the acting spell belongs to the rival.
      const target = players.get(event.targetId);
      if (target)
        fact = {
          kind: 'guard',
          sequence: event.sequence,
          actorId: target.id,
          wizardId: target.wizardId,
          amount: event.guarded!,
        };
    } else if (event.kind === 'house-activated' && event.team === 'player') {
      fact = {
        kind: 'house',
        sequence: event.sequence,
        house: event.house,
        members: event.members,
        tier: event.tier,
      };
    } else if (event.kind === 'bond-activated' && event.team === 'player') {
      fact = {
        kind: 'bond',
        sequence: event.sequence,
        group: event.group,
        members: event.members,
        tier: event.tier,
      };
    } else if (
      event.kind === 'synergy-activated' &&
      event.team === 'player' &&
      event.affinity !== 'neutral'
    ) {
      fact = {
        kind: 'synergy',
        sequence: event.sequence,
        affinity: event.affinity,
        members: event.members,
      };
    }
    if (
      fact &&
      (!found.has(fact.kind) ||
        (preferred &&
          matchesPlan(fact, preferred) &&
          !matchesPlan(found.get(fact.kind)!, preferred)))
    )
      found.set(fact.kind, Object.freeze(fact));
  }
  const order: readonly BattleFact['kind'][] = [
    'bean',
    'healing',
    'guard',
    'house',
    'bond',
    'synergy',
  ];
  const facts = order.flatMap((kind) => (found.has(kind) ? [found.get(kind)!] : []));
  const planned = preferred ? facts.find((fact) => matchesPlan(fact, preferred)) : undefined;
  return Object.freeze(
    (planned ? [planned, ...facts.filter((fact) => fact !== planned)] : facts).slice(0, 2),
  );
}
