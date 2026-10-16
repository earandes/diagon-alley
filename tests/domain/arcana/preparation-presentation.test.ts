import { afterEach, describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ExpeditionPreparation } from '../../../src/arcana/presentation/ExpeditionPreparation';
import { CollectionPanel } from '../../../src/arcana/presentation/CollectionPanel';
import { JourneyCabinet } from '../../../src/arcana/presentation/JourneyCabinet';
import { FlavourCabinet } from '../../../src/arcana/presentation/FlavourCabinet';
import { campaignFixture, runInitial } from './support/run-fixtures';
import { catalogFixture } from './support/fixtures';
import type { Run } from '../../../src/arcana/domain/exploration/run';

afterEach(() => vi.unstubAllGlobals());
describe('A59 separation of discovery and explicit expedition preparation', () => {
  for (const language of ['es', 'en'] as const) {
    it(`offers owned cards without selecting the starter or starting a run in ${language}`, () => {
      const game = runInitial(),
        before = JSON.stringify(game);
      const onStart = vi.fn(),
        onTeam = vi.fn(),
        onEquip = vi.fn();
      const markup = renderToStaticMarkup(
        createElement(ExpeditionPreparation, {
          game,
          catalog: catalogFixture,
          language,
          ready: true,
          onStart,
          onTeam,
          onEquip,
        }),
      );
      expect(markup).toContain('data-expedition-preparation="new"');
      expect(markup.match(/data-copy-id=/g)).toHaveLength(game.copies.length);
      expect(markup.match(/aria-pressed="false"/g)).toHaveLength(game.copies.length);
      expect(markup.match(/<button[^>]*data-preparation-confirm[^>]*>/)?.[0]).toContain('disabled');
      expect(markup).not.toContain('class="preparation-inspection"');
      expect(markup).not.toContain('class="preparation-gear"');
      expect(markup.match(/data-preparation-inspect=/g)).toHaveLength(game.copies.length);
      expect(markup).toContain('class="preparation-help"');
      expect(onStart).not.toHaveBeenCalled();
      expect(onTeam).not.toHaveBeenCalled();
      expect(onEquip).not.toHaveBeenCalled();
      expect(JSON.stringify(game)).toBe(before);
    });
    it(`keeps temporary allies visibly distinct and inside the five-place formation in ${language}`, () => {
      const game = runInitial(),
        config = campaignFixture();
      const run: Run = {
        id: 'run',
        status: 'active',
        campaignVersion: config.version,
        zoneId: config.zoneId,
        graphVersion: config.graph.version,
        graph: config.graph,
        visited: [],
        members: [
          { source: 'owned', unit: config.prepareOwned(game.copies[0]) },
          {
            source: 'temporary',
            unit: { ...config.prepareOwned(game.copies[1]), id: 'temporary-a' },
          },
          {
            source: 'temporary',
            unit: { ...config.prepareOwned(game.copies[2]), id: 'temporary-b' },
          },
        ],
      };
      const markup = renderToStaticMarkup(
        createElement(ExpeditionPreparation, {
          game: { ...game, exploration: { run, victories: [], unlockedZones: [] } },
          catalog: catalogFixture,
          language,
          ready: true,
          onStart: vi.fn(),
          onTeam: vi.fn(),
          onEquip: vi.fn(),
        }),
      );
      expect(markup).toContain('data-expedition-preparation="active"');
      expect(markup.match(/class="preparation-position preparation-temporary"/g)).toHaveLength(2);
      expect(markup).toContain(
        language === 'es' ? 'No son copias de tu álbum.' : 'They are not owned album copies.',
      );
      expect(markup).toContain('3/5');
      expect(markup.match(/class="preparation-position/g)).toHaveLength(5);
      expect(markup).not.toContain('class="preparation-inspection"');
      expect(markup).not.toContain('class="preparation-temporary-hint"');
    });
    it(`previews the recorded condition of a reserve instead of healing its card in ${language}`, () => {
      const game = runInitial(),
        config = campaignFixture();
      const reserve = {
        source: 'owned' as const,
        unit: { ...config.prepareOwned(game.copies[1]), hp: 7, mana: 3 },
      };
      const run: Run = {
        id: 'condition-run',
        status: 'active',
        campaignVersion: config.version,
        zoneId: config.zoneId,
        graphVersion: config.graph.version,
        graph: config.graph,
        visited: [],
        members: [{ source: 'owned', unit: config.prepareOwned(game.copies[0]) }],
        reserves: [reserve],
      };
      const state = { ...game, exploration: { run, victories: [], unlockedZones: [] } },
        before = JSON.stringify(state);
      const markup = renderToStaticMarkup(
        createElement(ExpeditionPreparation, {
          game: state,
          catalog: catalogFixture,
          language,
          ready: true,
          onStart: vi.fn(),
          onTeam: vi.fn(),
          onEquip: vi.fn(),
        }),
      );
      expect(markup).toContain(`7/${reserve.unit.maxHp}`);
      expect(markup).toContain(`3/${reserve.unit.maxMana}`);
      expect(markup).not.toContain('class="preparation-gear"');
      expect(JSON.stringify(state)).toBe(before);
    });
    it(`keeps the album read-only and the future region unavailable in ${language}`, () => {
      vi.stubGlobal('matchMedia', () => ({ matches: true }));
      const game = runInitial(),
        before = JSON.stringify(game);
      const album = renderToStaticMarkup(
        createElement(CollectionPanel, { game, catalog: catalogFixture, language }),
      );
      expect(album).not.toContain('copy-inspector');
      expect(album).not.toContain('gear-control');
      expect(album).not.toContain('saveWand');
      expect(album).toContain('album-card-inspect');
      const journey = renderToStaticMarkup(
        createElement(JourneyCabinet, {
          game: {
            ...game,
            exploration: { run: null, victories: [], unlockedZones: ['pasaje', 'bosque'] },
          },
          language,
          onMap: vi.fn(),
          onCollection: vi.fn(),
          onShop: vi.fn(),
          onVault: vi.fn(),
        }),
      );
      expect(journey).toContain('<div class="journey-atlas-page" data-future="true">');
      expect(journey).toContain(
        language === 'es' ? 'ruta aún no disponible' : 'route not yet available',
      );
      const flavours = renderToStaticMarkup(createElement(FlavourCabinet, { game, language }));
      expect(flavours).toContain('aria-haspopup="dialog"');
      expect(flavours).not.toContain('<details');
      expect(JSON.stringify(game)).toBe(before);
    });
  }
});
