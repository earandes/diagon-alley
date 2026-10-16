# ARCANA · Investigación para una interfaz de juego

> Continuación posterior del mismo día: Enric autorizó diseño, assets e implementación en un goal con subagentes. [A57 implementado y verificado](../diagon-game-redesign-2026-10-15/REPORT.md). Este documento conserva el alcance y los límites de la fase de investigación anterior.

15 octubre 2026. Entrega de investigación, análisis y prompt; **no se ejecuta el rediseño**. [Prompt preparado](PROMPT.md).

## Recomendación

Diseñar ARCANA alrededor de escenas, personajes y objetos manipulables: mapa regional como tablero, formación como grupo de magos, colección como álbum, compra/apertura sobre un mostrador, equipamiento sobre el personaje y recompensas sobre el escenario. Un HUD pequeño acompaña esas escenas. Idioma y movimiento reducido viven dentro de Ajustes, accesible con un único emblema estable.

El repositorio ya tiene una base técnica suficiente. Añadiría de forma selectiva **PixiJS Filters y AssetPack** para efectos y preparación de recursos. **Penpot MCP** es la opción adicional más interesante para trabajar composiciones editables; es opcional. Aprovecharía las skills y Blender locales antes de instalar más herramientas equivalentes.

La hipótesis principal es que la sensación de aplicación procede de la composición y de las interacciones. Más adornos sobre la misma estructura podrían conservar ese problema. Se necesita comprobar una muestra completa de escena, HUD, selección y resultado antes de producir otro lote.

## Alcance y evidencia de esta revisión

- Leídos AGENTS, PRD, DECISIONS, DESIGN, README, informe A52, manifiestos de herramientas y producción, paquete activo y componentes de presentación relevantes.
- Consultadas fuentes oficiales actuales y metadatos npm de las incorporaciones propuestas. Las licencias del software no conceden derechos sobre ilustraciones de terceros.
- Inspeccionados como archivos el fondo activo `art/scene/passage.webp` y el maestro de Circe. Son arte existente, **no capturas de la interfaz actual**.
- El acceso a la pestaña local5194 fue rechazado por la política de la herramienta de navegador. No se intentó acceder por otra superficie o tecnología. No hay capturas nuevas ni auditoría visual en vivo de los recorridos en esta entrega.
- No se instalaron paquetes/MCP nuevos, ejecutaron generadores con créditos, alteraron partidas ni repitieron pruebas funcionales. Las pruebas documentadas de A52/A56 son antecedentes, no resultados nuevos de esta investigación. No se publicaron cambios.

## Qué confirma el código actual

| Evidencia del repositorio | Implicación para el rediseño |
|---|---|
| `package.json`: React19, PixiJS8.22, GSAP3.15, Motion14.2, Vite, Fastify, PostgreSQL/Redis | Interfaz híbrida DOM/Canvas; se puede mejorar la experiencia conservando el stack y la autoridad |
| `App.tsx`: `header`, idiomas, opciones de sesión, secciones, subtiendas, navegación y diálogos | La organización sigue siendo la de una aplicación de paneles. Conviene diseñar una composición global de juego |
| `App.tsx`: selector ES/EN en cabecera y también dentro del diálogo de nodo | La petición de esconder el idioma en Ajustes tiene dos ubicaciones que corregir y probar |
| Bazar: pestañas de subtienda, producto destacado, stock, apertura y botones de compra separados | Candidato a una escena de mostrador con selección del objeto y una sola confirmación contextual de coste |
| `CollectionPanel.tsx`: elecciones visuales y acciones «guardar varita/escoba» | Candidato a inspección de personaje con ranuras ilustradas y confirmación integrada; conservar selección frente a escritura confirmada |
| `scenes/pixi-scenes.ts`: rutas con Graphics, figuras Sprite y efectos del replay | Pixi ya renderiza parte del juego; falta una composición coherente entre la escena y sus overlays, no otro motor |
| `production-v1/README.md`: seis escenas estáticas, figuras/props independientes, sin capas de pintura, rig o secuencias articuladas | Un PNG estático no permite animar de verdad una manga, una puerta o un personaje. Hay que producir las piezas necesarias |
| Paquete activo v5: una región, paleta y timings sustituibles | Buen punto para entregar una nueva presentación sin cambiar IDs, inventario, ruta o receipts |

