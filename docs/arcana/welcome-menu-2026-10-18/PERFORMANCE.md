# A82 · Rendimiento y límites

No se añade renderer, dependencia, textura bitmap, relojJavaScript, loop o recurso generado durante la interacción. Se reutilizan vectores A81 y fuente local; marco/materiales porCSS. Los efectos nuevos son pulsación120ms, borde160ms y entrada de carta160ms, tiempos de diseño que no se presentan como mediciones de GPU o latencia humana. Reducido elimina el movimiento conservando foco/estado.

La suite general CI39115461901 ejecutó la comparación A67 existente: ChromiumLinux1280×900, referencia histórica A66 y candidatof9082cf, una muestra por variante. Datos crudos en evidence/performance. No es un benchmark del menú A82 ni prueba de mejora atribuible a él.

Resultados desfavorables conservados: Pacto/frío acción→utilizable81,9→85,9ms, confirmación223,9→278,7ms; consulta de taller81,3→89,1ms. Aperturas cálidas mezclan mejoras y empeoramientos (46,4→37,3ms;45,0→56,1ms). Máximo intervalo rAF de la muestra actual83,3ms y tarea larga67ms en apertura fría. Los tests pasaron sus contratos existentes; no se declara objetivo universal20ms alcanzado ni ausencia de tirones. Muestra pequeña, polling/CI/red/decodificación incluidos. No son tiempos GPU, duración humana o prueba de causalidad.

Build conserva aviso conocido de chunk>500kB. No perfiles nuevos, capturas extensas o navegador enMac. No nueva medida de arranque frío global, memoria residente, dispositivo físico o fugas. No se repiten perfiles para seleccionar una cifra favorable.
