# PRD de exploración y colección en el Callejón Diagón

> Conversión íntegra del cuerpo de [PRD_Coleccion_Magica.docx](PRD_Coleccion_Magica.docx), versión 0.5. Conserva las 29 secciones, tablas, identificadores, fuentes y estados del original. Las propuestas de este documento no se convierten en decisiones aprobadas. El registro de trabajo está en [DECISIONS.md](DECISIONS.md). Las fuentes y afirmaciones se trasladan del original; esta conversión no constituye una nueva verificación externa.

Versión 0.5 · 8 octubre 2026 · Rarezas y aplicación en español e inglés

## 1 Visión y decisiones de partida

Enric ha elegido el Callejón Diagón como marco de la aplicación, con la tienda de los Weasley como primera tienda jugable y nuevas tiendas mediante futuras expansiones. Queremos explorar comercios mágicos, abrir productos y conservar los descubrimientos. La primera tienda mantiene ranas de chocolate, grageas y bromas; las ranas pueden revelar personas y objetos como adaptación del juego. Esta decisión amplía la visión de v0.3.

El recorrido comienza en el callejón y permite entrar en los Weasley, abrir productos, coleccionar y probar encargos. Ser aprendiz y probador sigue como propuesta para esa tienda. Las expansiones podrán aportar nuevas experiencias y conexiones entre comercios; todavía no se han elegido sus tiendas, mecánicas ni orden. Primero comprobaremos el interés por una experiencia completa en una sola tienda.

| Estado | Definición |
| --- | --- |
| Decidido por Enric | Callejón Diagón; Weasley primero; futuras tiendas. Ranas, grageas y personas/objetos en ranas. Rangos y distinta dificultad de obtención. Español e inglés desde el inicio. Apoyo de Decisions API solicitado. |
| Recomendación para probar | Web móvil; callejón y tienda ilustrados por capas; dos productos, 12 hallazgos, encargos de invento y sabor y colección permanente. Reglas concretas aún por validar. |
| Pendiente de elegir o validar | Público, arte, plataforma, retorno, canje, presupuesto y negocio. Nombres y balance de rarezas. Tiendas futuras, mecánicas, conexiones, acceso y precio. |
| Condición de distribución | Documentar los permisos y condiciones correspondientes al uso de Harry Potter. No hay licencia obtenida, tarifas negociadas ni autorización acreditada en este proyecto. |

### Qué entrega esta versión

Añade rareza de hallazgos y español e inglés desde la primera versión, por decisión de Enric. Conserva Callejón Diagón, Weasley primero y expansiones. Incorpora F16/F17, U24 y T13/T14. Nombres y balance, traducción, implementación y pruebas siguen pendientes.

Decisions API se documenta como apoyo para preguntas acotadas. No se ha ejecutado: no hay acceso configurado en esta sesión. Las recomendaciones de este PRD proceden de la revisión, no de respuestas atribuidas a esa API.

## 2 Evidencia y oportunidad de producto

La tienda oficial es un comercio de bromas de Fred y George, con inventos como orejas extensibles y surtidos saltaclases [R01]. Universal sitúa ranas y grageas entre los dulces de Honeydukes [R02]. En esta aplicación, añadir un rincón que revende dulces y cromos de objetos dentro de ranas son adaptaciones de juego. No afirmamos que los Weasley fabriquen todos esos productos.

| Referencia | Evidencia documental | Implicación para estudiar |
| --- | --- | --- |
| Hogwarts Mystery [R03] | Ya incluye cromos de ranas, minicolecciones, premios y tratamiento de repetidos. | La mecánica de cromos no es por sí sola una novedad. |
| HEXRPG [R04] | Su guía documenta un álbum Wizard Card Collection y exhibición en el perfil. | Colección y exposición ya tienen referentes en una comunidad fan. |
| Pokémon TCG Pocket [R05] | La página oficial describe dos sobres gratuitos diarios e ilustraciones inmersivas. | Suministro y presentación son referencias; no prueban qué provoca retorno aquí. |
| Potterlike [R06] | Su creador describe una aventura y desafíos recurrentes. | Evitar ampliar a un RPG general antes de probar la experiencia de tienda. |

### Nicho candidato

Fans adultos que disfrutan sesiones breves de descubrimiento, humor y colección, sin necesitar una campaña larga ni aprender un TCG competitivo. España y castellano son candidatos para operar una primera prueba. La investigación documental no demuestra un mercado desatendido ni descarta todos los competidores. T02 necesita observar productos realmente usados y T03 conocer hábitos de personas del segmento.

### Diferencia que intentaremos comprobar

Cada producto ofrece una experiencia distinta: la rana revela un cromo; las grageas descubren un sabor; las bromas futuras presentan un invento. Después de abrir hay una elección: conservar y perseguir un hallazgo, probar una combinación o preparar una vitrina. No esperamos que una tienda bonita o una animación prolongada sostengan por sí solas el juego.

El taller debe aportar decisiones comprensibles y reacciones divertidas. Si nadie vuelve cuando desaparece la novedad, ampliar envases o introducir escasez no demuestra que hayamos resuelto la causa. Se medirá retorno espontáneo, uso sin premio y razones de abandono, además de aperturas.

## 3 Alcance y catálogo de la primera prueba

Primera prueba: callejón navegable y una tienda completa, los Weasley. El catálogo propuesto sigue en doce identidades: cuatro personas, cuatro objetos y cuatro sabores; dos productos abribles. Las nuevas tiendas se reservan para expansiones. Los nombres y efectos siguientes preparan un ensayo, no un catálogo licenciado ni una aprobación editorial del canon.

| ID | Identidad propuesta | Familia y función |
| --- | --- | --- |
| C01 | Albus Dumbledore | Persona · colección y contexto |
| C02 | Minerva McGonagall | Persona · colección y contexto |
| C03 | Filius Flitwick | Persona · colección y contexto |
| C04 | Pomona Sprout | Persona · colección y contexto |
| O01 | Orejas extensibles | Objeto · Discreción 2, Diversión 0 · regalo |
| O02 | Varita de broma | Objeto · Discreción 0, Diversión 2 · regalo |
| O03 | Pantano portátil | Objeto · Discreción 2, Diversión 0 |
| O04 | Fuegos artificiales | Objeto · Discreción 0, Diversión 2 |
| S01 | Menta | Sabor · Discreción +1 · regalo |
| S02 | Pimienta | Sabor · Diversión +1 · regalo |
| S03 | Limón | Sabor · Discreción +1 |
| S04 | Hierba | Sabor · Diversión +1 |

Los atributos, los cuatro sabores de ensayo y sus efectos combinados son diseño de esta aplicación, no propiedades canónicas declaradas. T01/T05 revisan los nombres, material y contexto antes de distribuir. La variedad desagradable o inesperada de las grageas puede explorarse después; no ampliar sabores antes de medir coste y comprensión.

### Bienvenida y contenido conocido

Se entregan O01, O02, S01 y S02 permanentemente, marcados como regalos conocidos: la colección comienza en 4/12. Además, una rana y una unidad de grageas para abrir. No hay cromo de persona garantizado en la apertura inicial: explicar que la rana también puede entregar un objeto. Los cuatro regalos permiten resolver todos los encargos del tutorial sin depender del azar ni de préstamos.

La rareza entra en el prototipo como requisito; nombres y probabilidades se proponen en la sección 26. Variantes premium, energía, consumibles al jugar, PvP, trading, chat y pagos quedan fuera. La caja de bromas es P1, sin fecha ni producto disponible.

## 4 Productos tienda y resultados

| Producto | Entrega propuesta | Ritual y uso |
| --- | --- | --- |
| Rana de chocolate · P0 | Un cromo entre C01–C04 y O01–O04. Tabla R1 con rareza propuesta; copia permanente. U0 uniforme como comparación. | Tapa, rana que salta y cromo. Personas conservan contexto; objetos permiten probar inventos. Mezcla de cromos como adaptación. |
| Grageas de todos los sabores · P0 | Una ficha permanente entre S01–S04 por unidad. Tabla R1 con rareza propuesta; U0 uniforme como comparación. | Verter algunas grageas decorativas y destacar el sabor ya adjudicado. Descubrimiento y reacción breve; sabor reusable en taller. |
| Caja de bromas · P1 | Por definir: invento o contenido conocido, sin regla aprobada. | Solapas y reacción propia. No reutilizar la tabla v0.2 ni prometer una garantía sin especificar su contenido. |

### Control uniforme de comparación

| Resultado | Rana | Grageas |
| --- | --- | --- |
| Persona · categoría | 1/2 | No elegible |
| Objeto · categoría | 1/2 | No elegible |
| Sabor · categoría | No elegible | 1 |
| Identidad de persona u objeto concreta | 1/8 | No elegible |
| Sabor concreto | No elegible | 1/4 |

La tabla anterior es el control uniforme U0. La propuesta con rareza R1 está en la sección 26. Mostrar resultados elegibles, probabilidades exactas por identidad y versión activa; indicar redondeo. El color o toque de una gragea decorativa no permite cambiar el sorteo.

### Explorar y usar son acciones distintas

