# Medición para decidir próximos desarrollos

**Diseño propuesto, no instrumentación instalada.** No hay porcentajes de activación, retención o satisfacción medidos en esta entrega. Se revisaron código, contratos y evidencia técnica; no warehouse, cohortes o encuestas de jugadores. No se necesita contratar analítica para empezar: un ensayo observado con registro estructurado puede responder las primeras preguntas, declarando sus límites.

## 1. Tres indicadores principales

No usaremos DAU, duración de sesión o número de clics como prueba de diversión. Más tiempo puede significar carga, confusión o obligación; una sesión más breve puede ser mejor. Tampoco queremos mejorar conversión a cuenta ocultando la opción invitado.

### K1 · Activación jugable inicial

- **Pregunta/valor:** ¿quien ha entrado con una partida nueva llega a experimentar el combate preparado?
- **Unidad/denominador:** jugadores de ensayo nuevos cuyo primer estado autoritativo se ha cargado y que aún no tienen un combate resuelto; una cuenta/invitado del dominio, no cada pestaña. En un estudio manual, participantes únicos; no mezclar esas unidades con playerIds en la misma tasa.
- **Numerador:** esos jugadores que, durante su primera sesión elegible, confirman un combate válido y llegan a un desenlace utilizable, por reproducción, omisión o fallback. Se admite derrota/empate. Un commit sin desenlace accesible se registra como operación resuelta, pero no activación completa.
- **Fórmula:** `jugadores con primer desenlace utilizable / jugadores nuevos con primer estado cargado`. Informar siempre n/N y estados de cobertura desconocida.
- **Sesión propuesta:** comienza con actividad deliberada; termina tras 30 min sin actividad pertinente o salida observada. Pestaña oculta, render o polling no son actividad. El corte de 30 min es convención inicial de análisis, no un temporizador del juego; revisar sensibilidad 15/30/60 min.
- **Fuente:** operación de combate confirmada, observación UI de resultado utilizable y comienzo de sesión. Identidad derivada de servidor; evento UI no autoriza recursos.
- **Diagnósticos:** D1 entrada/errores y D2 tiempo/ayuda hasta primer combate. Los errores antes de cargar partida no entran en K1 y por ello **deben aparecer en D1**, para no ocultarlos.
- **Decisión:** primero medir el embudo y explicaciones de temporal/propio; si se interrumpe en formación, probar PM02. No aumentar regalos solo para subir esta tasa.
- **Cadencia/propietario propuesto:** revisión después de cada lote humano y semanal en piloto; producto con desarrollo para calidad del dato.

### K2 · Retorno voluntario entre 24 horas y siete días

- **Pregunta/valor:** ¿existe un motivo para volver cuando ya se ha visto el bucle?
- **Cohorte:** jugadores activados según K1, con seguimiento permitido y al menos 168 h completas de observación desde activación `t0`. Separar observados/sin seguimiento; no imputar retorno a quien no puede medirse.
- **Numerador:** jugadores de esa cohorte con al menos una acción deliberada pertinente en `[t0+24h, t0+168h]`: preparación guardada, consulta de objetivo solicitada por la persona o comando de juego. Abrir automáticamente PWA, refrescar token, replay técnico, heartbeat o test no cuentan.
- **Fórmula:** `activados que regresan en esa ventana / activados con ventana completa y seguimiento`. No llamarlo D7 clásico. Si se calcula D1 exacto usar `[24h,48h)` y D7 exacto `[168h,192h)` por tiempo transcurrido; requieren madurez de 48/192 h respectivamente. Declarar UTC y límites.
- **Fuente:** timestamp del servidor para hechos confirmados y observaciones deliberadas clasificadas; sin reconstruir `t0` desde UUID/ordinal. Vincular invitado conserva playerId; volver en otra cuenta no se une por IP/correo o dispositivo.
- **Diagnósticos:** D9 capacidad de retomar, D7 falta de descubrimientos y D14 cuenta/recuperación. Separar invitación de investigador, recordatorio, evento estacional y retorno sin contacto. No llamar espontáneo a un retorno solicitado.
- **Decisión:** entender el motivo antes de producir contenido. Un retorno bajo con problemas técnicos exige recuperación; uno bajo tras completar todo plantea progresión. No introducir rachas o notificaciones para fabricar el numerador.
- **Cadencia/propietario:** semanal solo para cohortes maduras; producto. Pilotos pequeños presentan casos/n/N, no una tasa como certeza de mercado.

### K3 · Plan táctico efectivamente probado

