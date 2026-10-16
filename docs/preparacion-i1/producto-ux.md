# Preparación I1: producto y UX

9 de octubre de 2026. Autor: subagente `producto_ux`. Fuentes leídas completas: [AGENTS](../../AGENTS.md), [PRD v0.15](../PRD.md), [DECISIONS](../DECISIONS.md), [encargo de preparación](../I1_UNCERTAINTIES_PROMPT.md) y [prompt I1](../I1_PROMPT.md). Se inspeccionaron el concepto I1-CV01 y su procedencia. Esta entrega propone composición, textos y observación; no implementa la aplicación ni acredita pruebas.

## Estado y hechos conservados

| Estado | Evidencia y límite |
| --- | --- |
| Documentado y decidido | D02/D09/D10 y A09–A18: fan adulto casual, Callejón → Weasley, cuento teatral 2D detallado, doce identidades, tres rarezas bilingües, cuatro regalos conocidos, una rana nueva garantizada, grageas reservadas y pesos 14/14/5/5/1/1. PRD §§2–4, 24, 26–27 y registro A09–A18. |
| Recomendado para I1 | Composición responsive, navegación Callejón/Colección y retorno explícito desde Weasley; detalle en página, no varios diálogos; P10 como perfil de ensayo; glosario de trabajo; observación manual de ocho sesiones. Ninguna recomendación de este documento aprueba producto por consenso de agentes. |
| Comprobado documentalmente | El repositorio inspeccionado contiene documentación y concepto; `git status --short` mostró cambios documentales locales, sin un manifiesto de aplicación. El concepto es un PNG compuesto 1536×1024 y contiene una carta de orejas extensibles O01; su registro declara ausencia de capas y fuente editable. No se probó un recorrido. |
| Pendiente de comprobar técnicamente | Foco, reflujo, traducciones completas, lecturas accesibles, persistencia, omisión, arte ausente, contraste y tiempos reales. Se comprueban después de construir, en ambos idiomas. |
| Pendiente de observar con usuarios | Comprensión, personalidad visual, distinción regalo/azar, rangos, curiosidad y percepción de conservar un recuerdo. A17 fija objetivos, no resultados. |

No se cambia alcance. Las tablas amplias de PRD §§7–10 incluyen grageas, objetivo, práctica/taller y suministro para la visión posterior; no habilitan esas acciones en I1. La comparación de dos acabados de T05 en §20 es antecedente: A11/A12 conservan el estilo elegido, sin nueva comparación de universos o acabado simplificado. El concepto con O01 sirve para dirección artística; **no representa un resultado válido de la rana nueva de bienvenida**.

## Recorrido y composición recomendados

Supuestos: una sesión breve sin experiencia previa en juegos de cartas; teléfono vertical como composición inicial, teclado y escritorio equivalentes; las personas pueden consultar regalos antes de abrir. La rana es una invitación principal, nunca una pantalla obligatoria. No se impone tiempo ni gesto para obtener la entrega.

Recomiendo páginas simples para callejón, tienda, detalle, resultado y colección. Permiten lectura larga, retorno explícito y foco predecible. Alternativa: detalle en diálogo; reduce sensación de navegación, pero aumenta complejidad de foco, altura móvil y tabla de probabilidades. Usar diálogos únicamente para confirmar sustitución de datos/reinicio, donde la consecuencia lo justifica. La ficha del producto incorpora la confirmación explícita de gasto en su propio botón; no necesita un segundo diálogo redundante.

### Reglas comunes de composición

- Referencia móvil: 390 CSS px, márgenes 16, ancho útil 358. Referencias de verificación posteriores: 320 y 390 CSS px, escritorio 1280 CSS px y ampliación/reflujo. Son objetivos de prueba, no dispositivos ya observados.
- Cabecera flexible: marca/nombre breve, selector con nombres propios «Español» y «English», ajustes. No usar banderas. Si no cabe, selector pasa a segunda línea; no abreviar los nombres ni cortar etiquetas.
- Título y acciones en superficies tranquilas fuera del arte. La imagen orienta la visita; las acciones siguen disponibles sin ella. Espacio de escena móvil orientativo 358×220, no obligación de recortar todas las vistas igual.
- Navegación común Callejón/Colección, con estado actual expresado semánticamente. Interior lleva «Volver al callejón»; detalle lleva «Volver a Weasley». No crear pestaña Taller sin taller funcional.
- Evitar alturas fijas para texto o botones. «Use 1 Chocolate Frog» puede ocupar dos líneas y conserva 44×44 como objetivo de comodidad. Probabilidades en lista de seis filas, sin tabla horizontal desbordada a 320px.
- Escena/Lista es una preferencia de presentación con las mismas acciones. La lista muestra nombre, disponibilidad y acción explícita. Recomendación de implementación: una fuente de acciones y una representación activa, evitando dos copias simultáneas enfocables. Cambiar representación conserva datos y lleva el foco a la acción equivalente, o al título de la representación si no existe equivalente.
- El arte es decorativo cuando la información completa está en el DOM contiguo. Una ilustración informativa que añada contenido requiere alternativa revisada. «Ilustración provisional / Placeholder artwork» se expresa fuera del bitmap.
- Desktop: escena y panel de acción pueden ir en dos columnas; la secuencia de lectura mantiene título → escena/descripción → acción → información secundaria. La colección puede pasar de dos a cuatro columnas; la ficha nunca depende de hover.

