import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { Language } from '../domain/collection/wizards';
import { Artwork } from './Artwork';

/** One material family; native button semantics and operation ownership stay with the caller. */
export function FantasyActionButton({
  variant,
  asset,
  language,
  className = '',
  children,
  ...button
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: 'primary' | 'secondary' | 'tertiary';
  asset: string;
  language: Language;
  children: ReactNode;
}) {
  return (
    <button
      {...button}
      type={button.type ?? 'button'}
      className={`fantasy-action ${className}`}
      data-variant={variant}
    >
      <span className="fantasy-action-icon" aria-hidden="true">
        <Artwork asset={asset} language={language} decorative eager />
      </span>
      <span className="fantasy-action-label">{children}</span>
      <span className="fantasy-action-arrow" aria-hidden="true" />
    </button>
  );
}
