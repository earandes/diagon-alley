# A76 · Registro de validación

## Candidatos

- Baseline: ff23f580d9d3989abc9918d7b5bc8328d9e83b62 (A75).
- Primer candidato:34b22def778f5de3619e62f992d2b745ed0d8f62, PR7 sobre A75. CI39068985629: A76 con3casos correctos,1fallido y56noejecutados/omitidos al detenerse; fallo de fixture `content.table.version`, no se acredita recorrido completo. Ejecución cancelada deliberadamente tras conservar el artefacto para no continuar baterías sobre candidato sustituido.
- Segundo candidato:a542ef951b51f37cd45f1295cfb4974e972f591d / CI39069503604. A76 volvió a detenerse con3casos correctos/1fallido/56restantes: fixture miraba la visibilidad del aviso Guardando como si ya hubiese ocurrido commit+pérdida de respuesta. Su aserción prematura provocó teardown y Response disposed secundario. Se corrige sincronización por resultado capturado y aria-busy=false, sin retraso fijo ni relajar la aceptación. Se conserva ese intento cancelado.
- Tercer candidato:3da3f582447a19266f5f8d157c1721978b308073 / CI39069825162. Cinco casos correctos, incluido recorrido completoES con recarga/cookie perdida, y un fallo en recorridoEN: lector del buzón encontró JSON aún incompleto. Resultado parcial, no batería superada. Se publica ahora el archivo mediante rename atómico después de escribir, y una prueba de IO retenido comprueba que un lector concurrente no ve un mensaje parcial. Se canceló el candidato sustituido después de conservar evidencia.
- Cuarto candidato:3f6e1223d7b9ada6cae55f50f7b2627f2c35100b / CI39070225878. Tipos/build/unit/integración/backup correctos y A76:30correctos/30omisiones deliberadas,0fallos,0flaky. Inspección de tres PNG realizada; las regresiones llegaron hastaA66 y la tanda se canceló por55min durante intenciones. Checkoutmerge bc8c166ab38132c7c0e8e471a7206973c25dd151 con árbol idéntico c755d7debc31728151af02629b2c08c024a20cb6.

## Local sin navegador

613unitarias y96integraciones PostgreSQL/Redis en primer ciclo. Tras nuevas correcciones, repetir las comprobaciones afectadas; no atribuir la ejecución anterior al candidato posterior. Build/tipos/scanner correctos antes de esa segunda tanda.

Backup/restauración real:15tablas/16filas,34109B efímeros, digest3025dea8ac8f8a8b22e291dcc4a667756ef4bc23f3b7fd5684d4f978ad26c137; prueba KDF de credencial restaurada. Reinicio real aislado:PASS, mismas2copias/3receipts/run tras reiniciar PG/Redis y volver a entrar después de perder sesiones. Comandos, hashes y fallos de instrumento previos en BACKUP.md. No se alteraron contenedores/bases/partida habituales.

`npm run test:browser:check`:allowedtrue, carga3.39/11cores, WindowServer35.1MiB/0%CPU en esa muestra. Es preflight, no una ejecución gráfica ni garantía de seguridad del sistema. Ningún navegador local A76.

## Avance de regresiones del candidato final

CI39070225878:618unitarias y98integraciones PostgreSQL/Redis correctas. Navegador: A76 30correctas/30omisiones, A75 113/175, jefeA70/A71/A73 103/35, Halloween12, movimiento19/5, E2E56, progresión20, gameplay16 y cabecera/Pactos20. Son389correctas/245omisiones explícitas de proyectos/scopes, ningún fallo antes del límite. Intenciones empezó8casos sin resumen final; PWA y performanceA67 no se ejecutaron. [Resumen sin secretos](evidence/linux/ci-full-summary.json).

## Límites y cobertura posterior
CI39070225878 agotó55min durante intencionesA65 después de pasar hasta A66 incluido. No es una batería global superada. Se utiliza la fase tail ya existente para completar la cola en otra tanda serial; se ha restaurado full al cerrar, demostrando equivalencia del código. Inspección seleccionada ya realizada. ColaCI39074119331 superada. Dispositivo físico, lector hablado, gestor de contraseñas real, observación humana, correo externo y entorno público sin probar.

## Límite total de CI y continuación explícita

A las22:11UTC del17octubre, CI39070225878 terminó cancelled por duración total55min; no se sube el presupuesto ni modifica guard/lock/watchdog/workers/retries. IntencionesA65 quedó interrumpida; PWA y referencia/performanceA67 no tienen resultado de esa ejecución. A75, jefeA70/A71/A73, HalloweenA68, movimientoA69, E2E, progresiónA67, gameplayA63 y cabecera/PactoA66 sí terminaron correctamente.

La continuación usa `tools/verification/a75-phase.json` con `tail`, una selección que ya existía en A75. Conserva build/tipos/unit/integración/backup/A76 y vuelve a cubrir las regresiones de cola; evita repetir las grandes baterías iniciales. No es reintento automático del caso cancelado, ni convierte el primer run en success. Al cerrar se restaura full y se comprueba equivalencia de fuentes/contratos/tests con el candidato3f6; no se deja una selección parcial como configuración ordinaria.