### Wireframe 1: callejón, primera visita

Composición estática propuesta, sin afirmar dimensiones medidas ni comportamiento implementado:

```text
┌─390px──────────────────────────────┐
│ Colección Mágica      [Español ▾]   │
│ [Ajustes]                          │
│ Callejón Diagón                    │
│ Explora Weasley y descubre tu rana. │
│ [Escena ●] [Lista ○]                │
│ ┌─358×220───────────────────────┐  │
│ │ ARTE: calle + fachada Weasley │  │
│ │ No contiene texto ni botones │  │
│ └──────────────────────────────┘  │
│ Ilustración provisional            │
│ Weasley · Disponible               │
│ [Entrar en Weasley]                │
│ 1 rana de bienvenida               │
│ [Mi colección · 4 de 12]           │
│ Guardado en este dispositivo       │
│ [Callejón]   [Colección]            │
└───────────────────────────────────┘
```

English: «Magical Collection», «Diagon Alley», «Explore Weasley and discover your Chocolate Frog», «Scene / List», «Available», «Enter Weasley», «1 welcome Chocolate Frog», «My collection · 4 of 12», «Saved on this device», «Settings». Marca traducida es **texto de trabajo**, no decisión de naming; puede conservarse Colección Mágica en ambos idiomas si así se acuerda después. No añadir otro comercio activo ni fecha para escaparates decorativos.

Foco de entrada: título principal al cambiar de página, sin saltar directamente al botón de gasto. En retorno desde tienda, botón de Weasley de la representación usada, conservando posición. El enlace a colección está disponible desde el comienzo; no compite visualmente con Entrar en Weasley, pero no se oculta.

### Wireframe 2: interior, antes/después de apertura

```text
[Volver al callejón]        [Español ▾]
Weasley
┌─ARTE 358×220─────────────────────────┐
│ Interior cálido; estantes y mostrador│
└─────────────────────────────────────┘
Ilustración provisional
[Escena ●] [Lista ○]
Dulces
Rana de chocolate · 1 disponible
[Ver rana de chocolate]  ← abre ficha, no gasta
Grageas · 1 reservada
Apertura no disponible en esta demo.
Bromas: ambientación; sin acción de entrega.
[Mi colección · 4 de 12]
Guardado en este dispositivo
```

English: «Back to Diagon Alley», «Sweets», «Chocolate Frog · 1 available», «View Chocolate Frog», «Every Flavour Beans · 1 reserved», «Opening is unavailable in this demo». Tras abrir: «Ranas disponibles: 0 / Chocolate Frogs available: 0» y «Has usado la rana de bienvenida. Puedes seguir consultando tu colección / You have used your welcome Chocolate Frog. You can still view your collection». No anunciar vale, premio, reposición o práctica que no existe. La ficha sigue consultable sin botón de gasto disponible.

Foco: entrar en detalle enfoca su título; volver devuelve foco a Ver rana y su posición. Regreso al callejón conserva representación y botón origen. Lista equivalente: Dulces tiene ficha rana y estado de grageas; Bromas permanece ambientación informativa. Evitar tres miniaplicaciones para las zonas de la visión; una vista de tienda satisface I1.

### Detalle y confirmación

Orden móvil recomendado:

1. «Volver a Weasley / Back to Weasley», selector de idioma y título producto.
2. Arte de envase, provisional identificado; nunca usar el cromo O01 del concepto como expectativa de entrega.
3. «Rana de bienvenida / Welcome Chocolate Frog».
4. «Esta rana consume 1 unidad y entrega un cromo nuevo de persona u objeto. No garantiza una rareza concreta / This uses 1 Chocolate Frog and gives you a new person or object card. No specific rarity is guaranteed».
5. Encabezado «Posibles hallazgos / Possible discoveries» y seis filas de nombre, familia, rango y porcentaje de tabla activa. Todas visibles/consultables antes de habilitar gasto; no requerir hover. Versión de configuración como metadato discreto de esta demo, sin mezclarla con la promesa narrativa.
6. «Usar 1 rana / Use 1 Chocolate Frog», stock actual y enlace volver. El nombre accesible contiene la unidad consumida. Sin botón fijado encima de texto ni pago/compra implícitos.

