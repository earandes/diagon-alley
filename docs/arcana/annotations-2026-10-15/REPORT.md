# A59 · Lugares, preparación y descubrimientos

15 octubre2026. Implementación autorizada desde las16anotaciones de Enric. [Contrato previo](CONTRACT.md), [antes/después](GALLERY.md), [comercio](COMMERCE.md), [preparación/álbum](FORMATION.md). No publicación, despliegue o modificación de precios/pesos/partidas.

La revisión identifica una separación incorrecta entre el mundo pintado y la interacción: entrada opaca, fotos con recortes distintos encima del mismo fondo, gestión de equipo dentro del álbum y tiendas como pestañas. Se conserva React/Pixi/GSAP/servidor; se reorganiza el recorrido y se producen los recursos que faltaban. No hace falta otro motor o un vídeo de fondo.

## Respuesta a las16anotaciones

| Comentario | Cambio implementado y resultado |
|---|---|
|1 Entrada | Callejón completo, entrada como objeto y ambiente de luz/bruma/motas. El panel opaco se retira. Sin vídeo, audio automático o espera añadida. |
|2 Cabecera | Fondo único continuo para header/HUD/mapa. Una franja en escritorio, dos filas compactas en móvil; los nodos conservan su lienzo central completo. |
|3 Ajustes | Estuche con márgenes, tarjetas de idioma/mundo y medallones; texto dentro de sus marcos. Cierre por botón/Escape y foco. Corregido un header que interceptaba el cierre al probar la primera composición. |
|4 Personaje inicial | Preparación explícita con puestos vacíos antes de crear la run; se eligen copias propias disponibles. El kit real conserva Harry/Aprendiz, no se regalan otros personajes o se cambia catálogo. Dentro del mapa se reabre la preparación. |
|5 Nodos | Seis objetos regionales: varitas/hechizo, caldero, baúl, carta-retrato, invitación y máscara. Silueta/material/luz, marcas de disponible/visitado y nombres accesibles; grafo/seed/efecto intactos. |
|6 Sabores | Receta consultable desde un objeto: tarro→asignación→sabor activado. Desaparece la franja de details. Cuatro sabores desde receipts reales, sin otorgar por compra o consultar. |
|7 Equipo en álbum | Álbum de descubrimiento/consulta y cantidades; configuración de copias/varitas/escobas en preparación. Transferencias identifican al portador; equipar es una orden explícita persistente. |
|8 Tienda/cabecera | Rótulo interior y retorno al callejón; se retiran tabs y sello flotante. Selección/coste sobre peanas y mostrador. |
|9 Probabilidades | Libro ilustrado con retratos y porcentajes de la tabla activa; cerrar/Escape devuelve foco al libro. No son probabilidades nuevas o pintadas. |
|10 Compra | Ticket de latón con moneda, precio y compra explícitos. Stock/abrir permanecen separados del gasto. |
|11 Bóveda | Puerta, rueda/cerradura y llave con disponibilidad real. Sin llave, objetivo hacia jefe; con llave, confirmación/coste/receipt recuperable. Consultar botín o equipo no consume. |
|12 Callejón de tiendas | Tres fachadas pintadas propias hacia Dulcería/Ollivanders/Gringotts e interiores reales. Escritorio las muestra juntas; móvil recorre la calle con desplazamiento horizontal nativo, Tab y escaparate vecino. El mapa no incorpora scroll. |
|13 Icono de jefe | Máscara oscura regional en el objetivo de jefe, usando el mismo lenguaje del mapa. ARCANA conserva su propio paquete. |
|14 Localizaciones | Atlas con región actual jugable y bosque futuro no interactivo; acceso descubierto se distingue de campaña disponible. |
|15 Celebración | Cuatro recetas por rareza: foil crema/oro, hojas verdiazules, estrellas amatista, soles de oro;8/14/20/28partículas y halo/intensidad diferenciados, acotadas≤1800ms. Reducido/omisión no se celebran después ni se repite por idioma/swap. |
|16 Acciones de resultado | Álbum y continuación como objetos ilustrados con nombres, foco y targets; desaparece la pareja de botones rectangulares genéricos. |

## Arte y herramientas utilizadas

