# Prioridad consolidada · PM01–PM24

Revisión 19-10-2026 tras analizar cromos, ranas, grageas, varitas, Gringotts y nuevas tiendas. Esta es **la única lista vigente de prioridad** del estudio. Las fichas conservan su alcance; sus prioridades iniciales quedan como antecedente y no prevalecen sobre esta tabla. [README-INITIAL.md](README-INITIAL.md) conserva el primer orden.

## Criterio y decisión

Orden experto por valor de decisión, evidencia de necesidad, alcance transversal, reversibilidad, riesgo económico y dependencia. No hay datos de alcance/retención para fabricar RICE o ROI. P0 es habilitador/integridad, P1 siguiente valor jugable, P2 condicionado a señales y P3 expansión/reglas de mayor riesgo. Las filas ordenan el trabajo de producto; PM15 es un **gate independiente de piloto remoto**, no el último requisito para jugar localmente.

Esfuerzo orientativo para una persona con repositorio conocido, incluyendo diseño+implementación+QA técnico: S 2–4, M 5–9, L 10–18, XL 19–30 jornadas. No incluye esperas de CI, reclutamiento o aprobación de economía; no son fechas comprometidas. Primero muestras pequeñas; los bloques no se suman en una fecha de lanzamiento.

| Orden | ID | Resultado/valor prioritario | Prioridad / esfuerzo | Dependencia o decisión para implementar |
| ---: | --- | --- | --- | --- |
| 1 | PM01 | Medición mínima para distinguir confusión, uso y fallos | P0 / M | Empezar manual/contrato; no proveedor externo obligatorio |
| 2 | PM14 | Medir crecimiento de partida/receipts y corregir solo causas demostradas | P0 investigar / L si se justifica | Antes de añadir consultas intensivas o historial. No borrar operaciones |
| 3 | PM02 | Llegar del kit inicial al primer combate tomando una decisión propia | P1 / M | Ayuda contextual sobre reglas actuales, sin tutorial paralelo |
| 4 | PM03 | Llevar intención de casa/grupo desde preparación hasta acción comprobada | P1 / M | Disponibilidad real, Pactos y snapshots; sin regalos |
| 5 | PM06 | Entender dos hechos del combate y qué revisar al continuar | P1 / M | BattleLog confirmado; no explicación causal ficticia |
| 6 | PM11 | Legibilidad configurable a lo largo de todos los recorridos | P1 transversal / M | Acompaña al trabajo anterior, no espera a la fila 6 |
| 7 | PM05 | Cromodex: marcar qué busco y localizar una fuente real | **P1, sube de P2** / M | Metadatos públicos y propiedad vs temporal. Base de colección con propósito |
| 8 | PM18 | Forjar para un portador y comparar renuncias antes de gastar | P1 / M | Reutilizar reglas/previews actuales; no nuevas varitas por defecto |
| 9 | PM19 | Entender riesgo de gragea, asignarla y reconocer el sabor real | P1 / M | Reutilizar libro/bolsa/activaciones, no elegir sabor inexistente |
| 10 | PM10 | Elegir una solución a excedentes y cola mediante escenarios | **P1 investigación, sube de P2** / L–XL con implementación | La investigación empieza junto a PM05; canje/dirigido no autorizados. PM22 es alternativa, no acumulación |
| 11 | PM04 | Recordar hasta tres formaciones sin repetir reconstrucción | P2 / M | Instancias/orden; sin autoequipar, consumir o guardar temporales como propios |
| 12 | PM17 | Abrir otra rana ya poseída sin viajes o compras accidentales | P2 / M | Confirmar fricción; un comando deliberado por unidad, no lote económico |
| 13 | PM16 | Capítulos de descubrimiento y uso, con cierre finito | P2 / M–L | PM03/05/06, predicados compartidos PM08; folios sin potencia o premios |
| 14 | PM20 | Gringotts continúa orientando después de gastar la llave | P2 / M | Receipt y uso del botín; no fabricar otro derecho de apertura |
| 15 | PM08 | Dominio voluntario de la región con objetivos viables | P2 / L | PM03/06/16, desafíos actuales conservados. Un único sistema |
| 16 | PM21 | Muestra de librería como lugar para los tomos de dominio | P2 condicional / S–M muestra, L tienda | Primero probar libro existente. No sumar otro backlog de objetivos a PM08/16 |
| 17 | PM09 | Un encuentro cuya renuncia cambia una decisión posterior | P2 / L | Versionado, condición y efecto existente, sin farmeo |
| 18 | PM07 | Diario breve para retomar y contrastar planes | P2 / L | PM14/06; no añadir todo el historial al render |
| 19 | PM22 | Estudio de rana temática como alternativa de obtención dirigida | P2 condicional / L–XL | Decisión PM10, tabla/precio/producto aprobados antes; comparar colas y dominancia |
| 20 | PM23 | Sabor conocido como preparación con coste de oportunidad | P3 condicional / XL | PM19 y estudio económico; no botica antes de una receta útil y equilibrada |
| 21 | PM24 | Elección entre paquetes de bóveda en contrato futuro | P3 condicional / L–XL | Derecho/versionado/fuente de llave resueltos; no rehacer premios históricos |
| 22 | PM12 | Navidad sobre una región ya entretenida | P3 / L | Aprendizaje de Halloween, contenido/presentación propios, sin urgencia |
| 23 | PM13 | Segunda región con identidad táctica propia | P3 / XL | Validar decisiones/cola y capacidad de producción; no ampliar por volumen |
| Gate remoto | PM15 | Piloto privado recuperable, coste/backup/correo/HTTPS viables | P0 antes de piloto externo / L | Puede avanzar aparte cuando se autorice infraestructura. No publicación por este estudio |

