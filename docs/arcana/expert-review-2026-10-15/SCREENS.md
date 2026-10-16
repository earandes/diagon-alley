# A62 · Auditoría de pantallas y estados visibles

15 octubre 2026. **Solo análisis: ninguna propuesta de este documento está implementada.** Base visual: dos recorridos técnicos completos ES/EN y complementos en cuentas aisladas, capturas en `evidence/captures/`, YAML de contenido visible y GET/logs en `evidence/`. Se inspeccionaron composiciones de escritorio 1280×900 y móvil emulado 390×844, con muestras adicionales del mapa 865 px. Las imágenes de página completa incluyen contenido bajo el viewport: no debe confundirse altura del PNG con desbordamiento horizontal ni concluir que un control es inalcanzable solo porque aparezca bajo el pliegue. Ver medidas y cobertura en STATES.md/MOTION.md.

**E** = evidencia actual de captura/recorrido/medida; **C** = comportamiento inspeccionado en código, no necesariamente reproducido en esta revisión; **H** = interpretación experta o hipótesis de comprensión/interés. **P0** bloquea o compromete integridad; **P1** afecta recorrido/decisión principal; **P2** fricción o jerarquía; **P3** acabado. Una preferencia estética no se presenta como bug ni una automatización como usuario.

Todos los componentes citados están en `src/arcana/presentation/`. Las fichas muestran una captura representativa; los pares ES/EN y 1280/390 tienen el mismo prefijo en la carpeta. Las recomendaciones conservan semántica, foco y texto accesible aunque reduzcan texto visible. Conservar copia/receipts/tabla actuales es condición de cada propuesta, no una capacidad nueva.

## S01 · Entrada y bienvenida

**Función y evidencia.** Introducir el mundo y permitir empezar sin decidir entre varios menús. Ruta `#/map` antes de entrar; `App.tsx`, escena/entrada; [escritorio](evidence/captures/es-01-entry-1280.png), [móvil](evidence/captures/es-01-entry-390.png).

**Lectura/decisión.** La ilustración ocupa el campo; título y Entrar son el foco. Se sabe dónde se está y qué tocar. Marca y engranaje tienen tamaño secundario. La pregunta no debe ser “qué menú abre juego”, sino “quiero entrar”.

**Quitar/retener.** No añadir tres pasos de modo/región/personaje para una región. El título podría ocupar algo menos de ancho en escritorio para conservar la fachada; es P3/H, no un fallo. Mantener Entrar y nombre localizado fuera del bitmap. Ambientación suave, sin vídeo obligatorio.

**Estados.** Entrada→preparación; Ajustes→cerrar→entrada. Primera visita y regreso no equivalen a nuevo kit.

**Propuesta y aceptación.** Conservar esta composición como referencia de inmersión; futuro gesto de entrada breve enlaza con preparación sin pantalla azul intermedia. Un clic/Enter inicia navegación, no compra ni sorteo; repetir entrada no repite regalos. ES/EN, foco y reducido deben obtener el mismo destino. No hay evidencia para rehacer toda la entrada.

## S02 · Ajustes e información de partida

**Función/fuente.** Preferencias y explicación de guardado. `GameSettings.tsx:70–125`; [estuche actual](evidence/captures/es-02-settings-1280.png).

**Lectura/decisión.** Dos parejas visuales idioma/mundo; reducido debajo; información de partida al final. La selección se marca con contorno y sello, no solo color. Es una pantalla donde etiquetas explícitas aportan más que símbolos misteriosos.

**Quitar/retener.** Mantener Español/English, nombre de mundo y Reducir movimiento. No llevar idioma de nuevo al HUD. La salida con puerta puede confundirse con abandonar partida (P2/H); usar × para cerrar el estuche y reservar puerta para salir de un lugar. Convertir “Tu partida” en carta informativa es coherente; no ocultar limitaciones de sesión/guardado tras icono sin nombre.

**Estados.** Cambios de idioma/mundo inmediatos sin gasto; sistema+preferencia propia de reducido; ayuda desplegada; modal anidado en preparación/evento. Cancelación debe cerrar el nivel superior únicamente.

**Propuesta/aceptación.** Estuche único con cierre consistente, preferencias agrupadas y carta separada. Consultar/cambiar/recargar no cambia autoridad; Escape devuelve al origen, sin cerrar el diálogo padre; reducido del sistema no se aparenta desactivado desde un control propio. Verificar los cuatro contextos de apertura, no solo desde inicio.

## S03 · Preparación inicial y durante la expedición

**Función/fuente.** Seleccionar copias propias y revisar acompañantes. `ExpeditionPreparation.tsx:137–190`; [inicial móvil](evidence/captures/es-03-preparation-390.png), [activa](evidence/captures/es-18-preparation-active-1280.png).

**Lectura/decisión.** Título→cinco puestos→contador→cartas→confirmación. Inicialmente 0/5 y botón deshabilitado; con run, se conservan los propios y aparecen temporales. La elección ya está fuera del álbum: no volver a recomendar moverla.

**Problema.** P2/E+H: cinco huecos dominan incluso cuando solo existe una copia; pueden insinuar que es necesario llenarlos. En activa hay 3/5 con dos huecos intermedios y dos temporales al final: orden visual de procedencias no coincide con una fila compacta de tres. La incertidumbre real de comprensión es H, no reportada por jugador.

**Texto/visual.** Conservar nombres, origen y acción; cambiar párrafos por un hilo desde carta a puesto. Mostrar requisito contextual “puedes explorar” mediante sello/ayuda, sin convertir 3–5 de combate en 5 obligatorios para entrar.

**Propuesta/aceptación.** Puestos ocupados contiguos, reloj por temporal y vacíos secundarios; estado Listo derivado de la acción que se va a ejecutar, no colección única. Selección sigue siendo borrador hasta confirmar; consultar/cerrar no inicia; equipo modificado conserva PV/PM reservados; 1 propio puede iniciar exploración, pero no se ofrece duelo imposible sin explicación. ES/EN/teclado/toque.

## S04 · Inspector de copia y equipamiento a demanda

**Función/fuente.** Consultar una instancia y equipar. `ExpeditionPreparation.tsx`, `EquipmentArt.tsx`; [inspector](evidence/captures/es-04-inspector-1280.png), [bandeja móvil](evidence/captures/es-05-gear-tray-390.png), [equipo guardado](evidence/captures/es-28-equipped-390.png).

**Lectura/decisión.** Retrato/nombre→cuatro stats→varita/escoba→opciones del slot al tocarlo. Buena retirada del panel permanente. La tabla dice “Atributos del cromo”: no muestra necesariamente el poder efectivo con equipo.

