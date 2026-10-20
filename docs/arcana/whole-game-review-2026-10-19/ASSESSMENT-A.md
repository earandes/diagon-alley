# A91 · Evaluación A independiente del juego completo

**Método:** evaluación experta independiente, anterior a cualquier salida del detector o Assessment B. Baseline `753b2a1`, rama local `feature/roadmap-priorities-a89`. El coordinador verificó después main remoto `86d6a92665f63616034a4fcd668c5df6ffe3e322` de árbol idéntico `4127d93e346fec2b16d75b63c8eca38f13fdaed1`; la cobertura de estos objetos no cambia. Solo análisis y documentación. Sin navegador, capturas nuevas, CI, ejecución de pruebas, generación de recursos, cambios de aplicación o Git. Los findings no son observaciones de jugadores.

## Veredicto de dirección

Existe una identidad propia y reconocible: Callejón ilustrado, objetos consultables, álbum físico, tarros, varitas, escaparates, combate en dos bandos y libros de detalle. No recomendaría una renovación general ni sustituir ilustraciones por un sistema de tarjetas administrativo. La oportunidad es **ordenar el significado de los sistemas acumulados**: colección, afinidad, casa, vínculo, rareza, acabado, condición y objetivo comparten espacio, aunque sirven para decisiones distintas.

Las mejoras A90 vigentes se conservan: un libro para intenciones, disponibilidad propia diferenciada de formación, escudo continuo, ayuda con fallback, fuente técnica bajo consulta y opciones de lectura compactas. No se registran como defectos abiertos otra vez.

## Cobertura y evidencia

Se ha trazado `App.tsx` completo y sus condiciones principales, y revisado los consumidores listados en el inventario. Fuentes de dirección: AGENTS, PRD, DECISIONS, DESIGN, README, Game UI/UX, Impeccable/critique y HOST-INCIDENT. El objetivo no es reauditar autoridad ni atribuir una batería técnica nueva a una lectura de código.

Se inspeccionaron **nueve PNG existentes seleccionados** mediante lectura de archivo:

1. A90 `evidence/final/selected-guide-390.png`: App conectada, invitado aislado, mapa y equipo inicial.
2. A90 `selected-forge-390.png`: App conectada, comparación de receta con copia concreta.
3. A90 `selected-beans-390.png`: fixture declarada, tres tarros, caído, borrador; “QA cancel draft” es harness, no producto.
4. A90 `selected-reading-390.png`: fixture de Ajustes con lectura ampliada; scroll inferior legítimo.
5. A90 `selected-battle-390.png`: fixture de libro de hechos sobre arena densa; no prueba movimiento.
6. A81 `evidence/final/chromium-390-a81-login.png`: acceso móvil con contraseña y ayuda.
7. A82 `evidence/final/chromium-390-a82-diagon-alley.png`: bienvenida con tres accesos jerarquizados.
8. A86 `evidence/confirmation/full-diagon-alley-dense.png`: escena densa 5×5 histórica.
9. A71 `evidence/linux/selected-preparation-mobile-arcana.png`: antesala ARCANA histórica.

A90 corresponde al código `19f0b4f`; `git diff 19f0b4f..HEAD -- src` está vacío. A81: último cambio de AccountAccess `8d41edb`; A82 cambió bienvenida, no se atribuye su captura a un acceso nuevo. A71/A86 son referencias históricas de composición, **no evidencia fresca de todas las adiciones posteriores de vínculos/criaturas**. No se ha inspeccionado visualmente cada combinación ES/EN/pack/tamaño/estado. No se han visto animaciones nuevas ni audio escuchado. La cobertura dinámica viene de registros históricos que el coordinador debe citar por SHA; esta evaluación no los vuelve a ejecutar.

## Inventario de superficies activas

“C” significa revisión estructural por código; “V” añade una captura seleccionada. No equivale a recorrido humano.