Tocar un producto en la estantería abre su ficha y nunca consume stock. El detalle tiene “Usar 1 rana” o “Usar 1 sobre”, con unidad y contenido explícitos. Volver deja todo intacto. Consumir y entregar se guardan juntos antes de animar. Omitir, recargar o repetir un toque conserva el mismo resultado.

Una ficha de objeto obtenida por rana desbloquea la misma identidad del taller: no existe una segunda versión del invento que haya que comprar. La futura caja deberá respetar esa identidad compartida y explicar cualquier contenido adicional.

## 5 Colección objetivos y repetidos

La colección tiene Personas, Objetos y Sabores. Cada identidad conserva nombre, ilustración, contexto, procedencia, rareza y copias; objetos y sabores añaden su efecto de taller. Los cromos de personas aportan relato. Rareza no aumenta potencia ni el total base de doce identidades.

### Objetivo elegido y rutas reales

F09 permite elegir una identidad pendiente. Para persona u objeto: abrir rana o canjear excedentes de cromos. Para sabor: abrir grageas o canjear excedentes de sabores. La ficha separa posibilidad de garantía y explica cuántas copias faltan para un canje. Si no hay stock, el taller y la colección siguen disponibles.

### Canje manual propuesto

Tres copias excedentes de la misma familia de resultado por una identidad faltante elegida de esa familia. Familia Cromos incluye C01–C04 y O01–O04; familia Sabores incluye S01–S04. No mezclar cromos y sabores. Conservar al menos una copia por identidad, incluidos regalos. No convertir repetidos automáticamente ni añadir una moneda de polvo.

| Caso | Resultado esperado |
| --- | --- |
| O01 con cuatro copias | Tres pueden seleccionarse; queda al menos una. |
| O01 con dos y C01 con tres | Una de O01 y dos de C01 permiten un canje a un cromo faltante. |
| Dos cromos sobrantes y un sabor sobrante | No permiten canje; las familias son independientes. |
| Catálogo de familia completo | No hay destino faltante; conservar copias y explicar el estado. |
| Cancelar o reintentar tras timeout | Cancelar intacto; reintentar recupera una única operación. |

### Qué cambia respecto a la versión anterior

Las cifras de completitud de v0.2 no describen este catálogo. T08/T13 simularán regalos, suministro, rareza R1 y control U0. Comparar canje 2:1, 3:1 y 4:1, elección de producto y tiempo hasta el objetivo. No hay simulación nueva ejecutada en esta versión.

Conjuntos temáticos pueden organizar el álbum, pero no entregan productos en este ensayo. Esta elección evita añadir premios a los regalos, tutorial y suministro antes de modelar la velocidad de completitud. La colección permanece disponible al terminar.

## 6 Juego en el taller de pruebas

Propuesta B: preparar pequeños encargos combinando un invento y un sabor. Es un puzzle de elección con una resolución breve y explicada, no un combate ni un TCG. El personaje del cromo aporta contexto de colección; no hace falta obtenerlo para jugar. El usuario puede cambiar la combinación antes de confirmar y ver los dos requisitos.

Puntuación de laboratorio: el objeto aporta Discreción y Diversión; el sabor suma 1 a uno de esos rasgos. Se gana cuando ambos valores alcanzan los mínimos del encargo. Son efectos diseñados para probar la mecánica, no atributos del canon. Inventos y sabores son permanentes y reutilizables; ni acertar ni fallar consume copias.

| Encargo | Mínimos Discreción Diversión | Solución de bienvenida | Primer premio |
| --- | --- | --- | --- |
| E1 Escuchar sin molestar | 3 0 | O01 + S01 | Una rana |
| E2 Una sorpresa escandalosa | 0 3 | O02 + S02 | Un sobre de grageas |
| E3 Una broma discreta y alegre | 2 1 | O01 + S02 | Una rana |

| Combinación inicial | D Dv | E1 | E2 | E3 |
| --- | --- | --- | --- | --- |
| O01 + S01 | 3 0 | Gana | Falla | Falla |
| O01 + S02 | 2 1 | Falla | Falla | Gana |
| O02 + S01 | 1 2 | Falla | Falla | Falla |
| O02 + S02 | 0 3 | Falla | Gana | Falla |

### Ejemplo de una sesión

Un encargo pide una broma discreta y alegre. El jugador prueba orejas con menta: obtiene 3 y 0 y ve que falta diversión. Cambia a pimienta: obtiene 2 y 1, cumple ambos requisitos y confirma. La reacción muestra el efecto de la preparación y explica la decisión. La primera resolución concede una rana; repetir ofrece práctica sin otro premio.

O03/O04 y S03/S04 ofrecen alternativas con puntuaciones equivalentes en el ensayo; no hacen obligatorio ganar el sorteo. Esto puede resultar demasiado obvio: T11 debe medir si preparar y repetir sin recompensa interesa. Una reacción graciosa no basta para afirmar profundidad. Si B no aporta valor, conservar colección A y revisar o reducir el taller.

Hay tres premios de tutorial, una vez cada uno por usuario, versión y encargo. No cambian por reiniciar el cliente. No hay regalos adicionales por repetir una solución, terminar un conjunto o abrir el premio. La validación del servidor calcula la combinación; no acepta un “gané” del cliente.

## 7 Suministro gratuito y razones para volver

Los regalos y tutorial son finitos. Para un piloto de varias sesiones se propone una fuente gratuita independiente del rendimiento: un vale de producto cada 24 horas desde el alta, primera acreditación a las 24 horas, reserva máxima tres. Cada vale permite elegir rana o grageas. Es una hipótesis para comparar, no una regla comercial aprobada. No se venden vales en este alcance.

| Fuente o uso | Presupuesto del ensayo |
| --- | --- |
| Bienvenida | O01/O02/S01/S02 conocidos; una rana y un sobre de grageas para abrir; cero vales iniciales. |
| Tutorial | E1/E2/E3 dan rana/grageas/rana al primer triunfo; práctica no da premio. |
| Suministro recurrente candidato | Un vale por intervalo de 24 horas; reserva tres; elección de uno de los dos productos. |
| Canje | Tres copias sobrantes de una familia por una faltante de esa familia; no da producto ni vale. |
| Colección completa | Sin premio adicional en este ensayo; consulta, favoritos y práctica disponibles. |

### Reserva y tiempo sin ambigüedad

No hace falta entrar a la hora exacta. El servidor aplica al regresar los intervalos completos transcurridos y avanza el cursor por todos ellos. Si la reserva estaba llena, las acreditaciones que exceden tres no se guardan para después: explicar que se detiene la acumulación y comparar con una variante sin límite. Los vales ya acreditados no caducan. No combinar esta propuesta con sellos semanales.

Ejemplo: sin gastar, al volver a las 96 horas se acreditan tres vales, no cuatro. Si se gasta uno, no se recupera inmediatamente el cuarto intervalo omitido. La siguiente acreditación depende del siguiente intervalo completo desde el alta. Hora UTC en servidor; fechas visibles localizadas. El prototipo local no demuestra resistencia a manipulación de reloj.

### Engagement como hipótesis observable

Curiosidad por el producto, humor en la resolución, progreso hacia un objetivo elegido y combinaciones que se puedan anticipar. Después de abrir se propone una siguiente acción pertinente, sin obligar a jugar para seguir coleccionando. Favoritos y una vitrina personal pueden ofrecer expresión; la exhibición social sigue diferida.

Un catálogo de doce puede agotarse pronto. Un piloto de 14 días mide interés inicial; no demuestra continuidad de meses. Antes de lanzar un producto continuo, T08/T12 deben conocer velocidad de completitud, frecuencia elegida de producto y capacidad de publicar encargos o colecciones con contenido antiguo conservado. No prometer temporada o novedad semanal sin producción medida.

## 8 Recorrido inicial y segunda sesión

Objetivo de diseño: mostrar un recorrido completo en unos cinco minutos, sin imponer ese tiempo con esperas. La duración real se mide. Acceso invitado en prototipo; cuentas cuando sea necesario recuperar sesiones del piloto. Los resultados guionizados para enseñar un repetido o un sabor están rotulados y fuera de estadísticas de sorteo.

| Momento | Experiencia | Qué comprobar |
| --- | --- | --- |
| Entrar | Callejón, escaparate Weasley y promesa explorar abrir coleccionar; explicar guardado local. | Identifica la tienda disponible y entra; calle y lista dan acceso equivalente. |
| Recibir | Dos inventos y dos sabores conocidos; rana y grageas disponibles. | Distingue regalos de sorteos; colección 4/12. |
| Explorar rana | Ficha con contenido posible y consumo exacto. | Tocar estantería no consume; puede volver. |
| Abrir rana | Entrega guardada; salto y cromo omitibles. | Nuevo o repetido, persona u objeto, persiste. |
| Coleccionar | Ver ficha, álbum y elegir un hallazgo objetivo. | Reconoce su siguiente ruta disponible. |
| Abrir grageas | Descubrir un sabor y una reacción breve. | Comprende ficha permanente y repetidos. |
| Probar taller | E1 con regalos; revisar combinación y confirmar. | Explica qué cambió y recibe premio único. |
| Cerrar | Objetivo, stock y próxima acción real. | Puede salir; no depende de racha o urgencia. |

### Regresar

