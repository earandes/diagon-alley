import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
if (process.platform !== 'linux') throw Error('Perfil gráfico comparativo solo en Linux.');
const cwd =
  process.env.A67_PERFORMANCE_VARIANT === 'baseline'
    ? resolve('.a66-performance-reference')
    : process.cwd();
const child = spawn(
  process.execPath,
  [
    resolve('node_modules/vite/bin/vite.js'),
    'preview',
    '--host',
    '127.0.0.1',
    '--port',
    '5458',
    '--strictPort',
    '--mode',
    'arcana',
  ],
  { cwd, env: process.env, stdio: 'inherit' },
);
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => child.kill(signal));
child.on('exit', (code) => {
  process.exitCode = code ?? 1;
});
