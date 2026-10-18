# A85 · QA y límites (en curso)

Baseline557ee0f. Protecciones de Mac intactas. No se abrió navegador ni generaron capturas locales. Preflight `npm run test:browser:check` permitió el smoke, pero no se ejecutó: carga2,04/11CPU y WindowServer67,9MB. No es una medición de IOSurface o garantía futura del compositor.

## Ejecutado

- RED de3 pruebas de acabado y2 de comportamiento de combate; archivos de error conservados en el registro local. Las pruebas iniciales puras de conteo se añadieron junto a la función, no se atribuyen retrospectivamente a RED.
- Tipos correctos en las revisiones registradas; build correcto con aviso de chunks>500KB, sin umbral debilitado.
- Dominio/UI: primer completo648 con4 fallos contractuales; referencia A84 explícita y fallback legacy corregidos; segunda pasada648/648. Ampliación posterior651/651; nuevas pruebas de UI, contribución y Pimienta pasan focalizadas. Candidato77013d7:654/654 pruebas en99 archivos. Revisión posterior con corrección de mapa y prueba adicional de derechos:654/654 de nuevo.
- PostgreSQL/Redis reales: primera ampliación102 con3 fallos (uno por versión nueva, dos por consulta indebida al contenido live). Corrección causal y segunda batería **102/102** en17 archivos; revisión posterior con prueba adicional de derechos únicos **103/103** en17 archivos. No se relajó recuperación: un snapshot válido vuelve a prescindir del proveedor live. Solo filas ficticias propias `a85-<UUID>`, borradas al acabar.
-128 grafos generados: tres candidatos distintos de casa no inicial se pueden reunir por aristas válidas antes de combatir; también se comprueba catálogo30, pesos/estadísticas idénticos y rechazo de variantes mal configuradas.
-1152 escenarios de aplicación/motor con transacción doble en memoria,32 semillas emparejadas por escenario,36 grupos. [Script](../../../tools/verification/simulate-houses-a85.mjs), [datos](simulation.json). No son SQL, comportamiento humano o prueba de diversión. Sin grageas, condición inicial completa, política voraz pública, refugios de PV y encuentros pasados. Las tres compras son resultados controlados de ensayo al precio real, no probabilidades observadas.

## Pendiente obligatorio antes de cerrar

CI Linux serial del candidato corregido, evidencia gráfica seleccionada, inspección de composición/movimiento y corrección de lo que falle. Tipos/build/unidad654/SQL103 y scanner del código corregido pasan localmente; no acreditan todavía el resultado gráfico. No se declaran estos puntos ejecutados por existir un spec.

Se reutilizan guard/bloqueo/watchdog/unworker/cero retries y la etapa A69 vigente. Nuevo harness A85 es explícitamente presentación ficticia, sin endpoints de concesión ni cuentas reales. La revisión inicial acota tres pares; la corregida verifica los seis pares Chromium/WebKit ×1280/390/865 para la nueva interfaz, ambos paquetes e idiomas; sin paralelismo ni reintentos. Fuente de la ruta A73 nueva en `a85-route-seed0.json`; la referencia A84 permanece intacta y regenerable con su configuración anterior.

Humana/dispositivo físico, lector hablado, percepción artística, diversión, balance y retención quedan pendientes. Intervalos rAF no son tiempoGPU; capturas estáticas solo demuestran composición.

## Primera CI y correcciones causales

CI39135801556, fuente77013d7: **fallida**. A75:1 fallo de comparación; A70:1 fallo de ruta; A68:6 fallos de ruta; A69:9 fallos nuevos de UI. Regresión posterior omitida por dependencia. AudioA84 y las pruebas anteriores de movimiento pasan en la etapaA69; la etapa global permanece roja porA85. La secuencia del workflow continúa tras un error: estar ejecutando una fase posterior no prueba que las anteriores hayan pasado. Se corrigió expresamente una comunicación de progreso que había confundido esos estados.

- A75: el hash del BattleLog emparejado pasó de uno a dos porque el harness actual incorporaba reglas2/casas mientras la referencia conserva1. No se elimina el assertion: la fixture A70 emparejada usa explícitamente el perfil ejecutableA84; el nuevo perfil se comprueba aparte enA85. Las primeras medidas16,7–16,8ms quedan como muestras de contenidos distintos, **no comparación válida de rendimiento**.
- A70: `house-band` interceptaba el toque de `pasaje:1:0` disponible en una ruta real. Se reserva la altura medida del HUD antes de `fitMapLayout`; no se usa `force`, no se deshabilitan eventos de sus controles ni se ocultan nodos. Nuevo assertion `elementFromPoint` comprueba las acciones disponibles en una ruta ya iniciada.
- La siguiente muestra añade disclosure de casa activa del jefe, lectura del libro en toda la fila, trayectorias observadas durante replay y pruebaSQL de derechos únicos al pasar de contenido táctico2→3 (engine1→2). La clave se mantiene una sola vez;4/4 casos focalizadosPG correctos.

