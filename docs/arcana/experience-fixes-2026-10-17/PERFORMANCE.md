# A75 · Rendimiento y composición

Muestra acotada ejecutada en CI 39056332168/head 692dacf, que **no pasó completa**: la batería se detuvo después en F09. Estos resultados parciales se conservan; no sustituyen la validación del candidato final.

## Comparación emparejada con A73

390x844 / ES Diagon / declared mastery5x5 / AB-BA-AB / fresh isolated browser contexts; application module evaluated before explicit fixture mount. rAF is not GPU time.

| Variante | Par | Activación→frame listo ms | P95 rAF ms | Máximo sostenido ms |
|---|---:|---:|---:|---:|
| baseline | 1 | 364.0 | 16.7 | 16.8 |
| current | 1 | 304.4 | 16.8 | 16.8 |
| current | 2 | 334.0 | 16.7 | 16.8 |
| baseline | 2 | 331.6 | 16.7 | 16.8 |
| baseline | 3 | 301.4 | 16.7 | 16.8 |
| current | 3 | 330.9 | 16.7 | 16.8 |

Mediana P95:16,7 ms en ambas variantes. No se atribuye una mejora de velocidad: es una comprobación de no regresión en esta muestra. Los tiempos de activación y navegación se conservan separados en el crudo, incluidos extremos y long tasks. No tiempo GPU, memoria residente, arranque frío universal ni prueba global de ausencia de fugas.

## Geometría

390×844, ES,5×5: peanas propias109,4 px. Figura pasa de50,8 a69,1 px con nombre de una línea; con dos líneas queda52,9 px. Sin reducir fuente ni PV. Mediana de huella alfa fuente propia Diagon de~49 a~66 px; ARCANA de~40 a~54,6 px. La transparencia del arte sigue existiendo, no se finge un rig nuevo ni se deforma la ilustración.

Geometría3×3/5×3/5×5,ES/EN×packs pasó enChromium390 en esta ejecución. Reflujo320/texto200% pasó en ambos packs EN con scroll vertical permitido y sin scroll horizontal; no emulación de zoom/dispositivo físico. Faltaba completar el resto de proyectos y recorridos.

## Controles temporales

Tres pares completaron pausa,2x,inspector,ocultación sintética,omisión y comparación inmutable deBattleLog/game. La captura PNG acredita composición únicamente. Se mantuvo reloj/renderer; el cambio productivo es layout, no lógica temporal.

## Candidato final A75 (regresiones históricas todavía en curso)

CI 39059090478/head 889886d; merge 8d38776, mismo árbol7a6e66a. A75:113 pasadas,175 omisiones deliberadas,0 fallos. Los tres pares finales mantienen P95 rAF 16,7 ms,600 frames por ventana de10s. Mediana activación→frame listo: referencia317,9 ms, actual329,7 ms; rangos301,5–350,8 y297,5–339,5 ms respectivamente. **No mejora atribuida al arranque**: diferencia/variabilidad conservada, no se oculta ni se confunde esta fixture con entrada completa o GPU. Objetivo de no regresión sostenida cumple en estas ventanas; no rendimiento universal.

| Evidencia | Mediana P95 referencia ms | Mediana P95 actual ms | Máximo sostenido de ambas ms |
|---|---:|---:|---:|
| attempt-3 | 16.7 | 16.7 | 16.8 |
| attempt-5 | 16.7 | 16.7 | 16.8 |
| attempt-6 | 16.7 | 16.7 | 16.8 |
| attempt-7 | 16.7 | 16.7 | 16.8 |
| attempt-9 | 16.7 | 16.7 | 16.8 |
| final | 16.7 | 16.7 | 16.8 |

Los intentos previos no equivalen a seis sesiones humanas ni a cobertura global. Se incluyen para conservar dispersión y extremos, sin reintentos automáticos o elección de una muestra favorable. Los cambios posteriores a692dacf anteriores al candidato final son de ensayos/documentación, no de renderer. Los resultados finales de A70/A69/A67 se añadirán con su estado real; sus presupuestos y condiciones diferentes no se mezclan con este perfil.

## Regresión A70/A71/A73 del candidato

La fase completa pasa en CI39059090478 (18:46:28–19:03:12UTC), merge8d38776/head889886d. Crudos seleccionados en `evidence/final/regressions/` comprueban ese SHA antes de copiarse; no se reutilizan PNG históricos como si fueran nuevos.

