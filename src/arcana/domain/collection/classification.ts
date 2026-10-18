import type { House, WizardTraits } from './traits';
export type ClassificationFilter = 'all' | 'creatures' | 'order' | 'death' | 'army' | House;
/** Current catalogue biography filter, never the authority for a historical combat. */
export function matchesClassification(
  traits: WizardTraits | undefined,
  filter: ClassificationFilter,
) {
  if (filter === 'all') return true;
  if (filter === 'creatures') return traits?.nature === 'creature';
  if (filter === 'order' || filter === 'death' || filter === 'army')
    return !!traits?.affiliations?.includes(filter);
  return traits?.house === filter;
}
