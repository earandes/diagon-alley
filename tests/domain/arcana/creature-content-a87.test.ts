import { expect, it } from 'vitest';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { traitsSnapshot } from '../../../src/arcana/domain/collection/traits';
import { validateCatalog, validateToadTable } from '../../../src/arcana/domain/collection/wizards';
import { randomizeRoute } from '../../../src/arcana/domain/exploration/randomize-route';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
import { projectPublicContent } from '../../../src/arcana/application/public-content';
const ids = ['phoenix-companion', 'hippogriff-companion', 'forest-unicorn', 'green-dragon'];
it('adds exactly four obtainable creatures, publishes the real normalized odds and preserves prior identities/stats', () => {
  const prior = trialConfiguration('a85'),
    next = trialConfiguration('a87');
  validateCatalog(next.opening.catalog);
  validateToadTable(next.opening.catalog, next.opening.table);
  expect(next.opening.catalog.version).toBe(4);
  expect(next.opening.catalog.wizards).toHaveLength(34);
  expect(next.opening.table.entries).toHaveLength(33);
  expect(next.opening.table.entries.every((e) => e.weight === 1)).toBe(true);
  expect(next.opening.table.finish).toEqual(prior.opening.table.finish);
  for (const w of prior.opening.catalog.wizards) {
    const n = next.opening.catalog.wizards.find((x) => x.id === w.id)!;
    expect(n.stats).toEqual(w.stats);
    expect(n.rarity).toBe(w.rarity);
    expect(n.stars).toBe(w.stars);
    expect(n.traits?.house).toBe(w.traits?.house);
  }
  for (const id of ids)
    expect(next.opening.catalog.wizards.find((w) => w.id === id)?.traits?.nature).toBe('creature');
  expect(next.campaign.version).toBe(prior.campaign.version);
  expect(next.campaign.combatRules.version).toBe(3);
  const published = projectPublicContent(next.opening, next.campaign);
  expect(published.combatRules.bonds).toEqual(next.campaign.combatRules.bonds);
  expect(Object.isFrozen(published.combatRules.bonds!.members.creatures)).toBe(true);
  const broken = structuredClone(next.campaign.combatRules.bonds!);
  expect(() =>
    projectPublicContent(next.opening, {
      ...next.campaign,
      combatRules: {
        ...next.campaign.combatRules,
        bonds: {
          ...broken,
          members: {
            ...broken.members,
            creatures: ['missing', 'phoenix-companion', 'forest-unicorn', 'green-dragon'],
          },
        },
      },
    }),
  ).toThrow();
  expect(prior.campaign.combatRules.bonds).toBeUndefined();
  expect(trialConfiguration('a84').opening.catalog.wizards.every((w) => !w.traits)).toBe(true);
});
it('classifies historical affiliations without treating half-giants, werewolves or Muggle-born people as beasts', () => {
  const c = trialConfiguration('a87').opening.catalog;
  expect(c.wizards.find((w) => w.id === 'paracelso')!.traits?.affiliations).toEqual([
    'order',
    'death',
  ]);
  for (const id of ['circe', 'night-forger', 'ash-wanderer', 'sun-priestess'])
    expect(c.wizards.find((w) => w.id === id)!.traits?.nature).toBe('person');
  expect(c.wizards.filter((w) => w.traits?.affiliations?.includes('order'))).toHaveLength(14);
  expect(c.wizards.filter((w) => w.traits?.affiliations?.includes('death'))).toHaveLength(4);
  const legacy = { version: 1 as const, house: 'slytherin' as const, school: 'hogwarts' as const };
  expect(traitsSnapshot(legacy)).toEqual(legacy);
  expect(() =>
    traitsSnapshot({
      version: 2,
      nature: 'creature',
      species: 'unicorn',
      house: 'gryffindor',
      school: 'hogwarts',
      affiliations: [],
    }),
  ).toThrow();
});
it('fixes three distinct creature alternatives along the same three Pacts, with house candidates retained', () => {
  const c = trialConfiguration('a87');
  for (let seed = 0; seed < 128; seed++) {
    const graph = randomizeRoute(c.campaign.graph, new SeededRandom(seed));
    const plans = c.campaign.challengeContent!('discovery', graph, ['apprentice']);
    const pacts = plans.flatMap((p) => (p.kind === 'pact' ? [p] : []));
    expect(pacts).toHaveLength(3);
    const beforeFight = (id: string, count: number): boolean => {
      const node = graph.nodes.find((n) => n.id === id)!;
      if (node.kind === 'duel' || node.kind === 'boss') return false;
      const next = count + Number(node.kind === 'pact');
      return next === 3 || node.next.some((child) => beforeFight(child, next));
    };
    expect(graph.nodes.filter((n) => n.row === 0).some((n) => beforeFight(n.id, 0))).toBe(true);
    expect(new Set(pacts.map((p) => p.recruits![1].wizardId)).size).toBe(3);
    for (const p of pacts) {
      expect(p.recruits).toHaveLength(2);
      expect(p.recruits![0].house).toBeTruthy();
      expect(ids).toContain(p.recruits![1].wizardId);
    }
    expect(c.campaign.challengeContent!('discovery', graph, ['apprentice'])).toEqual(plans);
  }
});
