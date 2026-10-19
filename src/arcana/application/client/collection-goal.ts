import type { GameState } from '../game';
import type { PublicContent } from '../public-content';
import type { WizardCatalog } from '../../domain/collection/wizards';
import { validDomainId } from '../../domain/identifiers';
import { routeOptions, toadProbabilities } from './read-models';

/** A device preference; acquisition is always derived from authoritative copies, never this record. */
export interface CollectionGoal {
  readonly version: 1;
  readonly owner: string;
  readonly wizardId: string;
  readonly catalogVersion: number;
}
export const collectionGoalKey = (owner: string) =>
  `arcana.collection-goal.v1.${encodeURIComponent(owner)}`;
export function parseCollectionGoal(raw: string | null, owner: string): CollectionGoal | null {
  try {
    if (raw === null) return null;
    const value = JSON.parse(raw) as CollectionGoal;
    if (
      !value ||
      Object.keys(value).length !== 4 ||
      value.version !== 1 ||
      value.owner !== owner ||
      !validDomainId(owner) ||
      !validDomainId(value.wizardId) ||
      !Number.isSafeInteger(value.catalogVersion) ||
      value.catalogVersion < 1
    )
      return null;
    return Object.freeze({
      version: 1,
      owner,
      wizardId: value.wizardId,
      catalogVersion: value.catalogVersion,
    });
  } catch {
    return null;
  }
}
type PreferenceStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
export function storeCollectionGoal(
  storage: PreferenceStorage,
  owner: string,
  goal: CollectionGoal | null,
): boolean {
  try {
    if (goal) {
      if (!parseCollectionGoal(JSON.stringify(goal), owner)) return false;
      storage.setItem(collectionGoalKey(owner), JSON.stringify(goal));
    } else storage.removeItem(collectionGoalKey(owner));
    return true;
  } catch {
    return false;
  }
}
export function collectionSources(
  wizardId: string,
  game: GameState,
  catalog: WizardCatalog,
  content?: PublicContent,
) {
  let probability: number | null = null;
  if (
    content?.catalog.version === catalog.version &&
    content.toadTable.catalogVersion === catalog.version
  ) {
    try {
      probability =
        toadProbabilities(catalog, content.toadTable).find((entry) => entry.wizard.id === wizardId)
          ?.probability ?? 0;
    } catch {
      /* Unavailable/stale public content must not fabricate a percentage. */
    }
  }
  const run = game.exploration?.run;
  const plans = run ? run.campaignSnapshot?.nodes : content?.campaign.nodes;
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
  const temporaryOpportunity = !!plans?.some(
    (plan) =>
      plan.kind === 'pact' &&
      (!run || reachable.has(plan.nodeId)) &&
      (plan.recruits ?? [plan.recruit]).some((unit) => unit.wizardId === wizardId),
  );
  return Object.freeze({
    probability,
    tableVersion: probability === null ? null : content!.toadTable.version,
    temporaryOpportunity,
  });
}
export function collectionGoalView(
  goal: CollectionGoal | null,
  game: GameState,
  catalog: WizardCatalog,
  content?: PublicContent,
) {
  if (!goal || goal.owner !== game.playerId) return null;
  const owned = game.copies.some((copy) => copy.wizard.id === goal.wizardId);
  const sources = collectionSources(goal.wizardId, game, catalog, content);
  const exists = catalog.wizards.some((wizard) => wizard.id === goal.wizardId);
  return Object.freeze({
    goal,
    ...sources,
    status: owned
      ? ('acquired' as const)
      : !exists || sources.probability === 0
        ? ('archived' as const)
        : ('searching' as const),
  });
}
