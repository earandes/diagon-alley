# Fichas nuevas PM16–PM24 · implementación futura

Propuestas del 19-10-2026. Complementan [PM01–PM15](FEATURES.md), sin sustituirlas ni duplicar su alcance. Prioridad única vigente en [PRIORITIES.md](PRIORITIES.md); esfuerzo S/M/L/XL definido allí. No se ha implementado ninguna ficha. «Sin cambio económico» no significa que ya esté autorizada para desarrollo.

## PM16 · Capítulos del Cromodex: descubrir y utilizar

**Valor/evidencia → problema.** Ya hay clasificaciones y vínculos reales, pero completar cartas y experimentar son objetivos distintos. El modelo da una cola aleatoria larga. Hipótesis: reconocer lo que el jugador aprende y usa sostiene metas intermedias sin rebajar probabilidades ni inflar poder.

**Diseño/recorrido.** Abrir una página temática → ver hasta tres hitos → escoger uno → ir a preparación → activar una combinación real → volver a la página sellada. Muestra inicial: capítulo «Compañías del Callejón» con subhitos separados: descubrir una identidad propia de una familia, activar un vínculo disponible en un combate confirmado y probar una segunda composición distinta. No exigir toda una casa, rarezas o poseer tres criaturas. Temporales válidos para el hito de uso, nunca para propiedad. No mezclar el porcentaje de página con 34 identidades base.

**Desbloqueo y renuncia.** Al completarlo, abrir una página breve de ilustración/contexto y una sugerencia voluntaria PM03, sin cromos, monedas, estadísticas o probabilidad extra. Elige un plan para observar, sin renunciar a jugar otro. Es progresión de conocimiento, no una elección económica. Evitar llamarla táctica si solo es un registro. Jugadores avanzados reciben reconocimiento de hechos históricos demostrables, sin conceder nada al consultar.

**Implementación/persistencia.** Catálogo pequeño de capítulos versionado, predicados explícitos sobre colección/receipts, proyección compartida con PM08. Si se necesita conservar la completitud al cambiar contenido, guardar hecho de capítulo y versión, no reinterpretar una versión terminada. Si el historial no demuestra uso anterior, marcar «sin registro» sin inventar fecha; permitir cumplirlo otra vez. Nada de motor universal de misiones, otra pantalla de recompensas o contador por apertura. `CollectionPanel`, clasificación, hechos de combate e intenciones; PM14 antes de escanear más historial en cada render.

**Arte/aceptación/validación.** Reutilizar libro, sello y emblemas; texto fuera del arte,ES/EN, dos packs y foco. Consulta/cancelación no completan uso; doble pestaña y replay no suman; derrota con vínculo activado sí puede cumplir el hito de uso. Pruebas de identidades duplicadas, temporales, caídos, versión vieja y datos ausentes. D15 progresión de capítulos/K3 planes; mantener si se entiende qué desbloqueó y se formula otra intención, no por tiempo de álbum. P2/M–L; PM03/05/06/08 como fuentes compartidas. Riesgo: convertir conocimiento en tareas vacías; limitar a una muestra antes de otro capítulo.

## PM17 · Ranas poseídas: abrir la siguiente con control

**Valor/evidencia → problema.** Abrir una rana ganada y compra+apertura ya funcionan. Cuando se acumulan varias, es razonable investigar navegación repetitiva, sin afirmar que sea un fallo reproducido. Valor potencial: conservar revelación y reducir viajes sin acelerar gasto.

**Recorrido/decisión.** Elegir una unidad disponible → abrir → resultado guardado → acción «Abrir otra» solo si sigue existiendo otra unidad poseída → continuar o salir. Última unidad: volver al Callejón; comprar continúa separado y con coste explícito. No compra por mantener pulsado, autoplay,«abrir100» ni temporizador que inicie la siguiente. Nuevo descubrimiento/encantado conservan su tratamiento actual; repetido puede omitir la secuencia con resultado estático actual, sin rehacer toda la apertura.

**Implementación.** Añadir continuidad al selector de unidades y resultado de `open-toad`, usando el comando existente por unidad. Bloqueo inmediato, siguienteIDderivado del inventario autoritativo actualizado y nueva operación solo por activación deliberada. No un lote económico nuevo ni inventario paralelo. Preferencia de omisión no determina el sorteo. Conservar key/propietario/versiones y resultado al recuperar; una unidad abierta en otra pestaña deja de ofrecerse.

**Aceptación/validación.** Cero/una/tres unidades, doble toque, error antes de commit, respuesta perdida, tabla nueva antes de confirmar, cuenta distinta, recarga durante revelación y omisión. «Abrir otra» nunca resta Coronas; no aparece para un producto consumido o incierto. D16 tiempo/pasos hasta siguiente resultado utilizable, G1/G2; observar si se prefiere esa continuidad sin ocultar el resultado. P2/M, sin nueva economía, depende de evidencia de fricción. Assets actuales; no nuevo sonido ni renderer.

