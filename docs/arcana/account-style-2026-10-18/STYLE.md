# A80 · Dirección y aplicación de skills

## Intención

El acceso debe parecer correspondencia y registro de una aventura del Callejón. La ilustración identifica la tarea; el papel permite escribir con claridad; la única acción confirma. La identidad visual procede de composición y materialidad, no de más instrucciones o botones.

## Aplicación concreta

- **Game UI/UX**, SKILL y layout-and-flow: dos zonas en flujo para escritorio, apilado a640px, sin coordenadas absolutas o gestos obligatorios. Cabecera conserva salida; labels, foco y diálogos nativos mantienen navegación. No polling, reloj o renderer añadido.
- **Impeccable**, bolder y craft-floor: el esqueleto A79 era una tarjeta de formulario con icono; se amplifica el objeto y se separan cubierta/tarea. Se conserva el mundo existente y el texto. Una revisión visual por lote y, si hace falta, una confirmación.
- **fantasy**: tokens locales, estados explícitos y calidad verificable. Se descartan sus fuentes y paleta genéricas porque la dirección vigente usa Cinzel y los materiales ilustrados existentes.

El cargador de contexto Impeccable ya se había ejecutado en esta sesión; no se repite. No se usa Imagegen, API con créditos, navegador del Mac, motor nuevo o MCP solo por disponibilidad. Las herramientas útiles aquí son inspección de SVG/CSS, pruebas reales y evidencia Linux seleccionada.

## Tokens y anatomía

| Token local | Valor | Uso |
| --- | --- | --- |
| paper | #faecc7 | Hoja, tomado del papel de las props ilustradas |
| ink | #132438 | Tinta y cubierta azul vigente |
| accent | #392047 | Ciruela de álbum/carta; CTA y enlaces |
| muted | #58452d | Texto secundario legible sobre papel |
| focus | #164f65 | Trazo oscuro contrastante sobre papel |
| error | #76312d | Error sobre soporte claro |

Objetos existentes por tarea: `ui.collection`, `ui.map`, `ui.missions`, `ui.seal` en gestión. Diagon usa props512 SVG, ARCANA iconos256 SVG; el contenido de cada paquete no cambia. Tamaño de objeto168px en escritorio frente a76px A79,100×88px con contain en móvil. No se estiran las ilustraciones. El título sigue en Cinzel y los controles en tipografía funcional. El pequeño check del botón desaparece porque no comunica una elección seleccionada en este flujo.

La hoja conserva uno o dos inputs nativos. Subrayado y caret indican dónde escribir; foco de3px, ojo44px, CTA≥52px y ayuda≥44px. La cubierta conserva foco claro. Hover aclara únicamente ojo/enlaces; CTA se oscurece. No movimiento perpetuo o celebración por introducir credenciales.

## Estados y continuidad

Se mantienen `disabled`, `aria-busy`, error, ayuda expandida, operación incierta y gestión. Un código inválido abre reparación; una autenticación incierta conserva únicamente Comprobar sesión. Consultar/cancelar sigue sin gastar. No modificaciones de mensajes, propiedad, recuperación, tokens, economía o persistencia.

El texto importante permanece fuera del arte. Si falta un objeto, los campos, título y salida siguen operando. No nueva ilustración ni fuente/editable que registrar: se reutilizan consumidores y registros de los paquetes. Fuente editable de la nueva composición: `accounts.css`; consumidores: AccountAccess, sin variación del resto del juego.

## Hipótesis humana

La diferencia de cubierta y hoja debería hacer que el acceso pertenezca al juego sin dificultar escribir o reconocer la acción. No se da por validado con un detector. Observar localizar ayuda, recuperar un código y explicar qué partida se abre al entrar con otra cuenta. Móvil físico/teclado virtual y lector hablado pendientes.
