# A58: diagnóstico y reproducción de la apertura

15 octubre 2026. Evidencia de navegador técnico de escritorio, en contextos nuevos Chromium/WebKit y PostgreSQL/Redis reales. No sesión humana ni medición de teléfono físico. No se ha accedido a la pestaña o estado del usuario en `127.0.0.1:5194`.

## Cambio acotado

`src/arcana/presentation/FrogMagic.tsx` sustituye la decoración de 24 chispas Pixi/GlowFilter por Canvas 2D. Pinta dos sprites de 28×28 una vez por montaje, con halo radial y núcleo en cruz; cada frame solo compone esos sprites. Conserva los 3200 ms, 24 trayectorias, ángulos, radio, escala, alfa y colores de la decoración anterior. No cambia `CardReveal`, GSAP, tiempos de caja/sello/rana/carta, receipt, economía o persistencia. El brillo radial es una aproximación dibujada localmente, no el shader anterior.

No hay precalentamiento, carga anticipada de contexto, pantalla de espera ni retraso añadido al botón. Se evita crear otro contexto WebGL y compilar el filtro para una decoración pequeña. PixiJS continúa en mapa y arena.

## Diagnóstico antes de editar

A57 había medido una ventana inicial de 650 ms con unos 43,5 FPS Chromium y picos de 183–200 ms. A58 mide **toda la secuencia desde antes de pulsar abrir hasta el resultado estático**, y conserva además frames/tareas desde la carga del documento. Es otro intervalo: los FPS medios de cuatro segundos no se comparan directamente con los de 650 ms.

La primera sonda A58 (`baseline-red.txt`) reprodujo picos Chromium de 233–317 ms y tareas largas de 245–315 ms. Ese primer RED incluía una aserción sobre evitar WebGL; se sustituyó por el comportamiento de cola de latencia para que el criterio no imponga un renderer.

La segunda sonda, `baseline-instrumented-red.txt`, registró las llamadas a crear contexto, compile/link/query de shaders y draws. Fallaron los dos casos Chromium por `maxFrameMs < 50`; los dos WebKit pasaron. Este es el **baseline comparable** de la tabla. Los contextos WebGL tardaron aproximadamente 2–3 ms por llamada; las tareas largas aparecieron después, al iniciar el primer render. Queries individuales de programa tardaron unos 5–6 ms. No hay llamadas explícitas a `HTMLImageElement.decode` en ese recorrido. Estas observaciones acotan el coste al arranque/primer trabajo del pipeline WebGL/filtro; no prueban qué instrucción del driver ocupa cada milisegundo. No se realizó una investigación de drivers ni se atribuyó todo el tiempo a crear el contexto.

## Comparación compilada

Dos idiomas por motor; una apertura fría por caso, misma instrumentación y tamaño 1280×900, suites serializadas y sin generación en GPU simultánea. Cada entrada usa una cuenta técnica nueva y una recompensa real distinta; no presupone identidad fija.

| Motor | Idioma | Máximo antes | Máximo después | Tarea larga antes | Después | FPS medios después |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Chromium | es |216,7 ms|16,8 ms|231 ms|ninguna|60,00|
| Chromium | en |233,2 ms|16,8 ms|234 ms|ninguna|60,00|
| WebKit | es |44 ms|35 ms|API no soportada|API no soportada|60,27|
| WebKit | en |41 ms|31 ms|API no soportada|API no soportada|59,52|

Fuentes completas: `before-{chromium,webkit}-opening-{es,en}.json` y `after-{chromium,webkit}-opening-{es,en}.json`. Incluyen todos los deltas rAF, marcas `welcome`, `commerce`, `purchased`, `open`, `reveal`, `finished`, contextos y duración de llamadas GPU instrumentadas. Las aperturas después duran 4,19–4,23 s, sin recortar coreografía. La tolerancia funcional espera hasta 10 s; no fija una duración de animación de 10 s.

