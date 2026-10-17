# A75 · Matriz de aceptación

Estado técnico: F01–F11 resueltos. Validación combinada con fuente y límites explícitos:

| Ejecución / candidato | Resultado ejecutado | Uso en la entrega |
|---|---|---|
| CI39059090478 /889886d, merge8d38776 | A70/A71/A73, A68 y A69 funcionales correctas; después E2E/A67 fallaron y se canceló el job | Solo regresiones cuyos consumidores siguen iguales. No CI global verde. |
| CI39063046713 /6d4dbcb, mergecbd771c | A75 114 pasadas/174 omisiones previstas, cero fallos/flaky; E2E56/56; después A67 18/20 y cancelación | A75 completa, recuperación/restauración, E2E y perfiles Chromium/WebKit; los dos fallos A67 se conservan y corrigieron. |
| CI39064546905 /6f47559, merge4395489 | **Success**. 599 unitarios/86 archivos;78 integración real/13 archivos; tipos/contenido/build/scan. F05 24/24, A67 20/20, A63 16/16, A66 20/20, A65 8/8, PWA 12/12 y dos perfiles1/1 | Candidato final de producto; único cambio de runtime frente a6d4dbcb son dos márgenes del Encuentro vuelto a probar. Fases reutilizadas figuran skipped, nunca se atribuyen como ejecutadas aquí. |

Merge4395489c9f888eb230ba6334f01eabf0b099374a y head6f47559a73db59b20aab6bbe94ee4d8e7f5c39c7 comparten árbol0d914c647786dfeb5c92eb4a6b06b129a9bc77ea; parents937a0a1+6f47559. El código probado no cambia en la entrega documental, según DELIVERY. Sin reintentos automáticos o navegador local.

| Finding | Comportamiento / prueba pertinente | Fuente de evidencia nueva | Estado comprobado en A75 |
|---|---|---|---|
| F01 sesión |401 con partida conserva propietario/receipt y salida al cerrar inspector; nueva entrada deliberada desmonta formación anterior |game-controller.test, recovery-a75.spec |Unitarios y Linux A75 correctos |
| F02 entrada |POST retenido, doble activación, error y reintento; mutex incluye carga; preflight de intención creada por otra pestaña |trial-entry-a75.test, game-controller.test,recovery-a75.spec |Unitarios y Linux A75 correctos |
| F03 snapshot |Alquimia/Fuego/Sombras y pesos deliberadamente distintos; fallback histórico/vigente, fuente inmutable |preparation-a75.test,preparation-a75.spec |Unitarios y Linux A75 correctos |
| F04 inspector |Error y recuperación en el modal superior, sin otro aviso de preparación; postcommit perdido recupera misma key/unPOST |recovery-notice-a75.test,recovery-a75.spec |Unitarios y Linux A75 correctos |
| F05 instancia |Misma identidad/PV/PM y equipo/procedencia distintos; nombre/preview identifican puesto eID elegidos |preparation-a75.test,preparation-a75.spec |Unitarios, Linux F05 24/24 y A67 20/20 correctos |
| F06 arena |3×3/5×3/5×5,ES/EN×packs×tamaños, figura/nombre/PV visibles; huella proyectada; pares AB/BA/AB sostenidos y controles |arena-a75.spec,arena-performance-a75.spec +A70/A71/A73 |Baseline y candidato medidos; Linux A75 correcto |
| F07 ruta |Consulta futura y conexiones distinguibles, foco al origen, sin POST/avance; lista equivalente |route-inspection-a75.test,map-settings-a75.spec |Unitarios y Linux A75 correctos |
| F08 muchas copias |30 copias, filtro afinidad/identidad, equipo distinto y borradorIDs conservado al swap/idioma |preparation-a75.test,preparation-a75.spec |Unitarios y Linux A75 correctos |
| F09 arte |Fallar solo ambos iconos mapa/lista conserva señal visible y acción |map-settings-a75.spec |Contrastado y reproducido en Linux A75 |
| F10 reducido |4 combinaciones sistema/propio, persistencia, ajuste real durante replay y no reinicio |settings-motion-a75.test,map-settings-a75.spec |Unitarios y Linux A75 correctos |
| F11 tarro |Compra real, stock/borrador, mover/quitar/cancelar, combate único/sabor; respuesta perdida |boss-supplies-a71.test,supplies-a75.spec |Stock0/3 fixture, compra/consumo/recuperación stock real correctos en Linux A75 |

