import type { CombatRules, CombatUnitInput } from '../domain/combat/engine';
import type { Language } from '../domain/collection/wizards';
import { activeSynergies } from '../domain/combat/synergies';
import { Artwork } from './Artwork';
import { bossPresentation } from './boss-presentation';
import { activePack, themedName } from './content-packs/active';
import { AffinityLabel, tacticalText } from './TacticalBadge';
import { PreparationSynergies } from './PreparationSynergies';
import { text } from './translations';
import './boss-a70.css';
const messages = {
  es: {
    roster: 'Rivales',
    details: 'Conocer al rival',
    active: 'Sinergias activas',
    none: 'Sin sinergia activa',
  },
  en: {
    roster: 'Opponents',
    details: 'Inspect opponents',
    active: 'Active synergies',
    none: 'No active synergy',
  },
};
/** A consultation of the frozen roster, never a second start/confirmation screen. */
export function BossPrelude({
  opponents,
  rules,
  language,
}: {
  opponents: readonly CombatUnitInput[];
  rules?: CombatRules;
  language: Language;
}) {
  const leader = bossPresentation(opponents, language);
  if (!leader) return null;
  const t = messages[language],
    synergies = activeSynergies(opponents);
  const name = (unit: CombatUnitInput, index: number) =>
    unit.wizardId === 'rival'
      ? text(language, index === activePack.arenaAppearances.bossPosition ? 'zoneBoss' : 'opponent')
      : themedName(unit.wizardId, text(language, 'opponent'), language);
  return (
    <section
      className="boss-prelude"
      data-boss-prelude
      data-boss-leader={leader.unit.id}
      data-boss-roster-size={opponents.length}
      aria-label={leader.name}
    >
      <div className="boss-prelude-hero">
        <Artwork asset={leader.figure} language={language} decorative eager />
        <div>
          <h4>{leader.name}</h4>
          <AffinityLabel affinity={leader.unit.affinity} language={language} />
          <span className="boss-roster-count">
            {opponents.length} · {t.roster}
          </span>
        </div>
      </div>
      <div className="event-opponents boss-roster" aria-label={t.roster}>
        {opponents.map((unit, index) => (
          <div key={unit.id} data-boss-opponent={unit.id}>
            <Artwork
              asset={
                index === leader.index
                  ? leader.portrait
                  : unit.wizardId === 'rival'
                    ? activePack.arenaAppearances.rivals[
                        index % activePack.arenaAppearances.rivals.length
                      ]
                    : `character.${unit.wizardId}.portrait`
              }
              language={language}
              decorative
              eager
            />
            <small>{name(unit, index)}</small>
            <AffinityLabel affinity={unit.affinity} language={language} />
          </div>
        ))}
      </div>
      <details className="boss-opponent-details">
        <summary>{t.details}</summary>
        <div className="boss-opponent-stats">
          {opponents.map((unit, index) => (
            <section key={unit.id}>
              <strong>{name(unit, index)}</strong>
              <dl>
                {(
                  [
                    ['health', `${unit.hp} / ${unit.maxHp}`],
                    ['mana', `${unit.mana} / ${unit.maxMana}`],
                    ['power', unit.power],
                    ['speed', unit.speed],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label}>
                    <dt>{tacticalText(language, label)}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </details>
      {rules ? (
        <PreparationSynergies
          members={opponents.map((unit) => ({ source: 'temporary', unit }))}
          rules={rules}
          language={language}
        />
      ) : (
        <div className="boss-synergy-summary" aria-label={t.active}>
          {synergies.length ? (
            synergies.map((s) => (
              <span key={s.affinity} data-boss-active-synergy={s.affinity}>
                <AffinityLabel affinity={s.affinity} language={language} /> {s.threshold}
              </span>
            ))
          ) : (
            <small>{t.none}</small>
          )}
        </div>
      )}
    </section>
  );
}