**Problema.** P2/E+C: un arma más potente mantiene el 10 de poder base del cromo; sin distinguir base/efectivo, el jugador podría interpretar que equipar no hizo nada. P2/H: “Sin equipar” con × más objeto actual deshabilitado requiere entender que se elige una opción, no se abre otra pantalla. No se ha probado comprensión humana.

**Texto/visual.** Conservar PV/PM y efecto breve del objeto. Sustituir nombre repetido de receta por miniatura y cambio efectivo visible; mantener nombre completo al foco/ayuda. El propietario actual debe verse antes de transferir.

**Estados/transiciones.** Ficha cerrada/abierta, slot cerrado/seleccionado, objeto actual/alternativo/transferido, confirmación guardada y error; cerrar ficha vuelve a la misma copia.

**Propuesta/aceptación.** Comparador pequeño antes→después dentro del slot y sello de equipo actual. Equipar sigue siendo orden explícita inmediata, no borrador revertido por cerrar. Sin segundo cobro, una instancia/un portador, transferencia clara, condiciones de reserva intactas; recarga mantiene objeto y cerrar inspector devuelve foco a la misma copia.

## S05 · Mapa, estados de ruta y navegación equivalente

**Función/fuente.** Elegir el siguiente evento y anticipar ramas. `MapPanel.tsx:67–205`; [mapa escritorio](evidence/captures/es-06-map-1280.png), [móvil](evidence/captures/es-06-map-390.png), [segunda ruta](evidence/captures/es-32-map-repeat-1280.png).

**Lectura/decisión.** Nodos sobre callejón, caminos punteados, flecha/doble marco disponible; Inicio no interactivo. Escritorio 1280×900 adopta trazado horizontal, móvil vertical. Está implementada variación de ruta; no pedir “hacer random” otra vez.

**Problema.** P2/E+H: el fondo tiene muchos brillos/verticales, y los enlaces futuros compiten con disponibles. Los objetos son legibles como familias, pero no comunican beneficio individual antes de abrir. Nodos bloqueados siguen bastante presentes. El icono de lista se representa como una carta, no una lista reconocible.

**Texto/visual.** Conservar nombres accesibles, coste y ayuda a demanda. No añadir etiquetas permanentes a 16 nodos. Un único atril para el destino enfocado puede mostrar recompensa/amenaza/recluta sin ocultar mapa.

**Complemento actual.** [Lista equivalente](evidence/captures/es-E04-node-list-390.png) reproducida ES/EN: es una alternativa textual desplazable; la obligación de mapa completo se aplica a la escena, no exige ocultar filas de esta lista.

**Estados/transiciones.** Inicio, disponible, bloqueado, visitado, nodo seleccionado y lista equivalente; consulta cancelada conserva ruta, confirmación devuelve al mapa actualizado.

**Propuesta/aceptación.** Priorizar camino actual y siguientes; futuros con menor contraste y silueta intacta. Equivalente de lista con nombre visible al foco y mismos IDs/estados. Mapa completo sin scroll ordinario a tamaños definidos, sin esconder nodos; teclado llega a opciones habilitadas y puede leer la ruta; cambiar vista no cambia run/seed/visitas. Detalle de mecánicas en NODES.md.

## S06 · HUD de recursos y equipo compacto

**Función/fuente.** Orientar saldo/energía/llaves y permitir inspección/preparación. `PlayerHud.tsx`, `TeamHud.tsx:51–185`; [mapa con HUD](evidence/captures/es-06-map-1280.png).

**Lectura/decisión.** Moneda y cifras arriba; retratos abajo a la izquierda, navegación abajo. El equipo deja protagonismo al mapa, cumpliendo dirección. Energía usa el mismo símbolo de hoja que PM en otros lugares: riesgo de confusión P2/H.

**Quitar/retener.** No volver a mostrar todas las estadísticas por defecto. Mantener saldo/capacidad, portador y reloj. El segundo icono de hoja y la cifra 50/50 no explican por sí solos regeneración/coste: ayuda breve y diferente representación para PM personal.

**Estados.** Saldo pleno/insuficiente/regenerando; inspector por hover/foco/toque, fijación al tocar, Escape/cierre exterior; propio/temporal/debilitado; preparación modal.

**Propuesta/aceptación.** Diferenciar energía global con contenedor propio y PM con marca personal; contador de integrantes junto a retratos solo cuando evita bloqueo. El inspector debe permanecer dentro del viewport, accesible sin hover, mostrar origen y no interferir con nodos. Inspección no escribe; HUD usa estado confirmado/tiempo de autoridad, no reloj manipulable como fuente económica.

## S07 · Pacto

**Función y fuente.** Reclutar un temporal o pasar. `NodePreparation.tsx:161–230`; [captura actual](evidence/captures/es-node-pact-1280.png).

**Jerarquía y decisión.** El retrato de Ginny domina; reloj y “Aliado temporal” indican origen. Reclutar es primario; Pasar está deshabilitado con menos de tres integrantes. Ya no exige selección más confirmación cuando hay espacio. La proporción entre modal y rostro es más clara que en A59.

**Problema.** P2/E+H: no se anticipan afinidad, cambio de composición ni puesto destino. Pasar gris no explica por qué está inactivo; puede parecer un control roto. El asset superior repite una carta genérica mientras el retrato ya identifica al aliado.

**Texto y simplificación.** Conservar nombre y duración; retirar la cartita redundante o convertirla en sello de procedencia. Explicar el mínimo de tres por foco/ayuda, sin párrafo permanente.

**Estados.** Espacio disponible; equipo lleno con temporal reemplazable; cinco copias propias; pasar habilitado o bloqueado; cancelar consulta frente a pasar evento.

**Propuesta y aceptación.** Transición retrato→puesto y previsualización de afinidad. Con cinco, mostrar salida y entrada al reemplazar un temporal; con cinco propios, no presentar un selector vacío como tarea. Cancelar no opera; reclutar añade un temporal y ninguna copia; misma key no repite. Comprobar ES/EN, reducido y foco al nodo.

## S08 · Duelo: preparación contextual

**Función y fuente.** Evaluar pelea y confirmar coste. `NodePreparation.tsx:62–124`, `App.tsx:434`; [captura actual](evidence/captures/es-node-duel-1280.png).

**Jerarquía y decisión.** Título/asset→cinco de energía → tres rivales→botín→grageas→iniciar. Coste y recompensa están presentes. Falta equipo propio en la comparación; exige recordar su condición o salir a preparación.

