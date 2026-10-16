import { useEffect, useRef, useState } from 'react';
import type { GameState } from '../application/game';
import type { SeasonalRequest } from '../application/seasonal-events';
import type { Language } from '../domain/collection/wizards';
import {
  previewSeasonalPreparation,
  seasonalOpportunity,
  seasonalPhase,
  type SeasonalEdition,
  type SeasonalState,
} from '../domain/seasonal/events';
import { seasonalEdition } from '../infrastructure/content/seasonal-content';
import { Artwork } from './Artwork';
import { regionAppearance, themedName } from './content-packs/active';
import { visualAsset } from './content-packs/art';
import { text } from './translations';
import { seasonalText, type SeasonalMessageKey } from './seasonal-messages';
import pumpkinLantern from './art/seasonal-a68/pumpkin-lantern.svg?url';
import './seasonal-event.css';

/** Frozen unfinished editions stay reachable after the server publishes another definition. */
export function seasonalDisplayEdition(
  current: SeasonalEdition,
  seasonal: SeasonalState | undefined,
  now: number,
  requested?: string | null,
): SeasonalEdition {
  if (requested === current.editionId) return current;
  const selected = seasonal?.participations.find((entry) => entry.edition.editionId === requested);
  if (selected) return selected.edition;
  return (
    seasonal?.participations.find(
      (entry) =>
        entry.completedObjectiveIds.length < entry.edition.objectiveIds.length &&
        ['open', 'grace'].includes(seasonalPhase(entry.edition, now)),
    )?.edition ?? current
  );
}

/** A read-only view of confirmed progress; no controls or authority are hidden in the artwork. */
export function SeasonalWindowGallery({
  edition,
  completed,
  language,
  participating = false,
}: {
  edition: SeasonalEdition;
  completed: readonly string[];
  language: Language;
  participating?: boolean;
}) {
  const names = ['sweetshopWindow', 'workshopWindow', 'vaultWindow'] as const;
  const t = (key: SeasonalMessageKey, values: Record<string, string | number> = {}) =>
    seasonalText(language, key, values);
  return (
    <>
      <ol
        className="seasonal-windows"
        aria-label={t('progress', { done: completed.length, total: edition.objectiveIds.length })}
      >
        {edition.objectiveIds.map((id, index) => (
          <li
            key={id}
            className="seasonal-window"
            data-seasonal-window={id}
            data-lit={completed.includes(id)}
            aria-current={participating && completed.length === index ? 'step' : undefined}
          >
            <div className="seasonal-window-frame" aria-hidden="true">
              <Artwork
                asset={
                  visualAsset(`shopfront.${['confectionery', 'workshop', 'vault'][index % 3]}`)
                    ? `shopfront.${['confectionery', 'workshop', 'vault'][index % 3]}`
                    : `scene.${['confectionery', 'workshop', 'vault'][index % 3]}`
                }
                language={language}
                decorative
                eager
              />
              <span className="seasonal-window-glass" />
              <span className="seasonal-window-sigil">{completed.includes(id) ? '✦' : '◇'}</span>
            </div>
            <span>{t(names[index % 3])}</span>
            <small>{t(completed.includes(id) ? 'lit' : 'enchanted')}</small>
          </li>
        ))}
      </ol>
      <p className="seasonal-progress" data-seasonal-progress>
        {t('progress', { done: completed.length, total: edition.objectiveIds.length })}
      </p>
    </>
  );
}

export interface SeasonalEventProps {
  readonly state: GameState;
  readonly language: Language;
  /** Latest authority time, never the client clock. It cannot grant or complete anything. */
  readonly serverTime: number;
  readonly edition?: SeasonalEdition;
  readonly busy?: boolean;
  readonly reducedMotion?: boolean;
  readonly error?: string | null;
  readonly onRecover?: () => void;
  readonly recoverLabel?: string;
  readonly onAction: (request: SeasonalRequest) => void;
  readonly onPrepareRoute: () => void;
}

