# A77 · Validación de diseño y recorridos de cuentas antes de merge

Method: dual-agent (A: /root/a77_design · B: /root/a77_technical), con síntesis y comprobación Linux del coordinador. 18 octubre 2026. Baseline de aplicación `0f849ba`, PR7 todavía draft y dependiente de A75. **Auditoría, sin fixes de aplicación ni merge.**

## Veredicto

**La dirección visual encaja con el juego y el acceso recuperable funciona, pero no daría por cerrado el recorrido de interfaz para merge. Recomiendo corregir F01–F08 antes.** Son problemas localizados de orientación, consistencia, privacidad de presentación y acceso; no se ha demostrado pérdida de colección o un bloqueo permanente. Los formularios de credenciales son la excepción convencional expresamente autorizada: convertirlos en gestos u objetos ilegibles empeoraría el resultado.

La carta azul/oro, el escenario persistente, los símbolos distintos de cada pack y Cinzel conservan el Teatro de alquimia. La interfaz no es un dashboard y no necesita otro renderer, personajes, fondos o una producción de assets. Donde falla es en **qué hacer después**, **qué estado tiene la cuenta** y **cómo reparar una incidencia**. Más partículas o marcos no resolverían esos problemas.

## Qué se verificó ahora

- Se reutilizaron las tres imágenes A76 y se inspeccionaron las doce nuevas imágenes seleccionadas de Linux. Una de ellas, etiquetada mail-sent, resultó ser operación activa; se conserva con esa clasificación y se confirma únicamente el estado postenvío en una pasada adicional focalizada. No matriz de capturas ni navegador local.
- La primera tanda A77 pasó siete casos previstos y omitió dos duplicaciones de transporte; los formularios, el vínculo después de recarga, el cambio real de idioma/pack desde Ajustes, el cambio explícito de cuenta, el modo de una pestaña antigua, offline y una respuesta perdida de autenticación se ejecutaron sobre servicios reales. El fallo de red es una fixture de transporte declarada, no autenticación simulada.
- Se registraron geometría, modo, tipo de campo, presencia del error y hit-test del cierre. Los JSON no contienen valores de contraseña/código. No basta con que un botón exista o tenga aria-label.
- La suite A76 existente volvió a pasar sus30 casos previstos. Registro, login en otro contexto, reset válido, recuperación de operación económica/cookie perdida y conservación de recibo ya tenían evidencia real y fuente idéntica; no se reinventaron ni se atribuyen a una captura.
- El detector Impeccable devolvió cero findings en AccountAccess. No detecta estos defectos de recorrido ni acredita el diseño. El overlay local se omitió por AGENTS. Se calcularon seis pares de contraste sólidos de CSS:9,51–17,26:1; no son una certificación WCAG global, píxeles compuestos o lector hablado.

## Correcciones recomendadas

| ID | Problema y evidencia | Cambio concreto |
| --- | --- | --- |
| F01 · P2 | Tras solicitar código, la acción principal sigue solicitándolo; verify/reset pierden el contexto visible de destinatario. Copy EN de envío no corresponde bien al buzón local. | Progresión solicitud→código con CTA principal nuevo, reenvío secundario deliberado, correo/propósito y copy ES/EN equivalentes. |
| F02 · P2 | Un código inválido pide otro sin ofrecerlo; un error de register pide Comprobar sesión sin botón. | Recuperación contextual según acción. Mantener consulta de sesión para autenticación incierta y una salida de solicitud/reenvío para correo. |
| F03 · P2 | Mostrar en login→recuperación deja nueva contraseña en type=text, reproducido en los tres proyectos. | Visibilidad oculta al comenzar otra tarea; conservar el toggle dentro de la tarea elegida. |
| F04 · P2 | Otra pestaña ya vinculó la cuenta, GET/session devuelve account y el modal continúa en register. | Entrada basada en sesión vigente o reconciliación explícita, sin pisar borradores/pending por respuestas tardías. |
| F05 · P2 | El cierre superior no se ve ni recibe su hit-test central en390; sí funciona en1280/865. Hay Volver/Escape alternativos. | Reservar espacio y apilado local para el cierre, objetivo completo activable y fallback visible del asset. |
| F06 · P2 | Solo una de cinco instancias de Ajustes recibe la cuenta: falta en nodo, preparación modal, forja/bóveda y revelación. Contrastado por código. | Coordinación única de cuenta en todos los Ajustes, respetando borradores, propietario, operación pendiente y retorno de foco. |
| F07 · P2 | El error de conflicto queda parcialmente fuera de la zona visible en390, detrás de explicaciones y enlaces. | Mensaje junto a su reparación y antes del CTA, menos repetición y foco/scroll proporcionado. |
| F08 · P2 | HTML cuenta longitud UTF16; el servidor usa puntos de código. Contraste de código/estándar, no nueva reproducción gráfica. | Conservar política vigente y validar/explicar la misma medida Unicode sin truncar contraseñas. |

