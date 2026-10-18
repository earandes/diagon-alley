# A77 · Assessment B · Evidencia técnica de interfaz y cobertura

18 octubre 2026. Revisión independiente de B, sin consultar Assessment A. Baseline local `0f849bad6e36b694c5efc1515518a12c42fed85f`; los componentes de aplicación corresponden al candidato A76 probado anteriormente. Este documento es análisis: no cambia aplicación, pruebas, configuración ni estado del jugador.

## Método y límites

- Lectura de `AccountAccess.tsx`, `account-messages.ts`, `accounts.css`, integración en `App.tsx`/`GameSettings.tsx`, `Artwork.tsx`, pruebas A76 y su configuración. Contexto Impeccable cargado una vez y referencia critique leída.
- Detector CLI ejecutado **una sola vez**: `.agents/skills/arcana-impeccable/scripts/impeccable detect --json src/arcana/presentation/AccountAccess.tsx > .local/a77-detect.json`. Resultado JSON `[]`, cero findings, cero reglas/localizaciones devueltas. No hay falsos positivos que descartar. El alcance es ese TSX; no inspecciona por sí mismo el recorrido, la CSS en cascada ni la adecuación artística.
- Se inspeccionaron las tres imágenes Linux A76 ya existentes: bienvenida, registro y cuenta en Ajustes, todas Chromium 390×844/ES/Diagon. Procedencia en A76/GALLERY.md: código `3f6e122`, checkout merge `bc8c166`, árbol `c755d7d`. No son nuevas capturas ni acreditan los demás estados.
- **No se lanzó navegador, servidor, suite, overlay/inyección, captura ni reproducción local.** La inspección dinámica nueva corresponde a Linux bajo las protecciones del repositorio. Tampoco se ejecutaron pruebas unitarias en este assessment; se contrasta qué afirman las anteriores.
- Un detector limpio no demuestra calidad del diseño, foco correcto, WCAG completa, comprensión o diversión. No hay observación humana, lector hablado, gestor de contraseñas real ni dispositivo físico.

## Lo que sí conserva el contrato de interfaz

1. Credenciales con etiquetas reales, campos `email`/`password`, autocomplete, pegado sin bloquear y visibilidad explícita: AccountAccess líneas326–389. Es una excepción autorizada al lenguaje de objetos del combate; convertir estos campos en arte o gestos sería una regresión.
2. Un único acceso contextual en Ajustes; no se añade HUD permanente: App467–496. El correo y el estado se muestran fuera de ilustraciones.
3. Diálogo nativo, Escape interceptado, operación en curso excluyente y restauración al origen conectado: AccountAccess98–111,125–142,275–295. Los botones e inputs tienen objetivos CSS de44/48 px y foco visible: accounts.css67–105.
4. Desbordamiento vertical accesible y texto refluible: accounts.css3–7,91–96,159–162. En las capturas, la carta no tapa el significado de los campos y la cuenta ficticia larga se ajusta.
5. Los errores no se sustituyen por éxito optimista: error general `role=alert`, espera `role=status`, consulta de sesión para resultado incierto: AccountAccess496–506. La efectividad de todos sus estados aún necesita la cobertura indicada debajo.

## Findings para contrastar e integrar

### B01 · P2 · El envío de registro no conduce al paso de verificación

**Hecho de código:** tras respuesta válida, register solo fija `mailSent` y borra password (AccountAccess188–205). El paso sigue en register, el botón principal conserva «Crear cuenta» y vuelve a enviar; «Tengo el código» queda como acción secundaria (423–452). Request-reset repite el patrón (205–208,454–462).

**Problema experto:** el momento de éxito parcial conserva como acción dominante la operación ya realizada. La ruta es realizable, pero incita a reenviar en vez de continuar. Esto no es un fallo de persistencia ni una pérdida observada de usuarios.

**Cambio propuesto:** separar solicitar código de introducirlo. Tras aceptación genérica mostrar el siguiente paso principal y un reenvío secundario deliberado, conservando las respuestas antienumeración, email destinatario editable y contrato de tokens. No añadir animación ceremonial ni otro modal.

**Comprobación:** tras una solicitud solo una petición; el control dominante abre/verifica el código, reenvío distinguible; volver/cancelar no crea jugador ni consume. ES/EN, teclado y toque. El flujo A76 actual pulsa a propósito el botón secundario, por lo que no comprueba esta jerarquía (tests105–121).

