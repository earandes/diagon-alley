import { narrativeText } from './content-packs/active';
import type { EncounterResolution } from '../domain/exploration/encounters';
import type { Language } from '../domain/collection/wizards';
import { text } from './translations';

export function EncounterOutcome({
  resolution,
  language,
}: {
  resolution?: EncounterResolution;
  language: Language;
}) {
  if (!resolution) return <p>{text(language, 'encounterDetailsUnrecorded')}</p>;
  const numbers = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US');
  const effect = resolution.effect;
  return (
    <section aria-label={text(language, 'encounterOutcome')} data-encounter-effect={effect.kind}>
      {resolution.narrative && <p>{narrativeText(resolution.narrative, language)}</p>}
      <p>
        {effect.kind === 'reward'
          ? text(language, 'encounterLoot')
          : text(language, effect.kind === 'heal' ? 'encounterHealing' : 'encounterDamage', {
              value: new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US', {
                style: 'percent',
              }).format(effect.fraction),
            })}
      </p>
      {resolution.vitals.map((vital, index) => (
        <p key={vital.unitId}>
          {text(language, 'encounterVitals', {
            number: numbers.format(index + 1),
            before: numbers.format(vital.beforeHp),
            after: numbers.format(vital.afterHp),
          })}
        </p>
      ))}
    </section>
  );
}