- **Pregunta/valor:** ¿los planes que el jugador elige llegan a manifestarse en juego?
- **Denominador:** expediciones terminadas con intención voluntaria fijada al iniciar y elegible según la configuración efectiva. Runs activas son censuradas, no fallos. Intentos que terminan antes de activar el plan permanecen en denominador, incluidos abandonos confirmados; intención cancelada antes de iniciar no entra.
- **Numerador:** esas runs con evidencia guardada que satisface el predicado de intención. Para vínculos PM03: evento propio `house-activated` o `bond-activated` correspondiente. Para gragea: activación propia, no compra/asignación; para compañero: participación de la copia propia válida según contrato.
- **Fórmula:** `runs terminadas con evidencia del plan / runs terminadas con intención elegible al inicio`. Registrar aparte intenciones que dejaron de ser viables y motivo; no excluirlas después para mejorar la tasa.
- **Fuente:** snapshots/intención y receipts, no animación, clic de selección o conteo de cartas del catálogo vivo. El éxito de una activación no prueba que su efecto haya sido decisivo ni que la decisión fuera comprendida.
- **Diagnósticos:** D3 adopción/disponibilidad de intención y D4 diversidad por cohorte. Comparar también quienes no eligen plan, sin atribución causal: autoselección cambia composición de grupos.
- **Decisión:** si un plan no llega a activarse, revisar acceso/preview/condición. Si se activa y no se percibe, PM06. No bajar umbrales o inflar bonos sin estudio separado.
- **Cadencia/propietario:** por versión de contenido y lote; diseño de juego con producto.

## 2. Guardrails principales

**G1 · Integridad del progreso.** Incidencias confirmadas de pérdida, duplicación, recompensa repetida, propiedad cruzada o estado irrecuperable por comandos. Objetivo de aceptación: cero defectos conocidos en los casos ejecutados; cualquier incidencia reproducible bloquea el incremento afectado. No extrapolar «cero en tests» a ausencia universal de incidentes. Fuente: tests adversos, receipts y soporte reproducible, nunca un evento de éxito cliente. Responsable: desarrollo; revisar por release/incidente.

**G2 · Acción hasta resultado utilizable.** P50/P95 y extremos de entrada, preparación, confirmación de combate, regreso y apertura. Inicio en gesto deliberado, fin cuando resultado/acción siguiente están operables. Separar red/autoridad/carga/animación y cachés declaradas; no sumar percentiles de fases ni restar trabajo anticipado de la experiencia completa. Errores/timeouts se informan con recuentos y tasa, sin desaparecer del análisis al filtrar solo éxitos. En paralelo, rAF sostenido con ventana definida: objetivo de ensayo P95 ≤20 ms; A88 conserva muestras WebKit 23–24 ms, no objetivo cumplido universalmente. rAF no es GPU. Responsable: desarrollo/technical art; comparaciones emparejadas Linux, no perfiles locales en el Mac.

Costes/cuotas y accesibilidad son también **condiciones de entrega**: no activar pago por defecto, no barreras bloqueantes conocidas de teclado/foco/texto y no exigir sonido/color. No se ocultan por mejorar K1–K3.

## 3. Catálogo diagnóstico: usar solo cuando responde una pregunta

Cada diagnóstico debe incluir versión, n/N, población, ventana y cobertura. «No medido» no se convierte en cero.

