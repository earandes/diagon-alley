# A74 · Assessment A independiente: diseño y Game UI/UX

17 octubre 2026. Evaluador `/root/a74_design`. Revisión de diseño aislada de Assessment B y de los findings del detector. Solo documentación; no fixes, assets nuevos, navegador, servidor, pruebas gráficas, commit o push.

## Base y método

Base inspeccionada: `937a0a1f00bdbca7009a80cd99b7b4b450f652f0`. Se aplican `AGENTS.md`, `DESIGN.md`, `docs/PRD.md`, `docs/DECISIONS.md`, el contrato A74, `.agents/skills/arcana-game-ui-ux/SKILL.md` y el método Assessment A de `.agents/skills/arcana-impeccable/reference/critique.md`. No existe `.impeccable/critique/ignore.md` en este checkout. Las instrucciones actuales de revisión y protección del Mac sustituyen la inspección de navegador que propone la guía genérica.

Se contrastaron código activo y siete PNG Linux existentes de A73. Una comparación de `git ls-tree -r` entre `8541ee2c9fbf3844d5df0f433945113fd96bd7c0` y HEAD confirmó igualdad de los 1.862 objetos rastreados excluyendo `docs/` y `DESIGN.md`. Por tanto, estas imágenes corresponden al mismo código/estilos/assets de aplicación; no se atribuye una nueva ejecución CI al SHA documental actual. La procedencia registrada es CI `39038639396`; esta evaluación no la volvió a ejecutar ni consultó GitHub en vivo.

No se reutilizaron imágenes históricas ni mockups A62. Para pantallas sin PNG actual seleccionado se emite análisis de código, sin afirmar su composición renderizada. Los PNG no acreditan movimiento, rendimiento, orden real de foco, lectura hablada, tamaño físico, diversión o comprensión.

## Especificidad y criterio general

**El diseño es específico del producto.** Las fachadas como destinos, la formación mediante cromos, el libro de consulta, el tarro táctico, la llave utilizable y el cierre con botín forman una gramática coherente de objetos. La antesala enfrenta equipo y rival de manera deliberada y conserva al jefe real en la arena y en el cierre. No es una interfaz genérica a la que se haya añadido una ilustración de fondo.

La oportunidad principal está en preservar esa identidad cuando aumenta la cantidad de información. La muestra de arena móvil con cinco unidades por bando mantiene nombres y PV, pero las figuras se convierten en miniaturas por encima de etiquetas mucho más anchas. En el recorrido de preparación, la economía de texto funciona bien para decisiones de dos opciones; se debilita al buscar copias entre muchas páginas o al distinguir dos instancias del mismo personaje.

No se calcula una nota global: la evidencia visual actual seleccionada se concentra en jefe/arena/cierre y faltan ejecución interactiva, errores y lectura asistida. Una cifra única daría más precisión aparente que cobertura real. Las prioridades siguientes son juicio experto, no resultados de un estudio humano ni certificación WCAG.

## Fortalezas que conviene conservar

1. **Antesala con jerarquía explícita.** Las muestras de escritorio y móvil separan rival, equipo y suministros; el desafío y su coste de 5 aparecen juntos. La consulta del rival es un libro nombrado y no añade una segunda confirmación. Fuentes: `BossPrelude.tsx:54–103`, `BossPartyStage.tsx:40–155`, `App.tsx:667–687`, `boss-staging.css:281–371`.
2. **Información progresiva sin borrar las decisiones.** Pacto presenta dos candidatos, selección con sello y afinidad, comparación antes→después y atributos bajo demanda. Refugio ofrece PV/PM con previsualización; Encuentro separa beneficio/coste y previsualiza cambios concretos. Fuentes: `NodePreparation.tsx:183–215,350–527`, `EncounterPreparation.tsx:148–174,246–285`. Esto es evidencia de implementación, no de comprensión observada.
3. **Cierre con utilidad inmediata.** En `selected-closure.png`, resultado y botín preceden a Gringotts, rana poseída y otra expedición; el código distingue premio histórico y stock actual y conserva el registro a demanda. La tienda también diferencia abrir una rana propia de comprar y abrir, y conduce las grageas a preparación. Fuentes: `ExpeditionClosure.tsx:92–170`, `SweetshopScene.tsx:109–188`. Mantener esta relación entre objeto ganado y acción disponible.

## Recorrido: jerarquía y carga cognitiva

