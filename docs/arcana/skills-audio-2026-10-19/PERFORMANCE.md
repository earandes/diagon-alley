# Rendimiento y recursos · A88

## Qué se ha demostrado

La preparación original iniciaba hasta 16 cadenas de descarga/decodificación. El test RED retuvo las decodificaciones y observó 16, frente al límite buscado de 2. El código nuevo mantiene dos como máximo por instancia/página, incluyendo trabajo que termina en un contexto anterior. Los seis casos de recursos comprueban consentimiento, descarte, fallo individual, apagado y generaciones superpuestas. Son dependencias de ensayo controladas: no un perfil CPU/GPU del Mac.

Una fuente musical preparada comienza antes de resolver todos los efectos. Tres casos nativos en Linux retienen un WAV opcional y comprueban música activa con estado general todavía en carga, ausencia de voces de efectos y cero efectos atrasados al liberar la respuesta. Mismo gesto, mismos archivos y consentimiento; no se traslada una precarga a otra pantalla.

| CI / fuente | Chromium1280 | Chromium390 | WebKit865 |
|---|---:|---:|---:|
| 39213910504 /06cc89a |244ms|237ms|424ms|
| 39218434156 /28ec176 |254ms|272ms|414ms|

Estas cifras son cotas de pared desde el inicio de la acción automatizada hasta observar la fuente musical. Incluyen actionability, polling y descarga/decodificación. No son latencia de salida acústica, CPU pura de decode, ni una comparación de red humana. El caso artificialmente retenido demuestra independencia, no una promesa universal de rapidez.

## Renuncia y presupuestos

- Se reutilizan los 16WAV: 1.336.064bytes. No se cambia mezcla, duración, formato, pistas o volumen.
- Dos cadenas activas en vez de hasta16; las restantes esperan. Completar todos los efectos puede tardar más. El combate no espera esos recursos ni encola sonidos atrasados.
- El ambiente tiene prioridad al preparar ambos canales juntos. Las solicitudes de una tanda anterior no se interrumpen o reordenan para forzar otra métrica.
- Se conservan cuatro voces de efectos y una musical. La cota PCM conservadora0,8294769 sigue vigente al no cambiar archivos o ganancias. No es una medidaLUFS o escucha física.
- No nuevas texturas, filtros, tickers, renderer, dependencias o assets. Los buffers siguen limitados al catálogo de sonidos de la página; apagar canales/dispose conserva la limpieza existente.

## Arena existente: regresión, no aislamiento del audio

Se conserva la comparación A75:390×844, fixture Maestría5×5, ES/Diagon, tres paresAB–BA–AB, ventanas sostenidas de600rAF/contexto y referencia440d278(A86). No es la referencia inmediata A87 de este incremento y el audio está apagado; no se atribuyen diferencias a A88. Raw de ambas cohortes en evidence, con SHA y protocolo originales.

| Cohorte | Motor | P95rAF referencia | P95rAF candidato |
|---|---|---|---|
|06cc89a|Chromium|16,7 /16,7 /16,8ms|16,7 /16,8 /16,7ms|
|06cc89a|WebKit|22 /23 /22ms|22 /22 /22ms|
|28ec176|Chromium|16,7 /16,8 /16,8ms|16,8 /16,7 /16,7ms|
|28ec176|WebKit|24 /24 /23ms|24 /24 /23ms|

El objetivo absoluto de ensayo P95≤20ms sigue sin cumplirse de forma estable en WebKit. No se afirma una causa GPU ni una mejora de FPS. La comprobación relativa existente pasó en ambas cohortes; no se cambió su fórmula o configuración.

Inicio acción→frame utilizable: en28ec176 Chromium referencia339,8/323,2/337,7 frente a candidato349,2/336,5/340,7ms; WebKit646/396/438 frente a597/564/457ms. Se conservan los valores desfavorables y la variabilidad. No son arranque de sistema/caché fría controlada ni demostración de menor espera de una expedición humana.

## Límites

Sin medición GPU, memoria residente global, latencia de hardware, escucha o dispositivo físico. Los contadores propios no prueban ausencia global de fugas. La captura seleccionada acredita composición estática, no movimiento. No se ha abierto navegador, perfilado, grabado o capturado en el Mac. Linux mantiene guard, bloqueo, watchdog, un worker y cero reintentos automáticos.
