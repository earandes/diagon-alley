# A73 · Rendimiento observado · 17 octubre 2026

## Estado actual

Runtime congelado en ca9cc86. Diagnóstico, presupuestos y ciclo de vida comprobados; matriz integrada superada sobre eb5ce91/merge8541ee2c (CI39038639396). Integración documentada enINTEGRATION. Los16diagnósticos se cancelaron deliberadamente después de guardar fase/artifact: no son16baterías globales correctas. Los apartados históricos1–9 conservados debajo describen sus candidatos, no el código final.

## Protocolo y referencias

Linux, Chromium 1280×900, renderer declarado ANGLE/SwiftShader, un worker y muestras en serie bajo el guard original. Cada ensayo A/B contiene tres pares por escena, con orden alternado AB/BA/AB y una ventana sostenida de 10 s tras observar `art-ready`. Genérico: fixture 3×3, seed69; jefe: fixture 5×5, seed70 y estadísticas propias prolongadas para observar fases. No son resultados de campaña ni duración humana.

Cada variante usa documento/contexto nuevo; las cachés del sistema, proceso y shaders no se purgan. El genérico incorpora además una ventana tras remontar en el mismo documento. Ese remontaje no equivale a un contexto nuevo. Se conservan todos los pares, extremos y muestras sin mejora. Los rangos siguientes son los tres valores observados, no intervalos de confianza.

La referencia fija se comprueba en `tools/verification/build-a73-reference.mjs` de cada commit: 1–3 usan **d13** (runtime A72 más instrumentación); 4–5, **a5** (arranque ya optimizado); 6–7, **14a7** (ticker bajo demanda); 8, **fa41664** (trim rectangular); 9, **78267f5** (bandas). El SHA superior de cada JSON es el merge de CI, no el SHA de su referencia embebida. La instrumentación se mantiene igual en ambas variantes de cada A/B; sus ampliaciones entre ensayos impiden tratarlos como una sola serie homogénea.

## Todos los ensayos

En la tabla, G=genérico y J=jefe; tiempos en ms. Cada flecha compara referencia→candidato dentro del mismo job. P95 sostenido corresponde a las ventanas de documento nuevo; los remontajes genéricos se contrastan debajo.

| Ensayo / CI | Referencia → candidato | Variable y cautela | Arte listo G | Arte listo J | P95 rAF G | P95 rAF J |
|---|---|---|---|---|---|---|
| 1 / 39029402120 | d13 → 075d58a | Agrupación y geometría retenida. Las entradas Vite de la referencia todavía no estaban igualadas; no aísla todo el coste de bundle. | 524,9–642,4 → 465,0–480,8 | 712,7–741,2 → 468,5–496,4 | 33,3–33,4 → 33,3–33,4 | 16,8 → 16,8 |
| 2 / 39029992923 | d13 → b10ebe1 | Entradas Vite igualadas; añade ensayo de mipmaps sobre las correcciones previas. No aísla beneficio de mipmaps. | 418,6–454,2 → 376,7–406,0 | 507,9–515,8 → 370,3–460,0 | 16,8 → 16,7–16,8 | 16,7 → 16,7–16,8 |
| 3 / 39030494297 | d13 → a5a3b3b | Correcciones sin mipmaps y decode pertinente en paralelo con init. | 539,2–620,5 → 456,5–501,3 | 684,8–737,5 → 489,4–493,6 | 33,4 → 33,4 | 16,8 → 16,8 |
| 4 / 39030942928 | a5 → ffba1b8 | Mipmaps como única variable gráfica. Rechazados. | 463,9–532,5 → 478,5–495,4 | 501,3–655,7 → 492,0–521,8 | 33,4 → 33,4 | 33,2–33,3 → 33,3 |
| 5 / 39031399760 | a5 → 14a7f1d | Ticker detenido en eventos sin movimiento Canvas; ReplayClock continúa. | 414,0–458,9 → 393,1–422,0 | 470,9–499,5 → 483,3–514,9 | 16,7–16,8 → 16,7 | 16,7 → 16,7 |
| 6 / 39032033053 | 14a7 → eadded8 | Omisión de autoextensiones; retirada al no mejorar el recorrido consistentemente. | 470,2–543,8 → 472,0–481,9 | 502,0–600,4 → 573,7–578,9 | 33,4 → 33,4 | 16,8 → 16,8 |
| 7 / 39032748032 | 14a7 → fa41664 | Trim rectangular; no reduce imágenes. | 479,0–521,2 → 464,0–493,2 | 479,0–591,0 → 465,2–570,0 | 33,3–33,4 → 33,3 | 16,8 → 16,8 |
| 8 / 39033526883 | fa41664 → 78267f5 | Bandas sobre la misma fuente; más geometría y cambio de interpolación. | 467,8–551,3 → 470,7–488,2 | 565,8–591,5 → 594,0–629,0 | 33,3–33,4 → 33,3 | 16,8 → 16,7–16,8 |
| 9 / 39034276488 | 78267f5 → e5aa2af | Cap8 por renderer para batching; Graphics conserva su shader separado. | 464,8–564,3 → 454,3–471,5 | 473,1–588,7 → 495,1–532,4 | 33,3–33,4 → 16,7 | 16,8 → 16,7 |

