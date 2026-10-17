import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  base: '/',
  publicDir: false,
  build: {
    outDir: 'test-results/a75-fixture-build',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        battle: fileURLToPath(new URL('../browser-boss/boss-a70.html', import.meta.url)),
        preparation: fileURLToPath(new URL('./preparation-a75.html', import.meta.url)),
      },
    },
  },
});
