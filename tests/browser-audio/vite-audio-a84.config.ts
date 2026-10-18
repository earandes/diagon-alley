import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  base: '/',
  publicDir: false,
  build: {
    outDir: 'test-results/audio-a84-build',
    emptyOutDir: true,
    rollupOptions: { input: fileURLToPath(new URL('./audio-a84.html', import.meta.url)) },
  },
});
