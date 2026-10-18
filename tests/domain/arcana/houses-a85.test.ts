import { expect, it } from 'vitest';
import { houseProgress, houseBonus } from '../../../src/arcana/domain/combat/houses';
import { HOUSES } from '../../../src/arcana/domain/collection/traits';
const units = (house: (typeof HOUSES)[number], n: number) =>
  Array.from({ length: n }, (_, i) => ({ id: `copy${i}`, wizardId: `wizard${i}`, hp: 90, house }));
it('activates at three and caps at four equally for every house', () => {
  for (const house of HOUSES)
    for (const [n, tier] of [
      [2, 0],
      [3, 1],
      [4, 2],
      [5, 2],
    ]) {
      const progress = houseProgress(units(house, n)).find((h) => h.house === house)!;
      expect(progress.tier).toBe(tier);
      expect(progress.next).toBe(n < 3 ? 3 : n < 4 ? 4 : null);
    }
});
it('duplicates, fallen units and cosmetic finishes cannot manufacture contributors', () => {
  const team = units('gryffindor', 3);
  expect(houseProgress([...team, { ...team[0], id: 'duplicate' }])[0].count).toBe(3);
  expect(houseProgress(team.map((u, i) => (i === 0 ? { ...u, hp: 0 } : u)))[0].tier).toBe(0);
  expect(houseBonus([...team, { ...team[0], id: 'duplicate' }], 'duplicate')?.tier).toBe(1);
});
import { CombatEngine, type CombatUnitInput } from '../../../src/arcana/domain/combat/engine';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
import { BattleReplay } from '../../../src/arcana/application/client/battle-replay';
const fighter = (id: string, house?: (typeof HOUSES)[number]): CombatUnitInput => ({
  id,
  wizardId: id,
  house,
  level: 1,
  affinity: 'neutral',
  hp: 60,
  maxHp: 100,
  mana: 20,
  maxMana: 20,
  power: 10,
  speed: 10,
  wandPowerBonus: 0,
  wandMultiplier: 1,
  broomInitiative: 0,
});
const input = (house: (typeof HOUSES)[number], enabled = true) => ({
  id: 'combat',
  seed: 42,
  player: [0, 1, 2].map((i) => fighter(`p${i}`, house)),
  rival: [0, 1, 2].map((i) => fighter(`r${i}`)),
  rules: {
    version: enabled ? 2 : 1,
    ...(enabled ? { houseSynergies: 1 as const } : {}),
    maxRounds: 4,
    spellManaCost: 1,
    fireBurnDamage: 2,
    alchemyHealing: 3,
    shadowInitiative: 2,
    beans: { version: 1, entries: [{ flavour: 'mint' as const, weight: 1 }] },
  },
});
it('records distinct useful house effects, with legacy byte-equivalent and replay independent of live content', () => {
  const engine = new CombatEngine({ fromSeed: (seed) => new SeededRandom(seed) });
  for (const house of HOUSES) {
    const next = engine.resolve(input(house));
    const prior = engine.resolve(input(house, false));
    expect(next.engineVersion).toBe(2);
    expect(next.events.some((e) => e.kind === 'house-activated')).toBe(true);
    expect(next.events).not.toEqual(prior.events);
    const replay = new BattleReplay(next).frame(next.events.length);
    expect(replay.player.map((u) => [u.hp, u.mana])).toEqual(
      next.player.map((u) => [u.hp, u.mana]),
    );
    expect(engine.resolve(prior.input)).toEqual(prior);
  }
});
it('first-impact and late-spell bonuses are actual recorded damage, never a missed spell bonus', () => {
  const engine = new CombatEngine({ fromSeed: (seed) => new SeededRandom(seed) });
  const result = engine.resolve(input('gryffindor'));
  expect(result.events.find((e) => e.kind === 'spell-cast')).toMatchObject({ damage: 12 });
  const raven = engine.resolve(input('ravenclaw'));
  const casts = raven.events
    .filter((e) => e.kind === 'spell-cast')
    .filter((e) => e.actorId === 'p0');
  expect(casts.slice(0, 2).map((e) => e.damage)).toEqual([10, 10]);
  expect(casts[2]?.damage).toBe(11);
});
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { randomizeRoute } from '../../../src/arcana/domain/exploration/randomize-route';
import {
  publicContentSnapshot,
  projectPublicContent,
} from '../../../src/arcana/application/public-content';
it('retains all thirty identities, exact base stats and identity weights; publishes honest independent finish odds', () => {
  const old = trialConfiguration('a84'),
    next = trialConfiguration('a85');
  expect(next.opening.catalog.wizards.map(({ traits, ...w }) => w)).toEqual(
    old.opening.catalog.wizards,
  );
  expect(next.opening.table.entries).toEqual(old.opening.table.entries);
  expect(next.campaign.version).toBe(old.campaign.version);
  const publicData = projectPublicContent(next.opening, next.campaign);
  expect(publicContentSnapshot(publicData)).toEqual(publicData);
  expect(publicData.toadTable.finish).toEqual({ version: 1, enchanted: 1, total: 100 });
  expect(publicData.catalog.wizards.find((w) => w.id === 'flamel')?.traits).toEqual({
    version: 1,
    school: 'beauxbatons',
  });
  expect(
    publicData.catalog.wizards.find((w) => w.id === 'root-speaker')?.traits?.house,
  ).toBeUndefined();
});
it('offers three distinct non-starter house members on a real available route before fighting, without removing the alternative', () => {
  const c = trialConfiguration('a85'),
    seen = new Set<string>();
  for (let seed = 0; seed < 128; seed++) {
    const graph = randomizeRoute(c.campaign.graph, new SeededRandom(seed));
    const plans = c.campaign.challengeContent!('discovery', graph);
    const pactPath: string[] = [];
    const walk = (id: string, path: string[]): boolean => {
      const node = graph.nodes.find((n) => n.id === id)!;
      const next = node.kind === 'pact' ? [...path, id] : path;
      if (next.length === 3) {
        pactPath.push(...next);
        return true;
      }
      if (node.kind === 'duel' || node.kind === 'boss') return false;
      return node.next.some((id) => walk(id, next));
    };
    expect(graph.nodes.filter((n) => n.row === 0).some((n) => walk(n.id, []))).toBe(true);
    const recruits = pactPath.map((id) => {
      const plan = plans.find((p) => p.nodeId === id)!;
      if (plan.kind !== 'pact') throw Error();
      expect(plan.recruits).toHaveLength(2);
      return plan.recruit;
    });
    expect(new Set(recruits.map((u) => u.wizardId)).size).toBe(3);
    expect(new Set(recruits.map((u) => u.house)).size).toBe(1);
    seen.add(recruits[0].house!);
    expect(recruits[0].house).not.toBe('gryffindor');
    expect(houseProgress(recruits).some((g) => g.tier === 1)).toBe(true);
  }
  expect([...seen].sort()).toEqual(['hufflepuff', 'ravenclaw', 'slytherin']);
});
import currentFixture from '../../support/fixtures/a85-route-seed0.json';
it('declares the updated Linux expedition route explicitly instead of rewriting the A84 baseline fixture', () => {
  const c = trialConfiguration('a85'),
    graph = randomizeRoute(c.campaign.graph, new SeededRandom(0));
  expect(currentFixture.graph).toEqual(graph);
  expect(currentFixture.nodes).toEqual(c.campaign.challengeContent!('discovery', graph));
});
it('a forced miss neither deals house damage nor spends the first-hit bonus; pepper does not multiply the flat bonus', () => {
  const start = input('gryffindor');
  const actor = { ...start.player[0], beanUnitId: 'soap' };
  const missed = new CombatEngine({ fromSeed: () => ({ ticket: () => 0 }) }).resolve({
    ...start,
    player: [actor, ...start.player.slice(1)],
    rules: { ...start.rules, beans: { version: 1, entries: [{ flavour: 'soap', weight: 1 }] } },
  });
  const casts = missed.events
    .filter((e) => e.kind === 'spell-cast')
    .filter((e) => e.actorId === 'p0');
  expect(casts[0]).toMatchObject({ missed: true, damage: 0 });
  expect(casts[1]).toMatchObject({ missed: false, damage: 12 });
  const pepper = new CombatEngine({ fromSeed: () => ({ ticket: () => 0 }) }).resolve({
    ...start,
    player: [actor, ...start.player.slice(1)],
    rules: { ...start.rules, beans: { version: 1, entries: [{ flavour: 'pepper', weight: 1 }] } },
  });
  expect(
    pepper.events.filter((e) => e.kind === 'spell-cast').find((e) => e.actorId === 'p0'),
  ).toMatchObject({ damage: 15 });
});