| Superficie/estado | Alcance y componentes | Identidad visual / interacción | Evidencia |
|---|---|---|---|
| Carga / sesión inicial | App, useTrialEntry, RecoveryNotice | Callejón; botones bloqueados durante carga | C |
| Bienvenida | App:565–654, FantasyActionButton | Emblema, título único, invitado principal, login/registro secundarios | V A82 + C |
| Crear cuenta | AccountAccess | Objeto de pluma/carta, email/clave convencionales necesarios, una acción de envío | C |
| Iniciar sesión | AccountAccess | Objeto de acceso, campos, ayuda plegada | V A81 + C |
| Verificar / reenviar / reparar código | AccountAccess, account-messages | Pasos de acceso, datos mínimos de correo/código | C |
| Recuperar / cambiar contraseña | AccountAccess | Entrada/confirmación; errores y token caducado | C |
| Vincular / conflicto / gestión / logout | AccountAccess + coordinador App | Confirma cambio de contexto; no fusiona inventario | C |
| Offline / operación incierta / sesión inválida | RecoveryNotice, OperationFeedback | Aviso recuperable en modal/página activa | C |
| Ajustes y cuenta | GameSettings | Estuche con idioma, mundo, lectura, velocidad, audio, movimiento y ayuda de guardado | V A90 + C |
| Preparación nueva / desafío | ExpeditionPreparation, ChallengeChoice | Cinco puestos, copias, desafío bajo demanda | C |
| Formación activa / reservas / filtros | ExpeditionPreparation | Selección por instancia, propios/temporales, filtros plegados | C |
| Inspector / equipo / traslado | ExpeditionPreparation, EquipmentArt | Retrato y objetos; guardado explícito | C |
| Mapa / origen / bloqueado / disponible / visitado | MapPanel, SceneCanvas, TeamHud | Medallones diferenciados por silueta/color; origen separado | V A90 + C |
| Lista de ruta / consulta de conexiones | MapPanel, RouteInspection | Equivalencia accesible y relaciones públicas | C |
| Equipo compacto / tooltip / sinergia | TeamHud, BondBand, HouseBand | Retratos y emblemas, detalle por hover/foco/toque | V A90 + C |
| Pacto dos opciones / sustitución / pasar | NodePreparation, TacticalPact | Retratos, comparación táctica, confirmación | C; no nueva captura |
| Refugio PV / PM | NodePreparation | Dos objetos, antes/después por aliado | C |
| Cofre | NodePreparation, NodeResult | Contenido conocido, confirmación y retorno | C |
| Encuentro / oferta / portador | EncounterPreparation | Personaje, dos intercambios, instancia elegida | C |
| Duelo / amenaza / recompensas | NodePreparation, ThreatHelp | Rivales, afinidad, coste y preparación | C |
| Jefe / antesala / equipo | BossPrelude, BossPartyStage, BossSupplies | Rival protagonista, equipo en primer término, tarro, una acción pagada | V A71 histórica + C |
| Arena / inicio / reproducción | BattlePanel, SceneCanvas, pixi-scenes | Dos bandos y PV; una pausa; eventos confirmados | V A86 histórica + C |
| Pausa / velocidad / recursos / registro | BattlePanel, GameSettings | Menú bajo demanda, consulta veraz, inspector | C |
| Actor / objetivo / impacto / cura / caída | BattlePanel + renderer | Efectos localizados, reloj compartido | C; movimiento no observado ahora |
| Victoria / derrota / empate / hechos | BattlePanel, BossBattleFacts | Resultado después del replay; hasta dos hechos | V A90 + C |
| Histórico / replay / renderer fallido | BattlePanel, SceneCanvas | DOM y registro conservados; no operación nueva | C |
| Resultado de nodo / retorno | NodeResult | Resumen breve de cambio y continuidad | C |
| Cierre / botín / otra expedición | ExpeditionClosure, ExpeditionIntentions | Objetos pendientes prioritarios; nueva ruta explícita | C |
| Intención / ayuda / recordatorio | ExpeditionIntentions | Tres objetos, un libro, escudo coherente | C; A90 preservado |
| Callejón / fachadas | ShopHub | Tres tiendas reales, cartel/puerta/objeto | C |
| Confitería / compra / sin fondos | SweetshopScene | Dos productos, stock y una acción principal contextual | C |
| Libro de probabilidades / uso de grageas | ShopBook, SweetshopScene | Libro, probabilidades exactas e independencia del acabado | C |
| Apertura / rareza / nueva / repetida / encantada | CardReveal, FrogMagic, RevealTheatre | Caja→sello→rana→carta, omisión, equivalente estático | C; no nueva observación temporal |
| Álbum / filtros / objetivo / fuentes | CollectionPanel, CollectionSources | Cuatro cartas por página, ayudas y filtro plegados | C + captura parcial A90 adquirible |
| Ficha / copias / acabado / procedencia | CollectionPanel | Carta, metadatos, tokens de copias; sin equipamiento editable aquí | C |
| Sabores / descubrimiento / ayuda | FlavourCabinet | Tarro y cuatro muestras; secreto de sabores, no receta fabricable | C |
| Taller / receta / referencia / comparación | CommercePanel, WandRecipeComparison | Materiales, portador concreto, varitas y tres diferencias | V A90 + C |
| Forja / confirmación / resultado / error | CommercePanel | Cotización separada del gasto, resultado enfocado | C |
| Bóveda / sin llave / apertura / botín | CommercePanel | Cerradura, llave, destino contextual | C |
| Misiones / atlas / objetivo siguiente | JourneyCabinet | Objetos de explorar/coleccionar/jefe y una orientación | C |
| Temporada / unirse / espera / oportunidad | SeasonalEvent | Calabaza y tres escaparates; interacción optativa | C |
| Temporada / elección / progreso / recuerdo / histórico | SeasonalEvent | Deshacer vs preparar, consecuencia conocida y recuerdo separado | C |
| Instalación / actualización PWA | Consumidores activos de PWA y raíz | Debe contrastarse en inventario técnico del coordinador | Sin inspección visual independiente |

