import { expect, it } from 'vitest';
import { nextExpeditionObjective } from '../../../src/arcana/presentation/expedition-objective';
import {
  readReadingPreference,
  saveReadingPreference,
} from '../../../src/arcana/presentation/reading-preference';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import type { Run } from '../../../src/arcana/domain/exploration/run';

const run = (): Run => ({
  id: 'guide-run',
  graphVersion: 1,
  campaignVersion: 1,
  zoneId: 'pasaje',
  graph: trialConfiguration().campaign.graph,
  visited: [],
  status: 'active',
  members: [
    {
      source: 'temporary',
      unit: {
        id: 'ally',
        wizardId: 'merlin',
        level: 1,
        affinity: 'alchemy',
        hp: 50,
        maxHp: 100,
        mana: 3,
        maxMana: 40,
        power: 10,
        speed: 10,
        wandPowerBonus: 0,
        wandMultiplier: 1,
        broomInitiative: 0,
      },
    },
  ],
});
it('guidance points only to a reachable opportunity and cannot advance or mutate a run', () => {
  const value = run(),
    before = JSON.stringify(value);
  const objective = nextExpeditionObjective(value, 50);
  expect(objective.kind).toBe('recruit');
  expect(value.graph.nodes.find((n) => n.id === objective.nodeId)?.kind).toBe('pact');
  expect(JSON.stringify(value)).toBe(before);
  expect(nextExpeditionObjective(null, 0).kind).toBe('begin');
});
it('distinguishes insufficient energy at a fight from recruitment and preserves legacy formation rules', () => {
  const value = run();
  const fighting = {
    ...value,
    visited: ['pasaje:0:0', 'pasaje:1:0'],
    members: [0, 1, 2].map((i) => ({
      ...value.members[0],
      unit: { ...value.members[0].unit, id: `ally${i}`, hp: i === 0 ? 50 : 0 },
    })),
  };
  expect(nextExpeditionObjective(fighting, 4).kind).toBe('energy');
  expect(nextExpeditionObjective(fighting, 5).kind).toBe('choose');
  expect(nextExpeditionObjective({ ...value, status: 'won' }, 0).kind).toBe('won');
});
it('scopes optional reading preferences to owner and tolerates blocked or malformed storage', () => {
  const items = new Map<string, string>();
  const storage = {
    getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => {
      items.set(key, value);
    },
  };
  saveReadingPreference('player-a', { version: 1, size: 'large', contrast: true }, storage);
  expect(readReadingPreference('player-a', storage).size).toBe('large');
  expect(readReadingPreference('player-b', storage)).toMatchObject({
    size: 'normal',
    contrast: false,
  });
  for (const key of items.keys()) items.set(key, '{invalid');
  expect(readReadingPreference('player-a', storage).size).toBe('normal');
  expect(() =>
    saveReadingPreference(
      'player-a',
      { version: 1, size: 'normal', contrast: false },
      {
        setItem: () => {
          throw Error('blocked');
        },
      },
    ),
  ).not.toThrow();
});