**Problema.** P1/H apoyada en E: se enfrenta una fila de PV/poder enemigo a ningún resumen propio. No se ven velocidad/afinidad para interpretar la preparación. Más retratos no crean variedad si los planes de rival son idénticos; esta segunda afirmación es C, desarrollada en NODES.md.

**Texto y simplificación.** Mantener coste y cifras necesarias. Convertir “resolver con equipo actual” en dos pequeñas formaciones enfrentadas, sin paneles completos. Ayuda para reglas, no texto permanente sobre autoridad.

**Estados.** Formación válida/insuficiente, condición residual, energía suficiente/insuficiente, grageas disponibles/asignadas, primera/repetida y consulta cancelada.

**Propuesta y aceptación.** Atril con propio/rival, sinergias activas y preparación sin perder elección de nodo. Una confirmación nombrada. Abrir/cerrar o asignar en borrador no gasta; confirmar consume cinco de energía y las grageas asignadas una vez. Con menos de tres, explicar motivo y ofrecer un destino de preparación real.

## S09 · Refugio: PV y PM

**Función y fuente.** Elegir recuperación con coste de oportunidad. `NodePreparation.tsx:125–159`; [PV](evidence/captures/es-node-refuge-1280.png), [PM móvil](evidence/captures/es-node-refuge-focus-390.png).

**Jerarquía y decisión.** Dos tarjetas Vida/Maná y antes→después por aliado. La elección es reconocible; no falta un formulario. En la muestra ambas producen cero porque los personajes están al máximo.

**Problema.** P2/E+H: Descansar permanece igual aunque no produzca efecto; la serie 100→100/90→90 ocupa más espacio que el beneficio. PM usa el icono de energía general. Una compensación por estar lleno sería una regla nueva, no un arreglo visual.

**Texto y simplificación.** Conservar PV/PM y magnitud de recuperación. Cambiar flechas repetidas por barras de ganancia, con cifra consultable. Agrupar aliados sin cambio.

**Estados.** Lleno, herido, sin PM, caído; elección PV o PM; cancelar o descansar. El diálogo consultado no modifica condición.

**Propuesta y aceptación.** La vasija ilumina la ganancia prevista; cero indica “Al máximo”. Efecto exacto del 40%: PV puede levantar una unidad a cero, PM no recupera a caídos; reservas no se curan. Reducido conserva resultado. Cerrar no avanza; confirmar sí avanza aunque el beneficio sea cero según regla vigente.

## S10 · Cofre

**Función y fuente.** Elegir recompensa segura. `NodePreparation.tsx:89–124`; [móvil](evidence/captures/es-node-chest-390.png).

**Jerarquía y decisión.** Baúl grande→diez monedas y una gragea→Abrir cofre. La composición ya es coherente y no necesita más texto. Ajustes y cierre son secundarios.

**Problema.** P2/H: el popup es principalmente una confirmación ceremonial; la elección relevante fue la rama. No está probado que un jugador quiera eliminarlo; conviene mantener consulta/cancelación y acortar resolución.

**Texto y simplificación.** Conservar cantidades y Abrir cofre. No reutilizar metáfora de Gringotts que sugiera una llave inexistente. Prescindir de una segunda aceptación después de obtener.

**Estados.** Consulta, cancelación, envío, recompensa confirmada y recuperación. No confundir visitado con una nueva oportunidad de apertura.

**Propuesta y aceptación.** Al confirmar, tapa→objetos→destinos reales del HUD/inventario;600–900 ms omitibles después del receipt. Un comando entrega diez monedas y una gragea; consultar no consume, repetir key no duplica. Resultado guardado sigue consultable tras recarga u omisión.

## S11 · Encuentro: riesgo y consulta

**Función y fuente.** Arriesgar un resultado o avanzar sin efecto. `NodePreparation.tsx:233–247`; [captura actual](evidence/captures/es-node-encounter-1280.png).

**Jerarquía y decisión.** Sobre→Arriesgar/Pasar→ayuda→Descubrir. Hay dos niveles para una elección sencilla y ningún resultado posible visible por defecto.

**Problema.** P1/H apoyada en E: “Arriesgar” no revela qué se arriesga. Con PV bajo puede terminar la run (C). P2/E: selección y confirmación repiten intención; cancelar consulta y pasar evento son consecuencias distintas.

**Texto y simplificación.** Tres símbolos moneda/PV+/PV− para posibilidades; ayuda con pesos derivados y explicación breve. Mantener verbo de compromiso, relatos largos opcionales.

**Estados.** Riesgo/pasar, consulta de ayuda, cancelación, resultado económico/curación/daño y posible cierre por daño. Historia y efecto proceden del snapshot.

**Propuesta y aceptación.** Dos acciones directas cuando la previsualización comunique la consecuencia; reservar confirmación adicional para un riesgo que lo justifique. Cliente no decide resultado. Pasar visita pero no sortea; cancelar no visita; arriesgar genera un receipt con efecto y antes/después. Recarga e idioma mantienen resolución. Ningún peso cambia por esta propuesta.

## S12 · Jefe: preparación y compromiso

**Función y fuente.** Decisión de cierre. `NodePreparation.tsx`/`App.tsx`; [móvil](evidence/captures/es-node-boss-390.png).

**Jerarquía y decisión.** Máscara→cinco de energía → rivales con 80 PV/poder 6→cincuenta monedas, llave y rana→grageas→Desafiar. Existe diferencia visual de objetivo y botín; el panel usa estructura de duelo.

**Problema.** P1/H: la amenaza se reduce a cifras; no anticipa contrajuego porque el encuentro actual no tiene un patrón especial (C). La comprobación de formación no debería aparecer solo como error tras pulsar.

**Texto y simplificación.** Conservar coste, Desafiar y recompensa efectiva de primera/repetida. Protagonismo del jefe central y equipo propio, otros rivales consultables. No prometer fases o hechizos inexistentes.

**Estados.** Primera victoria pendiente o ya obtenida, energía/formación, condición, grageas, cancelación y combate confirmado. Son estados distintos de reproducción.

**Propuesta y aceptación.** Preparación compacta que compare formación/condición y permita equipar sin perder nodo. Primer jefe da una llave y rana; repetido no. Nuevo orden visual no equivale a cambiar IA. Verificar ES/EN, cancelación, recuperación y reducido; ninguna recompensa se genera antes del comando.

## S13 · Asignación de grageas antes del combate

**Función y fuente.** Elegir consumible por unidad. `BeanAssignments.tsx:28–118`; [bandeja móvil](evidence/captures/es-17-bean-assignment-390.png).

**Jerarquía y decisión.** Un drawer 0/2 o 1/2 abre filas de personajes; cada fila repite Sin Gragea y tarros numerados. Evita asignar una misma unidad a dos portadores por código, pero las opciones crecen como productos×integrantes.

