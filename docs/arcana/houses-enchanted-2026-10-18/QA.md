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

A69 del segundo candidato termina sin error de specA85; la ejecución global sigue fallida porA70. Se inspeccionan mapa y cierre encantado, y la muestra de jefe reproduce necesidad de reordenar estantes. Las capturas de arte normales deben esperar a imágenes decodificadas: se añade barrera de carga explícita para los cinco retratos antes de juzgar la composición, sin confundir esa espera del test con latencia del producto.

Se detectó por código otro riesgo de consulta: dos `details` de casa podían abrirse a la vez sobre la misma posición del HUD. Agrupación nativa exclusiva por instancia deHouseBand (`name` conuseId), y prueba de teclado que abre otra casa y comprueba el cierre de la anterior. No afecta regla o estado persistido.

CI39139599667 se canceló deliberadamente durante pruebas no gráficas, antes de iniciar navegador, para comprobar el candidato completo con esa corrección; no se presenta como fallo ni éxito de producto, ni como reintento del mismoSHA. El guard, bloqueo, límites y cero reintentos de suite permanecen intactos.
