import { expect, it } from 'vitest';
import {
  acquirePriorityFixtureCopy,
  createPriorityFixtureState,
} from '../../browser-priorities/fixture-state';
import { gameSnapshot, type GameState } from '../../../src/arcana/application/game';
import { SetIntentionUseCase } from '../../../src/arcana/application/set-intention';

for (const query of [
  'view=company',
  'view=company&legacy=1',
  'view=beans&temporary=1',
  'view=beans&empty=1',
  'view=forge',
  'view=collection',
  'view=battle&dense=1',
])
  it(`validates the actual shared A89 browser fixture before rendering: ${query}`, () => {
    const fixture = createPriorityFixtureState(new URLSearchParams(query));
    expect(gameSnapshot(fixture.initial)).toEqual(fixture.initial);
    const obtainable = new Set(fixture.content.toadTable.entries.map((entry) => entry.wizardId));
    expect(
      fixture.initial.copies
        .filter((copy) => copy.origin === 'toad')
        .every((copy) => obtainable.has(copy.wizard.id)),
    ).toBe(true);
  });

it('chooses company through the actual fixture transaction boundary, preserving duplicates and legacy recovery', async () => {
  const fixture = createPriorityFixtureState(new URLSearchParams('view=company&legacy=1'));
  let state: GameState = fixture.initial;
  const use = new SetIntentionUseCase(
    { read: async () => state, transact: async (_owner, change) => (state = change(state)) },
    () => ({
      combatRules: fixture.content.combatRules,
      ownedAffinities: fixture.content.campaign.ownedAffinities!,
      beanPrice: 5,
    }),
  );
  const before = state;
  const result = await use.execute(state.playerId, {
    key: `a89-intention-${state.revision}`,
    expectedRevision: state.revision,
    request: {
      afterRunId: fixture.closed.id,
      choice: { kind: 'company', focus: 'house', house: 'gryffindor' },
    },
  });
  expect(result.state.exploration!.intention).toMatchObject({
    version: 2,
    choice: { kind: 'company', house: 'gryffindor' },
  });
  expect(result.state.inventory).toEqual(before.inventory);
  expect(result.state.copies).toEqual(before.copies);
  expect(result.state.copies).toHaveLength(4);
  expect(new Set(result.state.copies.map((copy) => copy.wizard.id)).size).toBe(3);
});

it('keeps acquisition provenance coherent and still rejects missing receipt or a locked current zone', () => {
  const fixture = createPriorityFixtureState(new URLSearchParams('view=collection'));
  const wizard = fixture.content.catalog.wizards.find(
    (wizard) => !fixture.initial.copies.some((copy) => copy.wizard.id === wizard.id),
  )!;
  const acquired = acquirePriorityFixtureCopy(
    fixture.initial,
    wizard,
    fixture.content.catalog.version,
    fixture.content.toadTable.version,
  );
  expect(gameSnapshot(acquired)).toEqual(acquired);
  expect(acquired.copies.at(-1)).toMatchObject({
    wizard: { id: wizard.id },
    origin: 'toad',
    sourceId: 'a89-acquired-target-opening',
  });
  expect(() =>
    gameSnapshot({
      ...acquired,
      receipts: acquired.receipts.filter((receipt) => receipt.id !== 'a89-acquired-target-opening'),
    }),
  ).toThrow('INVALID_GAME');
  expect(() =>
    gameSnapshot({
      ...fixture.initial,
      exploration: { ...fixture.initial.exploration!, unlockedZones: [] },
    }),
  ).toThrow('INVALID_GAME');
});
