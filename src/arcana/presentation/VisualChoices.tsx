import { useEffect, useRef } from 'react';
import { animate } from 'motion/mini';
import { Artwork } from './Artwork';
import { useReducedMotion } from './useReducedMotion';
import type { Language } from '../domain/collection/wizards';

export type VisualOption = {
  id: string;
  label: string;
  asset: string;
  caption?: string;
  disabled?: boolean;
};
/** Selection is a preview. Only the caller's explicit confirmation persists a command. */
export function VisualChoices({
  label,
  value,
  options,
  onChange,
  language,
  disabled = false,
}: {
  label: string;
  value: string;
  options: VisualOption[];
  onChange: (value: string) => void;
  language: Language;
  disabled?: boolean;
}) {
  const { reduced } = useReducedMotion();
  const animation = useRef<ReturnType<typeof animate> | null>(null);
  useEffect(() => () => animation.current?.cancel(), []);
  useEffect(() => {
    if (reduced) animation.current?.cancel();
  }, [reduced]);
  return (
    <fieldset className="visual-choices" disabled={disabled}>
      <legend>{label}</legend>
      <div className="visual-choice-tray">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className="visual-choice"
            data-visual-value={option.id}
            aria-label={option.label}
            title={option.label}
            aria-pressed={value === option.id}
            disabled={option.disabled}
            onClick={(event) => {
              animation.current?.cancel();
              if (!reduced)
                animation.current = animate(
                  event.currentTarget,
                  { transform: ['translateY(0)', 'translateY(-5px)', 'translateY(0)'] },
                  { duration: 0.2, ease: 'easeOut' },
                );
              onChange(option.id);
            }}
          >
            <Artwork asset={option.asset} language={language} className="choice-art" decorative />
            <span className="choice-caption">{option.caption ?? option.label}</span>
            {value === option.id && (
              <Artwork asset="ui.seal" language={language} className="selection-seal" decorative />
            )}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
