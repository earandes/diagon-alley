# A76 · Cuentas recuperables · 17 octubre 2026

## Estado inicial y autorización
Baseline ff23f580d9d3989abc9918d7b5bc8328d9e83b62, rama A75 aún no integrada. Incremento dependiente en `feature/a76-recoverable-accounts`; no modificar main, desplegar, publicar o contratar servicios. Tree rastreado limpio al comenzar; archivos no rastreados ajenos conservados. La cookie anónima `arcana_trial` dura siete días; Redis resuelve su playerId y PostgreSQL conserva datos económicos y snapshots. No existe recuperación de identidad. IndexedDB conserva intenciones pendientes, no saldo autoritativo.

## Recorridos y decisión previa
Bienvenida: crear cuenta, entrar o probar como invitado. Ajustes: guardar partida invitada o consultar identidad/cerrar sesión. Composición elegida: acceso principal de cuenta y acceso secundario discreto de invitado sobre el escenario, con un diálogo compacto para credenciales. Alternativa descartada: tres paneles equivalentes que compiten con la ilustración.

Email/contraseña con verificación y recuperación por mensajes; KDF asíncrona mantenida de Node, sin criptografía propia, cookie HttpOnly y autoridad Redis actuales. Buzón local privado explícito para ensayo; no equivale a entrega externa. Comparación con enlaces de correo y proveedor externo en AUTH-OPTIONS. No nuevos assets: reutilizar libro/carta y escena actuales. Campos accesibles, etiquetas y autocomplete reales; ES/EN y swap desde el inicio.

## Invariantes
Identidad y jugador son conceptos distintos. Vincular conserva el playerId y toda la partida. Solo una identidad por jugador y un jugador por identidad; verificar requiere token válido y prueba de control pertinente. No aceptar playerId ni inventario suministrados por cliente como prueba. Cuenta nueva inicializa kit una sola vez. Consultar/cancelar no cambia jugador. Login con otra partida exige aceptación explícita; nunca fusiona. Guest anterior se conserva en SQL, pero recuperar acceso exige conservar una sesión válida o haberlo vinculado; no prometer recuperación de una cookie perdida.

Operaciones inciertas bloquean cambio de propietario; reautenticación del mismo permite recuperar misma key/receipt. Tokens de verificación/reset caducan, uso único y hash en SQL; no respuesta HTTP pública con secretos. Reset revoca sesiones de cuenta. Fallos de SQL/Redis/correo no anuncian éxito inexistente. Migraciones aditivas; economía, primeras victorias, snapshots y reglas intactos.

## Aceptación y recuperación
Registro/verificación/entrada; invitado→obtener datos→vincular sin cambio; login desde otro contexto recupera exactamente mismo estado; repetir/carrera no concede kit doble; reset y tokens reutilizados/caducados; CSRF/origen/rate limit/propietario; respuesta perdida, dos pestañas y operación pendiente. PostgreSQL/Redis reales y restore aislado. UI ES/EN, dos packs, 1280×900/390×844/865×1079, teclado/foco/reducido. Tipos/build/unit/integración; gráfica solo CI Linux con controles existentes. Email externo, observación humana y dispositivo físico no se declaran realizados.

## Plan vivo
1. Fuentes, contrato, método y baseline: completado.
2. Autoridad e identidad: implementadas y revisadas; integración real con concurrencia, rollback y revocación correcta.
3. Bienvenida/Ajustes y recuperación:30casos gráficos A76 correctos enCI39070225878; inspección de tres PNG realizada.
4. Copia/restauración y reinicio de servicios aislados correctos;98integraciones PostgreSQL/Redis en candidato final.
5. Tipos/build/618unit/98integración/backup y389casos navegador correctos enCI39070225878 hastaA66; cancelado por55min durante intenciones. ColaCI39074119331 SUCCESS sobre88eaa44 con fase tail existente, sin ampliar límites; todas las comprobaciones técnicas de este ensayo resueltas en las dos tandas.
6. Documentación, revisión de diff y entrega de rama/PR7 sin main; fasefull restaurada al cerrar y equivalencia de fuentes contra3f6 comprobada. Humano/físico/correo externo siguen pendientes fuera de este ensayo.
