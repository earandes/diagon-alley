# A74 · Evaluación B independiente: implementación y cobertura

> Contraste posterior del coordinador: el registro consolidado [FINDINGS](FINDINGS.md) prevalece para implementar. B06 se acepta **solo para mapa/lista**: el fallback de Ajustes ya existe en `game-stage.css:1159–1175` y esa mitad se descarta. Este apéndice conserva la evaluación independiente original, no una instrucción de rehacer Ajustes. La puntuación ordinal inferior no se adopta como nota global del juego.

17 octubre de 2026. Evaluación estática independiente sobre `937a0a1f00bdbca7009a80cd99b7b4b450f652f0`. Fase documental: ninguna corrección, asset, suite, servicio, navegador, captura nueva, commit o push. Se leyeron AGENTS, contrato A74 y la skill local Impeccable con su referencia audit; el coordinador ya ejecutó context. Este informe se termina sin consultar la evaluación A.

## Veredicto de integridad

**Aprobado con reservas para coherencia de implementación; no es aceptación integral del juego.** La separación entre consulta, borrador y comando confirmado está expresada en código. Los packs resuelven nombres/arte sin escribir estado económico (`content-packs/active.ts:62–76`); el controlador reclama una operación antes de enviarla (`application/client/game-controller.ts:143–182`); arena y mapa consumen estado/log confirmados. El núcleo no se sustituye por animación. La lista equivalente y los diálogos nativos son una base real, no solo decoración.

Hay defectos de comunicación/recuperación y riesgos acotados en estados menos transitados. El más importante es ocultar `UNAUTHORIZED` cuando todavía existe `game`: puede dejar la pantalla sin una explicación ni una salida general de recuperación. Los demás findings requieren prioridad posterior según los estados que se quieran aceptar; no justifican reabrir economía ni rediseñar el motor.

## Método y límites de la evidencia

- **Hecho de código:** lectura de App, navegación, mapa, preparación, inspector/equipo, arena, tienda/forja/bóveda, colección, Ajustes, packs y orquestador. Las ubicaciones `archivo:línea` son del baseline de este informe; rutas de presentación abreviadas desde `src/arcana/presentation/`.
- **Ejecutado ahora:** una única ejecución no gráfica del detector. La carpeta presentation tenía 538 archivos; se acotó a seis archivos, sin escanear recursivamente todo el árbol. Comando: `.agents/skills/arcana-impeccable/scripts/impeccable detect --json src/arcana/presentation/App.tsx src/arcana/presentation/MapPanel.tsx src/arcana/presentation/ExpeditionPreparation.tsx src/arcana/presentation/BattlePanel.tsx src/arcana/presentation/CommercePanel.tsx src/arcana/presentation/CollectionPanel.tsx`. Exit 0, stdout `[]`, stderr vacío: [detector.json](detector.json), [detector.log](detector.log).
- **Reutilizable:** CI Linux 39038639396, merge `8541ee2c9fbf3844d5df0f433945113fd96bd7c0`, head `eb5ce91`. `git diff --stat 8541ee2c -- src tests .github package.json package-lock.json` no muestra diferencias en estos ámbitos. Se contrastan los reports A73 y las configuraciones actuales; no se atribuye otra ejecución de CI a main937a0a1.
- **No ejecutado ahora:** pruebas, renderizado, medición de contraste, emulación táctil, lector audible o uso humano. Ningún finding se presenta como incidente observado en la cuenta habitual. La deducción a partir de ramas de código se etiqueta como tal.
- **Detector:** no produjo findings que validar ni falsos positivos concretos. Tampoco inspeccionó CSS, estados de red, contratos de reglas, capturas o árbol accesible de runtime. `[]` no demuestra ausencia de bugs, accesibilidad AA ni excelencia artística.

## Health Score técnico orientativo