**Problema.** P1/E+H: con un solo asignado, el diálogo móvil se prolonga y deja Iniciar duelo bajo el área capturada; requiere scroll interno. No es prueba de inaccesibilidad, sí fricción para revisar y confirmar. Las dos Ginny son instancias distintas con igual retrato/nombre.

**Texto y simplificación.** Una bandeja de grageas contadas y cinco retratos puede sustituir las listas repetidas. Tocar portador y seleccionar unidad sin exigir drag. Conservar riesgo/consumo, instancia y probabilidades accesibles.

**Estados.** Sin stock; unidad asignada/sin asignar; portador en pie; frasco reservado por otro; quitar asignación; cancelar; confirmación y error.

**Propuesta y aceptación.** Asignación por puesto, contador usadas/disponibles y confirmación al pie sin cubrir datos. Teclado equivalente. Consultar/cancelar no consume; cada unitId recibe como máximo una gragea y cada beanId tiene un portador. Cambiar idioma conserva borrador; error no se presenta como consumo confirmado. Solo el combate real activa y descubre sabor.

## S14 · Arena al comenzar y durante la reproducción

**Función/fuente.** Representar el combate confirmado; `BattlePanel.tsx:222–325`; [inicio escritorio](evidence/captures/es-arena-duel-early-1280.png), [jefe móvil](evidence/captures/es-arena-boss-early-390.png).

**Lectura/decisión.** Título, aviso técnico, vuelta, ronda/eventos y cuatro controles aparecen antes del escenario. Cada actor añade nombre, número, afinidad, nivel, PV/PM, varita y escoba. El resultado “Victoria” está visible con Eventos 0 de 28/87. La autoridad es correcta; la comunicación adelanta el desenlace.

**Problema.** **P1/E+C:** el desenlace se anuncia con el cursor en evento 0 y la arena se extiende más de una pantalla. Navegación fija tapa zonas intermedias mientras otros actores quedan bajo el pliegue. La separación de dos columnas existe, pero los paneles de texto dominan sobre personajes/acción. **H:** adelantar el resultado puede restar tensión; esa consecuencia emocional no se ha medido.

**Texto/visual.** Retirar de primer plano el aviso de implementación y el contador de eventos; conservarlos en consulta técnica opcional. PV, efecto activo y turno deben leerse visualmente; equipo/afinidad/nivel en inspector. Mantener Auto/pausa/2×/omitir accesibles con aspecto consistente.

**Estados/transiciones.** Entrada, reproduciendo, pausado, velocidad1×/2×, omisión, reducido, renderer no disponible y final; el cursor solo gobierna presentación.

**Propuesta/aceptación.** Arena encajada con seis actores visibles en el caso normal, centro de hechizos y controles compactos; ocultar resultado hasta final/omisión sin retrasar guardado. Leer el resultado guardado no cambia combate, pero tampoco debe anunciarlo anticipadamente por región live. Verificar 3–5 porlado, reducido/omitir, pérdida de renderer, texto ampliado y replays; no recortar actores para que parezca que cabe.

## S15 · Victoria, derrota, empate y resultado de arena

**Función/fuente.** Hacer comprensible el desenlace y volver al recorrido. `BattlePanel.tsx:303`, final y registro; [victoria de jefe](evidence/captures/es-arena-boss-result-1280.png), [victoria ordinaria](evidence/captures/es-arena-duel-result-390.png).

**Lectura/decisión.** La victoria acaba como palabra bajo todos los actores; los controles se deshabilitan pero conservan espacio. Volver al mapa sigue arriba. Rivales caídos se atenúan y PV queda 0. Derrota/empate existen por código; no se atribuyen a las dos rutas ganadas actuales.

**Problema.** P1/E+H: tras observar el desenlace, la acción útil y los objetos ganados no toman protagonismo; obliga a volver arriba o navegar. Repetir el mismo aviso técnico no explica qué se conserva al perder.

**Texto/visual.** Mantener Victoria/Derrota/Empate breves, estado de los aliados y recompensa real; desplazar estadísticas repetidas a consulta. Mostrar diferencia primera/repetida sin enumerar toda la política económica cada vez.

**Estados/transiciones.** Victoria ordinaria/jefe reproducidas; derrota/empate inspeccionados por código; final→mapa activo o cierre→otra preparación.

**Propuesta/aceptación.** Un cierre sobre el escenario al terminar: resultado, objetos confirmados y Continuar. Con derrota/empate, “conservas colección/equipo” a demanda y preparar siguiente intento; ninguna compensación inventada. La acción depende del receipt vigente, no del cursor visual. Omisión llega al mismo cierre; idioma/recarga no recrean premio ni batalla.

## S16 · Después del mapa: estado cerrado y nueva preparación

**Función/fuente.** Cerrar run y orientar el siguiente paso. `App.tsx:357–403`; [actual](evidence/captures/es-19-after-map-1280.png), [móvil](evidence/captures/es-19-after-map-390.png).

**Lectura/decisión.** Al volver del jefe, gran preparación 0/5 en el centro; tira de botín colapsada abajo y 7/7 arriba. Se puede iniciar otra expedición, pero ganar parece devolver al mismo inicio vacío.

**Problema.** **P1/E+H:** la jerarquía invita a reconstruir antes de aprovechar llave/rana. Esto no prueba pérdida de selección o partida: es el estado de preparación local de otra run. Tampoco falta acceso a bóveda en todo el juego; Misiones sí lo ofrece con llave.

**Texto/visual.** No añadir un informe largo. Mantener huella de equipo/ruta, objetos recibidos y “Expedición completada” breve. Preparación nueva pasa a una acción posterior, no al contenido dominante inmediato.

**Estados/transiciones.** Run won/lost/draw, objeto pendiente/usado, detalle cerrado/abierto y nueva formación en borrador; no iniciar sin compromiso explícito.

**Propuesta/aceptación.** Cierre material con llave→bóveda, rana→abrir y acción posterior preparar, sin tres botones equivalentes. Si un objeto ya se usó, actualizar destino. Con derrota, misma estructura con consecuencia correcta. Recarga reproduce el estado cerrado; nunca reinicia una run automáticamente ni gasta una rana para enseñar el cierre.

## S17 · Resultado guardado de nodo y detalle expandido

**Función/fuente.** Recuperar lo ocurrido y consultar consecuencia. `NodeResult.tsx:32–203`; [detalle de jefe móvil](evidence/captures/es-20-boss-receipt-390.png).

