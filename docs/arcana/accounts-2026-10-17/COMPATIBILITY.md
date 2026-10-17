# A76 · Compatibilidad, continuidad y operación

BaselineA75 ff23f580d9d3989abc9918d7b5bc8328d9e83b62. Identidades/desafíos/sesiones son tablas aditivas; tablas económicas y JSONguardados no cambian. Nueva cuenta crea el kit mediante el caso de uso existente; vincular no lo ejecuta. Primera victoria, recuerdos estacionales y expediciones no se reinterpretan. La inicialización usa el mismo clienteSQL del vínculo, con rollback conjunto.

Cookie invitada existente continúa con Redisvigente. Vincular invalida tokens invitados anteriores del mismo jugador; solo sesión autenticada versionada accede después. Cuenta es independiente del namespace efímero de Redis: conservar PG permite nueva autenticación aun perdiendo sesiones. Otro namespace con la misma base no es otra colección de cuenta. Cambiar idioma/pack no cambia identidad, reglas ni datos. No recuperar invitados por ID; perder la única cookie antes de vincular puede dejar datos inaccesibles.

El propietario esperado se comprueba antes de mutar. La UI relee el slot IndexedDB y mantiene exclusión durante POST+carga; no borra metadatos de operación al cerrar/cancelar ni reenvía bajo otra identidad. Cambios en otra pestaña se detectan por propietario esperado; no sustituyen silenciosamente partida en memoria. La revocación protege peticiones nuevas; no revierte una operación ya autorizada/confirmada.

## Entorno y privacidad
La composición de esta entrega sigue siendo un launcher de ensayo en127.0.0.1HTTP. No habilitarla en Internet. Un entorno posterior deberá configurar origenHTTPS/cookieSecure, secretos y transporte de correo externo real, recuperación, backups y política de datos. No se han contratado servicios ni enviado mensajes a personas. Buzón `.local/arcana-mail/<namespace>` denegado por Vite, ignorado por Git y separado de dist; no incluirlo en artefactos o backups públicos. Tokens solo en ese buzón privado, no endpoints de lectura ni logs.

Solo se recoge correo normalizado ASCII, hash de contraseña, IDs y fechas necesarios. No perfiles sociales/nombres reales adicionales. Identidad y partida se conservan hasta cierre autorizado; logout no borra. El cierre/borrado de cuenta no tiene UI implementada en este incremento: deberá verificarse titularidad y resolverse retención de receipts antes de una eliminación transaccional autorizada; conocer el correo no autoriza borrar. No se afirma plazo legal de conservación o cumplimiento normativo.

Expiración comprobada automáticamente: verificación24h, reset30min, sesión7d. Las filas SQL caducadas y mensajes de ensayo NO se borran automáticamente: limpieza operativa pendiente antes de uso público. En ensayo se pueden eliminar archivos del namespace propio una vez finalizada la validación y copias privadas conforme al procedimientoBACKUP; nunca purgar datos habituales o de otras sesiones. La ausencia de limpieza no reactiva tokens caducados.

## Recarga con intención pendiente y sin cookie

El adaptadorIndexedDB permite localizar la siguiente intención pendiente al entrar sin partida en memoria. Se valida su esquema y se utiliza únicamente para limitar la recuperación al propietario original, jamás como prueba de identidad o inventario. No se borra o reenvía bajo otra cuenta. Si hay más de una intención histórica, se conserva cada fila; se recuperan de una en una. La bienvenida bloquea otro invitado y orienta a iniciar sesión con la cuenta de esa petición. Un invitado sin vínculo y sin sesión puede seguir siendo irrecuperable; no se añade reclamación porID.
