# P22 · El mostrador imposible

10 octubre 2026. Replanteamiento propuesto y canvas de muestra. No sustituye la demo I1 ni equivale a aprobación de arte/producto.

## La apuesta

Haría una visita a un pequeño teatro de bolsillo. En lugar de buscar “una web más mágica”, organizaría la experiencia alrededor de tres objetos que se recuerdan: una puerta, una caja y un libro. El escenario acompaña toda la visita; cambia el foco de atención, no el lenguaje de interfaz.

La propuesta P21 mejoraba composición y reducía botones, pero todavía se percibía como pantallas de productos. P22 elimina la parrilla de cuatro productos equivalentes: la rana protagoniza el mostrador, las grageas permanecen guardadas y los dos inventos conocidos viven juntos en un cajón de consulta. El álbum es un libro portátil. Agrupar los inventos añade un paso para consultar cada ficha: es un intercambio deliberado de rapidez por jerarquía, que debe validarse. No elimina identidades o funciones.

La innovación principal es la relación entre espacio y acción. Más polígonos, partículas o un asistente conversacional no resolverían por sí solos la fragmentación. Mi recomendación conserva la ilustración de cuento teatral y transforma la estructura de interacción. No hace falta instalar un motor para probarla.

## Tres direcciones posibles

| Dirección | Qué aporta | Riesgo / coste | Criterio |
|---|---|---|---|
| Libro desplegable desde el inicio | El callejón es una página; cada visita abre un pequeño diorama. Transiciones de papel y colección muy coherentes. | La bienvenida puede parecer un menú ilustrado; menos sensación de estar dentro de Weasley. | Alternativa si buscamos máxima simplicidad y recursos limitados. |
| **Mostrador imposible** | Un espacio estable con caja, etiquetas, cajón y álbum. Atención y tactilidad sin gestos obligatorios. | Necesita arte limpio por piezas; los objetos deben seguir pareciendo controles claros. | **Recomendado: salto de interacción asumible dentro de I1.** |
| Visita en primera persona con cámara libre | Descubrir la tienda caminando o mirando, sensación de exploración. | Modelado, oclusiones, mareo, navegación móvil y rendimiento mucho más difíciles; podría ampliar A20. | Investigación posterior, sin empezarla ni convertirla en requisito de I1. |

Las tres conservan el mismo juego. Elegir una composición no aprueba cuentas, misiones, suministro ni una segunda tienda.

## Cómo se sentiría el recorrido

1. **Callejón:** la fachada ocupa el encuadre, con una puerta HTML grande y rotulada. Farol y cartel son las únicas dos respiraciones ambientales. No hay una tarjeta de tienda duplicada debajo. La vista en lista permite la misma entrada sin exigir interpretar el dibujo.
2. **Mostrador:** la caja está cerca, sobre madera. Su etiqueta dice “1 disponible · consultar sin gastar”. Grageas e inventos conocidos son secundarios. Un libro físico identifica “Tu álbum · 4/12”; sigue accesible con la rana agotada. No aparece una barra inferior.
3. **Consulta:** la caja se coloca bajo la luz y la etiqueta se despliega como una hoja legible. Persona u objeto, bienvenida nueva y seis probabilidades exactas A13/A18, con rango y versión. Solo después aparece “Usar 1 rana”. Se admite desplazamiento normal: la etiqueta no cabe entera en un móvil y no se reduce la letra para fingir que cabe.
4. **Apertura:** después del commit real, tapa 300 ms, anticipación 200, salto 500, cromo 400 y asentamiento 200. La sorpresa sale de la caja, no de una pantalla de confeti. Omitir funciona desde el inicio; ningún gesto decide el premio. Sin sonido en esta propuesta.
5. **Hallazgo:** el cromo queda sobre el mostrador. Nombre, familia, rareza, procedencia, novedad y copias se leen fuera del retrato. En el juego ya está guardado; no se introduce “reclamar” o “guardar” como otra acción. El canvas usa C01 como ejemplo, no como promesa de resultado.
6. **Álbum:** el libro se abre sobre la misma madera, con pestañas de Personas/Objetos/Sabores, filtro de rareza, huecos pendientes y fichas. Total base 12 siempre visible. En 320 px y con letra ampliada puede convertirse en una columna: el libro es un lenguaje visual, no una obligación de mantener dos páginas minúsculas.
7. **Salida:** cerrar el álbum devuelve al origen con foco; regresar al callejón conserva la partida en la implementación futura. El navegador también debe poder retroceder. Los parámetros de este canvas conservan solo una muestra visual, nunca acreditan integridad del inventario.

