import { afterEach, describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { CombatUnitInput } from '../../../src/arcana/domain/combat/engine';
import { BossPrelude } from '../../../src/arcana/presentation/BossPrelude';
import { setContentPack } from '../../../src/arcana/presentation/content-packs/active';
const units: CombatUnitInput[] = ['circe', 'rival', 'rival'].map((wizardId, i) => ({
  id: `saved-${i}`,
  wizardId,
  level: 1,
  affinity: i === 0 ? 'fire' : 'neutral',
  hp: 85,
  maxHp: 85,
  mana: 40,
  maxMana: 40,
  power: 12,
  speed: 8,
  wandPowerBonus: 0,
  wandMultiplier: 1,
  broomInitiative: 0,
}));
afterEach(() => setContentPack('diagon-alley'));
describe('A70 read-only boss prelude', () => {
  for (const language of ['es', 'en'] as const)
    for (const pack of ['diagon-alley', 'arcana'] as const)
      it(`uses the saved roster and does not promise a passive from a threat label in ${pack}/${language}`, () => {
        setContentPack(pack);
        const before = JSON.stringify(units);
        const html = renderToStaticMarkup(
          createElement(BossPrelude, { opponents: units, language }),
        );
        expect(html).toContain('data-boss-leader="saved-0"');
        expect(html).toContain(pack === 'diagon-alley' ? 'Hermione Granger' : 'Circe');
        expect(html).toContain('data-boss-roster-size="3"');
        expect(html).not.toContain(language === 'es' ? 'Jefe de Zona' : 'Zone Boss');
        expect(html).not.toContain('data-boss-active-synergy="fire"');
        expect(html).not.toContain('<button');
        expect(JSON.stringify(units)).toBe(before);
      });
  it('marks only actual active thresholds and leaves full composition inspectable', () => {
    const rivals = units.map((u) => ({ ...u, affinity: 'fire' as const }));
    const html = renderToStaticMarkup(
      createElement(BossPrelude, { opponents: rivals, language: 'es' }),
    );
    expect(html).toContain('data-boss-active-synergy="fire"');
    expect(html.match(/data-boss-opponent=/g)).toHaveLength(3);
  });
});