Escala ordinal 0–4 pedida por audit, aplicada al alcance leído y evidencia reutilizada. No son porcentajes de cumplimiento ni certificación WCAG. Incertidumbre alta en percepción/lector/dispositivo físico.

| Dimensión | Nota | Motivo y límite |
|---|---:|---|
| Accesibilidad | 2/4 | Botones, etiquetas, skip-link, foco y diálogos reales; faltan aceptación audible y matriz de recuperación dentro de modales. B01/B04/B05. |
| Rendimiento | 3/4 | Lazy renderer, destrucción/cancelación y publicación por fases; A73 conserva evidencia favorable y desfavorable. Sostenido WebKit y dispositivo físico pendientes. |
| Theming | 3/4 | Pack intercambiable, paleta y nombres en binding vivo; abundan colores locales intencionales del material teatral. No se exige modo claro adicional. |
| Responsive | 3/4 | ResizeObserver, layout adaptativo, diálogos acotados y regresiones 390/865/1280; 44px es objetivo de comodidad, no umbral AA. Sin aceptación física integral. |
| Integridad de implementación | 3/4 | Fronteras de autoridad conservadas y detector limpio en alcance acotado; B02/B03 requieren corrección o aceptación explícita posterior. |
| **Total** | **14/20** | **Good según la escala de la skill; resolver estados débiles antes de ampliar claims.** |

## Findings para una fase posterior

Conteo: **0 P0, 1 P1, 6 P2, 0 P3**. P1 significa impacto relevante en el estado descrito, no frecuencia conocida. No hay explotación, pérdida de inventario ni corrupción demostrada en esta evaluación.

### B01 · P1 · Sesión no autorizada queda excluida de la recuperación general

**Estado y evidencia.** Después de una partida cargada, una acción cuya sesión haya expirado devuelve 401 en `infrastructure/http/trial-gateway.ts:67–69` (TTL siete días en :11). Un rechazo definitivo conserva `game`, marca `status:'error'`, limpia `pending` y conserva el error (`application/client/game-controller.ts:218–240`). `App.tsx:471` excluye expresamente `UNAUTHORIZED` del banner general, mientras la entrada/creación de sesión solo existe cuando `!game` (:423–438). Fuera de un modal, no se ofrece ahí el error localizado `errorSession` que sí existe en `operation-error.ts:21–23`.

**Clasificación.** Defecto determinado por las ramas de código; no reproducido en navegador ahora. Un modal abierto puede mostrar su propio error y algunas superficies pueden ofrecer acciones auxiliares; eso no resuelve el camino general tras cerrar el modal. La recarga manual puede devolver la bienvenida. No se afirma pérdida de la cuenta.

**Impacto.** Acciones deshabilitadas sin causa visible o recuperación general, especialmente después de cerrar la confirmación fallida. Categoría: integridad/errores y accesibilidad de estados. No se certifica un incumplimiento WCAG por lectura estática.

**Propuesta.** Presentar el estado de sesión de forma uniforme en la capa global y separar reintento, recuperación de operación pendiente y entrada a una nueva sesión. No crear una cuenta nueva silenciosamente ni descartar operaciones del player anterior.

**Aceptación futura.** Desde mapa, tienda y colección, expirar/revocar una sesión propia y provocar lectura/acción. Error ES/EN visible y anunciado, acción siguiente identificable, navegación/teclado utilizables. Con operación incierta, mantener su clave y player; reentrada no confirma ni migra recursos de otra cuenta. Verificar que cerrar un modal no elimina la única salida. `/impeccable harden`.

### B02 · P2 · La creación de sesión carece de exclusión mientras espera la respuesta

**Estado y evidencia.** `App.tsx:327–341` inicia POST sin estado/ref de entrada en curso; el botón solo consulta `state.status === 'loading'` (:431). Tras el 401 inicial ese estado puede ser error y permanece igual mientras espera el POST. El gateway reutiliza una cookie ya recibida, pero dos peticiones iniciales sin cookie pueden crear dos IDs distintos (`trial-gateway.ts:41–55`). `GameController.busy` serializa `load`/comandos, no este fetch externo.

