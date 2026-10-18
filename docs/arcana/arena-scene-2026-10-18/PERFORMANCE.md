# A86 · Medidas y límites

Primera pasada39163805967 / fuente27ccc03 / checkout1ce3b87. No es el candidato corregido d661a94 ni acredita integración superada. [Datos](evidence/first/paired-mobile-performance.json).

Chromium390×844, ES/Diagon, fixtureMaestría5×5, AB–BA–AB, seis contextos aislados,600intervalos rAF sostenidos por muestra. Módulo ya evaluado antes del montaje explícito; no arranque frío de SO/cachés. Ambos usan contenido históricoA84 para comparar el mismo log.

- baseline: acción→frame 251.1, 247.1, 246.9 ms; mediana 247.1 ms; P95rAF 16.7, 16.8, 16.7 ms. Tareas≥50ms registradas: 0.
- current: acción→frame 245.8, 255.3, 247 ms; mediana 247.0 ms; P95rAF 16.8, 16.7, 16.7 ms. Tareas≥50ms registradas: 0.

La diferencia de medianas no demuestra una optimización; objetivoA86 es claridad y conservación de fluidez, no reducir latencia. rAF no es GPU; promesa decode no es CPU pura, estimaciónRGBA no memoria residente, contadores propios no ausencia global de fugas. Se conservan valores individuales desfavorables.

Corrección d661a94 añade diálogo nativo y presupuesto de figuras/observación geométrica. Sus muestras Linux y regresiones siguen pendientes; no trasladar las cifras anteriores al código nuevo. Ninguna medición local gráfica, humana o en dispositivo físico.

## Confirmación d661a94 · CI39165666169

Checkout067e92737cf3b95766c249934c71100e4016676a; misma configuración pareada y contenidoA84. [Raw](evidence/confirmation/paired-mobile-performance.json).

- Baseline acción→frame:340,5 /301,1 /339,1ms; mediana339,1ms. P95rAF16,7ms en las tres. Tareas largas59/54/55ms.
- Actual:326,4 /341,2 /328,1ms; mediana328,1ms. P95rAF16,8/16,7/16,8ms. Tareas largas58/67/60ms.

Conserva objetivo sostenido≤20ms en estas ventanas, pero el arranque es más lento que en la pasada anterior y mantiene picos≥50ms. El intento intermedio actual es peor que su baseline. No se declara una mejora causal de rendimiento por la mediana11ms menor, ni ausencia de tirones. Son muestras Linux emuladas; la composición cambia sin recalcular log. A75 pasó; el resto del pipeline continúa pendiente al registrar estas medidas.

## Candidato de foco6cf2ac8 · CI39167929972

Checkout0d59c6103e0ecaba1956b43b6ec8e84ba2e1f2cf, mismo protocolo declarado; [raw](evidence/focus-candidate/paired-mobile-performance.json).

- Baseline acción→frame:322,5 /302,1 /303,9ms; mediana303,9ms. P95rAF16,7ms en las tres. Tareas largas55/55/57ms.
- Actual:348,3 /340,5 /329,4ms; mediana340,5ms. P95rAF16,7ms en las tres. Tareas largas76/59/60ms.

Esta pasada es peor en arranque: mediana+36,6ms frente a su referencia histórica, con los tres valores actuales superiores a la mediana anterior. Se conserva el resultado desfavorable. No se atribuye una causa a foco/Pixi/medición de geometría sin aislarla; tampoco se selecciona la pasada previa favorable para afirmar queA86optimiza arranque. El objetivo sostenido≤20ms sí se cumple en las tres ventanas actuales. El coste de apertura del menú no se ha medido como una acción completa separada; skiplegacy mide desdeSkip, no desdeabrirPausa. Sin cifra inventada de latencia humana o GPU.
