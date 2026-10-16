# A62 · Animación, respuesta, accesibilidad y rendimiento

15 octubre 2026. **Análisis y guion propuesto; ninguna animación o regla se implementa en A62.** Se aplican las skills locales Game Feel y Game UI/UX a los mecanismos existentes. Su recomendación genérica de sumar 5–8 canales por impacto no se adopta como regla: esta interfaz ilustrada necesita pocos canales que expliquen una consecuencia. Sin audio por defecto, flash de pantalla, shake general o hit-stop de la simulación.

## Evidencia y lectura

**C:** código actual inspeccionado. **H:** comprobación histórica A58/A60, no repetida por este especialista. **A62:** observación nueva, únicamente cuando se enlaza su archivo. **P:** propuesta experta, sin implementación o validación humana. Índice de SHA y archivos: [motion-source-index.json](evidence/motion-source-index.json). Las líneas indicadas corresponden a esa lectura.

Los recursos ya están divididos adecuadamente: GSAP caja/rana/carta; Canvas2D para 24 chispas; SVG/CSS para ornamentos de rareza; Pixi8 para mapa y replay; DOM semántico para controles y datos. Migrar de motor no resuelve las principales carencias de comunicación identificadas. El juego funciona sobre receipts y BattleLog guardados, separados del renderer; esa frontera debe conservarse.

## Hallazgos prioritarios

| ID | Evidencia → problema | Propuesta → efecto esperado → comprobación |
|---|---|---|
| M01, alta | **C:** `BattlePanel.tsx:225–235` construye un aviso con `combat.outcome` al principio del replay; `styles.css:868–873` solo le da formato. **A62:** [arena al entrar](evidence/captures/es-arena-duel-early-1280.png) dice «Resultado guardado: Victoria» con Ronda0/Eventos0de39. Desvela el resultado antes de representarlo. | **P:** aviso neutral de combate registrado arriba; resultado al terminar/omitir, con consulta inmediata voluntaria en registro. Conservar confirmación económica desde el inicio. Comprobar que el desenlace no aparece visualmente antes del final natural y que omitir/reducido muestran exactamente el mismo resultado. Hipótesis: conservará incertidumbre dramática, pendiente de sesión humana. |
| M02, alta | **C:** `pixi-scenes.ts:175–237` tiene proyectil, colisión y pequeño giro de golpe; los eventos curación, maná agotado y gragea no tienen receta visual propia. **A62:** [arena completa](evidence/captures/es-arena-duel-early-1280.png) se extiende1511px de alto a1280×900, con peanas de muchos renglones y navegación fija delante de la segunda fila. El panorama simultáneo se pierde antes de añadir más efectos. | **P:** primero arena compacta con3–5 figuras/medidores por lado y stats a demanda; después 2–3 canales por evento: sello en actor, cambio localizado del medidor y cifra breve. Sin listas permanentes. Revisar que actor, objetivo y tipo sean distinguibles sin color/sonido; captura/replay lento de todos los eventos y reducido estático. |
| M03, media | **C:** apertura usa la misma coreografía base para cuatro rarezas (`CardReveal.tsx:93–195`); escalado de rango al final por SVG/partículas (`RevealTheatre.tsx`, `celebration-model.ts`). Es coherente y finito, pero el clímax de rareza llega después del giro y no construye anticipación propia. | **P:** preparar la identidad del rango con grabado/silueta durante los últimos 300–450 ms del dorso; revelar retrato primero y sello de rango después. No aumentar la espera común ni prometer nueva rareza. Comparar cuatro animatics de idéntica duración base, sin cambiar sorteo/pesos. |
| M04, media | **C:** `NodeResult.tsx:145–165` dibuja todos los temporales del equipo al consultar un pacto, incluso al pasar; no identifica por delta al recién reclutado. `OperationFeedback.tsx:9–21` solo cubre compra/equipo/equipamiento. | **P:** delta de resultado por receipt: una carta entra al puesto concreto, o huella de «pasar» sin falso reclutamiento. Cofre desplaza solo recursos realmente entregados hacia HUD. Cancelar no produce feedback de éxito. Validar una llamada, un delta y un anuncio, con consulta posterior estática. |
| M05, media | **C:** `NodeResult.tsx:167–171` orienta desde victoria de jefe hacia localizaciones; la siguiente región sigue no jugable. **A62:** [después del jefe390](evidence/captures/es-19-after-map-390.png) muestra de protagonista otra preparación0/5; receipt del jefe queda colapsado abajo. Más celebración no aporta un siguiente propósito. | **P:** cierre breve que vincule llave→bóveda y botín→preparación de próxima ruta. Presentar región futura como horizonte, no acción disponible. Medir continuidad en sesión posterior, no inferirla de clics automatizados. |
| M06, baja | **C:** `BattlePanel.tsx:111–118` avanza eventos con timers y Pixi usa su propio elapsed/ticker (`pixi-scenes.ts:243–259`), sin reloj de replay compartido. | **P:** antes de añadir cámara/anticipaciones, caracterizar desfase de proyectil/medidor en pestaña oculta, pausa y 2x. No se ha reproducido un fallo actual; es riesgo de sincronía, no bug demostrado. |

