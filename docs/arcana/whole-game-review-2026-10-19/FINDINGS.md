# Registro consolidado A91

Este archivo prevalece sobre assessments independientes.18 recomendaciones:3 P1, 10 P2, 5 P3. No P0 confirmado. Prioridad experta, no volumen de usuarios afectado ni pérdida de datos demostrada. C=código; V=imagen inspeccionada; T=ejecución histórica; H=hipótesis. Todas pendientes de implementación/validación nueva.

## U01 · P1 · Atlas /30 frente al catálogo vigente de34

- **Evidencia C:** `JourneyCabinet.tsx:26-48; CollectionPanel.tsx:76-139; infrastructure/content/trial-configuration.ts`.
- **Problema:** Numerador y denominador no comparten universo; además el readmodel conserva identidades históricas.
- **Cambio concreto:** Una proyección compartida de completitud: catálogo vigente obtenible, archivo separado; atlas y álbum consumen el mismo resultado. No sustituir30por34.
- **Valor esperado, hipótesis:** Confianza en el objetivo y extensión del catálogo sin cifras contradictorias.
- **Implementación:** esfuerzo S; dependencias: Decidir explícitamente universo base/archivo, sin borrar copias.
- **Aceptación:** Catálogos30/34, criatura, repetido, encantado e identidad archivada: mismos totales; nunca>100%; consulta sin escritura.
- **Límite:** Código contrastado; no reproducción nueva de34/30.

## U02 · P1 · Bóveda orienta a una llave que la repetición no entrega

- **Evidencia C:** `CommercePanel.tsx:244-266; content-packs/diagon-alley/messages.json:94; domain/economy/rewards.ts:28-35; application/run-use-cases.ts:417-421`.
- **Problema:** Con cero llaves siempre se pide derrotar un jefe; tras consumir la llave de primera victoria, repetir no da otra. Solo hay una región.
- **Cambio concreto:** Derivar orientación de derechos/stock: primera llave pendiente→jefe; llave usada y sin fuente alcanzable→bóveda ya visitada y volver al plan/colección. Botín histórico sigue consultable.
- **Valor esperado, hipótesis:** Evitar una meta imposible y repetición por una promesa errónea.
- **Implementación:** esfuerzo S–M; dependencias: Proyección read-only de primeras victorias; conservar llaves/premios.
- **Aceptación:** Antes/después de primera victoria, llave poseída/consumida y repetición; no prometer ni conceder nueva llave; CTA viable.
- **Límite:** Cadena de código y reglas contrastada, sin jugar otra partida.

## U03 · P1 · El aviso de sesión no ofrece volver a entrar en la cuenta en contexto

- **Evidencia C/H:** `RecoveryNotice.tsx:55-76; App.tsx accountControl/openAccount; recovery-messages.ts`.
- **Problema:** Existe login en Ajustes, pero aviso ofrece reconsulta/nuevo ensayo. Puede sugerir empezar otra partida. No se demuestra pérdida de datos.
- **Cambio concreto:** Conectar “Volver a entrar” al acceso existente; si hay pending, priorizar comprobar operación y reautenticar mismo propietario. Nueva partida secundaria deliberada.
- **Valor esperado, hipótesis:** Recuperar confianza y continuidad sin navegar a ciegas.
- **Implementación:** esfuerzo M; dependencias: Contratos A76/A75 y bloqueo de cambio de propietario.
- **Aceptación:** Sesión caducada sin pending/con commit perdido, mismo/diferente dueño, cancelar; conservar key/receipt y recursos.
- **Límite:** Disponibilidad técnica en Ajustes comprobada; hipótesis sobre comprensión pendiente.

## U04 · P2 · Halloween muestra códigos técnicos como error

