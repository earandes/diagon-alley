# A78 · Validación en curso

Baseline c7cf5a42; referencias A77 intactas. Correcciones de producto locales todavía no declaradas validadas gráficamente.

- RED: test de política compartida falla al no existir el contrato; después4casos correctos. Pruebas de interfaz preparadas como aceptación; no se afirma ejecución RED gráfica en Mac.
- Local:622unitarios correctos, tipos y build correctos. Aviso histórico de chunk>500kB permanece, sin atribuirlo a esta UI.
- PostgreSQL/Redis reales: ejecución en curso con namespaces propios y datos ficticios; sin reiniciar servicios ordinarios.
- Linux pendiente: A76 completa y A78 focalizada serial, tres tamaños representativos, ambas presentaciones/idiomas, código/error/cancelación/sesión, Unicode y cinco contextos Ajustes. Cero reintentos, guard/lock/watchdog originales.
- Capturas nuevas: solo lista explícita A78, sin tokens válidos ni contraseñas visibles. Las capturas estáticas acreditan composición, no prueba humana.

Pendientes permanentes: correo externo, entorno público/HTTPS, gestor de contraseñas real, lector hablado, dispositivo físico y observación humana. Sin merge/main/despliegue.

## Primera CI y corrección de dependencia

CI39084674379 /8d3252a:622unitarios,99integraciones reales, tipos/build correctos. Falla la importación nativa del verificador de backup: la nueva dependencia compartida carecía de extensión.ts, que Vite resuelve y Node ESM no. Reproducido localmente con importación nativa; se añade extensión explícita (tsconfig ya lo permite), sin cambiar política/KDF. El verificador de backup pasa después en dos bases nuevas aisladas y verifica credenciales/relaciones/snapshots. No se declaran gráficos correctos: instalación de navegadores se omitió al fallar el prerequisito; los intentos posteriores fallan por binario ausente.

La siguiente ejecución añade además casos focalizados de respuesta de sesión retenida tras cancelar Ajustes y pérdida real de respuesta de solicitud de recuperación. Sin reintento automático ni relajación de aceptación.
