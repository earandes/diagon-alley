import type { GameState } from '../game';
import type { PublicContent } from '../public-content';
import type { NodePlan } from '../../domain/exploration/nodes';
import { routeOptions } from './read-models';

/** Read-only guidance; this never grants a key or infers a vault opening from a zero balance. */
export function vaultGuidance(game: GameState, content?: PublicContent, opened = false) {
  const keys = game.inventory.goldKeys ?? 0;
  if (keys > 0) return Object.freeze({ status: 'ready' as const, opened, source: null });
  const victories = game.exploration?.victories ?? [];
  const keySource = (node: NodePlan, version: number) => {
    if (node.kind === 'duel' || node.kind === 'boss')
      return (
        node.reward.goldKeys > 0 &&
        !victories.some(
          (victory) => victory.levelId === node.levelId && victory.version === version,
        )
      );
    if (node.kind === 'chest') return node.reward.goldKeys > 0;
    if (node.kind === 'encounter' && !node.offer)
      return node.choices.some(
        (choice) => choice.effect.kind === 'reward' && choice.effect.reward.goldKeys > 0,
      );
    return false;
  };
  const run = game.exploration?.run;
  const snapshot = run?.status === 'active' ? run.campaignSnapshot : undefined;
  const current = content?.campaign;
  // An active historical run can still contain a source absent from today's campaign.
  const reachable = new Set<string>();
  if (run?.status === 'active') {
    const queue = [...routeOptions(run, run.graph)];
    while (queue.length) {
      const id = queue.shift()!;
      if (reachable.has(id)) continue;
      reachable.add(id);
      queue.push(...(run.graph.nodes.find((node) => node.id === id)?.next ?? []));
    }
  }
  const activePlans = snapshot?.nodes.filter((node) => reachable.has(node.nodeId)) ?? [];
  const activeSource = activePlans.find((node) => keySource(node, snapshot!.version));
  const unlocked =
    !game.exploration || game.exploration.unlockedZones.includes(current?.zoneId ?? '');
  const futureSource = unlocked && current?.nodes?.find((node) => keySource(node, current.version));
  const source = activeSource || futureSource;
  if (source) return Object.freeze({ status: 'source' as const, opened, source: source.kind });
  const historicalPlansMissing =
    run?.status === 'active' && !snapshot && run.campaignVersion !== current?.version;
  return Object.freeze({
    status:
      !historicalPlansMissing && (current?.nodes || snapshot)
        ? ('unavailable' as const)
        : ('unknown' as const),
    opened,
    source: null,
  });
}
