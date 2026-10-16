import { defineConfig } from 'vitest/config';
import { arcanaPwa } from './tools/arcana/pwa-build.ts';
import { localAuthority } from './tools/arcana/local-authority-plugin.ts';
export default defineConfig(({ mode }) => ({
  base: './',
  publicDir: false,
  server: { watch: { ignored: ['**/test-results-arcana*/**', '**/.playwright-cli/**'] } },
  test: { include: ['tests/domain/**/*.test.ts'] },
  plugins: [arcanaPwa(), ...(mode === 'arcana' ? [localAuthority()] : [])],
}));
