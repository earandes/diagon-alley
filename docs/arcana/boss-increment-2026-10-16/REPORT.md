# A70 · El último duelo

16octubre2026. **Implementado en rama, validación gráfica pendiente.** No integrado en main ni desplegado. [Contrato y plan vivo](CONTRACT.md).

## Qué puede hacer el jugador

Consultar la formación real del jefe desde su snapshot, reconocer su figura/nombre y afinidades, preparar con los accesos existentes, cancelar sin gasto y confirmar el duelo. La arena identifica al protagonista real; para circe, Hermione/Circe utiliza el libro/cuenco ya ilustrado como foco físico del hechizo guardado. Cuerpo sigue siendo raster plano: no se presenta como rig anatómico.

El cierre muestra un adversario que participó y conserva resultado→botín→acción contextual. Después ofrece hasta2hechos propios consultables desde el log, sin atribuirles la victoria. Uso de llave/rana y elección de intención/nueva run siguen requiriendo acciones explícitas. No cambia estadísticas, composición, reglas, economía, autoridad o persistencia.

## Diseño y producción

Se eligió figura existente+objeto articulado frente a transformar solo el retrato o reconstruir anatomía oculta. [Recorrido e hipótesis](JOURNEY.md), [guion de movimiento](MOTION.md), [fuentes y medidas de arte](ASSETS.md). Cuatro crops WebP,13.124B combinados y88.196B RGBA8 geométricos, más fuentes editables y exportador CPU. La inspección CPU no acredita movimiento ni acabado aceptado por el propietario.

## Estado técnico

- Tipos,542unitarios y77integraciones PostgreSQL/Redis locales correctos.
- Build/content/scan correctos; artefacto dual14.694.226B, aviso conocido de chunk>500kB.
- Preflight permitió el host, pero no se ejecutó navegador localA70.
- CI Linux, capturas seleccionadas, rendimiento y recorridos gráficos todavía pendientes. [Plan y límites QA](QA.md).

Main anteriorf5d3a89 está validado enCI38964171860; no se presenta como prueba deA70. El incremento se entrega mediante rama/PR de validación, conservando main hasta autorización posterior. Observación humana, dispositivo físico y lector hablado pendientes.
