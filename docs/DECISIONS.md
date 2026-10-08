# Decisiones de Colección Mágica

Registro inicial del 8 de octubre de 2026, basado en el [PRD v0.5](PRD.md) y en la instrucción de Enric de conservar Callejón Diagón, Weasley primero, colección, rarezas y español e inglés desde el inicio. La conversión conserva íntegro [el Word original](PRD_Coleccion_Magica.docx); este registro organiza su estado y añade una propuesta concreta de primer incremento.

**Aprobada** significa elección explícita de Enric; **propuesta** significa alternativa o regla de ensayo pendiente de elección o validación; **incertidumbre** significa pregunta que requiere decisión o evidencia. Ninguno de estos estados implica que exista código, pruebas o distribución. La petición inicial autorizó esta documentación y la propuesta del incremento; las directrices posteriores se registran como reglas de trabajo.

## Decisiones aprobadas

| ID | Decisión | Evidencia y límite |
| --- | --- | --- |
| D02 | Callejón Diagón como marco, Weasley como primera tienda jugable y futuras expansiones por tiendas. | PRD §§1, 24 y 25; reafirmado por Enric en esta tarea. No se ha elegido segunda tienda, calendario, mecánica, conexión, precio o acceso. |
| D09 | Hallazgos con rangos y distinta dificultad de obtención desde el prototipo. | PRD §§24 y 26; reafirmado en esta tarea. No aprueba nombres, asignaciones, 70/25/5, garantía de mala suerte ni monetización del azar. |
| D10 | Experiencia completa en español e inglés desde el primer componente y la primera versión, también en piloto y expansiones. | PRD §§24 y 27; instrucción de Enric del 8 de octubre de 2026 precisa “desde el primer componente”. Incluye estados alternativos y accesibilidad; no aprueba el idioma inicial automático. |
| A01 | Conservar ranas, grageas y bromas en la visión; las ranas pueden revelar personas u objetos como adaptación del juego. | Tabla “Decidido por Enric” del PRD §1. La caja de bromas sigue P1 sin contenido de entrega elegido. |
| A02 | Conservar la colección como núcleo de la aplicación. | Instrucción actual de Enric; PRD §§1 y 5. Organización propuesta: Personas, Objetos y Sabores, descubrimientos y copias conservados. No aprueba un tamaño de catálogo ni un canje concreto. |
| A03 | Usar Decisions API como apoyo solicitado para preguntas acotadas. | PRD §§1 y 16. No hay llamada ejecutada ni acceso verificado; no hace falta para el núcleo ni sustituye decisiones de Enric o evidencia de usuarios. |
| A04 | PRD como referencia principal; conservar estados de decisión, documentar decisiones nuevas y actualizar el PRD cuando cambie el alcance. | Instrucción de Enric del 8 de octubre de 2026. La actualización debe indicar versión, cambio y estado; el Word se conserva como referencia histórica. |
| A05 | Trabajar por recorridos completos y pequeños, definiendo para cada incremento qué comportamiento podremos probar. | Misma instrucción. Documentar situación inicial, acción, resultado observable, persistencia y recuperación pertinentes; comprobar ambos idiomas. |
| A06 | Separar textos de ilustraciones; ante falta de arte, usar sustitutos identificados y documentar los assets necesarios. | Misma instrucción; PRD §§11–14 y 27. Distinguir recurso final pendiente, sustituto previsto y utilizado; no presentar recursos provisionales como arte aprobado. |
| A07 | Versionar y subir el contenido actual a `earandes/diagon-alley` en GitHub. | Petición explícita de Enric del 8 de octubre de 2026. Repositorio remoto comprobado vacío; inicialización en `main`, documentación y Word original incluidos. No cambia el alcance de producto ni aprueba construir I1. |

D02, D09 y D10 conservan los IDs del PRD. A01–A07 son identificadores de este registro para elecciones explícitas del documento o instrucciones posteriores, sin reasignar IDs del PRD. El PRD declara **D01 y D03–D08 como propuestas**, pero no enumera su correspondencia completa; no se inventa ni reasigna ese historial. Las nuevas propuestas usan P para evitar colisiones.

