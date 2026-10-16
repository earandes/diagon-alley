import { Artwork } from './Artwork';
import { themedName } from './content-packs/active';
import { encounterText } from './encounter-messages';
import type { EncounterTradeResolution } from '../domain/exploration/encounter-trades';
import type { Language } from '../domain/collection/wizards';
import type { RunMember } from '../domain/exploration/run';
import './encounter-a67.css';

/** Displays the persisted trade diagnostics; never re-executes a preview or operation. */
export function EncounterTradeOutcome({
  trade,
  language,
  members = [],
}: {
  trade: EncounterTradeResolution;
  language: Language;
  members?: readonly RunMember[];
}) {
  const t = (key: Parameters<typeof encounterText>[1], values = {}) =>
    encounterText(language, key, values);
  const numbers = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US', {
    maximumFractionDigits: 2,
  });
  const choice = trade.offer.options.find(({ id }) => id === trade.choiceId);
  const affected = trade.vitals.filter(
    (vital) => vital.beforeHp !== vital.afterHp || vital.beforeMana !== vital.afterMana,
  );
  return (
    <section
      className="encounter-saved-trade"
      data-encounter-trade={trade.offer.id}
      aria-label={t('confirmed')}
    >
      <div className="encounter-saved-host">
        <Artwork
          asset={`character.${trade.offer.npcId}.thumbnail`}
          language={language}
          decorative
        />
        <div>
          <h4>{t(trade.offer.kind)}</h4>
          <span>{themedName(trade.offer.npcId, trade.offer.npcId, language)}</span>
        </div>
        <Artwork asset="ui.seal" language={language} decorative />
      </div>
      <p>
        {choice
          ? t('confirmedScope', { scope: t(choice.scope === 'unit' ? 'one' : 'team') })
          : t('confirmed')}
      </p>
      <div className="encounter-saved-vitals">
        {affected.map((vital) => {
          const member = members.find(({ unit }) => unit.id === vital.unitId);
          const name = member
            ? themedName(member.unit.wizardId, member.unit.id, language)
            : t('companion', { number: trade.vitals.indexOf(vital) + 1 });
          return (
            <div className="encounter-saved-unit" key={vital.unitId}>
              {member && (
                <Artwork
                  asset={`character.${member.unit.wizardId}.thumbnail`}
                  language={language}
                  decorative
                />
              )}
              <strong>{name}</strong>
              {(
                [
                  ['health', vital.beforeHp, vital.afterHp],
                  ['mana', vital.beforeMana, vital.afterMana],
                ] as const
              ).map(([resource, before, after]) => (
                <span
                  key={resource}
                  data-direction={after > before ? 'gain' : after < before ? 'cost' : 'same'}
                >
                  <span className="visually-hidden">
                    {t('change', {
                      name,
                      resource: t(resource),
                      before: numbers.format(before),
                      after: numbers.format(after),
                    })}
                  </span>
                  <span aria-hidden="true">
                    {t(resource)} {numbers.format(before)} → {numbers.format(after)}
                  </span>
                </span>
              ))}
            </div>
          );
        })}
        {!affected.length && <p>{t('unchanged')}</p>}
      </div>
    </section>
  );
}