Pendientes al registrar: errores completos deA68/A85, evidencia, candidato corregido y CI final. No se atribuye éxito global al primer envío.

- A68 confirmó la misma intercepción de `house-band` en seis contextos; no hay evidencia de un fallo independiente del progreso estacional. Su regresión sigue siendo obligatoria.
- Álbum: el contenedor nuevo del foil ocupaba todo el ancho del diálogo y tapaba el cierre. Se ciñe a la anchura del retrato y el control de cierre queda por encima, manteniendo toque y foco; no se usa clic forzado.
- SpecA85: la consulta de Hufflepuff comprobaba por error el primer detalle (Gryffindor cerrado), y el selector de libro era ambiguo con el libro de grageas. Se dirigen a la casa y nombre accesible elegidos, conservando las exigencias. Se acota cada acción a10s para no esperar180s ante una intercepción, sin reintentos de suite.

## Segundo candidato218389c · CI39138141861 (todavía en curso al registrar)

A75 supera el emparejado con un solo hash; se conservaron las seis muestras y tareas largas57–62ms. A68/Halloween pasa, confirmando que se recuperó el toque de ruta sin forzarlo. A70 detecta un nuevo defecto móvil real: el summary del tarro solo tiene ratio visible0,602764 en390×844 ES/Diagon al añadir casas; se conserva la expectativa de ratio1 y posición por encima del pie de combate.

Corrección siguiente: los medallones propios comparten estante con el título del equipo en móvil, con iconos/conteos compactos, nombres accesibles y detalle a demanda. No se ocultan integrantes, PV o controles, ni se reduce la ilustración. El specA85 de cinco integrantes añade la misma aceptación del tarro y preparación. A69 y regresión global siguen pendientes al registrar; no se declara éxito del candidato218389c.

A69 del segundo candidato termina sin error de specA85; la ejecución global sigue fallida porA70. Se inspeccionan mapa y cierre encantado, y la muestra de jefe reproduce necesidad de reordenar estantes. Las capturas de arte normales deben esperar a imágenes cargadas: se añade barrera de carga explícita para los cinco retratos antes de juzgar la composición, sin confundir esa espera del test con latencia del producto.

Se detectó por código otro riesgo de consulta: dos `details` de casa podían abrirse a la vez sobre la misma posición del HUD. Agrupación nativa exclusiva por instancia deHouseBand (`name` conuseId), y prueba de teclado que abre otra casa y comprueba el cierre de la anterior. No afecta regla o estado persistido.

CI39139599667 se canceló deliberadamente durante pruebas no gráficas, antes de iniciar navegador, para comprobar el candidato completo con esa corrección; no se presenta como fallo ni éxito de producto, ni como reintento del mismoSHA. El guard, bloqueo, límites y cero reintentos de suite permanecen intactos.

La segunda faseA70 paró según fail-fast original:23 casos pasaron, uno falló y114 no se ejecutaron. A69 terminó59activos correctos y19saltados por alcance de sus muestras; A68 terminó12/12. No se cuenta una fase omitida como superada. El candidato066037c enCI39140382374 conserva todos esos controles y añade aceptación completa del tarro más exclusión de consultas.

CI39140382374/066037c: el estante resuelveDiagon, peroARCANA/ES aún termina el control14,28125px por debajo del inicio del pie (771,28125frente757). Contraste deCSS: `styles.css` aplica `details { margin:20px 0 }`; los medallones nuevos no reiniciaban ese margen, añadiendo40px invisibles por fila. Se elimina ese margen únicamente enHouseBand; summary mantiene44px, sin el rectángulo genérico de formulario y con foco/indicador activo propios. No se encoge la figura ni el texto. Las imágenes de mapa mostraban ese espacio vacío; su reserva geométrica sigue midiendo la altura real, ahora menor. A68 también falló en esaCI; su causa sigue pendiente de leer, sin atribuirla por intuición a la misma regla.

### Causas completas del cuarto candidato066037c