## PM18 · Atelier de varitas: elegir para un portador real

**Valor/evidencia → problema.** Los tres núcleos distintos y las comparaciones de preparación ya existen. La mesa de forja ofrece materiales y precio, pero no vincula su elección a una copia y su equipo actual antes de gastar. La mejora es conectar sistemas, no crear especializaciones nuevas.

**Recorrido/decisión.** Escoger una copia propia como referencia → colocar dos varitas/recetas sobre la mesa → ver dos o tres diferencias reales → inspeccionar → forjar explícitamente o volver → equipar con confirmación existente → preparar y reconocer activación/condición real. Ejemplo: iniciativa frente a daño o recuperación, con amenaza pública ya conocida. No afirmar que ir primero cambie el objetivo ni garantizar victoria. La recuperación que sobra a PV máximos se explica; no calcularla como beneficio automático universal.

**Implementación.** Modelo de lectura de comparación compartido con preparación, incluyendo equipo equipado, condiciones y reglas efectivas. Distinguir receta vigente de instancia histórica/snapshot activo y señalar cuándo un efecto se aplica en otra expedición. Consultar una receta no crea equipo ni cambia el portador. Receta nueva solo tras reconfirmar versión/precio; la forja crea instancia, equipar sigue siendo operación aparte y explícita. Identificar ordinal/procedencia en copias repetidas; temporales no fingidos como propietarios de equipo permanente. Localizar consumidores reales de previews antes de añadir funciones; no duplicar fórmulas en React.

**Validación.** Pruebas primero de proyección con snapshot antiguo diferente, misma identidad/dos equipos, portador caído, inventario vacío y fondos insuficientes. Después escenarios emparejados existentes de dragón/fénix/wyvern, misma semilla y dos amenazas; mostrar casos donde cada una conviene, sin inventar victoria probabilística. PG/Redis solo si cambia contrato de guardar; compras/equipamiento y recuperación regresan intactos. D17 elección razonada/coste de preparación, D4 diversidad, G1/G2. P1/M; depende de PM06 para consecuencia y reutiliza PM04 cuando exista. Assets actuales, sin nueva estadística, receta o sala obligatoria.

## PM19 · Cuaderno de grageas: decidir el riesgo y reconocer el sabor

**Valor/evidencia → problema.** Ya existen cuatro especímenes, libro y asignación. La información relevante es distribución, momento, portador y resultado; descubrir cuatro sabores no convierte el inventario en cuatro tipos conocidos. Dos sabores tienen efecto adverso, sin equivalencia con derrota.

**Recorrido/decisión.** Consultar tarro → ver «sabor desconocido» y efectos posibles a demanda → comparar un portador y conservar el tarro → asignar o quitar → confirmar combate → ver activación en su unidad → actualizar sabor en colección. SiPVcompletos, explicar que menta podría no recuperar nada. Un personaje rápido o fuerte puede sufrir de forma distinta tierra/jabón; ofrecer datos, no prescribir el resultado aleatorio.

**Implementación.** Ampliar el cuaderno actual, no otra bolsa: tabla efectiva del snapshot, enlace contextual a la asignación válida y un hecho posterior PM06 derivado de `bean-activated`. PM03 «usar gragea» sigue siendo acción voluntaria, no «descubrir sabor nuevo» garantizado. Persistencia de descubrimientos sigue derivada del receipt válido y producto consumido; no flags locales al ver la ilustración. Mientras no exista combate preparable, indicar dónde se asignará sin avanzar ruta ni seleccionar rama.

**Validación/aceptación.** Tabla deliberadamente distinta en run antigua, cero/uno/varios, unidades repetidas, temporal, reserva y caído; asignar/quitar/cancelar no consume ni descubre; resultado perdido conserva sabor y dueño; combate perdido puede descubrir; omisión/idioma/replay no repiten. D18 localización de asignación y predicción de riesgo;K3 uso comprobado, no cantidad de compras. P1/M; riesgo económico bajo al mantener reglas. Arte de tarro/especímenes actual; sin nuevos efectos o sonidos en esta ficha.

## PM20 · Gringotts después de la llave: recuerdo y siguiente acción viable

**Valor/evidencia → problema.** Libro de posibles botines y retorno a preparación ya existen. El contenido actual da una llave y un resultado; convertirlo en tienda repetible requiere una regla nueva. La propuesta inicial mejora continuidad sin fabricar más llaves.

**Recorrido.** Antes de obtener llave: explicar su fuente verdadera. Con llave: conservar apertura actual, coste1 y probabilidades. Después: la cámara muestra discretamente el recuerdo de apertura confirmada, permite consultar exactamente qué entregó y prioriza usar una rana/equipo pendiente o volver a otro plan. Si no queda objeto pendiente, no mostrar «abre otra» ni prometer otra llave. Una apertura histórica no se celebra de nuevo.