Estas son observaciones de estructura/archivos. Su peso perceptivo es una hipótesis apoyada también por la valoración del propietario; debe contrastarse en una nueva muestra jugable.

## Dirección artística propuesta

La petición actual insiste en **Harry Potter**, con ilustración, poco texto y objetos mágicos. Esto difiere de PRD §2/A29, que mantiene folclore activo. Para el futuro rediseño, registrar expresamente esa nueva dirección del propietario y resolver el contrato del paquete de presentación. No interpretar una sustitución visual como permiso para cambiar identidades persistidas, estadísticas, economía o reglas históricas.

Propongo un **libro de aventuras mágico ilustrado**, manteniendo la riqueza material de Teatro de alquimia: papel trabajado, cuero, latón, cristal, piedra, madera, luz cálida y profundidad por capas. Evitar que cada objeto tenga el mismo marco, tamaño y animación. Un cofre debe abrirse; una carta debe descubrirse; un aliado debe incorporarse a la formación.

Como referente de acabado y continuidad, la entrevista oficial de [Magic Awakened](https://www.harrypotter.com/features/behind-harry-potter-magic-awakened-with-creative-director-justin-webb-interview) describe pintura con textura y combates sobre libros. Mi propuesta toma esa relación entre mundo, carta y escenario como referencia de diseño; no supone haber probado ese juego ni autoriza reutilizar sus assets. [Hogwarts Legacy, material oficial](https://www.hogwartslegacy.com/en-sg/media), aporta referencias de materiales e iluminación; no propongo reproducir su escala 3D.

### Transformaciones concretas a explorar

| Superficie | Presentación candidata | Texto visible necesario |
|---|---|---|
| Inicio | Portal/entrada al mundo, protagonista y objeto que permite comenzar | Nombre y acción breve |
| Mapa | Tablero regional ilustrado, caminos y lugares reconocibles; interfaz secundaria | Región, etapa y recursos |
| Nodos | Duelo: varitas/rivales; refugio: botica; cofre: baúl; pacto: personaje; encuentro: objeto misterioso; jefe: fortaleza/rival | Coste y consecuencia breve antes de confirmar; explicación a demanda |
| Formación | Magos sobre peanas o cartas en atril, reservas en una bandeja | Nombre al consultar; sello de temporal/propio siempre distinguible |
| Arena | Siluetas claras, anticipación, proyectil, impacto y recuperación; información solo cuando cambia | PV/PM y cifras útiles; controles de reproducción compactos |
| Recompensa | Botín que aparece y se incorpora al destino correcto; cierre directo hacia el siguiente paso real | Cantidades y nuevo/duplicado |
| Bazar/apertura | Mostrador con envases tocables, precio junto al objeto y apertura por piezas | Precio, stock y confirmación de gasto |
| Colección/equipo | Álbum material e inspección del mago con ranuras de objetos | Nombre/datos al consultar; sin listas repetidas de stats |
| Taller/bóveda | Mesa de trabajo y cerradura física con llave, receta/botín visibles | Coste y resultado confirmado |
| Ajustes | Un emblema estable abre un menú de juego; idioma y movimiento reducido dentro | Español/English y opciones breves |

No todo debe ocultarse tras iconos. Una selección incierta, un precio o un error deben seguir entendiéndose. Conservar botones semánticos bajo el arte, foco visible, teclado y alternativa al hover. El mapa ordinario no se desplaza; un panel de ayuda o acceso con texto ampliado sí puede necesitar desplazamiento.

## Herramientas: selección y límites

Precios/licencias consultados el15/10/2026. «Instalada» se refiere al repositorio actual; «propuesta» no implica instalación ni prueba de integración.

| Herramienta | Estado, coste/licencia | Aportación concreta y límite |
|---|---|---|
| [Game UI/UX, Game Feel, PixiJS Rendering y RPG](https://github.com/gamedev-skills/awesome-gamedev-agent-skills) | Cuatro skills locales; Apache-2.0 | Guían HUD, flujo de pantallas, foco, claridad y feedback. Aplicar al stack real; los ejemplos Unity/Godot no justifican migración |
| [Impeccable](https://github.com/pbakaus/impeccable) | Local; Apache-2.0 | Crítica de jerarquía, reducción, estados, accesibilidad y acabado. Complemento del diseño de juego; no produce personajes o animación articulada por sí sola |
| [Taste / Redesign](https://github.com/Leonxlnx/taste-skill) | Local; MIT | Ayuda a evitar el resultado genérico. Priorizar rediseño sobre la skill orientada a páginas públicas y restringir defaults de marketing |
| [PixiJS Filters](https://github.com/pixijs/filters) | Propuesta; MIT; npm6.1.5, peer Pixi>=8 | Glow localizado, sombras, distorsión de hechizos y ondas de impacto. La rama6 corresponde a Pixi8. Medir coste GPU y limitar área/duración; no aplicar todos los filtros ni brillo global |
| [PixiJS AssetPack](https://github.com/pixijs/assetpack) | Propuesta; MIT; `@assetpack/core`1.7.0 | Exportaciones optimizadas y atlas para props/sprites. Su [TexturePacker](https://pixijs.io/assetpack/docs/guide/pipes/texture-packer/) usa Sharp; no requiere comprar el producto homónimo. Complementar el manifest existente, sin reescribirlo por comodidad |
| [Penpot MCP oficial](https://help.penpot.app/mcp/) | Opcional; servidor MPL-2.0, npm2.15.4; [editor con plan0USD](https://penpot.app/pricing) | Crear/modificar pantallas, componentes, tokens y exportar assets. Requiere un archivo/editor conectado. No pinta automáticamente ilustración terminada ni reproduce el juego. Compatibilidad local Node24 sin verificar; documentación probada con Node22 |
| [Blender](https://www.blender.org/about/license/) + API Python local | Blender4.5.9 portable ya instalado; GPL, uso gratuito | Props, capas, cámara, luz y secuencias renderizadas para integrar en Pixi. La habilidad artística y el trabajo de producción siguen siendo necesarios; un modelo geométrico simple no cumple el acabado ilustrado |
| [Krita](https://krita.org/en/about/license/) / [Inkscape](https://inkscape.org/en/about/license/) | Autoría opcional; GPL; sin integración nueva verificada | Pintura/capas/animación2D en Krita y piezas vectoriales editables en Inkscape. Adecuados para un pipeline local; requieren trabajo real de autoría |
| [GSAP](https://gsap.com/community/standard-license/) / [Motion](https://github.com/motiondivision/motion) | Ya instaladas; GSAP licencia «No Charge», Motion MIT | GSAP coordina escenas/aperturas; Motion responde en overlays DOM. Asignar un único responsable a cada propiedad animada y conservar reduced-motion |
| [Motion AI Kit / MCP](https://motion.dev/docs/ai-kit-install) | Opcional; skill/installer MIT, docs MCP gratuito; npm motion-ai14.1.0, Node>=18 | `https://mcp.motion.dev` consulta documentación/metadatos sin cuenta. Motion+ y otras herramientas premium quedan fuera. No sustituye al renderer ni aporta arte |
| [Playwright CLI](https://github.com/microsoft/playwright-cli) | Local0.1.22; Apache-2.0 | Capturas, regresión y comprobación del estado del juego cuando el acceso esté disponible. No es una herramienta de creación artística ni una prueba con usuarios |

[Partículas nativas de Pixi8](https://pixijs.com/8.x/guides/components/scene-objects/particle-container) cubren chispas, polvo y burbujas sin añadir un emisor incompatible. Su API está marcada como experimental: fijar versión y probar el uso concreto. Usar pocos elementos con una finalidad perceptiva; detener animación al ocultar, reducir movimiento o terminar el efecto.

Los perfiles Agency y Game Design Workshop ya están locales. Resultan útiles para las decisiones del jugador y las hipótesis de progresión; no son la herramienta principal para producir el nuevo aspecto. Revisiones/licencias instaladas: `tools/arcana/design-tools-sources.json` y `.agents/skills/design-sources.json`.

### MCP de Blender: distinguir alternativas

El [MCP de Blender Lab](https://www.blender.org/lab/mcp-server/) requiere Blender5.1 o superior; no corresponde al4.5.9 del proyecto. El [MCP comunitario de Ahuja](https://github.com/ahujasid/mcp-for-blender), MIT y ahora llamado `mcp-for-blender`, es otro proyecto. Ambos permiten automatizar Blender; no garantizan calidad de arte. El servidor ejecuta código del agente, por lo que su integración requiere revisar versión/configuración y limitarlo al entorno del proyecto. Para este repositorio priorizaría la API Python y el wrapper ya aislados, evitando una actualización solo para añadir un MCP.

### Qué no elegiría para este encargo

- **Rive para crear/exportar assets nuevos a coste cero:** el editor es gratuito, pero la [exportación para runtime requiere plan de pago](https://rive.app/pricing). No confundir runtime MIT con autoría/exportación gratuita.
- Motion+, generación por créditos y servicios de vídeo/imagen con coste adicional: fuera del presupuesto. [Motion Studio](https://motion.dev/docs/studio) permite edición visual gratuita, pero su agente y Apply to code requieren suscripción; no forman parte del plan base.
- Un cambio a Unity/Unreal/Godot/Phaser para conseguir apariencia de juego: no hay necesidad técnica demostrada; añade migración y riesgo sin producir arte.
- Figma/Canva o generadores de páginas como dependencia imprescindible: la búsqueda del directorio encontró Figma/Canva disponibles y Product Design instalado; no se conectaron. No se verificaron permisos/cuotas de una cuenta Figma. El propio resultado de Canva identifica generación por créditos. Penpot cubre la necesidad de composición sin hacerlos obligatorios.
- Instalar más skills solapadas o copiar packs gratuitos inconexos. La consistencia de perspectiva, material, iluminación, recorte y estados vale más que el número de herramientas.

## Pipeline propuesto y primer incremento verificable

1. **Diseño:** mapa de pantallas y tres composiciones comparables del mismo estado de mapa, HUD y preparación. Referencias oficiales, arte existente y muestras nuevas locales identificadas. Comparar también Ajustes y recompensa; evitar imágenes bonitas que no muestren cómo se juega.
2. **Muestra de producción:** un escenario por capas, un personaje con piezas realmente animables, un nodo y un objeto/recompensa. Validar estilo y legibilidad en contexto antes del lote completo. Separar fuente editable de exportación runtime y registrar licencia/procedencia.
3. **Recorrido conectado:** mapa → preparación → nodo/combate → recompensa → regreso al mapa. Ajustes accesible desde él, idioma dentro del menú y estado conservado. Reutilizar casos de uso, API y receipts reales.
4. **Extensión del mismo sistema:** Pactos/formación, Bazar/apertura, Cromodex/equipo, Taller, jefe/bóveda y Misiones. Ninguna pantalla entregada como acabado puede conservar un formulario genérico mientras las demás simulan objetos.
5. **Verificación:** comparativas equivalentes es/en, teclado/toque/hover, movimiento reducido, arte ausente, recuperación/recarga y costes visibles. Capturas de canvas más estado real, medición de carga/frames y distinción entre escritorio/emulación/dispositivo físico.

El presupuesto monetario del software puede ser cero; la producción de ilustración y animación conserva un coste de trabajo. No prometer calidad final de una familia de personajes por instalar un MCP. No cambiar precios, probabilidades, premios, duplicados o partidas para hacer que la muestra parezca más satisfactoria. Las regiones futuras continúan como roadmap, con una sola región realmente jugable.

## Entrega preparada

[PROMPT.md](PROMPT.md) contiene el encargo autocontenido para una ejecución posterior: herramientas seleccionadas, dirección Harry Potter, idiomas en Ajustes, pantallas, assets, reglas de movimiento, garantías de persistencia, revisión de muestra y aceptación. Esta investigación no convierte esas propuestas de composición en una implementación aprobada o probada.
