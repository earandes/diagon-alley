import { describe, expect, it, vi } from 'vitest';
import { AudioPreferencesStore } from '../../../src/arcana/presentation/audio/preferences';
import { BattleAudioTrack } from '../../../src/arcana/presentation/audio/battle-audio-track';
import { GameAudio } from '../../../src/arcana/presentation/audio/game-audio';
import type { Combat } from '../../../src/arcana/domain/combat/engine';
import type { PlaybackPosition } from '../../../src/arcana/presentation/motion/replay-clock';

const position = (phase: PlaybackPosition['phase'], cursor = 0): PlaybackPosition => ({
  phase,
  cursor,
  progress: 0.5,
  playing: true,
  visible: true,
  speed: 1,
});
const combat = {
  input: { player: [{ id: 'p', affinity: 'fire' }], rival: [] },
  events: [
    { sequence: 0, kind: 'spell-cast', actorId: 'p', targetId: 'r', missed: false, damage: 4 },
    { sequence: 1, kind: 'spell-cast', actorId: 'p', targetId: 'r', missed: true, damage: 0 },
    { sequence: 2, kind: 'healed', actorId: 'p', amount: 3 },
    { sequence: 3, kind: 'combat-finished', outcome: 'player' },
  ],
} as unknown as Combat;

describe('A84 voluntary preferences and confirmed battle cues', () => {
  it('starts silent, validates persisted values and works without writable storage', () => {
    const storage = {
      getItem: () => '{"music":true,"effects":"yes","musicVolume":4}',
      setItem: vi.fn(() => {
        throw Error('blocked');
      }),
    };
    const prefs = new AudioPreferencesStore(storage);
    expect(prefs.getSnapshot()).toMatchObject({ music: false, effects: false });
    prefs.set({ effects: true, effectsVolume: 0.4 });
    expect(prefs.getSnapshot()).toMatchObject({ effects: true, effectsVolume: 0.4 });
    expect(storage.setItem).toHaveBeenCalled();
    prefs.set({ musicVolume: Infinity });
    expect(prefs.getSnapshot().musicVolume).toBeLessThanOrEqual(1);
  });
  it('restores valid choices without changing them when the external payload is invalid', () => {
    const prefs = new AudioPreferencesStore();
    prefs.receive('{"music":true,"effects":false,"musicVolume":0.2,"effectsVolume":0.4}');
    expect(prefs.getSnapshot().music).toBe(true);
    prefs.receive('bad JSON');
    expect(prefs.getSnapshot().music).toBe(true);
    prefs.receive(null);
    expect(prefs.getSnapshot().music).toBe(false);
  });
  it('uses the saved affinity and phase, emits once and never catches up after skip', () => {
    const track = new BattleAudioTrack(combat);
    expect(track.consume(position('anticipation'))).toEqual([]);
    expect(track.consume(position('flight'))).toEqual(['cast-fire']);
    expect(track.consume(position('flight'))).toEqual([]);
    expect(track.consume(position('impact'))).toEqual(['impact']);
    expect(track.consume(position('impact'))).toEqual([]);
    expect(track.consume({ ...position('settle'), playing: false })).toEqual([]);
    expect(track.consume(position('impact', 1))).toEqual(['miss']);
    expect(track.consume(position('impact', 2))).toEqual(['heal']);
    expect(track.consume(position('finished', combat.events.length))).toEqual([]);
  });
  it('does not announce outcome, queue paused events or replay sound on rewind', () => {
    const track = new BattleAudioTrack(combat);
    expect(track.consume({ ...position('flight'), playing: false })).toEqual([]);
    expect(track.consume(position('flight'))).toEqual([]);
    expect(track.consume(position('impact', 3))).toEqual([]);
    expect(track.consume(position('flight', 0))).toEqual([]);
  });
});

