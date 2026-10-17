# A75 · Recuperación, decisiones y presencia ilustrada

Las once correcciones de A74 están implementadas en `feature/a75-experience-fixes`, [PR #6](https://github.com/earandes/diagon-alley/pull/6). A75 completa y la suite general pasaron sobre `6d4dbcb`; la corrección final de márgenes pasa F05 y A67 sobre `6f47559`. **Las comprobaciones técnicas necesarias están resueltas con la cobertura por SHA indicada abajo.** No se ha integrado en main, desplegado ni publicado.

## Recorridos mejorados

**Entrar → preparar → equipar → recuperar.** La primera activación bloquea otra entrada hasta completar POST y carga. Una sesión inválida conserva jugador, operación y resultado conocidos; el aviso sigue alcanzable al cerrar el inspector. Los errores de equipamiento aparecen en el modal activo. Una sesión restaurada correctamente elimina el aviso antiguo. Entrar en otro ensayo requiere una decisión explícita y ninguna intención pendiente; no traslada recursos ni selección de la partida anterior.

**Elegir instancia → asignar gragea → combatir → consultar resultado.** La preparación usa las reglas efectivas de la expedición activa. Los filtros de afinidad e identidad conservan copias, equipo y borrador. Puesto y procedencia distinguen integrantes repetidos en Encuentro y preview. Duelo y jefe comparten tarro, existencias y asignaciones provisionales; solo confirmar combate consume. El botín añadido por ese combate se distingue del objeto consumido.

**Consultar ruta → combatir → continuar.** El mapa y su libro permiten consultar conexiones y amenazas públicas sin avanzar un nodo bloqueado. Los controles mapa/lista siguen siendo visibles si faltan sus imágenes. Ajustes distingue la preferencia propia de movimiento y la protección efectiva del sistema. La arena móvil densa aprovecha mejor el espacio de cada figura conservando diez participantes, nombres, PV, inspectores y reproducción.

## Estado de los once hallazgos

Todos se contrastaron con el baseline A74 `937a0a1`; no se interpretó una observación estática como un fallo ya reproducido en navegador. La columna de comprobación distingue las capas ejecutadas. Las regresiones afectadas están resueltas con evidencia por SHA; la observación humana sigue pendiente.

| Finding | Corrección integrada | Comprobación y límite |
|---|---|---|
| F01 · Sesión | Recuperación persistente y contextual, sin nueva cuenta automática; limpieza del aviso tras sesión válida | 401 real, cierre de inspector, restauración de la misma cookie en EN y otra entrada explícita en ES. Pending/propietario/receipt también en unitarios. Requiere una sesión válida del mismo dueño; no autenticación productiva. |
| F02 · Entrada | Exclusión síncrona desde la activación hasta terminar POST+carga; error permite otro intento deliberado | Petición retenida, doble activación, Enter repetido y starter-kit único. No exclusión distribuida de dos entradas vírgenes. |
| F03 · Reglas | Resolver compartido de snapshot activo; nueva preparación usa vigente y el fallback histórico es explícito | Bonos y pesos deliberadamente distintos, ES/EN y packs; consulta inmutable. El snapshot no contiene ownedAffinities para copias aún no incorporadas: se conserva el fallback que utiliza la autoridad. |
| F04 · Inspector | Un aviso de error/operación incierta en el contexto superior | Commit real con respuesta perdida, GET de la misma key y un POST, sin cerrar el inspector. Offline/storage/mismatch adicionales en unitarios; no avería física de IndexedDB. |
| F05 · Instancias | Número y sello junto al retrato, procedencia breve, detalle accesible y preview de la unidad correcta | Fixture con tres unidades de identidad/PV/PM iguales en 24 combinaciones; A67 real completa. Dos iteraciones corrigieron overflow demostrado, sin reducir fuente ni relajar el límite. |
| F06 · Arena | Espacio flexible de figura en móvil denso, texto/PV preservados | 72 muestras 3×3/5×3/5×5, ambos motores y tres tamaños; reflujo ampliado acotado. No dispositivo físico ni juicio humano sobre personalidad. |
| F07 · Ruta | Consulta pública separada de resolución; posición y conexiones distinguen nodos iguales | Teclado, toque emulado y foco; cero POST de avance y estado real igual. No semillas, ofertas ni resultados futuros. |
| F08 · Colección amplia | Filtros visuales a demanda por afinidad/identidad, cinco puestos e instancias separadas | 30 copias, equipo distinto, filtro vacío/limpieza y borrador conservado al cambiar presentación. Colección declarada de fixture. |
| F09 · Fallback | Texto/símbolo visible para mapa/lista si falla el arte | 404 nativo limitado a las imágenes; controles visibles y utilizables. Ajustes ya tenía fallback y se conserva. |
| F10 · Reducido | Elección propia separada de `system || own` | Cuatro combinaciones, recarga y cambio durante replay, sin recalcular log/inventario. Ocultación sintética no acredita segundo plano físico. |
| F11 · Grageas | Tarro compartido, existencias y borrador diferenciados; ninguna fracción de tarea obligatoria | Stock 0/1/varios, mover/quitar/cancelar, consumo y sabor confirmados con receipt real. El stock final incluye el posible tarro de botín, conservando las demás instancias. |

## Estilo y rendimiento

Se conservan Teatro de alquimia, ilustraciones, foco visible, información ampliada y texto funcional fuera de las imágenes. No se han producido assets, audio, partículas, librerías o reglas nuevas. La selección de instancia se apoya en el retrato; los filtros están a demanda y el tarro sigue siendo el objeto de preparación. El foco de teclado no se elimina para limpiar una captura.

En 390×844 y 5×5, la figura propia de una línea pasó de unos 50,8 a 69,1 px; con dos líneas conserva 52,9 px. La huella alfa mediana pasó de unos 49 a 66 px en Diagon y de 40 a 54,6 px en ARCANA. Son proyecciones de fuente/encuadre, no píxeles GPU ni articulación nueva.

Tres pares AB/BA/AB por motor contra el runtime `937a0a1`: mediana P95 rAF actual 16,7 ms en Chromium y 17 ms en WebKit; referencias 16,8 y 18 ms. **No mejora de arranque acreditada:** medianas activación→frame listo 319→322,1 ms y 435→558 ms; rangos y extremos se conservan. Las muestras cortas desfavorables de A69 tampoco se borran ni se atribuyen a una causa sin evidencia. Véase PERFORMANCE para método y límites.

## Evidencia y entrega

La validación se reúne por scopes y objetos de código, no por color global de un check:

- CI39059090478/head889886d: A70/A71/A73, Halloween y A69 funcionales correctas; ejecución después cancelada por fallos E2E/A67, que se conservaron y corrigieron.
- CI39063046713/head6d4dbcb, mergecbd771c y árbol común d48d45df: A75 114 pasadas/174 omisiones previstas y E2E 56 pasadas; después A67 18/20 con overflow residual. No CI global verde.
- CI39064546905/head6f47559, merge4395489 y árbol común0d914c64: ejecución correcta. 599 unitarios, 78 integración PG/Redis, tipos/build/contenido/scan; F05 24/24, A67 20/20, A63 16/16, A66 20/20, A65 8/8, PWA 12/12 y perfiles heredados 1+1 correctos. Único cambio de runtime frente a6d4dbcb: dos márgenes locales de Encuentro. A75/E2E se reutilizan por objetos y scope; no se presenta la fase tail como una nueva matriz completa. Manifiestos, log y crudos en evidence.

[Contrato/plan](CONTRACT.md) · [QA](QA.md) · [Entrega/equivalencia](DELIVERY.md) · [Recuperación](RECOVERY.md) · [Preparación](PREPARATION.md) · [Mapa/preferencias](MAP-SETTINGS.md) · [Arena](ARENA-DESIGN.md) · [Galería](GALLERY.md) · [Rendimiento](PERFORMANCE.md) · [Compatibilidad](COMPATIBILITY.md) · [Recursos/movimiento](ASSETS-AND-MOTION.md) · [Revisión del diff](DIFF-REVIEW.md) · [Sesión humana pendiente](HUMAN-CHECK.md).

Ningún navegador o perfil local en el Mac. CI Linux serial con guard, bloqueo, watchdog, un worker y cero reintentos automáticos. PostgreSQL/Redis reales se distinguen de fixtures y doubles. Cuenta habitual, Word y evidencia histórica conservados.

Entrega en rama/PR, sin main: selección CI `full` restaurada y cierre documental con los mismos objetos de aplicación y pruebas que el candidato validado. No se atribuye una nueva batería a ese cierre; QA y DELIVERY explican la equivalencia. Pendientes: comprensión, comodidad, ritmo, lector hablado, almacenamiento restringido y dispositivo físico. No se atribuyen diversión o retención a automatizaciones.