- A68: snapshot muestra Refugio disponible dentro de **Consultar ruta**, sin confirmación. `MapPanel` trataba `available && !ready` como si fuera bloqueado y abría el inspector. Ahora la acción disponible permanece nativamente deshabilitada mientras finaliza la operación; los nodos bloqueados conservan consulta y el libro ofrece consulta explícita. No se toca avance, economía o persistencia. PruebaSSR semántica con doble de renderer (no navegador): primera fixture era inválida por no tener líder; corregida, se observó RED real por ausencia de `disabled`, despuésGREEN. Nuevo casoLinux controla el estado ocupado de forma determinista, consulta bloqueados y libera la acción deliberadamente.
- A69: los dos5×5 móviles, Chromium/WebKit, conservaban44,47/45,47px de solapamiento con el pie. Además de quitar el margen heredado40px, afinidad y casa activa del rival comparten fila táctica en móvil. Se conservan nombres, tamaños de figura y controles44px. No se modifica el umbral de aceptación.
- La consulta exclusiva de casas y la carga de cinco retratos no fallaron; se mantienen. Candidato corregido:655 unitarias/100archivos y tipos/build/harness locales correctos; nuevaCI completa pendiente. Los103 casosPG/Redis del contrato inalterado siguen siendo evidencia previa, y se vuelven a ejecutar enCI.

## Candidato19603c7 · seguimiento deCI39142672831

A70 completa su fase sin fallos yA68 también pasa. Se inspeccionaron las capturasA71 nuevas de preparación móvil de ambos paquetes (cuentas aisladas, autoridad real). Las imágenesA70 originales también viajan en el artifact como historia: no se confundieron con la escena actual, pues la configuración redirige la captura explícita aA71. Checkout de esosJSON:ca475dbc8443910eb5199dcfed5c538cd0875619. A69 yregresión final todavía en curso al registrar; no se declara cierre global.

## Quinto candidato19603c7 · CI39142672831

A70 yA68 completos correctos. La acción de mapa ocupado también pasa en su caso determinista. A69 conserva únicamente dos fallos: Maestría5×5 a390px, control8,203125/9,1875px bajo el pie. No se acepta ese solapamiento por ser pequeño.

Siguiente ajuste acotado a cinco integrantes en móvil: objetos de preparación44px, tarro32×40, margen superior del objeto de equipo2px y separación del héroe2px. Retratos72px, figura160px, nombres, PV/PM y áreas de44px se mantienen. Tres piezas (varita/escoba/gragea) caben en una fila, con iconos decorativos14–18px dentro del retrato-botón accesible. No se elimina información.

Se refuerza la fixture deMaestría: cinco pares de equipo válidos y cinco grageas asignadas, equipo refrescado por el caso de uso compartido, snapshot de desafío correcto. El pie anterior usaba botones genéricos deQA; ahora reproduce las mismas clases, objetos, coste y etiquetas delApp. Es una corrección de fidelidad del ensayo, no un cambio de operaciones productivas. La fixture sigue sin conceder/consumir recursos reales; los recorridosA70/A71 ySQL comprueban ese contrato por separado. Se mantiene el assertion de control completamente encima del pie, ambos paquetes/idiomas/motores/tamaños.

## Sexto candidato cdc909f · CI39146932044

Tipos, build, scanner y compilación del harness QA correctos localmente. Distribuido:16.335.769 bytes; aviso de chunk grande conservado. La suite de unidad sigue en655 casos/100 archivos; los contratos de backend no cambiaron frente a la revisión SQL103. EstaCI vuelve a comprobarlos y ejecuta las fases gráficas originales antes de habilitar regresión. No se anticipa su resultado.

La etapa A70 terminó correctamente en el sexto candidato. Se descargó el artifact por su runID39146932044 a una carpeta temporal nueva, se contrastó SHA `6b153fb63bcbe4b15f0f5f4ca59775c333970de0` y se inspeccionaron las capturasA71 móviles actuales de ambos paquetes. Preparación/cancelación conectadas conservan recursos yreceipt; no se usaron PNG históricosA70. Halloween yA69/regresión todavía pendientes al registrar.

## Resultado del sexto candidato y corrección de composición

CI39146932044/cdc909f: A75/A70/A68 pasan; A69 termina58 correctos,24 saltados y2 fallos (Maestría390 de ambos motores); regresión omitida. Con todas las grageas y el pie productivo fiel, el control termina786,28125/787,28125 frente al pie752:34–35px de solapamiento. La compactación anterior no bastó; no se presenta como corrección validada.

Cambio mínimo siguiente, solo cinco integrantes en móvil: libro del rival y vista de botín comparten una fila bajo las figuras mediante grid, conservando ambos contenidos y controles. El inspector abierto recupera todo el ancho y desplazamiento accesible. No se reducen retratos, PV/PM, nombres o figuras. Nuevo ensayo abre/cierra el libro por teclado y conserva foco y cinco fichas; se conserva el assertion estricto de no solapamiento. Una captura seleccionada y cajasDOM se escriben antes del assertion para conservar evidencia también si falla, sin añadir captura masiva, vídeo o perfil. Tipos/build/harness/scanner locales correctos; nuevaCI todavía necesaria.

