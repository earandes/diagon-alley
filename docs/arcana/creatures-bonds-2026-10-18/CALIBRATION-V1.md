# A87 · Calibración v1 histórica, sustituida antes de integrar

Fuente428927f; conserva tres casas humanas de ensayo y la vía de criaturas. La revisión posterior añade también la vía temporal Gryffindor en nuevas expediciones A87. Estas cifras no describen el candidato corregido. Reproducir el script con su checkout428927f; los originales se conservan debajo.

# A87 · Decisiones y calibración de ensayo

Implementado enrama; faltaCILinux y revisión visual antes de aceptar la entrega. No se infiere diversión, comprensión o retención.

## Qué se eligió

Un vínculo por equipo, tres identidades vivas activan y cuatro refuerzan. Auto prioriza una casa activa, luego Orden/Mortífagos/criaturas; se puede elegir otra especialización en el libro de preparación. Las afinidades siguen independientes. Datos biográficos no conceden todos un pasivo. Snape puede figurar en dos afiliaciones históricas sin sumar ambas; criaturas no reciben casa ficticia. Encantado sigue sin potencia.

Reglas3: Orden ayuda1/2PV a otro aliado vivo herido una vez por bando/ronda; Mortífagos suma1/2daño bruto de remate sobre objetivo ya a mitadPV o menos; criaturas amortigua2/3del primer acierto positivo contra cada aliado. No quemadura, sobrante o resurrección. Activación bloqueada al confirmar; no recalcular durante replay.

Se descartó recuperarPMal inicio porque1PMporintento/40PMbase hacía dudoso su valor ordinario. No se presenta eso como experimento humano. Guardia solo a contribuyentes se descartó porque el inicial ocupa el primer puesto y la familia tardaría en actuar; el efecto de equipo conserva una renuncia de composición, sin otra barra permanente.

## Recorridos pareados:1536

[Script](../../../tools/verification/simulate-creatures-a87.mjs), [resumen](evidence/calibration-v1/simulation.json), [todas las muestras](evidence/calibration-v1/simulation-samples.jsonl). PerfilA85 frenteA87,32semillas iguales por grupo, colección inicial/mixta de tres compras guionizadas, tres desafíos y políticas cantidad/afinidad/casa/criaturas.48grupos, todos cerrados. Casos de uso/motor reales, transacción enmemoria. Sin grageas; condición inicial completa, refugiosPV, encuentros pasados y prioridad de ruta pública voraz. No representan hábitos humanos, SQL o tasas universales.

| Estado/política | A85 victorias/32 | A87 victorias/32 |
|---|---:|---:|
| Inicial · Descubrimiento, todas |32|32|
| Inicial · Táctico, cantidad |31|30|
| Inicial · Táctico, afinidad |31|29|
| Inicial · Táctico, casa |28|28|
| Inicial · Táctico, criaturas |31|29|
| Inicial · Maestría, todas |0|0|
| Tres compras mixtas · Descubrimiento, todas |32|32|
| Tres compras mixtas · Táctico, cantidad/afinidad/casa |32|32|
| Tres compras mixtas · Táctico, criaturas |31|29|
| Tres compras mixtas · Maestría, cantidad |12|11|
| Tres compras mixtas · Maestría, afinidad |15|11|
| Tres compras mixtas · Maestría, casa |15|15|
| Tres compras mixtas · Maestría, criaturas |0|0|

La política de criaturas reserva los humanos comprados para dejar puestos a tres temporales; por eso gastar30coronas en esa fixture no garantiza aprovecharlas. No se oculta esa renuncia ni se usa el caso para declarar que las criaturas siempre son peores. Táctico/inicialA87: ensemillas1y3, criaturas gana donde casa pierde; en28 ocurre lo contrario. Cambian composición y decisiones; no se atribuye causalmente una victoria al bloqueo sin una comparación controlada.

Los premios/precios permanecen; los ingresos sí varían al cambiar victorias/ruta. Por ejemplo, Maestría/mixta/afinidad pasa de64,4a58,1coronas medias finales. Eso no se denomina neutralidad económica.

## Colección de criaturas propia:384escenarios adicionales

`node tools/verification/simulate-creatures-a87.mjs --owned-creatures`. [Resumen](evidence/calibration-v1/simulation-owned-creatures.json), [muestras](evidence/calibration-v1/simulation-owned-creatures-samples.jsonl). Tres compras seleccionadas por fixture(Fénix/Hipogrifo/Unicornio), no tres compras aleatorias garantizadas.32semillas×3desafíos×4políticas, soloA87 porque esas identidades no existían enA85. La política de criaturas conserva las propias y puede reclutar la cuarta enPacto.

