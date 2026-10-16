import { ArcanaError } from '../errors';
import { validDomainId } from '../identifiers';
import {
  activateBean,
  drawBean,
  finishTurn,
  initiativeWithBean,
  spellWithBean,
  validateBeanTable,
  type BeanEffect,
  type BeanFlavour,
  type BeanTable,
} from './beans';
import { createManaPoints, spendMana } from './mana';
import type { CombatRandomFactory } from './random';
import { createSeed } from './seed';
import { equipmentSpellPower, equipmentInitiative } from './equipment-effects';

import { activeSynergies, type Affinity } from './synergies';
export type { Affinity } from './synergies';
export type CombatSide = 'player' | 'rival';
export type CombatOutcome = CombatSide | 'draw';
export interface CombatUnitInput {
  readonly id: string;
  readonly wizardId: string;
  readonly level: number;
  readonly affinity: Affinity;
  readonly hp: number;
  readonly maxHp: number;
  readonly mana: number;
  readonly maxMana: number;
  readonly power: number;
  readonly speed: number;
  readonly wandPowerBonus: number;
  readonly wandMultiplier: number;
  readonly broomInitiative: number;
  readonly beanUnitId?: string;
}
export interface CombatRules {
  readonly version: number;
  readonly maxRounds: number;
  readonly spellManaCost: number;
  readonly fireBurnDamage: number;
  readonly alchemyHealing: number;
  readonly shadowInitiative: number;
  readonly beans: BeanTable;
}
export interface CombatInput {
  readonly id: string;
  readonly seed: number;
  readonly player: readonly CombatUnitInput[];
  readonly rival: readonly CombatUnitInput[];
  readonly rules: CombatRules;
}
export type BattleEventData =
  | { readonly kind: 'combat-started'; readonly seed: number }
  | {
      readonly kind: 'synergy-activated';
      readonly team: CombatSide;
      readonly affinity: Affinity;
      readonly members: number;
    }
  | {
      readonly kind: 'bean-activated';
      readonly actorId: string;
      readonly unitId: string;
      readonly flavour: BeanFlavour;
      readonly hp: number;
    }
  | {
      readonly kind: 'turn-started';
      readonly actorId: string;
      readonly team: CombatSide;
      readonly initiative: number;
    }
  | { readonly kind: 'mana-exhausted'; readonly actorId: string; readonly mana: number }
  | {
      readonly kind: 'healed';
      readonly actorId: string;
      readonly source: 'alchemy';
      readonly amount: number;
      readonly hp: number;
    }
  | {
      readonly kind: 'burn-tick';
      readonly actorId: string;
      readonly damage: number;
      readonly hp: number;
    }
  | {
      readonly kind: 'spell-cast';
      readonly actorId: string;
      readonly targetId: string;
      readonly damage: number;
      readonly missed: boolean;
      readonly mana: number;
      readonly targetHp: number;
    }
  | { readonly kind: 'combat-finished'; readonly outcome: CombatOutcome; readonly rounds: number };
export type BattleEvent = BattleEventData & { readonly sequence: number; readonly round: number };
export type CombatUnitResult = CombatUnitInput & { readonly effect: BeanEffect | null };
export interface Combat {
  readonly id: string;
  readonly engineVersion: 1;
  readonly input: CombatInput;
  readonly outcome: CombatOutcome;
  readonly rounds: number;
  readonly player: readonly CombatUnitResult[];
  readonly rival: readonly CombatUnitResult[];
  readonly events: readonly BattleEvent[];
}
type Fighter = { -readonly [K in keyof CombatUnitInput]: CombatUnitInput[K] } & {
  effect: BeanEffect | null;
  burning: number;
  team: CombatSide;
};
interface Passives {
  fire: number;
  alchemy: number;
  shadows: number;
}
const finiteNonnegative = (number: number) => Number.isFinite(number) && number >= 0;

export function validateCombatUnit(unit: CombatUnitInput, shadowInitiative = 0): void {
  if (
    !unit ||
    !validDomainId(unit.id) ||
    !validDomainId(unit.wizardId) ||
    !Number.isSafeInteger(unit.level) ||
    unit.level < 1 ||
    !['neutral', 'alchemy', 'fire', 'shadows'].includes(unit.affinity) ||
    ![unit.hp, unit.maxHp, unit.power, unit.speed, unit.wandPowerBonus, unit.broomInitiative].every(
      finiteNonnegative,
    ) ||
    unit.maxHp <= 0 ||
    unit.hp > unit.maxHp ||
    !Number.isFinite(unit.wandMultiplier) ||
    unit.wandMultiplier <= 0 ||
    !Number.isFinite(equipmentSpellPower(unit) * 1.3) ||
    !Number.isFinite(equipmentInitiative(unit, shadowInitiative)) ||
    (unit.beanUnitId !== undefined && !validDomainId(unit.beanUnitId))
  )
    throw new ArcanaError('INVALID_COMBAT');
  createManaPoints(unit.mana, unit.maxMana);
}