En Chromium después tampoco se registraron longtasks durante carga, entrada, compra o antes del click. Su máximo frame previo a abrir fue 16,7–16,8 ms. WebKit registró máximos previos de 43/34 ms y no dispone de Long Tasks API. Por tanto no se ha desplazado el bloqueo de 200 ms a una fase anterior observada. La sonda verifica que `data-render-count` crece entre dos observaciones de la decoración; el renderer observado después es `canvas2d`.

Son muestras pequeñas de escritorio headless. No acreditan fluidez universal, una distribución percentil de muchos usuarios o un dispositivo físico. La API Long Tasks no permite declarar ausencia de tareas largas en WebKit.

## Fuentes versionables y comandos

- Configuración: `playwright.opening.config.ts`.
- Pruebas/instrumentación: `tests/browser-opening/cold-opening.spec.ts`.
- Implementación: `src/arcana/presentation/FrogMagic.tsx`.
- Evidencia A58: este directorio; no se sobrescriben capturas/perfiles A57.

La configuración crea servidores propios en 5222/5223, namespaces UUID de prueba, un worker y contextos nuevos. Necesita los servicios locales activos (`npm run services:up`). No reutiliza servidores ni cambia sus cuotas. No ejecutar otros benchmarks o generación GPU simultáneamente.

```sh
npm run typecheck
npm run build
npx --no-install playwright test --config playwright.opening.config.ts --reporter=line
```

El baseline anterior al cambio se ejecutó con el artefacto A57 entonces vigente y:

```sh
ARCANA_OPENING_BASELINE=1 npx --no-install playwright test --config playwright.opening.config.ts --grep 'cold complete opening' --reporter=line
```

`ARCANA_OPENING_BASELINE` solo selecciona nombres `before-` para la evidencia; **no restaura la implementación anterior**. No se debe ejecutar sobre la implementación nueva y llamarlo baseline. El artefacto anterior fue sustituido por el build A58 después de registrar esos resultados. Los JSON conservan la evidencia ejecutada.

Las capturas de resultado `captures/{before,after}-*.png` se realizan después de terminar el intervalo de rendimiento. No introducen la operación de captura dentro de la medición. En el primer pase la comprobación visual de la apertura en movimiento quedó prevista para el focal A57 tras integrar el arte, usando `ARCANA_REDESIGN_EVIDENCE_ROOT` y la aceptación `canvas2d|webgl`. Ese pase posterior ya se ejecutó y se registra en la sección final, con capturas en A58 que conservan la evidencia A57 original.

## Pruebas y limpieza

- `typecheck.txt`: aprobado.
- `build.txt`: aprobado; permanece aviso conocido de chunk mayor de 500 kB.
- `after.txt`: **16/16 en 52,8 s**.
- Normal en es/en y ambos motores: apertura real, crecimiento de contador de dibujo, resultado completo, una sola apertura, estado servidor exacto tras animación y recarga; máximo frame <50 ms y cero longtasks donde la API existe.
- Omisión, movimiento reducido y contexto decorativo no disponible en 390×844, es/en, ambos motores: resultado persistido, canvas retirado/ausente, sin segundo comando al cambiar idioma o recargar. Omisión/reducido sin celebración posterior. Fallar el efecto no oculta la carta ni bloquea GSAP.

Inspección estática de ciclo de vida: cada montaje crea un solo rAF a la vez; `visibilitychange` cancela el pendiente, borra el timestamp previo y solo reanuda si queda duración, evitando acumular tiempo oculto como un paso gigante. Al completar se pinta alfa cero y se deja de solicitar frames. El cleanup cancela rAF, desconecta ResizeObserver, retira el listener de visibilidad y elimina el canvas. ResizeObserver solo adapta el backing store al contenedor; la resolución está limitada a 1,5. El fallo al crear contexto/sprite no registra observer/listener/rAF. Los sprites son canvases locales sin caché global, sin recursos WebGL compartidos que destruir.

La pausa de visibilidad y la limpieza de ResizeObserver se han revisado en código; este pase no finge una prueba de pestaña física en segundo plano. El contador sí permanece inmóvil después de omitir o terminar el efecto en las pruebas.


## Verificación final con pinturas A58 integradas