## Fortalezas que conservar

1. **Los objetos sí tienen función.** Tarro, cerradura, libro y varita no son solo decoración; conducen a consulta, preparación o gasto explícito. No conviene uniformarlos como tarjetas de configuración.
2. **El combate recede ante sus figuras.** A86 elimina la cabecera global y el control permanente redundante. La muestra densa conserva diez figuras/nombres/PV. El libro de hechos A90 limita la explicación posterior sin inventar causalidad.
3. **La acción económica y la navegación están separadas.** La rana poseída se abre sin recompra; la forja tiene comparación y cotización; la intención no consume ni empieza una expedición. Esto da confianza a explorar.
4. **Accesibilidad no se sacrifica por fantasía.** Los campos de cuenta siguen siendo campos; el foco cian que aparece en evidencia es útil, no ruido a eliminar. Las variantes reducidas y el fallback DOM forman parte del diseño.

## Heurísticas orientativas

Escala 0–4, juicio de experto con cobertura estática e histórica, no métrica de comportamiento ni certificado WCAG.

| Heurística | Puntuación | Evaluación |
|---|---:|---|
| Estado visible | 3 | Stock, borrador y confirmación diferenciados; error estacional puede ser código crudo |
| Correspondencia con el mundo | 4 | Objetos/escena reconocibles y utilizados con intención |
| Control y libertad | 3 | Consulta/cancelación separadas; recuperación de acceso necesita mejor destino contextual |
| Consistencia | 3 | Familia visual común; quedan denominadores y símbolos con significados distintos |
| Prevención de errores | 3 | Gasto explícito, no duplicación por replay; no reevaluado transaccionalmente aquí |
| Reconocimiento frente a memoria | 2 | Muchos sistemas visuales simultáneos y caminos con poca prominencia en la muestra móvil |
| Flexibilidad y eficiencia | 3 | Filtros/teclado/lista; paginación y tarros pueden crecer mal |
| Minimalismo | 3 | Ayuda plegada y una pausa; Ajustes/álbum concentran capas acumuladas |
| Recuperación | 3 | Pendiente preservado; acceso del mismo dueño está lejos del aviso contextual |
| Ayuda | 3 | Libros funcionales; conviene una gramática uniforme de consulta |
| **Total** | **30/40** | Base sólida; consolidación semántica antes que rediseño total |

