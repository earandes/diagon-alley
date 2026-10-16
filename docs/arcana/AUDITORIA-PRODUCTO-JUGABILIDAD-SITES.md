# Auditoría de producto, jugabilidad, UX/UI y publicación en Sites

> **Actualización A49–A51, 14 octubre:** lote visual/UX integrado y validado localmente. Esta auditoría conserva el diagnóstico anterior al incremento; los hallazgos de arte/animación/UX resueltos se actualizan con [evidencia nueva](visual-production-2026-10-14/REPORT.md). Enric aplaza Sites y pide terminar local.
14 octubre 2026 · ARCANA, PRD 1.0.17/A48 · Auditoría del checkout actual, sin implementar mejoras ni desplegar.

## A. Veredicto

**Sí hay un juego funcional que puedes probar localmente. Todavía no hay una URL de ARCANA publicada en Sites, y el acabado visual sigue siendo un ensayo con sustitutos.**

Se ha ejecutado el recorrido real desde una sesión nueva: kit → dos pactos → duelo con Gragea → recompensa → Sapo comprado y abierto → Cromodex → cofres/refugio → jefe → llave → bóveda → forja → equipamiento → recarga. Una segunda expedición permitió inspeccionar un Encuentro del Azar. El servidor guardó consumo, resultados y progreso; no se editaron saldos para conseguir estos resultados.

La base sirve para validar navegación, economía de ensayo, combate automático y persistencia. Para validar personajes, ambientación y una apertura mágica completa faltan ilustraciones, envases y puesta en escena. Las cartas actuales muestran nombres, estrellas y un símbolo común; las unidades de combate son geometría procedural.

Respuestas directas:

| Pregunta | Resultado actual |
|---|---|
| ¿Abrir ranas de chocolate? | El producto activo permite abrir **Sapos de Cacao**, su equivalente ARCANA. La rana histórica no forma parte del build activo. |
| ¿Comprar y abrir Grageas? | Comprar sí. Asignar y consumir en combate sí. **No existe una apertura independiente del tarro en la Confitería ni una colección de sabores obtenidos.** |
| ¿Todos los sabores? | Cuatro efectos del PRD: Menta dulce, Pimienta volcánica, Tierra podrida y Jabón rancio. No hay un catálogo ilimitado de sabores. |
| ¿Canjear? | Sí: una Llave de Oro por botín de bóveda. **No hay canje de duplicados**, elección de cromo faltante o ratio 3:1 vigente. |
| ¿Animaciones? | Sí: sello/carta GSAP y reproducción PixiJS del combate. No hay animación ilustrada de caja/tapa/sapo ni tarro de Grageas. |
| ¿Confeti? | No se encontró un efecto de confeti conectado en ARCANA. Las partículas de colisión de combate son otro efecto. |
| ¿Diseños de personajes? | Treinta definiciones con atributos y textos es/en; **sin treinta retratos finales integrados**. |
| ¿Jugabilidad online? | No. El launcher y la autoridad actuales dependen de servicios loopback. |

No se ha identificado un fallo P0 de integridad en las comprobaciones ejecutadas. Esto no certifica ausencia de defectos fuera de los casos cubiertos. El balance, diversión y comprensión sin guía siguen sin observación con usuarios.

### Autoridad y reconciliación documental

Se leyeron AGENTS.md, PRD completo, DECISIONS completo, REQUIREMENTS-STATUS, FINAL-ACCEPTANCE-AUDIT, README y contratos de HTTP, ensayo, gráficos, equipo/Grageas y los componentes/casos de uso pertinentes. A29/A30 y las ampliaciones posteriores gobiernan ARCANA. Los Word se mantienen intactos.

La fila histórica de REQUIREMENTS-STATUS «Bazar compra y apertura Sapos/Grageas · Flujo completo» necesita una lectura más precisa: el código abre Sapos en tienda y activa Grageas al confirmar combate. No prueba una apertura de tarros en tienda. A40 describe expresamente esa asignación previa al duelo. Asimismo, «298 unitarios» es el total del repositorio: la ejecución actual separa **275 de ARCANA y 23 históricos**, no 298 de ARCANA.

| Referencia anterior | Equivalente vigente | Estado en el artefacto activo |
|---|---|---|
| Callejón/Weasley | Bulevar/Pasaje/Bazar | ARCANA, sin reutilizar escenas o nombres anteriores. |
| Rana → persona u objeto | Sapo → cromo de mago | Apertura conectada; no entrega objetos desde la tabla de Sapos actual. |
| Personas/Objetos/Sabores | Cromodex de magos + equipo + productos consumibles | Modelos distintos; no trasladar inventario de I1. |
| Grageas reservadas para I2 | Tarros tácticos antes del duelo | Compra y activación de cuatro efectos; sin álbum de sabores. |
| Canje 3:1 propuesto | Bóveda con llave | El canje histórico continúa siendo una propuesta anterior, no una función ARCANA aprobada. |
| Tres rarezas/sin barra inferior | Cuatro rarezas/barra inferior | Implementación vigente con Mapa/Cromodex/Bazar/Misiones. |

Restaurar la franquicia, una rana que entregue objetos, un álbum de sabores o un canje de duplicados supondría una decisión nueva. No se recomienda hacerlo automáticamente para cerrar esta auditoría.

## B. Recorridos y pasos auditados

Capturas nuevas guardadas e inspeccionadas en esta ejecución. [Galería completa con notas por captura](auditoria-2026-10-14/GALERIA.md). No se reutilizan imágenes antiguas como evidencia actual.

| Paso | Acciones y resultado observable | Salud | Capturas |
|---|---|---|---|
| 1. Entrada | Elegir idioma y comenzar sesión; kit único de aprendiz, Abedul, Céfiro y 50 Coronas. | Funciona en Chrome de pruebas; entrada IAB no completada. | 01–02 |
| 2. Mapa y pactos | Iniciar expedición, confirmar dos pactos; formación 1→3 temporal y adyacencia visible. | Funciona; necesita explicar mejor formación y ruta ascendente. | 03–04 |
| 3. Confitería y Sapo | Comprar por 10 Coronas; abrir; carta guardada y revelación omitible. | Funciona; presentación mínima sin envase/personaje. | 05–07, 24 |
| 4. Cromodex y equipo | Filtrar, inspeccionar copia/atributos, cambiar idioma; asignación y recarga. | Funciona; tarjetas genéricas y navegación larga. | 08–09 |
| 5. Grageas | Comprar tarro por 5; asignar a una unidad; mostrar cuatro efectos/probabilidades. | Funciona como consumible; no como apertura en tienda. | 10 |
| 6. Duelo y reproducción | Confirmar gasto de 5 Esencia; pausa/Auto/2x/omitir; resultado persistido. | Funciona; arena densa, dibujos detrás del texto. | 11–13, 15–16 |
| 7. Eventos | Cofre entrega botín; refugio cura con tope; encuentro guarda narrativa y PV antes/después. | Funciona; varias confirmaciones no anticipan detalle de efectos. | 14, 22 |
| 8. Jefe y continuidad | Victoria entrega 50 Coronas, llave y Sapo; Misiones muestra Bosque desbloqueado. | Funciona; Bosque no tiene ruta jugable en este ensayo. | 17–18 |
| 9. Bóveda | Cancelar conserva llave; confirmar consume una y entrega botín guardado. | Funciona; canje de llave, no de duplicados. | 19–20 |
| 10. Taller | Elegir madera/núcleo, confirmar forja por 15; asignar pieza en Cromodex y recargar. | Funciona; sin escena o animación de forja. | 21, 09 |
| 11. Accesibilidad, errores y adaptación | 320/390/1280 px, texto raíz 200%, teclado, movimiento reducido, doble pulsación y saldo cero. | Cobertura parcial; mensaje de sincronización erróneo, hardware/lector/zoom nativo pendientes. | 23–25 y suites |
| 12. Publicación | Inspección de capacidades Sites, build, API, sesiones y servicios. | Bloqueada por integración de hosting pendiente; sin publicación. | Sección F |