**Clasificación.** Riesgo de concurrencia demostrado en estructura; no se ejecutó doble clic ni se observó una cuenta duplicada ahora. No se atribuye duplicación de premios a una misma cuenta.

**Impacto.** En red lenta, clics repetidos pueden gastar cuota de entrada y hacer que la cookie final y el primer load correspondan a respuestas distintas. Falta feedback inmediato durante esa espera. Categoría: pending/integridad.

**Propuesta.** Un único intento activo de entrada con feedback desde el primer clic y liberación al terminar/error; conservar la política de recuperación de sesión existente.

**Aceptación futura.** Retener la respuesta de `/api/trial/session`, pulsar dos veces/Enter repetido: un POST activo, indicador inmediato localizado y control bloqueado. Liberar en éxito/fallo; permitir un nuevo intento deliberado. Contrastar cookie/player que carga el controlador y no usar la cuenta habitual. `/impeccable harden`.

### B03 · P2 · La previsualización de sinergias usa reglas vivas, aunque la ruta tenga snapshot

**Estado y evidencia.** `ExpeditionPreparation.tsx:458–463` siempre pasa `content.combatRules` a PreparationSynergies. `PreparationSynergies.tsx:19–20` y `contextual-preparation.ts:69–80` calculan los valores visibles con esas reglas. El avance autoritativo usa `original.campaignSnapshot ?? this.configuration()` (`application/run-use-cases.ts:298`), y la propia confirmación de nodo sí usa `run.campaignSnapshot?.combatRules ?? content.combatRules` (`App.tsx:657`).

**Clasificación.** Divergencia de fuente de verdad confirmada estáticamente; el efecto numérico es condicional a que cambien las reglas vivas respecto del snapshot. No se ha probado que una partida existente del usuario tenga esa divergencia. No cambia el combate autoritativo.

**Impacto.** Una ruta antigua puede anunciar curación/quemadura/iniciativa distintas de las que aplicará el combate, debilitando la preparación táctica. Categoría: integridad UI/reglas.

**Propuesta.** Resolver las reglas efectivas de la ruta para la proyección, con fallback explícito para rutas sin snapshot; conservar reglas vivas para una expedición nueva.

**Aceptación futura.** Fixture con snapshot cuyos tres valores difieran del contenido vivo: resumen y detalle de preparación reflejan snapshot; nuevo inicio refleja contenido actual. Repetir ES/EN y ambos packs, sin mutar estado/snapshot. Comprobar que equipo/afinidades de miembros ya registrados conservan su fuente vigente. `/impeccable harden`.

### B04 · P2 · Fallos de equipamiento pueden quedar detrás del inspector modal

**Estado y evidencia.** La consulta de personaje abre un `<dialog>.preparation-inspection` (`ExpeditionPreparation.tsx:262–273,576–660`) y permite equipar dentro de él (:645–654). PreparationGear solo recibe ready y onEquip; no tiene error/pending/recovery propios (:26–40,93–98,132–140). El error y la recuperación se pintan fuera de ese inspector, al final del diálogo de preparación (`App.tsx:967–971`) y en la capa global (:471–491). Con el inspector en top-layer, esas superficies quedan fuera del modal activo.

**Clasificación.** Riesgo de percepción/acceso derivado de la estructura modal; no probado con lector o red fallida ahora. La persona puede cerrar el inspector y recuperar: existe workaround.

**Impacto.** Si el guardado falla o queda incierto, la selección se deshabilita sin una explicación/acción de recuperación dentro del contexto que la persona está operando. Categoría: errores/pending/accesibilidad.

**Propuesta.** Mostrar el estado y la recuperación pertinente dentro del modal superior, o cerrarlo de forma controlada llevando foco al error. Evitar anuncios duplicados y no interpretar cerrar como cancelar un commit ya iniciado.

