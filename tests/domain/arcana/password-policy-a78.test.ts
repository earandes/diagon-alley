import { describe, expect, it } from 'vitest';
import { validPassword } from '../../../src/arcana/application/identity/password-policy';

describe('shared password contract A78', () => {
  for (const character of ['a', 'é', '🦉']) {
    it(`counts code points rather than UTF16 units for ${character}`, () => {
      expect(validPassword(character.repeat(14))).toBe(false);
      expect(validPassword(character.repeat(15))).toBe(true);
      expect(validPassword(character.repeat(65))).toBe(true);
      expect(validPassword(character.repeat(128))).toBe(true);
      expect(validPassword(character.repeat(129))).toBe(false);
    });
  }
  it('preserves whitespace and does not normalize combining sequences', () => {
    expect(validPassword(' '.repeat(15))).toBe(true);
    expect(validPassword('e\u0301'.repeat(8))).toBe(true);
    expect(validPassword('é'.repeat(8))).toBe(false);
    expect(validPassword('🦉'.repeat(8))).toBe(false);
    expect(validPassword('a'.repeat(100_000))).toBe(false);
  });
});
