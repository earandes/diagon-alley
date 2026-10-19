# PM10/PM22 · Excedentes y obtención: decisión económica pendiente

19 octubre 2026. Estudio reproducible ejecutado, sin modificar precios, probabilidades, premios, inventario o código económico. No es simulación del motor de combate, telemetría, tiempo observado con personas ni evidencia de diversión/retención.

## Decisión recomendada

**Conservar las reglas económicas actuales en A89.** PM05/18/19 mejoran orientación, comparación y preparación sin necesitar una nueva fuente de recursos. Para una decisión posterior, investigaría primero una obtención dirigida acotada, comparada con conservar la rana general. No implementaría simultáneamente canje, producto temático y adquisición dirigida.

El modelo muestra tres renuncias relevantes:

1. Un canje amplio 5:1 acorta fuertemente toda la colección, además de la cola: 65 aperturas de mediana frente a130 de la muestra A. Aunque protege instancias útiles, no es un ajuste menor de comodidad. No se elige el ratio5 como regla aprobada.
2. Ahorrar para tres identidades finales conocidas reduce extremos, pero **puede empeorar la mediana de expediciones con pocos ingresos y gasto de preparación**. No debe convertirse en una recomendación universal de ahorro.
3. Una tabla de ocho identidades ayuda a ese subconjunto, pero deja la mayor parte de la cola general. No acredita suficiente valor para producir una nueva caja, tabla, contrato y apertura ahora.

El siguiente estudio económico debe concretar acceso, coste de oportunidad y alcance de una única alternativa. Primero observar la utilidad del objetivo del Cromodex y la comprensión de las copias actuales. Ningún test autoriza cambiar la economía.

## Sistema actual contrastado

- Catálogo34 identidades; la copia inicial `apprentice` está fuera de la tabla.33 identidades de rana con tickets uniformes:1/33 cada una. La rareza no modifica por sí sola su probabilidad por identidad.
- Rana10 Coronas; tarro5. Forjas actuales15/20/25 por madera; las especializaciones conservan esos precios.
- Kit50 Coronas/50 Esencia. Combate5 Esencia; capacidad50, regeneración1 cada12 minutos. Cambiar preparación o consultar no concede Esencia.
- Duelo primera victoria20 Coronas y tarro; repetido2 sin producto. Jefe primera victoria50, rana y llave; repetido5 sin otra rana/llave. Derechos por identidad de nivel/campaña, no por ruta o perfil nuevo.
- Cofre10 Coronas y tarro una vez por visita válida de una run. No es un nuevo sorteo o derecho de primera victoria. Los encuentros modernos son intercambios deterministasPV/PM; el modelo no les asigna los ingresos del antiguo encuentro aleatorio.
- Una llave del jefe permite una apertura de bóveda: dos lotes de peso igual. Se respeta esa única concesión y se aplican sus productos/Coronas reales. No se supone una llave por cada victoria repetida.
- Acabado encantado1%independiente, cosmético y sin contribución doble a vínculos. El modelo lo excluye completamente del conjunto sacrificable.
- Casas de acceso desigual:14 Gryffindor,4 Slytherin,4 Ravenclaw,4 Hufflepuff;8 sin casa, incluidas las cuatro criaturas. Propiedad permanente y aliados temporales continúan separados.

Fuentes activas exportadas y conSHA256 en [economy-input.json](economy-input.json): contenido ensamblado, configuración, generación de ruta, recompensas, Esencia y casos de uso. Las cifras no proceden de una tabla histórica reutilizada sin comprobar.

### Corrección de una inferencia del primer modelo

La primera versión del estudio consideró salir tras un cofre y empezar otra expedición. Eso **no es una operación permitida**: `StartRunUseCase` rechaza `RUN_ACTIVE`. Alcanzar un cofre temprano no acredita que pueda repetirse sin cerrar la run.