[FINDINGS](FINDINGS.md) contiene evidencia→problema→cambio→resultado esperado→aceptación para cada punto. Seis se reprodujeron en UI; F06/F08 se contrastaron por código/estándar. No son ocho vulnerabilidades ni ocho pérdidas de datos. La recomendación premerge es una valoración experta de calidad del recorrido.

## Qué no cambiaría

Campos nativos, etiquetas, autocomplete, pegado, nombres de las acciones, foco cian, scroll accesible, fondo ilustrado, carta y símbolos actuales. Mantener entrada invitada y la elección explícita al abrir otra partida. No añadir un HUD de cuenta, recompensas de registro, otro inventario, audio, nuevos sistemas de autenticación o arte para resolver estos hallazgos.

## Valoración heurística del coordinador

Puntuación experta orientativa, no métrica de usabilidad, benchmark o puerta de aceptación automática. El assessment A inicial puntuó28/40 con tres imágenes; esta valoración incorpora los estados nuevos. No es una regresión temporal del mismo alcance.

| Heurística | /4 | Evidencia principal |
| --- | --- | --- |
| Estado del sistema | 2 | Éxito parcial no cambia acción dominante. |
| Correspondencia con tarea | 3 | Inputs nativos y acciones comprensibles; token/correo mejorables. |
| Control y salida | 2 | Volver/Escape válidos, cierre móvil cubierto. |
| Consistencia | 2 | Ajustes y modos no equivalentes en todos los contextos. |
| Prevención de errores | 3 | Cambio de propietario explícito y autoridad protegida. |
| Reconocimiento frente a memoria | 2 | Correo/propósito desaparecen al introducir código. |
| Eficiencia | 3 | Pegado/autocomplete; reenvío y pasos indirectos mejorables. |
| Estética y jerarquía | 3 | Estilo coherente; acumulación vertical en conflicto móvil. |
| Recuperación | 2 | Instrucciones sin acción directa en dos errores. |
| Ayuda contextual | 3 | Ensayo y conservación explicados; siguiente paso insuficiente. |
| **Total** | **25/40** | Todos los criterios aplican a esta superficie de operación. |

## Hipótesis y límites

La confirmación breve de vinculación y la jerarquía cuenta/invitado son hipótesis de diseño, no defectos técnicos demostrados: Mi cuenta/email ya confirma el vínculo, y el portal invitado más protagonista puede ser adecuado para probar sin fricción. No imponer otra jerarquía sin resolver esa intención.

Personas usadas como escenarios de revisión, no participantes: primera visita necesita identificar el siguiente paso del código; móvil interrumpido necesita reconocer destinatario y contexto; teclado necesita cierre/foco y reparación localizables. No se observó abandono, comprensión, diversión o retención.

[COVERAGE](COVERAGE.md) mantiene los huecos: Ajustes dentro de los cuatro contextos se contrastó por código, el estado visual de operación económica pendiente no tiene un PNG propio, y no se cubren todas las combinaciones de cada error/tamaño/pack. Dispositivo físico, teclado virtual, gesto táctil físico, lector hablado, gestor real, correo externo y una sesión humana siguen pendientes. hasTouch y clics emulados no equivalen a un dispositivo físico.

## Próximo incremento propuesto

[FIX-PLAN](FIX-PLAN.md): tres recorridos completos —código y reparación; sesión/coordinación entre contextos; composición móvil— con aceptación de comportamiento. Convertir los diagnósticos en aserciones que fallen antes de corregir. No repetir la auditoría general o rehacer escenas aprobadas. A76 y sus garantías económicas permanecen como regresión.

Questions skipped: el alcance y dirección ya están definidos; las preguntas de comprensión se reservan a la sesión humana posterior. Esta revisión no autoriza implementar esos fixes ni integrar en main.
