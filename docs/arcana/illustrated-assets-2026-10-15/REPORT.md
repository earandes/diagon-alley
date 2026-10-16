# A58 · Ilustraciones Harry Potter y apertura sin el bloqueo anterior

15 octubre 2026. Continuación de implementación autorizada por Enric. [Contrato previo](CONTRACT.md), [control de acabado](QUALITY.md), [galería](GALLERY.md), [pipeline y fuentes](../../../design/diagon-alley/illustrated-v2/README.md).

## Cambio artístico

La familia A57 de personajes vectoriales se sustituye por ilustraciones pictóricas con volumen: luz ámbar lateral, sombras violeta/índigo, telas y metales tratados con la misma dirección que el callejón. Los alumnos, profesores y rivales conservan rostros, edades y vestuario propios. Las tres muestras se inspeccionaron en contexto antes del lote; la dirección fue elegida por el integrador dentro de la delegación vigente. No se atribuye esa selección al propietario.

Los treinta personajes y sus noventa recursos activos están integrados. Son2.461.924bytes WebP; el paquete completo conserva162roles,123propios y39compartidos explícitos. Cada personaje tiene un maestro raster conservado, retrato con fondo pintado para carta, figura con máscara alpha para arena y miniatura centrada en el rostro. No se estiran imágenes. Crops, máscaras y retoques se registran por identidad; los maestros originales y los intentos rechazados permanecen disponibles. Son imágenes planas, sin rig o capas de pintura manual inventadas. No se produce arte durante el juego.

Los cuatro alias genéricos de rivales se alinean con la misma familia Harry Potter; ARCANA conserva su propio arte. Nombres, rareza, estadísticas e IDs persistidos no se alteran. La versión de presentación cambia; la de las reglas no. Las fuentes A57 permanecen históricas y dejan de estar seleccionadas para los personajes del paquete nuevo.

La revisión de calidad incluye errores que no detecta el validador de archivos: recorte de sombreros/coronillas, firma sintética en margen, desviación de estilo y rasgos mal colocados. [Registro y cierre](QUALITY.md). Un crop registrado retiró el margen/firma incidental de Hermione; una capa SVG editable añadió una cicatriz discreta a Harry. Se rechazaron variantes que no cumplían el acabado antes de integrar.

## Producción gratuita y local

