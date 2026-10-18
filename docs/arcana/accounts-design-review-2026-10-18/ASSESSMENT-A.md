# A77 · Assessment A · Revisión de diseño independiente

18 octubre 2026. Autor: subagente a77_design. Revisión independiente del detector; su salida no se ha consultado. Solo análisis y este documento, sin cambios en aplicación ni nuevos recorridos gráficos.

## Método y procedencia

Se leyó la skill Impeccable y su referencia critique, se cargó contexto mediante `impeccable context --target src/arcana/presentation/AccountAccess.tsx` y se contrastaron AccountAccess.tsx, App.tsx, GameSettings.tsx, accounts.css, account-messages.ts, UI.md, GALLERY.md y el contenido de las pruebas A76. Se inspeccionaron los píxeles de las tres capturas existentes con view_image. No se ejecutó detector desde este assessment, navegador, test gráfico, captura ni grabación nueva en el Mac.

HEAD revisado: `0f849bad6e36b694c5efc1515518a12c42fed85f`. Las capturas proceden de CI Linux39070225878, código `3f6e1223d7b9ada6cae55f50f7b2627f2c35100b`, merge `bc8c166ab38132c7c0e8e471a7206973c25dd151`, árbol idéntico según GALLERY. Son Chromium 390×844, ES/Diagon. No representan los otros tamaños/idiomas/packs. No se reinterpreta una captura estática como movimiento ni se atribuyen resultados a jugadores.

## Veredicto de especificidad y continuidad

La bienvenida conserva la ilustración protagonista del Callejón, la marca, el portal y el lenguaje de color. La carta de acceso conserva el azul tinta, dorado, tipografía titular y sobre ilustrado del juego. Es una adaptación coherente de una tarea de identidad, aunque los dos botones compactos de cuenta tienen menos especificidad que el portal invitado.

**Los campos convencionales no son un defecto.** Fueron autorizados expresamente para credenciales, y conservan etiquetas, autocompletado, pegado y control de contraseña. Sustituirlos por objetos sin etiquetas dañaría el acceso. Estas pantallas no son un dashboard: no tienen tablas, navegación administrativa o estadísticas permanentes. No se justifica rehacer su mundo visual ni añadir partículas o ceremonias.

La mayor oportunidad está en la coreografía de los pasos y la confirmación de que la partida quedó protegida, no en ornamentar inputs. No se ha demostrado mediante estas tres capturas un fallo que impida completar el recorrido, ni puede aprobarse visualmente todo el flujo con este conjunto de evidencia.

## Fortalezas

1. La bienvenida no sustituye el juego por una portada administrativa: el escenario ocupa la mayor parte de la superficie y las tres formas de entrar están nombradas.
2. El acceso utiliza un diálogo y foco visible, con campos reconocibles y autocompletado; existe una salida textual Volver además del icono. La captura del foco cian acredita su presencia, no un fallo ornamental.
3. La gestión se ubica en Ajustes, fuera del HUD. La captura con dirección ficticia larga demuestra wrap y mantiene visibles salida, recuperación y retorno. La explicación no afirma que cerrar sesión borre progreso.

## Hallazgos de diseño priorizados

### A-D01 · P2 · El éxito al solicitar código no cambia la acción principal

