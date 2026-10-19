import { expect, it } from 'vitest';
import {
  CombatEngine,
  type CombatInput,
  type CombatUnitInput,
} from '../../../src/arcana/domain/combat/engine';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
import { BattleReplay } from '../../../src/arcana/application/client/battle-replay';
import { combatSnapshot } from '../../../src/arcana/domain/combat/record';
import type { BondFocus } from '../../../src/arcana/domain/combat/bonds';
const engine = new CombatEngine({ fromSeed: (seed) => new SeededRandom(seed) });
const unit = (id: string): CombatUnitInput => ({
  id,
  wizardId: id,
  level: 1,
  affinity: 'neutral',
  hp: 100,
  maxHp: 100,
  mana: 40,
  maxMana: 40,
  power: 10,
  speed: id.startsWith('p') ? 10 : 1,
  wandPowerBonus: 0,
  wandMultiplier: 1,
  broomInitiative: 0,
});
const input = (focus: BondFocus): CombatInput => ({
  id: 'bond-fight',
  seed: 42,
  player: ['p0', 'p1', 'p2'].map(unit),
  rival: ['r0', 'r1', 'r2'].map(unit),
  bondFocus: { player: focus, rival: 'houses' },
  rules: {
    version: 3,
    houseSynergies: 1,
    maxRounds: 2,
    spellManaCost: 1,
    fireBurnDamage: 2,
    alchemyHealing: 3,
    shadowInitiative: 2,
    beans: { version: 1, entries: [{ flavour: 'mint', weight: 1 }] },
    bonds: {
      version: 1,
      orderHealing: [1, 2],
      deathDamage: [1, 2],
      creatureGuard: [2, 3],
      members: {
        order: ['p0', 'p1', 'p2'],
        death: ['p0', 'p1', 'p2'],
        creatures: ['p0', 'p1', 'p2'],
      },
    },
  },
});
it('Order helps another wounded ally once per round, recording healer separately from recipient', () => {
  const i = input('order');
  const fight = engine.resolve({
    ...i,
    player: i.player.map((u, n) => ({ ...u, hp: [60, 30, 80][n] })),
  });
  const heals = fight.events.flatMap((e) =>
    e.kind === 'healed' && e.source === 'order' ? [e] : [],
  );
  expect(fight.engineVersion).toBe(3);
  expect(heals[0]).toMatchObject({ actorId: 'p1', healerId: 'p0', amount: 1, hp: 31 });
  expect(new Set(heals.map((e) => e.round)).size).toBe(heals.length);
  for (const h of heals) expect(h.healerId).not.toBe(h.actorId);
});
it('Death applies only to a target already at half HP before the hit and replaces house effects', () => {
  for (const [hp, damage] of [
    [51, 10],
    [50, 11],
  ]) {
    const i = input('death');
    const fight = engine.resolve({
      ...i,
      player: i.player.map((u) => ({ ...u, house: 'gryffindor' })),
      rival: i.rival.map((u, n) => ({ ...u, hp: n ? 100 : hp })),
    });
    expect(fight.events.find((e) => e.kind === 'spell-cast')).toMatchObject({ damage });
    expect(fight.events.some((e) => e.kind === 'house-activated')).toBe(false);
  }
});
it('Creature guard protects a non-contributor, ignores zero damage and spends only one positive impact', () => {
  const i = input('creatures');
  const fight = engine.resolve({
    ...i,
    player: [unit('front'), ...i.player].map((u) => ({ ...u, speed: 0 })),
    rival: i.rival.map((u, n) => ({ ...u, speed: 20, power: n ? 10 : 0 })),
  });
  const hits = fight.events.flatMap((e) =>
    e.kind === 'spell-cast' && e.targetId === 'front' ? [e] : [],
  );
  expect(hits[0]).toMatchObject({ damage: 0 });
  expect(hits[1]).toMatchObject({ damage: 8, guarded: 2 });
  expect(hits[2]).toMatchObject({ damage: 10 });
  expect(hits.filter((e) => e.guarded)).toHaveLength(1);
});
it('saved bonds replay exact final HP/PM without applying bonuses or guard a second time', () => {
  for (const focus of ['order', 'death', 'creatures'] as const) {
    const fight = engine.resolve(input(focus));
    expect(combatSnapshot(fight)).toEqual(fight);
    const replay = new BattleReplay(fight).frame(fight.events.length);
    for (const u of [...fight.player, ...fight.rival])
      expect([...replay.player, ...replay.rival].find((x) => x.id === u.id)).toMatchObject({
        hp: u.hp,
        mana: u.mana,
      });
  }
});
it('rejects a help animation attributed to a contributor who was not taking that turn', () => {
  const i = input('order');
  const fight = engine.resolve({
    ...i,
    player: i.player.map((u, n) => ({ ...u, hp: [60, 30, 80][n] })),
  });
  const tampered = {
    ...fight,
    events: fight.events.map((e) =>
      e.kind === 'healed' && e.source === 'order' ? { ...e, healerId: 'p2' } : e,
    ),
  };
  expect(() => new BattleReplay(tampered)).toThrow();
});
it('accepts a partially blocked fractional hit allowed by the existing equipment/HP contracts', () => {
  const i = input('creatures');
  const fight = engine.resolve({
    ...i,
    player: i.player.map((u) => ({ ...u, speed: 0 })),
    rival: i.rival.map((u) => ({ ...u, speed: 20, power: 0.5 })),
  });
  expect(fight.events.find((e) => e.kind === 'spell-cast')).toMatchObject({
    damage: 0,
    guarded: 0.5,
  });
  expect(() => new BattleReplay(fight)).not.toThrow();
});
