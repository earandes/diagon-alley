# Rendimiento y límites A92

Candidato medido **b6c0800**, checkout **135a4fe9**, árbol idéntico **7fe64d45**, CI[39353793256](https://github.com/earandes/diagon-alley/actions/runs/39353793256). Ya están disponibles A92/A76 (151casos correctos/81omisiones previstas) y A75 (114/174), artefactos12234249222/12234134975. **El job check completo ha terminado correctamente:797unitarias,120PostgreSQL/Redis y605browser, con345omisiones previstas**. Incluye A70, Halloween y A69 (90correctos/42omisiones previstas). La regresión general118419305265 también terminó correctamente:138browser adicionales. **CI39353793256 completa correcta:797unitarias,120PostgreSQL/Redis,743browser y345omisiones previstas**, sobre el candidato y checkout indicados.

Se distinguen estas medidas actuales, incluidos A70/A71/A73 y A69, de las referencias de7d74cef, explícitamente históricas más abajo. La corrección de rótulos rivales usa ancho mínimo por palabra y está cubierta por las nuevas aserciones A92 y por la batería A69 actual; no se confunde ese resultado con validación humana.

Esta revisión no autoriza otra campaña de optimización. Se utilizan los ensayos de regresión existentes y tres pares propios acotados, en Linux serial. Sin navegador, perfil, vídeo o captura local. P95rAF≤20ms continúa siendo objetivo de ventanas declaradas; no es tiempo GPU ni garantía universal.

## Consulta de ruta

[Seis observaciones y geometría](evidence/candidate-b6c0800/a92/paired-comparison.json). Runtime base86d6a92, mismo harness/fondo/grafo/390×844; AB–BA–AB, sin reintentos ni elección de la muestra favorable.

| Par                     | Base acción→consulta utilizable | Actual acción→consulta utilizable |
| ----------------------- | ------------------------------: | --------------------------------: |
| AB                      |                         134,6ms |                           187,2ms |
| BA                      |                          61,5ms |                            84,8ms |
| AB                      |                          85,9ms |                           162,6ms |
| Mediana descriptiva de3 |                          85,9ms |                           162,6ms |

No hay una mejora temporal en esta muestra: las tres consultas actuales tardaron más. La distinción visual añade trazos SVG; se conserva el coste desfavorable medido. Incluye overhead/autoespera de Playwright y variabilidad del host, con cachés no controladas; no es arranque frío, tiempo humano, CPU/GPU ni aislamiento causal. No se ejecuta un nodo, no se desplaza trabajo a otra pantalla y tres pares no acreditan rendimiento universal.

Las muestras anteriores permanecen: [7d74cef](evidence/candidate-7d74cef/a92/paired-comparison.json),88,1ms base/175,8ms actual; [b6d9e3c](evidence/candidate-b6d9e3c/a92/paired-comparison.json) tuvo mediana88,3ms base/107,1ms actual; [082b6d6](evidence/candidate-082b6d6/a92/paired-comparison.json),97,6/98,8ms. La muestra6747f81 tuvo115,9ms actual frente a76,4ms base, conservada en el artefacto de CI39323571082. No se añaden reintentos para conseguir cifras mejores ni se atribuyen las diferencias entre ejecuciones exclusivamente a A92.

## Geometría y renuncias de preparación

En el mismo harness con cinco nombres, el ancho pasa59,390625→100,65625px y conserva palabras completas. El diálogo crece695,875→761,921875px; el contenido actual tiene scrollHeight760/clientHeight760. No se comprime a cinco nombres estrechos para aparentar que cabe.

La fixture completa usa NodePreparation/BossSupplies, stock, botín y footer de producción. Cuatro integrantes son una muestra normal; cinco incluyen Maestría5×5, diez piezas de equipo y cinco grageas asignadas en borrador. Los [ocho estados Chromium390 ES/EN×packs×4/5](evidence/candidate-b6c0800/a92/chromium-390-a92-arcana-es-full-5.json) pasan cajas atómicas. **El margen mínimo actual es13,6875px**, del tarro ARCANA/ES con cinco integrantes. Se conservan por separado el mínimo6,171875px de7d74cef y el antiguo24px de una fixture menos densa; no se presentan como el margen actual. Los otros mínimos por estado son24px Diagon,25,5px ARCANA4 y26,5px ARCANA/EN5.

Formación, afinidades y tarro comparten una repisa; la afinidad está sobre el retrato. El libro y botín rivales comparten espacio; se retiraron los márgenes8/12px redundantes del bloque NodePreparation dentro del grid del jefe, sin reducir figuras, fuentes o información. Las consultas abiertas recuperan todo el ancho. Texto200%/320 y detalles expandidos pueden necesitar desplazamiento accesible. No se afirma que cualquier combinación quepa sin él. Capturas y límites en [galería](GALLERY.md).

## Cohorte pareada de arena A75

[Resumen de los doce ensayos](evidence/candidate-b6c0800/performance/paired-summary.json); [Chromium crudo](evidence/candidate-b6c0800/performance/paired-mobile-performance.json.gz), [WebKit crudo](evidence/candidate-b6c0800/performance/paired-webkit-performance.json.gz).390×844 ES/Diagon, fixture declarada5×5, AB–BA–AB, contextos aislados y módulo evaluado antes del montaje. Tres ventanas por variante/motor:600intervalos por ventana Chromium y591–608por ventana WebKit, según los archivos crudos, mismo BattleLog hash. El benchmark heredado usa base440d278; no se la cambia silenciosamente por A90. El conjunto A75 disponible registra114casos correctos y174omisiones previstas, sin inesperados o flaky; no equivale a la CI completa.

| Motor/variante       | P95rAF de3ventanas | Máximo rAF de3 | Acción→frame listo | Navegación→frame listo |
| -------------------- | -----------------: | -------------: | -----------------: | ---------------------: |
| Chromium base440d278 |        16,7–16,8ms |         16,8ms |      322,5–332,4ms |          473,9–488,6ms |
| Chromium actual      |        16,7–16,8ms |         16,8ms |      323,9–329,4ms |          459,2–495,6ms |
| WebKit base440d278   |        22,0–23,0ms |   27,0–118,0ms |      411,0–724,0ms |          609,0–949,0ms |
| WebKit actual        |             23,0ms |   29,0–110,0ms |      443,0–566,0ms |          648,0–778,0ms |

Pasaron las aserciones existentes de no regresión, sin relajar su fórmula. **El objetivo20ms sigue incumplido en todas las ventanas actuales WebKit de esta cohorte.** La latencia Chromium actual se solapa con la base; navegación→frame incluye495,6ms frente al máximo488,6ms de base. WebKit conserva un peor caso de443ms frente al mínimo411ms de base. No se declara una mejora general a partir de estos rangos. No se presenta el mejor caso WebKit como rendimiento universal ni se oculta su máximo110ms.

Referencias históricas, ejecuciones diferentes con variabilidad de host:

| Referencia                                                                            | P95actual Chromium/WebKit | Acción→frame actual Chromium/WebKit |
| ------------------------------------------------------------------------------------- | ------------------------- | ----------------------------------- |
| A90 · CI39280235365, head19f0b4f/checkout1dfca931                                     | 16,7–16,8ms /21–23ms      | 320,6–348ms /393–524ms              |
| [b6d9e3c · CI39341829121](evidence/candidate-b6d9e3c/performance/paired-summary.json) | 16,7–16,8ms /22–23ms      | 337,4–363,8ms /401–563ms            |
| [7d74cef · CI39347774137](evidence/candidate-7d74cef/performance/paired-summary.json) | 16,7–16,8ms /22–24ms      | 342,3–362,9ms /409–573ms            |

En b6d9e3c los máximos actuales fueron16,8ms Chromium y30–108ms WebKit, frente a16,8ms y26–112ms de sus bases. Sus rangos base de acción→frame fueron326,5–367ms/411–701ms. Los datos originales permanecen. No se atribuye a A92 una optimización general por comparar valores absolutos de hosts/ejecuciones diferentes.

## Recursos y cobertura

No nuevas texturas, fuentes, audio, dependencias o relojes. Trazos SVG estáticos; ResizeObserver del álbum se desconecta al desmontar. La admisión de apertura recuperada guarda una referencia acotada playerId/receiptId de presentación, no inventario ni una caché ilimitada. El commit no espera a la autenticación visual; una apertura ya admitida conserva su contexto durante Cuenta.

Las PNG seleccionadas son evidencia, no recursos del runtime. Bytes de build o estimaciónRGBA no equivalen a RAM residente. Contadores propios no acreditan ausencia global de fugas. Promesas decode no son CPU pura; rAF no es tiempo GPU.

A89 y el benchmark A75 no aíslan compra autoritativa→reautenticación→apertura recuperada de App. A92 prueba ese orden mediante respuesta retenida, no lo presenta como arranque frío medido. Los recorridos A70/A73 aportan medidas conectadas de sus acciones declaradas; ninguna fixture se convierte en duración humana o latencia de una futura red productiva.

Las ventanas A69 históricas A90, no pareadas con esta revisión, incluyeron hasta50,1ms Chromium y92ms WebKit. No se sustituyen por una ventana favorable del jefe. A69 de7d74cef se conserva como referencia histórica más abajo. A70 y A69 de b6c0800 ya disponen de evidencia propia enlazada; la regresión general actual también ha terminado correctamente y dispone de evidencia propia en la sección final. Dispositivo físico, lector real, cachés frías controladas y percepción de ritmo siguen pendientes.

## Cuatro interacciones técnicas A89

[Datos vigentes](evidence/candidate-b6c0800/performance/action-usable-a89.json). Mismo protocolo390×844 ES/Diagon, cuatro fixtures de componentes, origen técnico. Se mide desde activación hasta aserciones de estado utilizable, con overhead y autoespera. No hay operación económica de servidor en estos cuatro casos, ni caché fría controlada. No son tiempos humanos o retención.

| Acción            | A90, una observación | A92 b6d9e3c, una observación | A92 7d74cef, una observación | A92 b6c0800, una observación |
| ----------------- | -------------------: | ---------------------------: | ---------------------------: | ---------------------------: |
| collection-goal   |               47,0ms |                       47,6ms |                       54,2ms |                       48,0ms |
| wand-reference    |               14,4ms |                       15,1ms |                       23,5ms |                       14,7ms |
| bean-draft        |               16,3ms |                       18,2ms |                       19,0ms |                       25,2ms |
| battle-facts-book |               34,6ms |                       28,1ms |                       30,3ms |                       32,7ms |

Una observación por acción no demuestra una mejora o regresión causal. Los resultados desfavorables no se descartan. Los recursos observados al empezar se conservan con sus bytes de transferencia, sin convertirlos en CPU de decode/RAM. No se confunde elegir un objetivo en una fixture con abrir un Cromodex frío, asignar stock100 con una confirmación de combate, ni una consulta con una operación persistida.

## Recorridos conectados actuales A70/A71/A73 ·b6c0800

[48confirmaciones del jefe](evidence/candidate-b6c0800/connected/boss-journeys.json), [cuatro expediciones A73](evidence/candidate-b6c0800/connected/expedition-timings.json) y [procedencia de76JSON y dos PNG](evidence/candidate-b6c0800/connected/provenance.json), artefacto12235448055 de CI39353793256, checkout135a4fe9. Todos los76JSON seleccionados declaran ese SHA:48tiempos,4recorridos y24geometrías iniciales. A70 ha terminado correctamente sobre el candidato. El job check completo, incluidos Halloween y A69, también ha pasado; la regresión general también terminó correctamente (138browser adicionales).

Cuentas aisladas PG/Redis reales;24muestras A70 de entrada ordinaria y24A71 con preparación/ruta inicial declaradas. A73 también declara preparación inicial antes de las operaciones HTTP reales. Las duraciones incluyen helper, red de ensayo, consulta/aserciones y autoesperas: son cotas técnicas hasta estado utilizable, no tiempo puro de servidor ni producción.

En las48confirmaciones de A70/A71, acción→DOM utilizable459–2082ms y acción→figuras listas474–2087ms. Se conservan ambos motores y los tres tamaños. El extremo superior no se sustituye por otra cohorte favorable. La referencia histórica [7d74cef](evidence/candidate-7d74cef/connected/boss-journeys.json), checkout165866a6/CI39347774137, registró450–2126ms y452–2132ms; b6d9e3c registró452–1395ms y458–1724ms. No son ensayos pareados de mejora ni duración humana.

En las cuatro expediciones actuales A73 ES/EN×packs (Chromium1280×900), con secuencia de visitas definida y sin acreditar cachés frías controladas, se registran13nombres de paso:

| Acción | Observaciones | Acción→estado utilizable, rango |
| ------ | ------------: | ------------------------------: |
| entry-to-preparation | 4 | 100,4–119,7ms |
| first-expedition-to-map | 4 | 150,9–177,5ms |
| first-node-to-preparation | 4 | 57,5–73,4ms |
| first-combat-confirm-to-arena | 4 | 304,2–352,8ms |
| omit-confirmed-replay | 8 | 9,3–11,1ms |
| first-arena-return-to-map | 4 | 141,0–160,3ms |
| boss-node-to-preparation | 4 | 79,5–136,8ms |
| boss-confirm-to-arena | 4 | 292,9–320,2ms |
| boss-return-to-closure | 4 | 34,1–35,4ms |
| owned-loot-open-to-result | 4 | 173,7–213,9ms |
| loot-return-to-closure | 4 | 15,0–27,6ms |
| closure-to-deliberate-preparation | 4 | 16,3–19,1ms |
| explicit-next-expedition-to-map | 4 | 222,2–284,3ms |

La omisión tiene ocho observaciones porque aparece dos veces por expedición. Navegación→entrada utilizable, medida distinta del primer paso, fue232,6–313,6ms; no se llama arranque frío. Los datos conservan por separado respuesta observada, resourceResponseEnd, figuras y final de coreografía cuando están disponibles. No se llama acción→estado utilizable al final de una animación ni se traslada su espera. Los snapshots, semillas, inventario e identificadores de operación no se copian a esta medición. Los archivos de prueba versionados y el artefacto original conservan la procedencia del ensayo.

Los [recorridos históricos de7d74cef](evidence/candidate-7d74cef/connected/expedition-timings.json) conservan navegación→entrada238,1–283,7ms y sus13pasos completos. Entre otros extremos, apertura utilizable194,4–242,8ms, primera confirmación281,9–327,7ms y confirmación del jefe251,4–417,1ms. Los [recorridos de b6d9e3c](evidence/candidate-b6d9e3c/connected/expedition-timings.json) también permanecen. No se sustituyen resultados desfavorables ni se comparan como un antes/después controlado.

## A69 actual · Ventanas finitas y ciclo de vida de b6c0800

[Resumen por cohorte](evidence/candidate-b6c0800/motion/summary.json), [procedencia y hashes](evidence/candidate-b6c0800/motion/provenance.json), [200registros técnicos comprimidos](evidence/candidate-b6c0800/motion/technical-samples.json.gz) y [24geometrías densas comprimidas](evidence/candidate-b6c0800/motion/dense-preparation-geometry.json.gz). Artefacto12235069981 de CI39353793256, checkout135a4fe9. A69 terminó con90casos correctos y42omisiones previstas dentro del job check completo superado; la regresión general del mismo workflow también terminó correctamente.

Se verificaron246JSON con SHA explícito y todos declaran135a4fe9; se seleccionaron224:los200registros de tiempos raíz y24del jefe denso. Se excluyeron18archivos sin SHA explícito y22registros A87 fuera de esta cohorte acotada. No se mezclan resultados sin versión conocida. Las copias conservan solo metadatos técnicos, tiempos, contadores y geometría pública. Se omiten actor/perfil del renderer e identificadores de jugador/operación; no se copian semillas, inventarios o partidas. No se produjo otra captura ni se ejecutó ningún navegador para este análisis.

### Intervalos rAF y long tasks

Los rangos siguientes son mínimos/máximos **entre resúmenes de ventanas**, no un P95 agregado de intervalos. El mínimo de intervalo individual no se guardó y no puede recuperarse; no se inventa. Se incluyen1280×900,390×844 y865×1079, ES/EN y ambos packs cuando la cohorte los contempla.

| Cohorte/motor | Ventanas | Intervalos por ventana | P50rAF entre ventanas | P95rAF entre ventanas | Máximo rAF entre ventanas | Long tasks observadas |
| ------------- | -------: | ---------------------: | --------------------: | --------------------: | ------------------------: | --------------------- |
| Arena Chromium | 36 | 28–39 | 16,7ms | 16,8–66,6ms | 49,9–83,4ms | 36de50–72ms |
| Arena Webkit | 36 | 31–50 | 15–20ms | 31–103ms | 38–117ms | API no disponible |
| Apertura nueva Chromium | 48 | 175–209 | 16,7ms | 16,7–16,8ms | 16,8–33,4ms | 0observadas |
| Apertura nueva Webkit | 48 | 132–213 | 16ms | 20–57ms | 51–132ms | API no disponible |
| Repetida Chromium | 12 | 7–10 | 16,6–16,7ms | 16,7–50ms | 16,7–50ms | 0observadas |
| Repetida Webkit | 12 | 5–8 | 21–65ms | 43–99ms | 43–99ms | API no disponible |
| Controles Chromium | 3 | 110–144 | 16,7ms | 16,8–33,4ms | 66,7–83,3ms | 4de61–83ms |
| Controles Webkit | 3 | 148–165 | 16ms | 41–64ms | 94–156ms | API no disponible |
| Replay cálido Chromium | 1 | 600 | 16,7ms | 16,7ms | 16,8ms | 0observadas |
| Ciclo de vida Chromium | 1 | 982 | 16,7ms | 33,3ms | 66,7ms | 29de53–72ms |

La arena incluye3×3/5×3/5×5. Sus ventanas cortas terminan tras la preparación/reproducción/omisión declarada: no equivalen a diez segundos sostenidos. Las repeticiones tienen muy pocos intervalos; sus percentiles describen esas observaciones, sin estimar una distribución estable. El tramo lifecycle conserva el probe del replay cálido anterior y añade montajes/desmontajes; sus982intervalos no son una ventana aislada de montaje ni muestras independientes de los600anteriores.

El objetivo20ms continúa incumplido en parte de Chromium y en todas las ventanas WebKit de arena; los máximos de P95 son66,6ms y103ms. No se sustituyen por los16,7ms de la única muestra cálida favorable. Controles WebKit alcanzan156ms de intervalo máximo y repetida WebKit99ms de P95 en ventanas pequeñas: se conservan esos resultados desfavorables. No se relaja la aceptación funcional para convertir estas cifras en una optimización demostrada.

Long tasks=null en WebKit significa falta de soporte del observador, **no cero tareas largas**. Una lista vacía en Chromium solo informa que el probe no observó entradas en su ventana. Las duraciones de longtask no son tiempo GPU ni un perfil causal de Pixi/React/red. Ninguna medida disponible aísla CPU pura de decodificación; una espera decode no sirve para inferirla.

### Acciones, cachés y desmontaje

En arena, navegación→escena lista fue243,4–491,2ms Chromium y299–629ms WebKit; omitir→estado utilizable9,4–50,4ms y21–40ms, respectivamente. Son fixtures de presentación, sin comando económico. En aperturas nuevas, activación explícita de presentación→resultado utilizable fue2829,3–3357,9ms Chromium y2542–3526ms WebKit, incluyendo coreografía, recursos y espera automatizada. Inicio del documento→preparación declarada fue40,7–156,5ms y71–158ms: no son tiempos de CPU de decode ni una media de decodificación medida.

Todos los200registros declaran newDocument=true y networkCacheReset=false;168incluyen la condición de primera navegación del contexto (12true/156false), mientras32no la registran. **Ninguno acredita cachés frías controladas**. No se comparan estas duraciones con la confirmación autoritativa de A70 como si fueran la misma acción.

La muestra cálida dura10000ms y registra508draws del contador propio; no incluye el arranque. En los30ciclos se registran seis texturas y3513024bytesRGBAestimados por montaje. La prueba versionada exige tras cada desmontaje cero canvas, todos los hosts retirados destruidos, contador de texturas0 y ticker inactivo. Esas aserciones pasaron; el JSON conserva los contadores montados, no snapshots individuales del proceso GPU tras cada retirada. No acredita ausencia global de fugas, RAM residente, heap tras GC o comportamiento de un dispositivo físico.

### Preparación A85 densa

Los24estados de geometría cubren dos motores×tres tamaños×ES/EN×packs, con Maestría5×5, cinco integrantes propios, diez piezas de equipo y cinco grageas en borrador. Todas las diferencias control→footer son positivas: rango15,75–248px. En390, el mínimo es16,6875px Chromium y15,75px WebKit, ambos ARCANA/ES. Esta cohorte es distinta de A92 del mismo candidato, cuyo mínimo13,6875px se conserva por separado; no se sustituyen unas geometrías por otras.

La [muestra Diagon](evidence/candidate-b6c0800/motion/dense-boss-390-es-diagon.png) y la [muestra ARCANA](evidence/candidate-b6c0800/motion/dense-boss-390-es-arcana.png) conservan figuras, PV/PM, equipo, borradores y confirmación. Son PNG ya generadas en Linux, no prueba temporal. Se inspeccionaron nombres rivales y propios completos, tres objetos de preparación y CTA visible: el anterior corte «Tormenta s» no aparece en estas muestras. El foco cian de Ajustes es un estado de teclado, no decoración permanente. No se declara comprensión ni movimiento observado a partir de las PNG.

### Referencia histórica preservada ·7d74cef

El [resumen anterior](evidence/candidate-7d74cef/motion/summary.json), [200registros crudos sanitizados](evidence/candidate-7d74cef/motion/technical-samples.json.gz), [24geometrías](evidence/candidate-7d74cef/motion/dense-preparation-geometry.json.gz) y [procedencia](evidence/candidate-7d74cef/motion/provenance.json) siguen identificados por checkout165866a6/CI39347774137. Su job check pasó, pero el workflow global se canceló al detener una regresión obsoleta. Registró arena P95 hasta50,1ms Chromium y108ms WebKit, controles WebKit máximo150ms, repetida WebKit P95hasta86ms y lifecycle992intervalos/P9533,3ms; la muestra cálida602intervalos/P9516,8ms formaba parte del probe de lifecycle. Sus mínimos densos9,171875px Chromium/8,25px WebKit y el corte visible «Tormenta s» permanecen en la [PNG histórica ARCANA](evidence/candidate-7d74cef/motion/dense-boss-390-es-arcana.png). No se descartan extremos ni se reetiqueta aquella imagen como corregida. Son ejecuciones no pareadas con variabilidad de host; las diferencias no demuestran por sí solas regresión o mejora causal. La referencia A90 de arena WebKit hasta92ms también conserva esa limitación.

## Regresión final A67 y CI completa ·b6c0800

[Resumen y versiones](evidence/candidate-b6c0800/regression/summary.json), [observaciones sanitizadas comprimidas](evidence/candidate-b6c0800/regression/technical-observations.json.gz) y [procedencia y hashes](evidence/candidate-b6c0800/regression/provenance.json), artefacto12237335982 de CI39353793256. La regresión general terminó con138browser: E2E56, A6724, A6316, A6620, A658, PWA12 y dos pruebas de rendimiento A67 (base/actual). Sumada al job check, **CI completa correcta con743browser,345omisiones previstas,797unitarias y120PostgreSQL/Redis reales**. No equivale a publicación ni integración en main.

### Referencia reconstruida y límites de atribución

Los diez JSON originales seleccionados **no serializan SHA**. Su atribución actual procede del artefacto y job de CI del checkout135a4fe9; no se les añade un SHA embebido ficticio. El informe `current` se ejecuta contra ese runtime. `baseline` utiliza la referencia A66 reconstruida desde commit97573b0d95c027d0192914afcb73d32e74fb23a6, patch SHA256c01f6944b1213af3745523f2c1b2a235c0e01b4ee8f8321ac69c188ee16ba388 y14archivos adicionales cuyos hashes están en el manifest conservado dentro del comprimido. **La referencia reconstruida no es un commit histórico ni el runtime actual.** Builder, servidor de ensayo y configuración versionados fijan esa selección.

Chromium Linux1280×900, un ensayo por variante y acción, en orden base→actual. No son tres pares repetidos ni un orden aleatorizado. La activación se registra en pointerdown; estado utilizable incluye aserciones, recursos visibles y espera decode. Asentamiento espera que terminen las animaciones finitas del contenedor y dos frames adicionales. Es una cota técnica con overhead, no tiempo humano, CPU de decode ni tiempo GPU. El nombre heredado `pact-open-cold` significa primera apertura de la sesión, **sin cachés frías controladas**.

| Acción | Base utilizable / asentado | Actual utilizable / asentado | Máximo rAF base / actual |
| ------ | ------------------------: | --------------------------: | ----------------------: |
| pact-open-cold | 77,0 / 493,6ms | 102,0 / 537,8ms | 66,6 / 33,4ms |
| pact-select-0 | 21,8 / 458,2ms | 32,9 / 482,3ms | 50,1 / 50,1ms |
| pact-open-warm-1 | 38,6 / 943,7ms | 60,9 / 448,7ms | 50,1 / 50,1ms |
| pact-select-1 | 30,8 / 430,4ms | 30,1 / 430,5ms | 33,4 / 50,0ms |
| pact-open-warm-2 | 38,7 / 451,2ms | 66,3 / 460,5ms | 33,4 / 50,0ms |
| pact-select-2 | 24,1 / 430,7ms | 27,8 / 414,0ms | 50,1 / 33,4ms |
| pact-confirm | 193,8 / 232,1ms | 238,1 / 266,2ms | 50,0 / 50,0ms |
| workshop-open | 73,7 / 465,8ms | 74,6 / 214,1ms | 16,7 / 16,8ms |
| forge-quote | 25,6 / 62,4ms | 18,2 / 412,8ms | 16,8 / 16,7ms |

Se conservan los resultados desfavorables: la primera apertura pasa77→102ms utilizable y493,6→537,8ms asentada; confirmar Pacto193,8→238,1ms utilizable; cotizar forja mejora25,6→18,2ms utilizable, pero su asentamiento crece62,4→412,8ms. La apertura cálida1 base asentada943,7ms tampoco se descarta. No se atribuye una causa a esas diferencias ni se declara una mejora general a partir de un único ensayo. El probe observó dos long tasks base (61/63ms) y ninguna actual en sus ventanas; esto no acredita ausencia global de tareas largas. No se guardaron P95rAF ni una media de decodificación pura y no se infieren.

La confirmación incluye consultas autoritativas: `/api/nodes/advance`44,8ms base/58,3ms actual y `/api/state`20,3/23,6ms. Son duraciones de recursos del navegador, no tiempo SQL ni CPU del servidor. No se conservan querystrings, claves de operación, semillas, cuentas, inventarios o partidas.

### Encuentros conectados

Ocho observaciones, ES/EN×packs×dos motores. Cuenta aislada con PV/PM al50% por SQL antes del encuentro; los demás nodos usan API real. Click automatizado→receipt visible296–391ms Chromium (cuatro) y686–1561ms WebKit (cuatro). Incluye autoridad, red y sincronización del runner; no es FPS ni duración humana. Los tres estados geométricos serializados por caso no presentan overflow en esta muestra518×844, con diálogo356×772; no acreditan todos los tamaños del juego ni dispositivos físicos. El extremo WebKit1561ms se mantiene sin sustituirlo por la muestra más rápida.

Los resultados funcionales y los límites de rendimiento se presentan por separado: una CI correcta no implica P95≤20ms en todas las ventanas, percepción satisfactoria del ritmo, lectura humana o ausencia global de fugas. Sesión humana, lector real, dispositivo físico y cachés frías controladas continúan pendientes.
