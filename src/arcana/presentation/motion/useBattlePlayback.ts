import { useCallback, useEffect, useRef, useState } from 'react';
import type { BattleEvent } from '../../domain/combat/engine';
import { ReplayClock, battleEventDuration } from './replay-clock';

/** One clock drives the DOM event cursor and renderer phase. React publishes only phase boundaries. */
export function useBattlePlayback(
  events: readonly BattleEvent[],
  eventMs: number,
  reduced: boolean,
) {
  // Timings freeze for this confirmed log; changing theme must not restart an event.
  const initialDuration = useRef(eventMs);
  const [clock] = useState(
    () => new ReplayClock(events.map((e) => battleEventDuration(e.kind, initialDuration.current))),
  );
  const [position, setPosition] = useState(() => clock.snapshot());
  const stamp = useRef('');
  const publish = useCallback(
    (force = false) => {
      const next = clock.snapshot();
      const key = [next.cursor, next.phase, next.playing, next.visible, next.speed].join(':');
      if (force || key !== stamp.current) {
        stamp.current = key;
        setPosition(next);
      }
    },
    [clock],
  );
  useEffect(() => {
    clock.setVisible(!document.hidden, performance.now());
    if (reduced) clock.skip();
    else clock.play(performance.now());
    publish(true);
    const visibility = () => {
      clock.setVisible(!document.hidden, performance.now());
      publish(true);
    };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      document.removeEventListener('visibilitychange', visibility);
      clock.pause(performance.now());
    };
  }, [clock]);
  useEffect(() => {
    if (reduced) {
      clock.skip();
      publish(true);
    }
  }, [reduced, clock, publish]);
  useEffect(() => {
    if (!position.playing || !position.visible || reduced) return;
    let raf = 0,
      cancelled = false;
    const draw = (now: number) => {
      if (cancelled) return;
      clock.tick(now);
      publish();
      const next = clock.snapshot();
      if (next.playing && next.visible) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [clock, position.playing, position.visible, reduced, publish]);
  const setPlaying = (value: boolean | ((current: boolean) => boolean)) => {
    const next = typeof value === 'function' ? value(clock.snapshot().playing) : value;
    if (next && !reduced) clock.play(performance.now());
    else clock.pause(performance.now());
    publish(true);
  };
  const setSpeed = (value: 1 | 2 | ((current: 1 | 2) => 1 | 2)) => {
    clock.setSpeed(
      typeof value === 'function' ? value(clock.snapshot().speed) : value,
      performance.now(),
    );
    publish(true);
  };
  const skip = () => {
    clock.skip();
    publish(true);
  };
  return { ...position, clock, setPlaying, setSpeed, skip };
}