## Propuestas pendientes

| ID | Propuesta | Fuente | Qué falta decidir o comprobar |
| --- | --- | --- | --- |
| P01 | Web móvil; React/TypeScript/Vite, catálogo JSON, IndexedDB y CSS; GSAP solo si coordinar capas lo justifica. | §§9, 14 y 15; T06 | Selección técnica y dispositivos; recorrido local recuperable. Kotlin/Spring + PostgreSQL y monolito TypeScript son alternativas para el piloto, no stack aprobado. |
| P02 | Cuento teatral 2D por capas; comparar cartoon simple, muestra de callejón/fachada/interior y recursos antes del lote. | §§11–14; T05 | Estilo final, lectura, consistencia, permisos, tamaño y tiempo de producción. Rive opcional; tamaños, paleta y duración de aperturas candidatos. |
| P03 | Doce identidades C01–C04/O01–O04/S01–S04; regalos O01/O02/S01/S02, una rana y una unidad de grageas; colección inicial 4/12. | §§3, 4 y 7; T04/T05/T08 | Catálogo, nombres y efectos de ensayo; coste y comprensión. Los regalos son conocidos y permanentes, distintos de una apertura aleatoria. |
| P04 | Rana entrega un cromo y grageas una ficha de sabor; tabla R1 frente control U0; resultado persistido antes del ritual. | §§4, 14, 15 y 26; T06/T08/T10/T13 | Implementación fiable y balance. R1 propone Habitual/Common, Singular/Uncommon y Extraordinario/Extraordinary, con 70/25/5 por rango; cada identidad tiene su porcentaje propio. |
| P05 | Taller experimental B: invento + sabor, Discreción/Diversión, E1–E3; piezas reusables y premio único inicial. Comparar con colección A con igual presupuesto. | §§6, 8 y 20; T04/T11 | Comprensión y uso sin premio; alcance A/B. Aprendiz/probador, efectos y mínimos no son decisiones definitivas ni atributos canónicos. |
| P06 | Canje manual de tres excedentes por una identidad faltante de la misma familia, de cualquier rareza; conservar última copia. | §§5 y 26; T08/T13 | Comparar 2:1, 3:1 y 4:1, completitud y frustración. Cromos agrupa personas/objetos; Sabores es independiente. Sin conversión automática ni moneda de polvo. |
| P07 | Un vale cada 24 horas desde el alta, primero a las 24 horas, reserva tres, elección de producto; sin caducidad del saldo acreditado. | §7; T08/T09/T11 | Simulación, presión y retorno; comparar sin límite. El cursor avanza todos los intervalos, también los descartados por reserva llena. Sin venta de vales. |
| P08 | Núcleo gratuito; estudiar cosmético conocido o expansión de contenido listado; club solo con capacidad demostrada. | §§17–19; T12 | Permisos, oferta, coste y compras observadas. Cobrar por tiendas no está aprobado; cifras económicas y canon supuesto son sensibilidades. |
| P09 | Público candidato de adultos fans de sesiones breves; entrevistas, pruebas formativas y piloto de 14 días con retorno espontáneo separado. | §§2 y 20; T02/T03/T11 | Público elegido, hábitos, utilidad y criterios previos a evaluar. 6/8, 30–50 y demás tamaños son propuestas internas, no resultados. |
| P10 | Preferencia de idioma guardada; primer acceso español si navegador indica español e inglés en los demás casos; glosario es/en y revisión de nombres. | §27; T14 | Validar criterio inicial, traducciones, plurales, expansión de texto y formatos. D10 obliga ambos idiomas con independencia del criterio elegido. |
| P11 | Prototipo local con guardado explícito, JSON validado y reset confirmado; piloto con cuentas y autoridad de servidor. | §§8 y 15; T09/T10 | Contratos, recuperación, conservación/borrado y transición de demo. Nunca trasladar saldo local manipulable como económico confiable. |
| P12 | APIs de contenido opcionales y revisadas; Decisions para alternativas con evidencia; Playground opcional. | §16; T06/T07 | Acceso, utilidad y exportación reales. Ninguna apertura depende de llamadas externas; la IA no decide azar, premios o cobro. |
| P13 | I1 local bilingüe de Callejón → Weasley → rana → colección, con rareza y recuperación desde la primera entrega. | §24 y propuesta detallada abajo | Implementación aún no iniciada. Usa configuración de ensayo de P03/P04; no convierte sus reglas en balance final. |

