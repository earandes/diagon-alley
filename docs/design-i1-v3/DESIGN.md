# Dirección y sistema de interfaz · A28

## Contexto y objetivo

Una visita móvil a Weasley para un fan adulto casual: materiales cálidos, producto reconocible y recuerdo guardado. Evolución del diseño existente, sin cambiar reglas, navegación o acabado de referencia. Taste: DESIGN_VARIANCE 3, MOTION_INTENSITY 3 en interfaz y VISUAL_DENSITY 5; el ritual y los dos detalles ambientales conservan A25. No es una landing o un dashboard.

## Extracción de Image-to-Code

Fuentes inspeccionadas completas: `design/concepts/weasley-flow-v1/01–03`, tres imágenes 853 × 1844. El interior tiene un título crema centrado, una escena cálida única y cuatro productos en dos columnas. Las imágenes de producto están encima de nombre/estado/acción; la rana usa la acción principal. En detalle, la caja pentagonal es el único foco, con reglas y acción separadas debajo. En resultado, un cromo emerge sobre caja y terciopelo; nombre y procedencia son HTML al traducir la propuesta. C01 es ejemplo, cada partida muestra su identidad persistida.

Mantener madera/ciruela/cobre, titular serif de sistema y cuerpo system-ui. La proporción de las propuestas no se copia como altura fija: una pantalla interactiva a 390 px necesita llegar antes a acciones. Reducir el interior redundante sobre las cuatro opciones y el exceso de envoltorios del resultado. Márgenes 16–20 px, ritmo 4/8/12/16/24, sin texto funcional rasterizado nuevo. Los encuadres existentes son sustitutos registrados, no ilustraciones por capas.

## Tokens y fundamentos

| Token          | Valor / función                                                                                                |
| -------------- | -------------------------------------------------------------------------------------------------------------- |
| surface        | #24131e, superficie ciruela oscura                                                                             |
| surface-raised | #352131, controles y lectura                                                                                   |
| text-primary   | #f6e8cb, crema                                                                                                 |
| text-secondary | #d2bfae, contexto legible                                                                                      |
| accent         | #e3b872, cobre claro para acción principal                                                                     |
| accent-text    | #24130d, tinta sobre cobre                                                                                     |
| focus          | #99e3d7, contorno visible de 3 px                                                                              |
| radii          | 6 px campos; 12 px envases/cromos; 24 px botones                                                               |
| type           | Georgia/Times/serif del sistema para títulos; system-ui para cuerpo; 16 px cuerpo, 14 px metadatos importantes |
| layers         | superficie; arte decorativo sin captura de eventos; controles; diálogo nativo superior                         |

Awesome Design/fantasy se aplica como sistema de tokens semánticos, componentes con estados explícitos y aceptación comprobable. Es una guía del registro, no un sistema probado de una marca ni aprobación de su paleta azul o New Rocker. Se conservan las fuentes de sistema y la identidad A11/A12.

## Reglas de componentes

- Callejón: escena principal y entrada visibles; acceso al álbum secundario, lista equivalente y pausa fuera del arte.
- Tienda: título y retorno compactos; escena breve que conserva el botón del estante; cuatro consultas con imagen/estado/botón, sin gastar. En 320 px y con texto ampliado, reorganizar tarjetas sin recortar nombres ni acciones.
- Detalle: caja con ancho acotado en rem, garantía, saldo y acción explícita. Seis probabilidades y versión siguen disponibles completas; no esconderlas para encajar.
- Resultado: una sola presentación de arte, contexto legible, acción al álbum antes de metadatos secundarios largos. La ficha individual conserva su ilustración; no hereda la supresión del retrato redundante del resultado.
- Álbum: dos columnas cuando caben, una con ampliación; filtros sin cambiar denominador doce; copias, familia y forma de rareza legibles.
- Controles: reposo/foco/hover/active/disabled/loading/error coherentes; feedback de color y borde; mínimo cómodo 44 × 44 px. Ninguna interacción depende de hover.

## Accesibilidad y contenido

Acceso «Saltar al contenido» / «Skip to content» por teclado, foco visible y retorno al origen. `color-scheme: dark` y theme-color coincidentes, controles nativos oscuros explícitos. Mensajes completos es/en; no alterar inventario o premio al traducir. Animaciones transform/opacity y reducción/pausa existentes, sin añadir efectos. Importación JSON con nombre y autocomplete/spellcheck adecuados. No truncar reglas ni esconder errores. Fotografía, glassmorphism y capas de tarjetas sin función quedan excluidos.

## Auditoría previa Web Design Guidelines

- `src/ui/App.tsx:473`: falta enlace para saltar cabecera; añadir destino enfocable.
- `index.html:1`: theme-color #33243d no coincide con superficie #24131e.
- `src/ui/styles.css:1`: color-scheme no define el tema oscuro de controles nativos.
- `src/ui/App.tsx:811`: textarea JSON sin nombre ni autocomplete explícito.
- `src/ui/visual.css:454`: regla `.result-keepsake > .keepsake-art` también oculta el arte de ficha de álbum; limitar la supresión a la presentación que ya tiene cromo.
- `src/ui/visual.css:168`: interior grande junto con cabecera desplaza consultas fuera del primer viewport; medir y ajustar.
- `src/ui/styles.css:526`: marco y espacios del resultado retrasan su siguiente acción; reducir sin ocultar contexto.

Guías consultadas en revisión `434b7f91364665f2f733b310ec54809bf8f37937`, snapshot local en skill. Enlaces/rutas/URL de filtros: diferidos para I1, que conserva vistas de React y retorno de foco; no introducir router por un consejo genérico. Títulos en sentence case de español, no aplicar Title Case inglés mecánicamente. SVG decorativos existentes conservados según encargo; no instalar un paquete de iconos para sustituir tres símbolos.

## QA ejecutable

Tipos/contenido/unidad/build; regresión Chromium/WebKit; prueba de salto de contenido, foco, ficha ilustrada y posiciones de acciones a 390 × 844; revisión CLI antes/después de cinco vistas es/en, 320/390 y texto al 200 %. Error, agotado, arte ausente y movimiento reducido. Medir contraste y transferencia del build. No atribuir emulación a móvil real, ni declarar lector audible/valor A17 observado. Resultado y comandos se registran en REPORT.md después de ejecutar.
