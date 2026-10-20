import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  base: '/',
  publicDir: false,
  build: {
    outDir: 'test-results/a92-collection-fixture-build',
    emptyOutDir: true,
    rollupOptions: {
      input: fileURLToPath(new URL('./collection-supplies-a92.html', import.meta.url)),
    },
  },
});
