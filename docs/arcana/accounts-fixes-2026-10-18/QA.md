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

## Segunda CI / primera observación gráfica

CI39084819482 /a9eeb3f: A76 completa30correctas,622unitarios,99PGRedis, backup/build/tipos/scanner y2casos A75 correctos. A78 detiene en el primer recorrido contextual: el test consultaba /state inmediatamente después de click invitado y obtenía401 antes de terminar entrada. Se corrige esperando la preparación utilizable; no se repite para declarar verde ni se modifica la autoridad. Tres casos A78 previos sí pasan: formularios, vínculo/conflicto y fallo de transporte.

Inspección directa de tres PNG390 Linux: conflicto y reparación visibles antes del CTA, carta conservada, sin desbordamiento horizontal. En verify el objetivo de cierre recibe hit-test pero su imagen no está todavía pintada. Se elimina esa dependencia de carga: flecha vectorial inline siempre visible, con columna propia incluso sin ilustración de cabecera. No se declara acabado humano por estas capturas.

Se añade comprobación conservadora de coherencia entre sesión y jugador cargado: si otra pestaña cambia a otro propietario, se ofrece reidentificación y no «Mi cuenta» de la partida anterior. No se modifica el propietario automáticamente ni la autorización del gateway. Caso Linux nuevo declarado.

## CI completa del incremento

CI39085206200 SUCCESS sobre head70180458f1beb99639a47b87ff5ee948e6a64975, checkout real65df2f7a453167121d28172ee36f51213b0932f2 (baseff23f580).622unitarios,99PGRedis,30A76correctos/30omisiones declaradas,16A78correctos/11omisiones por cuota de escenarios,2A75baseline correctos. Tipos, contenido, build, scanner y copia/restauración correctos. A76 duró1,5min y A78 41,1s: duración automatizada, no humana.

Ocho capturas revisadas directamente de las13 seleccionadas: código390, ausencia de arte390/200%, conflicto390, verify865/200%, login1280, reset1280, gestión1280 y respuesta incierta1280. Login1280 muestra Conectando (la apertura ahora espera la sesión): no se usa como evidencia del formulario. Se añade espera causal de diálogo abierto/no busy antes de capturar. No se cambia el producto para fabricar evidencia.

Único defecto visual adicional: la columna reservada al arte ausente estrecha el título en390/200% y divide una palabra. Se devuelve esa columna al título solo cuando no hay imagen y se exige que sus palabras conserven una línea cada una. Confirmación explícita de6casos (formularios y cierre, tres tamaños), con solo2PNG nuevos: login estable1280 y ausencia de arte390/200%. El resto de16casos conserva evidencia7018045; el único cambio posterior de producto es CSS de cabecera sin arte. Sin nuevas matrices generales o reintentos automáticos.
