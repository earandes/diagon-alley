# Contrato previo de interfaz ARCANA

11 octubre 2026 · Encargo A29/A30/A32. Preparación de la presentación posterior a kit/API; no acredita UI implementada ni convierte datos de prueba en balance aprobado.

## Contexto y lectura visual

Interfaz de expediciones y colección con pergamino legible, metal oscuro/latón y foco en la ruta; arena en dos columnas. La captura adjunta mide 1280×714: cabecera horizontal de ~45 px bajo navegador, tres grandes zonas con divisores dorados (izquierda ~30%, centro ~40%, derecha ~30%), protagonista/revelación central, preparación en columna derecha, CTA de alto contraste y cromos ordenados. Recursos oscuros con luz cálida, texto dorado/crema y marco de manuscrito. La referencia comprime textos y controles, depende de imágenes para identidad y mezcla acciones secundarias; no trasladar esa densidad a móvil.

La fuente normativa es el PRD, no sus nombres/personajes/dulces/chat o navegación. ARCANA prioriza mapa vertical y arena, con los cuatro accesos inferiores requeridos. Conservar relación de cabecera/escena/carta/equipo y contraste material; no copiar raster, recortarlo para assets ni integrar texto/personajes de la captura. Arte provisional original separado de texto funcional; mapa/arena en PixiJS v8, controles en DOM.

Skills leídas: `.agents/skills/taste-skill/SKILL.md` (lectura de brief, auditoría, legibilidad/performance; excluye UI densa/multi-step, por lo que no se aplican recetas de landing, installs o un hero de marketing), `.agents/skills/awesome-design-fantasy/SKILL.md` (tokens, componentes, estados y QA), `.agents/skills/image-to-code-skill/SKILL.md` (análisis de referencia: proporciones/tipo/color/componentes). A21/A28/coste cero y el encargo técnico prevalecen sobre sus defaults de generar imágenes pagadas/fuentes/dependencias. No producción por ImageGen. Mostrar sustitutos originales identificados; validar en contexto, sin presentar aprobación de arte.

## Tokens y fundamentos de ensayo

- Tipografía display: Georgia/serif de sistema, por contexto manuscrito/pergamino; cuerpo system-ui. Nada de fuente externa. Escala 12/14/16/20/24/32; cuerpo 16, leyendas mínimo 12 y labels funcionales >=14.
- Escena nocturna `#0d211f`, panel `#17322d`, tinta clara `#f4ead0`, muted `#c3bea9`, latón `#d8b86f`, tinta sobre latón `#18241e`, papel `#ead9b5`, tinta sobre papel `#332a1d`. Foco `#8be2d0`. Salud verde, rival rojo, PM azul con números/estado explícitos. Son tokens de ensayo, contraste debe medirse en render.
- Tema día por variables y tema noche; sistema inicialmente, ajuste explícito. Evitar cambios de tema entre vistas; papel sigue material dentro del mundo, no otro modo. No brillo/glow en todos los bordes.
- Espaciado 4/8/12/16/24/32; acciones principales >=44×44 como objetivo de comodidad. Capas scene 0, contenido 1, HUD/nav 10, diálogo 20. Radios 4/8/12; cartas rectangulares ornamentadas, no colecciones de pills.
- 320/390 móvil y 1280 escritorio; ancho de escena adaptado, nav safe-area, no scroll horizontal. Tipo/controles fuera de canvas; paneles amplios y una acción principal por estado.

## Anatomía y estados por componente

Mapa: header con Coronas/Esencia/idioma/ajustes; banqueta de equipo con PV/nivel/varita/escoba y sinergias calculadas por proyección de autoridad. Pergamino scroll vertical desde fila inicial inferior, aristas punteadas y seis tipos de nodos. Botones DOM equivalentes a cada nodo y lista accesible alternativa con mismos IDs/acciones; no un mapa de canvas sin acciones de teclado. Datos legales/alcanzables de núcleo/config, UI no decide progreso. Estado visitado/disponible/bloqueado por texto y forma además de color. Selección abre resumen explícito de coste y pide intención; error conserva partida y foco.

Arena: izquierda equipo, derecha rival, canal central de proyectiles, 3–5 peanas por columna. PV/PM/nivel/varita/consumible y bufos visibles/localizados. Animación reproduce BattleLog ya confirmado, sin engine/random en renderer. Auto/pausa/2x y omitir cambian solo reproducción; reduced motion muestra resultado estático equivalente. Resultado anuncia una vez y vuelve a ruta. Registro accesible de eventos; no repetir llamadas económicas por frame.

Cromodex: grid de cartas con rareza/filtros, candado/silueta y fichas con stats de snapshot/copia; incluir hallazgos propios fuera del catálogo vigente sin reclasificarlos. Copias distintas no son descubrimientos distintos. Equipar usa selección de IDs poseídos; gear usa instancias del inventario y muestra destino/transferencia. No imagen con textos horneados. Estrellas requieren configuración U25 y no se inventa una quinta rareza.

