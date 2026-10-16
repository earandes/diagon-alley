import type { BattleEvent } from '../../domain/combat/engine';

export type ReplayPhase = 'anticipation' | 'flight' | 'impact' | 'settle' | 'finished';
export interface PlaybackPosition {
  readonly cursor: number;
  readonly progress: number;
  readonly phase: ReplayPhase;
  readonly playing: boolean;
  readonly visible: boolean;
  readonly speed: 1 | 2;
}
/** Pure presentation time. It never reads/writes a game, recomputes damage or generates events. */
export class ReplayClock {
  private cursor = 0;
  private elapsed = 0;
  private last: number | null = null;
  private playing = false;
  private visible = true;
  private speed: 1 | 2 = 1;
  constructor(private readonly durations: readonly number[]) {
    if (durations.some((n) => !Number.isFinite(n) || n <= 0))
      throw new Error('Invalid replay duration');
  }
  tick(now: number): void {
    if (!Number.isFinite(now) || now < 0) throw new Error('Invalid presentation time');
    if (this.last === null) {
      this.last = now;
      return;
    }
    if (now < this.last) return;
    const delta = now - this.last;
    this.last = now;
    if (!this.playing || !this.visible) return;
    this.elapsed += delta * this.speed;
    while (this.cursor < this.durations.length && this.elapsed >= this.durations[this.cursor]) {
      this.elapsed -= this.durations[this.cursor++];
    }
    if (this.cursor === this.durations.length) {
      this.elapsed = 0;
      this.playing = false;
    }
  }
  play(now: number): void {
    this.tick(now);
    if (this.cursor < this.durations.length) this.playing = true;
  }
  pause(now: number): void {
    this.tick(now);
    this.playing = false;
  }
  setSpeed(speed: 1 | 2, now: number): void {
    this.tick(now);
    this.speed = speed;
  }
  setVisible(visible: boolean, now: number): void {
    this.tick(now);
    this.visible = visible;
  }
  skip(): void {
    this.cursor = this.durations.length;
    this.elapsed = 0;
    this.playing = false;
  }
  snapshot(): PlaybackPosition {
    const progress =
      this.cursor === this.durations.length ? 1 : this.elapsed / this.durations[this.cursor];
    return {
      cursor: this.cursor,
      progress,
      phase:
        this.cursor === this.durations.length
          ? 'finished'
          : progress < 0.18
            ? 'anticipation'
            : progress < 0.78
              ? 'flight'
              : progress < 0.9
                ? 'impact'
                : 'settle',
      playing: this.playing,
      visible: this.visible,
      speed: this.speed,
    };
  }
}
/** Scale presentation cadence from the pack; no event is added, removed or re-ordered. */
export function battleEventDuration(kind: BattleEvent['kind'], base: number): number {
  const weight: Record<BattleEvent['kind'], number> = {
    'combat-started': 0.5,
    'synergy-activated': 0.42,
    'bean-activated': 0.65,
    'turn-started': 0.24,
    'mana-exhausted': 0.4,
    healed: 0.58,
    'burn-tick': 0.44,
    'spell-cast': 1,
    'combat-finished': 0.65,
  };
  return Math.max(100, Math.round(base * weight[kind]));
}
