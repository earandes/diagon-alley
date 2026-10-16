import { ArcanaError } from '../errors';

export type Seed = number & { readonly __seed: unique symbol };

export function createSeed(value: unknown): Seed {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0 || value > 0xffffffff)
    throw new ArcanaError('INVALID_SEED');
  return value as Seed;
}
