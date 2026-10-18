# A77 · Hallazgos consolidados

Baseline de aplicación0f849ba; no se ha modificado `src/`. A/B son evaluaciones independientes; este registro prevalece sobre sus apéndices. P2 significa problema localizado con alternativa disponible: no se ha demostrado pérdida de colección, apropiación de identidad o bloqueo permanente. La recomendación de corregir antes de merge es de calidad de recorrido, no una aprobación externa imaginada.

## F01 · P2 · Solicitar el código no conduce al siguiente paso

**Evidencia:** AccountAccess188–207 cambia notice pero no step. Los diagnósticos `registration-accepted` y `reset-request-accepted` conservan register/request-reset. El estado estable se confirma en una segunda pasada focalizada: no utilizar la primera PNG390 `mail-sent` como postenvío, pues mostraba Conectando. Ver QA.

**Problema:** después de enviar, el CTA dominante vuelve a solicitar el mismo código; «Tengo el código» sigue secundario. El test anterior conocía expresamente esa salida. Verify/reset tampoco muestran el correo destinatario. En EN, «Send recovery email» antes de solicitar sugiere entrega por Internet, que el ensayo no realiza; «Email token» es más técnico que «código» en ES.

**Cambio propuesto:** transición clara solicitud→introducción de código, con un único CTA de continuar/verificar y reenvío secundario deliberado. Conservar propósito y correo editable sin exponer tokens. Copy ES/EN equivalente («Solicitar código de recuperación»/«Request recovery code» y aclaración de buzón del ensayo). No cambiar respuestas genéricas, caducidad o autoridad.

**Resultado esperado / aceptación:** tras una petición se identifica el siguiente paso sin reenviar; continuar no emite otro registro. Correo/propósito visibles, volver conserva contexto, reenviar es explícito. La inicialización sigue ocurriendo una sola vez al verificar. Si se muestra caducidad, deriva del contrato/dato del servidor.

## F02 · P2 · La instrucción de recuperación no siempre tiene una acción correspondiente

**Evidencia:** código inválido muestra «solicita un nuevo código», pero verify/reset solo permiten envío, login y volver (AccountAccess343–493). Hay ruta indirecta login→registro o login→olvidé contraseña, no una acción contextual. El fallo de transporte de register muestra «Comprueba la sesión» sin ese botón: diagnóstico `registration-network-failure`, PNG390 `network-notice`, AccountAccess203/503 y account-messages125–128.

**Problema:** se pide una acción que no está disponible en esa pantalla. Comprobar identidad tampoco aclara si un correo de registro/recuperación se llegó a entregar. No se debe tratar igual perder una respuesta de autenticación y perder la respuesta de una solicitud de correo.

**Cambio propuesto:** volver a solicitud/reenvío dentro de verify/reset con destinatario/propósito conservados. Mensajes por acción: solicitud de correo incierta→reenvío deliberado; login/verify/logout inciertos→consulta de sesión y reautenticación del mismo propietario, como ya funciona. No añadir Comprobar sesión indiscriminadamente ni relajar exclusión de operaciones económicas.

**Aceptación:** inválido/usado/caducado→solicitar otro→completar sin reconstruir el recorrido; register/request-reset sin respuesta muestran una acción pertinente. Login con respuesta perdida continúa recuperando el mismo jugador. Ningún mensaje invita a cambiar de dueño de una operación pendiente.

## F03 · P2 · Mostrar contraseña se propaga a una contraseña nueva

**Evidencia reproducida:** Mostrar en login→Olvidé→Tengo el código deja `passwordType: text` en los tres proyectos. La PNG1280 `reset` muestra «Hide password» en un formulario nuevo y vacío. AccountAccess116–123 limpia password/token, pero no showPassword; el campo usa ese mismo estado en368. No se capturó una contraseña real visible ni se afirma exfiltración.

**Problema:** una elección de revelado de la tarea anterior se aplica a credenciales nuevas sin una nueva acción del jugador.

