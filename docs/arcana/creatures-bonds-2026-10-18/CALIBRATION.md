# A87 · Calibración del contenido corregido

Escenarios técnicos ejecutados; aceptación gráfica del candidato pendiente. No son hábitos humanos, comprensión o prueba de diversión. Se conservan todos los valores, también derrotas y empeoramientos.

## Decisión de acceso

Dos candidatos por Pacto y tres Pactos existentes: una vía humana de casa y otra de criaturas. El tema humano de nuevas expediciones puede ser cualquiera de las cuatro casas. El inicial solo no fuerza Gryffindor; otros cromos propios de una casa pueden orientar la oferta. Se excluyen primero las identidades propias al ofrecer tres candidatos distintos.

La primera versión A87 conservaba tres temas humanos y eliminaba las alternativas Gryffindor al sustituir al especialista. La alternativa A85 sí incluía Gryffindor, aunque tampoco garantizaba tres identidades distintas de esa casa. La corrección amplía a cuatro temas completos en A87 sin alterar ofertas históricas A85. No añade paneles, candidatos, precios o sorteos al consultar. [Calibración anterior conservada](CALIBRATION-V1.md).

## Reglas elegidas

Un vínculo por bando: Auto prioriza una casa activa y después Orden, Mortífagos y criaturas. Puede elegirse otra familia explícitamente. Tres identidades vivas activan y cuatro refuerzan; duplicados y acabado encantado no inflan el conteo. Afinidades independientes.

- Orden: hasta1/2PV a otro aliado vivo herido, una ayuda por bando y ronda. Sin autocura o resurrección.
- Mortífagos: +1/2daño bruto al acertar sobre objetivo que ya estaba a mitadPV o menos, después del multiplicador de gragea. No modifica objetivo o azar.
- Criaturas: cada aliado amortigua hasta2/3del primer impacto positivo. Fallo o daño bruto0no gastan; no sobrante o reducción de quemadura.

Se descartaron recuperaciónPM y guardia solo para contribuyentes: la primera tendría un valor ordinario dudoso con40PM iniciales y coste1; la segunda dejaría sin protección al inicial en el primer puesto. Son decisiones de diseño contrastadas con el motor, no observaciones humanas. Los valores actuales se conservan tras comparar beneficios y renuncias; no se busca una tasa arbitraria de victoria.

## 1.536 expediciones pareadas

[Script](../../../tools/verification/simulate-creatures-a87.mjs), [resumen](simulation.json), [todas las filas](simulation-samples.jsonl).32semillas iguales por grupo, perfilesA85/A87, inicial o tres compras guionizadas, tres desafíos y cuatro políticas.48grupos, ninguna run quedó activa. Transacción en memoria y casos de uso/motor reales, sin navegador o SQL.

Sin grageas/equipo, condición inicial completa, refugiosPV, encuentros pasados y ruta voraz pública por tipo de nodo. `quantity` prioriza potencia/PV, `affinity` grupos de afinidad y `house` casas; esta última conserva al inicial y primer comprado. `creature` reserva humanos para dejar puestos, prioriza criaturas y usa potencia como desempate; enA85, donde no había criaturas, ese término es0. No es una política humana óptima ni una recomendación del juego.

| Colección · desafío · política | A85 victorias | A87 victorias | PVmedios finales A87 |
|---|---:|---:|---:|
| starter · discovery · quantity | 32/32 | 32/32 | 257.2 |
| starter · discovery · affinity | 32/32 | 31/32 | 255.4 |
| starter · discovery · house | 32/32 | 31/32 | 252.8 |
| starter · discovery · creature | 32/32 | 32/32 | 242.9 |
| starter · tactical · quantity | 31/32 | 31/32 | 161.7 |
| starter · tactical · affinity | 31/32 | 28/32 | 158.8 |
| starter · tactical · house | 28/32 | 28/32 | 156.5 |
| starter · tactical · creature | 31/32 | 29/32 | 117.1 |
| starter · mastery · quantity | 0/32 | 0/32 | 0.0 |
| starter · mastery · affinity | 0/32 | 0/32 | 0.0 |
| starter · mastery · house | 0/32 | 0/32 | 0.0 |
| starter · mastery · creature | 0/32 | 0/32 | 0.0 |
| three-purchases · discovery · quantity | 32/32 | 32/32 | 374.7 |
| three-purchases · discovery · affinity | 32/32 | 32/32 | 355.4 |
| three-purchases · discovery · house | 32/32 | 32/32 | 363.8 |
| three-purchases · discovery · creature | 32/32 | 32/32 | 242.9 |
| three-purchases · tactical · quantity | 32/32 | 32/32 | 307.5 |
| three-purchases · tactical · affinity | 32/32 | 32/32 | 297.9 |
| three-purchases · tactical · house | 32/32 | 32/32 | 306.6 |
| three-purchases · tactical · creature | 31/32 | 29/32 | 117.1 |
| three-purchases · mastery · quantity | 12/32 | 11/32 | 24.9 |
| three-purchases · mastery · affinity | 15/32 | 11/32 | 15.2 |
| three-purchases · mastery · house | 15/32 | 15/32 | 60.1 |
| three-purchases · mastery · creature | 0/32 | 0/32 | 0.0 |