/** Presentation drafts only. Every join, repair and exchange requires an authority command. */
export function SeasonalEvent({
  state,
  language,
  serverTime,
  edition = seasonalEdition,
  busy = false,
  reducedMotion = false,
  error,
  onRecover,
  recoverLabel,
  onAction,
  onPrepareRoute,
}: SeasonalEventProps) {
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState<'dispel' | 'prepare' | null>(null);
  const [artFailed, setArtFailed] = useState(false);
  const [viewedEdition, setViewedEdition] = useState<string | null>(null);
  const [freshGrant, setFreshGrant] = useState(false);
  const [announcement, setAnnouncement] = useState<{ message: string; language: Language } | null>(
    null,
  );
  const dialog = useRef<HTMLDialogElement>(null);
  const origin = useRef<HTMLButtonElement>(null);
  const t = (key: SeasonalMessageKey, values: Record<string, string | number> = {}) =>
    seasonalText(language, key, {
      energy: text(language, 'essence'),
      place: regionAppearance(state.exploration?.run?.zoneId ?? 'pasaje', language).name,
      ...values,
    });
  const shownEdition = seasonalDisplayEdition(edition, state.seasonal, serverTime, viewedEdition);
  const participation = state.seasonal?.participations.find(
    (entry) => entry.edition.editionId === shownEdition.editionId,
  );
  const definition = participation?.edition ?? shownEdition;
  const phase = seasonalPhase(definition, serverTime);
  const run = state.exploration?.run;
  const complete = participation?.completedObjectiveIds.length === definition.objectiveIds.length;
  const keepsake = state.seasonal?.keepsakes.find(
    (entry) => entry.editionId === definition.editionId,
  );
  const opportunity =
    !!participation && !!run && seasonalOpportunity(participation, run, serverTime);
  const preparation = run ? previewSeasonalPreparation(run.members) : undefined;
  const historical =
    state.seasonal?.participations.filter(
      (entry) => entry.edition.editionId !== definition.editionId,
    ) ?? [];
  const otherActive = state.seasonal?.participations.some(
    (entry) =>
      entry.edition.editionId !== definition.editionId &&
      entry.completedObjectiveIds.length < entry.edition.objectiveIds.length &&
      ['open', 'grace'].includes(seasonalPhase(entry.edition, serverTime)),
  );
  const lastOpportunity = participation?.opportunities.at(-1);
  const lastReceipt = state.receipts.filter((entry) => entry.kind === 'seasonal-event').at(-1);
  const announcedReceipt = useRef(lastReceipt?.id);
  const previousGrant = useRef(keepsake?.operationId);
  const currentWindow = participation?.completedObjectiveIds.length ?? 0;
  const windowStories = ['sweetshopStory', 'workshopStory', 'vaultStory'] as const;
  const numbers = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-GB', {
    maximumFractionDigits: 2,
  });
  const date = (value: number) =>
    new Intl.DateTimeFormat(language === 'es' ? 'es-ES' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: definition.timezone,
    }).format(value);
  const changed =
    preparation?.vitals.filter(
      (vital) => vital.beforeHp !== vital.afterHp || vital.beforeMana !== vital.afterMana,
    ) ?? [];

  useEffect(() => {
    setChoice(null);
  }, [state.revision, run?.id]);
  useEffect(() => {
    if (previousGrant.current === keepsake?.operationId) return;
    previousGrant.current = keepsake?.operationId;
    setFreshGrant(open && !!keepsake);
  }, [keepsake?.operationId, open]);
  useEffect(() => {
    if (!lastReceipt || announcedReceipt.current === lastReceipt.id) return;
    announcedReceipt.current = lastReceipt.id;
    const key = lastReceipt.keepsake
      ? 'completeDetail'
      : lastReceipt.request.action === 'join'
        ? 'joined'
        : lastReceipt.request.action === 'dispel'
          ? 'savedDispel'
          : 'savedPrepare';
    setAnnouncement({ message: seasonalText(language, key), language });
  }, [lastReceipt?.id, language]);
  useEffect(() => {
    if (!open || !dialog.current) return;
    const element = dialog.current;
    element.showModal();
    element
      .querySelector<HTMLButtonElement>('[data-seasonal-close]')
      ?.focus({ preventScroll: true });
    return () => {
      if (element.open) element.close();
      if (origin.current?.isConnected) origin.current.focus({ preventScroll: true });
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setChoice(null);
    setFreshGrant(false);
  };
  const command = (action: SeasonalRequest['action']) => {
    if (busy) return;
    onAction({
      editionId: definition.editionId,
      version: definition.version,
      action,
      ...(action !== 'join' && run ? { runId: run.id } : {}),
    });
  };
  const lantern = (className: string) => (
    <span className={`seasonal-lantern ${className}`} aria-hidden="true">
      {!artFailed ? (
        <img
          src={pumpkinLantern}
          width="160"
          height="192"
          alt=""
          onError={() => setArtFailed(true)}
        />
      ) : (
        <span className="seasonal-lantern-fallback">✦</span>
      )}
    </span>
  );
  const waiting =
    phase === 'closed'
      ? 'closed'
      : phase === 'upcoming'
        ? 'upcoming'
        : phase === 'grace' && (!run || !participation?.boundRunIds.includes(run.id))
          ? 'unavailableRun'
          : !run || run.status !== 'active'
            ? 'startHint'
            : run.visited.length < 2
              ? 'earlyHint'
              : 'nextNode';

  return (
    <div
      className="seasonal-event"
      data-seasonal-event={definition.editionId}
      data-reduced={reducedMotion}
    >
      {!open && (
        <span
          className="visually-hidden"
          role="status"
          aria-live="polite"
          lang={announcement?.language}
        >
          {announcement?.message ?? ''}
        </span>
      )}
      <button
        type="button"
        ref={origin}
        className="seasonal-invitation"
        data-seasonal-open
        aria-label={t('invitation')}
        onClick={() => setOpen(true)}
      >
        {lantern('seasonal-invitation-art')}
        <span className="seasonal-invitation-label">
          {keepsake ? t('history') : t('invitation')}
        </span>
        {participation && !complete && (
          <small>
            {participation.completedObjectiveIds.length}/{definition.objectiveIds.length}
          </small>
        )}
        {keepsake && (
          <span className="seasonal-invitation-check" aria-hidden="true">
            ✓
          </span>
        )}
      </button>
      {open && (
        <dialog
          ref={dialog}
          className="seasonal-dialog"
          aria-labelledby="seasonal-title"
          data-seasonal-dialog
          data-seasonal-phase={phase}
          onCancel={(event) => {
            event.preventDefault();
            close();
          }}
        >
          <section className="seasonal-story" aria-busy={busy}>
            <span
              className="visually-hidden"
              role="status"
              aria-live="polite"
              lang={announcement?.language}
            >
              {announcement?.message ?? ''}
            </span>
            <header className="seasonal-heading">
              <span className="seasonal-edition">
                Halloween · {definition.editionId.replace(/^halloween-/, '')}
              </span>
              <button type="button" data-seasonal-close className="seasonal-close" onClick={close}>
                {t('close')} <span aria-hidden="true">↩</span>
              </button>
              <h2 id="seasonal-title">{t('title')}</h2>
            </header>
            <p className="seasonal-intro">{complete ? t('completeDetail') : t('story')}</p>
            {error && (
              <div className="seasonal-error" role="alert">
                <p>{error}</p>
                {onRecover && (
                  <button
                    type="button"
                    className="seasonal-secondary"
                    disabled={busy}
                    onClick={onRecover}
                  >
                    {recoverLabel ?? t('recover')}
                  </button>
                )}
              </div>
            )}
            <SeasonalWindowGallery
              edition={definition}
              completed={participation?.completedObjectiveIds ?? []}
              language={language}
              participating={!!participation}
            />

            {!participation && (
              <div className="seasonal-discover">
                <div className="seasonal-reward-preview">
                  {lantern('seasonal-reward-art')}
                  <div>
                    <strong>{t('keepsake')}</strong>
                    <p>{t('reward')}</p>
                  </div>
                </div>
                {phase === 'open' ? (
                  <>
                    <p className="seasonal-cost">{t('participationCost')}</p>
                    <button
                      type="button"
                      className="seasonal-primary"
                      data-seasonal-join
                      disabled={busy || otherActive}
                      onClick={() => command('join')}
                    >
                      {busy ? t('pending') : t('join')}
                    </button>
                    {otherActive && <p>{t('activeEdition')}</p>}
                  </>
                ) : (
                  <p>
                    {t(phase === 'upcoming' ? 'upcoming' : phase === 'grace' ? 'grace' : 'closed')}
                  </p>
                )}
              </div>
            )}

            {participation && !complete && (
              <>
                {opportunity ? (
                  <div className="seasonal-decision">
                    <p className="seasonal-window-story">{t(windowStories[currentWindow % 3])}</p>
                    <div className="seasonal-choice-tray" role="group" aria-label={t('next')}>
                      <button
                        type="button"
                        className="seasonal-choice"
                        data-seasonal-choice="dispel"
                        aria-pressed={choice === 'dispel'}
                        disabled={busy}
                        onClick={() => setChoice('dispel')}
                      >
                        <span className="seasonal-choice-object" aria-hidden="true">
                          ✧
                        </span>
                        <strong>{t('dispel')}</strong>
                        <span>{t('dispelDetail')}</span>
                        {choice === 'dispel' && (
                          <b className="seasonal-choice-seal" aria-label={t('selected')}>
                            ✓
                          </b>
                        )}
                      </button>
                      <button
                        type="button"
                        className="seasonal-choice"
                        data-seasonal-choice="prepare"
                        aria-pressed={choice === 'prepare'}
                        disabled={busy || !preparation?.eligible}
                        onClick={() => setChoice('prepare')}
                      >
                        <span
                          className="seasonal-choice-object seasonal-healing-object"
                          aria-hidden="true"
                        >
                          <Artwork asset="node.refuge" language={language} decorative eager />
                        </span>
                        <strong>{t('prepare')}</strong>
                        <span>{t('preparationEffect')}</span>
                        {!preparation?.eligible && (
                          <small>
                            {t(preparation?.reason === 'no-benefit' ? 'noBenefit' : 'insufficient')}
                          </small>
                        )}
                        {choice === 'prepare' && (
                          <b className="seasonal-choice-seal" aria-label={t('selected')}>
                            ✓
                          </b>
                        )}
                      </button>
                    </div>
                    {choice === 'prepare' && preparation?.eligible && (
                      <div className="seasonal-trade-preview">
                        <p>{t('prepareDetail')}</p>
                        <h3>{t('beforeAfter')}</h3>
                        <ul>
                          {changed.map((vital) => {
                            const member = run!.members.find(
                              ({ unit }) => unit.id === vital.unitId,
                            )!;
                            const name = themedName(member.unit.wizardId, member.unit.id, language);
                            return (
                              <li key={vital.unitId}>
                                <Artwork
                                  asset={`character.${member.unit.wizardId}.thumbnail`}
                                  language={language}
                                  decorative
                                  eager
                                />
                                <span className="seasonal-vital-name">{name}</span>
                                {(
                                  [
                                    ['hp', vital.beforeHp, vital.afterHp],
                                    ['mp', vital.beforeMana, vital.afterMana],
                                  ] as const
                                ).map(([resource, before, after]) => (
                                  <span
                                    key={resource}
                                    data-direction={after > before ? 'gain' : 'cost'}
                                    aria-label={t('change', {
                                      name,
                                      resource: t(resource),
                                      before: numbers.format(before),
                                      after: numbers.format(after),
                                    })}
                                  >
                                    {t(resource)} {numbers.format(before)} → {numbers.format(after)}
                                  </span>
                                ))}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                    <p className="seasonal-draft-hint">{t('draft')}</p>
                    {choice && (
                      <button
                        type="button"
                        className="seasonal-primary"
                        data-seasonal-confirm={choice}
                        disabled={busy || (choice === 'prepare' && !preparation?.eligible)}
                        onClick={() => command(choice)}
                      >
                        {busy
                          ? t('pending')
                          : t(choice === 'dispel' ? 'confirmDispel' : 'confirmPrepare')}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="seasonal-waiting">
                    <p>{t(waiting)}</p>
                    {phase === 'open' && (!run || run.status !== 'active') && (
                      <button
                        type="button"
                        className="seasonal-primary"
                        data-seasonal-prepare-route
                        disabled={busy}
                        onClick={() => {
                          close();
                          onPrepareRoute();
                        }}
                      >
                        {t('route')}
                      </button>
                    )}
                    {run?.status === 'active' && phase !== 'closed' && (
                      <button type="button" className="seasonal-secondary" onClick={close}>
                        {t('returnRoute')}
                      </button>
                    )}
                  </div>
                )}
                {lastOpportunity && (
                  <p
                    className="seasonal-last-result"
                    data-seasonal-last-action={lastOpportunity.action}
                  >
                    {t(lastOpportunity.action === 'dispel' ? 'savedDispel' : 'savedPrepare')}
                  </p>
                )}
              </>
            )}

            {complete && keepsake && (
              <section
                className="seasonal-finale"
                data-reveal={freshGrant}
                data-seasonal-keepsake={keepsake.id}
                aria-label={t('keepsake')}
              >
                {lantern('seasonal-finale-art')}
                <h3>{t('complete')}</h3>
                <strong>{t('keepsake')}</strong>
                <p>{t('permanent')}</p>
                <small>
                  {t('provenance', { edition: keepsake.editionId.replace(/^halloween-/, '') })}
                </small>
                <p>{t('keepsakeDetail')}</p>
              </section>
            )}
            <details className="seasonal-details">
              <summary>{t('details')}</summary>
              <p>{t('objective')}</p>
              <p>{t('participationCost')}</p>
              <p>{t('tradeRules')}</p>
              <p>
                {t('participationDates', {
                  start: date(definition.startsAt),
                  end: date(definition.participationEndsAt),
                })}
              </p>
              <p>{t('finishDates', { end: date(definition.completionEndsAt) })}</p>
              <p>{t('serverCalendar', { timezone: definition.timezone })}</p>
              <p>{t('keepsakeDetail')}</p>
              <p>{t('noAutomatic')}</p>
            </details>
            {(!!historical.length || definition.editionId !== edition.editionId) && (
              <details className="seasonal-history">
                <summary>{t('history')}</summary>
                <ul>
                  {definition.editionId !== edition.editionId && (
                    <li>
                      <button
                        type="button"
                        className="seasonal-secondary"
                        onClick={() => {
                          setViewedEdition(edition.editionId);
                          setChoice(null);
                        }}
                      >
                        {t('historicalEdition', { edition: edition.editionId })}
                      </button>
                    </li>
                  )}
                  {historical.map((entry) => (
                    <li key={entry.edition.editionId}>
                      <button
                        type="button"
                        className="seasonal-secondary"
                        onClick={() => {
                          setViewedEdition(entry.edition.editionId);
                          setChoice(null);
                        }}
                      >
                        {t('historicalEdition', { edition: entry.edition.editionId })} ·{' '}
                        {entry.completedObjectiveIds.length}/{entry.edition.objectiveIds.length}
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </section>
        </dialog>
      )}
    </div>
  );
}