- Fixture A70 Chromium1280,5×5: ventana sostenida10s/599intervalos, P95rAF16,7ms y máximo16,8ms. Arranque de esa fixture550,9ms, máximo rAF66,7ms y una long task60ms. Son condiciones diferentes al perfil emparejado móvil, no mejora causal deA75 ni GPU/CPU de decode.
- Los contadores propios registran12texturas y7.628.832bytes por dimensiones; no memoria residente medida o ausencia global de fugas. Las30iteraciones y limpieza mantienen sus aserciones originales.
- Cuatro expediciones de autoridad reales y aisladas ES/EN×packs completan preparación→mapa→primercombate→jefe→cierre→rana ganada sin recompra→otra expedición explícita. Límite superior observado clic→arena: primercombate246,2–289,3ms; jefe266,2–293,7ms. Incluye red/carga y polling declarado; rutas/runner no son pares conA73histórico, no causalidad ni tiempo humano.
- Ciclo de vida A73 conserva cursor/log/game en resize pausado390/865, decode retenido, ocultación sintética y reducido durante gesto. El sample A71 conserva gesto/ángulo/cursor al pausar, swap y omisión; sin rig corporal nuevo.

Estos resultados no ocultan los picos/variabilidad históricos ni prueban móvil físico, segundo plano real, arranque frío de máquina, GPU perdida físicamente o rendimiento universal. Falta incorporar aquí el estado global de las otras suites cuando termine la ejecución.

## A69: conservar resultados cortos desfavorables

La matriz A69 completa pasa funcionalmente, pero **no cumple un objetivo general de20ms** en sus muestras cortas con arranque. Se conservan las200muestras (`motion-all.json.gz`) y resumen sin descartar extremos. Comparación con A73 final/8541ee2c, mismos nombres de escenario y configuración declarada, runners/horas diferentes ysin pares controlados:

| Grupo | Casos | Mediana de P95 por caso A73 ms | Actual ms | Rango de P95 actual ms |
|---|---:|---:|---:|---:|
| Arena Chromium |36|33,3|33,4|33,2–50,1|
| Arena WebKit |36|36,5|55,0|39–116|
| Apertura Chromium |60|16,7|16,75|16,7–33,3|
| Apertura WebKit |60|23,0|36,0|21–89|

Son medianas de losP95 de cada caso, no unP95 combinado de todos los frames. Ventanas cortas/no sostenidas: no equivalen al perfil emparejadoA75 de10s. WebKit empeora también en aperturas y escritorio donde el encuadre móvil no aplica: causa sin atribuir; esto no demuestra ni descarta una regresión causal del producto. No se presenta como mejora, se oculta tras reintento o se atribuye aGPU sin medir. Haría falta un contraste WebKit emparejado/acotado para investigar esa cuestión, fuera de las afirmaciones de esta entrega. El JSON comparativo registra fuentes y limitaciones. El recorrido/UI están comprobados; rendimiento universal y dispositivo físico siguen sin acreditarse.

## Reanudación final: contraste preregistrado WebKit y Chromium

CI39063046713, head6d4dbcb, mergecbd771c, árbolidénticod48d45df. A75 pasa114casos/174omisiones deliberadas. Tres paresAB/BA/AB por motor contra937a0a1, ES/Diagon390, fixture5×5 con el mismo hashBattleLog. Ventana10s tras500msde asentamiento, módulo ya evaluado antes de pulsar el inicio de fixture. No es arranque frío de aplicación ni dispositivo físico. Resultados de los seis accesos por motor y última serie rAF íntegra en `evidence/resume-final/paired-*.json[.gz]`; temporalFrames conserva una muestra de1/12 de cada ventana, no todos los frames de las seis series.

| Motor | P95 referencia, tres ventanas | P95 actual, tres ventanas | Activación→frame listo, mediana antes→después | Rangos antes / después |
|---|---|---|---|---|
| Chromium |16,8/16,8/16,7ms |16,7/16,7/16,7ms |319→322,1ms |309,9–355,5 /304,8–322,5ms |
| WebKit |18/18/17ms |17/18/17ms |435→558ms |385–833 /388–632ms |

Se cumple el criterio preregistrado de medianaP95 sostenida≤max(20ms,referencia+1ms). Chromium600intervalos por ventana; WebKit606–621. Máximos rAF WebKit de las ventanas: referencia105/107/51ms, actual23/74/25ms. No se eliminan extremos ni se afirma ausencia de tirones.

**No mejora de arranque acreditada.** En WebKit la mediana aislada sube123ms, aunque dos de los tres pares actuales tienen menor espera que su referencia; los rangos se superponen. Esta muestra acotada no atribuye causa, ni demuestra una regresión universal ni autoriza seleccionar solo el par favorable. Las promesas, rAF y ventanas no son tiempo GPU. WebKit no aporta entries longtask en esta sonda: no equivale a cero trabajo largo. Chromium registra tareas de55–65msantes y54–55msactuales cerca del arranque.

Las cifras cortas de A69 que empeoraron en WebKit siguen conservadas arriba y en los crudos históricos; este contraste sostenido responde otra pregunta, no las borra. Se recomienda observar ritmo/primer acceso y dispositivo físico posteriormente, sin ampliar A75 a otra optimización no demostrada.
