export interface AudioPreferences {
  readonly music: boolean;
  readonly effects: boolean;
  readonly musicVolume: number;
  readonly effectsVolume: number;
}
export const AUDIO_PREFERENCE_KEY = 'arcana.presentation.audio.v1';
export const SILENT_PREFERENCES: AudioPreferences = Object.freeze({
  music: false,
  effects: false,
  musicVolume: 0.3,
  effectsVolume: 0.5,
});
type StoragePort = Pick<Storage, 'getItem' | 'setItem'>;
function parse(value: string | null): AudioPreferences | null {
  if (value === null) return SILENT_PREFERENCES;
  try {
    const p = JSON.parse(value) as AudioPreferences;
    if (
      typeof p?.music !== 'boolean' ||
      typeof p.effects !== 'boolean' ||
      ![p.musicVolume, p.effectsVolume].every(
        (n) => typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 1,
      )
    )
      return null;
    return Object.freeze({
      music: p.music,
      effects: p.effects,
      musicVolume: p.musicVolume,
      effectsVolume: p.effectsVolume,
    });
  } catch {
    return null;
  }
}
export class AudioPreferencesStore {
  private current: AudioPreferences = SILENT_PREFERENCES;
  private readonly listeners = new Set<() => void>();
  constructor(private readonly storage?: StoragePort) {
    try {
      this.current = parse(storage?.getItem(AUDIO_PREFERENCE_KEY) ?? null) ?? SILENT_PREFERENCES;
    } catch {
      /* preferences are optional */
    }
  }
  getSnapshot = () => this.current;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  receive(value: string | null) {
    const next = parse(value);
    if (next && JSON.stringify(next) !== JSON.stringify(this.current)) {
      this.current = next;
      this.listeners.forEach((listener) => listener());
    }
  }
  set(patch: Partial<AudioPreferences>) {
    const next = parse(JSON.stringify({ ...this.current, ...patch }));
    if (!next) return;
    this.current = next;
    try {
      this.storage?.setItem(AUDIO_PREFERENCE_KEY, JSON.stringify(next));
    } catch {
      /* retain local memory */
    }
    this.listeners.forEach((listener) => listener());
  }
}