Los remontajes genéricos permanecen en P95≈33,3–33,4 ms en 1, 3, 4, 6, 7 y 8; en 2 y 5 están en 16,7–16,8 ms en ambas variantes. En el 9 pasan de **33,3→16,8 ms**. No demuestran que remontar cause el caso desfavorable. En el ensayo 4 también empeora el jefe en referencia y candidato. La variación entre runners impide atribuir una causa universal a Pixi, GPU, React o decodificación.

Los nueve jobs se cancelaron deliberadamente después de conservar su fase diagnóstica y artifacts; **no son nueve baterías completas superadas**. Los estados y SHA disponibles están en los `ci.json` correspondientes y en `DIAGNOSIS.md`.

## Mejoras y costes demostrados

**Arranque y geometría.** En el ensayo 3, con entradas igualadas, todos los pares mejoran la cota hasta arte listo frente a d13. Las medianas pasan de **545,8→472,2 ms** en genérico y **712,0→490,7 ms** en jefe. Los paints de arranque pasan de **8–9→2–3** y **14–15→2–3**, respectivamente. Su tiempo de pared acumulado pasa de 48,5–84,3→41,0–48,0 ms y de 94,8–102,7→57,5–71,4 ms. Estos intervalos incluyen instrumentación; no son tiempos GPU. El máximo rAF de arranque baja de **183,3–250,0→83,3–116,7 ms**, sin cumplir todavía el techo de 100 ms en todos los casos.

Durante esos mismos 10 s sostenidos, las reconstrucciones geométricas pasan de **70–79→0** en genérico y **76–78→0–1** en jefe. Las que permanecen pueden corresponder a cambios reales de condición/encuadre. La reducción es comprobable, pero su coste previo es demasiado pequeño para explicar por sí solo el P95 de 33,4 ms, que no cambia en ese ensayo. No se atribuye todo el ahorro de arranque únicamente al decode paralelo: a5 también contiene agrupación y geometría retenida.

**Trabajo sostenido bajo demanda.** El ensayo 5 aísla esta opción frente a a5: `drawElements` pasa de **1211–1214→1076–1092** por ventana genérica y de **3526–3544→3021–3058** en jefe. Los paints pasan de **572–574→505–513** y de **574–576→490–495**. Se conservan entrada, lanzamiento, impacto, curación y quemadura; los eventos estáticos reciben su snapshot sin mantener otro ticker. Son conteos de llamadas/envíos observados, no equivalencia con tiempo de trabajo GPU.

Ese ahorro no garantiza menor latencia en toda pantalla: en el ensayo 5 la mediana de arte listo del jefe **empeora de 482,3 a 497,9 ms**. El genérico mejora de 414,9 a 398,2 ms, con extremo de 422,0 ms. Se conservan ambos resultados. El máximo rAF del candidato llega a **100,1 ms**; no se redondea a un cumplimiento estricto de ≤100 ms.

