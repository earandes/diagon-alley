import { describe, expect, it } from 'vitest';
import {
  collectionGoalView,
  parseCollectionGoal,
  collectionGoalKey,
  storeCollectionGoal,
  type CollectionGoal,
} from '../../../src/arcana/application/client/collection-goal';
import { catalogFixture, toadFixture } from './support/fixtures';
import { runInitial, campaignFixture } from './support/run-fixtures';
import type { Run } from '../../../src/arcana/domain/exploration/run';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CollectionPanel } from '../../../src/arcana/presentation/CollectionPanel';
import { CollectionSources } from '../../../src/arcana/presentation/CollectionSources';
import {
  setContentPack,
  selectedContentPackId,
} from '../../../src/arcana/presentation/content-packs/active';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { projectPublicContent } from '../../../src/arcana/application/public-content';

const fixture = trialConfiguration();
const content = projectPublicContent(fixture.opening, fixture.campaign);
const game = () => ({ ...runInitial(), copies: [] });
const goal = (owner = game().playerId, wizardId = 'circe'): CollectionGoal => ({
  version: 1,
  owner,
  wizardId,
  catalogVersion: 1,
});
describe('PM05 collection objective, never economic authority', () => {
  it('uses table probability and does not let an owned temporal complete an identity', () => {
    const campaign = campaignFixture();
    const pact = campaign.nodes.find((node) => node.kind === 'pact')!;
    if (pact.kind !== 'pact') throw Error('Fixture missing pact');
    const run: Run = {
      id: 'fixture-run',
      status: 'active',
      campaignVersion: 1,
      zoneId: campaign.zoneId,
      graphVersion: 1,
      graph: campaign.graph,
      campaignSnapshot: campaign,
      tacticalVersion: 1,
      visited: [],
      members: [{ source: 'temporary', unit: pact.recruit }],
    };
    const state = { ...game(), exploration: { run, victories: [], unlockedZones: [] } };
    const view = collectionGoalView(goal(), state, catalogFixture, {
      ...content,
      catalog: catalogFixture,
      toadTable: toadFixture,
    });
    expect(view?.status).toBe('searching');
    expect(view?.probability).toBe(0.25);
    expect(view?.temporaryOpportunity).toBe(true);
    expect(state.copies).toHaveLength(0);
  });
  it('derives acquisition from any committed copy, including enchanted, not local booleans', () => {
    const state = game();
    const copy = {
      copyId: 'owned',
      sourceId: 'opened',
      origin: 'toad' as const,
      catalogVersion: 1,
      wizard: {
        ...catalogFixture.wizards[1],
        finish: { id: 'enchanted' as const, version: 1 as const },
      },
    };
    const view = collectionGoalView(goal(), { ...state, copies: [copy] }, catalogFixture, {
      ...content,
      catalog: catalogFixture,
      toadTable: toadFixture,
    });
    expect(view?.status).toBe('acquired');
    expect(view?.probability).toBe(0.25);
  });
  it('keeps removed identity archived rather than substituting a new target', () => {
    const state = game();
    const view = collectionGoalView(
      goal(state.playerId, 'retired'),
      state,
      catalogFixture,
      content,
    );
    expect(view?.status).toBe('archived');
    expect(view?.goal.wizardId).toBe('retired');
  });
  it('rejects a different owner, invalid stored schema and stored fake completion', () => {
    expect(collectionGoalView(goal('other'), game(), catalogFixture, content)).toBeNull();
    expect(parseCollectionGoal(JSON.stringify(goal()), 'other')).toBeNull();
    expect(
      parseCollectionGoal(JSON.stringify({ ...goal(), obtained: true }), game().playerId),
    ).toBeNull();
    expect(parseCollectionGoal('{bad', game().playerId)).toBeNull();
    expect(collectionGoalKey('a')).not.toBe(collectionGoalKey('b'));
  });
  it('preserves the selection through storage reload without changing a game object', () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => {
        values.set(key, value);
      },
      removeItem: (key: string) => {
        values.delete(key);
      },
    };
    expect(storeCollectionGoal(storage, goal().owner, goal())).toBe(true);
    expect(
      parseCollectionGoal(storage.getItem(collectionGoalKey(goal().owner)), goal().owner),
    ).toEqual(goal());
    expect(storeCollectionGoal(storage, goal().owner, null)).toBe(true);
    expect(values.size).toBe(0);
    expect(
      storeCollectionGoal(
        {
          ...storage,
          setItem: () => {
            throw Error('quota');
          },
        },
        goal().owner,
        goal(),
      ),
    ).toBe(false);
  });
  it('preserves a target across compatible catalogue updates and refuses stale probability data', () => {
    const updated = { ...catalogFixture, version: 2 };
    const current = {
      ...content,
      catalog: updated,
      toadTable: { ...toadFixture, version: 2, catalogVersion: 2 },
    };
    const view = collectionGoalView(goal(), game(), updated, current);
    expect(view?.goal.catalogVersion).toBe(1);
    expect(view?.status).toBe('searching');
    expect(view?.tableVersion).toBe(2);
    expect(
      collectionGoalView(goal(), game(), updated, { ...current, toadTable: toadFixture })
        ?.probability,
    ).toBeNull();
  });
});

describe('PM05 conservative illustrated collection presentation', () => {
  for (const language of ['es', 'en'] as const)
    for (const pack of ['diagon-alley', 'arcana'] as const) {
      it(`keeps unknown identities consultable without exposing their name/context in ${language}/${pack}`, () => {
        const previous = selectedContentPackId();
        try {
          setContentPack(pack);
          const html = renderToStaticMarkup(
            createElement(CollectionPanel, {
              game: game(),
              catalog: content.catalog,
              content,
              language,
            }),
          );
          expect(html).toContain(
            language === 'es' ? 'Consultar cromo pendiente' : 'Inspect undiscovered card',
          );
          expect(html).not.toContain('Hermione Granger');
          expect(html).not.toContain('character.circe.portrait');
          const pendingButton = html.match(
            new RegExp(
              `<button[^>]*aria-label="${language === 'es' ? 'Consultar cromo pendiente 1' : 'Inspect undiscovered card 1'}"[^>]*>`,
            ),
          )?.[0];
          expect(pendingButton).toBeDefined();
          expect(pendingButton).not.toContain('disabled');
          const source = renderToStaticMarkup(
            createElement(CollectionSources, {
              language,
              sources: { probability: 0.25, tableVersion: 1, temporaryOpportunity: true },
              onAcquire: () => {},
            }),
          );
          expect(source).toContain('25');
          expect(source).toContain(language === 'es' ? 'copia propia' : 'owned copy');
          expect(source).toContain(language === 'es' ? 'aliado temporal' : 'temporary ally');
          expect(source).toContain(
            language === 'es' ? 'Ir a la confitería' : 'Go to the sweet shop',
          );
        } finally {
          setContentPack(previous);
        }
      });
    }
});
