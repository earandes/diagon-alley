# A62 · DIAGON ALLEY / ARCANA: revisión experta integral

15 octubre 2026 · **Análisis y propuestas; aplicación sin cambios.** [Galería](GALLERY.md) · [Tres mejoras y plan](NEXT-INCREMENT.md) · [Cobertura y reproducción](evidence/README.md).

El juego ya tiene un recorrido completo y una familia ilustrada que conviene conservar. Su principal oportunidad es **hacer que preparar, combatir y ganar algo formen una decisión continua**. Producir más retratos, regiones o efectos antes de resolver esa relación añadiría contenido sobre un bucle cuya profundidad todavía necesita demostrarse.

La recomendación es: **cerrar bien la expedición, convertir la arena en una escena legible y hacer contextual la preparación**. Después, diseñar ofertas y amenazas distintas en la misma región. Las afirmaciones sobre comprensión, diversión o ganas de volver son hipótesis expertas; no se han observado jugadores en A62.

## Qué se ha revisado y qué existe

Fuentes normativas: AGENTS, PRD1.0.29 completo, DECISIONS completo, DESIGN, README y contratos de ruta/combate/equipo/forja-bóveda/operaciones. Antecedentes A58 ilustraciones/rendimiento, A59 anotaciones, A60 PokéLike/comercio/balance, A61 contrato y registro. A61 solo contiene objetivo1 enviado y respuesta pendiente: **no hubo sesión humana completada ni tres mejoras derivadas de ella**. La petición actual permite este análisis y pospone esa sesión; no se reescriben antecedentes.

Stack real: React19/TypeScript/Vite, PixiJS8 y GSAP para presentación, Fastify/PostgreSQL/Redis para autoridad, IndexedDB para intención/recuperación de cliente. Motion está instalado; esta fase no lo integra ni añade dependencias. No aparece una limitación que justifique migrar de motor o stack.

Funcionan preparación explícita de copias, mapa ramificado aleatorio, seis nodos, temporales, formación/equipo, combate automático, premios, compra+apertura atómica, grageas activadas en combate, colección/sabores, forja, jefe, bóveda y otra expedición. No hay XP ganada, canje de duplicados, pity, misiones con premios reclamables ni segunda región jugable. El nivel1 y Bosque desbloqueable no acreditan esos sistemas.

Se recorrieron dos cuentas nuevas ES/EN sobre preview compilado5350 con servicios locales reales. No se operó el navegador ni la cuenta habitual5194. El artefacto compilado coincidía en320archivos con el A60 congelado y las fuentes activas concordaban. No se reejecutó build/typecheck/suite general porque no se implementó código; sus resultados históricos no se venden como nuevos. [Pruebas y límites](evidence/README.md), [42 condiciones](STATES.md).

## Hallazgos que cambian la prioridad

| Evidencia comprobada | Problema / interpretación experta | Cambio propuesto → resultado esperado → comprobación |
|---|---|---|
| [Arena evento0](evidence/captures/es-arena-duel-early-1280.png) anuncia Victoria; alto1511px con viewport900. Móvil1633px con844 | El desenlace se adelanta y los dos bandos no se perciben simultáneamente; estadísticas y nav compiten con figuras | Dos bandos/PV y detalles consultables; guardado neutral hasta resolución. Hipótesis: entender causa y mantener interés. Ver3–5 por lado, replay idéntico, foco/reducido/omisión y frames fríos |
| [Después del jefe](evidence/captures/es-19-after-map-1280.png): preparación0/5 domina; llave/rana en receipt secundario. Misiones sí enlaza bóveda | Se abre una tarea nueva antes de cerrar el logro; el botín pierde su uso inmediato | Cierre con llave→Gringotts, rana poseída→abrir, nueva ruta explícita. Comprobar primera/repetida, llave usada, consultas/recarga sin concesiones duplicadas |
| [Compra gragea→preparación](evidence/captures/es-E03-bean-destination-390.png), ES/EN:0asignadores en destino; sí los hay ante combate | “Preparar equipo” no lleva a la acción específica del consumible | Contexto compartido objeto→portador y próximo combate; sin activación/consumo al consultar. Ver compra→asignar→usar→sabor con mismo estado autoritativo |
| [Modelo real de dominio](PROGRESSION.md):500seeds,4585caminos, política segura sin compras gana todos; pactos idénticos y rivales ordinarios idénticos | La variedad espacial no produce suficiente diversidad táctica bajo esa política. **No es tasa humana ni prueba de aburrimiento** | Prototipar ofertas/amenazas contrastadas antes de XP o más poder. Comparar políticas/condiciones sobre mismos seeds; decidir reglas antes de aplicar |
| Forja: mismo precio/bonus por madera, multiplicadores1,2/1,15/1,1 sin compensación en motor | Dragón es una opción dominante, no tres especializaciones reales | Diseñar diferencias horizontales o simplificar propuesta; no cambiar recetas activas ahora. Comparar consecuencias concretas y documentar versión |
|29identidades sorteables con peso1 cada una; cada identidad3,448%, independientemente de rango | La tabla es coherente; el significado comercial de “legendario” puede crear expectativa distinta. Es cuestión de contrato, no bug del azar | Decidir qué significa rareza antes de tocar pesos; mantener probabilidades derivadas y snapshots. No dar por aprobado un ajuste |
| Primer jefe50+llave+rana; repetido5. Cofre siempre10+gragea | Repetir cofre puede resultar más atractivo que duelo2/jefe5; tras gastar primera llave no se obtiene otra por ese jefe | Revisar propósito de repetición y fuentes/sumideros en escenarios. No anunciar granja de llaves ni reducir botín por iniciativa |