- **Evidencia comprobada por código:** AccountAccess.tsx:188–207 solo establece notice=mailSent. Las líneas423–443 mantienen el submit primario Crear cuenta o Enviar recuperación; Tengo el código sigue como enlace secundario en444–462. El test helper de registro conoce expresamente ese enlace y lo activa después de leer el buzón, tests/browser-accounts/accounts-a76.spec.ts:104–118.
- **Problema experto:** después de realizar una acción se sigue destacando volver a realizarla. La persona debe inferir que ha cambiado de etapa y encontrar la alternativa secundaria. La automatización demuestra operabilidad, no claridad de ese paso.
- **Cambio mínimo propuesto:** separar solicitud aceptada y entrada de código. Tras la respuesta genérica, presentar una única acción principal Continuar con el código, o avanzar al paso de código conservando Volver/cambiar correo y reenviar con jerarquía secundaria. Mantener respuesta genérica, no afirmar existencia de cuenta ni entrega externa.
- **Resultado esperado, todavía hipótesis:** menos solicitudes redundantes y una siguiente acción reconocible.
- **Aceptación posterior:** enviar una vez → estado genérico visible → siguiente acción principal inequívoca → introducir código/contraseña o regresar sin perder contexto; ES/EN, teclado, enlace vencido y reenvío. Comprobar que no cambian reglas de rate limit ni creación/vinculación atómica.
- **Cobertura:** no hay captura del estado mailSent; el hallazgo describe render/estado determinista, no un error de layout reproducido en navegador.

### A-D02 · P2 · Vincular termina sin una confirmación visible en el juego

- **Evidencia comprobada por código:** AccountAccess.tsx:159–168 carga el estado, llama onSession y cierra el diálogo; App.tsx:484–495 muestra identidad únicamente en Ajustes. Cuando se vincula desde Ajustes, el diálogo de Ajustes inferior puede quedar abierto; cuando se autentica desde bienvenida aparece el juego. No hay mensaje dedicado de vinculación finalizada en estos componentes.
- **Problema experto:** la persistencia es la finalidad de esta tarea. Cerrar la carta y cambiar un texto dentro de Ajustes es una confirmación débil, especialmente cuando el jugador sigue en el mismo mapa y no debe esperar otro kit. No implica que la vinculación falle.
- **Cambio mínimo propuesto:** una confirmación finita y localizada del tipo Partida vinculada, asociada a identidad mínima, con un único anuncio accesible. Para login utilizar Partida recuperada solo cuando carga y reconciliación hayan terminado. No repetir en cada recarga/consulta histórica ni añadir un HUD permanente.
- **Resultado esperado, todavía hipótesis:** mayor confianza en que ya puede recuperar la partida en otra sesión.
- **Aceptación posterior:** mostrar tras éxito confirmado y carga del mismo propietario; ninguna celebración ante respuesta incierta; un anuncio por acción, sin conceder recursos ni bloquear retorno.
- **Cobertura:** tres capturas no muestran el momento inmediatamente posterior. Afirmación limitada al flujo de componentes, no al audio de un lector probado.

### A-D03 · P2 · La comprobación del código pierde la referencia visible al correo utilizado

- **Evidencia comprobada por código:** AccountAccess.tsx:325–342 solo dibuja correo en registro/login/request-reset; verify/reset presentan código y contraseña en343–390. El estado email permanece en memoria pero no se muestra como destinatario. Los textos verifyTitle y token tampoco lo incluyen, account-messages.ts:20,27.
- **Problema experto:** la persona cambia al buzón y vuelve a una tarea sensible sin referencia visible de qué dirección estaba usando. Esto añade memoria innecesaria al corregir un correo o alternar varios buzones. No supone un fallo de autorización: el servidor determina la identidad del token.
- **Cambio mínimo propuesto:** contexto breve con el correo solicitado, cuando se conozca, y una acción Cambiar correo que vuelva al paso pertinente. Distinguir correo solicitado de identidad ya verificada. Si se abre Tengo el código sin correo previo, no inventar destinatario ni exigir un dato que no necesita el servidor.
- **Resultado esperado, todavía hipótesis:** menos confusión al cambiar de aplicación o corregir una dirección.
- **Aceptación posterior:** registro→código y recuperación→código conservan referencia correcta; entrada directa sin correo sigue disponible; no se toma esa etiqueta como autoridad de vinculación.
- **Cobertura:** render estático por código; ninguna captura de verify/reset disponible.

### A-D04 · P2 de presentación · Dos jerarquías distintas en la bienvenida

