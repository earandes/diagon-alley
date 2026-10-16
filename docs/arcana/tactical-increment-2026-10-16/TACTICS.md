# A65 · Decisiones tácticas y calibración

16 octubre 2026. Diseño y simulación de dominio; **no observaciones de jugadores**. Contenido cotejado con `trialConfiguration().campaign.tacticalContent`, `tactical-v1.json` y el builder integrado. Las simulaciones no modifican cuentas o partidas. La validación de navegador/servidor pertenece al informe y QA del coordinador.

## Experiencia y límites

La decisión buscada es «¿completo mi sinergia para recuperarme o gano iniciativa/daño para este rival?». Game Design Workshop estructura decisión/consecuencia; Agency Game Designer exige alternativas que cambien con el contexto; Economy Designer obliga a medir ingresos indirectos al variar victorias. Sus sugerencias de XP, monetización, pity o diarios no se adoptan. Game Design Skills Suite se reutilizará únicamente como diagnóstico de flujo a partir de los ingresos simulados, sin convertirlo en pronóstico de sesiones humanas.

La región, reglas, stats maestros de personajes, afinidades, equipo, precios, botín y coste de energía permanecen. Los nuevos rivales usan unidades reales del catálogo con sus estadísticas originales y un rival neutral heredado; no se inventan habilidades o inmunidades para vestir un retrato. El antiguo recluta `rune-weaver` tenía una definición de ensayo90PV/poder10/velocidad7 distinta de su catálogo80PV/poder12/velocidad8: las nuevas ofertas utilizan la definición del catálogo; las runs heredadas conservan el recluta anterior. No se afirma que esas dos instancias sean estadísticamente idénticas.

## Ofertas integradas

| Nodo estable | Dos candidatos | Decisión real disponible |
|---|---|---|
| pasaje:0:0 | rune-weaver / circe | Alquimia para llegar a tres / Fuego para llegar a dos |
| pasaje:1:0 | flamel / ember-keeper | Completar Alquimia / completar Fuego según la primera elección |
| pasaje:3:2 | rune-weaver / morgana | Curación al alcanzar tres Alquimia / iniciativa de Sombras desde uno |

Los nombres visibles se resuelven mediante el paquete, nunca desde el ID interno. Los candidatos son temporales. La oferta fijada y la elección confirmada deben pertenecer al snapshot de la run. No se obtiene otro candidato consultando o recargando.

El generador actual mantiene el primer Pacto y la capa temprana; tomar el cofre temprano obliga a pasar por el tercer Pacto antes de un combate. Esa rama permite Alquimia3 mediante dos rune-weaver, pero no garantiza Fuego2 desde una colección de una sola copia. El modelo no debe fingir ambos planes disponibles en todas las ramas. Se preserva el acceso a tres unidades y la decisión de ruta.

## Rivales integrados

| Familia | Composición y orden | Consecuencia real |
|---|---|---|
| Fuego | circe, ember-keeper, rival neutral heredado25PV | FuegoII activa quemadura2; prioriza recuperación o acabar amenazas pronto |
| Vanguardia | storm-caller, rune-weaver, rival neutral heredado25PV | SombrasI suma iniciativa2 al bando; el jugador puede disputar orden con Sombras/equipo |

Dos nodos por familia, mismos IDs de victoria y recompensas. Jefe permanece con tres rivales neutrales80PV/poder6/velocidad5 actuales. La mezcla de dos líderes y un rival heredado es explícita: no se atribuyen stats del catálogo al rival neutral.

### Experimento descartado

Tres personajes completos por rival hacían perder todos los tríos de prueba al60%PV. Se descarta esa presión para este incremento. Un líder y dos neutrales producía poca diferencia entre planes. Dos personajes más un neutral permiten diferencias medibles sin exigir una copia permanente rara.

### Caracterización inicial con el motor real

Aprendiz con varita+2 y escoba+3; restantes unidades sin equipo, todos nivel1. Mismo orden e IDs estables entre comparaciones. Sin grageas, no hay azar efectivo en estos combates: repetir semillas comprueba estabilidad, no añade diversidad estadística.

| Plan | Fuego: PV/vivos al terminar | Vanguardia: PV/vivos al terminar |
|---|---:|---:|
| Aprendiz+rune-weaver+flamel (AlquimiaIII) |189 /3|175 /2|
| Aprendiz+circe+ember-keeper (FuegoII) |175 /2|157 /2|
| Aprendiz+rune-weaver+morgana (SombrasI) |170 /2|173 /3|

