import { describe, expect, it, vi } from 'vitest';
import {
  CombatEngine,
  type CombatInput,
  type CombatUnitInput,
} from '../../../src/arcana/domain/combat/engine';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
// All numeric values are test-only fixtures; no production balance is established here.
const unit = (id: string, values: Partial<CombatUnitInput> = {}): CombatUnitInput => ({
  id,
  wizardId: 'merlin',
  level: 1,
  affinity: 'neutral',
  hp: 100,
  maxHp: 100,
  mana: 50,
  maxMana: 50,
  power: 10,
  speed: 10,
  wandPowerBonus: 0,
  wandMultiplier: 1,
  broomInitiative: 0,
  ...values,
});
type Fixture = { -readonly [K in keyof CombatInput]: CombatInput[K] } & {
  player: CombatUnitInput[];
  rival: CombatUnitInput[];
};
const fixture = (): Fixture => ({
  id: 'combat',
  seed: 42,
  player: [unit('p0'), unit('p1'), unit('p2')],
  rival: [unit('r0'), unit('r1'), unit('r2')],
  rules: {
    version: 1,
    maxRounds: 20,
    spellManaCost: 1,
    fireBurnDamage: 2,
    alchemyHealing: 5,
    shadowInitiative: 3,
    beans: {
      version: 1,
      entries: [
        { flavour: 'mint', weight: 1 },
        { flavour: 'pepper', weight: 1 },
        { flavour: 'earth', weight: 1 },
        { flavour: 'soap', weight: 1 },
      ],
    },
  },
});
const engine = () => new CombatEngine({ fromSeed: (seed) => new SeededRandom(seed) });
describe('ARCANA CombatEngine automatic deterministic resolution', () => {
  it('reproduces the entire log and result from identical input and seed without mutation', () => {
    const input = fixture();
    input.player[0] = unit('p0', { beanUnitId: 'bean0' });
    const original = structuredClone(input),
      a = engine().resolve(input),
      b = engine().resolve(input);
    expect(a).toEqual(b);
    expect(input).toEqual(original);
    expect(a.input.seed).toBe(42);
    expect(a.engineVersion).toBe(1);
    expect(a.events.map((e) => e.sequence)).toEqual(a.events.map((_, i) => i));
    expect(a.events.at(-1)?.kind).toBe('combat-finished');
    expect(Object.isFrozen(a.events)).toBe(true);
    expect(Object.isFrozen(a.input.rules)).toBe(true);
  });
  it('orders by initiative including broom and wand damage before casting automatically', () => {
    const input = fixture();
    input.player[1] = unit('p1', {
      speed: 11,
      broomInitiative: 3,
      wandPowerBonus: 2,
      wandMultiplier: 1.5,
    });
    const casts = engine()
      .resolve(input)
      .events.filter((e) => e.kind === 'spell-cast');
    expect(casts[0]).toMatchObject({ actorId: 'p1', damage: 18, targetId: 'r0' });
  });
  it('uses a stable ID tie break and never targets or acts with a defeated unit', () => {
    const input = fixture();
    input.player[0] = unit('p0', { power: 200 });
    const result = engine().resolve(input);
    expect(result.events.filter((e) => e.kind === 'spell-cast')[0]).toMatchObject({
      actorId: 'p0',
      targetId: 'r0',
      targetHp: 0,
    });
    expect(result.events.some((e) => e.kind === 'turn-started' && e.actorId === 'r0')).toBe(false);
  });
  it('finishes as a player victory when all enemies are defeated and preserves bounded residual health', () => {
    const input = fixture();
    input.player = input.player.map((u) => ({ ...u, power: 200, speed: 100 }));
    const result = engine().resolve(input);
    expect(result.outcome).toBe('player');
    expect(result.rival.every((u) => u.hp === 0)).toBe(true);
    expect(result.player.every((u) => u.hp <= u.maxHp && u.hp > 0)).toBe(true);
  });
  it('resolves a rival victory without granting client-selected outcomes', () => {
    const input = fixture();
    input.rival = input.rival.map((u) => ({ ...u, power: 200, speed: 100 }));
    expect(engine().resolve(input).outcome).toBe('rival');
  });
  it('stops at the configured round limit when mana is exhausted, without negative mana or an invented win', () => {
    const input = fixture();
    input.rules = { ...input.rules, maxRounds: 3 };
    input.player = input.player.map((u) => ({ ...u, mana: 0 }));
    input.rival = input.rival.map((u) => ({ ...u, mana: 0 }));
    const result = engine().resolve(input);
    expect(result.outcome).toBe('draw');
    expect(result.rounds).toBe(3);
    expect(result.events.filter((e) => e.kind === 'mana-exhausted')).toHaveLength(18);
    expect(result.player.every((u) => u.mana === 0)).toBe(true);
  });
  it.each([
    ['mint', 0],
    ['pepper', 1],
    ['earth', 2],
    ['soap', 3],
  ] as const)('activates %s only once with a controlled ticket', (flavour, ticket) => {
    const input = fixture();
    input.player[0] = unit('p0', { hp: 40, beanUnitId: 'bean0' });
    // Keep the carrier alive long enough to observe expiration after two turns.
    if (flavour === 'earth') input.rival = input.rival.map((u) => ({ ...u, power: 0 }));
    const random = { ticket: vi.fn(() => ticket) };
    const result = new CombatEngine({ fromSeed: () => random }).resolve(input);
    expect(result.events.filter((e) => e.kind === 'bean-activated')).toHaveLength(1);
    expect(result.events.find((e) => e.kind === 'bean-activated')).toMatchObject({
      actorId: 'p0',
      flavour,
      unitId: 'bean0',
      hp: flavour === 'mint' ? 65 : 40,
    });
    expect(random.ticket).toHaveBeenCalledTimes(1);
    const first = result.events.find((e) => e.kind === 'spell-cast' && e.actorId === 'p0');
    if (flavour === 'pepper') expect(first).toMatchObject({ damage: 13 });
    if (flavour === 'soap') expect(first).toMatchObject({ missed: true, damage: 0 });
    if (flavour === 'earth') {
      const turns = result.events
        .filter((e) => e.kind === 'turn-started')
        .filter((e) => e.actorId === 'p0');
      expect(turns.slice(0, 3).map((e) => e.initiative)).toEqual([8.5, 8.5, 10]);
    }
  });
  it('applies Fire II continuous damage, Alchemy III healing and Shadows I initiative from explicit rule data', () => {
    const input = fixture();
    input.player = input.player.map((u) => ({ ...u, affinity: 'alchemy', hp: 40 }));
    input.rival = input.rival.map((u, i) => ({ ...u, affinity: i < 2 ? 'fire' : 'shadows' }));
    const result = engine().resolve(input);
    expect(result.events.filter((e) => e.kind === 'synergy-activated')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ team: 'player', affinity: 'alchemy', members: 3 }),
        expect.objectContaining({ team: 'rival', affinity: 'fire', members: 2 }),
        expect.objectContaining({ team: 'rival', affinity: 'shadows', members: 1 }),
      ]),
    );
    expect(
      result.events.some((e) => e.kind === 'healed' && e.source === 'alchemy' && e.amount === 5),
    ).toBe(true);
    expect(result.events.some((e) => e.kind === 'burn-tick' && e.damage === 2)).toBe(true);
    expect(result.events.filter((e) => e.kind === 'turn-started')[0]).toMatchObject({
      team: 'rival',
      initiative: 13,
    });
  });
  it('does not activate a bean on a dead unit or resurrect it with passive healing', () => {
    const input = fixture();
    input.player = input.player.map((u) => ({ ...u, affinity: 'alchemy' }));
    input.player[0] = { ...input.player[0], hp: 0, beanUnitId: 'unused' };
    const result = engine().resolve(input);
    expect(result.events.some((e) => e.kind === 'bean-activated' && e.actorId === 'p0')).toBe(
      false,
    );
    expect(result.player[0].hp).toBe(0);
  });
  it('accepts a full five-versus-five formation', () => {
    const input = fixture();
    input.player = [...input.player, unit('p3'), unit('p4')];
    input.rival = [...input.rival, unit('r3'), unit('r4')];
    expect(engine().resolve(input).player).toHaveLength(5);
  });
  it('rejects invalid formation, IDs, table, seed or numeric rules before creating random', () => {
    const invalid: CombatInput[] = [];
    const tooSmall = fixture();
    tooSmall.player = tooSmall.player.slice(0, 2);
    invalid.push(tooSmall);
    const duplicate = fixture();
    duplicate.rival[0] = { ...duplicate.rival[0], id: 'p0' };
    invalid.push(duplicate);
    const invalidHp = fixture();
    invalidHp.player[0] = { ...invalidHp.player[0], hp: NaN };
    invalid.push(invalidHp);
    const invalidSeed = fixture();
    invalidSeed.seed = -1;
    invalid.push(invalidSeed);
    const invalidTable = fixture();
    invalidTable.rules = { ...invalidTable.rules, beans: { version: 1, entries: [] } };
    invalid.push(invalidTable);
    const invalidLimit = fixture();
    invalidLimit.rules = { ...invalidLimit.rules, maxRounds: 0 };
    invalid.push(invalidLimit);
    const duplicateBean = fixture();
    duplicateBean.player[0] = { ...duplicateBean.player[0], beanUnitId: 'same' };
    duplicateBean.player[1] = { ...duplicateBean.player[1], beanUnitId: 'same' };
    invalid.push(duplicateBean);
    const fromSeed = vi.fn(() => new SeededRandom(0));
    for (const input of invalid)
      expect(() => new CombatEngine({ fromSeed }).resolve(input)).toThrow('INVALID_COMBAT');
    expect(fromSeed).not.toHaveBeenCalled();
  });
});