El mapa contiene **16 nodos totales: 15 más jefe**, repartidos en siete filas. Una expedición elige una rama y visita siete nodos; no debe esperarse visitar los dieciséis en una sola partida. Primera ruta manual: `0:0 → 1:0 → 2:0 → 3:0 → 4:0 → 5:1 → 6:0`. Segunda: pactos `0:0/1:0` y encuentro `2:2`.

Ejemplo de evidencia de resultados, con lectura de API real del mismo jugador:

- Compra Sapo: Coronas 50→40; apertura: una copia nueva, total 2 contando aprendiz.
- Compra Grageas: 40→35. Duelo: Esencia 50→45, tarro consumido, Pimienta registrada; premio +20 Coronas y otro tarro, saldo 55.
- Dos cofres: +10 Coronas cada uno. Jefe: saldo 125, Esencia 40, una llave y un Sapo.
- Cancelar bóveda: conserva llave 1/saldo 125. Confirmar: llave 0/saldo 175, dos Sapos y varita de Saúco/Dragón ×1,3. El botín fue una muestra aleatoria, no una garantía de ese resultado.
- Forja Abedul/Dragón: 175→160, nueva instancia ×1,2. Asignación comprobada tras recarga. Encuentro de segunda run: PV 100→90 y 90→81 en dos aliados; narrativa recuperada.
- Comparación de estado antes/después de recargar el encuentro: igualdad del snapshot; equipo forjado conservado. [Lecturas registradas](auditoria-2026-10-14/logs/recorrido-api.txt).
- Sesión nueva para adversos: doble click en comprar produjo **un POST, una unidad y 50→40 Coronas**; doble click en abrir produjo **un POST y una copia**. Tras consumirla, stock disponible 0 y ningún botón de apertura. Cuatro compras normales llevaron 40→0; una compra adicional rechazó sin cambiar el snapshot. Actualizar estado eliminó el error. [Registro](auditoria-2026-10-14/logs/doble-pulsacion.txt).

## C. Matriz funcional

«UI» significa acción accesible en la interfaz actual. «Prueba» distingue ejecución manual, suite con servicios reales y fixture/harness. Que una regla exista en dominio no significa haber observado todas sus variantes desde la interfaz.

| Requisito | UI | Implementación | Verificación actual / evidencia | Límite | Siguiente acción |
|---|---|---|---|---|---|
| Sesión/kit único | Sí | Gateway + InitializePlayer + PG/Redis | Entrada Chrome, integración, recorridos es/en | Cookie 7 días; sin recuperación de cuenta | Definir acceso de pruebas online |
| Ruta ramificada y lista equivalente | Sí | MapPanel/Pixi/Run | Manual; suite con WebGL ausente | Diseño esquemático; no hardware táctil | Guía de ruta y escena final |
| Pactos/formación 3–5 | Sí | Run/prepare-team | Manual dos pactos; reglas unitarias | Aliados temporales; no propiedad permanente | Explicar temporal/coleccionable |
| Compra Sapo | Sí | PurchaseProductUseCase | Manual saldo; integración | Sin contador de productos ni confirmación separada | Feedback/stock visible |
| Apertura Sapo | Sí | OpenCocoaToadUseCase | Manual dos revelaciones, reload es/en, SQL/retry | Solo magos, 29 candidatos | Completar presentación |
| Probabilidades Sapo | Sí, desplegable | Derivadas de pesos | Datos/config/tests actuales | Uniformes de ensayo; porcentaje redondeado | Validar balance/jerarquía |
| Compra Grageas | Sí | Compra de `random-beans` | Manual y suite team-beans | Tarro no revela sabor al comprar | Explicar uso desde Confitería |
| Apertura Grageas en tienda | No | No encontrada | App/BeanAssignments + captura 10 | Activación solo al confirmar duelo | Decisión de producto si se desea |
| Cuatro sabores/efectos | Sí, antes del duelo/registro | Tabla versionada + beans/engine | Manual Pimienta; cuatro efectos deterministas en dominio | No cuatro sorteos manuales ni álbum de sabores | Validar comprensión y balance |
| Cromodex 30 identidades | Sí | Proyección de copias/snapshots | DOM cuenta 30; filtros/copia manual/suites | 30 definiciones no son 30 retratos | Arte y resumen descubiertos/total |
| Objetos/varitas/escobas | Sí en equipo/Taller/Bóveda | Instancias propias/loadout | Forja/asignación/reload; SQL | No álbum histórico de objetos | Mejorar descubrimiento de inventario |
| Cuatro rangos/1–5 estrellas | Sí | Campo guardado por copia/receipt | Revelaciones 2/4 estrellas; tests versionado | Correspondencia y balance provisionales | Validación de U25 |
| Duelo automático | Sí | Motor puro ejecutado por servidor | Manual + dominio/API/SQL | No decisiones tácticas durante playback | Explicar que controles son de reproducción |
| Pausa/Auto/2x/omitir | Sí | BattleReplay/Pixi | Cursor 0→0 pausado; 4 en Auto; 86 al omitir; suites | No cambia combate ya calculado | Mejorar presentación móvil |
| Cofre/refugio/encuentro | Sí | Resolución transaccional | Manual; narrativa/HP/reload en ambos idiomas por suite | No todas las variantes manuales de azar | Anticipar efecto pertinente |
| Jefe/recompensa/desbloqueo | Sí | Progreso por zona/receipt | Manual + hud-results es/en | Bosque futuro, no jugable | Mostrar objetivo completado |
| Derrota/empate/nueva run | Sí para volver e iniciar | `lost` cierra run; nuevo StartRun | Reglas unitarias; segunda run manual tras victoria | No derrota natural observada manualmente | QA manual de recuperación por derrota |
| Esencia 50/5/12 min | Sí | Regla pura/Redis TIME/PG | Coste observado; tests de tiempo reales/deterministas | No espera manual de doce minutos | Validar reloj/UI en móvil |
| Repetición al 10% | Sí, al rejugar | Historial primera victoria | Dominio/SQL reejecutados | No repetición de duelo manual en esta auditoría | Caso manual Q11 |
| Forja 9 recetas | Sí | Comercio versionado | Manual Abedul/Dragón; suite cancel/equip/reload | Resto inspeccionado en datos, no 9 forjas manuales | Arte/evaluación de recetas |
| Llave→bóveda | Sí | OpenVaultUseCase/receipt | Manual cancel/confirm; suite es/en; concurrencia SQL | Dos botines provisionales | Presentación y balance |
| Canje de duplicados | No | No caso/API/UI encontrado | Revisión aplicación/API/Cromodex | Ratio/destino/proteger última copia no aplican | Solo diseñar si se aprueba nuevo alcance |
| Recuperación/reintentos/pestañas | Parcial: recuperar/actualizar | Controller + IDB intención + SQL | 36 integración, harness dos pestañas y 12 PWA | Simulaciones de fallos identificadas | Verificar transporte desplegado |
| PWA/offline | Build sí | Manifest/worker/API no cacheada | 12 casos Chromium/WebKit | Offline no permite gastar; no instalación física | HTTPS y QA instalación |
| Confeti/arte final | No | Geometría/glyphs provisionales | Código/manifest/capturas actuales | Partículas de combate ≠ confeti | Sección E |
| Cuenta recuperable entre dispositivos | No | Sesión anónima de ensayo | Gateway inspeccionado | Cookie perdida/expirada no recupera inventario | Decisión U26 |
| Sites jugable | No | Build estático, sin backend distribuido | Herramientas disponibles/listado, arquitectura | Loopback; no manifest Sites | Sección F |

