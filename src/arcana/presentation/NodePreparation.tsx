import { Artwork } from './Artwork';
import { VisualChoices } from './VisualChoices';
import { activePack, themedName } from './content-packs/active';
import { text } from './translations';
import { victoryReward, type Reward } from '../domain/economy/rewards';
import type { NodePlan } from '../domain/exploration/nodes';
import type { Run } from '../domain/exploration/run';
import type { GameState } from '../application/game';
import type { NodeOptions } from '../application/run-contracts';
import type { Language } from '../domain/collection/wizards';
import './node-a60.css';

export function NodePreparation({
  plan,
  run,
  game,
  rounding,
  options,
  onChange,
  onResolve,
  language,
  ready,
}: {
  plan: NodePlan;
  run: Run;
  game: GameState;
  rounding: 'floor' | 'ceil';
  options: NodeOptions;
  onChange: (options: NodeOptions) => void;
  onResolve?: (options: NodeOptions) => void;
  language: Language;
  ready: boolean;
}) {
  const t = (key: Parameters<typeof text>[1]) => text(language, key);
  const combat = plan.kind === 'duel' || plan.kind === 'boss';
  let reward: Reward | undefined;
  if (combat)
    reward = victoryReward(
      plan.reward,
      !game.exploration?.victories.some(
        (v) => v.levelId === plan.levelId && v.version === run.campaignVersion,
      ),
      rounding,
    );
  else if (plan.kind === 'chest') reward = plan.reward;
  const choices = (
    value: string,
    values: { id: string; label: string; asset: string; disabled?: boolean }[],
    change: (value: string) => void,
  ) => (
    <VisualChoices
      label={t('nodeDecision')}
      value={value}
      options={values}
      onChange={change}
      language={language}
      disabled={!ready}
    />
  );
  return (
    <div className="node-preparation" data-preparation={plan.kind} data-event-kind={plan.kind}>
      {combat && (
        <div className="event-opponents" aria-label={t('nodeOpponents')}>
          {plan.opponents.map((unit, index) => (
            <div key={unit.id}>
              <Artwork
                asset={
                  unit.wizardId === 'rival'
                    ? plan.kind === 'boss' && index === activePack.arenaAppearances.bossPosition
                      ? activePack.arenaAppearances.boss
                      : activePack.arenaAppearances.rivals[
                          index % activePack.arenaAppearances.rivals.length
                        ]
                    : `character.${unit.wizardId}.portrait`
                }
                language={language}
                eager
                decorative
              />
              <span>
                <Artwork asset="ui.health" language={language} eager decorative />
                {unit.hp}
              </span>
              <span title={t('power')}>✦ {unit.power}</span>
            </div>
          ))}
        </div>
      )}
      {reward && (
        <div className="event-loot" aria-label={t('nodeLootPreview')}>
          <span className="event-loot-piece" title={t('crowns')}>
            <Artwork asset="currency.crowns" language={language} eager decorative />
            <strong>{reward.crowns}</strong>
          </span>
          {reward.goldKeys > 0 && (
            <span className="event-loot-piece" title={t('goldKeys')}>
              <Artwork asset="product.gold-key" language={language} eager decorative />
              <strong>{reward.goldKeys}</strong>
            </span>
          )}
          {(['cacao-toad', 'random-beans'] as const).map((kind) => {
            const count = reward!.products.filter((p) => p === kind).length;
            return count > 0 ? (
              <span className="event-loot-piece" key={kind}>
                <Artwork
                  asset={kind === 'cacao-toad' ? 'toad.box' : 'beans.jar'}
                  language={language}
                  eager
                  decorative
                />
                <strong>{count}</strong>
              </span>
            ) : null;
          })}
          <span className="visually-hidden">
            {text(language, 'nodeLootAmounts', {
              crowns: reward.crowns,
              keys: reward.goldKeys,
              toads: reward.products.filter((p) => p === 'cacao-toad').length,
              beans: reward.products.filter((p) => p === 'random-beans').length,
            })}
          </span>
        </div>
      )}
      {plan.kind === 'refuge' && (
        <>
          {choices(
            options.refugeAction ?? 'heal',
            [
              { id: 'heal', label: t('nodeHeal'), asset: 'ui.health' },
              { id: 'focus', label: t('nodeFocus'), asset: 'currency.essence' },
            ],
            (refugeAction) => onChange({ refugeAction: refugeAction as 'heal' | 'focus' }),
          )}
          <div className="event-recovery" aria-label={t('nodeRecoveryPreview')}>
            {run.members.map(({ unit }) => {
              const focus = options.refugeAction === 'focus',
                before = focus ? unit.mana : unit.hp;
              const after = focus
                ? unit.hp > 0
                  ? Math.min(unit.maxMana, unit.mana + unit.maxMana * 0.4)
                  : unit.mana
                : Math.min(unit.maxHp, unit.hp + unit.maxHp * 0.4);
              return (
                <div key={unit.id}>
                  <Artwork
                    asset={`character.${unit.wizardId}.portrait`}
                    language={language}
                    eager
                    decorative
                  />
                  <span>
                    {before} → {after}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
      {plan.kind === 'pact' && (
        <>
          <div className="pact-preview">
            <Artwork
              asset={`character.${plan.recruit.wizardId}.portrait`}
              language={language}
              eager
              decorative
            />
            <Artwork asset="ui.temporary" language={language} eager decorative />
            <span>{themedName(plan.recruit.wizardId, plan.recruit.wizardId, language)}</span>
            <small>{t('temporaryAlly')}</small>
          </div>
          {onResolve && run.members.length < 5 ? (
            <div className="node-pact-actions">
              <button
                type="button"
                className="node-pact-action node-pact-primary"
                data-pact-action="recruit"
                aria-label={t('nodeRecruit')}
                disabled={!ready}
                onClick={() => onResolve({ pactAction: 'recruit' })}
              >
                <Artwork asset="ui.temporary" language={language} decorative eager />
                <span>{t('nodeRecruit')}</span>
              </button>
              <button
                type="button"
                className="node-pact-action"
                data-pact-action="pass"
                aria-label={t('nodePass')}
                disabled={!ready || run.members.length < 3}
                onClick={() => onResolve({ pactAction: 'pass' })}
              >
                <Artwork asset="ui.pass" language={language} decorative eager />
                <span>{t('nodePass')}</span>
              </button>
            </div>
          ) : (
            choices(
              options.pactAction ?? 'recruit',
              [
                { id: 'recruit', label: t('nodeRecruit'), asset: 'ui.temporary' },
                {
                  id: 'pass',
                  label: t('nodePass'),
                  asset: 'ui.pass',
                  disabled: run.members.length < 3,
                },
              ],
              (pactAction) => onChange({ pactAction: pactAction as 'recruit' | 'pass' }),
            )
          )}
          {run.members.length === 5 && options.pactAction !== 'pass' && (
            <VisualChoices
              label={t('nodeReplaceTemporary')}
              value={options.replaceUnitId ?? ''}
              options={run.members
                .filter((m) => m.source === 'temporary')
                .map((m) => ({
                  id: m.unit.id,
                  label: themedName(m.unit.wizardId, m.unit.id, language),
                  asset: `character.${m.unit.wizardId}.portrait`,
                  caption: `${m.unit.hp} / ${m.unit.maxHp}`,
                }))}
              onChange={(replaceUnitId) => onChange({ pactAction: 'recruit', replaceUnitId })}
              language={language}
              disabled={!ready}
            />
          )}
        </>
      )}
      {plan.kind === 'encounter' && (
        <>
          {choices(
            options.encounterAction ?? 'risk',
            [
              { id: 'risk', label: t('nodeRisk'), asset: 'node.encounter' },
              { id: 'pass', label: t('nodePass'), asset: 'ui.pass' },
            ],
            (encounterAction) => onChange({ encounterAction: encounterAction as 'risk' | 'pass' }),
          )}
          <details className="node-help">
            <summary aria-label={t('nodeOutcomeHelp')}>?</summary>
            <p>{t('encounterRiskHint')}</p>
          </details>
        </>
      )}
    </div>
  );
}
