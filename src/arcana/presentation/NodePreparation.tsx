import { HouseInsignia, houseName, HouseBand } from './HouseInsignia';
import { houseProgress } from '../domain/combat/houses';
import { BossPrelude } from './BossPrelude';
import { EncounterPreparation } from './EncounterPreparation';
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
import type { CombatRules, CombatUnitInput } from '../domain/combat/engine';
import { synergyProgress } from '../domain/combat/synergies';
import { PreparationSynergies } from './PreparationSynergies';
import { AffinityLabel, ThreatHelp, tacticalText } from './TacticalBadge';
import './node-a60.css';
import './tactical-a65.css';

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
  rules,
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
  rules?: CombatRules;
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
    <div
      className={`node-preparation${plan.kind === 'boss' ? ' boss-opponent-stage' : ''}`}
      data-preparation={plan.kind}
      data-event-kind={plan.kind}
    >
      {plan.kind === 'boss' && (
        <BossPrelude opponents={plan.opponents} rules={rules} language={language} />
      )}
      {plan.kind === 'duel' && (
        <>
          {plan.threat && <ThreatHelp threat={plan.threat} language={language} />}
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
          {rules?.houseSynergies && (
            <HouseBand units={plan.opponents} rules={rules} language={language} />
          )}
          {plan.threat && (
            <details className="tactical-rival-inspector">
              <summary>{tacticalText(language, 'inspect')}</summary>
              <div>
                {plan.opponents.map((unit) => (
                  <section key={unit.id}>
                    <strong>
                      {unit.wizardId === 'rival'
                        ? t('opponent')
                        : themedName(unit.wizardId, unit.wizardId, language)}
                    </strong>
                    <AffinityLabel affinity={unit.affinity} language={language} />
                    <dl>
                      <div>
                        <dt>{tacticalText(language, 'health')}</dt>
                        <dd>
                          {unit.hp} / {unit.maxHp}
                        </dd>
                      </div>
                      <div>
                        <dt>{tacticalText(language, 'mana')}</dt>
                        <dd>
                          {unit.mana} / {unit.maxMana}
                        </dd>
                      </div>
                      <div>
                        <dt>{tacticalText(language, 'power')}</dt>
                        <dd>{unit.power}</dd>
                      </div>
                      <div>
                        <dt>{tacticalText(language, 'speed')}</dt>
                        <dd>{unit.speed}</dd>
                      </div>
                    </dl>
                  </section>
                ))}
              </div>
            </details>
          )}
        </>
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
      {plan.kind === 'pact' && plan.recruits && (
        <TacticalPact
          recruits={plan.recruits}
          run={run}
          options={options}
          onChange={onChange}
          language={language}
          ready={ready}
          rules={rules}
        />
      )}
      {plan.kind === 'pact' && !plan.recruits && (
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
      {plan.kind === 'encounter' && plan.offer && (
        <EncounterPreparation
          offer={plan.offer}
          run={run}
          options={options}
          onChange={onChange}
          language={language}
          ready={ready}
        />
      )}
      {plan.kind === 'encounter' && !plan.offer && (
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

function TacticalPact({
  recruits,
  run,
  options,
  onChange,
  language,
  ready,
  rules,
}: {
  recruits: readonly CombatUnitInput[];
  run: Run;
  options: NodeOptions;
  onChange: (options: NodeOptions) => void;
  language: Language;
  ready: boolean;
  rules?: CombatRules;
}) {
  const t = (key: Parameters<typeof text>[1]) => text(language, key);
  const c = (key: Parameters<typeof tacticalText>[1]) => tacticalText(language, key);
  const full = run.members.length === 5;
  const replacements = run.members.filter((member) => member.source === 'temporary');
  const canRecruit = !full || replacements.length > 0;
  const selected =
    options.pactAction !== 'pass'
      ? recruits.find((candidate) => candidate.id === options.recruitId)
      : undefined;
  const replacement = replacements.find((member) => member.unit.id === options.replaceUnitId);
  const proposed =
    selected && (!full || replacement)
      ? [
          ...run.members.filter((member) => !full || member.unit.id !== replacement?.unit.id),
          { source: 'temporary' as const, unit: selected },
        ]
      : undefined;
  const beforeSynergies = synergyProgress(run.members.map(({ unit }) => unit));
  return (
    <section className="tactical-pact" aria-label={c('choose')} data-tactical-pact>
      <div className="tactical-pact-offers" role="group" aria-label={c('choose')}>
        {recruits.map((candidate) => {
          const chosen = candidate.id === selected?.id;
          const name = themedName(candidate.wizardId, candidate.wizardId, language);
          const before = beforeSynergies.find((synergy) => synergy.affinity === candidate.affinity);
          const candidateMembers =
            !full || replacement
              ? [
                  ...run.members.filter(
                    (member) => !full || member.unit.id !== replacement?.unit.id,
                  ),
                  { unit: candidate },
                ]
              : undefined;
          const after =
            candidateMembers &&
            synergyProgress(candidateMembers.map(({ unit }) => unit)).find(
              (synergy) => synergy.affinity === candidate.affinity,
            );
          return (
            <article className="tactical-pact-candidate" key={candidate.id} data-selected={chosen}>
              <button
                type="button"
                className="tactical-pact-portrait"
                aria-label={`${t('nodeRecruit')}: ${name} · ${t('temporaryAlly')}`}
                aria-pressed={chosen}
                disabled={!ready || !canRecruit}
                data-pact-candidate={candidate.id}
                onClick={() =>
                  onChange({
                    pactAction: 'recruit',
                    recruitId: candidate.id,
                    ...(full && replacement ? { replaceUnitId: replacement.unit.id } : {}),
                  })
                }
              >
                <span className="tactical-pact-portrait-stage">
                  <span className="tactical-pact-portrait-image">
                    <Artwork
                      asset={`character.${candidate.wizardId}.portrait`}
                      language={language}
                      decorative
                      eager
                    />
                  </span>
                  <Artwork
                    asset="ui.temporary"
                    language={language}
                    className="tactical-pact-origin"
                    decorative
                    eager
                  />
                  {chosen && (
                    <Artwork
                      asset="ui.seal"
                      language={language}
                      className="tactical-pact-seal"
                      decorative
                      eager
                    />
                  )}
                </span>
                <strong>{name}</strong>
                {candidate.house && rules?.houseSynergies && (
                  <span className="pact-house">
                    <HouseInsignia house={candidate.house} />
                    <span>
                      {houseName(candidate.house, language)}{' '}
                      {
                        houseProgress(run.members.map((m) => m.unit)).find(
                          (h) => h.house === candidate.house,
                        )!.count
                      }{' '}
                      →{' '}
                      {candidateMembers
                        ? houseProgress(candidateMembers.map((m) => m.unit)).find(
                            (h) => h.house === candidate.house,
                          )!.count
                        : '—'}
                    </span>
                  </span>
                )}
                <AffinityLabel affinity={candidate.affinity} language={language} />
                {before && (
                  <span
                    className="tactical-pact-progress"
                    data-affinity-progress={candidate.affinity}
                  >
                    <span>
                      {before.members}
                      {after ? ` → ${after.members}` : ''} / {before.threshold}
                    </span>
                    {after?.active && (
                      <Artwork asset="ui.seal" language={language} decorative eager />
                    )}
                    <span className="visually-hidden">
                      {after?.active ? c('active') : c('inactive')}
                    </span>
                  </span>
                )}
              </button>
              <details className="tactical-pact-inspector">
                <summary aria-label={`${c('inspect')}: ${name}`} title={`${c('inspect')}: ${name}`}>
                  <span aria-hidden="true">i</span>
                </summary>
                <p>{t('temporaryAlly')}</p>
                <dl>
                  <div>
                    <dt>{c('health')}</dt>
                    <dd>
                      {candidate.hp} / {candidate.maxHp}
                    </dd>
                  </div>
                  <div>
                    <dt>{c('mana')}</dt>
                    <dd>
                      {candidate.mana} / {candidate.maxMana}
                    </dd>
                  </div>
                  <div>
                    <dt>{c('power')}</dt>
                    <dd>{candidate.power}</dd>
                  </div>
                  <div>
                    <dt>{c('speed')}</dt>
                    <dd>{candidate.speed}</dd>
                  </div>
                </dl>
              </details>
            </article>
          );
        })}
      </div>
      {full && canRecruit && options.pactAction !== 'pass' && (
        <VisualChoices
          label={c('replacing')}
          value={options.replaceUnitId ?? ''}
          options={replacements.map(({ unit }) => ({
            id: unit.id,
            label: themedName(unit.wizardId, unit.id, language),
            asset: `character.${unit.wizardId}.portrait`,
            caption: `${unit.hp} / ${unit.maxHp}`,
          }))}
          onChange={(replaceUnitId) =>
            onChange({
              pactAction: 'recruit',
              ...(selected ? { recruitId: selected.id } : {}),
              replaceUnitId,
            })
          }
          language={language}
          disabled={!ready}
        />
      )}
      {proposed && rules && (
        <PreparationSynergies
          members={proposed}
          previous={run.members}
          rules={rules}
          language={language}
        />
      )}
      <p className="tactical-pact-status" aria-live="polite">
        {!canRecruit ? c('fullOwned') : selected ? c('pending') : t('temporaryAlly')}
      </p>
      {run.members.length >= 3 && (
        <button
          type="button"
          className="tactical-pact-pass"
          aria-pressed={options.pactAction === 'pass'}
          disabled={!ready || run.members.length < 3}
          data-pact-choice="pass"
          onClick={() => onChange({ pactAction: 'pass' })}
        >
          <Artwork asset="ui.pass" language={language} decorative eager />
          {t('nodePass')}
        </button>
      )}
    </section>
  );
}
