# A75 · Matriz de aceptación

Estado de esta edición: código integrado en46a51ec, CI full39055482041 en curso. Actualizar con resultado final, no presentar esta matriz escrita como suite superada.

| Finding | Comportamiento / prueba pertinente | Fuente de evidencia nueva | Estado inicial de entrega |
|---|---|---|---|
| F01 sesión |401 con partida conserva propietario/receipt y salida al cerrar inspector; nueva entrada deliberada desmonta formación anterior |game-controller.test, recovery-a75.spec |Unitarios correctos; Linux pendiente |
| F02 entrada |POST retenido, doble activación, error y reintento; mutex incluye carga; preflight de intención creada por otra pestaña |trial-entry-a75.test, game-controller.test,recovery-a75.spec |Unitarios correctos; Linux pendiente |
| F03 snapshot |Alquimia/Fuego/Sombras y pesos deliberadamente distintos; fallback histórico/vigente, fuente inmutable |preparation-a75.test,preparation-a75.spec |Unitarios correctos; Linux pendiente |
| F04 inspector |Error y recuperación en el modal superior, sin otro aviso de preparación; postcommit perdido recupera misma key/unPOST |recovery-notice-a75.test,recovery-a75.spec |Unitarios correctos; Linux pendiente |
| F05 instancia |Misma identidad/PV/PM y equipo/procedencia distintos; nombre/preview identifican puesto eID elegidos |preparation-a75.test,preparation-a75.spec |Unitarios correctos; Linux pendiente |
| F06 arena |3×3/5×3/5×5,ES/EN×packs×tamaños, figura/nombre/PV visibles; huella proyectada; pares AB/BA/AB sostenidos y controles |arena-a75.spec,arena-performance-a75.spec +A70/A71/A73 |Baseline medido antes de CSS; candidato pendiente |
| F07 ruta |Consulta futura y conexiones distinguibles, foco al origen, sin POST/avance; lista equivalente |route-inspection-a75.test,map-settings-a75.spec |Unitarios correctos; Linux pendiente |
| F08 muchas copias |30copias, filtro afinidad/identidad, equipo distinto y borradorIDs conservado al swap/idioma |preparation-a75.test,preparation-a75.spec |Unitarios correctos; Linux pendiente |
| F09 arte |Fallar solo ambos iconos mapa/lista conserva señal visible y acción |map-settings-a75.spec |Código contrastado; Linux pendiente |
| F10 reducido |4combinaciones sistema/propio, persistencia, ajuste real durante replay y no reinicio |settings-motion-a75.test,map-settings-a75.spec |Unitarios correctos; Linux pendiente |
| F11 tarro |Compra real, stock/borrador, mover/quitar/cancelar, combate único/sabor; respuesta perdida |boss-supplies-a71.test,supplies-a75.spec |Reutiliza componente probado; Linux nuevo pendiente |

## Selección de la batería

`playwright.experience-a75.config.ts`:6proyectos Chromium/WebKit×1280×900,390×844,865×1079. Fixtures de preparación y geometría se ejecutan en esa matriz; contratos de sesión/ruta/preferencia/compra se acotan a Chromium390 para no crear una matriz indiscriminada ni superar30entradas/IP/hora por autoridad. Hasta30sesiones de ensayo propias, no cuenta habitual. Otros proyectos omiten esos casos explícitamente.

La composición5×5 y stats prolongadas del harness A70 son fixtures declaradas, no cambios de campaña. Snapshot con valores11/13/15 y dos pesos es una fixture adversa, no un nuevo balance. Los cuatro recorridos de grageas sí operan contra servidor/PG/Redis sin inyectar inventario.

Baseline39054600466 es una ejecución diagnóstica correcta con tests unitarios/integración/build y una medición de geometría. El modo `full` restaura todas las fases gráficas anteriores y añade A75; mantiene guard/lock/watchdog/unworker/ceroretries. No confundir skip, baseline o prueba existente con cobertura de ejecución completa.

## Evidencia visual y temporal prevista

Dos imágenes densas emparejadas, y cuatro muestras específicas (filtro, Encuentro, ruta, recuperación), opt-in Linux y un proyecto. Sin vídeo/trazas ni capturas automáticas. Las otras suites conservan su selección explícita. Revisar las imágenes del candidato, no aprobar únicamente por aserciones DOM.

Perfil comparativo: tres parejas fijas AB/BA/AB de5×5 móvil ES/Diagon en contextos aislados,500mswarmup+10s sostenidos. Referencia937a0a1 archivada y compilada sin patch del runtime en el mismo runner. Conserva tiempos desde navegación y desde activación de fixture manual por separado, frames con fase/cursor y tareas largas disponibles. El módulo se evalúa antes del clic manual: no es un arranque frío universal de la aplicación. rAF no esGPU. Después se comprueban pausa,2x,inspector,ocultación sintética,omisión y log inmutable.

Texto ampliado, reflujo320 y falta de arte/renderer mantienen límites diferenciados. Lo no observado debe permanecer pendiente, sin inferirlo de una captura o un dataset.

## Comandos locales ya ejecutados

- `npm test`:598/86 correctos, unit-candidate.log.gz.
- `npm run typecheck`:correcto,types-candidate.log.gz.
- `npm run build`:correcto,build-candidate.log.gz (incluye tipos/skin).
- `npm run verify:arcana:build`:correcto,scan-candidate.log.gz.
- Build de fixtures con Vite:correcto,fixture-build-candidate.log.gz.
- Diffcheck de código correcto. Salida CLI raw comprimida sin cambiar bytes para conservar evidencia y evitar tratar espacios finales del logger como código.

No se ejecutó ningún navegador local, servicios de cuenta, capturas, vídeo o perfil en este Mac. Las pruebas dirigidas de agentes fueron unitarias, con susRED/GREEN detallados en los informes respectivos. No se suman repeticiones a un total de cobertura.