### Catálogo y azar

`trial-v1.json` contiene 30 magos: 8 Comunes, 8 Inusuales, 8 Épicos y 6 Arcanos Legendarios. Aprendiz se concede por kit y no figura en la tabla de Sapos: quedan 29 candidatos, peso 1 cada uno. Cada identidad tiene probabilidad **1/29 = 3,448275… %**, presentada con redondeo. La distribución agrupada es 7/29 Común, 8/29 Inusual, 8/29 Épico y 6/29 Legendario. Las estrellas no hacen menos probable un cromo en esta configuración.

El catálogo alcanza el número MVP, pero el contenido descriptivo repite «identidad de ensayo; retrato provisional». No constituye variedad narrativa/visual final. La tabla no garantiza personaje nuevo ni elimina duplicados, y no debe confundirse con la bienvenida histórica A13/A18.

Las Grageas tienen pesos iguales: 25% cada una. Menta cura 25% PV máximo con tope; Pimienta añade 30% al daño del primer turno; Tierra reduce iniciativa 15% durante dos turnos; Jabón provoca fallo del primer hechizo. El sabor se selecciona en autoridad y queda en BattleLog. El usuario escoge portador y tarro, **no sabor**. Todos los valores no definidos normativamente siguen siendo ensayo, sin balance aprobado.

## D. Diseño, UX/UI y accesibilidad

### Fortalezas observadas

Hay un lenguaje visual consistente verde oscuro/dorado, texto funcional en DOM, destinos de navegación con estado activo y avisos de provisionalidad. Los modales de nodo, forja y bóveda explican acción/coste y permiten cancelar. El resultado del jefe enlaza con Misiones. Los filtros y controles de equipamiento funcionan; el cambio de idioma conserva la operación. El combate mantiene equivalencia textual y resultados accesibles aunque falte WebGL.

### Hallazgos principales

| ID | Observación y evidencia | Implicación |
|---|---|---|
| UX01 | El HUD/equipo precede a todas las pantallas; tras dos pactos ocupa gran parte de 390×844. Capturas 05, 08, 11. | El objetivo de la pantalla queda bajo varios bloques repetidos. Priorizar contexto y compactar equipo fuera de Mapa/Arena. |
| UX02 | Cartas muestran el mismo símbolo; arena usa figuras geométricas detrás de texto/estadísticas. 07, 08, 11, 12. | No se distinguen visualmente personajes ni se valida atractivo coleccionable. Separar retrato y ficha; producir muestra ARCANA original. |
| UX03 | Confitería presenta botones, sin cantidades de Sapos/tarros. Comprar Grageas no ofrece enlace a su uso. 05 y snapshot grageas-sin-apertura. | Es difícil comprobar qué se adquirió y qué hacer después. Mostrar stock y destino. |
| UX04 | Sapo se compra/abre directamente con etiqueta explícita; no existe ficha/envase o paso de inspección previa. App:381–419. | Gasto intencional técnicamente, pero experiencia de producto/azar poco explicada. Presentar contenido posible, probabilidad y unidad antes de consumir, sin añadir confirmaciones innecesarias. |
| UX05 | La revelación persiste encima del Cromodex al navegar tras apertura; 08 inicial rechazado/recapturado y App usa receipt global. No CTA de colección en CardReveal. | El premio desplaza la siguiente tarea; falta cierre claro «ver mi cromo/continuar». No borrar el receipt guardado al cerrar presentación. |
| UX06 | «Omitir animación» sigue visible una vez acabada la timeline si no se pulsa. CardReveal:68, snapshot 06. | Control sin utilidad temporal clara. Ocultarlo al completar y mostrar siguiente acción. |
| UX07 | Mapa empieza abajo y tiene múltiples aristas; el segundo pacto compite con cofre y la confirmación dice solo «Resolver este evento». 03–04. | Una persona nueva puede elegir cofre y seguir con formación insuficiente. Informar formación/efecto y vía Bazar; no confundir aliado temporal con copia. No se observó bloqueo inevitable porque Bazar permite reclutar permanentemente. |
| UX08 | Victoria, registro y vuelta están después de toda la arena; a 390 px no caben tres unidades en pantalla. 11–13. | Resultado y siguiente paso requieren scroll; controlar densidad y colocar resumen de resolución accesible. |
| UX09 | Durante reproducción, HUD ya refleja estado final mientras las peanas muestran eventos intermedios. Snapshot previo al duelo/arena, 15–16. | Dos valores de PV pueden parecer incoherentes. Etiquetar estado guardado y estado reproducido. |
| UX10 | Misiones conserva «Derrota al jefe…» después de vencer, junto al desbloqueo. 18. | Falta estado de objetivo completado y alternativa para continuar el ensayo. Bosque futuro debe seguir claramente no disponible. |
| UX11 | HUD muestra «1 Gold Keys» (y clave española siempre plural). PlayerHud:60–61, captura 18. | Corregir plurales de cantidades sin concatenar etiqueta fija. |
| UX12 | Filtros/inspección se reinician al recargar; solo pantalla/subtienda están en hash. CollectionPanel:95–96 y navigation.ts. | Decidir si se requiere volver a la misma ficha/filtro; mejora propuesta, no persistencia económica rota. |
| UX13 | IAB permanece en bienvenida después de varias acciones «Comenzar»; Chrome completa entrada. | Incidencia de compatibilidad a reproducir. Causa no aislada; no atribuirla a cookie/IDB o al producto sin diagnóstico. |
| UX14 | Tras rechazo real por saldo cero, aparece el error localizado y también «Sincronizando estado…», con botones deshabilitados. App:222–226, captura 25. | El mensaje de carga se aplica a cualquier estado no listo, incluido error definitivo; distinguir carga, rechazo y recuperación. Actualizar recupera la UI sin modificar saldo. |