**Mipmaps descartados.** El ensayo 2 era favorable para ambas variantes y no aislaba esa opción. El 4 la separa sobre a5 y no muestra mejora sostenida ni de arranque consistente. Se retira el cambio: añadir niveles puede incrementar los texels aproximadamente un tercio y trabajo de preparación sin beneficio acreditado aquí. El contador `textureBytes` estima solo nivel0 y no representa ese coste completo ni memoria residente.

**Otras alternativas retiradas.** En el 6, una inicialización menor no mejora consistentemente el total; la mediana de arte listo del jefe empeora **502,9→576,3 ms**. En el 7, el trim mejora algunos tiempos pero no el P95 objetivo. El 8 tampoco resuelve20 ms y empeora la mediana del jefe **573,2→603,8 ms**. La comparación registrada de dos imágenes pausadas encuentra **21.305 píxeles RGB distintos, máximo25 por canal**, dentro de las figuras; no acredita identidad de píxeles ni movimiento. Se retiran del candidato mínimo los helpers/metadata de trim y bandas: su complejidad y precisión distinta no se justifican al encontrar una intervención más sencilla. No se han producido ni reducido imágenes nuevas.

**Batching: resultado acotado positivo.** En el 9 se modifica una sola variable frente a78267f5: `renderer.limits.maxBatchableTextures=min(8,límite)` antes del primer draw. Los tres pares genéricos mejoran el P95 y el remontaje también; siguen visibles6figuras genéricas y10 del jefe. El GLSL observado pasa de **32/32→32/8 samplers**: Graphics permanece32 porque se construye durante init; el shader del batch de figuras usa8. El dato no describe un cap global de shaders. Pixi divide los lotes al superar8texturas, no omite unidades.

Los paints cálidos genéricos suben **379–450→503–504** y `drawElements` **804–959→1069–1075**: en este caso son consecuencia de producir más frames dentro de10s, no una reducción de trabajo por ventana. El efecto de esa opción es distinto del ahorro de ticker del ensayo5. El máximo rAF de arranque genérico baja **100,0–133,3→83,3–83,4 ms**; jefe **100,0–116,8→83,3–100,0 ms**. No mejora toda pareja de arranque: en la tercera, genérico empeora464,8→471,5 ms y jefe473,1→532,4 ms, aunque las medianas mejoran490,1→455,7 y557,7→508,8 ms. Se conservan ambos casos desfavorables.

Se registran GLSL y las primeras16llamadas nativas de compile/link/draw/consultas, sin `finish`, readback ni GPU queries. La primera consulta `getProgramParameter` observada23,1→5,9 ms es tiempo de pared alrededor de esa llamada; puede incluir espera del driver y no demuestra CPU pura de compilación ni explica por sí sola el sostenido. El A/B aporta evidencia para el batch en esas condiciones, no una atribución general a toda GPU.

## Qué significan las medidas

- **rAF:** intervalo observado entre callbacks del navegador. Es sensible a scheduling, composición y entorno; no mide tiempo GPU ni identifica por sí solo el culpable.
- **`paint` / `render-submit`:** tiempo de pared alrededor de nuestras funciones/envío. No espera a que termine la GPU. Pueden incluir pausas del proceso; no son CPU pura.
- **`decode()` / init / import:** spans de promesas con trabajo y esperas solapados. No se suman como duración secuencial ni como CPU. Las imágenes preparadas pertenecen a la escena actual; no se desplaza carga al mapa anterior ni se introduce una caché global.
- **Arte listo / DOM:** cotas superiores observadas mediante polling y automatización. En journeys autoritativos se separan clic real, respuesta HTTP y resultado utilizable; los GET de comprobación y la espera del runner pueden ampliar las cotas. `art-ready` no acredita por sí solo comprensión, acceso a todas las acciones o calidad artística.
- **Texturas y limpieza:** dimensiones RGBA y contadores propios describen recursos propios conocidos. Cero al desmontar no demuestra ausencia de fugas globales, ni un `decode()` en curso es prueba de retención indefinida.

