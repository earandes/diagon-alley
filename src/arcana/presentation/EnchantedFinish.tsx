import { useId } from 'react';
import type { Language, WizardDefinition } from '../domain/collection/wizards';
import './houses-a85.css';
export const enchantedName = (language: Language) =>
  language === 'es' ? 'Cromo Encantado' : 'Enchanted Card';
export function EnchantedFinish({ wizard }: { wizard: WizardDefinition }) {
  const id = useId();
  if (!wizard.finish) return null;
  return (
    <svg className="enchanted-finish" viewBox="0 0 400 500" aria-hidden="true">
      <defs>
        <linearGradient id={id} x2="1" y2="1">
          <stop stopColor="#f4d587" />
          <stop offset=".3" stopColor="#99e3df" />
          <stop offset=".65" stopColor="#d5adf3" />
          <stop offset="1" stopColor="#f4d587" />
        </linearGradient>
      </defs>
      <path className="enchanted-sheen" d="M0 0 50 0 350 500 300 500Z" fill="#fff1cf" opacity="0" />
      <path
        d="M35 9H365L391 35V465L365 491H35L9 465V35Z"
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth="12"
      />
      <path
        d="M39 23H361L377 39V461L361 477H39L23 461V39Z"
        fill="none"
        stroke="#fff0d0"
        strokeWidth="2"
      />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${i % 2 ? 355 : 45} ${i > 1 ? 455 : 45})`}>
          <path d="M0-22 6-6 22 0 6 6 0 22-6 6-22 0-6-6Z" fill="#f9df96" />
          <circle r="28" fill="none" stroke="#99e3df" strokeWidth="2" />
        </g>
      ))}
      <path
        d="M20 130 34 146 20 164 34 181 20 200M380 300 366 319 380 337 366 356 380 374M75 19 91 31 110 19M290 481 310 469 329 481"
        fill="none"
        stroke="#d1b5ed"
        strokeWidth="2"
      />
      <path d="M172 476 200 448 228 476 200 498Z" fill="#29213e" stroke="#f4d587" strokeWidth="3" />
      <path d="M200 458 204 470 216 474 204 478 200 490 196 478 184 474 196 470Z" fill="#f4d587" />
    </svg>
  );
}
export function FinishLabel({
  wizard,
  language,
}: {
  wizard: WizardDefinition;
  language: Language;
}) {
  return wizard.finish ? (
    <span className="enchanted-label">✧ {enchantedName(language)}</span>
  ) : null;
}
