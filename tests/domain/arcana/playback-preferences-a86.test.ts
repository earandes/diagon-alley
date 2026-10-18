import { describe, expect, it } from 'vitest';
import {
  readPlaybackSpeed,
  savePlaybackSpeed,
  playbackSpeedKey,
} from '../../../src/arcana/presentation/motion/playback-preferences';
describe('replay presentation preference', () => {
  it('defaults safely, remembers an explicit supported speed and rejects unrelated values', () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => {
        values.set(key, value);
      },
    };
    expect(readPlaybackSpeed(storage)).toBe(1);
    savePlaybackSpeed(2, storage);
    expect(readPlaybackSpeed(storage)).toBe(2);
    values.set(playbackSpeedKey, '99');
    expect(readPlaybackSpeed(storage)).toBe(1);
  });
  it('blocked or missing storage does not block the confirmed replay', () => {
    expect(readPlaybackSpeed()).toBe(1);
    expect(
      readPlaybackSpeed({
        getItem: () => {
          throw new Error('private');
        },
      }),
    ).toBe(1);
    expect(() =>
      savePlaybackSpeed(2, {
        setItem: () => {
          throw new Error('full');
        },
      }),
    ).not.toThrow();
  });
});