### Accesibilidad: comprobado y pendiente

En la revisión actual se observó foco de teclado en nodo disponible; los tests comprueban contraste renderizado de arena, foco, ampliación de texto de cinco unidades y equivalencia mapa/lista. Texto raíz al 200% en 320 px produjo ancho de documento 320, sin overflow horizontal en el encuentro. La barra puede ocupar dos filas; texto ampliado conserva scroll. Eso **no equivale a zoom nativo al 200%**.

El ajuste propio de movimiento reducido produjo carta estática sin botón de omisión; también existe escucha de `prefers-reduced-motion`. Los tests actuales verifican omisión, pérdida de contexto y GSAP ausente sin nueva operación. El Canvas es decorativo para accesibilidad y las acciones/registro viven en DOM. Hay margen inferior dinámico y `safe-area-inset-bottom` en nav.

Pendientes: VoiceOver/TalkBack audible, orden/anuncios en sesión completa, zoom nativo, móvil físico, instalación PWA física, Firefox actual y contraste de todas las combinaciones/componentes. ADB no listó dispositivos en esta ejecución; no se auditó un teléfono. WebKit automatizado no acredita Safari/iPhone físico. No se declara certificación WCAG 2.2 AA.

Se aplicó Product Design Audit y Web Design Guidelines; revisión de código relevante para los hallazgos, no aplicación indiscriminada de reglas de landing pages. Taste declara fuera de alcance interfaces de producto densas y recorridos múltiples; no se adopta su estética o stack sobre ARCANA. No se generó arte ni se inició un rediseño.

Comprobaciones estáticas adicionales: navegación principal por botones con hash, sin enlaces abribles en otra pestaña; `dialog.notice` no define `overscroll-behavior: contain`; filtros no se representan en URL. Son oportunidades de navegación/scroll, no fallos de integridad. [Guía consultada actualmente](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md).

## E. Arte, animaciones y confeti

Manifest actual: [trial-art-manifest.json](../../design/arcana/trial-art-manifest.json). Registro declara fuente editable/provisionalidad, pero agrupa recursos en tres entradas; no hay entrega individual de treinta ilustraciones finales. [Iconos PWA](../../design/arcana/pwa-icons-manifest.json) son independientes del arte de personajes.

| Recurso | Uso y fuente actual | Estado | Falta para entrega visual |
|---|---|---|---|
| Treinta magos/retratos | Catálogo JSON; CollectionPanel/CardReveal; círculo/triángulo Pixi | Datos completos; representación genérica | Ilustración original por identidad, miniatura/carta/arena, manifest de cada asset |
| Rivales/jefe | Tres actores con nombre «rival arcano» y distintas stats | Geometría procedural compartida | Identidad visual, diferenciación del jefe, poses/estados |
| Cartas, dorso y marcos | DOM, símbolo y gradiente CSS `.holographic-card` | Provisional; estrellas/rango textuales | Arte de carta/dorso y tratamiento de rareza revisado; no decidir nueva mecánica shiny |
| Sapo/envase | Botón textual; sello `✦` | Sin caja/tapa/sapo integrado | Envase cerrado/abierto, sapo, sombra, capas/pivotes y animación postcommit |
| Grageas/tarro | Botón y select de «Tarro 1» | Sin ilustración ni apertura separada | Tarro y cuatro representaciones; decidir si apertura independiente es deseada |
| Mapa/pergamino/nodos | `pixi-scenes.ts`, DOM y glyphs | Procedural funcional | Escenario/puntos/elementos originales por capas, legibles a 320 px |
| Bulevar/Confitería/Taller/Bóveda | Fondos CSS/paneles textuales | Sin escenas ilustradas finales | Muestra en contexto y variantes responsivas; no reutilizar arte histórico de franquicia |
| Varitas/escobas/llave | Atributos textuales y controles de equipo | Sin imágenes finales | Iconos/ilustraciones por materiales/modelos y representación de propiedad |
| Arena/peanas | Pixi Graphics detrás de ficha DOM | Provisional | Separar personaje/texto, escena y peanas, estados de impacto/derrota |
| Proyectiles/colisión | Trazos, círculos, ocho partículas radiales | Implementado en renderer | Acabado coherente y validación de lectura/rendimiento; no confeti |
| Confeti/celebración | Sin componente/config/disparador encontrado en ARCANA | No implementado | Decidir ocasión/intensidad; si se aprueba, disparar tras receipt y apagar con movimiento reducido |
| Audio | Sin flujo de audio encontrado en presentación ARCANA | No implementado | Opcional, solo con elección explícita; no bloquea ensayo funcional |

Animación GSAP observada: sello se escala/desvanece en 0,5 s; carta gira desde −55° y aparece en 1,1 s con retraso de 0,35 s. Es una revelación de carta de aproximadamente 1,45 s, **no una apertura física del envase**. El nombre/rareza se ven mientras gira, sin etapa separada de suspense. «Holografía» actual es un gradiente CSS y transformaciones; no arte holográfico final.

Combate reproduce un evento cada 650 ms, o 325 ms a 2x. El jefe manual tuvo 86 eventos: la duración nominal a 1x ronda 56 s; omisión y movimiento reducido evitan esperar. Pausa comprobada sin avanzar cursor; Auto y 2x avanzan, omitir termina en el resultado ya guardado. No hay rig de personajes, movimientos propios por identidad o animación de forja/bóveda.

[Grabación de apertura](auditoria-2026-10-14/apertura.webm) y [grabación corta de controles de combate](auditoria-2026-10-14/combate.webm). Son evidencia adicional de esta ejecución, con padding del grabador; las capturas de la galería son la referencia visual. Las partículas y variantes de fallo tienen además código y tests actuales; no se afirma una inspección manual de todos los impactos del log.

Para completar arte: validar primero una muestra de personaje+carta+apertura en la Confitería ARCANA; producir lote solo después de revisar coherencia. Registrar autor/herramienta/origen/permiso/fuente editable/dimensiones/crop/pivotes/alt por recurso. Mantener texto/acciones fuera del bitmap y fallback sin imágenes; reemplazar arte no cambia inventario, IDs o reglas.

## F. Viabilidad de un nuevo Sites privado

### Capacidades observadas

Se inspeccionó la skill Sites vigente, sus referencias de almacenamiento y Worker, y los esquemas nativos de creación/versionado/despliegue/acceso/variables. `sites_list_sites` respondió correctamente y devolvió el listado completo accesible (cursor nulo); **no apareció un Site ARCANA**. No se creó ni modificó ningún Site, no se pidió credencial y no se publicó.

Sites documenta build estático y Worker ESM, acceso privado, configuración de variables y almacenamiento D1/R2. Eso permite plantear el frontend compilado, pero **no acredita provisión de contenedores Fastify/PostgreSQL/Redis** mediante las capacidades inspeccionadas. No existe `.openai/hosting.json` en este proyecto. El build actual contiene 938.176 bytes y recursos históricos excluidos; no incluye un servidor económico desplegable.

### Bloqueos concretos del código

