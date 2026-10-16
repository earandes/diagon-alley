import { useEffect, useRef, useState } from 'react';
import type { OperationReceipt } from '../application/game';
import type { Language } from '../domain/collection/wizards';
import { text } from './translations';
/** A receipt is announced once; language changes and authority refreshes do not repeat it. */
export function NodeAnnouncement({
  receipt,
  language,
}: {
  receipt: OperationReceipt | null;
  language: Language;
}) {
  const announced = useRef(new Set<string>());
  const [announcement, setAnnouncement] = useState<{ language: Language; value: string } | null>(
    null,
  );
  useEffect(() => {
    if (receipt?.kind !== 'advance-node' || receipt.battle || announced.current.has(receipt.id))
      return;
    announced.current.add(receipt.id);
    setAnnouncement({
      language,
      value: text(language, 'nodeConfirmedAnnouncement', { number: receipt.run.visited.length }),
    });
  }, [receipt, language]);
  return (
    <span className="visually-hidden" role="status" lang={announcement?.language}>
      {announcement?.value}
    </span>
  );
}