## Selección de la batería

`playwright.experience-a75.config.ts`:6 proyectos Chromium/WebKit×1280×900,390×844,865×1079. Fixtures de preparación y geometría se ejecutan en esa matriz; contratos de sesión/ruta/preferencia/compra se acotan a Chromium390 para no crear una matriz indiscriminada ni superar30entradas/IP/hora por autoridad. Hasta30 sesiones de ensayo propias, no cuenta habitual. Otros proyectos omiten esos casos explícitamente.

La composición5×5 y stats prolongadas del harness A70 son fixtures declaradas, no cambios de campaña. Snapshot con valores11/13/15 y dos pesos es una fixture adversa, no un nuevo balance. Los cuatro recorridos de grageas sí operan contra servidor/PG/Redis sin inyectar inventario.

Baseline39054600466 es una ejecución diagnóstica correcta con tests unitarios/integración/build y una medición de geometría. El modo `full` restaura todas las fases gráficas anteriores y añade A75; mantiene guard/lock/watchdog/un worker/cero reintentos. No confundir skip, baseline o prueba existente con cobertura de ejecución completa.

## Evidencia visual y temporal ejecutada

Dos imágenes densas emparejadas, y cuatro muestras específicas (filtro, Encuentro, ruta, recuperación), opt-in Linux y un proyecto. Sin vídeo/trazas ni capturas automáticas. Las otras suites conservan su selección explícita. Revisar las imágenes del candidato, no aprobar únicamente por aserciones DOM.

Perfil comparativo: tres parejas fijas AB/BA/AB de5×5 móvil ES/Diagon en contextos aislados,500mswarmup+10s sostenidos. Referencia937a0a1 archivada y compilada sin patch del runtime en el mismo runner. Conserva tiempos desde navegación y desde activación de fixture manual por separado, frames con fase/cursor y tareas largas disponibles. El módulo se evalúa antes del clic manual: no es un arranque frío universal de la aplicación. rAF no esGPU. Después se comprueban pausa,2x,inspector,ocultación sintética,omisión y log inmutable.

Reflujo320 con raíz200% se ejecutó en EN/ambos packs, Chromium390 redimensionado: sin overflow horizontal, diez nombres y consulta/foco/log conservados; scroll vertical permitido. No zoom físico ni matriz cartesiana de todos los estados. Arte/renderer se comprueban además en regresiones A70/A69; su resultado correcto y scope reutilizado figuran en la tabla anterior. Fallback de los dos iconos se probó por404 nativo limitado a esas imágenes, incluidos SVG embebidos.

## Comandos locales ya ejecutados

- `npm test`:598/86 correctos, unit-candidate.log.gz.
- `npm run typecheck`:correcto,types-candidate.log.gz.
- `npm run build`:correcto,build-candidate.log.gz (incluye tipos/skin).
- `npm run verify:arcana:build`:correcto,scan-candidate.log.gz.
- Build de fixtures con Vite:correcto,fixture-build-candidate.log.gz.
- Diffcheck de código correcto. Salida CLI raw comprimida sin cambiar bytes para conservar evidencia y evitar tratar espacios finales del logger como código.

No se ejecutó ningún navegador local, servicios de cuenta, capturas, vídeo o perfil en este Mac. Las pruebas dirigidas de agentes fueron unitarias, con susRED/GREEN detallados en los informes respectivos. No se suman repeticiones a un total de cobertura.

## Historial de diagnóstico (estado registrado en cada momento)

Las notas siguientes conservan los fallos y planes de sus candidatos originales. Los estados pendientes de esos registros no sustituyen la tabla de cierre al principio de este documento.

### Diagnóstico previo al candidato siguiente