Skills locales `game-ui-ux`, `game-feel`, `redesign-existing-projects` y `local-magic-art`: composición responsive, foco/estados, feedback proporcional e integración visual. Herramientas: React/CSS, GSAP de apertura conservado, Pixi mapa/arena conservado, Playwright instalado en proyecto y MFLUX/MLX local offline. Sin dependencias nuevas, Motion+, API de pago, créditos, fuentes externas o vídeo descargado.

Seis SVG originales editables suman20,3KB; procedencia/manifiestos/estudio256/72/44px en [annotations-a59](../../../design/diagon-alley/annotations-a59/). Tres fachadas nuevas tienen maestros PNG768×1024, derivados WebP430×574 y total132.282bytes; modelo/versión/licencias/prompts/seeds/SHA/crops y selección por integrador en [storefronts](../../../design/diagon-alley/annotations-a59/storefronts/README.md). Primero se inspeccionó Dulcería antes de las otras dos. Los rótulos son HTML sobre bandas vacías, fuera del bitmap. No se presenta una composición CPU como captura del juego. MFLUX MIT y modelo Apache2.0 ya instalados A58; no se modifican aquellos personajes/maestros/logs. Ninguna inferencia ocurre en runtime. Las licencias del software no acreditan distribución de franquicia; esta entrega no se publica.

Paquete Diagon de presentación v3:165roles,126propios y39compartidos. Se añaden tres roles opcionales de fachadas; ARCANA usa sus puertas/interiores compatibles. IDs económicos, snapshots, probabilidades y configuración permanecen comunes.

## Estado, animación y recuperación

La elección de retratos es borrador local; solo iniciar/confirmar formación escribe mediante casos actuales. Equipar/quitar/transferir es una operación explícita independiente que permanece tras cerrar y recargar. No se promete que cerrar revierta equipo ya confirmado. PV/PM durante la expedición se leen del miembro o reserva guardados; no se aparenta curación por alternar copias.

Ambiente: seis motas, dos halos y bruma en CSS transform/opacity, sin loop JS; se omite con movimiento reducido, se pausa al ocultar documento o abrir modal. Los fondos no se regeneran. La celebración usa DOM/CSS/timer por receipt, con presupuesto y fin, sin WebGL nuevo. GSAP continúa después de persistir el resultado y Canvas2D conserva las24chispas de A58. No se calculan daño, rareza o premios en la presentación.

Navegación: `#/shop` es callejón, deep links interiores siguen válidos y recuperables. Pulsar navegación Callejón vuelve a los escaparates. Settings/consulta/cancelación no envían comandos. Toda confirmación económica conserva recuperación y misma key; errores no anuncian éxito.

## Verificación y evidencia

Baseline técnico aislado5240: ocho capturas anteriores, hashes de presentación/config y de todos los archivos de dominio/aplicación/infraestructura. Nunca se abrió, reinició o modificó la partida propietaria5194. Los comentarios/capturas de Enric son observaciones directas de apariencia/comprensión; los recorridos siguientes son técnicos, no una prueba moderada de retención.

- `npm test`:349/349; `npm run test:integration`:37/37 con PostgreSQL/Redis reales.
- `npm run typecheck` y `npm run build`: correctos. Se conserva el aviso de chunk mayor500kB, sin ocultarlo.
- Suite A59:16/16, ES/EN y Chromium/WebKit. Selección inicial vacía, un start-run, kit exacto, consulta/swap/idioma/recarga sin escribir, cuatro raridades normales/reducidas, entrada/retorno de tres tiendas, libretos y compra con precio real. La fixture de rarezas está etiquetada y no concede copias.
- QA visual de formación:26capturas1280/911/390 y texto200%, controles/folios con Escape/foco, equipo guardado/recargado y sin desbordamiento horizontal. [Detalle](FORMATION.md).
- Comercio:48capturas de interiores/libretos y10finales de fachadas, ES/EN/3tamaños. Tab alcanza las tres puertas en390px, rótulos y arquitectura completos, estado exacto y cero errores de página. [Revisión final](after-storefronts/REVIEW.md).

