import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import { ArcanaClientError } from '../../application/client/errors';
import {
  pendingSnapshot,
  type ClientOperations,
  type PendingOperation,
} from '../../application/client/ports';
import { validDomainId } from '../../domain/identifiers';

interface Row {
  readonly schemaVersion: 1;
  readonly playerId: string;
  readonly pending: PendingOperation | null;
  readonly finished: { readonly key: string; readonly outcome: 'confirmed' | 'rejected' } | null;
}
interface MetadataDatabase extends DBSchema {
  operations: { key: string; value: Row };
}
function rowSnapshot(value: unknown, playerId: string): Row {
  const row = value as Row;
  if (
    !row ||
    typeof row !== 'object' ||
    Object.keys(row).sort().join(',') !== 'finished,pending,playerId,schemaVersion' ||
    row.schemaVersion !== 1 ||
    row.playerId !== playerId
  )
    throw new ArcanaClientError('INVALID_PENDING', 0);
  const pending = row.pending === null ? null : pendingSnapshot(row.pending);
  if (pending && pending.playerId !== playerId) throw new ArcanaClientError('INVALID_PENDING', 0);
  const finished = row.finished;
  if (
    finished !== null &&
    (!finished ||
      typeof finished !== 'object' ||
      Object.keys(finished).sort().join(',') !== 'key,outcome' ||
      !validDomainId(finished.key) ||
      finished.key.length > 100 ||
      !['confirmed', 'rejected'].includes(finished.outcome))
  )
    throw new ArcanaClientError('INVALID_PENDING', 0);
  return Object.freeze({
    schemaVersion: 1,
    playerId,
    pending,
    finished: finished ? Object.freeze({ key: finished.key, outcome: finished.outcome }) : null,
  });
}
function owner(playerId: string): void {
  if (!validDomainId(playerId)) throw new ArcanaClientError('INVALID_PENDING', 0);
}
const emptyRow = (playerId: string): Row => ({
  schemaVersion: 1,
  playerId,
  pending: null,
  finished: null,
});

/** Stores transport intent only. Account inventory and receipts are fetched from the server. */
export class IndexedDbClientOperations implements ClientOperations {
  private database: Promise<IDBPDatabase<MetadataDatabase>> | null = null;
  constructor(private readonly name = 'arcana-client-operations-v1') {
    if (!/^arcana-[a-zA-Z0-9-]{1,100}$/.test(name))
      throw new ArcanaClientError('CLIENT_STORAGE', 0);
  }
  private open(): Promise<IDBPDatabase<MetadataDatabase>> {
    this.database ??= openDB<MetadataDatabase>(this.name, 1, {
      upgrade(db) {
        db.createObjectStore('operations', { keyPath: 'playerId' });
      },
      blocking: () => {
        void this.close();
      },
    });
    return this.database;
  }
  async read(playerId: string): Promise<PendingOperation | null> {
    owner(playerId);
    try {
      const db = await this.open(),
        tx = db.transaction('operations', 'readonly');
      const stored = await tx.store.get(playerId);
      await tx.done;
      return stored ? rowSnapshot(stored, playerId).pending : null;
    } catch (error) {
      throw this.storageError(error);
    }
  }
  async claim(value: PendingOperation): Promise<void> {
    const operation = pendingSnapshot(value);
    await this.change(operation.playerId, (row) => {
      if (row.pending) {
        if (JSON.stringify(row.pending) === JSON.stringify(operation)) return row;
        throw new ArcanaClientError('OPERATION_PENDING', 409);
      }
      if (row.finished?.key === operation.command.key)
        throw new ArcanaClientError('OPERATION_FINISHED', 409);
      return { ...row, pending: operation };
    });
  }
  async finish(playerId: string, key: string, outcome: 'confirmed' | 'rejected'): Promise<void> {
    owner(playerId);
    if (!validDomainId(key) || key.length > 100 || !['confirmed', 'rejected'].includes(outcome))
      throw new ArcanaClientError('INVALID_PENDING', 0);
    await this.change(playerId, (row) => {
      if (row.pending?.command.key !== key) {
        if (!row.pending && row.finished?.key === key && row.finished.outcome === outcome)
          return row;
        throw new ArcanaClientError('OPERATION_PENDING', 409);
      }
      return { ...row, pending: null, finished: { key, outcome } };
    });
  }
  private async change(playerId: string, update: (row: Row) => Row): Promise<void> {
    try {
      const db = await this.open(),
        tx = db.transaction('operations', 'readwrite');
      try {
        const stored = await tx.store.get(playerId);
        const next = update(stored ? rowSnapshot(stored, playerId) : emptyRow(playerId));
        await tx.store.put(next);
        await tx.done;
      } catch (error) {
        try {
          tx.abort();
        } catch {
          /* A transaction already completed or aborted cannot be aborted again. */
        }
        await tx.done.catch(() => undefined);
        throw error;
      }
    } catch (error) {
      throw this.storageError(error);
    }
  }
  private storageError(error: unknown): ArcanaClientError {
    return error instanceof ArcanaClientError ? error : new ArcanaClientError('CLIENT_STORAGE', 0);
  }
  async close(): Promise<void> {
    const database = this.database;
    this.database = null;
    if (database) (await database).close();
  }
}