- **Evidencia visual:** selected-welcome.png muestra Crear cuenta como rectángulo dorado de unos168×48 px, Iniciar sesión como otro rectángulo de dimensión similar y el invitado como un portal ilustrado de casi todo el ancho y unos80 px de alto. App.tsx:511–540 y accounts.css:190–209 crean esa diferencia. UI.md declara invitado secundario.
- **Problema experto:** el orden y el relleno dorado priorizan cuenta, pero la masa, forma y asset hacen del invitado el objeto protagonista. Es una tensión de jerarquía, no prueba de que alguien elija mal. La decisión de probar como invitado sigue siendo válida y no debe ocultarse.
- **Cambio mínimo propuesto:** decidir una jerarquía explícita de entrada; si cuenta continúa siendo prioritaria, equilibrar los tres accesos dentro de la misma composición sin tres paneles equivalentes, conservando invitado fácil de encontrar. Probar primero tamaño/espaciado y agrupación con recursos existentes; no producir otro portal ni añadir texto promocional.
- **Aceptación posterior:** inspección comparada de bienvenida desktop/móvil y ambos packs; las tres rutas siguen accesibles, el CTA elegido se distingue por más de un indicador y el escenario conserva protagonismo.
- **Cobertura:** observado solo en ES/Diagon390. Conveniencia de la jerarquía necesita una comprobación humana, no se deduce de una tasa de clics inventada.

## Observaciones menores

- **P3:** la gestión de cuenta se apila sobre otro marco completo de Ajustes en selected-settings-account.png. Se conserva contexto y semántica; el doble marco consume atención y hace menos obvio si Volver vuelve a Ajustes o al juego. Se puede nombrar el destino o tratar cuenta como subvista de Ajustes en un incremento posterior, conservando foco y retorno. No cerrar el padre a ciegas mientras se confirma una operación.
- El texto de registro explica honestamente que el buzón es local. En request-reset la explicación previa es más escasa: el texto explícito No se envía correo por Internet solo aparece después mediante mailSent. Conviene mantener el límite de ensayo perceptible antes de solicitar recuperación. Esto no convierte SMTP externo en implementado.
- El código de correo usa maxlength64 y one-time-code. El tamaño real del token y el cambio al buzón requieren pegado; no se ha probado un gestor de contraseñas real ni interacción con teclado virtual. No presentar el atributo HTML como validación de esos productos.
- El icono de cierre superior no se reconoce claramente en las capturas aportadas. Volver sí está visible. No se clasifica como defecto funcional sin comprobar su geometría/contraste en el estado real; no eliminar foco cian para intentar corregirlo.

## Heurísticas · estimación experta, no medición de usuarios

Superficie mixta: Experience en bienvenida, Operate en identidad. Se puntúa la tarea completa de acceso; las diez heurísticas aplican.

| Heurística | 0–4 | Razón |
|---|---:|---|
| Visibilidad de estado | 3 | Busy/errores existen; falta cierre explícito de vinculación y guía de siguiente etapa. |
| Correspondencia con tarea | 3 | Correo/contraseña reconocibles; contexto ilustrado conservado. |
| Control y libertad | 3 | Cancelar, volver y cambio deliberado; anidación puede hacer ambiguo destino. |
| Consistencia | 3 | Tipografía/paleta/objetos comunes; mezcla de jerarquías en bienvenida. |
| Prevención | 3 | Validación nativa, exclusión busy y confirmación de otro propietario. |
| Reconocimiento | 2 | Código sin destinatario y continuidad del CTA dependen de inferencia. |
| Flexibilidad | 3 | Cuenta inicial, invitado, vinculación, recuperación, pegado y autocomplete. |
| Estética mínima | 3 | No dashboard; enlaces espaciados y dos marcos añaden peso moderado. |
| Recuperación | 3 | Errores/estado incierto tienen acciones; su presentación no está capturada. |
| Ayuda contextual | 2 | Límite de ensayo claro en registro; orientación posterior mejorable. |
| **Total** | **28/40** | Base coherente, mejoras concretas de continuidad. No certificación de usabilidad. |