## Partitura de la apertura actual

La apertura se monta únicamente después de `state.receipt` confirmado (`App.tsx:341–355`). `BuyAndOpenCocoaToadUseCase` guarda coste, consumo, copia y receipt en la misma transacción (`shop-use-cases.ts:154–225`). La presentación no participa en RNG, compra o saldo.

| Tiempo local GSAP | Acción actual | Lectura |
|---|---|---|
| 0–0,72 s | Caja se mueve ±2°, sube 7 px, cuatro tramos de 180 ms `sine.inOut`. | Anticipación material, finita. |
| 0,40–1,10 s | Anillo de carga escala 0,3→1,2, `power2.out`. | Halo tenue; no sustituye al objeto. |
| 0,55–0,80 s | Sello escala 1,35/sube/desaparece, 250 ms de pack. | Ruptura del cierre. |
| 0,80–1,25 s | Caja cerrada desaparece; base aparece; tapa sale 180 px arriba/75 lateral, 26°, 400 ms `power2.in`. | Secuencia DOM de piezas planas; no rig o física. |
| 1,10–2,60 s | Rana emerge con squash, 650 ms `back.out(1.3)`; cae 220 ms y escapa 550 ms. | Sujeto legible; desplazamiento grande queda dentro de escena/clip. |
| 2,15–3,30 s | Dorso sube/escala 650 ms `power3.out`, gira hasta 90° en 450 ms. | Puente entre rana y personaje. |
| 3,20–3,70 s | Retrato gira desde −90° en 500 ms `power2.out`; teatro aparece desde 3,10 s. | El personaje ocupa el clímax. |
| Tras fin | Grabados/rayos hasta 1,4 s; sello 600 ms, estrellas 650 ms con 160 ms de retraso. | Cola decorativa no bloquea Continuar. |

Estos tiempos no incluyen HTTP, import GSAP o decode. `holdMs:150` existe en pack pero no se usa en esta secuencia: no debe contarse como pausa aplicada. **H A60:** desde clic hasta resultado visible 4,41–4,44 s; hasta terminar magia 5,58–5,75 s en esos perfiles. Son medidas previas, no tiempos garantizados.

### Cuatro recetas y consistencia

| Rango | Código actual C | Mantener | Ajuste P |
|---|---|---|---|
| Común | Marfil/oro, 4 rayos, 1 órbita, 8 partículas foil; 720 ms con presupuesto actual. | Resultado digno, legible y rápido; no castigar visualmente el premio común. | Un destello material localizado, poca ornamentación. |
| Inusual | Verde agua, 8 rayos, 2 órbitas, 14 hojas; 960 ms. | Silueta/insignia distintas del común. | Giro ligero de hoja grabada en dorso; nada de confeti verde a pantalla completa. |
| Épico | Violeta, 12 rayos, 3 órbitas, 20 estrellas; 1200 ms. | Estrellas y emblema, además de color. | Alinear expansión con asentamiento del retrato y sello. |
| Legendario | Ámbar, 16 rayos, 3 órbitas + corona, 28 soles; 1500 ms. | Corona/forma y protagonista, sin nueva regla shiny. | Anticipación breve de corona en dorso y luz que enmarca, sin flash blanco ni más segundos obligatorios. |

