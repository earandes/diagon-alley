# A63 · Preparación contextual

16 octubre 2026. Implementación del tercer recorrido autorizado. Conserva precios, pesos, reglas, IDs y operaciones. Las pruebas siguientes son comprobaciones técnicas de cuentas aisladas, no sesiones humanas.

## Interacción implementada

**Compra → localización.** La acción de grageas abre un conector breve sobre la tienda, con el tarro y la instrucción de asignarlo ante un Duelo/Jefe. Escape devuelve foco al objeto de la tienda. Si no hay combate alcanzable, solo se propone volver al mapa. Si hay exactamente uno, un medallón «Preparar duelo/jefe» permite consultarlo explícitamente y conserva el coste visible 5; el clic no lo resuelve. Con varias ramas se vuelve al mapa para elegir en su contexto, evitando dos duelos indistinguibles sobre el mostrador. Esta simplificación procede de revisión experta de la captura, no de una observación humana.

**Formación.** Los puestos ocupados se agrupan: propios, temporales y vacíos secundarios. Los retratos temporales también abren inspector. La procedencia, PV/PM y afinidad continúan accesibles. Elegir copias es borrador hasta confirmar formación; equipar sigue siendo escritura inmediata y explícita, indicada en la ficha. Cerrar la ficha no revierte equipamiento ya confirmado. Cambiar de run a preparación nueva limpia selección anterior.

**Comparación.** `preparationUnit` conserva heridas/PM/afinidad de miembros y reservas. Solo fuera de run utiliza stats de la copia, afinidad pública y loadout actual; contenido antiguo sin mapa de afinidades indica dato no registrado. `activeSynergies` y los valores de `CombatRules` producen Alquimia/Fuego/Sombras. La ficha y las alternativas de equipo muestran base→equipado y actual→propuesta usando las mismas funciones puras de equipo que el motor, sin cálculo de ganador. El comparador no escribe, cura ni transfiere equipo. La transferencia real sigue validada por el caso de uso existente.

**Objeto → portador.** Una bandeja de tarros reales reemplaza las listas de tarros repetidas por personaje. Elegir un tarro y tocar un retrato asigna el objeto; tocar otro lo mueve; tocar el portador actual lo retira. Cada unidad y portador quedan exclusivos. La fila conserva 3–5 retratos, incluidos caídos deshabilitados identificados; reservas no son portadores válidos. Posición numérica diferencia copias del mismo personaje; reloj/sello y descripción accesible distinguen temporal/propio. PV y origen son accesibles por foco y toque. Contador breve identifica el borrador; ayuda revela probabilidades/efectos desde la tabla activa.

**Confirmación.** El estado de borrador no consume ni descubre sabor. La raíz vincula borrador a jugador/run/revisión/nodo/versión de campaña-reglas-grageas, excluyendo idioma y pack. El comando de combate existente consume una vez, activa el sabor guardado y entrega el mismo BattleLog. Cancelación, recarga y versiones no reutilizan una asignación local antigua.

## Movimiento y coste

Selección de tarro/portador: desplazamiento máximo 2 px y borde en 140 ms ease-out; no partículas o esperas. Movimiento reducido propio/sistema elimina transición y desplazamiento. Estado se actualiza inmediatamente y no hay animación de éxito antes del guardado. No dependencias, assets, renderer o generación nueva. Imágenes existentes mantienen fuente/manifiesto previo.

## Fuentes modificadas por este subrecorrido

- `src/arcana/presentation/ExpeditionPreparation.tsx`
- `src/arcana/presentation/BeanAssignments.tsx`
- `src/arcana/presentation/PreparationSynergies.tsx`
- `src/arcana/presentation/contextual-preparation.ts`
- `src/arcana/presentation/contextual-messages.ts`
- `src/arcana/presentation/contextual-preparation.css`
- Selectores de confirmación/cancelación en `src/arcana/presentation/node-event-dialog.css`, adaptados al contenedor de acciones.
- `tests/domain/arcana/contextual-preparation.test.ts`
- Selectores de interacción en `tests/browser-trial/team-beans.spec.ts` y `game-redesign.spec.ts`.

