# Orden de implementación y validación futura

> Orden vigente consolidado en [PRIORITIES.md](PRIORITIES.md). Los ciclos y el siguiente incremento descritos abajo conservan el plan inicial de PM01–PM15; se complementan con PM05→PM18→PM19 y [COMMERCE-VALIDATION.md](COMMERCE-VALIDATION.md). No son una segunda lista de prioridad.

Este documento deja trabajo preparado. **No ejecuta un goal de implementación ni modifica reglas, app o infraestructura.** La autorización futura debe seleccionar fichas y resolver las decisiones materiales indicadas. Los pasos rutinarios dentro de un incremento autorizado no requieren repetir permisos.

## 1. Roadmap por resultados completos

| Ciclo | Alcance recomendado | Resultado observable | Condición para avanzar |
| --- | --- | --- | --- |
| C0 · Base verificable | PM01 manual/contrato; medición inicial PM14 | Un recorrido documentado y causas de bloqueo/consumo distinguibles | No defectos de integridad conocidos; baseline y fuentes sin métricas ficticias |
| C1 · Primera decisión | PM02 | Una persona parte del kit real, recluta, prepara y llega a resultado utilizable | Tests de flujo y observación de las dudas; no tutorial paralelo o ayudas obligatorias |
| C2 · Compañía con intención | PM03 | Elegir plan viable, comparar Pacto, activar vínculo y reconocer su realización | Disponibilidad/persistencia comprobadas, sin premio ni propiedad ficticia |
| C3 · Consecuencia visible | PM06; ajustes PM11 imprescindibles | Tras duelo o jefe, conocer uno/dos hechos reales y continuar o revisar | Logs correctos y botín prioritario; no causalidad inventada ni UI saturada |
| C4 · Experimentación cómoda | PM04 y después PM05 | Recordar formación y conectar colección con objetivo consultable | Menos reconstrucción sin errores de instancia ni acciones automáticas |
| C5 · Regreso y dominio | PM14 implementado si se justifica, luego PM07/PM08 | Retomar contexto y probar desafíos finitos con historial seguro | Carga/histórico sostenibles y predicados inequívocos |
| C6 · Variación situada | PM09 o PM12, elegir uno | Encuentro con consecuencia posterior o Navidad completa | Evidencia de interés en el bucle actual; presupuesto de producción realista |
| C7 · Economía/expansión | Decisión PM10; PM13 después | Cola aceptable y segunda región con decisiones distintas | Aprobación económica/regional y comparación reproducible sin invalidar historia |

PM11 acompaña cada ciclo, no un barniz final. PM15 es una pista de trabajo independiente para un piloto remoto **cuando se autorice infraestructura/publicación**. No hace falta desplegar para implementar PM02/03/06 y verificar casos aislados. Si no hay audiencia todavía, no bloquear todo el diseño esperando una tasa D7 inexistente.

No sumo bandas de esfuerzo como una fecha de lanzamiento: hay aprendizaje, dependencias y posibles descartes. Tampoco ejecutar PM02+03+06 en una sola gran PR sin poder aislar errores; cada subrecorrido termina operable y conserva lo anterior.

## 2. Contrato común antes de implementar una ficha

1. Baseline Git/SHA, evidencia actual y estado del finding: confirmado en código, reproducido o hipótesis humana.
2. Objetivo de experiencia y decisión principal. Qué aprende/elige el jugador, no cuántos componentes se crearán.
3. Recorrido completo con regreso/cancelación; acción que confirma gasto y dato que demuestra resultado.
4. Estados y reglas que cambian. Precio/peso/premio/Esencia/kit y derechos históricos no cambian por comodidad técnica.
5. Fuente efectiva: snapshot de run, catálogo vigente para operación nueva y receipt histórico para consulta. No mezclar biografía, afinidad y vínculo.
6. Persistencia/operación: propietario, key, revisión, versiones, resultado guardado antes de animar y recuperación ante respuesta perdida.
7. Assets mínimos: probar composición existente, producir muestra en contexto, registrar consumidor/fuente/peso/licencia/fallback. Ninguna generación durante interacción o dependencia de pago.
8. Aceptación técnica y preguntas humanas separadas; criterio para reducir/retirar la propuesta.

Actualizar PRD/DECISIONS/DESIGN cuando se apruebe/implemente un alcance; conservar Word y evidencia. Este estudio solo añade un índice de propuestas a DECISIONS y documentación, sin elevarlas a requisitos aprobados ni cambiar versión del PRD.

