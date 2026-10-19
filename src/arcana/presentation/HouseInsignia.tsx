import { bondText } from './bond-messages';
import { useId } from 'react';
import type { House, WizardTraits } from '../domain/collection/traits';
import type { Language } from '../domain/collection/wizards';
import type { CombatRules } from '../domain/combat/engine';
import { houseProgress, type HouseMember, type HouseProgress } from '../domain/combat/houses';
import { selectedContentPackId, themedName } from './content-packs/active';
import './houses-a85.css';
import { BondEmblem, bondName } from './BondEmblem';
const names: Record<House, readonly [string, string, string]> = {
  gryffindor: ['Gryffindor', 'Compañía del León', 'Lion Company'],
  ravenclaw: ['Ravenclaw', 'Círculo del Cuervo', 'Raven Circle'],
  hufflepuff: ['Hufflepuff', 'Hermandad del Tejón', 'Badger Fellowship'],
  slytherin: ['Slytherin', 'Orden de la Serpiente', 'Serpent Order'],
};
export function houseName(house: House, language: Language) {
  return names[house][selectedContentPackId() === 'diagon-alley' ? 0 : language === 'es' ? 1 : 2];
}
export function houseEffect(group: Pick<HouseProgress, 'house' | 'value'>, language: Language) {
  const { house, value: v } = group;
  const es = {
    gryffindor: `+${v} daño en el primer impacto acertado.`,
    slytherin: `+${v} iniciativa base.`,
    hufflepuff: `+${v} PV al comenzar cada turno, sin superar el máximo.`,
    ravenclaw: `+${v} daño desde el tercer intento de hechizo.`,
  };
  const en = {
    gryffindor: `+${v} damage on the first successful hit.`,
    slytherin: `+${v} base initiative.`,
    hufflepuff: `+${v} HP at each turn start, capped at maximum HP.`,
    ravenclaw: `+${v} damage from the third spell attempt.`,
  };
  return (language === 'es' ? es : en)[house];
}
export function HouseInsignia({ house }: { house: House }) {
  // Original geometric silhouettes, not official crests; 128-square vector master.
  const shapes: Record<House, string> = {
    gryffindor:
      'M37 43 33 26 49 32 64 23 80 32 96 26 91 43 100 61 91 87 64 105 37 87 28 61ZM45 51 55 55M73 55 83 51M54 73 64 81 74 73M64 81V94',
    ravenclaw:
      'M23 74 43 54 39 31 60 42 84 29 83 50 107 64 85 70 78 94 49 102 56 83 42 76ZM59 51 67 57 75 51',
    hufflepuff:
      'M28 37 46 35 64 44 82 35 100 37 92 67 94 87 64 107 34 87 36 67ZM42 48 55 56 46 81M86 48 73 56 82 81M55 92 64 98 73 92',
    slytherin:
      'M40 33Q74 16 87 42Q97 63 64 70Q39 77 45 92Q54 107 85 89M42 33 34 27 25 37 37 51 50 46M34 35H36',
  };
  return (
    <svg className="house-insignia" data-house={house} viewBox="0 0 128 128" aria-hidden="true">
      <path className="house-shield" d="M20 13H108V68Q108 99 64 117Q20 99 20 68Z" />
      <path
        d={shapes[house]}
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
export function TraitBadge({
  traits,
  language,
  expanded = false,
}: {
  traits?: WizardTraits;
  language: Language;
  expanded?: boolean;
}) {
  if (!traits) return null;
  return (
    <span className="trait-badge">
      {traits.house && (
        <>
          <HouseInsignia house={traits.house} />
          <span>{houseName(traits.house, language)}</span>
        </>
      )}
      {traits.school === 'beauxbatons' && (
        <span>
          {selectedContentPackId() === 'diagon-alley'
            ? 'Beauxbatons'
            : language === 'es'
              ? 'Academia del Alba'
              : 'Dawn Academy'}
        </span>
      )}
      {traits.nature === 'creature' && (
        <span>
          <BondEmblem group="creatures" language={language} />
          {bondName('creatures', language)}
        </span>
      )}
      {traits.profession && (
        <small>
          {
            {
              professor: language === 'es' ? 'Profesor/a' : 'Professor',
              auror:
                selectedContentPackId() === 'diagon-alley'
                  ? 'Auror'
                  : language === 'es'
                    ? 'Custodio'
                    : 'Warden',
              alchemist: language === 'es' ? 'Alquimista' : 'Alchemist',
              magizoologist: language === 'es' ? 'Magizoólogo/a' : 'Magizoologist',
            }[traits.profession]
          }
        </small>
      )}
      {expanded && !!traits.affiliations?.length && (
        <span className="trait-affiliations">
          {traits.affiliations.map((group) => (
            <span key={group}>
              {group === 'army' ? null : <BondEmblem group={group} language={language} />}
              <span>{bondName(group, language)}</span>
            </span>
          ))}
        </span>
      )}
      {expanded && !!traits.affiliations?.length && <small>{bondText(language, 'history')}</small>}
    </span>
  );
}
export function HouseBand({
  units,
  rules,
  language,
}: {
  units: readonly (HouseMember & { readonly source?: 'owned' | 'temporary' })[];
  rules: CombatRules;
  language: Language;
}) {
  const detailGroup = useId();
  if (!rules.houseSynergies) return null;
  const groups = houseProgress(units).filter((h) => h.count > 0);
  if (!groups.length) return null;
  return (
    <div
      className="house-band"
      data-team-bond="houses"
      aria-label={language === 'es' ? 'Casas del equipo' : 'Team houses'}
    >
      <span className="team-bond-caption">{bondText(language, 'bond')}</span>
      {groups.map((group) => (
        <details
          key={group.house}
          name={`house-${detailGroup}`}
          data-house-progress={group.house}
          data-active={group.tier > 0}
        >
          <summary
            aria-label={`${houseName(group.house, language)} · ${group.tier ? (language === 'es' ? `Activo nivel ${group.tier}` : `Active tier ${group.tier}`) : `${group.count}/3`}`}
          >
            <HouseInsignia house={group.house} />
            <span>
              {houseName(group.house, language)}{' '}
              <b>
                {group.tier
                  ? `${group.count} · ${group.tier === 1 ? 'I' : 'II'}`
                  : `${group.count}/3`}
              </b>
            </span>
          </summary>
          <div className="house-detail">
            <strong>{houseName(group.house, language)}</strong>
            <p>
              {group.tier
                ? houseEffect(group, language)
                : language === 'es'
                  ? 'Se activa con tres identidades distintas en pie.'
                  : 'Activates with three distinct standing identities.'}
            </p>
            {group.tier === 1 && (
              <p>
                {language === 'es' ? 'Con cuatro: ' : 'At four: '}
                {houseEffect({ ...group, value: group.house === 'gryffindor' ? 3 : 2 }, language)}
              </p>
            )}
            <small>
              {language === 'es'
                ? 'Solo contribuyentes en pie al confirmar. Copias de una identidad cuentan una vez; el acabado encantado no da potencia.'
                : 'Only contributors standing at confirmation. Copies of one identity count once; enchanted finishes grant no power.'}
            </small>
            <ol>
              {group.contributorIds.map((id) => {
                const member = units.find((u) => u.id === id)!;
                return (
                  <li key={id}>
                    {units.indexOf(member) + 1}.{' '}
                    {themedName(
                      member.wizardId,
                      language === 'es' ? 'Compañero' : 'Companion',
                      language,
                    )}
                    {member.source
                      ? ` · ${member.source === 'owned' ? (language === 'es' ? 'Propio' : 'Owned') : language === 'es' ? 'Temporal' : 'Temporary'}`
                      : ''}
                  </li>
                );
              })}
            </ol>
          </div>
        </details>
      ))}
    </div>
  );
}
