# Fichas de próximos incrementos

> Ampliación del 19-10-2026: prioridad vigente en [PRIORITIES.md](PRIORITIES.md); nuevas fichas PM16–PM24 en [COMMERCE-FEATURES.md](COMMERCE-FEATURES.md). Las prioridades internas siguientes conservan el primer estudio.

Todas las fichas son **propuestas**. Prioridades y esfuerzo vigentes se definen en [PRIORITIES](PRIORITIES.md); métricas K/G/D en [METRICS](METRICS.md); aceptación común en [DELIVERY](DELIVERY.md). Los nombres de contratos nuevos son orientativos, no endpoints o funciones ya implementados. Ninguna estimación supone pruebas humanas realizadas ni autoriza producción en lote.

## PM01 · Medición mínima del recorrido

**Valor y evidencia.** Sin eventos de producto revisados, priorizar por cantidad de pantallas o tests puede invertir esfuerzo donde no existe una fricción real. El código conserva receipts, pero no registra de forma equivalente visitas, exposición a una elección o retorno. Valor de negocio: reducir decisiones a ciegas y coste de corregir tarde. Confianza alta en la carencia de evidencia; desconocido el impacto sobre jugadores.

**Experiencia.** Ningún panel de analítica dentro del juego. Durante un ensayo privado, registrar manualmente entrada→Pactos→primer combate→resultado→botín. Más adelante, instrumentación mínima del mismo recorrido, sin capturar texto libre o credenciales.

**Cambios/implementación.** Primero aprobar denominadores/eventos y crear fixtures de cálculo. Separar hechos autoritativos de observaciones UI; usar un puerto acotado de medición fuera del dominio económico. Consumir receipts para totales de operaciones y eventos específicos para visitas/tiempos, con deduplicación y métricas de cobertura. Fallo de medición no impide jugar. No instalar un SDK, servicio o almacén analítico por defecto; exportación agregada local/SQL puede bastar. Ver fases y esquema propuesto en METRICS.

**Persistencia/arte.** Datos mínimos seudónimos con retención explícita y entorno de prueba separado. No recrear fechas históricas ausentes ni introducir contadores de misión. Sin assets nuevos.

**Aceptación.** Un reintento no cuenta dos combates; un replay no cuenta otra victoria; dos pestañas no cuentan dos personas; cambiar de cuenta conserva el propietario de cada evento. Si se pierde una observación cliente, el informe declara cobertura incompleta y no inventa un embudo completo. La instrumentación no envía correos, tokens, semillas o inventario completo.

**Validación y decisión.** Comparar fixture conocida de eventos con resultados esperados y observación manual del mismo ensayo. Retención de cohortes todavía inmaduras debe mostrarse como pendiente. K1/K2/K3 y G1/G2; medir calidad antes que optimizar valores. P0/M; riesgo principal: falsa precisión y costes de captura excesivos.

## PM02 · Primera expedición con orientación contextual

**Valor y evidencia.** El kit conserva una copia propia y la ruta permite reclutar temporales. La guía ya existe; no se ha observado si explica el paso de colección pequeña a combate válido. Hipótesis: ayuda situada reduce bloqueos sin convertir al jugador en ejecutor de un tutorial. Valor: más personas llegan al bucle real antes de abandonar.

**Recorrido/diseño.** Entrar→preparar el inicial→consultar Pacto→elegir aliado→alcanzar formación válida→leer amenaza→confirmar combate→reconocer resultado. Un objeto o puesto pertinente recibe énfasis finito; una frase breve explica el impedimento actual. Ayuda ampliada al consultar. Permitir ignorar ayuda, explorar álbum, cancelar y volver. Ningún personaje gratuito extra, flecha que seleccione ramas o recorrido obligatorio añadido.

**Cambios/implementación.** Ampliar `ExpeditionGuide.tsx` con un selector puro de próximo objetivo derivado de estado, accesibilidad de nodos y reglas efectivas. Reutilizar `ExpeditionPreparation.tsx`, `NodePreparation.tsx` y Pactos. Las sugerencias no son órdenes ni sustituyen al servidor. Mostrar procedencia propia/temporal en el momento de incorporarla; no reiterarla como párrafo permanente.