Preferencia reversible: Alquimia conserva másPV y un integrante adicional frente a Fuego; Sombras preserva un integrante adicional frente a Vanguardia, aunque Alquimia acaba con2PVagregados más. Es un intercambio entre supervivientes y condición, no dominancia universal por todas las métricas. Con60%PV inicial, Alquimia conserva más salud en ambas familias. La recuperación cambia la elección. No son porcentajes de éxito humano ni una predicción mostrada en UI.

**Desempate:** el motor desempata iniciativa por ID lexical. La caracterización final usa `starter:apprentice` y los IDs `:choice:` reales del builder. Ensayos intermedios con IDs genéricos produjeron otras cifras; no se utilizan como aceptación final. Las copias permanentes de las colecciones declaradas tienen IDs de fixture estables, identificados en el script.

Los seis casos de `tests/domain/arcana/tactical-balance.test.ts` prueban stats intactos, preferencia Alquimia/Sombras por rival, contextos favorables para ambas alternativas de **cada uno de los tres Pactos** y valor del refugio. El primer Pacto cambia su preferencia según compañeros existentes. El segundo admite completar Fuego cuando la formación herida ya contiene Fuego. El tercero favorece iniciativa con salud plena y AlquimiaIII con heridas. Son caracterizaciones técnicas posteriores al builder, no evidencia de TDD anterior a esa implementación.

## Referencia y comparación de rutas

`evidence/trial-before.json` es copia byte por byte del JSON de HEAD antes del incremento. `tools/arcana/simulate-tactics.mjs` importa el motor y generador puros actuales, nunca abre DB/API. Conserva la configuración anterior como entrada ejecutable.

Resultado candidato inicial: semillas0–127,1171 caminos legales por política, colección inicial y salud plena. Política reclutar hasta5, preferencia declarada, refugioPV, pasar encuentros, sin compras/grageas.

| Contenido / preferencia | Finales ganados / caminos | Monedas primeras medias |
|---|---:|---:|
| Heredado |1171/1171|85,34|
| Nuevo / Alquimia |830/1171|67,14|
| Nuevo / Fuego |727/1171|59,21|
| Nuevo / Sombras |818/1171|65,82|

Cero rechazos de formación en esos escenarios. Cada camino pesa igual; esto **no representa frecuencia real de elección ni tasa de victoria de personas**. Las rutas que encadenan duelos sin curarse pueden perder. Los ingresos bajan aunque premios y precios se conserven; se registra como consecuencia material del contenido, no se compensa automáticamente.

## Simulación final integrada

`evidence/tactical-model.json`:128semillas de ruta,1171caminos por fila,3colecciones ×4políticas ×2condiciones ×2contenidos ×4modos =224.832evaluaciones de ruta. Los cuatro modos separan primeras/repetidas y sin/con una gragea ganada por combate.36caracterizaciones ×128semillas =4608combates aislados de contraste. No se suman esos casos como sesiones o jugadores.

Colecciones declaradas: aprendiz solo; aprendiz+circe+ember-keeper; tres copias del aprendiz. Solo la primera unidad lleva el equipo concedido+2/+3; no se inventa equipo extra para las demás. La condición60% es una fixture adversa; las nuevas expediciones ordinarias comienzan con salud plena. La política `threat` conoce el siguiente duelo del camino enumerado, elige Alquimia bajo75%PVagregado y de otro modo Fuego/Sombras ante Vanguardia: es una referencia con conocimiento del camino, no una recomendación de UI ni predictor de victoria.

| Escenario inicial | Alquimia | Fuego | Sombras | Preparación por amenaza |
|---|---:|---:|---:|---:|
| Sin grageas, primera: rutas ganadas /1171 |830|727|818|831|
| Sin grageas, repetida: monedas medias |14,52|13,53|14,35|14,55|
| Con gragea ganada, primera: rutas ganadas |813|742|809|814|
| Con gragea ganada, repetida: rutas ganadas |817|735|809|813|

Las grageas **no son una mejora garantizada**: jabón/tierra pueden perjudicar. La política simplificada de gastar una en el primer integrante vivo no resulta óptima en todos los casos. La comparación conserva sus pesos/efectos y no recomienda comprar automáticamente.