## Hallazgos prioritarios

### A01 · P1 · Completitud del atlas no sigue el catálogo obtenible

**Hecho por código:** `JourneyCabinet.tsx:26–28,48` cuenta identidades poseídas pero imprime `/30`. `trial-configuration.ts:26–55` usa A87 por defecto e incorpora las cuatro criaturas al catálogo base de30:34identidades. El panel de álbum sí deriva su total.

**Problema:** dos superficies pueden mostrar criterios incompatibles; con todas las identidades actuales el atlas llega a34/30. El jugador no sabe qué cuenta como completar ni si criaturas son un extra.

**Cambio concreto:** pasar al atlas una proyección compartida de completitud del catálogo actual, con numerador/denominador y política histórica coherentes con Cromodex. Recuerdos estacionales y acabado continúan separados. No cambiar la obtención.

**Valor:** objetivo fiable y expansión segura de catálogo. **Aceptación:** catálogo30/34, criatura nueva, copia repetida, encantado y copia histórica no obtenible producen exactamente los mismos totales base en álbum y atlas; ES/EN sin valores fijos. No probado en navegador por A91.

### A02 · P1 de continuidad / P2 visual · La sesión caducada ofrece reconsulta, pero el retorno a la cuenta está fuera de contexto

**Hecho por código:** `RecoveryNotice.tsx:55–72` permite comprobar sesión y entrar en otro ensayo; no ofrece iniciar sesión. El acceso a cuenta existe en Ajustes (`App.tsx:460–493`). `recovery-messages.ts` habla de ensayo/nueva partida aun cuando hay cuentas recuperables.

**Problema interpretado:** una persona con cuenta puede interpretar que perdió la partida o que debe empezar otra. No se afirma que el acceso sea imposible; está escondido en otra jerarquía.

**Cambio:** si la recuperación exige identidad, ofrecer “Volver a entrar” contextual al flujo de cuenta existente, manteniendo “Comprobar resultado” cuando hay operación incierta. Explicar en una línea que se conserva la operación y su dueño. “Otra partida invitada” queda secundaria y deliberada. No cambiar de propietario ni descartar pending para simplificar UI.

**Valor:** continuidad y confianza. **Aceptación:** caducidad sin pending y posterior a commit perdido conducen al mismo propietario; otra cuenta queda bloqueada para su pending; cancelación vuelve al aviso recuperable. Auditoría funcional nueva pendiente, no bug de pérdida reproducido.

### A03 · P2 · El error estacional rompe el idioma y el relato

**Hecho por código:** `SeasonalEvent.tsx:332–344` imprime `{error}` recibido de `state.error`, mientras `RecoveryNotice.tsx:48` utiliza proyección de mensajes.

**Problema:** códigos como revisión incompatible, red o conflicto podrían mostrarse como nombres técnicos sin explicar la acción. Es una rama concreta, no una crítica general de falta de texto.

**Cambio:** proyección localizada de error por categoría, mensaje breve y acción existente adecuada (recuperar resultado / actualizar estado). Conservar código técnico solo bajo detalle optativo, sin exponer tokens.

**Aceptación:** error precommit, response-lost y conflicto, ES/EN; todos muestran una acción que preserve propietario/key/progreso. Cierre no elimina acceso al estado incierto.

### A04 · P2 · Fallback visible inconsistente en controles de cerrar

**Hecho por código:** `Artwork.tsx:28` devuelve null si falta el recurso. `ShopBook.tsx:66–74`, `CollectionPanel.tsx:345–351` y `FlavourCabinet.tsx:98–104` dependen del Artwork decorativo para el símbolo visible de cierre. Tienen nombre accesible; no se afirma pérdida de semántica ni ausencia de Escape.

