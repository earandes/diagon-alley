import type { Run } from '../domain/exploration/run';
import { routeOptions } from '../application/client/read-models';

/** Guidance projects confirmed state; it never chooses a node or changes the run. */
export function expeditionCue(run: Run | null | undefined) {
  if (!run) return 'begin';
  if (run.status !== 'active') return run.status;
  if (run.members.length >= 3) return 'choose';
  const available = routeOptions(run, run.graph);
  return run.graph.nodes.some((n) => n.kind === 'pact' && available.includes(n.id))
    ? 'recruit'
    : 'prepare';
}
