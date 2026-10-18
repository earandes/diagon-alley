import { validateCombatUnit, unitSnapshot, type CombatUnitInput } from '../combat/engine';
import { ArcanaError } from '../errors';
import { validDomainId } from '../identifiers';
import { campaignSnapshot, validateCampaign, type Campaign } from './nodes';
import { sameGraph } from './route';
import { intentionSnapshot, type ExpeditionIntention } from './intentions';
import { validateGraph, type NodeGraph, type RouteRun } from './route';

export interface RunMember {
  readonly source: 'owned' | 'temporary';
  readonly unit: CombatUnitInput;
}
export interface Run extends RouteRun {
  readonly tacticalVersion?: 1 | 2 | 3;
  readonly equipmentRulesVersion?: 2;
  readonly challenge?: 'discovery' | 'tactical' | 'mastery';
  readonly campaignSnapshot?: Campaign;
  readonly routeGeneration?: { readonly version: 1; readonly seed: number };
  readonly campaignVersion: number;
  readonly zoneId: string;
  readonly graph: NodeGraph;
  readonly status: 'active' | 'won' | 'lost' | 'draw';
  readonly members: readonly RunMember[];
  readonly reserves?: readonly RunMember[];
}
export interface Victory {
  readonly levelId: string;
  readonly version: number;
}
export interface ExplorationState {
  readonly run: Run | null;
  readonly victories: readonly Victory[];
  readonly unlockedZones: readonly string[];
  readonly intention?: ExpeditionIntention | null;
}
const version = (n: number) => Number.isSafeInteger(n) && n > 0;
export function validateRun(run: Run): void {
  if (
    !run ||
    !validDomainId(run.id) ||
    !validDomainId(run.zoneId) ||
    !version(run.campaignVersion) ||
    !['active', 'won', 'lost', 'draw'].includes(run.status) ||
    !Array.isArray(run.members) ||
    run.members.length < 1 ||
    run.members.length > 5 ||
    !Array.isArray(run.visited)
  )
    throw new ArcanaError('INVALID_ROUTE');
  if (
    run.routeGeneration &&
    (run.routeGeneration.version !== 1 ||
      !Number.isSafeInteger(run.routeGeneration.seed) ||
      run.routeGeneration.seed < 0 ||
      run.routeGeneration.seed > 0xffffffff)
  )
    throw new ArcanaError('INVALID_ROUTE');
  if (
    (run.equipmentRulesVersion !== undefined && run.equipmentRulesVersion !== 2) ||
    (run.challenge !== undefined &&
      (!['discovery', 'tactical', 'mastery'].includes(run.challenge) ||
        ![2, 3].includes(run.tacticalVersion ?? 0)))
  )
    throw new ArcanaError('INVALID_ROUTE');
  validateGraph(run.graph);
  if (run.campaignSnapshot !== undefined) {
    validateCampaign(run.campaignSnapshot);
    if (
      ![1, 2, 3].includes(run.tacticalVersion ?? 0) ||
      run.campaignVersion !== run.campaignSnapshot.version ||
      run.zoneId !== run.campaignSnapshot.zoneId ||
      !sameGraph(run.graph, run.campaignSnapshot.graph)
    )
      throw new ArcanaError('INVALID_ROUTE');
  } else if (run.tacticalVersion !== undefined) throw new ArcanaError('INVALID_ROUTE');
  if (run.graphVersion !== run.graph.version) throw new ArcanaError('INVALID_ROUTE');
  const ids = new Set<string>();
  if (run.reserves !== undefined && !Array.isArray(run.reserves))
    throw new ArcanaError('INVALID_ROUTE');
  for (const member of [...run.members, ...(run.reserves ?? [])]) {
    if (!['owned', 'temporary'].includes(member.source)) throw new ArcanaError('INVALID_FORMATION');
    validateCombatUnit(member.unit);
    if (member.unit.beanUnitId !== undefined || ids.has(member.unit.id))
      throw new ArcanaError('INVALID_FORMATION');
    ids.add(member.unit.id);
  }
  if (run.reserves?.some((member) => member.source !== 'owned'))
    throw new ArcanaError('INVALID_FORMATION');
  let prior: string | undefined;
  const visited = new Set<string>();
  for (const id of run.visited) {
    const node = run.graph.nodes.find((n) => n.id === id);
    if (
      !node ||
      visited.has(id) ||
      (prior ? !run.graph.nodes.find((n) => n.id === prior)!.next.includes(id) : node.row !== 0)
    )
      throw new ArcanaError('INVALID_ROUTE');
    visited.add(id);
    prior = id;
  }
  const last = run.graph.nodes.find((n) => n.id === prior);
  if (
    (run.status === 'won' && last?.kind !== 'boss') ||
    (run.status === 'active' &&
      (!run.members.some((m) => m.unit.hp > 0) || last?.kind === 'boss')) ||
    (run.status === 'lost' && run.members.some((m) => m.unit.hp > 0))
  )
    throw new ArcanaError('INVALID_ROUTE');
}
export function runSnapshot(run: Run): Run {
  validateRun(run);
  return Object.freeze({
    ...run,
    ...(run.campaignSnapshot ? { campaignSnapshot: campaignSnapshot(run.campaignSnapshot) } : {}),
    ...(run.routeGeneration ? { routeGeneration: Object.freeze({ ...run.routeGeneration }) } : {}),
    graph: Object.freeze({
      version: run.graph.version,
      nodes: Object.freeze(
        run.graph.nodes.map((n) => Object.freeze({ ...n, next: Object.freeze([...n.next]) })),
      ),
    }),
    visited: Object.freeze([...run.visited]),
    members: Object.freeze(
      run.members.map((m) => Object.freeze({ source: m.source, unit: unitSnapshot(m.unit) })),
    ),
    reserves: Object.freeze(
      (run.reserves ?? []).map((m) =>
        Object.freeze({ source: m.source, unit: unitSnapshot(m.unit) }),
      ),
    ),
  });
}
export function explorationSnapshot(state: ExplorationState): ExplorationState {
  if (
    !state ||
    !Array.isArray(state.victories) ||
    !Array.isArray(state.unlockedZones) ||
    state.victories.some((v) => !validDomainId(v.levelId) || !version(v.version)) ||
    new Set(state.victories.map((v) => `${v.levelId}:${v.version}`)).size !==
      state.victories.length ||
    state.unlockedZones.some((id) => !validDomainId(id)) ||
    new Set(state.unlockedZones).size !== state.unlockedZones.length ||
    (state.run && !state.unlockedZones.includes(state.run.zoneId))
  )
    throw new ArcanaError('INVALID_ROUTE');
  return Object.freeze({
    run: state.run === null ? null : runSnapshot(state.run),
    ...(state.intention == null ? {} : { intention: intentionSnapshot(state.intention) }),
    victories: Object.freeze(state.victories.map((v) => Object.freeze({ ...v }))),
    unlockedZones: Object.freeze([...state.unlockedZones]),
  });
}
export function healRun(members: readonly RunMember[], fraction: number): readonly RunMember[] {
  if (!Number.isFinite(fraction) || fraction < 0 || fraction > 1)
    throw new ArcanaError('INVALID_CAMPAIGN');
  return members.map((member) => ({
    ...member,
    unit: {
      ...member.unit,
      hp: Math.min(member.unit.maxHp, member.unit.hp + member.unit.maxHp * fraction),
    },
  }));
}
