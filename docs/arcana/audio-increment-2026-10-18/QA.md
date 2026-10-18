# A84 · Registro de validación

Baseline main `ac827a0f16085a354793bfe58e27dc441af267db`. Sin navegador, captura o audio reproducido en el Mac. No se toca partida habitual.

## Ejecutado localmente, no gráfico

- `python3 design/audio/a84/compose.py`: nueve recursos originales,1.241.676bytes, manifiesto y fuente editable.
- `python3 design/audio/a84/verify.py`: hashes/formatos/picos/RMS/DC/extremos correctos; resultados en ASSET-QA.json. No prueba calidad percibida o salida física.
- RED inicial de audio: imports todavía inexistentes; no se presenta como assertion de comportamiento fallida. Después ocho casos de preferencias/fases/cancelación/límites/fallos correctos.
- RED funcional PWA: aceptar WAV sin precache falló con la allowlist antigua. Corregida su admisión pública sin incluirlo en precache/arte.
- `npm test`:94archivos,637pruebas correctas, incluidos cuatro casos de semántica ES/EN/swap y la regresión PWA.
- `npm run build`: validación de paquetes, tipos y build correctos. Se conserva advertencia de chunk>500KB; no se afirma que desaparezca el peso anterior.
- Build compilado del harness A84 correcto, sin abrir navegador.
- `npm run verify:arcana:build`: correcto. Artefacto dual privado16.316.807bytes, incluyendo audio. Audio no se descarga automáticamente por formar parte de dist.
- PostgreSQL/Redis: no cambian contratos o código de dominio/servidor. La batería existente vuelve a ejecutarse en CI; no se acredita nueva ejecución local por esto.

## CI pendiente al registrar

Rama `feature/a84-game-audio`, configuración dedicada `playwright.audio-a84.config.ts`. La CI existente ejecuta los mismos tests mediante `playwright.motion-a69.config.ts` y un entry compilado adicional, sin modificar workflows. Linux con guard/lock/watchdog originales, en serie, un worker, sin reintentos. Tres proyectos activos: Chromium390/1280 y WebKit865; las otras tres parejas A69 omiten deliberadamente los casos nuevos de audio y conservan sus pruebas de movimiento. Tres capturas explícitas de Ajustes, no vídeo/trazas. Harness declarado con GameSettings/BattlePanel/runtime reales y BattleLog calculado una vez; no cuenta con recursos económicos. El artefacto existente A69 recoge el subdirectorio nuevo `evidence/linux/a84`, sin sobrescribir evidencia anterior; después se copia a esta carpeta.

El primer push fue rechazado por carecer el OAuth de permiso `workflow`. No se amplían permisos ni se debilitan guardas: se revierte ese cambio propio no publicado y se conecta la cobertura a la batería autorizada existente. El commit local no enviado se recompone antes de subir, sin force-push. La validación numérica de los nueve recursos también queda en una prueba Vitest ejecutada por la CI existente.

Cobertura prevista: cuatro combinaciones idioma/pack por tamaño; opt-in/no fetch inicial, teclado/toque, volúmenes/persistencia, salida de foco, fuentes nativas, pausa/2x/omisión/reducido y log inmutable; decode/mix OfflineAudioContext real y fallo de red recuperable. Regresiones generales sobre build de aplicación en la misma CI. No atribuir resultados hasta disponer del SHA/ejecución.

## Límites

No se ha escuchado la muestra con una persona, ni probado salida física, Safari/iOS físico, altavoces, auriculares, latencia de hardware o balance perceptivo. WebKitLinux no los sustituye. OfflineAudioContext acredita renderizado de muestras numéricas, no lo que llega al oído. Cifras de decode son tiempo de pared incluyendo fetch, no CPU pura; bytesfloat no son memoria residente. No pruebas de diversión/retención.