**Persistencia/arte.** Preferencia de ayuda por jugador, inicialmente opcional; estado del tutorial derivado de hechos, no una segunda campaña. Guardar únicamente ocultación/consulta si hace falta y distinguirla del progreso. Reutilizar puestos, retratos y objetos; una muestra sin arte nuevo antes de producir nada.

**Aceptación.** Cuenta nueva con una copia puede formar equipo siguiendo opciones reales; cerrar ayuda no consume ni bloquea. Run antigua usa snapshot y no vuelve a ofrecer una incorporación resuelta. Con Esencia insuficiente se muestra coste/espera vigente, sin prometer combate gratuito. Volver tras recarga conserva formación y procedencia.

**Validación y decisión.** Tests de selector para estados sin formación/con temporales/listo/sin recursos, PG/Redis de comandos existentes y Linux ES/EN/ambos packs. Sesión humana: «prepara una expedición y llega a tu primer combate», sin explicar solución. K1, D1 y D2; si no mejora la explicación temporal/propio, revisar el punto de enseñanza, no añadir más texto. P1/M; dependencia PM01 manual o instrumental, no hosting.

## PM03 · Una intención de compañía que atraviese toda la ruta

**Valor y evidencia.** Intenciones actuales solo cubren otro compañero, afinidad o gragea. Casas y otros vínculos existen en preparación/mapa/combate, pero no en ese contrato. Hipótesis: un objetivo táctico visible convierte reclutar en elegir un plan. Valor: experimentación y un motivo específico para otra expedición.

**Recorrido/diseño.** Tras usar botín→escoger hasta una intención viable→preparar→ver contribuyentes/faltantes→comparar candidatos públicos→combatir→reconocer que se probó el vínculo. Ejemplo: «Probar criaturas», no «Ganar gracias a criaturas». Con dos identidades, medallón y tercer puesto previsto; con tres, mostrar nivel activo. No repetir un HUD ni tapar costes/nodos.

**Cambios/implementación.** Añadir una variante versionada de `IntentionChoice` para vínculo/grupo o casa concreta. Resolver disponibilidad y preview con `bondProgress`, `houseProgress` y snapshot efectivo; distinguir `houses` de una casa particular. Extender `set-intention.ts`, `availableIntentions`, `intentionProgress`, `ExpeditionIntentions.tsx` y mensajes. Cumplimiento procede de `house-activated`/`bond-activated` del bando propio en un combate guardado de la run vinculada; ver o seleccionar no cumple.

**Viabilidad.** Ofrecer solo si la colección propia permite intentar la formación o si el snapshot de una run ya iniciada publica candidatos alcanzables suficientes. Antes de generar una run no prometer ofertas futuras: si la generación no garantiza el camino, no ofrecer esa intención como segura. Diferenciar «intentar con Pactos» de «poseer tres criaturas». No pedir un raro ni garantizar victoria.

**Persistencia/arte.** Una intención por siguiente run; conservar tipos v1 e historial. Cambio o abandono explícitos sin premio. Guardar elección/propietario/run/versiones, no un contador manipulable. Reutilizar siete familias de emblemas actuales, sin sumar profesiones como pasivos.

**Aceptación.** Duplicados/encantados no inflan contribuyentes; temporales cuentan tácticamente y no descubren colección. Dos pestañas solo conservan una elección/revisión. Cambiar pack/idioma no modifica estado. Fin sin activación deja intento terminado, no cumplido; logs históricos sin eventos suficientes indican ausencia de evidencia.

**Validación y decisión.** TDD de disponibilidad/cumplimiento, snapshot deliberadamente distinto del contenido vivo, PG/Redis y respuesta perdida; Linux recorrido cierre→otra run→Pacto→activación. K3, D3 y D4. Entrevista: pedir anticipar qué cambia al elegir un candidato y explicar el efecto observado. P1/M; riesgo: sugerir un plan inviable o confundirlo con una misión premiada.

## PM04 · Tres formaciones recordadas, sin gestión repetitiva

**Valor y evidencia.** Formación y loadouts ya existen; no se ha localizado un sistema de varias formaciones guardadas. Hipótesis de fricción repetitiva pendiente de medir. Valor: comparar estrategias sin reconstruir cinco puestos, conservando decisiones deliberadas.

