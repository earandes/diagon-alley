import type { ContentPackId } from './content-packs/active';

/** Cropped prop pieces only. This is not a character skeleton or combat rule. */
export interface BossArtLayer {
  readonly id: string;
  readonly url: string;
  readonly width: number;
  readonly height: number;
  /** Normalized x, y, width, height within the unchanged source figure. */
  readonly rect: readonly [number, number, number, number];
  /** Pivot within this cropped piece, not within the source figure. */
  readonly pivot: readonly [number, number];
  readonly motion: 'book-pages' | 'book-cover' | 'bowl-contents' | 'bowl-rim';
}
export interface BossArt {
  readonly figureSize: readonly [number, number];
  /** Confirmed projectile's visual origin within the figure; never target logic. */
  readonly origin: readonly [number, number];
  readonly layers: readonly BossArtLayer[];
}

const book: BossArt = {
  figureSize: [342, 428],
  origin: [211 / 342, 321 / 428],
  layers: [
    {
      id: 'book-pages',
      url: new URL('./content-packs/diagon-alley/art/boss-a70/book-pages.webp', import.meta.url)
        .href,
      width: 96,
      height: 109,
      rect: [170 / 342, 316 / 428, 96 / 342, 109 / 428],
      pivot: [0.43, 0.04],
      motion: 'book-pages',
    },
    {
      id: 'book-cover',
      url: new URL('./content-packs/diagon-alley/art/boss-a70/book-cover.webp', import.meta.url)
        .href,
      width: 96,
      height: 109,
      rect: [170 / 342, 316 / 428, 96 / 342, 109 / 428],
      pivot: [0.43, 0.04],
      motion: 'book-cover',
    },
  ],
};
const bowl: BossArt = {
  figureSize: [342, 512],
  origin: [255 / 342, 160 / 512],
  layers: [
    {
      id: 'bowl-contents',
      url: new URL('./content-packs/arcana/art/boss-a70/bowl-contents.webp', import.meta.url).href,
      width: 43,
      height: 19,
      rect: [234 / 342, 158 / 512, 43 / 342, 19 / 512],
      pivot: [0.5, 0.55],
      motion: 'bowl-contents',
    },
    {
      id: 'bowl-rim',
      url: new URL('./content-packs/arcana/art/boss-a70/bowl-rim.webp', import.meta.url).href,
      width: 38,
      height: 8,
      rect: [237 / 342, 162 / 512, 38 / 342, 8 / 512],
      pivot: [0.5, 0.55],
      motion: 'bowl-rim',
    },
  ],
};

/** Other leaders retain the generic illustrated figure; no invented boss identity. */
export function bossArt(packId: ContentPackId, wizardId: string): BossArt | null {
  if (wizardId !== 'circe') return null;
  return packId === 'diagon-alley' ? book : bowl;
}
