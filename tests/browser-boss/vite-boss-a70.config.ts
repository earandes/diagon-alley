import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
/** Compiled fixture entry, excluded from the application artifact. */
export default defineConfig({
  base: '/',
  publicDir: false,
  build: {
    outDir: 'test-results/boss-a70-build',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        battle: fileURLToPath(new URL('./boss-a70.html', import.meta.url)),
        generic: fileURLToPath(new URL('../browser-motion/motion-a69.html', import.meta.url)),
        preparation: fileURLToPath(
          new URL('../browser-boss-style/boss-style-a71.html', import.meta.url),
        ),
      },
    },
  },
});