La referencia A73 inicial tuvo seis P95 de 16,7–16,8 ms; por eso no bastaba para reproducir el fallo histórico. Los A/B posteriores sí conservan ventanas de33,4 ms y el9 las mejora dentro del mismo job. No se compara causalmente ese protocolo con el A69 histórico: este puede capturar fases y remontar antes de su ventana, y usa otra instrumentación. Las comparaciones decisivas son dentro de cada A/B con el mismo harness; no se unen las mejores cifras de runs distintos para fabricar un resultado final.


## Ensayos10–16 y candidato final

Todos conservan tres parejas y los valores desfavorables. Tiemposms; rangos observados, no intervalos de confianza. ArteG/J son cotas históricas de polling, también en16.

| Ensayo/CI | Referencia | Variable | ArteG | P95G | ArteJ | P95J |
|---|---|---|---|---|---|---|
|10/39034798097|d13|mínimo sin atlas|318.7–391.9 → 277.9–347.7|16.7–16.8 → 16.7–16.8|417.7–441.9 → 345.7–367.1|16.7–16.8 → 16.7–16.8|
|11/39035264888|0c054|imagen resuelta inmediata|450.1–506.6 → 408.5–433.3|16.8 → 16.7–16.8|493.1–522.6 → 469.2–511.9|16.7–16.8 → 16.7–16.8|
|12/39035910193|d03c93c|dos admisiones por paint|239.7–300.7 → 319.6–335.5|16.7–16.8 → 16.7–16.8|318.4–320.8 → 367.1–369.0|16.7–16.8 → 16.7|
|13/39036393375|d13|presupuesto2 frente al inicio|405.4–483.8 → 411.8–425.6|16.7–16.8 → 16.7–16.8|508.3–547.9 → 529.8–544.1|16.7–16.8 → 16.7–16.8|
|14/39036894838|83d4|Graphics públicos en batch|367.2–426.9 → 329.9–364.8|16.8 → 16.7–16.8|382.5–397.4 → 338.1–354.5|16.7–16.8 → 16.7–16.8|
|15/39037479383|d13|runtime final frente al inicio|529.4–675.6 → 416.0–440.4|33.4 → 16.7–16.8|718.5–728.9 → 497.3–581.7|16.8–33.2 → 16.7|
|16/39038198256|d13|mismo runtime, marcador preciso|349.1–441.8 → 330.1–347.4|16.7–16.8 → 16.7|431.4–448.7 → 342.3–372.0|16.7–16.8 → 16.7|

El10 mejora arranqueJ en las tres parejas; una parejaG empeora. El11, aunque termina antes que su referencia, concentra onceuploads del jefe en el primer paint (envío≈66ms/pintura≈71ms) y produce máximosrAF167–183ms: variante no aceptada. Un remontajeG de referencia vuelve a33,3ms y se conserva.

El12 admite dos fuentes nuevas por paint. Máximos≈67ms, coste+34–96msG/+47–50msJfrente al envío simultáneo: compromiso explícito para acotar picos, no mejora de todas las métricas. Dos admisiones no garantizan dosuploadsGPU: una pieza puede empezar a dibujarse después. Ninguna operación espera texturas. El13 mantiene83 contra originald13: reduce picos117–183→83ms, peroG412–426ms no cumple400; dos parejasG y unaJ empeoran su total. Se conserva el incumplimiento y no se integra esa variante como terminada.

El14 aísla ink/sparks en batch mediante API pública: GLSL usado32/8→8; arranqueG367–427→330–365ms/J383–397→338–355ms y picosG67–100→33–50/J67→33 en todas las parejas. Cambia empaquetado, no paths/colores/orden/máscaras. GraphicsAdaptor puede construir programa32 durante init, aunque no se observó compilado/usado enGL en estas muestras. Coste potencial: empaquetado/buffers de vértices al cambiar sparks. Los crudos conservan esos envíos.

