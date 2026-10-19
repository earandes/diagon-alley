import type { ComponentProps } from 'react';
import { BeanAssignments } from './BeanAssignments';
import { Artwork } from './Artwork';
import { text } from './translations';
import { validBeanAssignments } from './contextual-preparation';
import { commercePrepText } from './commerce-preparation-messages';

/** Read-only stock and draft presentation; only the existing battle command consumes. */
export function BossSupplies(props: ComponentProps<typeof BeanAssignments>) {
  const { game, run, language, assignments } = props;
  const stock = game.inventory.products.filter(
    (p) => p.kind === 'random-beans' && p.status === 'available',
  ).length;
  const draft = validBeanAssignments(assignments, run, game).length;
  const numbers = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US');
  return (
    <details className="node-bean-preparation boss-supplies">
      <summary
        data-bean-stock={stock}
        data-bean-draft={draft}
        aria-label={text(language, 'nodeBeanPreparation', { count: stock })}
      >
        <Artwork asset="beans.jar" language={language} decorative eager />
        <span className="boss-supply-caption">
          <span>{text(language, 'chanceBeans')}</span>
          <strong aria-hidden="true">×{numbers.format(stock)}</strong>
          {draft > 0 && (
            <small>
              {commercePrepText(language, draft === 1 ? 'draftOne' : 'draft', {
                count: numbers.format(draft),
              })}
            </small>
          )}
        </span>
      </summary>
      <BeanAssignments {...props} />
    </details>
  );
}
