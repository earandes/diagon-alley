# A63 · Rendimiento medido

Mac Apple M3 Pro/arm64, Node24.20.0, Playwright1.64.0, Chromium/WebKit headless, preview compilado y autoridad local PostgreSQL/Redis. Emulación de tamaños, no dispositivo físico. Son muestras técnicas, no tiempos o preferencias de personas. Los perfiles dedicados se ejecutaron serialmente, sin otros runners de navegador ni build durante la medición. La regresión funcional con 4 workers no se usa como benchmark.

## Arena: entrada real3×3

Ventana de 8 s iniciada antes de pulsar Iniciar duelo, incluye HTTP y arranque/render. No se precarga en otra pantalla ni se retarda el commit. El desenlace puede seguir reproduciéndose al acabar la ventana; estos8 s no son la duración completa del combate. Misma escena/viewport y máquina en baseline y A63, aunque variación de sistema/caché impide atribuir diferencias pequeñas a una mejora.

| Motor/tamaño | FPS antes→después | P95 frame antes→después | Máximo antes→después | Alto página antes→después |
|---|---:|---:|---:|---:|
| WebKit 1280×900 |60.08→60.21|19→19 ms|28→30 ms|1560→900 px|
| WebKit 390×844 |59.97→60.09|19→19 ms|41→32 ms|2034→844 px|

La mejora demostrada es la composición que cabe y mantiene los actores, no un aumento significativo de FPS. WebKit no soporta la API longtask: `null`, nunca «cero tareas».

Chromium A63:
- 1280 px: 57.24 FPS, P95 16.8 ms, máximo183.4 ms; longtasks[185, 171]. Incluye arranque frío con bloqueos iniciales: no se declara ausencia de tirón de inicialización de arena.
- 390 px: 57.75 FPS, P95 16.7 ms, máximo183.4 ms; longtasks[177, 165]. Incluye arranque frío con bloqueos iniciales: no se declara ausencia de tirón de inicialización de arena.

No hay comparaciónChromium antes/después fiable de este sondeo: una ejecución accidental del perfil al descubrirlo desde la suite general sobrescribió los archivos antesChromium con código actual. Se movieron a `evidence/superseded/current-dev-mislabeled-before/` y se excluyen. La baseline WebKit original, las capturas previas y los378 archivos históricosA62 siguen intactos. La suite general ya excluye perfilesA63; fase por defecto del sondeo esdiagnostic. Este límite no se oculta ni se sustituye por una media inventada.

## Apertura completa: compra y animación vigentes

Prueba `cold-opening.spec.ts`: marca anterior al clic, transacción real, resultado y fin de animaciones. Conserva trazas de frames/contextos/decodes desde navegación para detectar trabajo desplazado. Sin calentamiento ni retraso artificial. 16/16 casos de apertura/skip/reducido/fallback, ambos idiomas/motores (`opening-verified.txt`).

| Motor/idioma | Resultado observado | Ventana hasta asentado | FPS | P95 / máximo frame | Longtasks |
|---|---:|---:|---:|---:|---|
|chromium/es|4423 ms|5727 ms|60.00|16.7/16.8 ms|0|
|chromium/en|4390 ms|6059 ms|60.00|16.7/16.8 ms|0|
|webkit/es|4455 ms|5619 ms|59.95|18.0/38.0 ms|No disponible|
|webkit/en|4425 ms|5594 ms|59.84|18.0/33.0 ms|No disponible|

A62 observó resultado a4560–4605 ms y ventana6449–6496 ms; ahora4389–4455 ms y 5594–6059 ms. Ambas muestras parten de acción y pipeline existente. Rareza y holgura de polling de final difieren: no se atribuye la diferencia de ventana a una optimización, y no se acorta la animación para fabricar una ganancia. El código/arte de apertura permanece sin cambios. FPS y máximos siguen dentro del check existente de 50 ms; Chromium no registró longtasks en esas ventanas, WebKit no ofrece esa API.

## Acciones nuevas desde el input

`action-profile-a63.spec.ts` recorre campaña real y observa preparación/cierre; no simula premios. 3 acciones locales desdepointerdown, espera de DOM/animaciones y dosframes; la rana mide desde inmediatamente antes del clic e incluye el comandoopen-toad y coreografía existente. El tiempo «asentado» contiene polling e instrumentación; no equivale al timestamp preciso del último píxel.

| Acción | Chromium visible / asentado | WebKit visible / asentado |
|---|---:|---:|
|boss-back-to-closure|6.4/417.4 ms|14.0/432.0 ms|
|explicit-next-preparation|8.5/48.8 ms|16.0/50.0 ms|
|owned-bean-to-context|11.3/52.2 ms|15.0/48.0 ms|
|Rana ganada: resultado / fin celebración|4358/5646 ms|4389/5686 ms|

Los conectores son locales y no gastan. El JSON conserva llamadasAPI observadas, incluidas consultas de estado de fondo; no se excluye red para maquillar latencia. Sin baseline equivalente para las superficies nuevas, no se declara una reducción porcentual. 2/2 casos correctos en `actions-verified.txt`.

## Repetir y límites

- Servicios: `npm run services:up`; compilado: `npm run build`.
- Apertura sola: `ARCANA_OPENING_EVIDENCE_ROOT=docs/arcana/gameplay-increment-2026-10-16/evidence/opening npm run test:opening`.
- Acciones solas: `npx --no-install playwright test --config playwright.actions-a63.config.ts`; servidores/namespaces propios5380/5381.
- Arena: iniciar preview **de prueba** con namespace nuevo en un puerto libre y ejecutar `A63_PROFILE_URL=http://127.0.0.1:PUERTO A63_PROFILE_PHASE=diagnostic npx --no-install playwright test --config playwright.profile-a63.config.ts`. No apuntar a la partida habitual ni a la fasebefore para sobrescribir evidencia.

Build dual actual~14.54 MB distribuidos; chunk principal~909 kB minificado, avisoVite de 500 kB vigente. No se ha introducido otra dependencia. Esta entrega conserva carga diferida de renderer/GSAP, pero no prueba redes lentas o rendimiento sostenido en móvil físico. El arranque frío de arena Chromium sigue mostrando tareas largas; optimización posterior puede estudiarlo sin desplazar trabajo al mapa.
