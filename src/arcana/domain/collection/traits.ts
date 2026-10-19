import { ArcanaError } from '../errors';
export const HOUSES = ['gryffindor', 'ravenclaw', 'hufflepuff', 'slytherin'] as const;
export type House = (typeof HOUSES)[number];
export interface WizardTraits {
  readonly version: 1 | 2;
  readonly house?: House;
  readonly school?: 'hogwarts' | 'beauxbatons';
  readonly profession?: 'professor' | 'auror' | 'alchemist' | 'magizoologist';
  readonly nature?: 'person' | 'creature';
  readonly species?: 'phoenix' | 'hippogriff' | 'unicorn' | 'dragon';
  readonly affiliations?: readonly ('order' | 'death' | 'army')[];
}
export function traitsSnapshot(traits: WizardTraits): WizardTraits {
  if (
    !traits ||
    ![1, 2].includes(traits.version) ||
    (traits.version === 1 &&
      (traits.nature !== undefined ||
        traits.species !== undefined ||
        traits.affiliations !== undefined)) ||
    (traits.version === 2 &&
      (!['person', 'creature'].includes(traits.nature!) ||
        !Array.isArray(traits.affiliations) ||
        new Set(traits.affiliations).size !== traits.affiliations.length ||
        traits.affiliations.some((g) => !['order', 'death', 'army'].includes(g)))) ||
    (traits.nature === 'creature' &&
      (traits.house !== undefined ||
        traits.school !== undefined ||
        traits.profession !== undefined ||
        !['phoenix', 'hippogriff', 'unicorn', 'dragon'].includes(traits.species!))) ||
    (traits.nature !== 'creature' && traits.species !== undefined) ||
    (traits.house !== undefined &&
      (!HOUSES.includes(traits.house) || traits.school !== 'hogwarts')) ||
    (traits.school !== undefined && !['hogwarts', 'beauxbatons'].includes(traits.school)) ||
    (traits.profession !== undefined &&
      !(
        traits.version === 1
          ? ['professor', 'auror']
          : ['professor', 'auror', 'alchemist', 'magizoologist']
      ).includes(traits.profession))
  )
    throw new ArcanaError('INVALID_CATALOG');
  return Object.freeze({
    version: traits.version,
    ...(traits.house ? { house: traits.house } : {}),
    ...(traits.school ? { school: traits.school } : {}),
    ...(traits.profession ? { profession: traits.profession } : {}),
    ...(traits.version === 2
      ? {
          nature: traits.nature,
          affiliations: Object.freeze([...traits.affiliations!]),
          ...(traits.species ? { species: traits.species } : {}),
        }
      : {}),
  });
}
