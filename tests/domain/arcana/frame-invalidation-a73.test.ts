import { expect, it, vi } from 'vitest';
import { FrameInvalidation } from '../../../src/arcana/presentation/scenes/frame-invalidation';
it('renders a burst of resource arrivals once and accepts the next burst', () => {
  const draw = vi.fn();
  let next: () => void = () => {};
  const queue = new FrameInvalidation(
    (callback) => {
      next = callback;
      return 1;
    },
    () => {},
    draw,
  );
  for (let i = 0; i < 12; i++) queue.request();
  expect(draw).not.toHaveBeenCalled();
  next();
  expect(draw).toHaveBeenCalledTimes(1);
  queue.request();
  next();
  expect(draw).toHaveBeenCalledTimes(2);
});
it('a pause flushes the latest frame and teardown cancels deferred drawing', () => {
  const draw = vi.fn();
  const tasks = new Map<number, () => void>();
  let id = 0;
  const queue = new FrameInvalidation(
    (cb) => {
      tasks.set(++id, cb);
      return id;
    },
    (n) => {
      tasks.delete(n);
    },
    draw,
  );
  queue.request();
  queue.flush();
  expect(draw).toHaveBeenCalledTimes(1);
  expect(tasks.size).toBe(0);
  queue.request();
  queue.cancelPending();
  for (const cb of tasks.values()) cb();
  expect(draw).toHaveBeenCalledTimes(1);
});
