import type { CombatRules } from '../domain/combat/engine';
import type { Language } from '../domain/collection/wizards';
import { preparationSynergies, type PreparationMember } from './contextual-preparation';
import { contextualText as c } from './contextual-messages';
import { Artwork } from './Artwork';
export function PreparationSynergies({
  members,
  previous,
  rules,
  language,
}: {
  members: readonly PreparationMember[];
  previous?: readonly PreparationMember[];
  rules: CombatRules;
  language: Language;
}) {
  const active = preparationSynergies(members, rules);
  const before = previous && preparationSynergies(previous, rules);
  return (
    <details className="preparation-synergies" data-preparation-synergies>
      <summary aria-label={c(language, 'formationPreview')}>
        <Artwork asset="node.refuge" language={language} decorative />
        {active.length ? (
          active.map((s) => (
            <span key={s.affinity} data-active-synergy={s.affinity}>
              {c(language, s.affinity)}{' '}
              <strong>{s.threshold === 3 ? 'III' : s.threshold === 2 ? 'II' : 'I'}</strong>
            </span>
          ))
        ) : (
          <span>{c(language, 'noSynergy')}</span>
        )}
      </summary>
      <div className="preparation-synergy-detail">
        {before && (
          <small>
            {c(language, 'comparison')}:{' '}
            {before.map((s) => c(language, s.affinity)).join(' · ') || '—'} →{' '}
            {active.map((s) => c(language, s.affinity)).join(' · ') || '—'}
          </small>
        )}
        {active.map((s) => (
          <p key={s.affinity} data-synergy-value={s.value}>
            <strong>
              {c(language, s.affinity)} {s.members}
            </strong>
            <span>
              {c(
                language,
                s.affinity === 'alchemy'
                  ? 'synergyAlchemy'
                  : s.affinity === 'fire'
                    ? 'synergyFire'
                    : 'synergyShadows',
                { value: s.value },
              )}
            </span>
          </p>
        ))}
        {members.some((m) => m.unit.affinity === null) && <small>{c(language, 'unknown')}</small>}
      </div>
    </details>
  );
}
