import { expect, it } from 'vitest';
import {
  castProfile,
  bondCastOffset,
  creatureProfile,
} from '../../../src/arcana/presentation/motion/cast-profile';
import { BattleAudioTrack } from '../../../src/arcana/presentation/audio/battle-audio-track';
import { CombatEngine, type CombatUnitInput } from '../../../src/arcana/domain/combat/engine';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { SeededRandom } from '../../../src/arcana/infrastructure/random/seeded-random';
import { bondMessages, bondText } from '../../../src/arcana/presentation/bond-messages';

it('provides complete bilingual messages with identical parameters and localized fractional values', () => {
  const parameters = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
  for (const message of Object.values(bondMessages)) {
    expect(message.es.trim()).not.toBe('');
    expect(message.en.trim()).not.toBe('');
    expect(parameters(message.es)).toEqual(parameters(message.en));
  }
  expect(bondText('es', 'helpEvent', { healer: 'A', recipient: 'B', value: '0,5' })).toBe(
    'A ayuda a B: +0,5 PV.',
  );
  expect(bondText('en', 'helpEvent', { healer: 'A', recipient: 'B', value: '0.5' })).toBe(
    'A helps B: +0.5 HP.',
  );
});
const creatures = ['phoenix-companion', 'hippogriff-companion', 'forest-unicorn', 'green-dragon'];
it('uses one cosmetic profile with finite paths; species takes priority over a contributing bond', () => {
  expect(castProfile('merlin', 'order')).toBe('order');
  expect(castProfile('merlin')).toBeUndefined();
  for (const id of creatures) {
    const profile = creatureProfile(id)!;
    expect(castProfile(id, 'creatures')).toBe(profile.species);
    expect(profile.origin.every((n) => n > 0 && n < 1)).toBe(true);
    expect(bondCastOffset(profile.species, -1)).toBeCloseTo(0);
    expect(bondCastOffset(profile.species, 2)).toBeCloseTo(0);
    expect(Number.isFinite(bondCastOffset(profile.species, 0.5))).toBe(true);
  }
});
it('emits one species cue from confirmed events, without repeating at the same clock phase or playing hidden', () => {
  const c = trialConfiguration('a87');
  const fighter = (id: string, wizardId: string, speed: number): CombatUnitInput => ({
    id,
    wizardId,
    level: 1,
    affinity: 'neutral',
    hp: 100,
    maxHp: 100,
    mana: 40,
    maxMana: 40,
    power: 5,
    speed,
    wandPowerBonus: 0,
    wandMultiplier: 1,
    broomInitiative: 0,
  });
  const battle = new CombatEngine({ fromSeed: (seed) => new SeededRandom(seed) }).resolve({
    id: 'audio',
    seed: 0,
    player: creatures.map((id, n) => fighter(`p${n}`, id, 20 - n)),
    rival: [0, 1, 2].map((n) => fighter(`r${n}`, 'rival', 1)),
    rules: c.campaign.combatRules,
  });
  const cursor = battle.events.findIndex((e) => e.kind === 'spell-cast');
  const track = new BattleAudioTrack(battle);
  const position = {
    cursor,
    phase: 'flight' as const,
    progress: 0.3,
    playing: true,
    visible: true,
    speed: 1 as const,
  };
  expect(track.consume(position)).toEqual(['cast-phoenix']);
  expect(track.consume(position)).toEqual([]);
  expect(track.consume({ ...position, cursor: cursor + 1, visible: false })).toEqual([]);
  for (const [n, expected] of ['phoenix', 'hippogriff', 'unicorn', 'dragon'].entries()) {
    const at = battle.events.findIndex((e) => e.kind === 'spell-cast' && e.actorId === `p${n}`);
    expect(at).toBeGreaterThan(0);
    expect(new BattleAudioTrack(battle).consume({ ...position, cursor: at })).toEqual([
      `cast-${expected}`,
    ]);
  }
  const guarded = battle.events.findIndex((e) => e.kind === 'spell-cast' && (e.guarded ?? 0) > 0);
  expect(guarded).toBeGreaterThan(0);
  expect(
    new BattleAudioTrack(battle).consume({ ...position, cursor: guarded, phase: 'impact' }),
  ).toEqual(['cast-creatures']);
});