## Dirección visual: conservar y componer mejor

Los fondos y30personajes pintados son una base consistente de Teatro de alquimia: luz ámbar, sombra violeta, papel, tela y latón. El inventario actual tiene165bindings,158archivos únicos y5,46MB de archivos referenciados, **no descarga inicial**.90exports son tres funciones por30personajes, no90personajes. [Inventario por rol](asset-inventory.json), [auditoría y especificaciones](ASSETS.md).

Conservar mapa central y medallones contrastados A60, fachadas/interiores, álbum como consulta, equipo en preparación, idiomas solo Ajustes, swap de presentación y rareza con emblema/estrellas/nombre. El mapa cabe sin scroll ordinario en los tamaños nuevos revisados. No necesita vídeo para parecer vivo; necesita jerarquía y consecuencias.

Retocar composición de arena, bóveda y cierre. En bóveda, eliminar en una implementación futura la competencia entre gran círculo CSS y puerta pintada; una cerradura y una llave como acción. Distinguir hoja-recurso de hoja-refresco, sacar el reloj temporal de un detalle de≈5px y separar sobre de Encuentro del sobre de Misiones. Corregir fondos/nav en pantallas largas sin ocultar contenido. Son propuestas concretas, no afirmaciones de confusión humana.

Se entregan **tres estudios anotados**, reutilizando assets actuales, rotulados como no implementados: [arena](proposals/art-arena.png), [bóveda](proposals/art-vault.png), [cierre](proposals/art-boss-closure.png). SVG editable y wrapperHTML junto a cadaPNG. Arena3vs3 todavía necesita resolver5vs5; bóveda propone encuadre de una puerta existente, no una puerta articulada de producción. No se llama “definitivo” al arte por estar integrado.

## Animación y rendimiento

La apertura caja→rana→carta ya es coherente y conserva al personaje como clímax; no hace falta sustituirla por un renderer pesado. Afinar anticipación del rango y asentamiento del sello, manteniendo base breve, cola decorativa no bloqueante y alternativa estática. Movimiento no decide recompensa: el resultado se confirma antes de animar. No se generaron nuevos assets de producción ni imágenes mediante servicios; las propuestas reutilizan arte existente.

Cuatro aperturas frías reales ES/EN×Chromium/WebKit: ~60FPS; máximo16,8ms Chromium y35–36ms WebKit. Resultado visible observado a4,56–4,61s desde antes del clic; ventana hasta asegurar cola detenida6,45–6,50s **incluye polling**, no duración exacta ni regresión frente A60. Cuatro perfiles de mapa5s rondan60FPS. Chromium no registró longtasks en esas ventanas; WebKit no ofrece esaAPI. No prueba móvil físico, arena cargada o rendimiento de todos los equipos. [Partitura de25momentos y medidas](MOTION.md).

Los nuevos perfiles no reproducen el gran tirón histórico de apertura. La oportunidad principal ahora es legibilidad/coreografía, conservando el pipeline A58. Sin una comparación idéntica no se promete mejora cuantificada. Pausa/omisión/reducido no pueden cambiar log, copia, coste o resultado.

## Progresión y economía: propuestas, no cambios

**Durante la ruta:** primero hacer visible la sinergia y efecto de gear/consumible. Después comparar dos ofertas tácticas y amenazas diferenciadas, o especializaciones temporales, con contrato/versionado propios. No añadir XP persistida para una región que el modelo ya permite vencer sin compras.

