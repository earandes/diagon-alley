import type { GameState } from '../application/game';
import type { PublicContent } from '../application/public-content';
import type { Language } from '../domain/collection/wizards';
import type { IntentionChoice } from '../domain/exploration/intentions';
import { sameIntentionChoice } from '../domain/exploration/intentions';
import {
  availableIntentions,
  intentionProgress,
  type IntentionAvailability,
} from '../application/client/expedition-intentions';
import { Artwork } from './Artwork';
import { themedName } from './content-packs/active';
import { intentionText as t } from './intention-messages';
import './expedition-intentions.css';

export function intentionAvailability(content: PublicContent): IntentionAvailability {
  return {
    ownedAffinities: content.campaign.ownedAffinities ?? {},
    beanPrice:
      content.shop.products.find((product) => product.kind === 'random-beans')?.crowns ?? Infinity,
  };
}
function intentionVisual(choice: IntentionChoice, game: GameState, language: Language) {
  if (choice.kind === 'new-companion') {
    const fallback =
      game.copies.find((copy) => copy.wizard.id === choice.wizardId)?.wizard.name[language] ??
      choice.wizardId;
    const name = themedName(choice.wizardId, fallback, language);
    return {
      asset: `character.${choice.wizardId}.portrait`,
      label: t(language, 'companion'),
      target: name,
      detail: t(language, 'companionDetail', { name }),
    };
  }
  if (choice.kind === 'synergy') {
    const affinity = t(language, choice.affinity);
    return {
      asset: 'node.refuge',
      label: t(language, 'synergy'),
      target: affinity,
      detail: t(language, 'synergyDetail', { affinity }),
    };
  }
  return {
    asset: 'beans.jar',
    label: t(language, 'bean'),
    target: '',
    detail: t(language, 'beanDetail'),
  };
}
export function ExpeditionIntentions({
  game,
  content,
  language,
  ready,
  onChoose,
}: {
  game: GameState;
  content: PublicContent;
  language: Language;
  ready: boolean;
  onChoose: (choice: IntentionChoice | null, origin: HTMLElement) => void;
}) {
  const availability = intentionAvailability(content);
  const choices = availableIntentions(game, availability);
  const progress = intentionProgress(game, availability);
  if (!choices.length && !progress) return null;
  const current =
    progress?.status === 'selected' || progress?.status === 'unavailable'
      ? progress.intention.choice
      : null;
  return (
    <section
      className="expedition-intentions"
      data-expedition-intentions
      aria-label={t(language, 'heading')}
    >
      <h3>{t(language, 'heading')}</h3>
      <div className="intention-choices">
        {choices.map((choice) => {
          const visual = intentionVisual(choice, game, language);
          const selected = sameIntentionChoice(current, choice);
          return (
            <div className="intention-choice" key={choice.kind} data-intention-choice={choice.kind}>
              <button
                type="button"
                className="intention-object"
                aria-pressed={selected}
                aria-disabled={!ready || selected || undefined}
                aria-label={t(language, 'choose', {
                  name: [visual.label, visual.target].filter(Boolean).join(' · '),
                })}
                onClick={(event) => {
                  if (ready && !selected) onChoose(choice, event.currentTarget);
                }}
              >
                <Artwork asset={visual.asset} language={language} decorative />
                <span className="intention-object-label">
                  {visual.label}
                  <small>{visual.target}</small>
                </span>
                {selected && (
                  <span className="intention-seal" aria-label={t(language, 'selected')}>
                    ✓
                  </span>
                )}
              </button>
              <details className="intention-explanation">
                <summary>{t(language, 'details')}</summary>
                <p>{visual.detail}</p>
                {choice.kind === 'bean' && (
                  <small>
                    {game.inventory.products.some(
                      (p) => p.kind === 'random-beans' && p.status === 'available',
                    )
                      ? t(language, 'ownBean')
                      : t(language, 'buyBean', {
                          cost: new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-GB').format(
                            availability.beanPrice,
                          ),
                        })}
                  </small>
                )}
              </details>
            </div>
          );
        })}
      </div>
      {progress && progress.status !== 'selected' && (
        <IntentionReminder game={game} content={content} language={language} />
      )}
      <details className="intention-purpose">
        <summary aria-label={t(language, 'heading')}>?</summary>
        <p>{t(language, 'hint')}</p>
      </details>
      {current && (
        <button
          type="button"
          className="intention-release"
          disabled={!ready}
          onClick={(event) => onChoose(null, event.currentTarget)}
        >
          {t(language, 'cancel')}
        </button>
      )}
    </section>
  );
}
export function IntentionReminder({
  game,
  content,
  language,
  onCancel,
  ready = true,
}: {
  game: GameState;
  content: PublicContent;
  language: Language;
  ready?: boolean;
  onCancel?: (origin: HTMLElement) => void;
}) {
  const progress = intentionProgress(game, intentionAvailability(content));
  if (!progress) return null;
  const visual = intentionVisual(progress.intention.choice, game, language);
  return (
    <details className="intention-reminder" data-intention-status={progress.status}>
      <summary>
        <Artwork asset={visual.asset} language={language} decorative />
        <span>
          {visual.target || visual.label}
          <small>{t(language, progress.status)}</small>
        </span>
        <span className="intention-state-mark" aria-hidden="true">
          {progress.status === 'completed'
            ? '✓'
            : progress.status === 'ended' || progress.status === 'unavailable'
              ? '◇'
              : '✦'}
        </span>
      </summary>
      <div>
        <p>
          {progress.status === 'unavailable' ? t(language, 'unavailableDetail') : visual.detail}
        </p>
        <small>{t(language, 'hint')}</small>
        {onCancel && (
          <button
            type="button"
            disabled={!ready}
            onClick={(event) => onCancel(event.currentTarget)}
          >
            {t(language, 'cancel')}
          </button>
        )}
      </div>
    </details>
  );
}
