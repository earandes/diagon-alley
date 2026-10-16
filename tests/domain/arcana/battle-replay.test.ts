import { describe, it, expect, vi } from 'vitest';
import { BattleReplay } from '../../../src/arcana/application/client/battle-replay';
import { CombatEngine } from '../../../src/arcana/domain/combat/engine';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
const battle = () => {
  const { campaign } = trialConfiguration();
  const pact = campaign.nodes.find((n) => n.kind === 'pact');
  if (pact?.kind !== 'pact') throw Error();
  const player = [0, 1, 2].map((i) => ({
    ...pact.recruit,
    id: `p${i}`,
    hp: 50,
    beanUnitId: `bean${i}`,
    affinity: 'alchemy' as const,
  }));
  const rival = player.map((u, i) => ({
    ...u,
    id: `r${i}`,
    beanUnitId: undefined,
    affinity: 'fire' as const,
  }));
  return new CombatEngine({ fromSeed: (seed) => new SeededRandom(seed) }).resolve({
    id: 'battle',
    seed: 42,
    player,
    rival,
    rules: campaign.combatRules,
  });
};
describe('confirmed battle log presentation', () => {
  it('starts at input HP/PM and no outcome rather than leaking final state', () => {
    const record = battle(),
      replay = new BattleReplay(record),
      frame = replay.frame(0);
    expect(frame.player.map((u) => u.hp)).toEqual(record.input.player.map((u) => u.hp));
    expect(frame.outcome).toBe(null);
    expect(frame.event).toBe(null);
  });
  it('copies HP/PM/bean and synergy values directly from consumed chronological events', () => {
    const record = battle(),
      replay = new BattleReplay(record);
    for (const event of record.events) {
      const frame = replay.frame(event.sequence + 1),
        all = [...frame.player, ...frame.rival];
      if (event.kind === 'spell-cast') {
        expect(all.find((u) => u.id === event.actorId)?.mana).toBe(event.mana);
        expect(all.find((u) => u.id === event.targetId)?.hp).toBe(event.targetHp);
      }
      if (event.kind === 'bean-activated') {
        expect(all.find((u) => u.id === event.actorId)).toMatchObject({
          hp: event.hp,
          bean: event.flavour,
        });
      }
      if (event.kind === 'synergy-activated')
        expect(frame.synergies).toContainEqual(
          expect.objectContaining({
            team: event.team,
            affinity: event.affinity,
            members: event.members,
          }),
        );
    }
  });
  it('finishes at exactly the persisted result and never calls random or engine while seeking', () => {
    const record = battle(),
      replay = new BattleReplay(record),
      random = vi.spyOn(Math, 'random');
    for (let i = 0; i < 3; i++)
      expect(replay.frame(record.events.length).player.map((u) => [u.id, u.hp, u.mana])).toEqual(
        record.player.map((u) => [u.id, u.hp, u.mana]),
      );
    expect(replay.frame(record.events.length).outcome).toBe(record.outcome);
    expect(random).not.toHaveBeenCalled();
    random.mockRestore();
  });
  it('returns frozen frames and allows reversible seek without changing the combat', () => {
    const record = battle(),
      before = JSON.stringify(record),
      replay = new BattleReplay(record),
      frame = replay.frame(3);
    replay.frame(record.events.length);
    expect(replay.frame(3)).toEqual(frame);
    expect(Object.isFrozen(frame.player[0])).toBe(true);
    expect(JSON.stringify(record)).toBe(before);
  });
  it('rejects invalid cursors instead of allowing a partial or invented result', () => {
    const replay = new BattleReplay(battle());
    for (const n of [-1, 1.5, NaN, Infinity, 99999])
      expect(() => replay.frame(n)).toThrow('INVALID_REPLAY');
  });
  it('rejects inconsistent final HP and out-of-bound event snapshots before starting playback', () => {
    const record = battle(),
      spell = record.events.find((e) => e.kind === 'spell-cast')!;
    expect(
      () =>
        new BattleReplay({
          ...record,
          events: record.events.map((e) => (e === spell ? { ...spell, targetHp: 99999 } : e)),
        }),
    ).toThrow('INVALID_REPLAY');
    const final = record.player[0];
    expect(
      () =>
        new BattleReplay({
          ...record,
          player: [{ ...final, mana: final.mana + 1 }, ...record.player.slice(1)],
        }),
    ).toThrow('INVALID_REPLAY');
  });
  it('rejects malformed spell and bean presentation fields rather than showing invented values', () => {
    const record = battle(),
      spell = record.events.find((e) => e.kind === 'spell-cast')!,
      bean = record.events.find((e) => e.kind === 'bean-activated')!;
    for (const replacement of [
      { ...spell, missed: undefined },
      { ...spell, damage: undefined },
      { ...bean, flavour: 'unknown' },
    ])
      expect(
        () =>
          new BattleReplay({
            ...record,
            events: record.events.map((e) =>
              e.sequence === replacement.sequence ? replacement : e,
            ),
          } as typeof record),
      ).toThrow('INVALID_REPLAY');
  });
});
describe('recorded coven passives', () => {
  it('exposes no passive before consuming its activation and keeps each team separate', () => {
    const record = battle(),
      replay = new BattleReplay(record);
    expect(replay.frame(0).player[0]).toHaveProperty('passives', []);
    const event = record.events.find((e) => e.kind === 'synergy-activated' && e.team === 'player')!;
    const frame = replay.frame(event.sequence + 1);
    expect(
      frame.player.every((u) =>
        u.passives.some(
          (p) =>
            p.affinity === 'alchemy' &&
            p.tier === 3 &&
            p.value === record.input.rules.alchemyHealing,
        ),
      ),
    ).toBe(true);
    expect(frame.rival.every((u) => u.passives.length === 0)).toBe(true);
  });
  it('uses frozen rule values and fixed tiers rather than contributor counts as rank', () => {
    const record = battle(),
      replay = new BattleReplay(record),
      frame = replay.frame(record.events.length);
    expect(frame.player[0].passives).toContainEqual({
      team: 'player',
      affinity: 'alchemy',
      tier: 3,
      members: 3,
      value: record.input.rules.alchemyHealing,
    });
    expect(frame.rival[0].passives).toContainEqual({
      team: 'rival',
      affinity: 'fire',
      tier: 2,
      members: 3,
      value: record.input.rules.fireBurnDamage,
    });
    expect(Object.isFrozen(frame.player[0].passives)).toBe(true);
    expect(Object.isFrozen(frame.player[0].passives[0])).toBe(true);
    expect(replay.frame(0).rival[0].passives).toEqual([]);
  });
  it('rejects a neutral, inconsistent or duplicate recorded activation', () => {
    const record = battle(),
      activation = record.events.find((e) => e.kind === 'synergy-activated')!;
    for (const value of [
      { ...activation, affinity: 'neutral' },
      { ...activation, members: 5 },
    ])
      expect(
        () =>
          new BattleReplay({
            ...record,
            events: record.events.map((e) => (e === activation ? value : e)),
          } as typeof record),
      ).toThrow('INVALID_REPLAY');
    const events = [
      ...record.events.slice(0, activation.sequence + 1),
      activation,
      ...record.events.slice(activation.sequence + 1),
    ].map((event, sequence) => ({ ...event, sequence }));
    expect(() => new BattleReplay({ ...record, events })).toThrow('INVALID_REPLAY');
  });
});
it('projects team-wide benefits onto a neutral ally without changing stats and keeps them after contributors fall', () => {
  const original = battle();
  const record = new CombatEngine({ fromSeed: (seed) => new SeededRandom(seed) }).resolve({
    ...original.input,
    player: [
      ...original.input.player,
      {
        ...original.input.player[0],
        id: 'neutral-ally',
        affinity: 'neutral',
        beanUnitId: undefined,
      },
    ],
  });
  const frame = new BattleReplay(record).frame(record.events.length);
  const neutral = frame.player.find((unit) => unit.id === 'neutral-ally')!;
  expect(neutral.passives).toEqual(frame.player[0].passives);
  expect(neutral.affinity).toBe('neutral');
  expect(frame.rival.some((unit) => unit.hp === 0)).toBe(true);
  expect(frame.rival.every((unit) => unit.passives[0]?.affinity === 'fire')).toBe(true);
});
it('projects Shadows I onto neutral teammates and retains a recorded zero-valued Alchemy bonus', () => {
  const original = battle();
  const record = new CombatEngine({ fromSeed: (seed) => new SeededRandom(seed) }).resolve({
    ...original.input,
    rules: { ...original.input.rules, alchemyHealing: 0, shadowInitiative: 7.5 },
    rival: original.input.rival.map((unit, index) => ({
      ...unit,
      affinity: index === 0 ? 'shadows' : 'neutral',
    })),
  });
  const frame = new BattleReplay(record).frame(record.events.length);
  expect(frame.player[0].passives[0]).toMatchObject({ affinity: 'alchemy', tier: 3, value: 0 });
  expect(frame.rival[1].passives[0]).toEqual({
    team: 'rival',
    affinity: 'shadows',
    tier: 1,
    members: 1,
    value: 7.5,
  });
});