En15, runtimeca9 contra originald13, los tres genéricos y remontajes33,4→16,7–16,8ms; jefe16,8/33,2/16,8→≈16,7ms. PicosG200–233→50–67/J233–250→50–83ms. Todas las parejas mejoran polling total, peroG416–440/J497–582 **no acreditan400/550ms**. Esa limitación se registra antes de cambiar medición; no se ocultan extremos.

## Aceptación16: marca precisa y límites

Sin cambiar runtime, se añade a ambas variantes MutationObserver de los flags de todas las figuras y actor: readySubmitAt después del turno de envío completo; readyFrameAt en su siguiente oportunidadrAF. No mide terminaciónGPU ni presentación física. Se desconecta antes de las ventanas. El polling antiguo sigue en cada crudo.

| Medida16 | Referencia | Runtime final | Objetivo |
|---|---:|---:|---:|
| G envío completo |231,7–295,8|226,6–232,1|informativo|
| G siguiente oportunidadrAF |232,7–296,4|236,5–242,3|≤400|
| J envío completo |341,8–346,9|283,4–315,1|informativo|
| J siguiente oportunidadrAF |342,7–347,9|289,2–326,9|≤550|
| MáximorAFarranqueG |100,0|33,4|≤100|
| MáximorAFarranqueJ |100,1–116,7|33,4|≤100|
| P95sostenidoG/J yremontajeG |16,7–16,8|16,7–16,8|≤20|

Los presupuestos pasan en las tres muestras actuales, guardadas antes de evaluar aceptación. Dos parejasG tienen oportunidadrAF≈3–4ms anterior en referencia; no se proclama mejora de cada indicador. PollingG349–442→330–347/J431–449→342–372 mejora las seis parejas. En16 ambas variantes son rápidas en sostenido; no sustituye el contraste desfavorable15. La deducción de última pintura del15 no equivale retrospectivamente a este marcador.

No hay assets nuevos ni reducción de resolución, caché global o precarga en pantalla anterior. Propiedad por escena, liberación al desmontar; pausa/ocultación no mantiene ticker gráfico. La configuración final usa admisión2 y batching público8. Mipmaps/autoload/trim/atlas retirados, con costes y crudos conservados.

## Reproducción

`node docs/arcana/fluency-increment-2026-10-17/ab-report.mjs CARPETA/raw.json.gz` reconstruye cada resumen sin navegador. Los16crudosgzip sin pérdida, estadosCI, snapshots y scripts permanecen en evidence/ab-N (el primerCI figura enDIAGNOSIS). Referencias exactas/condiciones enREFERENCE; resultado integrado enVALIDATION/COVERAGE.

Las herramientas gráficas solo enLinux bajo controles originales, una batería cada vez. Dispositivo físico, red móvil, GPU real y observación humana pendientes. Una captura no valida movimiento; pruebas de poses/cursor no acreditan personalidad, diversión o retención. Los objetivos de ensayo no son garantía universal.

## Recorrido completo del candidato

FaseA70/A71/A73deCI39038639396superada, merge8541ee2c. Cuatro cuentas ES/EN×paquetes, sin fixtures económicas ni cuenta habitual; rutas preparadas mediante helperQA ycombates omitidos explícitamente. Entry103–121ms; primercombateclic→respuestaHTTP69–71ms→figuras261–277ms; jefeHTTP80–87ms→figuras293–372ms. Regreso mapa65–89ms; cierre17–18ms; otra preparación9ms yotra expedición109–129ms. Sinpageerrors, rana propia sin restar monedas, log/economía después deomitir intactos.

Referencia inicial independiente: entrada117–127ms, primerasfiguras358–435ms/jefe497–515ms. No son pares con mismasrutas/resultados/runner: describen recorrido, no ahorrocausalHTTP. Hay extremos desfavorables conservados: entrar enpreparación91–112frente84–102ms, consulta jefe28–64frente39–44ms yretorno trasrana10–26frente10–18ms. No se afirma que todo mejore.

