import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { runInitial, campaignFixture } from './support/run-fixtures';
import { starterEquipment } from '../../../src/arcana/domain/economy/equipment';
import type { Run } from '../../../src/arcana/domain/exploration/run';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { projectPublicContent } from '../../../src/arcana/application/public-content';
import {
  previewWandRecipe,
  beanRiskPreview,
  mintRecoveryPreview,
} from '../../../src/arcana/presentation/commerce-preparation';
import { BeanAssignments } from '../../../src/arcana/presentation/BeanAssignments';
import { WandRecipeComparison } from '../../../src/arcana/presentation/WandRecipeComparison';
import { CommercePanel } from '../../../src/arcana/presentation/CommercePanel';
import { BossSupplies } from '../../../src/arcana/presentation/BossSupplies';

const configuration = trialConfiguration();
const content = projectPublicContent(configuration.opening, configuration.campaign);
const recipe = content.commerce!.forge.recipes.find((entry) => entry.core === 'phoenix')!;
const fixture = (version: 1 | 2 = 2) => {
  const game = runInitial();
  const campaign = campaignFixture();
  const run: Run = {
    id: 'test:run',
    status: 'active',
    campaignVersion: 1,
    zoneId: 'bulevar',
    graphVersion: 1,
    graph: campaign.graph,
    visited: [],
    ...(version === 2 ? { equipmentRulesVersion: 2 as const } : {}),
    members: game.copies.map((copy, index) => ({
      source: 'owned',
      unit: { ...campaign.prepareOwned(copy), hp: index === 1 ? 0 : 7 },
    })),
  };
  return {
    ...game,
    inventory: { ...game.inventory, equipment: starterEquipment() },
    team: {
      copyIds: ['copy0', 'copy1'],
      loadouts: [{ copyId: 'copy0', wandId: 'starter:wand', broomId: 'starter:broom' }],
    },
    exploration: { run, victories: [], unlockedZones: [] },
  };
};

describe('A89 real-copy recipe projection', () => {
  it('compares against each duplicate’s own loadout without mutating condition or inventory', () => {
    const game = fixture();
    const before = JSON.stringify(game);
    const first = previewWandRecipe(
      game,
      game.copies[0],
      recipe,
      content.commerce!.forge.version,
      content,
    );
    const second = previewWandRecipe(
      game,
      game.copies[1],
      recipe,
      content.commerce!.forge.version,
      content,
    );
    expect(first.current.powerBefore).toBeGreaterThan(second.current.powerBefore);
    expect(first.current.healingAfter).toBe(recipe.healing);
    expect(first.current.before.hp).toBe(7);
    expect(second.current.after.hp).toBe(0);
    expect(first.current.before.broomInitiative).toBe(3);
    expect(JSON.stringify(game)).toBe(before);
  });
  it('keeps V2 recovery inactive in a legacy expedition and separates a new-expedition preview', () => {
    const game = fixture(1);
    const preview = previewWandRecipe(game, game.copies[0], recipe, 2, content);
    expect(preview.specializationDeferred).toBe(true);
    expect(preview.current.healingAfter).toBe(0);
    expect(preview.nextExpedition?.healingAfter).toBe(recipe.healing);
    expect(preview.current.after.hp).toBe(7);
    expect(preview.nextExpedition?.after.hp).toBe(game.copies[0].wizard.stats.maxHp);
  });
  it('retains immutable historical equipped values when recipes change', () => {
    const game = fixture();
    const historical = {
      ...game.inventory.equipment[0],
      kind: 'wand' as const,
      wood: 'birch' as const,
      core: 'phoenix' as const,
      multiplier: 1.15,
      powerBonus: 2,
    };
    const state = {
      ...game,
      inventory: { ...game.inventory, equipment: [historical, game.inventory.equipment[1]] },
    };
    const preview = previewWandRecipe(state, state.copies[0], recipe, 2, content);
    expect(preview.current.before.wandMultiplier).toBe(1.15);
    expect(preview.current.after.wandMultiplier).toBe(recipe.multiplier);
    expect(state.inventory.equipment[0]).toEqual(historical);
  });
  it('rejects a reference from another owner instead of previewing it as owned', () => {
    const game = fixture();
    expect(() =>
      previewWandRecipe(game, { ...game.copies[0], copyId: 'foreign' }, recipe, 2, content),
    ).toThrow();
  });
});

