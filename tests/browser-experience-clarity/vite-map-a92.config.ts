import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  base: '/',
  publicDir: false,
  build: {
    outDir: 'test-results/a92-map-fixture-build',
    emptyOutDir: true,
    rollupOptions: { input: fileURLToPath(new URL('./map-preparation-a92.html', import.meta.url)) },
  },
});