## Incertidumbres abiertas

Se conservan U01–U24. Los perfiles responsables del PRD representan funciones propuestas, sin personas contratadas ni calendario comprometido. Los estados siguientes proceden del documento; sus próximos pasos no se han ejecutado en esta tarea.

| ID | Pregunta pendiente | Próxima evidencia y perfiles del PRD |
| --- | --- | --- |
| U01 | Permisos para distribuir materiales de Harry Potter dentro del marco elegido. | T01: materiales, usos y autorización; PM/Staff. |
| U02 | Público elegido y hábitos reales; adultos fans casuales ES es candidato. | T03: entrevistas y elección de segmento; PM/UX. |
| U03 | Necesidad y diferencia frente a referentes; conexiones futuras sin validar. | T02/T03: uso real y fricciones; PM. |
| U04 | Colección A frente a taller B de invento + sabor. | T04/T11: utilidad y coste; PM/PO. |
| U05 | Suministro, reserva, presión y capacidad de sostener retorno. | T08/T11: simulación y sesiones; PE/PM. |
| U06 | Comprensión de rana con persona/objeto y grageas con sabor. | T05/T11: adaptación narrativa y explicación; PE/Designer. |
| U07 | Catálogo 4+4+4, caja futura y percepción de rarezas. | T05/T13: nombres; T08: completitud/canje; PO/Visual. |
| U08 | Canje y conservación de copias; ratio aún sin balance. | T08/T11: sensibilidad 2/3/4 y frustración; PE/Finance. |
| U09 | Siguiente tienda, mecánica propia, conexión, coste y acceso. | T04/T12: expansión que aporte valor; PM. |
| U10 | Oferta conocida, costes, pagos anteriores y permiso para ventas. | T03/T12; Finance. |
| U11 | Si hay evidencia para reabrir PvP, trading o social. | Diseño y operación propios solo si se reabre; PM. |
| U12 | Estilo final, coste y legibilidad del callejón e interior. | T05/T11: muestra en contexto; Visual/UX. |
| U13 | Consistencia del pipeline de referencias y retoque. | T05: personas/objetos y tiempo medido; Visual. |
| U14 | Procedencia y usos de cada recurso, modelo y herramienta. | T01/T05: manifest y permisos; Staff/Visual. |
| U15 | Plataforma y dispositivos adecuados; web móvil candidata. | T06: necesidad real; Staff. |
| U16 | Utilidad y cobertura de importación opcional de APIs. | T06: muestra revisada sin dependencia de apertura; PE. |
| U17 | Acceso a Decisions y utilidad/exportación de Playground. | T07: acceso configurado y ejecución real; PE. |
| U18 | Motor de animación, edición, peso y exportación. | T06: medir CSS/GSAP, Rive opcional; Designer/Staff. |
| U19 | Recuperación y transición entre demo local y piloto servidor. | T09: contratos y reconciliación; Staff. |
| U20 | Accesibilidad, errores, arte ausente y rendimiento reales. | T10: teclado, lector y dispositivos acordados; UX/Staff. |
| U21 | Total de horas/caja, callejón, rarezas, localización, expansiones y operación. | T12: presupuesto, personas y costes cotizados; Finance/PO. |
| U22 | Eventos mínimos, retención de datos, cohortes y denominadores. | T09/T11: plan de medición; Staff/PM. |
| U23 | Traducción y QA completos en los dos idiomas obligatorios. | T14; PM. D10 ya resuelve qué idiomas: notificaciones diferidas y otros idiomas sin alcance aprobado. |
| U24 | Nombres/asignaciones de rareza, probabilidades, canje y posible garantía ante mala suerte. | T08/T13 y T14 para etiquetas bilingües; PM/PO/PE/UX. |