### B02 · P2 · El formulario puede mantener contraseña visible al cambiar de tarea

**Hecho de código:** `showPassword` es estado único (89). `move` limpia password/token pero no restablece showPassword (116–124). Tras mostrar contraseña en login y entrar en recuperación, el nuevo campo password usa todavía `type=text` (368). El test de formularios hace precisamente show→forgot→reset, pero solo comprueba token/reflujo, no el estado del nuevo password (tests239–256).

**Problema:** la elección de revelar una contraseña anterior se propaga a una contraseña nueva sin acción explícita en ese formulario. Es un defecto de privacidad/expectativa de interfaz; no una afirmación de exfiltración.

**Cambio mínimo:** restablecer a oculto al cambiar de tarea y después de reset; mantener el toggle explícito/aria-pressed dentro de cada tarea.

**Comprobación:** mostrar en login→recuperar→introducir código: nueva contraseña oculta por defecto; el toggle sigue funcionando, no se pierde el autocomplete ni el pegado. Repetir volver a login y cambiar entre register/verify.

### B03 · P2 · Datos de sesión actualizados pueden dejar abierto el modo equivocado

**Hecho de código:** `openAccount` inicia refresh asíncrono y fija un modo a partir del estado anterior (App89–105,471–481). AccountAccess inicializa step una sola vez desde initialMode (85); el único ajuste posterior de sesión es manage→login cuando deja de ser account (112–115). No existe el ajuste register→manage al llegar una sesión vinculada.

**Escenario estático pendiente de ejecución:** dos pestañas del mismo invitado; una vincula la cuenta; la otra conserva el estado guest y abre «Guardar mi partida». La consulta puede devolver account pero el formulario permanece register. No es una afirmación de duplicación del inventario; la autoridad sigue protegiendo la asociación.

**Cambio propuesto:** resolver primero estado de acceso vigente, o reconciliar modos de manera explícita sin borrar credenciales/borradores por respuestas tardías. Los accesos de Ajustes deben coincidir con la sesión comprobada y mostrar espera breve cuando se está resolviendo.

**Comprobación:** guest→account en otra pestaña y account→logout/revocación; abrir Ajustes/cuenta en la pestaña antigua termina en gestión/login pertinente sin petición extra de registro ni pérdida de operación pendiente. Este escenario visual no está cubierto por el spec A76.

### B04 · P2 · Recuperación de código inválido/caducado carece de una salida directa contextual

**Hecho de código:** verify/reset muestran token/password, envío y «Iniciar sesión» (343–390,423–493). `move` borra notice (120) por lo que al entrar en verify/reset desaparece el único mensaje de entrega/caducidad; no se muestra el email destino ni un enlace de reenviar/volver a solicitud. El error genérico pide «solicita un nuevo código» (account-messages84–87), pero esa acción requiere login→register o login→forgot.

**Problema experto:** la instrucción de reparación no corresponde a una acción visible directa en el estado fallido. La caducidad está en el mensaje del buzón local, pero no en la pantalla donde se utiliza.

**Cambio propuesto:** conservar un contexto mínimo de destino/propósito, añadir volver a solicitud o reenviar pertinente, y explicar token inválido/caducado sin revelar si existe una cuenta. No exponer tokens en UI secundaria/logs.

**Comprobación:** token inválido/usado/caducado→error→solicitar otro→completar; password y token no se mezclan entre verificación/reset. Distinguir la prueba del buzón privado de entrega de correo por Internet.

### B05 · P3 / contraste visual pendiente · Cierre superior sin presencia en las capturas

Las capturas de register y manage no muestran un objeto reconocible de cierre en la esquina superior, aunque AccountAccess287–295 renderiza un botón icon-only con ui.pass y existe salida inferior «Volver». accounts.css41–55 lo posiciona absoluto sin z-index; el header posterior hereda reglas globales de header (`styles.css1859`) y debe comprobarse la pila/posición antes de atribuir una causa. `Artwork` devuelve null cuando falla (Artwork28), y el cierre no tiene alternativa visible, aunque sí nombre accesible. No se ha reproducido dinámicamente por B.

**Propuesta:** comprobar rectángulo/pintado/hit-test/foco del cierre sobre las nuevas capturas; corregir apilado si se confirma y dar fallback visible si se conserva ese objeto. No duplicar más salidas ni eliminar el foco cian. La prueba missing-art solo exige campos/envío/Escape/retorno (tests191–207), no visibilidad de ese control.