**Cambio:** símbolo textual simple ×/flecha o etiqueta visible localizada cuando el dibujo falta, conservando la forma del objeto y foco. Reutilizar el patrón de guía/mapa/Ajustes que sí se corrigió; no duplicarlo.

**Valor:** cierre descubrible por toque ante descarga fallida. **Aceptación:** fallo de los assets ui.clear/ui.pass en cada diálogo; control reconocible visualmente, objetivo cómodo, teclado/Escape y devolución del foco; sin nueva animación económica.

### A05 · P2 · La lista de grageas escala con unidades idénticas

**Hecho por código:** `BeanAssignments.tsx:81–109` crea un botón idéntico por producto disponible. La captura A90 acredita tres tarros, no inventario alto. Cada objeto tiene ID real, pero su selección actual no comunica diferencia de efecto conocida.

**Hipótesis:** con30/100unidades el jugador atraviesa decenas de tarros numerados para hacer una decisión que realmente es elegir portador y conservar o gastar. No se afirma desbordamiento reproducido.

**Cambio:** tarro principal con contador; hasta cinco fichas de asignación visibles sobre portadores. Si se requiere elegir unidad concreta para recuperación, resolverla determinísticamente desde el stock sin perder unitId/receipt; o ventana acotada de unidades con acceso a todas. Elegir la opción tras comprobar invariantes, no inventar una segunda bolsa.

**Valor:** preparación escalable, menos controles equivalentes. **Aceptación:** stock0/1/3/30/100, distintos IDs y pending, asignar/quitar/intercambiar/cancelar; ningún consumo hasta confirmar; equivalencia de receipt y descubrimiento.

### A06 · P2 · Rareza, estrellas, rasgos y acabado compiten en cada carta de álbum

**Hecho por código:** `CollectionPanel.tsx:313–334` añade nombre, TraitBadge, etiqueta encantada/conteo, RarityBadge, StarRating, copias y equipo. En la ficha se repiten casi todas las capas `365–374`. Son propiedades distintas y no debe fusionarse su semántica.

**Interpretación:** una carta puede parecer una ficha de atributos antes que un objeto coleccionable. No se ha visto una nueva captura de carta con todas las marcas simultáneas; pendiente de muestra representativa.

**Cambio:** portada de álbum: retrato dominante, nombre, emblema primario y una banda inferior de rareza+copias; acabado por marco material con nombre accesible y detalle. Estrellas solo donde su significado sea necesario y tras verificar qué regla comunican; no ocultar sin decidirlo. La ficha conserva la lectura completa en dos niveles “identidad” / “uso táctico”.

**Valor:** placer de colección y lectura rápida. **Aceptación:** una carta con múltiples rasgos, encantado, equipo y duplicados; comparación ES/EN/ARCANA390/1280 y texto ampliado. El porcentaje, identidades y reglas no cambian.

### A07 · P2 · El mapa tiene objetos legibles, pero la ruta compite con la ilustración

**Evidencia visual:** A90 `selected-guide-390.png` muestra iconos diferenciados y destino disponible fuerte; las conexiones entre rutas se perciben con mucha menos claridad que fachadas y adoquines. `MapPanel.tsx:65–67,247–250` y renderer gobiernan caminos y opciones. La lista accesible existe; no falta una función de consultar.

**Interpretación experta:** para planificar bifurcaciones se requiere más esfuerzo que para reconocer un cofre. Es un problema de jerarquía, no ausencia probada de conexiones.

**Cambio:** huella/trazo con borde claro y soporte oscuro local, primero ramas alcanzables y vecinas consultadas; resto mantiene información pública más tenue. Mantener fondo/actores y lectura del grafo. No pulsos perpetuos ni revelar resultados secretos. Separar “camino alcanzable” de “nodo seleccionado” mediante forma y trazo.

**Valor:** decisiones de ruta más fáciles. **Aceptación:** misma semilla antes/después, dos ramas no equivalentes, fondos claro/oscuro y art absent; tarea humana posterior de anticipar dónde conduce cada rama, sin explicar solución.

### A08 · P2 de claridad, propuesta · Una gramática visual para afinidad, casa y vínculo

