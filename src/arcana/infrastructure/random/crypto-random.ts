import { randomBytes, randomInt } from 'node:crypto';
import type { BattleSeeds } from '../../application/run-use-cases';
import type { RandomTickets } from '../../domain/combat/random';
import { ArcanaError } from '../../domain/errors';
export class CryptoBattleSeeds implements BattleSeeds {
  next(): number {
    return randomBytes(4).readUInt32LE(0);
  }
}
export class CryptoTickets implements RandomTickets {
  ticket(exclusiveUpperBound: number): number {
    if (
      !Number.isSafeInteger(exclusiveUpperBound) ||
      exclusiveUpperBound < 1 ||
      exclusiveUpperBound > 2 ** 32
    )
      throw new ArcanaError('INVALID_RANDOM_BOUND');
    return randomInt(exclusiveUpperBound);
  }
}
