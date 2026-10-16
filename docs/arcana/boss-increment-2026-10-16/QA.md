# A70 · Validación técnica prevista y límites

16 octubre 2026. Este documento distingue pruebas preparadas de pruebas ejecutadas. La preparación de esta batería no acredita que sus casos hayan pasado. Root coordina la ejecución serial y registrará SHA, comandos y resultados al terminar.

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

Una muestra Chromium1280 mide arranque nuevo documento y10s de replay cálido, ocho ciclos seriales, texturas y paints. Conserva intervalos rAF y Long Tasks cuando la API existe. No son tiempos GPU ni prueba de memoria total. El cache del sistema operativo no se limpia. Los actores difieren de A69: no se atribuye un porcentaje causal de mejora respecto a aquella referencia.

## Cobertura reutilizada

- A69 mantiene reloj, apertura,5×3/5×5, carga fría, pausa/omisión y limpieza.
- A63 mantiene primer/repetido, rana recuperada tras respuesta perdida, foco, recarga y uso del botín.
- A65 mantiene intenciones y consumibles.
- PostgreSQL/Redis: garantías de jefe, derechos de primera victoria, versiones y operaciones ya existentes; se ejecuta integración real pertinente. Si A70 no cambia contratos de persistencia, las proyecciones se verifican además mediante pruebas puras/SSR, sin inventar operaciones nuevas.
- Los modelos/fichas de hechos A70 comprueban0..2hechos reales, ausencia de causalidad inventada y cierres primera/repetida/derrota/empate. Los escenarios perdidos/empate se identifican como fixtures cuando no se reproduzcan por recorrido real.

## Pendientes que no equivalen a cobertura

Ejecución Linux A70, inspección de los cuatroPNG y resultados de tipos/build/pruebas se registrarán posteriormente. No hay ejecución gráfica local A70. Dispositivo físico, lector hablado, percepción de identidad, comprensión del jefe y satisfacción siguen pendientes. Una imagen estática no demuestra movimiento; los tests de fases y las mediciones tienen un propósito distinto.

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
