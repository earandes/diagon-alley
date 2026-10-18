import { useEffect, useMemo } from 'react';
import type { Combat } from '../../domain/combat/engine';
import type { PlaybackPosition } from '../motion/replay-clock';
import { AUDIO_PREFERENCE_KEY, AudioPreferencesStore } from './preferences';
import { BattleAudioTrack } from './battle-audio-track';
import { GameAudio } from './game-audio';

function optionalStorage() {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
}
export const audioPreferences = new AudioPreferencesStore(optionalStorage());
export const gameAudio = new GameAudio(audioPreferences);

export function useGameAudioLifecycle() {
  useEffect(() => {
    let attempted = false;
    const gesture = (event: Event) => {
      if (event instanceof KeyboardEvent && !['Enter', ' '].includes(event.key)) return;
      const p = audioPreferences.getSnapshot();
      if (attempted || (!p.music && !p.effects)) return;
      attempted = true;
      if (gameAudio.getSnapshot() === 'off') void gameAudio.activate();
    };
    const visibility = () => gameAudio.setForeground(!document.hidden);
    const storage = (event: StorageEvent) => {
      if (event.key === AUDIO_PREFERENCE_KEY || event.key === null)
        audioPreferences.receive(event.newValue);
    };
    const pagehide = () => gameAudio.dispose();
    const pageshow = () => {
      attempted = false;
      visibility();
    };
    visibility();
    document.addEventListener('pointerdown', gesture, true);
    document.addEventListener('keydown', gesture, true);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('storage', storage);
    window.addEventListener('pagehide', pagehide);
    window.addEventListener('pageshow', pageshow);
    return () => {
      document.removeEventListener('pointerdown', gesture, true);
      document.removeEventListener('keydown', gesture, true);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('storage', storage);
      window.removeEventListener('pagehide', pagehide);
      window.removeEventListener('pageshow', pageshow);
      gameAudio.dispose();
    };
  }, []);
}

export function useBattleAudio(combat: Combat, position: PlaybackPosition) {
  const track = useMemo(() => new BattleAudioTrack(combat), [combat]);
  useEffect(() => {
    gameAudio.setBattleActive(true);
    return () => {
      gameAudio.stopEffects();
      gameAudio.setBattleActive(false);
    };
  }, [track]);
  useEffect(() => {
    if (!position.playing || !position.visible || position.phase === 'finished')
      gameAudio.stopEffects();
    for (const cue of track.consume(position)) gameAudio.play(cue);
  }, [track, position.cursor, position.phase, position.playing, position.visible]);
}
