import type { Language } from '../domain/collection/wizards';
import type { Affinity } from '../domain/combat/engine';
import vanguard from './art/tactical-a65/threat-vanguard.svg';
import fire from './art/tactical-a65/threat-fire.svg';
import './tactical-a65.css';

const messages = {
  vanguard: { es: 'Vanguardia · iniciativa', en: 'Vanguard · initiative' },
  fireThreat: { es: 'Fuego · quemadura', en: 'Fire · burn' },
  vanguardHelp: {
    es: 'Una formación de iniciativa alta. Inspecciona su velocidad y prepara el orden de tu equipo.',
    en: 'A high-initiative formation. Inspect their speed and prepare your team order.',
  },
  fireHelp: {
    es: 'Dos aliados de Fuego activan quemadura al acertar hechizos. Inspecciona su formación antes de decidir.',
    en: 'Two Fire allies activate burn when spells hit. Inspect their formation before deciding.',
  },
  choose: { es: 'Elige un aliado', en: 'Choose an ally' },
  inspect: { es: 'Inspeccionar', en: 'Inspect' },
  chosen: { es: 'Seleccionado', en: 'Selected' },
  active: { es: 'Sinergia activa en la propuesta', en: 'Synergy active in the proposal' },
  inactive: { es: 'Sinergia todavía inactiva', en: 'Synergy not yet active' },
  pending: { es: 'Elige y confirma para incorporar', en: 'Choose and confirm to recruit' },
  replacing: { es: 'Elige quién deja el equipo', en: 'Choose who leaves the team' },
  fullOwned: {
    es: 'Equipo completo de copias propias. Puedes pasar o cambiar la formación antes de volver.',
    en: 'Your team is full of owned copies. Pass or change your formation before returning.',
  },
  health: { es: 'PV', en: 'HP' },
  mana: { es: 'PM', en: 'MP' },
  power: { es: 'Poder', en: 'Power' },
  speed: { es: 'Velocidad', en: 'Speed' },
  fire: { es: 'Fuego', en: 'Fire' },
  alchemy: { es: 'Alquimia', en: 'Alchemy' },
  shadows: { es: 'Sombras', en: 'Shadows' },
  neutral: { es: 'Neutral', en: 'Neutral' },
} as const;
export const tacticalText = (language: Language, key: keyof typeof messages) =>
  messages[key][language];

export function AffinityLabel({
  affinity,
  language,
  id,
}: {
  affinity: Affinity;
  language: Language;
  id?: string;
}) {
  return (
    <span id={id} className="tactical-affinity" data-affinity={affinity}>
      {tacticalText(language, affinity)}
    </span>
  );
}

/** A silhouette plus an explicit name survives monochrome, missing art and touch. */
export function ThreatBadge({
  threat,
  language,
  compact = false,
}: {
  threat: 'vanguard' | 'fire';
  language: Language;
  compact?: boolean;
}) {
  return (
    <span
      className={`tactical-threat${compact ? ' tactical-threat-compact' : ''}`}
      data-threat={threat}
    >
      <img
        src={threat === 'vanguard' ? vanguard : fire}
        width="48"
        height="48"
        alt=""
        aria-hidden="true"
      />
      <span className={compact ? 'visually-hidden' : ''}>
        {tacticalText(language, threat === 'fire' ? 'fireThreat' : 'vanguard')}
      </span>
    </span>
  );
}

export function ThreatHelp({
  threat,
  language,
}: {
  threat: 'vanguard' | 'fire';
  language: Language;
}) {
  return (
    <details className="tactical-threat-help">
      <summary>
        <ThreatBadge threat={threat} language={language} />
      </summary>
      <p>{tacticalText(language, threat === 'vanguard' ? 'vanguardHelp' : 'fireHelp')}</p>
    </details>
  );
}
