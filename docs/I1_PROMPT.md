# I1: encargo preparado tras la entrevista de producto

9 de octubre de 2026. Referencia: PRD v0.15 y decisiones A09–A18. **El prompt de implementación sigue preparado, no ejecutado.** La fase de preparación con cuatro subagentes está documentada en `docs/preparacion-i1/`; no ha instalado dependencias, implementado o publicado la aplicación. El texto de encargo siguiente se utiliza cuando Enric solicite construir I1.

> Actualización posterior: A19/A20 y PRD v0.17 añaden cuenta, historial, Callejón como fondo continuo, ambiente mágico y desplazamiento hacia Weasley. Este encargo conserva el alcance local preparado antes de esa petición. **No ejecutarlo todavía:** falta resolver si cuenta/historial entran en I1 o en el siguiente incremento y ajustar contratos/aceptación según esa elección. Ver `preparacion-i1/ASSETS_AND_ACCESS.md` y `preparacion-i1/IMMERSIVE_SCENE.md`.

## Resultado de la entrevista

- Público: fan adulto casual de Harry Potter (A09).
- Valor buscado: visitar una tienda mágica, descubrir una sorpresa y conservar un recuerdo coleccionable (A10). Interés y retorno aún sin observar.
- Arte: cuento teatral ilustrado 2D con el acabado detallado de I1-CV01 como referencia (A11/A12). La muestra compuesta no entrega capas ni assets finales.
- Primera rana: identidad nueva garantizada, persona u objeto, sin garantizar un rango (A13).
- Rangos: Habitual/Common, Singular/Uncommon y Extraordinario/Extraordinary (A14). Rangos adicionales y shiny son posibilidades futuras fuera de I1 (P16).
- Catálogo experimental: doce identidades C01–C04/O01–O04/S01–S04 (A15).
- Bienvenida elegida por delegación: O01/O02/S01/S02, una copia conocida de cada uno; una rana abrible y una unidad de grageas reservada para I2. Priorizar la rana antes del resumen de regalos, manteniendo acceso previo a la colección (A16).
- Evaluación posterior: ocho fans del perfil; objetivos 6/8 comprensión sin ayuda y 4/8 exploración espontánea de otra ficha con motivo concreto para seguir coleccionando. Comprobaciones funcionales es/en sin pérdida o duplicación (A17). Son objetivos, no resultados o evidencia estadística.
- Rarezas y tabla de bienvenida: configuración experimental elegida, sencilla y editable mediante datos versionados (A18). Probabilidades normales y balance observado siguen pendientes.

Se dejaron fuera del incremento: apertura de grageas, taller, canje, reposición, objetivo elegido, variantes shiny, rangos adicionales, cuentas, backend, pagos, otras tiendas y funciones sociales. Empezar con una repetición quedó descartado para la bienvenida. El acabado simplificado no sustituye la referencia detallada elegida. No introducir infraestructura de variantes o un motor de reglas por ideas futuras.

Siguen pendientes el stack concreto, dispositivos de comprobación, assets finales/capas, lectura móvil, glosario completo, criterio inicial de idioma, comprensión de rarezas y señales reales de interés. Estas cuestiones pueden tratarse como elecciones técnicas documentadas o hipótesis de prototipo según su alcance; no reabrir las decisiones aprobadas. Antes de un piloto o distribución se resolverán sus dependencias de servidor y condiciones de uso correspondientes, sin atribuirlas a una demo local.

## Preparación integrada y recomendaciones

Lee además [síntesis](preparacion-i1/SYNTHESIS.md), [producto/UX](preparacion-i1/producto-ux.md), [arte](preparacion-i1/arte-ilustraciones.md), [stack/dominio](preparacion-i1/stack-dominio.md) y [revisión QA](preparacion-i1/revision-qa.md). Estas entregas contienen recomendaciones de ensayo, fuentes y pruebas pendientes; no amplían A09–A18 ni acreditan comportamiento. El PRD permanece en v0.15 porque la preparación no cambia alcance.