| Paso | Hecho de código / observación disponible | Evaluación y límite |
|---|---|---|
| Entrada | `App.tsx:423–437`: un acceso principal, error localizado y estado deshabilitado durante carga/offline. | Primera decisión acotada. La nota de sesión es solo accesible visualmente oculta; su comprensión visible no se evaluó. No PNG de entrada usado. |
| Preparación inicial o posterior | Puestos, copias, inspección, equipo y confirmación explícita; desafíos en consulta separada. `ExpeditionPreparation.tsx:355–678`. | Buena separación entre elegir y confirmar. Con colección amplia, búsqueda entre páginas de seis: A-03. No PNG actual de esta preparación inicial usado; las capturas A73 llamadas preparation muestran la antesala del jefe. |
| Mapa / rama | Medallones por tipo, estado, rutas y lista equivalente; consulta de información adicional restringida por el mismo estado habilitado. `MapPanel.tsx:84–160`. | Reconocimiento visual y equivalencia de acciones presentes. Vista previa de opciones futuras limitada: A-02. No juicio visual del mapa actual desde imágenes históricas. |
| Pacto | Dos retratos seleccionables, sello, afinidad y cuenta de sinergia; reemplazo explícito de temporal con equipo lleno. `NodePreparation.tsx:350–527`. | Dos opciones principales cumplen agrupación; selección y confirmación son distintos momentos. El reemplazo añade una segunda decisión pertinente. No prueba humana ni PNG actual de Pacto usado. |
| Encuentro / Refugio / Cofre | Beneficio/coste y antes→después; PV o PM; botín previsto. `EncounterPreparation.tsx:90–285`, `NodePreparation.tsx:147–215`. | Las consecuencias se hacen visibles antes de gastar. El objetivo por instancia requiere mejor diferenciación: A-04. |
| Preparación táctica / jefe | Rival, libro, copias con condición, tarro y desafío; adaptación a una columna en móvil. Siete imágenes A73 incluyen tres antesalas. | Jerarquía dominante clara. Densidad secundaria elevada: nombre, ordinal, procedencia, dos recursos y objetos por aliado; es una observación, no prueba de confusión. |
| Arena | Dos bandos, ordinales, PV, inspector, controles de reproducción y resultado al final. `BattlePanel.tsx:388–503`. | La equivalencia textual y presencia de todos los participantes se conservan en PNG; la escala de figuras de 5×5 es el mayor compromiso visual: A-01. |
| Cierre | Resultado, botín y hasta tres destinos por stock; historia plegada. `ExpeditionClosure.tsx:92–203`. | El final tiene un pico visual y una salida práctica. Intenciones posteriores son voluntarias (`App.tsx:558–564`); no se midió qué acción elige una persona. |
| Tienda / colección | Tres fachadas; selección de producto sin compra; compra/abrir diferenciados; álbum de cuatro cartas con filtros plegados e inspector. `ShopHub.tsx:54–101`, `SweetshopScene.tsx:56–216`, `CollectionPanel.tsx:50–229`. | Objetos y lectura progresiva coherentes. No PNG actual seleccionado de estas superficies; acabado, legibilidad y reflujo pendientes de contraste visual específico. |

Checklist cognitivo: se conserva selección→confirmación, ayuda contextual, reconocimiento por retrato/objeto y agrupación por tarea. El punto con **más de cuatro alternativas visibles para una misma elección** es la parrilla de hasta seis copias de preparación (`ExpeditionPreparation.tsx:470–550`); no todos los controles de consulta constituyen otra decisión estratégica. Pacto tiene dos ofertas; Refugio dos opciones; Encuentro separa tipo de intercambio y objetivo. No se presenta una cuenta de botones como medida de carga humana.

Viaje emocional, como interpretación experta: el inicio y las consultas son valles deliberados de preparación; jefe, apertura y botín son candidatos a picos. El cierre recuerda al adversario y permite usar lo ganado. La arena móvil de diez unidades reduce presencia del personaje respecto a la antesala. Que esto disminuya emoción, o que las consultas interrumpan el ritmo, requiere observación posterior; no se deduce de un PNG.

## Cuatro problemas prioritarios confirmados

### A-01 · P2 · Arena 5×5 móvil: las etiquetas dominan a las figuras

**Evidencia:** `selected-paused-resize.png` (390 px, fixture de diez unidades) contiene los diez nombres y PV y muestra figuras muy pequeñas frente a sus rótulos. `arena-a63.css:152–166` reparte altura mediante un presupuesto ligado a `100dvh`, número de unidades y reserva de texto; `:242–251` limita la zona de figura. `BattlePanel.tsx:422–468` coloca imagen, nombre y PV en cada peana. La muestra de escritorio 3×3 (`selected-actor-diagon.png`) da más protagonismo a los personajes.

**Problema de diseño confirmado:** tener a todos presentes no equivale a mantener el peso visual de la ilustración. En esa composición de 5×5, el nombre y la barra se leen como unidad principal y el personaje como pequeño marcador. No se afirma un recorte, una desaparición, un fallo de rendimiento o un daño a comprensión observado.