**Recorrido/diseño.** En preparación, abrir un pequeño portacartas→guardar formación actual en uno de tres espacios→consultar otra→ver diferencias→aplicar explícitamente al borrador→confirmar por el flujo existente. Identidad por retratos y emblema; nombres generados/localizados, sin exigir escribir. No otro menú permanente ni botón de equipar todo.

**Cambios/implementación.** Value object acotado de preset con copia exacta y orden, vínculo y revisión de formato. Comandos de guardar/borrar preset propios, separados de selección de run. Aplicar al borrador no inicia run. Primera versión **no aplica equipamiento automáticamente**: conserva loadouts reales y muestra los que difieran; tampoco guarda grageas, condición o temporales como propiedad. Máximo tres, sin repositorio genérico de builds.

**Persistencia/arte.** Tabla aditiva por jugador/preset o campo equivalente validado; sin saldos ni duplicar entidades. Guardado transaccional con key/revisión. Si falta una copia o la colección cambió, marcar puestos no disponibles y exigir reparación, nunca sustituir por otra copia del mismo personaje silenciosamente. Arte existente.

**Aceptación.** Dos copias iguales con equipo distinto mantienen copyId y orden. Guardar/cargar/cancelar no cura, consume, equipa o cambia la run. Preset anterior sin vínculo sigue siendo consultable con fallback explícito. No sobreescribir cambios de otra pestaña sin revisión.

**Validación y decisión.** Unitarias de compatibilidad/propiedad, PG/Redis concurrente y Linux con 30+ copias y filtro activo. D5 tiempo activo y número de operaciones para preparar otra compañía, K3 sin aumento de G1. Si las personas prefieren una sola formación o la reparación genera más fricción, limitar a recordar la última en vez de mantener tres. P2/M; PM03 primero aporta sentido a guardar variantes.

## PM05 · Cromodex que conecte un descubrimiento con un plan

**Valor y evidencia.** Ya hay filtros y copias; las fichas pendientes están deshabilitadas y ocultan nombre. Falta una conexión de objetivo elegido con obtención pública y utilidad táctica. Valor: curiosidad orientada, sin obligar a consultar una wiki ni mover el equipo al álbum.

**Recorrido/diseño.** Elegir casa/grupo en el álbum→ver identidades propias/pendientes→marcar un solo objetivo→consultar de dónde puede proceder→volver a preparar. Mostrar «Pacto: temporal» frente a «Rana: copia propia». Fuentes consultables mediante libro; probabilidades exactas del contenido efectivo. Conservar sorpresa: si una identidad pendiente no es pública, usar silueta y pertenencia solo cuando sea metadato público autorizado.

**Cambios/implementación.** Proyección de procedencias por ID/tipo desde catálogo/tabla/recetas públicos, sin duplicar porcentajes escritos. Añadir bookmark voluntario de identidad/grupo, independiente de intención de run; explicar la diferencia y ofrecer un enlace para probar un vínculo viable. `CollectionPanel.tsx`, clasificación y modelos de lectura; preparar sigue utilizando copia exacta fuera del álbum.

**Persistencia/arte.** Preferencia por propietario y versión de objetivo; un objetivo de catálogo retirado se archiva con motivo. No modificar descubrimientos o convertir temporales en cromos. Reutilizar marcapáginas/medallones; no generar una silueta nueva por cada carta pendiente.

**Aceptación.** Obtener una copia satisface solo el objetivo correspondiente; acabado no cuenta como identidad adicional. Comprar o ver un temporal no completa el objetivo permanente. Consultar porcentaje no consume; una tabla obsoleta exige reconfirmación por el contrato actual. 34/34 no se reduce por filtros ni mezcla recuerdos de temporada.

**Validación y decisión.** Modelo de fuentes contra tabla activa, snapshots, estados retirados y fallback; Linux con colección vacía/inicial/completa y ambos idiomas. D6 tiempo hasta identificar una fuente y D7 intervalos sin descubrimiento, no tasa de clic aislada. Mantener si las personas distinguen probar de poseer y encuentran una acción viable. P2/M; depende de decidir qué metadatos de cartas pendientes son públicos.

## PM06 · Un desenlace que permita aprender de cualquier combate