## Primer incremento propuesto

### P13 I1 Callejón Weasley rana y colección en dos idiomas

Una persona entra en el Callejón Diagón, accede a Weasley, consulta qué puede contener una rana, usa una unidad explícitamente y encuentra el cromo obtenido en su colección. Puede volver al callejón, cambiar idioma y recargar sin perder ni duplicar lo obtenido. Este incremento comprueba el corazón de T06 y la recuperación de T10 con localización T14 y presentación de rareza T13.

Se mantiene I1 del PRD §24 y se incorporan F16/F17 desde él para cumplir D09/D10. Grageas y objetivo siguen en I2, taller en I3 y canje en I4. La entrega amplia descrita al final de §24 abarca también esos recorridos; **I1 es un paso operable hacia esa entrega, no toda la primera tienda terminada**.

### Alcance y configuración de ensayo

- Prototipo privado local, candidato React/TypeScript/Vite e IndexedDB, sin cuentas ni pagos. Capas separadas para dominio, persistencia, catálogo/localización y presentación; no construir todavía el backend del piloto.
- Callejón ilustrado provisional y lista equivalente; solo Weasley disponible. Entrada y regreso con conservación de foco y posición.
- Catálogo de ensayo de doce identidades y tres familias, con IDs y contenido es/en. Regalos O01/O02/S01/S02 inicializados una vez; una rana y una unidad de grageas registradas según P03. **La unidad de grageas se conserva, pero su apertura aún no está habilitada**: indicar su estado sin ofrecer gasto ni tratarla como stock cero. No es un compromiso de catálogo final.
- Detalle de rana con ocho candidatos C01–C04/O01–O04, tabla R1 propuesta y porcentajes por identidad de §26: C01/C02/O01/O02 a 17,5 %, C03/O03 a 12,5 % y C04/O04 a 2,5 %. Suma 100 %, personas/objetos 50/50. La tabla y etiquetas están versionadas e identificadas como configuración experimental, sin declarar balance validado.
- Confirmación “Usar 1 rana” / “Use 1 Chocolate Frog”; apertura, omisión y resultado de persona u objeto, nuevo o repetido. Resultado estático equivalente y arte provisional identificado; sonido opcional solo con activación explícita si se incluye.
- Colección, ficha y filtros por familia/rareza, con regalos, copias, descubiertos/pendientes y total coherente. Los sabores iniciales preservan la tercera familia antes de habilitar grageas.
- Operación local atómica con recuperación, registro técnico de operaciones y versiones; aviso de guardado local, exportación/importación validada y reinicio confirmado.
- Selector Español/English en entrada y ajustes, persistente y accesible. Adoptar P10 como opción de ensayo identificada, sin convertirla en decisión final de idioma inicial.

No incluye encargos, canje, objetivo elegido, reposición, garantías de mala suerte, historial visible de operaciones, segunda tienda, cuentas, APIs externas ni pagos. Las bromas mantienen su lugar en la visión sin botón de apertura prometido. Al terminar la única rana, la colección permanece accesible y se explica el suministro realmente disponible en esta demo.

### Recursos visuales necesarios y sustitutos previstos

El espacio de trabajo contiene documentación y ningún asset de aplicación. Los siguientes recursos y sustitutos son **pendientes de producir** para I1; no hay archivos visuales implementados ni estilo aprobado. La lista deriva de PRD §§11–14 y del alcance P13.

