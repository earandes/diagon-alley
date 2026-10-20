# Valor de producto y cómo comprobarlo

No hay nuevos datos de jugadores, conversión, retención, ingresos o satisfacción. Priorización cualitativa por perjuicio, alcance, certeza y dependencia; no RICE con números inventados ni ROI económico de un juego sin monetización autorizada.

## Cadena de valor

Acceso confiable → primera decisión comprensible → plan táctico visible → consecuencia reconocible → objetivo de colección viable → retorno voluntario. Cada mejora debe resolver un eslabón completo. Más tiempo, clics o aperturas no equivalen a más valor; pueden indicar espera, confusión o mala suerte.

| Oportunidad | Valor esperado, todavía hipótesis | Cambio mínimo | Señal válida / señal engañosa |
| --- | --- | --- | --- |
| Verdad del objetivo U01/U02 | Confianza y ausencia de repetición inútil | Progreso y orientación desde reglas/derechos | Totales/CTA correctos y explicación humana / más combates por promesa falsa |
| Recuperar U03–U05 | Continuidad ante errores reales | Acceso contextual, error localizado, cierre resiliente | Mismo propietario y tarea retomada / nueva cuenta que parece arreglar la pérdida |
| Plan visible U06–U08 | Menos memoria, mejor elección de ruta | Trazo/estandarte/puestos, fuente efectiva común | Predecir una bifurcación y explicar vínculo / abrir el libro sin entenderlo |
| Colección y stock U09–U11 | Encontrar una meta y preparar con colección amplia | Folio por niveles, índice/paginación, tarro acotado | Hallar fuente/copia y asignar sin errores / menos clics ocultando instancias |
| Iconos y Ajustes U12/U13/U18 | Reconocimiento y mantenimiento | Muestra puntual/índice/componentes mínimos | Tarea directa con fallback/foco / puntuación del detector más baja |
| Fluidez/audio U15–U17 | Ritmo y menor fatiga | Medir consumidor real y muestra temporal/escucha | Pares comparables y juicio voluntario / una captura o FPS favorable |

## Métricas existentes, sin inventar instrumentación

`src/arcana/application/measurement.ts` ya calcula observaciones offline tipadas por origen `fixture|technical|human`, propietario y cohorte. No captura runtime ni instala analítica. Pruebas existentes `tests/domain/arcana/measurement.test.ts`. Definiciones canónicas K1/K2/K3 y G1/G2 en `../product-roadmap-2026-10-19/METRICS.md`; lo allí marcado «propuesto» debe leerse junto a la implementación parcial de PM01 en `../priority-increment-2026-10-19/PM01-PM14.md`. No restaurar una instrumentación inexistente porque haya un evento definido.

| Indicador | Unidad y denominador | Qué puede aportar a esta revisión |
| --- | --- | --- |
| K1 activación inicial | Nuevos jugadores con primer estado cargado; primer desenlace utilizable durante sesión elegible | Señalar si entrada/preparación impiden jugar; derrota/empate también cuentan. Fallos antes de carga se informan aparte |
| K2 retorno24h–7d | Activados con168h completas de seguimiento permitido | Estudiar motivo de retorno; no se estima con esta auditoría ni con replays/fixtures. Separar retorno solicitado |
| K3 plan probado | Runs terminadas con intención elegible al inicio | Evento confirmado del plan, no botón, compra o asignación. Runs activas censuradas, abandonos elegibles no excluidos |
| G1 integridad | Casos adversos ejecutados con loss/duplication/cross-owner/unrecoverable | Cualquier defecto conocido bloquea el recorrido; cero en casos no acredita universalidad |
| G2 acción→utilizable | Episodios deliberados, P50/P95/extremos, errores/timeouts | No quitar red o anticipación del recorrido; rAF es un indicador distinto de GPU |

## Diagnósticos acotados para decisiones de diseño

1. **Objetivo coherente:** comprobación automática de igualdad Atlas/Cromodex para fixtures30/34/archivo y derechos de llave. No depende de personas para demostrar la contradicción.
2. **Fuente de un cromo:** tarea humana «encuentra cómo obtener una identidad que te interese». Informar n/N sin ayuda, tiempo activo/rango y dudas; temporal frente a propio debe explicarse sin sugerencia del moderador.
3. **Plan de equipo:** pedir elegir ruta y explicar qué espera del vínculo. Comparar predicción con log de su propia partida; repetición de copy no basta.
4. **Recuperación:** ensayo técnico de expiración antes/después de commit, seguido de tarea humana solo cuando sea seguro. Registrar continuidad de dueño/key/receipt; ningún correo/token en datos.
5. **Escala:** localizar copia entre30+ y preparar con30/100 tarros ficticios, declarados. Tiempo técnico puede medir respuesta; tiempo automatizado no es duración humana.
6. **Lectura:** identificar actor/objetivo/condición con pausa y sin ella, ES/EN/nombres largos. Aciertos humanos y problemas visuales separados de log correcto.

## Registro mínimo de la sesión posterior

Identificador de participante ficticio, versión/pack/idioma, objetivo entregado, inicio/fin/pausas, acción, ayuda solicitada, resultado, explicación espontánea y defecto reproducible. Consentimiento y seguimiento aparte; sin grabación por defecto. No almacenar correo, credenciales, tokens, semillas ni inventarios completos.

Cinco tareas breves: entrar/retomar; preparar un vínculo; elegir una rama; explicar un hecho del combate; encontrar una fuente y decidir cómo volver. No enseñar solución. Separar nivel de experiencia y necesidad de accesibilidad, sin inventar perfiles demográficos.

No fijar «80% de éxito» como prueba de diversión con un grupo pequeño. Mostrar n/N y casos; usar repetición cualitativa de la duda para decidir una corrección y volver a probarla. Una sesión breve no mide retención.

## Sostenibilidad técnica ya estudiada

PM14 existente, no repetido: fixture0/100/1.000/5.000 receipts set-team y colección constante, tres observaciones por escala/versión con PostgreSQL real. A5.000, mediana de comando1.544,34→22,88ms y5.027–5.029→26consultas tras append del sufijo inmutable bajo lock/transacción. Estado≈544KB; no cinco mil combates ni coste de proveedor. Lectura continúa creciendo y existen extremos peores después. No reabrir esta optimización sin consumidor que demuestre una nueva necesidad.

Esto refuerza la elección de proyecciones compartidas y consultas acotadas: U01/U02 no deben escanear todo el historial en cada render ni añadir un almacén de eventos paralelo. No borrar receipts para que la interfaz parezca rápida.
