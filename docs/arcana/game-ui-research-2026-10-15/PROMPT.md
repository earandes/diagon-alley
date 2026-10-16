# Prompt de ejecución posterior · ARCANA como juego ilustrado

> El mensaje posterior de Enric delegó la dirección y autorizó implementación. [Brief aplicado A57](../diagon-game-redesign-2026-10-15/PROMPT.md) y [resultado](../diagon-game-redesign-2026-10-15/REPORT.md). El prompt de abajo es la propuesta histórica; no se ejecutó literalmente su punto de espera por selección de muestra.

Preparado15/10/2026 a partir de la petición de Enric. **No ejecutado.** [Investigación y límites](REPORT.md). Copiar desde la siguiente línea para iniciar el encargo.

---

Actúa como director de arte de videojuegos, diseñador de interfaces de juego y desarrollador senior. Rediseña la presentación completa de ARCANA en este repositorio para que se experimente como un juego mágico ilustrado: escenarios, personajes, objetos, animaciones y efectos. Quiero cambios reales y recorridos conectados; una colección de componentes decorados no completa el encargo.

## 1. Contexto y fronteras

Lee AGENTS.md, docs/PRD.md completo, docs/DECISIONS.md, DESIGN.md, README, los informes A50/A52/A54/A55/A56, CONTENT-PACKS.md, REGIONS-ROADMAP.md y game-ui-research-2026-10-15/REPORT.md. Inspecciona código, fuentes de arte, manifests y paquetes instalados antes de decidir qué reutilizar.

Mi dirección actual es el mundo de Harry Potter: ambientación, materiales, objetos, ilustración y lenguaje visual deben responder a ella. El PRD mantiene folclore activo por A29; registra expresamente esta instrucción posterior y actualiza el contrato de presentación que corresponda. Conserva los IDs persistidos y separa el mapping de nombres/arte del catálogo y de las reglas. No reintroduzcas mecánicas históricas de I1 ni reescribas snapshots para cambiar de apariencia. Documenta la procedencia de los recursos; referencias visuales de otros juegos no son assets para copiar al repositorio o publicar.

Conserva React/TypeScript/Vite, PixiJS8, GSAP, Fastify, PostgreSQL/Redis, Clean Architecture y autoridad del servidor. No migres de motor. Respeta los cambios ajenos del checkout. No cambies economía, precios, probabilidades, recompensas, partidas o reglas de combate. No añadas regiones jugables, trueque o reglas para duplicados en este rediseño.

Solo herramientas gratuitas, instalación local cuando sea posible y ninguna API de pago, generación con créditos, Motion+, suscripción o instalación global. No publiques, despliegues o hagas push.

## 2. Herramientas con un trabajo concreto

Lee y utiliza las skills locales game-ui-ux, game-feel, pixijs-rendering, Impeccable y Redesign/Taste. Las guías de diseño web son apoyo para claridad/accesibilidad; la composición la dirige el diseño de juego. Omite defaults de marketing o generación de pago incompatibles.

- PixiJS para escenas, sprites y efectos; GSAP para secuencias; Motion libre para overlays DOM. No hagas que dos librerías animen la misma propiedad.
- Evalúa instalar localmente PixiJS Filters6, compatible con Pixi8, solo para efectos concretos medidos. Usa partículas nativas antes de añadir un emisor externo.
- Evalúa AssetPack para atlas/compresión si mejora el pipeline existente. Fija versiones y registra licencias; conserva manifests y fuentes originales.
- Usa Blender portable con tools/visual/blender.sh y su skill cuando produzcas escenas o renders; Krita/Inkscape son opciones para pintura/piezas. Los props geométricos simples no sustituyen un acabado ilustrado detallado.
- Penpot MCP es opcional para comparaciones editables. Comprueba conexión/compatibilidad real; no inventes que está instalado o que sus pantallas ya están integradas. Si falta, continúa con herramientas locales.
- Motion MCP gratuito puede consultar documentación. No actives sus funciones premium.
- Usa las herramientas de navegador disponibles y las suites locales para verificar. Respeta cualquier bloqueo de acceso y documenta el límite, sin sortearlo con otra tecnología. No presentes automatización como sesiones con personas.

