# Cobertura del análisis

18 octubre 2026. Baseline `fd4739c76b6e497b62344a07e4b2c8d7183c595e`.

Ejecutado:

- Inspección de configuración, catálogo, mapeo de30personajes Diagon, tipos/umbrales, motor, contratos de preparación/HUD/pasivos y fuentes de apertura/replay.
- Consulta de fuentes oficiales de Harry Potter enlazadas en REPORT; ficha de Hannah no accesible, casa de Moody/Kingsley no verificada aquí.
- Inspección de dos PNG históricos seleccionados, sin crear nuevas capturas: antesala móvil A71 y mapa A60. No prueban movimiento ni sustituyen una captura actual.
- `python3 docs/arcana/traits-synergies-study-2026-10-18/model.py`: correcto. Cálculos exactos y enumeración; no simulación del motor.
- Segunda ejecución con `runpy.run_path`, salida capturada: hashes de `CATALOG.md` y `model-results.json` idénticos.
- Comprobación independiente del límite superior/inferior de los cuantiles geométricos para una identidad de29; cobertura30 IDs; combinaciones de doble activación acotadas por sus grupos; medianas de variantes693/139/69; enlaces locales válidos: correcto.
- `git diff --check`: correcto.

No ejecutado ni afirmado:

- Nuevos efectos en combates, comparación de victorias, balance o economía de ingresos con los tipos propuestos.
- Pruebas de aplicación, build, PostgreSQL/Redis o navegador: aplicación y esquemas no modificados.
- Producción de assets, grabaciones, rendimiento, CI, commit/push/integración.
- Comprensión, diversión, retención o pruebas en dispositivo físico.

La enumeración toma equipos de cinco identidades únicas, no todas las combinaciones de instancias/equipo. El modelo de acceso excluye Pactos y parte del starter Harry. Los escenarios de variante usan independencia hipotética por apertura; no son probabilidades vigentes. Los números de efectos y presupuestos visuales son candidatos de diseño sin medición.

Archivos de esta entrega: REPORT.md, CATALOG.md, model.py, model-results.json, VALIDATION.md y entrada de propuesta pendiente en docs/DECISIONS.md. PRD, Word, código, configuración, reglas y partidas permanecen intactos.