describe('A89 beans remain uncertain and snapshot-derived', () => {
  it('projects uneven public weights without assuming four equal flavours', () => {
    const table = {
      version: 91,
      entries: [
        { flavour: 'mint' as const, weight: 1 },
        { flavour: 'soap' as const, weight: 3 },
      ],
    };
    expect(beanRiskPreview(table)).toEqual({
      version: 91,
      possibilities: [
        { flavour: 'mint', probability: 0.25 },
        { flavour: 'soap', probability: 0.75 },
      ],
      penaltyProbability: 0.75,
    });
    expect(() =>
      beanRiskPreview({ ...table, entries: [{ flavour: 'mint', weight: 0 }] }),
    ).toThrow();
  });
  it('uses actual recovery and never revives a fallen carrier', () => {
    expect(mintRecoveryPreview({ hp: 99, maxHp: 100 })).toBe(1);
    expect(mintRecoveryPreview({ hp: 100, maxHp: 100 })).toBe(0);
    expect(mintRecoveryPreview({ hp: 0, maxHp: 100 })).toBe(0);
    expect(mintRecoveryPreview({ hp: 20, maxHp: 100 })).toBe(25);
  });
  for (const language of ['es', 'en'] as const) {
    it(`keeps the historic distribution and the chosen carrier’s capped recovery visible on demand in ${language}`, () => {
      const game = fixture();
      const run = {
        ...game.exploration.run,
        campaignSnapshot: {
          ...campaignFixture(),
          combatRules: {
            ...configuration.campaign.combatRules,
            beans: {
              version: 91,
              entries: [
                { flavour: 'mint' as const, weight: 1 },
                { flavour: 'soap' as const, weight: 3 },
              ],
            },
          },
        },
        members: [
          {
            ...game.exploration.run.members[0],
            unit: { ...game.exploration.run.members[0].unit, hp: 99, maxHp: 100 },
          },
        ],
      };
      const state = {
        ...game,
        exploration: { ...game.exploration, run },
        inventory: {
          ...game.inventory,
          products: [{ id: 'jar', kind: 'random-beans' as const, status: 'available' as const }],
        },
      };
      const props = {
        run,
        game: state,
        content,
        language,
        ready: true,
        assignments: [{ unitId: 'copy0', beanId: 'jar' }],
        onChange: () => {},
      };
      const html = renderToStaticMarkup(createElement(BeanAssignments, props));
      const percent = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US', {
        style: 'percent',
        maximumFractionDigits: 2,
      });
      expect(html).toContain(percent.format(0.75));
      expect(html).toContain(language === 'es' ? 'tabla 91' : 'table 91');
      expect(html).toContain(language === 'es' ? 'recuperaría 1 PV' : 'restore 1 HP');
      expect(html).toContain(language === 'es' ? 'Sabor desconocido' : 'Unknown flavour');
      expect(html).toContain(
        language === 'es'
          ? 'Descubrir un sabor no permite elegirlo'
          : 'Discovering a flavour does not let you choose it',
      );
      expect(html).not.toContain('product.bean-pepper');
      const boss = renderToStaticMarkup(createElement(BossSupplies, props));
      expect(boss).toContain(
        language === 'es' ? '1 asignado · sin consumir' : '1 assigned · not consumed',
      );
      expect(boss).toContain('data-bean-stock="1"');
      expect(boss).toContain('data-bean-draft="1"');
    });
    it(`keeps forging explicit and identifies duplicate references in ${language}`, () => {
      const initial = fixture();
      const game = { ...initial, inventory: { ...initial.inventory, crowns: 0 } };
      const html = renderToStaticMarkup(
        createElement(CommercePanel, {
          mode: 'workshop',
          content: content.commerce!,
          preparationContent: content,
          game,
          language,
          receipt: null,
          ready: true,
          pending: false,
          error: null,
          onForge: () => {},
          onVault: () => {},
          onRecover: () => {},
          connected: true,
          onPrepare: () => {},
          onLanguage: () => {},
        }),
      );
      expect(html.match(/data-forge-reference=/g)).toHaveLength(3);
      expect(html).toContain(language === 'es' ? 'copia 2' : 'copy 2');
      expect(html).toContain(
        language === 'es' ? 'Comparar no guarda cambios' : 'Comparing saves no changes',
      );
      expect(html).toContain(language === 'es' ? 'Actual → receta' : 'Current → recipe');
      // Currency is zero in this fixture: reference/inspection remain available but spending does not.
      expect(html.match(/<button[^>]*class="forge-action"[^>]*>/)?.[0]).toContain('disabled');
      expect(game.inventory.crowns).toBe(0);
    });
  }
  it('keeps the explicit action available to its owner when there are no copies to compare', () => {
    const game = { ...fixture(), copies: [] };
    const html = renderToStaticMarkup(
      createElement(WandRecipeComparison, {
        game,
        recipe,
        version: 2,
        language: 'en',
        children: createElement('button', {}, 'Forge deliberately'),
      }),
    );
    expect(html).toContain('An owned copy is needed to compare');
    expect(html).toContain('Forge deliberately');
  });
});