**Aceptación futura.** Abrir preparación→inspector→equipar; cubrir rechazo antes de commit, respuesta perdida después de commit, offline y CLIENT_STORAGE. Mensaje/estado/acción alcanzables con teclado dentro del contexto activo, foco estable y mismo receipt al recuperar; no hace falta salir a ciegas del inspector. ES/EN×packs. `/impeccable harden`.

### B05 · P2 · La lista equivalente no comunica relaciones de ramificación

**Estado y evidencia.** `MapPanel.tsx:157–160` muestra todos los nodos en orden inverso mediante el mismo botón. Los nombres/estados incluyen tipo, visited/available/locked y un hint (:84–143); los nodos no exponen en ese listado fila, posición, procedencia o destinos. En la escena, la relación se expresa con layout/edges y trazados visuales (:60–62,196–216), sin equivalente textual de esas relaciones.

**Clasificación.** Hecho estructural con riesgo de comprensión; las acciones disponibles sí son equivalentes. No se afirma que los jugadores se pierdan ni un fallo WCAG demostrado.

**Impacto.** Dos duelos o cofres del mismo tipo pueden sonar iguales, y la lista permite actuar pero da menos apoyo para planificar una rama que la escena. Categoría: accesibilidad/arquitectura de información.

**Propuesta.** Añadir identificación localizada y relaciones mínimas a la lista accesible, sin mostrar semilla/datos internos ni convertir el mapa principal en una tabla textual. Mantener descubrimiento y reglas existentes.

**Aceptación futura.** Ruta con dos opciones del mismo tipo: nombres distinguibles, estado y consecuencias/relaciones elegibles consultables por teclado/lector; seleccionar desde lista abre el mismo nodo que desde escena y cancelar conserva estado. ES/EN y ambos packs. Validar comprensión con persona, no deducirla del DOM. `/impeccable clarify`.

### B06 · P2 · Algunos controles solo de arte quedan sin señal visual cuando falta la imagen

**Estado y evidencia.** `Artwork.tsx:19–28` retorna null cuando no hay recurso válido. GameSettings deja un botón con imagen decorativa y texto visualmente oculto (`GameSettings.tsx:37–45`); MapPanel hace lo mismo con el cambio mapa/lista (:148–155). Son controles funcionales/nombrados para AT, pero no proporcionan un fallback visible de texto/símbolo por sí mismos. El origen del mapa sí ofrece un fallback CSS explícito (`map-a60.css:189–197`), demostrando que existe un patrón local reutilizable.

**Clasificación.** Riesgo condicional comprobado por fuente, sin nueva captura de red fallida. No equivale a decir que toda la UI deja de funcionar con arte ausente.

**Impacto.** En touch sin hover, un botón sin su icono pierde su indicación visible aunque conserve aria-label/title. Categoría: integridad/fallback/uso táctil.

**Propuesta.** Fallback visible localizado o símbolo reconocible solo cuando falta el recurso, manteniendo nombre accesible y sin producción de assets nuevos.

**Aceptación futura.** Fallar solo ui.settings y solo ui.map/ui.missions, también durante swap: identificar y accionar Ajustes y vista equivalente en móvil emulado/touch sintetizado, teclado y lector. No basta `toBeEnabled()`; comprobar fallback visible y estados del control. `/impeccable harden`.

### B07 · P2 · Movimiento reducido del sistema y preferencia propia se mezclan en un único toggle

**Estado y evidencia.** El valor efectivo es `system || own` (`useReducedMotion.ts:35`). GameSettings anuncia `aria-pressed={reduced}` pero al pulsar invierte `ownReduced` (`GameSettings.tsx:103–110`). Con sistema reduce activo el botón puede cambiar la preferencia propia sin que cambie el estado anunciado/visual efectivo. No hay explicación de que prevalece el sistema en esa superficie.

