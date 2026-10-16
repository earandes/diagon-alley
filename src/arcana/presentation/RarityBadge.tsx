import type { Rarity } from '../domain/collection/rarity';
import type { Language } from '../domain/collection/wizards';
import { Artwork } from './Artwork';
import { text } from './translations';
const labels = {
  common: 'common',
  unusual: 'unusual',
  epic: 'epic',
  'arcane-legendary': 'arcaneLegendary',
} as const;
export function RarityBadge({ rarity, language }: { rarity: Rarity; language: Language }) {
  return (
    <p className="rarity-badge" data-rarity={rarity}>
      <Artwork asset={`rarity.${rarity}`} language={language} decorative className="rarity-icon" />
      <span>{text(language, labels[rarity])}</span>
    </p>
  );
}
