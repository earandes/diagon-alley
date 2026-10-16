# A67 · Especializaciones de equipo

## Diagnóstico y contrato previo

Hecho comprobado: las nueve recetas V1 tienen tres núcleos con el mismo precio y bonificación por madera; dragón ×1,2 domina a fénix ×1,15 y wyvern ×1,1. El equipo histórico guarda sus valores por instancia. La bóveda guarda su propia tabla V1, independiente del taller.

Experiencia: escoger entre terminar antes, actuar antes o resistir varios turnos. Cada núcleo conserva el objeto y su ilustración existentes, con datos accesibles fuera del arte. No se promete victoria.

Diseño inicial a calibrar con mismas semillas: Taller V2 con nueve recetas y precios originales por madera (15/20/25). Dragón conserva ×1,2; wyvern ×1 y +3 iniciativa; fénix ×1 y cura 2 PV al empezar su turno, sin revivir y hasta el máximo. El coste de oportunidad es renunciar al multiplicador de daño. La curación opera solo durante combate y permanece en condición final confirmada.

Campos opcionales de varita: `initiativeBonus`, `healing`; campos opcionales congelados de unidad: `wandInitiativeBonus`, `wandHealing`. Ausencia equivale a cero y no se añade a snapshots históricos. Evento `healed` identifica fuente `equipment`, reutilizando reproducción de curación. El núcleo de combate conserva sus reglas maestras y ninguna estadística de personaje cambia.

Compatibilidad: configurar catálogo de forja V2 separado, conservar tabla de bóveda/kit V1. Las instancias V1 no se reinterpretan por núcleo. Una consulta obsoleta V1 exige reconfirmar catálogo V2. Reintentos de operaciones V1 confirmadas recuperan el receipt anterior antes de validar catálogo. No se alteran derechos a premios, precios, pesos, energía ni RNG.

Aceptación: forja V2 atómica y recuperable, V1 inmutable, bonos compartidos en preparación/combate, cada especialización conveniente en escenarios declarados, cancelación sin gasto, ES/EN y ambos packs, ausencia de arte sin pérdida de controles. Validación técnica y límites se añadirán después de ejecutar.

## Selección calibrada

Implementado: dragón ×1,2; fénix ×1 y 2 PV/turno; wyvern ×1 y +3 iniciativa. Mantiene los nueve IDs y cada precio original. Es un balance de ensayo, no validación humana.

Se compararon los mismos 3.600 escenarios declarados y semillas 1–8 en tres pares. Cada par implica 86.400 combates. Equipo: líder de catálogo + las primeras dos identidades distintas del líder, rivales: tres copias de una identidad de catálogo, condición inicial 100%/50%, sin/con una gragea en el primer integrante. Todos llevan la misma varita de Abedul candidata; el objeto tiene el coste real, pero la fixture no simula su adquisición ni representa una colección inicial. Comparación lexicográfica: más victorias y, en igualdad, más PV restantes. Derrotas iguales/empates se excluyen; no se declara preferible perder antes.

| Variante | Fénix PV/turno | Wyvern iniciativa | Dragón mejor | Fénix mejor | Wyvern mejor |
|---|---:|---:|---:|---:|---:|
| Conservadora |1|2|1973|42|161|
| Elegida |2|3|1563|244|359|
| Generosa |3|4|1214|636|370|

La conservadora da pocas situaciones distintas al sostenimiento. La elegida abre casos comprobables para ambos núcleos alternativos conservando una renuncia clara al daño y menor curación que Alquimia (3 PV/turno). La generosa acerca una sola varita al valor individual del bono de tres alquimistas; no se adopta antes de observar la recuperación acumulada durante ruta. Los recuentos dependen del barrido: no son preferencias de jugadores ni una distribución real de encuentros.

La elegida se amplió a semillas 1–32: **345.600 combates**, 3.600 escenarios. Dragón estrictamente mejor1560, fénix247, wyvern373; el resto son empates o derrotas sin una ventaja útil. Sin gragea no existe azar de combate: repetir semillas en esos casos comprueba estabilidad, no añade muestras independientes.

