import { ArcanaError } from '../errors';
export const HOUSES = ['gryffindor', 'ravenclaw', 'hufflepuff', 'slytherin'] as const;
export type House = (typeof HOUSES)[number];
export interface WizardTraits {
  readonly version: 1;
  readonly house?: House;
  readonly school?: 'hogwarts' | 'beauxbatons';
  readonly profession?: 'professor' | 'auror';
}
export function traitsSnapshot(traits: WizardTraits): WizardTraits {
  if (
    !traits ||
    traits.version !== 1 ||
    (traits.house !== undefined &&
      (!HOUSES.includes(traits.house) || traits.school !== 'hogwarts')) ||
    (traits.school !== undefined && !['hogwarts', 'beauxbatons'].includes(traits.school)) ||
    (traits.profession !== undefined && !['professor', 'auror'].includes(traits.profession))
  )
    throw new ArcanaError('INVALID_CATALOG');
  return Object.freeze({
    version: 1,
    ...(traits.house ? { house: traits.house } : {}),
    ...(traits.school ? { school: traits.school } : {}),
    ...(traits.profession ? { profession: traits.profession } : {}),
  });
}