| ID | Medida y cálculo operativo | Fuente/unidad | Decisión y riesgo de interpretación |
| --- | --- | --- | --- |
| D1 | Entrada: intentos deliberados que llegan a estado válido / intentos observados; errores por código y reautenticaciones | UI observada + HTTP autorizado; intento, deduplicado | Corregir acceso antes de balance; repetición de Enter no es otra persona |
| D2 | Tiempo activo hasta primer combate y ayudas necesarias; P50/P90 + abandonos observados | Cronómetro humano o intervalos UI visibles + estado; participante/jugador | Enseñanza situada; automatización no proporciona duración humana |
| D3 | Intención elegida / cierres donde había al menos una opción viable; exposición de cada opción | Disponibilidad derivada + exposición UI; cierre | Revisar viabilidad/jerarquía; no contar como rechazo lo que no se mostró |
| D4 | Distribución de vínculos/identidades distintas por run elegible y nº de planes probados por jugador | Input/log de combates por versión; run/jugador | Detectar concentración; un vínculo popular no demuestra dominancia si su acceso es mayor |
| D5 | Tiempo activo, consultas y escrituras para preparar otro equipo; errores de preset | UI y comandos; episodio de preparación | PM04; menos clics sin decisiones correctas no equivale a mejor UX |
| D6 | Encontrar fuente de una identidad y explicar propiedad/temporal sin ayuda; n/N y citas con permiso | Sesión humana estructurada | PM05; no inferir conocimiento por abrir la ficha |
| D7 | Aperturas entre descubrimientos: mediana/P90/P95 y intervalos abiertos; copias acumuladas | Receipts de apertura por versión/identidad; apertura | PM10; conservar censura del intervalo todavía sin nuevo hallazgo. Modelo exacto se etiqueta como modelo, nunca persona |
| D8 | Tras combate, describir una consecuencia real y una revisión posible; n/N por log | Respuesta humana comparada con hechos, sin sugerir solución | PM06; repetir una frase UI no basta para acreditar comprensión |
| D9 | Retomar run y explicar el siguiente objetivo sin ayuda después de una pausa real | Sesión de regreso observada; persona | PM07; no confundir relanzar fixture con recordar contexto |
| D10 | Elección por oferta y condición: opción A/B/pasar entre exposiciones elegibles | OfferId/version, preview y resolución; encuentro | PM09; estratificar PV/PM/colección/ruta. Correlación no prueba conveniencia causal |
| D11 | Descubrimiento→consulta→participación→avance→cierre estacional por días restantes | UI + concesión/participación del servidor; jugador/edición | PM12; no tratar a quien llegó tarde como abandono o exigir retorno diario |
| D12 | Victoria/derrota/empate, PV/PM restantes, gasto e intentos por rival/perfil y cohorte | BattleLog/receipt; combate/run | Curva/PM13; no objetivo arbitrario de win rate ni mezclar colección inicial y amplia |
| D13 | Bytes por estado, filas leídas/escritas, tamaño SQL por jugador, memoria y coste/quotas por sesión | Instrumentación técnica aislada + proveedor si autorizado | PM14/15; no convertir MB de archivo en memoria residente ni requests en comandos Redis |
| D14 | Vínculo: vinculaciones completadas / invitaciones voluntarias expuestas; recuperación: mismo player recuperado / intentos válidos | Identidad/autoridad + UI, sin credenciales; intento/jugador | PM15; no mejorar haciendo invitado menos accesible, ni contar correo local como entrega externa |

Diversidad opcional: entropía normalizada `-Σ p_i ln(p_i)/ln(m)` sobre m opciones realmente elegibles en una cohorte; reportar distribución y accesibilidad junto al índice. m<2 es no aplicable. No optimizar entropía para forzar variedad cuando una preferencia es legítima. Para dominancia mecánica, ejecutar pares controlados del motor, no inferirla de pick rate.

Las colas observadas de D7 requieren tratar intervalos sin descubrimiento como censurados, mediante análisis de supervivencia o informe de pendientes separado. Si no hay información suficiente para estimar P90/P95, indicar «no estimable»; no calcularlos solo con intervalos cerrados ni presentarlos como equivalentes al modelo exacto del catálogo.

## 4. Eventos mínimos y autoridad

Primera fase manual: hoja estructurada con participante ficticio, objetivo, instante/pausa, acción, ayuda, resultado, explicación y defecto. No almacenar grabaciones por defecto. Una sesión observada no permite estimar retención de siete días.

Instrumentación posterior, si se aprueba PM01:

| Evento propuesto | Quién puede acreditar el hecho | Dedupe y alcance |
| --- | --- | --- |
| `entry_intent_observed` | UI no confiable para economía | eventId; contexto efímero; métricas de entrada, no identidad autorizada |
| `game_ready_observed` | UI + player validado por servidor | sessionId/player; primera carga utilizable, no cada polling |
| `preparation_observed` | UI | episodio; selección/cancelación distinguibles, no cada hover |
| `team_committed` | Receipt de operación | receiptId; incluye resumen de vínculo/reglas, no inventario completo |
| `node_offer_observed` | UI con nodo/oferta pública vigente | session/node/revision; distingue consulta de disponibilidad |
| `node_resolved` | Receipt | receiptId; decisión y outcome; nunca otra cuenta del header |
| `battle_resolved` | Receipt | receiptId; logVersion/rulesVersion y desenlace, no replay |
| `battle_result_usable_observed` | UI/observación, no prueba de commit por sí sola | receiptId/session; modo replay/skip/fallback y tiempo local monotónico |
| `run_ended` | Receipt/run confirmado | runId/resultado/version; una vez por fin real |
| `intention_committed` | Estado/receipt | operationId; selección distinta de ejecución posterior |
| `intention_evidenced` | Predicado determinista sobre receipt | intención/run/receipt; reconstruible, no concesión de premio |
| `opening_resolved` | Receipt | receiptId; wizardId público, nuevo/repetido y tabla; nunca seed/ticket secreto |
| `identity_linked` / `access_recovered` | Servicio de identidad | evento único interno; resultado/owner validado, sin correo o tokens |
| `seasonal_progressed` | Receipt | editionId/objectiveId/grantId cuando corresponda; separado del catálogo base |
| `technical_failure_observed` | Capa que conoce el fallo | código estable/acción; mensaje libre y payload privado excluidos |

