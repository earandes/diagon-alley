# Callejón vivo: investigación y brief de prueba visual

> Actualización posterior A21/A22 / PRD v0.18: Enric fija gasto adicional cero y delega instalación por proyecto. Blender portable ya instalado; fuentes y animatics técnicos producidos en `design/production/`. La investigación anterior se conserva como antecedente; Spline no se instala por las restricciones de exportación. Ver [pipeline gratuito y evidencia](ZERO_COST_PIPELINE.md). Las muestras no acreditan acabado final o interacción de M2 completa.

9 octubre 2026 · PRD v0.17 · A20. Investigación documental y preparación; sin escena nueva construida ni motor elegido.

## Petición y frontera de decisión

Enric conserva la idea de la muestra, pero pide el Callejón como fondo de toda la página, movimiento ambiental con lechuza/hechizo/paseante, más magia en la revelación y poder avanzar por la calle sin necesitar ver al propio avatar. Solo Weasley disponible; elegir otras tiendas es una dirección futura, sin tiendas ni reglas nuevas aprobadas. A19 conserva registro/acceso antes de visitar y premios por cuenta. La muestra anterior es un estudio, no el diseño final aprobado.

A11/A12 siguen siendo la dirección y referencia de acabado: ilustración teatral detallada. «Realismo» puede referirse a profundidad, movimiento y luz creíbles o a cambiar hacia imagen cinematográfica; se ha consultado y la respuesta todavía no consta. No cambiar a fotografía o 3D de aspecto cinematográfico por interpretación. La tecnología que se explore no aprueba automáticamente otra dirección artística. La ubicación de cuentas y este recorrido en I1 sigue pendiente; esta preparación no ejecuta el encargo de aplicación.

## Qué falla en la muestra actual

El HTML actual pone el fondo dentro de `.scene` y la apertura en una sección posterior con otro fondo. La fachada es parte de un único PNG, la cámara cambia escala/encuadre y los sprites de rana/caja son completos. No existen lechuza, paseante, ciclo de caminar, planos de oclusión, tapa independiente o geometría. Así se puede estudiar composición y timing, pero no se obtiene una calle que responda al desplazamiento ni una apertura articulada. No se ha inspeccionado un rig inexistente ni medido atractivo real.

## Comparación de vías

| Vía | Qué permite | Trabajo y límites | Recomendación |
| --- | --- | --- | --- |
| Ilustración 2.5D por capas | Luz, niebla, lechuza y paseante animados, profundidad y avance guiado entre vistas preparadas | Necesita fondos/planos separados, repintar zonas ocultas y rig o fotogramas. Una sola foto ampliada no permite descubrir laterales o rodear una fachada | Primera prueba compatible con A11/A12 si el avance guiado satisface la intención |
| Tramo 3D interactivo | Cámara avanza con perspectiva/oclusiones reales; tienda seleccionable desde distintas posiciones | Necesita calle/fachada modeladas, materiales, luz, cámara y personajes animados. Aspecto y rendimiento por comprobar; no convertir doce objetos en un mundo completo | Prueba alternativa en Spline si el desplazamiento espacial es lo decisivo; no sustituye A11 por sí sola |
| Vídeo/loop ambiental | Atmósfera con movimiento convincente desde un encuadre preparado | La perspectiva y sucesos están grabados. No ofrece un recorrido espacial controlable; el acceso a tienda debe seguir siendo una acción de interfaz | Animatic o referencia para comparar acabado; no solución única para caminar |

Recomiendo una muestra de **tres posiciones y un único destino**, controlada por «Avanzar»/«Volver» y selección de Weasley. La prueba debe comparar si basta una versión ilustrada guiada o requiere geometría 3D. No hacen falta avatar propio, mapa completo, colisiones complejas, IA de NPC, teclado de juego obligatorio ni un motor de expansiones. Para futuros destinos bastará revisar la escena y sus acciones cuando se apruebe cada tienda; no producir ahora una segunda tienda jugable.

## Herramientas y disponibilidad

Fuentes primarias revisadas el 9 de octubre. Capacidades documentadas no equivalen a herramientas ejecutadas, licencias de assets, rendimiento o resultado artístico garantizado.

