# A75 · Preparación, instancias y consulta de reglas

Registro de implementación/preregistro y seguimiento. El resultado técnico definitivo está en QA y en la sección de cierre al final; los planes históricos no se presentan como trabajo todavía pendiente.

17 octubre 2026. F03/F05/F08; integración F04 mediante slot. Cambios de presentación y proyección de solo lectura. Sin reglas, operaciones, inventario ni economía nuevas. No se han abierto navegadores desde este agente.

## F03 · Fuente efectiva

**Contraste:** `ExpeditionPreparation` y `BeanAssignments` leían `content.combatRules`, mientras el avance de run usa `run.campaignSnapshot ?? configuración`. La divergencia requiere una versión distinta: no se presupone que una partida habitual la haya sufrido.

**Cambio:** `effectivePreparationRules(run, live)` concentra la política. Run activa con snapshot → reglas congeladas; activa histórica sin snapshot → fallback vivo explícito; sin run o run completada → vivo para preparar otra expedición. Formación, sinergias de grageas y pesos visibles comparten esa fuente. No se recalculan umbrales ni efectos: `preparationSynergies` sigue llamando al dominio compartido.

**Afinidades:** se comprobó la petición de revisar copias todavía no registradas. `Campaign`/`campaignSnapshot` no guardan `ownedAffinities`; `SetTeamUseCase` prepara una copia nueva mediante la configuración vigente. La UI conserva condición/afinidad registrada en miembros y reservas; para una copia no registrada mantiene el perfil vivo, igual que la autoridad actual. No se ha inventado un snapshot de afinidades ni cambiado autoridad/persistencia para este fix. Es un límite explícito del contrato actual, no otra garantía histórica añadida.

## F05 · Objetivo por instancia

Cada retrato de Encuentro conserva su `unitId` operativo y muestra posición estable de formación + procedencia propia/temporal. El nombre accesible completo distingue duplicados de condición idéntica; la condición y razones de indisponibilidad tienen descripción asociada. La previsualización muestra la misma posición/procedencia y conserva el mismo ID. El cambio sigue siendo un borrador hasta la confirmación del padre.

La señal usa los sellos existentes `ui.owned`/`ui.temporary`, texto breve y ordinal; no IDs técnicos ni equipo inventado. Las cifras exactas siguen procediendo de `previewEncounterTrade`.

## F08 · Encontrar compañeros sin perder borrador

Con más de seis copias, el índice opcional «Buscar compañero» ofrece afinidades existentes y un desplegable de retratos por identidad. Reutiliza `AffinityLabel` para no atribuir a un icono de nodo otra función. Combinar filtros puede dar vacío honesto con «Ver todos». Página vuelve a 1 al filtrar; selección por `copyId`, cinco puestos, equipamiento, inspección y confirmación quedan fuera del filtro.

`filterPreparationCopies` nunca agrupa/elimina instancias del estado. No hay búsqueda de texto, nueva bolsa ni edición en álbum. El índice de identidades puede desplazarse con teclado/toque y el foco visual conserva los tokens existentes.

## F04 · Integración

`ExpeditionPreparation` admite `recovery?: ReactNode`: una única instancia en la base cuando no hay inspector; dentro del diálogo superior mientras se consulta. El coordinador suministra `RecoveryNotice` y evita duplicarlo detrás de los modales. Este componente no crea ni cancela operaciones.

## TDD y comprobaciones ejecutadas

- RED inicial: `npx --no-install vitest run tests/domain/arcana/preparation-a75.test.ts` → 7 fallos (helpers ausentes, reglas vivas, etiquetas no diferenciadas). Una expectativa inicial sobre afinidad congelada de copia no registrada se corrigió tras contrastar el contrato: no existe tal perfil en `Campaign`.
- Se corrigió un error de la fixture del nuevo test (Encuentro exigía dos opciones; el test provisional tenía una). No era un fallo de producto.
- GREEN final: `npx --no-install vitest run tests/domain/arcana/preparation-a75.test.ts tests/domain/arcana/contextual-preparation.test.ts tests/domain/arcana/preparation-presentation.test.ts tests/domain/arcana/encounter-presentation-a67.test.ts` → **36/36**, cuatro archivos, 17 octubre 19:37 local.
- `npx --no-install tsc --noEmit` → superado, 19:39 local. La compilación del worker/build/pruebas globales pertenecen a la integración del coordinador.
- `git diff --check` → sin errores en este punto. No commits/push de este agente.

Casos nuevos: fuente congelada/histórica/nueva/completada; Alquimia/Fuego/Sombras con valores vivos y snapshot distintos; treinta instancias sin mutación, filtros y vacío; ES/EN en valores/probabilidades; Encuentro con retratos idénticos propios/temporales y preview del ID correcto. Los tests previos de asignación, heridas/reservas y previews exactos se conservaron.

## Pruebas gráficas escritas, todavía no ejecutadas aquí

`tests/browser-experience-fixes/preparation-a75.html` + `preparation-a75-harness.tsx`: **fixture declarada de componentes**, treinta copias, duplicados con loadout distinto, tres puestos (incluido temporal), reglas snapshot Alquimia11 frente a contenido vivo3, tabla mint1/pepper3, stock3 o vacío. No cuenta ni servidor/recursos reales; sus callbacks registran intención para verificar IDs, no guardan una partida.