Recuperar operaciones pendientes antes de mostrar saldo. El callejón permite regresar a los Weasley; objetivo y productos mantienen su estado al entrar y salir. En piloto, aplicar reposición antes de mostrar saldo. Con stock cero, colección y práctica siguen disponibles; nunca ofrecer apertura imposible. El objetivo distingue posibilidad de obtener una identidad y canje a faltante.

Local: “Guardado en este dispositivo”, exportación/importación JSON validada y reinicio con confirmación. Piloto: recuperación autenticada y datos de servidor. Reiniciar demo inicia otra ejecución de prueba, no desbloquea premios económicos en cuentas. No importar la colección local manipulable como saldo confiable del piloto.

### Comparar A y B de forma justa

Colección sola y colección con taller deben recibir igual catálogo, arte, duración de apertura y presupuesto de productos. En A, asignar los productos equivalentes del tutorial sin obligar al puzzle y registrar exposición. Así el retorno no se atribuye al juego cuando proviene de abrir más unidades.

## 9 Callejón tienda navegación y pantallas

Entrada: callejón ilustrado 2.5D y lista equivalente de tiendas. Solo Weasley jugable; otros escaparates, si aparecen, indican no disponibles y no prometen fecha. Dentro, una zona por vez: Dulces, Bromas y Mostrador. Tocar abre tienda o ficha sin gastar. Fondo decorativo y botones HTML; sin cámara libre ni precisión de gesto.

Navegación candidata: Callejón, Taller y Colección. Taller lleva a los Weasley mientras sea la única tienda. Entrar y volver conserva posición y foco; cada tienda identifica su nombre y salida. Detalle vuelve al origen; apertura y resultado pertenecen a una operación. Mi objetivo es contextual, con ajustes accesibles desde cualquier vista.

| Vista y features | Información principal | Aceptación |
| --- | --- | --- |
| Callejón y tienda F01 | Tiendas disponibles, acceso, retorno, stock y escena/lista. | Entrar/salir no gasta; foco y progreso conservados; futuras no disponibles. |
| Producto F02 | Envase, entrega, candidatos, probabilidades, consumo. | Coincide con versión; volver intacto. |
| Apertura F03 F04 | Pendiente confirmado animando; omitir. | Entrega antes de animar; recuperar al recargar. |
| Resultado F05 | Nuevo/repetido, familia, nombre, rareza, copias y acción. | No confunde persona, objeto y sabor. |
| Colección F07 | Tres familias, filtros, pendientes y copias. | Regalos cuentan; progreso de familia y total coherente. |
| Ficha F08 | Contexto, efecto, procedencia, rareza y copias. | Texto legible sin bitmap; objeto usable es misma identidad. |
| Objetivo F09 | Ruta real por producto o canje. | Posibilidad no se presenta como garantía. |
| Canje F10 | Excedentes, destino y resumen. | Protege última copia y familia; reintento único. |
| Taller F11 F12 | Requisitos, preparación, explicación y premio. | Fallo sin consumo; claim una vez por encargo. |

F06: registro técnico de operaciones P0; historial visible P1. F13: exhibición social diferida. F14: omisión, sonido y movimiento reducido P0. F15: foco, teclado, lectura y etiquetas P0. F09 es parte del valor de colección; F12 es experimental para comparar A/B, no un juego definitivo aprobado.

## 10 Estados de error y accesibilidad

| Estado | Comportamiento visible y recuperación |
| --- | --- |
| Carga o catálogo fallido | Mantener estructura; reintentar sin inventar stock o probabilidades. |
| Producto agotado | Explicar suministro realmente vigente; ofrecer práctica o colección. |
| Entrega desconocida | Comprobar misma operación; no sortear ni gastar otra unidad. |
| Imagen ausente | Nombre, familia, copias y resultado funcionales; reintentar arte aparte. |
| Guardado local fallido | No animar éxito sin commit; reintento seguro sin falso premio. |
| Repetido | Mostrar cantidad, excedentes y ruta de canje pertinente; no ocultarlo como nuevo. |
| Claim o canje interrumpido | Consultar operación existente y mostrar entrega confirmada. |
| Importación inválida o reinicio | Validar esquema antes de sustituir; conservar estado ante error; confirmar reset. |
| Reserva llena | Mostrar tres vales y que no se acumulan adicionales; no prometer exceso futuro. |

### Accesibilidad en el primer recorrido

Meta de trabajo WCAG 2.2 AA, pendiente de verificación [R15]. Teclado, foco visible y regreso al origen al cerrar un panel; resultado anunciado una vez. Nombre, categoría y estado no dependen de color, audio, hover o un gesto preciso. Escena y lista deben permitir las mismas acciones sin localizar detalles pequeños.

Contraste de texto y superficies se mide por combinación; objetivo de comodidad de controles 44 × 44 píxeles, sin atribuir esa cifra al mínimo AA. Verificar ampliación, reflujo, lectores de pantalla y alternativas a arrastre. Los textos funcionales están en HTML, no pintados dentro de envases o cartas.

### Movimiento y sonido

Respetar prefers-reduced-motion y un ajuste propio. Resultado estático o transición mínima, sin salto, giro, zoom o parallax. Omitir siempre lleva al mismo hallazgo guardado. Audio tras elección explícita, desactivable y sin información exclusiva. No exigir atrapar la rana o elegir la gragea correcta para obtener una recompensa.

T10 verifica recorrido normal y recuperación con teclado, lector y dispositivos acordados. Es una meta y un plan de pruebas, no una certificación ni un resultado observado.

## 11 Dirección visual de la tienda

Recomendación: callejón y tienda en cuento teatral ilustrado 2D, con profundidad sencilla. Calle con fachadas legibles; Weasley con madera cálida, envases excéntricos y humor. Un lenguaje común permite que futuras tiendas tengan personalidad propia. Comparar con cartoon simple antes del lote; ningún estilo demuestra engagement por sí solo.

| Elemento | Guía inicial |
| --- | --- |
| Paleta artística | Ciruela #4D285D, cobre #D57635, crema #F3E3C5, madera #67442F y turquesa #299A9A. Medir contraste antes de usarlos en controles. |
| Luz y perspectiva | Luz arriba izquierda, sombras suaves; envases frontal tres cuartos; estantería casi frontal. Congelar referencias para todo el catálogo. |
| Materiales | Cartón, vidrio, chocolate y madera reconocibles. Pintura digital limpia; contorno selectivo; evitar mezclar fotografía y pixel con el cuento. |
| Siluetas | Caja pentagonal para rana, envase alto para grageas y futuro paquete torcido para bromas. Distinguir sin leer. |
| Tipografía de interfaz | Títulos serif candidatos y cuerpo system-ui 16/24; metadatos 14/20. Nombres y reglas separados del bitmap; licencia de fuente registrada. |
| Cromos y fichas | Personas y objetos 2:3; sabores modulares. Marco e icono indican rareza, con igual legibilidad y cuidado de arte para todos los rangos. |
| Espacio de interfaz | Escala 4/8/12/16/24/32; margen móvil 16; zonas calmadas detrás de controles; foco y estados consistentes. |

### Componentes por diseñar

Producto en estante y en lista; detalle; contador de unidades y vales; carta; ficha de sabor; progreso; objetivo; selección de invento y sabor; comparación de requisitos; resultado; omisión; aviso de recuperación. Cada componente define reposo, foco, carga, ausencia y error cuando aplique.

### Muestra antes del catálogo completo

Muestra: una vista del callejón y fachada Weasley, un interior, dos personas, dos objetos, dos sabores y dos envases con aperturas. Probar entrada y regreso a tamaño móvil, lectura, consistencia y tiempo. El callejón añade trabajo que debe medirse; las estimaciones v0.3 cubrían solo tienda y productos. No producir escaparates futuros en esta muestra.

Los ejemplos visuales de v0.2 eran referencias generadas con un mismo modelo, no comparación de modelos ni activos finales. Una imagen con aspecto vectorial no entrega SVG y una imagen con aspecto 3D no entrega una malla. Este PRD especifica la entrega editable requerida.

## 12 Herramientas y producción de ilustraciones

| Herramienta candidata | Uso concreto | Condición de entrega |
| --- | --- | --- |
| Generación de imágenes | Conceptos y referencia de estilo; ediciones con referencia para mantener identidad. | Revisión humana; no asumir capas, rig, texto correcto ni autorización por generar. |
| Krita [R07] | Pintar, retocar, recortar capas y repintar zonas ocultas. | Fuente .kra y PNG transparente; anatomía, materiales y bordes revisados. |
| Inkscape [R08] | Marcos, dorso, iconos y decoración editables. | SVG; textos de interfaz fuera del dibujo. |
| CSS y GSAP [R09] | Feedback y secuencias coordinadas por capas. | Una timeline por ritual; movimiento reducido; licencia de herramienta registrada. |
| Rive opcional [R10] | Rana articulada si necesita estados reutilizables más ricos. | Preparar partes, pivotes y transiciones; medir export/runtime antes de incorporarlo. |
| Blender o Lottie posteriores | Geometría real o animaciones vectoriales cuando exista necesidad concreta. | No son dependencias para un escaparate ilustrado por capas. |

### Pipeline repetible