Bazar: precios/versiones y probabilidades de misma tabla suministrada por servidor, saldos confirmados, compra/cantidad/producto explícitos. Abrir un sapo identificado guarda consumo/entrega antes de romper sello y revelar carta GSAP. Omitir/recargar/idioma conservan resultado; no stock permite volver al álbum. Grageas se compran/guardan y se asignan antes del combate. Un save fallido no celebra premio.

Taller/Bóvedas: inspección de gear poseído/materiales y llaves confirmadas. Flujos de forja/canje necesitan recetas/costes/tablas explícitos pendientes; no simular compras/recompensas. Se deben conectar casos parametrizados cuando exista configuración, sin afirmar aceptación de entrega por una vista informativa.

Misiones: acceso requerido. No inventar recompensas/diarias/quests. Solo datos de progreso y objetivos definidos por configuración; reglas ausentes se identifican como pendientes. No crear concesión por entrar a esta pantalla.

Controles: default/hover/focus-visible/active/disabled/loading/error, label completo y causa de bloqueo. No spinner sin mensaje o acción duplicada mientras hay intención pendiente. Foco vuelve al origen al cerrar diálogo, cancelar conserva estado. Ambos idiomas antes de integrar cada componente.

## Recorrido, persistencia y recuperación

Inicial: sesión provisionada por autoridad, kit/estado/config cargados; cuenta real/registro U26 todavía sin método elegido. Cliente no pide o importa saldo del navegador. Controlador mantiene último estado confirmado y metadata de intención pendiente (playerId/key/request/versiones), persistida antes del POST. Si falla ese guardado no emitir gasto; fallo/401/offline no genera nueva key. Recuperar receipt propio antes de tratar saldos como definitivos; si faltó commit, reenviar la misma intención según error/confirmación pertinente. Cambio de cuenta no ejecuta intención de otro jugador.

Acciones: preparar selección/gear en Cromodex → iniciar run → elegir nodo → confirmar consumible/coste → recibir commit → reproducir/log/resultado → mapa/recompensas → Bazar/abrir → Cromodex. El kit conserva un aprendiz; transición productiva a tres sigue U25. Interfaz admite falta de formación y permite caminos configurados, sin conceder dos gratis. Selección/gear entre nodos mantienen HP/PM/reserva. Configuración cambiada exige mostrar y reconfirmar nueva versión antes de nuevo gasto, sin rehacer recibo confirmado.

Persistir solo preferencias e intención/reproducción local; SQL es autoridad de inventario/progreso. PWA puede guardar shell/assets, nunca aceptar operaciones económicas offline o saldo local como confiable. No secreto en bundle/capturas/URL. Arranque local para pruebas deberá distinguir cuenta/configuración de ensayo de registro de producto; no convertir fixture en catálogo final de 30.

## Recursos y contenido

Recursos previstos: pergamino/ornamentos/nodos/peanas/proyectiles y sellado de sapo originales, fuentes editables SVG/Canvas/CSS; retratos de folclore pendientes, sustitutos monograma/silueta/grabado identificados por manifest. La API debe seguir operando si falta arte o WebGL; lista/DOM ofrece acciones/resultados. Ningún recurso de captura o app histórica en nuevo public/build. Manifest con autor/herramienta/versión/fuente/dimensiones/función/estado/criterio de reemplazo.

Textos completos es/en, IDs comunes y formatos es-ES/en-US. Ejemplos: “Duelo Arcano · Consume 5 Esencia” / “Arcane Duel · Uses 5 Essence”; “Arte provisional” / “Provisional art”; “Recuperando la operación” / “Recovering the operation”. Códigos de errores se traducen, sin SQL/stack/jargon del renderer en flujo de producto. Audio solo elección explícita; no generación de recursos por apertura.

## Anti-patrones y migración

Retirar entrypoint/recursos históricos del artefacto cuando exista recorrido conectado; conservar fuentes/historia fuera de distribución. No transportar reglas de bienvenida/rangos/garantía antiguos. No interfaz con cálculo de daño/precio/azar/recompensa ni estados optimistas de premios. No serif pequeño en todo texto, cards dentro de cards, brillo infinito, chat/precios/arte final inventados o dependencias de imagen externas. Defaults marketing de skills no aprueban IA, scopes, gasto o capacidades nuevas.

## QA ejecutable y límites de aceptación

Unitarios de proyección/lectura de log/controlador e intención antes de implementación; integración de persistencia real de metadata según adapter y errores. Navegador Chromium/WebKit es/en con API+PG+Redis: recorrido, reload/respuesta perdida, otra pestaña, faltan stock/Esencia/formación, versión cambiada, keyboard/foco/200%, 320/390/desktop, reduced/omit/arte/WebGL ausente. Móvil físico/lector audible siguen evidencia distinta. Build scan de términos/arte, medición de assets iniciales <3–5 MB y FPS hacia 60 con entorno/dispositivo explícitos. No inferir autoridad o rendimiento por snapshot. El goal requiere todos los flujos/config del PRD; una fixture visual no lo completa.