**Valor y evidencia.** `boss-facts.ts` ya extrae hasta dos hechos del jefe. Vínculos nuevos y duelos normales pueden utilizar evidencia equivalente. Hipótesis: entender qué se activó ayuda a revisar la preparación sin un panel estadístico permanente.

**Recorrido/diseño.** Terminar u omitir replay→resultado y premio confirmado→hasta dos símbolos con un hecho breve→detalle opcional→una acción de continuar o revisar formación. Ejemplos válidos: «La protección absorbió 3» o «Se activó la Orden» si el log lo respalda. No «ganaste gracias a…», «te faltó esta carta» ni ganador anticipado.

**Cambios/implementación.** Extraer una proyección común de hechos desde BattleLog/snapshot; reutilizarla en jefe y duelo. Ordenar por relevancia verificable: efecto del plan elegido si ocurrió y un segundo hecho distinto. Separar activación de cantidad efectivamente aplicada. Si no hay evidencia informativa, no inventar dos tarjetas. Enlace a preparación conserva estado y no repite combate; los datos completos continúan en registro.

**Persistencia/arte.** Derivar de receipt, sin nuevo estado económico. Logs legacy conservan ausencia de detalles. Misma fuente para DOM, traducción y alternativa reducida; no calcular un combate contrafactual en el navegador. Emblemas y retratos existentes, énfasis finito del objeto afectado.

**Aceptación.** Victoria/derrota/empate muestran hechos del bando propio y la instancia correcta. Curación truncada al máximo muestra cantidad aplicada, no nominal; absorción o remate sin efecto no se presentan como ayuda decisiva. Consultar histórico no vuelve a celebrar ni genera otra recompensa. Omitir llega al mismo resultado/facts.

**Validación y decisión.** Logs controlados de casas/Orden/Mortífagos/criaturas/beans/equipo y ausencia de eventos; pruebas del renderer con pausa/omisión/fallback en Linux. D8 comprensión posterior y K3 en siguiente intento, segmentado por colección. Si las personas repiten el texto sin poder relacionarlo con su preparación, cambiar selección/ubicación antes de añadir métricas de daño. P1/M; mantener botín principal A63.

## PM07 · Diario breve para retomar y comparar expediciones

**Valor y evidencia.** Receipts conservan hechos y run/snapshot; esto permite un historial derivado, pero no acredita un diario completo ya implementado. Valor: recuperar contexto después de días y aprender de otra formación, sin exigir memorizar ni jugar a diario.

**Recorrido/diseño.** Libro a demanda desde mapa/cierre→últimas cinco expediciones→resultado, desafío, compañía y hasta dos hitos→detalle de nodos→volver al punto actual. Run activa tiene prioridad. No otra pantalla inicial con estadísticas, puntuación o racha.

**Cambios/implementación.** Primero PM14: proyección resumida paginada por run desde receipts, índice de lectura y acceso por ID autorizado. Si faltan datos para reconstruir una run antigua, marcarla como incompleta; no unir receipts de runs distintas. Replay histórico solo cuando el log almacenado y su renderer son compatibles; no recalcular con motor actual. Mostrar cinco no significa borrar el resto.

**Persistencia/arte.** Índice/resumen derivado reconstruible; fuente de verdad siguen operaciones. Fecha solo si existe registro fiable; no inferirla del orden o UUID. Mismos resultados y fuentes congeladas. Reutilizar libro, retratos y sellos de desenlace.

**Aceptación.** Dos runs con nodos del mismo ID no mezclan premios; paginación no altera estado; saldo de un resultado histórico no se muestra como saldo actual. Cuenta que regresa ve su run activa y puede continuar; cambio de usuario invalida caché/selección. Los datos privados de otra cuenta no aparecen al reutilizar un dispositivo.

**Validación y decisión.** Fixtures multiversión, integración de permisos/paginación/consulta de operaciones antiguas, Linux/foco/recarga. D9 retomar sin ayuda, D5 preparación posterior y K2 como señal contextual, no atribución causal. P2/L; no implementarlo como cargar todo el historial en cada visita.

## PM08 · Dominio finito de la región, sin otra barra de poder