## Qué cambia respecto al primer estudio

Se conservan PM02→PM03→PM06 como base de comprensión. **PM05 y el estudio PM10 suben**: ahora hay más evidencia matemática de dilución/cola y una oportunidad concreta de conectar colección con preparación. PM18/19 aportan valor sin tocar economía y se colocan antes de producir más contenido. PM17 mejora comodidad, no profundidad, por eso no desplaza decisiones. PM16/20 dan metas/continuidad finitas. La librería va después de probar sus ejercicios, y botica/ranas dirigidas/bóveda a elección quedan condicionadas a reglas nuevas.

No se relegan integridad o accesibilidad por su posición en una tabla. PM14 se implementa solo si mediciones lo justifican; PM01 puede empezar manual y no exige construir telemetría para entregar cada mejora. La ausencia de usuarios aún no bloquea diseño/técnica, pero impide afirmar impacto en retorno o diversión.

## Próximos incrementos completos recomendados

1. **Entender y elegir:** PM02→PM03→PM06, con PM11 necesario y medición manual PM01. No una megaPR: cada recorrido termina operable.
2. **Coleccionar para un plan:** PM05 → PM18 → PM19, en ese orden por subrecorridos. Resultado: localizar una fuente, decidir una varita sin compras accidentales, asumir o evitar riesgo de gragea y reconocer el efecto. **Este es el siguiente bloque de ampliación recomendado por este estudio**, conservando el orden previo si todavía falta implementarlo.
3. **Metas finitas y continuidad:** PM16/PM08 como contrato único; PM17/PM20 solo si resuelven fricción observada. Muestra de PM21 sobre libro existente, sin producir una calle nueva.
4. **Una decisión económica:** PM10 compara políticas incluyendo PM22; seleccionar una o ninguna. PM23/24 requieren otra decisión material explícita. No tomar las fichas por permiso para cambiarlas todas.

No hay orden de construir seis tiendas. Rechazar cualquier nueva fachada que pueda sustituirse por un objeto actual con igual valor. La sensación incremental debe proceder de metas, opciones y consecuencias; abrir locales o alargar probabilidades no la garantiza.
