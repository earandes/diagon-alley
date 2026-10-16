# Experiencia, ritmo y comprobaciones de diseño

## Qué cambia al jugar

El Callejón tiene una broma concreta que reparar. La calabaza invita, las tres fachadas materializan un objetivo finito y cada reparación devuelve una luz. Las cajas bailarinas enseñan la acción segura; escobas y cerradura cambian la situación temática, manteniendo la misma regla fácil de anticipar. No se atribuye profundidad distinta al mero cambio de relato: la variación táctica proviene de la condición real y de los nodos que quedan.

ConPV completos no hay intercambio útil: se deshabilita y se dice por qué. ConPV bajos/PM sobrantes, preparar puede permitir llegar en mejor condición al siguiente combate, pero usa esa oportunidad y deja el escaparate embrujado. Si se llega tarde o se necesita asegurar historia, deshacer es preferible y no consume condición. Comparación exacta con `previewEncounterTrade`, misma que aplica autoridad. Solo pagan beneficiarios vivos; no revive ni toca reservas. ConPM insuficientes se rechaza sin gasto.

Ejemplo determinista de condición, no simulación humana: integrante100PVmáx/40PMmáx,50PV/20PM → preparar75PV/16PM y0ventanas nuevas; deshacer mantiene50PV/20PM y+1ventana. Con100PV/20PM preparar no aporta nada y no se cobra. Recargar no crea una nueva oportunidad; hay que resolver otro nodo existente. No se selecciona una rama automáticamente.

Reparar tres ventanas cierra la historia y entrega la linterna garantizada; el jefe sigue siendo un reto propio de la expedición. Completar historia con Táctico/Maestría o llevar el equipo hasta el jefe es opcional, con los premios existentes. No hay premio adicional por dificultad. Después del recuerdo se puede consultar la aventura y continuar la campaña; no se fabrica un bucle de curación ilimitada ni tareas repetibles con premios. La hipótesis de que el recuerdo despierta interés requiere sesión humana. No se promete retención.

## Relación y costes de ruta

`node tools/arcana/a68-route-study.mjs` enumera prefijos reales de4nodos en128semillas, sin leer jugador o SQL. Resultado:677prefijos;358sincombate,287con1,32con2. Se puede reparar en posiciones2,3,4 sin llegar al jefe. Esta comprobación de topología supone sobrevivir los combates; no demuestra que cualquier preparación gane. La colección inicial llega a3integrantes por los Pactos existentes. Progreso parcial sobrevive derrota; otra expedición se elige/prepara/confirma explícitamente.

Participar/reparar no añaden coste; no es una suposición: el comando no toca inventario. Los nodos no combativos conservan su regla actual sin gasto deEsencia; cada combate5, máximo50, regeneración1/12min. Historia directa:0–10Esencia según prefijo y0–2combates. Elegir preparar puede llevarla a posiciones5/6 y a más combates de la misma ruta; si no quedan suficientes oportunidades, el progreso permanece para otra expedición. No se oculta ese aplazamiento.

Estimación activa razonada, pendiente medición humana: leer/participar30–90s, formación/Pactos1–3min,3decisiones/reparaciones1–3min,0–2combates/replay0–3min: aproximadamente3–10min desde cuenta/colección inicial sin fallos. No derivado de segundos dePlaywright. Con equipo ya preparado puede ser menor. Una derrota o exploración detallada lo amplía, sin límite humano garantizado. Con50Esencia disponibles no se necesita espera para la historia directa. Consaldo0 y0/1/2combates, la espera de regeneración necesaria es0/60/120min, menos progreso del cursor ya acumulado; no tiene que hacerse en una sesión. Repetir/seguir al jefe consume según ruta, no coste oculto estacional.

Calendario de ensayo:16octubre–2noviembre2026 con24hdegracia para la expedición admitida antes del cierre. No exige días consecutivos. Quien llega tarde puede reparar en una expedición ya vinculada durante la gracia; no se garantiza acabar si no deja tiempo activo/Esencia suficiente. Después solo consulta lo ganado; no se borra la linterna ni se entrega automáticamente lo no completado.

## Dos hipótesis y sesión humana posterior

H1: el objeto festivo y tres ventanas permiten descubrir el objetivo y reconocer progreso sin explicación externa. H2: el intercambioPV/PM y la espera hasta otro nodo hacen perceptible la renuncia de preparar frente a reparar.

Sesión propuesta8–12min en ordenador, idioma elegido desdeAjustes. Cuenta de ensayo separada, primero natural y luego estado de condición declaradamente preparado si no aparece daño. Objetivos uno a uno: «Averigua qué ocurre esta noche»; «Participa y decide qué hacer»; «Continúa hasta resolver la broma»; «Encuentra qué conservas». No explicar dónde pulsar ni recomendar opción. Registrar descubrimiento espontáneo, lectura de coste/plazo, explicación previa de ambas consecuencias, ayudas, errores, tiempo activo y pausas. Tras actuar preguntar «¿Qué ha cambiado?» y «¿Qué harías ahora?». Un camino automático o una fixture lesionada no cuentan como observación humana.

No hay sesiones ejecutadas ni datos de diversión/retención. Dispositivo físico, lector hablado y revisión estética con Enric pendientes.