Apertura completa2917–3403ms frente2911–2957referencia: el extremo aumenta. El código de apertura/recetas/paquetes es idéntico; las recetas dependen de rareza/novedad yeljourney no guarda ese recibo como variable de control. No se atribuye una causa ni se presenta esta comparación como regresión causal. No se acelera/traslada la coreografía para conseguir una métrica. LasfixturesA69declaran recetas yson la comprobación específica.

La muestraA71adicional5×5deeste mismo candidato: arranque353ms, máximorAF33,4ms; sostenidoP95≈16,8ms ysinLongTasks en10s; omisión41ms;10figuras y12texturas propias. Contadorespropiosceroaldesmontar, sin afirmar ausencia global defugas. Crudos en evidence/final; las cifras deljourneyson cotas desdeclic incluyendo red/carga, noGPU.

## Contraste con el harness históricoA69

La faseA69del mismo merge8541ee2cpasó sin modificar sus comprobaciones. Conserva72muestras de arena3×3/5×3/5×5, idiomas/paquetes y3viewports. Su ventana incluye navegación/carga, pausa, inspector yomisión ysolo≈26–30rAF: **no es el sostenido10s deA73**. P95deesasventanasChromium16,7–33,4ms/WebKit26–77ms; los picos más altosWebKit89/81/77ms en primerasnavegaciones. ReadinessporpollingChromium148–353ms/WebKit186–392ms. No se anunciaP95≤20universal ni se borra el33,4 delharnesshistórico; se separa arranque de sostenido tal como exige el contrato. Elmaxarranqueobservado queda por debajo100ms, sin inferirGPU.

Los30ciclosserialesA69: contadorespropios6texturas/3.513.024bytesestimadosporciclo, desmontajes correctos, P95rAF16,8ms/max33,5ms de esa secuencia. No es RSS/heap/GPU ni prueba global de ausencia defugas. Crudosactuales enmotion-matrix.json.gz. El objetivo20se acredita solo en ventanas sostenidas declaradasChromiumA73/A71; no se ha medido sostenido10sWebKit con ese mismo perfil.

Fraccionado adicional sin otro navegador: el análisis porfase sobrecrudo15conserva cada pareja yfase temporal delreloj. P95actual deanticipación/vuelo/impacto/asentamiento16,7–16,8ms enambascomposiciones; el genéricoreferencia mantiene≈33,3–33,4también en vuelo/impacto. No se seleccionan solo intervalos deasentamiento para producir la mejora. La etiqueta defase es temporal ypuede abarcar acuses; no es una trazaGPU o tipología exacta decadaevento. Resumen enab-15/phase-summary.json, reproducible desde la raíz del repositorio con el comando no gráfico siguiente:

```sh
python3 - <<'PY'
import gzip,json,collections
p='docs/arcana/fluency-increment-2026-10-17/evidence/ab-15/raw.json.gz'
d=json.loads(gzip.decompress(open(p,'rb').read()))
for r in d['records']:
    phases=collections.defaultdict(list)
    for f in r['warm']['data']['frames']:
        if f['at'] >= r['warmStart']: phases[f.get('phase')].append(f['ms'])
    q=lambda a: sorted(a)[int((len(a)-1)*.95)]
    print(r['kind'],r['pair'],r['variant'],{k:(len(v),q(v),max(v)) for k,v in phases.items()})
PY
```

## Benchmark no arena heredado

A67baseline/current también pasó en la mismaCI; su referencia es la históricaA66, no mainA72 ni un A/B aislado deA73. Pacto primera apertura usable64→89ms, confirmación127→144ms; taller60→54ms/cotización11→10ms. Lossettled de reaperturas dePacto939/936→442/446ms; máximosactuales16,7–50,1ms. Se conservan todos los resultados en historical-a67-*.json, incluidos los desfavorables. La red/ruta ylas distintasversiones no permiten atribuir una causa a esta optimización. No se presenta mejora universal de todos losrecorridos.