**Valor y evidencia.** Descubrimiento/Táctico/Maestría ya existen y no dan premios extra; falta una huella finita de lo que se aprendió. Valor: motivos voluntarios para repetir con planes distintos, independientes del azar de la colección.

**Recorrido/diseño.** Tras cierre/atlas→consultar hasta tres sellos de dominio→escoger uno viable como intención→intentar→ver evidencia al finalizar. Primera muestra propuesta: activar una casa, probar un vínculo no doméstico y superar el jefe en el desafío elegido. Son objetivos separados; el tercero no es requisito de historia. Afinar dificultad después de observar colecciones reales.

**Cambios/implementación.** Definiciones pequeñas versionadas, predicados puros sobre hechos de run y concesión de marca sin poder/premio económico. Reutilizar intención PM03, no otra misión cobrable. Si un sello necesita una colección ausente, mostrar condición en detalle y ofrecer alternativa alcanzable; no vender como camino obligatorio. No bonificaciones nuevas ni escalado enemigo por poseer sellos.

**Persistencia/arte.** Marca única por objetivo/versionado semántico y run de evidencia, en transacción de resultado o proyección derivada fiable. Elevar contenido no reinicia primera victoria ni concede otra llave. Sellos locales editables reutilizables; no medallas en cada nombre de combate.

**Aceptación.** Reproducir log/recargar no otorga dos marcas; contenido nuevo no reinterpreta log viejo. Un temporal puede acreditar una acción táctica sin convertirse en descubrimiento permanente. El 100% de dominio usa una lista finita y explícita, separado de identidad/sabor/temporada/acabado.

**Validación y decisión.** Matriz de elegibilidad por colección/condición y simulación sobre semillas emparejadas, más PG/Redis de concesión. D4 diversidad y K3; observar si alguien elige repetir sin premio extra. No ampliar número de sellos para compensar que ninguno interese. P2/L; requiere aprobación de objetivos concretos.

## PM09 · Encuentros con memoria dentro de la expedición

**Valor y evidencia.** Los tratos actuales ya ofrecen PV/PM y pasar; añadir más nombres con el mismo cálculo no demuestra variedad. Valor esperado: decisiones con contexto y consecuencia posterior, utilizando recursos comprensibles.

**Recorrido/diseño.** Una invitación en un encuentro→aceptar ayuda ahora o reservarla para un refugio alcanzable→ver el compromiso en un objeto→resolver allí o cerrar sin coste adicional. Prototipo: adelantar un efecto determinista existente o conservar su uso en otro punto, con beneficio total limitado; no dos curaciones por la misma oferta. Si el grafo no admite el segundo punto, no ofrecer la elección. Pasar es válido.

**Cambios/implementación.** Una sola cadena de dos momentos y dos variantes narrativas, sin motor de quests. Snapshot de oferta incluye destino/efecto/uso pendiente; preview y resolución comparten cálculo del dominio. Nueva semántica requiere tipos y versión para nuevas runs. No alterar las runs actuales ni prometer un evento aleatorio futuro.

**Persistencia/arte.** Estado temporal en run; recepción/uso únicos con revisión y receipt, consumido o expirado explícitamente al terminar. No pierde copias/equipo ni crea monedas. Reutilizar retratos/fachadas/objetos; producir solo un prop diferenciador si una muestra lo exige. Historia ES/EN breve.

**Aceptación.** Beneficio anticipado y reservado no se acumulan; no se puede cobrar tras derrota/otra run. Cancelar no registra compromiso. Grafo con bifurcación obliga a explicar el desvío antes de aceptar; ninguna ruta seleccionada automáticamente. Dos pestañas no resuelven las dos alternativas.

**Validación y decisión.** Comparar condición buena/baja, PV/PM, rutas corta/larga y cada opción con motor real; demostrar casos donde cada una conviene. Coste/beneficio y efecto económico indirecto de victorias deben mantenerse explícitos. D10 elecciones condicionadas por estado y K3; sesiones para anticipación/recuerdo. P2/L, aprobación de nueva regla puntual antes de implementar.

## PM10 · Duplicados sobrantes y cola de colección