Testigos reproducibles del barrido ampliado:
- Flamel + Aprendiz + Merlín, condición50%, rival3×Flamel, sin gragea: dragón32/32victorias; alternativas0/32.
- Mismo equipo50%, rival3×Copper Sage, con gragea: fénix32/32, dragón21/32, wyvern8/32. Fénix tarda12,375rondas medias frente10,031del dragón y conserva55,5PV frente35,891.
- Mismo equipo50%, rival3×Mist Seer, con gragea: wyvern8/32victorias; dragón/fénix0/32. Es una fixture adversa, no una exigencia productiva de personaje raro.

Fuente completa y testigos: `equipment-simulation.json`; sensibilidad: `equipment-simulation-conservative.json`, `equipment-simulation-selected-paired.json`, `equipment-simulation-generous.json`. Reproducir con `node tools/arcana/simulate-equipment-a67.mjs`; controles `A67_HEALING`, `A67_INITIATIVE`, `A67_EQUIPMENT_SEEDS`, `A67_EQUIPMENT_SUFFIX` no escriben configuración del juego.

## Interacción y recursos

En Taller los objetos/maderas/núcleos existentes siguen siendo controles. El resultado consultado lleva multiplicador, iniciativa o recuperación exactos antes de pagar. La compra confirma precio/versionado explícitos. En preparación, la varita lleva el núcleo ilustrado, distinguiendo piezas de la misma madera. El inspector muestra poder, iniciativa y PV/turno antes→después usando `equipmentInitiative`, `equipmentSpellPower` y la proyección de instancia; no una fórmula paralela de combate ni pronóstico de victoria. Equipar guarda, consultar no cura. En run histórica un aviso indica que el efecto nuevo comienza en la siguiente expedición.

No hay assets nuevos. Se reutilizan `product.wand-birch/willow/elder` y `product.core-dragon/phoenix/wyvern` de los manifests de ambos packs (raster640×640alpha y fuentes/procedencia históricas conservadas); consumidor `EquipmentArt` del taller y preparación. La superposición de núcleo de28×32px utiliza el mismo recurso que el taller. Criterio: distinguir el núcleo sin deformación, texto fuera de bitmap y control operable con asset ausente. No se vuelven a generar ilustraciones ni se atribuye una licencia nueva.

Movimiento: no se añade loop ni partícula. Equipar reutiliza confirmación postreceipt; curación se reproduce por evento `healed` con delta/PV locales y fuente `equipment`. La unidad caída no actúa ni revive, la curación se limita al máximo y ocurre tras quemadura y Alquimia al comenzar su turno. Reducido conserva el mismo resultado estático, no una simulación alternativa.

## Verificación ejecutada del subrecorrido

- `npx --no-install vitest run tests/domain/arcana/equipment-specialization-a67.test.ts tests/domain/arcana/commerce.test.ts tests/domain/arcana/combat-engine.test.ts tests/domain/arcana/contextual-preparation.test.ts`:44/44correctos.
- `npx --no-install vitest run --config vitest.integration.config.ts tests/integration/arcana/equipment-specialization-postgres.test.ts`:3/3correctos con PostgreSQL real; respuesta perdida después de COMMIT, recuperación sin consultar configuración viva, última compra concurrente, fallo antes de COMMIT y cotización V1obsoleta. Sin Redis implicado en esta operación de forja; la suite general cubre autoridad de reloj/API por separado.
- Unitarios: precios/IDs conservados, instancias V1 intactas, máximos/no resurrección, fuente de curación, iniciativa compartida, snapshots, rechazo de efectos inválidos, recambio/retirada sin dejar efectos residuales, condición inalterada al consultar y efectos V2 excluidos de run histórica.
- DetectorImpeccable sobre presentación modificada:sin hallazgos; `equipment-design-detect.json`.
- Simulaciones anteriores ejecutadas offline: no abren cuentas, no alteran saldos. Seed fijo, PRNG compartido y mismos escenarios entre candidatos.

Los recorridos visuales, idiomas/packs, tamaños y regresión global los integra la validación coordinada del incremento; no se atribuyen a estos unitarios ni al detector. La comprensión, diversión, gusto por una especialización y efecto de recuperación sobre decisiones humanas permanecen hipótesis.