`celebrationPreset` acota partículas al presupuesto y duración ≤1800 ms; `Celebration` solo estalla para descubrimiento nuevo en esta vista. Una copia repetida conserva aura/rango pero no confeti de descubrimiento. La distinción es correcta; todavía necesita una consecuencia útil propia para excedentes, fuera de este guion.

Omitir/Continuar/Escape conservan receipt; reducido muestra carta estática. `revealedMagic` y el historial de celebración evitan repetir el burst en el mismo runtime; cambiar idioma/tema no cambia la key. Tras recarga `GameController.load` recupera pendientes, pero no vuelve a abrir por defecto cualquier receipt viejo. No se afirma un historial persistente nuevo de animaciones.

## Guion propuesto por momento

Todos los tiempos siguientes son **candidatos de diseño**, no código aplicado. La anticipación visual nunca retrasa la validación económica. Sincronizar al evento de presentación confirmado cuando haya gasto. Capas: E escenario; O objeto/retrato; F efecto; H HUD/semántica.

| Momento/disparador | Anticipación → acción → reacción → cierre | Tiempo/easing/capas | Omitir, reducido y riesgo |
|---|---|---|---|
| Entrada, cuenta lista | Farol estable → puerta se abre ligeramente → luz invita → reposo. | 180–300 ms ease-out, E/O. | Acción inmediata disponible. Reducido puerta abierta estática. Evitar vídeo/autoplay o fondo completo por frame. |
| Selección de carta/puesto | Borde al foco → carta sube 3 px → sello de selección → reposo. | 120–180 ms ease-out, O/H. | No omisión necesaria; estado inmediato. Reducido solo sello. Evitar relayout de toda cuadrícula. |
| Preparación confirmada | Puestos completos visibles → sello une grupo → mapa enfoca origen → siguiente nodo. | 180–250 ms, O/H; después receipt de inicio. | No animar éxito antes de confirmar. Reducido corte directo. No autoseleccionar ni otorgar personajes. |
| Nodo disponible/foco | Doble borde/flecha → icono se eleva 2 px → tooltip breve si solicitado → quieto. | 120–160 ms, O/H. | Pulso de invitación actual solo dos ciclos de 900 ms; mantener finito. Reducido borde/flecha. |
| Viaje a nodo | Sendero existente → huella progresa a nodo confirmado → se marca visitado → próximo disponible. | 220–350 ms ease-in-out, F/H. | Saltable; estado final ya usable. No mover/generar grafo o bloquear mapa durante cola. |
| Abrir popup | Escena se atenúa → objeto entra con 8 px/escala 0,98 → acción principal resaltada → reposo. | 160–220 ms ease-out, O/H. | Escape/cancelar en todo momento antes de envío. Reducido instantáneo. No abrir varios focos activos. |
| Reclutar, receipt | Retrato/reloj → miniatura viaja al puesto → nuevo miembro asentado + anuncio → mapa. | 300–450 ms ease-out, O/H. | Omitible/no bloqueante. Reducido inserción y marco. No representar todos temporales como nuevos. |
| Pasar pacto/encuentro | Salida indicada → huella abandona objeto → ruta siguiente → reposo. | 150–220 ms, F/H. | Reducido marca visitado. No gloria o confeti de premio inexistente. |
| Abrir cofre, receipt | Tapa/llave visual → apertura → recursos entregados agrupados → contadores asentados. | 600–900 ms ease-out, O/F/H, como NODES/SCREENS. | Continuar inmediato y omisión; la cola no bloquea control. Reducido cofre abierto + delta. No partículas por unidad si premio grande. |
| Refugio PV o PM | Medidor del recurso a recuperar resaltado → onda pequeña → antes/después → reposo. | 300–450 ms ease-out, O/H. | Reducido cambio discreto + icono. No confundir curar con revivir ni anunciar PM a caídos. |
| Encuentro arriesgar, receipt | Objeto/sello incierto → revelación de efecto guardado → delta sobre afectados → mapa. | 350–550 ms, O/F/H. | Reducido resultado estático; omisión del relato visual. No sorteo cliente ni flechas que prometan siempre premio positivo. |
| Preparación jefe | Rival/siluetas visibles → señal de coste y equipo → comenzar explícito → arena. | 150–250 ms E/O; sin paso automático. | Datos consultables por foco/toque. Reducido estático. No tooltip obligatorio o cinco confirmaciones. |
| Inicio arena/log confirmado | Dos equipos en sus lados → entrada actual 350 ms → actor siguiente → batalla. | 250–350 ms ease-out O/H. | Omitir todo/Pausa/2x. Reducido final/log. Aviso neutral, sin spoiler obligatorio M01. |
| Hechizo | Sello actor 80–120 ms → proyectil 180–260 ms → impacto localizado/cifra → reposo. | ≤650 ms por evento normal, ease-out proyectil; O/F/H. | Sin hit-stop lógico. Reducido actor/objetivo/medidor estáticos o resultado final actual. Evitar colisión duplicada por CSS y Pixi. |
| Daño / fallo | Objetivo resaltado → golpe 50–80 ms o desvío → PV/cifra/marca fallo → disipación. | Reacción 120–200 ms ease-out, O/F/H. | Reducido icono + valor; no depender de temblor/color. No shake global ni parpadeo rojo repetitivo. |
| Curación / gragea | Icono del efecto actor → pequeño arco al medidor → PV o bufo cambia → sello queda mientras proceda. | 250–400 ms ease-out, F/H. | Reducido icono persistente mientras dure y cifra. Mostrar efecto desde BattleLog; no catálogo actualizado. |
| PM agotado | Sello PM sobre actor → proyectil ausente → marca de intento fallido → siguiente. | 180–250 ms, H/F. | No confundir con fallo por jabón. Reducido icono/texto corto. |
| Unidad caída | Medidor llega a cero → figura baja/opacidad 35% → marca caído → reposo. | 180–250 ms ease-out, O/H. | Reducido marca + pose final. Conservar nombre y no esconder peana. |
| Victoria / derrota | Último golpe resuelve → sello del desenlace → recursos/condición y objetivo → acción siguiente. | 350–650 ms; derrota sin confeti; O/F/H. | Omitible y reducido final. No esperar varios segundos para salir. |
| Compra grageas/equipo, receipt | Objeto/coste explícitos → señal de operación guardada → +unidad/−moneda y destino → reposo. | 150–220 ms ease-out, O/H. | Reducido delta estático; no éxito optimista. Compra+apertura rana usa secuencia anterior, no doble celebración. |
| Asignar gear, receipt | Pieza propia elegida → encaja en silueta → sello y stat diferencial a demanda → reposo. | 180–250 ms ease-out, O/H. | Cancelar selección conserva asignación; envío explícito. Reducido pieza+estado. No inventar bonus nuevos. |
| Forja, receipt | Receta/coste revisables → unión breve de madera/núcleo → pieza guardada → ofrecer equipar. | 450–700 ms, O/F/H. | Omisión y versión estática. Ninguna demora de guardado disfrazada de fabricación. |
| Bóveda, receipt | Llave válida/coste → giro/cerradura → botín confirmado → preparación relevante. | 500–800 ms ease-out, O/F/H. | Sin llave: cierre estático y ruta al jefe. Reducido puerta abierta + premio. No fingir canje hasta commit. |
| Error/incertidumbre | Acción bloqueada → sello de aviso discreto → causa/recuperación breve → estado verificado. | 100–160 ms fade, H. | Sin rebotes rojos ni mover foco de forma repetida. Recuperar misma key; nunca éxito/otra compra para “seguir”. |
| Regreso/recarga | Vista conservada → estado recuperado → resultado disponible → acción contextual. | Corte o 120 ms fade, H. | No repetir recompensas ni abrir modales históricos arbitrariamente. |

