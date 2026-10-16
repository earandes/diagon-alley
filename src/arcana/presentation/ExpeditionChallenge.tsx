import type { ExpeditionChallenge } from '../domain/exploration/challenges';
import { EXPEDITION_CHALLENGES } from '../domain/exploration/challenges';
import type { Language } from '../domain/collection/wizards';
import { Artwork } from './Artwork';
import './expedition-challenge.css';
const messages = {
  discovery: { es: 'Descubrimiento', en: 'Discovery' },
  tactical: { es: 'Táctico', en: 'Tactical' },
  mastery: { es: 'Maestría', en: 'Mastery' },
  discoveryHelp: {
    es: 'Primeros duelos suaves. Después aparecen las afinidades. Jefe de tres rivales.',
    en: 'Gentle opening duels, then affinity threats. Three rivals at the boss.',
  },
  tacticalHelp: {
    es: 'Amenazas desde el principio. Jefe de cuatro rivales; prepara condición, orden y sinergias.',
    en: 'Threats from the start. Four rivals at the boss; prepare condition, order and synergies.',
  },
  masteryHelp: {
    es: 'Formaciones combinadas al final y cinco rivales en el jefe. Recomendado con cinco compañeros y un plan preparado.',
    en: 'Mixed late formations and five rivals at the boss. Recommended with five companions and a prepared plan.',
  },
  next: { es: 'Siguiente desafío', en: 'Next challenge' },
  choose: { es: 'Desafío de la expedición', en: 'Expedition challenge' },
  same: {
    es: 'Mismos costes y botín. Elegir no inicia la expedición.',
    en: 'Same costs and loot. Choosing does not start the expedition.',
  },
} as const;
export const challengeText = (language: Language, key: keyof typeof messages) =>
  messages[key][language];
export function ChallengeChoice({
  value,
  onChange,
  language,
  ready,
  recommended,
}: {
  recommended?: ExpeditionChallenge;
  value: ExpeditionChallenge;
  onChange: (value: ExpeditionChallenge) => void;
  language: Language;
  ready: boolean;
}) {
  return (
    <details
      className="expedition-challenge"
      data-challenge-picker
      open={recommended ? true : undefined}
    >
      <summary aria-label={challengeText(language, 'choose')}>
        <Artwork
          asset={
            value === 'discovery' ? 'ui.map' : `node.${value === 'tactical' ? 'duel' : 'boss'}`
          }
          language={language}
          decorative
        />
        <span>{challengeText(language, value)}</span>
        <span aria-hidden="true">⌄</span>
      </summary>
      <div role="group" aria-label={challengeText(language, 'choose')}>
        {EXPEDITION_CHALLENGES.map((challenge) => (
          <button
            key={challenge}
            data-expedition-challenge={challenge}
            aria-pressed={value === challenge}
            disabled={!ready}
            onClick={() => onChange(challenge)}
          >
            <Artwork
              asset={
                challenge === 'discovery'
                  ? 'ui.map'
                  : `node.${challenge === 'tactical' ? 'duel' : 'boss'}`
              }
              language={language}
              decorative
            />
            <span>
              {challengeText(language, challenge)}
              {recommended === challenge && <small>{challengeText(language, 'next')}</small>}
            </span>
            {value === challenge && (
              <Artwork asset="ui.seal" className="challenge-seal" language={language} decorative />
            )}
          </button>
        ))}
      </div>
      <p>{challengeText(language, `${value}Help`)}</p>
      <small>{challengeText(language, 'same')}</small>
    </details>
  );
}
