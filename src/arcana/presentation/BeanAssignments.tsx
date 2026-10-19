import { useId, useState } from 'react';
import { Artwork } from './Artwork';
import { themedName } from './content-packs/active';
import type { Run } from '../domain/exploration/run';
import type { GameState } from '../application/game';
import type { PublicContent } from '../application/public-content';
import type { AdvanceNodeRequest } from '../application/run-contracts';
import type { Language } from '../domain/collection/wizards';
import { text } from './translations';
import { contextualText as c } from './contextual-messages';
import {
  assignBean,
  validBeanAssignments,
  effectivePreparationRules,
} from './contextual-preparation';
import { PreparationSynergies } from './PreparationSynergies';
import './contextual-preparation.css';
import { beanRiskPreview, mintRecoveryPreview } from './commerce-preparation';
import { commercePrepText as p } from './commerce-preparation-messages';
import './commerce-preparation.css';
import './collection-supplies.css';
import { adjacentBeanId, beanStockSelection } from './collection-supplies-model';
import { collectionSuppliesText as s } from './collection-supplies-messages';
type Assignments = AdvanceNodeRequest['assignments'];
export function BeanAssignments({
  run,
  game,
  content,
  language,
  ready,
  assignments,
  onChange,
}: {
  run: Run;
  game: GameState;
  content: PublicContent;
  language: Language;
  ready: boolean;
  assignments: Assignments;
  onChange: (value: Assignments) => void;
}) {
  const descriptionId = useId();
  const available = game.inventory.products.filter(
    (p) => p.kind === 'random-beans' && p.status === 'available',
  );
  const [chosenJar, setChosenJar] = useState<string | null>(null);
  const selection = beanStockSelection(available, chosenJar);
  const selected = selection.id;
  const draft = validBeanAssignments(assignments, run, game);
  const flavours = {
    mint: 'mintBean',
    pepper: 'pepperBean',
    earth: 'earthBean',
    soap: 'soapBean',
  } as const;
  const effects = {
    mint: 'mintEffect',
    pepper: 'pepperEffect',
    earth: 'earthEffect',
    soap: 'soapEffect',
  } as const;
  const rules = effectivePreparationRules(run, content.combatRules);
  const risk = beanRiskPreview(rules.beans);
  const carrier = run.members.find((member) =>
    draft.some(
      (assignment) => assignment.beanId === selected && assignment.unitId === member.unit.id,
    ),
  );
  const numbers = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US', {
    maximumFractionDigits: 2,
  });
  const percent = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
  });
  return (
    <fieldset disabled={!ready} className="bean-assignments contextual-beans">
      <legend>{text(language, 'beanChallenge')}</legend>
      <div className="bean-risk-summary">
        {available.length > 0 && <p>{p(language, 'unknown')}</p>}
        <p className="bean-stock-label">
          {p(language, 'stock', { count: numbers.format(available.length) })}
        </p>
      </div>
      <div className="bean-object-shelf" role="group" aria-label={c(language, 'pickJar')}>
        {!available.length && (
          <div className="empty-bean-tray">
            <Artwork asset="beans.jar" language={language} className="choice-art" decorative />
            <span>{text(language, 'noBeansAvailable')}</span>
          </div>
        )}
        {selected && (
          <div className="bean-stock-object" data-bean-stock={selection.count}>
            {selection.count > 1 && (
              <button
                type="button"
                className="bean-stock-page"
                aria-label={s(language, 'previousJar')}
                disabled={selection.index === 0}
                onClick={() => setChosenJar(adjacentBeanId(available, selected, -1))}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="m15 5-7 7 7 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
            <div
              className="bean-stock-jar"
              role="group"
              data-bean-id={selected}
              data-visual-value={selected}
              aria-label={s(language, 'selectedJar', {
                number: selection.index + 1,
                count: selection.count,
              })}
            >
              <Artwork asset="beans.jar" language={language} decorative />
              {draft.some((a) => a.beanId === selected) && (
                <Artwork
                  asset="ui.seal"
                  className="bean-assigned-seal"
                  language={language}
                  decorative
                />
              )}
              <span>{s(language, 'jarNumber', { number: selection.index + 1 })}</span>
            </div>
            {selection.count > 1 && (
              <button
                type="button"
                className="bean-stock-page"
                aria-label={s(language, 'nextJar')}
                disabled={selection.index === selection.count - 1}
                onClick={() => setChosenJar(adjacentBeanId(available, selected, 1))}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="m9 5 7 7-7 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
      {!!draft.length && (
        <div
          className="bean-assigned-bookmarks"
          role="group"
          aria-label={s(language, 'assignedJars')}
        >
          {draft.map((assignment) => {
            const position = run.members.findIndex(
              (member) => member.unit.id === assignment.unitId,
            );
            const unit = run.members[position].unit;
            const jarNumber = available.findIndex((jar) => jar.id === assignment.beanId) + 1;
            const name = themedName(unit.wizardId, text(language, 'temporaryAlly'), language);
            return (
              <button
                key={assignment.beanId}
                type="button"
                aria-pressed={selected === assignment.beanId}
                aria-label={s(language, 'carrierJar', {
                  number: jarNumber,
                  position: position + 1,
                  name,
                })}
                onClick={() => setChosenJar(assignment.beanId)}
              >
                <Artwork
                  asset={`character.${unit.wizardId}.thumbnail`}
                  language={language}
                  decorative
                />
                <span>
                  {position + 1} · {jarNumber}
                </span>
              </button>
            );
          })}
        </div>
      )}
      {available.length > 0 && (
        <>
          <p className="bean-carrier-instruction">{c(language, 'pickCarrier')}</p>
          <div className="bean-carrier-row" role="group" aria-label={c(language, 'pickCarrier')}>
            {run.members.map((member, index) => {
              const unit = member.unit;
              const assigned = draft.find((a) => a.unitId === unit.id);
              const assignedNumber = available.findIndex((p) => p.id === assigned?.beanId) + 1;
              const jarNumber = available.findIndex((p) => p.id === selected) + 1;
              const name = themedName(
                unit.wizardId,
                game.copies.find((copy) => copy.copyId === unit.id)?.wizard.name[language] ??
                  content.catalog.wizards.find((w) => w.id === unit.wizardId)?.name[language] ??
                  text(language, 'temporaryAlly'),
                language,
              );
              const pressed = assigned?.beanId === selected;
              return (
                <button
                  key={unit.id}
                  className="game-object bean-carrier"
                  data-bean-unit={unit.id}
                  aria-pressed={!!pressed}
                  aria-describedby={`${descriptionId}-${unit.id}`}
                  disabled={!selected || unit.hp <= 0}
                  aria-label={c(language, pressed ? 'remove' : 'assign', {
                    name,
                    number: jarNumber,
                    position: index + 1,
                  })}
                  onClick={() => selected && onChange(assignBean(draft, selected, unit.id))}
                >
                  <span className="bean-position">{index + 1}</span>
                  <Artwork
                    asset={`character.${unit.wizardId}.thumbnail`}
                    className="bean-recipient-portrait"
                    language={language}
                    decorative
                  />
                  <Artwork
                    asset={member.source === 'temporary' ? 'ui.temporary' : 'ui.owned'}
                    className="bean-origin-seal"
                    language={language}
                    decorative
                  />
                  <span className="bean-carrier-name">{name}</span>
                  <span className="bean-condition" id={`${descriptionId}-${unit.id}`}>
                    {unit.hp}/{unit.maxHp}
                    <span className="visually-hidden">
                      {' '}
                      {text(language, 'hP')} ·{' '}
                      {c(language, member.source === 'temporary' ? 'temporary' : 'owned')}
                    </span>
                  </span>
                  {unit.hp <= 0 ? (
                    <span className="bean-carrier-assigned">{c(language, 'fallen')}</span>
                  ) : (
                    assigned && (
                      <span className="bean-carrier-assigned">
                        <Artwork asset="beans.jar" language={language} decorative />
                        {assignedNumber}
                      </span>
                    )
                  )}
                </button>
              );
            })}
          </div>
          <p className="bean-draft-count" role="status">
            {c(language, draft.length === 1 ? 'draftOne' : 'draft', { count: draft.length })}
          </p>
        </>
      )}
      <PreparationSynergies members={run.members} rules={rules} language={language} />
      <details className="bean-context-help">
        <summary>{text(language, 'beanEffects')}</summary>
        <p>{p(language, 'preserve')}</p>
        <p>{c(language, 'consumedOnBattle')}</p>
        <p className="bean-risk-note">
          {p(language, 'risk', { probability: percent.format(risk.penaltyProbability) })}
        </p>
        <p>{p(language, 'distribution', { version: numbers.format(risk.version) })}</p>
        {risk.possibilities.map((e) => (
          <p key={e.flavour}>
            <Artwork
              asset={`product.bean-${e.flavour}`}
              language={language}
              className="flavour-art"
              decorative
            />
            {text(language, flavours[e.flavour])} · {percent.format(e.probability)} ·{' '}
            {text(language, effects[e.flavour])}
          </p>
        ))}
        {carrier && risk.possibilities.some((entry) => entry.flavour === 'mint') && (
          <p data-bean-mint-preview={carrier.unit.id}>
            {p(language, mintRecoveryPreview(carrier.unit) === 0 ? 'mintFull' : 'mint', {
              value: numbers.format(mintRecoveryPreview(carrier.unit)),
            })}
          </p>
        )}
        <p>{p(language, 'unknownAgain')}</p>
      </details>
    </fieldset>
  );
}