## Carga cognitiva y recorrido emocional

- Bienvenida: tres decisiones de acceso, cantidad razonable; la competencia proviene de su jerarquía visual.
- Registro inicial: un campo y submit, con dos destinos secundarios y Volver. No necesita más ornamentación.
- Login con jugador: contraseña, mostrar/ocultar, recuperación, registro, cambio explícito, submit y volver pueden superar cuatro acciones visibles. Son mayoritariamente secundarias; deben agruparse por intención y estado, no eliminarse por cuota.
- Valle emocional previsto: salir al buzón y volver sin destinatario ni cambio evidente de paso. Es hipótesis experta, no observación de abandono.
- Final emocional previsto: comprobar que colección/progreso están protegidos; su comunicación debe ser breve y verificable, no un premio o un nuevo ritual.

## Personas como escenarios de revisión, no participantes reales

- **Jordan, primera visita:** podría interpretar que debe seguir pulsando Crear cuenta después de recibir mailSent. Se evalúa el siguiente CTA, no su habilidad para leer documentación técnica.
- **Casey, móvil interrumpido:** al regresar del buzón no ve el correo en verify/reset. El test no mide interrupciones reales ni el teclado virtual físico.
- **Sam, teclado/lector:** etiquetas, botones y foco están presentes. La doble capa modal y el anuncio único de éxito necesitan evidencia de secuencia de foco/announcements; no se ha escuchado un lector aquí.

## Cobertura visual pendiente

| Estado o variante | Captura inspeccionada | Qué sigue sin aprobarse visualmente |
|---|---|---|
| Bienvenida ES/Diagon390 | Sí | Desktop,865,EN,ARCANA; jerarquía comparada. |
| Registro inicial ES/Diagon390 | Sí | Resto de combinaciones, correo largo, error y envío. |
| Gestión ES/Diagon390 | Sí | Correo corto, otros packs, desenlace/logout y retorno. |
| Login | No | Distribución con contraseña, acciones secundarias y cambio de propietario. |
| Verificación | No | Código, contraseña, ayuda y CTA a escala real. |
| Solicitud de recuperación | No | Explicación previa, envío y siguiente acción. |
| Nueva contraseña | No | Ayuda, errores de código/caducidad y finalización. |
| Envío activo y respuesta incierta | No | Mensaje recuperable visible y control no competitivo. |
| Conflicto de propietario/pending | No | Riesgo de cambiar partida y claridad de la vía permitida. |
| Vinculación finalizada | No | Confirmación finita de progreso protegido. |
| Offline/arte ausente/texto ampliado | No | Aserciones técnicas no sustituyen su revisión compositiva. |

Los tests A76 recorridos por código comprueban funcionamiento y varias dimensiones DOM; el test de texto 200% mide el contenedor en reset y no acredita por sí solo todas las pantallas con texto ampliado. No ampliar ese resultado a una certificación global.

## Recomendación al coordinador

Conservar esta dirección y los campos nativos. Priorizar A-D01 y A-D02 en el siguiente ajuste de continuidad; verificar A-D03 y la intención de jerarquía A-D04. Antes de aprobar todo el diseño, obtener en Linux un conjunto seleccionado y acotado de los estados sin captura, especialmente login/código/recuperación/cambio de partida/estado incierto; no otra matriz exhaustiva de screenshots. Si no se ejecuta, el cierre debe declarar expresamente que solo tres estados tuvieron inspección visual. No se recomienda rehacer arte de personajes, marco del juego o efectos.

Preguntas para la posterior sesión humana: ¿qué acción identifica después de solicitar el código? ¿qué demuestra que su partida quedó vinculada? ¿entiende que abrir otra cuenta no fusiona el invitado? Son preguntas de observación pendientes, no gates externos inventados para esta revisión técnica.
