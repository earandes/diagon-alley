import { activeSynergies } from '../../domain/combat/synergies';
import { houseProgress } from '../../domain/combat/houses';
import type {
  Combat,
  CombatUnitInput,
  BattleEvent,
  CombatOutcome,
  CombatSide,
  Affinity,
} from '../../domain/combat/engine';
import type { BeanFlavour } from '../../domain/combat/beans';
import { combatSnapshot } from '../../domain/combat/record';
import { ArcanaClientError } from './errors';
export interface ReplayPassive {
  readonly team: CombatSide;
  readonly affinity: Exclude<Affinity, 'neutral'>;
  readonly tier: number;
  readonly members: number;
  readonly value: number;
}
export interface ReplayUnit extends CombatUnitInput {
  readonly bean: BeanFlavour | null;
  readonly passives: readonly ReplayPassive[];
}
export interface ReplayFrame {
  readonly cursor: number;
  readonly round: number;
  readonly event: BattleEvent | null;
  readonly outcome: CombatOutcome | null;
  readonly player: readonly ReplayUnit[];
  readonly rival: readonly ReplayUnit[];
  readonly synergies: readonly ReplayPassive[];
}
/** Projects recorded snapshots. There is no damage calculation, clock, RNG or engine here. */
export class BattleReplay {
  readonly combat: Combat;
  constructor(record: Combat) {
    try {
      this.combat = combatSnapshot(record);
      const final = this.frame(this.combat.events.length);
      for (const side of ['player', 'rival'] as const)
        for (const [i, unit] of final[side].entries())
          if (unit.hp !== this.combat[side][i].hp || unit.mana !== this.combat[side][i].mana)
            throw Error();
    } catch {
      throw new ArcanaClientError('INVALID_REPLAY', 0);
    }
  }
  frame(cursor: number): ReplayFrame {
    if (!Number.isSafeInteger(cursor) || cursor < 0 || cursor > this.combat.events.length)
      throw new ArcanaClientError('INVALID_REPLAY', 0);
    try {
      const player = this.combat.input.player.map((u) => ({
          ...u,
          bean: null as BeanFlavour | null,
        })),
        rival = this.combat.input.rival.map((u) => ({ ...u, bean: null as BeanFlavour | null })),
        all = [...player, ...rival],
        synergies: ReplayFrame['synergies'][number][] = [];
      const actor = (id: string) => {
        const u = all.find((u) => u.id === id);
        if (!u) throw Error();
        return u;
      };
      const hp = (id: string, value: number) => {
        const u = actor(id);
        if (!Number.isFinite(value) || value < 0 || value > u.maxHp) throw Error();
        u.hp = value;
      };
      const mana = (id: string, value: number) => {
        const u = actor(id);
        if (!Number.isFinite(value) || value < 0 || value > u.maxMana) throw Error();
        u.mana = value;
      };
      let outcome: CombatOutcome | null = null;
      for (const event of this.combat.events.slice(0, cursor)) {
        switch (event.kind) {
          case 'house-activated': {
            if (
              !this.combat.input.rules.houseSynergies ||
              !['player', 'rival'].includes(event.team)
            )
              throw Error();
            const group = houseProgress(this.combat.input[event.team]).find(
              (h) => h.house === event.house,
            );
            if (
              !group?.tier ||
              group.tier !== event.tier ||
              group.count !== event.members ||
              group.value !== event.value ||
              JSON.stringify(group.contributorIds) !== JSON.stringify(event.contributorIds) ||
              this.combat.events
                .slice(0, event.sequence)
                .some(
                  (e) =>
                    e.kind === 'house-activated' &&
                    e.team === event.team &&
                    e.house === event.house,
                )
            )
              throw Error();
            break;
          }
          case 'bean-activated':
            hp(event.actorId, event.hp);
            if (
              actor(event.actorId).beanUnitId !== event.unitId ||
              !['mint', 'pepper', 'earth', 'soap'].includes(event.flavour)
            )
              throw Error();
            actor(event.actorId).bean = event.flavour;
            break;
          case 'healed':
          case 'burn-tick':
            hp(event.actorId, event.hp);
            break;
          case 'mana-exhausted':
            mana(event.actorId, event.mana);
            break;
          case 'spell-cast':
            if (
              typeof event.missed !== 'boolean' ||
              !Number.isFinite(event.damage) ||
              event.damage < 0
            )
              throw Error();
            mana(event.actorId, event.mana);
            hp(event.targetId, event.targetHp);
            break;
          case 'synergy-activated':
            if (
              !['player', 'rival'].includes(event.team) ||
              !['alchemy', 'fire', 'shadows', 'neutral'].includes(event.affinity) ||
              !Number.isSafeInteger(event.members) ||
              event.members < 1 ||
              event.members > 5
            )
              throw Error();
            {
              const recorded = activeSynergies(this.combat.input[event.team]).find(
                (s) => s.affinity === event.affinity,
              );
              if (
                !recorded ||
                recorded.members !== event.members ||
                synergies.some((s) => s.team === event.team && s.affinity === event.affinity)
              )
                throw Error();
              const values = {
                alchemy: this.combat.input.rules.alchemyHealing,
                fire: this.combat.input.rules.fireBurnDamage,
                shadows: this.combat.input.rules.shadowInitiative,
              };
              synergies.push(
                Object.freeze({
                  team: event.team,
                  affinity: recorded.affinity,
                  members: event.members,
                  tier: recorded.threshold,
                  value: values[recorded.affinity],
                }),
              );
            }
            break;
          case 'combat-finished':
            outcome = event.outcome;
            break;
        }
      }
      const event = cursor ? this.combat.events[cursor - 1] : null;
      return Object.freeze({
        cursor,
        round: event?.round ?? 0,
        event,
        outcome,
        player: Object.freeze(
          player.map((u) =>
            Object.freeze({
              ...u,
              passives: Object.freeze(synergies.filter((s) => s.team === 'player')),
            }),
          ),
        ),
        rival: Object.freeze(
          rival.map((u) =>
            Object.freeze({
              ...u,
              passives: Object.freeze(synergies.filter((s) => s.team === 'rival')),
            }),
          ),
        ),
        synergies: Object.freeze(synergies),
      });
    } catch {
      throw new ArcanaClientError('INVALID_REPLAY', 0);
    }
  }
}
