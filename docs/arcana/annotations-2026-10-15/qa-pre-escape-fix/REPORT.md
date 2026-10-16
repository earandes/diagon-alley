# QA final serial · A59

Build existente congelado; ninguna compilación entre suites. El integrador detuvo inferencia, otros navegadores y benchmarks. Contextos/cuentas/namespaces nuevos y puertos propios; nunca5194. Los cuatro grupos se ejecutaron secuencialmente.

| Grupo | Resultado | Tiempo | Evidencia |
| --- | --- | --- | --- |
| Apertura fría completa, omitir, reducido y contexto2D ausente, ES/EN y dos motores |16/16|53,7s|[Log](opening/browser.txt), [métricas resumidas](opening/summary.json)|
| Rediseño compilado, swap, sabores desde uso confirmado y persistencia |16/16|39,0s|[Log](redesign/browser.txt), [capturas](redesign/captures/)|
| PWA, offline, actualización del worker y respuesta de compra perdida |12/12|13,0s|[Log](pwa/browser.txt), [hash antes](pwa/hashes-before.txt), [hash después](pwa/hashes-after.txt)|
| Familia30personajes,90WebP decodificados, swap y tres encuadres de revelación |4/4|7,4s|[Log](art/browser.txt), [capturas y URLs efectivas](art/captures/)|

**48casos distintos correctos, sin reintentos en estos cuatro grupos.** No incluye los76casos de regresión histórica,16casos focales A59 ni comprobaciones de otros informes. Arte usa un harness visual explícito: sus cartas no se conceden como recompensas.

## Apertura con el build actual

Medición del clic de apertura hasta el resultado estático (~4,2s), sin precalentamiento ni espera añadida. Las trazas JSON completas conservan frames, llamadas de contexto y tareas desde la entrada; `summary.json` incluye las URLs WebP observadas sin repetir datos inline de SVG.

| Motor | Idioma | FPS observados | Máximo entre frames | P95 | Long tasks durante apertura |
| --- | --- | --- | --- | --- | --- |
| Chromium | ES |60,00|16,8ms|16,8ms|0 observadas|
| Chromium | EN |60,00|16,8ms|16,7ms|0 observadas|
| WebKit | ES |59,80|35ms|19ms|API no soportada|
| WebKit | EN |59,79|33ms|19ms|API no soportada|

Canvas2D realizó194draws en Chromium y192en WebKit. Chromium tampoco registró long tasks en las fases anteriores a pulsar Abrir; no se observa espera desplazada en estas muestras. El baseline comparable anterior A58 (antes de corregir la apertura) registraba216,7–233,2ms máximos en Chromium; A58 corregido16,8ms, y el build A59 actual conserva16,8ms. No se reutilizan estas cifras como rendimiento de móvil físico o garantía de cada hardware/rareza.

Los casos de apertura conservan una única operación confirmada tras omitir, reducir movimiento, fallback, recarga y cambio de idioma. Las suites compiladas verifican estado/saldos/receipts exactos y swap de presentación; PWA verifica que la respuesta perdida se recupera sin otro POST. No cambian precios, pesos o azar para ejecutar estos recorridos.

## Integridad al cierre

La prueba de actualización PWA modificó temporalmente `dist/service-worker.js` dentro de su `try/finally`; ambos motores terminaron correctamente y se restauró. Los SHA antes/después de worker e index son idénticos. Se compararon526archivos (todo `src/arcana` más index/worker): **cero cambios durante QA**. [Comparación](fingerprints-comparison.json), [firma de todo dist al cierre](dist-final-sha256.json).

- `dist/index.html`: `2cac0ebb4311abfe817d832f59c8b7ab50cde2f544fb08f20f697378d23c7f8a`
- `dist/service-worker.js`: `f927a29bbe47308794948da96fc7e4b087d3a575210663bfbe968890d0c31bb8`

El único cambio de test de arte permite indicar `ARCANA_ART_EVIDENCE_ROOT` y guardar las90URLs observadas por motor/idioma. A58 queda intacto. No hubo publicación, uso de la partida del propietario, prueba con usuarios o instalación física de PWA.
