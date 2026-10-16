# A62 · Los seis nodos y la decisión de ruta

15 octubre 2026. **Análisis y propuestas, sin implementación.** Se ha inspeccionado el código vigente y ejecutado una simulación independiente de dominio. La inspección visual actual y las capturas del coordinador se distinguen en SCREENS.md/JOURNEY.md; este documento no presenta un bot como jugador humano.

## Lo que existe realmente

La campaña tiene 16 eventos en 7 filas: 15 nodos ordinarios más jefe. En una ruta legal se resuelven **7 eventos**, no 16. Antes de la primera acción hay un marcador visual Inicio sin botón, fuera del grafo; el primer evento real sigue siendo un Pacto. Se empieza con 1 copia propia y se puede explorar con 1–5 integrantes; combate exige 3–5. Los dos pactos necesarios para formar tres son mecánica del ensayo, no dos cromos regalados.

Fuentes: `src/arcana/content/trial-v1.json:747`, `src/arcana/domain/exploration/randomize-route.ts:24`, `src/arcana/application/run-use-cases.ts:149`, `src/arcana/presentation/MapPanel.tsx:175`.

**No se vuelve a solicitar aleatorización ya implementada.** El generador permuta eventos completos y sus IDs, conservando premios/primeras victorias. Hay 350 secuencias de tipos distintas entre 4585 caminos de 500 semillas examinadas. La variación espacial existe; la diversidad táctica dentro de cada tipo es escasa.

## Lectura y estados comunes

| Condición | Implementado por código | Diagnóstico experto | Propuesta, no cambio activo |
|---|---|---|---|
| Disponible | Botón habilitado, doble marco/flecha, nombre accesible | Mejor que los iconos sueltos A59; necesita comparar el beneficio de destinos antes de abrirlos | Al foco/toque de un destino, usar un único atril contextual: retrato/objeto + coste/riesgo + consecuencia; mantener el resto del mapa visible |
| Bloqueado | Botón deshabilitado y estado accesible | Ver todo el futuro puede ayudar a planificar; a tamaño pequeño muchos medallones se parecen | Dejar la silueta reconocible pero reducir detalle interior; no confundir opacidad con contenido inexistente |
| Visitado | Deshabilitado y ✓ | Estado correcto; Inicio no debe parecer otro premio | Mantener marca ✓ y camino ya trazado; no reabrir un comando gastado |
| Seleccionado | Diálogo contextual, cancelación independiente | La composición cambió en A60; cualquier juicio de tamaño debe remitirse a las capturas actuales | Conservar consultas reversibles y usar una sola acción de gasto cuando la decisión ya esté hecha |
| Lista equivalente | Misma función de botones e IDs que el mapa | Acción equivalente existe; botones deshabilitados no siempre se recorren con Tab | Mantener lectura de todo el itinerario para teclado/lector y no ocultar estados en información solo hover |

Fuente: `MapPanel.tsx:67–115`, `NodePreparation.tsx:60`, `App.tsx:405`. El análisis de accesibilidad visual no equivale a certificación WCAG.

## 1 · Pacto

**Fantasía y función:** incorporar un acompañante durante la expedición. Asset activo: carta/retrato; sello de reloj temporal. Input: abrir nodo→Reclutar/Pasar; con cinco integrantes, escoger un temporal a reemplazar. Output: nuevo `RunMember(source:'temporary')`; jamás una copia en colección.

**Reglas comprobadas:** pasar requiere al menos 3 miembros; reclutar sin espacio falla; solo se reemplazan temporales y solo con equipo de 5; no se expulsa silenciosamente una copia propia. Un mismo personaje puede aparecer en varias instancias porque cada pacto tiene ID de unidad distinto. Todos los pactos activos ofrecen el mismo `rune-weaver`, mismo 90 PV/40 PM/poder 10/velocidad 7/Alquimia, proyectado en HP como el mismo personaje. Fuentes: `run-use-cases.ts:337–352`, `trial-configuration.ts:71–80`, `trial-v1.json:1033`.

**Decisión actual:** al principio reclutar es casi obligatorio para acceder al combate; con equipo lleno se decide a quién retirar. No se elige entre personalidades/roles distintos. Dar apariencia de oferta variada sin variar la unidad sería engañoso.

**Problema prioritario N01 (P1, hecho + interpretación):** los primeros reclutas producen cantidad, no especialización, y la triple Alquimia activa curación 3 por acción. Es un onboarding seguro potencial, pero no una curva de decisiones rica. El modelo de combate ganó todos los caminos bajo una política trivial; no demuestra diversión ni dificultad para humanos.

