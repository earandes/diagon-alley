import { castProfile, confirmedBondFor, type CastProfile } from '../motion/cast-profile';
import type { Combat } from '../../domain/combat/engine';
import type { PlaybackPosition } from '../motion/replay-clock';
export type EffectSound =
  | `cast-${CastProfile}`
  | 'cast-fire'
  | 'cast-alchemy'
  | 'cast-shadows'
  | 'cast-neutral'
  | 'impact'
  | 'miss'
  | 'heal'
  | 'burn';
const phaseOrder = { anticipation: 0, flight: 1, impact: 2, settle: 3, finished: 4 };
/** Cues consume the existing clock and confirmed log, never invent combat outcomes. */
export class BattleAudioTrack {
  private lastCursor = -1;
  private lastPhase = -1;
  constructor(private readonly combat: Combat) {}
  consume(position: PlaybackPosition): readonly EffectSound[] {
    const phase = phaseOrder[position.phase];
    if (
      position.cursor < this.lastCursor ||
      (position.cursor === this.lastCursor && phase <= this.lastPhase)
    )
      return [];
    this.lastCursor = position.cursor;
    this.lastPhase = phase;
    if (!position.playing || !position.visible || position.phase === 'finished') return [];
    const event = this.combat.events[position.cursor];
    if (event?.kind === 'spell-cast') {
      if (position.phase === 'flight') {
        const actor = [...this.combat.input.player, ...this.combat.input.rival].find(
          (u) => u.id === event.actorId,
        );
        const profile =
          actor && castProfile(actor.wizardId, confirmedBondFor(this.combat, actor.id));
        return [profile ? `cast-${profile}` : `cast-${actor?.affinity ?? 'neutral'}`];
      }
      if (position.phase === 'impact')
        return [event.missed ? 'miss' : event.guarded ? 'cast-creatures' : 'impact'];
    }
    if (position.phase === 'impact' && event?.kind === 'healed' && event.amount > 0)
      return ['heal'];
    if (position.phase === 'impact' && event?.kind === 'burn-tick' && event.damage > 0)
      return ['burn'];
    return [];
  }
}