**Valor y evidencia.** Modelo actual: media aproximada de 101,93 repetidos al completar 33 resultados elegibles. Los duplicados sí pueden tener equipo distinto, pero no multiplican contribuyentes de vínculo. Hipótesis de frustración/estancamiento pendiente de observar. Valor: conservar significado de cada apertura y evitar que completar dependa solo de una cola larga.

**Alternativas a comparar.** A) Sin conversión, mejorar explicación de copias útiles y planes PM04; B) canje manual de excedentes por faltante normal con ratios de ensayo 3/5/8, sin moneda intermedia; C) objetivo acotado de obtención dirigida a cambio de una renuncia existente, todavía sin regla elegida. La opción A conserva economía, pero no resuelve por sí sola la cola de propiedad. B/C cambian obtención: **no están aprobadas para implementación por este estudio**.

**Investigación/implementación condicionada.** Actualizar el modelo A87 con políticas de conservar copias, gastos reales y primeras victorias únicas; comparar mismo flujo RNG y colas P50/P90/P95, fuentes/sumideros, tiempo activo y espera separados. No sustituir 128 aperturas por horas usando un precio. Si se elige B, crear comando atómico de concesión dirigida con catálogo/versiones y selección explícita de unidades; precio/ratio/eligibilidad se aprobarán antes. La investigación puede entregarse como incremento independiente, identificándolo como decisión económica, no feature jugable terminada.

**Protecciones exigidas si se autoriza un canje.** Última copia protegida; bloquear equipadas, formación activa, reservas de run y operaciones inciertas; encantadas excluidas por defecto hasta decisión expresa. No convertir kit, recuerdo o temporal, no fusionar estadísticas ni cambiar rareza. Mostrar exactamente qué se entrega y recibe, deshacer selección antes de commit y recuperar el mismo resultado después. No eliminar inventario por una acción de consultar.

**Arte y valor de validación.** Primero escena con cartas existentes sobre mesa, sin producir taller nuevo. Tests de última copia, carreras, cambios de precio/tabla, pérdida de respuesta y rollback; comparación de caso desfavorable y exploración humana de la renuncia. D7 cola de descubrimiento, coste de completitud, conservación de variedad D4 y G1. Adoptar solo si mejora cola sin trivializar identidad ni crear un recurso dominante. P2/L–XL; riesgo económico alto, ratio no seleccionado.

## PM11 · Lectura accesible configurable que conserve la ilustración

**Valor y evidencia.** Ya hay teclado, foco, reducido, ampliación soportada y ajustes de reproducción/audio. No se ha localizado ajuste propio de contraste o tamaño de lectura en `GameSettings.tsx`. Valor: personas con necesidades visuales distintas pueden seguir la misma escena sin depender de zoom del navegador o color.

**Recorrido/diseño.** Ajustes→Lectura→Tamaño normal/ampliado y contraste normal/alto→preview breve→volver exactamente a la escena. Controles semánticos convencionales, pocos y con etiquetas; no cuatro grandes paneles. Contraste usa superficies locales detrás de nombres/PV y marcas de forma, conservando fondos/personajes. Configuración no cambia daño, tiempo de servidor o estado del replay.

**Cambios/implementación.** Preferencia local por dispositivo y tokens de CSS por pack; respetar `forced-colors`, zoom y sistema. Unificar tamaño funcional sin escalar canvas como bitmap borroso; geometría DOM notifica el renderer por su mecanismo actual, sin tickers extra. No forzar reducido propio a false cuando el sistema lo exige. Etiquetas ES/EN y fallback de almacenamiento.

**Aceptación.** 320 px/reflujo y texto al 200% mantienen unidades, nombres, PV, costes, foco y acceso a acciones. Inspectores admiten scroll; escena ordinaria no oculta actores. Cambio durante pausa conserva cursor/log; imagen ausente mantiene controles. Audio sigue voluntario e independiente.

**Validación y decisión.** Contraste real y WCAG pertinente; teclado/tacto emulado/reducido/forced-colors en CI Linux, lector y teléfono físicos después. G2 y severidad de barreras; observación con personas que necesiten esas opciones, no solo preferencias del diseñador. P1 transversal/M. Referencias oficiales en sources; no declarar certificación por detector sin findings.

## PM12 · Navidad: el correo perdido de las lechuzas

