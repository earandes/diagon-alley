import { useEffect, useState } from 'react';
import type { Language } from '../../domain/collection/wizards';
import { arenaText } from '../arena-messages';
import { playbackSpeedKey, readPlaybackSpeed, savePlaybackSpeed } from './playback-preferences';

export function usePlaybackSpeed() {
  const [speed, update] = useState<1 | 2>(() => {
    try {
      return readPlaybackSpeed(window.localStorage);
    } catch {
      return 1;
    }
  });
  useEffect(() => {
    const sync = (event: StorageEvent | Event) => {
      if (event instanceof CustomEvent) {
        update(event.detail as 1 | 2);
        return;
      }
      if (event instanceof StorageEvent && event.key !== playbackSpeedKey && event.key !== null)
        return;
      try {
        update(readPlaybackSpeed(window.localStorage));
      } catch {
        /* Keep the in-memory choice. */
      }
    };
    window.addEventListener('storage', sync);
    window.addEventListener('arcana:playback-preference', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('arcana:playback-preference', sync);
    };
  }, []);
  const setSpeed = (value: 1 | 2) => {
    update(value);
    try {
      savePlaybackSpeed(value, window.localStorage);
    } catch {
      /* Private storage may be unavailable. */
    }
    window.dispatchEvent(new CustomEvent('arcana:playback-preference', { detail: value }));
  };
  return [speed, setSpeed] as const;
}
export function PlaybackPreferences({ language }: { language: Language }) {
  const [speed, setSpeed] = usePlaybackSpeed();
  return (
    <fieldset className="settings-choices playback-preferences">
      <legend>{arenaText(language, 'speed')}</legend>
      {([1, 2] as const).map((value) => (
        <button key={value} aria-pressed={speed === value} onClick={() => setSpeed(value)}>
          {value}x
        </button>
      ))}
    </fieldset>
  );
}