| Dependencia | Estado actual | Consecuencia para una URL Sites |
|---|---|---|
| API `/api` | Cliente de mismo origen con cookies | Un frontend estático necesitaría backend/proxy para estas rutas |
| Gateway | Rechaza todo origin distinto de `http://127.0.0.1`; compara Origin en mutaciones | No acepta directamente el origen HTTPS nuevo |
| Fastify | Factory/composición; conexión como middleware de Vite | Falta arranque/operación para hosting; Vite local no es launcher de producción |
| PostgreSQL | `127.0.0.1:55432`, credenciales públicas de desarrollo | Inaccesible desde hosting; necesita configuración/secretos y autoridad persistente |
| Redis | `127.0.0.1:56379`, namespace de ensayo | Inaccesible desde hosting; necesita servicio/sesiones/tiempo/límites |
| Cookie | HttpOnly, SameSite Strict, Path `/api`, TTL 7 días, sin Secure local | Configurar HTTPS/Secure y flujo real de sesión del nuevo origen |
| Proxy/IP | `trustProxy:false` | Configurar confianza acotada si proxy existe; no aceptar IP arbitraria del cliente |
| Recuperación | Cookie de ensayo; sin login/recovery | Acceso privado Sites no sustituye identidad del jugador ni recupera inventario |
| PWA | Shell estático; API siempre red | Verificar alcance del worker, caché, actualizaciones y reconexión en URL privada real |

