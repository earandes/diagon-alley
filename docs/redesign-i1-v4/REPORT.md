# Auditoría y propuesta de rediseño integral de I1

10 de octubre de 2026. Aplicación auditada: `a88d923ee6dd0caaeaf55107411fd65ac1419bd4`, PRD v0.19. Estado de esta entrega: **análisis y mocks navegables; el rediseño no está implementado en la demo**.

La aplicación tiene una base funcional que conviene conservar. El problema visual principal es que se visita una ilustración y después se utilizan paneles superpuestos a ella. La magia existe en el dibujo, pero la interfaz transmite un catálogo de consultas. Añadir partículas o más dorado no resuelve esa separación.

Recomiendo una dirección de **cuento teatral contemporáneo**: un espacio reconocible, objetos que invitan a consultar, una caja protagonista sobre el mismo mostrador y un álbum que parece pertenecer a la visita. Lo moderno procede de la jerarquía, la continuidad y la respuesta de los controles. La riqueza ilustrada A11/A12 se conserva.

## Abrir y comparar

- [Canvas interactivo](canvas.html): ocho vistas principales, consulta de grageas/inventos, español/inglés, ancho 320/390 y muestras adversas. Permite explorar el recorrido con datos guionizados en memoria; **no usa IndexedDB ni modifica la partida**.
- [Mocks de visita](board.html): Callejón, Weasley y resultado.
- [Mocks de consulta y colección](board.html?collection=1): detalle, álbum y ajustes.
- [Galería actual y propuesta](GALLERY.md) y [manifest de arte](art-manifest.json).

Con el servidor del proyecto en 5193: `http://127.0.0.1:5193/docs/redesign-i1-v4/canvas.html`. Ejecutar `npm run dev -- --port 5193 --strictPort` si hace falta arrancarlo. La demo real sigue en `/`.

## 1. Alcance y método

He leído README, AGENTS, PRD y DECISIONS completos, revisado `src/ui`, datos y localización, y observado la app real con Playwright CLI local. Esta propuesta cubre **toda la aplicación actual**: Callejón, tienda, consultas secundarias, rana, ritual, resultado, álbum, ficha y ajustes, con sus estados adversos. La bienvenida con cuenta A19 y la ampliación ambiental A20 permanecen posteriores; no se diseñan aquí como funciones disponibles.

Las cinco skills están instaladas por proyecto. No se han reinstalado globalmente, actualizado sus revisiones fijadas o añadido dependencias. Uso concreto:

| Skill | Aplicación en esta auditoría | Adaptación al encargo |
| --- | --- | --- |
| [Taste](../../.agents/skills/taste-skill/SKILL.md) | Auditoría antes de proponer, composición, jerarquía, espacio y retirada de marcos redundantes. | Es una guía de marketing, no de todas las reglas del juego. No impone su stack, modo doble, bibliotecas o tipografía. |
| [Web Design Guidelines](../../.agents/skills/web-design-guidelines/SKILL.md) | Reglas actuales consultadas; foco, errores, controles, navegación y reflujo. | Se aplica a `src/ui` completo, indicado por el encargo. Sin adoptar Title Case inglés en español ni recortar información necesaria. |
| [Awesome Design / Fantasy](../../.agents/skills/awesome-design-fantasy/SKILL.md) | Tokens semánticos y anatomía/estados de los componentes. | Se conserva ciruela, cobre, crema y madera; su azul/New Rocker no reemplaza la identidad. Es referencia, no sistema oficial de Harry Potter. |
| [Image-to-Code](../../.agents/skills/image-to-code-skill/SKILL.md) | Inspección de las tres imágenes aportadas, extracción de jerarquía, continuidad y diferencias con la app. | Reutilizar referencias existentes; no generar otras imágenes o afirmar que el raster entrega capas. |
| [Playwright CLI](../../.agents/skills/playwright-cli/SKILL.md) | Navegación real, capturas, medidas de DOM y revisión del canvas. | Sesión aislada `diagon-audit-v4`, contextos desechables, sin tocar tu perfil o tus partidas. |

