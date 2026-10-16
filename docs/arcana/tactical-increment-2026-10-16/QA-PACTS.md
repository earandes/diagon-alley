# Pactos y primer combate · QA compilada A65

## Ejecución

`npx --no-install playwright test --config playwright.tactics-a65.config.ts`: **12/12, 59,0 s, código 0**. Dist candidato 3; la compilación final posterior solo cambió formato según el coordinador. Configuración propia, dos previews 5396/5397 con namespace UUID, cuentas y contextos nuevos, un worker, service workers bloqueados para fixtures de transporte. No se abrió una sesión habitual ni se gastaron recursos del usuario.

Registro compacto en `evidence/after-pacts/functional-results.txt` y estado del runner conservado en `last-functional-run.json`. Las advertencias de puerto WebSocket HMR ocupado pertenecen al loader de preview; los previews HTTP arrancaron y las pruebas terminaron correctamente. No se modifica configuración global.

## Recorridos ejecutados

Ocho recorridos: ES/EN × Diagon Alley/ARCANA × Chromium/WebKit. ARCANA usa movimiento reducido del sistema; Diagon Alley, movimiento normal.

- Inicio real, elección explícita de copia y nueva expedición.
- Todos los nodos presentes, geometría del mapa y documento sin scroll en 1280×900, 390×844 y 865×1079.
- Pacto nuevo con dos candidatos y confirmación deshabilitada sin elección.
- Selección sin POST ni cambio de GameState, progresos de afinidad visibles y consulta de atributos con teclado Enter.
- Cancelación, recarga y reapertura con los mismos IDs de oferta; el borrador no se confirma por recargar.
- Confirmación de un único temporal, sin copia permanente ni cambio de inventario.
- Segundo Pacto y acceso a un primer duelo real siguiendo aristas de la ruta autoritativa. La elección de ruta es un helper técnico declarado, no una observación humana.
- Emblema de amenaza, ayuda e inspección de todos los rivales.
- Compra real de una gragea por el precio existente mediante UI. Asignación, cancelación y nueva asignación sin consumo anticipado.
- Confirmación del combate con una activación real registrada. Resultado económico ya guardado, omisión/replay sin otra escritura económica ni cambio del BattleLog.
- Sin excepciones `pageerror` en los ocho recorridos.

Dos casos adicionales por motor:

1. **Respuesta perdida tras commit:** `route.fetch` ejecuta la operación real, se espera su respuesta exitosa y se aborta la entrega al cliente. Recarga recupera exactamente la unidad elegida, una operación y el mismo estado.
2. **Dos pestañas:** se retiene el envío de una pestaña; la segunda intenta confirmar el otro candidato. El claim compartido de operación pendiente bloquea el segundo POST. Se libera la primera, se confirma una incorporación y la otra pestaña recupera el mismo estado al recargar. Esta prueba acredita la protección cliente entre pestañas; no se presenta como dos escrituras que hayan competido en PostgreSQL. Esa concurrencia corresponde a las pruebas de integración del incremento.

## Evidencia

`evidence/after-pacts/`: **82 PNG**, ocho JSON de mediciones de disponibilidad DOM y dos vídeos copiados desde el runner. `videos.json` conserva su procedencia. Las capturas de tres tamaños comprueban escala y composición; los inspectores ampliados pueden desplazar el diálogo de forma accesible.

Las medidas `*-measurements.json` terminan cuando el DOM esperado está visible. **No incluyen necesariamente la decodificación de todas las imágenes ni el fin de las transiciones**. Las medidas visuales y de rAF completas se registran aparte en `PERFORMANCE.md`; no se mezclan ambas definiciones.

## Correcciones del harness

Una ejecución preliminar utilizó el nombre de omisión de apertura para el combate; se corrigió al control real «Omitir reproducción». Otra leyó estado mientras la compra seguía en curso porque ya había una gragea disponible, o antes del commit de la respuesta retenida. Ahora se espera la revisión confirmada o la respuesta real. El caso de pestañas se corrigió para probar el bloqueo real de operación pendiente en lugar de exigir un segundo POST que el cliente impide.

Estos ajustes no requirieron cambios de producción y no se presentan como fallos del juego corregidos.

## Límites

No es dispositivo físico, sesión humana, lector de pantalla hablado ni validación de diversión. Los casos de equipo completo/reemplazo y equipamiento diferente se cubren con pruebas de reglas y presentación del incremento; este recorrido de navegador parte de una copia propia y recluta temporales reales. La disponibilidad de todas las familias rivales en todas las semillas no se deduce de estas ocho rutas: la calibración reproducible corresponde al simulador. No hay comparación porcentual de rendimiento con A62/A63 sin condiciones equivalentes.