function fixture() {
  const voices: {
    start: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
    onended: (() => void) | null;
    buffer: unknown;
    loop: boolean;
    connect: ReturnType<typeof vi.fn>;
  }[] = [];
  const gain = () => ({
    gain: {
      value: 0,
      setTargetAtTime: vi.fn(),
      cancelScheduledValues: vi.fn(),
      setValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
    disconnect: vi.fn(),
  });
  const context = {
    currentTime: 0,
    state: 'suspended',
    destination: {},
    resume: vi.fn(async () => {
      context.state = 'running';
    }),
    suspend: vi.fn(async () => {
      context.state = 'suspended';
    }),
    close: vi.fn(async () => undefined),
    createGain: vi.fn(gain),
    createBufferSource: vi.fn(() => {
      const source = {
        start: vi.fn(),
        stop: vi.fn(),
        disconnect: vi.fn(),
        connect: vi.fn(),
        buffer: null,
        loop: false,
        onended: null,
      };
      voices.push(source);
      return source;
    }),
    decodeAudioData: vi.fn(async () => ({ duration: 0.2 })),
  };
  const createContext = vi.fn(() => context as unknown as AudioContext);
  const load = vi.fn(async () => new ArrayBuffer(16));
  const preferences = new AudioPreferencesStore();
  const audio = new GameAudio(preferences, { createContext, load });
  return { audio, preferences, createContext, load, context, voices };
}

describe('A84 audio resources and cancellation', () => {
  it('creates and fetches nothing before deliberate activation, even with saved choices', async () => {
    const f = fixture();
    f.preferences.set({ music: true, effects: true });
    f.audio.play('impact');
    expect(f.createContext).not.toHaveBeenCalled();
    expect(f.load).not.toHaveBeenCalled();
    await f.audio.activate();
    expect(f.createContext).toHaveBeenCalledTimes(1);
    expect(f.voices.filter((v) => v.loop)).toHaveLength(1);
    f.preferences.set({ music: false });
    expect(f.voices.find((v) => v.loop)?.stop).toHaveBeenCalled();
    f.audio.dispose();
    expect(f.context.close).toHaveBeenCalled();
  });
  it('bounds voices, clears effects immediately and does not duplicate music', async () => {
    const f = fixture();
    f.preferences.set({ music: true, effects: true });
    await f.audio.activate();
    await f.audio.activate();
    expect(f.voices.filter((v) => v.loop)).toHaveLength(1);
    for (let i = 0; i < 20; i++) f.audio.play('impact');
    expect(f.audio.diagnostics().effectVoices).toBeLessThanOrEqual(4);
    f.audio.stopEffects();
    expect(f.audio.diagnostics().effectVoices).toBe(0);
    f.audio.setForeground(false);
    expect(f.context.suspend).toHaveBeenCalled();
    f.audio.dispose();
  });
  it('does not turn a late download into sound after disabling or disposal', async () => {
    const f = fixture();
    let finish!: (buffer: ArrayBuffer) => void;
    f.load.mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    f.preferences.set({ music: true });
    const activation = f.audio.activate();
    await vi.waitFor(() => expect(f.load).toHaveBeenCalled());
    f.preferences.set({ music: false });
    f.audio.dispose();
    finish(new ArrayBuffer(16));
    await activation;
    expect(f.voices).toHaveLength(0);
    expect(f.audio.diagnostics().buffers).toBe(0);
  });
  it('contains unsupported APIs and failed assets without rejecting gameplay', async () => {
    const preferences = new AudioPreferencesStore();
    preferences.set({ effects: true });
    const missing = new GameAudio(preferences, {
      createContext: () => {
        throw Error('unsupported');
      },
      load: async () => {
        throw Error('offline');
      },
    });
    await expect(missing.activate()).resolves.toBe(false);
    expect(missing.getSnapshot()).toBe('unavailable');
    missing.play('impact');
    missing.dispose();
    const f = fixture();
    f.preferences.set({ music: true });
    f.load.mockRejectedValue(Error('offline'));
    await expect(f.audio.activate()).resolves.toBe(false);
    f.audio.dispose();
  });
});
