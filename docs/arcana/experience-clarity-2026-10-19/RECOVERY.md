# Recuperación y resiliencia A92

## Implementado

RecoveryNotice ofrece Volver a entrar cuando el error es de sesión, también con pending. Comprobar/recuperar operación permanece separado. El nuevo acceso abre el login existente, sin otra cuenta ni petición económica. Mientras abre mantiene el botón montado para no invalidar su origen de foco. Aviso de pending también aparece en bienvenida después de recarga sin cookie.

Al recuperar al mismo propietario se mantiene la consulta/preparación existente; solo cambiar dueño o cerrar sesión provoca salida de contexto. GameController ya tiene exclusión de identidad y pending por dueño; no se reescribe. La sesión de otra cuenta no autoriza recuperar una key ajena. El navegador no importa saldos.

Cierres de libro, sabores y folio comparten CloseButton con SVG inline: no depende de descargar ui.clear/ui.pass. Se conservan botón, nombre localizado, Escape y retorno. No requiere fuente de imagen nueva.

SeasonalEvent usa un adaptador localizado: disponibilidad, oportunidad ya usada y condición tienen causas distintas; commit incierto sigue usando mensaje compartido de comprobación, no se declara rechazado. Intro ES corregida y nombre EN sin artículo impropio. Correo de ensayo e invitado mantienen sus límites reales.

## Comprobado sin navegador

recovery-clarity-a92: primer RED por módulos nuevos ausentes; segundo RED real4/10 por ausencia del acceso contextual con/sin pending ES/EN. GREEN10/10. Junto con recovery-notice-a75 y game-controller:50/50. Estos SSR/modelos no acreditan foco real o un login nuevo ejecutado.

## Validación preparada

A92 Linux: misma cuenta desde inspector con cookie perdida, cancelar/retornar, commit real de compra con respuesta abortada, recarga, rechazo de otra cuenta y recuperación de receipt exactamente una vez. Cuentas/mailbox a92-UUID aislados, correo ficticio y buzón local, no entrega externa. Casos de libros sin todas las imágenes y error estacional localizado, sin command al consultar. Pendiente del coordinador ejecutar CI e inspeccionar resultados.