1. Brief por hallazgo: nombre, familia, función, silueta, gesto, materiales, contexto y procedencia. 2. Dos o tres conceptos por familia con la misma referencia aprobada. 3. Selección y corrección en Krita; separar base y piezas móviles con zonas ocultas pintadas. 4. Marco y texto fuera del sujeto. 5. Exportaciones, montaje de apertura y comprobación en móvil. 6. Revisión conjunta y registro del tiempo antes del siguiente lote.

Registrar recurso, autor/modelo/herramienta, origen de referencias, versión, permiso o licencia, transformaciones y fuente editable. Ilustrar con composición propia y sin copiar fotogramas, logos o semejanzas cinematográficas no acredita por sí solo permiso para comercializar la franquicia. T01 define los usos permitidos.

### Separar imagen de animación

Una generación raster puede ayudar a un concepto o animatic; no crea automáticamente vectores, partes articuladas o fotogramas consistentes. Krita permite animación cuadro a cuadro, pero su documentación advierte límites de transparencia en exportación de vídeo [R07]. Para rana sobre mostrador, preferir capas transparentes, PNG o rig preparado; no asumir MP4 con alfa.

GSAP documenta uso comercial sin cargo bajo su licencia vigente con restricciones específicas [R09]; no equivale a software libre sin condiciones ni licencia de assets. Rive queda como alternativa, sin combinar tres motores de animación en el primer prototipo. No se han instalado ni probado aquí estas herramientas.

## 13 Prompts y entregables de arte

### Prompt base de concepto

Ilustración de cuento pintado teatral para el Callejón Diagón y su primera tienda Weasley. Paleta común ciruela cobre crema turquesa, luz cálida arriba izquierda y siluetas legibles. Para la calle, fachadas y espacio libre para navegación; para Weasley, cartón artesanal y humor. Composición propia sin fotogramas, logos, texto ni parecido a actores. Un recurso por entrega; conservar la referencia aprobada y separar UI del arte.

| Recurso | Instrucción específica que añadir |
| --- | --- |
| Envase de rana | Caja pentagonal de chocolate, frontal tres cuartos, tapa cerrada y espacio vacío para etiqueta. Fondo transparente. Crear tapa abierta mediante edición posterior conservando la misma base. |
| Rana | Chocolate moldeado, cuerpo compacto, ojos curiosos, reposo y patas separadas para recorte. Sombra independiente. Revisar continuidad de poses con referencia, no asumir un rig automático. |
| Grageas | Envase alto con ventana y patrón juguetón; sin letras. Una gragea base y cuatro moteados modulares; nombre y sabor no dependen del color. |
| Estantería | Pared mostrador y estantes vacíos en tres áreas, casi frontal, centro despejado y decoración lateral. Sin productos ni UI dentro de la ilustración. |
| Cromo | Personaje u objeto definido en el brief, vertical 2:3, composición central, fondo simple y espacio seguro; sin marco ni texto. Revisar permisos y representación antes de publicar. |

### Paquete por recurso

Fuente editable, capa de sujeto, fondo, piezas móviles cuando existan y exportación revisada. Máster de carta candidato 1024 × 1536; detalle 512 × 768 y miniatura 256 × 384. Envases máster 1024 × 1024 y entrega 512 píxeles con transparencia comprobada. Tienda máster 1920 × 1280 y recorte móvil dedicado 1080 × 1440. Son tamaños de trabajo, ajustables con medición.

Conservar lienzo y coordenadas comunes. Exportar cada pieza con recorte, pivote y posición en un manifest; evitar una imagen completa por pieza pequeña. El manifest incluye asset_id, versión, fuente, dimensiones, crop, pivot, estados, origen, permiso y texto alternativo.

### Aceptación de una ilustración

Silueta identificable en álbum; luz y materiales coherentes; sin manos, patas o accesorios defectuosos; borde limpio al recortar; nombre y reglas legibles en HTML; arte de objeto tan cuidado como el de persona. Aceptar primero la muestra en contexto antes del lote. Medir tiempo de concepto, retoque, exportación y aprobación por separado.

## 14 Animaciones e interacción

El estado del dominio decide y conserva la recompensa. La coreografía la presenta: reposo, pendiente, confirmado, apertura, revelación, resultado. Un fallo de red queda en recuperación, sin animar un éxito ficticio. Cerrar u omitir no revierte una entrega confirmada.

| Ritual | Timeline inicial propuesta | Partes necesarias |
| --- | --- | --- |
| Rana | Tapa 300 ms; anticipación 200; salto 500; cromo 400; asentamiento 200. Total 1,6 s después de commit. | Base, tapa, interior, rana, sombra y dorso del cromo. |
| Grageas | Vertido breve, destacar hallazgo y reacción. Objetivo 1,2–1,8 s; no exige acertar un toque. | Envase, tapa, gragea base, moteado y efecto reutilizable. |
| Taller | Respuesta corta al confirmar y explicación del cambio. Repetición puede omitir efecto. | Un escenario y efectos modulares por combinación. |
| Movimiento reducido | Resultado estático o transición mínima; sin salto, giro ni parallax. | Mismo nombre, familia, cantidad y acción. |
| Interfaz | Respuesta de pulsación y foco; stock y progreso tras commit. | Controles DOM y estados; no dibujo interactivo inaccesible. |

### Implementación recomendada

CSS para movimientos simples; GSAP si coordinar tapa, rana y cromo facilita edición. Transformaciones y opacidad; una secuencia activa. Precargar solo el producto elegido, no todas las aperturas. Definir omitibilidad desde cualquier fase confirmada y recuperación al recargar. Rive solo si un rig aporta un comportamiento repetible que compense preparación y peso.

El sonido es opcional. La rareza se presenta con etiqueta e icono; sin flashes ni sacudidas. Todas las revelaciones son omitibles y tienen resultado estático equivalente. Un vídeo generado puede servir de boceto, pero no sustituye los estados ni la recuperación.

### Prueba y ajuste

Comparar duración y preferencia tras varias aperturas; registrar omisiones, bloqueos y comentarios. La primera animación puede gustar y la décima cansar. Ajustar tiempo y amplitud por comportamiento observado, sin confundir una menor omisión con mayor retención. La escena/lista, el resultado y la accesibilidad deben seguir operando con arte ausente.

Primera vista de recursos objetivo ≤1 MB transferido, con álbum y detalle diferidos. Es presupuesto propuesto, no medición alcanzada. No introducir generación de ilustraciones en tiempo real para cada apertura: los hallazgos usan assets revisados y versionados.

## 15 Arquitectura y contratos de aplicación

| Fase | Implementación candidata | Alcance de confianza |
| --- | --- | --- |
| Prototipo privado | React TypeScript Vite; catálogo JSON; IndexedDB; CSS/GSAP; recursos estáticos. | Sin cuentas ni pagos. Local manipulable, susceptible de borrado; exportación validada. |
| Piloto de sesiones | Mismo cliente; un backend Kotlin/Spring candidato y PostgreSQL; autenticación y assets estáticos. | Servidor dueño de inventario, aperturas, premios, reposición y canje. |
| Evolución | PWA o app nativa si hay necesidad observada; operación dimensionada. | No asumir microservicios, 3D, cola o caché distribuida por tener doce hallazgos. |

Kotlin/Spring es candidato por la experiencia de Enric; monolito TypeScript sería alternativa si reduce esfuerzo real. Elegir uno en T06/T09. SSR no es necesario para evitar bots: el servidor valida propiedad y derecho a reclamar. Cuentas, retención, borrado y operación se concretan antes del piloto; no aceptar la colección local como inventario económico confiable.

### Datos y operación

Añadir ShopDefinition con shop_id, estado y manifest; productos y encargos referencian su tienda. Una colección global conserva OwnedCopy y Discovery, con procedencia y futuros filtros por tienda. Mantener versiones inmutables, ProductInstance, Opening, QuestVersion, RewardClaim, VoucherBalance y Ledger. Nuevas tiendas no duplican copias ni saldos. Una apertura conserva resultado y versiones; jugar no consume descubrimientos.

Una transacción reclama clave idempotente del propietario, valida petición y unidad, decide resultado con tabla versionada, consume, crea copia y ledger y confirma. Animar después. Misma clave con misma petición devuelve resultado original; misma clave con otra petición da conflicto. Otra clave para unidad consumida rechaza sin sortear. Claim, canje y vale→producto son atómicos.

| Contrato propuesto | Comportamiento |
| --- | --- |
| GET catálogo e inventario | Versiones, candidatos, stock, descubrimientos, objetivo y saldo propio. |
| POST apertura y GET operación | Unidad, versión e Idempotency-Key; resultado recuperable del propietario. |
| POST canje | Tres copias de familia y destino faltante; proteger última copia. |
| POST resolución de encargo | Objeto, sabor, versión; servidor calcula mínimos y premio único. |
| POST vale a producto | Aplicar reposición, consumir un vale y crear una unidad elegida; no sortear aquí. |

## 16 APIs externas y Decisions API

Potter DB documenta libros, capítulos, personajes, películas, pociones y hechizos; no documenta un recurso de productos Weasley ni sabores [R11]. HP API ofrece personajes y hechizos [R12]. Son servicios de terceros: no proporcionan reglas de tienda, arte coherente o permiso comercial. Importar opcionalmente una muestra revisada y fechada; ninguna apertura o encargo depende de una llamada a esas APIs.

