import type { House } from '../../domain/collection/traits';
/** Presentation only: progress comes from the shared replay clock; no new timer or outcome. */
export function houseCastOffset(house: House | undefined, progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  if (house === 'gryffindor') return 0;
  if (house === 'slytherin') return Math.sin(p * Math.PI * 2) * 18;
  if (house === 'ravenclaw') return Math.sin(p * Math.PI) * 12;
  return Math.sin(p * Math.PI) * (house === 'hufflepuff' ? 30 : 22);
}
