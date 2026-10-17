# A73 · Referencia y reproducción

Solo Linux bajo guard/bloqueo/watchdog originales, un worker y cero retries. No ejecutar estos recorridos en el Mac. Los servicios/variables PostgreSQL/Redis y versiones de Node/lockfile son los declarados por `.github/workflows/checks.yml`; no se requieren herramientas o servicios nuevos.

## Recorrido funcional

La configuración por defecto `playwright.boss-a70.config.ts` ejecuta la matriz A70/A71 y los cuatro recorridos A73 ES/EN×paquete. A73 usa autoridad aislada5472; los 24casos A71 más4A73 quedan dentro de la cuota real30, sin relajar límites. No usa cuenta habitual. Recorre entrada/preparación/mapa/duelo/retorno/jefe/cierre/rana poseída/otra confirmación explícita; conserva tiempos desde clic real, respuestasHTTP, snapshots ylogs.

```
npm run build
npx playwright test --config playwright.boss-a70.config.ts
```

## A/B acotado, separado de la matriz

La variante diagnóstica reutiliza exactamente el mismo guard, lock, worker y servidores. No se ejecutan suites simultáneas. Es una fase explícita, no un modo de saltarse las protecciones del host.

```
ARCANA_A73_DIAGNOSTIC=1 npx playwright test --config playwright.boss-a70.config.ts
```

Para únicamente las dos imágenes seleccionadas después de medir/pausar, añadir `ARCANA_CAPTURE_A71=1` en Linux. No hay vídeo/trazas ni medios durante las ventanas. La matriz completa no repite este A/B cuando ya existe evidencia del mismo código ejecutable: evita duplicar carga y exceder el límite original de CI. `tools/verification/a73-phase.json` debe permanecer en `full` al integrar; el override explícito conserva todas las protecciones.

Tres pares por escena, orden AB/BA/AB,12contextos. Genérico3×3 seed69 yjefe5×5 seed70 (estadísticas prolongadas solo enfixture),10s por contexto tras observar art-ready; el genérico añade10s después de remontar. Nuevos contextos no purgan cachéOS/proceso/shaders; no se denomina arranque frío de máquina. El percentil es sorted[floor((n−1)*q)]; no se promedianP95. La prueba escribe todos los datos antes de exigir≤20ms a cada ventana actual, incluidas las desfavorables.

El baseline se archiva por SHA en `tools/verification/build-a73-reference.mjs`, con idénticas tres entradasVite, assets y dependencia lockfile; solo recibe el mismo hook opt-in React si no existía. Se sirve en/a73-reference sobre el mismo5471. Se mantiene historia de commits al integrar para que gitarchive pueda reproducirlo en un clon nuevo.

| Ensayo | Referencia | Variable principal |
|---|---|---|
|1–3|d13c0d9|agrupación/geometría; mipmaps no aislados; decodeparalelo|
|4–5|a5a3b3b|mipmaps aislados; ticker bajo demanda|
|6–7|14a7f1d|autoload; trim alfa|
|8|fa41664|bandas atlas|
|9|78267f5|límite8 delbatch|
|10|d13c0d9|candidato mínimo sinatlas|
|11|0c0547c|uso inmediato de imagen resuelta|
|12|d03c93c|dos admisiones por paint|
|13|d13c0d9|variante acotada contra original|
|14|83d4e48|formas simples en batch público|
|15–16|d13c0d9|runtime final;16 incorpora marca precisa|

Los dos primeros ensayos no tienen exactamente la misma instrumentación/entradas que los posteriores. Se conservan para explicar decisiones; no forman una única serie homogénea. d13 conserva runtime/arteA72 de4be35f8 más instrumentación yrecorrido, sin optimización. La referencia inicial de seis muestras, anterior al A/B, permanece en evidence/reference.

Cada raw incluye mergeSHAdeCI; su CIJSON conserva headSHA, pasos yconclusión. Runs cancelados tras obtener un diagnóstico no son baterías globales correctas.

## Análisis sin navegador

```
node docs/arcana/fluency-increment-2026-10-17/ab-report.mjs RUTA/raw.json.gz
node docs/arcana/fluency-increment-2026-10-17/summarize.mjs RUTA/raw.json.gz
```

Los crudos están comprimidos sin pérdida; los scripts admiten JSON/JSON.gz. Los inicialesreference/current ycompare siguen recuperables; la comparación regenerada coincide concomparison.json. La medición de escena está desactivada en uso normal y acotada enfixture. rAF no mideGPU, decodepromise no esCPU pura, render-submit yllamadasnativas son walltime de envío, dimensionesRGBA no sonRAMresidente ycontadores propios no acreditan ausencia global de fugas.

Para el recorrido autoritativo completo, `journey-report.mjs CARPETA` agrupa las cuatro cuentas declaradas por paso (cotas desde clic, respuestaResourceTiming, figuras y coreografía). No compara rutas aleatorias o runners distintos como si fueran experimentos causales. La referencia conservada da primeraarenafiguras358–435ms/jefe497–515ms; se contrastará con los valores finales completos, sin inferir una duración humana ni acelerar la apertura de ranas.

El diagnóstico final añade `recovery-a73.spec.ts` como caso funcional acotado posterior a las medidas (no altera las condiciones previas del A/B). Prueba gate de decode, visibilidad sintética, resize pausado390/865 y cambio de reducido durante gesto, sin otro servidor ni cuenta. La matriz full también lo conserva, con una sola captura estática adicional explícita390 en Linux bajo ARCANA_CAPTURE_A71=1; se espera a dos oportunidadesrAF después del resize. No es vídeo, dispositivo físico o prueba de movimiento.

Desde el contraste16 se conserva, además de la cota de polling, readySubmitAt (MutationObserver tras el turno que envía todas las figuras y actor) y readyFrameAt (siguiente oportunidadrAF). No mide finalizaciónGPU ni pantalla física. Se aplica idéntico a ambas variantes; el observador se desconecta tras la primera marca y no participa en las ventanas sostenidas. Los objetivos400/550se comprueban enreadyFrameAt;100msmáximo de arranque y20msP95sostenido mantienen su definición. Todos los registros se escriben antes de evaluar presupuestos. La cota antigua de polling continúa presente incluso si supera el objetivo; no se ocultan los ensayos anteriores ni se comparan protocolos como una sola serie.