- **Evidencia C:** `SeasonalEvent.tsx:332-344; App.tsx:523-542; operation-error.ts`.
- **Problema:** Imprime error recibido del controller; no pasa por traducción como RecoveryNotice.
- **Cambio concreto:** Adaptador localizado por causa y acción; código solo en detalle técnico optativo. Conservar recuperación dentro del modal.
- **Valor esperado, hipótesis:** Comprender qué impide continuar y qué se puede hacer.
- **Implementación:** esfuerzo S; dependencias: Reutilizar operationErrorKey y mensajes de temporada; no cambiar autoridad.
- **Aceptación:** ES/EN para offline, conflicto, expiración y respuesta perdida; no anunciar éxito ni perder recuperación al cerrar.
- **Límite:** Rama contrastada; no error inyectado ahora.

## U05 · P2 · Cierres pierden su símbolo visible con arte ausente

- **Evidencia C:** `Artwork.tsx:28-29; ShopBook.tsx:66-74; CollectionPanel.tsx:345-351; FlavourCabinet.tsx:98-104`.
- **Problema:** El botón conserva aria-label/Escape y marco, pero solo el Artwork o texto oculto comunica cerrar visualmente.
- **Cambio concreto:** Fallback visible ×/flecha o texto localizado; patrón compartido acotado para estos consumidores, sin reemplazar semántica.
- **Valor esperado, hipótesis:** Cerrar consultas con toque aun cuando falla la descarga.
- **Implementación:** esfuerzo S; dependencias: Revisar cierres solo-imagen; no reabrir fallback Ajustes/mapa/guía ya resuelto.
- **Aceptación:** Fallar ui.clear/ui.pass, 44 px objetivo, foco/Escape/retorno y ninguna operación por cerrar.
- **Límite:** Análisis de render/CSS, no fallo reproducido en esta auditoría.

## U06 · P2 · Los caminos compiten con el fondo

- **Evidencia V/H:** `MapPanel.tsx:235-302; scenes/pixi-scenes.ts; A90 selected-guide-390.png`.
- **Problema:** Los nodos destacan más que las conexiones; seguir una bifurcación puede requerir esfuerzo. La lista/consulta ya existe.
- **Cambio concreto:** Trazo alcanzable con soporte oscuro local y borde claro; enfatizar conexiones consultadas y estados por patrón, sin cubrir el escenario ni bucles de brillo.
- **Valor esperado, hipótesis:** Planificar ruta y reconocer dónde conduce una elección.
- **Implementación:** esfuerzo M; dependencias: Misma semilla/fondo/zoom antes-después; no revelar sorteos.
- **Aceptación:** Se ven conexiones completas y estados sin solo color; teclado/toque/lista, ambos packs,3tamaños; tarea humana de anticipar una rama.
- **Límite:** Composición móvil observada; dificultad humana no medida.

## U07 · P2 · Afinidad, casa, grupo e intención necesitan jerarquía común

- **Evidencia C/V/H:** `PreparationSynergies.tsx; BondBand.tsx; HouseInsignia.tsx; TeamHud.tsx; ExpeditionIntentions.tsx`.
- **Problema:** Son sistemas distintos y válidos; sus emblemas/contadores cercanos pueden parecer pasivos acumulables del mismo tipo.
- **Cambio concreto:** Afinidad junto al personaje; vínculo elegido en estandarte de equipo; intención en marcapáginas de ruta sin cifra de potencia. Libro único “Tu plan” con reglas y contribuyentes reales.
- **Valor esperado, hipótesis:** Entender cómo la colección habilita un plan, sin añadir poder o premios.
- **Implementación:** esfuerzo M–L; dependencias: Conservar un vínculo y reglas compartidas, historial, duplicados/encantados.
- **Aceptación:** Casa inactiva/afinidad activa, auto/grupo,3→4, temporal y duplicado; misma proyección mapa/preparación/log. Explicación humana posterior.
- **Límite:** Fuente y muestras seleccionadas; confusión es hipótesis.

## U08 · P2 · Nombres largos se parten dentro del apellido

