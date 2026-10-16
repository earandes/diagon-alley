import { encounterOfferSnapshot, type EncounterOffer } from './encounter-trades';
import { encounterChoiceSnapshot } from './encounters';
import type { Localized } from '../collection/wizards';
import {
  validateCombatInput,
  validateCombatUnit,
  type CombatRules,
  type CombatUnitInput,
} from '../combat/engine';
import type { RandomTickets } from '../combat/random';
import { validateReward, type Reward, type RewardRounding } from '../economy/rewards';
import { ArcanaError } from '../errors';
import { validDomainId } from '../identifiers';
import { validateGraph, type NodeGraph } from './route';
export type EncounterEffect =
  | { readonly kind: 'reward'; readonly reward: Reward }
  | { readonly kind: 'heal' | 'damage'; readonly fraction: number };
export interface EncounterNarrative {
  readonly version: number;
  readonly text: Localized;
}
export interface EncounterChoice {
  readonly weight: number;
  readonly effect: EncounterEffect;
  readonly narrative?: EncounterNarrative;
}
export type NodePlan =
  | {
      readonly nodeId: string;
      readonly kind: 'duel' | 'boss';
      readonly levelId: string;
      readonly opponents: readonly CombatUnitInput[];
      readonly reward: Reward;
      readonly threat?: 'fire' | 'vanguard';
    }
  | { readonly nodeId: string; readonly kind: 'refuge' }
  | { readonly nodeId: string; readonly kind: 'chest'; readonly reward: Reward }
  | {
      readonly nodeId: string;
      readonly kind: 'pact';
      readonly recruit: CombatUnitInput;
      readonly recruits?: readonly CombatUnitInput[];
    }
  | {
      readonly nodeId: string;
      readonly kind: 'encounter';
      readonly choices: readonly EncounterChoice[];
      readonly offer?: EncounterOffer;
    };
export interface Campaign {
  readonly version: number;
  readonly zoneId: string;
  readonly nextZoneId: string;
  readonly graph: NodeGraph;
  readonly combatRules: CombatRules;
  readonly rounding: RewardRounding;
  readonly nodes: readonly NodePlan[];
}
export function validateCampaign(campaign: Campaign): void {
  try {
    if (
      !campaign ||
      !Number.isSafeInteger(campaign.version) ||
      campaign.version < 1 ||
      !validDomainId(campaign.zoneId) ||
      !validDomainId(campaign.nextZoneId) ||
      campaign.zoneId === campaign.nextZoneId ||
      !['floor', 'ceil'].includes(campaign.rounding) ||
      !Array.isArray(campaign.nodes) ||
      campaign.nodes.length !== campaign.graph.nodes.length ||
      new Set(campaign.nodes.map((n) => n.nodeId)).size !== campaign.nodes.length
    )
      throw Error();
    validateGraph(campaign.graph);
    if (campaign.graph.nodes.some((n) => !validDomainId(n.id))) throw Error();
    for (const plan of campaign.nodes as readonly NodePlan[]) {
      if (campaign.graph.nodes.find((n) => n.id === plan.nodeId)?.kind !== plan.kind) throw Error();
      if (plan.kind === 'duel' || plan.kind === 'boss') {
        if (plan.threat !== undefined && !['fire', 'vanguard'].includes(plan.threat)) throw Error();
        if (!validDomainId(plan.levelId) || plan.opponents.some((u) => u.beanUnitId !== undefined))
          throw Error();
        validateReward(plan.reward);
        // Validate rules/formations without creating a PRNG or an invented battle result.
        validateCombatInput({
          id: 'validation',
          seed: 0,
          player: plan.opponents,
          rival: plan.opponents.map((u, index) => ({ ...u, id: `validation:${index}` })),
          rules: campaign.combatRules,
        });
      } else if (plan.kind === 'chest') validateReward(plan.reward);
      else if (plan.kind === 'pact') {
        validateCombatUnit(plan.recruit);
        if (plan.recruit.beanUnitId !== undefined || plan.recruit.hp <= 0) throw Error();
        if (plan.recruits !== undefined) {
          if (
            !Array.isArray(plan.recruits) ||
            plan.recruits.length !== 2 ||
            new Set(plan.recruits.map((u) => u.id)).size !== 2 ||
            plan.recruits[0].id !== plan.recruit.id
          )
            throw Error();
          for (const unit of plan.recruits) {
            validateCombatUnit(unit);
            if (unit.beanUnitId !== undefined || unit.hp <= 0) throw Error();
          }
        }
      } else if (plan.kind === 'encounter') {
        if (plan.offer !== undefined) encounterOfferSnapshot(plan.offer);
        if (!Array.isArray(plan.choices) || !plan.choices.length) throw Error();
        let total = 0;
        for (const choice of plan.choices) {
          const snapshot = encounterChoiceSnapshot(choice);
          total += snapshot.weight;
        }
        if (!Number.isSafeInteger(total) || total > 2 ** 32) throw Error();
      }
    }
  } catch {
    throw new ArcanaError('INVALID_CAMPAIGN');
  }
}
/** Durable public campaign data only. No authority callbacks or live catalog lookups. */
export function campaignSnapshot(campaign: Campaign): Campaign {
  validateCampaign(campaign);
  const copy = structuredClone({
    version: campaign.version,
    zoneId: campaign.zoneId,
    nextZoneId: campaign.nextZoneId,
    graph: campaign.graph,
    combatRules: campaign.combatRules,
    rounding: campaign.rounding,
    nodes: campaign.nodes,
  });
  const freeze = (value: unknown): void => {
    if (value && typeof value === 'object') {
      for (const child of Object.values(value)) freeze(child);
      Object.freeze(value);
    }
  };
  freeze(copy);
  return copy;
}
export function selectEncounter(
  plan: Extract<NodePlan, { kind: 'encounter' }>,
  random: RandomTickets,
): number {
  const total = plan.choices.reduce((n, c) => n + c.weight, 0);
  const ticket = random.ticket(total);
  if (!Number.isSafeInteger(ticket) || ticket < 0 || ticket >= total)
    throw new ArcanaError('INVALID_RANDOM_TICKET');
  let remaining = ticket;
  for (const [index, choice] of plan.choices.entries()) {
    if (remaining < choice.weight) return index;
    remaining -= choice.weight;
  }
  throw new ArcanaError('INVALID_RANDOM_TICKET');
}
