import type { GameState } from '../application/game';
import type { BeanAssignment } from '../application/run-contracts';
import type { CombatRules } from '../domain/combat/engine';
import type { Language } from '../domain/collection/wizards';
import type { Run } from '../domain/exploration/run';
import { Artwork } from './Artwork';
import { activePack, themedName } from './content-packs/active';
import { equipmentName } from './equipment-label';
import { validBeanAssignments } from './contextual-preparation';
import { contextualText } from './contextual-messages';
import { PreparationSynergies } from './PreparationSynergies';
import { bossStagingText as s } from './boss-staging-messages';
import './boss-staging.css';
/** Recorded condition and saved gear; portraits only open the existing preparation. */
export function BossPartyStage({
  run,
  game,
  assignments,
  language,
  ready,
  rules,
  onPrepare,
}: {
  run: Run;
  game: GameState;
  assignments: readonly BeanAssignment[];
  language: Language;
  ready: boolean;
  rules?: CombatRules;
  onPrepare: (origin: HTMLButtonElement) => void;
}) {
  const draft = validBeanAssignments(assignments, run, game);
  return (
    <section
      className="boss-party-stage"
      data-boss-party
      data-party-pack={activePack.id}
      aria-label={s(language, 'party')}
    >
      <h4>{s(language, 'party')}</h4>
      <div className="boss-party-members">
        {run.members.map(({ unit, source }, index) => {
          const copy = game.copies.find((item) => item.copyId === unit.id);
          const name = themedName(
            unit.wizardId,
            copy?.wizard.name[language] ?? unit.wizardId,
            language,
          );
          const origin = contextualText(language, source === 'temporary' ? 'temporary' : 'owned');
          const loadout =
            source === 'owned'
              ? game.team?.loadouts.find((entry) => entry.copyId === unit.id)
              : undefined;
          const gear = [loadout?.wandId, loadout?.broomId].flatMap((id) => {
            const item = id
              ? game.inventory.equipment?.find((entry) => entry.id === id)
              : undefined;
            return item ? [item] : [];
          });
          const bean = draft.find((assignment) => assignment.unitId === unit.id);
          return (
            <button
              type="button"
              key={unit.id}
              className="boss-party-member"
              data-boss-member={unit.id}
              data-boss-party-source={source}
              data-boss-party-condition={unit.hp <= 0 ? 'fallen' : 'standing'}
              disabled={!ready}
              onClick={(event) => onPrepare(event.currentTarget)}
              aria-label={s(language, 'member', {
                name,
                position: index + 1,
                source: origin,
                hp: unit.hp,
                maxHp: unit.maxHp,
                mana: unit.mana,
                maxMana: unit.maxMana,
                equipment: gear.length
                  ? s(language, 'gear', {
                      items: gear.map((item) => equipmentName(item, language)).join(', '),
                    })
                  : '',
                bean: bean ? s(language, 'bean') : '',
              })}
            >
              <span className="boss-party-portrait">
                <Artwork
                  asset={`character.${unit.wizardId}.portrait`}
                  language={language}
                  decorative
                  eager
                />
                <span className="boss-party-position" aria-hidden="true">
                  {index + 1}
                </span>
                <Artwork
                  asset={source === 'temporary' ? 'ui.temporary' : 'ui.owned'}
                  language={language}
                  className="boss-party-origin"
                  decorative
                  eager
                />
              </span>
              <span className="boss-party-name" aria-hidden="true">
                {name}
              </span>
              <span className="boss-party-condition" aria-hidden="true">
                <span>
                  {s(language, 'health')} {unit.hp}/{unit.maxHp}
                </span>
                <span>
                  {s(language, 'mana')} {unit.mana}/{unit.maxMana}
                </span>
                {unit.hp <= 0 && <strong>{s(language, 'fallen')}</strong>}
              </span>
              <span className="boss-party-objects" aria-hidden="true">
                {gear.map((item) => (
                  <span
                    key={item.id}
                    data-boss-party-gear={item.id}
                    title={equipmentName(item, language)}
                  >
                    <Artwork
                      asset={
                        item.kind === 'wand'
                          ? `product.wand-${item.wood}`
                          : `product.broom-${item.model}`
                      }
                      language={language}
                      decorative
                      eager
                    />
                  </span>
                ))}
                {bean && (
                  <span data-boss-party-bean={bean.beanId} title={s(language, 'bean')}>
                    <Artwork asset="beans.jar" language={language} decorative eager />
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="node-team-prepare boss-party-prepare"
        disabled={!ready}
        onClick={(event) => onPrepare(event.currentTarget)}
      >
        <Artwork asset="ui.team" language={language} decorative eager />
        <span>{s(language, 'prepare')}</span>
      </button>
      {rules && <PreparationSynergies members={run.members} rules={rules} language={language} />}
    </section>
  );
}