**Cambio / aceptación:** reiniciar visibilidad al cambiar de tarea y tras completar reset. Nueva contraseña oculta por defecto, toggle y aria-pressed correctos; conservar pegado, autocomplete y valores pertinentes. Probar ida/vuelta login→reset y registro→verify, ES/EN y teclado.

## F04 · P2 · Una sesión fresca puede abrir el formulario de una sesión antigua

**Evidencia reproducida:** una segunda página conoce el invitado antes de vincular. La primera lo vincula; la segunda abre Guardar. GET/session ya responde account, el acceso de Ajustes cambia a Mi cuenta, pero `bound-in-other-tab-mode` sigue `step: register`. Reproducido en tres proyectos; PNG1280 `stale-tab`. App89–105/471–481 y AccountAccess85/112–115.

**Problema:** una persona ya vinculada recibe otra vez Crear cuenta. La autoridad impide volver a apropiarse del jugador, pero la UI solicita una tarea incorrecta.

**Cambio propuesto:** resolver estado vigente antes de elegir modo, o reconciliar explícitamente la entrada con la sesión recibida. No pisar formularios por respuestas antiguas ni cambiar propietario durante una operación incierta.

**Aceptación:** guest→account en otra pestaña abre gestión o una transición pertinente; account→logout/revocación abre acceso. Respuestas fuera de orden no sustituyen datos vigentes. No se concede otro kit, pierde intención o reenvía una key con otro jugador.

## F05 · P2 · El cierre superior pierde lectura y hit-test en móvil

**Evidencia reproducida:** en Chromium 390, el centro del botón44×44 no devuelve el botón/descendiente (`closeControl.hitInside: false`) en todos los estados muestreados. El objeto de cierre no se ve en esas PNG. En1280 y865 sí es visible y el hit-test es true. Escape y Volver inferior funcionan; no es un encierro permanente.

**Fuente / hipótesis causal:** accounts.css41–55 coloca el cierre absoluto sin capa propia; la cabecera posterior recibe fondo/position por reglas globales de styles.css692/1859/2078. El apilado/solapamiento es la causa a contrastar al corregir, no una medición de pintado GPU.

**Cambio / aceptación:** reservar un área real para el cierre y corregir composición/apilado con selector local. Todo el objetivo cómodo de44 px debe ser reconocible y activable, sin tapar título; foco visible. Si falta ui.pass, mantener símbolo/texto visible además del nombre accesible. Sin sumar otra salida equivalente. Probar390 normal/ampliado, teclado, toque sintetizado y arte ausente.

## F06 · P2 · Ajustes no ofrece la cuenta en todos sus contextos

**Evidencia de código, no reproducción gráfica nueva:** cinco instancias de GameSettings: App460 recibe accountControl; App738 (nodo), App1015 (preparación modal), CommercePanel388 (forja/bóveda) y CardReveal295 (revelación) no. GameSettings74 omite la sección si falta esa prop. Header-pact.css2–4 oculta el gear de cabecera en diálogos/revelación; el fondo es inerte por showModal. La preparación inicial inline conserva el header y sí tiene cuenta.

**Problema:** el mismo Ajustes cambia de capacidades según dónde se abra. Hay salida cerrando el contexto; no pérdida de datos. A76 utilizaba el acceso de cabecera y no comprobaba este caso.

**Cambio propuesto:** compartir una única coordinación de acceso entre todas las instancias de Ajustes. Identidad mínima y acción pertinente según invitado/cuenta/pending. No crear una segunda bolsa, HUD o modal de autenticación independiente por instancia. Una operación pendiente sigue permitiendo únicamente recuperación por su propietario; los borradores de nodo/forja/revelación deben cerrarse o conservarse explícitamente al cambiar de cuenta.

