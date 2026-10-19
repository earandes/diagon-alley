// Shared, declared component fixture state. Never an earned collection or a public grant endpoint.
import { trialConfiguration } from '../../src/arcana/infrastructure/content/trial-configuration';
import { projectPublicContent } from '../../src/arcana/application/public-content';
import { createInventory } from '../../src/arcana/domain/economy/inventory';
import { starterEquipment } from '../../src/arcana/domain/economy/equipment';
import {
  gameSnapshot,
  type GameState,
  type OpeningReceipt,
} from '../../src/arcana/application/game';
import type { WizardDefinition } from '../../src/arcana/domain/collection/wizards';
import type { Run } from '../../src/arcana/domain/exploration/run';
import { campaignFixture, runInitial } from '../domain/arcana/support/run-fixtures';

function declaredOpening(copy: GameState['copies'][number], tableVersion: number, isNew: boolean) {
  const unitId = `${copy.sourceId}:unit`;
  const receipt: OpeningReceipt = {
    id: copy.sourceId,
    kind: 'open-toad',
    request: { unitId, catalogVersion: copy.catalogVersion, tableVersion },
    wizard: copy.wizard,
    copyId: copy.copyId,
    isNew,
  };
  return {
    receipt,
    product: {
      id: unitId,
      kind: 'cacao-toad' as const,
      status: 'consumed' as const,
      operationId: receipt.id,
    },
  };
}

/** Scripted acquisition solely in the fixture bundle, with the same snapshot invariants as authority. */
export function acquirePriorityFixtureCopy(
  state: GameState,
  wizard: WizardDefinition,
  catalogVersion: number,
  tableVersion: number,
) {
  const copy = {
    copyId: 'a89-acquired-target',
    wizard,
    catalogVersion,
    sourceId: 'a89-acquired-target-opening',
    origin: 'toad' as const,
  };
  const opening = declaredOpening(
    copy,
    tableVersion,
    !state.copies.some((prior) => prior.wizard.id === wizard.id),
  );
  return gameSnapshot({
    ...state,
    revision: state.revision + 1,
    copies: [...state.copies, copy],
    inventory: { ...state.inventory, products: [...state.inventory.products, opening.product] },
    receipts: [...state.receipts, opening.receipt],
  });
}

export function createPriorityFixtureState(query = new URLSearchParams()) {
  const configuration = trialConfiguration(),
    content = projectPublicContent(configuration.opening, configuration.campaign);
  const view = query.get('view') ?? 'company';
  const selected = content.catalog.wizards
    .filter((w) => w.traits?.house === 'gryffindor')
    .slice(0, 3);
  const copies: GameState['copies'] = [
    ...selected,
    selected[1],
    ...(query.has('dense') ? [selected[2]] : []),
  ].map((wizard, i) => ({
    copyId: `a89-copy-${i}`,
    wizard,
    catalogVersion: content.catalog.version,
    sourceId: i === 0 ? 'starter-kit' : `a89-opening-${i}`,
    origin: i === 0 ? 'starter' : 'toad',
  }));
  const fixtureCampaign = campaignFixture();
  const closed: Run = {
    id: 'a89-prior',
    status: 'won',
    campaignVersion: fixtureCampaign.version,
    zoneId: content.campaign.zoneId,
    graphVersion: fixtureCampaign.graph.version,
    graph: fixtureCampaign.graph,
    visited: fixtureCampaign.graph.nodes.map((n) => n.id),
    members: copies
      .slice(0, 1)
      .map((copy) => ({ source: 'owned', unit: configuration.campaign.prepareOwned(copy) })),
  };
  const active: Run = {
    id: 'a89-active',
    status: 'active',
    campaignVersion: content.campaign.version,
    graphVersion: content.campaign.graph.version,
    graph: content.campaign.graph,
    zoneId: content.campaign.zoneId,
    visited: [],
    members: copies.slice(0, query.has('single') ? 1 : 3).map((copy, i) => ({
      source: i === 2 && query.has('temporary') ? 'temporary' : 'owned',
      unit: {
        ...configuration.campaign.prepareOwned(copy),
        hp: i === 1 ? 0 : i === 0 ? 10 : copy.wizard.stats.maxHp,
      },
    })),
    tacticalVersion: 4,
    equipmentRulesVersion: 2,
    campaignSnapshot: {
      ...configuration.campaign,
      graph: configuration.campaign.graph,
      nodes: configuration.campaign.challengeContent!('discovery', configuration.campaign.graph),
    },
  };
  const beanCount = query.has('empty') ? 0 : query.has('one') ? 1 : 3;
  const openings = copies
    .slice(1)
    .map((copy, index) =>
      declaredOpening(
        copy,
        content.toadTable.version,
        !copies.slice(0, index + 1).some((prior) => prior.wizard.id === copy.wizard.id),
      ),
    );
  const initial: GameState = gameSnapshot({
    ...runInitial('a89-fixture-owner-a'),
    revision: 1 + openings.length + (view === 'company' && query.has('legacy') ? 1 : 0),
    inventory: {
      ...createInventory(0),
      crowns: 50,
      equipment: starterEquipment(),
      products: [
        ...openings.map((opening) => opening.product),
        ...Array.from({ length: beanCount }, (_, i) => ({
          id: `a89-jar-${i}`,
          kind: 'random-beans' as const,
          status: 'available' as const,
        })),
      ],
    },
    copies,
    receipts: [
      {
        id: 'starter-kit',
        kind: 'starter-kit',
        catalogVersion: content.catalog.version,
        copyId: copies[0].copyId,
        wizard: copies[0].wizard,
        equipmentIds: starterEquipment().map((item) => item.id),
      },
      ...openings.map((opening) => opening.receipt),
      ...(view === 'company' && query.has('legacy')
        ? [
            {
              id: 'a89-legacy-intention',
              kind: 'set-intention' as const,
              request: { afterRunId: closed.id, choice: { kind: 'bean' as const } },
              intention: {
                version: 1 as const,
                afterRunId: closed.id,
                runId: null,
                choice: { kind: 'bean' as const },
              },
            },
          ]
        : []),
    ],
    team: {
      copyIds: copies.slice(0, 3).map((c) => c.copyId),
      loadouts: [
        { copyId: copies[0].copyId, wandId: 'starter:wand', broomId: null },
        { copyId: copies[3].copyId, wandId: null, broomId: 'starter:broom' },
      ],
    },
    exploration: {
      run: view === 'company' ? closed : active,
      victories: [],
      unlockedZones: [content.campaign.zoneId],
      ...(view === 'company' && query.has('legacy')
        ? {
            intention: {
              version: 1 as const,
              afterRunId: closed.id,
              runId: null,
              choice: { kind: 'bean' as const },
            },
          }
        : {}),
    },
  });
  return { configuration, content, copies, active, closed, initial };
}
