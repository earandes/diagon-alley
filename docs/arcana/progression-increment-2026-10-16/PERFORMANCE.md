# A67 · Rendimiento ejecutado en Linux

## Fuente y condiciones

[CI38934126220](https://github.com/earandes/diagon-alley/actions/runs/38934126220), SHA `13447f0eeec0afaed83e7313b964cb05993aa7a0`, Node24.21.0, runnerUbuntu. Un Chromium/servidor por ejecución, sin vídeo, trazas o capturas. Mismo viewport1280×900, mismos gestos Pactos/Taller y namespaces aislados. La referencia A66 se reconstruyó desde97573b0 más patch y14archivos adicionales, todos con hashes en `evidence/performance-reference/manifest.json`; no es una captura de tiempos inicial inexistente.

Medición desde pointerdown hasta destino visible e imágenes decodificadas; después, dos frames y final de animacionesDOM/CSS. Incluye API/red y overhead de polling del runner. La columnaDOM no certifica finalización de timelinesGSAP/Pixi ni GPU en reposo. No se mide arranque inicial ni dispositivo físico.

## Resultados observados, milisegundos

| Acción | A66 utilizable | A67 utilizable | A66 DOM asentado | A67 DOM asentado |
|---|---:|---:|---:|---:|
| Primera consulta de Pacto |66,2|65,7|486,9|486,5|
| Selección0 |22,0|20,5|430,0|440,4|
| Consulta repetida1 |43,3|59,7|954,2|955,6|
| Selección1 |27,1|27,5|429,7|413,6|
| Consulta repetida2 |29,6|50,5|929,7|434,3|
| Selección2 |21,0|21,3|414,4|414,2|
| Confirmar Pacto, incluye autoridad |141,8|189,4|181,9|215,9|
| Abrir Taller |61,1|57,9|464,2|447,4|
| Consultar forja |19,5|16,1|46,7|46,7|

Fuentes completas: [baseline](evidence/performance/baseline.json), [current](evidence/performance/current.json). “Primera” significa primera consulta de diálogo en esa cuenta, no caché de red fría: la preparación anterior ya cargó parte de los recursos en ambos casos.

La confirmación fue47,6ms más lenta en esta pareja; las consultas repetidas16–21ms. Primera consulta/Taller/cotización fueron similares. Son una pareja de ejecuciones y tres consultas, no una distribución de población o comparación estadística. No se proclama una mejora por el asentamiento más corto de una repetición: hay variación de animación/runner. Todos los destinos observados resultaron utilizables en menos de190ms; no es una garantía para otros equipos/redes.

Frame máximo observado50ms en primera consulta de ambos; longtasks de51/50ms A66 y50ms A67. El resto se desglosa enJSON. Persisten frames superiores a16,7ms: no se declara60FPS ni ausencia de tirones. No se trasladó una espera a otra pantalla, añadió un retraso de suspense o retrasó el commit.

## Artefacto y memoria de herramientas

BuildA67: principal949,53kB minificado/gzip293,44kB frente A66929,03/287,54kB; +20,50kB/+5,90kB. CSS181,59 frente170,86kB. No implica mejora de carga. Continúa la advertencia de chunk grande; sin nuevo lote raster ni dependencia de producción.

La primera reconstrucción CI falló al intentar capturar un `git archive` de un árbol de534.593.535bytes con buffer256MB. La versión final usa archivo temporal de disco, extracción y limpieza; buildA66 y ambos perfiles pasan en la CI citada. No se repitió esa carga en macOS. El smoke local de3,6s mide un test entero y no se usa como latencia/FPS.

## Reproducción

```sh
node tools/verification/build-a66-reference.mjs
A67_PERFORMANCE_VARIANT=baseline npx playwright test --config playwright.performance-a67.config.ts
A67_PERFORMANCE_VARIANT=current npx playwright test --config playwright.performance-a67.config.ts
```

SoloLinux, servicios del proyecto saludables, dependencias/build preparados. El extractor no sobrescribe una referencia existente. Las suites comparten bloqueo y se ejecutan en serie. Dispositivo físico, redes reales y duración humana siguen pendientes de observación. La CI de main vuelve a ejecutar los dos perfiles; sus artifacts permiten consultar esa medición además de esta pareja versionada.