Fuentes primarias: [Taste](https://github.com/Leonxlnx/taste-skill), [reglas Vercel consultadas](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md), [Awesome Design](https://github.com/bergside/awesome-design-skills), [Image-to-Code](https://github.com/Leonxlnx/taste-skill/tree/main/skills/image-to-code-skill), [Playwright CLI](https://github.com/microsoft/playwright-cli). Snapshot de reglas en [web-guidelines-2026-10-10.md](web-guidelines-2026-10-10.md); revisiones instaladas en `.agents/skills/design-sources.json`.

## 2. Lo que funciona y merece conservarse

- La apertura requiere una acción explícita y sucede sobre una entrega guardada. El rediseño no debe trasladar el sorteo a la animación.
- Consultar un producto es distinto de consumirlo. Grageas tienen una unidad reservada y no una apertura ficticia.
- La bienvenida, seis candidatos, rangos e IDs compartidos están configurados. Ninguna imagen fija el premio.
- Existe álbum antes/después de abrir, con stock cero, regalos y total de doce.
- Idioma, foco, omisión, movimiento reducido y guardado local ya tienen fronteras en el código. Conviene mejorar su presentación sin empezar de nuevo el dominio.
- La barra inferior ya está eliminada. Volver a introducir una para organizar el rediseño contradiría A27.

Estas son observaciones de código y recorrido. La validación adversa completa anterior está en `docs/i1-evidence/REPORT.md`; esta auditoría no vuelve a certificar todos sus resultados.

## 3. Diagnóstico general

**La jerarquía se repite demasiado.** Marca, idioma, ajustes, guardado, etiqueta introductoria, título y descripción preceden a muchas escenas. La ilustración empieza tarde; después aparecen otras tarjetas, explicación y accesos. La información es correcta, pero no todo necesita el mismo protagonismo.

**Casi todo parece un botón principal secundario.** Volver, pausa, inventos, álbum y consultas comparten contorno cobre y cápsulas. La regla general de botones en `visual.css` vuelve a dar borde incluso a controles que antes eran de texto. No basta con contar elementos `<button>`: una estantería accesible necesita controles; lo que sobra es repetir su acción y su aspecto.

**El espacio cambia sin una continuidad física suficiente.** Interior reducido a una franja, caja sobre un recorte con cojín geométrico y recompensa dentro de otro marco. Se perciben montajes distintos del mismo material, no un mostrador que mantiene su posición.

**La colección mezcla acabados.** Dumbledore y dos inventos tienen raster detallado; otras personas/objetos son SVG sencillos, y sabores usan símbolo/ID. El rango Habitual de C01 no evita que parezca más elaborado que otras piezas. La calidad visual puede confundirse con rareza.

**La interfaz tiene deuda fuera del recorrido feliz.** El error de importación queda fuera de vista, Atrás del navegador sale de la aplicación y el escritorio conserva un marco estrecho de móvil. Estos problemas aportan más fricción que la falta de efectos.

## 4. Auditoría pantalla por pantalla

### Callejón

Ahora: escena 2.5D útil, entrada clara y alternativa de lista. La visita queda encerrada entre una introducción y más paneles. «Entrar en Weasley» y otra tarjeta «Weasley» repiten destino; el cartel añadido no parece parte del mismo dibujo. La pausa también recibe contorno de botón.

Propuesta: fondo amplio, título breve y una placa de destino con **Entrar en Weasley**. Álbum con progreso como acceso discreto. Selector de idioma visible desde la entrada; pausa localizada y accesible. La vista de lista debe recolocar los mismos controles, con un acceso visible a esa alternativa, en vez de pintar otra ficha de tienda. Un `<ul>` con botones semánticos puede representar el mismo destino en ambos modos.

No eliminar el destino de texto o hacer que la puerta ilustrada sea el único control. La muestra actual reutiliza un fondo sin capas; farol/cartel finales necesitan posiciones y oclusiones coherentes. No ampliar a lechuza/cámara/paseante en I1.

### Interior Weasley

Ahora: la rana tiene tres rutas de consulta: pequeño botón en escena, tarjeta y lista expandible. Otros productos repiten imagen, nombre, estado y botón. La escena ocupa aproximadamente una franja de 205 px en 390; la tienda completa tiene 1.322 px de alto. Los controles principales caben, pero el local es un prólogo a una cuadrícula.

Propuesta: mostrador continuo y **cuatro objetos consultables**, cada uno con un único control que contiene imagen, nombre y estado. Se quitan los botones internos «Consultar» y la mini rana adicional. Un pequeño indicador sobre la rana señala que se puede consultar, sin consumir. El modo lista usa los mismos elementos en disposición vertical; no crea otra capa de botones.

Los inventos conocidos se presentan como regalos de tu álbum. Grageas: «1 guardada / apertura pendiente», con consulta disponible. El álbum queda al alcance al agotarse la rana. No convertir productos pendientes en objetivos de juego ni prometer una fecha.

### Grageas e inventos

Ahora: páginas completas para una consulta muy pequeña; gran zona vacía en grageas y marcos de ficha que se parecen al resultado.

Propuesta: una bandeja de consulta sobre el mismo local, con título, imagen y estado. En grageas conservar la distinción entre unidad guardada y apertura pendiente. En inventos, copias, regalo y «uso en taller pendiente». Un único volver/cerrar. Nada de botón Abrir deshabilitado sin motivo o acción futura destacada.

La composición de bandeja es propuesta de presentación; debe preservar el retorno al objeto que abrió la consulta. Los mocks permiten abrir ambas ramas desde Weasley.

### Rana seleccionada

Ahora: caja pequeña encuadrada, cojín dibujado que no coincide con el material y texto de garantía dentro de otro panel. «Usar 1 rana» aparece antes de las seis probabilidades, que siguen debajo durante mucho scroll. La ficha completa mide 1.489 px a 390.

Propuesta: caja grande sobre el mismo mostrador, «1 rana de bienvenida», una explicación corta y las probabilidades **abiertas y delante de la acción**. Los porcentajes del mock son los pesos de A18, 14/14/5/5/1/1 sobre 40. La implementación final los derivaría del JSON activo.

Una sola acción fuerte: **Usar 1 rana / Use 1 Chocolate Frog**. No abre al tocar la caja. Si el panel de probabilidades se contrae, volver a mostrarlo antes de habilitar gasto; sin checkbox de consentimiento o segundo diálogo rutinario. La versión experimental de tabla se mantiene cerca de los candidatos, no como una etiqueta ornamental.

A 320 en inglés el detalle requiere scroll vertical: se conserva el texto y la información antes de gastar. Es preferible a comprimir rarezas o ocultar candidatos para colocar el botón en el primer viewport.

### Ritual

Ahora: secuencia real omitible de 1,6 s, pero el montaje de piezas raster/DOM se nota. «Omitir» recibe el mismo peso dorado que «Usar», aunque es una salida de la presentación.

Propuesta: el local y el mostrador se mantienen; tapa, rana, sombra y cromo conservan sus anclas. El cromo pasa de la caja al plano de lectura. Omitir es un control claro de al menos 44 px, con menos peso visual; se puede usar desde cualquier fase confirmada.

La magia la transmiten anticipación, luz cálida localizada y movimiento creíble, no una nube de partículas. Duración: 300 + 200 + 500 + 400 + 200 ms tras commit. Misma duración para todos los rangos. Reducido: resultado estático; sin giro, salto o zoom. Nada de capturar la rana, reclamar después o cambiar el premio.

El canvas muestra **un estudio estático del ritual**, no una nueva animación producida. Los movimientos finales necesitan partes reales con transparencia; cortar otra zona del PNG no crea un rig.

### Resultado

Ahora: el título «Tu recuerdo está a salvo», cromo pequeño, caja, nombre, contexto, procedencia, copias y dos acciones compiten. «A salvo» es menos concreto que el estado real de guardado local.

Propuesta: un cromo claramente mayor, nombre como título principal, nuevo/repetido, familia, forma/rango, copias y procedencia. Mensaje «Ya está en tu álbum». Acción principal **Ver en el álbum**. Volver permanece en la navegación contextual y no compite como otra cápsula.

No decir «Añadir», «Reclamar» o «Guardar cromo»: la entrega ya debe estar guardada. C01 del mock es guionizado. La misma composición debe acomodar O03/O04 y una fixture repetida sin generar recompensas nuevas. El resultado no necesita desplegar toda la biografía.

### Álbum

Ahora: cabecera, explicación, barra, dos selectores, cantidad visible y doce tarjetas con muchos renglones. A 390 mide 2.381 px. Las siluetas SVG de pendientes no tienen el mismo acabado que el cromo revelado.

Propuesta: cubierta y ranuras de álbum, cromo descubierto con el mismo marco, pendientes con dorso y nombre/familia/rango conservados. Total global **5/12** siempre visible; familias como pestañas y un filtro adicional de rareza. El total no cambia al filtrar.

Tras un resultado, abrir en su familia y destacar la identidad obtenida. Antes de abrir, conservar acceso a los regalos y a las tres familias; la propuesta de foco inicial aún se revisa. No ordenar automáticamente todas las cartas cada vez que cambia una preferencia o volver a animarlas. «Todo» permite ver las doce; el default Personas de la lámina es una composición de muestra, no una eliminación de objetos/sabores.

La vista vacía de filtros explica que la colección sigue intacta y ofrece Quitar filtros. Mantener tanto pendientes como descubiertos consultables. En escritorio puede verse una página de cuatro columnas; en móvil, dos y una con texto ampliado. No requiere un gesto de pasar páginas.

### Ficha

Ahora: ficha útil y foco de vuelta, pero el marco grande ocupa otra página y repite el aspecto de varios paneles.

Propuesta: la misma carta ampliada, contexto breve y datos estables. Regalo conocido, pendiente y obtenido se distinguen explícitamente. Para inventos/sabores no introducir sus efectos pendientes como jugables. Al cerrar, recuperar familia, rareza, posición y foco de la carta.

No escribir nuevas biografías desde la ilustración ni inferir propiedades canónicas. Para este mock se reutiliza el contexto existente. Una ilustración ausente deja la información y el cierre disponibles.

### Ajustes, restauración y reinicio

Ahora: ajustes muestra de golpe idioma en cabecera, información local, UUID, movimiento, audio inexistente, exportación, archivo, textarea, revisión y reset. Restauración inválida levanta un alert global por encima del formulario.

Observación reproducida: al pulsar Revisar restauración, `scrollY=569`, error en `top=-459` y foco en el botón. El screenshot del viewport **no contiene el error**. El `role=alert` puede anunciarlo, pero no resuelve su colocación visual o el foco. Es prioridad funcional.

Propuesta: bloques Tu visita y Tu partida. Ajustes de movimiento agrupados. Restaurar se expande a demanda; error junto al campo, `aria-describedby` y foco en error/campo pertinente. Identificador y versiones en información técnica expandible. Exportación accesible; reset separado y confirmado. La muestra incorpora un diálogo nativo de confirmación con retorno de foco al cancelar, sin tocar datos reales.

Se observó «Choose File / No file chosen» en una captura ES. Es el control nativo del Chrome de inspección, no una cadena inglesa del catálogo. Si se busca continuidad visual bilingüe, usar etiqueta HTML localizada para elegir archivo y mostrar el nombre seleccionado; conservar un input accesible y selección nativa.

## 5. Reducción de controles e información integrada

| Elemento actual | Propuesta | Motivo |
| --- | --- | --- |
| Entrar por escena y segunda tarjeta equivalente | Misma acción, presentada en escena o modo lista | Conserva alternativas sin repetir destinos. |
| Mini rana + tarjeta + lista con otro botón | Un producto/etiqueta consultable; el mismo DOM cambia de disposición | Menos rutas visuales y mejor retorno de foco. |
| Cuatro imágenes con cuatro botones internos | Cuatro controles de objeto completos | Se elimina el botón dentro del botón conceptual. |
| Bordes dorados en volver, pausa y álbum | Navegación de texto; acceso de libro; CTA sólido para consumir/continuar | Aporta orden sin hacer controles invisibles. |
| Dos selectores grandes en colección | Pestañas de familia + rareza compacta | Familias visibles y un solo filtro adicional. |
| Datos técnicos, pegado e importación desplegados siempre | Secciones expandibles en ajustes | Menos carga en el recorrido normal, recuperación disponible. |

No hay un objetivo arbitrario de «dos botones por pantalla»: cuatro productos necesitan cuatro acciones. Objetivo de composición: una acción visual dominante cuando procede, un control por objeto y ninguna repetición de intención. El álbum no se esconde dentro de Ajustes.

## 6. Sistema de diseño propuesto

Intención: materiales cálidos y dibujo rico, interfaz contemporánea y tranquila. Diales de composición 6/3/3; ritual puntual con intensidad 4 dentro del contrato actual. No se anuncian movimientos inexistentes en los mocks.

| Token | Propuesta | Uso |
| --- | --- | --- |
| `--night` | `#21151F` | Superficie de lectura y continuidad oscura. |
| `--surface` | `#30202C` | Consulta, ajustes y avisos. |
| `--cream` | `#FAEDCF` | Texto principal. |
| `--muted` | `#DBC6B1` | Estado y apoyo. |
| `--gold` | `#EDBF78` | Acción principal y pequeños detalles físicos. |
| `--mint` | `#B1E0CB` | Stock/guardado, con texto explícito. |
| `--focus` | `#A0E7DC` | Foco visible. |
| Radio | 12 px controles, 4-8 px ranuras, arco de carta | Geometría ligada a función; se retiran cápsulas de todo. |
| Espacio | 4/8/12/16/20/24/32 | Márgenes móvil 20; 16 en la siguiente adaptación compacta. |
| Texto | System UI; Georgia de sistema en títulos | Sin descarga, nueva licencia de fuente externa o tercer estilo. |

Cuerpo 15-16 px según componente; controles 14-16; metadatos 12-14; títulos 31-47. Reservar tamaños menores para la etiqueta de maqueta y arte provisional, no para la acción o el error. En producción medir los metadatos en el móvil acordado antes de fijar el extremo inferior de la escala.

Contraste calculado de colores **sólidos**: texto principal 15,17:1; secundario 9,30:1; botón principal 10,17:1. [Método y límites](token-contrast.json). No verifica texto sobre cada píxel de la ilustración: la composición necesita superficies/scrims suficientes, y volver a medir las combinaciones finales. No acredita WCAG.

Anatomía/estados:

- **Objeto consultable:** imagen decorativa, nombre HTML, stock/pendiente/regalo. Hover opcional, foco marcado, pulsación corta. Agotado lleva a información real, no un botón de consumo.
- **Confirmación de rana:** explicación, tabla activa, consumo exacto. Reposo, guardando, fallo, entrega desconocida, agotado y tabla inválida. Durante guardado no anunciar resultado; recuperación consulta la operación original.
- **Cromo:** arte, nombre, familia, rango con forma/texto, copias y procedencia. Nuevo/repetido son estado de entrega, no un nuevo tipo de identidad. Mismo cuidado visual para todos los rangos.
- **Ranura:** descubierto, pendiente, seleccionado/foco y arte ausente. Ninguno depende solo del color. La cuadrícula no necesita animación continua.
- **Consulta:** una salida, orden de foco, nombre accesible, cierre/escape si se implementa como diálogo y retorno al origen. Naturalmente ampliable, sin altura que recorte contenido.
- **Aviso:** específico y contextual. Error de campo junto al campo; error de entrega junto a la operación; no toast efímero para pérdidas de guardado.

Tono: magia en ilustración y movimiento; instrucciones directas. «Consulta la rana», «Usar 1 rana», «Ya está en tu álbum». Reducir metáforas técnicas o garantías como «a salvo». Identificar la provisionalidad sin convertir todas las pantallas en un informe de ingeniería.

## 7. Descomposición de tus tres conceptos

Las tres imágenes son 853 × 1844 y conservan tienda/envase/personaje. Inspección directa, sin medir píxeles de una miniatura ni inferir una fuente exacta:

| Referencia | Qué aporta | Qué no trasladaría literalmente |
| --- | --- | --- |
| Interior | Puerta a la izquierda; faroles cálidos arriba; mostrador como ancla; cajas con siluetas distintas; humor y profundidad. | Cuatro tarjetas con contorno y otro botón dentro; múltiples accesos inferiores. |
| Caja cerrada | Envase reconocible de gran tamaño, mismo local, cojín y punto de atención único. | Gran panel exterior más botón volver duplicado; detalles de probabilidades solo contraídos sin muestra expandida. |
| Caja/cromo abierto | Resultado tangible, marco y sujeto cuidados, continuidad física entre envase y recuerdo. | Texto horneado en bitmap, tres cápsulas de metadatos y otro botón de volver compitiendo con álbum. |

Los mocks trasladan jerarquía y contexto a HTML y CSS, no prometen fidelidad final de pintura por capas. El recorte de caja aún contiene fondo/cushion raster y las referencias de tienda contienen rótulos decorativos en español. Se necesita arte limpio para reemplazar esas zonas y localizar la decoración final.

La evolución más importante del arte es producir **recursos separados que mantengan el mismo acabado**, no más pantallas completas con controles dibujados. El mismo cromo debe conservar marco, proporción y luz en revelación/resultado/álbum/ficha.

## 8. Accesibilidad y navegación: hallazgos concretos

Formato de revisión Vercel, adaptado a riesgos reales de I1:

| Ubicación | Hallazgo | Prioridad |
| --- | --- | --- |
| `src/ui/App.tsx:478`, `:823` | Error de importación fuera del viewport; falta relación con el campo y foco pertinente. Observado. | P0 |
| `src/ui/App.tsx:119` | Vista solo en estado React. Atrás del navegador desde tienda vuelve a `about:blank` en contexto aislado, en vez de Callejón. Observado es/en. | P1 |
| `src/ui/Shop.tsx:44`, `:56`, `:79` | Consulta de rana repetida; escenario pequeño y alternativas como conjuntos de controles duplicados. | P1 |
| `src/ui/App.tsx:635`, `:650` | Acción de gasto antes de tabla completa; ordenar para favorecer una decisión informada. | P1 |
| `src/ui/VisualArt.tsx:45` | Recorte de interior de 344 × 290 usado como fondo; limita composición, nitidez y continuidad. | P1 |
| `src/ui/VisualArt.tsx:73`, `:78`, `:83` | Mezcla raster detallado/SVG simbólico/IDs en álbum. No acabado uniforme. | P1 arte |
| `src/ui/visual.css:27`, `src/ui/styles.css:73` | Estilo general reintroduce borde cobre en botones de texto. | P2 |
| `src/ui/styles.css:84`, `:920` | Escritorio mantiene columna 480 y margen de maqueta. | P2 |
| `src/ui/App.tsx:804` | Etiqueta/localización del selector de archivo depende de UI nativa observada en inglés. | P2 |
| `src/ui/styles.css:742` | Pie a 9 px. Las etiquetas técnicas no deben ocupar protagonismo ni ser el único lugar donde explicar la demo. | P2 |

Ya existen botones nativos, etiquetas de controles, foco visible, skip link, reducción/pausa y error con alert. No se señalan como ausentes. La revisión nueva no sustituye una prueba auditiva del lector ni justifica bloquear zoom, hacer overlays solo con hover o convertir la escena en canvas inaccesible.

Para el rediseño: controles de 44 × 44 como objetivo de comodidad, focus visible, estado/familia/rango por texto, retorno al origen, misma lista/escena y errores accesibles. Mantener Escape/back donde corresponda. El historial de navegación puede resolverse con un mapa pequeño y History API; no hace falta añadir un router grande o sincronizar balances en la URL. No convertir la recuperación de operaciones en un estado de navegación que se salta.

## 9. Mediciones, revisión y límites

Método actual: Chrome headless 154 mediante Playwright CLI, desktop macOS; contexts en es-ES/en-GB, viewport 320/390 × 844, reducido para capturas normales. Contextos nuevos sin datos personales; C01 controlado en la auditoría normal y marcado como fixture. Fallos de guardado/lectura inyectados para observar UI; no resultados de APIs.

Capturas actuales: 58 de recorrido/estados en es/en a 320/390, 10 adicionales de carga/ritual/fallos/escritorio y una del error de importación en viewport. No overflow horizontal en los contextos medidos. La pasada incluye grageas, invento, filtros, stock agotado, restauración inválida y confirmación de reinicio. [Datos](audit-metrics.json), [adversos](adverse-metrics.json), scripts y logs CLI en esta carpeta.

Alturas de documento medidas, no duración de tarea ni criterio de éxito:

| Vista actual, ES 390 | Alto total | Observación |
| --- | --- | --- |
| Callejón | 1.089 px | Entrada, álbum y otra lista equivalente. |
| Weasley | 1.322 px | Ocho botones visibles en todo el documento, no ocho CTA primarios. |
| Rana | 1.489 px | Acción acaba en y=761 antes de la tabla inferior. |
| Resultado | 918 px | Acción al álbum termina en y=774. |
| Álbum, todo | 2.381 px | Doce identidades, contexto y filtros. |
| Ajustes | 1.239 px | Operaciones técnicas mostradas juntas. |

Mocks: 90 capturas, las vistas base y muestras adversas en ambos idiomas/anchos, ampliación de texto 200 % con arte ausente en álbum y composiciones de escritorio. Navegación de muestra shop/detail/ritual/result/album/ficha/filtro/idioma revisada por CLI; cancelación de diálogo devuelve foco. No overflow horizontal en los datos de muestra registrados. [Datos](mock-metrics.json), [capturas](GALLERY.md) y [script](mock-review.cli.js).

Comparación de composición ES 390: Callejón 891, tienda 962, rana 900 y resultado 844 px en el mock. Incluyen el aviso explícito de maqueta que no es producto final. El álbum Personas mide 1.071; **no comparar ese filtro de cuatro con los 2.381 de Todo en la app**, porque sería una reducción engañosa. No son pruebas de productividad, mejora de comprensión o performance.

Revisión visual directa realizada sobre capturas representativas de Callejón, interior, detalle, resultado, álbum, grageas, ajustes, error y ritual actuales; mocks del recorrido, inglés 320, álbum/ficha, ajustes/confirmación, ampliación y composiciones de escritorio. Se corrigieron en la propuesta el encuadre de Callejón, aristas de recorte de caja, escala de metadatos, foco contextual y layout de escritorio, y se volvieron a capturar. No se afirma inspección humana independiente de todas las capturas.

Pendientes: VoiceOver/NVDA audible, móvil físico, Safari real y Firefox, zoom de navegador/sistema con teclado virtual, notch real, contraste píxel a píxel de superficies ilustradas y observación A17. Reflujo 200 % es simulación CSS de texto, no una certificación de zoom real. La ausencia de arte en el mock es ocultación CSS; los fallos HTTP reales se probarían al implementar.

Entorno local observado: Node 24.20.0, npm 11.19.0 y macOS 27.0.1. `node --check docs/redesign-i1-v4/mock.js`, `git diff --check` y `npm run typecheck` correctos. La comprobación de Git confirma que `src`, `public`, package/lockfile, PRD y Word no tienen cambios respecto al SHA auditado. SHA256 del Word conservado: `7252db26b0ff4146b7ec211dcbd9624ba8e3440f59b3fd55ffea571886b2056c`. No se han repetido unitarias/build/CI de la aplicación para esta entrega documental; no se atribuye la comprobación del mock a persistencia real.

La medición de primera vista previa está en `docs/design-i1-v3/first-view.json` y corresponde a la entrega anterior; **no se ha repetido un perfil de transferencia/rendimiento en esta auditoría**. El canvas carga arte para revisar diseños, no representa el presupuesto de la app compilada. No hay prueba física de fluidez, FPS, CWV o engagement. Objetivo propuesto ≤1 MB sigue siendo presupuesto para volver a medir tras integrar arte.

## 10. Assets y siguiente paso

Utilizados en esta propuesta: `public/art/alley-v1.webp`, `interior-v1.webp`, `closed-v1.webp` y `revealed-v1.webp`, con recortes SVG/CSS y primitivas propias de interfaz. Manifest registra IDs, rutas, hash, dimensiones, origen, recortes, permiso pendiente, piezas y pivote nulo. Los WebP/originales no se han editado. No hay imagen nueva generada, producción de rig o autorización de franquicia implícita.

Pendiente final: Callejón móvil sin texto y por capas; fondo/mostrador de Weasley; caja/base/tapa/interior/cojín/rana/sombra/cromo articulables; arte coherente de las doce identidades; marcos/símbolos/localización de carteles. Mantener IDs de catálogo, copy y partida al sustituirlos. Priorizar una muestra de persona y otra de objeto antes de producir el lote; no mejorar solo a Dumbledore.

Orden recomendado de trabajo posterior:

1. Revisar este canvas y elegir la composición de consulta/álbum. La nueva dirección visual sigue propuesta, no aprobada por tener mocks.
2. Producir una muestra limpia de Callejón y Weasley/mostrador con caja separada, dentro del presupuesto local, y comprobarla a 320/390 con UI. El HTML actual permite comprobar composición; no reemplaza ese arte.
3. Integrar el recorrido existente con un contenedor de escena, controles de contexto, estantería, consulta y marco de cromo. Componentes pequeños en presentación; mantener dominio/persistencia/configuración intactos. Corregir error contextual y navegación Atrás.
4. Conectar el ritual sobre la operación ya guardada; pasar matriz I1-AC01-12, regresión adversa, es/en, teclado/reducido/arte ausente y cobertura física/lector pendiente. Medir peso/fluidez de la app real.
5. Ejecutar las sesiones A17 para valorar si ahora se percibe una visita y un recuerdo. No abrir I2 para compensar una dirección visual aún no observada.

No recomiendo cambiar stack, introducir WebGL, un framework de plugins, otro sistema de estado o motores simultáneos de animación para este rediseño. La mayor mejora depende de composición, controles y arte limpio.