- Recomendar React/TypeScript/Vite + IndexedDB con `idb` + CSS, frente a DOM/IndexedDB nativos. Registrar elección/versiones al implementar; un wrapper no demuestra transacciones reales. Vitest/Playwright propuestos; no hay comandos de aplicación ejecutados.
- Páginas sencillas, navegación Callejón/Colección y detalle con una acción explícita de uso; no diálogo redundante de gasto. Mantener retorno/foco, escena/lista y álbum previo. Confirmar sustitución de datos/reinicio. Diferenciar fallo abortado conocido de commit desconocido en textos ES/EN.
- P10 y formatos es-ES/en-GB siguen recomendados: preferencia guardada primero y, sin ella, primera preferencia válida es-* del navegador a español, resto inglés. Registrar la opción de ensayo al construir; no inferir país o región comercial. Glosario es/en de trabajo, contextos/mensajes por completar y revisar. No convertir la marca inglesa sugerida en naming aprobado.
- Usar una ventana de arte detallado y controles/textos en superficie separada, con alto intrínseco para texto. La [muestra móvil](../design/preparation/i1/mobile-composition-v1.svg) y [manifest](../design/preparation/i1/manifest-v1.json) son documentales, sin interacción/guardado. El cromo O01 del concepto ya es regalo; no presentarlo como descubrimiento nuevo. Resultado C01 de la muestra es guionizado y provisional. Los seis grupos de assets finales siguen pendientes.
- Contrato mínimo de catálogo/tabla, snapshots históricos, generación de almacenamiento y configuración activa compartida están especificados como propuestas técnicas en stack-dominio. Recuperar replay antes de validar tabla nueva o llamar al azar; guardar todo en una transacción y celebrar después de su finalización. Una pestaña antigua no debe rebajar la versión activa ni escribir sobre una demo reemplazada. Cada mutación normal incrementa una revisión persistida en su transacción. Import/reset comparan `{storageGeneration, runId, revision}` del estado vigente con el resumen confirmado para evitar sustituir cambios concurrentes; el reemplazo cambia la generación, incluso si importa el mismo runId. Ante excepción del adaptador, solicitar aborto explícito si sigue permitido y observar `tx.done`; no asumir rollback por un throw. Diferenciar aborto confirmado, commit completado y desenlace desconocido, recuperando estado real antes de anunciar. Bloquear estado incompatible de bienvenida en lugar de renormalizar candidatos silenciosamente.
- Plan A17: tarea neutral; observar otra ficha antes de sugerirla/preguntar; ventana natural posterior al álbum de hasta dos minutos o hasta que la persona termine, sin esperas en producto. 4/8 requiere exploración y motivo en la misma persona; conservar fallos/ayudas en denominador. Cuatro sesiones es/cuatro en y mezcla móvil/escritorio son propuestas operativas, no reclutamiento hecho. Pruebas dirigidas posteriores no cuentan como curiosidad espontánea.

No esperar assets finales o sesiones para construir con sustitutos; sí distinguir que un prototipo funcional no valida atractivo del acabado detallado, interés, repetidos reales o retorno. Perfil de pruebas recomendado: Chromium/Firefox/WebKit, 390×844 y1280×800, reflujo320 y lectores/dispositivos físicos según disponibilidad. WebKit automatizado y viewport móvil no acreditan Safari distribuido o teléfono real. La revisión define la matriz de los doce criterios.

## Prompt para ejecutar I1

Implementa el primer incremento de Colección Mágica en este repositorio: **Callejón Diagón → Weasley → detalle de rana → apertura recuperable → colección**, completo en español e inglés desde el primer componente.

Lee completos `AGENTS.md`, `docs/PRD.md` y `docs/DECISIONS.md`, más este encargo. Usa el PRD como referencia principal y conserva sus estados de decisión. Las instrucciones actuales de Enric prevalecen; no modifiques el Word histórico. Inspecciona el estado real del repositorio y conserva trabajo existente. Registra decisiones nuevas y cambios de alcance, actualizando PRD, versión y nota de cambio cuando corresponda.

### Producto y recorrido

Diseña para el fan adulto casual y la promesa A10. La persona comienza en el callejón, entra en Weasley y puede regresar. Ofrece escena y lista equivalente, con las mismas acciones y conservación de foco/posición. Solo Weasley está disponible.

