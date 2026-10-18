import type { NodePlan } from '../../domain/exploration/nodes';
import type { NodeGraph } from '../../domain/exploration/route';
import type { WizardCatalog } from '../../domain/collection/wizards';
import type { Affinity } from '../../domain/combat/engine';
import { ArcanaError } from '../../domain/errors';

/** Three fixed alternatives, alongside the existing house choice. No new route or economy. */
export function creaturePacts(
  plans: readonly NodePlan[],
  catalog: WizardCatalog,
  affinities: Readonly<Record<string, Affinity>>,
  graph: NodeGraph,
  initialIds: readonly string[] = [],
): readonly NodePlan[] {
  const all = catalog.wizards.filter((w) => w.traits?.nature === 'creature');
  if (all.length < 4) throw new ArcanaError('INVALID_CAMPAIGN');
  let signature = 0;
  for (const node of graph.nodes)
    for (const char of `${node.id}:${node.row}:${node.next.join(',')}`)
      signature = (Math.imul(signature, 31) + char.charCodeAt(0)) >>> 0;
  const offset = signature % all.length;
  const candidates = [...all.slice(offset), ...all.slice(0, offset)].sort(
    (a, b) => Number(initialIds.includes(a.id)) - Number(initialIds.includes(b.id)),
  );
  const ordered = plans
    .filter((p) => p.kind === 'pact')
    .sort(
      (a, b) =>
        graph.nodes.find((n) => n.id === a.nodeId)!.row -
        graph.nodes.find((n) => n.id === b.nodeId)!.row,
    );
  return plans.map((plan) => {
    if (plan.kind !== 'pact') return plan;
    const wizard = candidates[ordered.indexOf(plan) % candidates.length];
    const recruit = {
      ...plan.recruit,
      id: `${plan.nodeId}:creature`,
      wizardId: wizard.id,
      house: undefined,
      affinity: affinities[wizard.id],
      hp: wizard.stats.maxHp,
      maxHp: wizard.stats.maxHp,
      mana: wizard.stats.maxMana,
      maxMana: wizard.stats.maxMana,
      power: wizard.stats.power,
      speed: wizard.stats.speed,
    };
    if (!recruit.affinity) throw new ArcanaError('INVALID_CAMPAIGN');
    return { ...plan, recruits: [plan.recruit, recruit] };
  });
}
