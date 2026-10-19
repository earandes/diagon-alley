import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import type { Language } from '../domain/collection/wizards';
import {
  readReadingPreference,
  saveReadingPreference,
  readingPreferenceKey,
  type ReadingPreference,
} from './reading-preference';
import { priorityText as t } from './priority-messages';
import './priority-a89.css';
export const PreferenceOwnerContext = createContext<string | null>(null);
const changed = 'arcana-reading-changed';
const fallback = JSON.stringify({ version: 1, size: 'normal', contrast: false });
// One current preference only: blocked storage must not make the controls inert.
let volatilePreference: { owner: string | null; value: ReadingPreference } | null = null;
function snapshot(owner: string | null) {
  if (volatilePreference?.owner === owner) return JSON.stringify(volatilePreference.value);
  try {
    return JSON.stringify(readReadingPreference(owner, localStorage));
  } catch {
    return fallback;
  }
}
function subscribe(listener: () => void) {
  const storageChanged = (event: StorageEvent) => {
    if (!event.key || event.key === readingPreferenceKey(volatilePreference?.owner ?? null))
      volatilePreference = null;
    listener();
  };
  window.addEventListener(changed, listener);
  window.addEventListener('storage', storageChanged);
  return () => {
    window.removeEventListener(changed, listener);
    window.removeEventListener('storage', storageChanged);
  };
}
function useReading(owner: string | null) {
  const raw = useSyncExternalStore(
    subscribe,
    () => snapshot(owner),
    () => fallback,
  );
  const value = useMemo(() => JSON.parse(raw) as ReadingPreference, [raw]);
  return {
    value,
    change: (next: ReadingPreference) => {
      volatilePreference = { owner, value: next };
      try {
        saveReadingPreference(owner, next, localStorage);
      } catch {
        /* Optional. */
      }
      window.dispatchEvent(new CustomEvent(changed, { detail: readingPreferenceKey(owner) }));
    },
  };
}
export function ReadingScope({ owner, children }: { owner: string | null; children: ReactNode }) {
  const { value } = useReading(owner);
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.readingSize = value.size;
    root.dataset.readingContrast = String(value.contrast);
    return () => {
      delete root.dataset.readingSize;
      delete root.dataset.readingContrast;
    };
  }, [value]);
  return (
    <PreferenceOwnerContext.Provider value={owner}>{children}</PreferenceOwnerContext.Provider>
  );
}
export function ReadingPreferences({ language }: { language: Language }) {
  const owner = useContext(PreferenceOwnerContext),
    { value, change } = useReading(owner);
  const [system, setSystem] = useState(
    () =>
      typeof matchMedia === 'function' &&
      (matchMedia('(prefers-contrast: more)').matches ||
        matchMedia('(forced-colors: active)').matches),
  );
  useEffect(() => {
    if (typeof matchMedia !== 'function') return;
    const query = matchMedia('(prefers-contrast: more)'),
      forced = matchMedia('(forced-colors: active)'),
      update = () => setSystem(query.matches || forced.matches);
    query.addEventListener('change', update);
    forced.addEventListener('change', update);
    return () => {
      query.removeEventListener('change', update);
      forced.removeEventListener('change', update);
    };
  }, []);
  return (
    <fieldset className="settings-choices reading-preferences">
      <legend>{t(language, 'reading')}</legend>
      <div>
        {(['normal', 'large'] as const).map((size) => (
          <button
            key={size}
            aria-pressed={value.size === size}
            onClick={() => change({ ...value, size })}
          >
            {t(language, size)}
          </button>
        ))}
      </div>
      <button
        aria-pressed={value.contrast}
        onClick={() => change({ ...value, contrast: !value.contrast })}
      >
        {t(language, 'contrast')}
      </button>
      <p>{t(language, system ? 'systemContrast' : 'ownContrast')}</p>
    </fieldset>
  );
}