### Decisiones acotadas con evidencia

La documentación oficial de OpenAI describe preguntas predicate, choice y score, con texto o imágenes como entrada [R13]. Para este proyecto se propone evaluar alternativas ya definidas, clasificar evidencia y priorizar próximos experimentos. Una preferencia del modelo no demuestra demanda ni permiso y su confianza no es probabilidad de éxito comercial.

| Pregunta preparada | Opciones permitidas | Evidencia que aportar |
| --- | --- | --- |
| Arte para primer prototipo | capas_2d, cartoon_simple, rig_rive, evidencia_insuficiente | Misma escena y flujo; horas por asset, lectura, tamaño y omisión. |
| Siguiente incremento | coleccion, taller, retorno, evidencia_insuficiente | Comprensión y uso observados; coste incremental y bloqueos. |
| Reposición que probar | reserva_tres, sin_limite, evidencia_insuficiente | Saldo y completitud simulados, regreso y percepción de presión. |
| Oferta para validar | cosmetico_conocido, expansion_conocida, aplazar | Permisos, costes, compras previas y capacidad de producción. |

### Solicitud y registro preparados

Contrato documental: model gpt-6-luna; input con restricciones, alternativas y evidencia fechada; questions con type choice, name único, instructions y choices con value/description. Incluir evidencia_insuficiente cuando falten datos. Separar preguntas dependientes en solicitudes posteriores. No hay llamada ejecutada ni respuesta o puntuación atribuida a la API en esta versión.

Registrar ID de decisión, versión de evidencia, opciones, resultado, probabilidades, confianza, revisión y experimento siguiente cuando se ejecute. El modelo ayuda a evaluar; Enric conserva elecciones de producto y compromisos de gasto. Comprobar con ejemplos etiquetados antes de automatizar una decisión y mantener reglas deterministas para premios, sorteo y cobro. El núcleo del juego no requiere IA en runtime.

Playground de Google sigue opcional para maquetas; no se ha probado exportación ni hay integración pública verificada para este proyecto. No bloquea el prototipo independiente. No se presupone acceso por vivir en España.

## 17 Propuesta comercial y permisos

Primero probar un núcleo gratuito en una tienda. Después estudiar decoración elegida, cubierta de álbum o expansión de tienda con encargos y contenido listado. La compra muestra qué entrega y conserva lo adquirido. Expandir a otras tiendas está decidido como dirección; cobrar por ellas, su precio y acceso siguen como hipótesis. No añadir una moneda por comercio.

| Oferta candidata | Valor que podría vender | Prueba necesaria |
| --- | --- | --- |
| Cosmético conocido | Personalizar vitrina, álbum o efecto opcional elegido. | Deseo observado, coste de producir y compra real. |
| Expansión conocida | Encargos y recursos especificados; contenido anterior conservado. | Coste por lote y utilidad sin depender de vender azar. |
| Club recurrente posterior | Contenido definido para cada período. | Cadencia y operación demostradas; no solo interés declarado. |
| Aperturas pagadas diferidas | Ninguna oferta decidida en este alcance. | Revisión específica de economía, reglas de canal y permisos antes de incorporarla. |

### Camino para un negocio en Harry Potter

La dirección elegida es Callejón Diagón con Weasley primero. T01 debe resolver los usos de tiendas, nombres, personajes, productos, diseño, música y promoción por territorio, plataforma y duración. Cada expansión incorpora sus materiales al registro de permisos. Una aplicación fan o un dibujo generado no acredita licencia; registrar procedencia y límites de distribución.

Warner publica un formulario de licencias de clips e imágenes que contiene rutas para consultas de productos y juegos [R14]. Está fechado en 2021 y no garantiza interlocutor actual, cobertura de un nuevo juego ni aprobación. Es un punto de partida a confirmar, no una licencia HP. No se han enviado consultas ni obtenido tarifas. Anticipo, canon, mínimos y revisiones se cotizan en un acuerdo específico.

### Condiciones del canal

Las comisiones de Apple y Google varían por programa, mercado y condiciones [R16–R17]. Un 15 % en los cálculos siguientes es una sensibilidad, no una tarifa universal ni una comisión web verificada. Si se introduce azar comprado, revisar políticas actuales y diseño efectivo antes de lanzar; mostrar probabilidades por sí solo no resuelve permisos ni todas las obligaciones del canal.

La hipótesis comercial debe comprobarse con una oferta concreta y ventas observadas. Fans interesados, seguidores, clics en “me interesa” y cuentas creadas no equivalen a ingresos. No comprar adquisición antes de conocer contribución y retorno por cohorte.

## 18 Economía unitaria y beneficios posibles

Los siguientes escenarios son aritmética de sensibilidad, no previsiones de usuarios o ventas. Oferta conocida hipotética 9,99 €; impuesto supuesto 21 %, devoluciones 2 % del neto, comisión 15 % del neto tras devolución y variable por compra 0,25 €. Canon hipotético 10 % del neto inicial SOLO para sensibilidad: no es tarifa de Harry Potter. Las bases deben sustituirse con contratos y tratamiento fiscal reales.

Neto inicial 8,2562 €; tras devolución, comisión y variable quedan 6,6274 €. Al restar 0,8256 € de canon hipotético, contribución por compra 5,8018 €. Supuesto de fijos 1.500 €/mes para contenido y operación; servicio 0,02 €/usuario activo. Una compra por comprador al mes y adquisición 0 €. No incluye anticipo o mínimo de licencia, inversión inicial ni impuesto sobre resultados.

| Escenario supuesto | Activos | Compras | Bruto mensual | Resultado operación |
| --- | --- | --- | --- | --- |
| Compra el 2 % | 1.000 | 20 | 199,80 € | −1.403,96 € |
| Compra el 3 % | 10.000 | 300 | 2.997,00 € | 40,54 € |
| Compra el 4 % | 50.000 | 2.000 | 19.980,00 € | 9.103,59 € |

### Equilibrio y objetivo económico

Contribución = precio sin impuestos y devoluciones menos comisión, variable de compra y canon. Resultado = compras × contribución menos fijos, servicio de todos los usuarios y adquisición. Si la contribución es positiva, el equilibrio se calcula redondeando hacia arriba el coste mensual total dividido por contribución.

| Con los mismos supuestos | 1.000 activos | 10.000 activos | 50.000 activos |
| --- | --- | --- | --- |
| Compras para equilibrio | 262 | 294 | 431 |
| Compras para recuperar 10.000 € en 12 meses | 406 | 437 | 575 |

Ejemplo de objetivo personal: con 10.000 activos y los mismos costes, obtener 2.000 €/mes adicionales antes de impuestos personales requiere 638 compras al mes. No es una promesa ni beneficio disponible: remuneración, adquisición, mínimos de licencia y producción real pueden cambiarlo. El tiempo de Enric se registra como coste o remuneración acordada, no como trabajo invisible.

Separar CAC por usuario y por comprador; LTV por contribución de cohortes observadas. El escenario de 10.000 activos y 300 compras apenas cubre operación con estos supuestos. El fandom no permite deducir rentabilidad; T12 debe fijar objetivo, coste máximo y condiciones para parar o reducir alcance.

## 19 Esfuerzo producción y capacidad

El alcance v0.4 añade callejón, fachada y navegación de entrada/regreso a la primera tienda. No añade otro catálogo ni otra tienda jugable. La tabla siguiente conserva la estimación v0.3 de arte interior y productos; excluye este incremento. T05/T12 deben medir y presupuestar callejón e integración antes de comprometer el total. Las expansiones requieren estimación propia.

| Arte v0.3 sin callejón | Funcional horas | Más cuidado horas |
| --- | --- | --- |
| Guía y plantillas | 4–6 | 10–16 |
| Tienda por capas | 4–8 | 8–14 |
| Dos envases y rana | 6–10 | 12–20 |
| Cuatro personas | 4–8 | 12–20 |
| Cuatro objetos | 2–4 | 6–12 |
| Cuatro sabores | 2–4 | 3–5 |
| Interfaz e iconos | 2–4 | 6–10 |
| Dos aperturas y efectos | 8–14 | 12–22 |
| QA y exportación de arte | 4–8 | 8–14 |
| Total alternativa | 36–66 | 77–133 |

Supuestos: artista competente, guía y contenido aprobados, dos rondas de revisión para acabado más cuidado. Son estimaciones internas, no cotización ni velocidad observada. Incluyen motion y QA/export de arte; excluyen ingeniería, integración de assets, permisos, rig completo y caja de bromas. Ambas columnas son alternativas y no se suman. La muestra previa forma parte del trabajo, no un lote adicional duplicado.

### Costes que se deben estimar después de la muestra

Ingeniería de tienda y aperturas; reglas de inventario/canje; taller; cuentas y reposición; accesibilidad y recuperación; investigación de usuarios; hosting y operación; dirección y revisiones de IP. Diferenciar QA de arte, QA de código y observación de usuarios. Retirar el puzzle anterior y reestimar los encargos; no conservar sus horas como si fueran trabajo adicional.

