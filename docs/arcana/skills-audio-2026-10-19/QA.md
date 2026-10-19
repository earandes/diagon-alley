# QA A88

Baseline `a74c932b9a0f6d446af057d1d746785504d1a199`. macOS; Node24 y dependencias existentes. No se abrió navegador, ejecutó smoke gráfico, capturó o perfiló en este Mac. CI Linux original serial y fasefull, guard/bloqueo/watchdog/worker1/retry0 conservados.

## Ejecutado localmente

- RED: `npx vitest run tests/domain/arcana/audio-a84.test.ts`:3fallos/9correctos. Concurrencia16, música0 mientras efecto retenido y16requests aldispose, frente a los resultados esperados. `evidence/red-audio.log`.
- GREEN y refuerzos: mismo comando,14correctos. Seis nuevos comportamientos: límitefetch+decode2; ambiente independiente; descarte aldispose; fallo individual sin reintento; apagar efectos conserva solo ambiente; nueva generación no supera límite durantedecodeantiguo. `evidence/green-audio.log`.
- `npm test`:687correctos/109archivos. `evidence/unit-all.log`.
- `npm run build`:validación de ambos packs, tipos principales/worker y buildcorrectos. Warning histórico dechunk>500kB conservado. `evidence/build.log`.
- `npm run verify:arcana:build`:correcto. `evidence/bundle-scan.log`.
- `python3 audit_audio.py`:16WAV activos, imports/manifests/bytes/hash/formato/frecuencia/canales/duración coinciden. `evidence/asset-audit.json`.
- `python3 design/audio/a84/verify.py` y `python3 design/creatures-a87/audio/verify_mix.py`:correctos. Cota conservadora PCM0,8294769, no medidaLUFS/escucha/salidafísica.

## CI por ejecutar antes de integrar

Se añade un caso nativo por cada una de las tres parejas existentes de audio: Chromium1280/390 yWebKit865. Route retiene unWAV opcional, contexto sigue sin existir antes delgesto; ambiente comienza con carga general todavía pendiente, sin cue atrasado al liberar; apagar yEscape conserva foco. Usa WebAudio/archivos reales, no stubdeaudio. Sin screenshots nuevas porA88. El resto deA84/A87 conserva ES/EN/paquetes, pausa/2x/ocultación/omisión, preferencia multitab y fallos nativos.

La batería completa no se atribuirá a unSHA distinto. PostgreSQL/Redis se ejecutan enCI como regresión; el cambio no altera sus contratos. Observación humana, escucha, lector audible y dispositivo físico pendientes. No se declara menorP95rAF o arranque universal a partir del límite de concurrencia. WebKit20–23ms históricos permanecen.

## Primera CI39213910504 ·06cc89a / checkout5c29d3f

Resultado **fallido**. Tipos/build/687unit/111PGRedis y A75 correctos. A70 se detuvo en35correctos/1fallo/101sin ejecutar; A68 pasó12; movimiento/audio pasó90, incluidos3casosA88. Regresiónskipped. No una batería completa superada. Logs y snapshot en `evidence/ci-06cc/`.

El snapshot del fallo muestra «Expedition ended» trasresolvernodo4: no existe mapa que medir. Es un recorrido aleatorio derrotado en una prueba de presentación que requiere llegar aljefe. No se atribuye el fallo aCSS/audio. No se conserva el estado completo de esa ruta aleatoria, por lo que no se reconstruye suseed o el motivo exacto de cada golpe.

Corrección QA: reutilizar el preparador de ruta aislada A73 con una nueva definición seed0A87, comprobada contra grafo/nodos/configuración actuales y con tres órdenes deID propio. Solo modifica elestado no visitado de esa cuenta efímera enPostgreSQLCI, mediante lock/revisión; conserva inventario/stats/reglas/receipts y todos los comandos posteriores reales. A71 se declara fixture=true, no prueba de todas las rutasaleatorias. No cambia producto, dificultad o premios. Se mantiene la aceptación delmapa/arena y se explicita fallo de preparación si el escenario no llega vivo. La nueva ejecución valida esta corrección; no se repite el mismo código para buscar un resultado favorable.

RED de fixture: importación de la definición inexistente (no tests ejecutados), conservado; no se presenta como un fallo semántico deproducto. GREEN:2casos de coherencia y llegada/victoria de lafixture. La anteriorCI mantiene sus fallos y mediciones.
