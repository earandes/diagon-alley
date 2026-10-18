# A85 · QA y límites (en curso)

Baseline557ee0f. Protecciones de Mac intactas. No se abrió navegador ni generaron capturas locales. Preflight `npm run test:browser:check` permitió el smoke, pero no se ejecutó: carga2,04/11CPU y WindowServer67,9MB. No es una medición de IOSurface o garantía futura del compositor.

## Ejecutado

- RED de3 pruebas de acabado y2 de comportamiento de combate; archivos de error conservados en el registro local. Las pruebas iniciales puras de conteo se añadieron junto a la función, no se atribuyen retrospectivamente a RED.
- Tipos correctos en las revisiones registradas; build correcto con aviso de chunks>500KB, sin umbral debilitado.
- Dominio/UI: primer completo648 con4 fallos contractuales; referencia A84 explícita y fallback legacy corregidos; segunda pasada648/648. Ampliación posterior651/651; nuevas pruebas de UI, contribución y Pimienta pasan focalizadas. Candidato final pendiente de ejecución completa.
- PostgreSQL/Redis reales: primera ampliación102 con3 fallos (uno por versión nueva, dos por consulta indebida al contenido live). Corrección causal y segunda batería **102/102** en17 archivos. No se relajó recuperación: un snapshot válido vuelve a prescindir del proveedor live. Solo filas ficticias propias `a85-<UUID>`, borradas al acabar.
-128 grafos generados: tres candidatos distintos de casa no inicial se pueden reunir por aristas válidas antes de combatir; también se comprueba catálogo30, pesos/estadísticas idénticos y rechazo de variantes mal configuradas.
-1152 escenarios de aplicación/motor con transacción doble en memoria,32 semillas emparejadas por escenario,36 grupos. [Script](../../../tools/verification/simulate-houses-a85.mjs), [datos](simulation.json). No son SQL, comportamiento humano o prueba de diversión. Sin grageas, condición inicial completa, política voraz pública, refugios de PV y encuentros pasados. Las tres compras son resultados controlados de ensayo al precio real, no probabilidades observadas.

## Pendiente obligatorio antes de cerrar

Candidato final tipos/build/unidad; regresión afectada de persistencia; CI Linux serial, evidencia gráfica seleccionada, inspección de composición/movimiento y corrección de lo que falle. No se declaran estos puntos ejecutados por existir un spec.

Se reutilizan guard/bloqueo/watchdog/unworker/cero retries y la etapa A69 vigente. Nuevo harness A85 es explícitamente presentación ficticia, sin endpoints de concesión ni cuentas reales. Tres pares representativos Chromium390/1280 y WebKit865; el resto de la matriz conserva regresiones. Fuente de la ruta A73 nueva en `a85-route-seed0.json`; la referencia A84 permanece intacta y regenerable con su configuración anterior.

Humana/dispositivo físico, lector hablado, percepción artística, diversión, balance y retención quedan pendientes. Intervalos rAF no son tiempoGPU; capturas estáticas solo demuestran composición.