Se intentó añadir un gate temprano de diagnóstico para evitar fases largas antes del caso denso. GitHub rechazó el push por falta de scopeOAuth `workflow`. Se revirtió íntegramente ese cambio propio sin modificar credenciales o configuración global; el workflow final y sus controles siguen idénticos al vigente. La corrección de composición se valida por la batería completa original. No es una prueba gráfica ejecutada ni un éxito de ese gate.

## Candidato e352a2e y fidelidad del ensayo denso

CI39150545527: el job `check` completo pasa, incluidaA69 con el estante compartido; la regresión se canceló deliberadamente durante instalación de navegadores, antes de abrir su batería. No se presenta la ejecución global como superada.

La inspección de la captura seleccionada descubre que el harness denso, aunque tenía clases y unidades válidas, no cargaba `node-event-dialog.css` deApp. Su confirmación heredaba la cuadrícula antigua, no el flex real; la imagen también requiere verificar pintura, no solo `naturalWidth`. Por tanto, los recortesA85 densos anteriores no prueban por sí solos un fallo de la aplicación productiva: estaban afectados por falta de fidelidad del ensayo. Los fallos conectadosA70 de los candidatos anteriores siguen siendo evidencia independiente válida.

Comprobación sin navegador: build de un blobGit e352a2e mediante un pluginVite de solo lectura frente al harness corregido; el CSS compilado anterior carece de la regla y el corregido la contiene. [Crudos](evidence/local/fixture-style-parity.json). Se corrige una expresión regular inicial que asumía orden de propiedades; se inspeccionan las reglas completas antes de concluir. No se confunde esa comprobación de archivos con ejecuciónDOM.

El harness corregido carga las hojas compartidas del diálogo/Pacto, contexto `arcana-map-view`, tipo de evento yAjustes como elApp. Verifica además que ilustración/etiqueta/coste comparten una fila, decodifica los cinco retratos antes de capturar y exige cajas de imagen reales≥32×60, opacidad1/visibilidad, además de mantener todos los assertions de controles y estado inmutable. La captura anterior con huecos no se acepta como calidad visual superada por el hecho de que su test pasara. Tipos y compilaciónQA correctos; falta su nuevaCI completa.

## Candidato eb0c050 · CI39153964079

El job `check` completo pasa. Se descargó el artifact por runID a una carpeta temporal nueva, se verificó SHA b057556dcea4db87f8e3da7984a9151eed5a9d12 y se inspeccionaron las cuatro capturasA85 seleccionadas, incluida la escena densa corregida con todas las figuras/objetos.24 muestras deMaestría (ambos motores, tres tamaños, ambos idiomas/paquetes) conservan controles por encima del pie; mínimo10,71875px. Los retratos tienen cajas reales y opacidad1 trasdecode; la acción mantiene ilustración/etiqueta/coste en una fila. Las seis muestras Hufflepuff tienen12offsets distintos ylog inmutable. La regresión general sigue en curso: no se declara todavía éxito global.

## Regresión completa de eb0c050: no aprobada

CI39153964079 termina fallida: primer job correcto; segundo detecta seis timeouts enA65/intenciones, con dos casos correctos. Un calllog explícito demuestra que `section.team.team-compact` intercepta el clic natural en `pasaje:1:0` disponible. [Fallo y contexto](evidence/eighth/failure.json). No se atribuye el bloqueo al aviso deWebSocket ni al timeout por sí solo. Las demás fases mantienen su conclusión real; no se declara éxito global.

Contraste deCSS: la regla de mapa con intención tiene más especificidad y usa `height:calc(100% - 96px)`, por lo que deja de aplicar la reserva medida del equipoA85. Corrección mínima: componer `100% - 96px - var(--party-map-space,0px)`, conservando el margen del recordatorio y todas las acciones. No se fuerza clic, desactiva punteros, ocultan nodos o elimina la intención. Nuevo ensayo reproduce el recordatorio real más cinco integrantes/casas y stock en el harness, en seis pares de motor/tamaño y ambos idiomas/paquetes: comprueba centros de todos los nodos, acceso al recordatorio, ausencia de scroll y estado intacto. Es fixture de layout, no operación económica. Se añade una única captura explícita de ese estado enChromium390ES/Diagon. La suite conectadaA65 original se conserva íntegra. Tipos/build/harness/scanner pasan; la nuevaCI todavía es necesaria.