**Propuesta sin reglas nuevas:** junto al retrato, medallón de duración y espacio del equipo al que irá; transición del retrato al puesto concreto y breve resaltado del reloj. Si el jugador consulta la ayuda, “Solo esta expedición / This expedition only”. No repetir un párrafo permanente. Pasar y cancelar deben diferenciarse: pasar consume el avance; cancelar no visita nada.

**Propuesta de contenido futura:** dos perfiles ofrecidos con afinidades complementarias, por ejemplo apoyo o protección frente a daño/iniciativa; elegir 1 y descartar otro. Requiere nuevo plan versionado/ofertas autoritativas, balance y protección de recuperación; no es un retoque de asset y no se aplica ahora.

**Aceptación futura:** tras reclutar, miembros+1 y copias/saldos sin cambios; mismo personaje no se anuncia como nuevo descubrimiento; recarga conserva origen. Con 5 propios se ofrece pasar y motivo breve, sin selector vacío como acción obligatoria. En ES/EN/teclado/cancelación.

## 2 · Duelo

**Función:** cambiar condición del equipo y convertir preparación en resultado. Asset: varitas/hechizo; coste de 5 energía. Diálogo muestra tres rivales, sus PV/poder y recompensa efectiva; consumibles se asignan antes del comando.

**Reglas comprobadas:** autoridad calcula combate determinista por seed, conserva PV/PM residuales, gasta grageas asignadas y 5 energía incluso al perder; victoria primera por `levelId+campaignVersion` da 20 monedas +1 gragea, repetida 2 sin botín. Rival gana→run lost; empate→draw. No hay XP ni variación de nivel: todos comienzan nivel 1. Fuentes: `run-use-cases.ts:257–321`, `rewards.ts:26`, `trial-configuration.ts:44–54`.

**Decisión actual:** combatir o tomar otro camino, gastar gragea o reservarla, ajustar formación/equipo. Durante reproducción no hay decisión de hechizos: pausa/2× son controles de presentación y no modifican resultado.

**Problema N02 (P1):** cuatro nodos ordinarios tienen exactamente tres rivales de 25 PV/30 PM/poder 3/velocidad 3, neutrales. Retratos de rivales diferentes no crean estrategias distintas. Además, la vista previa expone PV/poder pero no comunica velocidad/afinidad del rival en el mismo nivel de lectura; el jugador puede atribuir dificultad a la ilustración.

**Propuesta:** un sello de encuentro reconocible (por ejemplo emboscada/resistencia, solo cuando la regla exista), rival principal y dos siluetas auxiliares, vista previa del equipo propio enfrente. Conservar 5 visible y un único “Iniciar duelo”. Mostrar solo acciones que ayudan: preparar y asignar gragea, no abrir varias fichas sin contexto.

**Diseño futuro pendiente:** al menos tres composiciones de rivales con contrajuego distinto dentro de la región. Sin subir todos los PV por igual. Comparar Alquimia/Fuego/Sombras, orden y consumibles contra esas composiciones antes de introducir XP.

**Aceptación:** el jugador puede consultar sin gasto; abrir/cerrar/reordenar idioma no crea combate; confirmar genera un receipt, una extracción de energía y las grageas asignadas; no hay acceso a duelo con menos 3. Verificar primera/repetida y resultado tanto favorable como adverso.

## 3 · Refugio

**Función:** elegir reparación de PV frente a PM. Asset: caldero. Dos objetos PV/PM y previsualización por personaje.

**Reglas:** recuperar 40% del máximo PV hasta el tope, incluyendo unidad a 0 PV; enfoque recupera 40% PM solo a unidades en pie. No cuesta energía ni monedas. No afecta reservas retiradas de la formación. `run-use-cases.ts:322–335`, `run.ts:127–136`.

**Decisión real:** sí existe coste de oportunidad; PV y PM no se recuperan a la vez. Sin embargo, con 40 PM, coste 1 por hechizo, rivales débiles y curación pasiva, la elección puede quedar resuelta de antemano. El modelo termina con mínimo 60 PM agregados sin usar enfoque; esto no prueba que nunca sea útil en otras composiciones.

**Problema N03 (P2):** elegir 40% PV cuando todo está lleno produce un evento sin efecto. Un valor “0→40” comunica resurrección, pero falta jerarquía que la vuelva visible frente a miniaturas repetidas.

