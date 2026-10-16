import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/integration/arcana/**/*.test.ts'],
    fileParallelism: false,
    testTimeout: 10_000,
    hookTimeout: 20_000,
  },
});
