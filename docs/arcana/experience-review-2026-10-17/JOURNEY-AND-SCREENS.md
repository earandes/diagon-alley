# A74 · Recorrido, pantallas y estilo

Baseline937a0a1. **C** código actual; **V** PNG actual visto; **T** ejecución identificada reutilizable; **H** hipótesis para persona. T no equivale a inspección visual interactiva nueva. No se ha abierto navegador ni generado capturas en este Mac.

## Mapa de decisiones del recorrido

| Tramo / objetivo del jugador | Qué necesita / acción principal | Alternativas y consecuencia | Cierre de la acción y motivo para seguir | Evidencia / reserva |
|---|---|---|---|---|
| Entrada: acceder a su ensayo | Estado de conexión/guardado; entrar | Esperar o reintentar; se crea/reutiliza sesión | Carga de partida y preparación | C App327–341,423–438; T journey A73. F01/F02; confianza visible por revisar. |
| Preparar una expedición | Copias, condición, temporales, equipo, desafío y fuente de cambios | Seleccionar 1–5 para explorar; inspeccionar/equipar; confirmar explícitamente | Run guardada y mapa | C ExpeditionPreparation; T A73/A63. No selector gratuito de personajes. F03/F08. |
| Leer ruta y escoger | Nodo disponible, tipo, amenaza conocida, coste y camino | Consultar/cancelar o resolver rama permitida | Nodo visitado, siguiente fila disponible | C MapPanel/App; T region-map/journeys. F07 limita planificación y equivalencia informativa. |
| Pacto: construir equipo | Dos candidatos temporales, afinidad, cambio real de sinergia/capacidad | Elegir, inspeccionar, pasar cuando válido; reemplazar temporal explícitamente si lleno | Incorporación única, retrato/condición en equipo | C NodePreparation350–527; T autoridad/compatibilidad, no toda config tácticas A65 invocada en CI final. No prueba de comprensión humana. |
| Refugio: recuperar condición | Estado PV/PM y antes→después | Curar o concentrar; cancelar consulta | Cambio confirmado, regreso al mapa | C NodePreparation147–215,run-use-cases393–406. Preview y dominio usan40%; no se confirmó un supuesto fallo de redondeo: se descarta. |
| Cofre: aprovechar hallazgo | Botín conocido mostrado, sin coste inventado | Abrir o volver sin resolver | Receipt/botín, nodo consumido una vez | C NodePreparation/reward, NodeResult; T integración/journey. No exige una decisión táctica artificial donde solo hay una recompensa. |
| Encuentro: intercambiar condición | Beneficio y coste por unidad/grupo, elegibilidad y resultado exacto | Intercambio individual/grupal o pasar; elegir portador cuando corresponde | Resultado guardado, condición visible | C EncounterPreparation/sharedpreview; T A67. F05: instancia ambigua con repetidos. |
| Duelo: preparar frente a amenaza | Rival/afinidad, formación válida, condición/equipo/consumible, coste5 | Preparar, asignar/quitar borrador, cancelar o confirmar | Respuesta guardada y arena | C App/NodePreparation/BeanAssignments; T A63/A73. F03/F11. Confirmación no garantiza victoria. |
| Arena: entender combate automático | Dos bandos, actor/objetivo, PV, daño/curación/caída | Pausa, Auto,2x, inspector, registro y omisión | Desenlace después de reproducir/omitir, log confirmado intacto | V arenas; T A69/A70/A71/A73. F06. Imagen de contacto no prueba gesto en movimiento. |
| Regresar tras duelo | Resultado correcto y condición residual | Seguir ruta, equipo, consulta/tienda cuando disponible | Siguiente decisión en mapa | C App/NodeResult; T journey A73. No repetir tirada al navegar. |
| Jefe: anticipar y comprometer | Jefe protagonista, composición pública, preparación propia y coste | Libro del rival, equipo/tarro, volver o desafiar | Arena del mismo enfrentamiento | V tres antesalas; T A70/A71/A73. Composición actual funciona como escena experta, aceptación humana pendiente. |
| Desenlace: entender y usar botín | Victoria inicial/repetida, derrota/empate; premios confirmados | Llave→bóveda, rana poseída→abrir sin compra, equipo→inspección/preparación | Estado actualiza destinos tras uso | V cierre; C ExpeditionClosure/readmodels; T journeys y PG/Redis. Derrota/empate con modelos/render estático, no nuevo journey gráfico integral acreditado. |
| Volver deliberadamente | Intenciones viables y recursos actuales | Elegir/cambiar/sin intención; preparación y confirmación de otra run | Nueva run explícita, recordatorio discreto | C ExpeditionIntentions; T A65 intentions/A73. Botín pendiente conserva prioridad. Motivo para repetir H, no medido. |