Con inicial, Táctico: criaturas gana en semillas1,2,3donde casa pierde; casa gana en16y28donde criaturas pierde. Descubrimiento: casa/afinidad pierden en18, mientras cantidad y criaturas completan32/32. Esto conserva una vía viable con inicial, sin prometer que cualquier preparación gane. Maestría inicial0/32en las cuatro políticas.

En la colección mixta, reservar humanos comprados para dejar puestos puede desperdiciar su coste: no se oculta que la política de criaturas obtiene0/32enMaestría. Los precios y premios no cambian, pero sí los ingresos derivados de resultados: Maestría/mixta/afinidad pasa de64,375a58,125Coronas medias finales. Son cuentas de primera victoria, no ingresos repetibles universales para calcular horas de colección.

## 384 escenarios con criaturas propias

`node tools/verification/simulate-creatures-a87.mjs --owned-creatures`. [Resumen](simulation-owned-creatures.json), [filas](simulation-owned-creatures-samples.jsonl). Fénix, hipogrifo y unicornio adquiridos en tres aperturas seleccionadas por fixture. No se promete obtenerlos en tres compras aleatorias: el modelo exacto da32aperturas de mediana para tres especies propias.

32semillas ×3desafíos ×4políticas; todas completan32/32Descubrimiento y Táctico. Maestría: cantidad11, afinidad15, casa17 y criaturas11victorias. PVmedios trasTáctico:311,0con cantidad/criaturas frente292,5concasa; trasMaestría13,1frente47,2. La protección breve no sustituye a toda preparación prolongada. Se conserva su resultado peor en el desafío largo.

## 640 pares con los mismos integrantes

[Script](../../../tools/verification/compare-bonds-a87.mjs), [resumen](bond-comparison.json), [filas](bond-comparison-samples.jsonl). Cinco órdenes, cuatro condiciones de llegadaPV, dos desempates porID y rivales actuales distintos; unseed42. Es enumeración determinista, no320semillas independientes. Sin equipo o grageas. Preferencia lexicográfica: desenlace, supervivientes, PVpropios y menorPVrival.

- Orden frenteHufflepuff:77casos favorecenOrden,145casa,98iguales.74ventajas deOrden ocurren ganando; tres cambian una no victoria por victoria en esta cuadrícula. Un ejemplo deja430PVfrente429; otro72frente73. No inflar una diferencia de1PVcomo un cambio radical.
- Mortífagos frenteSlytherin:27favorecenremate,216iniciativa,77iguales.26ventajas ocurren ganando; ninguna cambia una derrota por victoria aquí. Ejemplos:387PVfrente381en un jefe y368frente379en otro duelo. Es una especialización de uso concreto.

Estas filas son idénticas a la versión anterior porque no se cambiaron integrantes, enemigos o reglas de combate. El contenido de los Pactos sí cambia y por eso se repitieron las expediciones. [Hashes y comparación](model-equivalence.json). Las filas A85 permanecen idénticas; no se sobrescribió la referencia.

## Colección y límites

Tabla4:33tickets equiprobables y el inicial fuera del azar.34identidades, sin duplicar por acabado o sumar recuerdos.1/33poridentidad;1/3300poridentidad encantada,1%cosmético independiente. Completitud desde inicial: mediana128aperturas,P90188,P95211; antes108/161/181. Tres especies propias32/63/75y las cuatro61/119/142. [Modelo exacto](collection-model.json), [interpretación](COLLECTION.md). No convertir esas cifras en horas sin ingresos, gastos y tiempos humanos.

No se simulan todas las colecciones, condiciones, equipo, grageas o hábitos. Las diferencias entre políticas combinan composición y preparación: no se atribuye causalmente una victoria a la guardia sin control. Orden no se garantiza con el inicial; sus14identidades y la colección disponible ofrecen otro acceso, distinto de las cuatro casas y criaturas. El funcionamiento, el arte, el sonido y el rendimiento se comprueban en capas separadas. La observación humana y el dispositivo físico siguen pendientes.
