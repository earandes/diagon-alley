import { useState, useSyncExternalStore } from 'react';
import { TrialEntryGate } from './trial-entry';

export function useTrialEntry(start: () => Promise<void>, canEnter: boolean) {
  const [gate] = useState(() => new TrialEntryGate());
  const snapshot = useSyncExternalStore(gate.subscribe, gate.getSnapshot, gate.getSnapshot);
  return { ...snapshot, enter: () => gate.enter(start, canEnter) };
}