La continuidad ideal necesita transiciones de colocación de 200–300 ms y encuadres preparados. El canvas cambia composición sobre un fondo común; **no implementa todavía una cámara espacial, una entrada continua pintada por capas o una animación final del retrato entrando en el álbum**. El cromo pertenece al álbum desde el commit, aunque su colocación visual se omita.

## Lenguaje visual y componentes

Ciruela para cubierta/caja, crema para información, cobre para uniones y herrajes, madera para suelo de trabajo, turquesa para foco. Tipos de sistema: Georgia en títulos, system-ui en texto y controles; no fuente descargada. Espaciado de 8 px como base, con 16–24 px de margen móvil.

Pocos materiales y siluetas distintas: envase pentagonal, etiqueta rectangular, cajón bajo, libro con lomo y ranuras. Evitar cápsulas idénticas para todo, marcos anidados, cifras pequeñas sobre textura y brillo según rareza. Los objetos disponibles muestran acción; los reservados explican su estado; los pendientes del álbum conservan nombre y rango. Color, forma y texto se complementan.

Los botones/links usan HTML y objetivos de al menos 44 × 44 CSS px en las vistas normales capturadas. Foco visible, lista equivalente, retorno, controles nativos y diálogo de opciones. Hover es un refuerzo leve; tocar o pulsar Enter resuelve la acción. No arrastre, captura de rana, giros del dispositivo o audio obligatorio.

Las preferencias están en un panel accesible rotulado: movimiento reducido, ambiente y lista. La futura gestión JSON, recuperación y reinicio usa formularios comprensibles aquí; no escondo acciones delicadas en acertijos o accesorios sin nombre. El canvas enlaza a la demo real para gestionar la partida, en vez de fingir exportaciones o importaciones.

## Qué aportan las skills y herramientas

- **[Taste](../../.agents/skills/taste-skill/SKILL.md):** lectura de experiencia, asimetría, protagonismo de un objeto y densidad baja en el mostrador. No aplicar sus defaults de landing o sus diales altos de movimiento automáticamente.
- **[Image-to-Code](../../.agents/skills/image-to-code-skill/SKILL.md):** descomponer las tres referencias existentes en ambiente cálido, envase ciruela/cobre y retrato. Reutilizo encuadres provisionales, con sus limitaciones; el encargo prohíbe nuevas generaciones sin permiso separado. La fidelidad buscada es material/jerarquía, no copiar los botones incrustados en los PNG.
- **[Awesome Design / Fantasy](../../.agents/skills/awesome-design-fantasy/SKILL.md):** tokens semánticos, estados claros y anatomía consistente de objetos/libro. Su azul, tipografía y componentes de ejemplo no sustituyen la dirección aprobada.
- **[Web Design Guidelines](../../.agents/skills/web-design-guidelines/SKILL.md):** revisión de HTML semántico, foco, campos, movimiento, idiomas y navegación según [reglas obtenidas de nuevo el 10 octubre](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md). Adaptadas a idioma español y juego; no se adoptan reglas editoriales en inglés como producto.
- **[Playwright CLI](../../.agents/skills/playwright-cli/SKILL.md):** capturas reales del canvas y verificaciones reproducibles de sus controles, no una valoración subjetiva basada en código.
- **Blender portable del proyecto:** útil para estudiar la geometría/pivote de tapa, interior y salto o preparar pases 2D. No se ha ejecutado para este canvas. Sus estudios geométricos no serían el acabado ilustrado final; exportar piezas preproducidas evita introducir 3D en runtime como requisito.

La implementación posterior puede seguir con React/TypeScript/Vite + IndexedDB y CSS A23. Una escena de presentación con estados de foco —callejón, mostrador, etiqueta, ritual, hallazgo, libro— consume los casos de uso actuales. El dominio y la transacción no necesitan reescribirse. Un coordinador pequeño presenta el resultado confirmado y permite omitir; no sortea ni concede copias. Historia del navegador y restauración de foco son responsabilidades de presentación, no del inventario.

