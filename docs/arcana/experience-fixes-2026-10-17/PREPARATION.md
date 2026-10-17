# A75 · Preparación, instancias y consulta de reglas

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