Tabla inicial conservada:

| ID | Texto ES / EN de trabajo | Rango aprobado ES / EN | Porcentaje ES / EN inicial |
| --- | --- | --- | --- |
| C01 | Albus Dumbledore / Albus Dumbledore | Habitual / Common | 35 % / 35% |
| C02 | Minerva McGonagall / Minerva McGonagall | Habitual / Common | 35 % / 35% |
| C03 | Filius Flitwick / Filius Flitwick | Singular / Uncommon | 12,5 % / 12.5% |
| O03 | Pantano portátil / Portable Swamp | Singular / Uncommon | 12,5 % / 12.5% |
| C04 | Pomona Sprout / Pomona Sprout | Extraordinario / Extraordinary | 2,5 % / 2.5% |
| O04 | Fuegos artificiales / Fireworks | Extraordinario / Extraordinary | 2,5 % / 2.5% |

Estas cifras son la presentación inicial A18; implementación deberá derivarlas de los pesos, sin copiar esta tabla como una segunda configuración de UI. El 5% total Extraordinario no sustituye el 2,5% de cada identidad. No pedir elegir rango, persona u objeto para alterar sorteo. Una versión nueva detectada muestra aviso y «Actualizar posibilidades / Update possible discoveries»; refresca la ficha y requiere una nueva pulsación consciente de Usar 1 rana. No gastar con versión obsoleta ni mantener una confirmación automática.

### Apertura y resultado

Después de pulsar: estado «Guardando la apertura… / Saving the opening…», controles de gasto no repetibles; la respuesta no muestra todavía una recompensa. Una operación con estado desconocido entra en recuperación, nunca en otra apertura. Tras commit, ritual omitible; Omitir lleva al mismo resultado. Movimiento reducido lleva directamente al resultado estático. El cambio de idioma conserva operación y etapa; no crea otra confirmación.

```text
[Volver a Weasley]        [English ▾]
New discovery
┌──160×240───────────────┐
│ ART PLACEHOLDER       │  ← no O01 como bienvenida
│ Eligible card         │     Ejemplo estático rotulado:
└───────────────────────┘     C01, no resultado real
Albus Dumbledore
Person · Common · 1 copy
Found at Weasley
Saved on this device
[View my collection]
Chocolate Frogs available: 0
```

ES: «Nuevo hallazgo», «Persona · Habitual · 1 copia», «Obtenido en Weasley», «Ver mi colección», «Ranas disponibles: 0». Un resultado objeto usa «Objeto / Object», mismo énfasis visual y legibilidad; no describirlo como premio menor. El rango tiene etiqueta y forma, ambas fuera del arte. Formas círculo/rombo/estrella son sustitutos candidatos; no símbolos finales aprobados.

Foco: durante guardado se conserva el lugar de la acción y se anuncia el estado; al resultado, foco al encabezado. Recomendación: un solo mecanismo para anunciar el hallazgo (encabezado/enfoque con resumen asociado), sin live region con el mismo texto duplicado; el estado de guardado tiene anuncio distinto. Al cambiar idioma, no repetir anuncio de entrega ni reiniciar ritual. El anuncio exacto y su comportamiento requieren lector real. Recarga tras commit lleva al resultado recuperado; no reproduce obligatoriamente la animación. Regreso a tienda enfoca la ficha rana, no un botón habilitado para consumir otra.

### Colección y ficha

```text
Mi colección                 [Español ▾]
5 de 12 descubiertos · 5 copias en total
Tu rana añadió {nombre}.       ← solo contexto al llegar del resultado
Regalos de bienvenida: 4 hallazgos conocidos
[Familia: Todas ▾] [Rareza: Todas ▾]
Mostrando {n} de 12 identidades
┌─Ficha────────────────┐ ┌─Ficha────────────────┐
│ Ilustración provisional│ │ Pendiente de descubrir│
│ Nombre               │ │ Nombre                 │
│ Familia · Rareza     │ │ Familia · Rareza       │
│ 1 copia · Regalo     │ │ 0 copias               │
│ [Ver ficha]          │ │ [Ver ficha]            │
└──────────────────────┘ └───────────────────────┘
[Volver a Weasley] si ese fue el origen
[Callejón] [Colección]
```

English: «My collection», «5 of 12 discovered · 5 copies in total», «Your Chocolate Frog added {name}», «Welcome gifts: 4 known discoveries», «Family: All», «Rarity: All», «Showing {n} of 12 identities», «Not discovered yet», «1 copy · Gift», «0 copies», «View card/details». Parámetros y plurales mediante mensajes completos, no concatenación de rótulos.