Se descartaron los resultados del borrador que permitía ese reinicio. El exportador final inicializa un jugador y una primera expedición mediante casos de uso reales en memoria; verifica que una segunda orden de inicio obtiene `RUN_ACTIVE`. No utiliza PostgreSQL/Redis ni la cuenta habitual para esta fixture. Un primer intento de esta comprobación usó una fixture sin receipt de kit y falló con `INVALID_GAME`; se corrigió usando el inicializador real, sin relajar validaciones del producto.

Ahora una interrupción conserva ruta, posición y recursos y se reanuda en el mismo nodo. La política de cofres continúa hasta jefe/derrota/empate para poder empezar otra run. **No se afirma un exploit de farmeo gratuito.** Tampoco se inventa una tasa humana de abandono definitivo: quien no vuelve conserva una run pendiente y no tiene fecha de completitud pronosticada.

## Modelo ejecutado

Tres capas separadas:

1. **Matemática exacta de colección:** distribución de ocupación de33 tickets uniformes; no combate, ingresos, horas o calendario.
2. **Contenido/rutas reales:**64 semillas de generación por cohorte y política;384 caminos que llegan al jefe y sus recompensas/versiones. Selección pública determinista: reclutar hasta formación suficiente y luego priorizar duelos, o priorizar cofres/refugios. No se consulta un resultado aleatorio futuro para decidir.
3. **Sensibilidad económica:**81 escenarios ×1.000 semillas =81.000 casos de política. Los resultados de combate son supuestos Bernoulli, no `CombatEngine`. Las mismas semillas y flujos separados emparejan alternativas;81.000 no significa81.000 personas o muestras independientes de producto.

Se conservan flujos separados para colección inicial, identidad, acabado, ruta, resultados, bóveda y tabla temática. La política no conoce futuros tickets. Horizonte350 expediciones; los casos que no completan quedan censurados. Cuantiles incondicionales insuficientemente cubiertos se guardan como `null`, no como unP95 calculado únicamente entre quienes completaron.

### Colecciones de partida

| Cohorte       | Propiedad inicial y derechos                                                                                                    | Interpretación                                                         |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Inicial       | Solo aprendiz;50 Coronas/50 Esencia; primeras victorias pendientes                                                              | Incluye decisiones de gasto del kit y primeras recompensas reales      |
| Intermedia    | Aprendiz+16 identidades aleatorias; dos copias regulares adicionales protegidas; derechos de primeras victorias/bóveda agotados | Coste restante desde una situación declarada, no coste histórico total |
| Casi completa | Aprendiz+30 identidades aleatorias; misma protección/derechos agotados                                                          | Tres identidades pendientes; no se eligen a posteriori las más fáciles |

En todas las cohortes se mantienen50 Coronas/50 Esencia iniciales para aislar alternativas. No se infiere que una persona con17 o31 identidades conserve ese saldo. La ruta de referencia por cohorte no se optimiza al crecer después la colección; esto es una política reproducible y legal de formación, no la mejor estrategia posible.

### Ingresos, gastos y condición: supuestos

| Contexto                             | Política y resultado supuesto                                                                         | Preparación y abandono                                                                                                                 |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Favorable sin compras de preparación | Prioridad duelos;85%victoria en duelo/70%en jefe;3%empate por combate                                 | Sin compras de grageas/forja;5%interrupción por nodo, reanudada                                                                        |
| Adverso con preparación              | Prioridad duelos;50%victoria/35%jefe;3%empate                                                         | Una gragea si disponible o comprable por combate; hasta tres forjas15/20/25 cuando alcanzan fondos;20%interrupción por nodo, reanudada |
| Prioridad cofres                     | Mismas probabilidades favorables; ruta con mayor prioridad a cofres, sin evitar un cierre obligatorio | Sin compras de preparación;5%interrupción por nodo, reanudada                                                                          |

El resto de la masa de combate es derrota. Ni victorias ni interrupciones son observaciones humanas. La preparación no altera esas probabilidades en este modelo: aquí se mide **el presupuesto dedicado a ella**, no cuánto ayuda. No se presenta el contexto adverso como demostración de condición baja en el motor.

