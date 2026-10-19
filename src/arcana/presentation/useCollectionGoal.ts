import { useEffect, useState } from 'react';
import {
  collectionGoalKey,
  parseCollectionGoal,
  storeCollectionGoal,
  type CollectionGoal,
} from '../application/client/collection-goal';

export function useCollectionGoal(owner: string) {
  const [selection, setSelection] = useState<{
    owner: string;
    goal: CollectionGoal | null;
    durable: boolean;
  }>({ owner, goal: null, durable: true });
  useEffect(() => {
    const load = () => {
      try {
        setSelection({
          owner,
          goal: parseCollectionGoal(window.localStorage.getItem(collectionGoalKey(owner)), owner),
          durable: true,
        });
      } catch {
        setSelection((previous) =>
          previous.owner === owner
            ? { ...previous, durable: false }
            : { owner, goal: null, durable: false },
        );
      }
    };
    load();
    const changed = (event: StorageEvent) => {
      if (event.key === null || event.key === collectionGoalKey(owner)) load();
    };
    window.addEventListener('storage', changed);
    return () => window.removeEventListener('storage', changed);
  }, [owner]);
  const choose = (goal: CollectionGoal | null) => {
    let durable = false;
    try {
      durable = storeCollectionGoal(window.localStorage, owner, goal);
    } catch {
      /* Device preference only. */
    }
    setSelection({ owner, goal, durable });
  };
  return {
    goal: selection.owner === owner ? selection.goal : null,
    durable: selection.owner === owner && selection.durable,
    choose,
  };
}