**Hecho por código:** `PreparationSynergies.tsx:35–53` presenta BondBand y resumen de afinidad; `BondBand.tsx:85–122` añade modo automático/casas/grupos; `HouseInsignia.tsx:147–179` comunica activación y contribuyentes. Funcionan como sistemas separados. La muestra del tarro acredita Gryffindor2/3 junto a SombrasI.

**Problema interpretado:** tres maneras de agrupar cromos pueden confundirse como un único “tipo Pokémon”. La intención de compañía añade un cuarto objetivo visual, sin ser otra bonificación.

**Cambio:** gramática fija: afinidad = símbolo elemental pequeño junto al personaje; casa/grupo elegido = estandarte del equipo; intención = marcador de ruta sin cifra de potencia. Un único libro “Tu plan” explica diferencias reales y antes/después; mantener inspecciones desde emblemas. No otro panel permanente ni cambio de efectos.

**Aceptación:** plan con casa inactiva y afinidad activa, grupo elegido contra auto, duplicado/temporal/encantado; todos describen la contribución real. Sesión humana: pedir que identifique qué activa cada efecto y qué no concede la intención.

### A09 · P2 de eficiencia, hipótesis · El álbum conserva un tamaño de página de cuatro con catálogo creciente

**Hecho por código:** `CollectionPanel.tsx:109–111` fija cuatro por página en todos los tamaños. Catálogo34 implica nueve páginas antes de filtrar; filtros de clasificación, rareza, descubrimiento y acabado ya existen a demanda.

**Cambio:** conservar folio de cuatro móvil si mantiene presencia; escritorio puede mostrar dos páginas de cuatro o índice por familias, con contador real y objetivo visible. Ofrecer salto por familia y retorno a página/posición anterior. No convertirlo en tabla, ni revelar nombres de identidades ocultas.

**Valor:** búsqueda/revisión menos repetitiva. **Aceptación:** colección inicial/amplia, nueve páginas, filtro vacío, abrir/cerrar ficha y cambiar página con teclado; selección por instancia/equipo permanece fuera del álbum. Tiempo de localizar un objetivo en sesión humana posterior, sin asumir mejora por reducir clics únicamente.

### A10 · P3 · Símbolo de “Ejército” reutiliza el libro de “Todos”

**Hecho por código:** `ClassificationChoices.tsx:39–40` usa ui.collection tanto en all como army. Las etiquetas existen y evitan una pérdida funcional, pero el dibujo no ayuda a diferenciar la agrupación.

**Cambio:** pequeño emblema neutral propio y coherente con grupos, usado en filtro y ficha, con texto fuera del arte. Priorizarlo después de la gramática de sistemas; no generar un lote de retratos. Debe constar fuente/procedencia, dimensiones y fallback.

**Aceptación:** a24/32px y ambos packs los dos objetos difieren por forma además de color; ES/EN mantienen nombre; fallo de arte conserva etiqueta.

### A11 · P3 · Ajustes acumulados necesitan un índice, no eliminar opciones

**Evidencia visual:** A90 `selected-reading-390.png` tiene idioma, mundo y lectura antes de velocidad; audio, movimiento y ayuda quedan después. `GameSettings.tsx:81–139` confirma todas las secciones. No es un desbordamiento ilegítimo: el scroll está permitido.

**Cambio propuesto:** tres secciones plegables “Juego”, “Accesibilidad”, “Cuenta” con resumen de estados y selección preservada. Si se abre desde pausa, anclar en reproducción sin esconder el resto. La preferencia activa debe seguir siendo reconocible sin abrir todos los grupos. No partirlo en otra cadena de pantallas ni imponer formulario fantástico a credenciales.

**Valor:** encontrar un ajuste sin recorrer todo el estuche. **Aceptación:** acceso a idioma/audio/reducido en teclado/toque, regreso del foco,320px/200%, estado efectivo del sistema visible. Hipótesis de eficiencia pendiente de prueba, no motivo de bloqueo técnico.

## Observaciones menores y límites

