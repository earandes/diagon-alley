import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import type { Language } from '../domain/collection/wizards';
import { Artwork } from './Artwork';
import { CloseButton } from './CloseButton';
import { shopText } from './shop-messages';
import './shop-journey.css';

/** A consultation never sends a command. Native modal keeps keyboard focus inside the book. */
export function ShopBook({
  language,
  label,
  caption,
  asset = 'ui.collection',
  children,
  compact = false,
}: {
  language: Language;
  label: string;
  caption: string;
  asset?: string;
  children: ReactNode;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const heading = useId();
  useEffect(() => {
    if (!open || !dialog.current) return;
    const element = dialog.current;
    element.showModal();
    return () => {
      if (element.open) element.close();
      if (trigger.current?.isConnected) trigger.current.focus({ preventScroll: true });
    };
  }, [open]);
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className={`shop-book-object game-object${compact ? ' shop-info-object' : ''}`}
        aria-label={label}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        {compact ? (
          <span className="shop-info-seal" aria-hidden="true">
            i
          </span>
        ) : (
          <span className="shop-book-cover">
            <Artwork asset={asset} language={language} decorative />
          </span>
        )}
        <span>{caption}</span>
      </button>
      {open && (
        <dialog
          ref={dialog}
          className="shop-ledger"
          aria-labelledby={heading}
          onCancel={() => setOpen(false)}
        >
          <div className="shop-ledger-heading">
            <h2 id={heading}>{label}</h2>
            <CloseButton
              className="shop-ledger-close game-object"
              label={shopText(language, 'closeBook')}
              onClose={() => setOpen(false)}
            />
          </div>
          {children}
        </dialog>
      )}
    </>
  );
}

export function ShopExit({ language, onStreet }: { language: Language; onStreet?: () => void }) {
  if (!onStreet) return null;
  return (
    <button
      type="button"
      className="shop-street-exit game-object"
      onClick={onStreet}
      aria-label={shopText(language, 'street')}
    >
      <svg className="shop-return-sign" viewBox="0 0 76 54" aria-hidden="true" focusable="false">
        <path d="M30 6h29v42H30z" fill="#573d32" stroke="#d6b471" strokeWidth="2" />
        <path d="M39 15h16v29H39z" fill="#132235" stroke="#ad8c54" />
        <path d="M39 14l12-4v34l-12 3z" fill="#bd985d" stroke="#eed59c" />
        <path
          d="M42 29H7m0 0 12-12M7 29l12 12"
          fill="none"
          stroke="#ffe6a6"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="shop-exit-label">{shopText(language, 'alleyShort')}</span>
    </button>
  );
}
