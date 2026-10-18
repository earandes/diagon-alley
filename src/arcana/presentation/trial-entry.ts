import { ArcanaClientError } from '../application/client/errors';

interface EntrySnapshot {
  readonly pending: boolean;
  readonly error: string | null;
}
/** One explicit entry owns both the POST and the following authority load. */
export class TrialEntryGate {
  private snapshot: EntrySnapshot = { pending: false, error: null };
  private listeners = new Set<() => void>();
  getSnapshot = () => this.snapshot;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  private update(snapshot: EntrySnapshot) {
    this.snapshot = snapshot;
    for (const listener of this.listeners) listener();
  }
  enter = async (start: () => Promise<void>, allowed: boolean): Promise<void> => {
    if (!allowed || this.snapshot.pending) return;
    this.update({ pending: true, error: null });
    try {
      await start();
      this.update({ pending: false, error: null });
    } catch (error) {
      this.update({
        pending: false,
        error: error instanceof ArcanaClientError ? error.code : 'NETWORK_ERROR',
      });
    }
  };
}