- **Evidencia V/C:** `BossPartyStage.tsx:100-118; boss-staging.css:145-158; CI39280235365 selected-preparation-mobile-diagon.png`.
- **Problema:** La muestra muestra McGonagall cortado entre líneas; PV/PM y objetos compiten con nombres de varias alturas. No se oculta ninguna unidad.
- **Cambio concreto:** Distribución de puestos que permita nombres por palabras y condición compacta; probar4/5columnas frente3+2 antes de fijar. PV prioritaria, PM/gear detallados consultables sin perder información táctica.
- **Valor esperado, hipótesis:** Identificar al compañero y su condición a escala de móvil.
- **Implementación:** esfuerzo M; dependencias: Preservar antesala, tiempo/coste, foco y todas las unidades.
- **Aceptación:** Mismos nombres antes/después,3/4/5 integrantes,390/865/1280,200%/320; sin recortes o reducción indiscriminada; condición sigue disponible.
- **Límite:** Fallo de encuadre visible, no medida de lectura humana.

## U09 · P2 · Capas de datos compiten con el retrato

- **Evidencia C/V/H:** `CollectionPanel.tsx:313-334,365-374; CardReveal.tsx:375-385; A90 selected-collection-390.png; A69 selected-opening-result.png`.
- **Problema:** Rareza, estrellas, rasgos, acabado, copias y equipo son distintos, pero ocupan varias bandas.
- **Cambio concreto:** Folio de dos niveles: portada retrato/nombre/emblema/rareza-copias; ficha identidad y uso táctico. Conservar estrellas registradas y significado a demanda; no fusionar rareza con potencia.
- **Valor esperado, hipótesis:** Satisfacción de descubrir y comparar sin aspecto de ficha administrativa.
- **Implementación:** esfuerzo M; dependencias: A43/A85 y metadatos públicos/ocultos; no cambiar denominador.
- **Aceptación:** Muestra representativa multirrasgo/encantado/repetido, ES/EN, packs; nada táctico o accesible se pierde.
- **Límite:** Revelación y ficha parcial vistas; versión con todas las marcas necesita muestra.

## U10 · P2 · Un botón por tarro idéntico escala sin límite visual

- **Evidencia C/H:** `BeanAssignments.tsx:81-109; BossSupplies.tsx; A90 selected-beans-390.png`.
- **Problema:** Map sobre todo stock; captura solo acredita3, no30/100.
- **Cambio concreto:** Tarro con contador y asignaciones visibles por portador; selector de unidad acotado o elección estable de IDs si contrato lo permite. Mantener acceso y recuperación por unidad.
- **Valor esperado, hipótesis:** Preparación rápida con inventario desarrollado, sin segunda bolsa.
- **Implementación:** esfuerzo M; dependencias: Preservar unitId, borrador y revisión; confirmar no consume dos veces.
- **Aceptación:** Stock0/1/3/30/100, reasignar/quitar/cancelar/caído/reserva y response-lost; consumo/descubrimiento solo confirmados.
- **Límite:** Escalado inferido de código; no overflow reproducido.

## U11 · P2 · Cuatro cartas por página también en escritorio

- **Evidencia C/H:** `CollectionPanel.tsx:109-112; ClassificationChoices.tsx`.
- **Problema:** 34 identidades requieren9páginas sin filtro; el cajón tiene19opciones en4grupos al abrirse, no19decisiones obligatorias.
- **Cambio concreto:** Mantener4en móvil si conviene; escritorio doblefolio de8 o índice de familias. Resumen de filtros activos y limpiar cercano, salto/retorno de posición sin revelar identidades ocultas.
- **Valor esperado, hipótesis:** Encontrar un cromo/objetivo sin recorrer álbum repetidamente.
- **Implementación:** esfuerzo M; dependencias: Misma ordenación/historial/filtros; no mover equipo al álbum.
- **Aceptación:** 34+históricos, filtro vacío, cambiar/cerrar ficha, teclado/texto ampliado; medir localizar una identidad conocida y conservar secretos.
- **Límite:** Esfuerzo humano no medido; probar antes de cambiar paginación.

## U12 · P3 · Ejército y Todos usan el mismo libro

