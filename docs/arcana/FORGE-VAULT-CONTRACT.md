# A42 — Taller y Bóvedas

12 octubre 2026. Ambos flujos están solicitados en el MVP actual; valores de recetas/botín no definidos en el PRD.

Estado inicial: equipo propio y Llaves de Oro de jefes persistidos; sin operaciones de forja o canje. Ensayo explícito/versionado: nueve combinaciones madera/núcleo, precio en Coronas que procura materiales y produce una varita nueva. No modificar la varita inicial, introducir inventario de ingredientes o elegir economía de producción. Abedul/Sauce/Saúco: +2/+3/+4 poder y costes 15/20/25; Dragón/Fénix/Wyvern: multiplicadores 1,20/1,15/1,10. Son hipótesis revisables, visibles como provisionales.

Bóveda del ensayo cuesta exactamente una llave. Tabla versionada de alto valor: pesos iguales entre 50 Coronas + dos Sapos + varita de Saúco/Dragón (+4, ×1,30), y 75 Coronas + dos tarros + Céfiro 2000 (+8 iniciativa). No conceder nuevas llaves dentro del canje, no precio monetario ni garantía productiva. Probabilidades visibles derivadas de pesos, selección de autoridad mediante puerto RandomTickets; resultado persistido, reintento no vuelve a sortear.

Acción explícita confirma receta/precio o uso de llave/tabla. Una transacción por cuenta guarda coste, nuevas instancias y receipt antes de mostrar éxito. Repetir key y petición recupera mismo receipt incluso con config/revisión nueva; otra petición con esa key da conflicto. Claves distintas concurrentes se someten a revisión/stock: una llave no financia dos canjes. Config obsoleta/saldo insuficiente/llave cero/rollback no entregan ni consumen.

IDs de equipo `key:equipment:index`; snapshots de tipo/version/stats conservados. No equipar automáticamente ni curar una run al forjar; pieza nueva se puede asignar desde Cromodex por caso existente. Bóveda puede entregar unidades de producto abribles y equipo utilizable; no segunda compra para usar lo obtenido.

Integrar dominio puro de recetas/tabla/coste, casos `ForgeWandUseCase`/`OpenObsidianVaultUseCase`, unión de receipts validada, schema HTTP/contexto de dueño, controller/intención recuperable y SQL existente. No nuevo repositorio/genérico ni tablas innecesarias: inventario de equipo y receipts JSONB ya tienen frontera real. UI es/en, precio/efecto/llaves, confirmación/cancelación, resultado e inspección; keyboard/recarga y error sin gasto.

TDD previo: validación/config/propiedad, saldo/llave/versión, sorteo acotado, replay sin RNG/config, conflicto, rollback/concurrencia, snapshots/persistencia y transporte sin stats del cliente. Pruebas reales SQL/Redis/browser después de lo puro. Word intactos; contratos/evidencia no equivalen a balance aprobado.