Resumen de regalos es consultable y separado del resultado; no abre cuatro rituales. Al llegar al álbum, foco al título y no abrir otra ficha automáticamente: no fingir curiosidad del usuario. Recomendación de ensayo: conservar orden del catálogo por ID/familia; destacar discretamente el nuevo hallazgo sin reordenar todo ni seleccionar un filtro oculto. «Otra ficha» queda accesible con la presentación normal, sin CTA añadido para lograr A17.

Ficha descubierta: nombre, familia, rango histórico del hallazgo, contexto breve revisado, «Obtenido en Weasley», copias y origen regalo/rana. Ficha pendiente: nombre, familia, rareza del catálogo activo y estado pendiente; no ofrecer canje/objetivo ni prometer otra rana. El detalle de identidad no inventa probabilidad de aperturas normales; el porcentaje A18 corresponde al producto de bienvenida y solo es pertinente allí. Si una edición futura cambia asignación, la ficha descubierta conserva su rango original y no la reemplaza por el actual silenciosamente. La presentación de múltiples versiones de una misma identidad se precisará cuando exista una necesidad real; no construir variantes anticipadas para I1.

Cerrar ficha devuelve foco al control de esa identidad y conserva filtros/posición. Filtro sin coincidencias: «No hay identidades con estos filtros / No identities match these filters» y «Limpiar filtros / Clear filters». Total base permanece 12; un vacío de Personas antes de abrir no equivale a colección global vacía.

## Estados alternativos y textos bilingües

| Situación | Mensaje ES / EN propuesto | Acción, foco y consecuencia |
| --- | --- | --- |
| Recuperación inicial | «Comprobando tus datos guardados… / Checking your saved data…» | No afirmar stock final; navegación de gasto pendiente. Mostrar estructura estable, anunciar estado una vez. |
| Catálogo/tabla inválidos | «No podemos mostrar las posibilidades de esta rana. No se ha usado ninguna unidad / We cannot show this Chocolate Frog's possible discoveries. No unit has been used» | Bloquear gasto; reintentar carga. Segunda frase solo cuando se sabe que no hubo commit. |
| Sin candidato nuevo / estado incompatible | «No hay un hallazgo nuevo válido para esta bienvenida. No se ha usado la rana / There is no valid new discovery for this welcome opening. Your Chocolate Frog has not been used» | No inventar candidato ni renormalizar ocultamente; ofrecer volver, exportar datos o reinicio confirmado en ajustes, sin reset automático. |
| Fallo confirmado antes de commit | «No se pudo guardar la apertura. Tu rana no se ha usado / The opening could not be saved. Your Chocolate Frog has not been used» | Reintentar misma operación; volver conserva estado. Foco al aviso si es necesario, acción accesible inmediata. |
| Commit desconocido | «Estamos comprobando si tu apertura se guardó / We are checking whether your opening was saved» | «Comprobar apertura / Check opening» sobre misma clave; no afirmar rana intacta, resultado perdido o nueva entrega. |
| Unidad gastada en otra pestaña | «Esta rana ya se ha usado. Estamos recuperando el resultado / This Chocolate Frog has already been used. We are recovering its result» | Actualizar saldo desde persistencia y abrir resultado confirmado existente; no sortear. Si no puede recuperarse, conservar mensaje de comprobación. |
| Conflicto de petición | «Esta petición no coincide con la apertura registrada. No hemos realizado otra apertura / This request does not match the recorded opening. We have not opened another Chocolate Frog» | Volver a consultar estado/operación; no mostrar detalles técnicos sensibles. No denominarlo stock cero por defecto. |
| Ficha obsoleta | «Las posibilidades han cambiado. Revísalas antes de usar la rana / The possible discoveries have changed. Review them before using your Chocolate Frog» | Actualizar ficha, foco al aviso/título de posibilidades y reconfirmar; nunca gastar automáticamente. |
| Traducción ausente | Mensaje seguro propio de ambos bundles: «Este contenido no está disponible en el idioma seleccionado / This content is unavailable in the selected language» | Detectar en comprobaciones previas; no mostrar clave técnica o sustituir todo a un idioma desconocido. Si faltan términos del resultado activo, bloquear nueva apertura y conservar/recuperar operación ya guardada. |
| Arte ausente | «Ilustración no disponible / Artwork unavailable» | Nombre, familia, rango, copias y acciones siguen; no reintentar apertura para reintentar imagen. |
| Rana agotada | «Has usado tu rana de bienvenida. Tu colección sigue disponible / You have used your welcome Chocolate Frog. Your collection is still available» | Ver colección o volver; sin suministro inventado. |
| Grageas reservadas | «1 unidad reservada. Apertura no disponible en esta demo / 1 unit reserved. Opening is unavailable in this demo» | Estado informativo, sin botón Usar; no se resta unidad ni se denomina agotada. |
| Importación inválida | «No se pudo importar este archivo. Tus datos actuales se conservan / This file could not be imported. Your current data has been kept» | Mostrar motivo localizado útil; devolver foco al control de archivo, sin sustituir estado parcial. |
| Reset cancelado | «Reiniciar demo / Reset demo», confirmación «Se borrarán los datos de esta demo en este dispositivo. Puedes exportarlos antes / This demo's data on this device will be deleted. You can export it first» | Cancelar conserva todo, foco vuelve a origen; confirmar identifica nueva ejecución, sin continuidad económica. |

