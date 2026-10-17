# A75 · Compatibilidad y recuperación

## Fronteras conservadas

No cambios en esquema SQL, contratos económicos HTTP, tablas de azar, precios, premios, campaña/versiones o motor de combate. El cliente sigue enviando intenciones y recuperando el receipt confirmado; el renderer solo representa BattleLog. No se reinicia ningún derecho de primera victoria ni se crea una segunda fuente de consumibles.

La proyección de preparación toma `effectivePreparationRules(run, live)`: snapshot de una run activa, fallback vivo explícito para histórica sin snapshot; nueva preparación usa vigente. Los miembros/reservas registrados conservan su afinidad. El snapshot actual **no contiene** `ownedAffinities`: una copia aún no incorporada conserva el perfil vivo que usa hoy la autoridad; no se inventa una afinidad histórica ni se amplía el formato guardado.

Encuentro y filtros no cambian `unitId`/`copyId`. Número de puesto y procedencia son presentación; no se persisten IDs nuevos. Elegir filtro/abrir detalle no guarda, equipa, consume o concede. Equipar continúa siendo una orden independiente; cerrar consulta no revierte un commit. El tarro comparte stock/borrador en duelo y jefe; consumo/sabor siguen exclusivamente al confirmar combate.

## Sesión e intención

`load()` conserva partida, propietario y operación mientras consulta. Otro propietario requiere entrada explícita con `allowPlayerChange`, bloqueada si hay pending; un mismatch implícito no reemplaza estado. Un401 posterior a recuperar un receipt no convierte el estado en ready ni borra ese resultado.

Antes de una nueva entrada se relee la metadata del propietario actual y se bloquea si otra pestaña ya ha reclamado una intención. La exclusión de entrada es síncrona por instancia de la interfaz; cubre doble activación mientras POST+carga están en curso.

**Límite explícito:** la lectura IndexedDB anterior y el POST de cookie no son una transacción distribuida. No se afirma exclusión atómica de dos nuevas entradas desde dos pestañas sin cookie ni se añade infraestructura de cuentas. No se borra una fila pendiente de otro propietario. Las operaciones económicas mantienen sus garantías de servidor y la recuperación exige identidad coincidente. Sesión cookie de ensayo no equivale a cuenta recuperable entre dispositivos.

Cambiar explícitamente de jugador desmonta la preparación con una key por propietario; no hereda filtro, copias seleccionadas o inspector de la partida anterior. Preferencias de presentación conservan su función y no se importan como estado económico.

## Ruta y movimiento

La inspección de ruta es una proyección sin callback de comando. Expone tipo/etapa/opción/relaciones y amenaza ya pública; no ofrece semillas, tiradas, premios o candidatos futuros. El nodo disponible conserva la resolución habitual; los futuros abren consulta, los visitados se consultan desde el libro. Lista/consulta no cambian reglas de acceso.

Movimiento reducido conserva `system || own`. Ajustes guarda/anuncia la elección propia y explica el estado efectivo. Activar reducido durante replay conserva la equivalencia existente de omitir al desenlace confirmado; no implica mantener el cursor anterior ni reejecutar combate al volver a movimiento normal.

La arena móvil cambia distribución de espacio, no reloj, shaders, texturas, selección de objetivos o log. El DOM medido sigue alimentando posiciones del renderer mediante el ResizeObserver existente, sin nuevas lecturas porframe. Se reutilizan figuras y actor por piezas A71; no rig corporal o lote visual nuevo.

## Evidencia y límites

Unitarios dirigidos/modelos verifican decisiones de cliente/proyección; suites Linux reales deben acreditar UI y servicios en el candidato. Los PNG son composición, los frames/controles y aserciones de cursor son evidencia temporal acotada. No certificación WCAG global, lector hablado, segundo plano físico, pérdida auténticaGPU, diversión o retención. Véase QA y el informe final para resultados reales; esta descripción no sustituye ejecución.
