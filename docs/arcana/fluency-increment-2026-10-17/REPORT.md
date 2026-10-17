# A73 · Fluidez de la expedición

Estado: runtime final ca9cc86; aceptación diagnóstica y ciclo de vida superados en CI16; matriz global e integración en main pendientes. No se presenta una fase parcial cancelada como CI correcta.

## Qué cambia

La misma expedición conserva entrada, preparación, mapa, duelos, jefe, cierre, uso del botín y otra preparación explícita. No se cambia ninguna regla, coste, premio, estadística, composición, snapshot u operación. Arte, resolución, antesala A71, actor por piezas, reloj A69, ES/EN y paquetes permanecen.

Se agrupan invalidaciones de imágenes por frame y se conserva geometría estable. El decode pertinente empieza en la misma escena mientras init trabaja; no se precarga la siguiente pantalla. Las imágenes resueltas se aprovechan sin otra microtarea, admitiendo hasta dos fuentes nuevas por paint para acotar concentración. Es un límite de admisión, no una garantía de dos uploadsGPU. Durante carga siguen disponibles retratos, nombres, PV y controlesDOM.

Los lotes admiten ocho texturas, sin eliminar actores: Pixi divide los que lo necesitan. Las formas simples existentes comparten ese batch mediante API pública; en el ensayo14 solo se observó GLSL de ocho samplers, frente32/8 de la variante anterior. Los eventos estáticos dibujan un snapshot sin ticker gráfico continuo; entrada, hechizos, impactos, curación y quemadura conservan frames. El reloj, pausa, Auto,2x, inspector, ocultación y omisión siguen independientes de carga/renderer.

No se añaden dependencias, cachés globales, audio o assets. Mipmaps, autoload y atlas se retiraron tras contrastarlos; sus resultados desfavorables se conservan.

## Mejora medida y límites

Ensayo15, referencia originald13 y runtime final en el mismo runner, tres parejas AB/BA/AB, contextos nuevos y10s por escena:

| Medida | Referencia | Candidato |
|---|---:|---:|
| P95rAFgenérico3×3 |33,4ms|16,7–16,8ms|
| P95rAFgenérico tras remontar |33,4ms|16,7–16,8ms|
| P95rAFjefe5×5 |16,8/33,2/16,8ms|≈16,7ms|
| MáximorAFarranquegenérico |200–233ms|50–67ms|
| MáximorAFarranquejefe |233–250ms|50–83ms|
| Navegación→artegenérico, cota de polling |529–676ms|416–440ms|
| Navegación→artejefe, cota de polling |719–729ms|497–582ms|

Todas las parejas reducen la cota total de espera y los picos; no se desplaza carga a otra pantalla. La cota de polling todavía no acredita400/550ms. El ensayo16 conserva esas cotas y añade una marca precisa tras el envío completo y su siguiente oportunidadrAF, idéntica en ambas variantes. Pasa todos los presupuestos: oportunidadrAF236,5–242,3ms genérico/289,2–326,9ms jefe; máximorAF33,4ms; todos losP95≈16,7–16,8ms. Ese runner fue favorable también para el sostenido de referencia; dos pares genéricos tienen una oportunidadrAF3–4ms anterior en referencia, aunque las cotas de polling actuales bajan en los seis pares. No se afirma mejora de cada indicador ni finalizaciónGPU. La evidencia causal del sostenido procede de9 y15; la nueva marca no borra incumplimientos anteriores.

Son fixtures Linux/Chromium/SwiftShader declaradas, no una GPU física, duración humana o rendimiento universal. Nuevos contextos no purgan cachésOS/proceso/shaders. rAF no mideGPU; decodepromise yspans nativos son walltime, noCPU pura. Las dimensionesRGBA no equivalen a memoria residente; los contadores propios no demuestran ausencia global de fugas.

## Validación

El caso nuevo de ciclo de vida pasó enCI39037479383: decode pendiente, ocultación sintética, resize pausado390/865,10figuras/PV, reducido durante gesto, resultado/log/game conservados ysinpageerrors. La captura estática adicional se comprobará en la matriz final; no valida movimiento por sí sola.

La matriz completa conserva Chromium/WebKit y1280×900/390×844/865×1079, A70/A71 y regresiones. Cuatro cuentas A73 aisladas comprueban recorrido autoritativo, rana ganada sin recompra y siguiente run explícita. SHA, resultados y recorrido completo finales pendientes.

- [Contrato y plan](CONTRACT.md), [diagnóstico y ensayos](DIAGNOSIS.md).
- [Protocolo reproducible](REFERENCE.md), [mediciones](PERFORMANCE.md).
- [Validación](VALIDATION.md), [mapa de cobertura](COVERAGE.md).
- [Compatibilidad](COMPATIBILITY.md), [experimento de assets retirado](ASSET-ADAPTATION.md).

Main no modificado. Sesión humana, dispositivo físico, GPU real, red móvil y lector audible pendientes. No se atribuye comprensión, diversión o retención a estas pruebas.