## Cobertura existente frente a cobertura pendiente

Los resultados A76 están documentados en QA.md: 30 casos específicos correctos/30 omisiones deliberadas, en dos tandas Linux cuyos SHA y equivalencia están separados. **No se suman como pruebas únicas.** La matriz completa corresponde a formularios; los recorridos de autoridad se muestrean en Chromium 390 para cada idioma/pack.

| Área nueva | Lo que comprueba el spec A76 | Lo que no acredita todavía |
| --- | --- | --- |
| Bienvenida | Abrir registro/login por teclado, invitado en el recorrido y cancelación sinPOST | Jerarquía/descripción visual desktop, tablet, ARCANA, EN; foco completo por Tab en bienvenida; continuación con sesión válida en retorno |
| Registro | Email/autocomplete; petición retenida excluye doble click/Enter; código válido y kit único en recorrido | Token inválido/expirado/usado en UI, reenvío, correo ya registrado como experiencia, cancelación entre envío y verificación, respuesta de registro perdida |
| Verificación | Token válido/password nueva y estado exacto tras entrar | Foco tras error; instrucción/acción para reparar; expiry visible; diseño200% de este paso específico (la prueba amplía reset) |
| Login | autocomplete actual/show; otro contexto recupera mismoestado; dueño incorrecto bloqueado con operación pendiente | Cambio explícito a otra cuenta con partida invitada y sin operación pendiente; rechazo de credenciales sin pending; comparación y lectura de advertencia; ausencia de cuenta sin poder enumerarla |
| Vinculación | Mismo jugador/partida/copias/run tras comprafixture, cancelación y recarga | Capturas de invitado→verificación→éxito; doble pestaña cambiando UI; presentación de cuenta ya vinculada/conflicto real en pantalla |
| Reset | Solicitud/buzón local/token válidos→login nuevo; otra cuenta no afectada | Inválido/caducado/reusado; respuesta perdida de reset en UI; antigua sesión revocada y orientación visual; contraseña visible heredada |
| Operación económica incierta | Commit real con respuesta abortada, cookie perdida+reload, otro dueño bloqueado, mismo recupera una sola vez | Respuesta de auth perdida (login/verify/logout); botón Checksession; salida/cancelación conservando estado incierto; UI con IndexedDB fallando |
| Conexión y servicios | Integración técnica en otros tests/documentos | Estado visualoffline al abrir y durante enviar; deadline15s visible; unavailable/rate-limit/reconexión y acción recomendada |
| Ajustes y foco | Abrir cuenta, Escape, volver a contexto; registro devuelve foco a origen en matriz | Cadena completa de Tab/ShiftTab; foco tras cambio de task/error/éxito/logout; dos modales con200% texto y tecladovirtual; lector hablado |
| Idioma/pack | Preferencias fijadas antes del formulario; strings de cuatro variantes | Cambio durante proceso en el diálogo, o cerrar→Ajustes→cambiar→reabrir: conservación explícita de paso/contexto/operación; no confundir variantes iniciales con transición probada |
| Responsive |6 proyectos: Chromium/WebKit×390/865/1280; reset al200% sin overflow horizontal | Captura/inspección artística de todos esos estados;320 px y viewport reducido por teclado virtual; contraste medido y objetivos reales de elementos superpuestos |
| Movimiento | Matriz con reducedMotion=reduce | Preferencia propia/sistema cambiada durante acceso; no hay animaciones nuevas que exijan coreografía, no se atribuye validación temporal conPNG |

La fixture de compra `purchaseFrogFixture` usa un endpoint real y cambia progreso de prueba (tests130–149). Acredita conservación exacta de estado tras identidad, pero no recorre por interfaz todas las acciones del álbum/tienda. Los recorridos existentes de regresión completan otros riesgos; sus resultados no sustituyen los estados nuevos de autenticación enumerados aquí.

## Adecuación visual contrastada

