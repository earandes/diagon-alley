# A70 · Validación técnica prevista y límites

16 octubre 2026. Este documento distingue pruebas preparadas de pruebas ejecutadas. La preparación de esta batería no acredita que sus casos hayan pasado. Root coordina la ejecución serial y registrará SHA, comandos y resultados al terminar.

## Referencia comprobada

Consulta de solo lectura a GitHub: main `f5d3a891d5f5a6c1a69a28b46b8c96de8ead82b8`, CI [38964171860](https://github.com/earandes/diagon-alley/actions/runs/38964171860), estado `completed/success`. Es la referencia A69 anterior al incremento, no prueba de A70.

## Seguridad

`playwright.boss-a70.config.ts` utiliza `defineSafeConfig` sin modificarlo: rechazo de macOS antes de servidores/navegadores, un worker, ejecución serial, bloqueo compartido entre procesos/worktrees, cero reintentos automáticos, vídeo/trazas/screenshots automáticos desactivados. No se lanzan suites desde subagentes. No se abren Chrome, Browser, CUA o scripts de navegador alternativos en este Mac.

La nueva batería usa una preview de aplicación en5470 y una preview estática de fixture en5471; no son suites paralelas. El servidor de aplicación recibe un namespace aleatorio, utiliza PostgreSQL/Redis reales y cada test tiene contexto/cuenta independiente. No se reutiliza sesión personal.

Capturas nuevas: solo Linux y `ARCANA_CAPTURE_A70=1`; únicamente proyecto Chromium1280. Máximo cuatro viewportPNG: preparación, cierre, objeto durante lanzamiento confirmado y desenlace. No capturas de toda la matriz, fullPage, vídeo o perfiles continuos.

## Recorrido autoritativo

Seis proyectos: Chromium/WebKit ×1280×900,390×844,865×1079. Cuatro casos ES/EN×Diagon/ARCANA por proyecto; ARCANA utiliza movimiento reducido para comprobar equivalencia. Cuenta nueva → selección explícita → ruta actual → consulta de jefe real desde snapshot → cancelar/foco/igualdad exacta → cambiar idioma sin operar → confirmar → comprobar BattleLog guardado → omitir reproducción → cierre real → recarga sin premios extra → abrir rana ganada sin recobro → cancelar bóveda → consumir una llave → elegir intención viable → consultar/cancelar preparación → iniciar otra run explícitamente.

La ruta usa `preparedRoutePath`, una política técnica que consulta snapshots públicos y simula decisiones para encontrar una ruta viable. No es comportamiento observado de jugador, recomendador de producto ni demostración de que todas las ramas ganen. Los recursos del recorrido proceden de operaciones reales; no se inyectan monedas, premios o victoria.

La latencia `actionToUsableArenaMs` se mide desde el inicio del comando UI de confirmación hasta arena utilizable con actores comprobados; incluye API real, guardado, respuesta, React y carga. No se interpreta como duración humana de combate.

## Fixtures de presentación declaradas

`tests/browser-boss/boss-a70-harness.tsx` usa planes de jefe de `campaign.challengeContent` y reglas actuales. Descubrimiento tiene3rivales; Táctico4; Maestría5. Los jugadores3/5 usan estadísticas explícitamente prolongadas para observar fases: no son balance ni resultados de campaña. El motor resuelve una vez al cargar y el renderer reproduce el registro guardado de fixture. No hay adaptador económico ni API de escritura en la fixture.

Casos: identidad real, todos los actores visibles/sin scroll ordinario, pausa antes de renderer listo, objeto durante spell-cast real del líder, pausa de transformaciones/draws, 2x, pack/idioma sin reinicio del reloj, inspector/toque/foco, ocultación sintética, omisión, desmontaje y contadores propios a cero. También movimiento reducido, texto200%, pérdida de contexto, imágenes ausentes e import fallido con resultado/acciones/registro disponibles.

La ocultación usa una condición sintética Page Visibility para activar el listener real; no prueba una aplicación en segundo plano en teléfono físico. El cambio de idioma/pack en fixture usa controles QA privados; el recorrido autoritativo cambia idioma en Ajustes.

Una muestra Chromium1280 mide arranque nuevo documento y10s de replay cálido, ocho ciclos seriales, texturas y paints. Conserva intervalos rAF y Long Tasks cuando la API existe. No son tiempos GPU ni prueba de memoria total. El cache del sistema operativo no se limpia. Los actores difieren de A69: no se atribuye un porcentaje causal de mejora respecto a aquella referencia.

## Cobertura reutilizada

- A69 mantiene reloj, apertura,5×3/5×5, carga fría, pausa/omisión y limpieza.
- A63 mantiene primer/repetido, rana recuperada tras respuesta perdida, foco, recarga y uso del botín.
- A65 mantiene intenciones y consumibles.
- PostgreSQL/Redis: garantías de jefe, derechos de primera victoria, versiones y operaciones ya existentes; se ejecuta integración real pertinente. Si A70 no cambia contratos de persistencia, las proyecciones se verifican además mediante pruebas puras/SSR, sin inventar operaciones nuevas.
- Los modelos/fichas de hechos A70 comprueban0..2hechos reales, ausencia de causalidad inventada y cierres primera/repetida/derrota/empate. Los escenarios perdidos/empate se identifican como fixtures cuando no se reproduzcan por recorrido real.

## Pendientes que no equivalen a cobertura

Ejecución Linux A70, inspección de los cuatroPNG y resultados de tipos/build/pruebas se registrarán posteriormente. No hay ejecución gráfica local A70. Dispositivo físico, lector hablado, percepción de identidad, comprensión del jefe y satisfacción siguen pendientes. Una imagen estática no demuestra movimiento; los tests de fases y las mediciones tienen un propósito distinto.
