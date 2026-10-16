import { expect, it } from 'vitest';
import { projectPublicContent, publicContentSnapshot } from '../../../src/arcana/application/public-content';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { equipmentSpellPower, equipmentInitiative } from '../../../src/arcana/domain/combat/equipment-effects';

it('publishes the existing affinity map immutably without authority callbacks or changed trial rules', () => {
  const { opening, campaign } = trialConfiguration();
  const value = projectPublicContent(opening, campaign);
  expect(value.campaign.ownedAffinities).toBeDefined();
  expect(Object.keys(value.campaign.ownedAffinities!)).toHaveLength(opening.catalog.wizards.length);
  for (const wizard of opening.catalog.wizards) {
    const copy = { wizard, copyId: 'projection-probe', catalogVersion: opening.catalog.version,
      origin: 'toad' as const, sourceId: 'projection' };
    expect(value.campaign.ownedAffinities![wizard.id]).toBe(campaign.prepareOwned(copy).affinity);
  }
  expect(Object.isFrozen(value.campaign.ownedAffinities)).toBe(true);
  expect(JSON.stringify(value)).not.toContain('prepareOwned');
});
it('accepts older public content without an affinity map instead of inventing a character affinity', () => {
  const { opening, campaign } = trialConfiguration();
  const content = projectPublicContent(opening, campaign);
  const { ownedAffinities: _, ...old } = content.campaign;
  expect(publicContentSnapshot({ ...content, campaign: old }).campaign.ownedAffinities).toBeUndefined();
});
it('rejects unknown affinity values, unknown identities and array-shaped metadata', () => {
  const { opening, campaign } = trialConfiguration();
  const content = projectPublicContent(opening, campaign);
  for (const ownedAffinities of [{ apprentice: 'water' }, { 'not-in-catalog': 'alchemy' }, ['alchemy']])
    expect(() => publicContentSnapshot({ ...content, campaign: { ...content.campaign, ownedAffinities } })).toThrow();
});
it('shares the exact equipment arithmetic with the engine without rounding or adding a bean prediction', () => {
  const unit = { power: 11, wandPowerBonus: 2, wandMultiplier: 1.15, speed: 7, broomInitiative: 3 };
  expect(equipmentSpellPower(unit)).toBe((11 + 2) * 1.15);
  expect(equipmentInitiative(unit, 4)).toBe(7 + 3 + 4);
  expect(equipmentInitiative(unit)).toBe(10);
  expect(equipmentSpellPower({ power: 0, wandPowerBonus: 0, wandMultiplier: 1 })).toBe(0);
});