**Valor y evidencia.** Base estacional y propuesta de Navidad ya documentadas en A68/EXTENDING. Valor: regreso a un mundo reconocible con una aventura breve, no obligación diaria ni fuente nueva de recursos.

**Recorrido/diseño.** Sobre en entrada→consultar aventura/costes/fechas→participar→tres entregas ordenadas entre etapas existentes→ventanas iluminadas→postal permanente. Cada entrega ofrece resolver historia o utilizar el intercambio de condición existente y aplazarla. No minijuego desconectado, monedas navideñas, racha o cromos exclusivos exigidos para 100% base.

**Cambios/implementación.** Nuevo eventId/editionId y calendario de servidor con gracia; adaptación pequeña de presentación por evento y textos ES/EN. Reutilizar comportamiento de tres objetivos existente. Elegir destinatario o cometer errores no está soportado: quedaría como mecánica futura separada. Validar compatibilidad de participación activa Halloween al cambiar calendario y política de no combinar eventos.

**Persistencia/arte.** Definición congelada por participación, progreso de edición y concesión de postal una vez. Producir solo sobre/sello, postal y variantes de ventana tras muestra en dos packs; fuentes editables y presupuesto de peso. Sonido opcional reutilizado; no tema musical nuevo obligatorio.

**Aceptación.** Participante tardío puede conocer lo viable con tiempo restante; nada depende de tres días distintos. Cierre temporal conserva lo ganado y operaciones inciertas; cambiar idioma/pack no reinicia objetivos. Recuerdo sin potencia/valor económico, fuera del denominador base.

**Validación y decisión.** Reloj inyectado antes/durante/gracia/después, dos ediciones, concurrencia y PG/Redis; Linux recorrido completo. D11 descubrimiento/participación/completitud por tiempo disponible y opinión de la decisión, no solo porcentaje de premio reclamado. P3/L; probar interés de Halloween antes de producir lote estacional.

## PM13 · Segunda región con propósito propio

**Valor y evidencia.** Una región jugable; `bosque` desbloqueado no es campaña implementada. Dirección incremental aprobada en A55; roster de criaturas A87 ya existe. Valor esperado: transferir aprendizaje a amenazas nuevas, no añadir una caminata más larga con los mismos encuentros.

**Recorrido/diseño.** Cierre y uso del botín→atlas→consultar requisitos y amenazas→preparar explícitamente→nueva ruta→jefe propio→cierre y regreso. Hipótesis temática: bosque favorece decidir entre protección de primer impacto y recuperación sostenida utilizando reglas actuales. No presupone que todas las criaturas nuevas sean enemigos ni cambia sus stats por ser región dos.

**Cambios/implementación.** Primero una muestra cerrada de 6–8 nodos completos, declarada como ensayo y no como entrega del Bosque de 20 nodos del PRD. Si valida decisiones, ampliar contenido aprobado. Separar campaña/pools/versiones de apariencia y progreso; fijar acceso, temporales entre regiones y derechos de botín antes de construir. Las recompensas regionales son una decisión económica nueva, no copiar primera victoria cambiando ID.

**Persistencia/arte.** Snapshot de región/run, desbloqueo autorizado y operaciones compatibles. No migrar colección histórica ni renombrar IDs. Fondo, seis nodos, un jefe y props mínimos después de composición con arte existente. Estimar coste por escena y mantener pipeline coste cero; no lote de veinte personajes para justificar expansión.

**Aceptación.** Existe vía con colección pequeña declarada, decisiones distintas de la región uno y preparación con conveniencia opuesta en escenarios controlados. Consulta bloqueada no gasta; abandonar/cerrar no entrega premio. Primera victoria/repetición no se duplica por versiones. Se conserva volver a Pasaje y consultar runs anteriores.

**Validación y decisión.** Motor sobre mismas semillas y políticas declaradas, ES/EN/ambos packs, pérdida de respuesta y progresión real. D4, D12 dificultad por cohorte y K2, con sesiones para transferencia de aprendizaje. Detener si solo aumenta tiempo/HP o fuerza rara concreta. P3/XL; depende de consolidación y aprobación del alcance regional.

## PM14 · Persistencia y carga sostenibles para una partida larga

