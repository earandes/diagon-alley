import { useEffect, useRef } from 'react';
import type { GameState } from '../application/game';
import { expeditionClosure, type ClosureAction } from '../application/client/expedition-closure';
import type { Language } from '../domain/collection/wizards';
import { Artwork } from './Artwork';
import { NodeResult } from './NodeResult';
import { closureText } from './closure-messages';
import { text } from './translations';
import { regionAppearance, themedName } from './content-packs/active';
import './expedition-closure.css';
import './motion-a69.css';
import { useConfirmedMotion } from './useConfirmedMotion';
import { useReducedMotion } from './useReducedMotion';
import { bossPresentation } from './boss-presentation';
import { bossText } from './boss-messages';
import { BossBattleFacts } from './BossBattleFacts';
import './boss-closure-a70.css';

export function ExpeditionClosure({
  game,
  language,
  ready,
  onAction,
  onReplay,
  onMissions,
  confirmedReceiptId,
}: {
  game: GameState;
  language: Language;
  ready: boolean;
  onAction: (action: ClosureAction, origin?: HTMLElement) => void;
  onReplay: () => void;
  onMissions: () => void;
  confirmedReceiptId?: string;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const closure = expeditionClosure(game);
  const { reduced } = useReducedMotion();
  const confirmedMotion = useConfirmedMotion(
    'expedition-closure',
    closure?.receipt?.id,
    !!confirmedReceiptId && confirmedReceiptId === closure?.receipt?.id,
    reduced,
    340,
  );
  const runId = closure?.run.id;
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [runId]);
  if (!closure) return null;
  const { run, receipt, actions } = closure;
  const bossBattle =
    receipt?.battle &&
    run.graph.nodes.some((node) => node.id === receipt.request.nodeId && node.kind === 'boss')
      ? receipt.battle
      : undefined;
  const adversary = bossBattle ? bossPresentation(bossBattle.input.rival, language) : undefined;
  const t = (key: Parameters<typeof closureText>[1], values?: Record<string, string | number>) =>
    closureText(language, key, values);
  const numbers = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US');
  const assets: Record<ClosureAction, string> = {
    vault: 'product.gold-key',
    frog: 'toad.box',
    equipment: 'ui.team',
    prepare: 'ui.map',
  };
  const label = (action: ClosureAction) =>
    action === 'vault'
      ? t('vault', { name: text(language, 'obsidianVaults') })
      : action === 'frog'
        ? t('frog', { name: text(language, 'cocoaToad') })
        : t(action);
  return (
    <section
      className="expedition-closure"
      data-expedition-closure={run.status}
      data-confirmed-motion={confirmedMotion}
      data-closure-boss={adversary?.unit.wizardId}
      aria-labelledby="expedition-closure-title"
    >
      <div className="closure-stage">
        <Artwork
          asset={adversary?.figure ?? 'ui.map'}
          language={language}
          className="closure-hero"
          decorative
          eager
        />
        <h2 id="expedition-closure-title" ref={heading} tabIndex={-1}>
          {t(run.status === 'active' ? 'lost' : run.status)}
        </h2>
        <p className="closure-region">{regionAppearance(run.zoneId, language).name}</p>
        {adversary && (
          <p className="closure-adversary">
            {bossText(language, 'faced', { name: adversary.name })}
          </p>
        )}
        {receipt?.firstVictory === false && <small>{t('repeated')}</small>}
        {receipt && (
          <div className="closure-spoils" aria-label={t('spoils')}>
            {receipt.reward.crowns > 0 && (
              <span>
                <Artwork asset="currency.crowns" language={language} decorative eager />
                <strong>+{numbers.format(receipt.reward.crowns)}</strong>
                <span className="visually-hidden">
                  {text(language, 'crownsReward', { count: receipt.reward.crowns })}
                </span>
              </span>
            )}
            {receipt.reward.goldKeys > 0 && (
              <span className="closure-key">
                <Artwork asset="product.gold-key" language={language} decorative eager />
                <strong>+{numbers.format(receipt.reward.goldKeys)}</strong>
                <span className="visually-hidden">
                  {text(language, 'goldKeyRewardOne', { count: receipt.reward.goldKeys })}
                </span>
              </span>
            )}
            {(['cacao-toad', 'random-beans'] as const).map((kind) => {
              const count = receipt.reward.products.filter((p) => p === kind).length;
              return count ? (
                <span key={kind}>
                  <Artwork
                    asset={kind === 'cacao-toad' ? 'toad.box' : 'beans.jar'}
                    language={language}
                    decorative
                    eager
                  />
                  <strong>+{numbers.format(count)}</strong>
                  <span className="visually-hidden">
                    {text(language, kind === 'cacao-toad' ? 'cocoaToad' : 'chanceBeans')}
                  </span>
                </span>
              ) : null;
            })}
          </div>
        )}
        <div className="closure-actions">
          {actions.map((action, index) => (
            <button
              key={action}
              type="button"
              data-closure-action={action}
              className={index === 0 ? 'closure-primary' : 'closure-secondary'}
              disabled={!ready}
              onClick={(event) => onAction(action, event.currentTarget)}
            >
              <Artwork asset={assets[action]} language={language} decorative eager />
              <span>
                {label(action)}
                {action === 'frog' && <small>{t('noCharge')}</small>}
                {action === 'vault' && (
                  <small>{t('available', { count: game.inventory.goldKeys ?? 0 })}</small>
                )}
                {action === 'prepare' && index === 0 && <small>{t('prepareHint')}</small>}
              </span>
              <span aria-hidden="true">→</span>
            </button>
          ))}
        </div>
        {bossBattle && <BossBattleFacts combat={bossBattle} language={language} />}
      </div>
      <details className="closure-history">
        <summary>
          <Artwork asset="ui.map" language={language} decorative />
          <span>{t('details')}</span>
        </summary>
        <p>{t('kept')}</p>
        <div className="closure-companions" aria-label={t('companions')}>
          {run.members.map((member) => (
            <span key={member.unit.id} title={t(member.source === 'owned' ? 'owned' : 'temporary')}>
              <Artwork
                asset={`character.${member.unit.wizardId}.thumbnail`}
                language={language}
                decorative
              />
              <Artwork
                asset={member.source === 'owned' ? 'ui.owned' : 'ui.temporary'}
                language={language}
                className="closure-source"
                decorative
              />
              <span>{themedName(member.unit.wizardId, member.unit.wizardId, language)}</span>
              <small>{t(member.source === 'owned' ? 'owned' : 'temporary')}</small>
            </span>
          ))}
        </div>
        {receipt && (
          <NodeResult
            receipt={receipt}
            language={language}
            onReplay={onReplay}
            onMissions={onMissions}
            returnAction={{
              label: t('prepare'),
              onReturn: (origin) => onAction('prepare', origin),
            }}
          />
        )}
      </details>
    </section>
  );
}
