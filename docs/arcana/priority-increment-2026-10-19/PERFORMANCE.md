# Rendimiento y límites · A89

## Persistencia: cambio medido y acotado

PM14 mide0/100/1.000/5.000receipts ficticios, tres observaciones por escala y versión, PostgreSQL real y agregado de colección constante. Con5.000, mediana del comando1.544,34→22,88ms y5.027–5.029→26consultas. Se conserva la transacción, el lock y el prefijo histórico; no una caché o un borrado de historial. [Método y resultados](PM01-PM14.md).

No mejora universal de lectura: sigue cargando/validando todo el historial; extremo después23,13ms frente18,45ms antes. Estado≈544KB, serialización mediana0,91→1,02ms. Deltas de heap negativos porGC y pico positivo≈33,4MB después conservados: no acreditan ahorro de RAM ni ausencia de fugas. No son cinco mil combates completos. Procesos Vitest separados, mismo Node/herramienta/fixture/servicio; no cachés o arranque frío controlados. El hash del adaptador actual coincide con el medido.

## Respuesta de los objetos nuevos

CI39261802331, checkout200a92c/head9b2ea61, Chromium390ESDiagon. Cuatro observaciones de fixture desde antes de activar hasta comprobar estado utilizable:

| Acción | ms |
| --- | ---: |
| Marcar objetivo de colección |36,6|
| Cambiar copia de referencia |19,0|
| Asignar borrador de gragea |15,8|
| Abrir hechos del combate |41,8|

[JSON completo](evidence/final/action-usable-a89.json): cuatro observaciones presentes, sin percentil inferido de una observación. Incluyen protocolo, autowait y assertions; no son latencia pura o duración humana. Estas cuatro consultas no hacen una operación económica remota. La cohorte App conectada acredita navegación y commits reales por separado; sus receipts y consumo son asserts, no un benchmark de red. No se añade una consulta SQL por render. No se atribuye un tiempo de fixture al recorrido completo.

## Recorrido conectado: red, figuras y coreografía separados

La regresión A73 ejecutada dentro de A70 en CI10 conserva cuatro recorridos ES/EN×packs, Chromium1280×900, catorce hitos por recorrido, PostgreSQL/Redis reales y cuenta aislada. La ruta inicial es una fixture fija declarada; no se cambian estadísticas/economía ni se presenta como ruta humana o A/B contra la antigua ruta aleatoria. Se conservan los tiempos de todas las parejas, no solo el mejor.

| Acción | Click→fin de respuesta observado por Resource Timing | Click→escena DOM | Click→figuras o cierre de coreografía |
| --- | ---: | ---: | ---: |
| Primer combate |104,4–126,7ms|237,0–295,5ms|398,2–484,2ms figuras|
| Jefe |127,2–175,7ms|232,7–301,6ms|448,3–631,2ms figuras|
| Abrir rana poseída |80,8–101,7ms|129,3–157,3ms|2.974,3–3.488,9ms coreografía|

La muestra CI8 se conserva en evidence/attempt-8/journeys: primer combate85,1–95,7ms red/318,4–408,8figuras y jefe85,8–109,9ms red/342,8–443,9figuras. La última ejecución es más lenta en esos hitos, sin evidencia para atribuirlo a una causa concreta: no se declara mejora por escoger la muestra anterior.

La escena DOM visible **no equivale a figuras listas ni al final de la revelación**. La última columna conserva esa espera en el recorrido y no la desplaza fuera de la medida. La apertura mantiene omisión. El coste de red contiene petición, trabajo de servidor y transferencia; no es tiempoSQL puro. Las observaciones/polling dan cotas superiores e incluyen coordinación del test. Ninguna cifra se convierte en tiempo humano o garantía de un dispositivo físico.

[Cuatro proyecciones completas de hitos](evidence/final/journeys/). Mantienen SHA y hash del JSON original, pasos y límites, excluyendo IDs de cuenta, semillas, inventario, run completa y BattleLogs que no son necesarios para este informe. No se modifican sus tiempos. Incluyen entrada, preparaciones, retornos, cierre, uso de botín y confirmación deliberada de otra expedición; los combates se completan mediante omisión explícita. La cohorte nueva A89 sin ruta/resultado forzado está identificada aparte en connected-links-a89.json.

## Arena: comparación reproducible y resultados adversos

Regresión A75 existente, misma fixture declarada5×5/seed/BattleLog,390×844ESDiagon, tres pares AB-BA-AB por motor y ejecución, contextos aislados nuevos. Referencia ejecutable440d278 (predecesor A85/A86), con referencia histórica937a0a1 indicada en el JSON. **No es una nueva ejecución directa del commit A73** ni una demostración de mejora sobre todo su recorrido. Se conservan su marco de medición y el objetivo de ensayo P95rAF≤20ms.

