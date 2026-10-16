import { describe, expect, it } from 'vitest';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { validateCampaign } from '../../../src/arcana/domain/exploration/nodes';
import { validateToadTable } from '../../../src/arcana/domain/collection/wizards';
import { validateShop } from '../../../src/arcana/domain/economy/inventory';
import { createRoute, advanceRoute } from '../../../src/arcana/domain/exploration/route';
import { projectPublicContent } from '../../../src/arcana/application/public-content';
describe('explicit ARCANA local trial content', () => {
  it('has versioned bilingual stories for the three trial encounter effects without changing their weights or mechanics', () => {
    const { campaign } = trialConfiguration();
    const plan = campaign.nodes.find((node) => node.kind === 'encounter');
    if (plan?.kind !== 'encounter') throw Error('Missing encounter');
    expect(plan.choices.map((choice) => choice.weight)).toEqual([1, 1, 1]);
    expect(plan.choices.map((choice) => choice.effect.kind)).toEqual(['reward', 'heal', 'damage']);
    expect(
      plan.choices.every(
        (choice) =>
          choice.narrative?.version === 1 &&
          choice.narrative.text.es.trim() &&
          choice.narrative.text.en.trim(),
      ),
    ).toBe(true);
    expect(campaign.version).toBe(1);
  });
  it('provides all nine wood/core recipes and a valid public weighted vault without private metadata', () => {
    const { opening, campaign } = trialConfiguration();
    const view = projectPublicContent(opening, campaign);
    expect(view.commerce?.forge.recipes).toHaveLength(9);
    expect(new Set(view.commerce?.forge.recipes.map((r) => `${r.wood}:${r.core}`)).size).toBe(9);
    expect(view.commerce?.vault.entries).toHaveLength(2);
    expect(view.commerce?.vault.entries.every((e) => e.loot.equipment.length > 0)).toBe(true);
    expect(Object.isFrozen(view.commerce?.forge.recipes)).toBe(true);
  });
  it('provides 30 bilingual identities and versioned valid shop/opening content', () => {
    const { opening, starter } = trialConfiguration();
    validateToadTable(opening.catalog, opening.table);
    validateShop(opening.shop);
    expect(opening.catalog.wizards).toHaveLength(30);
    expect(starter.catalog).toEqual(opening.catalog);
    expect(opening.catalog.wizards.find((w) => w.id === starter.apprenticeId)?.name.es).toBe(
      'Aprendiz de Alquimia',
    );
    expect(new Set(opening.catalog.wizards.map((w) => w.rarity)).size).toBe(4);
    expect(JSON.stringify(opening)).not.toMatch(
      /diagon|weasley|dumbledore|potter|gringotts|ollivander|nimbus|galleon|galeon|expelliarmus/i,
    );
  });
  it('has 15 branching nodes and one boss with all six node types', () => {
    const { campaign } = trialConfiguration();
    validateCampaign(campaign);
    expect(campaign.graph.nodes).toHaveLength(16);
    expect(campaign.graph.nodes.filter((n) => n.kind === 'boss')).toHaveLength(1);
    expect(new Set(campaign.graph.nodes.map((n) => n.kind)).size).toBe(6);
    expect(campaign.zoneId).toBe('pasaje');
    expect(campaign.graph.nodes.some((n) => n.next.length > 1)).toBe(true);
    let run = createRoute('run', campaign.graph);
    for (let row = 0; row < 7; row++) run = advanceRoute(run, campaign.graph, `pasaje:${row}:0`);
    expect(run.visited).toHaveLength(7);
  });
  it('offers two adjacent temporary pacts without changing the one-unit starter kit', () => {
    const { campaign } = trialConfiguration();
    const first = campaign.nodes.find((n) => n.nodeId === 'pasaje:0:0'),
      second = campaign.nodes.find((n) => n.nodeId === 'pasaje:1:0');
    expect(first?.kind).toBe('pact');
    expect(second?.kind).toBe('pact');
    if (first?.kind !== 'pact' || second?.kind !== 'pact') throw Error('Missing pacts');
    expect(first.recruit.id).not.toBe(second.recruit.id);
  });
  it('builds owned combat stats from the supplied copy snapshot, preserving prior catalogue versions', () => {
    const { campaign, opening } = trialConfiguration();
    const wizard = {
      ...opening.catalog.wizards[0],
      stats: { maxHp: 77, maxMana: 9, power: 3, speed: 2 },
    };
    expect(
      campaign.prepareOwned({
        copyId: 'old',
        wizard,
        catalogVersion: 1,
        sourceId: 'test',
        origin: 'toad',
      }),
    ).toMatchObject({
      id: 'old',
      hp: 77,
      mana: 9,
      power: 3,
      speed: 2,
      wandPowerBonus: 0,
      broomInitiative: 0,
      affinity: 'alchemy',
    });
  });
});
