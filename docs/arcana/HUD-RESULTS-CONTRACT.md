# A41 — Estado temporal y resultados observables

12 octubre 2026. Requisito del MVP: saldo/Esencia/sinergias/equipo visibles y resultado verificable de cada nodo.

Estado inicial: GET state devuelve reserva SQL y Redis TIME, pero la barra muestra puntos guardados anteriores a regeneración; resultado no combatiente y desbloqueo están implícitos. No modificar saldo al consultar.

Consulta de aplicación proyecta Esencia efectiva con la regla pura existente y hora de autoridad. Devuelve reserva SQL intacta, revisión y próxima regeneración absoluta (o null al máximo). Contrato requerido y validado por cliente; React solo formatea datos recibidos. Sin persistir regeneración ni incrementar revisión en GET. Combate sigue aplicando consumo/regeneración bajo lock SQL con hora de autoridad.

Controller conserva receipt/vista al actualizar estado, excluye refresco mientras hay intención pendiente y rechaza otro dueño o revisión anterior. Tras confirmar un comando, consulta estado temporal; un fallo de esta consulta no desconfirma receipt, no repite POST y señala energía sin actualizar. Refresco explícito, cada minuto visible y al volver a la pestaña; timers no calculan puntos. Fallos no descartan estado confirmado ni ocultan la recuperación.

HUD de equipo muestra PV/PM, barras y equipo poseído; sinergias activas usan el mismo servicio puro de umbrales que el engine. Históricos de batalla siguen mostrando input/log, sin recalcular con equipo actual.

Resultado del último nodo deriva de receipt guardado para la última visita de la run actual (no orden de filas). Muestra tipo, recompensa real, formación/PV guardados y replay de combate cuando existe. Misiones muestra zonas desbloqueadas desde progreso guardado. Recarga recupera resultado sin ejecutar ni sortear. No atribuir a una elección actual efectos narrativos anteriores; no introducir loot/valores de balance nuevos.

Aceptación es/en: puntos 4 antes/después de 12 minutos, cap y resto temporal, consulta sin escritura/revisión/cambio de operaciones; refresh conserva receipt y dueño, fallo después de compra conserva éxito; una respuesta anterior no reemplaza estado nuevo. Foco/teclado, 320 px, replay tras recarga y recompensa del boss/llave/zona visibles. Tests previos a módulos y assertions de HTTP/controller previas a cambios; evidencia posterior en PHASE-4-STATUS.
