import data from '../../content/progression-v2.json';
import { encounterOfferSnapshot } from '../../domain/exploration/encounter-trades';
import type { Campaign, NodePlan } from '../../domain/exploration/nodes';
import type { WizardCatalog } from '../../domain/collection/wizards';
import type { Affinity, CombatUnitInput } from '../../domain/combat/engine';
import { ArcanaError } from '../../domain/errors';
import { tacticalContent } from './tactical-content';
export type ExpeditionChallenge = 'discovery' | 'tactical' | 'mastery';
/** Profile version is independent of economic campaign rights; rows come from the fixed generated route. */
export function progressionContent(
  nodes: readonly NodePlan[],
  catalog: WizardCatalog,
  affinities: Readonly<Record<string, Affinity>>,
  graph: Campaign['graph'],
  challenge: ExpeditionChallenge,
): readonly NodePlan[] {
  if (data.version !== 2) throw new ArcanaError('INVALID_CAMPAIGN');
  const tactical = tacticalContent(nodes, catalog, affinities).nodes;
  const unit = (plan: NodePlan, id: string, index: number): CombatUnitInput => {
    const wizard = catalog.wizards.find((w) => w.id === id);
    if (!wizard || !affinities[id]) throw new ArcanaError('INVALID_CAMPAIGN');
    const s = wizard.stats;
    return {
      id: `${plan.nodeId}:rival:${index}`,
      wizardId: id,
      level: 1,
      affinity: affinities[id],
      hp: s.maxHp,
      maxHp: s.maxHp,
      mana: s.maxMana,
      maxMana: s.maxMana,
      power: s.power,
      speed: s.speed,
      wandPowerBonus: 0,
      wandMultiplier: 1,
      broomInitiative: 0,
    };
  };
  return tactical.map((plan) => {
    const row = graph.nodes.find((n) => n.id === plan.nodeId)?.row;
    if (row === undefined) throw new ArcanaError('INVALID_CAMPAIGN');
    if (plan.kind === 'encounter') {
      const kind = row % 2 === 0 ? 'scholar' : 'healer';
      const offer = encounterOfferSnapshot({
        id: `${plan.nodeId}:${kind}:1`,
        kind,
        ...data.encounters[kind],
      });
      return { ...plan, offer };
    }
    if (plan.kind === 'duel') {
      if (challenge === 'discovery' && row <= data.profiles.discovery.introThroughRow)
        return {
          ...plan,
          threat: undefined,
          opponents: (nodes.find((n) => n.nodeId === plan.nodeId) as typeof plan).opponents,
        };
      if (challenge === 'mastery' && row >= data.profiles.mastery.lateFromRow) {
        const leaders =
          plan.threat === 'fire'
            ? data.profiles.mastery.lateFire
            : data.profiles.mastery.lateVanguard;
        return { ...plan, opponents: leaders.map((id, i) => unit(plan, id, i)) };
      }
      return plan;
    }
    if (plan.kind === 'boss') {
      const original = plan.opponents;
      const profile = data.profiles[challenge];
      const leaders = profile.bossLeaders.map((id, i) => unit(plan, id, i));
      const neutrals = original
        .slice(0, profile.bossNeutrals)
        .map((neutral, i) => ({ ...neutral, id: `${plan.nodeId}:rival:${leaders.length + i}` }));
      return {
        ...plan,
        threat:
          challenge === 'discovery' || challenge === 'mastery'
            ? ('fire' as const)
            : ('vanguard' as const),
        opponents: [...leaders, ...neutrals],
      };
    }
    return plan;
  });
}