Caja: servicios y herramientas, contratación, infraestructura y costes de permisos cotizados. Coste económico añade horas propias al valor acordado, sin duplicar contratación externa. Horas no equivalen a semanas sin disponibilidad de personas. Antes del piloto definir límite de caja, horas, responsable operativo y capacidad mensual de publicar un lote.

Para contenido continuo registrar tiempo por personaje, objeto, sabor, envase y encargo; revisión y rechazo; mantenimiento de catálogo y assets. El coste principal puede ser contenido coherente y operación, no cómputo. No comprometer cadencia de expansiones o club antes de medir esta capacidad.

## 20 Investigación y criterios de avance

| Prueba propuesta | Qué resolver y salida |
| --- | --- |
| T02 Referentes | Usar cuatro referentes y registrar flujo, tiempo, objetivo, repetidos, fuente gratuita, juego y compra. La documentación ya consultada no equivale a uso real. |
| T03 Público | 12 entrevistas candidatas: hábitos de coleccionistas, fans sin hábito y casuales. Conducta pasada antes de mostrar el concepto; no representa el mercado. |
| T05 Arte | Muestra equivalente en dos acabados, misma interfaz y duración. Lectura, recuerdo, preferencia explicada, tiempo y retoque. |
| T04/T11 Recorrido | 8 pruebas formativas: explorar sin consumir, abrir ambos productos, álbum, objetivo, encargo y stock cero. Registrar errores críticos y explicación sin ayuda. |
| T11 Retorno | Piloto candidato 30–50 personas, 14 días y ventanas completas. Distinguir regreso espontáneo e invitado y exposición a productos. |
| T12 Oferta | Enseñar oferta conocida y coste real; disposición declarada no es compra. Ensayo comercial solo con condiciones de distribución resueltas. |

Criterio interno candidato: al menos 6/8 completan y explican apertura, resultado y siguiente acción sin ayuda; ninguna pérdida o duplicación de inventario. No es benchmark ni conclusión estadística. Si el taller se entiende pero no se usa sin premio, revisar una vez antes de aumentar reglas. Los umbrales y el presupuesto se fijan antes de evaluar resultados.

| Métrica | Denominador y límites |
| --- | --- |
| Activación | Primera apertura completada y colección visitada / usuarios que inician primera sesión. |
| Objetivo y colección | Ficha consultada y objetivo elegido por separado / activados. |
| Uso del taller | Elegibles que empiezan, entienden, terminan y repiten sin premio; no solo victoria. |
| D1 y D7 | Cohorte con ventana completa; definir sesión, día y zona. Separar invitados y espontáneos. |
| Calidad y capacidad | Anomalías / operaciones; tiempo de producción y coste por lote medidos. |

Eventos mínimos: product_viewed, opening_committed, reveal_viewed/skipped, collection_viewed, target_selected, conversion_completed, challenge_started/resolved, claim_completed y recovery_completed. Versiones y grupo experimental; texto libre identificable fuera del registro mínimo. Una mayor apertura o sesión no demuestra valor o ingresos.

## 21 Incertidumbres de producto

Universo elegido no equivale a permiso o mercado demostrado. Se conserva cada ID; la revisión propone responsable y próxima evidencia. No se cierran dudas por consenso entre agentes.

| ID responsable | Estado actual | Próxima evidencia o decisión |
| --- | --- | --- |
| U01 PM Staff | Callejón decidido; Weasley primero; tiendas futuras. Permisos pendientes. | T01 ruta de usos y autorización para distribuir. |
| U02 PM UX | Adultos fans casuales ES candidato. | T03 hábitos y público elegido. |
| U03 PM | Explorar comercios, coleccionar y probar; conexiones futuras por validar. | T02/T03 observar referentes y fricciones; nicho no probado. |
| U04 PM PO | A colección frente B taller de invento+sabor. | T04/T11 utilidad y coste; elegir alcance. |
| U05 PE PM | Vale cada 24h reserva 3 propuesto. | T08/T11 simular y contrastar presión, retorno y continuidad. |
| U06 PE Designer | Rana cromo persona/objeto; grageas sabor. | T05/T11 comprensión y adaptación narrativa. |
| U07 PO Visual | 12 bases 4+4+4; caja P1; rareza solicitada. | T05/T13 nombres y percepción; T08 completitud y canje. |
| U08 PE Finance | Canje3:1 por familia; permanentes. | T08/T11 sensibilidad 2/3/4 y frustración observada. |
| U09 PM | Colección permanente; expansión por tiendas decidida como dirección. | T04/T12: siguiente tienda, mecánica propia, conexión, coste y acceso. |
| U10 Finance | Gratuito primero; oferta conocida candidata. | T03/T12 pagos previos, coste y permisos antes de ventas. |
| U11 PM | PvP trading social diferidos. | Reabrir con evidencia; diseño y operación propios. |

### Qué desbloquear primero

T01–T05 orientan el prototipo; T06 permite probar el corazón de la experiencia. El público, límite de esfuerzo y condiciones de distribución se eligen antes de comprometer el piloto. U05 requiere fuente de productos y capacidad de contenido real: definir un vale no demuestra que alguien quiera volver.

Se mantiene la intención Harry Potter sin sustituirla por un universo original. Si la distribución o monetización no está resuelta, su estado queda visible y se limita la fase correspondiente; no se presenta fan gratuito como autorización.

## 22 Incertidumbres de ejecución

| ID responsable | Estado actual | Próxima evidencia o decisión |
| --- | --- | --- |
| U12 Visual UX | Callejón e interior por capas; estilo final pendiente. | T05/T11 muestra en contexto, coste y lectura; elección de arte. |
| U13 Visual | Pipeline por referencias y retoque candidato. | T05 medir dos personas/objetos y consistencia. |
| U14 Staff Visual | Manifest por asset/modelo/herramienta. | T01/T05 comprobar procedencia y usos. |
| U15 Staff | Web móvil primero candidata. | T06 necesidad y dispositivos; nativa por evidencia. |
| U16 PE | APIs para importación opcional revisada. | T06 muestra; no dependencia en apertura ni catálogo completo supuesto. |
| U17 PE | Playground opcional; Decisions preparado. | T07 acceso/export; ejecutar Decisions requiere acceso configurado. |
| U18 Designer Staff | CSS/GSAP por capas; Rive opcional. | T06 editar, medir peso y exportación; un motor principal. |
| U19 Staff | Local demo; servidor piloto. | T09 recuperar, reconciliar y definir transición de demo. |
| U20 UX Staff | Accesibilidad y recuperación P0. | T10 teclado lector errores arte y rendimiento reales. |
| U21 Finance PO | Arte v0.3 excluye callejón; total y expansiones sin cotizar. | T12 horas caja personas operación y costes de licencia. |
| U22 Staff PM | Eventos mínimos y cohortes. | T09/T11 retención de datos, ventanas y denominadores. |
| U23 PM | Español e inglés obligatorios desde el inicio. Notificaciones diferidas. | T14 traducción y QA en ambos idiomas; otros idiomas sin alcance aprobado. |

### Estado del trabajo

Investigación documental y contraste entre perfiles realizados. Reglas, recorrido, guía, contratos y escenarios económicos definidos como propuestas. Sin entrevistas, pruebas de interfaz, arte final, implementación o exportación ejecutadas. La simulación v0.2 se conserva como antecedente y queda fuera de las conclusiones actuales; T08 debe reproducir el nuevo modelo.

Decisions API no ha sido llamada. No hay resultado, elección o confianza de modelo que se pueda registrar como evidencia. Las opciones y criterios preparados permiten ejecutar una revisión cuando exista acceso, sin cambiar las decisiones ya expresadas por Enric.

## 23 Tareas entregables y responsables

| Tarea perfiles | Entrega y estado | Dependencia |
| --- | --- | --- |
| T01 PM Staff Finance | Mapa de materiales/usos y ruta de permisos. Universo decidido; autorización pendiente. | Antes de distribución y monetización correspondientes. |
| T02 PM | Matriz con uso real de referentes. Documentación reunida; observación pendiente. | Alimenta T03/T04. |
| T03 PM UX | Entrevistas y público; conducta y compra previa. No ejecutado. | Reclutamiento y criterio acordados. |
| T04 PO PE | Reglas y recorrido callejón→Weasley→productos→colección/taller. Propuesta v0.4. | T11 decide A/B. |
| T05 Visual Designer | Muestra de callejón, fachada e interior, capas, manifest y tiempos. Pendiente. | T01 recursos; T06 integración. |
| T06 PE Staff | Callejón, acceso/regreso Weasley, productos, colección y recuperación. Pendiente. | T04/T05. |
| T07 PE Staff | Playground opcional y pack Decisions con evidencia. Sin ejecución. | No bloquea T06; acceso para llamadas. |
| T08 PE Finance | Simular rareza R1/control U0, canje, regalos, tutorial y vales. Pendiente; coordinar con T13. | No usar cifras v0.2 para catálogo actual. |
| T09 Staff | Cuentas, reposición autoritativa, contratos y operación. Definido; no construido. | Antes de piloto de varias sesiones. |
| T10 UX Staff PE | Guardado, recuperación, navegación calle/tienda y accesibilidad. Pendiente. | Núcleo T06/T09. |
| T11 PM UX | Arte A/B y retorno sin confundir premios. No ejecutado. | Núcleo fiable; presupuesto equivalente. |
| T12 PO Finance | Presupuesto del callejón y tienda; capacidad y criterio para expandir. Pendiente. | Evidencia y capacidad por fase. |