**Acción posterior propuesta:** ensayar un reparto móvil que reduzca reserva vertical de cabeceras y aire entre unidades antes de reducir arte; tratar de forma distinta los nombres que ocupan dos líneas. Comparar encuadres de los assets existentes y énfasis temporal del actor/objetivo sin ocultar participantes ni volver a un selector de unidades. No reducir resolución de fuentes ni añadir otra librería.

**Aceptación posterior:** contraste de antes/después en Linux a 390×844 y 320 px, ambos packs/idiomas, 3×3 y 5×5; diez figuras/nombres/PV presentes, área útil de figuras documentada y mejorada en el caso 5×5, controles y foco sin solapamiento, ampliación y reducido con lectura completa. La sesión humana debe comprobar identificación de actor/objetivo sin explicación; no fijar un tiempo inventado a partir de esta revisión.

### A-02 · P2 · El mapa muestra decisiones futuras pero impide consultarlas

**Evidencia:** `MapPanel.tsx:84–105` deshabilita todos los nodos que no sean alcanzables ahora; la lista equivalente reutiliza el mismo botón (`:157–160`). Los efectos/coste para nodos disponibles existen como texto `visually-hidden` (`:127–141`); el título del botón solo aporta tipo y amenaza (`:92–95`). `App.tsx:609–665` monta el detalle de nodo después de seleccionarlo.

**Problema de diseño confirmado:** estado de avance y capacidad de consulta comparten un único control. Una persona puede ver tipos de nodos futuros, pero no abrir su contenido congelado para compararlos ni obtener sus detalles mediante teclado/toque. Esto limita la información de planificación; no prueba que una rama sea incomprensible ni que las reglas deban revelar datos hoy ocultos.

**Acción posterior propuesta:** separar una consulta de solo lectura de la acción de avanzar para el contenido público ya presente en el snapshot; conservar estado, coste y bloqueo de resolución. Como opción mínima, un libro de ruta puede ofrecer descripciones/tipos y consecuencias ya públicas sin añadir botones permanentes a cada nodo. La decisión de revelar información adicional de juego queda fuera de esta recomendación.

**Aceptación posterior:** una consulta de nodo futuro o resumen de ruta permite conocer solo información pública vigente con toque/teclado, vuelve al origen y no emite comandos de avance ni cambia run/inventario. Un nodo bloqueado sigue sin poder resolverse. Verificar es/en, ambos packs, lista equivalente y arte ausente.

### A-03 · P2 · Preparar una colección grande exige recordar páginas de copias

**Evidencia:** `ExpeditionPreparation.tsx:284–285` deriva páginas de seis copias, `:473–550` representa un `slice` del orden de `game.copies`, y `:552–573` ofrece solo anterior/siguiente. La afinidad se consulta en inspector (`:640–644`); la tarjeta de selección muestra retrato/nombre/número de copia (`:498–513`). La formación seleccionada sí permanece visible (`:366–432`), lo que mitiga el problema. El álbum tiene filtros por rareza/descubrimiento (`CollectionPanel.tsx:89–125`), pero no son controles de esta preparación ni resuelven una búsqueda por afinidad aquí.

**Problema de diseño confirmado:** la búsqueda de candidatos para una sinergia o de una instancia concreta atraviesa páginas por orden de inventario. La parrilla contiene seis alternativas a la vez y no ofrece agrupación por identidad, afinidad o estado de selección. No se afirma que el starter inicial sea complejo ni se inventa una colección real de una persona: el problema aparece cuando hay suficientes copias para varias páginas.

**Acción posterior propuesta:** añadir agrupación/filtro visual a demanda por afinidad e identidad, con indicación de seleccionados y contador de copias; conservar inspección por instancia y los cinco puestos. Resolver primero una intención real —encontrar copias de una afinidad—, sin convertir la preparación en formulario o crear inventario nuevo.

**Aceptación posterior:** fixture de al menos treinta copias con duplicados y varias afinidades; encontrar una afinidad y elegir dos instancias sin recorrer las páginas de otras afinidades, conservar borrador al filtrar/cambiar idioma, confirmar los mismos IDs y cerrar sin escritura accidental. Selección y consulta diferenciadas con teclado/toque; estado vacío y limpieza de filtro localizados.

### A-04 · P2 · El objetivo de Encuentro identifica personaje, pero no instancia

**Evidencia:** `EncounterPreparation.tsx:181–204` recorre miembros con ID propio pero deriva `name` solo de `wizardId`, y usa ese mismo `name` como `aria-label` del botón (`:188–197`). El contenido visible (`:224–229`) añade nombre y PV/PM, sin ordinal de formación, procedencia o número de copia. La imagen actual `selected-preparation-mobile-diagon.png` confirma que una run puede contener dos Ginny Weasley; `selected-preparation-mobile-arcana.png` muestra la situación equivalente con dos Tejedoras. En arena sí existe ordinal separado (`BattlePanel.tsx:451–454`).

