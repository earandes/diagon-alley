import {
  acquireWizard,
  validateCatalog,
  validateToadTable,
  type OwnedWizard,
  type WizardDefinition,
  type WizardCatalog,
  type ToadTable,
} from '../../domain/collection/wizards';
import { advanceRoute, type RouteRun, type NodeGraph } from '../../domain/exploration/route';
import { ArcanaError } from '../../domain/errors';
import type { GameState } from '../game';
import type { NodeReceipt } from '../run-contracts';
import {
  commerceSnapshot,
  hasForgeFunds,
  hasVaultKey,
  type CommerceCatalogs,
} from '../../domain/economy/commerce';
import { validateInventory, type Inventory } from '../../domain/economy/inventory';
export function commerceOffers(inventory: Inventory, catalogs: CommerceCatalogs) {
  validateInventory(inventory);
  const catalog = commerceSnapshot(catalogs);
  const total = catalog.vault.entries.reduce((sum, entry) => sum + entry.weight, 0);
  return Object.freeze({
    canOpenVault: hasVaultKey(inventory),
    vaultRewards: Object.freeze(
      catalog.vault.entries.map((entry) =>
        Object.freeze({ id: entry.id, loot: entry.loot, probability: entry.weight / total }),
      ),
    ),
    recipes: Object.freeze(
      catalog.forge.recipes.map((recipe) =>
        Object.freeze({ recipe, affordable: hasForgeFunds(inventory, recipe) }),
      ),
    ),
  });
}
/** Run/node identity is stable even when SQL or unrelated receipts have another ordering. */
export function latestNodeReceipt(state: GameState): NodeReceipt | null {
  const run = state.exploration?.run,
    nodeId = run?.visited.at(-1);
  if (!run || !nodeId) return null;
  return (
    state.receipts.find(
      (receipt): receipt is NodeReceipt =>
        receipt.kind === 'advance-node' &&
        receipt.request.runId === run.id &&
        receipt.request.nodeId === nodeId,
    ) ?? null
  );
}
export interface CromodexEntry {
  readonly wizard: WizardDefinition;
  readonly catalogVersion: number;
  readonly discovered: boolean;
  readonly historical: boolean;
  readonly copies: readonly OwnedWizard[];
}
/** The album is a read model of committed copies, not a second economic transaction root. */
export function cromodex(
  catalog: WizardCatalog,
  copies: readonly OwnedWizard[],
): readonly CromodexEntry[] {
  validateCatalog(catalog);
  let snapshots: readonly OwnedWizard[] = [];
  for (const copy of copies)
    snapshots = acquireWizard(
      snapshots,
      copy.copyId,
      copy.wizard,
      copy.catalogVersion,
      copy.sourceId,
      copy.origin,
    );
  const definitions = [
    ...catalog.wizards,
    ...snapshots
      .filter((c) => !catalog.wizards.some((w) => w.id === c.wizard.id))
      .map((c) => c.wizard),
  ];
  const seen = new Set<string>();
  return Object.freeze(
    definitions
      .filter((w) => {
        if (seen.has(w.id)) return false;
        seen.add(w.id);
        return true;
      })
      .map((w) => {
        const owned = Object.freeze(snapshots.filter((c) => c.wizard.id === w.id)),
          first = owned[0];
        return Object.freeze({
          wizard: first?.wizard ?? w,
          catalogVersion: first?.catalogVersion ?? catalog.version,
          discovered: owned.length > 0,
          historical: !catalog.wizards.some((current) => current.id === w.id),
          copies: owned,
        });
      }),
  );
}
export function toadProbabilities(catalog: WizardCatalog, table: ToadTable) {
  validateToadTable(catalog, table);
  const total = table.entries.reduce((n, e) => n + e.weight, 0);
  return Object.freeze(
    table.entries.map((e) =>
      Object.freeze({
        wizard: catalog.wizards.find((w) => w.id === e.wizardId)!,
        probability: e.weight / total,
      }),
    ),
  );
}
export function routeOptions(run: RouteRun, graph: NodeGraph): readonly string[] {
  return Object.freeze(
    graph.nodes
      .filter((node) => {
        try {
          advanceRoute(run, graph, node.id);
          return true;
        } catch (error) {
          if (error instanceof ArcanaError && error.code === 'INVALID_NODE') return false;
          throw error;
        }
      })
      .map((node) => node.id),
  );
}
