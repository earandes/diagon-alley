# A75 · Contraste WebKit acotado, preregistrado

La batería full39059090478/head889886d continúa, conA75/A70/A71/A73/A68/A69 correctas. A69muestra WebKit más lento queA73 también en apertura y escritorio. No atribuimos causa a GPU o al encuadre nuevo por correlación. Se autoriza dentro de la validación solicitada **una sola muestra adicional**, en cola bajo el mismo bloqueo global; no se cancela ni se repite la batería full.

Pregunta: ¿el runtime actual tiene una regresión sostenida frente a937a0a1 en WebKit390, con el mismo BattleLog y el mismo runner? Perfil existenteA75, tres pares fijosAB/BA/AB, contextos aislados,500msde asentamiento y10s sostenidos, actor5×5 con HP prolongados declarados. Módulo evaluado antes del clic; no arranque frío universal ni tiempo humano/GPU. Se conserva cada extremo y hash del log; controles de pausa/2x/inspector/ocultación/omisión y estado siguen iguales.240s como límite,0reintentos.

Criterio definido antes de ejecutar: medianaP95 actual≤máximo(20ms,mediana referencia+1ms), al menos150intervalos por ventana y logs idénticos. No se cambia el umbral después de ver datos. Si falla, preservar crudos e investigar una causa antes de corregir, sin ocultar contenido ni tocar reglas. No presentar igualdad como rendimiento universal.

Modo temporal `tools/verification/a75-phase.json=webkit`: selecciona solo spec de perfil, WebKit390 y fixture5521, sin cuentas nuevas. Build/tipos/unitarios/PGRedis se conservan en el job; las otras baterías gráficas se omiten explícitamente porque su código productivo ya se está comprobando en el job full anterior. Es una ejecución enfocada, no una batería global verde. Guard/bloqueo/preflight/watchdog/worker/retries originales intactos; no excepciónMac.

Al terminar se restaurará `phase=full` y se registrarán ambosSHA/estados y equivalencia de runtime. La condición de las fases anteriores para baseline/full es la misma; la nueva fase no reduce la futura batería full. La restauración/documentación final no se atribuirá una ejecución completa que no hizo.