| ID de recurso | Uso en I1 | Asset final necesario | Sustituto previsto para probar |
| --- | --- | --- | --- |
| I1-V01 | Callejón y acceso a Weasley | Fondo de callejón y fachada separados, con espacio para controles y adaptación móvil. | Escena esquemática con formas simples y botón de tienda; lista HTML equivalente. |
| I1-V02 | Interior de Weasley | Fondo, mostrador y estantes por capas, con zonas Dulces/Bromas/Mostrador y UI independiente. | Paneles de color con rótulos HTML localizados y estante funcional de rana. |
| I1-V03 | Detalle y apertura de rana | Envase base, tapa, interior, rana y sombra con transparencia, coordenadas y pivotes coherentes. | Caja y silueta simples por capas, con transición omitible o resultado estático; nunca una recompensa ficticia. |
| I1-V04 | Revelación y álbum | Dorso/marco modular e ilustraciones de C01–C04 y O01–O04; entrega editable y exportaciones de carta/detalle/miniatura. | Carta con símbolo de familia y espacio de arte provisional; nombres, contexto y copias en HTML. |
| I1-V05 | Sabores de bienvenida | Ilustraciones modulares de S01 y S02 para fichas del álbum; S03/S04 pueden conservar espacio pendiente hasta I2. | Símbolo de sabor y nombre localizado; no depender del color para identificarlo. |
| I1-V06 | Rareza y estados | Iconos/marcos para los tres rangos de ensayo, con igual legibilidad; variantes finales sujetas a T13/T14. | Círculo, rombo y estrella simples más etiqueta es/en; no añaden potencia ni variantes de colección. |

Durante la implementación se registrarán las rutas y versiones de los sustitutos realmente utilizados, la procedencia y las entregas finales pendientes. La interfaz los identificará mediante “Ilustración provisional” / “Placeholder artwork”, fuera del bitmap. Sustituir el arte conservará IDs, textos, reglas y partida; comprobar el recorrido también con imagen ausente. Las traducciones y textos accesibles estarán disponibles desde el primer componente.

### Criterios de aceptación

| ID | Caso verificable | Resultado esperado |
| --- | --- | --- |
| I1-AC01 | Entrar por escena y por lista; visitar Weasley y regresar. | Ambas rutas funcionan con teclado/táctil; no gastan, conservan progreso y recuperan foco/posición. No hay otra tienda jugable ni fecha inventada. |
| I1-AC02 | Primer acceso y siguientes accesos con P03. | O01/O02/S01/S02 figuran como regalos conocidos, una copia cada uno; colección 4/12, una rana y una unidad de grageas pendiente de habilitar. Recargar no repite regalos. |
| I1-AC03 | Consultar y cerrar detalle de rana. | Ocho identidades, familia, rango, porcentaje individual y versión R1 visibles y correctos. Se explica persona u objeto sin garantía; stock intacto hasta confirmación explícita. |
| I1-AC04 | Confirmar una apertura con persistencia disponible. | Una única transacción guarda consumo, operación, resultado, copia y versiones antes de mostrar éxito. Rana 1→0; copias totales 4→5. Si es nuevo, descubiertos 4→5; si repite O01/O02, siguen 4 y sube su contador. |
| I1-AC05 | Doble toque, misma clave/petición, misma clave/otra petición y otra clave para la unidad consumida; también dos pestañas. | Un solo consumo y una sola copia. Reintento idéntico devuelve la operación original; conflicto o unidad agotada se rechazan sin sortear. |
| I1-AC06 | Recargar antes del commit, después del commit y durante la animación; omitir o cambiar idioma. | Antes del commit abortado, ni consumo ni copia parcial; tras confirmación, recuperar el resultado original y sus versiones. Nunca volver a sortear ni regalar otra unidad. |
| I1-AC07 | Fallo de guardado y estado de entrega desconocido. | No se anima éxito ni se muestra saldo confirmado inventado. Se conserva el estado coherente previo o se consulta la misma operación; reintento recuperable. |
| I1-AC08 | Visitar colección, ficha y filtros antes/después de la apertura y con rana agotada. | Personas/Objetos/Sabores, nombre, procedencia, rareza y copias consistentes. Filtrar no cambia el total base de doce. No ofrecer apertura imposible; ningún repetido se oculta como nuevo. |
| I1-AC09 | Probar Español y English, incluidos vacío, carga, errores, stock cero y recuperación. | Sin claves ausentes ni mezcla accidental; plurales y porcentajes correctos; idioma del documento y etiquetas accesibles coherentes. El cambio mantiene vista, inventario y operación. |
| I1-AC10 | Recorrer con teclado/lector, movimiento reducido, omisión y arte ausente; móvil y ampliación. | Foco visible y retorno al origen; resultado anunciado una vez; rango con etiqueta/forma además de color. Texto legible, acciones equivalentes y sin bloqueo por imagen, sonido o gesto. Registrar cobertura; no declarar certificación WCAG. |
| I1-AC11 | Cargar una tabla inválida, faltar un texto es/en o cambiar configuración con operación ya guardada. | Rechazar referencias/pesos inválidos y detectar traducción ausente; no inventar probabilidades. Una operación confirmada mantiene identidad, rango y versiones originales. |
| I1-AC12 | Exportar/restaurar estado válido; importar JSON inválido; cancelar y confirmar reinicio. | Estado válido recupera copias, unidades, idioma y operaciones. Importación inválida o reset cancelado conservan datos; reset confirmado crea otra demo claramente local, sin crédito económico de piloto. |

