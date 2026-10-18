# A76 · Guardar, recuperar identidad y restaurar datos

## Tres responsabilidades

PostgreSQL conserva jugador, inventario, colección, equipamiento, run/snapshot, derechos, estacionales, receipts e identidad verificada. Redis coordina sesiones y límites; perder una sesión no debería borrar la identidad permanente y una nueva autenticación puede emitir otra. IndexedDB conserva intenciones pendientes por propietario y key; una copia SQL no sustituye la recuperación de esas intenciones del navegador.

El volumen `arcana-postgres` de `compose.arcana.yml` permite conservar PostgreSQL al detener/reiniciar sus contenedores. No equivale a una copia independiente frente a pérdida del disco/volumen. El volumen Redis conserva su AOF; tampoco es la copia autoritativa de la colección. No ejecutar `docker compose down -v`, restauraciones o cambios de volúmenes sobre la partida habitual para probar el incremento.

## Ensayo reproducible aislado

`tools/verification/verify-accounts-backup-a76.mjs` crea dos bases nuevas con nombres internos UUID: `a76_backup_<nonce>` y `a76_restore_<nonce>`. No acepta base existente, playerId, correo real ni archivo de copia como destino/entrada. Solo la base nueva de origen recibe schema aditivo y una fixture explícita de persistencia: identidad con credencial real scrypt, inventario, copia, equipo, formación, snapshots JSON, derecho de victoria, estacionales y receipt. Los snapshots de esta fixture no se presentan como una campaña generada o premios ganados.

Ejecuta `pg_dump` custom y `pg_restore` reales, compara todas las filas/tablas de ambas bases y verifica la credencial restaurada con `ScryptPasswords` de producción. El resultado muestra únicamente counts/hash/tamaño; nunca contraseña, hash de credencial, token, buzón o archivo de copia. La copia se mantiene en memoria y no se incorpora a Git. Las dos bases propias se eliminan al terminar mediante `finally`; no se cierran procesos ajenos.

Comandos para el coordinador, en serie y con PostgreSQL del proyecto saludable:

```sh
# Mac: utiliza exclusivamente los binarios PostgreSQL16 ya disponibles en el contenedor propio.
A76_PG_TOOLS=compose node tools/verification/verify-accounts-backup-a76.mjs

# CI Linux: usa pg_dump/pg_restore instalados y compatibles con el servidor16.
A76_PG_TOOLS=native node tools/verification/verify-accounts-backup-a76.mjs
```

Requiere Node24, permisos de desarrollo para crear/eliminar esas bases nuevas y, en modo native, herramientas PostgreSQL compatibles. No instala herramientas ni configura servicios globales. El script usa exclusivamente `127.0.0.1:55432` y las credenciales públicas locales de desarrollo; no está diseñado para conectarse a producción. Un fallo de permisos/herramienta se comunica como tal y no se sustituye por una comparación JSON en memoria.

## Procedimiento para un futuro entorno operativo

Antes de publicar, se necesitan ubicación independiente de copias, política de retención, cifrado y acceso restringido, responsable de restauración, periodicidad y objetivos de pérdida/recuperación. Son decisiones operativas posteriores, no capacidades acreditadas por este ensayo. No se contrata almacenamiento ni se añaden cron globales.

La restauración operativa debe ir primero a una base nueva aislada: comprobar versión/schema, integridad referencial, identidades, credenciales, partidas, snapshots y receipts antes de decidir un cambio de servicio autorizado. Las sesiones restauradas o anteriores pueden revocarse; las personas deben poder volver a autenticarse. Nunca importar inventario del cliente como reparación de una copia incompleta.

Los mensajes del buzón de ensayo contienen secretos de corta vida. Permanecen en `.local/arcana-mail/<namespace>`, fuera de Git y del servidor estático, con permisos restringidos. No deben incluirse en artifacts, copias públicas o capturas. La política para correo externo y sus proveedores sigue separada.

## Evidencia y límites

Comprobación local no gráfica ejecutada el 17 octubre sobre el árbol de trabajo A76 (todavía sin commit): `A76_PG_TOOLS=compose node tools/verification/verify-accounts-backup-a76.mjs` → **PASS**, 15 tablas/16 filas, archivo custom de 34.109 bytes, igualdad exacta de filas y snapshots; contraseña restaurada verificada con el adaptador scrypt de producción y contraseña incorrecta rechazada. SHA256 del snapshot de esta fixture: `3025dea8ac8f8a8b22e291dcc4a667756ef4bc23f3b7fd5684d4f978ad26c137`. Los UUID, salt y timestamp del ensayo hacen que el hash/archivo cambien en otra ejecución sin alterar la aceptación de igualdad origen/destino.

El primer intento falló antes de crear bases: Node24 strip-only rechazó una parameter property de `IdentityError`. Se sustituyó por campo readonly y asignación explícitos, semánticamente equivalentes, para reutilizar el adaptador real sin loader o dependencia nueva. La segunda ejecución es la descrita arriba; no se presenta el primer intento como validación superada.

QA/REPORT debe asociar la comprobación final a su SHA y conservar su salida al ejecutar CI. Este ensayo local no acredita CI, recuperación del disco real, correo externo, login desde hardware físico ni un plan operativo completo de backups.

## Reinicio real de servicios sin tocar el entorno habitual

`node tools/verification/verify-accounts-restart-a76.mjs` utiliza únicamente las dos imágenes PostgreSQL16/Redis ya fijadas y disponibles en Compose; `--pull=never` impide descargas. Crea dos contenedores nuevos, con UUID y etiqueta de propietario, puertos aleatorios exclusivamente loopback, memoria limitada a256/128MiB y0,5CPU cada uno. No monta volúmenes del entorno habitual. Antes de reiniciar o eliminar valida ID exacto, nombre, etiqueta y límites. Readiness acotado a60s, comandos Docker con timeout y limpieza de sus contenedores/volúmenes anónimos propios. No abre navegador, watcher o listener web ni modifica configuración global.

El loader TypeScript existente de Vite permite utilizar los adaptadores reales: registro/verificación por `IdentityService` y buzón ficticio privado, inicialización transaccional, `RedisAuthority`/`IdentitySessions`, API Fastify, inicio de run y compra/apertura. Tras guardar2copias/3receipts y snapshot, cierra conexiones, reinicia **solo sus dos IDs**, vuelve a resolver sus puertos y comprueba igualdad completa. Verifica además supervivencia de la sesión mediante AOF, vacía únicamente su nueva instancia Redis y vuelve a autenticar por la identidad SQL para recuperar exactamente el mismo jugador/estado con una sesión nueva. No importa saldos del cliente.

Ejecución del17octubre: **PASS en2789ms**, igualdad de inventario/copias/run/receipts, sesión AOF conservada tras reinicio y recuperación tras pérdida de Redis correctas. Ambos contenedores y volúmenes propios retirados; los contenedores ordinarios siguen saludables. [Resultado y hashes de fuentes ejecutadas](evidence/restart-local.json). No equivale a una prueba de fallo del disco, recuperación externa o hardware físico.

Se conservan dos intentos anteriores fallidos del instrumento, sin contarlos como éxito ni fallo del producto: primero, Docker imprimió una advertencia deprecando `--time` antes del ID y falló su assertion; se usó `--timeout`. Segundo, Docker cambió los puertos aleatorios al reiniciar y la conexión al puerto anterior falló; ahora los vuelve a resolver sobre los mismos IDs verificados. Las dos ejecuciones limpiaron sus recursos. No se modificaron límites, reintentó automáticamente una suite ni reinició un servicio habitual.