**Implementación/persistencia.** Proyectar receipt propio`open-vault`y productos/equipo aún utilizables; no ledger nuevo de saldos ni copia local del botín. Limitar consulta/paginación según PM14. Si no hay receipt válido, no inferir apertura por una llave ausente; puede no haberse ganado. Separar sin llave/llave ganada/operación incierta/abierta y enlace contextual con cierreA63. `CommercePanel`, orientación de botín y gatewaydelectura si fuera necesario. Mantener ambas piezas exclusivas fuera de una completitud imposible.

**Validación.** Primera victoria/repetida, no gastar en consulta, deduplicación de llave, cancelación, recarga tras commit, dos pestañas, paquete/idioma y equipo histórico. Conservación exacta de inventario/receipts. D19 salida viable tras botín, consulta histórica/G1; no éxito definido por volver más veces a una bóveda agotada. P2/M. Sin nuevos premios, intereses bancarios, depósitos o coste de almacenamiento. PM24 es una propuesta económica separada, no parte oculta de esta ficha.

## PM21 · Una librería para el dominio de la región

**Valor y relación.** Primera tienda nueva candidata: librería de estudio, presentaciónDiagon provisional «Flourish y Blotts» y equivalente ARCANA por decidir. Da presencia física a PM08 y páginas PM16; **no implementa otro sistema de maestría**ni requiere la fachada para validar esos objetivos.

**Recorrido/decisión.** Encontrar un tomo → consultar hasta tres ejercicios viables → escoger uno o ninguno → preparar y realizarlo en expedición normal → volver al tomo marcado. Muestra: registrar una activación de vínculo y después un efecto registrado de otra preparación disponible. Un objetivo no cambia premios, enemigos, energía o rama. Si el segundo plan no está disponible con colección/Pactos actuales, ofrecer otro viable o dejarlo bloqueado con causa real, no pedir una rara.

**Desbloqueo.** Nuevos folios de conocimiento/ilustración tras hechos conocidos. Puerta disponible al consultar el primer resultado de combate; antes puede aparecer como lugar futuro sin señal de tarea urgente. Este umbral de presentación es propuesta, no acceso aprobado. Información táctica necesaria, ayuda y Cromodex continúan accesibles fuera de la tienda; no vender el derecho a entender el juego. Sin precio, regalo, moneda o bono automático por visitar. Las expediciones conservan costes vigentes, mostrados al iniciarlas.

**Implementación/producción.** Reutilizar predicados versionados PM08/16 e intenciones PM03. Primero tomo existente dentro de contexto actual; solo con evidencia de valor crear cuarto destino `ShopPlace`, fachada/interior, fallback, rutas de regreso y lista equivalente. No hace falta vídeo, nuevoNPCanimado o renderer. [SHOPS.md](SHOPS.md) acota arte y decisión de producción.

**Aceptación/validación.** Desde colección inicial y avanzada, ningún ejercicio obliga recursos ausentes; elegir/cancelar no inicia run; cumplimiento solo por receipt del propietario, sin dobles sellos ni premios; cambio de pack conserva el mismo objetivo. Pruebas de alcanzabilidad, versiones y regresión de tiendas/maestría. D20 comprender ejercicio y progresar voluntariamente, no visitas/fachadasabiertas. P2/Lpara experiencia con fachada; muestra S/M sobre libro actual. Riesgo: viaje redundante; si el tomo en Cromodex funciona igual, conservarlo y no construir tienda.

## PM22 · Rana temática: una alternativa a estudiar, no otra garantía

**Valor.** Candidato de obtención dirigida dentro de PM10: elegir un conjunto público para buscar un grupo. No mejora por sí misma la utilidad de repetidos. Compite con canje y encargo dirigido; no construir las tres soluciones por defecto.

**Diseño candidato.** Conservar rana general y estudiar una segunda clase de tabla, no una variante por casa. Elegir conjunto → ver identidades/probabilidades/precio/posibles repetidos → comprar y abrir explícitamente → mismo Cromodex. Nada de confundir color de caja con resultado asegurado. No restringir personajes ya obtenibles en la rana general ni retirar stock por reloj. El conjunto hipotético de ocho del modelo no fija su composición real.

**Implementación si se aprueba.** Añadir identidad/tipo de producto y tabla versionada en dominio, cotización, inventario, operación, receipt, recuperación y apertura. Una rana comprada conserva su contrato de tabla; cambio posterior no rerollear ni reinterpretar. Habrá que decidir si una consulta vieja requiere reconfirmar antes de compra, y conservar la tabla de la unidad ya comprada. Mantener acabado cosmético independiente, sin aumentar potencia. No resolverlo con un filtro local de resultados tras el sorteo.

