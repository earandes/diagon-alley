# A76 · Cuentas recuperables

Estado: implementado en rama dependiente de A75, validación Linux pendiente. No integrado en main, desplegado ni publicado.

## Recorridos implementados
Bienvenida permite crear cuenta, entrar o jugar como invitado. Ajustes ofrece Guardar mi partida/Mi cuenta. Registro solicita correo y después código privado/contraseña; login recupera el mismo jugador. Vincular conserva exactamente IDs/colección/inventario/run/snapshots/receipts. Otra partida exige elección explícita, nunca fusión. Recuperación revoca sesiones anteriores; consultar sesión permite resolver respuesta perdida sin repetir operaciones. Una intención pendiente permite reautenticación del propietario pero bloquea cambio y logout.

## Autoridad y correcciones verificadas
PG conserva identidad y jugador distintos; kit/vínculo/token de verificación comparten transacción y cliente. Índices únicos y locks impiden apropiación concurrente; seis verificaciones simultáneas no crean otro kit. Tokens aleatorios se guardan como hash y caducan. KDF scrypt asíncrona de Node; versiones de sesión comprobadas con comparación SQL actual en un solo snapshot, y emisión condicionada a la generación autenticada. Reset intercalado invalida emisión obsoleta. El cliente conserva intención/receipt ante respuestas inciertas, sin tokens o contraseñas en localStorage.

## Comprobaciones locales no gráficas
- Primera prueba de controlador RED (dos métodos aún ausentes), luego 33/33 correctas.
- Suite unitaria general inicial: 613/613; ejecución final se registra en QA.
- PostgreSQL/Redis real: 96/96 en16archivos, incluidos10servicio identidad/3carreras de sesión/5gateway. No doubles sustituidos por servicios en ese recuento.
- Build/tipos y scanner correctos en la primera integración; candidato final y CI pendientes de registrar.
- Backup/restauración: PASS,15tablas/16filas,34109bytes de archivo efímero. Comparación exacta y hash de credencial restaurado con KDF real. Solo dos bases nuevas efímeras, nunca restauración de partida habitual.
- Preflight `npm run test:browser:check` permitido; NO abrió navegador. No se ejecutó ningún navegador local A76.

## Límites
Buzón real de archivos privados para ensayo, no correo por Internet. Loopback HTTP, no HTTPS o despliegue productivo. Emulación Linux no es móvil físico o observación humana. Campos nativos no acreditan prueba con gestor de contraseñas/lector hablado. La persistencia local no equivale a copia externa programada. Sesión fija siete días sin renovación deslizante; reautenticación recupera identidad persistente. Cierre de sesión solo esta sesión; reset invalida todas las anteriores. Ninguna regla/economía/premio, región, arte o dependencia nueva.

## Pendientes para la entrega técnica
CI Linux del candidato real; inspección de tres imágenes seleccionadas; corregir fallos demostrados; registrar SHA/PR/resultados. Envío externo, despliegue y aceptación humana/física quedan fuera de esta autorización y no se afirman realizados.
