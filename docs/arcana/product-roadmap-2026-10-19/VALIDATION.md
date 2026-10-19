# Comprobación de la entrega documental

19 octubre 2026. Baseline de código `d4a6d36fd0b1fb96ab4f3e8a071c88cfc5621f1f`. Esta entrega no modifica código de aplicación, reglas, assets activos, dependencias o bases. README y DECISIONS reciben únicamente enlaces/estado de propuestas; PRD1.0.54, DESIGN y Word permanecen intactos. Los archivos anteriores y no rastreados se conservan. Sin commit/push.

## Ejecutado

1. `git status --short --untracked-files=no` y `git log`: baseline rastreado limpio al comenzar; al terminar solo README/DECISIONS figuran modificados entre los rastreados, más la carpeta nueva sin commit.
2. Lectura y contraste estático de las fuentes registradas en `sources.json`. Los 22 archivos de repositorio referenciados existen. No equivale a recorrido visual actual ni a ejecutar sus tests.
3. `python3 docs/arcana/product-roadmap-2026-10-19/collection_analysis.py > docs/arcana/product-roadmap-2026-10-19/collection-analysis.json`: correcto. Cinco casos matemáticos conocidos y conservación de masa; entradas/hash y límites conservados en JSON. Sin dependencias/red/lectura de partidas.
4. Comprobación de estructura: quince fichas únicas PM01–PM15, enlaces locales sin destino ausente, fuentes JSON válidas y Markdown nuevo sin espacios finales. El script de comprobación utilizó únicamente `pathlib/json/re` sobre documentos.
5. `git diff --check`: correcto para cambios rastreados. Comprobación de espacios y enlaces de la carpeta nueva realizada aparte porque todavía no está añadida a Git.
6. Recibo de fuentes inline generado con el runtime de Data ya instalado, sin dependencias nuevas, navegador o publicación. Archivo de presentación fuera del repositorio; no se incorpora como asset del juego.

## Modelo recalculado, no métricas de personas

| Objetivo desde identidad inicial | Identidades totales requeridas | Mediana de aperturas | P90 | P95 |
| --- | ---: | ---: | ---: | ---: |
| 50% | 17/34 | 21 | 25 | 27 |
| 75%, redondeo arriba | 26/34 | 45 | 55 | 58 |
| 90%, redondeo arriba | 31/34 | 73 | 93 | 100 |
| 100% | 34/34 | 128 | 188 | 211 |

Media para completar 134,9303414494 aperturas; repetidos medios al completar 101,9303414494. Primera copia encantada cualquiera, bajo 1% independiente: mediana69/P90230/P95299. Los resultados de completitud coinciden con A87. El modelo no estima ingresos, gastos, victoria, horas, espera de Esencia, calendario, diversión o retención, y no garantiza completitud tras un número finito de aperturas. Encantado y recuerdo estacional no amplían denominador base.

## No ejecutado / pendiente

No se ejecutaron build, tipos, tests de app, suites gráficas, QA físico, pruebas de audio, conexiones PG/Redis o servicios externos: no hubo cambios de producto que validar en esta fase. Tampoco entrevistas, reclutamiento, analítica real o simulaciones nuevas de combate. La evidencia histórica de CI se cita con su alcance, sin atribuir una batería a este árbol documental.

La futura implementación debe seguir `DELIVERY.md`, verificar el SHA candidato real y resolver los límites de cada ficha. Ninguna recomendación queda aprobada por superar estas comprobaciones documentales.

## Ampliación: colección, comercio y tiendas · 19 octubre 2026

Se añaden nueve fichas PM16–PM24 y seis candidatas de tienda. El orden único de las veinticuatro propuestas se publica en [PRIORITIES.md](PRIORITIES.md); el índice original se conserva en `README-INITIAL.md`. No son seis tiendas autorizadas para producir ni nuevas reglas aprobadas.

Comprobaciones ejecutadas:

- Inspección estática de destinos actuales, forja v2, tabla de ranas A87, cuatro efectos de grageas, descubrimientos por receipts, bóveda y derechos de primera victoria. El JSON bruto de recetas antiguas se contrasta con el ensamblador efectivo v2; no se toma como regla vigente sin esa composición.
- Consulta de FAQ oficial de Pokémon, anuncio original de Golden Packs de Wizards y press kit de Mega Crit. URLs, fecha y límites en `sources.json` y `COMMERCE-STUDY.md`. La fuente de Wizards es histórica, no una afirmación de todas sus reglas actuales.
- `python3 -B docs/arcana/product-roadmap-2026-10-19/commerce_analysis.py > docs/arcana/product-roadmap-2026-10-19/commerce-analysis.json`: correcto tras corregir la ruta inicial de lectura `rules` por `combatRules`. Modelo y casos conocidos incluidos; ningún archivo de contenido fue modificado. Ejecución sin navegador, red, base de datos o dependencias.
- Reproducción independiente mediante `subprocess.check_output` de ambos scripts, comparación de JSON completo y hashes de entradas: coincidencia exacta con los dos resultados guardados.
- Validación documental con `pathlib/json/re`: 24 fichas únicas y las mismas 24 incluidas exactamente una vez en la prioridad consolidada; 39 fuentes de repositorio existentes y seis referencias externas; enlaces locales comprobados y sin espacios finales en Markdown. No es un test de aplicación.
- `git diff --check`: correcto. Entre los archivos rastreados solo cambian `README.md` y `docs/DECISIONS.md`, junto a esta carpeta documental nueva todavía sin commit. No se tocan PRD, DESIGN, Word, aplicación, configuración, assets, partidas o servicios. Se retiró únicamente el bytecode generado por nuestra primera importación local; no se limpiaron archivos ajenos.

Resultados nuevos: carta concreta entre33, mediana23/P9075/P9598 aperturas; con conjunto hipotético de ocho,6/18/23. Ampliar hipotéticamente de33 a45 identidades sorteables lleva el P95 de completitud de211 a302 aperturas. Cuatro sabores actuales: mediana7/P9013/P9516 activaciones. Son escenarios matemáticos, no tiempos humanos, ingresos simulados ni reglas implementadas. Los datos crudos exactos quedan en `commerce-analysis.json`.

No se ejecutaron pruebas de app, build, tipos, PG/Redis, CI o recorridos gráficos en esta ampliación porque no hay cambios de producto. La aceptación de futuros recorridos y métricas adicionales se define en [COMMERCE-VALIDATION.md](COMMERCE-VALIDATION.md). Observación humana, dispositivo físico y evaluación de demanda siguen pendientes. Sin commit, push, publicación o despliegue.
