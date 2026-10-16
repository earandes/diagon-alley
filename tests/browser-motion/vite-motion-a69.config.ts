import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

// Dedicated compiled QA entry, never part of the application build or its authority.
export default defineConfig({
  base: '/',
  publicDir: false,
  build: {
    outDir: 'test-results/motion-a69-build',
    emptyOutDir: true,
    rollupOptions: {
      input: fileURLToPath(new URL('./motion-a69.html', import.meta.url)),
      output: {
        manualChunks: (id) => (id.includes('/node_modules/gsap/') ? 'gsap-a69' : undefined),
      },
    },
  },
});
