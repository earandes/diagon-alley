# Movimiento, coreografía y audio

Revisión C de implementación y T de muestras previas. Las imágenes inspeccionadas solo prueban composición de fases seleccionadas. No se ha visto una reproducción nueva ni escuchado los WAV en esta fase.

## Sistema actual que conservar

React/DOM/CSS para controles y diálogos; PixiJS8.22.0 para escenas; GSAP3.15.0 para apertura; Motion14.2.0/mini para feedback; Canvas2D acotado en FrogMagic. Son versiones del manifiesto local, no una investigación de versiones últimas. No hay carencia que justifique añadir otro renderer o runtime.

`useBattlePlayback` y replay-clock comparten posición entre DOM y Canvas. `bossActorPose` es una muestra pura de ese progreso, no un reloj nuevo. En un spell del jefe: anticipación0–.18, extensión.18–.42, desplazamiento.42–.78, contacto/asentamiento.78–1. Configuración ordinaria eventMs650; a2x se modifica el avance, no se vuelve a calcular el combate. La caída depende de targetHp confirmado.

`SceneCanvas` carga módulo diferido, maneja pérdida de contexto y destruye recursos. Pixi limita resolución a2 y carga texturas con2 slots; no implica una cota global de memoria. `CardReveal` destruye timeline/context, conserva avance y atiende visibilidad; FrogMagic cancela rAF. Estas garantías deben comprobarse al tocar consumidores, no asumirse como prueba universal de ausencia de fugas.

**Corrección de la síntesis mecánica:** SceneAtmosphere instancia6 motas, pero CSS usa loops `infinite` de motas/niebla/faroles, con pausa por `data-running=false` y exclusión en reducido. La cantidad de nodos está acotada; la duración del ambiente no es finita. El término «motes finitos» de Assessment B se interpreta solo como número, no como duración. No recomendamos sumar nuevos loops.

## Momentos auditados

| Momento / disparador | Actual comprobado | Conservar o mejorar / reducido y limpieza |
| --- | --- | --- |
| Entrar/cambiar pantalla | Feedback DOM y escena conservada | Transición breve sin ocultar busy; no retraso artificial de red |
| Selección de copia/objeto | Motion/CSS finito | Encaje/sello, mantener foco y selección distintos; cancelar animation al desmontar |
| Trazar ruta/seleccionar nodo | route-ink280ms, node-settle220ms en motion-a69.css | U06 mejorar contraste de geometría antes que tiempo; reducido estado directo |
| Reclutamiento confirmado | Resultado desde receipt y movimiento de selección | Retrato del candidato al puesto si ambos visibles; no antes del commit ni al cambiar idioma |
| Refugio/encuentro | recordedNodeChanges con antes/después guardado o previo válido | Delta localizado520ms, no reconstruir % que receipt no demuestra; cantidad persistente disponible |
| Formación/sinergia | Emblemas/preview del modelo efectivo | Cambio corto de estandarte U07; no confeti por cada hover |
| Entrada jefe | Antesala propia y actor por piezas | Conservar, sin otra confirmación/intro obligatoria |
| Ataque | Reloj, trayectoria, gesto y contacto | Prioridad actor/objetivo; no iluminar diez unidades a la vez |
| Fallo | Miss de evento | Trayectoria que pasa al lado y etiqueta localizada; ningún daño supuesto |
| Daño | Contacto y delta/PV confirmado | PV reciente breve si no existe dato de escudo no inventarlo; efecto no tapa números |
| Curación | Evento/valor aplicado | Ascenso local y cambioPV, no llenar ficticiamente hasta máximo |
| Vínculo/gragea | Activación guardada | Símbolo junto a portador y efecto pertinente; intención sin activación no celebra |
| Caída | Condición confirmada | Asentamiento/silueta sin desaparecer la unidad o nombre; reducido estado claro |
| Resultado | Solo tras terminar/omitir | Hechos≤2 y premios reales; histórico no celebra de nuevo |
| Compra/forja/bóveda | Feedback de operación y resultado | Busy inmediato, coste explícito, objeto y receipt antes de efecto |
| Caja→rana→carta | GSAP por fases | Conservar continuidad y omisión; repetido menor intensidad; consulta posterior no repite |
| Rareza/encantado | Receta de apertura y capa específica | Distinguir descubrimiento/rareza/acabado; no nueva probabilidad o poder |
| Error/offline | Notice/OperationFeedback | No éxito si commit incierto; avisos persistentes cuando requieren acción |
| Ambiente/audio | CSS/WebAudio con visibilidad/consentimiento | No exclusivo para comunicar; estado off/blocked/unavailable claro |

## Fichas de coreografía propuestas

Todas P, orientativas, pendientes de muestra temporal en Linux. No añadir delays a operaciones del servidor.