## Foco, semántica y legibilidad

**C positivo:** diálogos nativos; confirmación de nodo dirige foco a primera acción utilizable (`App.tsx:104–120`); Ajustes corta propagación de Escape (`GameSettings.tsx:48–55`); inspector de preparación hace lo mismo y devuelve foco (`ExpeditionPreparation.tsx:176–186,419–435`). HUD permite mouse/foco/toque y cierre por Escape (`TeamHud.tsx:59–112,159–189`). Nombres, rareza y estrellas tienen semántica fuera del bitmap. Resultados económicos solo postreceipt.

**Revisar en recorrido:** `CardReveal.tsx:212–215` previene Escape y llama onClose, pero no corta propagación; actualmente no está dentro de otro dialog de juego. No es bug demostrado, sí obligación al reutilizarlo anidado. Su heading de foco dice «Cromo confirmado» antes del giro; es confirmación correcta, pero anuncio de nuevo/repetido (`:37–44,291–293`) también ocurre antes del final. Propuesta: confirmar guardado al inicio y anunciar identidad/novedad al quedar visible/omitir; lector real pendiente.

**P sin añadir texto permanente:** todo asset de acción necesita nombre accesible, tooltip equivalente mediante foco/toque y estado seleccionado con forma/sello además de color. Errores/versiones/costes no deben ocultarse para lograr “cero texto”. En arte ausente `Artwork` devuelve null (`Artwork.tsx:17–19`): nombre/semántica siguen, pero algunos objetos pueden perder su silueta visible. Proponer fallback local de grabado corto, sin descargar ni generar arte en runtime.

