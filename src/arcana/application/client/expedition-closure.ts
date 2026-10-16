import type { GameState } from '../game';
import { latestNodeReceipt } from './read-models';

export type ClosureAction = 'vault' | 'frog' | 'equipment' | 'prepare';

/** A read-only destination list from current inventory, separate from the historical reward. */
export function expeditionClosure(game: GameState) {
  const run = game.exploration?.run;
  if (!run || run.status === 'active') return null;
  const frog = game.inventory.products.find(p => p.kind === 'cacao-toad' && p.status === 'available');
  const assigned = new Set((game.team?.loadouts ?? []).flatMap(l => [l.wandId, l.broomId]));
  const equipment = (game.inventory.equipment ?? []).filter(e => !assigned.has(e.id));
  const actions: ClosureAction[] = [];
  if ((game.inventory.goldKeys ?? 0) > 0) actions.push('vault');
  if (frog) actions.push('frog');
  if (equipment.length) actions.push('equipment');
  actions.push('prepare');
  return Object.freeze({ run, receipt: latestNodeReceipt(game), frogId: frog?.id ?? null,
    equipmentIds: Object.freeze(equipment.map(e => e.id)), actions: Object.freeze(actions) });
}
