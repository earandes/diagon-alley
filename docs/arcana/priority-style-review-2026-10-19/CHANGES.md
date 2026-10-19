# Archivos y alcance de la corrección · A90

Código probado: `19f0b4fa1becad9f779b05c1936daeb86b544e07`. Baseline de revisión: `be7090303273ea0f32d7af678c2b282b21e3345d`.

## Presentación y pruebas

- `src/arcana/presentation/CollectionSources.tsx`
- `src/arcana/presentation/ExpeditionGuide.tsx`
- `src/arcana/presentation/ExpeditionIntentions.tsx`
- `src/arcana/presentation/ReadingPreferences.tsx`
- `src/arcana/presentation/collection-goal-messages.ts`
- `src/arcana/presentation/expedition-intentions.css`
- `src/arcana/presentation/priority-a89.css`
- `src/arcana/presentation/priority-messages.ts`
- `tests/browser-priorities/priorities-a89.spec.ts`
- `tests/domain/arcana/style-presentation-a90.test.ts`

## Documentación y evidencia

`DESIGN.md`, `docs/PRD.md` y `docs/DECISIONS.md` registran A90 sin reescribir A89. Esta carpeta conserva contrato, hallazgos, galería, resultados originales, fallo intermedio, fuentes y límites. El cierre documental posterior al candidato debe demostrar equivalencia de todos los objetos de código, herramientas, assets, configuración y fixtures históricas.

## Fuera del cambio

Dominio, aplicación, gateway, PostgreSQL/Redis, renderer, contenido, inventario, probabilidades, precios, premios, snapshots y operaciones no se modifican. No nuevas dependencias, assets de producción, relojes, efectos o audio. Los PNG nuevos son evidencia Linux seleccionada, no recursos de juego.

No merge a main, despliegue ni publicación.