**A62, geometría actual:** `geometry.json` registra el retrato de Harry del HUD en mapa390 a40×73px y summary del recibo de compra a134×36px. Quedan por debajo del objetivo de comodidad44×44 en una dimensión; no equivale por sí solo a incumplir WCAG. Proponer ancho/alto mínimo de44px manteniendo mapa central. Controles medidos detrás de un diálogo modal/inert no se atribuyen como objetivos disponibles pequeños. Arena inicial mide1511px de documento en1280×900 y1633px en390×844; resultado móvil1771–1804px según idioma. Son geometrías observadas, no necesidad de esconder contenido para aprobar no-scroll.

**A62, destino de grageas reproducido:** los complementos ES/EN compran una gragea y pulsan Preparar equipo; abre el diálogo de preparación del mapa con0asignadores `data-bean-unit`. Unidad/snapshot se conservan. [ObservaciónES](evidence/es-contextual-observations.json), [EN](evidence/en-contextual-observations.json), [destino390](evidence/captures/es-E03-bean-destination-390.png). Es un enlace funcional con un destino que no completa la acción específica; no se afirma que un jugador se haya confundido. El cambio propuesto debe conectar objeto→portador→próximo combate y comunicar el consumo al confirmar, sin activación automática.

## Rendimiento: qué está probado y qué falta

**H A58** eliminó el arranque Pixi/GlowFilter de apertura: pico Chromium anterior 216,7–233,2 ms, posterior 16,8 ms en su comparación; WebKit 35–37 ms final. No extrapolar causalidad al driver ni comparación directa con otra ventana histórica. **H A60** secuencia compilada completa, cuatro perfiles ES/EN×motores desde clic con HTTP: Chromium ~60 FPS, máximo 16,8 ms; WebKit ~60 FPS, máximo 30–32 ms; P95 16,7–19 ms. LongTaskAPI ausente en WebKit: array vacío no prueba ausencia de tareas largas. A60 idle mapa cuatro ventanas 5 s a 911×1079/390×844, sin overflow y unos 60 FPS. Arena A58 es harness cinco por lado, no un combate económico compilado. Fuentes: [A58](../illustrated-assets-2026-10-15/REPORT.md), [A60](../pokelike-2026-10-15/REPORT.md).

**C:** mapa/pausa/final detienen ticker (`pixi-scenes.ts:249–259`); geometría se conserva entre eventos. `FrogMagic` acota DPR a1,5, pausa al ocultar, termina en3200 ms y destruye observers/rAF. Ambiente usa CSS y pausa oculto; reducido no lo monta. `SceneCanvas` destruye renderer ante fallo/context loss y conserva DOM. Texto y tiempo de juego no dependen del render.

**Límites actuales:** chunk inicial A60 886,37 kB minificado/275,75 kB gzip; build dual 14,50 MB no es descarga inicial. No hay presupuesto automático por escena ni carga móvil real medida en esta revisión de código. Las capas de fondo con transparencias deben medirse sobre móvil antes de subir partículas/video. Reducido todavía puede crear el renderer estático de mapa/arena: “sin movimiento” no equivale a “sin WebGL”.

