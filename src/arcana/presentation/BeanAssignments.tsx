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
  const selected = available.find((p) => p.id === chosenJar)?.id ?? available[0]?.id ?? null;
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
        {available.map((jar, index) => (
          <button
            key={jar.id}
            className="game-object bean-jar-choice"
            data-bean-id={jar.id}
            data-visual-value={jar.id}
            aria-label={c(language, 'jar', { number: index + 1 })}
            aria-pressed={selected === jar.id}
            onClick={() => setChosenJar(jar.id)}
          >
            <Artwork asset="beans.jar" language={language} decorative />
            <span>{index + 1}</span>
            {draft.some((a) => a.beanId === jar.id) && (
              <Artwork
                asset="ui.seal"
                className="bean-assigned-seal"
                language={language}
                decorative
              />
            )}
          </button>
        ))}
      </div>
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
