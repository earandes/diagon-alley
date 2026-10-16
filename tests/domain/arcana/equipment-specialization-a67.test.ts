import { describe, it, expect } from 'vitest';
import original from '../../../src/arcana/content/trial-v1.json';
import { specializedForge } from '../../../src/arcana/infrastructure/content/equipment-content';
import { forgeWand, type ForgeCatalog } from '../../../src/arcana/domain/economy/commerce';
import { equipmentSnapshot } from '../../../src/arcana/domain/economy/equipment';
import { CombatEngine, type CombatUnitInput } from '../../../src/arcana/domain/combat/engine';
import { combatSnapshot } from '../../../src/arcana/domain/combat/record';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { runInitial, campaignFixture } from './support/run-fixtures';
import { refreshRunEquipment } from '../../../src/arcana/application/prepare-team';
import type { Run } from '../../../src/arcana/domain/exploration/run';
import {
  preparationUnit,
  previewEquipment,
} from '../../../src/arcana/presentation/contextual-preparation';
import { equipmentInitiative } from '../../../src/arcana/domain/combat/equipment-effects';
import { equipmentSpecialization } from '../../../src/arcana/presentation/equipment-specialization';
const legacy = original.commerce.forge as ForgeCatalog;
const forge = specializedForge(legacy);
const engine = new CombatEngine({ fromSeed: (seed) => new SeededRandom(seed) });
const unit = (id: string, changes: Partial<CombatUnitInput> = {}): CombatUnitInput => ({
  id,
  wizardId: 'apprentice',
  level: 1,
  affinity: 'neutral',
  hp: 30,
  maxHp: 100,
  mana: 30,
  maxMana: 30,
  power: 10,
  speed: 5,
  wandPowerBonus: 0,
  wandMultiplier: 1,
  broomInitiative: 0,
  ...changes,
});
describe('A67 versioned equipment specialization', () => {
  it('retains every price and recipe identity, with compensation instead of the old dominated multiplier', () => {
    expect(forge.version).toBe(2);
    for (const before of legacy.recipes) {
      const after = forge.recipes.find((r) => r.id === before.id)!;
      expect(after.crowns).toBe(before.crowns);
      expect(after.powerBonus).toBe(before.powerBonus);
      if (after.core === 'dragon') expect(after.multiplier).toBe(1.2);
      else {
        expect(after.multiplier).toBe(1);
        expect((after.healing ?? 0) + (after.initiativeBonus ?? 0)).toBeGreaterThan(0);
      }
    }
  });
  it('forges immutable V2 values and never rewrites existing V1 equipment', () => {
    const initial = runInitial().inventory;
    const old = equipmentSnapshot([
      {
        id: 'old',
        version: 1,
        kind: 'wand',
        wood: 'birch',
        core: 'phoenix',
        powerBonus: 2,
        multiplier: 1.15,
      },
    ]);
    const before = { ...initial, equipment: old };
    const result = forgeWand(
      before,
      forge,
      { catalogVersion: 2, recipeId: 'birch-phoenix' },
      'new',
    );
    expect(result.inventory.crowns).toBe(before.crowns - 15);
    expect(result.inventory.equipment?.[0]).toEqual(old[0]);
    expect(result.equipment).toMatchObject({ version: 2, multiplier: 1, healing: 2 });
    expect(before.equipment).toEqual(old);
    expect(() =>
      forgeWand(before, forge, { catalogVersion: 1, recipeId: 'birch-phoenix' }, 'stale'),
    ).toThrow('STALE_WORKSHOP');
  });
  it('heals only living actors, clamps to HP maximum, and records equipment source before the spell', () => {
    const config = trialConfiguration();
    const result = engine.resolve({
      id: 'heal',
      seed: 9,
      player: [
        unit('p0', { hp: 99, wandHealing: 2 }),
        unit('p1', { hp: 0, wandHealing: 2 }),
        unit('p2'),
      ],
      rival: [unit('r0', { hp: 1 }), unit('r1', { hp: 1 }), unit('r2', { hp: 1 })],
      rules: config.campaign.combatRules,
    });
    expect(result.events).toContainEqual(
      expect.objectContaining({
        kind: 'healed',
        actorId: 'p0',
        source: 'equipment',
        amount: 1,
        hp: 100,
      }),
    );
    expect(result.events.some((e) => e.kind === 'healed' && e.actorId === 'p1')).toBe(false);
    expect(combatSnapshot(result)).toEqual(result);
  });
  it('initiative is shared with preparation and survives saved combat snapshots', () => {
    const config = trialConfiguration();
    const result = engine.resolve({
      id: 'initiative',
      seed: 1,
      player: [unit('p0', { wandInitiativeBonus: 3 }), unit('p1'), unit('p2')],
      rival: [unit('r0', { speed: 7 }), unit('r1'), unit('r2')],
      rules: config.campaign.combatRules,
    });
    expect(equipmentInitiative(unit('p0', { wandInitiativeBonus: 3 }))).toBe(8);
    expect(result.events.find((e) => e.kind === 'turn-started')).toMatchObject({
      actorId: 'p0',
      initiative: 8,
    });
    expect(combatSnapshot(result).input.player[0].wandInitiativeBonus).toBe(3);
  });
  it('applies new effects only in eligible new runs and removes stale effects when swapping or unequipping', () => {
    const game = runInitial();
    const campaign = campaignFixture();
    const gear = forgeWand(
      game.inventory,
      forge,
      { catalogVersion: 2, recipeId: 'birch-phoenix' },
      'new',
    ).equipment;
    const team = {
      copyIds: game.copies.map((c) => c.copyId),
      loadouts: [{ copyId: 'copy0', wandId: gear.id, broomId: null }],
    };
    const state = { ...game, team, inventory: { ...game.inventory, equipment: [gear] } };
    const run: Run = {
      id: 'run',
      campaignVersion: 1,
      zoneId: campaign.zoneId,
      status: 'active',
      graphVersion: campaign.graph.version,
      graph: campaign.graph,
      visited: [],
      members: game.copies.map((copy) => ({ source: 'owned', unit: campaign.prepareOwned(copy) })),
    };
    const legacy = refreshRunEquipment(run, state, team);
    expect(legacy.members[0].unit.wandHealing).toBeUndefined();
    const current = refreshRunEquipment({ ...run, equipmentRulesVersion: 2 }, state, team);
    expect(current.members[0].unit.wandHealing).toBe(2);
    const withRun = { ...state, exploration: { run: current, victories: [], unlockedZones: [] } };
    const preview = previewEquipment(withRun, state.copies[0], 'wand', null);
    expect(preview.healingBefore).toBe(2);
    expect(preview.healingAfter).toBe(0);
    expect(preview.before.hp).toBe(preview.after.hp);
    const removed = refreshRunEquipment(current, state, { ...team, loadouts: [] });
    expect(removed.members[0].unit.wandHealing).toBeUndefined();
    expect(
      preparationUnit({ ...withRun, team: { ...team, loadouts: [] } }, state.copies[0]).wandHealing,
    ).toBeUndefined();
  });
  it('demonstrates different useful choices on declared paired combat fixtures', () => {
    const rules = trialConfiguration().campaign.combatRules;
    const catalog = original.catalog.wizards;
    const affinities = original.affinities as Record<string, CombatUnitInput['affinity']>;
    const catalogUnit = (wizardId: string, id: string, condition: number) => {
      const wizard = catalog.find((w) => w.id === wizardId)!;
      return unit(id, {
        wizardId,
        affinity: affinities[wizardId],
        maxHp: wizard.stats.maxHp,
        hp: wizard.stats.maxHp * condition,
        mana: wizard.stats.maxMana,
        maxMana: wizard.stats.maxMana,
        power: wizard.stats.power,
        speed: wizard.stats.speed,
      });
    };
    const compare = (rivalId: string, beans: boolean) =>
      forge.recipes
        .filter((r) => r.wood === 'birch')
        .map((recipe) => {
          let wins = 0;
          for (let seed = 1; seed <= 32; seed++) {
            const player = ['flamel', 'apprentice', 'merlin'].map((wizardId, i) => ({
              ...catalogUnit(wizardId, 'p' + i, 0.5),
              wandPowerBonus: recipe.powerBonus,
              wandMultiplier: recipe.multiplier,
              ...(recipe.healing ? { wandHealing: recipe.healing } : {}),
              ...(recipe.initiativeBonus ? { wandInitiativeBonus: recipe.initiativeBonus } : {}),
              ...(beans && i === 0 ? { beanUnitId: 'fixture:bean' } : {}),
            }));
            const result = engine.resolve({
              id: 'witness',
              seed,
              player,
              rival: [0, 1, 2].map((i) => catalogUnit(rivalId, 'r' + i, 1)),
              rules,
            });
            wins += Number(result.outcome === 'player');
          }
          return wins;
        });
    expect(compare('flamel', false)).toEqual([32, 0, 0]);
    expect(compare('copper-sage', true)).toEqual([21, 32, 8]);
    expect(compare('mist-seer', true)).toEqual([0, 0, 8]);
  });
  it('rejects invalid optional effects instead of silently discarding them', () => {
    for (const value of [-1, Infinity, 11])
      expect(() =>
        equipmentSnapshot([
          {
            id: 'bad',
            version: 2,
            kind: 'wand',
            wood: 'birch',
            core: 'phoenix',
            powerBonus: 2,
            multiplier: 1,
            healing: value,
          },
        ]),
      ).toThrow('INVALID_EQUIPMENT');
  });
  it('never labels a historical phoenix or wyvern with an effect it did not have', () => {
    expect(
      equipmentSpecialization(
        { kind: 'wand', wood: 'birch', core: 'phoenix', powerBonus: 2, multiplier: 1.15 },
        'es',
      ),
    ).toBeNull();
    expect(
      equipmentSpecialization(
        { kind: 'wand', wood: 'birch', core: 'phoenix', powerBonus: 2, multiplier: 1, healing: 2 },
        'en',
      ),
    ).toContain('HP/turn');
  });
  it('keeps original unit snapshots and logs byte-equivalent when no optional equipment effect exists', () => {
    const config = trialConfiguration();
    const input = {
      id: 'old',
      seed: 2,
      player: [unit('p0'), unit('p1'), unit('p2')],
      rival: [unit('r0'), unit('r1'), unit('r2')],
      rules: config.campaign.combatRules,
    };
    const battle = engine.resolve(input);
    expect(battle.input).toEqual(input);
    expect(battle.events.some((e) => e.kind === 'healed' && e.source === 'equipment')).toBe(false);
  });
});
