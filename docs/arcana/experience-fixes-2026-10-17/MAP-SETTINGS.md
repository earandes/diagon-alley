# A75 · Ruta consultable y preferencias de movimiento

17 octubre 2026. Ámbito F07/F09/F10 de A74. Baseline `937a0a1`. No cambian dominio, costes, ofertas, premios, inventario o snapshots. No hay recursos nuevos ni dependencias.

## Decisiones e implementación

**F07, vigente y contrastado en código → implementado.** El nodo futuro se puede consultar por teclado/toque sin habilitar su resolución. `MapPanel` conserva `onSelect(id, origin)` para la preparación de un nodo disponible cuando `ready`; los demás nodos futuros abren `RouteInspection`, componente sin callback de comando. Los nodos visitados conservan el marcador inerte del mapa y se consultan desde el libro de ruta. La lista, ordenada por avance, distingue etapa y opción dentro de fila; relaciones Desde/Continúa hacia son ampliadas a demanda y permiten navegar entre consultas. Cerrar devuelve foco al origen; al cambiar de nodo se enfoca su título.

`routeInspection` proyecta exclusivamente tipo, posición, relaciones, estado y amenaza anunciada. Usa `routeOptions` compartido para disponibilidad. La amenaza procede de `campaignSnapshot.nodes`, con `publicPlans` solo como fallback para run sin snapshot; un snapshot que no contenga amenaza no se rellena con reglas vivas. No se proyectan premios, candidatos, elecciones aleatorias, semillas, IDs de nivel ni resultados. Los IDs de nodo permanecen internos para navegar, no como etiquetas visibles. Coste/hint general se presenta con la misma traducción vigente de la preparación. Consultar no importa ni invoca gateway.

**F09, vigente y contrastado → implementado.** El control mapa/lista conserva su icono actual; un texto breve localizado aparece solo cuando `Artwork` no devuelve `img`. No se rehace el fallback existente de Ajustes. La regla usa la presencia real de la imagen, por lo que sigue funcionando tras error de carga y cambio de paquete.

**F10, vigente y contrastado → implementado.** El hook expone `system` además de `own` y `reduced`. `GameSettings.systemReduced` permite explicar precedencia. El botón anuncia `aria-pressed=ownReduced` y cambia exclusivamente esa preferencia. La descripción enlazada explica el estado efectivo y, cuando corresponde, que el sistema mantiene movimiento reducido aunque la elección propia se desactive. `reduced=system || own` permanece intacto. Activar reducido durante replay conserva el comportamiento previo: omite hasta el resultado confirmado; desactivarlo no reinicia el log. No se presenta conservar el cursor previo como aceptación, porque sería contrario a esa omisión accesible existente.

## Integración

- `MapPanel.publicPlans?: readonly NodePlan[]`: fallback de consultas históricas, nunca precede al snapshot.
- `GameSettings.systemReduced?: boolean`: pasar `motion.system` en App, CommercePanel y CardReveal (integración coordinador).
- `useReducedMotion()` devuelve `system` sin alterar los campos existentes.
- Dos aserciones históricas se actualizan por semántica: nombre explícito del botón de movimiento en `asset-interface.spec.ts`; selección de nodo disponible por `data-node-state=available` en `replay.spec.ts`, ya que futuro consultable ya no equivale a botón disabled.

## Pruebas y límites

Ejecutado localmente, sin navegador/servicios:

- RED: `npx vitest run tests/domain/arcana/route-inspection-a75.test.ts` falló al no existir la proyección.
- GREEN: misma prueba, 3 casos: relaciones/opciones/estado y pureza; snapshot frente a vivo con no divulgación; fallback histórico y nodo desconocido.
- `npx vitest run tests/domain/arcana/settings-motion-a75.test.ts tests/domain/arcana/route-inspection-a75.test.ts tests/domain/arcana/map-presentation-a60.test.ts`: **15 tests superados** (8 preferencias ES/EN×system/own; 3 proyección; 4 semántica A60).
- `npx tsc --noEmit`: superado tras integrar estos archivos. No es una ejecución de build o suite global.
- `git diff --check`: superado antes de entregar al coordinador.

`tests/browser-experience-fixes/map-settings-a75.spec.ts` está escrito para CI Linux, **no ejecutado en este subtrabajo**. Usa cuentas aisladas reales en puerto 5520 y acota contratos a Chromium390; otros proyectos se omiten explícitamente. Incluye cuatro consultas ES/EN×pack con conteo de POST=0/estado igual/foco/relaciones; cuatro fallos de los dos iconos; ocho casos de Ajustes ES/EN×4 combinaciones con recarga y swap ARCANA→Diagon; un caso durante replay. El coordinador debe registrar resultado real de CI y corregir fallos, no atribuir cobertura por tener el test escrito.

Pendiente: inspección gráfica Linux seleccionada, semántica real del diálogo/foco, prueba de ausencia de arte, comportamiento del toggle durante replay, matrices de integración y captura comparada. Lectura hablada, percepción del diseño y dispositivo físico no probados. No se ha abierto Chrome/Browser/CUA ni ejecutado Playwright en el Mac.

### F09 · Primera ejecución Linux

En692dacf/CI39056332168 pasan geometría, reflujo, tres pares de replay y consulta de ruta. El caso de iconos falla por fallback oculto. Se contrasta primero la sincronización del test: leer el `src` inmediatamente tras cambiar vista podía recoger el icono anterior y comprobar cero imágenes antes de montar el mapa. Se espera ahora el `data-art` correspondiente antes de bloquear cada URL y la presencia del control tras recarga; se guardan HTML/estilos/geometría de fallback. No se fuerza visibilidad ni se cambia CSS sin demostrar la causa. Evidencia desfavorable preservada en attempt-3.