export function validateCombatRules(rules: CombatRules): void {
  if (
    !rules ||
    !Number.isSafeInteger(rules.version) ||
    rules.version < 1 ||
    !Number.isSafeInteger(rules.maxRounds) ||
    rules.maxRounds < 1 ||
    rules.maxRounds > 1000 ||
    !Number.isFinite(rules.spellManaCost) ||
    rules.spellManaCost <= 0 ||
    ![rules.fireBurnDamage, rules.alchemyHealing, rules.shadowInitiative].every(finiteNonnegative)
  )
    throw new ArcanaError('INVALID_COMBAT');
  validateBeanTable(rules.beans);
}

export function validateCombatInput(value: unknown): asserts value is CombatInput {
  try {
    const input = value as CombatInput;
    if (!input || !validDomainId(input.id)) throw Error();
    createSeed(input.seed);
    const rules = input.rules;
    validateCombatRules(rules);
    const ids = new Set<string>(),
      beans = new Set<string>();
    for (const team of [input.player, input.rival]) {
      if (
        !Array.isArray(team) ||
        team.length < 3 ||
        team.length > 5 ||
        !team.some((unit) => unit.hp > 0)
      )
        throw Error();
      for (const unit of team) {
        validateCombatUnit(unit, rules.shadowInitiative);
        if (ids.has(unit.id)) throw Error();
        if (unit.beanUnitId !== undefined) {
          if (!validDomainId(unit.beanUnitId) || beans.has(unit.beanUnitId)) throw Error();
          beans.add(unit.beanUnitId);
        }
        ids.add(unit.id);
      }
    }
  } catch {
    throw new ArcanaError('INVALID_COMBAT');
  }
}

export function unitSnapshot(unit: CombatUnitInput): CombatUnitInput {
  return Object.freeze({
    id: unit.id,
    wizardId: unit.wizardId,
    level: unit.level,
    affinity: unit.affinity,
    hp: unit.hp,
    maxHp: unit.maxHp,
    mana: unit.mana,
    maxMana: unit.maxMana,
    power: unit.power,
    speed: unit.speed,
    wandPowerBonus: unit.wandPowerBonus,
    wandMultiplier: unit.wandMultiplier,
    broomInitiative: unit.broomInitiative,
    ...(unit.beanUnitId === undefined ? {} : { beanUnitId: unit.beanUnitId }),
  });
}
export function combatInputSnapshot(input: CombatInput): CombatInput {
  validateCombatInput(input);
  return Object.freeze({
    id: input.id,
    seed: input.seed,
    player: Object.freeze(input.player.map(unitSnapshot)),
    rival: Object.freeze(input.rival.map(unitSnapshot)),
    rules: Object.freeze({
      version: input.rules.version,
      maxRounds: input.rules.maxRounds,
      spellManaCost: input.rules.spellManaCost,
      fireBurnDamage: input.rules.fireBurnDamage,
      alchemyHealing: input.rules.alchemyHealing,
      shadowInitiative: input.rules.shadowInitiative,
      beans: Object.freeze({
        version: input.rules.beans.version,
        entries: Object.freeze(
          input.rules.beans.entries.map((entry) => Object.freeze({ ...entry })),
        ),
      }),
    }),
  });
}

export class CombatEngine {
  constructor(private readonly random: CombatRandomFactory) {}