Se gastan productos solo al combatir; botines de cofres/primeras victorias alimentan el stock y evitan recomprarlos. Si no hay fondos para preparación opcional, se registra el intento no asequible y continúa sin ella. Una derrota/empate termina esa run, conserva los productos/recompensas ya confirmados y no concede una victoria. Recompensas de nivel/llave no se reinician al comenzar otra.

## Alternativas comparadas por separado

| Política      | Regla hipotética y decisión                                                                                                                           | Renuncia/riesgo                                                                                                        |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| A             | Rana general vigente, sin conversión                                                                                                                  | Cola aleatoria no acotada; duplicados conservados                                                                      |
| B3/B5/B8      | Canje manual de3/5/8 excedentes por una identidad faltante de la familia amplia de cromos                                                             | Sacrifica copias; reduce mucho la duración. El alcance de familia/rareza es optimista y aún no elegido                 |
| C60/C100/C150 | Ahorrar para adquirir explícitamente una identidad conocida al quedar tres; máximo tres adquisiciones;60/100/150 Coronas como sensibilidades          | Renuncia temporal a aperturas. Es compra dirigida hipotética, **no** el objetivo gratuitoPM05 ni un encargo ya jugable |
| D10/D15       | Pool hipotético de las ocho identidadesRavenclaw+Hufflepuff;10/15 Coronas; se elige cuando mejora probabilidad marginal de identidad nueva por Corona | El resto sigue en la rana general; precio, selección y acceso no aprobados                                             |

ParaB se protege al menos la última copia regular, las dos copias adicionales declaradas como equipadas/reservadas y todos los encantados. Ninguna conversión toca esos elementos; no hay polvo, XP o conversión automática en el producto. Las operaciones actuales no implementan este canje. Un diseño futuro debe proteger además cualquier otra instancia comprometida en equipo, run, reservas, intención incierta o requisitos explícitos; el modelo no inventaría que todas las copias de una persona son libres.

No se combinanB/C/D. La elección de un pool usa el conjunto faltante público, no la identidad del siguiente ticket. No hay reroll, incremento de probabilidad por historial, regalo diario o compensación oculta.

## Resultados

### Referencia exacta: aperturas restantes para34 identidades

| Identidades propias al empezar | P50 | P90 | P95 | Media exacta |
| ------------------------------ | --: | --: | --: | -----------: |
| 1                              | 128 | 188 | 211 |       134,93 |
| 17                             | 106 | 166 | 189 |       113,51 |
| 31                             |  52 | 110 | 133 |        60,50 |

Son aperturas, incluyendo posibles repetidos. No son compras, expediciones o tiempo. No hay garantía finita. Desde31 identidades, tener muchas cartas no elimina la espera de las tres concretas que faltan. Para una identidad específica, seguir sin ella tras50 aperturas tiene probabilidad `(32/33)^50`, aproximadamente21,5%.

### Cohorte inicial, contexto favorable: sensibilidad de políticas

Cada fila tiene1.000 casos completados dentro del horizonte. Cuantiles empíricos; la filaA difiere ligeramente de la referencia exacta por error Monte Carlo.

| Política | AperturasP50/P90/P95 | ExpedicionesP50/P90/P95 | Coronas gastadas en obtenciónP50/P90/P95 |
| -------- | -------------------- | ----------------------- | ---------------------------------------- |
| A        | 130 /190 /214        | 80 /127 /143            | 1.280 /1.880 /2.130                      |
| B3       | 53 /58 /59           | 22 /28 /29              | 520 /560 /580                            |
| B5       | 65 /72 /74           | 30 /38 /40              | 620 /700 /720                            |
| B8       | 75 /84 /89           | 38 /48 /51              | 730 /820 /880                            |
| C60      | 73 /95 /101          | 51 /69 /75              | 890 /1.110 /1.170                        |
| C100     | 73 /95 /101          | 60 /78 /84              | 1.010 /1.230 /1.290                      |
| C150     | 73 /95 /101          | 72 /90 /96              | 1.160 /1.380 /1.440                      |
| D10      | 127 /186 /207        | 79 /122 /142            | 1.260 /1.840 /2.040                      |
| D15      | 125 /185 /204        | 79 /122 /142            | 1.255 /1.845 /2.040                      |