`preparation-a75.spec.ts`: doce casos ES/EN × ambos packs × tres recorridos:

1. Filtrar identidad, elegir instancias, cambiar presentación sin perder borrador, combinación vacía, limpiar y confirmar IDs.
2. Tabla snapshot 25/75 y sinergia11; asignar, mover y quitar sin alterar estado fuente.
3. Objetivos idénticos distinguibles, activación por teclado, preview de temporal y pasar.

El coordinador los ejecutará en CI Linux en serie bajo guard/lock/watchdog. Faltan aún resultados gráficos, inspección seleccionada y las comprobaciones de autoridad/recuperación reales del recorrido integrado. No se presentan estos tests escritos, SSR o tipos como validación gráfica, accesibilidad hablada o persistencia real.

## Recursos y límites

Sin assets nuevos, dependencias o audio. CSS acotado en preparación/encuentro; mismos retratos/sellos. Consulta de resultados históricos y renderer/BattleLog no modificados. La comprensión, coste cognitivo, personalidad y comodidad en dispositivo físico siguen siendo hipótesis para sesión humana posterior.

### Extensión F11 · Recorrido con autoridad real escrito para Linux

`supplies-a75.spec.ts` añade cuatro cuentas aisladas como máximo (ES/EN×packs), limitadas explícitamente a Chromium390 por la cuota de sesiones del ensayo. Compra por UI una gragea, entra en expedición, recluta dos temporales por los Pactos usando la política técnica declarada `reachNode`, consulta existencias/borrador en Duelo, asigna/mueve/quita/cancela y verifica estado servidor inalterado. Confirmar debe consumir una unidad y cinco de Esencia, producir una activación registrada y una sola identidad de sabor consultable en colección. Recarga conserva receipt/log/consumo.

Un caso ES/Diagon pierde deliberadamente la respuesta después de `route.fetch()` al servidor real, recupera por el control de operación y exige un solo POST de avance. No se inyectan estado económico, resultados o rutas; las únicas sustituciones son transporte adverso y preferencia visual de paquete. Tests escritos y comprobados por TypeScript, **todavía no ejecutados por este agente**. No se atribuye persistencia real a la mera existencia de esta especificación.

### CI candidato 1 · Fallo de estructura de fixture, conservado

CI **39055482041** detuvo A75 en el primer caso F08 desktop Chromium1280, antes de abrir filtros. El error de Playwright identifica `output[data-fixture-confirmed]` interceptando el puntero sobre el `summary`. Se inspeccionó el artefacto descargado en `/tmp/arcana-a75-candidate1/test-results/experience-a75/.../error-context.md` y las reglas `.game-shell > main`, `.game-shell > nav` y grid de `game-experience.css`: el harness colocaba preparación y output como hijos directos del shell, sin la estructura real de App.

Corrección **solo de fixture**: `header.game-header` contiene la navegación QA; `main#content` contiene los componentes; el output de registro es `hidden` y se consulta por valor. La navegación QA ya no coincide con el dock inferior real. No `force`, ignorar overlays, cambio de aceptación ni modificación del producto. `npx --no-install tsc --noEmit` pasó tras esta corrección. El resultado gráfico debe proceder de la siguiente ejecución Linux del coordinador; el fallo anterior permanece registrado, no se considera superado por corregir el código de prueba.

### Contraste estático previo al siguiente CI · selectores y expectativas

Se revisaron nuevamente `preparation-a75.spec.ts` y su harness frente a los componentes actuales; no se ejecutó navegador ni servicio. Se comprobó:

- Índice: JSON real mantiene los primeros seis personajes `apprentice/merlin/morgana/flamel/paracelso/circe`, con afinidades Alquimia/Alquimia/Sombras/Alquimia/Alquimia/Fuego. Treinta copias rotan esas seis identidades: filtrar el primer retrato deja exactamente los IDs0/6/12/18/24. Fuego + ese retrato da vacío real; limpiar vuelve a seis copias de la primera página sin quitar la selección0/12.
- Inspección: `data-preparation-inspect`, `.preparation-inspection-close` y el `focus()` de retorno existen; `starterEquipment` contiene varita birch y escoba cadet-zephyr con los IDs usados. Ambos assets están registrados en ambos paquetes. Los selectores de equipo están limitados a los puestos del inspector para no confundirlos con opciones del tray.
- Borrador: miembros propios0/6 y temporal independiente `a75-pact-copy`, capacidad4 propias; retirar6 y añadir12 deja selección0/12, confirmación habilitada y callback correcto. Idioma/pack no cambian `committedKey` o ID de run. `output[hidden]` permanece consultable por texto, sin exigir visibilidad.
- Grageas: los tres miembros están en pie, tienen la misma afinidad y los máximos declarados. El snapshot conserva Alquimia11 y pesos mint1/pepper3 (25/75). Las filas son `p` directos del details y los data-art contrastados existen. `assignBean` mueve un tarro y deja una sola asignación por portador; al pulsar de nuevo lo retira.
- Encuentro: la oferta cumple el contrato de dos opciones; condición30/100PV y50/100PM permite el trato individual. Los nombres accesibles incluyen posición/procedencia; el temporal es puesto3. `changes` contiene solo el objetivo cambiado; seleccionar pasar elimina preview.
- Marco: cabecera y main siguen los selectores reales del shell. Ningún output extra ni navegación QA como dock directo. No se añadió `force`, tiempos arbitrarios, aceptación relajada o cambios de producto. No se encontró otra incompatibilidad estática demostrada; visibilidad/foco/puntero finales siguen pendientes de ejecución Linux.