Importación válida propone revisar resumen y confirmar sustitución antes de aplicar: «Reemplazar los datos actuales / Replace current data». El archivo es externo, aun siendo exportación propia; validarlo antes de confirmar y antes de sustituir. Exportación e importación están en ajustes, no compiten con primera apertura. Si cambian durante operación pendiente, resolver esa operación primero y comunicarlo; no permitir que una importación borre silenciosamente su resultado. Invariante y contrato exacto corresponden a stack/dominio.

## Idioma inicial, formatos y glosario

**Recomendación de ensayo P10, pendiente de elección autorizada registrada:** preferencia guardada es/en primero; sin preferencia, español si el idioma preferido del navegador es español, inglés en los demás casos. Para precisar «lo indica», usar la primera preferencia válida de la lista del navegador; `es-*` conduce a es, el resto a en. No usar país, IP, moneda ni región comercial. Selector visible permite corregirlo inmediatamente; su etiqueta usa «Idioma / Language» y nombres propios «Español / English». Alternativa: selector obligatorio de entrada; explicita elección pero introduce un paso previo y debilita llegada al callejón. Otra alternativa: buscar cualquier español secundario, que puede ignorar la primera preferencia real; dejar el criterio preciso documentado evita resultados arbitrarios.

Formatos recomendados de ensayo: contenido es/en con `lang=es` o `lang=en`; formato numérico `es-ES` / `en-GB` exclusivamente como convenciones de presentación, sin cambiar región comercial. Mostrar 12,5 % / 12.5% y enteros sin decimales innecesarios; precisión hasta dos decimales para futuras tablas con indicación de redondeo, selección siempre usa pesos exactos. La suma visible redondeada puede diferir del 100%; explicarlo si ocurre y comprobar que cada valor corresponde a su peso. No redondear arbitrariamente porcentajes pequeños a cero; establecer más precisión si una configuración futura lo requiere antes de publicarla. En I1 inicial no existe este problema. Fecha de exportación/diagnóstico solo si se presenta: fecha local y zona identificada cuando afecte interpretación; sin temporizadores de reposición. Ninguna necesidad de moneda en I1.

| Concepto/clave orientativa | ES | EN | Estado |
| --- | --- | --- | --- |
| alley.title | Callejón Diagón | Diagon Alley | Marco decidido; traducción de trabajo del nombre. |
| shop.name | Weasley | Weasley | Identidad elegida; no inventar logo ni naming oficial extendido. |
| nav.collection | Colección | Collection | Trabajo de UI. |
| nav.settings | Ajustes | Settings | Trabajo de UI. |
| presentation.scene/list | Escena / Lista | Scene / List | Trabajo de UI. |
| family.person/object/flavour | Personas / Objetos / Sabores | People / Objects / Flavours | Trabajo de UI; singular Person / Object / Flavour. |
| rarity.R01 | Habitual | Common | A14 aprobado. |
| rarity.R02 | Singular | Uncommon | A14 aprobado. |
| rarity.R03 | Extraordinario | Extraordinary | A14 aprobado. |
| product.frog | Rana de chocolate | Chocolate Frog | Nombre de trabajo, revisión editorial/contexto. |
| product.beans | Grageas de todos los sabores | Every Flavour Beans | Nombre de trabajo; verificar forma oficial si se decide utilizarla. No ampliar identidad/producto. |
| collection.card | Cromo | Card | Trabajo; cromo de persona u objeto, no producto comestible conservado. |
| collection.discovery | Hallazgo | Discovery | Trabajo; nombre de una identidad descubierta. |
| collection.copy | Copia / Copias | Copy / Copies | Plurales completos con parámetro. |
| collection.new | Nuevo hallazgo | New discovery | Solo primera obtención; nunca repetido rotulado nuevo. |
| collection.gift | Regalo de bienvenida | Welcome gift | Conocido, separado del sorteo. |
| collection.pending | Pendiente de descubrir | Not discovered yet | No implica inaccesible por pago. |
| storage.saved | Guardado en este dispositivo | Saved on this device | Requisito de confianza local. |
| artwork.placeholder | Ilustración provisional | Placeholder artwork | A06. |
| C01/C02/C03/C04 | Albus Dumbledore / Minerva McGonagall / Filius Flitwick / Pomona Sprout | Los mismos nombres | Identidades aprobadas; revisión editorial de contexto pendiente. |
| O01 | Orejas extensibles | Extendable Ears | Identidad aprobada; traducción de trabajo, no permiso acreditado. |
| O02 | Varita de broma | Joke Wand | Igual. |
| O03 | Pantano portátil | Portable Swamp | Igual. |
| O04 | Fuegos artificiales | Fireworks | Igual; no inventar subtipo/marca. |
| S01/S02/S03/S04 | Menta / Pimienta / Limón / Hierba | Mint / Pepper / Lemon / Grass | Identidades aprobadas; traducciones de trabajo. |

