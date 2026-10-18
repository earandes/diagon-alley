import { validPassword } from '../../application/identity/password-policy.ts';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

export type IdentityErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'INVALID_TOKEN'
  | 'ACCOUNT_CONFLICT'
  | 'GUEST_SESSION_REQUIRED'
  | 'PLAYER_MISMATCH'
  | 'STORAGE';
export class IdentityError extends Error {
  readonly code: IdentityErrorCode;
  constructor(code: IdentityErrorCode) {
    super(code);
    this.code = code;
    this.name = 'IdentityError';
  }
}
export interface Passwords {
  hash(password: string): Promise<string>;
  verify(password: string, encoded: string): Promise<boolean>;
}
export function normalizeEmail(value: string): string {
  if (typeof value !== 'string' || value.length > 254 || /[\r\n\x00-\x1f\x7f]/.test(value))
    throw new IdentityError('INVALID_CREDENTIALS');
  const email = value.trim().toLowerCase();
  // Deliberately narrow email syntax, not an assertion that the mailbox exists.
  if (
    !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/.test(
      email,
    )
  )
    throw new IdentityError('INVALID_CREDENTIALS');
  return email;
}
const derive = (password: string, salt: Buffer) =>
  new Promise<Buffer>((resolve, reject) => {
    // OWASP's bounded-memory alternative: N=2^15,r=8,p=3 (~32MiB per operation).
    scrypt(
      password,
      salt,
      64,
      { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 },
      (error, value) => (error ? reject(error) : resolve(value)),
    );
  });
export class ScryptPasswords implements Passwords {
  async hash(password: string): Promise<string> {
    if (!validPassword(password)) throw new IdentityError('INVALID_CREDENTIALS');
    const salt = randomBytes(16),
      key = await derive(password, salt);
    return `scrypt:32768:8:3:${salt.toString('hex')}:${key.toString('hex')}`;
  }
  async verify(password: string, encoded: string): Promise<boolean> {
    if (!validPassword(password)) return false;
    const parts = /^scrypt:32768:8:3:([a-f0-9]{32}):([a-f0-9]{128})$/.exec(encoded);
    if (!parts) return false;
    const actual = await derive(password, Buffer.from(parts[1], 'hex'));
    return timingSafeEqual(actual, Buffer.from(parts[2], 'hex'));
  }
}
