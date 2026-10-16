# A70 · Validación técnica ejecutada y límites

Contrato inicial16octubre; cierre técnico17octubre2026. La batería completa del candidato0189d3a terminó correctamente enCI Linux38977202497. El plan inicial y las iteraciones se conservan abajo como historia, separados del resultado final.

## Cierre técnico ejecutado

[CI38977202497](https://github.com/earandes/diagon-alley/actions/runs/38977202497), head `0189d3aacd44c7130556cda5948758a608b583aa`, merge ensayado `024e88dd21fbb6274a3756133d80043f49014f81`: **completed/success**, sin retries o suites simultáneas. PostgreSQL16.9/Redis7 reales enCI. Localmente se ejecutaron tipos, dominio, integración real, contenido, build/scan y preflight; ningún navegadorA70. [Metadatos originales](evidence/ci-result.json), [resúmenes de consola](evidence/ci-command-results.txt), [artifacts](evidence/ci-artifacts.json).

| Comando real enCI | Resultado |
| --- | --- |
| `npm run typecheck` | Correcto |
| `npm run validate:content` |6correctos |
| `npm test` |542correctos,75archivos |
| `npm run test:integration` |77correctos,13archivos, servicios reales |
| `npm run build` / `npm run verify:arcana:build` | Correctos;14.695.088B de artefacto dual privado; aviso conocido de chunk>500kB |
| `ARCANA_CAPTURE_A70=1 npx playwright test --config playwright.boss-a70.config.ts` |55correctos/5omisiones intencionadas,8,7min |
| `npx playwright test --config playwright.seasonal-a68.config.ts` |12correctos |
| `ARCANA_CAPTURE_A69=1 npx playwright test --config playwright.motion-a69.config.ts` |19correctos/5omisiones intencionadas |
| `ARCANA_TRIAL_COMPILED=1 npm run test:e2e -- --project chromium --project webkit --reporter=line,github` |56correctos |
| `npx playwright test --config playwright.progression-a67.config.ts --project chromium-a67 --project webkit-a67` |20correctos |
| `npx playwright test --config playwright.gameplay-a63.config.ts` |16correctos |
| `npx playwright test --config playwright.header-pact-a66.config.ts` |20correctos |
| `npx playwright test --config playwright.intentions-a65.config.ts` |8correctos |
| `npm run test:pwa -- --project chromium --project webkit` |12correctos |
| `node tools/verification/build-a66-reference.mjs` | Referencia construida |
| `A67_PERFORMANCE_VARIANT=baseline/current npx playwright test --config playwright.performance-a67.config.ts` |1+1correctos; dos comandos separados y seriales |

Las diez omisiones son las muestras sostenidas que solo se ejecutan en un proyecto por suite, no fallos reintentados o recorridos descartados. A70 conserva67fichas JSON y cuatroPNG seleccionados. [Galería](GALLERY.md), [mediciones y presupuesto no cumplido A69](PERFORMANCE.md). Los24recorridos autoritativos son ganadores; los estados primera/repetida/derrota/empate se distinguen en proyecciones y fixtures/contratos existentes. No se afirma una matriz de derrotas reales que no se ejecutó.

La documentación posterior mantiene idénticos los44objetos raíz no documentales del merge ensayado: [prueba de equivalencia](evidence/validated-code-objects.json). Si su push genera otraCI, se informa su estado separadamente y no se confunde con esta ejecución correcta. [Compatibilidad](COMPATIBILITY.md). Main sigue sujeto a autorización posterior.

## Referencia comprobada

Consulta de solo lectura a GitHub: main `f5d3a891d5f5a6c1a69a28b46b8c96de8ead82b8`, CI [38964171860](https://github.com/earandes/diagon-alley/actions/runs/38964171860), estado `completed/success`. Es la referencia A69 anterior al incremento, no prueba de A70.

## Seguridad

`playwright.boss-a70.config.ts` utiliza `defineSafeConfig` sin modificarlo: rechazo de macOS antes de servidores/navegadores, un worker, ejecución serial, bloqueo compartido entre procesos/worktrees, cero reintentos automáticos, vídeo/trazas/screenshots automáticos desactivados. No se lanzan suites desde subagentes. No se abren Chrome, Browser, CUA o scripts de navegador alternativos en este Mac.

La nueva batería usa una preview de aplicación en5470 y una preview estática de fixture en5471; no son suites paralelas. El servidor de aplicación recibe un namespace aleatorio, utiliza PostgreSQL/Redis reales y cada test tiene contexto/cuenta independiente. No se reutiliza sesión personal.

Capturas nuevas: solo Linux y `ARCANA_CAPTURE_A70=1`; únicamente proyecto Chromium1280. Máximo cuatro viewportPNG: preparación, cierre, libro durante lanzamiento confirmado y cuenco durante la misma fase tras swap en pausa. No capturas de toda la matriz, fullPage, vídeo o perfiles continuos.

## Recorrido autoritativo

Seis proyectos: Chromium/WebKit ×1280×900,390×844,865×1079. Cuatro casos ES/EN×Diagon/ARCANA por proyecto; ARCANA utiliza movimiento reducido para comprobar equivalencia. Cuenta nueva → selección explícita → ruta actual → consulta de jefe real desde snapshot → cancelar/foco/igualdad exacta → cambiar idioma sin operar → confirmar → comprobar BattleLog guardado → omitir reproducción → cierre real → recarga sin premios extra → abrir rana ganada sin recobro → cancelar bóveda → consumir una llave → elegir intención viable → consultar/cancelar preparación → iniciar otra run explícitamente.

La ruta usa `preparedRoutePath`, una política técnica que consulta snapshots públicos y simula decisiones para encontrar una ruta viable. No es comportamiento observado de jugador, recomendador de producto ni demostración de que todas las ramas ganen. Los recursos del recorrido proceden de operaciones reales; no se inyectan monedas, premios o victoria.

Se distinguen `actionToDomUsableUpperBoundMs` y `actionToFiguresReadyUpperBoundMs`: desde antes del click de confirmación, incluyendo espera Playwright, comando/commit/API, consulta de estado y aserciones DOM; la segunda espera además `data-art-ready` para las figuras del renderer. Son límites superiores comprobados, no timestamps exactos del primer frame ni coste aislado de decode. Las fixtures miden por separado navegación→arte/overlay listo. No se interpreta como duración humana de combate.

## Fixtures de presentación declaradas

`tests/browser-boss/boss-a70-harness.tsx` usa planes de jefe de `campaign.challengeContent` y reglas actuales. Descubrimiento tiene3rivales; Táctico4; Maestría5. Los jugadores3/5 usan estadísticas explícitamente prolongadas para observar fases: no son balance ni resultados de campaña. El motor resuelve una vez al cargar y el renderer reproduce el registro guardado de fixture. No hay adaptador económico ni API de escritura en la fixture.

Casos: identidad real, todos los actores visibles/sin scroll ordinario, pausa antes de renderer listo, objeto durante spell-cast real del líder, pausa de transformaciones/draws, 2x, pack/idioma sin reinicio del reloj, inspector/toque/foco, ocultación sintética, omisión, desmontaje y contadores propios a cero. También movimiento reducido, texto200%, pérdida de contexto, imágenes ausentes e import fallido con resultado/acciones/registro disponibles.

La ocultación usa una condición sintética Page Visibility para activar el listener real; no prueba una aplicación en segundo plano en teléfono físico. El cambio de idioma/pack en fixture usa controles QA privados; el recorrido autoritativo cambia idioma en Ajustes.

La pérdida de renderer se provoca con un evento `webglcontextlost` controlado que activa la recuperación real; no se derriba un driver/procesoGPU. El aumento de texto usa raízCSS al200%, no zoom nativo de un dispositivo. Toque es emulado. Las peticiones de imagen/importación se abortan de verdad en el contexto de ensayo, sin afectar sesiones ajenas.

Una muestra Chromium1280 mide arranque nuevo documento y10s de replay cálido, ocho ciclos seriales, texturas y paints. Conserva intervalos rAF y Long Tasks cuando la API existe. No son tiempos GPU ni prueba de memoria total. El cache del sistema operativo no se limpia. Los actores difieren de A69: no se atribuye un porcentaje causal de mejora respecto a aquella referencia.

## Cobertura reutilizada

- A69 mantiene reloj, apertura,5×3/5×5, carga fría, pausa/omisión y limpieza.
- A63 mantiene primer/repetido, rana recuperada tras respuesta perdida, foco, recarga y uso del botín.
- A65 mantiene intenciones y consumibles.
- PostgreSQL/Redis: garantías de jefe, derechos de primera victoria, versiones y operaciones ya existentes; se ejecuta integración real pertinente. Si A70 no cambia contratos de persistencia, las proyecciones se verifican además mediante pruebas puras/SSR, sin inventar operaciones nuevas.
- Los modelos/fichas de hechos A70 comprueban0..2hechos reales, ausencia de causalidad inventada y cierres primera/repetida/derrota/empate. Los escenarios perdidos/empate se identifican como fixtures cuando no se reproduzcan por recorrido real.

## Pendientes que no equivalen a cobertura

La ejecución LinuxA70, la inspección de los cuatroPNG y tipos/build/pruebas están registradas en el cierre técnico siguiente. No hay ejecución gráfica local A70. Dispositivo físico, lector hablado, percepción de identidad, comprensión del jefe y satisfacción siguen pendientes. Una imagen estática no demuestra movimiento; los tests de fases y las mediciones tienen un propósito distinto.

## Revisión de cobertura durante la primera CI

El candidato inicialf67830e comprobaba carga del cuenco tras swap, pero no su escala efectiva; la actividad positiva solo se exigía al libro. Antes de declarar completo se amplía el test para observar escalas reales del Sprite ARCANA en la misma fase pausada y retorno a1 al omitir. Se sustituye la captura de desenlace por la del cuenco para mantener el límite de4PNG. No se presenta la inferencia del modelo como prueba ejecutada. La nueva instrumentación/medición requiere candidato y CI propios.

El primer candidato se cancela explícitamente para sustituirlo por el ensayo reforzado: getters de observación serializan objetos vivos (las cadenas guardadas al setup no acreditaban ausencia de mutación), escala real de cuenco, captura ARCANA y medidas DOM/figuras separadas. Se declaran10s por acción y20s navegación enLinux dentro del límite total180s del recorrido; no se modifica ningún control delMac ni se añaden reintentos. Los resultados parciales/cancelados no se consideran una batería superada.

La evidencia parcial deCI38970176308 identifica además un fallo concreto del ensayo: el localizador buscaba un botón hijo de `[data-node]`, pero `MapPanel` coloca `data-node` en el propio botón. Cinco casos de autoridad alcanzaron la posición anterior al jefe y agotaron el límite al enfocar un elemento inexistente; no es una pérdida de partida o fallo del jefe. Se corrige a `button[data-node]`, manteniendo consulta/cancelación/foco y todas las aserciones económicas. Los perfiles de presentación Chromium1280 llegaron a generar evidencia, pero la ejecución cancelada no valida la matriz completa.

La inspección de la imagen parcial de lanzamiento mostró la contradicción de identidad: cabeceraHermione mientras el neutral de la segunda posición seguía usando aspecto/etiqueta de jefe. La presentación nominal deja de aplicar el alias de jefe a sus acompañantes neutrales; legacy todo-neutral conserva su alias. No se cambian IDs/stats/composición. Regresión: roster nominal no muestra el alias genérico, incluida la imagen que recibe Pixi. La imagen parcial no es evidencia del candidato corregido.

## Segunda ejecución y corrección acotada

CI38972486226, candidato2ac0835:24reportes autoritativos completos sinpageerrors y fases/controles de los tres perfiles en ambos motores. Tres casos WebKit no consiguieron forzar el fallo de import tras una navegación que ya había cargado el módulo; la aplicación seguía reproduciendo y no aparecía fallback. No se interpreta ese fallo del ensayo como pérdida del resultado. Se separa import fallido en otro test/contexto nuevo y se exige observar primero una petición interceptada. No se elimina la aserción de fallback o resultado.

Inspeccionadas cuatro imágenes de este candidato: identidad coherente, figuras/PV dentro de escena y piezas de ambos packs registradas. Preparación repetía líder en grande y miniatura, alargando la consulta hasta tapar parte del botín/acciones bajo el footer fijo. Se elimina esa duplicación y se integran acompañantes junto al protagonista; todas las unidades permanecen visibles/consultables. Se añade consulta/cancelación real de preparación desde ese mismo diálogo. Captura de cierre espera únicamente enQA al asentamiento de la animación existente para evaluar legibilidad; no añade demora al juego.

La segunda ejecución se cancela después de recoger evidenciaA70 para corregir antes de repetir regresiones. Se configura parada al primer falloA70 para acortar ciclos defectuosos, sin retries, paralelismo o relajación de aserciones. Una ejecución correcta sigue recorriendo toda la matriz. Las comprobaciones gráficas del nuevo candidato permanecen pendientes.

## Tercera ejecución y revisión visual

CI38974420825, candidato2536b25: el paso A70 termina correctamente en8m48s. Las67fichas JSON contienen24recorridos de autoridad completos,18perfiles de presentación, fallos forzados y la ventana sostenida. El fallo de importación ya se fuerza en contexto nuevo, incluida WebKit. La inspección de los cuatroPNG confirma identidad, piezas registradas y botín legible; sin embargo, el acceso de equipo sigue parcialmente bajo el footer en la captura inicial. Se cancela antes de completar regresiones para corregir ese defecto visual.

La siguiente corrección reduce el emblema de nodo a44px en cabecera, conserva título/coste y da prioridad a la figura real. Los acompañantes respetan el tamaño compacto previsto mediante especificidad CSS acotada al boss. Se añade una aserción inicial: scrollTop0, equipo y resumen de grageas enteros en viewport y por encima del footer. No basta con que Playwright consiga pulsarlos tras auto-scroll. Se conserva [evidencia del defecto](evidence/iteration-2536b25/README.md). La batería completa del nuevo candidato queda pendiente; no se presenta este paso correcto como CI global correcta.

## Cuarta ejecución y precisión de rendimiento

CI38975789073, b1f21b7: A70 correcto y cuatro imágenes inspeccionadas; equipo/grageas ahora íntegros sobre el footer. El registro incluía readiness general y texturas, pero no una observación explícita de recursos de imagen/decode separada. Se refuerza una sola fixture de rendimiento, sin cambio de aplicación: Resource Timing para red y promesa original `image.decode()` observada sin retrasar su ejecución. Los dos intervalos pueden solaparse; la espera desde responseEnd incluye scheduling y no se presenta como CPU del decoder. Los inline no inventan transferencia ni valores cero. Se restauran métodos y observadores al terminar, con límite128registros. Resumen comprobado con caso conocido30ms/15ms y dato ausente null.

Se cancela esta ejecución antes del cierre de regresiones para ejecutar la medición ampliada y la batería conjunta sobre un único candidato final. No es un fallo de juego, cambio de motor o atribución de causa. Los picos de arranque siguen identificados como límite de cobertura. No se abre navegador local ni se relajan guardas.
