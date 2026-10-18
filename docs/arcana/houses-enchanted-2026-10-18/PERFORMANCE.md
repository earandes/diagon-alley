# A85 · Rendimiento y límites

## Comparación emparejada conservada

CI39138141861, checkout78af32fbb02a7fec4cc1b5be37510bd2076c15a6, fuente218389c. [Datos crudos de este segundo candidato](evidence/second/paired-mobile-performance.json). Referencia937a0a1f00bdbca7009a80cd99b7b4b450f652f0, ChromiumLinux390×844, ES/Diagon, fixtureMaestría5×5, ordenAB–BA–AB, contextos aislados, módulo de aplicación evaluado antes del montaje explícito. Un único hash de BattleLog en las seis muestras; ambos harness usan el contenido anteriorA84 para que la comparación sea válida.

| Muestra | Acción→frame utilizable(ms) | Navegación→frame(ms) | P95rAF sostenido(ms) | Mayor tarea larga(ms) |
|---|---:|---:|---:|---:|
| Anterior0 |346,5|503,0|16,7|60|
| Actual0 |336,2|505,2|16,7|60|
| Actual1 |341,2|512,8|16,7|62|
| Anterior1 |329,9|485,3|16,7|58|
| Anterior2 |329,8|517,9|16,7|57|
| Actual2 |328,9|470,8|16,8|57|

Cada ventana sostenida tiene600 intervalos; máximo16,8ms. Se conserva el objetivo de ensayoP95≤20ms en esta muestra. No hay mejora uniforme de arranque: mediana acción329,9→336,2ms, dentro de variabilidad y del criterio de regresión vigente. No se vende este incremento como optimización. Las tareas largas57–62ms permanecen.

La primera comparaciónCI39135801556 usaba dos hashes al introducir casas en una sola fixture: quedó invalidada, conservada como fallo y corregida mediante perfil explícitoA84. No se eliminó el assertion ni se atribuye una mejora a dos contenidos diferentes.

## Qué no demuestra

- No son tiemposGPU, CPU pura de decodificación o memoria residente de texturas.
- El módulo ya estaba evaluado al montar. Nuevo contexto no equivale a caché fría controlada; no se afirma arranque frío universal ni se oculta el tiempo de navegación.
- El emparejado protege el runtime existente con contenido anterior. Las casas nuevas y el acabado se comprueban temporal y funcionalmente en el harnessA85; no se atribuyen a esas trayectorias estas600muestras de otro BattleLog.
- Los contadores propios tras desmontaje no demuestran ausencia global de fugas. Se conserva la batería de ciclo de vidaA69 y sus límites.
- CI no representa un teléfono físico, todas lasGPU o percepción de fluidez humana.

## Carga

Build local tras el estante compacto:16.335.769bytes distribuidos, sin dependencia nueva; se conserva el aviso de chunkJS>500KB. Insignias/marco son SVGinline, sin nuevas texturas raster o renderer. No se calcula memoria residente a partir de esos bytes. El reflejo es finito, comparte el timeline de apertura y se omite/reduce sin otra operación económica. La geometría del HUD se observa porResizeObserver; no se mideDOM por frame para encuadrar la ruta.

## Cuarto candidato (conservado aunque falló composición)

CI39140382374, fuente066037c, checkoutee7d89b2b0ae4489f985bf58fa460eebefad6e32. [Crudos](evidence/fourth/paired-mobile-performance.json). Mismo protocolo y un hash, seis ventanas600intervalos. P95rAF16,7–16,8ms; acción→frame anterior246,8/247,0/247,2ms y actual247,7/263,9/280,2ms. No se omite el empeoramiento: mediana247,0→263,9ms. Una tarea larga54ms enActual0. La diferencia entre ejecuciones distintas no se convierte en ganancia; worker/cachés no equivalen a hardware físico controlado. Acción aquí significa montar la escena de fixture, no confirmar una operación económica real.

## Candidato cdc909f · medición A75 actual

CI39146932044, checkout `6b153fb63bcbe4b15f0f5f4ca59775c333970de0`. La etapa A75 ya pasó; el resto de la ejecución continúa al registrar. Mismo protocolo, hash único, seis ventanas de600 intervalos. [Crudos del sexto candidato](evidence/sixth/paired-mobile-performance.json).

