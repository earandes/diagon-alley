import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  base: '/',
  publicDir: false,
  build: {
    outDir: 'test-results/a89-fixture-build',
    emptyOutDir: true,
    rollupOptions: { input: fileURLToPath(new URL('./priorities-a89.html', import.meta.url)) },
  },
});
