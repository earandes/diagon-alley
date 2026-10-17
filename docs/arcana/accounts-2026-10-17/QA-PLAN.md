# A76 · Plan de comprobación

Estado inicial: plan y pruebas por implementar; ninguna ejecución nueva acreditada por este documento. El coordinador registra comandos, SHA y resultados en QA/REPORT al ejecutar. Referencia: `CONTRACT.md` y baseline A75 `ff23f580d9d3989abc9918d7b5bc8328d9e83b62`.

## Fronteras y seguridad del anfitrión

No ejecutar navegador desde este subagente. La batería A76 usa `defineSafeConfig`: Linux, un worker, bloqueo entre procesos/worktrees, cero reintentos, sin vídeo/trazas/capturas automáticas. Solo tres imágenes seleccionadas y explícitas mediante `ARCANA_CAPTURE_A76=1`; no matriz de PNG. No consultar sesiones habituales ni leer mensajes de otros namespaces. Los destinatarios de prueba son UUID bajo `.invalid` y los mensajes se leen directamente del buzón privado de ensayo, sin endpoint HTTP de correo.

## Pirámide y evidencia

| Capa               | Comprobación                                                                                                     | Límite                                                               |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Dominio/cliente    | Reglas de contraseña, normalización, transición y bloqueo de cambio de propietario                               | No prueba entrega de correo ni SQL                                   |
| Servicios reales   | Registro, vinculación, token, concurrencia, revocación, primer kit, rollback y recuperación con PostgreSQL/Redis | Sesiones inject/TCP no prueban composición visual                    |
| Navegador Linux    | Bienvenida, invitado, vinculación, otro contexto, recuperación y Ajustes reales                                  | Contextos emulan otro navegador/dispositivo; no dispositivo físico   |
| Copia/restauración | `pg_dump`/`pg_restore` de dos bases nuevas con identidad y partida ficticias, comparación exacta                 | No acredita copia externa, cifrada, programada o de datos habituales |
| Humana posterior   | Comprensión del invitado frente a cuenta y del cambio de partida                                                 | No realizada por automatizaciones                                    |

## Muestra gráfica acotada

Dos motores, tres tamaños: 1280×900, 390×844 y 865×1079. Cada proyecto comprueba en serie ES/EN × Diagon Alley/ARCANA con formularios y cancelación sin crear cuentas innecesarias. El recorrido económico completo se concentra en Chromium390 para los cuatro cruces idioma/pack: cuenta desde entrada, consulta del kit, inicio de expedición explícito, vinculación de invitado con progreso, login desde segundo contexto, reset y recuperación. La autoridad y los fallos adversos se cubren en integración real y casos de transporte focalizados.

Comprobar semántica, labels, autocomplete, pegado, Escape y devolución de foco; estado pendiente desde primera activación; errores localizados; reducido; reflujo con texto ampliado; imagen ausente sin bloqueo. La inspección visual de PNG seleccionados acredita composición, no comprensión o movimiento.

## Matriz mínima de aceptación

- Nuevo registro: ninguna cuenta o partida pública confirmada antes de verificar; verificación y reenvío no duplican kit.
- Invitado: cancelar registro conserva exactamente jugador, revisión, copias, inventario y receipts; vincular después conserva todos esos datos.
- Entrada existente: sesión nueva en contexto sin cookies recupera el mismo jugador; kit y descubrimientos no se repiten.
- Conflicto: iniciar otra cuenta requiere advertencia explícita, nunca fusiona y no promete recuperar invitado perdido.
- Operación incierta: misma key/propietario sobreviven a respuesta perdida; reautenticación del mismo permite recuperar; otra cuenta queda bloqueada.
- Reset: respuesta pública genérica, token privado caducable y uso único; contraseña anterior y sesiones revocadas dejan de autenticar.
- Concurrencia: doble toque, dos pestañas, doble verificación y vinculación competidora no crean dos identidades o kits.
- Persistencia: migración aditiva; instantáneas anteriores intactas; reinicio de Redis pierde sesión, no identidad/colección; nueva autenticación recupera datos.
- Seguridad: origen incorrecto, campos extra, token manipulado/reutilizado, propietario ajeno y rate limit se rechazan sin mutación económica.
- Restauración: identidad, hash de credencial, jugador, equipo, colección, run/snapshot, derechos, estacionales y receipts comparados antes/después; sesiones efímeras no son el mecanismo de recuperación.

## Límites que deben permanecer explícitos

El buzón de ensayo no acredita recepción por correo externo. La configuración local loopback no acredita HTTPS productivo, protección operativa global o cumplimiento normativo. La matriz emulada no acredita dispositivo físico, gestor de contraseñas real, lector hablado ni comprensión humana. Un test escrito solo contará cuando consten ejecución, SHA y resultado.