### Preparación orden de trabajo y evidencia de término

1. Registrar stack y perfil de ensayo; preparar catálogo, traducciones, versiones y sustitutos de arte. Especificar transacción y recuperación antes del ritual.
2. Construir dominio y persistencia; comprobar validación de tabla, inicialización única, consumo/copia atómicos, idempotencia y concurrencia. Usar selección controlada en pruebas para cubrir nuevo, repetido y cada rango, sin atribuir esos resultados a sorteos reales.
3. Integrar callejón/lista, Weasley, detalle, resultado y colección con selector de idioma y accesibilidad. Añadir el ritual omitible únicamente sobre el resultado persistido.
4. Comprobar I1-AC01–12 en ambos idiomas y documentar comandos reales, versiones, dispositivos/navegadores, casos, resultados y limitaciones. Compilación/tipos/pruebas cuando exista código; registro de comprobación manual de interfaz y lector.

I1 estará terminado cuando el recorrido sea operable y sus criterios estén comprobados, con inventario persistido y coherente. Una captura, una animación o documentación sola no lo completan. Su validación local no demuestra autoridad de servidor, permisos de distribución, retención de usuarios ni rentabilidad.

La elección técnica y el perfil R1 pueden registrarse como hipótesis de construcción al autorizar la implementación; no exigen calibrar el producto final para construir esta demo. Antes del piloto se deben resolver tabla/nombres con T08/T13, público y presupuesto, autoridad/recuperación con T09 y condiciones de distribución de T01. Tras I1, I2 añade apertura de grageas y objetivo manteniendo ambos idiomas y rareza.

## Actualización del registro

Al aprobar o descartar una propuesta, anotar fecha, instrucción o evidencia concreta, responsable real si existe y consecuencias; conservar su ID y estado anterior. No cerrar una incertidumbre por consenso entre agentes ni por haber elegido una configuración de demo. Registrar por separado implementación y verificación.

**8 de octubre de 2026 — Directrices de trabajo:** registrados A04–A06 y precisado D10 por instrucción de Enric; actualizadas las instrucciones de `AGENTS.md` y documentados los recursos pendientes de I1. Se mantiene el alcance propuesto de P13 y el estado de P01–P12/U01–U24. Al no cambiar el alcance del producto, `PRD.md` conserva la conversión íntegra v0.5; los cambios futuros de alcance se incorporarán allí con versión y nota de cambio.

**8 de octubre de 2026 — Repositorio:** registrada A07; inicializado Git en `main` y configurado el remoto solicitado, comprobado vacío antes de la subida. Añadido README para acceder a la documentación y `.gitignore` para excluir metadatos `.DS_Store` de macOS. El PRD y el Word mantienen su contenido y el alcance de I1 permanece propuesto.

Estado de esta entrega: documentación preparada; aplicación e I1 sin implementar. No se han realizado entrevistas, simulaciones del modelo actual, llamadas a Decisions API, pruebas de producto ni trámites de licencia.
