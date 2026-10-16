import { afterEach, describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { EncounterPreparation } from '../../../src/arcana/presentation/EncounterPreparation';
import { EncounterTradeOutcome } from '../../../src/arcana/presentation/EncounterTradeOutcome';
import { setContentPack } from '../../../src/arcana/presentation/content-packs/active';
import {
  previewEncounterTrade,
  type EncounterOffer,
} from '../../../src/arcana/domain/exploration/encounter-trades';
import type { Run } from '../../../src/arcana/domain/exploration/run';
import type { NodeOptions } from '../../../src/arcana/application/run-contracts';
import { campaignFixture, runInitial } from './support/run-fixtures';

const healer: EncounterOffer = {
  id: 'healer-test',
  npcId: 'moon-herbalist',
  kind: 'healer',
  options: [
    { id: 'single-test', scope: 'unit', restore: 'hp', fraction: 0.4, costFraction: 0.2 },
    { id: 'team-test', scope: 'team', restore: 'hp', fraction: 0.15, costFraction: 0.1 },
  ],
};
function model(): Run {
  const campaign = campaignFixture(),
    game = runInitial();
  return {
    id: 'encounter-test',
    campaignVersion: campaign.version,
    zoneId: campaign.zoneId,
    graphVersion: campaign.graph.version,
    graph: campaign.graph,
    status: 'active',
    visited: [],
    members: game.copies.map((copy, index) => ({
      source: index === 1 ? 'temporary' : 'owned',
      unit: {
        ...campaign.prepareOwned(copy),
        id: `unit-${index}`,
        wizardId: index === 1 ? 'rune-weaver' : 'apprentice',
        hp: index === 2 ? 0 : 50,
        maxHp: 100,
        mana: 30,
        maxMana: 40,
      },
    })),
  };
}
afterEach(() => {
  setContentPack('diagon-alley');
  vi.unstubAllGlobals();
});
describe('A67 character encounter presentation', () => {
  for (const language of ['es', 'en'] as const) {
    for (const pack of ['diagon-alley', 'arcana'] as const) {
      it(`keeps selection read-only and previews shared exact values in ${pack}/${language}`, () => {
        vi.stubGlobal('matchMedia', () => ({ matches: true }));
        setContentPack(pack);
        const run = model(),
          before = JSON.stringify(run),
          onChange = vi.fn();
        const render = (options: NodeOptions) =>
          renderToStaticMarkup(
            createElement(EncounterPreparation, {
              offer: healer,
              run,
              options,
              onChange,
              language,
              ready: true,
            }),
          );
        const initial = render({});
        expect(initial.match(/data-encounter-choice=/g)).toHaveLength(3);
        expect(initial).not.toContain('aria-pressed="true"');
        expect(initial).not.toContain('data-encounter-unit=');
        expect(initial).toContain(language === 'es' ? 'Seguir de largo' : 'Walk on');
        const target = render({ encounterAction: 'trade', encounterChoiceId: 'single-test' });
        expect(target.match(/data-encounter-unit=/g)).toHaveLength(3);
        expect(target.match(/<button[^>]*data-encounter-unit="unit-2"[^>]*>/)?.[0]).toContain(
          'disabled',
        );
        const selected = render({
          encounterAction: 'trade',
          encounterChoiceId: 'single-test',
          encounterUnitId: 'unit-1',
        });
        expect(selected).toContain('data-encounter-preview-ready="true"');
        expect(selected).toContain('50 → 90');
        expect(selected).toContain('30 → 22');
        const group = render({ encounterAction: 'trade', encounterChoiceId: 'team-test' });
        expect(group).not.toContain('data-encounter-unit=');
        expect(group).toContain('50 → 65');
        expect(group).toContain('30 → 26');
        const pass = render({ encounterAction: 'pass' });
        expect(pass).not.toContain('encounter-preview-unit');
        expect(onChange).not.toHaveBeenCalled();
        expect(JSON.stringify(run)).toBe(before);
      });
    }
    it(`preserves quarter-point condition values in previews and saved outcomes in ${language}`, () => {
      const original = model();
      const run: Run = {
        ...original,
        members: original.members.map((member, index) =>
          index === 1 ? { ...member, unit: { ...member.unit, maxHp: 95, hp: 47.5 } } : member,
        ),
      };
      const options: NodeOptions = { encounterAction: 'trade', encounterChoiceId: 'team-test' };
      const preview = previewEncounterTrade(run.members, healer, 'team-test');
      const expected = language === 'es' ? '47,5 → 61,75' : '47.5 → 61.75';
      const preparation = renderToStaticMarkup(
        createElement(EncounterPreparation, {
          offer: healer,
          run,
          options,
          onChange: vi.fn(),
          language,
          ready: true,
        }),
      );
      expect(preparation).toContain(expected);
      const outcome = renderToStaticMarkup(
        createElement(EncounterTradeOutcome, {
          trade: { offer: healer, choiceId: 'team-test', vitals: preview.vitals },
          language,
          members: run.members,
        }),
      );
      expect(outcome).toContain(expected);
    });
    it(`explains unavailable benefit and condition without removing pass in ${language}`, () => {
      const run = model();
      const full: Run = {
        ...run,
        members: run.members.map((member) => ({ ...member, unit: { ...member.unit, hp: 100 } })),
      };
      const html = renderToStaticMarkup(
        createElement(EncounterPreparation, {
          offer: healer,
          run: full,
          options: {},
          onChange: vi.fn(),
          language,
          ready: true,
        }),
      );
      expect(html.match(/<button[^>]*data-encounter-choice="single-test"[^>]*>/)?.[0]).toContain(
        'disabled',
      );
      expect(html).toContain(language === 'es' ? 'Ya está al máximo' : 'Already at maximum');
      expect(html.match(/<button[^>]*data-encounter-choice="pass"[^>]*>/)?.[0]).not.toContain(
        'disabled',
      );
    });
    it(`projects saved outcome without recalculation or private roster dependencies in ${language}`, () => {
      const run = model(),
        preview = previewEncounterTrade(run.members, healer, 'single-test', 'unit-0');
      const trade = {
        offer: healer,
        choiceId: 'single-test',
        unitId: 'unit-0',
        vitals: preview.vitals,
      };
      const noRoster = renderToStaticMarkup(
        createElement(EncounterTradeOutcome, { trade, language }),
      );
      expect(noRoster).toContain(language === 'es' ? 'Integrante 1' : 'Companion 1');
      expect(noRoster).toContain('50 → 90');
      const named = renderToStaticMarkup(
        createElement(EncounterTradeOutcome, { trade, language, members: run.members }),
      );
      expect(named).toContain('Harry Potter');
      expect(named).not.toContain('Ginny Weasley');
      expect(named).not.toContain('unit-2');
    });
  }
});
