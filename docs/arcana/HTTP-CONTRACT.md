# Contrato HTTP ARCANA previo a implementación

11 octubre 2026 · A30/A32/A34. Cuarto bloque: adaptador Fastify y composición con los puertos reales. Sin cambiar el PRD o inventar balance/configuración productivos.

## Autoridad y recorrido

API bajo `/api`, autenticada por token opaco Bearer emitido por `Sessions`. No aceptar `playerId` del cliente. U26 no ha elegido registro/login/recuperación; la API sirve cuentas/sesiones ya provisionadas por autoridad, no expone un endpoint que otorgue identidad al indicar un ID. Composición del ensayo y tests pueden crear cuentas técnicas e inyectar configuración; eso no es flujo de autenticación productivo.

- `GET /api/state`: estado propio confirmado de SQL. Lectura no gasta ni acredita Esencia; la hora para mostrar regeneración la proporciona autoridad, sin sustituir saldo almacenado. Puede entregar `{state, serverTime}` para presentación/reconciliación.
- `GET /api/content`: catálogo/tabla/precios/grafo/reglas públicos versionados; nunca función `prepareOwned`, clave privada, seed futura o acceso a configuración arbitraria.
- `GET /api/operations/:id`: recibo propio con estado actual para recuperar respuesta perdida; no nueva operación/sorteo/recompensa.
- `POST /api/purchases`, `/api/toads/open`, `/api/runs`, `/api/nodes/advance`: comandos `{key, expectedRevision, request}` existentes, sin campos extra/coerción de números. Stats, seed, oponentes, ganador, botín, saldos y hora del cliente se rechazan.
- `DELETE /api/session`: revoca únicamente el token presentado, no borra cuenta/inventario.

Formación por IDs poseídos del caso de inicio; `prepareOwned` procede de autoridad. Resolución dentro de `AdvanceNodeUseCase`; no endpoint para un resultado elegido por el cliente. `ResolveCombatUseCase` es coordinador interno, no otro commit económico.

## Transporte y errores

JSON Schema escrito por la aplicación, `additionalProperties:false`, Ajv sin eliminación silenciosa de campos, sin coerción/defaults. Límite de body configurable explícito; no publicar payload arbitrario en logs. Sesión y límites consultados en hooks, fuera del núcleo. Rate limit por dirección remota antes de autorización y por jugador después; máximos/ventana configurados para el ensayo, no política de producción aprobada. Sin `trustProxy`, CORS abierto o cookie de identidad improvisada.

Respuestas de estado/operación/config con `Cache-Control:no-store`. Errores por código estable, sin stack/SQL/secrets; la futura UI los traduce es/en. `400 INVALID_REQUEST`, `401 UNAUTHORIZED`, `404 NOT_FOUND/PLAYER_NOT_FOUND`, `409` revisiones/versiones/conflictos, `422` reglas de gasto/selección, `429 RATE_LIMITED` con Retry-After, `503 STORAGE/UNKNOWN_COMMIT`. Para UNKNOWN_COMMIT indicar recuperación con misma key; no anunciar fallo definitivo ni volver a generar intención. Error inesperado `500 INTERNAL_ERROR`. Sin pedir al cliente datos que la autoridad ya posee.

## Composición y pruebas TDD

Factory Fastify independiente de `listen`, casos de uso reales y puertos inyectados. Factory de composición PG/Redis/PRNG/crypto crea los adapters y tiene cierre explícito de recursos propios; no lee/sustituye saldo del navegador. API de sesión requiere emisión externa hasta resolver U26. Fuente criptográfica de seed/ticket usa `node:crypto`; combate reproduce con PRNG versionado a partir de seed persistida.

RED previo: contrato auth/schema/identidad, compras/apertura, inicio/avance, recuperación por key, valores del cliente rechazados, rate limit, logout y errores. GREEN con Fastify inject (HTTP en memoria, no socket). Integración posterior PG+Redis+API real verifica aislamiento por sesión, Redis TIME/limits, tx/log, competencia y respuesta perdida. Un socket loopback comprueba transporte real y cierre; no acredita despliegue, cuentas recuperables, TLS externo o navegador.

Referencias técnicas primarias revisadas: [validación y serialización](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/), [hooks](https://fastify.dev/docs/latest/Reference/Hooks/), [testing](https://fastify.dev/docs/latest/Guides/Testing/). Configurar validación explícita y separar factory de arranque permite probar contratos antes de abrir un servidor.

## Cliente previo a implementación

Cliente tipado para React sin reglas económicas o simulación. `fetch` y proveedor de token inyectados; cada método devuelve estado/operación/config del servidor. No incluir playerId, stats, seed o resultado. No leer inventario IndexedDB histórico. Red/JSON inválido/401/conflicto se convierten en códigos para es/en. No reintentos automáticos que generen nueva key: el comando original se conserva por el controlador futuro y recuperación consulta `/operations/:id` o reenvía ese mismo comando.

Respuestas de estado pasan validación runtime del esquema GameState; se devuelve snapshot inmutable. Operaciones exigen ID de receipt correspondiente al comando, recuperando la copia validada dentro del estado confirmado. Hora debe ser entero seguro no negativo. Una respuesta sin contrato válido no anuncia premio. Request usa no-store; no aceptar redirección que reenvíe Bearer a otro host. HTTP JSON/schema y semántica de dominio permanecen en sus fronteras correspondientes, sin framework en núcleo.

TDD: cuerpo/header/metodo correctos, IDs/versiones preservados, estado de autoridad en vez de saldo local, error/conflicto/commit incierto, red fallida sin retry, ausencia de token, payload/resultados inválidos y recuperación con misma key. Persistencia del comando pendiente y UI/gestión de token todavía siguientes comportamientos, no implementados por este cliente.