**Duplicados:** hoy son instancias formables/equipables; excedentes no tienen conversión. Modelo20.000ensayos:40aperturas producen18,11duplicados medios;80producen52,73. Completar29elegibles sin canje tiene mediana108 yP90160aperturas en este modelo. Canje ideal3:1 a faltante llevaP90a51: aceleración sustancial que exige proteger también copias en formación/equipadas, no solo última copia. No se implementa ni se elige ratio. [Supuestos, desfavorables y escenarios](PROGRESSION.md).

**Después del jefe:** botín→uso→otra intención usando reglas existentes. Más adelante, objetivos voluntarios de dominio o variantes de región, únicamente si cambian una decisión real. No diarios/rachas/monedas nuevas para fabricar interés. La economía actual y todos sus sumideros están documentados; no se cambió un precio, peso, premio ni partida habitual.

## PokéLike y herramientas

[Matriz de transferencia](REFERENCE.md) reutiliza observación técnica A60 dePokéLikev3.4.1: selección concreta, lectura de rutas, objeto→portador, preparación y consecuencia. Conservar nuestra pintura, mapa regional, autoridad y copias; no copiar pixelart/assets/código, precios, reembolsos o regiones. No se ganó su jefe ni se ejecutaron canjes/huevos en A60. No se vuelve al referente en A62 porque las propuestas no requieren resolver otra operación externa. Ayuda leída no equivale a mecánica ejecutada.

Herramientas usadas: guías locales Impeccable/context, Taste/redesign/Fantasy, GameUIUX, GameFeel, GameDesignWorkshop, AgencyGameDesigner/EconomyDesigner; simulador local GameDesignSkillsSuite y modelos específicos; PlaywrightTest1.64.0, Chromium/WebKit, Node24.20.0, inspección Pillow/SVG y capturas. Perfiles especializados se coordinaron y sus conclusiones se contrastaron con las mismas capturas/estado; consenso no es evidencia. No motor nuevo, instalación global, generación pagada,APIdeIA o Motion+.

Procedencia/licencias existentes: [.agents/skills/design-sources.json](../../../.agents/skills/design-sources.json), [tools/arcana/design-tools-sources.json](../../../tools/arcana/design-tools-sources.json), [registro A58](../illustrated-assets-2026-10-15/REPORT.md). No se añaden recursos externos; los SVG de propuesta reutilizan los mismos archivos y mantienen su procedencia. Licencias de herramientas/modelos no acreditan derechos de HarryPotter. Se conserva la incertidumbre T01 sin bloquear este análisis privado ni publicar. El contexto Impeccable conserva metadatos históricos desactualizados: se usa como guía, nunca como fuente del estado actual; PRD/código/capturas prevalecen.

## Entrega y siguiente decisión

| Entregable | Documento |
|---|---|
|Recorrido y decisiones|[JOURNEY](JOURNEY.md)|
|Todas las pantallas, capturas, componentes y aceptación|[SCREENS](SCREENS.md)|
|Seis nodos, bifurcaciones y reglas|[NODES](NODES.md)|
|Estados/adversos y evidencia ejecutada/histórica/pendiente|[STATES](STATES.md)|
|Arte/recursos, especificaciones e inventario|[ASSETS](ASSETS.md) +[JSON](asset-inventory.json)|
|Animación, reduced motion y medidas|[MOTION](MOTION.md)|
|Progresión, fuentes/sumideros y simulaciones|[PROGRESSION](PROGRESSION.md)|
|Comparativa PokéLike|[REFERENCE](REFERENCE.md)|
|Visuales actuales y propuestas anotadas|[GALLERY](GALLERY.md)|
|Impacto/esfuerzo/dependencias/evidencia|[BACKLOG](BACKLOG.md)|
|Tres mejoras y plan por recorridos completos|[NEXT-INCREMENT](NEXT-INCREMENT.md)|
|Preguntas para sesión posterior|[PLAYTEST-LATER](PLAYTEST-LATER.md)|

**Conservaría** familia ilustrada, mapa variable, preparación explícita, álbum de consulta, semántica y garantías de autoridad. **Cambiaría primero** cierre, arena y preparación contextual. **Simplificaría** stats permanentes, acciones de replay dispersas, superficies/puertas duplicadas y recomendaciones que confunden únicos con copias. **Diseñaría después** contrajuego/ofertas, excedentes y un motivo de dominio para repetir una región; luego ampliaría regiones. **Siguen siendo hipótesis** que esta jerarquía se comprenda mejor, que las nuevas decisiones resulten divertidas y que inviten a volver. Se comprueban con humanos posteriormente, sin convertir automatización o MonteCarlo en retención.

Esta fase termina con documentos y propuestas. No se ha implementado, publicado ni desplegado; [verificación de integridad](evidence/integrity.json) identifica los archivos protegidos comparados al cierre.