## 3. Dirección visual y composición

Diseña un libro de aventuras mágico ilustrado que evolucione desde Teatro de alquimia: profundidad por capas, luz cálida, piedra, madera, papel, cuero, latón y cristal. Estudia referencias oficiales de Harry Potter: Magic Awakened para continuidad pictórica y objeto/carta/escenario, y Hogwarts Legacy para materiales e iluminación. No mezcles esos acabados sin una traducción coherente a nuestro juego2D.

El escenario ocupa la mayor parte de la pantalla. HUD pequeño y estable, acceso compacto a destinos, una acción primaria contextual por decisión. La ornamentación debe enmarcar las acciones y permitir reconocerlas, sin saturar el mapa.

Nada de apariencia de dashboard, formularios, pestañas de aplicación, filas de «guardar», checkboxes, textboxs o mosaicos de botones rectangulares como lenguaje visual principal. Conserva controles DOM semánticos bajo el arte, con nombres es/en y foco. Usa objetos tocables, cartas, bandejas, ranuras y sellos con estados claros. Arrastrar puede ser opcional; tocar/teclado debe permitir la misma acción.

Texto mínimo por defecto: nombres breves, cantidades, costes, estados críticos y errores. Ayuda y estadísticas a demanda. No ocultes un coste o una consecuencia irreversible para cumplir un objetivo de poco texto. Ningún texto funcional dentro de bitmaps.

**Idioma exclusivamente dentro de Ajustes.** Quita ES/EN de cabecera, nodos y cualquier otra vista. Un único emblema estable abre Ajustes como menú de juego; allí se elige Español/English y movimiento reducido. Cambiar idioma conserva vista, selección, operación y progreso. No añadas audio si no existe autorización específica; si ya existe, conserva activación explícita.

## 4. Diseña todas las pantallas como partes del mismo juego

1. Inicio: escena de entrada y acción clara para continuar/comenzar, con el estado real recuperado.
2. Mapa: tablero regional completo sin scroll ordinario, caminos legibles y nodos diferenciados por silueta, material y color. Conserva randomización autoritativa y ruta guardada. Una región jugable; futuras regiones solo documentadas.
3. Preparación: rivales, coste, formación y consumibles mediante assets. Duelo, Refugio, Cofre, Pacto, Encuentro y Jefe tienen una interacción visual propia, coherente con su mecánica existente.
4. Pactos/formación: retratos o figuras que se incorporan a peanas/atriles. Temporal y copia propia distinguibles por forma/emblema además de color, con explicación a demanda. No expulsar una copia propia para simular reclutamiento.
5. Arena: composición clara de ambos equipos, ataques con anticipación, trayectoria, impacto y recuperación. PV/PM/bufos vinculados al log real. Pausa/Auto/2x/omitir accesibles y compactos.
6. Recompensa/after-map: botín protagonista con cantidades y destino, estado nuevo/duplicado y siguiente acción real. Evita un informe textual que tape el tablero.
7. Bazar/apertura: mostrador con envases, stock/precio junto al objeto, selección y una confirmación inequívoca antes del gasto. Apertura con piezas coherentes, resultado confirmado y retorno directo a colección/ruta.
8. Cromodex/equipamiento: álbum o archivador material. Inspección de personaje y ranuras de varita/escoba; consulta por hover/foco/toque. Distingue instancias duplicadas y sus equipos. No prometas trueque o mejoras inexistentes.
9. Taller/bóveda: materiales sobre mesa y llave/cerradura como interacción. Costes, cancelación y resultado conservan los casos de uso actuales.
10. Misiones/progreso y Ajustes: mismo lenguaje visual; estados disponibles/futuros honestos, sin saldos o desbloqueos ficticios.