Coronas de obtención excluyen forja/grageas y cuentan productos gratuitos a coste cero; el ledger separado conserva esas fuentes/sumideros. No equivalen a toda la moneda ganada. Distintas políticas pueden cambiar la exposición a premios de primera victoria al completar antes: se informa en resultados, no se altera su cuantía.

La sequía más larga de descubrimientos propios enA tieneP50/P90/P95 de33/80/100 aperturas;B5 la reduce a5/6/6 yC100 a11/22/27. Los canjes/adquisiciones conocidas interrumpen esa sequía, aunque no sean aperturas. El contador cuenta aperturas consecutivas sin nueva identidad entre descubrimientos, no inactividad de calendario.

### Resultados desfavorables conservados

- Inicial/adverso/A:952 de1.000 completan en350 runs. ExpedicionesP50/P90/P95 estimadas192/307/346. Hay48 casos censurados; la cola próxima al límite es especialmente incierta.
- Inicial/adverso/C100:959 de1.000 completan;226/309/339 runs. **La mediana empeora192→226 aunque disminuya elP95 estimado346→339.** Ahorrar no garantiza recuperar antes cuando el presupuesto también sostiene preparación.
- Inicial/adverso/B5:1.000 completan;70/93/99 runs. Esa gran reducción demuestra el alcance de la nueva regla, no su conveniencia artística o económica.
- Inicial/prioridad-cofres/A:72/114/129 runs frente80/127/143 en prioridad-duelos. Sigue habiendo combates y gasto de Esencia; no una fuente libremente reiniciable.
- Casi completa/adverso/A:33/72/88 runs;C100:22/26/27. Es una ayuda mucho más localizada en la cola que al principio. Los demás perfiles/ratios/precios están íntegros en elJSON.

La desviación estándar Monte Carlo de unaCDFcercana al95%con1.000 semillas es aproximadamente0,69 puntos porcentuales; no es un intervalo en aperturas ni incertidumbre sobre personas. Las tasas asumidas tienen incertidumbre de producto mucho mayor. No ordenar alternativas únicamente por diferencias pequeñasD10/D15.

## Tiempo activo, espera y calendario

El simulador contabiliza acciones y costes antes de convertirlos mediante rangos **supuestos**, no tiempos de automatización ni tiempos humanos observados:

- Preparar una run:12–35 s.
- Nodo no de combate:6–18 s.
- Combate y resultado utilizable:12–35 s.
- Apertura:5–12 s.
- Forja:8–20 s; intercambio/obtención dirigida6–15 s; bóveda10–25 s.

Se ejecutan dos relojes con las mismas operaciones, uno por extremo del rango. La Esencia regenera con capacidad y cursor reales; al faltar cinco puntos se registra espera adicional. Esta espera **no es dificultad táctica**.

Ejemplos de medianas del modelo:

| Cohorte/contexto/política  | Tiempo activo supuesto | Espera adicional en uso continuo |
| -------------------------- | ---------------------- | -------------------------------- |
| Inicial/favorable/A        | 1,63–4,71 h            | 190,42–187,43 hsegún ritmo       |
| Inicial/adverso/B5         | 1,12–3,23 h            | 106,95–104,95 h                  |
| Inicial/prioridad-cofres/A | 1,45–4,17 h            | 116,52–113,73 h                  |
| Casi completa/adverso/A    | 0,57–1,66 h            | 41,44–40,38 h                    |

Las columnas son medianas separadas: **no se suman cuantiles para pronosticar un total**. El extremo más lento de acción permite más regeneración durante juego y por eso puede reducir la espera adicional. Las interrupciones offline no reciben una duración ficticia ni se suman; pueden desplazar parte de esa espera fuera del tiempo de juego.

Se incluyen además **límites inferiores**, no predicciones de completitud, para tres frecuencias explícitas:

- Una sesión diaria de15 minutos.
- Dos sesiones diarias de15 minutos separadas12 horas.
- Sesiones de15 minutos lunes/miércoles/sábado, comenzando un lunes.

