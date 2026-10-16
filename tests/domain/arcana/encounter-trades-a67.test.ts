import { describe, it, expect } from 'vitest';
import {
  previewEncounterTrade,
  encounterOfferSnapshot,
  type EncounterOffer,
} from '../../../src/arcana/domain/exploration/encounter-trades';
import { campaignFixture, runInitial } from './support/run-fixtures';
const offer: EncounterOffer = {
  id: 'healer-v1',
  npcId: 'flamel',
  kind: 'healer',
  options: [
    { id: 'mend-one', scope: 'unit', restore: 'hp', fraction: 0.4, costFraction: 0.2 },
    { id: 'mend-team', scope: 'team', restore: 'hp', fraction: 0.15, costFraction: 0.1 },
  ],
};
const member = () => ({
  source: 'owned' as const,
  unit: {
    ...campaignFixture().prepareOwned(runInitial().copies[0]),
    hp: 40,
    mana: 30,
    maxMana: 40,
  },
});
describe('A67 fixed encounter trades', () => {
  it('previews exact capped benefit and cost without changing members', () => {
    const members = [member()],
      before = structuredClone(members);
    const result = previewEncounterTrade(members, offer, 'mend-one', members[0].unit.id);
    expect(result.eligible).toBe(true);
    expect(result.members[0].unit.hp).toBe(80);
    expect(result.members[0].unit.mana).toBe(22);
    expect(members).toEqual(before);
  });
  it('does not spend condition on a full, fallen or unaffordable target', () => {
    for (const patch of [{ hp: 100 }, { hp: 0 }, { mana: 0 }]) {
      const m = member();
      Object.assign(m.unit, patch);
      expect(previewEncounterTrade([m], offer, 'mend-one', m.unit.id).eligible).toBe(false);
    }
  });
  it('requires explicit target and rejects extra targets on group trades', () => {
    const members = [member()];
    expect(previewEncounterTrade(members, offer, 'mend-one').reason).toBe('choose-unit');
    expect(previewEncounterTrade(members, offer, 'mend-team', members[0].unit.id).eligible).toBe(
      false,
    );
    expect(previewEncounterTrade(members, offer, 'mend-team').eligible).toBe(true);
  });
  it('does not allow lethal costs or a forged option', () => {
    const m = member();
    m.unit.hp = 1;
    const scholar: EncounterOffer = {
      ...offer,
      kind: 'scholar',
      options: [
        { id: 'focus-one', scope: 'unit', restore: 'mana', fraction: 0.5, costFraction: 0.2 },
        { id: 'focus-team', scope: 'team', restore: 'mana', fraction: 0.2, costFraction: 0.1 },
      ],
    };
    expect(previewEncounterTrade([m], scholar, 'focus-one', m.unit.id).eligible).toBe(false);
    expect(previewEncounterTrade([m], offer, 'forged', m.unit.id).eligible).toBe(false);
    expect(() =>
      encounterOfferSnapshot({ ...offer, options: [{ ...offer.options[0], fraction: Infinity }] }),
    ).toThrow();
  });
});
