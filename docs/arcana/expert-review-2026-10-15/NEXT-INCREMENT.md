# A62 · Tres mejoras y plan posterior

**Propuesta para revisar. No se ha implementado.** No depende de completar la sesión humana para estar diseñada; las conclusiones de interés/comprensión sí deberán contrastarse después. No amplía región, catálogo ni economía. La implementación futura necesita autorización nueva tras esta revisión.

## 1 · Cerrar la expedición y convertir el botín en una siguiente acción

**Evidencia → problema:** al volver del jefe aparece preparación0/5 y el receipt queda secundario; Misiones ya sabe orientar a Gringotts cuando hay llave. [Actual](evidence/captures/es-19-after-map-1280.png), [propuesta anotada](proposals/art-boss-closure.png). La orientación existe pero no en el momento de cierre.

**Cambio:** estado visual final distinto de la preparación. Jefe/resultado, recurso protagonista y una acción principal basada en inventario vigente; llave→Visitar Gringotts, rana poseída→Abrir rana, equipo→inspeccionar/equipar. Siempre conservar alternativa accesible para otra recompensa y nueva expedición explícita. Al regresar de bóveda no sugerir gastar una llave ya consumida. Derrota muestra qué se conserva y preparación posible; repetición no promete primera recompensa. Bosque sigue horizonte.

**Resultado esperado, hipótesis:** comprender qué se ganó y para qué sirve, sin depender de abrir Misiones ni releer un receipt.

**Aceptación:** ES/EN y ambos packs; primer jefe entrega exactamente lo actual; repetido solo lo actual; consultas/cancelaciones no gastan; abrir rana ganada no resta monedas; bóveda consume una llave una vez; retorno/recarga/restauración de receipt no duplican nada; nuevo run solo con selección explícita. Cierre estático equivalente en reducido; foco al título y retorno al objeto origen. Medir ruta clic→respuesta→resultado, no ocultar latencia. Recorrido completo: jefe→cierre→objeto→uso→preparación nueva. No basta un modal bonito sin destino operativo.

## 2 · Convertir la arena en una escena de combate legible

**Evidencia → problema:** tres aliados ya ocupan1511px en escritorio900 y1633px en móvil844; navegación cruza unidades. Mensaje Victoria aparece en evento0. [Actual](evidence/captures/es-arena-duel-early-1280.png), [propuesta](proposals/art-arena.png). El combate económico está confirmado correctamente: la presentación adelanta el desenlace y dispersa sus causas.

**Cambio:** dos bandos simultáneos de3–5 figuras y PV; PM/efectos/equipo a consulta, sin borrar su acceso. Un único control de replay con pausa/Auto/2x/omitir; registro separado. Actor/objetivo y delta local por evento. Mensaje inicial neutral de guardado, desenlace al resolver replay u omitir. Persistencia y resultado no esperan a la animación. El mockup3×3 ilustra jerarquía; no demuestra que5×5 esté resuelto.

El saldo ya confirmado debe seguir siendo veraz. Si el HUD económico anticipa el premio, puede plegarse durante el replay con consulta disponible; no se presenta un saldo anterior como vigente ni se difiere el commit para fabricar suspense. Guardado y dramaturgia son responsabilidades distintas.

**Resultado esperado, hipótesis:** reconocer quién actúa, qué cambió y por qué ganó/perdió, manteniendo interés por ver el resultado.

**Aceptación:** composiciones3×3,5×3 y5×5, unidades caídas/sin PM/gragea/sinergia; mismas secuencias y estado económico antes/después del replay; pausa/2x/omisión/Escape y retorno; renderer ausente conserva acciones y resultado. Sin scroll ordinario del escenario a1280×900/390×844/865×1079, inspectores ampliados desplazables. Nada tapado por nav; teclado, fuente200% y reducido no esconden actores. Medir frames desde entrada fría y eventos múltiples sin renderers de prueba en paralelo; comparar misma máquina/build/ventana con A62. Límites físicos/lector se mantienen pendientes hasta prueba real.

## 3 · Preparación contextual que enseñe consecuencias, no formularios