| Secuencia | Anticipación → acción → contacto → resolución | Parámetros de ensayo / capas | Interrupción, reducido y aceptación |
| --- | --- | --- | --- |
| Elegir un plan | Indicar candidatos → estandarte cambia → sello sobre elegidos → valor estable |120–180ms ease-out, escala1→1.025→1; emblemaDOM/estandarte, sin partículas | Cambio inmediato si reducido; deseleccionar cancela; preview coincide con reglas |
| Consultar camino | Nodo enfocado → camino público se remarca → destino conserva señal → retirar énfasis |180–280ms, opacity local, doble trazo; sin ticker extra | Blur/cerrar revierte sin avanzar; touch/focus igual; ruta nunca cambia |
| Reclutar | Resultado confirmado → retrato se asienta en puesto → señal temporal → mapa |240–360ms, translate≤12px/scale.96→1; solo retrato/sello | Si destino fuera de pantalla, resultado estático; no animación espacial inventada; recarga no vuelve a otorgar |
| Contacto de hechizo | Preparar gesto → trayectoria al objetivo → impacto+delta → PV estable | Mantener fase.78 del reloj650ms; forma/color según perfil, amplitud local existente antes de ampliarla | Pausa congela,2x acelera,omitir salta; reduced muestra actor/objetivo/delta sin shake |
| Descubrimiento | Carta emerge → rostro protagonista → sello de rareza/identidad → dos destinos | Usar openingMotionRecipe actual1.8–3.8s, no añadir hold; nueva tiene6/10/16/24 chispas por rango, repetida4 | Omitir siempre; falloGSAP/arte resultadoDOM; histórico no anima por traducción |
| Cierre y siguiente intención | Resultado → premio confirmado → objeto pendiente → plan secundario |200–340ms asentamiento local; una jerarquía, sin trofeos nuevos | Sin repetir celebración histórica; intención no compra/equipa ni inicia run |

Apertura actual: factor nueva `1+rank*.08`, repetida`.62`, clamps40–1600ms por parámetro y duración total1.8–3.8s. Chispas y magicMs son receta de presentación, no probabilidad. Encantado añade sello/foil finitos; no agrandar todos los cromos para que parezcan especiales.

## Sonido auditado sin reproducción

16 WAV PCM16 mono24kHz. Ambiente24s; efectos.16–.36s. Inventario completo con hashes en audio-inventory.json. Composición procedural offline, no banda sonora de Harry Potter. Dos buses, consentimiento explícito y volúmenes; cuatro voces de efecto máximas y dos cargas que incluyen fetch+decode simultáneas. Se liberan efectos por pausa/ocultación/fin; pagehide dispone contexto y handlers se retiran al desmontar. No convertir el sonido en indicador único de actor o peligro.

**U17 es hipótesis:** un loop24s podría resultar repetitivo. No se ha escuchado para afirmar fatiga, clipping, identidad sonora o bucle audible. Antes de generar otro: escucha voluntaria de10min en altavoz/auriculares, medir picos/RMS sin confundirlos con loudness percibido, verificar costura y balance con ataque,pausa,2x/omisión. Revisar prioridad de cues bajo4 voces, sin acumular golpes al volver de pestaña oculta.

No producir música nueva, spatialaudio ni sonidos de menú por defecto. Si una muestra demuestra monotonía, ajustar primero mezcla/espaciado o una variación del material original con fuente y licencia registradas.

## Presupuestos futuros, no resultados actuales

| Indicador | Objetivo de ensayo | Cómo verificar / límite |
| --- | --- | --- |
| Fluidez sostenida |P95 rAF≤20ms en ventana declarada | Pares3por condición; conservar extremos. Actualmente no universal, ver VALIDATION |
| Feedback de gesto | Primera señal local≤100ms | Medir gesto→busy/selección; no autoridad completa ni tiempoGPU |
| Confirmación utilizable | Sin regresión frente referencia emparejada | Red+commit+carga+animación; errores/timeouts presentes; presupuesto absoluto tras baseline |
| Simultaneidad de énfasis |1acción principal+1reacción de objetivo; ambiente subordinado | Es jerarquía visual, no cuenta de todos los sprites; no ocultar unidades |
| Cargas de textura/audio | Mantener2 slots por subsistema, no aumentarlos por adorno | Medir conjunto simultáneo, no afirmar que son2cargas totales de aplicación |
| Recursos nuevos | Cero texturas de personajes/fondo para U01–U08; SVG editorial≤8KB si aprobado | Validación por bundle y contexto, no solo tamaño de fuente |
| Pausa/ocultación | Sin avance de reloj ni nuevos cues; evitar trabajo continuo innecesario | Evidencia temporal/contadores acotados y desmontaje; cero contador propio no prueba ausencia global de fuga |

Arranque frío, caché declarada, uso sostenido, omisión y desmontaje requieren ensayos separados. No sumar percentiles de fases ni desplazar la espera a la pantalla anterior para mejorar una cifra.