**Propuesta:** dos recipientes contrastados y barras del antes/después sobre los mismos retratos; agrupar aliados sin cambio, expandibles. Si todos están al máximo, indicar efecto 0 y permitir confirmar/pasar según regla vigente, sin inventar compensación. El futuro “entrenar en lugar de curar” sería una regla nueva, no solución visual.

**Aceptación:** previsualización coincide con receipt y redondeo real; unidad 0 PV revive al curar y no recupera PM al enfocar; cancelar conserva exacto estado; se distinguen PM de energía general.

## 4 · Cofre

**Función:** recompensa segura a cambio de elegir esa rama. Asset: baúl, loot visible y “Abrir cofre”.

**Reglas:**10 monedas +1 gragea por visita, también en nuevas runs sobre el mismo ID; no tiene reducción 10% de combate ni primera-victoria. No hay riesgo, coste de llave o sorteo en este cofre. `run-use-cases.ts:336`, `trial-v1.json:1014`.

**Decisión:** se toma frente a recuperación/reclutamiento/riesgo/duelo. Dentro del popup no existe una segunda elección; solo aceptar avance o cancelar consulta.

**Problema N04 (P1):** el cofre sigue siendo fuente completa tras agotar recompensas de combate. Frente a duelo repetido de 2 monedas, cofre 10+gragea puede dominar por seguridad, energía y botín. Es una asimetría real, no un fallo transaccional.

**Propuesta de presentación:** mantener consulta y acción explícita, pero resolver en el mundo: abrir tapa→objetos salen→monedas al HUD y gragea a puesto visible, 600–900 ms omitibles. No nuevo modal de “Aceptar” después. Recompensa almacenada antes de animar.

**Decisión de balance pendiente:** conservar fuentes distintas conscientemente o versionar recompensa repetida del cofre; no aplicar descuento como supuesto fix. Medir frecuencia de rutas con cofre y decisiones a PV bajo antes de ajustar.

**Aceptación:** una visita→10+1 en un comando; consultar/cancelar 0; no coste de llave; recompensa se encuentra en preparación aunque no se vea “bolsa”. Repetir key no repite botín; idioma/recarga tampoco.

## 5 · Encuentro

**Función:** aceptar incertidumbre o pasar. Asset: invitación/sobre. Hay decisión arriesgar/pasar y ayuda breve.

**Reglas de ensayo:** tres opciones peso 1 cada una: 10 monedas, cura 10% PV máximos o daño 10% PV máximos. Daño no mata arbitrariamente: resta por unidad y puede cerrar la run si nadie sigue en pie. Curación puede levantar unidades a 0. Pasar avanza sin efecto ni sorteo. Narrativa/efecto/PV antes-después se congelan en receipt; no se consulta relato actualizado para rehacer premio. `trial-v1.json:952`, `run-use-cases.ts:353–363`, `encounters.ts:70–104`.

**Decisión:** riesgo condicionado por la salud. Con PV lleno, la curación se desperdicia; con PV al 10% puede ser terminal. No reducirlo a “50/50 bueno/malo”: hay tres resultados y magnitudes dependientes del estado.

**Problema N05 (P1):** el sobre solo promete sorpresa; la ayuda genérica no permite estimar la consecuencia de forma visual. Dos encuentros de la región comparten exactamente la misma tabla; más sobres no aumentan diversidad de historias/reglas.

**Propuesta:** antes de confirmar, tres medallones moneda/PV+/espina PV−, ayuda consultable con probabilidades exactas derivadas; aviso de riesgo extremo junto a retratos afectados si el estado hace posible perder. No mostrar ganador antes de comprometer. Tras resolver, pequeña viñeta ambiental con antes/después y texto narrativo opcional, sin un bloque obligatorio.

**Alternativa futura:** elección conocida entre dos consecuencias con sacrificio (“reparar a un aliado a cambio de energía”, etc.), solo como nuevo diseño a simular; no atribuirlo a la invitación actual.

**Aceptación:** pasar no adquiere seed; riesgo genera una resolución guardada; consultar tabla no cambia azar; recarga conserva historia es/en. Si daño puede acabar la run, la previsualización no dice “seguro”.

## 6 · Jefe

**Función:** cerrar la expedición y probar la preparación acumulada. Asset: máscara con perfil dominante; tres rivales de 80 PV/40 PM/poder 6/velocidad 5. Entrada con coste 5 y botín efectivo.

