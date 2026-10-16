# A65 · Rendimiento medido

## Método y alcance

`A65_PROFILE=1 npx --no-install playwright test --config playwright.tactics-a65.config.ts`: **4/4, 53,2 s, código 0**. Compilación final previa al ajuste exclusivo de foco inicial del Pacto. Dos motores × 1280×900 / 390×844, un worker y ejecución serial; el coordinador confirmó que no había builds ni otros runners de navegador durante la muestra. Diagon Alley, español, movimiento normal, contextos y cuentas nuevos. Cada prueba recorre inicio → primer Pacto → segundo Pacto → duelo real con las reglas activas.

La medida comienza en el `timeStamp` del `pointerdown`. Los Pactos registran dos finales distintos: DOM disponible y escena con sus imágenes decodificadas, animaciones finitas terminadas y dos rAF de asentamiento. No se introduce un retraso fijo para mejorar o empeorar el número. Se cuentan imágenes rotas: **cero en las doce acciones medidas**.

La ventana de arena comienza en la pulsación de confirmar y dura ocho segundos. Incluye el POST, respuesta, persistencia cliente, creación del renderer y primeros eventos. Se registran rAF, intervalos de frame, recursos `/api/`, disponibilidad de DOM e imágenes. El API de long tasks se usa cuando existe; `null` en WebKit significa no disponible, no ausencia demostrada de tareas largas.

Archivos reproducibles: `tests/browser-trial/tactical-performance-a65.spec.ts` y cuatro JSON en `evidence/performance-pacts/`. Los ocho JSON de `evidence/after-pacts/*-measurements.json` son medidas funcionales de DOM, con otro final; no se mezclan con estas.

## Pactos

Milisegundos; una muestra por combinación, no una distribución estadística entre sesiones.

| Motor / ancho | Abrir: DOM / arte y cierre de transición | Seleccionar: DOM / cierre de transición | Reclutar: mapa disponible / efectos finitos terminados |
|---|---:|---:|---:|
| Chromium 1280 | 30,1 / 396,1 | 12,1 / 227,0 | 187,6 / 1927,4 |
| Chromium 390 | 19,7 / 397,1 | 10,5 / 197,8 | 89,4 / 1897,3 |
| WebKit 1280 | 28 / 389 | 11 / 201 | 109 / 1911 |
| WebKit 390 | 26 / 377 | 12 / 191 | 95 / 1914 |

El cierre visual de la confirmación incluye la pulsación finita de **1,8 s del próximo nodo**, ya existente. El control vuelve con el mapa disponible; esa pulsación orienta y no bloquea la siguiente acción. Se registran ambos tiempos para no presentar el primero como final de toda la animación ni el segundo como una espera obligatoria.

## Arena: acción y primeros ocho segundos

| Motor / ancho | Pulsación → arena visible | Pulsación → retratos decodificados | rAF estimados por segundo | Intervalo P95 | Intervalo máximo | Tareas largas observadas |
|---|---:|---:|---:|---:|---:|---|
| Chromium 1280 | 522,6 ms | 526,7 ms | 57,0 | 16,7 ms | 366,6 ms | 351 ms |
| Chromium 390 | 464,6 ms | 476,2 ms | 57,7 | 16,7 ms | 183,3 ms | 174 y 164 ms |
| WebKit 1280 | 149 ms | 154 ms | 58,5 | 30 ms | 51 ms | API no disponible |
| WebKit 390 | 146 ms | 149 ms | 59,9 | 25 ms | 40 ms | API no disponible |

El POST de combate dura 49–56,4 ms en estas muestras; la consulta de estado posterior, 13–21,1 ms. Son tiempos locales con PostgreSQL/Redis, no una previsión de una red móvil o despliegue.

**Persisten tirones de arranque de arena en Chromium.** Un promedio próximo a 60 rAF/s no oculta el frame de 366,6 ms ni las tareas de 164–351 ms. Estas mediciones no aíslan una causa única entre renderer, carga y trabajo de escena; no se atribuye todo al combate ni se declara resuelto el problema. Los JSON conservan el instante y duración de cada tarea observada.

La geometría registrada de la arena mantiene documento y viewport iguales a ambos tamaños. Las capturas permiten inspeccionar los dos bandos; el recorrido funcional comprueba aparte el estado económico invariable durante replay.

## Límites y siguientes comprobaciones

- rAF mide la cadencia de callbacks del hilo principal; no es FPS de presentación GPU ni dispositivo físico.
- P95 es sobre los intervalos de frame de la ventana de ocho segundos, no percentil de latencia entre jugadores o sesiones.
- No existe una referencia anterior equivalente con esta oferta, las mismas composiciones, los mismos assets, el mismo estado de caché y esta definición de fin. No se informa mejora porcentual respecto de A62/A63.
- El mapa ya había creado su escena antes de entrar al primer duelo; se mide el arranque de esa arena, no una carga totalmente fría de toda la aplicación.
- No se desplazó el commit a después de la animación ni se ocultó el saldo confirmado. El estado guardado permanece igual al terminar la ventana.
- El ajuste posterior de foco inicial solo cambia qué control recibe foco. La regresión funcional final debe comprobarlo sobre la recompilación; estas cifras no pretenden medir ese ajuste.

La optimización del arranque de arena necesita perfilar sus tareas concretas y comparar una intervención en las mismas condiciones. No se añaden esperas ni se cambia el stack para maquillar estas muestras.
