# A73 · Rendimiento observado · 17 octubre 2026

## Estado de esta lectura

**Goal activo; integración y validación final pendientes.** Hay reducción reproducible de trabajo gráfico redundante y de arranque frente a la referencia, pero no una solución universal al P95 rAF histórico de 33,4 ms. El objetivo genérico de arte listo ≤400 ms tampoco se cumple en todas las muestras: la última variante medida conserva una de **422,0 ms**. No se sustituye ese extremo por su mediana favorable.

Este documento resume `evidence/ab-1` a `ab-5`. La CI **39032033053**, candidato `eadded8` frente a referencia `14a7f1d`, ensaya omitir la importación automática de extensiones de Pixi; está **en curso en este corte y sin resultado atribuido aquí**. No se considera una optimización validada.

## Protocolo y referencias

Linux, Chromium 1280×900, renderer declarado ANGLE/SwiftShader, un worker y muestras en serie bajo el guard original. Cada ensayo A/B contiene tres pares por escena, con orden alternado AB/BA/AB y una ventana sostenida de 10 s tras observar `art-ready`. Genérico: fixture 3×3, seed69; jefe: fixture 5×5, seed70 y estadísticas propias prolongadas para observar fases. No son resultados de campaña ni duración humana.

Cada variante usa documento/contexto nuevo; las cachés del sistema, proceso y shaders no se purgan. El genérico incorpora además una ventana tras remontar en el mismo documento. Ese remontaje no equivale a un contexto nuevo. Se conservan todos los pares, extremos y muestras sin mejora. Los rangos siguientes son los tres valores observados, no intervalos de confianza.

La referencia fija se comprueba en `tools/verification/build-a73-reference.mjs` de cada commit: ensayos 1–3 usan **`d13c0d9`** (runtime A72 más instrumentación); 4–5 usan **`a5a3b3b`** (agrupación, geometría retenida y decode paralelo ya aplicados). El SHA superior de cada JSON es el merge de CI, no el SHA de la referencia embebida. No se confunden esas identidades.

## Todos los ensayos

En la tabla, G=genérico y J=jefe; tiempos en ms. Cada flecha compara referencia→candidato dentro del mismo job. P95 sostenido corresponde a las ventanas de documento nuevo; los remontajes genéricos se contrastan debajo.

| Ensayo / CI | Referencia → candidato | Variable y cautela | Arte listo G | Arte listo J | P95 rAF G | P95 rAF J |
|---|---|---|---|---|---|---|
| 1 / 39029402120 | d13 → 075d58a | Agrupación y geometría retenida. Las entradas Vite de la referencia todavía no estaban igualadas; no aísla todo el coste de bundle. | 524,9–642,4 → 465,0–480,8 | 712,7–741,2 → 468,5–496,4 | 33,3–33,4 → 33,3–33,4 | 16,8 → 16,8 |
| 2 / 39029992923 | d13 → b10ebe1 | Entradas Vite igualadas; añade ensayo de mipmaps sobre las correcciones previas. No aísla beneficio de mipmaps. | 418,6–454,2 → 376,7–406,0 | 507,9–515,8 → 370,3–460,0 | 16,8 → 16,7–16,8 | 16,7 → 16,7–16,8 |
| 3 / 39030494297 | d13 → a5a3b3b | Correcciones sin mipmaps y decode pertinente en paralelo con init. | 539,2–620,5 → 456,5–501,3 | 684,8–737,5 → 489,4–493,6 | 33,4 → 33,4 | 16,8 → 16,8 |
| 4 / 39030942928 | a5 → ffba1b8 | Mipmaps como única variable gráfica. Rechazados. | 463,9–532,5 → 478,5–495,4 | 501,3–655,7 → 492,0–521,8 | 33,4 → 33,4 | 33,2–33,3 → 33,3 |
| 5 / 39031399760 | a5 → 14a7f1d | Ticker detenido en eventos sin movimiento Canvas; ReplayClock continúa. | 414,0–458,9 → 393,1–422,0 | 470,9–499,5 → 483,3–514,9 | 16,7–16,8 → 16,7 | 16,7 → 16,7 |

Los remontajes genéricos permanecen en P95≈33,4 ms en ensayos 1, 3 y 4; en 2 y 5 están en 16,7–16,8 ms en ambas variantes. No demuestran que remontar cause ni resuelva el caso desfavorable. En el ensayo 4 también empeora el jefe en referencia y candidato. La variación entre runners impide atribuir una causa única a Pixi, GPU, React o decodificación.

Los cinco jobs se cancelaron deliberadamente después de conservar su fase diagnóstica y artifacts; **no son cinco baterías completas superadas**. Los estados y SHA disponibles están en los `ci.json` correspondientes y en `DIAGNOSIS.md`.

## Mejoras y costes demostrados

