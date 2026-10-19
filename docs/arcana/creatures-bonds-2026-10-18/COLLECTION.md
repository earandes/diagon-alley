# A87 · Duración de la colección ampliada

Contenido implementado en catálogo/tabla 4; validación gráfica todavía pendiente. [Script reproducible](collection-model.mjs), [resultados crudos](collection-model.json). Ejecutado con Node 24.

## Método y supuestos

Cadenas de ocupación finitas exactas para sorteos uniformes independientes. La tabla anterior contiene 29 entradas de peso 1; la nueva contiene 33, con cuatro criaturas añadidas. El inicial queda fuera del azar. El constructor real y el libro de probabilidades utilizan esa tabla versionada; la prueba de contenido comprueba sus porcentajes. No se usa Monte Carlo o comportamiento humano.

Se comprueban casos conocidos: una identidad se obtiene en una apertura; dos identidades están completas tras dos aperturas con probabilidad 0,5 y tras tres con 0,75; la esperanza para tres identidades es 5,5 aperturas. La suma de probabilidad y la normalización se validan.

| Definición | Mediana de aperturas | P90 | P95 | Media |
|---|---:|---:|---:|---:|
| Colección anterior: inicial + 29 | 108 | 161 | 181 | 114,89 |
| Colección nueva: inicial + 33 | 128 | 188 | 211 | 134,93 |
| Tres criaturas propias distintas entre las cuatro nuevas | 32 | 63 | 75 | 35,75 |
| Las cuatro criaturas nuevas | 61 | 119 | 142 | 68,75 |
| Primera copia encantada de cualquier identidad elegible | 69 | 230 | 299 | 100 |

Las dos primeras filas parten únicamente del inicial. No significan que obtener las cuatro nuevas requiera 128 − 108 aperturas: restar medianas sería incorrecto. La cuarta fila también representa a alguien que ya había completado las 30 identidades anteriores y busca las cuatro nuevas entre 33 posibles. Conserva sus 30 descubrimientos, aunque el denominador actual crezca a 34.

## Copias y acabados

Al completar el conjunto se esperan 85,89 duplicados antes y 101,93 después: E[T] menos las identidades obtenidas por sorteo. La cantidad de copias y todas las combinaciones de equipo no forman otro porcentaje obligatorio.

El acabado encantado sigue siendo un 1% independiente, cosmético y sin ×2 para sinergias. No añade otras 34 identidades al denominador. La probabilidad conjunta de una identidad concreta encantada pasa de 1/2900 a 1/3300, sin pity o garantía de aparición. El inicial sigue fuera de esa tabla. Los recuerdos estacionales permanecen separados de la colección base.

La probabilidad individual cambia de 1/29 ≈ 3,448% a 1/33 ≈ 3,030%. Conservar el peso 1 no conserva su porcentaje cuando se añade masa positiva. El libro deriva las cifras activas; una petición con tabla obsoleta requiere actualizar y reconfirmar antes de consumir. Recuperar un receipt histórico nunca sortea de nuevo.

## Lo que no estima el modelo

A 10 Coronas por rana, 128 aperturas compradas supondrían 1.280 Coronas brutas. Esa multiplicación no estima horas, calendario o ingresos necesarios. Regalos y botín reducen compras; derrotas, preparación y Esencia alteran la ruta de ingresos. No se convierten tiempos de automatización en tiempo humano.

Los escenarios de [calibración](CALIBRATION.md) comparan recursos finales y victorias de expediciones declaradas. No constituyen una predicción de hábitos de compra, frecuencia de juego o retención. Una estimación temporal requerirá observar duración de acciones, políticas de gasto y frecuencia humana.

## Acceso táctico frente a propiedad

Los tres Pactos permiten reunir tres criaturas temporales antes del primer combate sin esperar la mediana de 32 aperturas. Las pruebas de contenido verifican la vía en 128 grafos y la validación conectada debe comprobarla en navegador. Esto no concede propiedad, descubre cromos o elimina la cola de la colección permanente.

Añadir criaturas tampoco iguala la distribución de casas propias: hay14Gryffindor, cuatro miembros de cada otra casa y cuatro personas sin casa. El inicial ya pertenece aGryffindor. Con el inicial solo y los tres Pactos de temaGryffindor pueden reunirse cuatro identidades; otra casa parte de tres temporales. Una copia propia de esa otra casa puede orientar el tema y permitir cuatro identidades distintas, puesto que las copias ya presentes se ordenan después en las ofertas. La vía de cuatro temas no se presenta como idéntica probabilidad de propiedad o idéntico umbral inicial.

El acceso táctico a una formación viable, la fuerza concreta de cada pasivo y la duración de completar la colección son problemas distintos. Se conservan las estadísticas, los efectos de casas y el kit; la calibración incluye sus diferencias de resultado, sin afirmar igualdad universal.

No se añaden monedas, XP, canjes, pity o compensaciones, ni se cambian precios, premios o energía para ocultar las colas. Si la observación humana detecta repetición vacía, se estudiará una propuesta posterior con estos supuestos visibles.
