# A84 · Costes y medidas acotadas

Primera muestra válida de audio: CI39122556273, head6570ae1. La CI global falló en dos supuestos de regresión antiguos; estos datos pertenecen a sus nueve casos A84 correctos. El pase final correcto se conserva más abajo. Hardware virtual Linux, no un móvil físico.

| Pareja | Primera activación / siguientes tres, ms | Fetch+decode secuencial de9recursos, ms | Bytes float decodificados |
|---|---|---:|---:|
| Chromium390×844 |199 /121,125,143|80,4|4.965.120|
| Chromium1280×900 |180 /123,131,135|63,0|4.965.120|
| WebKit865×1079 |195 /136,141,142|175,0|4.965.084|

**Método:** la activación es un límite superior de automatización: reloj del driver antes de enfocar/Enter, hasta observar ready mediante polling. Incluye esa sobrecarga y no es la latencia de salida al oído ni una medición exacta de click→sonido. Fetch/decode es tiempo de pared dentro del navegador; incluye red/caché y remuestreo, no CPU pura. Son4muestras por pareja, no una distribución poblacional o unP95universal. Contextos nuevos por test; cuatro combinaciones consecutivas por contexto permiten calentamiento de caché. No se purgan cachés de proceso/OS y no se denomina arranque frío de máquina.

Los buffers del ensayo OfflineAudioContext se remuestrean a48kHz; los36bytes de diferencia WebKit reflejan longitudes de clips redondeadas por el decoder. No son memoria residente, tamaño GPU o prueba de ausencia global de fugas. El presupuesto de origen es2.482.560bytes float a24kHz; descargados1.241.676bytes WAV. Ningún audio se solicita ni decodifica al entrar con configuración silenciosa, comprobado en las tres parejas.

## Límites estructurales comprobados

- Un contexto/pista y nueve buffers máximos por documento; cuatro voces de efectos, sin cola. Las pruebas de doblado y disposición comprueban la propiedad del gestor, no todos los recursos del navegador.
- Música silenciada al ocultar mediante suspensión; las voces se detienen. El replay y sus pausas conservan su reloj original, sin otro rAF de audio. Omisión no recorre ni reproduce efectos atrasados.
- Fuente PCM sin clipping; pico musical aproximado−14,26dBFS, máximo de efectos−11,92dBFS. La cota conservadora a volumen máximo es `0,7 × (picoMúsica + 4 × 0,75 × picoEfectoMáximo) ≈0,67`, menor que1. No demuestra un nivel acústico físico seguro o agradable.
- La instalación PWA excluye los WAV de precache/arte. El coste de su descarga aparece en la activación voluntaria; no se transfiere al arranque anterior para mejorar una cifra.

No se ejecutó un benchmark gráfico sostenido dedicado con audio activo ni un perfil CPU/GPU. Las regresiones visuales generales mantienen sus propias condiciones, normalmente silenciosas; no se les atribuye una demostración de60FPS con música/efectos. La mezcla y los timbres necesitan escucha humana/física posterior. Se mantienen los resultados de carga completos, no solo el motor o muestra más favorable.

La medición A73 corregida utiliza una fixture explícita de ruta semilla0 para conservar victoria/botín bajo las reglas reales. Sus tiempos nuevos no son un A/B emparejado con las rutas aleatorias históricas; no se afirma una mejora de fluidez por cambiar la ruta de ensayo.

## Pase final de audio

CI39128171523/head2330f7b, checkout real4fea2b08; ambos jobs correctos. Los mismos tres pares, mismo protocolo, fuente sonora/código de producto idénticos al primer pase. Se añaden comprobaciones de texto200%después de medir la activación; no se purgan cachés ni se mide latencia de hardware. Alcances y resultados completos en QA.

| Pareja | Primera activación / siguientes tres, ms | Fetch+decode secuencial de9recursos, ms | Bytes float |
|---|---|---:|---:|
|Chromium390×844|167 /117,126,117|57,0|4.965.120|
|Chromium1280×900|181 /120,128,120|52,1|4.965.120|
|WebKit865×1079|**547** /141,144,139|137,0|4.965.084|

Se conserva la primera activación WebKit de547ms, peor que195msdel primer pase. Es el límite superior driver/foco/tecla/polling→ready; no se atribuye a decode, GPU o hardware ni se oculta sustituyéndola por las siguientes muestras. No hubo cambio de código sonoro entre ambos pases. El contexto virtual y las capas de automatización pueden influir, pero aquí no se ha aislado una causa. El estado de carga es visible y no bloquea el juego; no se ha añadido un retraso o precarga antes del consentimiento para disimularlo.

El render offline de curación dio pico0,22739en Chromium y0,22737en WebKit, sin clipping en esa muestra. No es una escucha ni un ensayo acústico de la mezcla completa. Datos íntegros en `evidence/final`; la procedencia es el artefacto A69 de este job, no una captura local.
