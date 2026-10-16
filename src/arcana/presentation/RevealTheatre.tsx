import type { Rarity } from '../domain/collection/rarity';
import type { ReactNode } from 'react';
const ranks = { common: 0, unusual: 1, epic: 2, 'arcane-legendary': 3 } as const;
/** Original vector stage decoration. It cannot reveal or change the confirmed result. */
export function RevealTheatre({ rarity, children }: { rarity: Rarity; children?: ReactNode }) {
  const rank = ranks[rarity];
  return (
    <div className="opening-theatre" data-theatre-rank={rank} aria-hidden="true">
      <div className="theatre-aura" />
      <svg className="theatre-engraving" viewBox="0 0 600 520" fill="none">
        <g className="theatre-orbits" stroke="currentColor">
          <ellipse
            cx="300"
            cy="260"
            rx="190"
            ry="216"
            strokeWidth="1"
            strokeDasharray={rank > 1 ? '2 12' : '1 19'}
          />
          {rank > 0 && (
            <ellipse
              cx="300"
              cy="260"
              rx="218"
              ry="195"
              strokeWidth="1.2"
              strokeDasharray="24 20 3 20"
              transform="rotate(-16 300 260)"
            />
          )}
          {rank > 1 && (
            <ellipse cx="300" cy="260" rx="228" ry="233" strokeWidth=".8" strokeDasharray="46 36" />
          )}
        </g>
        <g className="theatre-rays" stroke="currentColor" strokeWidth="1.4">
          {Array.from({ length: 4 + rank * 4 }, (_, i) => {
            const angle = (i * Math.PI * 2) / (4 + rank * 4),
              x = 300 + Math.cos(angle) * 205,
              y = 260 + Math.sin(angle) * 198;
            return (
              <g key={i} transform={`translate(${x} ${y})`}>
                <path d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z" />
                {rank === 3 && <path d="M0 -15V-11M0 11V15M-15 0H-11M11 0H15" />}
              </g>
            );
          })}
        </g>
        {rank === 3 && (
          <g className="theatre-crown" stroke="currentColor" strokeWidth="2">
            <path d="M270 45 276 61 300 34 324 61 330 45 324 76H276Z" />
            <path d="M280 82H320" />
          </g>
        )}
      </svg>
      {children}
    </div>
  );
}
