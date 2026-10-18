# A82 · Entrada como menú de fantasía

18 octubre 2026. Baseline: 028ac8545ae8215777c234436d88e2bb76ba0871, rama feature/a76-recoverable-accounts. PR7 depende de PR6/A75; main remoto 937a0a1. Cambios ajenos no rastreados se conservan fuera del incremento.

## Hechos y dirección
La entrada actual reparte dos títulos y tres acciones entre dos lenguajes de botón. A81 aporta emblema y objetos propios ya integrados; se reutilizan sin producir otro lote. Referencia: imagen aportada por Enric en esta tarea (composición, no un asset para recortar).

Lectura de diseño: menú de un videojuego ilustrado; una identidad centrada arriba, callejón visible entre marca y acciones, tres piezas de una misma familia abajo. Invitado es principal dorado; iniciar sesión azul; registro oscuro, ambos accesibles desde el inicio. Ajustes queda pequeño y aislado en margen seguro. Esta elección prioriza probar sin borrar el acceso recuperable.

## Recorrido y aceptación
Bienvenida → invitado o carta de cuenta → cancelar/confirmar → misma continuidad autoritativa existente. Un FantasyActionButton semántico compartido, altura mínima56px, iconos existentes y etiquetas fuera del arte. Una sola h1, sin segundo nombre de zona. Botones nativos, foco visible, toque, textos ES/EN, ambos paquetes y arte ausente. Pulsación finita y reducida equivalente; sin loops ni audio.

Comprobar 390×844,1280×900,865×1079 y reflujo320px/200%; acciones y textos accesibles, sin recortes ni desbordamiento horizontal. Cancelar acceso devuelve foco; registrar/entrar no crea partida al consultar; invitado conserva bloqueo concurrente y feedback de operación.

## Integridad y recuperación
No cambia dominio, sesión, autenticación, inventario, costes, probabilidades o reglas. Mantener key/propietario/receipt, errores y bloqueos existentes. Consulta/cancelación no opera. No se modifica la partida habitual.

## Validación e integración autorizada
Tipos, build, unitarios y PG/Redis según candidato. Capturas seleccionadas y recorridos gráficos solo en CI Linux con guard/lock/watchdog originales, un worker, cero reintentos. No navegador local. Revisar evidencia y corregir defectos demostrados. Integrar dependencias A75–A81 y menú enmain únicamente tras comprobar candidato y CI; sin despliegue. Evidencia histórica intacta.

Incluido: entrada, controles compartidos de esta pantalla y continuidad de cartas. Excluido: rediseño interno de credenciales, nuevos sistemas/arte de personajes, audio, publicación. Comprensión humana y dispositivo físico siguen pendientes.

## Orquestación de CI
A76 documenta agotamiento real de55min en una batería monolítica (CI39070225878). A82 separa check y regression mediante needs, nunca simultáneos, cada uno con el límite55min original. Conserva todos los comandos/scopes de full, servicios reales, guard/lock/watchdog, worker1/retries0. Se conserva55min porjob y se permiten hasta110min totales enserie (equivalente a la anterior ejecución+continuación), sin omitir la cola; ambos jobs usan el mismo candidato. Las cancelaciones de preparación de esta tarea no se consideran validaciones superadas.
