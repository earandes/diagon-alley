# A67 · Rendimiento y condiciones de medición

## Tamaño del artefacto y referencia

Compilación A67 final: principal 949,56 kB minificado, gzip 293,46 kB. Referencia A66 reconstruida: principal 929,03 kB. No equivale a una mejora de tiempo de carga. Chunk grande continúa como advertencia.

La referencia se reconstruye desde 97573b0 más el diff A65/A66 y sus 14 archivos adicionales, con hashes en `evidence/performance-reference/manifest.json`. No se presenta como una captura de tiempos inicial inexistente. El script Linux `tools/verification/build-a66-reference.mjs` reproduce el build sin tocar la partida habitual.

## Perfil comparativo preparado, todavía no ejecutado en Linux

Un Chromium y servidor por ejecución, sin vídeo/trazas/capturas. Mismo viewport 1280×900, mismos gestos Pactos/Taller, namespaces nuevos; lectura desde pointerdown a destino visible/imágenes decodificadas y final de animaciones finitas. Incluye API/red y overhead del runner, registra frames largos y tareas largas. Tres consultas/selecciones, una confirmación, abrir taller y cotización. No se extrapola a FPS sostenidos, móviles físicos o percentiles de población.

```sh
node tools/verification/build-a66-reference.mjs
A67_PERFORMANCE_VARIANT=baseline npx playwright test --config playwright.performance-a67.config.ts
A67_PERFORMANCE_VARIANT=current npx playwright test --config playwright.performance-a67.config.ts
```

Las mediciones JSON se guardan en `evidence/performance/` y se descargan como artifact de CI. Hasta que existan resultados reales, no se afirma latencia o regresión resuelta. No se repite perfil gráfico completo en el Mac afectado por WindowServer.

## Límites del host y de los datos anteriores

El smoke local 3,6 s mide duración del test completo, no latencia percibida ni FPS. Los JSON de encuentros anteriores incluyen espera de transporte/assertions y no tienen pareja A66 equivalente; no sirven para afirmar una mejora. No se desplaza trabajo a otra pantalla ni se retrasa el commit para ocultar esperas.