  resolve(input: CombatInput): Combat {
    const snapshot = combatInputSnapshot(input);
    const random = this.random.fromSeed(snapshot.seed);
    const player = snapshot.player.map(
      (unit): Fighter => ({ ...unit, effect: null, burning: 0, team: 'player' }),
    );
    const rival = snapshot.rival.map(
      (unit): Fighter => ({ ...unit, effect: null, burning: 0, team: 'rival' }),
    );
    const fighters = [...player, ...rival],
      rules = snapshot.rules;
    const events: BattleEvent[] = [];
    const emit = (round: number, data: BattleEventData) =>
      events.push(Object.freeze({ ...data, round, sequence: events.length }));
    emit(0, { kind: 'combat-started', seed: snapshot.seed });
    const passives = (team: CombatSide, units: Fighter[]): Passives => {
      const synergies = activeSynergies(units);
      for (const { affinity, members } of synergies)
        emit(0, { kind: 'synergy-activated', team, affinity, members });
      const active = (affinity: Affinity) => synergies.some((s) => s.affinity === affinity);
      return {
        fire: active('fire') ? rules.fireBurnDamage : 0,
        alchemy: active('alchemy') ? rules.alchemyHealing : 0,
        shadows: active('shadows') ? rules.shadowInitiative : 0,
      };
    };
    const bonuses = { player: passives('player', player), rival: passives('rival', rival) };
    for (const fighter of fighters)
      if (fighter.hp > 0 && fighter.beanUnitId) {
        const flavour = drawBean(rules.beans, random),
          active = activateBean(fighter, flavour);
        fighter.hp = active.hp;
        fighter.effect = active.effect;
        emit(0, {
          kind: 'bean-activated',
          actorId: fighter.id,
          unitId: fighter.beanUnitId,
          flavour,
          hp: fighter.hp,
        });
      }
    const outcome = (): CombatOutcome | null => {
      const playerAlive = player.some((unit) => unit.hp > 0),
        rivalAlive = rival.some((unit) => unit.hp > 0);
      return !playerAlive && !rivalAlive
        ? 'draw'
        : !playerAlive
          ? 'rival'
          : !rivalAlive
            ? 'player'
            : null;
    };
    const initiative = (fighter: Fighter) =>
      initiativeWithBean(
        fighter,
        equipmentInitiative(fighter, bonuses[fighter.team].shadows),
      );
    let rounds = 0;
    for (let round = 1; round <= rules.maxRounds && outcome() === null; round++) {
      rounds = round;
      const order = fighters
        .filter((fighter) => fighter.hp > 0)
        .sort((a, b) => initiative(b) - initiative(a) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
      for (const actor of order) {
        if (outcome() !== null) break;
        if (actor.hp <= 0) continue;
        if (actor.burning > 0) {
          const damage = Math.min(actor.hp, actor.burning);
          actor.hp -= damage;
          emit(round, { kind: 'burn-tick', actorId: actor.id, damage, hp: actor.hp });
          if (actor.hp <= 0) continue;
        }
        emit(round, {
          kind: 'turn-started',
          actorId: actor.id,
          team: actor.team,
          initiative: initiative(actor),
        });
        const healing = Math.min(actor.maxHp - actor.hp, bonuses[actor.team].alchemy);
        if (healing > 0) {
          actor.hp += healing;
          emit(round, {
            kind: 'healed',
            actorId: actor.id,
            source: 'alchemy',
            amount: healing,
            hp: actor.hp,
          });
        }
        if (actor.mana < rules.spellManaCost)
          emit(round, { kind: 'mana-exhausted', actorId: actor.id, mana: actor.mana });
        else {
          const target = (actor.team === 'player' ? rival : player).find((unit) => unit.hp > 0)!;
          actor.mana = spendMana(
            createManaPoints(actor.mana, actor.maxMana),
            rules.spellManaCost,
          ).current;
          const spell = spellWithBean(
            actor,
            equipmentSpellPower(actor),
          );
          actor.effect = spell.carrier.effect;
          const damage = Math.min(target.hp, spell.damage);
          target.hp -= damage;
          if (!spell.missed && bonuses[actor.team].fire > 0)
            target.burning = bonuses[actor.team].fire;
          emit(round, {
            kind: 'spell-cast',
            actorId: actor.id,
            targetId: target.id,
            damage,
            missed: spell.missed,
            mana: actor.mana,
            targetHp: target.hp,
          });
        }
        actor.effect = finishTurn(actor).effect;
      }
    }
    const result = outcome() ?? 'draw';
    emit(rounds, { kind: 'combat-finished', outcome: result, rounds });
    const resultUnit = (unit: Fighter): CombatUnitResult =>
      Object.freeze({
        ...unitSnapshot(unit),
        effect: unit.effect && Object.freeze({ ...unit.effect }),
      });
    return Object.freeze({
      id: snapshot.id,
      engineVersion: 1,
      input: snapshot,
      outcome: result,
      rounds,
      player: Object.freeze(player.map(resultUnit)),
      rival: Object.freeze(rival.map(resultUnit)),
      events: Object.freeze(events),
    });
  }
}
