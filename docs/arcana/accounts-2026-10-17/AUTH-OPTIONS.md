# A76 · Método de acceso y fuentes

Consulta documental: 17 octubre 2026. Evidencia de documentación oficial, no ensayo de entrega de correo externo ni evaluación de un proveedor contratado.

## Alternativas y decisión

| Alternativa | Ventaja para este juego | Coste y dependencia real | Decisión |
| --- | --- | --- | --- |
| Correo verificado y contraseña, sesiones opacas existentes | Entrada posterior sin correo en cada visita; recuperación por correo; vinculación explícita del mismo jugador | El código usa Node/PG/Redis existentes. Ensayo con buzón local privado a coste adicional cero. Producción necesitará envío externo real, HTTPS y operación; no se consideran resueltos por el buzón local | Elegida para esta entrega técnica |
| Biblioteca completa Better Auth autoalojada | Implementación mantenida con registro, recuperación y sesiones | Licencia MIT, pero correo debe integrarse aparte. Añadiría modelo/tablas, adaptadores y semántica de sesión paralelos a los existentes | Alternativa válida, sin incorporar una segunda autoridad de sesión en este incremento |
| Enlace o código mágico en cada entrada | No hay contraseña que recordar | Cada entrada desde un contexto nuevo depende de entrega de correo. El buzón local demuestra transporte de ensayo, no disponibilidad del correo real | No elegido como único acceso |
| Proveedor OpenID Connect | Delega la autenticación y evita contraseñas propias | Requiere credenciales/configuración del proyecto, callbacks y disponibilidad del proveedor. Vincular sigue necesitando prueba del invitado actual; el correo por sí solo no sustituye al identificador estable del proveedor | Posterior si hay una necesidad y configuración autorizada |
| Usuario y códigos de recuperación fuera de línea | Sin servicio de correo; permite recuperación con un secreto guardado | Añade custodia manual y pérdida definitiva si faltan contraseña y código. No satisface la expectativa de correo verificado sin cambiar el diseño aprobado | No elegido |

La solución propia compone primitivas mantenidas de `node:crypto`; no implementa un algoritmo criptográfico ni declara seguridad exhaustiva. La responsabilidad del protocolo, autorización y recuperación sigue siendo del proyecto.

## Contrato elegido

- Registro solicita solo correo. La posesión del token entregado al buzón permite elegir contraseña por primera vez; así una preregistración ajena no fija una contraseña conocida por un tercero.
- Verificación: token aleatorio de 256 bits, hash SHA-256 en PG, 24 horas, un uso. SHA-256 se aplica a secretos aleatorios de alta entropía, nunca a contraseñas.
- Contraseña: 15–128 puntos de código, sin recorte ni reglas de composición. Scrypt asíncrono con sal aleatoria de 16 bytes, `N=32768,r=8,p=3`, clave de 64 bytes. Es una de las configuraciones alternativas de OWASP, con unos 32 MiB de trabajo por derivación; no es RAM medida del proceso.
- Recuperación: token distinto, 30 minutos, un uso. Cambiar contraseña incrementa `auth_version`; el middleware debe rechazar todas las sesiones de versiones anteriores. Recuperar no concede premios ni inicia sesión automáticamente.
- Invitado: el servidor deriva su jugador de la cookie vigente. La verificación exige todavía autoridad sobre ese mismo invitado. Conocer un `playerId` o poseer solamente el token no permite reclamarlo.
- Cuenta nueva: inicialización idempotente después de comprobar el token, dentro de la misma transacción SQL de vínculo y consumo del desafío. El candidato guardado se reutiliza tras fallo. Un error revierte tanto el kit como la identidad; no se emite sesión ni se atribuye éxito. La inicialización recibe el mismo cliente transaccional, sin pedir otra conexión mientras conserva locks.
- Índices únicos por correo normalizado y jugador, con transacciones y locks, impiden dos vinculaciones. No existe fusión.
- El buzón local escribe archivos privados `0600` en directorio `0700`. Su ruta debe estar fuera del contenido servido o expresamente denegada por el servidor de desarrollo. No hay endpoint público de tokens; no se imprimen en logs ni se incluyen en Git.

## Fuentes oficiales

- [Node.js 24 · crypto.scrypt](https://nodejs.org/docs/latest-v24.x/api/crypto.html#cryptoscryptpassword-salt-keylen-options-callback): API asíncrona y límites de memoria configurables. Se comprueba la documentación de la rama instalada, no la API de Node 26.
- [OWASP · almacenamiento de contraseñas](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html): Argon2id preferente y configuraciones scrypt alternativas cuando no se incorpora Argon2; coste a calibrar y riesgo de saturación.
- [OWASP · recuperación](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html): respuesta genérica, canal separado, secretos aleatorios caducables y de uso único.
- [OWASP · autenticación](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html): identificación digital, mensajes genéricos y gestión de sesiones tras reautenticar.
- [Better Auth · correo y contraseña](https://better-auth.com/docs/authentication/email-password), [licencia MIT](https://raw.githubusercontent.com/better-auth/better-auth/main/LICENSE.md), [enlace mágico](https://better-auth.com/docs/plugins/magic-link): capacidades del runtime y necesidad de integrar el transporte de correo.
- [Google · OpenID Connect](https://developers.google.com/identity/openid-connect/openid-connect): configuración cliente y validación de identidad federada. No acredita una integración en este proyecto.

## Límites de evidencia

No se han contratado servicios, creado credenciales externas o enviado mensajes a personas. Un buzón local no prueba entregabilidad, reputación, cuotas o coste operativo productivos. La elección no modifica los derechos de juego ni acredita cumplimiento normativo. La revisión y pruebas de HTTP/sesiones, interfaz y CI corresponden a la integración del coordinador.
