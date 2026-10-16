import { ArcanaError } from '../../domain/errors';
import type { RandomTickets } from '../../domain/combat/random';
import { createSeed } from '../../domain/combat/seed';

/** Mulberry32 sequence v1. Reproducible simulation, not a cryptographic authority. */
export class SeededRandom implements RandomTickets {
  private state: number;
  constructor(seed: number) {
    this.state = createSeed(seed);
  }

  private nextUint32(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(this.state ^ (this.state >>> 15), this.state | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return (value ^ (value >>> 14)) >>> 0;
  }

  ticket(maxExclusive: number): number {
    if (!Number.isSafeInteger(maxExclusive) || maxExclusive < 1 || maxExclusive > 0x100000000)
      throw new ArcanaError('INVALID_RANDOM_BOUND');
    const limit = Math.floor(0x100000000 / maxExclusive) * maxExclusive;
    let value: number;
    do {
      value = this.nextUint32();
    } while (value >= limit);
    return value % maxExclusive;
  }
}
