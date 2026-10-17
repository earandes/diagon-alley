# A76 · Cuentas recuperables

Implementado y técnicamente validado en ensayo local, 17–18 de octubre de 2026, en `feature/a76-recoverable-accounts`, dependiente de A75. [PR7](https://github.com/earandes/diagon-alley/pull/7) permanece separada de main. Sin despliegue, publicación, servicios contratados o dependencias nuevas.

## Qué puede hacer el jugador

La bienvenida ofrece Crear cuenta, Iniciar sesión y Jugar como invitado. Ajustes contiene un único acceso contextual: Guardar mi partida para invitado, Mi cuenta para identidad vinculada. Los campos de credenciales conservan etiquetas, autocomplete, pegado y contraseña visible/oculta; no se disimulan como objetos sin semántica.

Registro solicita correo y entrega un código; quien controla el código elige la contraseña. Una cuenta nueva inicializa una única partida. Vincular desde Ajustes conserva el playerId y exactamente colección, copias, equipo, inventario, expedición/snapshot, derechos de primera victoria, intenciones, recuerdos y receipts. Entrar desde otro contexto recupera ese mismo jugador, sin reconstruir saldos enviados por navegador.

Iniciar sesión con otra partida requiere elección explícita y nunca fusiona colecciones. El invitado anterior permanece en SQL, pero sin cookie válida o vínculo no se promete acceso posterior. Una operación pendiente bloquea cambio y logout; reautenticarse como el mismo propietario permite recuperar la misma petición y receipt, incluso después de recarga y pérdida de cookie.

Restablecer contraseña utiliza otro código caducable y revoca sesiones anteriores. Cerrar sesión revoca únicamente la sesión actual; no borra la cuenta. La consulta de sesión ayuda a resolver una respuesta incierta sin repetir operaciones. Sesión fija siete días, sin renovación deslizante.

## Integridad y seguridad comprobadas

Identidad PostgreSQL y jugador son conceptos separados. Kit, vínculo y uso del token se confirman en la misma transacción y clienteSQL. Unicidad y locks impiden adjudicar ambos jugadores o conceder kits repetidos; seis verificaciones concurrentes no duplican inicialización. La vinculación exige token de correo y autoridad sobre invitado actual. Ningún endpoint admite reclamar una partida conociendo su ID.

Tokens aleatorios256bit, hashSHA256 en SQL, uso único y caducidad24h/verificación o30min/reset. Scrypt asíncrono de Node con sal individual; no implementación criptográfica propia. Generaciones de sesión se comprueban con una lecturaSQL consistente. Reset intercalado impide emitir una sesión sobre credenciales obsoletas. Cookies HttpOnly/SameSiteStrict y validación de origen protegen el ensayo; límites porIP y asunto, errores genéricos y redacción de secretos. No se guardan credenciales/tokens de sesión sensibles en localStorage.

El controlador excluye cambios de identidad durante operaciones, relee IndexedDB y exige el propietario autenticado al cargar. Intención local es metadato de recuperación, nunca prueba de identidad o saldo. Publicación atómica del buzón evita mensajes parcialmente legibles. Migraciones aditivas; no cambian economía, campaña, renderer o BattleLog.

## Evidencia técnica

Código candidato: `3f6e1223d7b9ada6cae55f50f7b2627f2c35100b`. Checkoutmerge `bc8c166ab38132c7c0e8e471a7206973c25dd151`, mismo árbol `c755d7debc31728151af02629b2c08c024a20cb6`. [CI39070225878](https://github.com/earandes/diagon-alley/actions/runs/39070225878): cuentas30correctas/30omisiones de slots repetidos,0fallos/0flaky;84,8s. Tipos/build/618unitarias/98integraciones/backup y regresiones hastaA66 pasaron;389casos de navegador correctos. El job agotó55min durante intenciones y quedó cancelled, no success. La cola se verifica con fase tail existente enCI39074119331,88eaa44; es la única diferencia frente a3f6. [CI39074119331](https://github.com/earandes/diagon-alley/actions/runs/39074119331) terminó SUCCESS sobre88eaa44092fc0b4652a21b62d00f63ebb48c2e66, completando intenciones/PWA/performance y repitiendo satisfactoriamente la cola seleccionada. Checkout7fe58d38cc780d4afaaa7eb8ebd96e1c49162412, mismo árbol973ccf9f46296ddb6fb604610107dba282e39010 que88eaa44. La fase full se restaura al cerrar; los objetos de aplicación, pruebas, dependencias y configuración ordinaria coinciden con3f6. No se afirma que la primera CI o el posterior commit documental ejecutaran una batería completa.

Backup/restauración PostgreSQL reales:15tablas/16filas, igualdad exacta y credencial restaurada verificada con KDF real. Reinicio de PostgreSQL/Redis en dos contenedores nuevos y limitados: mismas2copias/3receipts/run, sesiónAOF conservada y nueva autenticación tras pérdida total de esas sesionesRedis. Servicios/partida habituales intactos.

La continuación terminó con132casos gráficos correctos/30omisiones deliberadas; no se suman a los389anteriores como casos únicos porque hay repetición de scopes. El muestreo de rendimiento conserva diferencias desfavorables (confirmación208,2→342,7ms, selección30,7→61,6ms); comparaA66 con actual, no aíslaA76 ni mideGPU/P95. Detalle yJSON enQA.

[GALLERY](GALLERY.md) contiene tres imágenes seleccionadas de Linux inspeccionadas; no una captura de toda la matriz. [QA](QA.md) conserva intentos fallidos/cancelados y resultado por candidato. [BACKUP](BACKUP.md) distingue herramientas, fixture y fallos previos del instrumento. No se abrió navegador local A76.

## Uso y límites

[Guía local](LOCAL-GUIDE.md), [alternativas de autenticación](AUTH-OPTIONS.md), [compatibilidad](COMPATIBILITY.md) y [archivos](CHANGES.md). Buzón real privado de archivos para ensayo, no correo por Internet. El launcher sigue limitado a127.0.0.1HTTP. Un entorno público requerirá autorización y configuración posterior deHTTPS, correo externo, conservación/limpieza, respaldo independiente y operación segura. La recuperación entre contextos no acredita hardware físico o acceso por Internet.

No hay borrado de cuenta autoservicio ni limpieza automática de desafíos/mensajes caducados; se documentan requisitos operativos antes de uso público. Volúmenes persistentes no equivalen a backups externos. No se afirma seguridad productiva o cumplimiento normativo completo. Observación humana, dispositivo físico, lector hablado y gestor de contraseñas real pendientes; [sesión preparada](HUMAN-SESSION.md). No se alteraron reglas, probabilidades, premios, arte o dependencias.