**Decisión pendiente y calibración.** Precio, integrantes, acceso y política de conservación por unidad requieren aprobación. Comparar general/temática/canjeo/encargo como alternativas exclusivas y, solo después, posibles combinaciones: colección inicial/media/casi completa; grupos desiguales; mismos flujos aleatorios; gastos, P50/P90/P95, sequías, duplicados útiles y vías baratas dominantes. No extrapolar23 aperturas de una carta en ocho a completar34. D7/D21 yG1. P2/L–XLcondicional; riesgo alto. No cambiar probabilidades actuales durante este estudio.

## PM23 · Elaboración de sabor conocido: un desbloqueo posterior condicionado

**Valor/renuncia.** Tras aprender el riesgo actual, podría interesar preparar un sabor conocido en vez de aceptar azar. Esto cambia disponibilidad y equilibrio: no está implementado ni aprobado. Primera muestra conceptual solo con menta/pimienta existentes, sin inventar nuevas habilidades. Descubrir un sabor no concede unidades ni receta automática en esta fase.

**Recorrido propuesto.** Probar sabor → consultar una receta conocida y coste completo → elegir elaborar o mantener recursos para otro uso → obtener una unidad de sabor declarado → asignar a instancia → consumir en combate y comprobar efecto. Falta fijar requisito/coste/fuente con escenarios; no suponer mismo precio 5 ni canjear un tarro aleatorio por menta sin coste. No certificar seguridad de una receta mediante inspección de la unidad aleatoria: sería revelar el RNGfuturo.

**Implementación condicionada.** Nuevo tipo de consumible o metadata autoritativa de sabor conocido, receta/versiones, comando de elaboración atómico y ampliación explícita del contrato de asignación/activación. El motor ya conoce los efectos; no cambiar sus fórmulas. Las unidades aleatorias antiguas permanecen aleatorias. Tres decisiones previas: costes existentes a usar, acceso no bloqueado por suerte extrema, y si se necesita una tienda aparte. Estudiar esta receta dentro de confitería antes de producir botica.

**Validación y descarte.** Contrastar ausencia de consumo, aleatorio actual y conocido sobre mismas condiciones y semillas; medirPV finales, victorias, gasto por intento y si se vuelve obligatorio para jefe. Accesibilidad con colección inicial; no receta escondida tras raro/racha. Concurrencia/rollback/respuesta perdida/compatibilidad de beans y snapshots reales. D18/D21 yG1. P3/XLcondicional, riesgo económico alto. Si conocido domina todas las preparaciones por el mismo coste, revisar o descartar; una nueva fachada no resuelve ese balance.

## PM24 · Bóveda con elección explícita para un contrato futuro

**Valor.** Convertir una gran recompensa en decisión con intención. Alternativa concreta: escoger uno de los dos paquetes actuales, sin aumentar sus cantidades ni conceder dos premios. No es neutro económicamente: la elección permite adaptar utilidad y reduce riesgo.

**Recorrido candidato.** Llave elegible → dos paquetes completos conocidos → comparar con objetivo/equipo → elegir provisionalmente → confirmar un gasto de llave → recibir exactamente uno → usar botín. Cancelar conserva llave. La cámara no es otro sorteo disfrazado; si se mantiene azar, debe indicarse como alternativa de diseño separada, no prometer elección.

**Compatibilidad/decisiones.** No reinterpretar una llave antigua sin versión de concesión ni una operación ya iniciada. El catálogo actual usa llaves agregadas: si la variante se limita a futuras concesiones, hace falta identidad/procedencia/versionado de derechos o una migración explícita aprobada. No aumentar `campaignVersion` para regalar otra primera victoria. No existe ahora una nueva fuente autorizada de llaves; esta dependencia puede impedir ofrecer la variante a jugadores que ya gastaron la única. Resolver esa política antes de implementarla, sin compensaciones automáticas.

**Implementación si se decide.** `OpenVaultRequest` debe distinguir selección y contrato; validación servidor, versión, consumo/resultado/receipt atómicos y recuperación exacta. Estado histórico y RNG previo conservados. Modelo de utilidad por perfil: el valor esperado en Coronas no mide el beneficio adaptativo de escoger rana/varita frente a grageas/escoba. No prometer ambos equipos coleccionables: escoger uno sigue dejando el otro sin obtener.

**Validación/decisión.** Llaves antiguas/nuevas, cuentas con victoria previa, dos elecciones concurrentes, cancelación, respuesta perdida y versión obsoleta conPG/Redis. Comparar elección/azar con objetivos distintos, ingresos/recompras y aceptación de renuncia; D19/D21/G1. P3/L–XLcondicional, posterior a PM20 y decisión de premios. Si se busca repetirGringotts, una fuente finita futura debe aprobarse por separado; no interés bancario ni farmeo de llaves.
