const KEY = 'arcana.visual-history.a69.v1';
const LIMIT = 256;
type VisualStorage = Pick<Storage, 'getItem' | 'setItem'>;

/** Cosmetic identifiers only: losing this cache may replay a visual, never an operation. */
export function createVisualHistory(storage?: VisualStorage) {
  const entries = new Set<string>();
  const read = () => {
    try {
      const parsed: unknown = JSON.parse(storage?.getItem(KEY) ?? '[]');
      if (Array.isArray(parsed))
        for (const entry of parsed.slice(-LIMIT)) {
          if (typeof entry === 'string' && entry.length > 0 && entry.length <= 1024)
            entries.add(entry);
        }
    } catch {
      /* Optional, untrusted presentation metadata never blocks a result. */
    }
    while (entries.size > LIMIT) entries.delete(entries.values().next().value!);
  };
  const identity = (namespace: string, id: string) =>
    namespace && id && namespace.length <= 128 && id.length <= 512
      ? JSON.stringify([namespace, id])
      : null;
  return {
    has(namespace: string, id: string) {
      read();
      const key = identity(namespace, id);
      return !!key && entries.has(key);
    },
    claim(namespace: string, id: string) {
      read();
      const key = identity(namespace, id);
      if (!key || entries.has(key)) return false;
      entries.add(key);
      while (entries.size > LIMIT) entries.delete(entries.values().next().value!);
      try {
        storage?.setItem(KEY, JSON.stringify([...entries]));
      } catch {
        /* In-memory protection remains. */
      }
      return true;
    },
  };
}
let shared: ReturnType<typeof createVisualHistory> | undefined;
function visualHistory() {
  if (!shared) {
    let storage: VisualStorage | undefined;
    try {
      if (typeof sessionStorage !== 'undefined') storage = sessionStorage;
    } catch {
      /* Blocked preference storage. */
    }
    shared = createVisualHistory(storage);
  }
  return shared;
}
export const claimVisualEvent = (namespace: string, id: string) =>
  visualHistory().claim(namespace, id);
export const hasVisualEvent = (namespace: string, id: string) => visualHistory().has(namespace, id);