- Mantener formularios convencionales en identidad es una elección correcta; convertir email/password en objetos sin etiquetas perjudicaría gestores y comprensión. El marco ilustrado y un objeto superior bastan. No repetir el cambio ya implementado en A79–82.
- El taller A90 logra renuncias legibles con pocos valores. No esconder valores iguales: explican qué se conserva. No requiere nuevos fondos/varitas.
- Antesala A71 tiene buena jerarquía rival→equipo→desafiar. No extrapolar su foto histórica a composiciones5×5 actuales, criaturas o nombres ampliados. Validación fresca selectiva pendiente.
- El foco visible no es el problema de “recuadros”; la acumulación de superficies equivalentes sí. Conservar contraste y semántica.
- Los cuatro sabores no son una receta de selección de sabor; el texto vigente dice “El secreto de los sabores”, correcto. No registrar ese punto como fallo de crafting inexistente.
- `HouseInsignia.tsx:169–172` muestra un siguiente valor con constantes. El coordinador contrastó después que houseSynergies es marcador1 y los valores se fijan en el dominio: no es un fallo de snapshot demostrado. Como máximo queda una oportunidad de extraer la proyección compartida por mantenibilidad; no se registra como finding funcional.
- Movimiento inferido por código: apertura GSAP por fases, efecto de selección160/180ms, ambiente CSS con suspensión y reducido, replay compartido. No hay evidencia temporal nueva para valorar peso/contacto, calidad de audio, cadencia universal o sincronía perceptiva.
- No recomendar aumentar partículas ni todos los rigs. Una muestra útil sería el trazo de ruta y un emblema inequívoco antes de producir nuevos efectos. El cuerpo plano articulado solo en objeto no se llama rig completo.

## Carga cognitiva y recorrido emocional

**Entrada:** imagen protagonista y tres decisiones de acceso legítimas. **Preparación:** aquí se concentran desafío, copias, objetos, afinidades y grupos; es el mayor valle de atención. **Ruta:** la elección existe, pero la prominencia de los caminos debe crecer. **Combate:** menos decisiones nuevas durante replay es correcto; la emoción depende de que se lean consecuencias del plan. **Cierre:** botín primero e intención voluntaria después evita un vacío de propósito. **Colección:** necesita armonizar la presentación y el denominador para que el progreso se perciba confiable.

Puntos con más de cuatro opciones visibles: cinco puestos de formación (necesarios), hasta cinco aliados/objetivos en cada bando (necesarios), nueve clasificaciones al abrir filtro (puede agruparse), tarros sin límite por unidad (innecesario escalar así). No aplicar mecánicamente “máximo cuatro” a combatientes ni ocultarlos.

## Personas y riesgos a comprobar

- **Primera partida casual:** puede distinguir acciones del mapa, pero le faltará el significado de afinidad/casa/vínculo si todos se enseñan a la vez. Probar con kit real y sin explicación previa.
- **Coleccionista avanzado:** atlas30 frente a catálogo34 rompe confianza; secuencias largas de cuatro cartas/tarros pueden producir fricción. Probar con colección amplia ficticia y declarar la fixture.
- **Persona con baja visión/solo teclado:** los nombres y foco están conservados, pero falta arte puede dejar cierres sin símbolo y Ajustes exige recorrido largo. No asumir que emulación de texto equivale a lector real o zoom físico.

## Orden recomendado para una implementación posterior

1. Corregir verdad visible: A01, A03 y recuperación contextual A02, conservando autoridad.
2. Completar resiliencia de objetos: A04 y escala de grageas A05.
3. Probar una muestra de composición de mapa + gramática de plan: A07/A08, antes de tocar todos los nodos.
4. Un folio representativo del Cromodex y navegación adaptativa: A06/A09.
5. Emblema puntual e índice de Ajustes A10/A11 si la muestra demuestra valor.

No se ha implementado ninguna propuesta. No hay autorización nueva de reglas/economía, integración main, despliegue o producción de lotes. La recomendación de diseño no prueba comprensión, interés, diversión o retención.
