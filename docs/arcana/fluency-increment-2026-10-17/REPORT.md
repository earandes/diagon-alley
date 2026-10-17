# A73 · Fluidez de la expedición

Estado: implementación y comprobaciones locales correctas; comparación y matriz Linux del candidato corregido en curso. Main todavía no modificado.

## Cambios

Se agrupan las llegadas de textura en un frame de display y se conserva geometría cuando sus entradas no cambian. El ticker, resolución, arte, composición, coreografía y reloj de replay son los existentes. No hay recursos visuales nuevos, dependencia, caché global, carga anticipada, cambio de reglas o economía.

El recorrido de verificación comprende entrada, selección/preparación, mapa, primer duelo, regreso, jefe, cierre, rana poseída sin recompra y otra expedición confirmada explícitamente. Usa cuatro cuentas aisladas ES/EN×pack y conserva snapshots/logs; las fixtures de rendimiento son independientes de esas cuentas.

## Evidencia y límites

- [Contrato y plan vivo](CONTRACT.md).
- [Diagnóstico y elección](DIAGNOSIS.md).
- [Referencia ejecutable](REFERENCE.md) y scripts summarize/compare.
- [Validación, fallo corregido y cobertura](VALIDATION.md).
- [Compatibilidad y recursos](COMPATIBILITY.md).

Referencia: seis ventanas cálidas P95rAF16,7–16,8ms; el histórico33,4ms no se reprodujo en ese protocolo. Ráfagas de9–16paints de arranque y92–99reconstrucciones cálidas comprobadas. No se atribuye todo el pico a ese trabajo, ni se compara una muestra nueva favorable con A69 remontado como si fueran el mismo ensayo.

Pendientes: resultados antes/después, inspección seleccionada de evidencia, regresiones Linux, integración y SHA remoto/CI. No se declara entrega terminada por el estado del código. La sesión humana y el dispositivo físico siguen posteriores; los tests no acreditan diversión o retención.
