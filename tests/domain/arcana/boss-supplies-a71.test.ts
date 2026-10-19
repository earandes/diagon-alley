import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { BossSupplies } from '../../../src/arcana/presentation/BossSupplies';
import { runInitial, campaignFixture } from './support/run-fixtures';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { projectPublicContent } from '../../../src/arcana/application/public-content';
import type { Run } from '../../../src/arcana/domain/exploration/run';
const config = trialConfiguration();
const content = projectPublicContent(config.opening, config.campaign);
describe('A71 jar stock is distinct from a provisional assignment', () => {
  for (const language of ['es', 'en'] as const)
    it(`shows available units, valid draft and no required fraction in ${language}`, () => {
      const game = runInitial();
      const campaign = campaignFixture();
      const run: Run = {
        id: 'supplies',
        status: 'active',
        campaignVersion: 1,
        zoneId: 'bulevar',
        graphVersion: 1,
        graph: campaign.graph,
        visited: [],
        members: game.copies.map((c) => ({ source: 'owned', unit: campaign.prepareOwned(c) })),
      };
      const state = {
        ...game,
        inventory: {
          ...game.inventory,
          products: [
            { id: 'jar', kind: 'random-beans' as const, status: 'available' as const },
            { id: 'used', kind: 'random-beans' as const, status: 'consumed' as const },
          ],
        },
      };
      const assignments = [
        { unitId: run.members[0].unit.id, beanId: 'jar' },
        { unitId: 'absent', beanId: 'used' },
      ];
      const before = JSON.stringify({ state, run, assignments });
      const html = renderToStaticMarkup(
        createElement(BossSupplies, {
          game: state,
          run,
          content,
          language,
          ready: true,
          assignments,
          onChange: () => {},
        }),
      );
      expect(html).toContain('data-bean-stock="1"');
      expect(html).toContain('data-bean-draft="1"');
      expect(html).not.toMatch(/1\s*\/\s*1/);
      // The caption now names both the valid quantity and its unconsumed draft state.
      // Keep an exact localized assertion rather than accepting any generic status text.
      expect(html).toContain(
        language === 'es' ? '1 asignado · sin consumir' : '1 assigned · not consumed',
      );
      expect(html).not.toContain('<input');
      expect(JSON.stringify({ state, run, assignments })).toBe(before);
    });
});