Inicializa una sola vez la bienvenida A16. La colección empieza en 4/12 con regalos conocidos; stock: una rana y una unidad de grageas cuyo gasto está deshabilitado hasta I2. No tratar esa reserva como stock cero ni prometer una fecha. Invita a abrir la rana como acción principal sin bloquear la exploración o imponer un tutorial. Tras la entrega, ofrece visitar la colección: 5/12 y cinco copias totales. Distingue regalos del cromo aleatorio, sin cuatro rituales adicionales.

Consultar detalle o álbum no gasta. La acción explícita «Usar 1 rana» / «Use 1 Chocolate Frog» muestra qué consume y qué puede entregar, con probabilidades exactas por identidad y versión. Tras agotar la rana, conservar colección y navegación; no regalar productos adicionales para prolongar la demo. Repetidos se comprueban con escenarios controlados de pruebas, sin habilitar aperturas normales al usuario en I1.

### Configuración sencilla

Implementa catálogo y tabla de bienvenida en JSON separados, legibles y versionados. Las doce identidades, sus nombres y rangos son los elegidos en PRD §26. Contenido es/en e IDs compartidos; textos de UI y referencias de arte separados de las reglas.

Asignación inicial: R01 C01/C02/O01/O02/S01/S02; R02 C03/O03/S03; R03 C04/O04/S04.

Tabla de bienvenida: C01 peso 14, C02 peso 14, C03 peso 5, O03 peso 5, C04 peso 1, O04 peso 1. Suma 40: probabilidades 35/35/12,5/12,5/2,5/2,5 %. O01/O02 están ya descubiertos y no son candidatos de bienvenida. No utilizar los porcentajes individuales de R1 normal.

Deriva probabilidad visible y selección de los mismos datos. Valida esquema, IDs únicos, referencias, familias/rangos, textos bilingües, pesos enteros positivos y suma coherente. Valida que una bienvenida entrega identidad nueva; un estado incompatible o sin candidato nuevo no puede consumir ni anunciar éxito. Explica cómo modificar pesos o asignaciones, incrementar versión y comprobar el cambio sin tocar lógica de apertura. No construir panel administrativo, configuración remota, motor genérico ni reglas personalizadas por jugador.

Nuevas versiones no cambian entregas confirmadas ni reclasifican hallazgos previos. Conserva versiones y datos originales necesarios para recuperar una operación y representar su resultado. Si la tabla cambió desde consultar una ficha, actualizar y reconfirmar antes de consumir con otras probabilidades. Recupera primero operaciones existentes para que un reintento mantenga su resultado incluso después de cambiar datos. No sobrescribir una versión con contenido distinto. Documenta cómo comparar configuraciones en ejecuciones de demo separadas, con reinicio confirmado y exportación del estado previo.

### Desarrollo y stack

Asume las responsabilidades de ingeniería, producto/UX, diseño/ilustración y QA. Si Enric solicita ejecución con agentes, usa un coordinador e ingeniero principal y especialistas acotados de producto/UX, ilustración/movimiento y revisión independiente; integra un único recorrido. Los agentes de preparación ya tienen entregas; no equivalen a un equipo que haya implementado I1. La revisión de implementación debe comprobar comportamiento, no aprobar hipótesis por consenso.

El candidato más sencillo para esta demo es web responsive con React, TypeScript, Vite, IndexedDB y CSS. Selecciona y registra la opción concreta con alternativas y motivo al comenzar; todavía no es stack implementado. Introduce dependencias solo cuando resuelvan una necesidad de I1; animación con CSS antes de justificar GSAP. No construir el backend del piloto.

Aplica Clean Code, Clean Architecture, DDD, SOLID, TDD, KISS y YAGNI según `AGENTS.md`: reglas y casos de uso independientes de UI, idioma y almacenamiento; contratos pequeños para persistencia y azar comprobable; lenguaje del dominio e invariantes explícitas. Evita capas de paso, interfaces por rutina, microservicios, event sourcing o abstracciones de expansiones.

Comienza por especificación verificable y pruebas de comportamiento que fallen; implementa lo mínimo y refactoriza. Prioriza atomicidad, idempotencia, recuperación, validación y concurrencia, además del recorrido y localización. No confundir un doble en memoria con prueba de transacciones reales en IndexedDB.

### Persistencia y recuperación

