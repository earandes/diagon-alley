import { useId } from 'react';
import { contextualText } from './contextual-messages';
import { Artwork } from './Artwork';
import { themedName } from './content-packs/active';
import { encounterText } from './encounter-messages';
import { previewEncounterTrade, type EncounterOffer } from '../domain/exploration/encounter-trades';
import type { NodeOptions } from '../application/run-contracts';
import type { Language } from '../domain/collection/wizards';
import type { Run } from '../domain/exploration/run';
import './encounter-a67.css';

/** The shared domain preview is read-only. The parent alone confirms an authority command. */
export function EncounterPreparation({
  offer,
  run,
  options,
  onChange,
  language,
  ready,
}: {
  offer: EncounterOffer;
  run: Run;
  options: NodeOptions;
  onChange: (options: NodeOptions) => void;
  language: Language;
  ready: boolean;
}) {
  const targetDescription = useId();
  const t = (key: Parameters<typeof encounterText>[1], values = {}) =>
    encounterText(language, key, values);
  const selected =
    options.encounterAction === 'trade'
      ? offer.options.find((choice) => choice.id === options.encounterChoiceId)
      : undefined;
  const preview = selected
    ? previewEncounterTrade(run.members, offer, selected.id, options.encounterUnitId)
    : undefined;
  const percent = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
  });
  const numbers = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US', {
    maximumFractionDigits: 2,
  });
  const passed = options.encounterAction === 'pass';
  const changes =
    preview?.vitals.filter(
      (vital) => vital.beforeHp !== vital.afterHp || vital.beforeMana !== vital.afterMana,
    ) ?? [];
  const status = passed
    ? 'passDetail'
    : !selected
      ? 'chooseHint'
      : preview?.eligible
        ? 'selectedHint'
        : preview?.reason === 'choose-unit'
          ? 'chooseUnit'
          : preview?.reason === 'no-benefit'
            ? 'noBenefit'
            : 'insufficientCondition';
  return (
    <section
      className="tactical-encounter"
      data-encounter-offer={offer.id}
      data-encounter-kind={offer.kind}
    >
      <div className="encounter-host">
        <div className="encounter-host-frame">
          <Artwork
            asset={`character.${offer.npcId}.portrait`}
            language={language}
            eager
            decorative
          />
        </div>
        <div className="encounter-host-story">
          <h4>{t(offer.kind)}</h4>
          <span className="encounter-host-name">
            {themedName(offer.npcId, offer.npcId, language)}
          </span>
          <details className="encounter-help">
            <summary aria-label={t('inspect')}>
              <span aria-hidden="true">i</span>
            </summary>
            <p>{t(offer.kind === 'healer' ? 'healerDetail' : 'scholarDetail')}</p>
            <p>{t('noRevive')}</p>
            <p>{t('maximum')}</p>
            <p>{t('exactCost')}</p>
            <p>{t('keepsReserves')}</p>
          </details>
        </div>
      </div>
      <div className="encounter-offer-tray" role="group" aria-label={t('choose')}>
        {offer.options.map((choice) => {
          const isSelected = selected?.id === choice.id;
          const unitChoices = choice.scope === 'unit';
          const candidates = run.members.map((member) =>
            previewEncounterTrade(run.members, offer, choice.id, member.unit.id),
          );
          const groupPreview = previewEncounterTrade(run.members, offer, choice.id);
          const eligible = unitChoices
            ? candidates.some((candidate) => candidate.eligible)
            : groupPreview.eligible;
          const noBenefit = unitChoices
            ? candidates.every(
                (candidate) =>
                  candidate.reason === 'no-benefit' || candidate.reason === 'choose-unit',
              )
            : groupPreview.reason === 'no-benefit';
          return (
            <button
              key={choice.id}
              type="button"
              className="encounter-offer-object"
              data-encounter-choice={choice.id}
              aria-pressed={isSelected}
              disabled={!ready || !eligible}
              onClick={() => onChange({ encounterAction: 'trade', encounterChoiceId: choice.id })}
            >
              <span className="encounter-offer-art" aria-hidden="true">
                <span className={unitChoices ? 'encounter-scope-single' : 'encounter-scope-team'}>
                  {(unitChoices
                    ? [
                        run.members.find(({ unit }) => unit.id === options.encounterUnitId) ??
                          run.members.find(({ unit }) => unit.hp > 0) ??
                          run.members[0],
                      ]
                    : run.members.slice(0, 3)
                  )
                    .filter(Boolean)
                    .map((member) => (
                      <Artwork
                        key={member.unit.id}
                        asset={`character.${member.unit.wizardId}.thumbnail`}
                        language={language}
                        eager
                        decorative
                      />
                    ))}
                </span>
                {isSelected && (
                  <Artwork
                    asset="ui.seal"
                    className="encounter-choice-seal"
                    language={language}
                    eager
                    decorative
                  />
                )}
              </span>
              <strong>{t(unitChoices ? 'one' : 'team')}</strong>
              <span className="encounter-benefit">
                <Artwork
                  asset={choice.restore === 'hp' ? 'ui.health' : 'currency.essence'}
                  language={language}
                  eager
                  decorative
                />
                <span>
                  <span className="visually-hidden">{t('benefit')}: </span>+
                  {percent.format(choice.fraction)} {t(choice.restore === 'hp' ? 'health' : 'mana')}
                </span>
              </span>
              <span className="encounter-cost">
                <Artwork
                  asset={choice.restore === 'hp' ? 'currency.essence' : 'ui.health'}
                  language={language}
                  eager
                  decorative
                />
                <span>
                  <span className="visually-hidden">{t('cost')}: </span>−
                  {percent.format(choice.costFraction)}{' '}
                  {t(choice.restore === 'hp' ? 'mana' : 'health')}
                </span>
              </span>
              {!eligible && <small>{t(noBenefit ? 'noBenefit' : 'insufficientCondition')}</small>}
            </button>
          );
        })}
      </div>
      {selected?.scope === 'unit' && (
        <div className="encounter-targets" role="group" aria-label={t('chooseUnit')}>
          {run.members.map((member, index) => {
            const candidate = previewEncounterTrade(
              run.members,
              offer,
              selected.id,
              member.unit.id,
            );
            const name = themedName(member.unit.wizardId, member.unit.id, language);
            const source = contextualText(
              language,
              member.source === 'owned' ? 'owned' : 'temporary',
            );
            const identity = t('memberIdentity', { position: index + 1, source });
            const selectedUnit = member.unit.id === options.encounterUnitId;
            return (
              <button
                key={member.unit.id}
                type="button"
                className="encounter-target"
                data-encounter-unit={member.unit.id}
                aria-label={t('memberLabel', { name, position: index + 1, source })}
                aria-describedby={`${targetDescription}-${index}`}
                aria-pressed={selectedUnit}
                disabled={!ready || !candidate.eligible}
                onClick={() =>
                  onChange({
                    encounterAction: 'trade',
                    encounterChoiceId: selected.id,
                    encounterUnitId: member.unit.id,
                  })
                }
              >
                <span className="encounter-target-image">
                  <Artwork
                    asset={`character.${member.unit.wizardId}.thumbnail`}
                    language={language}
                    eager
                    decorative
                  />
                  {selectedUnit && (
                    <Artwork
                      asset="ui.seal"
                      className="encounter-target-seal"
                      language={language}
                      eager
                      decorative
                    />
                  )}
                </span>
                <span>{name}</span>
                <span className="encounter-target-origin">
                  <Artwork
                    asset={member.source === 'owned' ? 'ui.owned' : 'ui.temporary'}
                    language={language}
                    decorative
                  />
                  {identity}
                </span>
                <small id={`${targetDescription}-${index}`}>
                  {numbers.format(member.unit.hp)} {t('health')}
                  <br />
                  {numbers.format(member.unit.mana)} {t('mana')}
                  {!candidate.eligible && (
                    <span className="visually-hidden">
                      {t(
                        member.unit.hp === 0
                          ? 'fallen'
                          : candidate.reason === 'no-benefit'
                            ? 'noBenefit'
                            : 'insufficientCondition',
                      )}
                    </span>
                  )}
                </small>
              </button>
            );
          })}
        </div>
      )}
      {preview?.eligible && (
        <div className="encounter-preview" aria-label={t('changedTeam')}>
          {changes.map((vital) => {
            const member = run.members.find(({ unit }) => unit.id === vital.unitId)!;
            const name = themedName(member.unit.wizardId, member.unit.id, language);
            const position = run.members.indexOf(member) + 1;
            const source = contextualText(
              language,
              member.source === 'owned' ? 'owned' : 'temporary',
            );
            const instanceName = t('memberLabel', { name, position, source });
            return (
              <div
                className="encounter-preview-unit"
                key={vital.unitId}
                data-encounter-preview-unit={vital.unitId}
                aria-label={instanceName}
              >
                <strong className="encounter-preview-identity">
                  {t('memberIdentity', { position, source })}
                </strong>
                <Artwork
                  asset={`character.${member.unit.wizardId}.thumbnail`}
                  language={language}
                  eager
                  decorative
                />
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
                        name: instanceName,
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
          {changes.length === 0 && <p>{t('unchanged')}</p>}
        </div>
      )}
      <p
        className="encounter-draft-state"
        aria-live="polite"
        data-encounter-preview-ready={preview?.eligible ?? false}
      >
        {t(status)}
      </p>
      <button
        type="button"
        className="encounter-pass"
        data-encounter-choice="pass"
        aria-pressed={passed}
        disabled={!ready}
        onClick={() => onChange({ encounterAction: 'pass' })}
      >
        <Artwork asset="ui.pass" language={language} eager decorative />
        <span>{t('pass')}</span>
        {passed && (
          <Artwork
            asset="ui.seal"
            className="encounter-pass-seal"
            language={language}
            eager
            decorative
          />
        )}
      </button>
    </section>
  );
}
