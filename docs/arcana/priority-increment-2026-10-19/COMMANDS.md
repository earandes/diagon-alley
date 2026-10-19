# Comandos reproducibles y alcance A89

## Comprobaciones no gráficas

Desde la raíz del proyecto, Node24 y dependencias fijadas por lock. No abrir navegador para estos comandos.

```sh
npm run typecheck
npm run validate:content
npm run validate:skin
npm test
npm run test:integration
npm run build
npm run verify:arcana:build
python3 tools/arcana/economy-study-a89.py --self-test
git diff --check
```

Integración requiere PostgreSQL/Redis saludables del compose del proyecto. Usar únicamente jugadores/esquemas/namespaces de ensayo propios. No parar servicios o sesiones ajenas. El resultado real por SHA está en QA; esta lista no equivale a nuevas ejecuciones. La batería completa del candidato9b2ea61 ejecuta esos comandos en Linux, con751unitarias y120integraciones, además de copia/restauración con datos ficticios. El self-test económico y el diagnósticoPG tienen sus ejecuciones locales no gráficas separadas.

El benchmarkPG es opt-in, tres observaciones por escala y salida nueva; comando y limitaciones en PM01-PM14. Repetirlo no es necesario si el adaptador medido conserva su SHA256. El modelo económico exige entrada/modelo versionados; reproducción en ECONOMY, sin operación del juego o cambio de economía.

## Navegador: exclusivamente Linux para estas baterías

El workflow original `checks.yml` ejecuta las suites en serie; no hay cambio de workflow, guard, lock, worker o reintentos. A89 se añade como proyectos separados a la configuración de cuentas ya invocada.

```sh
ARCANA_CAPTURE_A76=1 npx playwright test --config playwright.accounts-a76.config.ts
```

La entrada aislada equivalente de A89 está disponible para ensayos Linux acotados mediante `playwright.priorities-a89.config.ts`; no ejecutarla simultáneamente con otra batería. El workflow completo cubre además cuentas/bienvenida/A75/jefe/Halloween/movimiento y un job dependiente de regresiones, con sus comandos originales. No se reclama una matriz que el workflow no invoque. Cinco capturasA89 seleccionadas más una del caso ARCANA que falló; sin vídeo/traza automática.

En el Mac solo se permite la excepción original `npm run test:browser:local`, no utilizada en este incremento; `npm run test:browser:check` es preflight sin navegador. No ejecutar las configuraciones anteriores en macOS ni eludir su rechazo.

## Revisar evidencia sin generar carga gráfica

Los PNG proceden de artefactos Linux; abrir esos archivos existentes no crea una nueva captura del Mac. JSON condensados conservan resultados, SHA y límites; las muestras rAF completas se archivan comprimidas sin pérdida, con hashes antes/después. No confundir una imagen con validación de movimiento, una fixture con una colección ganada o emulación con dispositivo físico.