## Inventario por pantallas y estados de renderizado

Todas las rutas proceden de `navigation.ts`/`useNavigation.ts`; los overlays son condiciones de App/componentes, no rutas inventadas. Componentes y CSS abreviados desde `src/arcana/presentation/`. Assets son claves activas resueltas por el paquete, no nombres de una propuesta histórica. Ver `[CONTENT-PACKS](../CONTENT-PACKS.md)` para el mecanismo y los manifests, no un listado de todos los exports de arte.

| Pantalla / acceso | Componentes y recursos activos | Jerarquía, estado, transición y juicio experto | Comprobación / siguiente aceptación |
|---|---|---|---|
| Bienvenida y carga, sin game | App, SceneAtmosphere; scene.boulevard, ui.enter; estilos shell/scene | Una entrada principal. Intro/nota guardado ocultas visualmente; carga/error de entrada breves. No añadir carrusel/tutorial de texto. | C/T; no PNG actual de esta superficie visto. F02; sesión inválida F01. |
| HUD/navegación/estado, todas las vistas | PlayerHud, OperationFeedback, useNavigation; crowns/essence/key,map/collection/shop/missions | Saldo confirmado y energía consultada; cuatro destinos por objeto. Header mapa usa nombre regional una vez; escena/modal conserva sus propios Ajustes cuando pertinente. No volver a eliminar semántica para reducir botones. | C; V header en cierre/arena, no mapa base. La captura de fixture “QA” no es branding de campaña. |
| Ajustes, trigger global o modal | GameSettings,settings-case.css; ui.settings,seal,motion,missions | Idioma/mundo son elecciones reversibles de presentación; guardado a demanda. Son preferencias, no acciones económicas. Un control agrupado en este contexto es apropiado. Fallback visible ya existe. | C/T swap; F10. No nueva validación audible o de orden Tab integral. |
| Preparación inicial, mapa sin run / nueva expedición | ExpeditionPreparation,PreparationGear,PreparationSynergies; retratos/thumbs,equipo,puestos; expedition-preparation/contextual CSS | Formación protagonista y confirmación explícita. Seis copias por página; detalles en inspector. Desafío voluntario en ayuda específica. | C/T; las imágenes llamadas preparation son antesala del jefe, no prueba visual de esta pantalla. F03/F08. |
| Inspector y equipamiento, overlay de preparación | dialog.preparation-inspection,PreparationGear/EquipmentArt; personaje,varita,escoba | Base→equipo y comparación compartida; equipar escribe, consultar no. Conservar distinción de instantánea de run vs colección. | C/T; F04 en error/pending. No proponer eliminar todos los datos del inspector: son a demanda. |
| Mapa y lista equivalente, #/map con run | MapPanel,TeamHud,ExpeditionGuide,IntentionReminder; fondo regional,node.*,trails,origin portrait | Mapa central adaptado por geometría; inicio estático no evento. Medallones/estado y equipo compacto; lista alternativa. | C/T, sin PNG nuevo específico de mapa. F07. Confirmar lectura de bifurcaciones humana, sin inferirla de la adyacencia válida. |
| Equipo compacto e inspector en ruta | TeamHud y preparación contextual; thumbs/owned/temporary/equipo | Lectura de equipo sin dashboard permanente; activar consulta/preparación existente. | C/T. Repetidos deben conservar posición/origen en todos los destinos; F05 evidencia un hueco en Encuentro, no en todo el equipo. |
| Pacto, nodo seleccionado | NodePreparation,node-a60/tactical CSS; dos retratos,affinity,seal,owned/temporary | Dos alternativas con elección marcada, detalle a demanda, cambio de sinergia y sustitución explícita. Es una decisión real del dominio. No contar cada botón informativo como una decisión estratégica nueva. | C/T parcial por suites; ningún PNG actual de Pacto revisado. Validar tácticas específicas con su config al modificar este flujo. |
| Refugio, nodo seleccionado | NodePreparation,VisualChoices; node.refuge y símbolos PV/PM | Dos opciones y previsualización; no confundirlo con Encuentro nuevo. Fin en condición guardada/mapa. | C/T; mantener PV/PM/no-benefit/caídos legibles, sin otra animación obligatoria. |
| Cofre, nodo seleccionado / resultado | NodePreparation,NodeResult; node.chest,currency,productos | Mostrar objeto/botín y resolver; resultado confirmado. No necesita decisiones falsas para parecer complejo. | C/T; falta imagen actual elegida para aceptación del acabado. |
| Encuentro de personaje, nodo seleccionado | EncounterPreparation,encounter/trade CSS; hostportrait,PV/PM,targets | Beneficio/renuncia conocidos y antes/después; elección por grupo/unidad/pasar. | C/T A67; F05. No confundir una unidad elegible con consentimiento de gasto antes de confirmar. |
| Preparación de duelo ordinario | NodePreparation,BeanAssignments,PreparationSynergies; threatbadge,portraits,jar | Información táctica a demanda; una confirmación de coste. El tarro aún usa fracción en summary. | C/T; F03/F11; no PNG actual seleccionado para evaluar densidad. |
| Antesala del jefe | BossPrelude,BossPartyStage,BossSupplies,boss-staging.css; actor-rest/book/bowl,companions,jar,book | Rival y aliados tienen zonas claras; en móvil rival arriba/equipo debajo. Una acción principal Desafiar5 y regreso secundario. No pide otra confirmación ceremonial. | V escritorio/390 ambos packs; T matriz A70/A71. Validar también errores en subinspectores F04. |
| Arena, #/battle | BattlePanel,SceneCanvas,pixi-scenes; scene.arena,figures,boss actor-base/arm/rest; arena-a63/boss-actor CSS | Dos bandos, nombres/PV, controles agrupados y libro. Actor/objetivo con indicadores localizados; resultado neutral al inicio. | V tres arenas; T replay/fallback/lifecycle. F06 para5×5 móvil. No rig corporal completo: muestra de actor por piezas. |
| Inspector/registro de combate | BattlePanel y proyección BattleLog; texto/afinidad/equipo | El detalle puede desplazarse; pausa/retorno mantienen cursor/log. No sustituir el registro por partículas. | C/T, no nueva lectura hablada. |
| Victoria/derrota/empate y vuelta | BattlePanel,NodeResult,ExpeditionClosure,BossBattleFacts | Hechos del log sin atribución causal inventada; premio real y siguiente acción. Repetida no anuncia otra llave. | C/T; V cierre de victoria. Derrota/empate: hueco gráfico integral declarado. |
| Cierre y siguiente intención | ExpeditionClosure,ExpeditionIntentions; lootobjects,map,portraits,jar | Botín pendiente primero y destino utilizable; nueva expedición explícita. Receipt/historia plegados. Evitar segunda pantalla de misiones o celebración al consultar histórico. | V cierre; T A63/A65/A73; viabilidad/motivación humana H. |
| Callejón comercial, #/shop | ShopHub,shop-journey.css; shopfront.confectionery/workshop/vault,scene.boulevard | Fachadas abren interiores sin comprar. Carteles DOM localizados sobre arte, no texto horneado. | C/T parcial; sin captura actual elegida. No aprobar legibilidad de cada cartel por el código. |
| Confitería, #/shop/confectionery | SweetshopScene,ShopBook,ShopExit; toad.box/seal,beans.jar,currency | Selección no compra. Rana propia→abrir; sin rana→comprar y abrir; gragea→comprar/preparar. Evita bolsa ambigua inicial. | C/T A63+trial; no PNG actual de tienda. Revisar continuidad F11 sin rehacer este flujo resuelto. |
| Libros de probabilidades e instrucciones | ShopBook,readmodels,BeanAssignments | Tabla real derivada de pesos y explicación a demanda. No confundir rango con identidad ni proyectar reglas vivas en run antigua. | C/T; F03 específico de reglas de run, no hallazgo universal de todas las tablas. |
| Apertura: sello/tapa/rana/carta/rareza | CardReveal,FrogMagic,RevealTheatre,opening-motion-model; toad.*,card.*,rarity.*,character portrait | Receipt antes de coreografía; nuevo/repetido y rarezas existentes; omisión/reducido/idioma/pack sin nuevo sorteo. | C/T A69/A63; ningún movimiento visto en A74. Preservar optimización A58/A73, no otro renderer por estética. |
| Álbum/Cromodex, #/collection | CollectionPanel,FlavourCabinet,RarityBadge,StarRating; portrait/card.back/frame/beans | Descubrimientos/copias separados; páginas de cuatro, filtros plegados y ficha; preparación externa. No añadir equipar dentro del álbum. | C/T trial; PNG actual no seleccionado. F08 pertenece a preparación, estos filtros no lo resuelven. |
| Ficha de personaje y sabores | CollectionPanel dialog,FlavourCabinet; portraits,beansproduct | Información expandida; sabor solo por consumo confirmado. No constituye XP ni poder por rareza. | C/T; contraste/zoom/lector generales pendientes. |
| Taller/forja, #/shop/workshop | CommercePanel,EquipmentArt,VisualChoices,ShopBook; wood/core/wand,scene.workshop | Combinación/ventaja/coste, quote y confirmación; equipar luego en preparación. Receta histórica no se reinterpreta silenciosamente. | C/T trial y PG/Redis. Sin PNG actual visto; más controles aquí pueden ser legítimos por combinaciones, no defecto por conteo. |
| Bóveda, #/shop/vault | CommercePanel; scene.vault,gold-key,vault/rewardgear | Llave disponible/coste/confirmación; botín persistido y acceso a equipar. Sin llave ofrece ruta viable. | C/T y PG/Redis. No afirmar calidad de animación actual sin observación dinámica. |
| Atlas/Misiones, #/missions | JourneyCabinet,FlavourCabinet; map/collection/key,boss/future card | Contadores/destinos del juego actual; futura región marcada como tal. No hay segunda región jugable. | C, cobertura gráfica específica limitada. Oportunidad de redundancia por observar, no bug confirmado. |
| Halloween, objeto global fuera de arena | SeasonalEvent/WindowGallery,seasonal CSS; lantern/windows/keepsake | Entrada voluntaria; calendario servidor, tres objetivos, decisión y recuerdo sin poder. Historia/recuerdo separados de colección base. | C/T A68 con reduced+swap y renderer fallido; sin captura actual elegida aquí. No describirlo como evento futuro sin implementar. |
| Offline, sesión, errores, operación incierta | App,PlayerHud,GameController,IndexedDB metadata,OperationFeedback | Saldo/receipt autoritativos; no éxito optimista, recuperación misma key. Modal superior necesita conservar acceso a mensaje. | C/T PWA/PG/Redis; F01/F02/F04/F09. Un ensayo cookie no es cuenta productiva recuperable. |