- Regresión histórica: 76 casos distintos correctos por cobertura consolidada. Primera corrida: 72/76; cuatro expectativas de recarga todavía buscaban la configuración en el álbum y se actualizaron al nuevo recorrido. Reejecución focal: 4/4, sin debilitar comprobaciones de estado o persistencia. No se afirma una corrida única 76/76.
- QA serial compilada: apertura 16, rediseño 16, PWA 12 y arte 4; resultados y huellas del artefacto en [QA final](qa/REPORT.md). Estas suites y las anteriores suman 140 casos de navegador distintos por cobertura consolidada; repeticiones y scripts exploratorios no se suman. Los 76 históricos preceden al último fix menor de Escape: no se atribuyen al hash final. Después del fix se ejecutan los 16 focales y 48 finales.
- Una comprobación adicional encontró un fallo real de Escape: cerrar Ajustes dentro de preparación cerraba también el diálogo padre. Se conserva la evidencia roja en `qa-pre-escape-fix/settings-escape.txt`; se detiene la propagación de cancelación y se añade la regresión en ambos idiomas/motores. El build y la QA se repiten después de esta corrección.

Los fallos de montaje del test (import JSON sin atributo, espera decode de lazy, URL relativa sin baseURL y comparador que incluía reloj) se distinguieron de fallos del juego. Las corridas A59 anteriores se conservan; no se suman como casos nuevos.

## Rendimiento y garantía de estado

Apertura compilada del artefacto final: desde Abrir hasta resultado, sin precalentamiento ni demora añadida. Chromium ES/EN: 60 FPS, máximo 16,8 ms, P95 16,8 ms y cero long tasks observadas, también en la fase previa a Abrir. WebKit ES/EN: 60,02–60,26 FPS, máximo 31–34 ms y P95 18–19 ms. [Tabla y trazas del build final](qa/REPORT.md). A59 conserva la corrección del tirón obtenida en A58; no se atribuye de nuevo esa mejora a este incremento.

Mapa compilado final en reposo, cinco segundos por tamaño/motor y seis motas CSS activas: Chromium 60 FPS, máximo 16,8 ms y P95 16,7 ms; WebKit 60,02–60,03 FPS, máximo 19–22 ms y P95 19 ms. Sin scroll del documento en 911×1079 y 390×844. Movimiento reducido retira el ambiente; el estado guardado permanece exactamente igual. [Perfiles reproducibles](qa/scene/profiles.json), obtenidos después de cerrar las otras suites. Es escritorio headless, no hardware móvil físico. WebKit no soporta la API Long Tasks; no se interpreta su ausencia como cero tareas.

Distribución compilada: **320 archivos, 14.463.337 bytes** sin comprimir, contando ambos paquetes y assets; no equivale a descarga inicial ni caché fría. Scanner de contenido correcto, I1 histórico excluido. Se conserva el aviso de chunk principal de 876,17 kB; particionar carga inicial queda como optimización posterior medida, no se oculta el aviso. [Log del scanner](build-scan-final.txt).

Se cotejan 59 archivos de autoridad/configuración con la línea base: sin cambios de bytes. Consulta, cambio de idioma/mundo y cancelación no conceden personajes, monedas o recompensas; equipamiento y compras siguen comandos actuales. [Comparación de autoridad](authority-check.json). La apertura Canvas2D/GSAP conserva su implementación A58.

## Pendientes de producto

La única copia inicial sigue siendo el kit actual. Un selector gratuito entre varios personajes iniciales necesitaría definir concesión/catálogo y no se introduce como cambio visual. La utilidad actual de otras copias es formar unidades propias y preparar su equipo; no se añade canje de duplicados.

Sugerencia siguiente: sesión real10–15min con tres objetivos, sin explicar soluciones: preparar una ruta, llegar a un primer combate y conseguir/abrir una rana; observar dudas sobre propios/temporales, sabor activado y motivo de siguiente compra. No se afirma retención por superar pruebas automáticas.

Regiones futuras, más habitantes y economías/recetas nuevas continúan en roadmap y requieren contenido/balance concreto. Esta entrega termina el recorrido visual actual, no fabrica otra campaña o probabilidades para hacerlo más adictivo. Hardware físico/lector hablado y aceptación estética del propietario siguen separados de estas pruebas de escritorio.
