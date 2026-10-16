# ARCANA — expansión incremental por regiones (A55)

Dirección solicitada por Enric,15 octubre2026: cada mapa superado debe dar paso a una región con fondo, magos/rivales y retos diferentes; la complejidad crece. Ahora se implementa una sola región. Es dirección de producto aprobada; los nombres/pools/curvas/economía de regiones futuras no están seleccionados.

## Hoy implementado

Pasaje Torcido (`zoneId: pasaje`),15 nodos ramificados más jefe y configuración autoritativa actual. Dos pactos permiten empezar con temporales; los permanentes son copias propias. No se han cambiado pools,stats,probabilidades,objetos,energía o botín.

La imagen `scene.passage` aparece dentro de la ruta y en su entrada; Pixi dibuja caminos/estados transparentes sobre ella. El paquete visual v4 contiene `regions.pasaje` con nombre es/en y clave de arte. Ese registro solo identifica la apariencia; no crea grafos, recluta personajes ni concede desbloqueos. No equivale a un motor de regiones implementado.

El jefe actual ya guarda `bosque` en `unlockedZones`. Ese dato es un desbloqueo persistido, no una campaña jugable nueva. Repetir Pasaje no se anuncia como región distinta; el estado de Misiones sigue explicando el contenido futuro.

## Próximos incrementos previstos, sin fecha

| Incremento | Resultado de producto esperado | Pendiente antes de construir |
|---|---|---|
| Segunda región | Pasaje completado → transición a paisaje distinto → ruta nueva → jefe propio; progreso conservado | Grafo/versiones y condición de acceso; diseño y arte de la región. El PRD menciona Bosque de20 nodos/criaturas como futuro, no una entrega realizada |
| Habitantes por región | Magos/rivales/encuentros identificables por zona; elecciones de equipo relacionadas con sus retos | Pools por IDs/versiones, qué se recluta/descubre/combate, distribución y repetidos; no fijar tablas de azar desde el cliente |
| Complejidad creciente | Nuevas decisiones de ruta, preparación y sinergias, con señales visuales comprensibles | Probar cada aumento con sesiones de juego; evitar limitarse a alargar el mapa o inflar estadísticas |
| Regiones adicionales | Un mundo ampliable con identidad visual y elenco propios por región | Calibración de dificultad/recompensa, recorrido de transición y persistencia entre versiones |

La pertenencia regional de un mago no debe renombrar su ID ni duplicar/reclasificar copias ya obtenidas. Cualquier regla nueva de traslado de equipo/temporales entre regiones debe concretarse, manteniendo el límite actual: temporal pertenece a su run, propiedad pertenece al inventario. Los datos actuales no se migran como parte del acabado visual.

Separar tres fuentes: campaña de servidor (grafo/pools/reglas), progreso confirmado (victorias/desbloqueos) y paquete de presentación (nombres/escena/arte). Una imagen nueva no concede otra recompensa. Probar primera victoria/repetición, acceso denegado sin gasto, transición y recuperación de respuestas perdidas antes de habilitar otra región.

## Temática y alcance

La referencia de Enric a regiones como Pokémon en un mundo Harry Potter orienta estructura/identidad; A50 pide poder sustituir el contenido por ese tema. ARCANA continúa como paquete activo en este incremento. El mapa regional y los personajes siguen usando claves estables con textos/arte reemplazables. No se ha elegido ni producido un nuevo catálogo Harry Potter, ni se han recuperado reglas históricas de tienda/bienvenida. Word intactos y sin publicación.

## Qué necesita comprobarse con jugadores

Que reconocen la ruta disponible y la siguiente meta sin explicación; descubren que retratos se inspeccionan; distinguen temporal/propio; perciben que una nueva región aporta decisiones y habitantes diferentes; comprenden su resultado y progreso. Los tests automáticos y capturas no contestan estas preguntas. La sesión A53 con Enric todavía no tiene resultados de resolución informados.
