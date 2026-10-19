# A88 · Skills locales y continuidad de audio

**Implementado, validado técnicamente e integrado mediante PR11.** La [CI39218434156](https://github.com/earandes/diagon-alley/actions/runs/39218434156) pasó sobre `28ec176` / checkout `031ef1c`: **689 pruebas unitarias, 111 con PostgreSQL/Redis reales y 522 casos gráficos activos**. El merge de main `62bb149baadbcc248a002a1df1417d3dd3046a70` tiene el mismo árbol completo probado. El cierre documental posterior conserva código, tests y assets; no se le atribuye otra batería. [Integración y equivalencia](INTEGRATION.md).

## Skills seleccionadas y aplicadas

Se evaluaron las **40 entradas de Game Dev** del catálogo completo de Skill Issue, con siete repositorios raíz contrastados. La extracción inicial omitió cinco descripciones escapadas; se corrigió contra el array completo de 313 entradas, sin ejecutar JavaScript o abrir navegador. [Evaluación completa](EVALUATION.md), [fuentes, revisiones y licencias](SOURCES.json).

Solo se instalaron tres skills en `.agents/skills/`:

- **Asset Audit**, de Game Studios: inventario de los sonidos activos y comprobación de consumidores, formato, bytes y manifiestos.
- **Audio Design**, de awesome-gamedev: continuidad entre canales y conservación del consentimiento, mezcla y límites existentes.
- **Performance Optimization**, de awesome-gamedev: reproducción previa, límite verificable de trabajo simultáneo y comparación con sus límites explícitos.

Las guías se adaptaron a React, PixiJS y Web Audio. Sus originales, licencias y avisos de autoría están conservados: 13 archivos de texto, sin scripts, hooks o agentes upstream instalados. El catálogo automático las detectará en el siguiente turno; esta tarea leyó y aplicó sus archivos directamente.

Sprite Forge y Dream Loop quedan pospuestos para una necesidad de producción demostrada y un pipeline compatible con el presupuesto y las restricciones de captura. Se conservan las skills de PixiJS, UI y Game Feel existentes. La evaluación explica individualmente las otras entradas.

## Qué cambia para el jugador

Se mantienen los objetos de Sonido en Ajustes. Al preparar ambos canales juntos, el ambiente se carga primero y comienza cuando está listo, sin esperar a que termine un efecto lento. Las descargas y decodificaciones de audio pasan de hasta 16 cadenas simultáneas a un máximo de 2 por instancia/página, incluso mientras termina trabajo de un contexto anterior.

Un fallo opcional no atasca el resto de la cola. Apagar o cerrar conserva el silencio y descarta trabajo pendiente. No se añaden golpes sonoros atrasados. Se reutilizan los 16 WAV y su mezcla: consentimiento, silencio inicial, preferencias, cuatro voces de efectos, una pista musical, idiomas, ambos paquetes, pausa y omisión se conservan.

Preparar todos los efectos puede tardar más. No se presenta la concurrencia menor como una mejora universal de FPS. Las solicitudes de una tanda anterior no se interrumpen o reordenan para fabricar una métrica. [Contrato](CONTRACT.md), [rendimiento y renuncias](PERFORMANCE.md), [estilo conservado](VISUAL.md).

## Validación y corrección de QA

Tres comportamientos RED precedieron la corrección de audio; los seis casos finales cubren recursos, cancelación y generaciones superpuestas. Tres casos nativos retienen un WAV y observan ambiente activo sin efectos espontáneos al liberar la respuesta. Los 16 WAV coinciden con sus imports y manifiestos, incluyendo formato, duración, frecuencia, bytes y hash. La cota PCM se conserva, sin atribuir una nueva escucha.

La primera CI encontró una prueba del jefe que intentaba medir el mapa tras una derrota en una ruta aleatoria. Se conservó ese fallo. Se reutilizó el preparador aislado A73 con una ruta A87 declarada, seed0, comprobada contra la configuración actual. Sus 24 recorridos posteriores mantienen cancelación sin gasto y recibo inmutable, con operaciones de autoridad reales después de preparar la fixture. No se cambió la dificultad, las estadísticas o los premios para pasar el test. [QA, comandos y cobertura](QA.md).

Chromium mantiene P95 rAF de 16,7–16,8 ms. WebKit registra 23–24 ms en la última cohorte, igual que su referencia: el objetivo absoluto de 20 ms sigue pendiente. Se conservan las esperas de arranque desfavorables; esa comparación, con audio apagado, no demuestra un efecto de esta mejora de audio.

Ningún navegador, captura, vídeo o perfil se ejecutó en el Mac. No hay despliegue. Escucha, comprensión del feedback y dispositivo físico siguen pendientes. La derrota observada en la ruta aleatoria también puede servir para observar después cómo se entiende el riesgo y la recuperación; no acredita por sí sola un problema de balance.
