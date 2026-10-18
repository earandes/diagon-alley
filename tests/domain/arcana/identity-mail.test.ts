import { mkdtemp, readdir, readFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { LocalIdentityMail } from '../../../src/arcana/infrastructure/identity/mail';

describe('private local mailbox transport', () => {
  it('delivers a real file privately without returning a token to the HTTP caller', async () => {
    const root = await mkdtemp(join(tmpdir(), 'arcana-identity-mail-'));
    try {
      const directory = join(root, 'private-mail');
      const transport = new LocalIdentityMail(directory, 'test');
      const message = {
        to: 'test@example.com',
        purpose: 'verify' as const,
        token: 'a'.repeat(64),
        expiresAt: 1234,
      };
      expect(await transport.send(message)).toBeUndefined();
      const files = await readdir(directory);
      expect(files).toHaveLength(1);
      expect(JSON.parse(await readFile(join(directory, files[0]), 'utf8'))).toEqual(message);
      expect((await stat(directory)).mode & 0o777).toBe(0o700);
      expect((await stat(join(directory, files[0]))).mode & 0o777).toBe(0o600);
    } finally {
      await rm(root, { recursive: true });
    }
  });
  it('refuses a production mode instead of silently treating local files as external delivery', () => {
    expect(
      () => new LocalIdentityMail('/tmp/uncreated-arcana-mail', 'production' as 'test'),
    ).toThrow();
  });
});