Glosario inicial no equivale a traducción completa: faltan textos de contexto de doce fichas, ayuda de datos y mensajes técnicos concretos según errores reales. Redactarlos es una tarea acotada durante implementación, revisar en ambos idiomas antes de entregar. No introducir atributos del taller o afirmaciones canónicas para rellenar fichas. Usar contexto breve sobre descubrimiento/colección o contenido factual revisado; no convertir una traducción sugerida en terminología oficial acreditada.

## Protocolo propuesto para A17, sin ejecución

### Reclutamiento y exposición

Ocho adultos que se describan como fans casuales de Harry Potter; no se exige juego competitivo ni ser coleccionista habitual. Propuesta operativa: cuatro sesiones en español y cuatro en inglés, dos móvil y dos escritorio por idioma; registrar qué dispositivos/navegadores reales se consiguen. No reclutar únicamente colaboradores que conozcan el diseño o hayan preparado sus assets. Preguntas previas neutrales sobre frecuencia de contacto con el universo y última actividad fan; no seleccionar solo a quienes ya expresan interés por esta app. El reclutamiento y las fechas todavía no están realizados.

Este reparto ofrece cobertura formativa, no comparación estadística de idiomas/dispositivos. Sesiones técnicas con teclado/lector se organizan además: las ocho personas no sustituyen las pruebas adversas ni aseguran accesibilidad. Si solo se reclutan hablantes de un idioma, informar el límite y completar el otro antes de atribuir observación bilingüe.

Antes de sesión: versión de demo fija, pesos A18 intactos, nueva ejecución local inicializada con confirmación, sin usar cuenta/saldo de otra persona. No revelar el cromo de antemano ni guionizar el rango. No dar más ranas, incentivos por explorar fichas o obligación de volver. Si hay compensación de investigación acordada fuera de este documento, independiente de desempeño/interés; aquí no se ha presupuestado ni ofrecido ninguna.

### Guion sin inducir la exploración de otra ficha

1. Explicar que se evalúa la demo, no a la persona; solicitar consentimiento para notas y, solo si se acuerda, grabación. Anunciar estructura sin instruir exploración: «Primero usarás la demo a tu manera; después hablaremos de lo ocurrido. Puedes decirnos cuando hayas terminado / First, you will use the demo in your own way; then we will talk about what happened. You can tell us when you are done». Al cerrar la ventana se avisa «Pasamos a las preguntas / We will move on to the questions». No guardar identidad en el registro de comportamiento; usar códigos S01–S08. Contenido autorizado y conservación de notas/grabaciones se concretan al organizar sesiones, sin instalar analítica o servicios ahora.
2. Tarea de partida con la persona en el callejón: **«Descubre qué contiene tu rana de bienvenida y comprueba dónde queda lo que recibes» / «Discover what is inside your welcome Chocolate Frog and check where what you receive is kept»**. No enumerar botones, rutas, familia, rareza ni pedir otra ficha. La tarea fija el objetivo aprobado; no convierte finalización en interés espontáneo.
3. Observar sin ayudar; registrar entradas/retornos, consultas previas, confirmación, omisión, llegada a resultado/colección, stock, idioma y espontaneidad. No pedir que explique probabilidades mientras intenta el recorrido. Si hace preguntas de navegación, responder primero «Haz lo que harías normalmente / Do what you would normally do». Si necesita guía para seguir, dar ayuda y marcarla; esa sesión no cuenta en el numerador de comprensión sin ayuda, aunque continúe.
4. **Antes de preguntar por comprensión o futuro**, dejar una ventana silenciosa de exploración natural de hasta dos minutos después de su llegada a la colección. No decir «Mira otra ficha», «¿Qué más hay?» o «Sigue explorando». Si la persona declara que terminó antes, cerrar la ventana; no obligarla a esperar. El tiempo es una convención de observación pendiente de ensayo, no una espera incorporada al producto.
5. Cerrar la ventana y preguntar neutralmente: «Cuéntame qué ha ocurrido y qué queda ahora» / «Tell me what happened and what remains now». Después, si falta claridad: «¿Dónde lo consultarías después?» / «Where would you look for it later?». No dar la respuesta. Registrar regalo vs cromo obtenido, copia conservada y sitio de consulta.
6. Preguntar interés sin presuponerlo: «¿Te apetece hacer algo más con lo que has visto? ¿Qué, si acaso?» / «Would you like to do anything else with what you have seen? What, if anything?». Codificar un motivo concreto para seguir coleccionando solo si lo expresa sin opciones sugeridas: una identidad que quiere conocer, descubrir más contexto, conservar conjunto/recuerdo, etc. «Bonito» o «sí» sin motivo no cumplen. Admitir indiferencia y rechazo.
7. **Después de cerrar las medidas A17**, hacer preguntas diagnósticas sobre persona/objeto, regalos, rareza y probabilidad: «¿Qué crees que significa Habitual/Singular/Extraordinario?»; «¿Qué podría haberte entregado la rana?»; «¿Qué entiendes por este porcentaje?». Mostrar fichas si hace falta y registrar exposición dirigida. Estas acciones nunca cuentan como exploración espontánea. Pedir comentario visual y de texto, sin preguntar si prefiere otro estilo no autorizado.