**Reglas:** primera victoria 50 monedas +1 llave +1 rana; `won` y desbloqueo `bosque`. Repetición 5 monedas, sin otra llave/rana. Bosque es marcador futuro, **no ruta nueva**. Derrota/empate cierran la run; una nueva puede iniciarse sin borrar colección. `run-use-cases.ts:309–321`, `trial-v1.json:1007`, `JourneyCabinet.tsx:92`.

**Decisión:** preparación y oportunidad de gastar consumibles. La dificultad sube respecto al rival normal, pero sigue sin identidad mecánica propia o patrón de jefe diferenciado: usa el mismo motor y tres unidades neutrales iguales.

**Problema N06 (P1):** la captura actual [después del jefe](evidence/captures/es-19-after-map-1280.png) muestra la preparación vacía 0/5 como elemento dominante y el botín reducido a una tira inferior colapsada. En el cuerpo consultable, `NodeResult` enlaza “localización desbloqueada”, pero Bosque aún no es jugable. **Sí existe un destino correcto** en [Misiones con llave](evidence/captures/es-21-missions-after-boss-1280.png): “Abre la bóveda”. No falta ese enlace en todo el producto; falta darle protagonismo en el cierre donde se ganó la llave. Repetir jefe no vuelve a concederla, por lo que anunciar “consigue otra llave” tras agotarlo sería falso.

**Propuesta sin economía nueva:** pantalla de cierre compacta con huellas de ruta, equipo superviviente y recompensas accionables: llave→bóveda; rana→abrir unidad; gragea→preparar; tras usarlas, nueva expedición con propósito apoyado en una mecánica actual. Una acción principal dependiente de inventario; secundarias contextuales, no botones idénticos. Bosque futuro en atlas, sin ser el único “siguiente”.

**Propuesta futura:** jefe con una amenaza legible y contrajuego (“actúa antes”, “desgasta PM”…) tras definir reglas. Antes de doblar PV, probar si el jugador puede explicar por qué su preparación cambió el desenlace. No prometer otra región.

**Aceptación:** primer jefe→1 llave/1 rana; repetido→0; derrota→consecuencia y opción de preparar sin concesión; recarga recupera resultado; abrir recompensa consume unidad ganada sin recobro; bóveda se alcanza y después existe retorno a preparación.

## Diagnóstico de bifurcaciones

Ejecutado `node docs/arcana/expert-review-2026-10-15/evidence/gameplay-model.mjs` con el generador y motor actuales, semillas 0–499, SHA de configuración en JSON. Por grafo hay 4–24 caminos, media 9,17. Se cuentan 314 de 2470 bifurcaciones con todas las salidas del mismo tipo (12,71%); no significa que todos esos caminos sean equivalentes: pueden abrir futuros distintos. La afirmación comprobada es más estrecha: el beneficio inmediato del tipo es el mismo, y los planes de rivales/reclutas no cambian internamente.

5030 de 7500 nodos con continuación tienen un único siguiente (67,07%). 690 de 4585 caminos no tocan un duelo ordinario; sí incluyen jefe. Esto permite evitar combates, no demuestra por sí solo un error: puede ser una estrategia de exploración válida. Lo que falta es una consecuencia visible y contrastada de elegir seguridad frente a desafío.

**Orden recomendado:** comunicar consecuencias y cierre→diversificar ofertas/amenazas con reglas versionadas→calibrar riesgo/recompensa→recién entonces XP u otra progresión. No ampliar regiones para tapar una región con demasiadas decisiones equivalentes.

## Cotejo con el recorrido gráfico actual

El coordinador recorrió dos cuentas técnicas aisladas ES/EN con los seis tipos y terminó jefe→bóveda→forja→equipamiento→nueva expedición. [Rutas ES](evidence/es-chosen-route.json), [rutas EN](evidence/en-chosen-route.json), [log ES](evidence/es-journey-log.json) y [log EN](evidence/en-journey-log.json). El itinerario se escogió consultando el grafo real para cubrir tipos, no a ciegas como un jugador novel. No hubo errores de página en esos logs. Eso demuestra operabilidad de ese recorrido; no elimina los problemas de jerarquía, equivalencia o motivación.

La [preparación activa](evidence/captures/es-18-preparation-active-1280.png) confirma dos retratos temporales del mismo personaje, reloj y texto “Solo esta ruta”; la distinción ya existe. Mejorarla debe reforzar la consecuencia visual y evitar introducir una explicación redundante permanente. La pantalla de cierre confirma el salto a selección vacía, sin concesión o pérdida de copias: es un cambio de presentación posterior a la victoria.