### F11 · Existencias cero y varias sin más sesiones

Se añadió exclusivamente a la fixture el modo `view=supplies`, que reutiliza `BossSupplies`. Cuatro pruebas adicionales (solo Chromium390, ES/EN×packs) comprueban stock0 y stock3, dos tarros en portadores propio/temporal, traslado con sustitución explícita, retirada y descarte del borrador por el padre QA. El control «QA cancel draft» está identificado como instrumentación de fixture: no acredita el cancelado de un nodo real, cubierto por `supplies-a75.spec.ts`. No crea cuentas ni peticiones económicas. Los modos anteriores no cambian. `tsc --noEmit` superado tras añadirlo; pendiente ejecución Linux.

### Regresión real F05 · CI39059090478, candidato889

**Evidencia → problema:** el CI completo pasó A75/A70/A71/A73/A68/A69, pero A67 encontró overflow real en el diálogo de Encuentro ordinario: clientHeight862 y scrollHeight922/935 en ES/EN; otro caso de trato grupal dio815 frente a806. Se conservaron log `/tmp/a75-full-run.log` y error contexts descargados en `/tmp/arcana-a75-tail-failure`. No había nueva captura seleccionada. La procedencia F05 se presentaba como una oración de varias líneas más un sello bajo cada retrato, y como encabezado largo en cada preview: añadía altura y ancho a un diálogo antes ajustado. No era un fallo de sincronización ni un caso de texto200%; no se modifican las aserciones geométricas de A67.

**Cambio mínimo:** posición numérica y sello propia/temporal localizados sobre el retrato existente, sin aumentar el tamaño de éste. Debajo se conserva una palabra legible («Propio/Temporal», «Owned/Temporary») a12px; nombre y PV/PM mantienen sus tamaños y datos. El nombre accesible sigue incluyendo nombre, posición y procedencia completa. Preview muestra posición + procedencia breve; mantiene la procedencia completa accesible y las cifras antes/después. La ayuda ya existente amplía los sellos y las palabras a su significado completo al tocar/enfocar/activar su libro de información. Se reducen únicamente separaciones redundantes alrededor de objetivos y preview (sin reducir blancos táctiles, ilustraciones o tipografías).

**Aceptación:** mismo ID y efecto de instancia; ordinal y procedencia discernibles sin color; todas las unidades/nombres/PV/PM/ofertas/costes y confirmación presentes; diálogo ordinario sin scroll con tamaños originales de A67. Texto ampliado y ayuda abierta pueden desplazarse accesiblemente. No `scrollAllowed`, `force`, unidades ocultas, clamping de nombres o reducción general de fuente.

**Comprobado tras fix:** `vitest run tests/domain/arcana/preparation-a75.test.ts tests/domain/arcana/encounter-presentation-a67.test.ts` →18/18; `tsc --noEmit` →superado. El test nuevo conserva nombres completos accesibles, preview full-source, ordinales y etiquetas breves propias/temporales. El contraste gráfico/altura final corresponde al siguiente CI Linux del coordinador: no se atribuyen medidas nuevas a este cambio sin ejecutarlo.

## Ajuste final de margen por evidencia WebKit

CI39063046713: A75 114passed/174skipped y E2E56passed; A67 18passed/2failed, solo WebKit ES/Diagon y EN/ARCANA. Nuevo desbordamiento residual864 frente límite863, antes922–947. Se reducen4pxde margin-top de targets y4pxde preview. No fuente menor, recorte, scrollAllowed ni umbral cambiado. Fase tail comprobará F05 en las seis combinaciones motor/viewport y A67 completa, después A63/A66/A65/PWA/perfiles. Sus JSONgeométricos se archivan por primera vez de forma explícita, sin activar capturas automáticas. La ejecución anterior cancelada conserva crudos en evidence/resume-regression-failure; las pasadas A75/E2E/perfiles se conservan con SHApropio.

## Cierre comprobado

CI39064546905/head6f47559: F05 24/24 y A67 completa20/20.24 rectángulos sin overflow, altura máxima856px;390pxdeviewport produce diálogos772–784px. PV/PM/nombres/costes/confirmación siguen presentes, no cambia el límite ni scrollAllowed. Los rectángulos y procedencia están en evidence/tail-final; el resumen separa viewport fijo y tamaño del diálogo porque el JSON legado sobrescribe esas claves. FixtureA75 de tres unidades idénticas: números1/2/3, procedencia propia/temporal y preview delID elegido; imagen final revisada. No prueba humana ni dispositivo físico.
