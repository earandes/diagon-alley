import type { Rarity } from '../domain/collection/rarity';
import type { ContentPack } from './content-packs/contract';
type OpeningTimings = ContentPack['animations']['opening'];
export type OpeningPhase =
  | 'anticipation'
  | 'seal'
  | 'lid'
  | 'hop'
  | 'settle'
  | 'escape'
  | 'card'
  | 'flip'
  | 'reveal'
  | 'resolve'
  | 'finish';
const ranks = { common: 0, unusual: 1, epic: 2, 'arcane-legendary': 3 } as const;
const bounded = (n: number, fallback: number) =>
  Number.isFinite(n) ? Math.min(1600, Math.max(40, n)) : fallback;
/** Presentation only. No random input, reward, probability or economic operation belongs here. */
export function openingMotionRecipe(timings: OpeningTimings, rarity: Rarity, isNew: boolean) {
  const rank = ranks[rarity],
    factor = isNew ? 1 + rank * 0.08 : 0.62;
  const seal = bounded(timings.sealMs, 250) * factor,
    lid = bounded(timings.lidMs, 400) * factor,
    hop = bounded(timings.subjectMs, 650) * factor,
    face = bounded(timings.cardMs, 500) * factor,
    hold = bounded(timings.holdMs, 150) * factor;
  const phases = {
    anticipation: 0,
    seal: seal * 0.6,
    lid: seal * 0.6 + seal * 0.7,
    hop: 0,
    settle: 0,
    escape: 0,
    card: 0,
    flip: 0,
    reveal: 0,
    resolve: 0,
    finish: 0,
  };
  phases.hop = phases.lid + lid * 0.3;
  phases.settle = phases.hop + hop;
  phases.escape = phases.settle + hop * 0.22;
  phases.card = phases.escape + hop * 0.042;
  phases.flip = phases.card + face * 0.75;
  phases.reveal = phases.flip + face * 0.4;
  phases.resolve = phases.reveal + face;
  phases.finish = phases.resolve + hold * 0.5;
  const total = Math.min(3800, Math.max(1800, phases.finish));
  const scale = total / phases.finish;
  const labels = Object.freeze(
    Object.fromEntries(
      Object.entries(phases).map(([key, value]) => [key, key === 'finish' ? total : value * scale]),
    ) as Record<OpeningPhase, number>,
  );
  return Object.freeze({
    rank,
    isNew,
    labels,
    durationMs: labels.finish,
    durations: Object.freeze({
      seal: seal * scale,
      lid: lid * scale,
      hop: hop * scale,
      settle: hop * 0.22 * scale,
      escape: hop * 0.42 * scale,
      card: face * 0.75 * scale,
      flip: face * 0.4 * scale,
      reveal: face * scale,
    }),
    sparkCount: isNew ? [6, 10, 16, 24][rank] : 4,
    magicMs: isNew ? 720 + rank * 220 : 420,
    intensity: isNew ? 0.55 + rank * 0.15 : 0.32,
  });
}
export type OpeningMotionRecipe = ReturnType<typeof openingMotionRecipe>;
export function openingPhaseAt(recipe: OpeningMotionRecipe, elapsedMs: number): OpeningPhase {
  let phase: OpeningPhase = 'anticipation';
  for (const name of Object.keys(recipe.labels) as OpeningPhase[])
    if (elapsedMs >= recipe.labels[name]) phase = name;
  return phase;
}
