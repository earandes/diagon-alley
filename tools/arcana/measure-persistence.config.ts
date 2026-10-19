import { defineConfig } from 'vitest/config';

// Explicit non-graphical diagnostic, outside ordinary test discovery. Never a load test of accounts.
export default defineConfig({
  test: {
    include: ['tools/arcana/measure-persistence.test.ts'],
    fileParallelism: false,
    maxWorkers: 1,
    retry: 0,
    testTimeout: 120_000,
    hookTimeout: 20_000,
  },
});
