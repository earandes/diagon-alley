# A91 · Revisión integral del juego

19 octubre 2026 · **Análisis y propuestas, sin implementación.** Audita el árbol `4127d93e346fec2b16d75b63c8eca38f13fdaed1`, compartido por HEAD `753b2a1` y main `86d6a92`. PR12 se integró durante esta revisión por una acción externa a este trabajo. No se ha hecho merge, commit ni push en A91.

El juego tiene una identidad propia que conviene conservar. El siguiente salto de calidad consiste en **hacer visible un plan, mantener verdaderas las metas y presentar solo la información pertinente a cada decisión**. No necesita sustituir todas las pantallas ni añadir decoración constante.

## Lectura recomendada

1. [Informe y recomendación](REPORT.md).
2. [Dieciocho hallazgos consolidados](FINDINGS.md), registro canónico frente a los assessments.
3. [68 fichas de pantallas y estados](SCREENS.md) y [recorridos completos](FLOWS.md).
4. [Texto](COPY.md), [controles y CSS por componente](CONTROLS-STYLES.md), [gramática visual y controles](DESIGN-SYSTEM.md), [estudios de composición anotados](COMPOSITION-STUDIES.md), [assets](ASSETS.md), [movimiento y sonido](MOTION-AUDIO.md).
5. [Valor y métricas](BUSINESS-METRICS.md), [backlog](BACKLOG.md), [implementación propuesta](IMPLEMENTATION.md).
6. [Evidencia seleccionada](EVIDENCE.md), [validación y límites](VALIDATION.md).

## Datos reproducibles

[Baseline](baseline.json), [pantallas](screens.json), [hallazgos](findings.json), [arte](assets-inventory.json), [audio](audio-inventory.json), [marcado de controles](control-source-inventory.json), [detector sin modificar](detector.json). [Inventario por personaje](CATALOG-VISUALS.md).

Reproducir únicamente la inspección no gráfica de archivos y cabeceras:

```sh
python3 docs/arcana/whole-game-review-2026-10-19/tools/inventory.py
python3 docs/arcana/whole-game-review-2026-10-19/tools/surface_details.py
python3 docs/arcana/whole-game-review-2026-10-19/tools/check_docs.py
```

El primer comando actualiza los tres inventarios mecánicos; no ejecuta el juego. Las fichas y recomendaciones son análisis curado, no generadas por el detector. A/B independientes: [diseño](ASSESSMENT-A.md), [mecánico](ASSESSMENT-B.md).

No hay nuevas pruebas con personas, dispositivos, navegador, persistencia o rendimiento en esta fase. Las fuentes se etiquetan C/código, V/imagen inspeccionada, T/ejecución histórica, H/hipótesis, P/propuesta y N/no verificado. Inventariar una superficie no significa haberla jugado ni aprobado todos sus estados.

[Relación de archivos de esta entrega](FILES.md).
