import './plan-grammar-a92.css';
import { bondText } from './bond-messages';
import type { CombatRules } from '../domain/combat/engine';
import {
  bondProgress,
  effectiveBondFocus,
  BOND_MODES,
  type BondMode,
} from '../domain/combat/bonds';
import type { HouseMember } from '../domain/combat/houses';
import type { Language } from '../domain/collection/wizards';
import { HouseBand } from './HouseInsignia';
import { BondEmblem, bondEffect, bondName } from './BondEmblem';
import { Artwork } from './Artwork';
import { themedName } from './content-packs/active';

type Member = HouseMember & { readonly source?: 'owned' | 'temporary' };
export function BondBand({
  units,
  rules,
  language,
  mode = 'auto',
}: {
  units: readonly Member[];
  rules: CombatRules;
  language: Language;
  mode?: BondMode;
}) {
  const focus = effectiveBondFocus(units, rules.bonds, mode);
  if (!rules.bonds || focus === 'houses')
    return <HouseBand units={units} rules={rules} language={language} />;
  const group = bondProgress(units, rules.bonds, focus);
  return (
    <div
      className="house-band bond-band"
      data-team-bond={focus}
      aria-label={bondText(language, 'teamBond')}
    >
      <span className="team-bond-caption">{bondText(language, 'bond')}</span>
      <details data-bond-progress={focus} data-active={group.tier > 0}>
        <summary
          aria-label={`${bondName(focus, language)} · ${group.tier ? bondText(language, 'activeTier', { tier: group.tier }) : `${group.count}/3`}`}
        >
          <BondEmblem group={focus} language={language} />
          <span>
            {bondName(focus, language)}{' '}
            <b>
              {group.tier
                ? `${group.count} · ${group.tier === 1 ? 'I' : 'II'}`
                : `${group.count}/3`}
            </b>
          </span>
        </summary>
        <div className="house-detail">
          <strong>{bondName(focus, language)}</strong>
          <p>
            {group.tier ? bondEffect(focus, group.value, language) : bondText(language, 'inactive')}
          </p>
          <small>{bondText(language, 'locked')}</small>
          <ol>
            {group.contributorIds.map((id) => {
              const m = units.find((u) => u.id === id)!;
              return (
                <li key={id}>
                  {units.indexOf(m) + 1}.{' '}
                  {themedName(m.wizardId, language === 'es' ? 'Compañero' : 'Companion', language)}
                  {m.source
                    ? ` · ${m.source === 'owned' ? (language === 'es' ? 'Propio' : 'Owned') : language === 'es' ? 'Temporal' : 'Temporary'}`
                    : ''}
                </li>
              );
            })}
          </ol>
        </div>
      </details>
    </div>
  );
}
/** Under-demand formation draft. Its parent owns save/cancel, never this selector. */
export function BondSelector({
  mode,
  onChange,
  language,
  disabled,
}: {
  mode: BondMode;
  onChange: (mode: BondMode) => void;
  language: Language;
  disabled?: boolean;
}) {
  return (
    <details className="bond-selector">
      <summary>
        <Artwork asset="ui.collection" language={language} decorative />
        <span>
          {bondText(language, 'bond')} · {bondName(mode, language)}
        </span>
      </summary>
      <div role="group" aria-label={bondText(language, 'chooseBond')} className="bond-choices">
        {BOND_MODES.map((id) => (
          <button
            key={id}
            data-bond-mode={id}
            type="button"
            disabled={disabled}
            aria-pressed={mode === id}
            onClick={() => onChange(id)}
          >
            {id === 'auto' || id === 'houses' ? (
              <Artwork
                asset={id === 'auto' ? 'ui.map' : 'ui.collection'}
                language={language}
                decorative
              />
            ) : (
              <BondEmblem group={id} language={language} />
            )}
            <span>{bondName(id, language)}</span>
          </button>
        ))}
      </div>
      <small>
        {bondText(language, 'choiceHelp', {
          order: bondName('order', language),
          death: bondName('death', language),
          creatures: bondName('creatures', language),
        })}
      </small>
    </details>
  );
}