- La carta utiliza tipografía/Cinzel, sobre ilustración existente y medallón de carta; en las tres capturas se reconoce parentesco con Ajustes y no parece una nueva aplicación administrativa completa. La necesidad de inputs convencionales está autorizada; no es un finding en sí.
- La bienvenida aporta dos botones de cuenta sobrios y un portal invitado ilustrado. Que el portal sea mayor que crear cuenta puede competir con la jerarquía deseada, pero la preferencia no prueba una confusión. Debe contrastarse con Assessment A y capturas de otros tamaños antes de tratarlo como defecto.
- Colores propios de cuenta están hardcoded (accounts.css8–16,64,88,111–112,203–208) mientras ARCANA tiene tokens diferentes (content-packs/arcana/pack.json6–21). Ajustes ya utiliza esta familia azul compartida, así que **no se declara error de swap solo por no cambiar a verde**. Falta comparar el conjunto real en ARCANA. Si se desea tematizar, debe ser una decisión acotada de coherencia, no una reescritura de controles.
- En la captura manage se ven detrás los contornos de Ajustes: es apilado de diálogos nativos, no tres paneles interactivos equivalentes. La inercia semántica evita acceso al fondo; queda observar si una sola carta con retorno al estuche simplifica la lectura sin perder contexto.

## Orden recomendado de nueva comprobación

1. Capturar una muestra pequeña de login, envío→verify, error de token, cambio de partida ymanage en Linux, con uno/dos tamaños representativos; completar la comparativa pack/idioma sin producir una matriz de capturas indiscriminada.
2. Ejecutar casos nuevos de transición y error que faltan, con precondiciones declaradas y foco/operación observables. Separar fallos reales de oportunidades de estilo.
3. Corregir únicamente issues consolidados autorizados después de esta revisión; no tocar economía/renderer ni ampliar autenticación productiva por estética.

Questions skipped: este assessment técnico independiente se entrega al coordinador para consolidación; no inicia entrevista ni solicita decisiones al usuario.

## Apéndice B06 · P2 · Ajustes contextuales omiten el acceso de cuenta

**Contraste de código nuevo, sin reproducción dinámica.** `App.tsx` tiene tres instancias de `GameSettings`: la de cabecera (460–498) recibe `accountControl`; la del diálogo de nodo (738–745) y la del diálogo de preparación (1015–1022) no la reciben. `GameSettings` declara la prop opcional (25) y solo renderiza la sección de cuenta si existe (74). Por tanto, por la condición JSX, los Ajustes abiertos desde esos dos contextos no contienen «Guardar mi partida»/«Mi cuenta»/«Acceder a mi cuenta».

La cabecera no sirve de alternativa mientras permanece abierto el contexto modal: `header-pact.css`2–4 aplica `visibility:hidden` a `.game-shell:has(dialog[open]) > .game-header > .settings-trigger`. Además, los dos contenedores se abren con `showModal()` (`App`140 y162), por lo que su exterior queda inerte por semántica del diálogo nativo. No es necesario inventar una regla `inert` propia para explicar esa restricción.

**Alcance exacto:**

- Nodo seleccionado (duelo/jefe/Pacto/refugio/cofre/encuentro en el diálogo general): engranaje del nodo → Ajustes sin cuenta.
- Preparación modal abierta desde equipo/consumibles/retorno a nueva expedición: engranaje contextual → Ajustes sin cuenta.
- Preparación inicial **inline** cuando no hay run (`App`677–693): no introduce ese diálogo ni otra instancia; utiliza el engranaje de cabecera y sí recibe acceso de cuenta. No generalizar la omisión a toda preparación.
- Al cerrar el contexto y abrir Ajustes desde la cabecera, el acceso reaparece. No es un bloqueo permanente de registro/login ni prueba de pérdida de datos.

**Problema:** la misma acción «Ajustes» ofrece distinta capacidad de guardar/gestionar según desde dónde se abre, justo en momentos donde el jugador puede querer asegurar la preparación o colección. El contrato de un único acceso coherente durante el juego se cumple solo en cabecera.

**Cambio mínimo propuesto para fase de corrección:** proporcionar el mismo control contextual compartido a las tres instancias o centralizar la apertura del mismo estuche con gestión explícita de su pila/modal y foco. No añadir botones permanentes fuera de Ajustes, no copiar lógica de cuentas, no permitir cambio de propietario con operación incierta y no descartar borradores silenciosamente.

**Aceptación pendiente:** invitado y cuenta vinculada, desde mapa/preparación inline/preparación modal/diálogo de duelo y jefe: el mismo acceso pertinente aparece; abrir/cancelar retorna al engranaje correcto; no cambia formación, inventario o rama; pendientes mantienen bloqueo y propietario. ES/EN y ambos packs. El helper `accountFromSettings` del spec A76 sabe elegir un engranaje del diálogo activo (90–98), pero sus recorridos actuales no demuestran esta variante: en los casos usados no se abre la cuenta desde esos dos diálogos con la prop omitida.
