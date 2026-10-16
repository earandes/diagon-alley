import type { Language, StarCount } from '../domain/collection/wizards';
import { text } from './translations';

/** Render stored metadata; rarity and current catalogue never reconstruct historical stars. */
export function StarRating({ stars, language }: { stars?: StarCount; language: Language }) {
  if (stars === undefined) return <p className="card-stars">{text(language, 'starsUnrecorded')}</p>;
  return (
    <p className="card-stars">
      <span aria-hidden="true">{'★'.repeat(stars)}</span>{' '}
      <span>{text(language, stars === 1 ? 'oneStar' : 'manyStars', { count: stars })}</span>
    </p>
  );
}
