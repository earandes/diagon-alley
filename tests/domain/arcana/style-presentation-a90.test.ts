import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { createPriorityFixtureState } from '../../browser-priorities/fixture-state';
import { ExpeditionGuide } from '../../../src/arcana/presentation/ExpeditionGuide';
import {
  ExpeditionIntentions,
  IntentionReminder,
} from '../../../src/arcana/presentation/ExpeditionIntentions';
import { CollectionSources } from '../../../src/arcana/presentation/CollectionSources';
import { priorityText } from '../../../src/arcana/presentation/priority-messages';
import { nextExpeditionObjective } from '../../../src/arcana/presentation/expedition-objective';

for (const language of ['es', 'en'] as const) {
  it(`keeps the contextual guide instruction in its accessible name: ${language}`, () => {
    const fixture = createPriorityFixtureState(new URLSearchParams('view=guide&single=1'));
    const run = fixture.active;
    const html = renderToStaticMarkup(
      createElement(ExpeditionGuide, { run, language, effectiveEssence: 50 }),
    );
    const summary = html.match(/<summary\b[^>]*>/)?.[0] ?? '';
    const objective = priorityText(language, nextExpeditionObjective(run, 50).kind);
    expect(html).toContain(objective);
    // The visible instruction supplies the native name, rather than a generic override.
    expect(summary).not.toContain('aria-label=');
  });

  it(`distinguishes available owned identities from the prepared formation: ${language}`, () => {
    const fixture = createPriorityFixtureState(new URLSearchParams('view=company'));
    expect(fixture.initial.exploration!.run!.members).toHaveLength(1);
    const html = renderToStaticMarkup(
      createElement(ExpeditionIntentions, {
        game: fixture.initial,
        content: fixture.content,
        language,
        ready: true,
        onChoose: () => {},
      }),
    );
    expect(html).toContain(
      language === 'es' ? '3 identidades propias disponibles' : '3 owned identities available',
    );
    expect(html).toContain(language === 'es' ? 'Elige tu formación' : 'Choose your formation');
    expect(html).not.toContain(
      language === 'es' ? 'identidades en pie · nivel' : 'distinct standing identities · tier',
    );
    expect(
      html.match(new RegExp(language === 'es' ? 'Cómo intentarlo' : 'How to try it', 'g')),
    ).toHaveLength(1);
  });

  it(`keeps the house emblem in a persisted reminder, without another choice: ${language}`, () => {
    const fixture = createPriorityFixtureState(new URLSearchParams('view=company'));
    const game = {
      ...fixture.initial,
      exploration: {
        ...fixture.initial.exploration!,
        intention: {
          version: 2 as const,
          afterRunId: fixture.closed.id,
          runId: null,
          choice: { kind: 'company', focus: 'house', house: 'gryffindor' } as const,
        },
      },
    };
    const html = renderToStaticMarkup(
      createElement(IntentionReminder, { game, content: fixture.content, language }),
    );
    expect(html).toContain('data-house="gryffindor"');
    expect(html).not.toContain('data-art="ui.collection"');
    expect(html).not.toContain('<button');
  });

  it(`keeps exact acquisition chance visible and moves technical provenance into help: ${language}`, () => {
    const html = renderToStaticMarkup(
      createElement(CollectionSources, {
        language,
        sources: { probability: 0.25, tableVersion: 42, temporaryOpportunity: true },
        onAcquire: () => {},
      }),
    );
    const [visible, help] = html.split('<details>');
    expect(visible).toContain('25');
    expect(visible).toContain(language === 'es' ? 'copia propia' : 'owned copy');
    expect(visible).not.toContain(language === 'es' ? 'tabla 42' : 'table 42');
    expect(help).toContain(language === 'es' ? 'tabla 42' : 'table 42');
    expect(html).toContain(language === 'es' ? 'aliado temporal' : 'temporary ally');
  });
}