La compatibilidad Node de Workers es parcial y necesita configuración; no prueba que este Fastify con conexiones locales pueda publicarse sin adaptación. [Documentación primaria consultada](https://developers.cloudflare.com/workers/runtime-apis/nodejs/). La conclusión es una inferencia de los contratos de Sites y las conexiones reales del proyecto, no un despliegue experimental ejecutado.

### Alternativas y recomendación

| Opción | Qué permite probar | Trabajo / coste / límite |
|---|---|---|
| A. Ensayo local actual | Juego completo en el ordenador con servicios existentes | Disponible ahora, sin gasto adicional observado. No URL remota; teléfono no alcanza loopback |
| B. Sites frontend + backend existente por HTTPS, vía `/api` en mismo origen | Candidato a ensayo online conservando PG/Redis y núcleo | Recomendado si hay recursos disponibles sin gasto. Requiere hosting/backend/proxy, adaptación de gateway y pruebas de cookies/aislamiento |
| C. Hosting conjunto de frontend/API/PG/Redis en infraestructura existente | Juego online con origen único | Alternativa si Sites no cubre proxy/runtime necesario; publicación fuera de Sites por decisión explícita |
| D. Migrar autoridad a D1 u otra persistencia para alojar todo en Sites | Otra arquitectura | No es incremento mínimo; contradice stack A32 si se sustituye PG/Redis sin nueva decisión. Fuera de esta auditoría |

Para un ensayo temporal, el backend podría usar recursos ya disponibles, con conexión HTTPS autenticada y disponibilidad acotada; eso es una alternativa a estudiar, **no un túnel creado ni una promesa de servicio permanente gratuito**. El ordenador debería permanecer encendido y no dormir. No exponer las bases locales directamente.

No se ha comprobado presupuesto/cuotas/hosting de backend/servicio persistente externo. Por tanto **no está probado un despliegue integral a coste cero**. No se debe añadir un proveedor de pago ni afirmar que una capa gratuita cumpla PG/Redis, sesiones y disponibilidad sin comprobarlo.

### Incremento mínimo propuesto para la URL

1. Identificar recursos reales para Fastify+PG+Redis con coste adicional cero; si no existen, mantener A para validar hoy.
2. Crear un launcher de ensayo online con configuración/secretos, HTTPS y gateway apto para el origen elegido; conservar comando/key/receipt y transacciones actuales.
3. Servir frontend y `/api` bajo el mismo origen mediante una capacidad Sites confirmada o proxy verificado. Alternativa entre orígenes exigiría cambiar cliente/credentials, CORS acotado y cookies; no es conexión directa compatible con el código actual.
4. Mantener Site nuevo privado para Enric; proteger también backend, separar datos de ensayo y revisar proxy/Origin/sesiones. No presuponer que el acceso privado del frontend protege una API externa.
5. Probar en URL real entrada, kit, dos pactos, duelo, compra/apertura, equipo, recarga, llave/forja, respuesta perdida, dos pestañas y offline/reconexión en es/en.
6. Entregar URL, versión/config usada, disponibilidad de backend, limitaciones de sesión y guion manual. No publicar una pantalla desconectada diciendo que es el juego.

La recuperación entre dispositivos puede quedar fuera de un ensayo privado con sesión temporal si se explica y se acuerda ese alcance. Debe existir antes de prometer cuenta recuperable de producto.

## G. Backlog propuesto

Todos los elementos siguientes son propuestas. No alteran decisiones, reglas o arte en esta entrega.

| ID | Problema / impacto | Prioridad | Dependencia | Solución propuesta | Aceptación verificable |
|---|---|---|---|---|---|
| S01 | Sin API remota: impide URL jugable | P1 | Recursos coste cero, Sites runtime/proxy | Ensayo online mismo origen, PG/Redis reales | Recorrido es/en desde Site privado con consumo/reload correctos |
| S02 | Gateway/origin/cookie/secretos solo locales | P1 | S01 | Launcher configurado HTTPS + sesión + proxy acotado | Rechazar origin/jugador ajeno; cookie Secure; recovery misma key |
| V01 | Personajes/cartas/escenas genéricos: impide validar acabado | P1 visual | Muestra original aprobada | Una vertical de arte en contexto; después lote | Personaje reconocible en carta/arena; textos independientes; manifest |
| U01 | HUD y carta previa desplazan tarea principal | P1 UX | Sin cambiar economía | Compactar equipo en Bazar/álbum; revelación con cierre/CTA | Acción principal visible y vuelta al premio sin gasto nuevo |
| U02 | Compra de tarro sin stock/uso visible | P1 UX | A40 actual | Cantidades y explicación «se usa antes del duelo» | Comprador localiza su tarro y asigna uno sin ayuda externa |
| U03 | Formación/pacto poco explicado | P1 UX | Onboarding de ensayo | Mostrar aliado temporal y requisito 3 en bifurcación | Primer duelo alcanzable sin confundir propiedad; recuperación si elige cofre |
| V02 | Sin envase/sapo/apertura ilustrada | P2 | V01, assets por capas | Animación postcommit con estático/omisión | Mismo receipt al omitir, recargar y cambiar idioma |
| U04 | Arena densa y dibujo/texto solapados | P2 | Diseño mobile/Pixi | Retrato separado, atributos esenciales y detalle expandible | Leer identidad/PV/bufos/resultado a 320/390 px y texto 200% |
| U05 | Resultado final queda después de peanas | P2 | U04 | Resumen de victoria/recompensa y siguiente acción | Ver conclusión sin recorrer toda arena; ningún POST al reproducir |
| U06 | HUD final vs replay intermedio confunde PV | P2 | Proyección existente | Etiquetas de estado guardado/reproducción | Comprender ambos valores; sin recomputar combate |
| U07 | Botón omitir continúa tras fin | P2 | CardReveal | Estado de timeline final + CTA útil | Omisión solo mientras anima; accesible con motion reducido |
| L01 | «1 Gold Keys» y plural fijo | P2 | Traducciones completas | Mensajes plurales es/en | 0/1/2 llaves y Coronas con textos correctos |
| U08 | Objetivo jefe no pasa a completado | P2 | Progreso actual | Texto según desbloqueo y límite Bosque | Victoria→Misiones→recarga muestra completado/futuro no jugable |
| Q01 | Entrada IAB no completada | P2 compatibilidad | Diagnóstico navegador/red/sesión | Reproducir y aislar antes de corregir | Entrada fiable o limitación documentada con causa comprobada |
| Q02 | Móvil/lector/zoom/PWA físicos sin evidencia | P2 para ensayo; requisito de aceptación final | Dispositivo/lector | QA físico de recorridos y carga de 5 por lado | Resultados registrados por dispositivo, idioma y condición |
| Q03 | Objetivo 60 FPS no uniforme en perfil actual | P2 | Q02, arte final | Medir/fijar presupuesto y optimizar tras perfil | Objetivo acordado medido, sin extrapolar muestras de escritorio |
| U09 | Confirmación de evento poco informativa | P2 | Datos/riesgos vigentes | Explicar cura/pacto/gasto/azar antes de confirmar | Decisión comprensible es/en; cancelar intacto |
| U10 | Feedback de compra y stock cero ambiguos | P2 | U02 | Estado de compra, cantidad/agotado y recuperación | Compra/restante verificables; saldo insuficiente explicado |
| U12 | Rechazo por saldo insuficiente mantiene mensaje de sincronización | P2 | Estado de controller existente | Renderizar carga solo al cargar/enviar; mostrar rechazo y acción pertinente | Saldo cero rechazado no aparenta petición viva; actualizar conserva snapshot |
| V03 | Sin confeti/celebración específica | P3 | Decidir disparador/arte | Efecto opcional después de receipt | Nunca duplica premio, respeta movimiento reducido |
| U11 | Filtros/ficha no recuperados; navegación solo botones | P3 | Decidir expectativa de navegación | Preservar contexto de lectura y enlaces adecuados | Atrás/recarga no pierde contexto elegido ni cambia inventario |
| P01 | Apertura Grageas independiente no definida | P3 / decisión previa | Nuevo alcance si se desea | Diseñar relación apertura-sabor-consumo, sin doble gasto | Contrato aprobado antes de implementar |
| P02 | Canje duplicados inexistente | P3 / nuevo alcance | Reglas producto/colección | Estudiar ratio/destino/última copia solo si se pide | Aprobación explícita; aceptación transaccional definida |
| P03 | Balance/retorno no validados | P3 antes de producto final | Sesiones de usuarios/datos | Ensayo con preguntas neutrales y observación | Separar completar, comprender y querer repetir; no inventar resultados |

No se añade contenido futuro como sustituto de probar lo actual. Bosque, trueque social y otras expansiones siguen fuera del incremento mínimo.

## H. Guion manual para Enric

### Preparación y repetición sin editar saldos

Node 24 y dependencias ya instaladas en este checkout. Docker disponible. Desde la raíz:

```sh
npm run services:up
npm run dev
```

Abrir `http://127.0.0.1:5189/` en Chrome o navegador equivalente. El sitio es local al ordenador. Para probar PWA, detener dev y usar `npm run build` y `npm run preview:arcana`, en `http://127.0.0.1:5190/`; el worker no funciona como prueba PWA en dev.

Para conservar progreso, mantener mismo navegador/perfil/origen. Para empezar de cero, usar una ventana privada nueva tras cerrar todas las privadas anteriores, o un perfil temporal nuevo: el servidor concede otro kit a una sesión distinta. **No borrar las bases ni alterar balances.** Cambiar puerto no garantiza una cuenta nueva: las cookies se vinculan a host/ruta, no a puerto. Nueva sesión tiene límite local 30 por IP/hora; si aparece límite, esperar su tiempo indicado. No usar reset histórico/importación I1 para ARCANA.

Repetir la expedición en la misma cuenta conserva la colección y aplica recompensas reducidas de niveles ya vencidos. Para comparar ES/EN iniciales, usar dos sesiones nuevas independientes. Cambiar idioma dentro de una sesión debe conservar todo.

| Caso | Situación y pasos ES / EN | Resultado y persistencia a comprobar |
|---|---|---|
| Q01 Entrada | Sesión nueva; «Comenzar ensayo local» / «Start local trial» | Un aprendiz, Abedul +2, Céfiro +3 y 50 Coronas; recargar sin duplicar kit |
| Q02 Primer combate | «Iniciar expedición» / «Start expedition»; primer pacto inferior y segundo pacto; elegir duelo | Formación temporal de tres; «Confirmar nodo» / «Confirm node» gasta 5 Esencia; cancelar conserva estado |
| Q03 Sapo | Bazar/Bazaar; comprar Sapo 10; abrir uno | −10 Coronas al comprar; unidad consumida al abrir; un cromo más; consultar Cromodex y recargar |
| Q04 Revelación | Antes de abrir otra unidad, movimiento normal; omitir/cambiar idioma durante revelación | Mismo nombre/rango/estrellas/copia; ningún regalo o sorteo extra |
| Q05 Grageas | Comprar tarro 5; abrir modal de duelo; asignar Jar/Tarro 1 a unidad; consultar efectos; cancelar | −5 al comprar; cancelar asignación no consume tarro ni Esencia. No buscar botón de apertura en tienda |
| Q06 Activación | Reabrir duelo, seleccionar tarro y confirmar | Una unidad consumida; registro identifica sabor y portador. Puede salir efecto negativo; sabor no elegido |
| Q07 Reproducción | Arena: Pausa/Pause, Auto, 2x, Omitir/Skip; volver y reproducir guardado | PV de peanas avanza/congela; saldos/recompensa no cambian al manejar playback |
| Q08 Colección | Cromodex/Chromodex; filtros; inspeccionar copia; seleccionar equipo | Stats/rango/estrellas correctos; añadir/retirar/equipar se conserva tras recarga; filtro vacío tiene explicación |
| Q09 Eventos | En otra run: dos pactos→Encuentro; en ramas posteriores escoger Cofre/Refugio | Relato/efecto/PV recuperados tras reload y cambio ES/EN; Refugio cura hasta tope |
| Q10 Jefe y bóveda | Ruta segura de ensayo: dos pactos→Refugio `2:1`→Cofre `3:0`→Refugio `4:0`→Cofre `5:1`→Jefe. Bazar→Bóveda | Victoria da llave/Sapo/Coronas; cancelar bóveda conserva llave; confirmar consume una y guarda botín. Bosque desbloqueado aún no jugable |
| Q11 Repetición | Nueva expedición misma cuenta; volver a vencer el mismo nodo de duelo/jefe | 10% Coronas base y sin repetir botín completo de primera victoria; comparar con recibo anterior |
| Q12 Forja | Taller/Wand Workshop; Abedul/Birch + Dragón/Dragon; forjar 15, cancelar y después confirmar; ir a Cromodex y asignar | Cancelar no gasta; confirmar crea una instancia y −15; guardar varita no la compra de nuevo; reload mantiene asignación |
| Q13 Movimiento/texto/teclado | Movimiento reducido, teclado, 320/390 px y texto ampliado | Carta estática, foco visible, controles alcanzables con scroll; no depender de color o sonido |
| Q14 Offline/PWA | Sobre preview compilado, cargar online; desconectar, recargar, intentar acción y reconectar | Shell visible; gasto bloqueado; estado/operación recuperados al volver a red; no crédito offline |
| Q15 Agotado/saldo | En sesión propia nueva, abrir Sapos comprados; gastar hasta saldo inferior al precio | No abrir unidad agotada; rechazo de compra insuficiente sin negativo/entrega ficticia; actualizar recupera UI |
| Q16 Continuidad tras derrota | Preparar equipo inferior dentro de controles disponibles y jugar; si se produce derrota | Resultado conservado, run cerrada y posibilidad de nueva expedición. Azar/balance pueden impedir provocar derrota en una prueba corta; registrar si no se obtiene |

Para fallos de guardado/commit incierto, respuesta perdida y conflictos de claves, ejecutar las suites ya existentes; no provocar corrupción de la base ni desconectar servicios ajenos. Prueba humana adicional: anotar antes saldo/stock, doble pulsación en acción y dos pestañas del mismo perfil; no aceptar dos premios por una única unidad. Si una pestaña queda desactualizada, usar recuperación/actualización y comprobar inventario final.

Registrar por prueba: idioma, dispositivo/navegador, estado inicial, pasos, resultado, ayuda necesaria y evidencia de recarga. Completado con este guion no cuenta como descubrimiento espontáneo del flujo.

Al terminar, Ctrl+C en dev/preview y `npm run services:stop` (no `down -v`). Volúmenes conservan el ensayo. En esta auditoría los servidores propios se detienen al finalizar; las instrucciones permiten reproducirlo.

## I. Evidencia y límites

### Ejecuciones actuales

macOS 27.0.1 (26A434), Node 24.20.0, npm 11.19.0, Docker Compose local. PostgreSQL 16.9 y Redis 7 fijados por digest en compose. [Entorno](auditoria-2026-10-14/logs/entorno.txt).

| Comando | Resultado actual | Qué acredita / límite |
|---|---|---|
| `npm run services:up` | PG/Redis saludables en loopback | Servicios reales locales; no hosting |
| `npm run dev` | Vite 5189 con autoridad | Aplicación actual disponible localmente |
| `npm run test:arcana` | 30 archivos, **275 tests** correctos | Dominio/aplicación/config/HTTP; varios adapters con doubles |
| `npm test` | 33 archivos, **298 tests** correctos | 275 ARCANA + 23 históricos; no sumar con la fila anterior |
| `npm run test:integration` | **36 tests** correctos, PG/Redis reales | Transacción/concurrencia/sesión/recovery; fallos inducidos por hooks controlados |
| `npm run build` | Tipos principal/worker y build correctos | Artefacto compilado; no backend hospedado |
| `npm run verify:arcana:build` | Correcto; **938.176 bytes** | Scanner de contenido/build; no licencias o arte final |
| `npm run test:arcana:browser` | **20 casos** Chromium/WebKit correctos | Harness IDB/arena/pasivos/contraste; no todo es journey de juego |
| `npm run test:e2e` | **30 casos** Chromium/WebKit correctos | Recorridos actuales, es/en, SQL/Redis, cancel/reload/GSAP/WebGL |
| `npm run test:pwa` | **12 casos** Chromium/WebKit correctos | Build/shell offline/reconnect/update y respuesta perdida |
| `adb devices -l` | Lista vacía | Ningún dispositivo Android expuesto por ADB en esta ejecución |
| `sites_list_sites` | Respuesta correcta/listado completo, sin ARCANA | Conector accesible; ningún Site creado/publicado |

[Logs de dominio](auditoria-2026-10-14/logs/unitarios.txt), [todos](auditoria-2026-10-14/logs/unitarios-todos.txt), [integración](auditoria-2026-10-14/logs/integracion.txt), [build](auditoria-2026-10-14/logs/build.txt), [scanner](auditoria-2026-10-14/logs/scanner.txt), [harness](auditoria-2026-10-14/logs/navegador-harness.txt), [recorridos](auditoria-2026-10-14/logs/recorridos.txt), [PWA](auditoria-2026-10-14/logs/pwa.txt).

Son **62 casos de navegador ejecutados** sumando 20+30+12; incluyen versiones por motor/idioma y no equivalen a 62 usuarios independientes. No se escribieron tests nuevos ni se inventó TDD retrospectivo en una auditoría de código existente.

### Casos adversos y niveles de evidencia

| Riesgo | Comprobación actual | Límite |
|---|---|---|
| Sin saldo/stock/energía/llave | Reglas de dominio/HTTP; bóveda deshabilitada tras gasto manual | No todos los rechazos fueron provocados manualmente |
| Doble pulsación y stock cero | Doble click real en comprar/abrir con un POST cada uno; una unidad/copia; botón desaparece al agotar | Una sesión Chrome ES; no doble toque físico táctil |
| Saldo insuficiente real | Sesión propia gastada por compras normales; snapshot idéntico tras rechazo; actualización recupera UI | Mensaje de sincronización incorrecto registrado como UX14 |
| Fallo después de escrituras SQL antes de COMMIT | Tests Postgres con hook, rollback real | Fallo inducido; no incidente real de almacenamiento |
| Respuesta perdida después de COMMIT | SQL/API/controller y PWA | Transporte simulado/controlado; persistencia real |
| Dos clientes por una unidad/revisión obsoleta | Integración Postgres, row lock/revision | No carga masiva de producción |
| Dos pestañas por intención | Harness Chromium/WebKit con IndexedDB real | Puerto de gateway con doubles en harness; no confundir con dos navegadores de usuario reales |
| Misma key/petición y key conflictiva | Dominio/HTTP/SQL | Determinista, no sorteo observado de usuarios |
| GSAP/WebGL ausente o contexto perdido | Suite journey reejecutada | Assets bloqueados/evento simulado; no fallo físico de GPU |
| Cancelación/idioma/reload | Manual y journeys con API real | Sin cierre abrupto físico del ordenador |
| Saldo offline | PWA bloquea nuevas operaciones; recovery misma intención | Shell offline no habilita economía offline |

### Rendimiento actual

El harness de cinco unidades por lado se reejecutó diez segundos por tamaño/motor. FPS de `requestAnimationFrame` en **Mac headless**, junto a contador de renders WebGL:

| Motor | 320 px | 390 px | 1280 px |
|---|---:|---:|---:|
| Chromium | 58,10 | 60,00 | 58,61 |
| WebKit | 60,02 | 60,02 | 60,02 |

No se observa uniformemente 60 en todas las muestras. El test verifica renders/ausencia de overflow y pausa, no un umbral duro de 60 FPS. Distinguir tasa de frames de pantalla, llamadas de render y fluidez sostenida con arte final. Las suites PWA y harness se iniciaron en paralelo; no fue un benchmark de máquina aislada. [Perfiles actuales](auditoria-2026-10-14/perfiles/chromium-five-unit-profile.json), [WebKit](auditoria-2026-10-14/perfiles/webkit-five-unit-profile.json), con p95/frames lentos/draws; perfiles de journey y contraste en la misma carpeta.

El checkout ya tenía numerosas modificaciones y archivos no versionados antes de empezar. HEAD `a88d923ee6dd0caaeaf55107411fd65ac1419bd4` **no identifica por sí solo todo lo auditado**. [Huella SHA256 de fuentes/config/pruebas actuales](auditoria-2026-10-14/fuentes-sha256.json). Solo se añaden este informe y su carpeta de evidencia; sin commit, push, nuevas dependencias, cambios de reglas o publicación.

Límites: Chrome local para inspección manual; IAB solo entrada; Chromium/WebKit para suites; sin Firefox actual (su fallo histórico no se presenta como reejecutado), Safari físico, teléfono, lector audible o usuarios externos. Un intento inicial abrió IAB antes de arrancar Vite y produjo conexión rechazada; luego, con servidor listo, la entrada seguía sin completarse. Hubo ajustes de selectores/capturas durante la auditoría; capturas fuera de estado/crop incorrecto se rechazaron o recapturaron. Una llamada de lectura relativa de API falló por URL inválida y se repitió con URL absoluta: no es fallo de la API del producto.

Preflight de Product Design: script localizado en `skills/user-context/scripts/`, ejecutado; no había contexto guardado. La primera ruta candidata del script no existía y se corrigió. La memoria solo orientó hacia documentos actuales; no se usa como evidencia visual/funcional de esta auditoría.

## J. Decisiones abiertas y análisis adicional

1. Ensayo online temporal con cookie o identidad recuperable: qué continuidad se promete y durante cuánto tiempo.
2. Recursos/operación que cumplan gasto cero para API/PostgreSQL/Redis; disponibilidad del backend y límites de acceso privado.
3. Balance U25: precios/pesos/stats, reclutamiento y correspondencia final entre rarezas/estrellas. La uniformidad de Sapos actual no valida dificultad de obtención.
4. Acabado original ARCANA: muestra de personaje/carta/escena/apertura, tamaño y criterios para producir lote. No trasladar aprobación de una ilustración histórica a un asset nuevo.
5. Si se desea abrir Grageas fuera del combate, definir qué revela, dónde se conserva y cuándo se consume. Esa experiencia adicional no existe actualmente.
6. Si se desea canje de duplicados, aprobar condiciones/destino/protección antes de construir. El canje de llave no resuelve esa petición.
7. Celebración/confeti: dónde aporta feedback, intensidad y equivalencia con movimiento reducido. No requisito implementado por disponibilidad de un efecto fuera del juego.
8. Perfil/dispositivos e indicadores de comprensión/diversión; ninguna sesión externa realizada en esta auditoría.

El bloque «ANÁLISIS ADICIONAL DEL USUARIO» llegó con un marcador vacío. **No hay un análisis adicional concreto que contrastar**. El encargo sí se contrasta en la matriz y en las respuestas iniciales; no se inventa contenido para marcarlo confirmado/contradicho.

## Respuestas de cierre

1. **¿Jugabilidad accesible hoy?** Sí, localmente con Docker+Vite. Recorrido de jugador conectado y guardado real probado; acceso online no disponible.
2. **¿Qué abrir/canjear?** Sapos → cromos de magos; Grageas → sabor/efecto al confirmar duelo; llave → botín de bóveda. Sin apertura de tarro en tienda ni canje de duplicados.
3. **¿Qué arte/animaciones faltan?** Retratos, escenas/envases/objetos finales, apertura ilustrada, acabado de arena y celebración. GSAP y playback Pixi existen; confeti no.
4. **¿Qué bloquea Sites?** Launcher/origen/cookies locales y falta de API/PG/Redis accesibles por HTTPS con coste cero demostrado. Build estático por sí solo no sirve el juego.
5. **¿Incremento mínimo?** Para validar funciones hoy, usar el ensayo local y este guion. Para validar online, conectar autoridad real bajo origen HTTPS de pruebas privado, confirmar recursos y reejecutar smoke/adversos. Para validar atractivo visual, una muestra ARCANA de personaje+carta+apertura y reducción de fricción UX antes de producir todo el arte.

## Actualización después de producción e integración A49/A50

| Requisito/hallazgo auditado | UI/implementación actual | Verificación/evidencia | Limitación/siguiente acción |
|---|---|---|---|
| Retratos/personajes geométricos | 30 retratos/figuras originales + 3 rivales/jefe | Assets individuales/contact sheets y arena/colección actuales; manifest | Raster, sin rig; QA físico y usuarios pendientes |
| Escenas/envases/objetos faltantes | 6 fondos, 23 productos y piezas móviles, 133 exports/iconos activos | Galería y manifest; fuentes/prompts disponibles | Escenas estáticas, base/interior una imagen; registro leve P3 |
| Apertura solo carta | Caja/sello/tapa/sapo/cromo GSAP 1950ms, resultado inmediato postreceipt | Fases observadas + opacidad/imagen decodificada + browser/SQL | Arte ausente conserva DOM, no esperar animación para consultar |
| Confeti inexistente | Confeti DOM interno limitado por receipt, sin reduced-motion, cleanup | Descubrimiento/victoria/forja/bóveda, no replay por idioma/recarga | No confundir con partículas de combate o confeti Codex |
| HUD/revelación/arena/stock/plurales/objetivo/error | Fricción corregida, opciones de ensayo plegables, revelación solo tienda/cerrable, sprite/DOM alternativos | Capturas finales + 36 recorridos Chromium/WebKit | P3 escala/perspectiva; no cerrar WCAG o hardware |
| Recursos/textos rápidamente sustituibles | Paquete único por compilación, fuentes/rutas y código disponibles | Tema neutro cambiando marca/nombres/retrato/paleta, estado SQL idéntico | No activar material Harry Potter ni cambiar reglas; guía CONTENT-PACKS |
| Sites | Publicación completa aplazada por Enric | Respuesta «No tengo uno; termina y valida la versión local», A51 | Falta backend HTTPS/PG/Redis gratuito; no publicar solo frontend |

[Evidencia/comandos/límites](visual-production-2026-10-14/REPORT.md), [capturas actuales](visual-production-2026-10-14/GALERIA.md), [guion actualizado](visual-production-2026-10-14/MANUAL-ENRIC.md), [sustitución de temática](CONTENT-PACKS.md). La matriz nueva conserva la diferencia entre implementado, probado e investigación/observación pendientes. La auditoría y capturas anteriores siguen como baseline, sin presentar fotos antiguas como verificación del acabado nuevo.

**Respuestas actuales:** hay jugabilidad local de principio a fin; puedes comprar/abrir Sapos, comprar/asignar Grageas, forjar/equipar y canjear llave para bóveda; no canje de duplicados o apertura aparte de Grageas. Arte solicitado integrado con fuentes/animaciones disponibles; no rig/capas ficticios. Sites queda aplazado por infraestructura; el incremento mínimo para que Enric valide ya está disponible en http://127.0.0.1:5190/ mientras backend local siga activo.
