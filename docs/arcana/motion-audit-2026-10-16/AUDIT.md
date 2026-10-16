# Auditoría consolidada de movimiento

16 de octubre de 2026. Esta auditoría describe el estado **anterior a A69**, sobre main `2b9df81` y la dependencia local A68. Se terminó antes de editar la aplicación. La última instrucción de Enric autoriza después implementar, validar e integrar. Los resultados posteriores se registran en [REPORT](REPORT.md), sin convertir esta lectura de fuentes en observación dinámica.

Fuentes: [contrato](CONTRACT.md), [pantallas y condiciones](SCREENS.md), [assets](ASSETS.md), [tecnología oficial](TECHNOLOGY.md), [coreografías](MOTION.md), [prioridades](BACKLOG.md) y [validación](VALIDATION.md).

## Diagnóstico comprobado en código

La limitación principal no es falta de bibliotecas. Ya existen Pixi 8.22, GSAP 3.15, Motion 14.2 mini, CSS y Canvas2D. La dirección necesita coordinar el evento confirmado con una consecuencia visual reconocible.

- `BattlePanel` programa cada intervalo con un timer React, mientras `pixi-scenes` acumula tiempo propio. Pausar o cambiar velocidad no conserva el mismo intervalo en ambos. La trayectoria incluye un segundo proyectil desde el objetivo sin un contrahechizo en el BattleLog. M01 debe corregir esa ambigüedad sin añadir habilidades.
- `CardReveal` mezcla posiciones temporales absolutas y parámetros del pack. La protección del halo no cubre el ritual completo al remontar. `FrogMagic` ya es Canvas2D acotado: la optimización A58 desaconseja regresar a WebGL/GlowFilter sin evidencia nueva.
- `SceneCanvas` cancela la inicialización tardía y destruye la escena ante desmontaje o pérdida de contexto. Pixi destruye sus texturas propias. Debe conservarse esa frontera y evitar liberar cachés globales compartidas. La pausa explícita por ocultación aún necesita coordinación.
- `CommercePanel` anima el resultado coincidente con el recibo al remontar; `closure-spoils` tiene entrada CSS al montar. Una consulta puede parecer una nueva concesión. `Celebration` y A68 contienen protecciones parciales de identidad, pero el criterio no es uniforme.
- `SceneAtmosphere` trata ocultación y movimiento reducido; no establece una prioridad uniforme frente a escenas focales. Un loop de fondo también consume recursos.
- Los personajes son recortes planos; caja, tapa y sello sí son piezas separadas. Es posible comunicar peso mediante movimiento global y contacto. Una actuación anatómica necesita nuevas piezas o fotogramas.

Interpretación experta: un movimiento localizado en el momento correcto debería facilitar la lectura de hechizos y recompensas más que aumentar el número de destellos. **Hipótesis pendiente:** esto hará más satisfactorio preparar, elegir y coleccionar. No se ha observado con jugadores.

## Cobertura y límites

**F** identifica fuentes y manifiestos inspeccionados. **H** identifica evidencia histórica con su entorno y alcance. **NV** indica ejecución actual pendiente. Una captura estática no acredita movimiento.

La auditoría no abre navegador en el Mac. A68 alcanzó el watchdog al ampliar la prueba local; no se relajan sus límites. No se ejecutan matrices, WebKit, capturas extensas o grabaciones locales. La muestra offline PNG de A68 no es una captura React ni aprobación del acabado.

Evidencia histórica útil: A58 documentó apertura cercana a 60 FPS en escritorio tras Canvas2D, con pico de frame de 16,8 ms en Chromium y 35–37 ms en WebKit. A63 tiene fixtures de dos bandos y 5×5; A67 tiene CI Linux sobre el main anterior. A68 tiene un smoke básico de 4,1 s y ampliaciones detenidas por memoria. Ninguno de esos resultados es una medición A69 ni acredita un dispositivo físico.

## Conservar, rehacer e investigar

**Conservar:** Teatro de alquimia, ilustraciones e IDs, Canvas2D de apertura, Pixi en mapa/arena, contextos GSAP, Motion mini, controles DOM, guardado antes del feedback y resultados equivalentes al omitir o reducir movimiento.

**Rehacer:** coordinación del replay, fases de apertura, deduplicación de celebraciones históricas, prioridad ambiental y respuestas contextuales. La primera muestra completa es arena → resultado; la segunda, apertura nueva y repetida. Las dos se validan en Linux.

**Investigar mediante una muestra:** rana con 3–5 poses o piezas y pivotes reales, cofre con base/tapa, y materialidad del papel/metal. Se necesitan fuente editable, encuadre, peso y procedencia antes de producir un lote. Un retrato plano no se declara rig. El audio sigue siendo una propuesta independiente.