**Clasificación.** Comportamiento estático confirmado, impacto de comprensión pendiente de observación. Respetar la preferencia del sistema es positivo; no se propone desactivarla a la fuerza.

**Impacto.** La persona pulsa un toggle que sigue marcado, sin saber por qué ni qué se ha guardado. Categoría: accesibilidad/copy de estado.

**Propuesta.** Distinguir preferencia propia y estado efectivo o explicar el estado impuesto por el sistema con semántica congruente. Conservar el resultado estático y la omisión segura del replay.

**Aceptación futura.** Cubrir system=false/true × own=false/true desde el ajuste real, recargar, cambiar durante replay y volver. El estado visible/accessible explica la acción y la persistencia; no reinicia replay ni modifica log/inventario. `/impeccable clarify`.

## Cobertura que puede heredarse y huecos que deben presupuestarse

Fuente actual de ejecución: [VALIDATION A73](../fluency-increment-2026-10-17/VALIDATION.md), [COVERAGE A73](../fluency-increment-2026-10-17/COVERAGE.md), workflow `.github/workflows/checks.yml:42–94` y configuraciones invocadas. No se ha relanzado ninguna suite para este documento.

| Ámbito | Acreditación existente del mismo código | Límite / requisito para próximos fixes |
|---|---|---|
| Dominio/adaptadores | 562 unitarios, 78 integraciones PG/Redis reales en CI39038639396 | Doubles/modelos no equivalen a UI ni persona; escoger pruebas por comportamiento cambiado. |
| Matriz ejecutada | 268 gráficos correctos y 40 skip explícitos: A70/71/73, A68, A69, trial, A67, A63, A66, intenciones A65, PWA y performance A67 | No factorial universal. Los skip no se contabilizan como motores/viewports validados. |
| Expedición ES/EN×packs | Cuatro journeys A73 Chromium1280; A70/A71 tienen otros tamaños/motores parametrizados | A73 recorrido completo no es por sí solo un journey completo físico o WebKit. |
| Respuesta perdida/concurrencia | A63 earned frog y dos pestañas; integración real serializa commit/recuperación | No demuestra entrada doble B02 ni sesión expirada B01; requieren casos específicos. |
| Preparación/equipo | team-beans/commerce y pruebas de proyección/reservas en código; A73 journey usa preparación | No se localizó aquí aceptación para reglas vivas divergentes B03 ni error dentro del inspector superior B04. No declarar inexistencia absoluta de pruebas fuera de lo leído. |
| Teclado/foco | `region-map.spec.ts:23–48` y casos de cancelación existen; botones nativos, focus return y skip-link en implementación | Un `focus()` programático o `getByRole` no comprueba por sí solo recorrido completo solo Tab, anuncio audible o orden/claridad real. |
| Contraste | Hay test especializado de arena (`tests/browser-arcana/contrast.spec.ts:3–115`) con píxeles del fondo y foco | No figura invocado como suite `playwright.arcana.config.ts` en el workflow actual. Su existencia no prueba ejecución en CI39038639396; tampoco cubre todas las superficies/packs. |
| Diseño A59/A60 | Existen pruebas dedicadas `annotation-experience`/`shop-journey`/`commerce-a60` | `playwright.trial.config.ts:10–25,59–68` las excluye de Chromium/WebKit generales. No heredar sus antiguas capturas o afirmar su ejecución reciente solo porque están en tests. Parte de sus comportamientos sí se recubre en suites nuevas. |
| Táctica A65 | Config/tactical-pacts/tactical-adverse escritos, intenciones A65 sí invocadas | `.github/workflows/checks.yml:79–85` no ejecuta config tactics/adverse por separado. No llamar toda la táctica validada por compartir A65 en el nombre. |
| Fallos de arte/renderer | A70/A71 missing art/chunk y A69 fallback; PWA offline y recuperación | No abarcan cada icono/superficie, ni pérdida auténtica GPU. B06 pide dos recursos puntuales sin ampliar a toda una matriz. |
| Movimiento | A73 lifecycle: gate de decode, ocultación sintética, resize pausado y cambio reducido por prop; A69 pausa/2x/omisión/log | No equivale al ajuste real B07, segundo plano físico ni rendimiento GPU. No borrar casos desfavorables A69/A67. |
| Humano/físico | Ninguna sesión nueva realizada en A74 | Lector audible, zoom/texto grande integral, red móvil, dispositivo físico, comprensión táctica y deseo de repetir siguen sin acreditación humana. |