Se usa el máximo entre sesiones requeridas por tiempo activo y por capacidad de Esencia (hasta10 combates por sesión). No se simula perfectamente la fragmentación/sincronía del calendario; los días reales pueden ser más. En inicial/favorable/A, elP50 del límite de una sesión diaria es21 días en ambos extremos; prioridad-cofres/Ada13–17 días. Estos valores **no dicen que una persona completará el juego en21 días**. Una persona que no vuelva no tiene fecha de completitud calculable. Hacen falta tiempos activos, patrón de visitas, gastos y decisiones reales para una estimación de calendario fiable.

## Comandos, comprobaciones y límites

```sh
node tools/arcana/economy-study-a89.mjs > docs/arcana/priority-increment-2026-10-19/economy-input.json
python3 tools/arcana/economy-study-a89.py --self-test
python3 tools/arcana/economy-study-a89.py > docs/arcana/priority-increment-2026-10-19/economy-results.json
```

Ejecutados localmente sin navegador, servicios o datos habituales. Vite se utiliza solo como cargadorSSR en middleware sin escuchar puertos, sin plugins del proyecto ni watcher; se cierra en `finally`. Python usa únicamente biblioteca estándar. No dependencia instalada, configuración global o servicio de pago.

Comprobaciones ejecutadas:

- Casos matemáticos conocidosn=1/n=2/n=33 y conservación de masa.
- Protección de última copia/equipo/reserva; negativa a canje insuficiente.
- Capacidad/primeros10 combates y espera del undécimo; flujos RNG deterministas separados.
- Precios/tabla uniformes, identidad garantizada fuera del sorteo, hashes de contenido.
  -384 caminos llegan al jefe; inicio sobre run activa rechazado por el caso de uso real en memoria.
  -81 escenarios/81.000 casos, consumos no negativos y bóveda≤1.
  -243 ejecuciones adicionales seleccionadas (semillas0/1/999 por perfil/política/contexto): igualdad exacta del ledger de Coronas, combate=ganado+perdido+empatado, dirigida≤3 y bóveda≤1.
  -Hash del modelo y entrada coinciden con el resultado final. Los borradores invalidados por el supuesto de reinicio no se atribuyen a estos resultados.

[Entrada y rutas](economy-input.json), [resultados completos](economy-results.json), [exportador](../../../tools/arcana/economy-study-a89.mjs), [modelo](../../../tools/arcana/economy-study-a89.py).

El modelo no ejecuta combates reales, no demuestra una tasa viable de victoria con una colección concreta y no atribuye rendimiento humano a fixtures. Tampoco prueba seguridad SQL/Redis; esas garantías tienen su validación aparte. Cada alternativa hipotética necesitaría simulación de preparación real y recorridos autoritativos antes de implementarse.

## Qué falta decidir y observar

Antes de aprobar una política económica:

1. ¿Se quiere acotar la cola de las últimas identidades o dar utilidad a excedentes desde temprano? Son problemas distintos.
2. ¿Qué copias considera útiles la persona: reservas, composición, equipo alternativo, acabado? No deducirlo solo del contador.
3. ¿Qué acceso y coste tendría la adquisición dirigida?60/100/150 son sensibilidades, no precios elegidos.
4. ¿Cuántas adquisiciones dirigidas serían posibles, qué identidad de derecho impediría duplicarlas y cómo se conservaría al versionar catálogo? No reutilizar los derechos de llave/campaña.
5. ¿Aporta una rana temática una decisión interesante que el objetivo gratuito del Cromodex no resuelve? Este pool de ocho no justifica un lote visual.
6. ¿Cómo se distribuyen tiempo activo, Esencia ociosa, compras y derrotas en sesiones reales? No intentar mejorar retención añadiendo espera.

La siguiente sesión puede observar escoger un objetivo, explicar la probabilidad/posible repetido, comparar gastar en preparación frente a apertura y expresar qué excedentes conservaría. No se le explica primero cuál sería la elección «correcta». Las métricas D7/D21 yG1 delroadmap seguirán separadas de los resultados simulados.
