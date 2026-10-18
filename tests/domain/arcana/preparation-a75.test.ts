import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { projectPublicContent } from '../../../src/arcana/application/public-content';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { campaignFixture, runInitial } from './support/run-fixtures';
import type { Run } from '../../../src/arcana/domain/exploration/run';
import {
  effectivePreparationRules,
  filterPreparationCopies,
  preparationUnit,
  preparationSynergies,
} from '../../../src/arcana/presentation/contextual-preparation';
import { BeanAssignments } from '../../../src/arcana/presentation/BeanAssignments';
import { ExpeditionPreparation } from '../../../src/arcana/presentation/ExpeditionPreparation';
import { EncounterPreparation } from '../../../src/arcana/presentation/EncounterPreparation';
import type { EncounterOffer } from '../../../src/arcana/domain/exploration/encounter-trades';

const config = trialConfiguration();
const content = projectPublicContent(config.opening, config.campaign);
function fixture() {
  const game = runInitial();
  const campaign = campaignFixture();
  const snapshot = {
    ...campaign,
    combatRules: {
      ...content.combatRules,
      alchemyHealing: 17,
      beans: { version: 77, entries: [{ flavour: 'mint' as const, weight: 1 }] },
    },
  };
  const run: Run = {
    id: 'a75-run',
    status: 'active',
    campaignVersion: campaign.version,
    zoneId: campaign.zoneId,
    graphVersion: campaign.graph.version,
    graph: campaign.graph,
    visited: [],
    campaignSnapshot: snapshot,
    members: game.copies.map((copy) => ({
      source: 'owned',
      unit: { ...campaign.prepareOwned(copy), affinity: 'alchemy' },
    })),
  };
  return { ...game, exploration: { run, victories: [], unlockedZones: [] } };
}
describe('A75 effective preparation and collection navigation', () => {
  it('uses the active snapshot, with explicit live fallback for historical and new expeditions', () => {
    const game = fixture();
    expect(effectivePreparationRules(game.exploration.run, content.combatRules)).toBe(
      game.exploration.run.campaignSnapshot!.combatRules,
    );
    expect(
      effectivePreparationRules(
        { ...game.exploration.run, campaignSnapshot: undefined },
        content.combatRules,
      ),
    ).toEqual({ ...content.combatRules, houseSynergies: undefined, bonds: undefined });
    expect(effectivePreparationRules(null, content.combatRules)).toBe(content.combatRules);
    expect(
      effectivePreparationRules({ ...game.exploration.run, status: 'won' }, content.combatRules),
    ).toBe(content.combatRules);
  });
  it('preserves recorded affinities; unrecorded copies use the same live profile as current team authority', () => {
    const game = fixture();
    const state = {
      ...game,
      exploration: {
        ...game.exploration,
        run: { ...game.exploration.run, members: game.exploration.run.members.slice(1) },
      },
    };
    expect(preparationUnit(state, game.copies[0], content).affinity).toBe(
      content.campaign.ownedAffinities?.[game.copies[0].wizard.id],
    );
    expect(preparationUnit(game, game.copies[0], content).affinity).toBe('alchemy');
  });
  it('projects all three synergy values from the effective rules without replacing shared thresholds', () => {
    const game = fixture();
    const snapshot = {
      ...game.exploration.run,
      campaignSnapshot: {
        ...game.exploration.run.campaignSnapshot!,
        combatRules: {
          ...content.combatRules,
          alchemyHealing: 17,
          fireBurnDamage: 19,
          shadowInitiative: 23,
        },
      },
    };
    const rules = effectivePreparationRules(snapshot, content.combatRules);
    for (const [affinity, value] of [
      ['alchemy', 17],
      ['fire', 19],
      ['shadows', 23],
    ] as const) {
      const members = game.exploration.run.members.map((member) => ({
        ...member,
        unit: { ...member.unit, affinity },
      }));
      expect(preparationSynergies(members, rules)[0]).toMatchObject({ affinity, value });
    }
  });
  it('filters thirty instances without merging duplicates or changing selection, loadouts or condition', () => {
    const game = fixture();
    const copies = Array.from({ length: 30 }, (_, index) => ({
      ...game.copies[index % game.copies.length],
      copyId: `owned-${index}`,
    }));
    const state = { ...game, copies };
    const before = JSON.stringify(state);
    const all = filterPreparationCopies(state, content, {});
    expect(all).toHaveLength(30);
    expect(new Set(all.map((copy) => copy.copyId)).size).toBe(30);
    const first = copies[0].wizard.id;
    expect(
      filterPreparationCopies(state, content, { wizardId: first }).every(
        (copy) => copy.wizard.id === first,
      ),
    ).toBe(true);
    expect(filterPreparationCopies(state, content, { affinity: 'fire', wizardId: first })).toEqual(
      [],
    );
    expect(filterPreparationCopies(state, content, {})).toEqual(copies);
    expect(JSON.stringify(state)).toBe(before);
  });
  for (const language of ['es', 'en'] as const) {
    it(`projects snapshot synergy and bean probabilities in ${language} without writes`, () => {
      const game = fixture();
      const before = JSON.stringify(game);
      const beans = renderToStaticMarkup(
        createElement(BeanAssignments, {
          run: game.exploration.run,
          game,
          content,
          language,
          ready: true,
          assignments: [],
          onChange: () => {},
        }),
      );
      expect(beans).toContain('17');
      expect(beans).toContain('100');
      expect(beans).not.toContain('product.bean-pepper');
      const prep = renderToStaticMarkup(
        createElement(ExpeditionPreparation, {
          game,
          content,
          catalog: content.catalog,
          language,
          ready: true,
          onTeam: () => {},
          onEquip: () => {},
          onStart: () => {},
        }),
      );
      expect(prep).toContain(language === 'es' ? '+17 PV' : '+17 HP');
      expect(JSON.stringify(game)).toBe(before);
    });
    it(`distinguishes identical encounter instances before and after choosing in ${language}`, () => {
      const game = fixture();
      const unit = {
        ...game.exploration.run.members[0].unit,
        hp: 30,
        maxHp: 100,
        mana: 50,
        maxMana: 100,
      };
      const run: Run = {
        ...game.exploration.run,
        members: [
          { source: 'owned', unit: { ...unit, id: 'own-copy' } },
          { source: 'temporary', unit: { ...unit, id: 'pact-copy' } },
        ],
      };
      const offer: EncounterOffer = {
        id: 'a75-healer',
        npcId: 'moon-herbalist',
        kind: 'healer',
        options: [
          { id: 'a75-deal', scope: 'unit', restore: 'hp', fraction: 0.4, costFraction: 0.2 },
          { id: 'a75-team', scope: 'team', restore: 'hp', fraction: 0.15, costFraction: 0.1 },
        ],
      };
      const html = renderToStaticMarkup(
        createElement(EncounterPreparation, {
          offer,
          run,
          options: {
            encounterAction: 'trade',
            encounterChoiceId: 'a75-deal',
            encounterUnitId: 'pact-copy',
          },
          onChange: () => {},
          language,
          ready: true,
        }),
      );
      expect(html).toContain(
        language === 'es' ? 'puesto 1, Copia propia' : 'position 1, Owned copy',
      );
      expect(html).toContain(
        language === 'es' ? 'Puesto 2 · Solo esta expedición' : 'Position 2 · This expedition only',
      );
      expect(html).toContain('data-encounter-preview-unit="pact-copy"');
      expect(html).toContain(language === 'es' ? '>Propio</span>' : '>Owned</span>');
      expect(html).toContain(language === 'es' ? '>Temporal</span>' : '>Temporary</span>');
    });
  }
});