**Valor y evidencia.** `game-transactions.ts` lee todos los receipts y reescribe agregado/operaciones. No se ha medido una degradación concreta aquí. Valor: impedir que más horas de juego se traduzcan en cargas, costes y fallos crecientes; habilita PM07/08 y un piloto gratuito acotado.

**Investigación primero.** Medir fuera de la cuenta habitual con 0/100/1.000/5.000 operaciones ficticias: bytes de estado, queries/filas por comando, duración SQL, serialización, memoria y recuperación de la primera operación. Distinguir coste por receipt de tamaño de colección. No benchmark gráfico local ni barrido sin límites.

**Cambios posibles, sujetos a evidencia.** Seleccionar un único cuello de botella. Si lo confirma, separar lectura resumida de estado e historial paginado; persistir deltas o insertar operaciones inmutables sin borrar toda la historia, conservando el límite transaccional. Mantener consulta por key y proyecciones de sabores/intenciones/temporada: paginar UI no autoriza cortar la evidencia que esos modelos requieren. No event sourcing, microservicios o caché ilimitada.

**Compatibilidad.** Migración aditiva con índices/constraints, rollout reversible y lectura histórica. No borrar receipts para ahorrar ni cambiar derechos de primera victoria. Si se añaden timestamps, solo nuevos hechos con fecha fiable; los registros existentes no adquieren una fecha ficticia al reinsertarse.

**Aceptación.** Mismo comando produce mismo estado/receipt y recovery, incluso con 5.000 operaciones; query histórica no requiere reenviar una orden económica. Fallo antes/después de commit, dos conexiones, owner incorrecto y revisión incompatible conservan garantías. El cambio presenta mejora reproducible o no se adopta como optimización.

**Validación y decisión.** PG/Redis reales aislados, referencia emparejada y límites de muestra antes de medir; tipos/build/contratos. G1/G2, D13 bytes y filas por operación; coste por sesión como diagnóstico, no motivo para esconder contenido. P0 investigar/L; no optimizar solo porque el patrón parezca costoso.

## PM15 · Piloto privado con acceso recuperable y operación controlada

**Valor y evidencia.** Juego conectado local y cuentas reales de ensayo; gateway loopback y buzón privado impiden afirmar acceso remoto listo. Valor: poder observar uso real y recuperación sin depender de la sesión del ordenador del desarrollador. Es habilitador, no otra feature de login.

**Recorrido/diseño.** Invitación privada→web HTTPS→invitado o cuenta→verificación real→jugar→vincular→entrar desde otro contexto→recuperar exactamente colección/run. No obligar a registro antes de probar. Avisos honestos de piloto/servicio no disponible y ayuda dentro del estilo existente.

**Cambios/implementación.** Seguir estudio de despliegue previo: composición productiva separada, secreto/config por entorno, cookies/origen/proxy correctos, TLS PG/Redis, correo transaccional y copia/restauración. Vercel/Neon/Upstash es candidato, no proveedor ya validado. Un túnel local sirve como alternativa temporal con máquina encendida, pero no elimina obligaciones del gateway y correo. No abrir PostgreSQL/Redis al público ni exponer launcher de ensayo.

**Persistencia/operación.** Datos de prueba nuevos; traslado de partida habitual solo con autorización y verificación específica. Backup cifrado independiente, retención y prueba de restauración. Límites de cuentas/recursos y observabilidad mínima; no convertir automáticamente a plan pagado. No email/tokens en logs ni telemetría.

**Aceptación.** Cookie perdida con cuenta vinculada recupera mismo player; sesión invitada perdida no promete recuperación inexistente. Operación incierta no cambia de propietario. Correo llega a destinatario real de ensayo y funciona reset; mensaje capturado localmente no cuenta. Servicios caídos conservan salidas y receipts. Alta/baja y borrado necesitan política explícita sin improvisar eliminación de evidencia de integridad.

**Validación y decisión.** Ensayo remoto aislado autorizado posteriormente, dos contextos y restore real; coste/latencia bajo muestra acotada. D14 tasa de vínculo/recuperación y K2; adopción de cuentas no es monetización. P0 para piloto externo/L. Esta ficha **no autoriza publicar, contratar, abrir túneles ni enviar mensajes ahora**; requisitos externos y T01 permanecen.
