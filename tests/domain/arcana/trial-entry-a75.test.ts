import { describe, expect, it, vi } from 'vitest';
import { TrialEntryGate } from '../../../src/arcana/presentation/trial-entry';
import { ArcanaClientError } from '../../../src/arcana/application/client/errors';

describe('A75 explicit trial entry', () => {
  it('locks synchronously while entry and authority loading are in progress', async () => {
    const gate = new TrialEntryGate();
    let finish!: () => void;
    const entry = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    const first = gate.enter(entry, true);
    expect(gate.getSnapshot().pending).toBe(true);
    await gate.enter(entry, true);
    await gate.enter(entry, true);
    expect(entry).toHaveBeenCalledTimes(1);
    finish();
    await first;
    expect(gate.getSnapshot()).toEqual({ pending: false, error: null });
  });
  it('allows another deliberate attempt after failure, never an automatic retry', async () => {
    const gate = new TrialEntryGate();
    const entry = vi
      .fn()
      .mockRejectedValueOnce(new ArcanaClientError('RATE_LIMITED', 429))
      .mockResolvedValueOnce(undefined);
    await gate.enter(entry, true);
    expect(gate.getSnapshot()).toEqual({ pending: false, error: 'RATE_LIMITED' });
    expect(entry).toHaveBeenCalledTimes(1);
    await gate.enter(entry, true);
    expect(gate.getSnapshot()).toEqual({ pending: false, error: null });
    expect(entry).toHaveBeenCalledTimes(2);
  });
  it('does not begin another session when an unresolved operation forbids entry', async () => {
    const gate = new TrialEntryGate();
    const entry = vi.fn();
    await gate.enter(entry, false);
    expect(entry).not.toHaveBeenCalled();
    expect(gate.getSnapshot()).toEqual({ pending: false, error: null });
  });
});
