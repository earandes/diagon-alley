import {
  validateCatalog,
  validateToadTable,
  type OwnedWizard,
  type ToadTable,
  type WizardCatalog,
} from '../../domain/collection/wizards';

/** Collection identity is independent of a run's tactical snapshot, filters and cosmetic finish. */
export function collectionCompletion(
  catalog: WizardCatalog,
  copies: readonly OwnedWizard[],
  table?: ToadTable,
) {
  validateCatalog(catalog);
  const currentIds = new Set(catalog.wizards.map((wizard) => wizard.id));
  const ownedIds = new Set(copies.map((copy) => copy.wizard.id));
  const discovered = [...currentIds].filter((id) => ownedIds.has(id)).length;
  const historical = [...ownedIds].filter((id) => !currentIds.has(id)).length;
  let obtainable: Readonly<{ discovered: number; total: number }> | null = null;
  if (table) {
    try {
      validateToadTable(catalog, table);
      const openingIds = new Set(table.entries.map((entry) => entry.wizardId));
      obtainable = Object.freeze({
        discovered: [...openingIds].filter((id) => ownedIds.has(id)).length,
        total: openingIds.size,
      });
    } catch {
      // Missing/incompatible acquisition data must not fabricate an obtainable denominator.
    }
  }
  return Object.freeze({
    current: Object.freeze({
      discovered,
      total: currentIds.size,
      ratio: discovered / currentIds.size,
    }),
    historical: Object.freeze({ discovered: historical, total: historical }),
    obtainable,
  });
}