**Aceptación:** abrir Ajustes desde mapa, preparación modal, nodo, forja/bóveda y revelación conserva estado/acciones coherentes. Consultar no gasta; cancelar vuelve al contexto/foco. Antes de mutar propietario, respetar pending y no dejar una quote de la cuenta anterior operable bajo otra identidad. Necesita prueba contextual nueva en el incremento de fix.

## F07 · P2 · El error de conflicto queda parcialmente fuera de la zona visible en390

**Evidencia reproducida:** `different-account-blocked` y `different-account-explicit` registran `alertInViewport: false` en390, true en1280/865. PNG390 `conflict`: email/contraseña, explicación, cambio, submit y enlaces empujan el error hacia el borde inferior. Hay desplazamiento accesible, sin overflow horizontal; no se afirma incumplimiento WCAG completo por este dato.

**Fuente:** AccountAccess398–493 y498–502 sitúa el error después de todo el formulario y enlaces. El foco continúa en la acción; role=alert no demuestra que una persona lo vea o lo oiga.

**Cambio / aceptación:** mensaje cercano al bloque que requiere reparación y antes del CTA pertinente; agrupar enlaces secundarios y evitar repetir la advertencia de cambio. Anunciar una vez; gestión de foco/scroll proporcional sin perder credenciales. En390 y texto ampliado, el fallo y su salida deben quedar localizables por vista y teclado; no esconder avisos o reducir indiscriminadamente fuentes.

## F08 · P2 · Campo y servidor no cuentan igual las contraseñas Unicode

**Contraste de código/estándar, sin escritura gráfica nueva:** AccountAccess370–371 usa minLength15/maxLength128 de HTML. passwords.ts36–40 cuenta puntos de código con `[...value].length`,15–128 y512 bytesUTF8. HTML min/maxLength cuenta unidadesUTF16, documentado por[MDN maxlength](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/maxlength) y[MDN minlength](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/minlength), consulta18octubre2026.

**Problema derivado:** ocho emojis fuera del BMP ocupan16 unidadesUTF16, pero8 puntos de código: el mínimo nativo no representa la regla del servidor.65 de esos caracteres son130 unidades, pero65 puntos: la entrada manual puede quedar limitada antes del máximo anunciado, aunque el servidor admite esa longitud. Se ha calculado la diferencia; no se presenta como una prueba de pegado/autofill en navegador o dispositivo físico.

**Cambio / aceptación:** misma unidad de longitud y mensajes funcionales en cliente/servidor, conservando exactamente la política15–128 puntos/512 bytes, KDF y credenciales existentes. No truncar, normalizar o recortar contraseñas. Casos BMP/noBMP, límites14/15/128/129, escritura/pegado/autofill, mostrar/ocultar, ES/EN; entrada válida según política no se bloquea por otro contador y rechazo explica la regla. Si se usan mensajes nativos, comprobar su idioma frente al ajuste de la app. Prueba nueva del fix pendiente, no se ejecuta una tercera tanda gráfica en esta auditoría.

## Hipótesis de diseño, separadas de los defectos

**H01 · Confirmación de vinculación:** existe Mi cuenta/email y texto vinculado al volver a consultarla. No es cierto que no haya ninguna confirmación. Se propone comprobar si basta ese cambio para percibir que los cromos están protegidos; un acuse breve postcommit podría ayudar. No recompensa, ritual obligatorio o confeti.

**H02 · Jerarquía inicial:** la cuenta es el primer botón dorado, pero el portal invitado tiene más tamaño/identidad de juego. Es compatible con jugar primero sin fricción. Contrasta con la declaración A76 de invitado secundario, pero no demuestra mala comprensión. Elegir una jerarquía intencionada antes de retocar: no hacer tres paneles iguales ni disfrazar inputs de credenciales.

## Conservar

Escenario, carta azul/oro, símbolos por pack, tipografía, etiquetas nativas, pegado/autocomplete, contraste sólido, foco cian, scroll accesible, selección explícita de otra partida y continuidad real del mismo jugador. No rehacer personajes, fondos, arena, apertura, economía o autenticación para corregir estas interacciones.
