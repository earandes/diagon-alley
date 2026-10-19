# Rendimiento y límites · A89

## Persistencia: cambio medido y acotado

PM14 mide0/100/1.000/5.000receipts ficticios, tres observaciones por escala y versión, PostgreSQL real y agregado de colección constante. Con5.000, mediana del comando1.544,34→22,88ms y5.027–5.029→26consultas. Se conserva la transacción, el lock y el prefijo histórico; no una caché o un borrado de historial. [Método y resultados](PM01-PM14.md).

No mejora universal de lectura: sigue cargando/validando todo el historial; extremo después23,13ms frente18,45ms antes. Estado≈544KB, serialización mediana0,91→1,02ms. Deltas de heap negativos porGC y pico positivo≈33,4MB después conservados: no acreditan ahorro de RAM ni ausencia de fugas. No son cinco mil combates completos. Procesos Vitest separados, mismo Node/herramienta/fixture/servicio; no cachés o arranque frío controlados. El hash del adaptador actual coincide con el medido.

## Respuesta de los objetos nuevos

CI39254029300, checkout3950a2d/head4c85312, Chromium390ESDiagon. Cuatro observaciones de fixture desde antes de activar hasta comprobar estado utilizable:

| Acción | ms |
| --- | ---: |
| Marcar objetivo de colección |41,9|
| Cambiar copia de referencia |13,1|
| Asignar borrador de gragea |13,9|
| Abrir hechos del combate |33,1|

[JSON completo](evidence/final/action-usable-a89.json): cuatro observaciones presentes, sin percentil inferido de una observación. Incluyen protocolo, autowait y assertions; no son latencia pura o duración humana. Estas cuatro consultas no hacen una operación económica remota. La cohorte App conectada acredita navegación y commits reales por separado; sus receipts y consumo son asserts, no un benchmark de red. No se añade una consulta SQL por render. No se atribuye un tiempo de fixture al recorrido completo.

## Recorrido conectado: red, figuras y coreografía separados

La regresión A73 ejecutada dentro de A70 en CI8 conserva cuatro recorridos ES/EN×packs, Chromium1280×900, catorce hitos por recorrido, PostgreSQL/Redis reales y cuenta aislada. La ruta inicial es una fixture fija declarada; no se cambian estadísticas/economía ni se presenta como ruta humana o A/B contra la antigua ruta aleatoria. Se conservan los tiempos de todas las parejas, no solo el mejor.

| Acción | Click→fin de respuesta observado por Resource Timing | Click→escena DOM | Click→figuras o cierre de coreografía |
| --- | ---: | ---: | ---: |
| Primer combate |85,1–95,7ms|184,8–238,3ms|318,4–408,8ms figuras|
| Jefe |85,8–109,9ms|172,9–211,7ms|342,8–443,9ms figuras|
| Abrir rana poseída |63,4–120,9ms|103,7–183,1ms|2.919,3–3.423,4ms coreografía|

La escena DOM visible **no equivale a figuras listas ni al final de la revelación**. La última columna conserva esa espera en el recorrido y no la desplaza fuera de la medida. La apertura mantiene omisión. El coste de red contiene petición, trabajo de servidor y transferencia; no es tiempoSQL puro. Las observaciones/polling dan cotas superiores e incluyen coordinación del test. Ninguna cifra se convierte en tiempo humano o garantía de un dispositivo físico.

[Cuatro proyecciones completas de hitos](evidence/final/journeys/). Mantienen SHA y hash del JSON original, pasos y límites, excluyendo IDs de cuenta, semillas, inventario, run completa y BattleLogs que no son necesarios para este informe. No se modifican sus tiempos. Incluyen entrada, preparaciones, retornos, cierre, uso de botín y confirmación deliberada de otra expedición; los combates se completan mediante omisión explícita. La cohorte nueva A89 sin ruta/resultado forzado está identificada aparte en connected-links-a89.json.

## Arena: comparación reproducible y resultados adversos

Regresión A75 existente, misma fixture declarada5×5/seed/BattleLog,390×844ESDiagon, tres pares AB-BA-AB por motor y ejecución, contextos aislados nuevos. Referencia ejecutable440d278 (predecesor A85/A86), con referencia histórica937a0a1 indicada en el JSON. **No es una nueva ejecución directa del commit A73** ni una demostración de mejora sobre todo su recorrido. Se conservan su marco de medición y el objetivo de ensayo P95rAF≤20ms.

| CI / head | P95rAF actual Chromium | P95rAF actual WebKit |
| --- | ---: | ---: |
|39248125962 /106855f|16,7ms|20–21ms|
|39250400395 /c76cb27|16,7ms|22–23ms|
|39254029300 /4c85312|16,7–16,8ms|20ms|

La última muestra WebKit alcanza20ms, pero **no se declara20ms estables**: las anteriores y sus valores desfavorables permanecen. En CI8 acción→frame listo Chromium actual229,6–247,9ms frente referencia214,1–246,3; WebKit actual323–372 frente320–389. No hay evidencia consistente de mejora de arranque ni atribución causal a la reubicación CSS. Los JSON también conservan intervalos máximos, tareas largas, fases y valores extremos; un máximo grande no se convierte en tiempoGPU.

Los módulos ya estaban evaluados antes del montaje explícito del fixture. Contexto nuevo no equivale a controlar todas las cachés, descarga/decodificación, SO o arranque frío del juego completo. El reloj usa rAF y observaciones de navegador, no GPU. Las promesas decode no son CPU pura y las dimensiones RGBA no son memoria residente. Los contadores propios de recursos no prueban ausencia global de fugas. El incremento mantiene renderer/reloj/arte/audio y no afirma haber resuelto la deuda previa de WebKit.

[Índice y muestras resumidas](evidence/performance/index.json). Los seis ficheros `.json.gz` conservan **todos los bytes originales**, incluidos resultados adversos, con hashes original/comprimido; gzip estándar permite recuperarlos. La compresión reduce peso de evidencia, no elimina observaciones. Las ejecuciones6/7 no fueron workflows correctos: sus mediciones A75 sí se ejecutaron; el fallo posteriorA70 y la cancelación están separados en QA. Resultado del workflow candidato actual en QA.

## Peso, controles y cobertura

Build local final: principal1.160,12kB/gzip355,50kB; Pixi269,91kB/gzip83,72kB. Advertencia de chunk>500KB conservada. Bundle completo no equivale a transferencia efectiva o primera pantalla utilizable. No dependencia, textura, audio, hilo o loop nuevos. La comparación/lectura usa estado existente. El libro tiene sus estilos en la arena para que consumidores aislados no dependan de Ajustes/App.

Sin navegador, capturas nuevas del anfitrión, vídeo o perfil en Mac. Node24.20.0/npm11.19.0 local. Gráficos Linux bajo guard/bloqueo, un worker y cero reintentos; las capturas explícitas seleccionadas no son una grabación. La seguridad y las comprobaciones no se relajaron para obtener cifras. La única adaptación de evidencia local fue copiar/leer imágenes ya generadas en Linux y comprimir JSON sin pérdida.

Las imágenes acreditan composición, no animación. Pausa/2x/omisión/ocultación se acreditan mediante las pruebas temporales y sus resultados por SHA. El detalle final de regresiones, sus omisiones y cualquier interrupción consta en QA. Nada acredita móvil físico, lector real o percepción humana del ritmo.
