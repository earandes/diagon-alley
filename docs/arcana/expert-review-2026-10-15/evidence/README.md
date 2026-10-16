# A62 · Evidencia, aislamiento y reproducción

Análisis15octubre2026. Solo esta carpeta contiene escrituras nuevas. No se ejecutaron migraciones, reinicios de datos o cambios de aplicación. La automatización **sí crea/gasta recursos de sus cuentas de prueba** para verificar recorridos, nunca los de la cuenta habitual.

## Entorno y procedencia

- macOS, Node24.20.0, PlaywrightTest1.64.0 instalado en proyecto; Chromium/WebKit headless seriales. Tamaños1280×900/390×844 y mapa865×1079; sin móvil físico.
- Preview compilado5350 con `ARCANA_TRIAL_NAMESPACE=a62-expert-5350`; Fastify/PostgreSQL/Redis existentes y reales. El gateway del preview transmite namespace; cada contexto crea cookie/cuenta nueva. Contextos cerrados en finally, sin leer cookies ni operar Chrome5194 del propietario.
- [artifact-verification.json](artifact-verification.json):320archivos de dist idénticos a distribución A60 congelada, fuentes activas concordantes. Se revisa esa versión, no un mockup histórico.
- [baseline](../baseline-sha256.json) y[integrity.json](integrity.json):1685archivos protegidos de código/tests/tools/skills/design/config/docs normativas comparados. La prueba de integridad no certifica estado de toda la máquina o servicios compartidos.

## Ejecuciones nuevas

| Trabajo | Resultado y artefactos | Límite |
|---|---|---|
|Recorrido completo ES/EN Chromium|2/2, [journey-final.txt](journey-final.txt);6tipos de nodo, jefe, bóveda cancelar/confirmar, forjar/equipar, otra run, recarga exacta;15POSTs normales por cuenta incluida sesión;0pageerrors. [ES](es-journey-log.json)/[EN](en-journey-log.json)|Ruta elegida técnicamente para cubrir tipos; no sesión humana, tasa de victoria, teclado completo ni suite general|
|Consultas/destino gragea/swap ES/EN|2/2,[contextual-final.txt](contextual-final.txt), [ES](es-contextual-observations.json)/[EN](en-contextual-observations.json). Folio/odds conservan estado; destino preparación tiene0asignadores; swap conserva autoridad|No todos los modales, operaciones inciertas o tipos de inventario|
|Movimiento/perf|Exit0,[motion-current-run.txt](motion-current-run.txt), [profiles.json](motion-current/profiles.json):4ventanas mapa5s+4aperturas frías+6registros adversos/presentación|No sumar perfiles/probes como14tests equivalentes. WebKitLongTaskAPIausente; sin arena cargada/móvil físico|
|Modelo de ruta/combate|[gameplay-model.mjs](gameplay-model.mjs)/[JSON](gameplay-model.json):500seeds/4585caminos con CombatEngine actual|Sin DB, política definida, no comportamiento humano ni todas las estrategias|
|Escenarios económicos|[gameplay-economy.py](gameplay-economy.py)/[JSON](gameplay-economy.json):20.000ensayos por escenario, seed62015|Sin cuentas/mutaciones; canjes ideales nuevos son hipótesis, no configuración|
|Inventario de arte|[art-inventory.py](art-inventory.py), [art-review.py](art-review.py), [inventario](../asset-inventory.json), [resumen](art-bindings-summary.json)|Bytes de archivos no descarga inicial; inspección visual no aprobación final|
|Guía Impeccable|[impeccable-context.txt](impeccable-context.txt), motor0.1.14local explícito|Contexto histórico contiene metadatos viejos; no prevalece sobre código/capturas ni prueba UX|
|Propuestas estáticas|[fuentes/render](render-proposals.mjs), [log final](render-proposals-wrapper.txt),3SVG/PNG+6overviews|No aplicación interactiva, assets nuevos terminados ni prueba5vs5|

Capturas PNG y YAML del DOM accesible en[captures](captures). Geometría de documento/viewport/controles en[geometry.json](geometry.json). `smallControls` es una heurística de rectángulos: incluye controles detrás de diálogos/inertes y no constituye automáticamente incumplimiento. Medidos activos: retrato equipo40×73 y summaryreceipt134×36, bajo objetivo de comodidad44×44; no atribuir44al mínimoAA.

## Comandos reproducibles, solo contextos propios

```sh
ARCANA_TRIAL_NAMESPACE=a62-expert-5350 npx --no-install vite preview --host 127.0.0.1 --port 5350 --strictPort --mode arcana
npx --no-install playwright test --config docs/arcana/expert-review-2026-10-15/evidence/audit.config.ts --grep 'complete isolated journey'
npx --no-install playwright test --config docs/arcana/expert-review-2026-10-15/evidence/audit.config.ts --grep 'contextual consultations'
node docs/arcana/expert-review-2026-10-15/evidence/motion-a62-inspection.mjs
node docs/arcana/expert-review-2026-10-15/evidence/gameplay-model.mjs
python3 docs/arcana/expert-review-2026-10-15/evidence/gameplay-economy.py
```

Necesitan dependencias/servicios ya disponibles y el mismo artefacto. No ejecutar contra5194 ni apuntar un script a cookies de usuario. El preview de auditoría se detiene al cierre; PostgreSQL/Redis y servidores ajenos se conservan. Los scripts de modelo no envían comandos económicos. Los de navegador solo usan GUI para comandos yGET para contrastar snapshots. No se ha llamadoAPIde juego para inyectar premio, desbloqueo, saldo o seed.

Intentos previos de harness se conservan: `journey-first.txt` selector de salida erróneo; `journey-pass2.txt` selector Mapa ambiguo; el final usa selectores correctos. `render-proposals*.txt` conserva timeout de captura SVG directa; wrapperHTML renderizó los mismosSVG. Son correcciones de herramientas de análisis, **no fixes de aplicación** ni casos nuevos acumulables.

El visor documental[index.html](../index.html) se abrió a1280y390px en un contexto local separado: tres propuestas decodificadas, cero erroresJS y sin desbordamiento horizontal. [Datos](review-viewer-smoke.json). Es validación del entregable documental, no otro recorrido del juego. El preview5350 terminó medianteSIGINT; [limpieza](cleanup.json). No se detuvieron los servicios compartidos ni el servidor habitual.

## Cobertura que no se reclama

No se ejecutan aquí unit/integration/build/typecheck completos. A58/A60 aportan resultados históricos nominados en[STATES](../STATES.md), no resultados A62. No se reproduce actualmente: derrota/empate, cinco miembros, saldo/energía0, duplicado real, rana ganada abierta, recarga a mitad de rana, respuesta perdida, error precommit, versiónvieja, dospestañas, fallo WebGL/GSAP o sesión caducada. Se inspecciona código correspondiente y se propone aceptación. Sí hay offline/reconexión sin recarga, bloqueoWebP, reducido, focoEscape anidado parcial, fuente200% y persistencia normal.

No certificaciónWCAG, lector real, navegación íntegra solo teclado, zoom nativo o dispositivo físico. No medición de diversión/retención, ni observaciones humanas inventadas. No vídeo nuevo. [42condiciones con estado individual](../STATES.md).