- **Evidencia C:** `ClassificationChoices.tsx:39-47; HouseInsignia.tsx TraitBadge`.
- **Problema:** Las etiquetas desambiguan, pero la forma no ayuda a reconocer categorías. Army no es vínculo mecánico.
- **Cambio concreto:** Muestra de emblema editorial propio o monograma coherente a24/32 px, con variante por pack cuando proceda. No añadir sinergia.
- **Valor esperado, hipótesis:** Reconocimiento con menos lectura.
- **Implementación:** esfuerzo S; dependencias: Primero gramática U07; procedencia y fallback.
- **Aceptación:** Forma distinta de Todos/Orden/rareza, ES/EN y arte ausente; reconocimiento humano posterior.
- **Límite:** No bloqueo funcional; producción pendiente.

## U13 · P3 · Ajustes acumula secciones y requiere recorrido largo

- **Evidencia V/C/H:** `GameSettings.tsx:81-139; A90 selected-reading-390.png`.
- **Problema:** Idioma, mundo, lectura, velocidad, audio, movimiento y cuenta comparten estuche; scroll válido, no bug de overflow.
- **Cambio concreto:** Índice pequeño Juego/Accesibilidad/Cuenta con resumen de estado. Abrir desde pausa en reproducción; mantener acceso a todo sin otra cadena modal.
- **Valor esperado, hipótesis:** Encontrar una preferencia y volver al juego.
- **Implementación:** esfuerzo M; dependencias: No esconder estados propios/sistema, audio voluntario, idioma solo aquí.
- **Aceptación:** Teclado/toque,320/200%, apertura desde varias pantallas, foco y persistencia por dueño; medir tarea.
- **Límite:** Propuesta de eficiencia; no defecto técnico demostrado.

## U14 · P2 · Glosario y algunas frases no acompañan la evolución del juego

- **Evidencia C:** `content-packs/diagon-alley/messages.json anApprenticeAWandAndAPathTo; recovery-messages.ts; ShopBook/FlavourCabinet; account-messages.ts`.
- **Problema:** “completa la Álbum” y “The Diagon Alley”; “ensayo” en recuperación de cuenta; la ayuda de sabores puede explicitar mejor que descubrir no permite elegir un sabor.
- **Cambio concreto:** Corrección localizada ES/EN y glosario por función. Mantener transparencia de ensayo/correo local. Renombrar ayuda de sabores como “Descubrir sabores” cuando encaje; sin prometer crafting.
- **Valor esperado, hipótesis:** Comprensión y calidad editorial sin añadir párrafos.
- **Implementación:** esfuerzo S–M; dependencias: Revisión en contexto y accesible; no reescribir nombres propios o costes arbitrariamente.
- **Aceptación:** Claves/parámetros completos, singular/plural, textos visibles y lectores, ambos packs; ninguna promesa de envío externo o poder por rareza.
- **Límite:** Ejemplos concretos en COPY.md; no auditoría lingüística humana profesional.

## U15 · P3 · El índice de URL incluye arte que ya no figura en registros

- **Evidencia C:** `content-packs/active.ts:90-96; assets-inventory.json`.
- **Problema:** 430archivos importables;129sin referencia en assets.json,1.536.275bytes. Puede haber uso directo/CSS/PWA. No son129huérfanos confirmados.
- **Cambio concreto:** Trazar consumidores y sustituir glob amplio por índice permitido o raíces vigentes solo si conserva todos los accesos. Archivar fuentes históricas fuera de runtime sin borrarlas.
- **Valor esperado, hipótesis:** Distribución y mantenimiento más predecibles; no afirmar mejora inicial por eliminar bytes no descargados.
- **Implementación:** esfuerzo M; dependencias: Auditoría de URLs dinámicas, manifests y PWA; preservar fuentes/licencias.
- **Aceptación:** Buildgraph antes/después, cero404, swap/offline/recarga, apertura/arena/art absent; medir red fría comparable.
- **Límite:** Bytes de archivo medidos, no RAM ni descarga inicial; no tamaño límite aprobado por archivo.

## U16 · P2 · La coherencia funcional no demuestra fluidez perceptiva universal