**Lectura/decisión.** Al expandir: título técnico, Volver a ruta, recompensas, párrafo de desbloqueo, enlace a localizaciones, Victoria, replay y vida/maná guardados. Hay información valiosa, pero ordenada como comprobante de software.

**Problema.** P2/E: textos y bordes de acciones se superponen en rótulos largos; “Resultado de nodo confirmado” consume jerarquía. P1/H: “Volver a ruta” después de cerrar jefe no expresa qué ruta existe; “localización desbloqueada” puede sugerir contenido disponible aunque atlas lo aclara.

**Texto/visual.** Nombre del evento, objetos y consecuencia deben sustituir encabezado técnico. Conservar estado confirmado y detalles de recuperación accesibles; no ocultar errores o primera/repetida. La narrativa opcional de Encuentro debe conservar su snapshot.

**Estados/transiciones.** Receipt colapsado/expandido, evento sin premio, premio primera/repetida, narrativa y replay; cerrar devuelve foco a ruta o siguiente acción válida.

**Propuesta/aceptación.** Un folio de consecuencia con acciones nombradas según estado: continuar ruta activa, usar premio, preparar nueva. Replay y diagnóstico en segundo nivel. El mismo receipt produce mismo detalle tras idioma/recarga; consultar no envía comandos. Etiquetas caben dentro de controles ES/EN y 200%de texto.

## S18 · Callejón y fachadas

**Función/fuente.** Elegir lugar, entrar y regresar. `ShopHub.tsx`, `shop-journey.css`; [escritorio](evidence/captures/es-08-alley-1280.png), [móvil](evidence/captures/es-08-alley-390.png).

**Lectura/decisión.** Tres fachadas diferenciadas, rótulo/función/Entrar. La intención de tienda es reconocible. Móvil recorre escaparates horizontalmente; ese scroll no incumple mapa sin desplazamiento.

**Problema.** P2/E+H: son tres láminas rectangulares sobre otra calle ilustrada; bordes/perspectivas no forman una arquitectura continua. P3: duplicar Entrar bajo cada fachada puede convertir escena en catálogo si la puerta ya es el objeto interactivo. No hace falta otro motor para resolver composición.

**Texto/visual.** Mantener nombres y función breve bajo demanda; puerta iluminada y umbral pueden sustituir botón externo. No dejar acceso solo en imagen sin nombre accesible.

**Estados/transiciones.** Fachada enfocada/seleccionada, desplazamiento móvil, interior y regreso; sin segunda región o tienda futura inventada.

**Propuesta/aceptación.** Fachadas con suelo/recorte coherentes y señal de destino relacionada con objeto —rana, varita, llave—; al foco, encender escaparate. Tres entradas equivalentes por teclado/toque, retorno conserva destino y foco, no gasto al explorar. Esquinas futuras solo si se rotulan no disponibles y no inventan tienda jugable.

## S19 · Confitería: selección de productos y retorno

**Función/fuente.** Comprar/abrir rana o conseguir grageas. `SweetshopScene.tsx`, `ShopExit`; [móvil](evidence/captures/es-10-sweetshop-390.png).

**Lectura/decisión.** Dos productos con precio bajo cada uno; acción primaria del seleccionado en mostrador. Flecha/puerta+Callejón ya comunica mejor retorno que el icono antiguo. La caja aparece mucho más pequeña que el tarro.

**Problema.** P2/E+H: escala desigual y separación entre producto seleccionado y acción pueden hacer menos obvio qué se compra; seleccionar producto no compra, lo cual protege gasto pero debe verse. No reintroducir compra y apertura competidoras: A60 ya lo solucionó para ranas.

**Texto/visual.** Mantener nombres, coste y verbo explícito; seleccionar ilumina peana y vincula ticket al producto. El área de probabilidad/info puede ser un libro/sello secundario sin parecer otro producto.

**Consulta de probabilidades.** [Libro actual](evidence/captures/es-E02-odds-1280.png) reproducido ES/EN, sin alterar estado. Retratos y porcentajes derivados son consultables; conservar esa transparencia, aunque una futura composición agrupe familias. No pintar porcentajes dentro de assets.

**Estados/transiciones.** Rana/gragea seleccionada, stock0/positivo, saldo suficiente/insuficiente, consulta, operación en curso y regreso.

**Propuesta/aceptación.** Composición de mostrador con producto seleccionado acercado y ticket junto a él; cambiar selección es gratis y preserva stock. Una acción económica por compromiso; saldo insuficiente explica motivo. Retorno funciona antes/después de compra, restaurando callejón y foco sin navegación ambigua.

## S20 · Compra y apertura de rana

**Función/fuente.** Pagar y revelar una copia, o abrir unidad ya poseída. `SweetshopScene.tsx`, `CardReveal.tsx`; [apertura actual](evidence/captures/es-13-opening-live-1280.png).

**Lectura/decisión.** Sin stock, Comprar y abrir 10; con rana poseída, Abrir 1 sin coste extra. Tras confirmación desaparece tienda y caja/rana ocupa la escena. Omitir y Continuar aparecen durante la secuencia.

**Problema.** P2/E+H: dos salidas durante el ritual pueden competir; Continuar usa un mapa, cuyo destino no describe por sí mismo que solo cierra la revelación. El círculo vectorial puede parecer decorativo separado del producto, aunque la composición ya está integrada mejor que A59.

**Texto/visual.** Mantener coste previo, Omitir y garantía de guardado a demanda; evitar diagnóstico técnico. Un solo gesto de salto al resultado mientras anima y luego decisiones de resultado.

**Estados/transiciones.** Sin rana→comprar y abrir; poseída→abrir sin cobro; petición pendiente→receipt→ritual→resultado; omitir/fallo/recarga conservan entrega.

**Propuesta/aceptación.** Cadena clara caja→rana→carta, con acción “Ver cromo” durante ritual y cierre contextual después. Reducido muestra resultado inmediato; fallo de animación también. Un comando/receipt por compra+apertura, stock antiguo abre sin recobro, respuesta perdida recupera resultado antes de cualquier reenvío. No desplazar espera al seleccionar producto.

## S21 · Revelación de cromo, rareza y acciones siguientes

**Función/fuente.** Celebrar y comunicar adquisición. `CardReveal.tsx`, `RevealTheatre.tsx`, `RarityBadge.tsx`, `StarRating.tsx`; [cromo real actual](evidence/captures/es-14-reveal-390.png).

**Lectura/decisión.** Retrato/marco dominan, nombre, rareza, estrellas, nuevo/repetido y dos objetos de salida. Los dos recorridos completos muestran un cromo común. El sondeo adicional de apertura A62 obtuvo común, inusual y legendario en otras cuentas aisladas: son operaciones distintas de esa captura. Épico permanece en las fixtures históricas A60, sin atribuirlo a una adquisición actual aquí.

