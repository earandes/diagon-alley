import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
/** Declared QA entries only; excluded from application build. */
export default defineConfig({
  base: '/',
  publicDir: false,
  build: {
    outDir: 'test-results/boss-style-a71-build',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        battle: fileURLToPath(new URL('../browser-boss/boss-a70.html', import.meta.url)),
        preparation: fileURLToPath(new URL('./boss-style-a71.html', import.meta.url)),
      },
    },
  },
});