Todas las políticas ganan32/32enDescubrimiento/Táctico. Maestría: cantidad11, afinidad12, casa14, criaturas11. PVmedios trasTáctico: cantidad/criaturas311,0frente a291,3decasa; trasMaestría13,1frente a39,7. Se conserva el peor desempeño de criaturas enel desafío largo. No demuestra que toda formación o jugador alcance esos resultados.

## Renuncias sobre los mismos integrantes:640pares

[Script](../../../tools/verification/compare-bonds-a87.mjs), [resumen/ejemplos](evidence/calibration-v1/bond-comparison.json), [muestras](evidence/calibration-v1/bond-comparison-samples.jsonl). Miembros propios obtenibles y composicionesrivales actuales distintas; cinco órdenes de formación, cuatro estados de llegadaPV, dos órdenes de desempateID. Sin equipo/grageas, unseed42: enumeración determinista, **no320semillas independientes**. Preferencia: desenlace, supervivientes, PVpropios yPVrivalrestante. Los integrantes y sus estadísticas base son iguales dentro de cada par.

- Orden frente aHufflepuff:77casos favorecenOrden,145favorecencasa,98iguales.74ventajas deOrden ocurren ganando; tres convierten una no victoria en victoria enesta cuadrícula. Ejemplo completo/Descubrimiento:430PVrestantes conOrden y429concasa. EnMaestría con igual formación:72frente a73. No inflar una diferencia de1PVcomo cambio radical.
- Mortífagos frente aSlytherin:27favorecenremate,216iniciativa,77iguales.26ventajas ocurren ganando, ninguna cambia una derrota porvictoria aquí. Ejemplo jefeDescubrimiento:387PVfrente a381; duelo deotroperfil:368frente a379. Especialización de uso concreto, no mejora universal.

Valores1/2y2/3conservados tras observar ventajas/renuncias; no se busca50%deganar para declarar diversión. El efecto de cada vínculo se reconoce por eventos registrados y cantidades, sin afirmar «ganaste gracias a…».

## Acceso y duración de colección

Tres Pactos existentes ofrecen, como alternativa a casa, tres criaturas distintas fijadas al crear run.128grafos mantienen un camino antes delprimer combate. Temporal no es propiedad o descubrimiento delCromodex. Orden no se promete como compañía garantizada del inicial: depende de colección o mezclas de reclutas; hay14identidades frente a4Mortífagos/4criaturas. Mortífagos puede aprovechar la ofertaSlytherin. Son accesos diferentes declarados, no equivalentes a la corrección de casasA85.

[Modelo exacto](collection-model.json):34identidades base(starter+33equiprobables), tabla4. Completitud desde inicial: mediana128aperturas,P90188,P95211, frente a108/161/181antes. Tres criaturas propias:32/63/75; las cuatro61/119/142. El regalo temporal no reduce esas cifras de propiedad. Un jugador que ya tenía30mantiene sus30descubrimientos y le faltan cuatro, con distribución61/119/142; no restar medianas128−108.

1/33poridentidad;1/3300para una identidad encantada. Acabado1%independiente intacto. Duplicados esperados al100%≈101,93; no fusión, pity o canje nuevo. El modelo verifica cupones conocidos y probabilidades normalizadas. No convertir aperturas en horas o dinero gastado sin modelar ingresos, derrotas, costes ytiempos humanos.

## Límites

Sin consumo de grageas o equipo enestos modelos; sus contratos tienen pruebas separadas. No se simuló toda colección posible, todas las condiciones, frecuencia de juego ocalendario. Las comparaciones de perf/arte son una validación distinta pendiente. Cambiar un parámetro exige conservar las muestras previas y repetir los casos afectados. Las cifras delmodelo no acreditan dificultad percibida, preferencia estética o interés enrepetir.

## Reproducción del candidato

Los 1.536 escenarios pareados, los 384 de criaturas propias y los 640 pares controlados se repitieron secuencialmente sobre el código A87 comprometido. Los tres archivos de muestras JSONL son idénticos byte a byte a la primera ejecución: [hashes y alcance](evidence/calibration-v1/model-equivalence.json). El constructor obtiene ahora los miembros desde los rasgos del catálogo, evitando una segunda lista manual. La equivalencia comprobada se refiere a las filas de estos escenarios; no demuestra equivalencia de cualquier estado posible.

El modelo exacto de colección también se ejecutó nuevamente y conserva los percentiles publicados. Los scripts usan Vite como cargador SSR, sin renderer o navegador. Se desactiva HMR para no abrir un socket innecesario; ese ajuste de infraestructura del script no altera las reglas o semillas. La primera reproducción extensa finalizó antes de desactivar HMR y las siguientes se ejecutaron con HMR desactivado. No se confunde este ensayo en memoria con los 111 casos de persistencia real.
