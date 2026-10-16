import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
/** Compiled fixture entry, excluded from the application artifact. */
export default defineConfig({
  base: '/',
  publicDir: false,
  build: {
    outDir: 'test-results/boss-a70-build',
    emptyOutDir: true,
    rollupOptions: { input: fileURLToPath(new URL('./boss-a70.html', import.meta.url)) },
  },
});
