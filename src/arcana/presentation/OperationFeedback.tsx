import { animate } from 'motion/mini';
import { useEffect, useRef, useState } from 'react';
import type { OperationReceipt } from '../application/game';
import type { Language } from '../domain/collection/wizards';
import { activePack } from './content-packs/active';
import { text } from './translations';
import { Artwork } from './Artwork';
import { claimVisualEvent } from './visual-history';

function feedback(receipt: OperationReceipt | null, language: Language) {
  if (receipt?.kind === 'purchase')
    return text(
      language,
      receipt.request.product === 'cacao-toad' ? 'toadPurchaseSaved' : 'beansPurchaseSaved',
      {
        count: new Intl.NumberFormat(language).format(receipt.unitIds.length),
        spent: new Intl.NumberFormat(language).format(receipt.spentCrowns),
      },
    );
  if (receipt?.kind === 'set-team') return text(language, 'teamSelectionSaved');
  if (receipt?.kind === 'equip-equipment') return text(language, 'equipmentSelectionSaved');
  return null;
}

/** Durable success is the trigger; pending requests cannot produce a success cue. */
export function OperationFeedback({
  receipt,
  language,
  reduced,
}: {
  receipt: OperationReceipt | null;
  language: Language;
  reduced: boolean;
}) {
  const region = useRef<HTMLDivElement>(null);
  const [announcement, setAnnouncement] = useState<{ value: string; language: Language } | null>(
    null,
  );
  const value = feedback(receipt, language);
  useEffect(() => {
    const element = region.current;
    if (!receipt || !value || !element || !claimVisualEvent('operation-feedback', receipt.id))
      return;
    setAnnouncement({ value, language });
    if (reduced || document.hidden) return;
    const animation = animate(
      element,
      {
        transform: ['translateY(4px)', 'translateY(0px)'],
        opacity: [0.7, 1],
      },
      {
        duration: Math.min(180, activePack.animations.feedback.durationMs) / 1000,
        ease: [0.16, 1, 0.3, 1],
      },
    );
    return () => animation.cancel();
  }, [receipt?.id, reduced]);
  return (
    <>
      <div
        ref={region}
        className="operation-feedback"
        hidden={!value}
        data-confirmed-operation={value ? receipt?.id : undefined}
      >
        <details className="operation-receipt">
          <summary aria-label={value ?? undefined}>
            <Artwork
              asset={
                receipt?.kind === 'purchase'
                  ? receipt.request.product === 'cacao-toad'
                    ? 'toad.box'
                    : 'beans.jar'
                  : receipt?.kind === 'set-team'
                    ? 'ui.owned'
                    : 'product.wand-birch'
              }
              language={language}
              decorative
            />
            {receipt?.kind === 'purchase' && (
              <>
                <strong>+{new Intl.NumberFormat(language).format(receipt.unitIds.length)}</strong>
                <span className="feedback-cost">
                  <Artwork asset="currency.crowns" language={language} decorative />−
                  {new Intl.NumberFormat(language).format(receipt.spentCrowns)}
                </span>
              </>
            )}
            <Artwork asset="ui.seal" language={language} decorative />
          </summary>
          <p>{value}</p>
        </details>
      </div>
      <span className="visually-hidden" role="status" lang={announcement?.language}>
        {announcement?.value}
      </span>
    </>
  );
}
