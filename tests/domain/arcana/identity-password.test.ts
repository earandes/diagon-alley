import { describe, expect, it } from 'vitest';
import {
  normalizeEmail,
  ScryptPasswords,
  IdentityError,
} from '../../../src/arcana/infrastructure/identity/passwords';

describe('recoverable identity credentials', () => {
  it('normalizes an email consistently without accepting headers or ambiguous addresses', () => {
    expect(normalizeEmail('  Player@Example.COM  ')).toBe('player@example.com');
    for (const value of [
      'no-email',
      'a@example.com\r\nBcc:b@c.com',
      'a b@example.com',
      'a@localhost',
    ])
      expect(() => normalizeEmail(value)).toThrow(IdentityError);
  });
  it('stores salted asynchronous scrypt hashes, preserves spaces and rejects wrong passwords', async () => {
    const passwords = new ScryptPasswords();
    const password = '  a sufficiently long secret  ';
    const hash = await passwords.hash(password);
    const other = await passwords.hash(password);
    expect(hash).not.toBe(other);
    expect(hash).not.toContain(password);
    expect(await passwords.verify(password, hash)).toBe(true);
    expect(await passwords.verify(password.trim(), hash)).toBe(false);
    expect(await passwords.verify(password, 'invalid')).toBe(false);
  });
  it('accepts passphrases and Unicode but limits expensive input before hashing', async () => {
    const passwords = new ScryptPasswords();
    await expect(passwords.hash('short')).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' });
    await expect(passwords.hash('a'.repeat(129))).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS',
    });
    const phrase = 'Un secreto largo 🦉 con espacios';
    expect(await passwords.verify(phrase, await passwords.hash(phrase))).toBe(true);
  });
});
