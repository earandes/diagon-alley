import data from '../../content/tactical-v1.json';
import type { WizardCatalog } from '../../domain/collection/wizards';
import type { Affinity, CombatUnitInput } from '../../domain/combat/engine';
import type { NodePlan } from '../../domain/exploration/nodes';
import { ArcanaError } from '../../domain/errors';
/** A separate content version, deliberately NOT the campaign/first-victory version. */
export function tacticalContent(
  nodes: readonly NodePlan[],
  catalog: WizardCatalog,
  affinities: Readonly<Record<string, Affinity>>,
): { version: 1; nodes: readonly NodePlan[] } {
  const unit = (id: string, wizardId: string): CombatUnitInput => {
    const wizard = catalog.wizards.find((w) => w.id === wizardId);
    if (!wizard || !affinities[wizardId]) throw new ArcanaError('INVALID_CAMPAIGN');
    const s = wizard.stats;
    return {
      id,
      wizardId,
      level: 1,
      affinity: affinities[wizardId],
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
  let pact = 0,
    duel = 0;
  return {
    version: 1,
    nodes: nodes.map((plan) => {
      if (plan.kind === 'pact') {
        const pair = data.pacts[pact++ % data.pacts.length];
        const recruits = pair.map((id, i) => unit(`${plan.nodeId}:choice:${i}`, id));
        return { ...plan, recruit: recruits[0], recruits };
      }
      if (plan.kind === 'duel') {
        const family = data.duels[duel++ % data.duels.length];
        return {
          ...plan,
          threat: family.threat as 'fire' | 'vanguard',
          opponents: [
            ...family.leaders.map((id, i) => unit(`${plan.nodeId}:rival:${i}`, id)),
            plan.opponents[2],
          ],
        };
      }
      return plan;
    }),
  };
}