- **Evidencia T/C:** `A90 QA/evidence/performance; opening-motion-model.ts; motion/replay-clock.ts; SceneCanvas.tsx`.
- **Problema:** A75pareado muestra16,7–16,8msChromium/21–23WebKit; A69ventanas31–92msWebKit. Picos y muestras desfavorables conservados, no atribución causal.
- **Cambio concreto:** Medir una muestra temporal representativa por cuello demostrado antes de nueva coreografía. Mantener reloj/ticker bajo demanda y límites; no prometer FPS por reducir botones.
- **Valor esperado, hipótesis:** Que el feedback se lea y no bloquee la siguiente acción.
- **Implementación:** esfuerzo M–L; dependencias: CI Linux serie/guard, condiciones equivalentes y scripts actuales.
- **Aceptación:** G2 desde gesto, ventanas/cachés declaradas, pausa2x/ocultación/skip/desmontaje; conservar resultados malos;20ms es objetivo no garantía.
- **Límite:** Medición histórica, no reejecutada ahora; perceptual y físico pendientes.

## U17 · P3 · Un ambiente24s y señales por evento necesitan escucha en contexto

- **Evidencia C/T/H:** `audio/assets.ts; audio/game-audio.ts; audio-inventory.json; design/audio/a84/manifest.json`.
- **Problema:** 16WAVmono24kHz; duración/consentimiento comprobables. Bucle corto puede cansar; no se ha escuchado en esta auditoría.
- **Cambio concreto:** Sesión de escucha voluntaria y muestra A/B acotada de dinámica/silencio. Si hay necesidad, extender ambiente o variaciones offline; no añadir sonido por cada hover/botón.
- **Valor esperado, hipótesis:** Ambiente con personalidad y ataques distinguibles sin fatiga.
- **Implementación:** esfuerzo M; dependencias: Consentimiento separado música/efectos, silencio ante fallo, no descarga previa; mantener2cadenas.
- **Aceptación:** Volumen bajo/alto, auricular/altavoz físico,10min voluntarios, pausa/2x/skip/swap; medir carga y cero golpes atrasados.
- **Límite:** Hipótesis de calidad, no defecto acústico confirmado.

## U18 · P3 · Familias de controles y cascada necesitan contrato compartido acotado

- **Evidencia C/T:** `FantasyActionButton.tsx; VisualChoices.tsx; ShopBook.tsx; styles.css y36hojasCSS; falloS07A90`.
- **Problema:** Ya existen buenas familias, pero cierres/fallbacks/estados se resuelven por consumidor; S07 demostró riesgo de especificidad. No todo botón debe ser FantasyActionButton.
- **Cambio concreto:** Definir4familias: acción principal, objeto seleccionable, consulta y sistema; extraer solo cierre/fallback/libro repetidos. Tokens y reglas de foco, sin framework nuevo ni reescritura general.
- **Valor esperado, hipótesis:** Menos regresiones y producción de pantallas más coherente.
- **Implementación:** esfuerzo M; dependencias: Preservar tipo botón/details/dialog, colores semánticos y nombres accesibles.
- **Aceptación:** Galería de componentes ES/EN/packs/estados, estilos calculados y ausencia de controles equivalentes nuevos; regresión de consumidores.
- **Límite:** Mantenibilidad contrastada; no evidencia de que36CSS sea por sí solo un fallo.

## Contradicciones resueltas

Atlas: A y B coinciden en el hecho; P1 aquí por verdad del objetivo, no bloqueo total. HouseBand: valores de casa son semántica fija del dominio houseSynergies1, no un fallo de snapshot demostrado. Siguiente valor duplicado sería mantenimiento, no regla nueva. Detector bounce: overshoot material localizado y reducido válido; no se corrige por gusto genérico. Detector side-tab: selección redundante y semántica, no defecto administrativo demostrado. Fallbacks A90 de guía/mapa/Ajustes ya existen; U05 solo añade consumidores distintos. Cuatro inputs de fuente no son cuatro campos simultáneos; en la app se instancian por estado.