MFLUX0.22.0 (MIT), MLX0.32.4 y FLUX.2 Klein4B cuantizado (Apache2.0), modelo de4,62GB con revisión fija, instalados en `.tools/diagon-illustration`. El modelo ofrece [inferencia local en MFLUX](https://github.com/mflux-community/mflux/blob/main/src/mflux/models/flux2/README.md); [repositorio cuantizado](https://huggingface.co/mlx-community/flux2-klein-4b-4bit/tree/860e87183ceb29e39627c0612ebd66d8ea66e68c). Se verificaron también licencia y procedencia del modelo base. Pesos, caché y entorno Python quedan aislados/ignorados por Git; lock, scripts, prompts, seeds y manifests sí se conservan.

Inferencia offline en Metal, sin login, API de generación, créditos, telemetría o subida de imágenes/prompts. RemBG/U²-Net local en CPU realiza segmentación; sus licencias y máscaras quedan registradas. Los PNG generados son nuevos maestros, no un filtro sobre los SVG anteriores. No se importaron fotografías de actores, fotogramas o assets de videojuegos comerciales. Las licencias del software/modelo no acreditan distribución de Harry Potter: esta entrega privada no se publica.

Equipo de producción observado: AppleM3Pro,36GB de memoria; muestra inicial de tres imágenes en101s, pico de unos9,42GB. Los tiempos reales por recurso están en manifests. La generación es trabajo de autoría; los jugadores reciben WebP normales y no necesitan Python, modelo o acceso a IA.

## Corrección del tirón

`FrogMagic` sustituye únicamente la decoración de24 chispas Pixi/GlowFilter por Canvas2D. Dos pequeños sprites con brillo se pintan una vez y se componen por fotograma durante3200ms. Continúan las trayectorias, colores y escala; caja/sello/rana/giro/carta de GSAP permanecen intactos. No hay precalentamiento, espera añadida ni bloqueo desplazado a la compra. Mapa/arena mantienen PixiJS. `pixi-filters` se retiró al quedar sin imports.

Baseline A58 comparable: secuencia completa desde antes de abrir hasta resultado, con rAF, tareas largas y marcas desde la carga de página. A57 había medido solo una ventana de650ms, cuyos FPS medios no se comparan directamente con los de la secuencia completa.

| Motor | Máximo frame anterior | Máximo frame tras corrección | Tareas largas |
| --- | ---: | ---: | --- |
| Chromium, es/en |216,7–233,2ms|16,8ms|Antes231–234ms; después ninguna observada |
| WebKit, es/en |41–44ms|35–37ms|LongTaskAPI no disponible; no se afirma ausencia por esa API |

Pase final compilado con las nuevas pinturas: Chromium60FPS/16,8ms máximo en es/en; WebKit59,53–59,79FPS/35–37ms máximo.16/16 casos correctos, incluidos omisión, reducido y fallo de contexto, idioma/recarga y una sola operación. Canvas2D produjo194dibujos Chromium y191–192WebKit; no es un contador de ticker sin render. Los JSON registran el retrato WebP512×640 servido por el build, además del marco y piezas. Ninguna tarea larga observada en Chromium desde carga/entrada/compra hasta resultado; WebKit no ofrece esa API. El primer pase previo a las pinturas se conserva en `first-pass/` y no se cuenta de nuevo. [Diagnóstico, comandos, JSON y límites](../frog-opening-performance-2026-10-15/TESTING.md). Los datos sitúan el bloqueo en el arranque/primer trabajo de la capa WebGL/filtro anterior; no prueban qué instrucción del driver ocupaba cada milisegundo.

El nuevo efecto cancela rAF al ocultar/desmontar, no acumula tiempo oculto, se detiene al completar y desconecta ResizeObserver/eventos. Si Canvas2D falla, la ilustración y la carta confirmada siguen disponibles. Movimiento reducido no monta el efecto. Economía, RNG y persistencia no participan en esta decoración.

## Integración y comprobaciones

El instalador local rechaza una familia incompleta antes de tocar el paquete. Conserva backup del mapping y copia primero los recursos completos; los metadatos se reemplazan después. El paquete solo recibe dimensiones/alpha/pivote/alt/URL permitidos; prompts/modelos y metadatos de producción no se insertan en el dominio ni en los receipts.

Producción:30maestros/90exports validados en dimensiones, alpha, hashes, pivotes y alt es/en. Selección efectiva por ruta+SHA, máscaras rehechas y correcciones registradas. El error de seguimiento de sufijos MFLUX está documentado y reparado; no se atribuyen los archivos originales a las correcciones posteriores. El integrador revisó las hojas finales completas y los recortes con sombrero. Cuatro casos técnicos de arte en Chromium/WebKit y es/en verifican90decodes, URLs distintas, swap a ARCANA y ausencia de errores JS; capturas de revelación en1280/390px. Un pequeño ajuste de encuadre Diagon evita que el marco corte el sombrero. Las pruebas repetidas durante ajuste de encuadre no se suman como casos nuevos.

Entorno: Node24.20.0, Playwright1.64.0, escritorio AppleM3Pro36GB; procesos/modelos de generación detenidos antes de medir. `npm test`:339/339; `npm run test:integration`:37/37 contra SQL/Redis reales. Tipos/build/ambos paquetes/scanner correctos. Build dual14.237.838bytes/317archivos; los pesos/venv/PNGmaestros no se distribuyen. Vite conserva el aviso conocido de chunk mayor500kB, sin ocultarlo por subir el límite. Los recursos nuevos son2,46MB de ese artefacto, no la descarga obligatoria de cada pantalla.

Verificación de navegador final: **50casos distintos correctos**, por suites separadas:4arte +16apertura compilada +16rediseño compilado +12PWA compilada +2perfiles arena. No se suman reintentos ni los124casos históricos A57; no se afirma una corrida única50/50 o repetición de toda la suite histórica. Apertura cubre normal/omitir/reducido/contexto2Dausente, idiomas, recarga y una operación. Rediseño comprueba mapa/álbum/sabores, swap e igualdad exacta de autoridad. PWA12/12 conserva API fuera de caché y worker restaurado con hash idéntico. [Secuencia ejecutada y evidencia](../frog-opening-performance-2026-10-15/TESTING.md).

Arena:2casos de harness Vite,3tamaños×10s por motor, cinco unidades por lado y diez texturas nuevas342×428. Unos60FPS;P95frame16,7msChromium/19msWebKit,616–629dibujos por10s, pausa detiene dibujos, sin overflow observado. Diez texturas suman5.855.040bytes RGBA decodificados (no memoria GPU total). Es fixture de render, no combate económico compilado ni prueba física. [Perfiles y log](qa/arena/).

Logs versionados: [unitarios](unit-final.txt), [integración](integration-final.txt), [arte](art-browser-final.txt), [opening](qa/opening/browser.txt), [rediseño](qa/game-redesign/browser.txt), [PWA](qa/pwa-browser.txt), [arena](qa/arena/browser.txt), [build](build-final.txt), [scanner](build-scan-final.txt). Sin modificar producción durante las mediciones ni generar arte en paralelo.

[Manifiesto de integración y comparación de cinco hashes](integration-manifest.json): CardReveal.tsx, tabla/config `trial-v1.json` y assets ARCANA idénticos al baseline; FrogMagic y mapping Diagon cambian según alcance. No existe baseline previo de todos los archivos y no se afirma una comprobación hash del repositorio entero. Los asserts de estado/operaciones aportan la evidencia funcional de persistencia.

## Límites de la entrega

Las capturas y fixtures técnicas no son una colección ganada por un jugador ni una prueba con usuarios. La fixture de arte etiqueta sus cromos simulados y no escribe inventario. Las cuentas de los recorridos integrados son aisladas; no se accedió a la pestaña ni estado del propietario en5194. Las métricas son de escritorio, con viewports emulados; no validan teléfono físico, lector de pantalla, retención o aprobación estética del propietario.

Precios, probabilidades, recompensas, migraciones y Word históricos no cambian. El contenido sigue siendo una región y cuatro sabores; A58 termina arte y rendimiento del recorrido existente, sin fabricar progresión adicional.
