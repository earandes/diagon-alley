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
/** The roster is frozen by the server; the book is consultation, never a second confirmation. */
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
      ? text(
          language,
          leader.unit.wizardId === 'rival' && index === leader.index ? 'zoneBoss' : 'opponent',
        )
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
        <header className="boss-prelude-identity">
          <h4>{leader.name}</h4>
          <AffinityLabel affinity={leader.unit.affinity} language={language} />
          <span className="boss-roster-count">
            {opponents.length} · {t.roster}
          </span>
        </header>
        <div className="boss-roster-scene" aria-label={t.roster}>
          {opponents.map((unit, index) => (
            <div
              key={unit.id}
              data-boss-opponent={unit.id}
              data-boss-opponent-index={index}
              className={index === leader.index ? 'boss-roster-leader' : 'boss-roster-companion'}
            >
              <Artwork
                asset={
                  index === leader.index
                    ? leader.figure
                    : unit.wizardId === 'rival'
                      ? activePack.arenaAppearances.rivals[
                          index % activePack.arenaAppearances.rivals.length
                        ]
                      : `character.${unit.wizardId}.figure`
                }
                fallbackAsset={
                  index === leader.index && leader.unit.wizardId === 'circe'
                    ? 'character.circe.figure'
                    : undefined
                }
                language={language}
                decorative
                eager
              />
              {index !== leader.index && (
                <span className="boss-companion-name">
                  <small>{name(unit, index)}</small>
                  <AffinityLabel affinity={unit.affinity} language={language} />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      <details className="boss-opponent-details" data-boss-inspection-book>
        <summary>
          <Artwork asset="ui.collection" language={language} decorative eager />
          <span>{t.details}</span>
        </summary>
        <div className="boss-opponent-stats">
          {opponents.map((unit, index) => (
            <section key={unit.id}>
              <strong>{name(unit, index)}</strong>
              <AffinityLabel affinity={unit.affinity} language={language} />
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
      </details>
    </section>
  );
}