No hay nuevas dependencias o instalaciones. GSAP, Three.js, Rive, Spline, un runtime de IA, NPC conversacional y un sistema genérico de escenas no son requisitos. Pueden reevaluarse si aparece una necesidad medida; ninguna guía los convierte en decisiones aprobadas.

## Estado, evidencia y límites

Implementado **solo en el canvas**: ocho momentos de composición, consultas de grageas/inventos/fichas, etiquetas con datos JSON existentes, animatic DOM/CSS de 1,6 s con base/tapa/interior/rana/sombra/cromo separados, omisión, versión estática, muestra C01, libro y filtros, ES/EN, lista, opciones, navegación por URL y retorno de foco. No hay transacción, stock persistente ni azar en este prototipo.

Capturas: [galería](GALLERY.md). Se revisaron mostrador, etiqueta, resultado y álbum; se corrigieron el retrato fuera del hueco, el encuadre de caja y la distribución del mostrador. Se repitió la captura después de corregir. Arte provisional sigue visible como texto fuera del dibujo. Fondo ampliado con detalle blando y recorte pentagonal aproximado son deuda de arte, no acabado final.

Pruebas locales con CLI 0.1.22, Chrome headless 154, Node 24.20.0, macOS 27.0.1. ES/EN, 320/390 × 844 CSS px, ocho vistas por combinación; sin desbordamiento horizontal ni controles normales menores que 44 × 44 en las mediciones guardadas. Recorrido de muestra, filtros sin cambiar total, cambio de idioma, omisión, movimiento reducido, retroceso y retornos de foco; sin errores JS en esos recorridos. Lista y álbum sin arte con tamaño raíz al 200 %: texto usa rem, con reflujo a una columna; no equivale a probar todo el zoom del navegador.

[review.cli.js](review.cli.js), [salida](review-output.txt), [access.cli.js](access.cli.js), [salida adicional](access-output.txt). Comprobación adicional con Enter, pausa ambiental, peticiones de arte abortadas y fallo de carga de tabla. Verifican comportamiento de la **muestra**, no los I1-AC01–12 de persistencia. La matriz y CI anteriores permanecen en sus informes; no se vuelven a certificar aquí. Tipos y sintaxis se comprueban por separado.

Comandos ejecutados: `npm run typecheck`, `node --check docs/disruptive-i1-v5/stage.js`, `git diff --check` y las dos pasadas CLI indicadas abajo. Correctos. No se repiten unidad/build/e2e de la aplicación porque su código y recursos permanecen sin cambios frente a `a88d923ee6dd0caaeaf55107411fd65ac1419bd4`. Word conserva SHA-256 `7252db26b0ff4146b7ec211dcbd9624ba8e3440f59b3fd55ffea571886b2056c`.

```sh
npm run dev -- --port 5193 --strictPort
npx --no-install playwright-cli -s=diagon-concept-v5 open http://127.0.0.1:5193/docs/disruptive-i1-v5/canvas.html
npx --no-install playwright-cli -s=diagon-concept-v5 run-code --filename=docs/disruptive-i1-v5/review.cli.js
npx --no-install playwright-cli -s=diagon-concept-v5 run-code --filename=docs/disruptive-i1-v5/access.cli.js
npx --no-install playwright-cli -s=diagon-concept-v5 close
```

Pendiente: lector hablado, móvil físico, Safari/Firefox en esta propuesta, preferencias persistentes del canvas (solo muestra), focus/no-oclusiones en todos los tamaños de ampliación, animación final y carga progresiva. No se ha medido fluidez, FPS, transferencia de primera visita o Core Web Vitals en este concepto. Emulación no demuestra rendimiento real. Sin usuarios, A17 o aprobación artística. No commit/push/CI nuevos de implementación; la propuesta queda en el workspace.

## Siguiente paso pequeño

Revisar esta dirección antes de reemplazar la UI. Primero una sola muestra de producción: **mostrador → etiqueta → apertura → resultado**, con fondo limpio, caja por piezas y el mismo inventario recuperable de I1. Comparar con la demo actual y observar si una persona identifica rana/álbum, entiende que consultar no consume, puede consultar probabilidades y volver. Medir lectura y errores de interacción antes de invertir en el resto del arte.

Después, si esa muestra funciona, trasladar el libro y el callejón al mismo lenguaje y ejecutar la matriz completa de aceptación de I1. Sin iniciar I2. El mayor trabajo nuevo sería arte y presentación, no infraestructura.
