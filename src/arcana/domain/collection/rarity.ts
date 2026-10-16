import { ArcanaError } from '../errors';

export type Rarity = 'common' | 'unusual' | 'epic' | 'arcane-legendary';

export function createRarity(value: unknown): Rarity {
  if (
    typeof value !== 'string' ||
    !['common', 'unusual', 'epic', 'arcane-legendary'].includes(value)
  )
    throw new ArcanaError('INVALID_RARITY');
  return value as Rarity;
}