## 5. Producción de assets y movimiento

Produce primero una muestra completa en contexto: escenario por capas, un personaje, nodo, HUD, recompensa y Ajustes. Antes del lote, presenta tres composiciones comparables del mismo estado y una recomendación. Espera mi selección de la muestra para producir el lote y generalizar la dirección; este punto permite evaluar el diseño concreto, como exige la revisión previa de A49.

Usa arte existente que cumpla el objetivo o produce piezas locales reales. No simules ilustraciones detalladas con emojis, polígonos, cajas CSS o medallones repetidos. Un SVG es adecuado para iconografía vectorial diseñada; no lo presentes como una ilustración pintada o un rig. Si no alcanzas el acabado con los recursos gratuitos disponibles, identifica el asset concreto pendiente y muestra la limitación.

Para cada familia define perspectiva, luz, escala, silueta, encuadre, material y estados. Entrega fuente editable cuando exista, exportaciones runtime, alpha/recorte/pivote, dimensiones, autor/procedencia/licencia y manifest. No generes arte durante las aperturas.

El movimiento explica acciones: selección, incorporación a formación, descubrimiento, impacto, fabricación, botín y cambio de estado. Define por efecto disparador, duración, elementos, cancelación y versión estática. Evita flotación constante de todos los controles y partículas permanentes sin función. Detén tickers fuera de escena, al pausar, con pestaña oculta o al terminar. Movimiento reducido del sistema o propio elimina cámara/parallax/shake y conserva el mismo resultado legible. No flashes o esperas que bloqueen la siguiente decisión.

## 6. Integración y garantías

Después de elegir la muestra, implementa por recorridos completos y extiende el mismo sistema a todas las pantallas. Conserva la transacción de consumo/resultado/copia/receipt antes de animar éxito. Selección visual local inmediata; recompensa, saldo o equipamiento confirmado solo después de autoridad. Recarga, omisión, cambio de idioma y respuesta perdida recuperan el mismo resultado sin nuevo gasto. No regeneres rutas guardadas ni reclasifiques copias.

Conserva teclado, foco/devolución, consulta equivalente al hover, tamaños de interacción cómodos y semántica accesible. Rareza/estado/origen no dependen solo de color o sonido. Arte ausente, fallo WebGL/GSAP, offline y recuperación mantienen un recorrido operable. El tablero normal cabe en viewport; ayuda/lista alternativa con ampliación puede desplazarse para no recortar contenido.

## 7. Aceptación y entrega

- Captura antes/después en estados y tamaños comparables; distingue mock, implementación y partida de prueba.
- Verifica inicio → Pactos → formación → combate → recompensa → compra/apertura → equipamiento → jefe → bóveda, más cambio de idioma dentro de Ajustes. Ambos idiomas, teclado, viewport de escritorio y móvil emulado, reduced-motion propio/sistema, arte ausente y recuperación pertinente.
- Canvas requiere inspección visual más estado del juego; el árbol accesible solo no basta.
- Ejecuta typecheck/build, validadores de paquete y pruebas pertinentes del repositorio. Pruebas de dominio/transacción si se toca su frontera; no inventes resultados ni repitas conteos históricos como evidencia nueva.
- Mide transferencia inicial, carga bajo demanda y frames en el recorrido real. Objetivo existente60FPS y3–5MB iniciales; informa números, entorno y límites. No atribuyas emulación a móvil físico.
- Actualiza DESIGN.md con composición, familias de assets y coreografías; DECISIONS/PRD cuando corresponda, manteniendo Word históricos y distinción aprobado/propuesto/implementado/probado.
- Entrega capturas/vídeo, fuentes/manifests, herramientas realmente utilizadas y licencias, resultados y pendientes de arte/balance. No declares calidad final o aceptación humana por pasar tests.

El resultado debe permitir jugar y entender el siguiente paso a través del mundo y sus objetos. Cada pantalla tiene que pertenecer a ese mundo, incluidos sus estados de error y recuperación.
