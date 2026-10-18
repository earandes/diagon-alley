# A79 · Cuentas sencillas dentro del juego

Se han replanteado crear cuenta, verificación, acceso y recuperación. Cada carta tiene un objeto ilustrado, un título, los campos imprescindibles y una acción principal. La ayuda contextual reúne alternativas y detalle. Desaparecen la salida duplicada, el botón de contraseña en una fila aparte y los párrafos permanentes de instrucciones. Las advertencias sobre cambiar de partida y los errores permanecen disponibles donde se decide.

Se conservan campos nativos por accesibilidad y gestores de contraseñas. El cambio está en la jerarquía y la cantidad de decisiones expuestas; no se sustituyen credenciales por acertijos, gestos o rituales. No se producen ilustraciones nuevas ni se añaden dependencias.

## Resultado observable

En la muestra móvil 390×844, la verificación pasa de 816 px (A78) a 604,23 px (A79), aproximadamente un 26% menos. Tenía seis botones expuestos; ahora tiene tres, contando salida y ojo, más una sola ayuda nativa. Crear cuenta requiere un campo, con dos botones expuestos. Acceso requiere dos campos, tres botones y ayuda. Las cinco tareas medidas muestran entre 14 y 26 palabras en ES por defecto; el detalle se consulta deliberadamente. No es una medida de comprensión humana.

El objeto y el título comparten eje central. Los campos quedan en segundo término y el sello dorado destaca la acción. La ayuda es una fila discreta con chevron, sin marco equivalente al CTA. Se conserva el escenario ilustrado y el vocabulario de cada paquete. [Diseño y recorridos](INTERACTIONS.md), [comparativas](GALLERY.md).

## Continuidad e integridad

Registro → código → cuenta, invitado → vinculación, login → misma partida y recuperación siguen usando A76/A78. Abrir otra partida exige la elección expresa existente y la advertencia de no fusión. Una respuesta de autenticación incierta reemplaza envío por Comprobar sesión; Enter no reenvía credenciales. Un código inválido abre su reparación. Cancelar vuelve al origen con foco y conserva la partida.

No cambia la autoridad, tokens, KDF, schema, partidas, snapshots, kit, inventario, economía o combate. El diff de runtime se limita a `AccountAccess.tsx`, `account-messages.ts` y `accounts.css`. No se cambia App, GameSettings ni GameController.

## Validación

CI39087507256 SUCCESS sobre head28186fa / checkout74ad009: 622 unitarios, 99 PostgreSQL/Redis, tipos/build/contenido/scanner/backup, 55 casos de navegador activos. Capturas finales seleccionadas inspeccionadas en ES/Diagon móvil, EN/ARCANA escritorio y ES/Diagon WebKit ampliado. No navegador local ni captura del Mac. [QA, fallos corregidos y límites](QA.md).

Faltan observación humana de la ayuda y del cambio de partida, dispositivo físico y entrega de correo externo. El buzón continúa siendo privado/local. La prueba técnica no acredita diversión, comprensión ni seguridad productiva completa.

Entrega en la rama existente y PR7 draft sobre A75. No se integra en main ni se despliega.
