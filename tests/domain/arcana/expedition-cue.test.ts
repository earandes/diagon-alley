import { expect, it } from 'vitest';
import { expeditionCue } from '../../../src/arcana/presentation/expedition-cue';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import type { Run } from '../../../src/arcana/domain/exploration/run';

const run = (visited: string[] = [], count = 1): Run => ({
  id: 'cue-fixture',
  graphVersion: 1,
  campaignVersion: 1,
  zoneId: 'pasaje',
  graph: trialConfiguration().campaign.graph,
  visited,
  status: 'active',
  members: Array.from({ length: count }, (_, i) => ({
    source: 'temporary',
    unit: {
      id: `unit-${i}`,
      wizardId: 'apprentice',
      level: 1,
      affinity: 'alchemy',
      hp: 100,
      maxHp: 100,
      mana: 40,
      maxMana: 40,
      power: 10,
      speed: 10,
      wandPowerBonus: 0,
      wandMultiplier: 1,
      broomInitiative: 0,
    },
  })),
});
it('guides a new session and real available pacts without creating a command', () => {
  expect(expeditionCue(null)).toBe('begin');
  expect(expeditionCue(run())).toBe('recruit');
  expect(expeditionCue(run(['pasaje:0:0'], 2))).toBe('recruit');
});
it('does not suggest an unavailable pact and separates formation from health', () => {
  expect(expeditionCue(run(['pasaje:0:0', 'pasaje:1:0'], 2))).toBe('prepare');
  const initial = run(['pasaje:0:0', 'pasaje:1:0'], 3);
  const ready = {
    ...initial,
    members: initial.members.map((m, i) => (i === 0 ? { ...m, unit: { ...m.unit, hp: 0 } } : m)),
  };
  const original = JSON.stringify(ready);
  expect(expeditionCue(ready)).toBe('choose');
  expect(JSON.stringify(ready)).toBe(original);
});
it('closed expeditions show their outcome even with the former team still present', () => {
  expect(expeditionCue({ ...run(), status: 'won' })).toBe('won');
  expect(expeditionCue({ ...run(), status: 'lost' })).toBe('lost');
  expect(expeditionCue({ ...run(), status: 'draw' })).toBe('draw');
});
