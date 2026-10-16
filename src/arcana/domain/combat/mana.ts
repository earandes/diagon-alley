import { ArcanaError } from '../errors';

export interface ManaPoints {
  readonly current: number;
  readonly maximum: number;
}

export function createManaPoints(current: number, maximum: number): ManaPoints {
  if (
    !Number.isFinite(current) ||
    !Number.isFinite(maximum) ||
    current < 0 ||
    maximum < 0 ||
    current > maximum
  )
    throw new ArcanaError('INVALID_MANA');
  return Object.freeze({ current, maximum });
}

export function spendMana(mana: ManaPoints, amount: number): ManaPoints {
  createManaPoints(mana.current, mana.maximum);
  if (!Number.isFinite(amount) || amount <= 0) throw new ArcanaError('INVALID_MANA');
  if (amount > mana.current) throw new ArcanaError('INSUFFICIENT_MANA');
  return createManaPoints(mana.current - amount, mana.maximum);
}
