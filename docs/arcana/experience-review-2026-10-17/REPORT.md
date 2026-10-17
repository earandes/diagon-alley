# A74 · Revisión experta de juego, estilo y validación

17 octubre 2026 · baseline `937a0a1f00bdbca7009a80cd99b7b4b450f652f0` · **análisis entregado; fixes no implementados**.

## Conclusión

El siguiente incremento debería consolidar **decisión, recuperación y lectura**, antes de añadir contenido. El juego ya tiene una identidad propia: las fachadas son destinos, los retratos forman el equipo, el tarro prepara un consumible y la llave conduce a una bóveda. La antesala del jefe y el cierre conectan esas acciones. No recomiendo sustituir esta gramática por otra interfaz ni rehacer A70/A71.

La reserva principal es funcional: una sesión que caduca después de cargar puede dejar el estado general sin explicación/recuperación visible. La segunda es táctica: las proyecciones de preparación no toman siempre las reglas congeladas de la expedición. La tercera es de legibilidad: dos instancias de un personaje no se distinguen en Encuentro y, en móvil 5×5, los nombres y PV dominan a unas figuras muy pequeñas.

Son problemas determinados por código o visibles en las imágenes indicadas. No se ha observado a una persona confundirse, perder una partida o abandonar. Tampoco se ha reproducido un incidente en la partida habitual.

## Qué se ha hecho

- Leídas las fuentes vigentes y contrastadas con rutas, componentes, reglas, estilos y arte activo. Los estados A48–A60 de las matrices generales son históricos; no sustituyen el informe A73 más reciente.
- Dos evaluaciones independientes: diseño primero y diagnóstico técnico después; síntesis del coordinador contrastada con fuentes e imágenes. Se conservan como apéndices, no como dos productos separados.
- Inspección de siete PNG seleccionados actuales de Linux: antesala de escritorio, dos antesalas móviles, dos arenas de escritorio, arena móvil densa y cierre.
- Nueva ejecución local **sin gráficos**: 562 tests unitarios correctos; build/tipos/validación de packs correctos; verificación del artefacto correcta.
- Reutilización acotada de CI Linux `39038639396`, merge `8541ee2c9fbf3844d5df0f433945113fd96bd7c0`: 78 integraciones PG/Redis y 268 pruebas gráficas correctas, 40 omisiones explícitas. No se han vuelto a ejecutar aquí ni son una matriz universal.
- Sin navegador, capturas nuevas, instalaciones, cambios de aplicación, operaciones sobre cuentas, commit o push. [Método y cobertura](VALIDATION.md).

## Prioridades consolidadas

| Orden | Findings | Qué debería resolver el siguiente trabajo |
|---|---|---|
| 1 | F01–F04 | Entrar una vez, reconocer una sesión inválida, consultar valores coherentes con el snapshot y recuperar un guardado desde el inspector activo. |
| 2 | F05, F11 | Saber qué instancia recibirá una consecuencia y distinguir existencias, asignación provisional y consumo. |
| 3 | F06 | Recuperar presencia de las figuras en 5×5 móvil conservando diez participantes, nombres, PV, controles y fallback. |
| Después | F07–F10 | Consulta de rutas, búsqueda con colección amplia, fallback visible de iconos y ajuste de movimiento congruente. |

Registro único: **1 P1 y 10 P2**. No se identifica un P0, corrupción o nueva duplicación económica demostrada. P1 indica impacto en el estado descrito, no frecuencia medida. [Evidencia, propuestas y aceptación por finding](FINDINGS.md).

## Validación del estilo

**Conservar:** dirección Teatro de alquimia, fondos pintados, contraste de texto sobre bases oscuras, dorado como material, retratos/objetos seleccionables, un gesto principal de combate, libro de consulta y resultado con botín utilizable. Los botones semánticos son necesarios; su presencia en el DOM no convierte una escena en formulario.

**Cambiar primero:** composición densa móvil y consistencia entre objetos/instancias/estados. En la antesala actual el rival tiene escala y posición protagonistas; el equipo queda en primer término y la acción principal tiene coste. En la arena móvil densa la figura pasa a ser una miniatura sobre una etiqueta, perdiendo esa continuidad. La mejora debe redistribuir espacio y encuadre, no añadir brillo, marcos o partículas.

**Simplificar:** el contador fraccionario de grageas del duelo ordinario; la navegación secuencial de muchas copias; estados pendientes/errores que quedan fuera del diálogo activo. No eliminar datos tácticos, foco visible, texto funcional ni controles nativos para obtener una imagen más limpia.

**Diseñar después:** consulta accesible de la ruta pública y agrupación visual de copias por afinidad/identidad. No hace falta otra moneda, nueva región, motor de misiones, nueva familia de assets o librería.

**Pendiente de observar:** si la gente descubre las consultas, entiende propia/temporal, sigue actor/objetivo durante el movimiento y desea otra expedición. Las capturas no validan ritmo, coreografía ni diversión. Los tests de replay sí verifican fases/controles/log en los casos documentados; eso no sustituye ver la animación ni usar hardware físico.

## Lectura como juego

La elección táctica existe: Pacto altera composición, Encuentro intercambia condición, Refugio recupera recursos, equipo/consumible modifican preparación y las amenazas ofrecen contexto. El inicio sigue siendo viable con la copia inicial y temporales; no propongo forzar compras o un personaje raro.

La debilidad no justifica aumentar dificultad o duración: hay que hacer más legibles decisiones existentes. La consulta de nodos futuros está bloqueada junto al avance; preparar una afinidad entre muchas copias requiere recorrer páginas; una instancia repetida puede parecer igual a otra. Estos son costes de información, no nueva profundidad. [Recorrido completo y pantallas](JOURNEY-AND-SCREENS.md).

No se ha recalculado aquí el balance o la completitud: esta revisión no modifica ni invalida las simulaciones A67. No existen nuevos datos humanos de tiempo, decisiones, retención o disfrute.

## Entrega para la implementación posterior

1. [Contrato y alcance](CONTRACT.md).
2. [Hallazgos consolidados](FINDINGS.md).
3. [Recorrido, pantallas, estilo y movimiento](JOURNEY-AND-SCREENS.md).
4. [Tres incrementos propuestos y sus pruebas](FIX-PLAN.md).
5. [Validación ejecutada, evidencia y límites](VALIDATION.md).
6. Apéndices independientes: [diseño A](ASSESSMENT-A.md), [implementación B](ASSESSMENT-B.md); [detector](detector.json).

La recomendación y su orden quedan documentados; **esta fase no autoriza ni realiza su implementación**. No se actualizan PRD/DECISIONS/DESIGN como si los cambios propuestos estuvieran aprobados o construidos. La aplicación, sus reglas y sus partidas permanecen intactas.