CI 39058010501/head 6b9878f supera11 casos antes de detenerse en Ajustes: el test consultaba estado inmediatamente tras clic de entrada y obtenía una respuesta sin `state` antes de la cookie. Ahora espera preparación cargada. No se modifica producto ni se interpreta como pérdida de partida. Fuente de error en attempt-7.

Contraste estático adicional de recuperación/consumibles: aviso visible también durante `sending`, por lo que la lectura del commit espera ahora el botón de recuperación habilitado. El starter-kit sí tiene receipt y se verifica entrega única de ese tipo, no una lista vacía ficticia. La ruta de QA puede cruzar tres Pactos/cofres: el test identifica el tarro recién comprado, cuenta stock real y exige consumir exactamente esa unidad una vez; no presupone dos temporales exactos ni que el botín no existe. No cambios de semilla, ruta de campaña, permisos, reglas o cuotas para hacer pasar el test. Cuentas reales siguen siendo≤30 por autoridad; casos0/3 de stock son fixtures sin sesiones.

CI 39058465083/head b594049 se cancela como candidato supersedido, sin atribuirle validación completa. El contraste adicional corrige dos pasos de los tests: esperar que termine nueva entrada explícita antes de leer el jugador y salir de arena por `.arena-exit` antes de abrir Álbum (el dock está plegado allí desdeA63). Sin clic forzado sobre navegación oculta ni cambios de producto. Tipos vuelven a comprobarse antes de subir.

CI 39058565615/head 435a80f supera44 casos A75 antes del primer recorrido de compra. Allí falla el balance de stock esperado por el test: el duelo concede un tarro de botín confirmado además de consumir el comprado. Se comprueba ahora `stockAntes - 1 + grageasDelReceipt`, preservación exacta de las demás instancias anteriores y consumo/activación únicos del ID comprado. No se cambia premio ni se omite el control económico. La salida de arena verifica que desaparece el combate antes de consultar Álbum, válida tanto si la ruta sigue como si terminó. Error en attempt-9. Se conservan además perfiles emparejados de intentos intermedios; no se elige solo un perfil favorable.

## Cobertura y fronteras de las garantías

- Recuperación y compra: servidor real/PG/Redis del job, cuentas propias. La respuesta se pierde deliberadamente después de `route.fetch()`/COMMIT y se recupera porGET/key, con un soloPOST. No corte físico de red.
- Errores de almacenamiento de intención/offline/propietario incompatible se cubren también en controlador con adaptadores de ensayo; no se presentan como averías físicas de IndexedDB.
- Duplicados idénticos y30 copias son fixtures de componentes. El servidor mantiene unitId/copyId; los contratos de Encuentro/recuperación real se ejecutan en integración existente, sin introducir reglas por identidad en UI. No se afirma una cuenta real con30 copias ganadas.
- Reglas históricas sin snapshot y afinidades aún no registradas se contrastan en unitarios/código según COMPATIBILITY; las capturas no demuestran una migración.
- Acciones de ruta consultadas emiten0 POST y conservan estado real. Preferencias sistema/propia4 combinaciones×ES/EN, recarga/swap y cambio durante replay mantienen estado/log.
- Concurrencia económica real y respuesta perdida en integración; preflight de intención de otra pestaña y mismatch en controlador. No exclusión distribuida de dos nuevas entradas vírgenes ni autenticación recuperable entre dispositivos.
- Teclado/foco/toque emulado y reduced comprobados en los casos declarados; lector hablado, dispositivo físico, segundo plano físico y percepción humana pendientes. No certificación WCAG global.

## Correcciones de regresiones antes de reanudar

E2E44passed/12failed: `game-feel`/`hud-results` buscaban antiguo Actualizar estado/Refresh state. Se actualizan al contrato Volver a consultar/Check again y se afirma recuperación sin gasto conservando producto o diálogo, en vez de forzar cierre/reapertura. A67 detectó crecimiento real de selección/preview F05: se compacta posición/origen mediante retrato, badge y etiqueta breve, manteniendo fuente completa accesible/ayuda, todas las cifras y el mismo selector unitId. No se relaja ninguna aserción de ajuste ordinario. Resultado de Linux tras corrección todavía pendiente.

