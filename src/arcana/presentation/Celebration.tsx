import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Rarity } from '../domain/collection/rarity';
import { activePack } from './content-packs/active';
import { celebrationPreset, createCelebrationHistory } from './celebration-model';
import './celebration-a59.css';

const history = createCelebrationHistory();
type Burst = ReturnType<typeof celebrationPreset> & {
  readonly id: string;
  readonly rarity: Rarity;
  readonly deadline: number;
};

/** Mount only for a confirmed receipt. It never writes, blocks input or opens another renderer. */
export function Celebration({
  receiptId,
  reduced,
  enabled = true,
  rarity = 'common',
}: {
  receiptId: string;
  reduced: boolean;
  enabled?: boolean;
  rarity?: Rarity;
}) {
  const [burst, setBurst] = useState<Burst | null>(null);
  const current = useRef<Burst | null>(null);
  // Freeze this receipt's visual recipe; language/skin updates cannot restart or reshape its burst.
  const requested = useRef({ rarity, budget: activePack.animations.celebration });
  requested.current = { rarity, budget: activePack.animations.celebration };
  useEffect(() => {
    const claimed = history.claim(receiptId, { enabled, reduced });
    if (!enabled || reduced) {
      current.current = null;
      setBurst(null);
      return;
    }
    if (claimed) {
      const preset = celebrationPreset(requested.current.rarity, requested.current.budget);
      current.current =
        preset.count && preset.durationMs
          ? {
              ...preset,
              id: receiptId,
              rarity: requested.current.rarity,
              deadline: performance.now() + preset.durationMs,
            }
          : null;
    }
    const recipe = current.current;
    if (!recipe || recipe.id !== receiptId || recipe.deadline <= performance.now()) {
      current.current = null;
      setBurst(null);
      return;
    }
    setBurst(recipe);
    // A StrictMode effect restart resumes the same bounded timer, never an immortal particle layer.
    const timer = window.setTimeout(
      () => {
        current.current = null;
        setBurst(null);
      },
      Math.max(0, recipe.deadline - performance.now()),
    );
    return () => window.clearTimeout(timer);
  }, [receiptId, reduced, enabled]);
  if (!burst || burst.id !== receiptId || reduced || !enabled) return null;
  return (
    <div
      className="celebration celebration-a59"
      aria-hidden="true"
      data-celebration={receiptId}
      data-celebration-rarity={burst.rarity}
      data-celebration-shape={burst.shape}
      style={
        {
          '--burst-color': burst.color,
          '--burst-accent': burst.accent,
          '--burst-duration': `${burst.durationMs}ms`,
          '--particle-duration': `${Math.max(1, burst.durationMs - Math.min(100, burst.durationMs * 0.1))}ms`,
        } as CSSProperties
      }
    >
      <span className="celebration-a59-halo" />
      {Array.from({ length: burst.count }, (_, index) => (
        <span
          className="celebration-a59-particle"
          key={index}
          style={
            {
              '--particle-x': `${9 + ((index * 37) % 82)}%`,
              '--particle-y': `${12 + ((index * 19) % 45)}%`,
              '--particle-drift': `${((index * 29) % 126) - 63}px`,
              '--particle-spin': `${(index % 2 ? -1 : 1) * (80 + ((index * 31) % 180))}deg`,
              '--particle-size': `${3 + (index % 3) * 1.5}px`,
              '--particle-delay': `${Math.min(100, burst.durationMs * 0.1, index * 5)}ms`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
