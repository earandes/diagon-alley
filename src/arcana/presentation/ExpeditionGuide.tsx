import type { Run } from '../domain/exploration/run';
import type { Language } from '../domain/collection/wizards';
import { expeditionCue } from './expedition-cue';
import { Artwork } from './Artwork';
import { text } from './translations';

const cues = {
  begin: ['guideBeginTitle', 'guideBeginBody', 'pact'],
  recruit: ['guideRecruitTitle', 'guideRecruitBody', 'pact'],
  prepare: ['guidePrepareTitle', 'guidePrepareBody', 'duel'],
  choose: ['guideChooseTitle', 'guideChooseBody', 'duel'],
  won: ['guideWonTitle', 'guideWonBody', 'boss'],
  lost: ['guideLostTitle', 'guideLostBody', 'refuge'],
  draw: ['guideDrawTitle', 'guideDrawBody', 'refuge'],
} as const;

export function ExpeditionGuide({ run, language }: { run?: Run | null; language: Language }) {
  const cue = expeditionCue(run);
  const [title, body, icon] = cues[cue];
  const numbers = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US');
  const stages = run ? new Set(run.graph.nodes.map((n) => n.row)).size : 0;
  return (
    <aside
      className="expedition-guide"
      data-expedition-cue={cue}
      aria-label={text(language, 'nextObjective')}
    >
      <Artwork asset={`node.${icon}`} language={language} className="guide-icon" decorative />
      <div>
        <h3 className="visually-hidden">{text(language, title)}</h3>
        <div className="guide-route" aria-hidden="true">
          {['pact', 'duel', 'boss', 'chest'].map((step, index) => (
            <span key={step} data-current={step === icon}>
              <Artwork asset={`node.${step}`} language={language} decorative />
              {index < 3 && <b>›</b>}
            </span>
          ))}
        </div>
        <details className="guide-help">
          <summary aria-label={text(language, 'nextObjective')}>?</summary>
          <p>{text(language, body, { count: numbers.format(run?.members.length ?? 0) })}</p>
        </details>
        {run && (
          <small
            aria-label={text(language, 'routeStages', {
              count: numbers.format(run.visited.length),
              total: numbers.format(stages),
            })}
          >
            {numbers.format(run.visited.length)} / {numbers.format(stages)}
          </small>
        )}
      </div>
    </aside>
  );
}