**Arranque y geometría.** En el ensayo 3, con entradas igualadas, todos los pares mejoran la cota hasta arte listo frente a d13. Las medianas pasan de **545,8→472,2 ms** en genérico y **712,0→490,7 ms** en jefe. Los paints de arranque pasan de **8–9→2–3** y **14–15→2–3**, respectivamente. Su tiempo de pared acumulado pasa de 48,5–84,3→41,0–48,0 ms y de 94,8–102,7→57,5–71,4 ms. Estos intervalos incluyen instrumentación; no son tiempos GPU. El máximo rAF de arranque baja de **183,3–250,0→83,3–116,7 ms**, sin cumplir todavía el techo de 100 ms en todos los casos.

Durante esos mismos 10 s sostenidos, las reconstrucciones geométricas pasan de **70–79→0** en genérico y **76–78→0–1** en jefe. Las que permanecen pueden corresponder a cambios reales de condición/encuadre. La reducción es comprobable, pero su coste previo es demasiado pequeño para explicar por sí solo el P95 de 33,4 ms, que no cambia en ese ensayo. No se atribuye todo el ahorro de arranque únicamente al decode paralelo: a5 también contiene agrupación y geometría retenida.

**Trabajo sostenido bajo demanda.** El ensayo 5 aísla esta opción frente a a5: `drawElements` pasa de **1211–1214→1076–1092** por ventana genérica y de **3526–3544→3021–3058** en jefe. Los paints pasan de **572–574→505–513** y de **574–576→490–495**. Se conservan entrada, lanzamiento, impacto, curación y quemadura; los eventos estáticos reciben su snapshot sin mantener otro ticker. Son conteos de llamadas/envíos observados, no equivalencia con tiempo de trabajo GPU.

Ese ahorro no garantiza menor latencia en toda pantalla: en el ensayo 5 la mediana de arte listo del jefe **empeora de 482,3 a 497,9 ms**. El genérico mejora de 414,9 a 398,2 ms, con extremo de 422,0 ms. Se conservan ambos resultados. El máximo rAF del candidato llega a **100,1 ms**; no se redondea a un cumplimiento estricto de ≤100 ms.

**Mipmaps descartados.** El ensayo 2 era favorable para ambas variantes y no aislaba esa opción. El 4 la separa sobre a5 y no muestra mejora sostenida ni de arranque consistente. Se retira el cambio: añadir niveles puede incrementar los texels aproximadamente un tercio y trabajo de preparación sin beneficio acreditado aquí. El contador `textureBytes` estima solo nivel0 y no representa ese coste completo ni memoria residente.

## Qué significan las medidas

- **rAF:** intervalo observado entre callbacks del navegador. Es sensible a scheduling, composición y entorno; no mide tiempo GPU ni identifica por sí solo el culpable.
- **`paint` / `render-submit`:** tiempo de pared alrededor de nuestras funciones/envío. No espera a que termine la GPU. Pueden incluir pausas del proceso; no son CPU pura.
- **`decode()` / init / import:** spans de promesas con trabajo y esperas solapados. No se suman como duración secuencial ni como CPU. Las imágenes preparadas pertenecen a la escena actual; no se desplaza carga al mapa anterior ni se introduce una caché global.
- **Arte listo / DOM:** cotas superiores observadas mediante polling y automatización. En journeys autoritativos se separan clic real, respuesta HTTP y resultado utilizable; los GET de comprobación y la espera del runner pueden ampliar las cotas. `art-ready` no acredita por sí solo comprensión, acceso a todas las acciones o calidad artística.
- **Texturas y limpieza:** dimensiones RGBA y contadores propios describen recursos propios conocidos. Cero al desmontar no demuestra ausencia de fugas globales, ni un `decode()` en curso es prueba de retención indefinida.

La referencia A73 inicial tuvo seis P95 de 16,7–16,8 ms; por eso no bastaba para reproducir el fallo histórico. Los A/B posteriores sí conservan ventanas de 33,4 ms. Tampoco se compara causalmente ese protocolo con el A69 histórico: este puede capturar fases y remontar antes de su ventana, y usa otra instrumentación. Las comparaciones decisivas son dentro de cada A/B con el mismo harness.

## Reproducción y límites restantes

Sin abrir navegador, el resumen se reconstruye desde los crudos comprimidos:

```sh
node docs/arcana/fluency-increment-2026-10-17/ab-report.mjs docs/arcana/fluency-increment-2026-10-17/evidence/ab-5/raw.json.gz
```

Se conservan `raw.json.gz`, `summary.json`, fixtures, script de referencia y condiciones de compilación. No ejecutar la investigación gráfica en Mac: corresponde al guard de CI Linux, en serie y sin reintentos automáticos.

Presupuestos de ensayo: P95 rAF sostenido≤20 ms; arte listo genérico≤400 ms/jefe≤550 ms; máximo rAF de arranque≤100 ms. Son objetivos, no garantías físicas. Quedan sin cerrar el caso sostenido desfavorable, el extremo genérico de 422 ms, la nueva comparación de extensiones y la matriz final del candidato que se seleccione. Este documento no acredita integración en main, rendimiento de móvil físico, percepción humana de fluidez, diversión o retención.
