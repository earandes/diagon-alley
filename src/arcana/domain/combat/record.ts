import { ArcanaError } from '../errors';
import { bondProgress, BOND_GROUPS } from './bonds';
import {
  combatInputSnapshot,
  unitSnapshot,
  validateCombatUnit,
  type Combat,
  type BattleEvent,
  type CombatUnitResult,
} from './engine';
/** Validate persisted combat data without rerolling or depending on its storage adapter. */
export function combatSnapshot(record: Combat): Combat {
  try {
    const input = combatInputSnapshot(record.input);
    if (
      record.id !== input.id ||
      record.engineVersion !== (input.rules.bonds ? 3 : input.rules.houseSynergies ? 2 : 1) ||
      (input.rules.bonds && !record.input.bondFocus) ||
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
      'house-activated',
      'bond-activated',
      'bean-activated',
      'turn-started',
      'mana-exhausted',
      'healed',
      'burn-tick',
      'spell-cast',
      'combat-finished',
    ];
    let priorRound = 0;
    const activated = new Set<string>(),
      guarded = new Set<string>();
    const groupFor = (id: string, group: (typeof BOND_GROUPS)[number]) => {
      const side = input.player.some((u) => u.id === id) ? 'player' : 'rival';
      return input.rules.bonds && input.bondFocus?.[side] === group
        ? bondProgress(input[side], input.rules.bonds, group)
        : null;
    };
    for (const [sequence, event] of (record.events as readonly BattleEvent[]).entries()) {
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
      if (event.kind === 'bond-activated') {
        if (
          !input.rules.bonds ||
          !['player', 'rival'].includes(event.team) ||
          !BOND_GROUPS.includes(event.group) ||
          input.bondFocus?.[event.team] !== event.group ||
          event.round !== 0
        )
          throw Error();
        const group = bondProgress(input[event.team], input.rules.bonds, event.group);
        if (
          !group.tier ||
          event.tier !== group.tier ||
          event.value !== group.value ||
          event.members !== group.count ||
          JSON.stringify(event.contributorIds) !== JSON.stringify(group.contributorIds) ||
          activated.has(event.team)
        )
          throw Error();
        activated.add(event.team);
      }
      if (event.kind === 'healed') {
        if (!['alchemy', 'equipment', 'house', 'order'].includes(event.source)) throw Error();
        if (event.source === 'order') {
          const group = event.healerId ? groupFor(event.healerId, 'order') : null;
          const side = input.player.some((u) => u.id === event.actorId) ? 'player' : 'rival';
          if (
            !group?.tier ||
            !group.contributorIds.includes(event.healerId!) ||
            event.healerId === event.actorId ||
            !input[side].some((u) => u.id === event.healerId) ||
            event.amount <= 0 ||
            event.amount > group.value
          )
            throw Error();
        } else if (event.healerId !== undefined) throw Error();
      }
      if (event.kind === 'spell-cast') {
        if (event.guarded !== undefined) {
          const group = groupFor(event.targetId, 'creatures');
          if (
            !group?.tier ||
            event.missed ||
            !Number.isFinite(event.guarded) ||
            event.guarded <= 0 ||
            event.guarded > group.value ||
            (event.guarded < group.value && event.damage > 0) ||
            guarded.has(event.targetId)
          )
            throw Error();
          guarded.add(event.targetId);
        }
        if (event.bondBoost !== undefined) {
          const group = groupFor(event.actorId, 'death');
          if (
            !group?.tier ||
            !group.contributorIds.includes(event.actorId) ||
            event.missed ||
            event.bondBoost !== group.value
          )
            throw Error();
        }
      }
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
      events: Object.freeze(
        record.events.map((e) =>
          Object.freeze({
            ...e,
            ...(e.kind === 'house-activated' || e.kind === 'bond-activated'
              ? { contributorIds: Object.freeze([...e.contributorIds]) }
              : {}),
          }),
        ),
      ),
    });
  } catch {
    throw new ArcanaError('INVALID_COMBAT');
  }
}
