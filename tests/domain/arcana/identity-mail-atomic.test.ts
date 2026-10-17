import { describe, expect, it, vi } from 'vitest';
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { LocalIdentityMail } from '../../../src/arcana/infrastructure/identity/mail';
const delivery = vi.hoisted(() => ({ started: () => {}, pause: Promise.resolve() }));
// Inject a retained filesystem write, while keeping actual private files and reads.
vi.mock('node:fs/promises', async (original) => {
  const actual = await original<typeof import('node:fs/promises')>();
  return {
    ...actual,
    writeFile: async (
      file: string,
      data: string,
      options: { encoding: BufferEncoding; mode: number; flag: string },
    ) => {
      await actual.writeFile(file, '', options);
      delivery.started();
      await delivery.pause;
      await actual.writeFile(file, data, { ...options, flag: 'w' });
    },
  };
});
describe('mailbox publication under retained IO', () => {
  it('never exposes an incomplete delivered message to a concurrent mailbox reader', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'arcana-atomic-mail-'));
    let release = () => {};
    delivery.pause = new Promise<void>((resolve) => {
      release = resolve;
    });
    const started = new Promise<void>((resolve) => {
      delivery.started = resolve;
    });
    const message = {
      to: 'fixture@example.invalid',
      purpose: 'verify' as const,
      token: 'a'.repeat(64),
      expiresAt: 123,
    };
    const operation = new LocalIdentityMail(directory, 'test').send(message);
    try {
      await started;
      expect((await readdir(directory)).filter((file) => file.endsWith('.json'))).toHaveLength(0);
      release();
      await operation;
      const delivered = (await readdir(directory)).filter((file) => file.endsWith('.json'));
      expect(delivered).toHaveLength(1);
      expect(JSON.parse(await readFile(join(directory, delivered[0]), 'utf8'))).toEqual(message);
    } finally {
      release();
      await operation.catch(() => undefined);
      await rm(directory, { recursive: true, force: true });
    }
  });
});
