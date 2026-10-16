import { describe, expect, it } from 'vitest';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { projectPublicContent } from '../../../src/arcana/application/public-content';
import { runInitial, campaignFixture } from './support/run-fixtures';
import { starterEquipment } from '../../../src/arcana/domain/economy/equipment';
import {
  preparationUnit,
  preparationFormation,
  preparationSynergies,
  previewEquipment,
  assignBean,
  validBeanAssignments,
} from '../../../src/arcana/presentation/contextual-preparation';
import type { Run } from '../../../src/arcana/domain/exploration/run';

const config = trialConfiguration();
const content = projectPublicContent(config.opening, config.campaign);
const fixture = () => {
  const game = runInitial();
  const campaign = campaignFixture();
  const run: Run = {
    id: 'run',
    status: 'active',
    campaignVersion: 1,
    zoneId: 'bulevar',
    graphVersion: 1,
    graph: campaign.graph,
    visited: [],
    members: game.copies.map((copy) => ({
      source: 'owned',
      unit: { ...campaign.prepareOwned(copy), affinity: 'alchemy' as const },
    })),
  };
  return { ...game, exploration: { run, victories: [], unlockedZones: [] } };
};

describe('A63 contextual preparation is a read-only projection', () => {
  it('preserves reserve wounds and snapshot affinity instead of re-creating a healed copy', () => {
    const game = fixture();
    const reserve = {
      ...game.exploration.run.members[1],
      unit: {
        ...game.exploration.run.members[1].unit,
        hp: 7,
        mana: 3,
        affinity: 'shadows' as const,
      },
    };
    const state = {
      ...game,
      exploration: {
        ...game.exploration,
        run: {
          ...game.exploration.run,
          members: game.exploration.run.members.slice(0, 1),
          reserves: [reserve],
        },
      },
    };
    const before = JSON.stringify(state);
    expect(preparationUnit(state, state.copies[1], content)).toMatchObject({
      hp: 7,
      mana: 3,
      affinity: 'shadows',
    });
    expect(JSON.stringify(state)).toBe(before);
  });
  it('derives exact Alchemy activation from standing selected members, including temporaries', () => {
    const game = fixture();
    const two = preparationFormation(game, ['copy0', 'copy1'], content);
    const three = preparationFormation(game, ['copy0', 'copy1', 'copy2'], content);
    expect(preparationSynergies(two, content.combatRules)).toEqual([]);
    expect(preparationSynergies(three, content.combatRules)).toEqual([
      { affinity: 'alchemy', members: 3, threshold: 3, value: content.combatRules.alchemyHealing },
    ]);
    expect(
      preparationSynergies(
        three.map((m, i) => (i === 2 ? { ...m, unit: { ...m.unit, hp: 0 } } : m)),
        content.combatRules,
      ),
    ).toEqual([]);
    const temporary = {
      source: 'temporary' as const,
      unit: { ...game.exploration.run.members[2].unit, id: 'pact-ally' },
    };
    const state = {
      ...game,
      exploration: {
        ...game.exploration,
        run: {
          ...game.exploration.run,
          members: [...game.exploration.run.members.slice(0, 2), temporary],
        },
      },
    };
    expect(preparationFormation(state, ['copy0', 'copy1'], content).map((m) => m.unit.id)).toEqual([
      'copy0',
      'copy1',
      'pact-ally',
    ]);
  });
  it('does not invent an affinity when public legacy content has no profile', () => {
    const game = runInitial();
    expect(preparationUnit(game, game.copies[0]).affinity).toBe(null);
  });
  it('previews copy-specific equipment via shared functions and never writes or heals', () => {
    const game = fixture();
    const state = {
      ...game,
      inventory: { ...game.inventory, equipment: starterEquipment() },
      team: {
        copyIds: ['copy0'],
        loadouts: [{ copyId: 'copy0', wandId: 'starter:wand', broomId: 'starter:broom' }],
      },
    };
    const before = JSON.stringify(state);
    const preview = previewEquipment(state, state.copies[1], 'wand', 'starter:wand', content);
    expect(preview.after.wandPowerBonus).toBe(2);
    expect(preview.before.wandPowerBonus).toBe(0);
    expect(preview.powerAfter - preview.powerBefore).toBe(2);
    expect(state.team.loadouts[0].wandId).toBe('starter:wand');
    expect(JSON.stringify(state)).toBe(before);
  });
});
describe('A63 bean assignment draft', () => {
  it('moves one jar to one recipient and replaces that recipient’s prior jar explicitly', () => {
    const a = assignBean(
      [
        { unitId: 'a', beanId: 'one' },
        { unitId: 'b', beanId: 'two' },
      ],
      'one',
      'b',
    );
    expect(a).toEqual([{ unitId: 'b', beanId: 'one' }]);
    expect(assignBean(a, 'one', 'b')).toEqual([]);
  });
  it('accepts only living formation members and available products, excluding reserves and duplicates', () => {
    const game = fixture();
    const state = {
      ...game,
      inventory: {
        ...game.inventory,
        products: [
          { id: 'one', kind: 'random-beans' as const, status: 'available' as const },
          { id: 'spent', kind: 'random-beans' as const, status: 'consumed' as const },
        ],
      },
    };
    const run = {
      ...game.exploration.run,
      members: game.exploration.run.members.map((m, i) =>
        i === 1 ? { ...m, unit: { ...m.unit, hp: 0 } } : m,
      ),
    };
    expect(
      validBeanAssignments(
        [
          { unitId: 'copy0', beanId: 'one' },
          { unitId: 'copy1', beanId: 'one' },
          { unitId: 'reserve', beanId: 'one' },
          { unitId: 'copy2', beanId: 'spent' },
        ],
        run,
        state,
      ),
    ).toEqual([{ unitId: 'copy0', beanId: 'one' }]);
  });
});

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { BeanAssignments } from '../../../src/arcana/presentation/BeanAssignments';
import { ExpeditionPreparation } from '../../../src/arcana/presentation/ExpeditionPreparation';