**Problema.** P2/H: “Ver en Álbum de Cromos” y Continuar explican destinos, pero no conectan nuevo personaje con preparación; el mapa como icono de Continuar puede prometer algo distinto al cierre real. Rango y estrellas necesitan significado claro sin afirmar mayor potencia.

**Texto/visual.** Conservar nombre, rango, estrella y nuevo/copia; reducir “Cromo confirmado” a sello si nombre accesible queda. Duplicado no puede recibir felicitación de identidad nueva. No prometer conversión futura.

**Estados/transiciones.** Nuevo/repetido, cuatro rarezas por código/fixtures, muestras actuales indicadas, normal/reducido/omitido y retorno; no repetir celebración por consulta.

**Propuesta/aceptación.** Resultado con una acción principal contextual —ver cromo/preparar si procede— y continuar secundaria; misma jerarquía entre rarezas, diferencia en receta de movimiento/color/forma. No pulsos infinitos, ni sonido automático. Idioma/swap/reload no reaniman ni duplican; arte ausente preserva nombre/resultado.

## S22 · Grageas: compra, posesión y ayuda

**Función/fuente.** Entender consumible y llevarlo al combate. `SweetshopScene.tsx`, `ShopBook`; [poseída](evidence/captures/es-12-beans-owned-1280.png), [ayuda](evidence/captures/es-11-beans-help-1280.png).

**Lectura/decisión.** Tarro y coste 5; con unidad, Preparar equipo domina frente a otra compra pequeña. La ayuda muestra tarro→asignar antes de duelo→sabor al activarse, más advertencia de resultado adverso. Es coherente y conserva compra sin revelar sabor.

**Problema.** P1/E+C: el complemento actual ES/EN reproduce Preparar equipo después de comprar una gragea: [destino móvil](evidence/captures/es-E03-bean-destination-390.png). Abre preparación de mapa, sin ningún asignador de gragea; la unidad sigue disponible y no se consume ([registro](evidence/es-contextual-observations.json)). La asignación real existe ante duelo. La ayuda lo explica, pero no sustituye un destino contextual. P2/H: icono de duelo en el segundo paso no muestra el gesto de poner gragea a un aliado.

**Texto/visual.** Conservar advertencia de consumo/azar, no retirar por “poco texto”. Reemplazar segundo icono por retrato+gragea y mantener instrucciones cortas. No “abrir” tarro como si entregase cromo.

**Estados/transiciones.** Sin unidad, compra confirmada, ayuda abierta, preparación genérica y preparación real del combate; activación ocurre solo al comprometer batalla.

**Propuesta/aceptación.** Tras compra, enlace a mapa/duelo real o preparación con acceso visible al consumible; si aún no hay combate posible, comunicar dónde se asignará. Comprar+1 unidad, descubrir 0 sabores; asignar/cancelar 0 consumos; activar en batalla descubre sabor guardado. El recorrido complementario ya demuestra el destino y ausencia de asignador; queda por observar comprensión humana.

## S23 · Álbum principal y navegación de páginas

**Función/fuente.** Consultar colección permanente. `CollectionPanel.tsx:62–165/201`, `FlavourCabinet`; [escritorio](evidence/captures/es-15-album-1280.png), [móvil](evidence/captures/es-15-album-390.png).

**Lectura/decisión.** Título/progreso/cantidad/enlace de preparación/sabores/filtros aparecen antes de cartas. Cuatro entradas por página, pendientes como dorsos. La navegación inferior global atraviesa contenido en las capturas de página completa.

**Problema.** P1/E+H: el objeto “álbum” no domina al entrar; gran parte del primer viewport se dedica a otra familia y contadores. P2/E: cada pendiente repite rango y estrella incluso antes de descubrirlo, dando sensación de lista administrativa. El avance 1/8 queda bajo cartas y compite con navegación global.

**Texto/visual.** Mantener identidades vs copias y nombre/rareza al consultar; no repetir descripciones en cada tarjeta. Sabores como separador de familia, no bloque siempre encima de cromos.

**Estados/transiciones.** Descubierta/pendiente, propia en equipo, páginas, filtros y folio; álbum conserva identidad e instancia separadas.

**Propuesta/aceptación.** Álbum material con pestañas cromos/sabores, cartas al centro, número de página integrado y preparación como acceso contextual. Mostrar pendientes sin filtrar identidades secretas accidentalmente. Consultar/paginar/filtrar no escribe; rango/estrellas históricas no se recalculan; ES/EN, teclado y ampliación sin nav tapando acciones al llevar foco.

## S24 · Filtros y estados vacíos del álbum

**Función/fuente.** Encontrar pendientes/rango/copias. `CollectionPanel.tsx:82–121`; [drawer móvil](evidence/captures/es-16-album-filters-390.png).

**Lectura/decisión.** “Filtrar cromos” abre dos familias de iconos de rareza y descubrimiento. Los símbolos son distintos, pero un nuevo jugador necesita etiquetas de ayuda. En 390 el quinto control (Todos más cuatro rarezas) ocupa otra fila y crece mucho antes del contenido.

**Problema.** P2/E+H: el filtro desplaza el álbum más que facilitar una consulta; iconos con poco contexto pueden parecer recompensas disponibles. Vacío está implementado por C, no reproducido aquí todavía.

**Texto/visual.** Conservar nombre del grupo y etiqueta de opción por foco/toque; no usar solo color. Sustituir drawer grande por medallones del lomo/estuche compacto y resumen de filtro activo.

**Estados/transiciones.** Todos/rango y descubierto/pendiente, intersección sin resultados, limpiar filtro y cambiar página; no ocultar saldo o inventario por filtro.

**Propuesta/aceptación.** Cambiar filtro mantiene página válida o vuelve a primera con feedback breve; vacío incluye limpiar filtro y conserva colección total real. No checkbox visibles, sí semántica de selección y atajos accesibles. No altera descubrimientos/snapshots ni confunde contar resultados con total 30.

## S25 · Folio de personaje y copias consultables

**Función/fuente.** Consultar hallazgo sin configurar equipo. `CollectionPanel.tsx:167–199`; [folio actual](evidence/captures/es-E01-album-folio-1280.png), reproducido también en inglés y móvil. Diálogo con retrato/nombre/rango/estrellas/contexto/conteo/copias y nota de álbum de consulta. La consulta conservó exactamente el estado ([registro](evidence/es-contextual-observations.json)). Es distinto del inspector de preparación.

