# A85 · Comandos y alcance de comprobación

Node 24, dependencias del lockfile existente. Los resultados y SHA definitivos se registran en QA y en la evidencia de CI; esta lista no convierte una prueba escrita en ejecutada.

## Local, sin navegador

- `npm run typecheck`: aplicación, tests y worker.
- `npm run build`: validación del pack, tipos y Vite; conserva el aviso de chunk JS grande.
- `npm test`: 662 casos en 103 archivos (candidato conjunto A85+A86) tras las correcciones de mapa.
- `npm run test:integration`: 103 casos en 17 archivos con PostgreSQL/Redis reales, cuentas ficticias aisladas. Repetido en CI para el candidato completo.
- `npm run verify:arcana:build`: scanner del distribuido.
- `node tools/verification/simulate-houses-a85.mjs`: 1152 muestras del motor y casos de uso, 32 semillas emparejadas por grupo; transacción en memoria expresamente declarada.
- `npm run test:browser:check`: preflight original, sin abrir navegador. No se ejecutó la excepción gráfica local.

La comprobación exacta de los 2900 tickets y la equivalencia normal/encantado usan Vite SSR sin listener HTTP ni navegador. Código reproducible en PROBABILITY y COMPATIBILITY. La compilación independiente del harness QA se realizó con `npx vite build --config tests/browser-motion/vite-motion-a69.config.ts`; no ejecuta el renderer en un navegador.

## Exclusivamente CI Linux

Workflow original `.github/workflows/checks.yml`, `phase=full`, una batería cada vez, un worker, bloqueo/preflight/watchdog y cero reintentos de suite. Las protecciones no se modificaron.

1. Tipos, contenido, unidad, integración, build, backup/restauración y scanner.
2. Cuentas A76, bienvenida A82, correcciones A78, entrada A79, estilo A80, símbolos A81.
3. Experiencia A75, jefe A70/A71/A73, Halloween A68, movimiento A69 con audio A84 y casas/encantado A85.
4. Solo si el primer job pasa: e2e, progresión A67, preparación/cierre A63, cabecera/Pacto A66, intenciones A65, PWA y rendimiento A67 anterior/actual.

Las capturas están seleccionadas explícitamente por las banderas originales; no hay vídeo/traza automática o matriz de capturas local. Los resultados de presentación A85 corresponden a fixtures declaradas; no sustituyen los recorridos conectados de otros contratos ni la persistencia SQL.

## Lectura del resultado

- `gh run view 39167929972 --json status,conclusion,jobs`: estado real, sin asumir éxito por haber avanzado a otra etapa.
- La evidencia `results.json`, donde existe, y los contadores del log se conservan sin sumar tests saltados a los ejecutados.
- Las CI fallidas anteriores y sus causas están en QA. La cancelación previa a navegador no es fallo de producto ni validación superada.
- El SHA de checkout de una PR puede ser un merge sintético distinto del SHA fuente. Se registran ambos. Una actualización solo documental se acredita por igualdad de objetos del código probado, sin atribuirle otra batería.

Comprensión, diversión, espectacularidad percibida, lector hablado y dispositivo físico: pendientes, fuera de lo demostrado por estos comandos.