## Patrones transversales y puntos que preservar

1. **La frontera de guardado está bien resuelta en las acciones económicas principales.** No sustituir `pending` y receipt confirmados por estados visuales optimistas; el problema transversal es dónde aparecen error y recuperación cuando hay varios diálogos.
2. **La semántica nativa ya existe.** `useNavigation.ts` enfoca content al cambiar ruta; App conserva origen del nodo y preparación; GameSettings restaura el trigger y detiene Escape; el inspector de preparación ya usa preventDefault/stopPropagation (`ExpeditionPreparation.tsx:581–584`). No reportar como ausentes estos mecanismos ni rehacer navegación por principio.
3. **La escena no es la única interfaz.** Botones DOM y datos accesibles sobreviven al canvas aria-hidden; SceneCanvas tiene fallback y destruye renderer/importaciones tardías (`scenes/SceneCanvas.tsx:24–80`). B05/B06 afinan equivalencia y reconocibilidad, no piden otro motor.
4. **La animación está acotada por estado confirmado.** `motion/useBattlePlayback.ts:29–65` pausa por visibilidad, cancela rAF y omite con reducido; `BattlePanel.tsx:86–96` protege un anuncio único. Mantener estas garantías y la evidencia A73 al corregir estados.
5. **Packs y localización son parte del contrato.** `App.tsx:158–171` actualiza lang/title/paleta; texto funcional permanece DOM. No introducir nueva terminología sin ES/EN ni usar el tema para alterar IDs/reglas. El uso de materiales oscuros/dorados y colores locales en `settings-case.css`/`map-a60.css` es intencional con el brief teatral; no se cuenta automáticamente como defecto ni se exige dark/light nuevo.

## Secuencia de trabajo posterior recomendada

1. **P1 `/impeccable harden`**: B01; escribir aceptación de sesión/operación/cuenta antes de editar.
2. **P2 `/impeccable harden`**: B02, B03 y B04 en recorridos pequeños separados, con prueba determinista que falle para el riesgo concreto y sin reabrir economía.
3. **P2 `/impeccable clarify`**: B05 y B07; validar semántica/localización con teclado/lector y comprensión posterior.
4. **P2 `/impeccable harden`**: B06; fallback específico de controles sin nuevos assets.
5. **`/impeccable audit`**: comprobar fixes y actualizar mapa de evidencia por SHA, reutilizando resultados equivalentes cuando proceda.
6. **`/impeccable polish`**: última pasada acotada después de cerrar comportamiento/estados; no constituye autorización de implementación en A74.

La siguiente implementación debe conservar primero las pruebas significativas de atomicidad/recuperación y añadir solo casos que prueben los findings aceptados. CI Linux serial con los controles existentes para gráficos; no repetir suites/capturas extensas en este Mac. Sesión humana breve posterior: entrar, consultar estado de un fallo, preparar dos opciones tácticas y explicar qué se guardó/cambió; registrar observaciones sin convertir inferencias del experto en resultados de usuarios.

## Cierre de independencia

Solo se escriben este informe y salidas detector de A74. Ningún cambio de aplicación, PRD, DECISIONS, DESIGN, configuración o recursos. No se leyó la evaluación A para producir este dictamen. El coordinador puede consolidar, refutar o degradar findings contrastando su evaluación y evidencia; las hipótesis mantienen su etiqueta hasta comprobarlas.