Sobre común propuesto: eventId, schemaVersion, eventName, originEnvironment, isFixture, serverObservedAt cuando exista, sessionId, identificador seudónimo derivado de propietario autenticado, runId/receiptId opcionales, app/content/rules/table versions pertinentes y categoría de acción. Idioma/pack/viewport por bandas solo si resuelve una pregunta de QA/producto y se ha aprobado recogerlos. No fingerprinting, IP persistida para analítica, email, contraseña, token, texto escrito, semilla, stack con secretos o estado completo. Seudónimo no significa dato anónimo ni exime de decidir privacidad.

**Tiempo:** usar reloj de servidor para cohortes. Para duraciones de interfaz, medir localmente con reloj monotónico y marcar pérdida/pausa/ocultación; no calcular latencia restando relojes de máquinas distintas. `serverObservedAt` mide observación del evento, no necesariamente el instante exacto del commit. Registros históricos sin fecha fiable quedan fuera de cohortes temporales.

**Entrega:** reutilizar hechos económicos ya confirmados. Un adaptador acotado puede observar después de commit, con dedupe y escritura separada; su fallo no revierte ni bloquea el comando. Esto puede perder eventos: debe medirse cobertura/reconciliar conteos contra receipts, sin afirmar entrega exactamente una vez. No introducir un outbox o bus universal por defecto. No añadir columnas `created_at=now()` a receipts reinsertados y usarlas como fecha original: la persistencia actual reescribe el agregado. PM14 debe resolver/evitar esa confusión.

## 5. Cohortes, calidad y privacidad

- Cohortes por versión efectiva, primer/retorno, colección inicial/intermedia/amplia definida por identidades distintas, perfil, acceso al vínculo e intención. No mezclar versiones de motor o tabla para declarar cambio de comportamiento.
- Enlaces invitado→cuenta usan el mismo playerId según autoridad. Sin vínculo, dos navegadores pueden representar una persona: informar esa limitación; no unir por IP o heurística invasiva.
- Excluir fixtures, CI, desarrollador y reloj fijo mediante configuración de servidor/entorno identificable. No permitir que un cliente elija si su comando económico es «fixture».
- Registrar duplicados, eventos sin owner/version, timestamps imposibles, huecos y censura; panel interno debe mostrar conteos brutos y razones de exclusión. Nunca alterar saldo para reparar datos analíticos.
- Retención de ensayo propuesta: observaciones de producto crudas 30 días, agregados sin identificador 90 días; revisar antes de captar datos reales. **No aplica a receipts, identidad o derechos económicos**, que tienen otra política. Definir acceso/borrado y voluntariedad sin afirmar cumplimiento normativo.
- Empezar con 5–8 sesiones formativas voluntarias, idealmente dos idiomas y personas nuevas/recurrentes. Este rango permite buscar fallos, no estimar porcentajes poblacionales ni potencia A/B. Cualquier bloqueante se corrige; después un segundo lote observa el recorrido corregido.
- Para un piloto longitudinal, mostrar n/N, incertidumbre y cohortes maduras; calcular tamaño de muestra solo con baseline, diferencia mínima relevante y diseño definidos. No importar porcentajes de benchmarks de otro género. Un aumento observado sin aleatorización se describe como asociación; no atribuirlo a una feature.

## 6. Objetivos y decisiones

No se fijan targets numéricos de retención o activación sin baseline. Primer objetivo: datos coherentes, recorrido sin bloqueantes conocidos y capacidad de explicar una decisión con evidencia humana. Los límites de seguridad de integridad son requisitos, no un promedio que pueda compensarse con más retorno.

Revisión semanal propuesta: ¿qué decisión debemos tomar?, ¿qué población podemos observar?, ¿qué dato falta?, ¿qué cambio mínimo resolvería la duda?, ¿qué guardrail puede empeorar? Entregar una página agregada, no un dashboard dentro del juego. Si una feature no produce la consecuencia que prometía, simplificar o retirarla antes de añadir premios.

Fuentes metodológicas, consultadas 19/10/2026: [GameAnalytics, definición de retención por cohortes](https://docs.gameanalytics.com/products-and-features/pipeline-iq/metrics-api/api-specification/), [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [Xbox Accessibility Guideline 103](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/103). Se usan para definiciones y validación, sin instalar sus servicios ni atribuir sus datos al juego. Objetivo de comodidad local 44×44; el mínimo AA de tamaño de objetivo de WCAG 2.2 es 24×24 con excepciones, no 44×44 universal; foco visible no equivale automáticamente a certificar toda WCAG.

## Ampliación de colección y tiendas

Los diagnósticos D15–D21 y sus denominadores están en [COMMERCE-VALIDATION.md](COMMERCE-VALIDATION.md). Conservan los tres indicadores principales, los guardarraíles y los límites de privacidad de este documento. No se han instalado eventos ni recogido datos de jugadores.