**Problema confirmado:** dos miembros con la misma identidad producen el mismo nombre de objetivo; con condición coincidente, la presentación tampoco los diferencia por su puesto o propiedad. El `aria-label` no incorpora PV/PM ni posición. No se ejecutó un lector y no se atribuye una lectura hablada concreta; el dato comprobado es la duplicación del nombre programado y la ausencia del identificador de instancia en la presentación.

**Acción posterior propuesta:** reutilizar ordinal de formación y emblema propio/temporal en los objetivos y en el resumen de cambio; incluir posición/origen/condición pertinentes en el nombre o descripción accesible. El servidor seguirá recibiendo el mismo `unitId`.

**Aceptación posterior:** fixture con dos miembros del mismo personaje, PV/PM iguales y distinta instancia/procedencia: se pueden distinguir y elegir por teclado/toque y por nombre/descripción accesibles; la previsualización y receipt corresponden exactamente al ID elegido. Cancelación, recarga y swap conservan la selección/operación conforme al contrato. Verificación posterior con lector hablado, además de aserciones DOM.

## Hipótesis humanas y límites abiertos

- El reloj/escudo de procedencia puede ser suficiente tras aprenderlo; no hay observación que confirme si se distingue copia propia de temporal sin abrir ayuda. La antesala muestra esos símbolos (`BossPartyStage.tsx:97–103`), pero su eficacia es una hipótesis.
- La consulta progresiva puede favorecer inmersión o añadir coste al comparar candidatos. No se midieron dudas, pulsaciones erróneas, abandono o tiempo de decisión.
- Abrir la rana poseída y visitar Gringotts pueden reforzar el final y motivar otra expedición; los destinos existen, pero la motivación y la retención no se han observado.
- La arena de un PNG pausado no informa si proyectiles, poses o deltas hacen fácil seguir el combate en reproducción. Una valoración de movimiento requiere evidencia dinámica bajo los controles Linux vigentes.
- El contraste calculado, ampliación real, lector hablado y móvil físico no se certifican por los colores de estas imágenes o por controles semánticos presentes en código.

Las lentes de persona usadas son primera visita, navegación asistida y móvil interrumpido como criterios de inspección, no participantes simulados. Sus señales concretas son consulta de rutas inaccesible por bloqueo, nombres de objetivo repetidos y escala de diez figuras; el resultado real de esas situaciones permanece pendiente.

## Secuencia sugerida para la fase posterior

Primero A-04 por precisión de elección y accesibilidad; después A-01 por continuidad del protagonismo ilustrado; luego A-03 con una colección de varias páginas. A-02 requiere concretar qué consulta pública se quiere ofrecer antes de implementar. Ninguna recomendación cambia economía, stats, premios, reglas de ruta, catálogo o autoridad, ni autoriza ahora esos fixes.

Validación posterior: casos funcionales deterministas y aserciones DOM para IDs/consultas sin gasto; capturas seleccionadas y matrices en CI Linux; prueba humana de objetivos breves para comprensión y elección. No abrir una batería gráfica local ni eliminar límites del anfitrión para completar esta revisión.

## Capturas exactas vistas

Todas mediante `view_image` sobre archivos existentes; ninguna generada durante A74:

- `docs/arcana/fluency-increment-2026-10-17/evidence/final/selected-preparation-desktop.png`
- `docs/arcana/fluency-increment-2026-10-17/evidence/final/selected-preparation-mobile-diagon.png`
- `docs/arcana/fluency-increment-2026-10-17/evidence/final/selected-preparation-mobile-arcana.png`
- `docs/arcana/fluency-increment-2026-10-17/evidence/final/selected-actor-diagon.png`
- `docs/arcana/fluency-increment-2026-10-17/evidence/final/selected-actor-arcana.png`
- `docs/arcana/fluency-increment-2026-10-17/evidence/final/selected-paused-resize.png`
- `docs/arcana/fluency-increment-2026-10-17/evidence/final/selected-closure.png`

Conclusión acotada: la gramática ilustrada y el cierre funcionan como composición experta; se proponen cuatro mejoras de presentación/consulta respaldadas por fuentes actuales. No se ha demostrado un bloqueo de finalización desde estas imágenes y este análisis, ni se declara aceptación artística humana, movimiento observado o auditoría WCAG terminada.

Questions skipped: la fase autorizada es entregar revisión y contrato de trabajo posterior; no requiere escoger ni implementar un fix en esta evaluación independiente.