Ejecutada tras la señal del coordinador sobre el build final con 90 pinturas y 4 alias. La evidencia final está separada en `../illustrated-assets-2026-10-15/qa/`; `first-pass/`, baseline y evidencia A57 permanecen intactos. `qa/build-fingerprint.sha256` identifica index/worker usados. Sin otro navegador, generación GPU o build durante las mediciones.

| Apertura completa, build final | es | en |
| --- | ---: | ---: |
| Chromium máximo frame |16,8 ms|16,8 ms|
| Chromium FPS medios |60,00|60,00|
| Chromium renders reales |194|194|
| Chromium tareas largas |0|0|
| WebKit máximo frame |37 ms|35 ms|
| WebKit FPS medios |59,79|59,53|
| WebKit renders reales |192|191|

P95: 16,8 ms Chromium y 19 ms WebKit. Las aperturas duran 4,18–4,23 s. Cero longtasks registradas Chromium desde carga/entrada/compra hasta resultado; máximo frame previo al click 16,7–16,8 ms. WebKit no soporta Long Tasks API; máximo previo 32/29 ms. No se presenta su lista vacía como demostración de ausencia de tareas largas.

Los perfiles finales incluyen `artwork` con URL compilada y dimensiones naturales. Los cromos reales resultantes son WEBP 512×640; caja 768×768 y rana 1024×683. Los nombres de fichero tienen hash del build y no conservan el directorio fuente en la URL. Cada resultado proviene de una apertura real guardada; las identidades aleatorias no se prometen ni se comparan como si fueran una misma recompensa.

La repetición focal A57, también compilada, mide además 650 ms: Chromium ≈60 FPS, máximo 16,8 ms, 40 draws; WebKit 58,46–58,65 FPS, máximo 40–42 ms, 39–40 draws. Transferencia ResourceTiming observada 0,870 MB Chromium / 1,851–1,856 MB WebKit, sensible a caché y worker. Es una ventana y API diferentes del perfil completo; no implica 60 FPS sostenidos en todo hardware.

- `qa/opening/browser.txt`: **16/16**, 51,5 s.
- `qa/game-redesign/browser.txt`: **16/16**, 35,4 s; 38 capturas nuevas, geometría de reveal correcta y mínimo CTA 10,95:1.
- `qa/pwa-browser.txt`: **12/12**, 9,7 s; hashes worker antes/después idénticos y restauración confirmada.

Se inspeccionaron las capturas de resultado Fleur 1280 / Arthur 390, rana saltando con halo Canvas2D en390 y álbum Harry inglés 390: pinturas visibles, carta centrada y contorno sin recortar cabeza/sombrero. Son capturas técnicas con cuentas de prueba, no observación de usuarios ni dispositivo físico. Los casos mantienen igualdad exacta del estado servidor tras idioma/swap/recarga y no duplican la apertura.


Los dos perfiles arena finales también pasan (`qa/arena/browser.txt`, 2/2 en 1,1 min): cinco unidades por lado, diez imágenes distintas de la familia ilustrada 342×428, diez texturas y 5855040 B de píxeles de arte decodificados. Tres muestras de 10 s por motor en 320/390/1280 px: Chromium 60,002–60,003 FPS / P95 16,7 ms, WebKit 60,022–60,042 FPS / P95 19 ms,616–629draws/10s; sin overflow y detener al pausar confirmado. Esta cifra de bytes describe el arte del renderer, no toda la memoria del proceso/GPU. Fuentes: `qa/arena/arena-profile-{chromium,webkit}.json`. El harness es dev y fixture explícito, no se confunde con la apertura compilada/receipt real.

**Cierre final: 46/46 casos** (16 opening + 16 rediseño + 12 PWA + 2 perfiles arena), ejecutados secuencialmente sobre la integración final sin editar producción. Hashes index/worker verificados al terminar en `qa/build-fingerprint-verified.txt`; no hubo rebuild durante PWA. Las 38 capturas A58 nuevas y los perfiles cortos de apertura están en `qa/game-redesign/`, junto al log. Los cuatro perfiles completos y capturas de resultado están en `qa/opening/`. Persisten los límites de dispositivo físico, lectores, interés humano y distribución; no publicación.