Colección desarrollada, salud plena:1168/1171rutas ganadas en las cuatro políticas; tres copias del aprendiz1168–1169. Las diferencias disminuyen al tener cinco integrantes: es un límite concreto de la presión táctica actual, no una razón para subir stats silenciosamente o prometer diversidad ilimitada.

### Viabilidad y recuperación adversa

Con kit inicial y salud plena, **cada una de128semillas tiene al menos un camino ganador en cada política modelada**. Eso demuestra una ruta viable en esta muestra, no que una persona vaya a identificarla o que cualquier rama se pueda recuperar.

`evidence/route-recovery.json`:390/1171caminos no pasan por refugio;170evitan los duelos ordinarios; se pueden encadenar hasta5combates sin refugio. Por ello no se dice «siempre puedes curarte». El grafo conserva elecciones y restricciones originales; no se rerutea automáticamente una mala decisión.

Con aprendiz al60%PV, la política por amenaza no encuentra camino ganador en semilla49; Alquimia/Fuego/Sombras sí encuentran alguno en128/128. Es una condición sintética desfavorable, no una partida inicial nueva. No se añade compensación o curación para ocultarla.

### Impacto económico indirecto

La media de monedas de repetición del contenido heredado es16,51 por camino; Alquimia nueva14,52. Primera victoria pasa de85,34 a67,14. Mismos precios/premios, menos victorias en los caminos más agresivos. No modela duración, decisiones de personas, primeras victorias mezcladas, compras o bóveda.

`tools/arcana/project-tactical-economy.py` reutiliza el helper de Game Design Skills Suite en `evidence/tactical-economy.json`.90intentos con ingreso fijo igual a la media repetida y cesta deseada10 muestran saldo final636,04heredado frente457,04Alquimia nueva; cesta15 con políticaFuego produce demanda sin financiar82,35. Son sensibilidades que mantienen una media fija: **no90días ni pronóstico de jugadores**, no compras ejecutadas ni ajuste autorizado de precios. Colección creciente, equipo nuevo y stock trasladado entre runs quedan fuera.

## Qué sigue siendo hipótesis

Que las siluetas permitan reconocer estas amenazas; que el jugador encuentre la elección interesante; que prefiera repetir para probar otro plan. Los modelos solo prueban diferencias aritméticas bajo condiciones declaradas. El orden de unidades influye porque los ataques apuntan al primer rival vivo; no se atribuye selección inteligente de objetivos al motor.

## Repetir y estado de validación

Revisión adversa posterior del backend: `tests/integration/arcana/tactical-http.test.ts`,6/6 con PostgreSQL/Redis reales y API Fastify compuesta. Comprueba autenticación, campos adicionales rechazados, intención desde run activa/origen antiguo, elección obligatoria del Pacto, rechazo de candidato ajeno y alternativa nueva sobre run heredada, carreras, rollback antes del COMMIT, pérdida de respuesta después del COMMIT, recuperación con cliente tipado, conflicto de clave y cancelación durable sin cambios económicos. Evidencia `tactical-http-review.txt`, tipos `tactical-http-types.txt`. Usa fixtures de transporte/reglas declaradas, no el balance de campaña. Un hallazgo de revisión sobre sinergias previas tras derrota se remitió al responsable de intenciones para su corrección y pruebas; no se modifica producción desde esta revisión.

```sh
node tools/arcana/simulate-tactics.mjs --output docs/arcana/tactical-increment-2026-10-16/evidence/tactical-model.json
node tools/arcana/inspect-tactical-recovery.mjs > docs/arcana/tactical-increment-2026-10-16/evidence/route-recovery.json
python3 tools/arcana/project-tactical-economy.py > docs/arcana/tactical-increment-2026-10-16/evidence/tactical-economy.json
npx --no-install vitest run tests/domain/arcana/tactical-balance.test.ts
npm run typecheck
```

Ejecutados los cinco comandos anteriores.6/6tests y tipos correctos, logs `tactical-balance-tests.txt` y `tactical-model-types.txt`. `candidate-model.json` conserva el experimento preliminar, no prevalece sobre el modelo final integrado. El JSON final conserva hashes de entradas y la referencia anterior. UI, SQL/Redis, idempotencia y rendimiento no se validan mediante este modelo: consultar QA del incremento. Comprensión y diversión necesitan la sesión humana posterior.
