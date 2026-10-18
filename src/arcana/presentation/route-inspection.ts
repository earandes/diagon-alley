import type { Run } from '../domain/exploration/run';
import type { NodePlan } from '../domain/exploration/nodes';
import type { RouteNode } from '../domain/exploration/route';
import { routeOptions } from '../application/client/read-models';

export interface RoutePosition {
  readonly stage: number;
  readonly option: number;
}
export interface PublicRouteNode {
  readonly id: string;
  readonly kind: RouteNode['kind'];
  readonly position: RoutePosition;
}
export interface PublicRouteInspection extends PublicRouteNode {
  readonly state: 'visited' | 'available' | 'locked';
  readonly from: readonly PublicRouteNode[];
  readonly to: readonly PublicRouteNode[];
  readonly threat?: 'fire' | 'vanguard';
}

/** A read-only projection: relations and advertised threat, never offers, rewards or random results. */
export function routeInspection(
  run: Run,
  nodeId: string,
  legacyPlans: readonly NodePlan[] = [],
): PublicRouteInspection | undefined {
  const node = run.graph.nodes.find((candidate) => candidate.id === nodeId);
  if (!node) return undefined;
  const publicNode = (candidate: RouteNode): PublicRouteNode => {
    const row = run.graph.nodes
      .filter((other) => other.row === candidate.row)
      .sort((a, b) => (a.column ?? 0) - (b.column ?? 0));
    return {
      id: candidate.id,
      kind: candidate.kind,
      position: {
        stage: candidate.row + 1,
        option: row.findIndex((other) => other.id === candidate.id) + 1,
      },
    };
  };
  const available = run.status === 'active' && routeOptions(run, run.graph).includes(nodeId);
  const plans = run.campaignSnapshot?.nodes ?? legacyPlans;
  const plan = plans.find(
    (candidate) => candidate.nodeId === nodeId && candidate.kind === node.kind,
  );
  const threat = plan?.kind === 'duel' ? plan.threat : undefined;
  return {
    ...publicNode(node),
    state: run.visited.includes(nodeId) ? 'visited' : available ? 'available' : 'locked',
    from: run.graph.nodes.filter((candidate) => candidate.next.includes(nodeId)).map(publicNode),
    to: node.next.flatMap((id) => {
      const destination = run.graph.nodes.find((candidate) => candidate.id === id);
      return destination ? [publicNode(destination)] : [];
    }),
    ...(threat ? { threat } : {}),
  };
}
