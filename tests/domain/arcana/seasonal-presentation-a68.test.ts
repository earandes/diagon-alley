import { afterEach, describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  SeasonalEvent,
  SeasonalWindowGallery,
  seasonalDisplayEdition,
} from '../../../src/arcana/presentation/SeasonalEvent';
import { seasonalEdition } from '../../../src/arcana/infrastructure/content/seasonal-content';
import { setContentPack } from '../../../src/arcana/presentation/content-packs/active';
import { seasonalText } from '../../../src/arcana/presentation/seasonal-messages';
import { runInitial } from './support/run-fixtures';

afterEach(() => setContentPack('diagon-alley'));

describe('A68 seasonal presentation read model', () => {
  for (const language of ['es', 'en'] as const)
    for (const pack of ['diagon-alley', 'arcana'] as const) {
      it(`shows confirmed progress and stable objectives separately from character collection in ${pack}/${language}`, () => {
        setContentPack(pack);
        const complete = [seasonalEdition.objectiveIds[0]];
        const before = JSON.stringify(complete);
        const html = renderToStaticMarkup(
          createElement(SeasonalWindowGallery, {
            edition: seasonalEdition,
            completed: complete,
            language,
            participating: true,
          }),
        );
        expect(html.match(/data-seasonal-window=/g)).toHaveLength(3);
        expect(html.match(/data-lit="true"/g)).toHaveLength(1);
        expect(html).toContain(
          'data-seasonal-window="workshop-window" data-lit="false" aria-current="step"',
        );
        expect(html).toContain(seasonalText(language, 'progress', { done: 1, total: 3 }));
        expect(html).toContain(seasonalText(language, 'sweetshopWindow'));
        expect(html).toContain(seasonalText(language, 'workshopWindow'));
        expect(html).toContain(seasonalText(language, 'vaultWindow'));
        for (const place of ['confectionery', 'workshop', 'vault'])
          expect(html).toContain(
            `data-art="${pack === 'diagon-alley' ? 'shopfront' : 'scene'}.${place}"`,
          );
        expect(html).not.toContain('<button');
        expect(JSON.stringify(complete)).toBe(before);
      });
      it(`offers read-only discovery without an automatic participation command in ${pack}/${language}`, () => {
        setContentPack(pack);
        const state = runInitial(),
          before = JSON.stringify(state),
          onAction = vi.fn();
        const html = renderToStaticMarkup(
          createElement(SeasonalEvent, {
            state,
            language,
            serverTime: seasonalEdition.startsAt,
            onAction,
            onPrepareRoute: vi.fn(),
            reducedMotion: true,
          }),
        );
        expect(html).toContain('data-seasonal-open="true"');
        expect(html).toContain(seasonalText(language, 'invitation'));
        expect(html).toContain('data-reduced="true"');
        expect(html).not.toContain('<dialog');
        expect(onAction).not.toHaveBeenCalled();
        expect(JSON.stringify(state)).toBe(before);
      });
    }
  it('keeps an unfinished frozen edition reachable after a new calendar is published', () => {
    const next = { ...seasonalEdition, editionId: 'halloween-2027' };
    const seasonal = {
      participations: [
        {
          edition: seasonalEdition,
          joinedAt: seasonalEdition.startsAt,
          boundRunIds: [],
          opportunities: [],
          completedObjectiveIds: [],
        },
      ],
      keepsakes: [],
    };
    expect(seasonalDisplayEdition(next, seasonal, seasonalEdition.startsAt)).toEqual(
      seasonalEdition,
    );
    expect(
      seasonalDisplayEdition(next, seasonal, seasonalEdition.startsAt, next.editionId),
    ).toEqual(next);
    expect(
      seasonalDisplayEdition(
        next,
        seasonal,
        seasonalEdition.completionEndsAt,
        seasonalEdition.editionId,
      ),
    ).toEqual(seasonalEdition);
    expect(seasonalDisplayEdition(next, seasonal, seasonalEdition.completionEndsAt)).toEqual(next);
  });
});
