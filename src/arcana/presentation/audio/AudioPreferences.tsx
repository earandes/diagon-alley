import { useId, useSyncExternalStore } from 'react';
import type { Language } from '../../domain/collection/wizards';
import { Artwork } from '../Artwork';
import { audioPreferences, gameAudio } from './runtime';
import { audioText as a } from './messages';
import './audio-settings.css';

/** Two tactile objects in the existing preference case; native volume only on demand. */
export function AudioPreferences({ language }: { language: Language }) {
  const preferences = useSyncExternalStore(
    audioPreferences.subscribe,
    audioPreferences.getSnapshot,
    audioPreferences.getSnapshot,
  );
  const status = useSyncExternalStore(
    gameAudio.subscribe,
    gameAudio.getSnapshot,
    gameAudio.getSnapshot,
  );
  const id = useId();
  const toggle = async (channel: 'music' | 'effects') => {
    const enabled = !audioPreferences.getSnapshot()[channel];
    audioPreferences.set({ [channel]: enabled });
    if (enabled && (await gameAudio.activate()) && channel === 'effects')
      gameAudio.play('cast-alchemy');
  };
  return (
    <section className="settings-audio" aria-label={a(language, 'sound')}>
      <fieldset className="settings-choices audio-choices">
        <legend>{a(language, 'sound')}</legend>
        {(['music', 'effects'] as const).map((channel) => (
          <button
            key={channel}
            type="button"
            aria-pressed={preferences[channel]}
            onClick={() => void toggle(channel)}
          >
            <SoundObject kind={channel} />
            <span>{a(language, channel)}</span>
            <small>{a(language, preferences[channel] ? 'enabled' : 'disabled')}</small>
            {preferences[channel] && <Artwork asset="ui.seal" language={language} decorative />}
          </button>
        ))}
      </fieldset>
      {(preferences.music || preferences.effects) && (
        <details className="audio-volume">
          <summary>{a(language, 'volume')}</summary>
          {(['music', 'effects'] as const)
            .filter((channel) => preferences[channel])
            .map((channel) => {
              const key = channel === 'music' ? 'musicVolume' : 'effectsVolume';
              const percent = new Intl.NumberFormat(language, { style: 'percent' }).format(
                preferences[key],
              );
              return (
                <label key={channel} htmlFor={`${id}-${channel}`}>
                  <span>{a(language, key)}</span>
                  <output>{percent}</output>
                  <input
                    id={`${id}-${channel}`}
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={preferences[key]}
                    aria-valuetext={percent}
                    onChange={(event) =>
                      audioPreferences.set({ [key]: Number(event.currentTarget.value) })
                    }
                  />
                </label>
              );
            })}
          <small>{a(language, 'local')}</small>
        </details>
      )}
      {status === 'loading' && (
        <p className="audio-state" role="status">
          {a(language, 'loading')}
        </p>
      )}
      {(status === 'blocked' || status === 'unavailable') && (
        <div className="audio-state" role="status">
          <p>{a(language, status)}</p>
          <button type="button" onClick={() => void gameAudio.activate()}>
            {a(language, 'retry')}
          </button>
        </div>
      )}
    </section>
  );
}

function SoundObject({ kind }: { kind: 'music' | 'effects' }) {
  return (
    <svg
      className="audio-object"
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      <path d="M13 53h39M17 49h31" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {kind === 'music' ? (
        <>
          <path
            d="M20 47 13 16Q38 9 50 21L43 46Z"
            fill="#9e7748"
            stroke="#f1d797"
            strokeWidth="2"
          />
          <path
            d="m18 20 6 24m2-26 3 26m4-25v25m7-23-3 23m9-20-5 20"
            stroke="#fff0c5"
            strokeWidth="1.5"
          />
          <path d="M17 15Q33 2 51 20" stroke="#d6ad65" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path
            d="m16 46 29-31 5 5-30 29Z"
            fill="#9e7748"
            stroke="#f1d797"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="m43 13 2-8 2 8 8 2-8 2-2 8-2-8-8-2Zm-24 3 1-5 2 5 5 2-5 1-2 5-1-5-5-1Z"
            fill="#f1d797"
          />
        </>
      )}
    </svg>
  );
}