No repetir la misma sesión como si fuera una persona nueva ni cambiar la configuración entre participantes para lograr objetivos. Las averías del prototipo se registran y se corrigen antes de ampliar; no excluir silenciosamente a quienes fallan para elevar 6/8 o 4/8. Una sesión interrumpida por infraestructura queda marcada, no convertida en éxito; documentar si se necesita reemplazo y el denominador real antes de analizar.

### Definiciones y ficha de registro

| Variable | Regla de cómputo |
| --- | --- |
| Completa sin ayuda | Visita Weasley desde callejón, consulta rana, confirma gasto, recibe resultado y encuentra su identidad en colección sin guía. Una recarga espontánea segura no invalida; ayuda de navegación sí. |
| Comprende conservación | Explica qué persona/objeto recibió y que está conservado en su colección en este dispositivo; no cree que saltar animación pierde la entrega ni que el regalo fue sorteado. Registrar exactitud de guardado local como diagnóstico; no exigir repetir terminología técnica. |
| Numerador 6/8 | Cumple finalización y explicación sin ayuda. Mostrar ambos componentes por separado además del conjunto, sin cambiar umbral elegido. |
| Otra ficha espontánea | Abre intencionadamente una identidad distinta del resultado obtenido después del hallazgo y antes de la primera pregunta de comprensión/interés. Puede ser regalo o pendiente; no cuenta vista automática, fila de posibilidades de producto ni la propia ficha del resultado. Registrar exploración previa como diagnóstico separado, sin sumarla al numerador principal. |
| Numerador 4/8 | Otra ficha espontánea **y** motivo concreto de seguir coleccionando, expresado en pregunta neutral posterior. Registrar componentes separados. No cuentan sesiones/fichas instruidas. |
| Fallo funcional | Pérdida, duplicación, gasto por consulta, probabilidades incoherentes, resultado falso o bloqueo de recuperación; identificar versión y operación cuando se pueda, no llamar al fallo «desinterés». |

Registro mínimo: sesión anónima, fecha, idioma inicial/elegido, dispositivo/navegador, versión catálogo/tabla/arte, resultado/rango real, pasos y tiempos, ayuda exacta y momento, otra identidad abierta y momento, explicación textual breve, motivo/indiferencia, errores y observaciones visuales. Mantener por separado observaciones dirigidas y espontáneas. Notas manuales suficientes; no se propone integrar analítica en I1.

Reporte posterior: ocho filas con indicadores, numeradores/denominadores, ejemplos de fricción y consecuencias. Si 6/8 o 4/8 no se cumplen, revisar evidencia y recorrido antes de ampliar. Si se cumplen, afirmar comprensión/curiosidad en esa muestra, no retención, mercado o balance óptimo. No hay resultados actuales.

### Lo que una rana no permite medir

- Repetidos reales o frustración tras varias aperturas: la bienvenida es siempre nueva. Escenarios controlados técnicos verifican copias y mensajes, no sustituyen vivencia de repetidos.
- Balance longitudinal, tiempo de completar doce identidades, canje y suministro: faltan aperturas normales, stock recurrente y reglas elegidas de futuros incrementos.
- Retorno espontáneo D1/D7 o interés cuando desaparece la novedad: requiere piloto con ventanas definidas y suministro observado; una declaración de querer seguir no es retorno.
- Comprensión de todos los rangos y de objetos con ocho sorteos: A18 da 85% personas y 15% objetos, y 5% Extraordinarios agregados; no se garantiza que aparezcan todas las categorías. Reportar qué se observó. Mostrar objetos/rangos en diagnóstico posterior aporta lectura dirigida, no una apertura real ni una señal de curiosidad.
- Comprensión de apertura de grageas y utilidad del taller: solo se observa la reserva y los sabores ya regalados; I2/I3 comprobarán los comportamientos propios.

## Matriz de incertidumbres, aceptación y próximo paso

