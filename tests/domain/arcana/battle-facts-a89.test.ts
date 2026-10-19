import { describe, expect, it } from 'vitest';
import { battleFacts } from '../../../src/arcana/application/client/battle-facts';
import type { BattleEventData, Combat } from '../../../src/arcana/domain/combat/engine';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { NodeResult } from '../../../src/arcana/presentation/NodeResult';
import { ExpeditionClosure } from '../../../src/arcana/presentation/ExpeditionClosure';
import type { NodeReceipt } from '../../../src/arcana/application/run-contracts';
import { runInitial, campaignFixture } from './support/run-fixtures';

// Partial, declared read-model fixtures: no engine simulation or economic operation.
function combat(events: readonly BattleEventData[]): Combat {
  return {
    input: {
      player: [
        { id: 'p1', wizardId: 'merlin' },
        { id: 'p2', wizardId: 'circe' },
      ],
      rival: [{ id: 'r1', wizardId: 'rival' }],
    },
    events: events.map((event, sequence) => ({ ...event, sequence, round: 1 })),
  } as unknown as Combat;
}
const house = {
  kind: 'house-activated',
  team: 'player',
  house: 'ravenclaw',
  members: 3,
  tier: 1,
  value: 1,
  contributorIds: ['p1', 'p2'],
} as const;
const bond = {
  kind: 'bond-activated',
  team: 'player',
  group: 'creatures',
  members: 3,
  tier: 1,
  value: 2,
  contributorIds: ['p1', 'p2'],
} as const;
const bean = {
  kind: 'bean-activated',
  actorId: 'p1',
  unitId: 'jar',
  flavour: 'soap',
  hp: 10,
} as const;
const heal = { kind: 'healed', actorId: 'p2', source: 'order', amount: 1, hp: 11 } as const;
const guard = {
  kind: 'spell-cast',
  actorId: 'r1',
  targetId: 'p1',
  damage: 1,
  guarded: 2,
  missed: false,
  mana: 1,
  targetHp: 9,
} as const;

describe('A89 common combat facts are limited, own and evidence-bound', () => {
  it('prioritizes the matching company activation, then an actual effect without claiming causality', () => {
    const battle = combat([bean, heal, bond, guard]),
      before = JSON.stringify(battle);
    expect(battleFacts(battle, { kind: 'company', focus: 'bond', group: 'creatures' })).toEqual([
      { kind: 'bond', group: 'creatures', members: 3, tier: 1, sequence: 2 },
      { kind: 'bean', actorId: 'p1', wizardId: 'merlin', flavour: 'soap', sequence: 0 },
    ]);
    expect(JSON.stringify(battle)).toBe(before);
    expect(
      battleFacts(JSON.parse(before), { kind: 'company', focus: 'bond', group: 'creatures' }),
    ).toEqual(battleFacts(battle, { kind: 'company', focus: 'bond', group: 'creatures' }));
  });
  it('projects a house or guard with its logged amount, not a configured nominal bonus', () => {
    expect(
      battleFacts(combat([house]), { kind: 'company', focus: 'house', house: 'ravenclaw' }),
    ).toEqual([{ kind: 'house', house: 'ravenclaw', members: 3, tier: 1, sequence: 0 }]);
    expect(battleFacts(combat([guard]))).toEqual([
      { kind: 'guard', actorId: 'p1', wizardId: 'merlin', amount: 2, sequence: 0 },
    ]);
    expect(battleFacts(combat([{ ...heal, amount: 1 }]))).toEqual([
      {
        kind: 'healing',
        actorId: 'p2',
        wizardId: 'circe',
        source: 'order',
        amount: 1,
        sequence: 0,
      },
    ]);
  });
  it('never mistakes opponent, missed or absent effects for own facts', () => {
    expect(
      battleFacts(
        combat([
          { ...house, team: 'rival' },
          { ...bond, team: 'rival' },
          { ...bean, actorId: 'r1' },
          { ...heal, actorId: 'r1' },
          { ...heal, amount: 0 },
          { ...guard, targetId: 'r1' },
          { ...guard, missed: true },
          { ...guard, guarded: 0 },
        ]),
      ),
    ).toEqual([]);
  });
  it('keeps at most two distinct categories and tolerates legacy logs without new events', () => {
    expect(battleFacts(combat([bean, heal, house, bond, guard]))).toHaveLength(2);
    expect(battleFacts(combat([]))).toEqual([]);
    expect(battleFacts(null)).toEqual([]);
    expect(battleFacts(combat([bean, { ...bean, unitId: 'another-jar' }]))).toHaveLength(1);
  });
  it('does not fabricate the selected plan if only another house or group was activated', () => {
    const facts = battleFacts(combat([house, bond]), {
      kind: 'company',
      focus: 'house',
      house: 'slytherin',
    });
    expect(facts).toEqual([
      { kind: 'house', house: 'ravenclaw', members: 3, tier: 1, sequence: 0 },
      { kind: 'bond', group: 'creatures', members: 3, tier: 1, sequence: 1 },
    ]);
  });
  it('finds the intended affinity when several distinct affinities activated in the same combat', () => {
    const facts = battleFacts(
      combat([
        { kind: 'synergy-activated', team: 'player', affinity: 'alchemy', members: 3 },
        { kind: 'synergy-activated', team: 'player', affinity: 'fire', members: 2 },
        bean,
      ]),
      { kind: 'synergy', affinity: 'fire' },
    );
    expect(facts[0]).toEqual({ kind: 'synergy', affinity: 'fire', members: 2, sequence: 1 });
  });
});