**Lectura/decisión observada.** Retrato protagonista, identidad y procedencia; copias como tokens. Se entra desde una carta descubierta. Configuración de equipo permanece en preparación, cumpliendo A59.

**Problema.** P2/E+H: una nota que explica que “aquí no se equipa” consume espacio si el acceso real a preparar no está junto al objeto. Los tokens numerados aportan cuenta, pero no distinguen copias con distinto equipo sin consulta separada.

**Texto/visual.** Mantener contexto breve y cantidad; larga biografía solo a demanda. No representar stats de una copia histórica como si fueran la definición actual. Enlazar instancia a preparación solo mediante acción explícita, nunca al abrir el folio.

**Estados/transiciones.** Carta descubierta→folio→cerrar/Escape; cantidad de copias consultable; no formación/equipamiento editable dentro del folio.

**Propuesta/aceptación.** Folio coleccionable con tokens y acceso a preparar identificable; lectura de personaje no exige operar equipamiento. Cerrar/Escape devuelven a la carta/página, 0 POST; copia nueva/repetida se entiende sin promesas de canje. Conservar retrato dominante y márgenes actuales; no aprobarlo como arte final por estar integrado.

## S26 · Sabores, descubrimiento y explicación

**Función/fuente.** Registrar sabores desde activaciones reales. `FlavourCabinet.tsx`; [posterior a batalla](evidence/captures/es-29-flavours-1280.png), ayuda ligada al libro de sabores.

**Lectura/decisión.** Contador 1/4 y cuatro objetos; uno coloreado, otros silueta/dorso. El progreso pertenece a colección, no a una compra de sabor conocido. El mismo armario también aparece en Misiones.

**Problema.** P2/E+H: repetir el bloque entero en varias pantallas desplaza el objetivo de cada lugar; detrás de un sabor bloqueado hay un dorso pequeño que no comunica causa del candado. El deseo de completar sabores no se ha observado con usuarios.

**Texto/visual.** Mantener nombre/efecto/descubierto al consultar; un frasco resumen 1/4 puede sustituir el bloque en Misiones y abrir la familia en álbum. La advertencia de que hay efectos adversos sigue accesible.

**Estados/transiciones.** 0/4, primer sabor, repetido, familia consultada y ayuda; compra no cambia contador, activación confirmada sí.

**Propuesta/aceptación.** Estantería de sabores dentro del álbum, objeto resumen donde proceda y viñeta de primer descubrimiento tras activación. Compra/consultar no descubre; solo un receipt con sabor confirmado, repetición de activación no duplica identidad; valores negativos nunca se anuncian como mejora garantizada.

## S27 · Taller: elección de madera y núcleo

**Función/fuente.** Crear equipo conocido pagando receta. `CommercePanel.tsx:156–210`; [actual](evidence/captures/es-25-workshop-1280.png).

**Lectura/decisión.** Dos bandejas de tres materiales, nombre técnico de receta, varita grande y Forjar 15. Hay propósito visual y los materiales tienen siluetas diferentes. El núcleo elegido es visible en la composición.

**Problema.** **P1/C:** Dragón domina otros núcleos al mismo precio/bonus; no se arregla con brillo o explicación. P2/E: “+2·×1,2” no se relaciona con un portador o poder final; el usuario elige receta sin ver cuánto ayuda a su equipo.

**Texto/visual.** Conservar precio, madera/núcleo y efecto exacto; mostrar comparación sobre un portador consultable, sin autoseleccionar o transferir. Nombre extenso de receta va a etiqueta de objeto, no a párrafo.

**Estados/transiciones.** Madera/núcleo elegidos, receta válida/no disponible, saldo suficiente/insuficiente y cotización; selección no modifica inventario.

**Propuesta/aceptación.** Banco de trabajo con huecos de materiales y varita ensamblada; vista previa de efecto sobre copia elegida. Hasta diseñar diferencias reales, no fingir ventajas del núcleo inferior. Elegir materiales no gasta; cotización usa versión; cancelar conserva recursos; coste y efecto mostrado corresponden al receipt. No valores nuevos en A62.

## S28 · Forja: confirmación y recompensa

**Función/fuente.** Comprometer gasto y recibir varita. `CommercePanel.tsx:94–146`, diálogo/resultados; [confirmación](evidence/captures/es-26-forge-confirm-390.png), [resultado](evidence/captures/es-27-forge-result-1280.png).

**Lectura/decisión.** Confirmación incluye párrafo de transacción, objeto/receta y confirmar/cancelar. Tras guardar aparece otro bloque grande debajo del banco con objeto repetido y Preparar equipo.

**Problema.** P2/E: el resultado alarga página, conserva arriba la compra, repite varita y genera una franja de color/fondo desplazado en la captura completa. No es una nueva tienda; es composición que no absorbe sus estados. P2/H: Confirmar forja no informa portador, lo cual es correcto si aún no se equipa, pero debe quedar claro.

**Texto/visual.** Coste explícito antes del compromiso y nombre del objeto después; explicación larga sobre cancelar a ayuda. Sustituir bloque de resultado por objeto terminado en el mismo banco, con destino de equipamiento.

**Estados/transiciones.** Cotizar→confirmar/cancelar→pendiente/error→varita confirmada→preparar; recarga recupera receipt sin segunda forja.

**Propuesta/aceptación.** Ensamblaje breve posterior al receipt y varita en pedestal; una acción Preparar y regreso a banco como secundaria. No equipar automáticamente. Un gasto/una instancia; consulta/cancelación 0; recuperación conserva misma receta y objeto; foco llega al resultado sin quedar tras la navegación. Reducido muestra varita terminada sin espera.

## S29 · Bóveda sin llave y con llave

**Función/fuente.** Consultar botines y usar llave poseída. `CommercePanel.tsx` modo vault; [sin llave](evidence/captures/es-09-vault-empty-1280.png), [con llave](evidence/captures/es-22-vault-key-1280.png).

**Lectura/decisión.** Puerta circular enorme con cerradura, llave/cantidad y libros Botines/Tu equipo. Sin llave ofrece buscar jefe; con llave inserción. La puerta vectorial tiene acabado liso frente al interior pintado: diferencia de familia P2/E+H, no recurso ausente.

**Problema.** P1/C: “Consigue una llave al vencer a un jefe” es incompleto tras ganar ya ese jefe, porque repetición no da otra. P2/E: dentro de puerta aparece llave 1 como coste mientras el inventario×0 queda fuera; dos cifras sin contexto pueden parecer contradictorias.

**Texto/visual.** Mantener coste 1 y disponible×0/1 con iconos/etiquetas breves. No ocultar probabilidades o prometer otro jefe jugable. Aclaración “primera victoria” bajo demanda, orientada al estado real.

