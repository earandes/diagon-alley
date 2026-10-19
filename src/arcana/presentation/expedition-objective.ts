import type { Run } from '../domain/exploration/run';
import { COMBAT_ESSENCE_COST } from '../domain/economy/essence';
import { routeOptions } from '../application/client/read-models';

export type ExpeditionObjectiveKind =
  | 'begin'
  | 'recruit'
  | 'prepare'
  | 'choose'
  | 'energy'
  | 'won'
  | 'lost'
  | 'draw';
export interface ExpeditionObjective {
  readonly kind: ExpeditionObjectiveKind;
  readonly nodeId?: string;
}
/** Consultation only. Formation minimum counts members, as authority does, not bond contributors. */
export function nextExpeditionObjective(
  run?: Run | null,
  effectiveEssence?: number,
): ExpeditionObjective {
  if (!run) return { kind: 'begin' };
  if (run.status !== 'active') return { kind: run.status };
  const reachable = routeOptions(run, run.graph);
  const next = run.graph.nodes.filter((n) => reachable.includes(n.id));
  if (run.members.length < 3) {
    const pact = next.find((n) => n.kind === 'pact');
    return pact ? { kind: 'recruit', nodeId: pact.id } : { kind: 'prepare' };
  }
  const fight = next.find((n) => n.kind === 'duel' || n.kind === 'boss');
  if (fight && effectiveEssence !== undefined && effectiveEssence < COMBAT_ESSENCE_COST)
    return { kind: 'energy' };
  return { kind: 'choose' };
}
