# A77 · Revisión de acceso antes de merge · 18 octubre 2026

Baseline: `0f849bad6e36b694c5efc1515518a12c42fed85f`, PR7 sobre A75. Cuentas implementadas, no integradas en main. Fuente de aplicación idéntica al código A76 probado en las dos tandas documentadas. Árbol rastreado limpio al iniciar; archivos ajenos conservados.

Encargo actual: auditar pantallas, continuidad de juego, diseño y cobertura de los nuevos flujos antes de merge. No implementar fixes de producto, integrar o desplegar. Sí se añaden instrumentación/pruebas de auditoría y evidencia reproducible; no se cambian reglas ni sesiones reales del jugador.

## Método y plan

1. Contrastar fuente y evidencia A76, reutilizando la lectura completa de PRD/DECISIONS de la implementación previa: los cambios posteriores son encabezados propios de estado/evidencia. Refrescar AGENTS/DESIGN/README y contrato de incidente. No restaurar decisiones históricas incompatibles.
2. Evaluaciones A (dirección de diseño) y B (código/detector/cobertura) aisladas. A termina antes de incorporar detector a la síntesis. Skills Game UI/UX e Impeccable, contexto cargado una vez. El contexto PRODUCT histórico no sustituye el encargo vigente.
3. Inventario de estados: bienvenida, registro, solicitud enviada, verificación, login, recuperación solicitada, nueva contraseña, gestión, vinculación, cambio de partida, credenciales inválidas, respuesta incierta, offline, recarga, retorno/foco y ES/EN/swap.
4. Una tanda gráfica de auditoría en CI Linux con guard, bloqueo, watchdog, un worker y cero reintentos. Tres proyectos representativos: Chromium390×844/ES/Diagon, Chromium1280×900/EN/ARCANA y WebKit865×1079/ES/Diagon. Máximo doce capturas de estados **seleccionados**, no matriz de PNG, perfiles o vídeo. Los demás cruces de formularios ya tienen cobertura DOM A76; no se presume revisión visual de ellos.
5. Diagnósticos de geometría, foco y controles en JSON; pruebas de recorridos con cuentas/buzones UUID nuevos y persistencia real. Pérdidas de respuesta y offline son fixtures declaradas de transporte, no simulación de identidad/colección ni observaciones humanas.
6. Sintetizar findings por gravedad, evidencia, cambio mínimo propuesto y aceptación. Veredicto de merge con límites, plan posterior de fix y preguntas humanas. Cerrar restaurando selección ordinaria de CI y demostrando que no cambió la aplicación.

## Seguridad y límites

No navegador local, CUA, WebKit, captura, grabación o perfil en este Mac. Ningún subagente ejecuta suites gráficas. Solo el coordinador lanza la tanda Linux después de comprobar que no hay otra batería activa. La revisión directa/overlay local de la skill se omite por AGENTS; evidencia Linux y código sustituyen esa parte, no una sesión humana.

Se reutiliza temporalmente la fase `baseline` existente para evitar las grandes regresiones ya válidas. Se añade una prueba de auditoría explícita al workflow solo en esa fase; se restaurará `full` al terminar. No aumentar límites ni desactivar protecciones. No modificar app, economía, autoridad, inventario o arte; no account/email/tokens habituales. No incluir buzones o secretos en Git. No hay autorización de merge.

La sesión humana, lector hablado, gestor de contraseñas, teclado móvil real, correo externo y dispositivo físico no se dan por realizados. Una captura no prueba movimiento; estas pantallas no añaden animación propia. Un test verde que registra un defecto UX no lo convierte en aprobado.