### Coordinación y capacidad

PM/PO priorizan evidencia y alcance; Product Engineer define reglas y balance; Designer/UX preparan experiencia y estados; Visual produce y revisa assets; Finance estudia costes y contribución; Staff mantiene contratos y operación. Son responsabilidades propuestas, no personas contratadas ni disponibilidad comprometida. No hay calendario fijado.

Cada entrega adjunta versión, aceptación y prueba. Preparar código o una recomendación no equivale a un recorrido implementado y probado. Las preguntas que requieren elección de Enric permanecen separadas de las decisiones rutinarias de construcción del prototipo.

## 24 Implementación por recorridos y decisiones

| Incremento | Resultado revisable | Aceptación principal |
| --- | --- | --- |
| I1 Callejón Weasley y rana | Calle/lista entrada tienda detalle apertura y colección. | Entrar/volver conserva foco y progreso; apertura recuperable y única. |
| I2 Grageas y objetivo | Ficha sabor, muestrario, rareza y ruta al hallazgo deseado. | Explicar familia, rango, repetido y posibilidad frente garantía. |
| I3 Taller experimental | Invento+sabor, tres encargos y premio único. | Doce combinaciones correctas; fallo sin consumo; práctica sin premio. |
| I4 Canje | Excedentes por familia y faltante elegida. | Protege última copia; cancelar/reintentar seguros. |
| I5 Retorno y cuentas | Suministro acordado y recuperación de sesiones. | Cursor reloj reserva idempotencia y restauración ensayados. |
| I6 Expansiones por tiendas | Nueva tienda con experiencia propia y colección compatible. | Evidencia, capacidad y presupuesto; sin pérdida del contenido anterior. |

### Registro de decisiones actualizado

D02: Enric elige Callejón Diagón, Weasley primero y expansiones. D09: hallazgos con distinta dificultad de obtención y rangos. D10: español e inglés desde la primera versión. D01 y D03–D08 conservan su estado de propuesta; nombres y balance de rareza siguen por validar.

### Preparado terminado y puertas de avance

Preparado: catálogo y regla versionados, assets o sustitutos, estados normales/error, aceptación y dependencias. Terminado: recorrido operable, inventario persistido y coherente, accesibilidad del núcleo y casos adversos pertinentes comprobados. La demo admite arte provisional identificado; el piloto exige autoridad y recuperación de servidor.

Tras I2 comprobar colección y objetivo. Tras I3/I4 evaluar taller y canje con premios equivalentes. Antes de I5 fijar suministro, presupuesto y operación. Antes de I6 elegir una tienda cuya mecánica aporte valor, medir coste y resolver distribución. Conservar contenido anterior. Una expansión no sustituye la validación del núcleo ni implica pagos aprobados.

Siguiente entrega: muestra del callejón y Weasley con entrada/regreso, y recorrido rana→colección→grageas→encargo. Debe ser operable y permitir observar comprensión y recuperación. Mantener futuras tiendas fuera de esta prueba; una captura o vídeo no verifica persistencia ni navegación.

## 25 Expansiones futuras por tiendas

Dirección decidida: comenzar en el Callejón Diagón con los Weasley y añadir otras tiendas en el futuro. La primera versión entrega una experiencia completa en ese comercio. No hay una segunda tienda elegida, calendario de aperturas ni política de acceso aprobada.

### Qué debe aportar una nueva tienda

Cada expansión debería incorporar identidad visual propia, productos reconocibles y una actividad que justifique visitarla. Reutilizar inventario, colección y recuperación reduce trabajo; copiar el mismo ritual con otro envase no basta como propuesta. La conexión con otras tiendas se tratará como hipótesis a probar, preservando la posibilidad de disfrutar cada una por separado.

### Candidatos por explorar

Una tienda de varitas podría proponer afinidades y pruebas; una librería, conocimientos o recetas. Son ideas de diseño, no funciones decididas ni afirmaciones sobre el canon. Compararlas por interés observado, decisiones nuevas, coste de arte, contenido, mantenimiento y encaje con lo existente antes de elegir.

### Preguntas pendientes para cada expansión

Qué tienda y público; qué producto se abre y qué se hace con el resultado; qué conserva el jugador; cómo se conecta con hallazgos anteriores; acceso gratuito, desbloqueo o compra; precio y contenido si procede; capacidad de producción y permisos. T04/T05 definen recorrido y muestra; T12 estima coste y elige el incremento con evidencia.

### Conservación y aceptación

Las colecciones y copias anteriores permanecen. Registrar procedencia por tienda y versionar nuevos productos y encargos. No introducir otra moneda, compras obligatorias ni consumo retroactivo sin una decisión explícita. Comprobar compatibilidad de partidas, navegación y operaciones antes de habilitar una tienda. Las pruebas deben distinguir interés por la actividad y retorno causado por regalos adicionales.

### Orden recomendado

Primero validar callejón y Weasley; después una muestra de una segunda tienda; luego una expansión jugable si aporta valor y cabe en el presupuesto. Ampliar el catálogo de Weasley sigue siendo una alternativa de menor alcance. Expansiones de producto y expansiones de pago son decisiones distintas; no comprometer cadencia hasta medir producción.

## 26 Rareza rangos y dificultad de obtención

Enric solicita que los hallazgos tengan rangos y distinta dificultad de obtención. La propuesta inicial usa tres rarezas compartidas por cromos de personas, objetos y sabores. El rango describe su frecuencia en aperturas; la ruta completa de obtención también incluye regalos y canje. Los nombres, porcentajes y asignaciones siguientes son candidatos de laboratorio, todavía sin calibrar.

### Tres conceptos que la interfaz debe distinguir

| Concepto | Significado y uso |
| --- | --- |
| Rareza del hallazgo | Frecuencia de aparición en un producto concreto. La ficha muestra rango y probabilidad por identidad. |
| Acceso al producto | Cómo conseguir una rana, grageas u otro producto: bienvenida, premio o vale vigente. No se deduce de la rareza de su contenido. |
| Dificultad del encargo | Requisitos y decisiones para resolver una actividad. Se explica aparte; el tutorial se resuelve con los regalos conocidos. |

### Nombres propuestos para los rangos

| ID estable | Nombre candidato | Frecuencia R1 | Señal visual candidata |
| --- | --- | --- | --- |
| R01 | Habitual | 70 % | Sello circular y etiqueta |
| R02 | Singular | 25 % | Sello de rombo y etiqueta |
| R03 | Extraordinario | 5 % | Sello de estrella y etiqueta |

Recomendamos estos tres nombres por su lectura directa y encaje con el tono de descubrimiento. Compararlos con Común, Raro y Excepcional. Legendario queda como posible cuarto rango para un catálogo mayor; doce identidades no justifican más niveles por ahora. Los nombres no califican el valor de una persona ni su poder en el universo.

El 5 % corresponde al conjunto de hallazgos Extraordinarios elegibles, no a cada pieza. El porcentaje de una identidad depende de cuántas compartan el rango y de la tabla del producto. Una futura tienda puede ofrecer otra distribución; debe mostrar la suya antes de gastar.

### Distribución propuesta para probar

R1 propone seleccionar rango y después una identidad con igual probabilidad dentro de ese rango. El servidor puede representar el mismo resultado mediante pesos por identidad. Se conserva U0 uniforme de la sección 4 como control de comparación. La configuración activa debe estar identificada y ser coherente con lo mostrado; cambiar tabla durante una apertura no cambia su resultado.

| Producto | Rango | Identidades de ensayo | Cada identidad |
| --- | --- | --- | --- |
| Rana | Habitual 70 % | C01 C02 O01 O02 | 17,5 % |
| Rana | Singular 25 % | C03 O03 | 12,5 % |
| Rana | Extraordinario 5 % | C04 O04 | 2,5 % |
| Grageas | Habitual 70 % | S01 S02 | 35 % |
| Grageas | Singular 25 % | S03 | 25 % |
| Grageas | Extraordinario 5 % | S04 | 5 % |

Esta asignación sirve para ensayar el catálogo existente y no pretende establecer rarezas canónicas. Rana mantiene 50 % personas y 50 % objetos al equilibrar ambas categorías dentro de cada rango. Las probabilidades por identidad suman 100 % en cada producto. Antes del piloto, T13 revisará qué hallazgos encajan en cada rango y por qué.

### Progreso y repetidos

Los cuatro regalos iniciales O01/O02/S01/S02 son Habituales en R1; siguen permitiendo resolver todos los encargos. Los objetos y sabores raros mantienen los efectos equivalentes ya definidos. La rareza aporta colección y presentación; no exige aumentar estadísticas ni obtener una pieza rara para avanzar en el tutorial.

Se conserva como propuesta el canje de tres excedentes por una identidad faltante de la misma familia, con cualquier rango y protección de la última copia. Así, un Extraordinario puede obtenerse mediante canje aunque tarde en salir. Rareza de sorteo no significa una espera garantizada ni mide por sí sola el esfuerzo total. T08/T13 deben medir esta interacción antes de fijar el ratio; no incrementar su coste sin una decisión explícita.

