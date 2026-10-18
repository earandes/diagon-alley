import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { it, expect, afterEach } from 'vitest';
import { HouseBand, TraitBadge } from '../../../src/arcana/presentation/HouseInsignia';
import { FinishLabel, EnchantedFinish } from '../../../src/arcana/presentation/EnchantedFinish';
import { setContentPack } from '../../../src/arcana/presentation/content-packs/active';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
const c = trialConfiguration(),
  wizard = c.opening.catalog.wizards[0];
afterEach(() => setContentPack('diagon-alley'));
it('has localized normal, enchanted and biographic presentation without another rarity or power label', () => {
  expect(renderToStaticMarkup(createElement(FinishLabel, { wizard, language: 'es' }))).toBe('');
  const enchanted = { ...wizard, finish: { id: 'enchanted' as const, version: 1 as const } };
  for (const language of ['es', 'en'] as const) {
    expect(
      renderToStaticMarkup(createElement(FinishLabel, { wizard: enchanted, language })),
    ).toContain(language === 'es' ? 'Cromo Encantado' : 'Enchanted Card');
    const normal = renderToStaticMarkup(createElement(EnchantedFinish, { wizard }));
    expect(normal).toBe('');
    const art = renderToStaticMarkup(createElement(EnchantedFinish, { wizard: enchanted }));
    expect(art).toContain('aria-hidden="true"');
  }
  setContentPack('arcana');
  expect(
    renderToStaticMarkup(
      createElement(TraitBadge, { traits: { version: 1, school: 'beauxbatons' }, language: 'en' }),
    ),
  ).toContain('Dawn Academy');
});
it('shows only represented houses, explains incomplete vs active, and hides new mechanics for legacy rules', () => {
  const units = [0, 1, 2].map((i) => ({
    id: `copy${i}`,
    wizardId: `wizard${i}`,
    hp: 90,
    house: 'gryffindor' as const,
  }));
  const legacy = { ...c.campaign.combatRules, houseSynergies: undefined };
  expect(
    renderToStaticMarkup(createElement(HouseBand, { units, rules: legacy, language: 'es' })),
  ).toBe('');
  const inactive = renderToStaticMarkup(
    createElement(HouseBand, {
      units: units.slice(0, 2),
      rules: c.campaign.combatRules,
      language: 'es',
    }),
  );
  expect(inactive).toContain('2/3');
  expect(inactive).not.toContain('Ravenclaw');
  const active = renderToStaticMarkup(
    createElement(HouseBand, { units, rules: c.campaign.combatRules, language: 'en' }),
  );
  expect(active).toContain('Active tier 1');
  expect(active).toContain('+2 damage');
  setContentPack('arcana');
  expect(
    renderToStaticMarkup(
      createElement(HouseBand, { units, rules: c.campaign.combatRules, language: 'en' }),
    ),
  ).toContain('Lion Company');
});
