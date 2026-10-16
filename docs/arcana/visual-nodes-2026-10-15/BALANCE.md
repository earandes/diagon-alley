# A56 · Exposición de rutas y propuestas pendientes

No se editan precios, tablas de probabilidades, recompensas base, estadísticas, datos SQL de jugadores existentes ni Word. [Comparación SHA256 con A55](economy-persistence-reference.json). Sí cambia qué eventos se pueden elegir en una nueva expedición y aparecen decisiones; eso puede cambiar el ritmo y debe calibrarse.

Simulación reproducible con reglas reales de grafo, 1000 semillas por topología y política; 6000 recorridos sintéticos. [Datos completos y límites](route-scenarios.json). Ejecutar `ARCANA_ROUTE_REPORT=docs/arcana/visual-nodes-2026-10-15/route-scenarios.json npx vitest run tests/domain/arcana/route-scenarios.test.ts`. Sin conexión/escritura a partidas. «Aleatoria» y prioridades estáticas reclutan antes si tienen menos de tres miembros; no modelan dudas de una persona.

| Política | Grafo | Duelos medios antes del jefe | Esencia media total | Coronas primer recorrido | Coronas con combates ya ganados |
|---|---|---:|---:|---:|---:|
| Aleatoria | Fijo de referencia | 1,28 | 11,42 | 84,76 | 16,64 |
| Aleatoria | Variable v1 | 1,36 | 11,81 | 86,03 | 16,54 |
| Priorizar botín | Fijo de referencia | 0 | 5 | 70 | 25 |
| Priorizar botín | Variable v1 | 0,83 | 9,13 | 79,03 | 19,18 |
| Priorizar combate | Fijo de referencia | 4 | 25 | 130 | 13 |
| Priorizar combate | Variable v1 | 1,97 | 14,83 | 97,88 | 17,51 |

Supone ganar todos los combates elegibles y usa valor esperado de Coronas de Encuentros. Excluye PV/PM, equipo, tiempo, derrotas y consumo de productos. No estima duración real de sesión, tasa de victoria o retención. Las cifras incluyen premio de jefe cuando se alcanza. No prueban balance con usuarios.

Lectura: la topología reduce la ruta de cuatro duelos forzados por una prioridad extrema y dificulta la estrategia de recoger siempre dos cofres sin duelo. La media aleatoria cambia poco. Las diferencias merecen observación; no justifican tocar costes automáticamente.

Pendiente:
- Medir si PV o PM ofrece una decisión real. PM al40% reutiliza la escala actual del Refugio PV, es hipótesis de ensayo; comparar restauración absoluta,20%/40%/60% solo en simulación posterior con combates completos, sin aplicar otros valores ahora.
- Encuentro arriesgar/pasar conserva pesos/efectos originales. Registrar cuándo pasar resulta útil; no añadir costes o premios para forzar su uso.
- Pacto a equipo lleno protege copias propias; reemplazar temporal puede equivaler a recuperar recursos. Evaluar frecuencia e impacto antes de añadir límites, precios o pools.
- Confirmar con sesión humana que los assets se reconocen sin etiquetas y que cada bifurcación ofrece una motivación. No hay nueva observación A53 completada.
- Regiones futuras con adversarios y complejidad propios: dirección A55; pools, curvas y campañas aún no implementados.
