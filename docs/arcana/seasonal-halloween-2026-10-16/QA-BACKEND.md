# A68 · Validación de autoridad y persistencia

16 octubre 2026, Mac anfitrión, Node `v24.20.0`, Vitest `5.0.3`. Sin navegador, capturas, vídeo ni procesos gráficos. PostgreSQL real en `127.0.0.1:55432`, Redis real en `127.0.0.1:56379`; no doubles de esos adaptadores. Los servicios existentes no se reiniciaron ni se detuvieron.

## Ejecución TDD e integración real

Comando, siempre serial y con slot coordinado:

```sh
npx --no-install vitest run --config vitest.integration.config.ts tests/integration/arcana/seasonal-events-a68.test.ts
```

- **RED 19:38:49 CEST**: 1/10 pasa, 9 fallan con `INVALID_GAME` al releer después de participar. El caso de uso ya existía, pero el mapeo PostgreSQL estacional aún no estaba integrado. El fallo demostró que guardar un receipt sin recuperar el agregado estacional no basta. Duración 803 ms.
- **GREEN 19:39:11**: 10/10, después de integrar esquema/mapeo reales. Duración 1,48 s.
- **Ampliación 19:39:56**: 13/13; añade doble toque con la misma key, cambios de definición/edición e inicio de run durante gracia. Duración 1,67 s.
- **Última comprobación 19:40:22**: **13/13 pasan**, con códigos de rechazo concretos y rechazo de versión incompatible. Duración 1,69 s. Estas duraciones pertenecen a QA y no son duración humana del evento.

## Cobertura ejecutada

| Caso | Evidencia ejecutada |
| --- | --- |
| Cuenta anterior y consulta | Cuenta sin `seasonal` conserva estado tras lecturas mediante otro adaptador/pool. Redis emite/resuelve sesión y devuelve `TIME` del servidor. |
| Participación explícita | Join guarda definición, fecha, run vinculada y receipt; replay devuelve el mismo resultado. Inventario, copias, equipo, ruta y derechos de campaña permanecen iguales. |
| Progreso y recuerdo | Tres posiciones sucesivas reparan los tres objetivos conocidos. Otro adaptador recupera un único recuerdo con edición, versión, operación y fecha. Una acción posterior se rechaza sin cambios. |
| Preparación y coste | Fixture herida declarada: cada integrante pasa de PV 40/100 y PM 10/20 a PV 65/100 y PM 8/20. Sin reparar escaparate ni otorgar recursos. La posición queda usada; hay que avanzar para reparar. |
| Condición inválida | Sin beneficio de curación o con PM insuficientes: `EVENT_CONDITION`, sin operación, consumo ni progreso. |
| Rollback | Fault `beforeCommit` del adaptador, sobre COMMIT SQL real: no quedan progreso final, recuerdo ni receipt nuevos. |
| Respuesta perdida | Fault `afterCommit`: se informa `UNKNOWN_COMMIT`, pero progreso/recuerdo ya son durables. Repetir la misma petición recupera el resultado incluso si reloj y definición vivos fallan. Otra elección con la misma key da conflicto. |
| Dos conexiones, keys distintas | Compiten por el último escaparate: una sola confirmación, una concesión, una oportunidad y un receipt nuevos. La revisión impide la segunda escritura. |
| Doble toque, misma key | Dos conexiones recuperan el mismo resultado; un solo receipt y una reparación. |
| Calendario | Antes de apertura y desde cierre de admisión no entra nadie. Una run vinculada puede reparar durante gracia; al límite final exacto deja de operar, manteniendo consulta/progreso. |
| Versiones | La participación admitida conserva objetivos originales aunque el proveedor vivo entregue otra versión. Pedir la nueva versión sobre esa participación da `STALE_TABLE`. |
| Nueva edición | Fixture temporal de edición posterior tiene progreso vacío, conserva recuerdo anterior y no renueva una primera victoria de jefe ni su llave. No representa una segunda aventura implementada. |
| Run posterior | Participar sin run no la inicia. StartRun explícito durante admisión vincula la nueva run. Durante gracia sigue pudiéndose iniciar campaña normal, pero esa nueva run no queda vinculada al evento cerrado. |

## Aislamiento y límites

Archivo reproducible: `tests/integration/arcana/seasonal-events-a68.test.ts`. Cada cuenta usa UUID propio y prefijo A68. Limpieza por lista exacta de cuentas creadas y namespace Redis propio; sin `TRUNCATE`, `FLUSHALL`, reinicio global ni acceso a la partida habitual.

Posición de ruta y heridas se preparan mediante transacciones declaradas sobre esas cuentas desechables; no se presentan como recorrido humano ni como combate jugado automáticamente. Las rutas siguen siendo válidas bajo el validador compartido. Los límites de calendario emplean un reloj inyectado exclusivamente en el caso de uso de prueba, sin controles públicos. El caso Redis real se distingue de ese reloj mutable.

Estos trece casos comprueban directamente casos de uso y adaptadores PostgreSQL/Redis. No acreditan por sí solos transporte HTTP, contrato de journal cliente, DOM, foco, responsive, renderer, movimiento reducido o comprensión/diversión. Esas comprobaciones y sus límites corresponden a la validación coordinada del incremento. No se ejecutó matriz gráfica, WebKit o CI Linux desde este archivo.