## Dirección de estilo para los fixes, sin producir recursos

1. **Personaje antes que contenedor.** En una decisión, figura/objeto y consecuencia reciben jerarquía; marcos separan grupos, no rodean cada dato. La antesala actual cumple mejor esto que la arena densa.
2. **Una acción principal por compromiso.** El desafío con coste sigue siendo inequívoco; libro, tarro, regreso y Ajustes son secundarios. No eliminar sus botones nativos ni añadir gestos obligatorios.
3. **Posición y procedencia como lenguaje común.** Reutilizar ordinal/owned/temporary de arena y portadores; no dibujar otro selector para Encuentro.
4. **Vacío no es tarea.** ×0 o sin sinergia no necesitan casilla pendiente ni exhortación a comprar. Existencias y borrador no son una fracción de progreso.
5. **Texto de decisión visible; explicación a demanda.** Mantener costes, antes/después, nombres, errores y estado guardado; reducir duplicación y jerarquía, no borrar información.
6. **Foco con forma del objeto.** No quitar el foco visible por parecer un recuadro; ajustar contorno/contraste y comprobar teclado. Hover no es la única consulta.
7. **Paquetes equivalentes sin uniformar personajes.** Aceptar diferencias estilísticas deliberadas, comprobar encuadre a escala real y no deformar ni rehacer colección para arreglar el layout.
8. **Fallback material y funcional.** Texto/símbolo cuando falla arte; interacción económica sigue igual. No llenar pantallas normales de placeholders preventivos.

