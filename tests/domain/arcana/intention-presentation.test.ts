import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  ExpeditionIntentions,
  IntentionReminder,
} from '../../../src/arcana/presentation/ExpeditionIntentions';
import { projectPublicContent } from '../../../src/arcana/application/public-content';
import { ExpeditionPreparation } from '../../../src/arcana/presentation/ExpeditionPreparation';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { runInitial, campaignFixture } from './support/run-fixtures';
import type { GameState } from '../../../src/arcana/application/game';
const config = trialConfiguration();
const content = projectPublicContent(config.opening, config.campaign);
function game(): GameState {
  const base = runInitial();
  const campaign = campaignFixture();
  return {
    ...base,
    inventory: { ...base.inventory, crowns: 50 },
    exploration: {
      run: {
        id: 'old-run',
        campaignVersion: 1,
        graphVersion: 1,
        graph: campaign.graph,
        zoneId: 'bulevar',
        visited: campaign.graph.nodes.map((n) => n.id),
        status: 'won',
        members: base.copies.map((copy) => ({
          source: 'owned',
          unit: campaign.prepareOwned(copy),
        })),
      },
      victories: [],
      unlockedZones: ['bulevar'],
    },
  };
}
describe('A65 intention presentation', () => {
  for (const language of ['es', 'en'] as const) {
    it(`renders an honest, optional bean attempt in ${language}`, () => {
      const html = renderToStaticMarkup(
        createElement(ExpeditionIntentions, {
          game: game(),
          content,
          language,
          ready: true,
          onChoose: () => {},
        }),
      );
      expect(html).toContain('data-intention-choice="bean"');
      expect(html).toContain(language === 'es' ? 'Puede repetir sabor' : 'Its flavour may repeat');
      expect(html).toContain(
        language === 'es' ? 'Necesitas comprar una gragea' : 'Buy a bean first',
      );
      expect(html).not.toMatch(/<(input|select|textarea)\b/);
      expect(html).not.toContain('role="status"');
    });
    it(`shows persisted selection and a cancellation action in ${language}`, () => {
      const base = game();
      const selected = {
        ...base,
        exploration: {
          ...base.exploration!,
          intention: {
            version: 1 as const,
            afterRunId: 'old-run',
            runId: null,
            choice: { kind: 'bean' as const },
          },
        },
      };
      const html = renderToStaticMarkup(
        createElement(ExpeditionIntentions, {
          game: selected,
          content,
          language,
          ready: true,
          onChoose: () => {},
        }),
      );
      expect(html).toContain('aria-pressed="true"');
      expect(html).not.toContain('data-intention-status="selected"');
      expect(html).toContain(language === 'es' ? 'Dejar esta intención' : 'Leave this intention');
      expect(html).toContain('<details');
    });
  }
  it('keeps an invalidated selection visible rather than silently claiming it remains viable', () => {
    const base = game();
    const selected = {
      ...base,
      inventory: { ...base.inventory, crowns: 0 },
      exploration: {
        ...base.exploration!,
        intention: {
          version: 1 as const,
          afterRunId: 'old-run',
          runId: null,
          choice: { kind: 'bean' as const },
        },
      },
    };
    const html = renderToStaticMarkup(
      createElement(IntentionReminder, { game: selected, content, language: 'es' }),
    );
    expect(html).toContain('data-intention-status="unavailable"');
    expect(html).toContain('La preparación disponible ha cambiado');
  });
  it('keeps the selected intention visible when explicitly preparing the next expedition', () => {
    const base = game();
    const selected = {
      ...base,
      exploration: {
        ...base.exploration!,
        intention: {
          version: 1 as const,
          afterRunId: 'old-run',
          runId: null,
          choice: { kind: 'bean' as const },
        },
      },
    };
    const html = renderToStaticMarkup(
      createElement(ExpeditionPreparation, {
        game: selected,
        catalog: content.catalog,
        content,
        language: 'en',
        ready: true,
        onTeam: () => {},
        onEquip: () => {},
        onStart: () => {},
      }),
    );
    expect(html).toContain('data-intention-status="selected"');
    expect(html).toContain('Try a flavour');
  });
});
