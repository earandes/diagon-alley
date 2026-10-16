import { tacticalContent } from '../../../src/arcana/infrastructure/content/tactical-content';
import { describe, expect, it } from 'vitest';
import { CombatEngine, type CombatUnitInput } from '../../../src/arcana/domain/combat/engine';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import type { NodePlan } from '../../../src/arcana/domain/exploration/nodes';

/** Content acceptance, not human difficulty targets. All definitions use the integrated builder. */
describe('A65 tactical content changes the useful preparation without new stats', () => {
  const { campaign, opening } = trialConfiguration();
  const plans = tacticalContent(campaign.nodes, opening.catalog, campaign.ownedAffinities!).nodes;
  const pacts = plans.filter((n) => n.kind === 'pact');
  const duels = plans.filter(
    (n): n is Extract<NodePlan, { kind: 'duel' | 'boss' }> => n.kind === 'duel',
  );
  const engine = new CombatEngine({ fromSeed: (seed) => new SeededRandom(seed) });
  const apprentice = (): CombatUnitInput => {
    const wizard = opening.catalog.wizards.find((w) => w.id === 'apprentice')!;
    return {
      ...campaign.prepareOwned({
        copyId: 'starter:apprentice',
        wizard,
        catalogVersion: opening.catalog.version,
        sourceId: 'starter-kit',
        origin: 'starter',
      }),
      wandPowerBonus: 2,
      broomInitiative: 3,
    };
  };
  const candidate = (pact: number, index: number) => pacts[pact].recruits![index];
  const alchemy = () => [apprentice(), candidate(0, 0), candidate(1, 0)];
  const fire = () => [apprentice(), candidate(0, 1), candidate(1, 1)];
  const shadows = () => [apprentice(), candidate(0, 0), candidate(2, 1)];
  const hp = (units: readonly CombatUnitInput[]) => units.reduce((sum, u) => sum + u.hp, 0);
  const resolve = (player: readonly CombatUnitInput[], duel: number, seed: number) =>
    engine.resolve({
      id: `tactical-fixture:${seed}`,
      seed,
      player,
      rival: duels[duel].opponents,
      rules: campaign.combatRules,
    });

  it('uses unchanged catalog stats/affinities and preserves the historical neutral unit', () => {
    for (const unit of [
      ...pacts.flatMap((p) => p.recruits!),
      ...duels.flatMap((d) => d.opponents),
    ]) {
      const wizard = opening.catalog.wizards.find((w) => w.id === unit.wizardId);
      if (!wizard) {
        expect(unit.wizardId).toBe('rival');
        expect(unit).toMatchObject({ hp: 25, maxHp: 25, power: 3, speed: 3, affinity: 'neutral' });
      } else {
        expect(unit).toMatchObject({
          hp: wizard.stats.maxHp,
          maxHp: wizard.stats.maxHp,
          mana: wizard.stats.maxMana,
          power: wizard.stats.power,
          speed: wizard.stats.speed,
          affinity: campaign.ownedAffinities![wizard.id],
        });
      }
    }
  });

  it('offers two viable initial plans whose preference reverses with the rival', () => {
    for (const seed of [0, 1, 17, 63, 127]) {
      const af = resolve(alchemy(), 0, seed),
        sf = resolve(shadows(), 0, seed);
      const av = resolve(alchemy(), 1, seed),
        sv = resolve(shadows(), 1, seed);
      expect([af, sf, av, sv].map((b) => b.outcome)).toEqual([
        'player',
        'player',
        'player',
        'player',
      ]);
      // Real arrival IDs participate in initiative tie-breaking; compare surviving members explicitly.
      expect(af.player.filter((u) => u.hp > 0).length).toBeGreaterThan(
        sf.player.filter((u) => u.hp > 0).length,
      );
      expect(sv.player.filter((u) => u.hp > 0).length).toBeGreaterThan(
        av.player.filter((u) => u.hp > 0).length,
      );
    }
  });

  it('changes which first-Pact alternative is useful when the existing team changes', () => {
    const owned = (wizardId: string, id: string) =>
      campaign.prepareOwned({
        copyId: id,
        wizard: opening.catalog.wizards.find((w) => w.id === wizardId)!,
        catalogVersion: opening.catalog.version,
        sourceId: 'declared-fixture',
        origin: 'toad',
      });
    const alchemyBase = [apprentice(), owned('merlin', 'owned:merlin')];
    const fireBase = [apprentice(), owned('ember-keeper', 'owned:ember')];
    const results = [alchemyBase, fireBase].map((base) =>
      [0, 1].map((choice) => resolve([...base, candidate(0, choice)], 0, 42)),
    );
    expect(hp(results[0][0].player)).toBeGreaterThan(hp(results[0][1].player));
    expect(hp(results[1][1].player)).toBeGreaterThan(hp(results[1][0].player));
  });

  it('gives both second-Pact candidates a condition where they preserve more health', () => {
    const owned = (wizardId: string) =>
      campaign.prepareOwned({
        copyId: 'owned:' + wizardId,
        wizard: opening.catalog.wizards.find((w) => w.id === wizardId)!,
        catalogVersion: opening.catalog.version,
        sourceId: 'declared-fixture',
        origin: 'toad',
      });
    const context = (wizardId: string, condition: number) =>
      [apprentice(), owned(wizardId)].map((u) => ({ ...u, hp: u.maxHp * condition }));
    const compare = (wizardId: string, condition: number) =>
      [0, 1].map((index) =>
        resolve(
          [
            ...context(wizardId, condition),
            { ...candidate(1, index), hp: candidate(1, index).maxHp * condition },
          ],
          0,
          42,
        ),
      );
    const healing = compare('merlin', 1),
      offense = compare('circe', 0.8);
    expect(hp(healing[0].player)).toBeGreaterThan(hp(healing[1].player));
    expect(hp(offense[1].player)).toBeGreaterThan(hp(offense[0].player));
  });

  it('gives the third-Pact initiative option value at full health and healing value when wounded', () => {
    const compare = (condition: number) =>
      [0, 1].map((index) =>
        resolve(
          [apprentice(), candidate(1, 0), candidate(2, index)].map((u) => ({
            ...u,
            hp: u.maxHp * condition,
          })),
          0,
          42,
        ),
      );
    const healthy = compare(1),
      wounded = compare(0.6);
    expect(hp(healthy[1].player)).toBeGreaterThan(hp(healthy[0].player));
    expect(hp(wounded[0].player)).toBeGreaterThan(hp(wounded[1].player));
  });

  it('makes recovery valuable without inventing a healing effect or consuming a bean', () => {
    const weakened = fire().map((unit) => ({ ...unit, hp: unit.maxHp * 0.3 }));
    const before = structuredClone(weakened);
    const recovered = weakened.map((u) => ({ ...u, hp: Math.min(u.maxHp, u.hp + u.maxHp * 0.4) }));
    expect(resolve(weakened, 0, 12).outcome).toBe('rival');
    expect(resolve(recovered, 0, 12).outcome).toBe('player');
    expect(weakened).toEqual(before);
    expect(recovered.every((u) => u.beanUnitId === undefined)).toBe(true);
  });
});