## Movimiento y game feel: qué conservar y qué no está validado aquí

| Momento | Implementación/contrato actual | Juicio y validación posterior |
|---|---|---|
| Selección/reorden de consulta | useSelectionMotion, selección finita; estado elegido explícito | Mantener reacción breve; no reiniciar una celebración por seleccionar o filtrar. F08 no necesita partículas. |
| Operación guardada | OperationFeedback, Motion mini; hasta180ms desde receipt, reducido/oculta sin tween | Conservar cierre de guardado. Llevar recuperación al contexto activo F04; el movimiento no corrige un mensaje inaccesible. |
| Actor/lanzamiento/contacto/impacto/caída | BattleLog→replay compartido→DOM/Pixi; boss-art actor-base/arm/rest | Tests prueban fases/cursor/log, PNG prueba encuadre. No se ha observado fluidez del gesto en A74. F06 debe evaluar secuencia en entorno permitido. |
| Apertura | GSAP DOM+FrogMagic; receta por rareza/nuevo/repetido, evento visual reclamado | Conservar continuidad/omisión/historial. No añadir nuevo sorteo, filtros costosos ni renderers por defecto. |
| Forja/bóveda/Halloween | useConfirmedMotion/CSS y estados confirmados | Efecto localizado/finito, progreso y objeto obtenido primero. No se certifica ritmo por leer duración/keyframes. |
| Ambiente | SceneAtmosphere y preferencia de movimiento | Ambientación subordinada a decisión; F10 arregla semántica del ajuste, no elimina protección del sistema. |

