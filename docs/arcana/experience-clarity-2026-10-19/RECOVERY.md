# Recuperación y resiliencia A92

## Implementado

RecoveryNotice ofrece Volver a entrar cuando el error es de sesión, también con pending. Comprobar/recuperar operación permanece separado. El nuevo acceso abre el login existente, sin otra cuenta ni petición económica. Mientras abre mantiene el botón montado para no invalidar su origen de foco. Aviso de pending también aparece en bienvenida después de recarga sin cookie.

Al recuperar al mismo propietario se mantiene la consulta/preparación existente; solo cambiar dueño o cerrar sesión provoca salida de contexto. GameController ya tiene exclusión de identidad y pending por dueño; no se reescribe. La sesión de otra cuenta no autoriza recuperar una key ajena. El navegador no importa saldos.

Revisión final de foco: el botón de recuperación desaparece tras reconciliar la sesión. El cleanup anterior intentaba enfocar content fuera del inspector todavía modal. Se conserva el diálogo que contenía el origen y, si el botón ya no existe, se devuelve el foco a su control estable. Cancelar sigue devolviendo al botón de recuperación. El destino incorrecto se contrastó por código; la aserción de foco dentro del inspector y el retorno al cancelarlo pasan en Linux en los cuatro pares idioma/pack del caso A92.

La regresión A76 permitió contrastar una segunda causa: al recuperar una compra, el controller publica el receipt durante finishIdentityChange, antes de la última consulta de sesión y del cierre de acceso. CardReveal podía admitir entonces su diálogo por encima del acceso. App admite una apertura nueva únicamente fuera de AccountAccess; conserva en estado de presentación solo playerId/receiptId admitidos. No se mueve el commit ni se oculta un resultado económico confirmado. Una apertura previamente admitida permanece montada al abrir sus propios Ajustes/Cuenta, evitando perder el contexto al cancelar. Este estado no concede, persiste o recupera inventario.

La prueba de respuesta perdida retiene ahora deliberadamente la última respuesta de sesión: exige acceso visible y ninguna revelación nueva por encima; después libera la respuesta y exige el resultado recuperado. Desde ese resultado abre Ajustes/Cuenta y cancela conservando ambos contextos. A76 cierra explícitamente la revelación fresca antes de cerrar Ajustes con Escape, manteniendo todas sus comprobaciones de una operación/un propietario/un receipt. Esta ampliación pasa en CI39323571082 sobre6747f81. No se presenta el contraste de fuente como una reproducción humana ni como un RED gráfico ejecutado localmente.

Cierres de libro, sabores y folio comparten CloseButton con SVG inline: no depende de descargar ui.clear/ui.pass. Se conservan botón, nombre localizado, Escape y retorno. No requiere fuente de imagen nueva.

SeasonalEvent usa un adaptador localizado: disponibilidad, oportunidad ya usada y condición tienen causas distintas; commit incierto sigue usando mensaje compartido de comprobación, no se declara rechazado. Intro ES corregida y nombre EN sin artículo impropio. Correo de ensayo e invitado mantienen sus límites reales.

## Comprobado sin navegador

recovery-clarity-a92: primer RED por módulos nuevos ausentes; segundo RED real4/10 por ausencia del acceso contextual con/sin pending ES/EN. GREEN10/10. Junto con recovery-notice-a75 y game-controller:50/50. Estos SSR/modelos no acreditan foco real o un login nuevo ejecutado.

## Validación Linux ejecutada

A92 Linux: misma cuenta desde inspector con cookie perdida, cancelar/retornar, commit real de compra con respuesta abortada, recarga, rechazo de otra cuenta y recuperación de receipt exactamente una vez. Cuentas/mailbox a92-UUID aislados, correo ficticio y buzón local, no entrega externa. Casos de libros sin todas las imágenes y error estacional localizado, sin command al consultar. Los cinco casos de recuperación A92 y los dieciséis casos de sistema A92 pasan en el candidato6747f81; procedencia y resultados en QA y evidence/candidate-6747f81. La batería integrada completa mantiene su estado separado en QA.
