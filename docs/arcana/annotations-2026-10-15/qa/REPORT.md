# QA final serial · A59

Build corregido después del fix de Escape, congelado mediante `build-escape-final.txt` (`index-D1oX8s-K.js`); ninguna compilación entre estas suites. El integrador detuvo inferencia, otros navegadores y benchmarks. Contextos/cuentas/namespaces nuevos y puertos propios; nunca 5194. Los cuatro grupos se ejecutaron secuencialmente.

| Grupo                                                                                | Resultado | Tiempo | Evidencia                                                                                         |
| ------------------------------------------------------------------------------------ | --------- | ------ | ------------------------------------------------------------------------------------------------- |
| Apertura fría completa, omitir, reducido y contexto 2D ausente, ES/EN y dos motores  | 16/16     | 54,1 s | [Log](opening/browser.txt), [métricas resumidas](opening/summary.json)                            |
| Rediseño compilado, swap, sabores desde uso confirmado y persistencia                | 16/16     | 39,8 s | [Log](redesign/browser.txt), [capturas](redesign/captures/)                                       |
| PWA, offline, actualización del worker y respuesta de compra perdida                 | 12/12     | 12,8 s | [Log](pwa/browser.txt), [hash antes](pwa/hashes-before.txt), [hash después](pwa/hashes-after.txt) |
| Familia de 30 personajes, 90 WebP decodificados, swap y tres encuadres de revelación | 4/4       | 7,4 s  | [Log](art/browser.txt), [capturas y URLs efectivas](art/captures/)                                |

**48 casos distintos correctos sobre el artefacto corregido, sin reintentos en estos cuatro grupos.** La QA anterior de esos mismos48 casos se conserva en `qa-pre-escape-fix/` y no suma casos nuevos. Arte usa un harness visual explícito: sus cartas no se conceden como recompensas.

Una comprobación adicional detectó que Escape en Ajustes anidado cerraba también la preparación. [RED conservado](../qa-pre-escape-fix/settings-escape.txt). Se corrigió la propagación de `GameSettings.onCancel`; los 16 casos focales A59 posteriores (ES/EN, ambos motores) quedaron correctos antes del rebuild, incluido el nuevo assertion de Escape. Se repitieron después los48 casos de este informe contra el nuevo artefacto.

La cobertura consolidada del incremento es 140 casos distintos (76 regresiones históricas+16 A59+48 de esta QA), no 140 en una única corrida. **Los 76 casos históricos se ejecutaron antes de este último fix menor**: no se atribuye esa suite completa al hash final. La revalidación posterior comprende los 16 focales y 48 finales. Las 349 pruebas unitarias y 37 integraciones PostgreSQL/Redis se documentan por el integrador; no se suman como casos de navegador.

## Apertura con el build actual

Medición del clic de apertura hasta el resultado estático (~4,2 s), sin precalentamiento ni espera añadida. Las trazas JSON completas conservan frames, llamadas de contexto y tareas desde la entrada; `summary.json` incluye las URLs WebP observadas sin repetir datos inline de SVG.

| Motor    | Idioma | FPS observados | Máximo entre frames | P95     | Long tasks durante apertura |
| -------- | ------ | -------------- | ------------------- | ------- | --------------------------- |
| Chromium | ES     | 60,00          | 16,8 ms             | 16,8 ms | 0 observadas                |
| Chromium | EN     | 60,00          | 16,8 ms             | 16,8 ms | 0 observadas                |
| WebKit   | ES     | 60,02          | 34 ms               | 18 ms   | API no soportada            |
| WebKit   | EN     | 60,26          | 31 ms               | 19 ms   | API no soportada            |

Canvas2D realizó 194 draws en Chromium y 192–193 en WebKit. Chromium tampoco registró long tasks en las fases anteriores a pulsar Abrir; no se observa espera desplazada en estas muestras. El baseline comparable anterior A58 (antes de corregir la apertura) registraba 216,7–233,2 ms máximos en Chromium; A58 corregido 16,8 ms, y el build A59 actual conserva 16,8 ms. No se reutilizan estas cifras como rendimiento de móvil físico o garantía de cada hardware/rareza.

Los casos de apertura conservan una única operación confirmada tras omitir, reducir movimiento, fallback, recarga y cambio de idioma. Las suites compiladas verifican estado/saldos/receipts exactos y swap de presentación; PWA verifica que la respuesta perdida se recupera sin otro POST. No cambian precios, pesos o azar para ejecutar estos recorridos.

## Integridad al cierre

La prueba de actualización PWA modificó temporalmente `dist/service-worker.js` dentro de su `try/finally`; ambos motores terminaron correctamente y se restauró. Los SHA antes/después de worker e index son idénticos. Se compararon 526 archivos (todo `src/arcana` más index/worker): **cero cambios durante QA**. [Comparación](fingerprints-comparison.json), [firma de todo dist al cierre](dist-final-sha256.json).

- `dist/index.html`: `3a93b85130f927da1cd706cc42773b16bfde28c670d9494bb9b6ebc06dc666d6`
- `dist/service-worker.js`: `b1a896806c96b93820eb88b1c0e963207c51dd9fe04f97740705646ae0cc7afd`

El único cambio de test de arte permite indicar `ARCANA_ART_EVIDENCE_ROOT` y guardar las 90 URLs observadas por motor/idioma. A58 queda intacto. No hubo publicación, uso de la partida del propietario, prueba con usuarios o instalación física de PWA.
