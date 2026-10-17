# A75 · Rendimiento y composición

Muestra acotada ejecutada en CI39056332168/head692dacf, que **no pasó completa**: la batería se detuvo después en F09. Estos resultados parciales se conservan; no sustituyen la validación del candidato final.

## Comparación emparejada con A73

390x844 / ES Diagon / declared mastery5x5 / AB-BA-AB / fresh isolated browser contexts; application module evaluated before explicit fixture mount. rAF is not GPU time.

| Variante | Par | Activación→frame listo ms | P95 rAF ms | Máximo sostenido ms |
|---|---:|---:|---:|---:|
| baseline | 1 | 364.0 | 16.7 | 16.8 |
| current | 1 | 304.4 | 16.8 | 16.8 |
| current | 2 | 334.0 | 16.7 | 16.8 |
| baseline | 2 | 331.6 | 16.7 | 16.8 |
| baseline | 3 | 301.4 | 16.7 | 16.8 |
| current | 3 | 330.9 | 16.7 | 16.8 |

Mediana P95:16,7ms en ambas variantes. No se atribuye una mejora de velocidad: es una comprobación de no regresión en esta muestra. Los tiempos de activación y navegación se conservan separados en el crudo, incluidos extremos y long tasks. No tiempo GPU, memoria residente, arranque frío universal ni prueba global de ausencia de fugas.

## Geometría

390×844, ES,5×5: peanas propias109,4px. Figura pasa de50,8 a69,1px con nombre de una línea; con dos líneas queda52,9px. Sin reducir fuente ni PV. Mediana de huella alfa fuente propia Diagon de~49 a~66px; ARCANA de~40 a~54,6px. La transparencia del arte sigue existiendo, no se finge un rig nuevo ni se deforma la ilustración.

Geometría3×3/5×3/5×5,ES/EN×packs pasó enChromium390 en esta ejecución. Reflujo320/texto200% pasó en ambos packs EN con scroll vertical permitido y sin scroll horizontal; no emulación de zoom/dispositivo físico. Faltaba completar el resto de proyectos y recorridos.

## Controles temporales

Tres pares completaron pausa,2x,inspector,ocultación sintética,omisión y comparación inmutable deBattleLog/game. La captura PNG acredita composición únicamente. Se mantuvo reloj/renderer; el cambio productivo es layout, no lógica temporal.
