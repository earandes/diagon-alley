# A63 · Cierre, arena y preparación contextual

16 octubre 2026. **Tres recorridos implementados en el repositorio y verificados técnicamente**, dentro de B01/B02/B03 de A62. No publicación, despliegue o push. Partida habitual no utilizada. Diversión, comprensión real y deseo de repetir requieren la sesión humana posterior.

## Qué cambia al jugar

1. **Jefe → cierre → usar botín → otra expedición.** El final tiene escena propia, con resultado y cantidades realmente confirmadas. Llave disponible lleva a Gringotts; rana poseída abre esa unidad sin monedas; equipo disponible lleva a preparación. El destino se actualiza tras usar el objeto. Otra expedición exige elegir copias y confirmar; 0/5 ya no domina al volver del jefe. Receipt/registro/procedencia siguen a demanda. Victoria repetida, derrota y empate se distinguen y no reciben premios inventados.
2. **Preparar → combate legible → desenlace → ruta/cierre.** Dos bandos simultáneos de 3–5 figuras y PV, actor/objetivo y cambios locales. PM/afinidad/equipo/registro en inspectores accesibles; Pausa/Auto/2x/Omitir agrupados, salida explícita y monedero plegado con saldo actual consultable. No «Victoria» o anuncio del ganador antes de terminar/omitir. El resultado económico continúa guardado antes del replay. Fixture 5×5 no es otra campaña.
3. **Comprar gragea → encontrar contexto → elegir portador → activar → sabor.** La tienda orienta hacia el combate real, sin elegir ramas o avanzar por sí sola. Una bandeja de tarros conduce a retratos de portadores; asignar/mover/quitar es borrador. Formación, equipo guardado y consumo confirmado se distinguen. Comparaciones de gear y Alquimia 2→3 usan reglas compartidas. Confirmar/cancelar permanecen visibles al desplegar objetos. El comando de combate actual consume una vez y guarda sabor/efecto.

[Antes/después y vídeos](GALLERY.md) · [Interacciones](INTERACTIONS.md) · [Preparación en detalle](PREPARATION.md) · [Animación](MOTION.md) · [Validación y matriz de estados](QA.md) · [Rendimiento](PERFORMANCE.md) · [Archivos e integridad](CHANGES.md).

## Evidencia principal

- 395 unitarios y 40 integraciones con PostgreSQL/Redis reales; build/tipos/skin y verificación de artefacto correctos.
- 16 casos A63 del compilado: primera/repetida, rana sin recompra, bóveda/cancelar, recuperación/recarga, nueva run y dos pestañas; ambos idiomas, mundos y motores. Refuerzo final de foco desde historial en la matriz 8 casos de cierre, separado en QA.
- 76 casos de regresión general correctos tras adaptar el harness a los chunks compilados. 6 recorridos de preparación compilada,16 de rediseño/swap,20 de comercio,20 de regresión PokéLike y 12 PWA correctos. Las suites se solapan; no se venden como un total de pruebas distintas.
- 36 casos focales de arena entre ambos packs; 72 comprobaciones geométricas y PNG de 3×3/5×3/5×5 × ES/EN × Chromium/WebKit ×1280×900/390×844/865×1079. Inspector ampliado admite scroll accesible; ningún actor se elimina para hacer caber la escena.
- 640 registros de combate idénticos antes/después de extraer las funciones compartidas de equipamiento; no cambio de reglas o balance.
- 16 casos de apertura y 2 perfiles completos de acciones nuevos. En WebKit, arena ordinaria pasa de 1560→900 px en escritorio y 2034→844 px en móvil, cerca de 60 FPS. Apertura en frío~60 FPS, sin longtasks observadas en Chromium; WebKit no soporta esa API. Arranque frío de arena Chromium conserva tareas largas: consta como límite, no como optimización demostrada.

Todos los números remiten a logs/JSON de esta carpeta, no a resultados históricos reutilizados como ejecución nueva. Los intentos intermedios fallidos siguen identificados; la matrizQA explica sus causas y la repetición pertinente. Capturas/vídeo documentan presentación; transacciones y recuperación se apoyan además en estado de servidor y pruebas reales.

## Qué se conserva

Diagon Alley/Harry Potter principal y ARCANA intercambiable, Teatro de alquimia, personajes/escenarios ilustrados existentes, idioma solo Ajustes, poco texto con detalles a demanda y una región. Sin nuevos assets, motor, dependencia, servicio de pago o audio. Fuentes/manifests/licencias existentes conservados. Precios, pesos, premios, estadísticas, afinidades, regeneración, acceso, catálogo/campaña y esquema SQL no cambian. Word y 378 archivos de evidenciaA62 intactos. IDs, snapshots y garantías económicas existentes se mantienen.

## Decisiones de ingeniería y correcciones

Proyección de cierre de lectura separa premio histórico de stock vigente. Proyección pública opcional de afinidades toma la misma configuración autoritativa y acepta contenido antiguo sin ese mapa. Comparadores usan `equipItem`, `equipmentBonuses` y aritmética extraída del motor, sin duplicar fórmulas o predecir victoria. Borrador de gragea se liga a jugador/run/revisión/nodo/versiones y conserva idioma/pack.

Se corrigieron foco WebKit mediante origen explícito, confirmación de nodo obsoleta por otra pestaña, borradores tras revisión real y barra de acciones que quedaba lejos al abrir consumibles. La comprobación visual y el ajuste se hicieron por recorrido, no como pantallas aisladas. [Ciclos](PROGRESS.md).

Herramientas aplicadas: Game UI/UX y Game Feel, Playwright local y su runner, inspección de canvas/DOM, capturas y perfiles. Impeccable en pasada final acotada de contexto/composición y detector local sobre los seis componentes principales: salida`[]`, que no sustituye la comprobación visual ni acredita comprensión humana. No se invoca una auditoría formal nueva de todas las pantallas. No se instalaron herramientas globales ni se utilizó generación con créditos.

## Límites y siguiente trabajo

La sesión humana sigue pendiente: comprobar si se entiende temporal/propio, la lectura actor/objetivo, cuándo consume una gragea y qué invita a repetir. No hay evidencia de retención o diversión. Sin prueba móvil física, lector hablado o certificaciónWCAG. Derrota/empate de cierre se comprueban mediante proyección/render localizado, no como desenlace nuevo de una partida humana o campaña alterada.

La comparaciónChromium de arena previa se invalidó por una ejecución accidental del sondeo; se conserva identificada y no se usa. La comparaciónWebKit y A62 siguen válidas. Ventanas de asentado incluyen polling; no son tiempos exactos del último frame. Bundle principal sigue~909 kB minificado y la arena Chromium tiene costes de inicialización; límites medidos en PERFORMANCE, sin esconderlos en otra pantalla.

Las alternativas de duplicados/XP/pity, nuevos enemigos/Pactos/regiones y balance siguen pendientes. No se cambiaron partidas económicas para ensayar propuestas. La siguiente decisión de producto será contrastar estos recorridos contigo antes de ampliar sistemas o regiones.