La integración de `App.tsx`, proyección pública de afinidades y extracción compartida de efectos de equipo pertenece al coordinador y tiene sus pruebas separadas. No se ha cambiado configuración económica.

## Evidencia técnica

`evidence/preparation-red.txt`: RED real por módulo nuevo ausente. `preparation-green.txt`: 10 casos nuevos y 8 previos,18 correctos. Prueban condición de reserva, afinidad histórica/desconocida, Alquimia 2→3/caídos/temporales, comparación sin mutación, exclusividad de tarro/portador, vigencia de stock y composición, bandeja única con cinco actores y destinos explícitos. `preparation-types.txt`: TypeScript correcto.

`evidence/preparation.spec.ts` + `preparation.config.ts`: tres casos con Chromium: dos recorridos ES/EN y una invalidación de borrador por revisión real de equipamiento, servidor dev5364/namespace`a63-preparation-5364`, PostgreSQL/Redis existentes y cuentas nuevas por contexto. Comandos económicos solo por controles UI; GET contrasta estado. Compra5, localización/foco, Pactos, formación, equipo, asignación/mover, idioma conserva, cancelación conserva snapshot exacto, reapertura borra borrador, combate consume una unidad/5 energía, recarga conserva snapshot y álbum muestra sabores. 3/3 correctos en 22,9 s. El caso adicional guarda desequipamiento (revisión+1), verifica asignación borrada, gragea sin consumo y cancelación con snapshot exacto. Resultado final en `preparation-browser-final.txt`; observaciones autoritativas `es/en-preparation-observations.json`.

Capturas comparables nuevas en `evidence/after/{es|en}-prep-{no-combat|combat-destination|formation|equipment|assigned|flavour}-{390|1280}.png`. La prueba recorre dos viewports, no dispositivos físicos. Confirmar y cancelar permanecen en barra inferior adherida mientras el contenido de consulta/asignación se desplaza; ambos controles se verificaron dentro del viewport844 después de asignar. Popups de consulta/asignación pueden desplazarse; no se atribuye el criterio de arena sin scroll a estos inspectores. Revisión visual propia confirmó conector compacto, puestos contiguos, comparadores y asignador. Rendimiento sostenido/lector/físico requieren evidencia separada del coordinador.

Los intentos intermedios documentan ajustes del harness: cwd Vite, esperar compra confirmada antes de snapshot, scoping de sinergias duplicadas en diálogos apilados, retorno desde arena antes de navegar al álbum y evitar HMR concurrente con test. No se cuentan reintentos como pruebas distintas ni se presentan sus fallos como defectos de producción.


## Refuerzo de foco entre motores

WebKit no enfoca un botón por un clic de puntero de la misma forma que Chromium. Los cuatro accesos (`SweetshopScene`, `CommercePanel`, `CollectionPanel`, `TeamHud`) ahora pasan `event.currentTarget` mediante `onPrepare(origin: HTMLElement)`; la raíz guarda ese origen explícito para restaurarlo. No listener global ni dependencia de `document.activeElement` como única fuente.

Reejecución final: `preparation-focus-browser-final.txt`, **6/6 correctos en 42,6 s**: los tres casos anteriores en Chromium y WebKit, con assertions adicionales de retorno de foco desde tienda, álbum y HUD, en español e inglés. La revisión de equipamiento invalida el borrador también en WebKit. El acceso del resultado de forja usa el mismo contrato explícito por inspección de código; esta suite no realiza otra forja para atribuirle una comprobación GUI inexistente. La regresión compilada general se registra aparte por el coordinador.

Las capturas Chromium conservan nombres anteriores; WebKit añade `es/en-webkit-prep-*`. Los JSON autoritativos de estos recorridos incluyen motor en `es/en-chromium/webkit-preparation-observations.json`. No se suman las corridas3/3 anteriores como casos distintos adicionales.
