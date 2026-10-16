import { describe, expect, it } from 'vitest';
import {
  CryptoBattleSeeds,
  CryptoTickets,
} from '../../../src/arcana/infrastructure/random/crypto-random';
describe('ARCANA authority randomness adapters', () => {
  it('generates unsigned 32-bit battle seeds for reproducible server logs', () => {
    const seeds = new CryptoBattleSeeds();
    for (let i = 0; i < 16; i++) {
      const seed = seeds.next();
      expect(Number.isInteger(seed)).toBe(true);
      expect(seed).toBeGreaterThanOrEqual(0);
      expect(seed).toBeLessThan(2 ** 32);
    }
  });
  it('produces bounded cryptographic tickets including the maximum supported weight', () => {
    const random = new CryptoTickets();
    for (const bound of [1, 2, 17, 2 ** 32]) {
      const ticket = random.ticket(bound);
      expect(Number.isInteger(ticket)).toBe(true);
      expect(ticket).toBeGreaterThanOrEqual(0);
      expect(ticket).toBeLessThan(bound);
    }
    expect(random.ticket(1)).toBe(0);
  });
  it('rejects invalid bounds instead of reducing invalid random values', () => {
    for (const bound of [0, -1, 0.5, NaN, Infinity, 2 ** 32 + 1])
      expect(() => new CryptoTickets().ticket(bound)).toThrow('INVALID_RANDOM_BOUND');
  });
});
