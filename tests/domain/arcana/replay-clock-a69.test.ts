import { describe, it, expect } from 'vitest';
import {
  ReplayClock,
  battleEventDuration,
} from '../../../src/arcana/presentation/motion/replay-clock';

describe('A69 presentation clock over a committed log', () => {
  it('preserves an event fraction through pause and resume', () => {
    const c = new ReplayClock([650, 650]);
    c.play(0);
    c.tick(200);
    c.pause(200);
    expect(c.snapshot().progress).toBeCloseTo(200 / 650);
    c.tick(5000);
    expect(c.snapshot().cursor).toBe(0);
    c.play(5000);
    c.tick(5450);
    expect(c.snapshot().cursor).toBe(1);
  });
  it('changes speed without starting the event again', () => {
    const c = new ReplayClock([650, 650]);
    c.play(0);
    c.tick(200);
    c.setSpeed(2, 200);
    c.tick(425);
    expect(c.snapshot()).toMatchObject({ cursor: 1, speed: 2 });
  });
  it('does not consume hidden time or resume a user-paused replay', () => {
    const c = new ReplayClock([650, 650]);
    c.play(0);
    c.tick(200);
    c.setVisible(false, 200);
    c.tick(30000);
    c.setVisible(true, 30000);
    expect(c.snapshot().progress).toBeCloseTo(200 / 650);
    c.tick(30100);
    expect(c.snapshot().progress).toBeCloseTo(300 / 650);
    c.pause(30100);
    c.setVisible(false, 30200);
    c.setVisible(true, 40000);
    c.tick(41000);
    expect(c.snapshot().progress).toBeCloseTo(300 / 650);
  });
  it('skips idempotently and cannot play beyond the stored log', () => {
    const c = new ReplayClock([650, 650]);
    c.play(0);
    c.tick(200);
    c.skip();
    c.skip();
    c.play(999);
    c.tick(9999);
    expect(c.snapshot()).toMatchObject({ cursor: 2, progress: 1, playing: false });
  });
  it('rejects invalid durations and bounds negative/nonmonotonic time', () => {
    expect(() => new ReplayClock([0])).toThrow();
    const c = new ReplayClock([650]);
    c.play(20);
    c.tick(10);
    expect(c.snapshot().progress).toBe(0);
  });
  it('uses finite distinct choreography windows without changing events', () => {
    expect(battleEventDuration('spell-cast', 650)).toBe(650);
    expect(battleEventDuration('turn-started', 650)).toBeLessThan(250);
    expect(battleEventDuration('healed', 650)).toBeGreaterThan(250);
  });
});