Guarda consumo, resultado, copia, condición de bienvenida, operación y versiones dentro de una transacción antes de animar o anunciar éxito. Misma clave y petición recupera lo mismo; misma clave con otra petición da conflicto; otra clave para una unidad consumida falla sin nuevo sorteo. Comprueba doble toque y concurrencia entre pestañas.

Recargar, cerrar, omitir o cambiar idioma conserva una entrega confirmada. Recuperar operaciones antes de presentar saldos definitivos. Un fallo de guardado no muestra recompensa confirmada. Mostrar «Guardado en este dispositivo» / «Saved on this device», sin presentar la demo como inventario económico confiable.

Incluir exportación/importación JSON con validación previa y sustitución atómica; datos inválidos conservan el estado anterior. Reinicio cancelado conserva todo; confirmado crea otra ejecución de demo identificada y concede su bienvenida una vez. No añadir cuentas, sincronización o autoridad de servidor.

### Diseño, ilustraciones y accesibilidad

Usa `design/concepts/i1/weasley-concept-v1.png` como referencia de dirección y detalle, junto a su registro de procedencia. No la trates como un asset por capas. Revisa una muestra con UI y recorte móvil antes de producir un lote. Separa fondo, sujetos, piezas móviles y controles/textos HTML; no generar nuevas imágenes en cada apertura.

Cumple el inventario I1-V01–06 de `docs/DECISIONS.md`. Registra assets finales necesarios, sustitutos previstos y realmente usados, rutas, procedencia, versión, dimensiones, recorte/pivotes pertinentes y criterio de reemplazo. Sustitutos identificados con «Ilustración provisional» / «Placeholder artwork». El recorrido opera con arte ausente; cambiar ilustraciones conserva IDs, reglas, textos y estado. El concepto y los sustitutos no acreditan lectura móvil o atractivo observado.

ES/EN en navegación, catálogo, rangos, estados alternativos, errores, recuperación y etiquetas accesibles. Mensajes completos con parámetros/plurales; no concatenar fragmentos ni traducir con una API externa. Registrar criterio inicial de idioma como opción de ensayo si se adopta P10. Selector persistente conserva vista, operación e inventario; actualizar idioma del documento y formatos.

Teclado, foco visible y devolución de foco; etiqueta/forma para familia, rareza y estado además de color. Anunciar cada resultado una vez. Apertura omitible, movimiento reducido del sistema y ajuste propio, resultado estático equivalente. Audio solo tras elección explícita si se incluye. Meta WCAG 2.2 AA pendiente de verificación y objetivo cómodo de controles 44 × 44; no declarar certificación.

### Verificación y entrega

Completa I1-AC01–12 de `docs/DECISIONS.md` en ambos idiomas. Incluye recuperación antes/después del commit, stock cero, reintentos/conflictos, dos pestañas, fallo de guardado, arte ausente, configuración inválida, textos ausentes, omisión, versiones cambiadas e importación/reinicio. Comprueba que editar datos modifica probabilidades de nuevas operaciones sin alterar las anteriores. Usa pruebas deterministas para los tres rangos y repetidos, identificando resultados guionizados y sin atribuirlos a sorteos reales.

Ejecuta compilación, tipos y pruebas con los comandos reales creados para el proyecto; comprueba también la interfaz integrada. Registra entorno, versiones, dispositivos/navegadores, comandos, resultados y límites de cobertura. Actualiza el estado de `AGENTS.md` y las instrucciones de ejecución del README cuando exista código. Documenta las partes observadas manualmente y las no verificadas.

Entrega distinguiendo documentado, propuesto, implementado y probado. Prepara el protocolo A17 para las ocho sesiones posteriores, sin inventar participantes o resultados y sin exigir realizarlas para entregar el prototipo funcional. No añadir métricas o servicios externos innecesarios; registro de observación manual suficiente para esta etapa.

Resuelve elecciones rutinarias dentro del incremento y documenta su motivo. Pide aclaración solo ante una nueva decisión material que impida avanzar. No reabras A09–A18 ni amplíes el alcance por comodidad técnica. La ejecución de este encargo autoriza I1, sin implicar publicación, monetización, piloto o subida a GitHub no solicitados para esa ejecución.
