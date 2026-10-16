import type { BattleEvent } from '../../domain/combat/engine';
type VisualChange = Extract<BattleEvent, { kind: 'spell-cast' | 'healed' | 'burn-tick' }>;
/** Keep label keys stable across bookkeeping events; CSS owns the finite 300ms lifetime. */
export function battleVisualChanges(events: readonly BattleEvent[], cursor: number) {
  const changes = new Map<string, VisualChange>();
  for (const event of events.slice(0, cursor)) {
    if (event.kind === 'spell-cast') changes.set(event.targetId, event);
    else if (event.kind === 'healed' || event.kind === 'burn-tick')
      changes.set(event.actorId, event);
  }
  return changes;
}