No se aconseja audio, shake global, hit-stop nuevo o loops adicionales. Se podría ensayar un énfasis corto de actor/objetivo con el reloj existente si F06 lo necesita; no se autoriza cambiar duración del combate autoritativo ni fabricar suspense con un saldo anterior.

## Matriz de estados y límites

| Condición | Qué se ha contrastado | Qué sigue pendiente o necesita fix |
|---|---|---|
| Primera entrada/regreso | C sesión/kit; T journeys/cookie | F02 entrada lenta; confianza visible H. |
| Sesión expirada con game / operación pendiente | C ramas exactas | F01; nueva reproducción gráfica específica posterior. No declarada probada ahora. |
| Equipo1–5, temporales, repetidos/reservas/caídos | C reglas/proyecciones; T suites y fixtures; V repetidos antesala | F05 en Encuentro; lector/físico no ejecutados. |
| Run antigua con snapshot distinto | C divergencia efectiva | F03; fixture de divergencia específica pendiente. |
| Inventario0, saldo/energía insuficientes | C disabled/errores; T trial/modelos | No todos los productos/errores×packs×viewports están cubiertos por una matriz universal. |
| Producto poseído / recompensa nueva/repetida | C/T apertura/loot/firstrights | Mantener distinción premio histórico vs stock actual. |
| Victoria inicial/repetida | T journeys/grants; V victoria cierre | No generalizar una captura a todos los desenlaces. |
| Derrota/empate | C/modelos/render estático acreditados A73 | Journey gráfico completo de cada uno sobre candidato actual no acreditado. |
| Cancelar / recargar / respuesta perdida / dos pestañas | T A63/PWA/PGRedis | No cubre por asociación entrada concurrente F02 ni inspector superior F04. |
| Evento antes/durante/cierre/histórico | C/T A68/PGRedis | Sin nueva observación visual ni humana del evento aquí. |
| ES/EN y swap | C claves/IDs; T journeys/fixtures | No todos los textos de cada estado tienen PNG actual; overflow general no certificado. |
| Pausa/2x/Auto/inspector/omitir | T A69/A70/A71/A73 | Estética dinámica y dispositivo físico no probados por A74. |
| Hidden/decode/resize/reducido | T lifecycle A73 sintético | F10 ajuste real; no contextoGPU/segundo plano físico acreditados. |
| Arte/import/renderer ausente | T fallbacks específicos | F09 iconos puntuales; no asumir cobertura de cada asset. |
| Teclado/foco/toque/texto ampliado | C semántica; T casos localizados | Sin recorrido humano solo Tab, lector audible, zoom nativo o móvil físico integral. |

No se han añadido ni probado regiones, habilidades o sistemas que no existen. La cobertura pendiente delimita la conclusión; no se rellena con observaciones inventadas.