function resultFixture(nodeId: 'duel' | 'boss'): NodeReceipt {
  const base = runInitial(),
    campaign = campaignFixture();
  const run = {
    id: 'reviewed-run',
    graph: campaign.graph,
    graphVersion: campaign.graph.version,
    campaignVersion: campaign.version,
    zoneId: campaign.zoneId,
    status: 'draw' as const,
    visited: [nodeId],
    members: base.copies.map((copy) => ({
      source: 'owned' as const,
      unit: campaign.prepareOwned(copy),
    })),
  };
  return {
    id: 'reviewed-receipt',
    kind: 'advance-node',
    request: { runId: run.id, nodeId, campaignVersion: 1, assignments: [] },
    run,
    battle: {
      ...combat([bean, heal, house]),
      id: 'reviewed-combat',
      outcome: 'draw',
      rounds: 1,
      engineVersion: 3,
      player: [],
      rival: [],
    },
    reward: { crowns: 0, goldKeys: 0, products: [] },
    firstVictory: null,
    encounter: null,
  };
}
describe('A89 result and closure retain the appropriate plan priority', () => {
  for (const language of ['es', 'en'] as const) {
    it(`prioritizes a supplied matching company in the ${language} node result without inventing it`, () => {
      const receipt = resultFixture('duel');
      const html = renderToStaticMarkup(
        createElement(NodeResult, {
          receipt,
          language,
          onReplay: () => {},
          onMissions: () => {},
          preferredIntention: { kind: 'company', focus: 'house', house: 'ravenclaw' },
        }),
      );
      expect(html.indexOf('data-battle-fact="house"')).toBeGreaterThan(-1);
      expect(html.indexOf('data-battle-fact="house"')).toBeLessThan(
        html.indexOf('data-battle-fact="bean"'),
      );
      expect(html).not.toContain('data-battle-fact="healing"');
      expect(html).not.toMatch(/aria-live|won because|ganaste gracias/i);
    });
    it(`uses the bound receipt run for ${language} closure, excluding an intention for another run`, () => {
      const receipt = resultFixture('boss'),
        base = runInitial();
      const render = (runId: string | null) =>
        renderToStaticMarkup(
          createElement(ExpeditionClosure, {
            game: {
              ...base,
              receipts: [receipt],
              exploration: {
                run: receipt.run,
                unlockedZones: [receipt.run.zoneId],
                victories: [],
                intention: {
                  version: 2,
                  afterRunId: 'previous-run',
                  runId,
                  choice: { kind: 'company', focus: 'house', house: 'ravenclaw' },
                },
              },
            },
            language,
            ready: true,
            onAction: () => {},
            onReplay: () => {},
            onMissions: () => {},
          }),
        );
      const own = render(receipt.request.runId);
      expect(own.indexOf('data-boss-fact="house"')).toBeGreaterThan(-1);
      expect(own.indexOf('data-boss-fact="house"')).toBeLessThan(
        own.indexOf('data-boss-fact="bean"'),
      );
      for (const other of ['unrelated-run', null]) {
        const html = render(other);
        expect(html).not.toContain('data-boss-fact="house"');
        expect(html).toContain('data-boss-fact="bean"');
        expect(html).toContain('data-boss-fact="healing"');
      }
    });
  }
});
