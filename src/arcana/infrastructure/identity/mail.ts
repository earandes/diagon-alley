import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';

export interface IdentityMail {
  readonly to: string;
  readonly purpose: 'verify' | 'reset';
  readonly token: string;
  readonly expiresAt: number;
}
export interface IdentityMailTransport {
  send(message: IdentityMail): Promise<void>;
}
/** Local mailbox transport. Never expose this directory via a web server or commit its files. */
export class LocalIdentityMail implements IdentityMailTransport {
  readonly directory: string;
  constructor(directory: string, mode: 'development' | 'test') {
    if (!['development', 'test'].includes(mode) || !directory)
      throw Error('Local mailbox requires an explicit development/test environment');
    this.directory = resolve(directory);
  }
  async send(message: IdentityMail): Promise<void> {
    await mkdir(this.directory, { recursive: true, mode: 0o700 });
    await writeFile(resolve(this.directory, `${randomUUID()}.json`), JSON.stringify(message), {
      encoding: 'utf8',
      mode: 0o600,
      flag: 'wx',
    });
  }
}