La ficha del objetivo muestra sus probabilidades por producto y la ruta de canje. Más aperturas con una probabilidad fija no garantizan obtenerlo. Una garantía tras cierto número de intentos se mantiene como pregunta de diseño; no se anuncia ni implementa en R1. No se venden intentos en este prototipo.

### Presentación datos y validación

F16 añade rango en resultado, ficha, álbum y filtro de colección; F02 muestra la probabilidad exacta de cada identidad. Un marco modular, un icono de forma distinta y una etiqueta permiten reconocer el rango sin depender del color. Mantener buena ilustración en los Habituales: deben ser hallazgos deseables, no relleno visual.

La revelación Extraordinaria puede tener un detalle ornamental breve dentro de la duración de apertura prevista. Todas conservan omisión, movimiento reducido y resultado equivalente sin sonido. El rango pertenece a la identidad base; no añade copias foil ni variantes necesarias para completar las doce identidades.

El catálogo guarda rarity_id, nombre localizado y versión; la distribución del producto guarda identidades elegibles y pesos. La operación conserva la identidad adjudicada, rango y versiones originales. Las tablas se validan con pesos positivos, suma correcta y referencias existentes. El servidor decide con azar, sin que Decisions API o el cliente cambien pesos por usuario, gasto o conducta. Las actualizaciones no reclasifican silenciosamente lo ya obtenido.

### Incertidumbres y tareas nuevas

| Registro | Responsables | Entrega pendiente |
| --- | --- | --- |
| U24 Rareza | PM PO PE UX | Elegir nombres y asignación. Resolver probabilidades, claridad, canje y necesidad de garantía ante mala suerte. |
| T13 Balance y diseño | PE Finance UX Visual | Comparar U0 y R1; simular objetivo y completitud, repetidos y rutas con canje. Probar nombres, iconos y explicación; estimar esfuerzo adicional. |
| F16 Rareza P0 | PO PE UX Staff | Rango accesible y consistente en resultado, ficha, álbum y filtros; detalle de probabilidad por identidad y tabla activa. |

T13 coordina el modelo con T08, las etiquetas y marcos con T05, la implementación con T06/T09 y la evaluación con T10/T11. La estimación de arte previa no incluye estos componentes ni la calibración. Decisions API puede comparar nombres o resumir evidencia cuando exista acceso; sus preferencias no fijan probabilidades ni prueban engagement.

### Criterios de aceptación y decisión siguiente

Comprobar tablas completas y reproducibles; regalos y tutorial sin bloqueo por rareza; misma entrega al omitir o recuperar; rango legible sin color; filtro que conserva el total de doce; canje coherente con lo mostrado. En pruebas, pedir que la persona explique rango, probabilidad y ruta alternativa sin ayuda. Medir deseo de colección, frustración, canjes y regreso espontáneo, junto con aperturas.

Antes del piloto elegir nombres y tabla activa con resultados de T08/T13. Comparar distribuciones con el mismo catálogo, presupuesto gratuito y contenido de juego. Separar este contraste de colección frente taller para poder atribuir diferencias. No hay evidencia nueva que permita afirmar que 70/25/5 sea el mejor balance.

## 27 Español e inglés desde la primera versión

D10 es un requisito decidido por Enric: el prototipo, el piloto y las expansiones deben ofrecer la experiencia completa en español e inglés. La localización forma parte del alcance inicial y de la aceptación de cada recorrido. U23 deja de proponer un único idioma; las notificaciones siguen diferidas.

### Alcance y elección de idioma

Traducir navegación, bienvenida, tiendas y productos, colección, contexto de cromos, sabores, encargos, rarezas, probabilidades, canje, suministro, ajustes, guardado y errores. Incluir textos de accesibilidad y avisos mostrados al usuario. No considerar terminada una pantalla si sus estados alternativos quedan en otro idioma.

F17 ofrece Español y English en la entrada y en ajustes. Propuesta: usar la preferencia guardada; en el primer acceso, español si el navegador lo indica e inglés en los demás casos. Cambiar idioma conserva tienda, objetivo, inventario y operación pendiente, sin reiniciar ni volver a sortear. Las reglas y probabilidades son idénticas en ambos idiomas.

### Contenido datos e ilustraciones

Usar claves de traducción y mensajes completos con parámetros y plurales. Nombres, descripciones y encargos tienen campos es/en; sus IDs son compartidos. Revisar nombres oficiales según idioma cuando existan. Nombres de rareza candidatos: Habitual / Common, Singular / Uncommon y Extraordinario / Extraordinary; T13/T14 validarán su comprensión.

Separar etiquetas y textos del arte para reutilizar las mismas ilustraciones y animaciones. Diseñar botones, cartas y paneles para que el texto cambie de longitud. Fechas, números y porcentajes se formatean según la configuración local acordada; cambiar idioma no cambia moneda, región comercial ni saldo. Mantener el idioma del documento web y las etiquetas accesibles coherentes.

### Trabajo y aceptación

| Registro | Responsables | Entrega pendiente |
| --- | --- | --- |
| F17 Idiomas P0 | PE UX Staff | Selector persistente, mensajes es/en y catálogo localizado; cambio de idioma sin alterar el estado. |
| T14 Localización | PO UX PE Visual | Inventario de textos, glosario y revisión en ambos idiomas. Estimar traducción, adaptación y QA; coordinar con T04/T05/T06/T10/T12/T13. |

T14 verifica el recorrido completo en ambos idiomas, móvil, ampliación, teclado y lector de pantalla; plurales, probabilidades, errores y recuperación. Detectar claves ausentes y desbordamientos antes de entregar. El piloto requiere traducciones revisadas; no traducir durante una apertura con una API externa. Nuevas tiendas incluyen sus dos idiomas en su presupuesto y aceptación. Las estimaciones previas no incluyen este trabajo.

## 28 Fuentes de producto y producción

Fuentes primarias consultadas el 8 de octubre de 2026. Documentan referentes y capacidades; las interpretaciones de producto se presentan como propuestas. Las fuentes no acreditan licencia, demanda ni resultados de pruebas de esta aplicación.

[R01] Harry Potter enciclopedia y productos Weasley

<https://www.harrypotter.com/fact-file/locations/weasleys-wizard-wheezes>

[R01b] Harry Potter productos de la tienda

<https://www.harrypotter.com/features/ranked-six-funniest-products-at-weasleys-wizard-wheezes>

[R02] Universal guía de tiendas y dulces

<https://blog.discoveruniversal.com/espanol/la-guia-para-the-wizarding-world-of-harry-potter/>

[R03] Jam City evento de ranas

<https://jamcity.helpshift.com/hc/en/41-harry-potter-hogwarts-mystery/faq/4663-how-do-i-play-the-chocolate-frogs-event/>

[R04] HEXRPG guía sección Wizard Card Collection

<https://www.hexrpg.com/knowledge/2>

[R05] Pokémon TCG Pocket

<https://tcgpocket.pokemon.com/en-us/>

[R06] Potterlike página del creador

<https://solodev00.itch.io/potterlike>

[R07] Krita licencia y animación

<https://krita.org/en/about/license/>

[R07b] Krita exportación de animación

<https://docs.krita.org/en/reference_manual/render_animation.html>

[R08] Inkscape licencia

<https://inkscape.org/en/about/license/>

[R09] GSAP documentación y licencia

<https://gsap.com/community/standard-license/>

[R10] Rive assets y estados

<https://rive.app/docs/editor/fundamentals/assets-overview>

[R10b] Rive máquinas de estados

<https://rive.app/docs/editor/state-machine/state-machine>

## 29 Fuentes de aplicación y negocio

[R11] Potter DB recursos documentados

<https://docs.potterdb.com/resources>

[R12] HP API

<https://hp-api.onrender.com/>

[R13] OpenAI Decisions API

<https://developers.openai.com/api/docs/guides/decisions>

[R14] Warner formulario de licencias actualizado en 2021

<https://www.warnerbros.com/assets/corpcomm/LICENSING_SUBMISSION_FORM.pdf>

[R14b] Harry Potter términos

<https://www.harrypotter.com/terms/terms-row>

[R15] WCAG 2 2

<https://www.w3.org/TR/WCAG22/>

[R16] Apple Small Business Program

<https://developer.apple.com/app-store/small-business-program/>

[R17] Google Play comisiones

<https://support.google.com/googleplay/android-developer/answer/112622>

[R18] IndexedDB

<https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API>

[R19] PostgreSQL bloqueos

<https://www.postgresql.org/docs/current/explicit-locking.html>

[R20] Movimiento reducido

<https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>

[R21] Google Playground ayuda

<https://playground.google/helpcenter>

### Cambios de la versión 0 5

Añade rareza solicitada por Enric y sección 26 con tabla R1, colección, canje, arte y datos. La sección 27 exige español e inglés desde la primera versión. Incorpora F16/F17, U24, T13/T14 y D09/D10; amplía T08 y U23. Conserva Callejón Diagón con Weasley primero. No incorpora simulaciones, pruebas con usuarios ni llamadas a Decisions API nuevas.
