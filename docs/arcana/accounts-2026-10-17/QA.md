# A76 · Registro de validación

## Candidatos

- Baseline: ff23f580d9d3989abc9918d7b5bc8328d9e83b62 (A75).
- Primer candidato:34b22def778f5de3619e62f992d2b745ed0d8f62, PR7 sobre A75. CI39068985629: A76 con3casos correctos,1fallido y56noejecutados/omitidos al detenerse; fallo de fixture `content.table.version`, no se acredita recorrido completo. Ejecución cancelada deliberadamente tras conservar el artefacto para no continuar baterías sobre candidato sustituido.
- Segundo candidato:a542ef951b51f37cd45f1295cfb4974e972f591d / CI39069503604. A76 volvió a detenerse con3casos correctos/1fallido/56restantes: fixture miraba la visibilidad del aviso Guardando como si ya hubiese ocurrido commit+pérdida de respuesta. Su aserción prematura provocó teardown y Response disposed secundario. Se corrige sincronización por resultado capturado y aria-busy=false, sin retraso fijo ni relajar la aceptación. Se conserva ese intento cancelado.
- Tercer candidato: prueba adicional de recarga completa después de perder cookie con operación enIndexedDB, exige propietario de metadata antes de cualquier entrada; en preparación paraCI.

## Local sin navegador

613unitarias y96integraciones PostgreSQL/Redis en primer ciclo. Tras nuevas correcciones, repetir las comprobaciones afectadas; no atribuir la ejecución anterior al candidato posterior. Build/tipos/scanner correctos antes de esa segunda tanda.

Backup/restauración real:15tablas/16filas,34109B efímeros, digest3025dea8ac8f8a8b22e291dcc4a667756ef4bc23f3b7fd5684d4f978ad26c137; prueba KDF de credencial restaurada. Reinicio real aislado:PASS, mismas2copias/3receipts/run tras reiniciar PG/Redis y volver a entrar después de perder sesiones. Comandos, hashes y fallos de instrumento previos en BACKUP.md. No se alteraron contenedores/bases/partida habituales.

`npm run test:browser:check`:allowedtrue, carga3.39/11cores, WindowServer35.1MiB/0%CPU en esa muestra. Es preflight, no una ejecución gráfica ni garantía de seguridad del sistema. Ningún navegador local A76.

## Pendiente
CI final Linux, inspección seleccionada, todos los resultados y límites por SHA. Dispositivo físico, lector hablado, gestor de contraseñas real, observación humana, correo externo y entorno público sin probar.
