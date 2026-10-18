import type { Affinity, CombatUnitInput } from '../../domain/combat/engine';
import data from '../../content/traits-v1.json';
import extended from '../../content/traits-v2.json';
import { traitsSnapshot, type House, type WizardTraits } from '../../domain/collection/traits';
import type { WizardCatalog } from '../../domain/collection/wizards';
import type { NodeGraph } from '../../domain/exploration/route';
import type { NodePlan } from '../../domain/exploration/nodes';
import { ArcanaError } from '../../domain/errors';
export function currentTraits(id: string, version: 1 | 2 = 1): WizardTraits | undefined {
  const value = ((version === 2 ? extended : data).characters as Record<string, WizardTraits>)[id];
  return value && traitsSnapshot(value);
}
/** A non-starter house has three distinct candidates along the existing three Pacts.
 * The graph signature chooses its theme once; the stored plans never reroll on inspection. */
export function housePacts(
  plans: readonly NodePlan[],
  catalog: WizardCatalog,
  affinities: Readonly<Record<string, Affinity>>,
  graph: NodeGraph,
  initialWizardIds: readonly string[] = [],
): readonly NodePlan[] {
  let signature = 0;
  for (const node of graph.nodes)
    for (const char of `${node.id}:${node.row}:${node.next.join(',')}`)
      signature = (Math.imul(signature, 31) + char.charCodeAt(0)) >>> 0;
  const houses: House[] = ['ravenclaw', 'hufflepuff', 'slytherin'];
  const initial = new Set(initialWizardIds);
  const preferred = houses.filter((h) =>
    catalog.wizards.some((w) => w.traits?.house === h && initial.has(w.id)),
  );
  const pool = preferred.length ? preferred : houses;
  const house = pool[signature % pool.length];
  const candidates = catalog.wizards
    .filter((w) => w.traits?.house === house)
    .sort((a, b) => Number(initial.has(a.id)) - Number(initial.has(b.id)));
  if (candidates.length < 4) throw new ArcanaError('INVALID_CAMPAIGN');
  const ordered = plans
    .filter((p) => p.kind === 'pact')
    .sort(
      (a, b) =>
        graph.nodes.find((n) => n.id === a.nodeId)!.row -
        graph.nodes.find((n) => n.id === b.nodeId)!.row,
    );
  const decorate = (unit: CombatUnitInput): CombatUnitInput => {
    const house = catalog.wizards.find((w) => w.id === unit.wizardId)?.traits?.house;
    return { ...unit, ...(house ? { house } : {}) };
  };
  return plans.map((plan) => {
    if (plan.kind === 'duel' || plan.kind === 'boss')
      return { ...plan, opponents: plan.opponents.map(decorate) };
    if (plan.kind !== 'pact') return plan;
    const index = ordered.findIndex((p) => p.nodeId === plan.nodeId),
      wizard = candidates[index % candidates.length];
    const prototype = plan.recruit;
    const recruit = {
      ...prototype,
      id: `${plan.nodeId}:house`,
      wizardId: wizard.id,
      house,
      affinity: affinities[wizard.id],
      hp: wizard.stats.maxHp,
      maxHp: wizard.stats.maxHp,
      mana: wizard.stats.maxMana,
      maxMana: wizard.stats.maxMana,
      power: wizard.stats.power,
      speed: wizard.stats.speed,
    };
    if (!affinities[wizard.id]) throw new ArcanaError('INVALID_CAMPAIGN');
    return { ...plan, recruit, recruits: [recruit, decorate((plan.recruits ?? [prototype])[0])] };
  });
}
