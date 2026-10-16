import { ArcanaError } from '../errors';
import {
  combatInputSnapshot,
  unitSnapshot,
  validateCombatUnit,
  type Combat,
  type CombatUnitResult,
} from './engine';
/** Validate persisted combat data without rerolling or depending on its storage adapter. */
export function combatSnapshot(record: Combat): Combat {
  try {
    const input = combatInputSnapshot(record.input);
    if (
      record.id !== input.id ||
      record.engineVersion !== 1 ||
      !['player', 'rival', 'draw'].includes(record.outcome) ||
      !Number.isSafeInteger(record.rounds) ||
      record.rounds < 1 ||
      record.rounds > input.rules.maxRounds ||
      !Array.isArray(record.events)
    )
      throw Error();
    for (const team of ['player', 'rival'] as const) {
      if (!Array.isArray(record[team]) || record[team].length !== input[team].length) throw Error();
      for (const [i, unit] of record[team].entries()) {
        validateCombatUnit(unit);
        const original = input[team][i];
        if (
          unit.id !== original.id ||
          unit.wizardId !== original.wizardId ||
          unit.maxHp !== original.maxHp ||
          unit.maxMana !== original.maxMana ||
          unit.beanUnitId !== original.beanUnitId ||
          unit.mana > original.mana
        )
          throw Error();
        if (
          unit.effect !== null &&
          (!['mint', 'pepper', 'earth', 'soap'].includes(unit.effect.flavour) ||
            !Number.isSafeInteger(unit.effect.turnsRemaining) ||
            unit.effect.turnsRemaining < 0 ||
            unit.effect.turnsRemaining > 2 ||
            typeof unit.effect.firstSpellPending !== 'boolean')
        )
          throw Error();
      }
    }
    if (
      (record.outcome === 'player' &&
        (record.rival.some((u) => u.hp > 0) || !record.player.some((u) => u.hp > 0))) ||
      (record.outcome === 'rival' &&
        (record.player.some((u) => u.hp > 0) || !record.rival.some((u) => u.hp > 0)))
    )
      throw Error();
    const ids = new Set([...input.player, ...input.rival].map((u) => u.id));
    const kinds = [
      'combat-started',
      'synergy-activated',
      'bean-activated',
      'turn-started',
      'mana-exhausted',
      'healed',
      'burn-tick',
      'spell-cast',
      'combat-finished',
    ];
    let priorRound = 0;
    for (const [sequence, event] of record.events.entries()) {
      if (
        !kinds.includes(event.kind) ||
        event.sequence !== sequence ||
        !Number.isSafeInteger(event.round) ||
        event.round < priorRound ||
        event.round > record.rounds ||
        ('actorId' in event && !ids.has(event.actorId)) ||
        ('targetId' in event && !ids.has(event.targetId)) ||
        Object.values(event).some((v) => typeof v === 'number' && (!Number.isFinite(v) || v < 0))
      )
        throw Error();
      priorRound = event.round;
    }
    const first = record.events[0],
      last = record.events.at(-1);
    if (
      first?.kind !== 'combat-started' ||
      first.seed !== input.seed ||
      first.round !== 0 ||
      last?.kind !== 'combat-finished' ||
      last.outcome !== record.outcome ||
      last.rounds !== record.rounds
    )
      throw Error();
    const result = (unit: CombatUnitResult) =>
      Object.freeze({
        ...unitSnapshot(unit),
        effect: unit.effect === null ? null : Object.freeze({ ...unit.effect }),
      });
    return Object.freeze({
      ...record,
      input,
      player: Object.freeze(record.player.map(result)),
      rival: Object.freeze(record.rival.map(result)),
      events: Object.freeze(record.events.map((e) => Object.freeze({ ...e }))),
    });
  } catch {
    throw new ArcanaError('INVALID_COMBAT');
  }
}