## 3. Plan concreto para el siguiente incremento jugable

### PM02 · Orientación situada

Primero selector de orientación con tests de estado: inicial, una/dos/tres unidades válidas, Pacto resuelto, bloqueado, sin recursos y snapshot legacy. Después integrar en guía/puestos/nodo que ya existe. Verificar entrada→preparar→consultar/cancelar→reclutar→combate→resultado→mapa. Cualquier pista se puede ignorar. No ejecutar una rama ni conceder copias para hacer pasar el test.

### PM03 · Plan de compañía

Definir variante versionada de intención con grupo/casa; probar disponibilidad utilizando colección real, condition y garantías de candidatos públicos. Test RED de logro por `bond-activated`/`house-activated`, falso al seleccionar/consultar y correcto desde receipt guardado. Implementar caso de uso y persistencia con schema compatible; después previews e indicadores usando las mismas reglas. Verificar cierre→elegir→iniciar explícitamente→Pacto→activar→cierre, con original de intención antigua conservado.

### PM06 · Hechos de combate

Extraer proyección desde datos, ampliar para grupos/daño absorbido y reutilizar en duelo/jefe. Casos que no justifican un hecho deben dejarlo ausente. Integrar resultado con dos hechos máximo y una acción contextual; no otra página de estadísticas. Verificar no revelar desenlace antes del replay, pausa/omisión/fallback y consulta histórica silenciosa. Comparar comprensión con logs que permitan comprobar exactamente la explicación humana.

**Resultado conjunto esperado:** el jugador puede explicar qué compañía intentaba construir, elegir un candidato coherente y reconocer un efecto registrado. Es una hipótesis de experiencia; tests prueban predicados y continuidad, no esa explicación.

## 4. Matriz mínima por familia

| Cambio | Unitario/dominio | Persistencia real | UI/visual/temporal | Observación humana |
| --- | --- | --- | --- | --- |
| PM01 medición | Cohortes, censura, dedupe y fixtures | Aislamiento/owner si hay tabla de medición | Cobertura de eventos y coste de captura | Comparar registro con acciones observadas |
| PM02 guía | Selector y snapshot | Comandos existentes; no regalos extra | Recorrido nuevo y regreso, foco/lista | Entender temporal/propio y decidir sin ayuda |
| PM03/04/05 planes | Elegibilidad, instancia, tipos antiguos y fuentes | Revisión, concurrencia y recuperación | 30+ copias, filtro, cambio de cuenta y cancelación | Elegir plan y predecir cambio; localizar fuente |
| PM06/07 hechos/diario | Logs reales, runIds, datos faltantes/versiones | Consulta paginada/owner y operaciones antiguas | Pausa, skip, replay compatible y regreso | Explicar consecuencia y retomar contexto |
| PM08/09 objetivos/encuentros | Predicados y cambios de conveniencia | Concesión/uso único y versiones activas | Oferta→cancelación/confirmación→cierre | Comprender renuncia y motivo para repetir |
| PM10 economía | Modelo exacto, políticas y casos extremos | Solo si se autoriza: canje atómico/última copia | Coste/entrega claros y selección reparable | Utilidad/percepción de pérdida, sin prometer colección |
| PM11 lectura | Preferencia propia/sistema y fallback | No SQL económico | 320/390/865/1280, texto, foco, arte ausente | Personas con necesidades relevantes; teléfono/lector |
| PM12 estacional | Fechas/edición/regla conocida | Objetivos/recuerdo únicos y ventana de gracia | Dos packs/idiomas, calendario y consulta histórica | Descubrimiento, decisión y recuerdo |
| PM13 región | Grafo/pools y acceso viable | Snapshot, derechos y cambio de región | Escena completa, transición y regresión Pasaje | Transferencia de aprendizaje y variedad |
| PM14/15 operación | Equivalencia de contratos y fallos | PG/Redis, backup/restore, sesión y respuesta perdida | Resultado utilizable, offline, servicio ausente | Regreso real y confianza, no aprobación por benchmark |

## 5. Verificaciones de toda entrega de código