| Muestra | Acción→frame(ms) | Navegación→frame(ms) | P95 rAF(ms) | Mayor tarea larga(ms) |
|---|---:|---:|---:|---:|
|baseline0|338.4|490.1|16.7|70|
|current0|321.4|463.3|16.7|56|
|current1|321.7|463.8|16.7|57|
|baseline1|314.2|466.1|16.7|58|
|baseline2|301.9|465.7|16.8|55|
|current2|333.7|487.9|16.7|56|

Mediana acción→frame anterior314,2ms y actual321,7ms: no hay una mejora uniforme de arranque ni se afirma una optimización. Las tareas largas55–70ms siguen presentes. Se alcanza el objetivo sostenido≤20ms en estas seis ventanas; no es una medidaGPU, caché fría controlada, aprobación de hardware móvil o prueba global de ausencia de fugas. El contenido de comparación sigue siendoA84 declarado, no se atribuyen estas600muestras a los perfiles nuevos de casa.

Preparación real del jefe, Chromium390 ES y cuentas de ensayo aisladas, mismo checkout: Diagon acción→DOM471ms/figuras473ms; ARCANA398/462ms. Son cotas superiores instrumentadas del test con polling y carga, no CPU pura, latencia humana o comparación causal entre paquetes. Los JSON de GALLERY conservan los valores y cancelación sin gasto.

## Candidato e352a2e · comparación posterior al estante compartido

CI39150545527, checkout `0ffa2a9a1d8a342bea99982a19b4f730be17c2b2`, etapaA75 correcta. Mismo protocolo de referenciaA84, un hash, seis ventanas600intervalos. [Crudos del séptimo candidato](evidence/seventh/paired-mobile-performance.json).

| Muestra | Acción→frame(ms) | Navegación→frame(ms) | P95rAF(ms) | Mayor tarea larga(ms) |
|---|---:|---:|---:|---:|
|baseline0|317.3|483.9|16.7|54|
|current0|323.1|483.1|16.7|67|
|current1|305.0|459.6|16.7|54|
|baseline1|339.4|496.9|16.8|58|
|baseline2|316.4|476.4|16.8|57|
|current2|307.1|483.2|16.7|56|

Mediana317,3→307,1ms en esta muestra; las anteriores también registraron empeoramientos. No se selecciona esta mejora aislada para declarar una optimización consistente: se mantiene el objetivo sostenido y la variabilidad de arranque, con tareas largas54–67ms. El estante de preparación no cambia la fixture de arena comparada. No es medidaGPU ni hardware físico.

Preparación conectada del candidatoe352a2e, mismo checkout: Diagon DOM430ms/figuras432ms, ARCANA562/573ms. Cotas superiores de cuentas/rutas distintas; no se atribuye su diferencia al pack ni se compara como experimento pareado. Sin gasto al consultar/cancelar y sin errores de página en ambosJSON.

## Candidato eb0c050 · ensayo de presentación corregido

CI39153964079, checkout `b057556dcea4db87f8e3da7984a9151eed5a9d12`; A75 correcto, resto pendiente al registrar. Mismo protocolo/hash único, seis ventanas600intervalos. [Crudos vigentes](evidence/linux/paired-mobile-performance.json).

| Muestra | Acción→frame(ms) | Navegación→frame(ms) | P95rAF(ms) | Tareas≥50ms observadas |
|---|---:|---:|---:|---:|
|baseline0|230.8|342.3|16.7|0|
|current0|228.9|339.9|16.7|0|
|current1|214.1|331.9|16.7|0|
|baseline1|213.8|324.5|16.7|0|
|baseline2|234.5|356.0|16.7|0|
|current2|230.5|355.8|16.8|0|

Mediana230,8→228,9ms, objetivo sostenido≤20ms cumplido en la muestra. No se observaron tareas largas en estas ventanas; las ejecuciones previas sí registraron54–70ms y se conservan. La diferencia entre workers/ejecuciones no prueba que el código haya eliminado esas tareas ni una aceleración estable. La aplicación no cambió frente a e352a2e; solo se corrigió el harnessA85. BuildCI e352a2e:16.336.565bytes, incluyendo el estante compartido, sin dependencia nueva. No son cifras de memoria residente, GPU, dispositivo físico o benchmark de la mecánica de casas.
