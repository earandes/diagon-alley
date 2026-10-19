import { planText } from './plan-messages-a92';
import type { CombatRules } from '../domain/combat/engine';
import type { Language } from '../domain/collection/wizards';
import { preparationSynergies, type PreparationMember } from './contextual-preparation';
import { contextualText as c } from './contextual-messages';
import { Artwork } from './Artwork';
import { useSelectionMotion } from './useSelectionMotion';
import { useReducedMotion } from './useReducedMotion';
import { BondBand } from './BondBand';
import type { BondMode } from '../domain/combat/bonds';
export function PreparationSynergies({
  members,
  previous,
  rules,
  language,
  mode,
}: {
  members: readonly PreparationMember[];
  previous?: readonly PreparationMember[];
  rules: CombatRules;
  language: Language;
  mode?: BondMode;
}) {
  const active = preparationSynergies(members, rules);
  const before = previous && preparationSynergies(previous, rules);
  const { reduced } = useReducedMotion();
  const motion = useSelectionMotion<HTMLDetailsElement>(
    JSON.stringify(
      active.map(({ affinity, threshold, value }) => ({ affinity, threshold, value })),
    ),
    reduced,
    180,
  );
  return (
    <>
      <BondBand
        units={members.map((m) => ({ ...m.unit, source: m.source }))}
        rules={rules}
        mode={mode}
        language={language}
      />
      <details className="preparation-synergies" data-preparation-synergies ref={motion}>
        <summary aria-label={planText(language, 'affinityPlan')}>
          <Artwork asset="node.refuge" language={language} decorative />
          <span className="affinity-plan-caption">{planText(language, 'affinities')}</span>
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
    </>
  );
}