| U / AC afectados | Estado previo y evidencia documental | Recomendación y alternativa | Evidencia pendiente / siguiente acción / responsable |
| --- | --- | --- | --- |
| U02 · AC01/02 | Público adulto casual elegido A09; hábitos sin observar. | Reclutamiento ocho, 4es/4en y mezcla móvil/escritorio; alternativa solo es reduce esfuerzo pero deja en sin observar. | Organizar sesiones después de prototipo fiable; PM/UX. No bloquea implementación. |
| U03 · AC01/02/08 | Promesa A10 y objetivos A17 elegidos. | Recorrido centrado rana, sin tutorial ni regalo extra; tarea neutral y ventana no inducida. Alternativa dirigirse a cada ficha contamina curiosidad. | Observar 6/8 y 4/8; responsable PM/UX. No cerrar interés por una muestra estática. |
| U06 · AC03/04/08 | Rana entrega persona u objeto; grageas fuera I1. | Explicar ambas familias antes de gasto, igual tratamiento resultado; regalo separado de azar. Alternativa explicar solo persona crea expectativa falsa. | Probar ambos resultados técnicamente, observar cuáles salieron y diagnóstico posterior; UX/QA. |
| U07 · AC02/08 | Doce identidades aprobadas A15. | Álbum por familias y filtros con total12; pendiente visible, sin taller/objetivo. Alternativa ampliar catálogo aumenta arte sin evidencia. | Lectura/atractivo de identidades en sesiones y ajustes posteriores autorizados; PM/Visual. |
| U20 · AC01/05/06/07/09/10/11/12 | Accesibilidad y recuperación requeridas, sin aplicación. | Foco definido, páginas simples, mensaje distinto fallo/desconocido, escena/lista y ausencia de arte. Alternativa paneles modales múltiples añade riesgos. | Prueba real teclado/lector, móvil/reflujo, adversos y recuperación en ambos idiomas; UX/QA + ingeniería. |
| U23 · AC03/08/09/10/11/12 | ES/EN decidido; glosario/criterio inicial pendientes P10. | Ensayo P10 primera preferencia, formato es-ES/en-GB y glosario de trabajo; alternativa selector obligatorio añade paso. | Registrar elección al implementar, redactar contexto, revisión bilingüe y detección de claves ausentes/desbordamientos; UX/editorial + ingeniería. |
| U24 · AC03/04/08/11 | Rangos y tabla A14/A18 elegidos; balance/comprensión pendientes. | Mantener pesos exactos, etiqueta+forma, no rango prometido ni O01 resultado; alternativa pesos distintos reabre A18 sin necesidad. | Test técnico selección/presentación, edición/versiones y lectura dirigida/espontánea separadas; QA/UX. Balance normal futuro PE/PM. |

Cobertura técnica a preparar: AC01 retorno y dos representaciones; AC02 concesión única; AC03 posibilidades correctas antes de gasto; AC04 commit antes de ritual; AC05 doble toque/reintento/dos pestañas; AC06 recarga/omisión/idioma; AC07 errores de certeza diferenciada; AC08 colección/filtros/cantidades; AC09 ES/EN y expansión; AC10 foco/lector/reflujo/movimiento/arte; AC11 versión obsoleta, tabla inválida y resultado histórico; AC12 exportación/importación/reset. Todas las comprobaciones están pendientes; la revisión QA define la matriz adversa completa.

## Dependencias y siguiente acción concreta

1. Coordinador incorpora al prompt la composición, límites y guion A17 como recomendaciones, sin cambiar A09–A18. Distingue naming/traducciones de trabajo y opción inicial P10 de decisiones aprobadas.
2. Arte/ilustración prepara una lámina estática ES/EN a 390px con escena358×220 y espacio de resultado separado, identificando su carácter provisional. Se coordinó esta geometría por mensajes; la carta O01 del PNG no se usa como recompensa nueva.
3. Ingeniería, tras autorización de implementar I1, construye retorno y persistencia antes de añadir ritual; acuerda con UX mensajes para fallos reales y representación de versiones históricas. No necesita resolver pilotos, monetización, shiny o retorno para comenzar.
4. QA verifica AC01–12 en ambos idiomas con implementación y lectores/dispositivos reales. Una lámina no prueba foco, botones, rendimiento ni transacciones.
5. PM/UX organiza A17 únicamente con prototipo comprobable, siguiendo consentimiento/registro acordados. Cuestiones materiales de observación quedan abiertas; no se inventan entrevistas ni se contacta a participantes en esta preparación.

Preparación de UX suficiente para construir dentro del alcance propuesto; no hay nueva elección de producto que impida preparar I1. Falta registrar las elecciones de ensayo rutinarias al autorizar implementación y comprobar su comportamiento. No se ha implementado, probado técnicamente, publicado o validado demanda.
