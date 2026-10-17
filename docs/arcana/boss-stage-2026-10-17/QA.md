# A71 · Registro técnico y límites

## Referencia

Base `dffd6ae`, código A70 validado previamente en CI38977202497. Preparación, gesto libro/cuenco y cierre anteriores se conservan en `../boss-increment-2026-10-16/evidence/linux/`. No sobrescribirlos con imágenes A71. Cuatro PNG de escritorio no equivalen a auditoría visual móvil.

## Ejecuciones locales sin navegador

- `npx --no-install vitest run tests/domain/arcana/boss-supplies-a71.test.ts`: RED por módulo ausente; GREEN2/2 tras implementación.
- Staging: RED6/6 antes de implementación; GREEN con6A71+5históricos. Actor: RED por función ausente y GREEN4A71+compatibilidad previa. No son observaciones de personas.
- `npm run typecheck`: primer chequeo detectó narrowing de fixture QA, corregido; siguiente correcto. Build también ejecuta tipos.
- `npm test`: primera ejecución549correctos/4fallidos por expectativa histórica del rol de figura de cierre; se actualizó únicamente al nuevo rol de presentación `boss.circe.figure`. Después554/554correctos en78archivos.
- `npm run build`: correcto, validación de packs completa, advertencia conocida de chunk>500kB. Primera build antes de compresión final:15.346.006B distribuidos; no se presenta como tamaño final.
- `npm run verify:arcana:build`: correcto, I1excluido; dualprivado. No certifica permisos de distribución.
- Detector Impeccable ejecutado una vez sobre cinco componentes cambiados: salida `[]`. No acredita estética, lectura móvil ni accesibilidad completa.
- `git diff --check`: correcto.

No se abrió navegador, capturó escritorio, perfiló GPU ni ejecutó WebKit en el Mac. No se cambió configuración global o dependencias. Las muestras CPU son composiciones, no capturas del juego ni prueba de movimiento.

## CI preparada, todavía no ejecutada al registrar

`ARCANA_CAPTURE_A71=1 npx playwright test --config playwright.boss-style-a71.config.ts`.

Guard Linux/lock común/watchdog/1worker/retries0 sin vídeo/trazas/capturas automáticas.48casos registrados:24recorridos autoritativos ESEN×packs×3tamaños×2motores,18fixtures y1muestra perf;5skips intencionales del muestreo fuera de su único proyecto. Máximo6PNG seleccionados explícitos: preparación escritorio, móvil por pack, actor por pack y cierre. Fixtures no son contenido de campaña ni cuentas habituales.

Se conservan regresiones A70/A69/Halloween/general/A67/A63/A66/intenciones/PWA y PG/Redis reales en el workflow serial. No elevar configuración a resultado ejecutado. Actualizar esta sección y REPORT al terminar CI e inspeccionar PNG.

## Cobertura y límites

A71 enfoca consulta/preparación/cancelación/foco, stock y borrador, actor pausado/swap/omisión/fallo de brazo y recursos. La regresión A70 comprueba variantes de composición/resultado, ocultación/2x/reducido/import/renderer y autoridad. No se cambia servidor, dominio, contenido económico o esquema; se verificará su conservación y persistencia mediante regresiones reales, sin afirmar que fixtures prueben atomicidad.

Pendientes independientes: comprensión/personalidad humana, lector hablado y dispositivo físico. Una captura de pose no valida su coreografía; las aserciones de fase/transformación y reloj se distinguen de evaluación perceptiva. Un intervalo rAF no es frame time GPU, ni limpieza de contadores propios demuestra ausencia global de fugas.