**Estados/transiciones.** Sin llave, llave disponible, botines/equipo consultables, progreso de jefe pendiente/superado y regreso al callejón.

**Propuesta/aceptación.** Cerradura como objetivo, llave de inventario junto al hueco, material coherente con escena. Sin llave, destino real según progreso y mensaje de disponibilidad, no bucle de falso farm. Consultar Botines/Tu equipo 0 gasto; abrir exige 1 real; no gesto preciso obligatorio, teclado equivalente.

## S30 · Bóveda: confirmación, apertura y botín

**Función/fuente.** Canjear 1 llave por botín aleatorio confirmado. `CommercePanel.tsx`; [confirmación](evidence/captures/es-23-vault-confirm-390.png), [resultado](evidence/captures/es-24-vault-result-1280.png).

**Lectura/decisión.** Modal “Confirmar canje” con llave y párrafo; luego puerta vuelve a sin llave encima de bloque de botín. Objetos ganados y preparar son visibles, pero la puerta cerrada sigue dominando y vuelve a recomendar jefe.

**Problema.** P1/E+H: la respuesta parece un recibo añadido, no que se haya abierto el lugar; la continuidad llave→cerradura→interior→tesoro se pierde. La captura completa se alarga y muestra otro tramo de fondo/franja azul. No concluir por PNG que se perdió botín; GET sí lo confirma.

**Texto/visual.** Mantener 1 llave, aleatorio/tabla consultable y botín; “Confirmar canje” puede pasar a “Abrir bóveda · 1” con cerradura. Cancelar preserva llave y debe seguir explícito.

**Estados/transiciones.** Confirmación/cancelación, llave pendiente de consumir, receipt, dos ramas de botín y llave agotada; resultado usado sigue consultable.

**Propuesta/aceptación.** Puerta se abre al receipt, ilumina interior y muestra objetos en el mismo espacio; cada objeto enlaza a su uso real. Si se omite/reduce/falla arte, mismo botín estático. Solo 1 llave consumida, un receipt, ramas 50/75 y equipo según tabla, reapertura idempotente. Tras consumir no se ofrece otra apertura gratis ni se exige recomprar lo ganado.

## S31 · Misiones, atlas y futuro no jugable

**Función/fuente.** Orientar exploración/colección/jefe y mostrar alcance de región. `JourneyCabinet.tsx:25–100`; [antes](evidence/captures/es-07-missions-start-1280.png), [después del jefe](evidence/captures/es-21-missions-after-boss-1280.png), [tras gastar llave](evidence/captures/es-30-next-intention-390.png).

**Lectura/decisión.** Tres objetos con contadores, armario de sabores, CTA y atlas. Con llave, Abre la bóveda funciona y es correcto. Sin llave, own<3 orienta a Descubre otro mago. Bosque dice Próximamente y “ruta aún no disponible”: esa advertencia ya existe.

**Problema.** P1/C+H: la recomendación usa identidades únicas, no copias/formación/temporales/stock de ranas; puede mandar a tienda pese a tener una rana ganada o una formación válida. No es prueba de que un usuario comprara innecesariamente. P2/E: mucho espacio se va en bloque de sabores y atlas debajo del pliegue; el nombre Misiones promete más que el orientador sin objetivos reclamables actual.

**Texto/visual.** Conservar próximo objetivo y estado de campaña disponible vs acceso descubierto. Objetos secundarios pueden vivir en atlas/álbum; no inventar premios de misiones ni barras diarias.

**Estados/transiciones.** Antes del jefe, llave ganada, llave consumida, colección insuficiente para meta orientativa, acceso descubierto y campaña futura no jugable.

**Propuesta/aceptación.** Una brújula de intención con criterio transparente de inventario/estado, seguida de atlas consultable. Priorizar llave/rana ya ganadas y después preparación/colección según situación. Con 2 identidades/3 copias no afirmar que falta el tercer integrante; con Bosque desbloqueado no iniciar campaña inexistente. Idioma/swap no altera elección económica o progreso.

## S32 · Segunda intención y comienzo de otra expedición

**Función/fuente.** Repetir preservando colección/equipo. `App.tsx`/`ExpeditionPreparation`; [preparación](evidence/captures/es-31-next-expedition-1280.png), [nueva ruta](evidence/captures/es-32-map-repeat-1280.png).

**Lectura/decisión.** Volver a seleccionar copias y Entrar al mapa. La cuenta actual conserva la varita recién equipada y sus dos cromos, mientras los temporales de la run cerrada no se convierten en propiedad. El segundo grafo es diferente; esto es evidencia de recorrido, no garantía estadística de infinitas rutas distintas.

**Problema.** P1/H: no se explica qué propósito cambia al repetir; la ventaja de nueva varita es poco visible y el jefe repetido da menos. Elegir las mismas copias puede sentirse reinicio administrativo. No autoiniciar ni autoseleccionar en contra de la dirección aprobada.

**Texto/visual.** Mantener selección deliberada y nombres; pequeña huella de última formación/equipo puede ser una opción explícita “Usar esta formación”, sin conceder temporales vencidos. Mostrar diferencias antes de iniciar, no tabla completa de recibos.

**Estados/transiciones.** Última run cerrada, formación nueva vacía/elegida, inicio confirmado y grafo nuevo; run activa impide sobrescritura.

**Propuesta/aceptación.** Presentar una intención viable —probar sinergia, descubrir sabor o usar nueva pieza— con acceso a preparación. Solo sugerencia, no misión nueva o premio garantizado. Nueva run obtiene seed nuevo, versión válida, 0 nodos visitados, equipo poseído actual; colección/recibos/primeras victorias conservados. Inicio no cura una run activa por alternar ni se permite sobrescribirla. Tras primer jefe, comunicar recompensa repetida efectiva antes de comprometer otro combate.

## Lectura transversal y cierre de alcance

Las pantallas más coherentes hoy son entrada, consulta de Ajustes, cofre y revelación. Las mayores discontinuidades están en arena, cierre de expedición y absorción de resultados en tiendas. Añadir ilustraciones a paneles largos no resuelve la jerarquía: primero hay que decidir qué ocupa el escenario en cada estado y dónde continúa cada objeto confirmado.

Las propuestas que cambian solo presentación se separan de nuevas ofertas, XP, canje o balance. La implementación futura debe trazar cada cambio a su ficha/criterio y comparar capturas de las mismas condiciones. La validación humana se hará después: ninguna ficha afirma que la gente entiende, se divierte o vuelve porque el flujo técnico se haya completado.