**Evidencia → problema:** comprar gragea ofrece Preparar equipo, pero su destino no contiene asignador; solo lo hay ante duelo/jefe. Además, tres alquimistas activan un bono real que la composición no presenta como decisión principal. [Destino reproducido](evidence/captures/es-E03-bean-destination-390.png), [asignador real](evidence/captures/es-17-bean-assignment-390.png), [reglas](PROGRESSION.md).

**Cambio:** compartir una vista de preparación contextual para el próximo combate y la compra. Retratos/puestos como centro; sello propio/temporal; seleccionar objeto y portador, previsualizar bonus/afinidad que realmente cambiará. Ayuda breve a demanda para consumo aleatorio de gragea; si no existe un combate preparable, indicar dónde se podrá asignar y volver a ruta, sin fingir que el clic la activó. Mantener gasto únicamente en el comando actual de combate. Evitar trasladar configuración al álbum.

**Resultado esperado, hipótesis:** elegir composición/portador por una consecuencia anticipada y localizar el consumible comprado.

**Aceptación:** copia concreta, duplicados con gear diferente,1–5 miembros, temporal/propio, caído/reserva, bolsa vacía/con unidad, asignar/quitar/cancelar, siguiente nodo sin combate. Alquimia2→3 corresponde al bono exacto del motor; no prometer victoria. Consultas y cambios locales no consumen gragea, cerrar no la activa; comando real consume una vez y registra sabor/efecto. Traducciones, semántica, hover/foco/toque y reducido equivalentes. Recorrido compra→localización→asignación→combate→sabor→álbum completo y sin datos perdidos.

## Plan de implementación por recorridos, después de revisión

| Paso | Unidad completa y frontera | Trabajo y validación antes de darla por terminada |
|---|---|---|
|0|Contrato del incremento|Registrar aprobación/alcance, baseline y fuentes; resolver términos de preview/contexto y criterios. Sin tocar precios/pesos/premios; A61 histórico no se convierte en sesión completada.|
|1|Jefe→botín→uso→otra preparación|Usar estado/receipts actuales; reutilizar navegación y transacciones. Probar finales primera/repetida/perdida, llaves usadas y respuestas recuperadas. Prototipo con assets actuales antes de producir recursos.|
|2|Preparación→arena→resultado→mapa|Resolver composición5×5 a escala real; conectar replay sin anunciar ganador antes, mantener semántica y fallback; comprobar mismos logs, controles y condición. Revisión visual ES/EN y reducido antes de añadir efectos.|
|3|Compra gragea→portador→combate→descubrimiento|Extraer presentación reutilizable solo si evita dos fuentes de regla; predicción deriva de dominio. Verificar cancelación/consumo/recarga y gear exclusivo por copia. No hacer otra bolsa.|
|4|Regresión y documentación|Build/typecheck/checks existentes pertinentes, dominio donde cambien reglas de presentación/casos de uso; navegador servicios reales, casos adversos, rendimiento frío y amplitud. Documentar ejecutado/no ejecutado, capturas antes/después; sin publicar.|
|5|Sesión posterior y siguiente diseño|Observar intenciones con protocolo separado. Comparar ofertas/amenazas y canje en modelo aislado; decisiones y balance nuevos necesitan contrato antes de persistir.|

No estimar fechas sin revisar alcance de cada entrega. B01/B02/B03 pueden entregarse por recorridos independientes; ninguna necesita reescribir el motor o migrar stack. Si para resolver preparación se descubre una limitación del núcleo, documentar con caso concreto antes de introducir otra librería.

## Después: profundidad sin acumulación de sistemas

Prioridad de diseño siguiente: **dos planes tácticos viables y diferentes** en una región. Comparar ofertas de Pacto y familias de rival antes de XP/poder. Canje de excedentes solo tras decidir protecciones y velocidad de colección: ratio3:1 ideal reduce P90 de completar de160 a51 aperturas en el modelo; es un cambio grande, no un detalle de UI. No convertirlo en regla por preferencia experta. [Alternativas y escenarios](PROGRESSION.md).