**Protocolo A62 / siguiente implementación:** perfiles nuevos seriales, sin generador IA/build/otros navegadores GPU en paralelo; medir desde antes del clic hasta cierre de cola visual; separar HTTP, decode, init renderer y animación; registrar CPU/motor/viewport/pack/caché, FPS medio/P95/frame máximo y longtasks donde exista API. Capturar normal/reducido, pausa/2x/omitir, paso oculto→visible, un recurso fallido y foco tras cierre. No afirmar móvil físico o WCAG completa con headless. Las mediciones nuevas que ejecute el coordinador se anexan por artefacto; no se reetiquetan estas cifras históricas como A62.

## Sondeo A62 ejecutado sobre preview congelado

Comando: `node docs/arcana/expert-review-2026-10-15/evidence/motion-a62-inspection.mjs`. Exit0, todas las cuentas/contextos nuevas; motores y fases seriales, sin modificar el build. [Script](evidence/motion-a62-inspection.mjs), [log](evidence/motion-current-run.txt), [datos completos](evidence/motion-current/profiles.json). El coordinador verificó [320 archivos compilados idénticos al A60 congelado y fuentes concordantes](evidence/artifact-verification.json). Vite **preview compilado**5350 + Fastify/PostgreSQL/Redis en namespace aislado. No cuenta5194 ni datos del propietario. El script nunca envía comandos económicos por API: todos nacen de controles UI; GET solo para contrastar estado.

| Escena actual A62 | Perfil | FPS | P95 | Frame máximo | Alcance |
|---|---|---:|---:|---:|---|
| Mapa idle | Chromium1280×900 /390×844 |60,00 /60,00|16,8 /16,7ms|16,8 /16,8ms|5s por tamaño, ES, ambiente activo.|
| Mapa idle | WebKit1280×900 /390×844 |60,19 /60,22|19 /18ms|19 /19ms|5s por tamaño, ES, escritorio emulado.|
| Comprar y abrir | ChromiumES /EN |60,00 /60,00|16,7 /16,7ms|16,8 /16,8ms|Dos contextos fríos separados, incluye transacción y cola completa.|
| Comprar y abrir | WebKitES /EN |59,89 /59,86|19 /19ms|36 /35ms|Dos contextos fríos separados, incluye transacción y cola completa.|

Resultado observado por polling a4560–4605ms desde marca anterior al clic; ventana registrada hasta confirmar todas las animaciones detenidas6449–6496ms. **Esta última cifra incluye holgura de polling**, no es un timestamp exacto del último frame decorativo ni una regresión de0,9s frente A60. Las muestras de frames cubren toda esa ventana, sin mover la espera a la compra ni precalentar la apertura en un mapa previo. Se anotan contextosCanvas/decode/longtasks desde navegación para detectar trabajo desplazado. Chromium no registró longtasks en las cuatro ventanas de mapa/apertura; WebKit no dispone de esa API, reporta null.

Cuatro aperturas normales fueron reales de cuentas nuevas:1POST buy-open por perfil, +1copia/−10monedas, snapshot exactamente igual tras cerrar/recargar. Raros obtenidos: común, inusual y legendario (dos); **no se ha forzado ni obtenido épico en este sondeo**. La comparación visual de los cuatro rangos completa sigue siendo H60 fixture, no cuatro sorteos ganados A62.

Se ejecutan además, por motor: mapa390×844 con fuente raíz200% sin overflow de documento; reducido elimina ambiente; Escape cierra inspector interior y luego preparación, con foco devuelto al control correspondiente y snapshot idéntico. [Captura200%](evidence/motion-current/chromium-map-font200.png). No es prueba de zoom nativo, teclado completo sin mouse o lector.

Fixture adversa declarada, contexto aparte por motor: bloquear todos los WebP por red + reducido. La apertura conserva nombre, marco, rango, estrellas y acciones sin retrato; [captura](evidence/motion-current/chromium-asset-failure-reduced.png). Se cierra con Escape, se pone offline sin recargar y se verifica compra deshabilitada/aviso; al reconectar recupera el mismo snapshot sin nueva copia/gasto. No es prueba de shell offline recargado ni respuesta perdida. Cero pageerrors observados en estos sondeos; recursos bloqueados producen fallos de red esperados. Todos los contextos y browsers se cierran en finally.
