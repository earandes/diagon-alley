# Encuentros narrativos — A44, contrato previo

12 octubre 2026. Estado inicial: nodo automático guarda seed/índice y run/recompensa, pero sin relato ni efecto elegido. Acción: confirmar Encuentro del Azar; resultado observable: historia es/en y efecto real sobre recursos/PV, consultables tras recarga sin nuevo sorteo.

Incluir snapshot de resolución: efecto, narrativa opcional versionada/bilingüe y PV por unidad antes/después. Datos previos sin resolución muestran ausencia histórica, sin deducir historia/efecto de tablas vigentes. La selección sigue con PRNG de servidor; efecto, ruta, recompensa y receipt se guardan en una transacción. Replay precede config/azar. Configuración de ensayo versión 3 añade tres relatos originales (narrativa versión 1), manteniendo pesos 1/1/1, premio 10 Coronas, curación/daño 10%, grafo/campaña y sus reglas versión 1. Versionar narrativa separada evita invalidar runs activas por añadir texto; cambios posteriores del efecto requieren campaña nueva y política de compatibilidad, no modificar silenciosamente historia.

DDD/KISS: servicio de dominio para aplicar efecto y construir resolución inmutable; validar snapshot frente a PV final/recompensa usando el mismo servicio. App coordina semilla/transacción, vista solo lee resolución. Reutilizar tablas SQL/receipt JSONB; no bus de eventos, repositorio o motor narrativo genérico.

Aceptación TDD: forzar los tres efectos, cap de curación y daño letal; snapshot/story congelados, textos/versiones inválidos rechazados antes de seed; replay conserva relato/efecto aunque config deje de estar disponible; discrepancias HP/recompensa/unidad rechazadas; legacy sin resolución válido. PostgreSQL real conserva resolución tras reabrir conexión y pérdida de respuesta; UI es/en muestra historia/efecto, recarga/idioma no producen operación, cancelación no gasta. Relatos son provisionales, no nuevos valores de balance ni producto aprobado.

Excluye decisiones narrativas manuales nuevas, ingredientes/inventario adicional, nuevas zonas y cualquier gasto/arte generado/dependencia. Texto DOM y movimiento reducido siguen funcionales; no afirmar lector/móvil físico por tests emulados.