- Ejecutar comandos reales pertinentes: `npm run typecheck`, `npm test`, `npm run build`, validaciones de contenido y `npm run test:integration` cuando se afecte autoridad/SQL/Redis. Elegir tests por riesgo, no duplicar baterías sin cambios nuevos.
- Browser extenso **solo CI Linux** bajo guard/lock/preflight/watchdog, un worker, sin retries automáticos, vídeo/trazas extensas o baterías simultáneas. En Mac única excepción original `npm run test:browser:local`; no es necesaria en este estudio. No Chrome, Browser, CUA o scripts alternativos para eludir protección.
- ES/EN, dos paquetes, 1280×900/390×844/865×1079, reflujo 320 y texto ampliado; 1–5 propios/temporales/duplicados/caídos/reservas según contexto. No ocultar actores/nombres/PV para simular ajuste.
- Stock cero/insuficiente, cancelar/volver, foco, dos pestañas, snapshot viejo, revisión incompatible, error antes de commit, commit con respuesta perdida, dueño distinto, arte ausente y renderer fallido. Cambiar idioma/pack, omitir o consultar no concede progreso.
- Regresión de mapa, Pacto, preparación, arena, jefe, cierre, tienda, colección, intenciones, Halloween, acceso y PWA según consumidores tocados. Resultado y economía guardados antes de efectos; audio solo si la persona lo eligió.
- Evidencia: SHA/árbol candidato, comandos, configuración/fixtures, resultado y omisiones. Captura estática acredita composición, no animación; log temporal/acciones acreditan secuencia, no percepción; emulación no dispositivo físico.

## 6. Sesión humana preparada, todavía no realizada

Primer lote propuesto: 5–8 participantes voluntarios, fans casuales y alguna persona que conozca auto-battlers, declarando experiencia previa. Repartir idiomas sin prometer validarlos por una sola persona. Usar cuentas ficticias aisladas, mismas reglas y no la cuenta habitual. Duración orientativa de sesión 20–30 min; si la expedición real exige más, registrar corte/continuidad, no simular victoria para cumplir horario.

Objetivos de uno en uno, sin pasos:

1. «Empieza una partida y prepárate para explorar».
2. «Escoge a quién incorporar y llega a un combate».
3. «Cuéntame qué esperas de tu compañía antes de confirmarlo».
4. «Después del resultado, decide qué harías ahora».
5. «Intenta preparar una compañía distinta para otra expedición».
6. En otra visita acordada, «continúa donde lo dejaste». Esa visita solicitada no cuenta como retorno espontáneo K2.

Registrar duda/ayuda exacta, alternativa considerada, predicción antes y explicación después contrastada con log, errores y tiempo visible/espera separados. Preguntas neutrales: «¿qué cambió?», «¿qué te hizo elegir eso?», «¿qué probarías después?». No enseñar mientras se cuenta una tarea sin ayuda. Intervenir ante bloqueante, anotar intervención y no computar resolución autónoma.

No fijar un 80% de éxito o D1 40% copiando otro género. Primer lote busca problemas repetidos y bloqueantes; repetir con personas nuevas después de corregirlos. Una preferencia estética del equipo y un test verde no prueban personalidad o diversión. Para K2 hace falta seguimiento elegible, permitido y sin recordatorios artificiales.

## 7. Criterios de descarte, ampliación y aprobación

- **Ampliar** cuando el recorrido funciona, las alternativas tienen conveniencia distinta demostrable y las personas pueden reconocer el resultado con poca ayuda. Mantener incertidumbre si la muestra es pequeña.
- **Simplificar** si presets/objetivos requieren más gestión que el plan que facilitan, si dos opciones son equivalentes o si la ayuda tapa la escena.
- **Detener** ante integridad, una opción dominante sin renuncia, requisito de carta rara para iniciar, coste silencioso o espera añadida para fingir dificultad.
- **Pedir decisión específica** para PM10 ratios/consumo, PM12 calendario/recuerdo, PM13 acceso/botín/alcance regional o PM15 exposición/servicios externos. No bloquear tareas independientes de diseño por esa decisión.
- **No abrir todavía:** PvP/trading/chat, pase de temporada, rachas, notificaciones de presión, energía alternativa, XP persistente, nuevas monedas, recompensas por intención o ×2 encantado. Su coste de balance/operación no está justificado por datos actuales.

## 8. Cobertura de este estudio

Realizado: contraste documental/código, clasificación de quince propuestas, plan de métricas y validación, cálculo exacto de colección y verificación de documentos/enlaces locales. No implementado: todas las fichas. No ejecutado: nuevos recorridos de navegador, build/tests de app, cambios de DB/Redis, analítica real, entrevistas, escucha, teléfono físico, correo externo, despliegue o push. La documentación histórica de CI no se presenta como una nueva ejecución sobre este estudio.