| CI / head | P95rAF actual Chromium | P95rAF actual WebKit |
| --- | ---: | ---: |
|39248125962 /106855f|16,7ms|20–21ms|
|39250400395 /c76cb27|16,7ms|22–23ms|
|39254029300 /4c85312|16,7–16,8ms|20ms|
|39261802331 /9b2ea61|16,7–16,8ms|22ms|

La muestra final vuelve a22ms en WebKit; **el objetivo20ms no se cumple universalmente**. No se ocultan los valores desfavorables ni se atribuye su variabilidad a un cambio concreto. En CI8 acción→frame listo Chromium actual229,6–247,9ms frente referencia214,1–246,3; WebKit actual323–372 frente320–389. No hay evidencia consistente de mejora de arranque ni atribución causal a la reubicación CSS. Los JSON también conservan intervalos máximos, tareas largas, fases y valores extremos; un máximo grande no se convierte en tiempoGPU.

En CI10 acción→frame listo Chromium actual263,2–283,1ms frente referencia263,4–280,0; WebKit actual377–464 frente382–538. La diferencia entre pares y ejecuciones no acredita una mejora consistente ni un coste causal atribuible a este incremento. Las cuatro observaciones de objetos nuevos del candidato son36,6ms(objetivo),19,0(referencia),15,8(borrador) y41,8(libro), con el mismo protocolo/autoespera/assertions y sin comando económico en esas fixtures. Se conservan las observaciones anteriores, sin elegir solo la más rápida.

Los módulos ya estaban evaluados antes del montaje explícito del fixture. Contexto nuevo no equivale a controlar todas las cachés, descarga/decodificación, SO o arranque frío del juego completo. El reloj usa rAF y observaciones de navegador, no GPU. Las promesas decode no son CPU pura y las dimensiones RGBA no son memoria residente. Los contadores propios de recursos no prueban ausencia global de fugas. El incremento mantiene renderer/reloj/arte/audio y no afirma haber resuelto la deuda previa de WebKit.

[Índice y muestras resumidas](evidence/performance/index.json). Los ocho ficheros `.json.gz` conservan **todos los bytes originales**, incluidos resultados adversos, con hashes original/comprimido; gzip estándar permite recuperarlos. La compresión reduce peso de evidencia, no elimina observaciones. Las ejecuciones6/7 no fueron workflows correctos: sus mediciones A75 sí se ejecutaron; el fallo posteriorA70 y la cancelación están separados en QA. Resultado del workflow candidato actual en QA.

## Peso, controles y cobertura

Build CI10: principal1.160,27kB/gzip355,54kB; Pixi269,91kB/gzip83,72kB. Advertencia de chunk>500KB conservada. Bundle completo no equivale a transferencia efectiva o primera pantalla utilizable. No dependencia, textura, audio, hilo o loop nuevos. La comparación/lectura usa estado existente. El libro tiene sus estilos en la arena para que consumidores aislados no dependan de Ajustes/App.

Sin navegador, capturas nuevas del anfitrión, vídeo o perfil en Mac. Node24.20.0/npm11.19.0 local. Gráficos Linux bajo guard/bloqueo, un worker y cero reintentos; las capturas explícitas seleccionadas no son una grabación. La seguridad y las comprobaciones no se relajaron para obtener cifras. La única adaptación de evidencia local fue copiar/leer imágenes ya generadas en Linux y comprimir JSON sin pérdida.

Las imágenes acreditan composición, no animación. Pausa/2x/omisión/ocultación se acreditan mediante las pruebas temporales y sus resultados por SHA. El detalle final de regresiones, sus omisiones y cualquier interrupción consta en QA. Nada acredita móvil físico, lector real o percepción humana del ritmo.

Composición del tarro enCI10:44px de altura/24px de separación hasta el pie en el caso denso390ESARCANAChromium, comparados con≈113px/≈10px de invasión enCI8. Es geometría/layout, no una medidaGPU o mejora temporal de red. Sin reducción de actores, nombres,PV o información del borrador.

## Regresión A67: referencia histórica reconstruida

El job final ejecutó dos casos separados Chromium1280×900, referencia y candidato; no un estudio repetido ni otra muestraA75. [Resultados y procedencia](evidence/performance/attempt-10/regression-a67/). La referencia reconstruye97573b0+c01f6944 mediante el manifest/patch histórico, no es un commitA66 intacto ni el baselineA89d4a6d36.

Se conservan los nueve hitos de cada variante. Confirmación dePacto: acción→utilizable140,6→257,0ms y asentamiento182,9→282,1ms; consulta de forja15,1→15,4ms utilizable y46,4→413,2ms asentamiento. No se ocultan estos casos más lentos. Sin repeticiones equivalentes no se atribuye una causa o mejora global; las animaciones finitas/asentamiento permanecen en la medida. El nombre histórico `cold` identifica primera visita de la prueba, no cachés completas controladas. No GPU, SQL puro, duración humana o móvil físico. Ambos casos superan las aserciones originales, lo que no acredita uniformemente el objetivo rAF20ms de otra ventana.
