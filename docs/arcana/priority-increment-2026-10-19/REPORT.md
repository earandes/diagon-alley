# A89 · Coleccionar para un plan

Entrega en revisión mediante PR12, rama `feature/roadmap-priorities-a89`. Main no se integra ni se despliega. Autorización, baseline y aceptación en CONTRACT; estado de cada ciclo en PLAN. Este informe se cierra con el resultado real de CI, sin convertir fixtures o automatizaciones en personas.

## Qué cambia para el jugador

El mapa ofrece una orientación plegable que identifica el impedimento real y permite consultar el siguiente Pacto o preparar, sin elegir ruta por la persona. Tras una expedición puede elegir una compañía concreta viable, además de las intenciones anteriores. La elección no equipa ni da premio; el registro confirmado de la siguiente expedición acredita si llegó a activarse.

Al terminar u omitir un combate puede abrir el libro y consultar hasta dos hechos propios: una activación, curación aplicada, absorción o gragea, priorizando el plan de esa expedición. Los hechos no atribuyen la victoria a una causa no demostrada. Histórico y replay conservan resultado, consumo y premios.

Cromodex permite seguir una identidad y consultar su fuente real, separando copia propia de aliado temporal y acabado. Una copia nueva satisface la meta; mirar una carta o reclutar no. La probabilidad procede de la tabla, no del marcapáginas. El taller compara una receta con el equipo de una copia concreta, mostrando daño, iniciativa y recuperación; elegir referencia, forjar y equipar siguen siendo acciones diferentes. El tarro explica la incertidumbre y el riesgo sin revelar el próximo sabor; asignar o quitar continúa siendo un borrador.

Lectura en Ajustes permite ampliar texto y aumentar contraste de UI sin filtrar las ilustraciones, con preferencias del sistema separadas. Meta de colección, plegado y lectura son preferencias de este navegador por propietario; no se promete sincronizarlas entre dispositivos. Colección, inventario, expedición, intención y operaciones siguen en la autoridad existente.

## Integridad y sostenibilidad

No hay precios, probabilidades, premios, estadísticas, fórmulas, composiciones o Esencia nuevos. Tampoco assets, audio, dependencias o migración de esquema. `unchanged-contracts.json` conserva objetos Git de motor/contenido/arte/economía/dependencias/workflow. Las reglas vigentes y snapshots históricos permanecen diferenciados.

El diagnóstico PostgreSQL confirmó coste creciente al borrar y reinsertar todo el historial en cada comando. Se conserva el historial inmutable y se añade solo el sufijo, bajo el lock y la transacción existentes. En la fixture de5.000 operaciones, tres observaciones por versión: mediana de comando1.544,34→22,88ms y5.027–5.029→26consultas. No se ha acelerado universalmente la lectura: esta continúa creciendo con el historial, y se conservan extremos desfavorables. Véase PM01-PM14 y JSON crudos.

La medición mínima es un calculador offline de K1/K2/K3/G1/G2 con deduplicación, denominadores, cobertura y censura, sin proveedor o captura runtime. No hay datos humanos ni retención fabricada. HUMAN-SESSION prepara su futura observación.

## Estudio económico, sin nuevas reglas

PM10/22 conserva81.000casos de sensibilidad,384rutas generadas, semillas/inputs versionados, colas/censura, sensibilidad de ingresos/gastos y nueve hashes de fuentes activas. Los resultados de combate son supuestos declarados, no partidas simuladas del motor ni comportamiento humano. Las interrupciones reanudan la misma run; `RUN_ACTIVE` impide reiniciar para repetir un cofre.

La referencia exacta para las33 identidades obtenibles por rana es128/188/211aperturas P50/P90/P95 desde el aprendiz. No son horas ni garantía de completitud finita. Un canje5:1 hipotético reduce mucho toda la duración; ahorrar para tres identidades dirigidas puede mejorar la cola y empeorar la mediana con ingresos adversos. Una rana de ocho identidades no elimina la cola general. Se recomienda conservar reglas en este incremento y estudiar una única obtención dirigida acotada más adelante, con aprobación exacta de acceso/coste/alcance; ningún ratio, precio o producto nuevo queda elegido.

## Validación y cobertura

Build/tipos/skin y749unitarias correctos en el candidato previo a CI3;120integración PostgreSQL/Redis correctas localmente y en las fases no gráficas anteriores de CI. Los fallos de fixture inicial, copy obsoleta del test y selección de compañía se conservan con su corrección y evidencia; no se atribuye éxito a repetir sin cambio. CI3 y SHA/checkout se completan en QA.

Las pruebas nuevas separan componentes sobre fixtures, contratos HTTP/PG y una cohorte conectada en App con invitado aislado. No existe una sola prueba humana o un E2E que fuerce todos los resultados. La continuidad de jefe/botín/nueva expedición se contrasta con A63/A73; compañía v2 se acredita por capas UI y HTTP/PG. Las cinco capturas finales serán seleccionadas en Linux; una imagen no valida animación. Rendimiento y sus límites están en PERFORMANCE.

## Conservado y pendiente

Se conservan Teatro de alquimia, personajes y objetos, ES/EN y ambos paquetes, foco, toque semántico, reducido, pausa,2x, omisión, fallback, autoridad y partidas. No nueva tienda, región, fusión, canje, pity, XP o sistema de misiones.

Pendiente humano: entender qué hacer, distinguir propiedad, formular plan, interpretar hechos/probabilidades/renuncias y decidir voluntariamente volver. Pendiente físico y lector real. No se declara comprensión, personalidad, diversión o retención por superar tests.

Siguiente incremento recomendado: observar estos recorridos y resolver la decisión económica de cola de obtención con esos datos. No iniciar otra tienda o nueva moneda por inercia.
