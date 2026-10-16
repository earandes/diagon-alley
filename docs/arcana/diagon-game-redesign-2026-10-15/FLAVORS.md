# Descubrimiento de sabores — contrato y evidencia

15 octubre 2026. Alcance delegado del rediseño Diagon Alley.

## Contrato previo

Actualmente existen cuatro efectos y cuatro identidades estables: `mint`, `pepper`, `earth`, `soap`. Una unidad `random-beans` disponible no contiene un sabor conocido antes de activarse. El servidor ya guarda su activación, sabor, actor y consumible en el BattleLog del receipt de nodo, dentro de la misma transacción que consume la unidad y resuelve el combate.

Se añade una proyección pura `flavourCollection(state)` en `src/arcana/application/client/flavour-collection.ts`. Devuelve cuatro entradas, en el orden anterior, con `flavour`, `discovered`, `activations` y `firstDiscovery` (`operationId`, `beanUnitId`, `battleId`, `rulesVersion`) o `null`. La UI puede cambiar nombres, arte y temática mediante el paquete activo, conservando estos IDs.

- Comprar, seleccionar o cancelar una gragea no descubre ningún sabor.
- Descubrir requiere un evento real de activación de un actor del equipo jugador, vinculado a la asignación del receipt y a su unidad consumida por esa misma operación.
- Una derrota también conserva lo probado: la activación ocurrió antes del resultado y fue confirmada.
- Solo se cuenta una vez cada unidad consumida. Eventos rivales, datos sin vínculo y sabores desconocidos no desbloquean entradas.
- El primer descubrimiento sigue el orden autoritativo de receipts; recargar o cambiar de apariencia/idioma no escribe ni sortea de nuevo.
- Las partidas antiguas con receipts válidos recuperan los sabores ya probados. Partidas sin activaciones no reciben descubrimientos inventados.

No se cambia GameState, esquema SQL, precio, probabilidad, efecto, saldo, recompensa ni endpoint económico. Los receipts persistidos son la fuente de verdad; una tabla derivada duplicaría estado sin necesidad. La proyección no pretende autorizar comandos ni sustituir la validación de GameState en los adaptadores.

## Aceptación previa

1. Estado antiguo sin activaciones: cuatro huecos sin descubrir, sin mutación.
2. Activación confirmada: sabor descubierto con procedencia, persistente al releer.
3. Misma operación/reintento: una activación; futuras unidades del mismo sabor aumentan el contador sin cambiar la primera procedencia.
4. Fallo antes de commit: no descubrimiento. Respuesta perdida después del commit: recuperación exacta sin RNG/config actuales.
5. Eventos rivales o sin producto consumido propio: no descubrimiento.
6. Cambio de paquete o textos es/en: identidad/progreso sin cambios.

## Contenido futuro

“Todos los sabores” es una dirección incremental. Este incremento muestra honestamente los cuatro sabores que el motor y las tablas actuales pueden resolver. Añadir otros sabores, sus efectos o sus vías de obtención exige catálogo/configuración y calibración de diseño; no se simulan desbloqueos con siluetas de contenido inexistente ni se altera el balance por presentación.

## Verificación

Implementado: proyección inmutable y tipada; catálogo de cuatro identidades compartido con el dominio mediante `BEAN_FLAVOURS`. Los eventos deben corresponder también a un sabor de la tabla congelada del combate, sin consultar la tabla activa ni calcular otro resultado. Los metadatos de primera procedencia no inventan una fecha: los receipts actuales no guardan un instante de descubrimiento.

Entorno observado: Node24.20.0, npm11.19.0, Vitest5.0.3, PostgreSQL real en127.0.0.1:55432. Solo se crearon y eliminaron jugadores únicos con prefijo `flavour-test-`; sin tocar sesiones existentes. Redis no interviene en esta proyección de solo lectura, y no se ha añadido un adaptador o prueba de Redis sin función concreta.

- `npx --no-install vitest run tests/domain/arcana/flavour-collection.test.ts tests/domain/arcana/beans.test.ts tests/domain/arcana/client-read-models.test.ts`: **36/36 pasan**, incluidos8 casos nuevos de colección. [Log](flavour-green.txt).
- `npx --no-install vitest run --config vitest.integration.config.ts tests/integration/arcana/flavour-postgres.test.ts`: **1/1 pasa contra PostgreSQL real**. Fallo antes del commit conserva cero descubrimientos y estado completo; respuesta perdida después del commit recupera un único sabor desde un pool nuevo; replay recupera el receipt sin configuración/seed nuevos y conserva consumo/saldos. [Log](flavour-postgres.txt).
- TDD: archivo de pruebas escrito primero; RED real por módulo aún inexistente, sin assertions ejecutadas en esa primera corrida. Implementación posterior y GREEN de los comportamientos. [RED](flavour-red.txt).
- `npm run typecheck`: primera ejecución11:24 correcta; segunda ejecución11:25 encuentra únicamente componentes/traducciones de presentación todavía en edición paralela, sin errores en los archivos de este ámbito. [Registro provisional](flavour-typecheck.txt). La validación global definitiva corresponde al coordinador cuando finalice la integración.

Cobertura automatizada: cuatro sabores, partidas antiguas/JSON recuperado, lectura sin mutaciones, repetición de sabor con unidades distintas, reintento idempotente, primer descubrimiento estable, derrota confirmada, eventos rivales aunque su asignación se manipule, consumibles sin vínculo, sabor ajeno a tabla congelada, receipts/eventos duplicados y legacy parcial. No son pruebas con usuarios ni validación de que la colección aumente el retorno.

La comprobación del cambio ARCANA/Diagon Alley y es/en de la interfaz corresponde a los recorridos integrados: esta proyección no acepta paquete o idioma y devuelve los mismos IDs desde el mismo estado autoritativo.