Continuación: [CI39074119331](https://github.com/earandes/diagon-alley/actions/runs/39074119331), head `88eaa44092fc0b4652a21b62d00f63ebb48c2e66`; diff contra3f6 únicamente `tools/verification/a75-phase.json` full→tail. Aplicación/pruebas/contratos sin cambios. Terminado SUCCESS; checkout7fe58d38cc780d4afaaa7eb8ebd96e1c49162412, árbol973ccf9f46296ddb6fb604610107dba282e39010 idéntico al head.

## Comandos y resultados sobre3f6e122 / CI39070225878

| Comando | Resultado de esa ejecución |
| --- | --- |
| `npm ci --no-fund --no-audit` | Correcto; lockfile existente, sin dependencia añadida |
| `npm run typecheck` | Correcto |
| `npm run validate:content` | Correcto |
| `npm test` | 618correctas |
| `npm run test:integration` | 98correctas, PostgreSQL/Redis de serviciosCI reales |
| `npm run build` | Correcto |
| `node tools/verification/verify-accounts-backup-a76.mjs` | Backup/restauración reales correctos, herramientas nativasLinux |
| `npm run verify:arcana:build` | Correcto |
| `ARCANA_CAPTURE_A76=1 npx playwright test --config playwright.accounts-a76.config.ts` | 30correctas/30omisiones explícitas |
| `ARCANA_CAPTURE_A75=1 npx playwright test --config playwright.experience-a75.config.ts` | 113correctas/175omisiones explícitas |
| `ARCANA_CAPTURE_A70=1 npx playwright test --config playwright.boss-a70.config.ts` | 103correctas/35omisiones explícitas; incluyeA71/A73 |
| `npx playwright test --config playwright.seasonal-a68.config.ts` | 12correctas |
| `ARCANA_CAPTURE_A69=1 npx playwright test --config playwright.motion-a69.config.ts` | 19correctas/5omisiones explícitas |
| `ARCANA_TRIAL_COMPILED=1 npm run test:e2e -- --project chromium --project webkit --reporter=line,github` | 56correctas |
| `npx playwright test --config playwright.progression-a67.config.ts --project chromium-a67 --project webkit-a67` | 20correctas |
| `npx playwright test --config playwright.gameplay-a63.config.ts` | 16correctas |
| `npx playwright test --config playwright.header-pact-a66.config.ts` | 20correctas |
| `npx playwright test --config playwright.intentions-a65.config.ts` | Interrumpido por límite global55min; no se cuenta como superado |

PG16/Redis7 fijados por digest en el workflow, Node24, Linux, un worker gráfico, cero reintentos, guard/bloqueo/watchdog. No son cuentas personales o tiempos humanos. La continuación88eaa44 usa el mismo workflow con fase tail existente; su resumen final y comparación se añaden abajo.

## Resultado final de la continuación

[CI39074119331](https://github.com/earandes/diagon-alley/actions/runs/39074119331) **SUCCESS**, head88eaa44092fc0b4652a21b62d00f63ebb48c2e66, checkout7fe58d38cc780d4afaaa7eb8ebd96e1c49162412 y árbol973ccf9f46296ddb6fb604610107dba282e39010. Tipos/contenido/build/scanner/backup correctos;618unitarias/98integraciones reales. A76 30correctas/30omisiones; A75-tail24; progresión20; gameplay16; A66 20; intenciones8; PWA12; performancebaseline1/current1. Son132casos gráficos correctos en esta tanda y30omisiones deliberadas. Muchos casos se repiten con la primera: no se suman como cobertura única. [Resumen](evidence/linux/ci-tail-summary.json).

Los comandos finales completados son `npx playwright test --config playwright.intentions-a65.config.ts`, `npm run test:pwa -- --project chromium --project webkit`, `node tools/verification/build-a66-reference.mjs`, `A67_PERFORMANCE_VARIANT=baseline npx playwright test --config playwright.performance-a67.config.ts` y el mismo comando con `current`. No hubo reintentos automáticos, cambios de worker o relajación del guard. La selecciónfull se restaura en el cierre y se demuestra que la diferencia respecto a3f6 contiene exclusivamente documentación/evidencia. El último commit documental no ejecuta otra batería: prueba equivalente, no SHA falsamente acreditado.

## Rendimiento: resultados y límites

[Baseline](evidence/linux/performance-a67-baseline.json) y [current](evidence/linux/performance-a67-current.json), una muestraChromium/Linux1280×900. La referencia se reconstruye desdeA66: **no es un antes/después aislado de A76 ni una referencia A75**. Incluye red, polling del runner, imágenes visibles/decodificadas y final de animaciones finitas. Se conservan cifras desfavorables y no se atribuye causalidad a identidad con esta muestra.

| Momento | BaselineA66 → actual, ms | Lectura permitida |
| --- | --- | --- |
| Abrir Pacto frío, utilizable | 96 →92,3 | Diferencia de esta muestra; cachés según contrato del instrumento |
| Elegir candidato0, utilizable | 30,7 →61,6 | Resultado desfavorable conservado |
| Elegir candidato0, máximorAF | 50,1 →83,3 | Intervalo rAF, no GPU; sin diagnóstico causal |
| Confirmar Pacto, utilizable | 208,2 →342,7 | Incluye red: advance56,5→67,8; state31,1→63,2 |
| Aperturas cálidas, asentamiento | 945,3/945,8 →437,9/461,8 | Misma definición temporal del instrumento, no tiempo humano |
| Taller, utilizable/asentado | 83,9/480,7 →93,7/247,1 | Resultado mixto, no mejora universal |
| Forjar | 23,2 →21,2 | Operación de la fixture con reglas vigentes |

Los máximosrAF actuales varían16,7–83,3ms. Este instrumento no calculaP95, tiemposGPU o memoria residente; sus ventanas cortas no acreditan presupuesto sostenido≤20ms, ausencia global de fugas, hardware físico o rendimiento universal. A76 no modifica renderer/assets/replay; no se ocultan unidades ni se desplaza una espera para cambiar cifras. La investigación causal de los picos conocidos permanece separada de la entrega de identidad.
