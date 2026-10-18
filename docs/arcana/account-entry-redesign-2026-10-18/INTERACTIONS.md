# A79 · Una tarea en cada carta

## Composición elegida

El álbum de creación, el mapa de acceso y la carta de verificación pertenecen al mismo vocabulario de objetos que utiliza el juego. Se reutilizan las ilustraciones de cada paquete. Ocupan la cabecera, con el título debajo y una única salida independiente del arte. Los campos conservan etiquetas y autocompletado: su familiaridad es necesaria para entrar y usar un gestor de contraseñas.

No se eligió separar correo y contraseña en pantallas sucesivas. Eso reduciría campos por vista a costa de más pasos y más navegación. La carta actual conserva uno o dos campos necesarios y reduce las decisiones expuestas.

## Jerarquía y navegación

| Contexto | Acción principal | Ayuda contextual |
| --- | --- | --- |
| Crear cuenta | Solicitar código | Iniciar sesión, introducir un código existente, detalle del ensayo |
| Verificar | Verificar y guardar | Solicitar otro código, detalle de entrega y contraseña |
| Iniciar sesión | Iniciar sesión | Recuperar acceso, crear cuenta y, cuando procede, cambiar expresamente de partida |
| Recuperar | Solicitar código de recuperación | Introducir código existente, volver a iniciar sesión |
| Cambiar contraseña | Guardar nueva contraseña | Solicitar otro código y consultar ayuda |
| Mi cuenta | Consulta de vinculación | Recuperación y cierre de sesión deliberado |

Una sola ayuda nativa `details/summary` por tarea. No es una segunda pantalla ni un árbol de menús. El resumen explica qué contiene. Los botones secundarios se muestran al solicitar esa información. Cambiar de tarea restablece la contraseña oculta y conserva el correo pertinente.

## Información que permanece visible

Nombre de la tarea, etiquetas, política breve de contraseña nueva, destinatario cuando se conoce, errores, confirmación genérica de solicitud y limitación «Ensayo local. Sin correo externo». No se promete entrega por Internet. La explicación larga del buzón y la caducidad continúa disponible a demanda.

Antes de abrir otra partida se muestra la advertencia de no fusión y la elección expresa existente. Una operación pendiente conserva la restricción al mismo dueño. Un error de código o propietario abre la reparación apropiada. La concisión no oculta estas consecuencias.

## Incertidumbre y accesibilidad

Si no llegó la respuesta de autenticación, Comprobar sesión sustituye al botón de envío. Enter no vuelve a autenticar. No hay dos acciones principales equivalentes. Las operaciones y el resultado siguen perteneciendo al servidor.

Una salida superior, ojo junto a la contraseña, foco visible, etiquetas reales, `current-password`/`new-password` y `one-time-code`. El desplegable conserva interacción nativa por teclado. No nuevos temporizadores, animaciones, audio, drag o esperas ceremoniales. Reducido conserva exactamente el mismo recorrido.

## Recursos

No se produce arte nuevo. `Artwork` resuelve `ui.collection`, `ui.map`, `ui.missions` y `ui.seal` por paquete. La ausencia del objeto decorativo no elimina títulos ni acciones. Flecha y ojo son glifos funcionales SVG inline, con fuente editable en `AccountAccess.tsx`; no son ilustraciones, sprites ni un rig.

## Hipótesis para la sesión humana

1. La tarea y el siguiente paso se reconocen sin leer una explicación extensa.
2. Una persona encuentra la alternativa de acceso o reparación en el resumen contextual sin ayuda del observador.

Observar solicitar código → verificar → reparar un código inválido; entrar y localizar recuperación; guardar una partida invitada y explicar qué ocurriría al abrir otra cuenta. No dar instrucciones de localización. Los tests técnicos no prueban estas hipótesis.