| Herramienta | Uso propuesto y evidencia | Disponibilidad aquí |
| --- | --- | --- |
| Spline | Editor visual con escena, materiales, luz y animación. MCP oficial permite construir/editar escenas, controlar cámaras e inspeccionar desde el cliente conectado. Requiere app de escritorio; el MCP no funciona desde su versión web. [MCP oficial](https://docs.spline.design/generate/spline-mcp-server), [editor](https://docs.spline.design/) | No hay tools Spline expuestas. No encontrada app en `/Applications` ni `~/Applications`; no instalada ni conectada durante esta tarea |
| Spline runtime | Exportación web para probar escena e interacción. La documentación distingue export React/Vanilla con eventos/animaciones de export Three.js/R3F; no prometer que exportar entre motores conserva todo. ZIP autocontenido figura como Enterprise; comprobar acceso/coste antes de elegir esa ruta. [Código](https://docs.spline.design/exporting-your-scene/web/exporting-as-code), [self-hosted](https://docs.spline.design/exporting-your-scene/web/exporting-as-self-hosted-project) | No exportación, contrato comercial ni runtime instalado. No publicar un enlace público para una prueba privada |
| Blender + Three.js | Producción de mallas y animación, export GLB y visualización web con cámara de perspectiva. glTF transporta animaciones, pero no todos los efectos específicos de un editor. Three.js carga escenas, clips y cámaras; integración y controles propios por preparar. [Blender glTF](https://docs.blender.org/manual/en/latest/addons/scene_gltf2.html), [Three cámara](https://threejs.org/docs/pages/PerspectiveCamera.html), [GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html) | Blender no localizado en las dos carpetas habituales; Three.js no instalado. Alternativa de producción con más control, no elección de stack |
| Rive | Mallas raster y huesos permiten deformar alas, tela y cuerpo con movimiento orgánico. Fuente `.riv`, partes y pesos requieren trabajo de animación; no transforma automáticamente un PNG en anatomía coherente. [Meshes](https://rive.app/docs/editor/manipulating-shapes/meshes) | Sin MCP expuesto o app localizada. Candidato para criaturas/personajes 2D, no para geometría de calle |
| PixiJS + timeline | Escenas 2D por grupos, sprites/fotogramas, máscaras y efectos de luz/partículas. [Container](https://pixijs.com/8.x/guides/components/scene-objects/container), [texturas](https://pixijs.com/8.x/guides/components/textures), [efectos](https://pixijs.com/8.x/guides/components/scene-objects), [ejemplo animado](https://pixijs.com/examples/sprite/animated-sprite-jet/) | No instalado. Candidato si la composición 2.5D supera lo que resulte cómodo coordinar en DOM/CSS; no añadirlo solo por atractivo del nombre |
| Imagegen | Conceptos y partes con referencia A12; PNG transparente inspeccionado. Necesita retoque/consistencia de poses. No devuelve geometría, rig ni animación | Disponible; tres recursos anteriores conservados, sin nuevas generaciones en esta investigación |
| Runway | Directorio de integraciones ofrece creación/edición de vídeo con cuenta propia. Útil para animatic de vuelo/ambiente y comparar intención, no para navegación con estado | Disponible para instalar/conectar, no instalado. Sugerido; ningún vídeo generado ni créditos usados |
| Figma / Stitch | Composición de controles, acceso, estados y pruebas de texto; no son el motor del paseo | Figma no conectado en la última comprobación; Stitch MCP disponible. No modificados en esta tarea |

MCP se usa para autoría estructurada cuando esté conectado. Computer use sirve para editor, revisión y exportación donde no exista herramienta equivalente; no elimina la necesidad de modelar/riggear. No se han instalado apps ni cambiado configuraciones MCP. La búsqueda de plugins no devolvió un plugin Spline, Blender o Rive; Spline sí documenta su propio MCP de escritorio. No confundir ambas disponibilidades.

## Dirección de la página

- Escena cubre todo el viewport y permanece detrás de bienvenida, visita y overlays; ningún bloque posterior con fondo plano. Controles DOM y texto independientes. Para pantallas pequeñas o zoom, paneles pueden desplazarse conservando el fondo y las acciones.
- Antes del acceso: plano general vivo, panel de registro/inicio compacto que deja la calle reconocible. La ambientación no concede entrada autenticada ni premios.
- Tras acceso real: misma localización con panel de bienvenida retirado; controles de avance/retorno y lista equivalente. En la prueba visual, cualquier paso sin autenticación real se rotula como muestra.
- Tres posiciones candidatas: entrada con calle reconocible; punto medio donde Weasley se identifica; fachada donde se ofrece «Entrar en Weasley» / «Enter Weasley». Regresar devuelve al punto anterior. Elegir tienda no consume unidades.
- Escaparates restantes decorativos/no disponibles, sin inventar nombre de segunda tienda, fecha o acceso. Personas ambientales sin diálogo, misiones ni nuevas identidades coleccionables.

El realismo se prepara con escala/perspectiva común, contacto de pies, sombras, oclusiones y tiempos con aceleración/desaceleración. Una persona trasladada rígidamente no constituye un ciclo de caminar; la lechuza necesita aleteo/deslizamiento/posado y trayectoria. Evitar todos los efectos al mismo tiempo: la escena necesita momentos de calma para reconocer tienda y acciones. Nieblas suaves y luz estable, sin flashes ni cámara que tiemble. Son supuestos de diseño a probar.

## Storyboard ambiental candidato

| Plano/estado | Acción visual | Fuente necesaria y prueba |
| --- | --- | --- |
| Plano general en reposo | Faroles cálidos; bruma lenta entre planos; un paseante cruza al fondo | Fondo por planos, luz y ciclo de caminar con pies anclados. Calle/Weasley reconocibles sin UI tapando el destino |
| Suceso ocasional | Lechuza entra, aletea, planea y sale/se posa; no invade el área de acceso | Rig o secuencia consistente y plano de oclusión; frecuencia suave, no un bucle corto evidente |
| Hechizo ambiental | Estela tenue aparece desde un punto concreto y se disipa en un escaparate | Emisor/recorrido/origen coherentes, partículas/luz controladas. Sin nueva acción obligatoria ni destellos repetitivos |
| Avance a Weasley | Cámara progresa hacia posición siguiente, se frena; personaje fuera de trayectoria | Múltiples vistas o geometría real. Pausa/salida recuperan posición; modo reducido cambia plano directamente |
| Llegada/retorno | Luz de puerta sugiere destino disponible; entrar y volver identificables | Fachada/puerta y controles separados; teclado/táctil y lista dan acceso equivalente |

No hay frecuencia o duración ambiental aprobada. El recorrido guiado es recomendación de prueba, no una decisión de cámara libre. Medir preferencia y mareo/fatiga con personas reales.

## Revelación con más magia: coreografía propuesta

Probar una secuencia de unos **3–4 s**, duración candidata frente a 1,6 s anterior. Después de varias repeticiones, medir omisión y cansancio; más duración no garantiza mayor interés.

1. **Anticipación:** el envase responde sutilmente; una línea cálida recorre la unión de tapa y base, sin indicar rareza falsa.
2. **Apertura:** tapa articulada gira; el interior emite luz suave y una pequeña espiral emerge. Base, interior, tapa y sombra son piezas distintas.
3. **Rana viva:** se comprime, salta en arco, proyecta sombra y aterriza/desaparece por una oclusión coherente. Necesita poses/rig; no solo un PNG desplazado.
4. **Cromo:** el dorso asciende, flota brevemente y gira para mostrar la identidad ya confirmada. Papel/brillo discreto y asentamiento, sin estadísticas inventadas ni shiny.
5. **Resultado:** nombre, familia, rareza y acción legibles en DOM. El rango aprobado del resultado gobierna la ornamentación; no existe otro sorteo visual. Detalle extra opcional para R03 pendiente de revisión, sin aumentar potencia o cambiar probabilidad.

Omitir desde cualquier fase confirmada muestra inmediatamente el mismo resultado. Movimiento reducido elimina recorrido, salto/giro/partículas y conserva una presentación estática cuidada. Audio solo tras activar. El ritual comienza tras consumo/entrega confirmados; antes, indicar espera/recuperación sin anticipar éxito. Para diseñar el animatic se usa un resultado rotulado guionizado, fuera del historial y estadísticas.

## Assets y entregas pendientes

| ID | Entrega para la muestra | Sustituto existente y criterio de reemplazo |
| --- | --- | --- |
| A20-V01 | Callejón: vista inicial/media/fachada en perspectiva consistente, planos/pintura oculta o tramo 3D editable | PNG A19-V01 solo como referencia; sustituir cuando avance/oclusiones y encuadre móvil sean coherentes |
| A20-V02 | Lechuza: poses/rig, alas y cuerpo, clips de vuelo/posado, sombras pertinentes | No existe. No llamar rig a una generación raster; reemplazo exige vuelo/articulación y borde limpio |
| A20-V03 | Paseante: figura de fondo, ciclo completo de caminar y capa/sombra; sin rostro de actor | No existe. Aceptar contacto de pies y escala/luz, sin deslizamiento rígido |
| A20-V04 | Faroles, bruma y hechizo: emisores, máscaras, planos de oclusión y efectos editables | No existen por separado; probar rango de intensidades y preservar UI legible |
| A20-V05 | Base/tapa/interior de caja, rana articulada/poses, sombra y dorso/cromo | A19-V02/V03 son sprites completos; reemplazo exige continuidad, articulación y misma identidad/estado |
| A20-UI01 | Bienvenida/visita/resultado/lista es/en sobre escena completa | Textos del estudio v1 orientan, composición por revisar; fuente DOM y tamaños accesibles |

Los IDs de este brief son entregas pendientes, **no assets producidos**. No se modificó el manifest v1 para fingir recursos nuevos. Fuentes finales: `.kra`/PNG por capas para ilustración; `.riv` para rig 2D si se elige; `.blend`/GLB o escena Spline exportada si se elige 3D. Registrar herramienta/modelo/autor, permiso, versión, recorte, pivote, clips y dimensiones. El estilo de una muestra no acredita distribución.

## Próxima prueba pequeña, no aplicación

**Muestra M2 propuesta:** entrada → avance controlado → fachada de Weasley → regreso, junto a una revelación guionizada. Un único destino, una lechuza, un paseante, un hechizo. Cuenta y dominio aún sin simular como reales. Comparar una variante 2.5D ilustrada y una geometría simple si la primera no transmite paseo; no producir todos los assets a la vez ni prometer acabado cinematográfico antes de una muestra.

| Caso verificable, en es/en | Resultado esperado |
| --- | --- |
| Abrir bienvenida en escritorio/móvil; cambiar idioma | Callejón cubre toda la página y sigue reconocible; panel/controles no tapan el destino ni desbordan, estado visual conservado |
| Iniciar y pausar ambiente | Lechuza/paseante/hechizo identificables, sin bloquear controles; pausa detiene todo lo decorativo |
| Avanzar y regresar; repetir camino | Posiciones y destino coherentes; no salto de encuadre/inversión de fachada; la lista permite llegar sin usar la cámara |
| Activar reducido antes/durante avance o revelación | Sin parallax, salto, giros o partículas; mismo destino/resultado y acciones utilizables |
| Omitir en cada fase de revelación | Una sola salida al mismo resultado guionizado; sin reinicio de coreografía o dobles anuncios |
| Cerrar/reabrir revelación y cambiar idioma | Control/foco/estado coherentes dentro de la muestra; no afirmar persistencia de premio |
| Falta imagen/rig o falla renderizado GPU | Fondo/sustituto estático y controles DOM; acceso/lista/resultado siguen operables |
| Medir en dispositivos acordados | Registrar carga/transferencia, tiempo de frame y consumo/memoria; objetivo inicial candidato 60 fps escritorio/30 fps móvil, no alcanzado ni universal |

La muestra verifica autoría y comportamiento visual, no servidor o premios. Interés, magia percibida, mareo y deseo de continuar necesitan personas reales; A17 no queda aprobado como resultado por añadir efectos. Posteriormente, I1 conectado verifica transacción/idempotencia/recuperación/cuentas junto a la escena. Pendiente redefinir sus límites con A19/A20.

## Prompt de autoría preparado

> Crea una muestra privada de escena para Colección Mágica, siguiendo PRD v0.17 y A11/A12/A19/A20. No implementar cuentas, premios, catálogo jugable o servidor. Callejón Diagón ocupa toda la página; UI DOM es/en separada. Diseña entrada, punto medio y fachada Weasley, único destino disponible, y regreso; usuario sin avatar visible. Primera variante conserva el cuento teatral detallado; no cambiar a fotografía ni aprobar 3D cinematográfico. Prepara lechuza articulada/poses, un paseante con ciclo de caminar, luz y un hechizo discreto. No inventar rig donde solo haya PNG. Revelación guionizada más mágica con base/tapa/interior, anticipación, luz suave, salto con sombra, dorso y giro del cromo; muestra rotulada, sin entrega de premio. Omisión, pausa, reducido y acciones equivalentes por lista/teclado desde el inicio. Una alternativa espacial 3D se registra como experimento técnico sujeto a revisión, no como reemplazo aprobado de A11. Usa Spline MCP solo si está realmente conectado; si no, informa de ese estado y prepara fuentes/brief sin fingir ejecución. No publicar, instalar, gastar créditos o ampliar el mundo durante este encargo. Entrega fuente editable, preview, manifest de recursos reales/pendientes, comandos/evidencia y límites de lo probado.

Este prompt está preparado y no ejecutado. La investigación no ha generado vídeo, assets nuevos, escena Spline, geometría/rig ni una actualización visual de v1.