describe('A63 visible contextual controls', () => {
  for (const language of ['es', 'en'] as const) {
    it(`shows one jar shelf and all five carriers including fallen in ${language}`, () => {
      const game = fixture();
      const unit = game.exploration.run.members[0].unit;
      const state = {
        ...game,
        inventory: {
          ...game.inventory,
          products: [{ id: 'one', kind: 'random-beans' as const, status: 'available' as const }],
        },
      };
      const run = {
        ...game.exploration.run,
        members: [
          ...game.exploration.run.members,
          { source: 'temporary' as const, unit: { ...unit, id: 'temporary' } },
          { source: 'owned' as const, unit: { ...unit, id: 'fallen', hp: 0 } },
        ],
      };
      const markup = renderToStaticMarkup(
        createElement(BeanAssignments, {
          game: state,
          run,
          content,
          language,
          ready: true,
          assignments: [],
          onChange: () => {},
        }),
      );
      expect(markup.match(/data-bean-id=/g)).toHaveLength(1);
      expect(markup.match(/data-bean-unit=/g)).toHaveLength(5);
      expect(markup.match(/<button[^>]*data-bean-unit="fallen"[^>]*>/)?.[0]).toContain('disabled');
      expect(markup).toContain(language === 'es' ? 'Solo esta expedición' : 'This expedition only');
      expect(markup).toContain('data-active-synergy="alchemy"');
      expect(markup).not.toContain('visual-choice-tray');
    });
    it(`offers explicit reachable combat or manual return without inventing a route in ${language}`, () => {
      const game = fixture();
      const props = {
        game,
        catalog: content.catalog,
        content,
        language,
        ready: true,
        onTeam: () => {},
        onEquip: () => {},
        onStart: () => {},
        context: 'beans' as const,
        onReturnToMap: () => {},
        onCombatNode: () => {},
      };
      const without = renderToStaticMarkup(createElement(ExpeditionPreparation, props));
      const withCombat = renderToStaticMarkup(
        createElement(ExpeditionPreparation, {
          ...props,
          combatChoices: [{ id: 'duel', kind: 'duel' }],
        }),
      );
      expect(without).not.toContain('data-prepare-combat=');
      expect(without).toContain(language === 'es' ? 'Volver a la ruta' : 'Return to the route');
      expect(withCombat).toContain('data-prepare-combat="duel"');
    });
  }
});