La reanudación39062888256/head a77d8af se canceló durante build, antes de abrir navegador. La revisión estática final demostró que `load()` aceptaba la sesión restaurada conservando un statusError antiguo. Un caso RED reprodujo refresh401→load401→loadválido con aviso caducado persistente. La corrección limpia statusError solo después de respuesta correcta y propietario validado; GREEN38/38dirigidos, tipos correctos. El caso UI inglés restaura únicamente la cookie original de su cuenta aislada y verifica mismo estado/ningúnPOSTdeentrada/aviso desaparecido. No se presenta como autenticación productiva. El siguiente candidato incorpora esta corrección antes de continuar Linux.

## Ajuste final de margen por evidencia WebKit

CI39063046713: A75 114passed/174skipped y E2E56passed; A67 18passed/2failed, solo WebKit ES/Diagon y EN/ARCANA. Nuevo desbordamiento residual864 frente límite863, antes922–947. Se reducen4pxde margin-top de targets y4pxde preview. No fuente menor, recorte, scrollAllowed ni umbral cambiado. Fase tail comprobará F05 en las seis combinaciones motor/viewport y A67 completa, después A63/A66/A65/PWA/perfiles. Sus JSONgeométricos se archivan por primera vez de forma explícita, sin activar capturas automáticas. La ejecución anterior cancelada conserva crudos en evidence/resume-regression-failure; las pasadas A75/E2E/perfiles se conservan con SHApropio.

## Comandos CI del cierre y alcance real

Sobre6f47559: `npm run typecheck`, `npm run validate:content`, `npm test`, `npm run test:integration`, `npm run build`, `npm run verify:arcana:build`; todos correctos. PG16.9 y Redis7 reales en los servicios del job, no doubles. Cada suite gráfica usa `defineSafeConfig` original, un worker y cero reintentos:

- `ARCANA_CAPTURE_A75=1 npx playwright test --config playwright.experience-a75.config.ts`, fase tail:24 casos F05, no A75 completa nueva.
- `npx playwright test --config playwright.progression-a67.config.ts --project chromium-a67 --project webkit-a67`:20/20.
- `npx playwright test --config playwright.gameplay-a63.config.ts`:16/16.
- `npx playwright test --config playwright.header-pact-a66.config.ts`:20/20.
- `npx playwright test --config playwright.intentions-a65.config.ts`:8/8.
- `npm run test:pwa -- --project chromium --project webkit`:12/12.
- `node tools/verification/build-a66-reference.mjs`, después `A67_PERFORMANCE_VARIANT=baseline` y `=current npx playwright test --config playwright.performance-a67.config.ts`:1+1 correctos. Perfil heredado, no un estudio nuevo de economía.

A75 completa/E2E y sus comandos idénticos sobre6d4dbcb se prueban en el log de resume-regression-failure; el nombre del directorio conserva el fallo posterior, no niega esas pasadas. Los artefactos a70/a69 subidos en la ejecución tail proceden del checkout histórico y sus pasos están skipped: **no** se usan como nueva evidencia. Las regresiones realmente ejecutadas y reutilizadas de esas familias son las del run39059090478, con SHA verificado.

A67 final:24 rectángulos, cero overflow. JSON originales sin SHA interno conservados con procedencia del artefacto y hashSHA256 en `tail-final/artifact-provenance.json`. Su spread original sobrescribe width/height de viewport con medidas del diálogo: `a67-geometry-summary.json` recupera por separado el orden fijo1280×900,390×844,865×1079 desde el código del test; no altera ni inventa mediciones. Altura máxima856px; a390,772–784px. Son escenarios declarados con HP/PM50% por SQL en cuentas aisladas, no observación natural de jugadores.

Cobertura representativa, no matriz cartesiana global: consultas/errores de autoridad en Chromium390, composición/fixture en ambos motores y tamaños;3 unidades repetidas de F05,30 copias en filtro, composiciones3×3/5×3/5×5, stock0/1/varios. Lector hablado, dispositivo, zoom físico, falloGPU real, fallo físico de almacenamiento y comprensión siguen pendientes. Warnings de HMR24678 del harness permanecen en el log sin interpretarlos como fallo del juego. Una captura estática solo acredita composición.
