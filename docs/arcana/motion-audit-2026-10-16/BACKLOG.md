# Diez mejoras priorizadas

Impacto, esfuerzo y riesgo son valoraciones expertas; no representan horas medidas ni resultados con jugadores. Las fichas de [MOTION](MOTION.md) definen la propuesta. Los registros de implementación documentan qué parte se ha integrado y qué queda pendiente.

| Prioridad | Mejora: antes → después | Impacto / esfuerzo / riesgo | Dependencias y reutilización | Aceptación principal |
| --- | --- | --- | --- | --- |
| 1 · M01 | Dos relojes y trayectorias ambiguas → tiempo común, actor, objetivo y contacto local | Alto / medio / medio | Proyección del BattleLog y Pixi; todos los combates | Pausa, 2x y ocultación conservan fase; omitir mantiene el resultado; ningún POST durante replay |
| 2 · M02 | Ritual uniforme que puede repetirse al remontar → apertura material, rareza y distinción nuevo/repetido | Alto / medio / medio | GSAP y Canvas2D actuales; todas las ranas | Mismo recibo y premio; omisión, fallo y consulta histórica tienen resultado estático equivalente |
| 3 · M06 | Aparición repetida de botín → asentamiento finito del objeto tras confirmar | Alto / bajo / bajo | Historial visual; forja, bóveda y cofre | Volver a consultar no parece entregar otro objeto |
| 4 · M05 | Condición que cambia sin continuidad → ganancia y coste visibles por unidad | Alto / bajo / bajo | Snapshots y diagnósticos PV/PM de refugios y encuentros | Valores reales, signos legibles, cancelar sin feedback de éxito |
| 5 · M04 | Recluta poco conectado con la formación → retrato y sello del candidato incorporado | Alto / bajo / bajo | Receipt de Pacto y miniaturas | Selección provisional e incorporación son estados distintos; no invade el equipo compacto |
| 6 · M07 | Cambios instantáneos de equipo → objetos que encajan y sinergia que responde | Medio / bajo / bajo | Slots y reglas compartidas | Solo un cambio real anima; un borrador no consume ni descubre sabores |
| 7 · M03 | Ruta estática → trazo breve de la conexión confirmada | Medio / medio / medio | Layout compartido del mapa | Coordenadas coherentes, nodos visibles, sin ticker permanente ni avance al cancelar |
| 8 · M10 | Celebración al regresar y ambiente concurrente → cierre único y ambiente subordinado | Medio / bajo / bajo | Historial visual y visibilidad | Consulta histórica estática; ambiente suspendido cuando otra escena toma el foco |
| 9 · M09 | Entradas heterogéneas → transiciones cortas y semánticas | Medio / bajo / bajo | Diálogos y estado de operación | Foco y acciones disponibles; pendiente/error no celebran éxito |
| 10 · M08 | Cambio abrupto de página → asentamiento local al hojear | Medio / bajo / bajo | Grid, filtros e identidades existentes | Filtrar no finge descubrir; texto ampliado y vacíos conservan acciones |

## Primer incremento completo

M01: preparación → arena → lanzamiento/contacto/curación → desenlace → mapa. Conserva log, saldos, controles y fallback; incorpora reloj común y limpieza. Es una unidad completa y verificable antes de ampliar efectos.

A continuación, M02: compra o unidad poseída → ritual → carta → álbum. Después se aplica el feedback M03–M10 a recorridos existentes, sin nuevas pantallas, reglas o catálogo de efectos.

No se declara una ficha íntegramente implementada por cambiar una stylesheet. [REGISTRO-UI](REGISTRO-UI.md) distingue el mínimo integrado de vuelos al HUD, hojas salientes, poses y mecanismos todavía propuestos. El audio y los nuevos runtimes no forman parte de la implementación.
