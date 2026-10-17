import { afterEach, describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { BossPrelude } from '../../../src/arcana/presentation/BossPrelude';
import { BossPartyStage } from '../../../src/arcana/presentation/BossPartyStage';
import { setContentPack } from '../../../src/arcana/presentation/content-packs/active';
import { runInitial, campaignFixture } from './support/run-fixtures';
import type { Run } from '../../../src/arcana/domain/exploration/run';
import { starterEquipment } from '../../../src/arcana/domain/economy/equipment';

const fixture = () => {
  const game = runInitial();
  const campaign = campaignFixture();
  const first = campaign.prepareOwned(game.copies[0]);
  const members: Run['members'] = [
    { source: 'owned', unit: { ...first, id: 'copy0', hp: 17 } },
    { source: 'owned', unit: { ...first, id: 'copy-duplicate', hp: 0 } },
    { source: 'temporary', unit: { ...first, id: 'temporary', hp: 13 } },
  ];
  const run: Run = {
    id: 'stage-run',
    status: 'active',
    campaignVersion: 1,
    zoneId: 'bulevar',
    graphVersion: 1,
    graph: campaign.graph,
    visited: [],
    members,
  };
  return {
    run,
    game: {
      ...game,
      inventory: {
        ...game.inventory,
        equipment: starterEquipment(),
        products: [{ id: 'jar', kind: 'random-beans' as const, status: 'available' as const }],
      },
      team: {
        copyIds: ['copy0', 'copy-duplicate'],
        loadouts: [{ copyId: 'copy0', wandId: 'starter:wand', broomId: 'starter:broom' }],
      },
    },
  };
};
afterEach(() => setContentPack('diagon-alley'));
describe('A71 preparation reads a confrontation, without changing preparation rules', () => {
  for (const language of ['es', 'en'] as const)
    for (const pack of ['diagon-alley', 'arcana'] as const)
      it(`keeps actual condition, per-copy gear and a valid draft visible in ${pack}/${language}`, () => {
        setContentPack(pack);
        const { run, game } = fixture();
        const assignments = [
          { unitId: 'temporary', beanId: 'jar' },
          { unitId: 'copy-duplicate', beanId: 'missing' },
        ];
        const before = JSON.stringify({ run, game, assignments });
        const html = renderToStaticMarkup(
          createElement(BossPartyStage, {
            run,
            game,
            assignments,
            language,
            ready: true,
            onPrepare: () => {},
          }),
        );
        expect(html.match(/data-boss-member=/g)).toHaveLength(3);
        expect(html).toContain('data-boss-member="copy0"');
        expect(html).toContain('17/');
        expect(html).toContain('data-boss-member="copy-duplicate"');
        expect(html).toContain('data-boss-party-condition="fallen"');
        expect(html).toContain('data-boss-party-source="temporary"');
        expect(html.match(/data-boss-party-gear=/g)).toHaveLength(2);
        expect(html.match(/data-boss-party-bean=/g)).toHaveLength(1);
        expect(html).toContain('data-boss-party-bean="jar"');
        expect(html).not.toContain('<input');
        expect(JSON.stringify({ run, game, assignments })).toBe(before);
      });
  it('keeps all opponents in recorded order and folds synergy consultation into the opponent book', () => {
    const { run } = fixture();
    const opponents = run.members.map((m, i) => ({
      ...m.unit,
      hp: 10,
      wizardId: i === 0 ? 'circe' : 'rival',
      affinity: 'fire' as const,
    }));
    const html = renderToStaticMarkup(createElement(BossPrelude, { opponents, language: 'es' }));
    expect(html.match(/data-boss-opponent="[^"]+"/g)).toEqual(
      opponents.map((u) => `data-boss-opponent="${u.id}"`),
    );
    expect(html).toContain('data-boss-inspection-book');
    expect(html).toContain('data-boss-active-synergy="fire"');
    expect(html.indexOf('data-boss-active-synergy')).toBeGreaterThan(html.indexOf('<details'));
  });
  it('disables consultation links during an uncertain operation without inventing a task for empty gear', () => {
    const { run, game } = fixture();
    const html = renderToStaticMarkup(
      createElement(BossPartyStage, {
        run: { ...run, members: run.members.slice(0, 1) },
        game: { ...game, team: undefined },
        assignments: [],
        language: 'en',
        ready: false,
        onPrepare: () => {},
      }),
    );
    expect(html).toContain('disabled=""');
    expect(html).not.toContain('data-boss-party-gear=');
    expect(html).not.toContain('data-boss-party-bean=');
    expect(html).not.toContain('0/1');
  });
});
