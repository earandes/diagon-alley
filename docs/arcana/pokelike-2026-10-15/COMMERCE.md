# A60 · Compra y siguiente acción

## Contrato previo (15 octubre 2026)

Estado inicial: elegir producto no gasta, comprar y abrir son acciones separadas del mismo peso. La bolsa no tiene un destino visible. Grageas no disponen de apertura: se asignan antes del duelo y el sabor se revela al activarse.

Recorrido autorizado: consultar producto → confirmar una única acción con coste explícito → resultado confirmado → revelación o preparación. Con rana poseída, `Abrir 1` es la única acción principal y no cobra moneda. Sin rana, `Comprar y abrir · precio` envía un único comando. Las grageas mantienen compra explícita y una acción diferenciada para ir al mapa/asignación; consultar información junto al tarro nunca consume. Se retira el armario de sabores del mostrador; se conserva en álbum.

Nuevo comando `buy-open-toad` / POST `/api/toads/buy-open`: request `{priceVersion, catalogVersion, tableVersion}`, key/revisión estándar. Una `GameTransactions.transact` valida repetición antes de config/revisión, versiones/precio/tabla/saldo antes del RNG, compra una unidad `${key}:0`, la consume, sortea y registra copia/receipt en una sola revisión. Receipt `buy-open-toad` conserva request, `unitId`, `spentCrowns`, wizard/copyId/isNew. No hay recibo de compra intermedio. La misma key recupera el resultado; petición distinta da conflicto. Las rutas y receipts anteriores siguen siendo válidos, sin migración o reinterpretación. Un fallo de commit no muestra éxito; respuesta perdida usa recuperación estándar por key. El cliente nunca encadena dos POST para simular atomicidad.

Archivos autoridad previstos: application/game.ts, shop-use-cases.ts, client/ports.ts y game-controller.ts; infrastructure/http/api.ts, schemas.ts, client.ts, composition.ts. El almacenamiento SQL JSONB no requiere migración: su validación explícita acepta el tipo nuevo y conserva los antiguos.

Aceptación ES/EN: coste y verbo completos accesibles; consulta sin gasto; una confirmación/una revisión/un recibo; stock existente sin recobro; validación obsoleta/saldo insuficiente sin azar; conflictos/reintentos/concurrencia/rollback/recuperación; pasos siguientes grageas no prometen un sabor antes del combate. Pruebas de reglas, SQL/HTTP reales y navegador aislado, sin tocar5194. Estilo Teatro de alquimia, retorno con flecha/puerta inequívoca, movimiento reducido, foco/teclado y arte ausente conservados. Precios/probabilidades/reglas de combate intactos. No publicación.

## Implementación y pruebas

Implementados y comprobados; QA de interfaz en [COMMERCE-QA.md](COMMERCE-QA.md). El estudio del referente lo coordina el agente principal; esta sección no atribuye observaciones de usuarios.

### Autoridad implementada

`BuyAndOpenCocoaToadUseCase` reutiliza `purchaseProduct`, `consumeToad`, `drawWizard` y `acquireWizard` dentro de la misma transacción. Un receipt nuevo y una revisión, con versiones originales. La snapshot valida sus enlaces a unidad consumida/copia y conserva las rutas anteriores. El cliente guarda el nuevo tipo de intención y su recuperación consulta la misma clave antes de cualquier reenvío. El endpoint usa el mismo control de sesión, Origin, rate limit y esquema estricto. No migración SQL, dependencia, precio o peso nuevos.

TDD ejecutado: siete casos nuevos fallaron por la clase ausente (`commerce-red.txt`); tras implementar pasaron junto a doce históricos (`commerce-green.txt`). La suite focal ampliada es75/75 (`commerce-unit.txt`), incluidos HTTP estricto y recuperación del controlador. Integración focal 18/18 (`commerce-integration.txt`) contra PostgreSQL 55432 y Redis 56379: tres casos nuevos verifican rollback tras escrituras SQL, pérdida tras COMMIT/lectura desde pool nuevo, clientes concurrentes y transporte HTTP tipado. Los18 incluyen 15 casos existentes, no son18 casos nuevos. No se presentan doubles como autoridad SQL real.

### Presentación implementada

Sin rana disponible: una acción `Comprar y abrir` con coste numérico y nombre completo accesible desde el mismo catálogo; selección/consulta no gastan. Con rana antigua disponible: una acción `Abrir 1 / Sin coste extra`, sin una compra competidora ni coste extra. Las grageas conservan compra, muestran unidades disponibles y ofrecen preparación del próximo duelo como acción principal; comprar otra queda en segundo plano. El tarro incluye un sello de información que abre la secuencia ilustrada conseguir→asignar antes del duelo→sabor al activarse. El álbum conserva su armario de sabores. No se inventa una apertura independiente de grageas. El retorno comparte un SVG original editable de flecha izquierda y puerta en ShopBook.tsx, sin recurso externo.

### Límites

Estas comprobaciones son técnicas locales, con cuentas efímeras aisladas. No observación de jugadores ni evidencia de retención. La visita al referente y la aceptación visual humana se registran por separado en el informe principal. No se ha accedido a la partida5194, publicado o desplegado.

### Recurso y movimiento

`ui.shop-return.a60` v1: SVG original creado por Codex con código local, editable en `src/arcana/presentation/ShopBook.tsx` (`ShopExit`). ViewBox 76 × 54, composición completa sin recorte, centro 0.5/0.5; flecha hacia la izquierda y puerta, sin referencia o recurso externo. Uso privado del repositorio, sin atribución de una licencia de franquicia. Es decorativo (`aria-hidden`) porque el control conserva nombre funcional localizado. Desplazamiento hover/foco 4 px / 160 ms ease-out, anulado con movimiento reducido. El sello informativo del tarro es HTML/CSS editable sin texto funcional incrustado en bitmap. No se añade audio o renderizador.


### Cierre de interfaz

20/20 casos web distintos correctos en54,4s, ES/EN y Chromium/WebKit,40capturas con tres anchuras. Incluye compra/apertura con un único POST, unidad antigua sin recobro, offline, reducido, pérdida real de respuesta después del commit y recuperación por GET de la misma clave sin segunda entrega. Inspección visual detectó y corrigió el contraste hover/foco de Preparar (regresión RED1,47:1; comprobación final≥4,5:1). Los logs y fallos de helpers/HMR se conservan separados, sin sumarlos como cobertura. No revisión humana de retención o hardware físico.
