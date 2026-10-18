import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
vi.mock('../../../src/arcana/presentation/scenes/SceneCanvas', () => ({ SceneCanvas: () => null }));
vi.mock('../../../src/arcana/presentation/scenes/scene-diagnostics', () => ({
  sceneStart: () => undefined,
  sceneEnd: () => {},
}));
import { BattlePanel } from '../../../src/arcana/presentation/BattlePanel';
import { CombatEngine } from '../../../src/arcana/domain/combat/engine';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { projectPublicContent } from '../../../src/arcana/application/public-content';
import { createInventory } from '../../../src/arcana/domain/economy/inventory';
import type { GameState } from '../../../src/arcana/application/game';

it('presents an encounter, one pause and confirmed house access without an ordinal or an early outcome', () => {
  const c = trialConfiguration();
  const members = c.opening.catalog.wizards
    .filter((w) => w.traits?.house === 'hufflepuff')
    .slice(0, 3);
  const player = members.map((wizard, i) =>
    c.campaign.prepareOwned({
      copyId: `copy:${i}`,
      wizard,
      catalogVersion: 3,
      sourceId: 'fixture',
      origin: 'starter',
    }),
  );
  const combat = new CombatEngine({ fromSeed: (seed) => new SeededRandom(seed) }).resolve({
    id: 'a86-presentation',
    seed: 1,
    player,
    rival: player.map((u) => ({ ...u, id: `rival:${u.id}` })),
    rules: c.campaign.combatRules,
  });
  const game: GameState = {
    playerId: 'a86-fixture',
    revision: 1,
    schemaVersion: 1,
    inventory: createInventory(0),
    copies: [],
    receipts: [],
  };
  const before = JSON.stringify(combat);
  for (const language of ['es', 'en'] as const) {
    const html = renderToStaticMarkup(
      createElement(BattlePanel, {
        combat,
        game,
        content: projectPublicContent(c.opening, c.campaign),
        language,
        reduced: false,
        bossEncounter: true,
        onBack: () => {},
      }),
    );
    expect(html).toContain(language === 'es' ? 'Último duelo' : 'Final duel');
    expect(html).toContain('id="arena-options" hidden=""');
    expect(html).not.toContain('class="arena-position"');
    expect(html).not.toContain('data-arena-outcome');
    expect(html).not.toContain(language === 'es' ? 'Ronda 0' : 'Round 0');
    expect(html.match(/class="arena-pause"/g)).toHaveLength(1);
    expect(html.match(/class="arena-house"/g)).toHaveLength(2);
    expect(html.match(/<meter/g)).toHaveLength(6);
  }
  expect(JSON.stringify(combat)).toBe(before);
});
