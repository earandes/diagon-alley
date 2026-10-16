import { tacticalContent } from '../../../src/arcana/infrastructure/content/tactical-content';
import { it, expect } from 'vitest';
import { gameSnapshot, type GameState } from '../../../src/arcana/application/game';
import {
  StartRunUseCase,
  AdvanceNodeUseCase,
  ResolveCombatUseCase,
} from '../../../src/arcana/application/run-use-cases';
import { CombatEngine } from '../../../src/arcana/domain/combat/engine';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { runInitial } from './support/run-fixtures';
const random = { fromSeed: (seed: number) => new SeededRandom(seed) };
function setup() {
  let state = gameSnapshot(runInitial());
  const trial = trialConfiguration();
  let config = {
    ...trial.campaign,
    challengeContent: undefined,
    equipmentRulesVersion: undefined,
    tacticalContent: tacticalContent(
      trial.campaign.nodes,
      trial.opening.catalog,
      trial.campaign.ownedAffinities!,
    ),
  };
  const games = {
    read: async () => state,
    transact: async (_id: string, change: (s: GameState) => GameState) =>
      (state = gameSnapshot(change(state))),
  };
  const seeds = { next: () => 42 };
  const start = new StartRunUseCase(games, () => config, { seeds, random });
  const advance = new AdvanceNodeUseCase(
    games,
    () => config,
    new ResolveCombatUseCase(new CombatEngine(random), seeds),
    { now: async () => 0 },
    random,
    seeds,
  );
  return {
    games,
    start,
    advance,
    get state() {
      return state;
    },
    get config() {
      return config;
    },
    set config(c) {
      config = c;
    },
  };
}
it('fixes two offers and combat content in a new run without changing campaign reward version', async () => {
  const s = setup();
  await s.start.execute('player', {
    key: 'new',
    expectedRevision: 1,
    request: { zoneId: s.config.zoneId, campaignVersion: s.config.version, copyIds: ['copy0'] },
  });
  const run = s.state.exploration!.run!;
  expect(run.tacticalVersion).toBe(1);
  expect(run.campaignSnapshot?.version).toBe(s.config.version);
  const pact = run.campaignSnapshot!.nodes.find((n) => n.kind === 'pact')!;
  if (pact.kind !== 'pact') throw Error();
  expect(pact.recruits).toHaveLength(2);
  const base = {
    runId: run.id,
    nodeId: pact.nodeId,
    campaignVersion: run.campaignVersion,
    assignments: [],
  };
  await expect(
    s.advance.execute('player', {
      key: 'missing',
      expectedRevision: s.state.revision,
      request: base,
    }),
  ).rejects.toMatchObject({ code: 'INVALID_OPERATION' });
  const before = s.state;
  const command = {
    key: 'chosen',
    expectedRevision: before.revision,
    request: { ...base, pactAction: 'recruit' as const, recruitId: pact.recruits![1].id },
  };
  const result = await s.advance.execute('player', command);
  expect(result.state.exploration!.run!.members.at(-1)!.unit).toEqual(pact.recruits![1]);
  expect(result.state.inventory).toEqual(before.inventory);
  expect(result.state.copies).toEqual(before.copies);
  expect((await s.advance.execute('player', command)).receipt).toEqual(result.receipt);
  await expect(
    s.advance.execute('player', {
      ...command,
      request: { ...command.request, recruitId: pact.recruits![0].id },
    }),
  ).rejects.toMatchObject({ code: 'OPERATION_CONFLICT' });
});
it('continues a fixed offer after live content changes and rejects snapshot corruption', async () => {
  const s = setup();
  await s.start.execute('player', {
    key: 'fixed',
    expectedRevision: 1,
    request: { zoneId: s.config.zoneId, campaignVersion: s.config.version, copyIds: ['copy0'] },
  });
  const run = s.state.exploration!.run!,
    pact = run.campaignSnapshot!.nodes.find((p) => p.kind === 'pact')!;
  if (pact.kind !== 'pact') throw Error();
  s.config = { ...s.config, version: 999, nodes: [] };
  const result = await s.advance.execute('player', {
    key: 'stored',
    expectedRevision: s.state.revision,
    request: {
      runId: run.id,
      nodeId: pact.nodeId,
      campaignVersion: run.campaignVersion,
      assignments: [],
      recruitId: pact.recruits![0].id,
    },
  });
  expect(result.state.exploration!.run!.members.at(-1)!.unit).toEqual(pact.recruits![0]);
  expect(() =>
    gameSnapshot({
      ...result.state,
      exploration: {
        ...result.state.exploration!,
        run: {
          ...result.state.exploration!.run!,
          campaignSnapshot: { ...run.campaignSnapshot!, version: 2 },
        },
      },
    }),
  ).toThrow('INVALID_GAME');
});
it('requires an explicit temporary replacement at five, protects owned copies and allows passing', async () => {
  for (const action of ['replace', 'pass'] as const) {
    const s = setup();
    await s.start.execute('player', {
      key: 'full',
      expectedRevision: 1,
      request: { zoneId: s.config.zoneId, campaignVersion: s.config.version, copyIds: ['copy0'] },
    });
    let run = s.state.exploration!.run!;
    await s.games.transact('player', (state) => ({
      ...state,
      revision: state.revision + 1,
      exploration: {
        ...state.exploration!,
        run: {
          ...run,
          members: [
            ...run.members,
            ...Array.from({ length: 4 }, (_, i) => ({
              source: 'temporary' as const,
              unit: { ...run.members[0].unit, id: `guest:${i}` },
            })),
          ],
        },
      },
    }));
    run = s.state.exploration!.run!;
    const pact = run.campaignSnapshot!.nodes.find((p) => p.kind === 'pact')!;
    if (pact.kind !== 'pact') throw Error();
    const before = s.state,
      request = {
        runId: run.id,
        nodeId: pact.nodeId,
        campaignVersion: run.campaignVersion,
        assignments: [],
        recruitId: pact.recruits![1].id,
        pactAction: 'recruit' as const,
      };
    await expect(
      s.advance.execute('player', {
        key: 'owned',
        expectedRevision: before.revision,
        request: { ...request, replaceUnitId: 'copy0' },
      }),
    ).rejects.toMatchObject({ code: 'INVALID_FORMATION' });
    expect(s.state).toEqual(before);
    const chosen =
      action === 'replace'
        ? { ...request, replaceUnitId: 'guest:0' }
        : {
            runId: run.id,
            nodeId: pact.nodeId,
            campaignVersion: run.campaignVersion,
            assignments: [],
            pactAction: 'pass' as const,
          };
    const result = await s.advance.execute('player', {
      key: 'resolved',
      expectedRevision: before.revision,
      request: chosen,
    });
    expect(result.state.exploration!.run!.members).toHaveLength(5);
    expect(result.state.inventory).toEqual(before.inventory);
    expect(result.state.copies).toEqual(before.copies);
    if (action === 'replace') {
      expect(result.state.exploration!.run!.members.at(-1)!.unit.id).toBe(pact.recruits![1].id);
      expect(result.state.exploration!.run!.members.some((m) => m.unit.id === 'guest:0')).toBe(
        false,
      );
    } else expect(result.state.exploration!.run!.members).toEqual(before.exploration!.run!.members);
  }
});
