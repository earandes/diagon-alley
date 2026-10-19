import { useContext, useEffect, useRef, useState } from 'react';
import type { Run } from '../domain/exploration/run';
import type { Language } from '../domain/collection/wizards';
import { COMBAT_ESSENCE_COST } from '../domain/economy/essence';
import { nextExpeditionObjective } from './expedition-objective';
import { PreferenceOwnerContext } from './ReadingPreferences';
import { priorityText as t } from './priority-messages';
import { Artwork } from './Artwork';
import './priority-a89.css';

export function ExpeditionGuide({
  run,
  language,
  effectiveEssence,
  onPrepare,
  onConsult,
  ready = true,
}: {
  run?: Run | null;
  language: Language;
  effectiveEssence?: number;
  ready?: boolean;
  onPrepare?: (origin: HTMLElement) => void;
  onConsult?: (nodeId: string, origin: HTMLButtonElement) => void;
}) {
  const owner = useContext(PreferenceOwnerContext);
  const key = `arcana:guide:hidden:v1:${owner ?? 'welcome'}`;
  const read = () => {
    try {
      return localStorage.getItem(key) === 'true';
    } catch {
      return false;
    }
  };
  const [hidden, setHidden] = useState(read);
  const trigger = useRef<HTMLElement>(null);
  useEffect(() => {
    setHidden(read());
  }, [key]);
  const objective = nextExpeditionObjective(run, effectiveEssence);
  const icon =
    objective.kind === 'recruit' || objective.kind === 'begin'
      ? 'node.pact'
      : objective.kind === 'energy'
        ? 'currency.essence'
        : 'ui.map';
  const help = (
    {
      begin: 'beginHelp',
      recruit: 'recruitHelp',
      prepare: 'prepareHelp',
      choose: 'chooseHelp',
      energy: 'energyHelp',
      won: 'prepareHelp',
      lost: 'prepareHelp',
      draw: 'prepareHelp',
    } as const
  )[objective.kind];
  return (
    <aside
      className="expedition-guide priority-guide"
      data-expedition-cue={objective.kind}
      aria-label={t(language, 'guide')}
    >
      <details className="priority-guide-help" key={`${owner}:${hidden}`}>
        <summary
          ref={trigger}
          className="priority-guide-trigger"
          aria-label={hidden ? t(language, 'showGuide') : undefined}
        >
          <Artwork asset={icon} language={language} decorative />
          {!hidden && <span>{t(language, objective.kind)}</span>}
          {hidden && (
            <small className="priority-guide-fallback" aria-hidden="true">
              {t(language, 'showGuide')}
            </small>
          )}
        </summary>
        <div className="priority-guide-body">
          <p>{t(language, help, { cost: COMBAT_ESSENCE_COST })}</p>
          <div className="priority-guide-actions">
            {objective.nodeId && onConsult ? (
              <button
                disabled={!ready}
                onClick={(event) => onConsult(objective.nodeId!, event.currentTarget)}
              >
                {t(language, 'inspectPact')}
              </button>
            ) : (
              onPrepare &&
              objective.kind !== 'energy' && (
                <button disabled={!ready} onClick={(event) => onPrepare(event.currentTarget)}>
                  {t(language, 'openPreparation')}
                </button>
              )
            )}
            <button
              className="priority-guide-dismiss"
              onClick={() => {
                const next = !hidden;
                setHidden(next);
                try {
                  localStorage.setItem(key, String(next));
                } catch {
                  /* Optional preference. */
                }
                requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
              }}
            >
              {t(language, hidden ? 'showGuide' : 'hideGuide')}
            </button>
          </div>
        </div>
      </details>
    </aside>
  );
}
