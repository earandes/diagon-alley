# Instrucciones del proyecto Colección Mágica

## Fuentes y estado

Lee `docs/PRD.md` completo y `docs/DECISIONS.md` antes de proponer cambios de producto o implementar un recorrido. El PRD procede de `docs/PRD_Coleccion_Magica.docx`, versión 0.5 del 8 de octubre de 2026. Conserva ese Word como referencia original sin modificarlo salvo petición explícita.

Las instrucciones actuales de Enric prevalecen. Usa el PRD como referencia principal de producto. El PRD describe tanto decisiones como hipótesis; `docs/DECISIONS.md` distingue aprobadas, propuestas e incertidumbres. Una recomendación escrita, una preferencia de un modelo o una implementación experimental no equivalen a aprobación de producto. Si aparece una contradicción material, explícitala y resuélvela con la instrucción más reciente, sin inventar decisiones previas.

Estado actualizado el 10 de octubre de 2026: demo local I1 implementada con React/TypeScript/Vite + IndexedDB/idb + CSS (A23), manteniendo bienvenida nueva A13/A18 por confirmación A24. Comandos reales en README; evidencia y pendientes en `docs/i1-evidence/REPORT.md`. Dominio/persistencia/localización/presentación separados; sin cuentas/backend, despliegue o monetización. Adaptación visual A26 de los conceptos de Weasley: raster encuadrado y piezas SVG/DOM/CSS con manifest; no pintura por capas/rig ni acabado final A12. Evidencia adicional en docs/visual-i1-v2/REPORT.md. Lector, móvil físico, Firefox y observación A17 pendientes. La preparación anterior, herramientas Blender y estudios se conservan independientemente de la aplicación.

## Dirección posterior del 9 de octubre de 2026

A25 resuelve la frontera para este encargo: se construye primero el ensayo local sin cuentas, con farol/cartel y ritual de 1,6 s. A19/A20 siguen dirección posterior; no ampliar I1 automáticamente. A23 confirma el stack y A24 conserva tabla nueva A13/A18. Las notas siguientes conservan la dirección previa y su contexto.

A19 y PRD v0.18 añaden Callejón como fondo desde la bienvenida, registro/inicio de sesión antes de la visita e historial de premios por cuenta. La ubicación en I1 está pendiente de respuesta. La preparación local anterior y su stack no resuelven el producto conectado; no ejecutar el prompt antiguo sin ajustar alcance y aceptación. Assets y estudio de movimiento en `design/assets/preparation-v1/` son diseño provisional, sin autenticación o premios implementados.

A20 pide Callejón de fondo en toda la página, vida ambiental con lechuza/hechizo/paseante, revelación más mágica y desplazamiento hacia Weasley sin avatar visible necesario. Solo Weasley disponible; modo de cámara, alcance del incremento y realismo de movimiento frente a cambio de acabado siguen pendientes. A11/A12 se conservan. `docs/preparacion-i1/IMMERSIVE_SCENE.md` contiene investigación, recursos y prompt de muestra no ejecutado; Spline/Rive/PixiJS/Three.js no son elecciones implementadas.

## Pipeline visual local y presupuesto

A21 exige gasto adicional cero y herramientas solo para este proyecto. A22 elige Blender 4.5.9 LTS portable en `.tools/`; usar `tools/visual/blender.sh` para aislar preferencias/scripts/temp. La skill propia está en `.agents/skills/local-magic-art/SKILL.md`: leerla al producir escenas o animaciones. No modificar catálogo global de skills/MCP ni ejecutar servicios de pago/créditos. Fuentes/scripts/manifests y muestras provisionales en `tools/visual/` y `design/production/`; análisis/evidencia en `docs/preparacion-i1/ZERO_COST_PIPELINE.md`. Comandos de producción allí, sin comandos de aplicación. Las formas geométricas de estas pruebas no sustituyen el acabado A12, ni prueban cuentas/premios o valor observado.

### Skills de diseño locales (A28)

Enric pide instalar y usar Taste Skill, Web Design Guidelines, Awesome Design, Image-to-Code y Playwright CLI para mejorar I1. Instaladas en `.agents/skills/`, con orígenes/revisiones en `design-sources.json` y uso/adaptaciones en su README. Para trabajos visuales: Taste orienta y audita; Image-to-Code analiza las referencias aportadas; Awesome Design/fantasy estructura tokens/componentes; Web Design Guidelines comprueba UI; Playwright CLI inspecciona el resultado junto con las pruebas existentes. Leer sus SKILL.md cuando se apliquen. Son guías, no aprobación de producto o arte. Conservar A11/A12/A26, navegación sin barra inferior A27, stack A23 y alcance A25. Sus defaults de generación de imagen, Tailwind/Motion/GSAP, fuentes externas, paletas o nuevas capacidades no prevalecen sobre las instrucciones del proyecto. No instalar globalmente ni añadir gasto. CLI local mediante `npx --no-install playwright-cli`, con sesiones de este proyecto; no cerrar sesiones ajenas. Evidencia A28 en `docs/design-i1-v3/REPORT.md`.

## Identidad y requisitos que se deben conservar

- El marco es el **Callejón Diagón**, con **Weasley como primera tienda jugable**. La entrada debe permitir ir del callejón a la tienda y regresar. No sustituirlo por un universo original ni empezar directamente en una tienda aislada.
- La dirección incluye futuras expansiones por tiendas; no hay segunda tienda, orden, calendario, conexión, acceso o precio elegidos. Los escaparates futuros, si aparecen, deben indicar que no están disponibles.
- Conservar ranas de chocolate, grageas y bromas en la visión. Las ranas pueden entregar cromos de personas u objetos como adaptación del juego; no afirmar que Weasley fabrica todos esos dulces. La caja de bromas está diferida y carece de regla de entrega aprobada.
- La colección conserva descubrimientos y copias, con Personas, Objetos y Sabores y procedencia por tienda. Los objetos obtenidos en cromos comparten identidad con el invento utilizable; no crear una segunda compra para el mismo objeto.
- Incluir rangos y distinta dificultad de obtención desde el prototipo. Para I1 están aprobados tres rangos (A14): R01 Habitual/Common, R02 Singular/Uncommon y R03 Extraordinario/Extraordinary. A18 elige las asignaciones experimentales del catálogo y la tabla exclusiva de bienvenida (PRD §26); balance observado, probabilidades normales y símbolos concretos siguen pendientes. Añadir rangos o variantes shiny queda como posibilidad futura fuera de I1, sin reglas elegidas. La rareza no aumenta potencia ni exige una pieza rara para el tutorial; distinguir rareza, acceso al producto y dificultad del encargo.
- **Español e inglés desde la primera entrega**, incluidas navegación, catálogo, rarezas, estados vacíos, errores, recuperación y textos accesibles. Ningún recorrido se considera terminado en un único idioma.

## Alcance y decisiones

Trabaja por recorridos completos y pequeños con aceptación verificable: una persona debe poder iniciar una acción, completarla y comprobar su resultado. La propuesta del primer incremento y su alcance están en `docs/DECISIONS.md`. Esta preparación documental no autoriza por sí sola a construir, publicar o monetizar la aplicación.

Para cada incremento, documenta antes de implementarlo: estado inicial, acciones del usuario, resultado observable, estado que debe persistir, recuperación ante los fallos pertinentes, alcance incluido/excluido y recursos necesarios. Formula casos con situación, acción y resultado esperado; indica cómo podremos probarlos en español e inglés. Divide un recorrido demasiado grande sin dejar como entrega final una pantalla desconectada o una animación sin comportamiento comprobable.

Documenta las decisiones nuevas en `docs/DECISIONS.md` con su estado y evidencia. Cuando cambie el alcance, actualiza también las secciones afectadas de `docs/PRD.md`, su versión y una nota de cambio; conserva la diferencia entre aprobado, propuesto y pendiente. El Word queda como referencia histórica. No reescribas el alcance porque una configuración experimental resulte conveniente para implementar.

React/TypeScript/Vite, IndexedDB, CSS/GSAP, Kotlin/Spring y PostgreSQL son candidatos del PRD, no decisiones técnicas aprobadas. La preparación recomienda React/TypeScript/Vite + IndexedDB mediante `idb` + CSS, con contratos y alternativas en `docs/preparacion-i1/SYNTHESIS.md` y `stack-dominio.md`; son recomendaciones hasta registrar la elección utilizada al construir. Cuando se autorice implementar, registra la opción utilizada y su motivo. Evita incorporar dependencias sin una necesidad del incremento.

El catálogo de doce identidades C01–C04/O01–O04/S01–S04 está aprobado como configuración experimental de I1 revisable tras probar el prototipo (A15). La bienvenida experimental está elegida por el asistente dentro de la delegación de Enric (A16): regalos O01/O02/S01/S02, una copia cada uno, una rana y grageas reservadas para I2. Priorizar la rana antes del resumen de colección, sin bloquear el álbum ni repetir concesiones. Efectos del taller de invento y sabor, canje 3:1 y vale cada 24 horas con reserva tres siguen propuestos. Distinguir las identidades elegidas de estas reglas pendientes; no presentarlas como balance validado ni compromisos comerciales. No reutilizar conclusiones de la simulación v0.2 para este modelo.

Pagos, variantes premium, energía, consumo de copias al jugar, PvP, trading, chat y exhibición social quedan fuera del primer prototipo. No introducirlos por iniciativa propia. No prometer suministro, garantías de obtención o premios que el recorrido aún no entregue.

## Principios de desarrollo

Enric requiere Clean Code, Clean Architecture, DDD, SOLID, TDD, KISS y YAGNI en el desarrollo y la implementación, según su instrucción del 8 de octubre de 2026. Aplicarlos a los riesgos y comportamientos del incremento, con estas reglas:

- Clean Code: nombres del dominio claros, funciones con responsabilidad concreta, tipos explícitos, errores comprensibles y comentarios que expliquen decisiones cuando sean necesarios.
- Clean Architecture: mantener reglas y casos de uso independientes de React, almacenamiento, animaciones e idioma. Las dependencias de infraestructura apuntan hacia contratos necesarios del núcleo; evitar capas de paso sin responsabilidad.
- DDD: usar el lenguaje del PRD para unidades de producto, aperturas, descubrimientos, copias y versiones; expresar invariantes y el límite transaccional de consumo/entrega. Introducir entidades o value objects cuando aporten identidad, validación o comportamiento real.
- SOLID: separar responsabilidades y depender de contratos pequeños donde haya una frontera real, especialmente persistencia y selección aleatoria comprobable. No exigir una interfaz o clase por cada función ni un repositorio genérico por cada entidad.
- TDD: partir de un comportamiento y una prueba que falle, implementar lo mínimo y refactorizar. Priorizar reglas de apertura, idempotencia, recuperación, atomicidad y concurrencia, más pruebas del recorrido y ambos idiomas. Verificar la persistencia real pertinente además de dobles de prueba; no medir calidad por número de tests ni probar detalles internos sin valor.
- KISS y YAGNI: elegir la solución más simple que cumpla los criterios actuales; no anticipar backend, motores de reglas genéricos, microservicios, event sourcing ni infraestructura de expansiones. Preparar las fronteras necesarias no implica implementar capacidades futuras.

Documentar elecciones de stack y arquitectura con alternativas y motivo en `docs/DECISIONS.md`. Estos principios no seleccionan un stack ni aprueban propuestas de producto; deben conservar el consumo y la entrega dentro de una única transacción.

## Integridad del dominio

- Explorar una estantería o ficha y volver no consume unidades. El gasto requiere una acción explícita que diga qué unidad se usa y qué puede entregar.
- Guardar consumo, resultado, copia y registro de operación en una transacción antes de animar o anunciar éxito. Un fallo de guardado no puede mostrar una recompensa confirmada.
- Cada operación conserva ID, unidad, petición, resultado y versiones. Reintentar la misma petición recupera el mismo resultado; reutilizar su clave con otra petición da conflicto. Otra clave para una unidad consumida se rechaza sin nuevo sorteo.
- Omitir, cambiar idioma, recargar o cerrar tras la confirmación conserva la entrega. Recuperar operaciones antes de mostrar saldos como definitivos. Probar también concurrencia entre pestañas en el prototipo local.
- Mantener IDs compartidos entre idiomas y versiones de catálogo, probabilidades y recursos. No reclasificar silenciosamente hallazgos anteriores ni duplicar copias o saldos al añadir tiendas.
- Validar referencias existentes y pesos positivos y coherentes. La probabilidad mostrada por identidad debe corresponder exactamente a la tabla activa; no confundir porcentaje del rango con porcentaje de cada pieza.
- Los regalos conocidos se distinguen del azar. Los resultados guionizados de pruebas se identifican y quedan fuera de estadísticas de sorteo.
- La primera rana de bienvenida garantiza identidad nueva (A13), persona u objeto, con tabla propia visible y versionada; sus pesos iniciales están elegidos en A18 (PRD §26) y deben validarse antes de habilitar gasto. Configurar catálogo y tabla mediante JSON separados y versionados; derivar porcentajes visibles de los mismos pesos del sorteo. Editar datos debe bastar para ajustes sin cambiar lógica; documentar pasos y validación. No añadir panel administrativo o motor genérico. Cambios solo afectan nuevas operaciones; conservar resultados/rangos/versiones anteriores. Si cambió la tabla desde consultar la ficha, exigir actualizar y reconfirmar antes de consumir. No reutilizar porcentajes R1 normales para la bienvenida ni garantizar un rango. Recargar no repite la concesión; si no hay candidato nuevo válido, no consumir.
- Cuando se implementen: jugar no consume inventos ni sabores; premios únicos por usuario/versión/encargo; canje manual por familia, con destino faltante y protección de la última copia. Cancelar conserva estado y los reintentos no duplican operaciones.

## Localización y accesibilidad

Implementa español e inglés desde el primer componente, incluidos sus estados y etiquetas accesibles; no dejes la localización como adaptación posterior. Usa claves de traducción, mensajes completos con parámetros y plurales, y contenido `es/en` con IDs estables. No concatenar fragmentos ni traducir en runtime mediante una API externa. El cambio de idioma conserva inventario, vista y operación; no cambia reglas, región comercial ni moneda. El criterio de selección inicial de idioma sigue siendo propuesta.

Mantén texto funcional fuera de las imágenes. Actualiza idioma del documento y etiquetas accesibles; formatea números, fechas y probabilidades según la configuración acordada. Comprueba claves ausentes, desbordamientos y estados alternativos en ambos idiomas.

La escena y una lista equivalente ofrecen las mismas acciones. El núcleo debe funcionar con teclado, foco visible y devolución de foco al origen. Anunciar cada resultado una vez. Nombre, familia, rareza y estado no dependen solo de color, sonido, hover o gestos precisos.

Respeta `prefers-reduced-motion` y el ajuste propio. Toda apertura confirmada se puede omitir y tiene resultado estático equivalente. Audio únicamente tras elección explícita. Meta de trabajo WCAG 2.2 AA, pendiente de verificación; controles de 44 × 44 píxeles como objetivo de comodidad, sin atribuirlo al mínimo AA.

## Arte y recursos

El cuento teatral ilustrado 2D es la dirección elegida para I1 (A11). Acabado, paleta definitiva, recursos por capas y tiempos de animación requieren revisión; las propuestas del PRD no se aprueban en bloque. Antes de producir un lote, validar una muestra en contexto de callejón y Weasley; aceptar arte provisional identificado para la demo.

Separar fondo, sujetos, piezas móviles y UI. Registrar autor o modelo, herramienta, referencias, versión, fuente editable, transformaciones, permiso, dimensiones, recorte, pivote y texto alternativo. No llamar SVG a una imagen raster ni rig a una imagen con aspecto 3D. No generar recursos nuevos durante cada apertura. El flujo debe seguir operando con arte ausente.

Si faltan recursos visuales, utiliza sustitutos identificados que permitan probar el recorrido. Distingue en el registro del incremento los assets finales necesarios, los sustitutos previstos y los realmente usados: ID, vista/función, ruta si existe, estado provisional, entrega final requerida y criterio para reemplazarlos. Identifica el arte provisional en la interfaz con texto localizado separado de la ilustración. Un sustituto no aprueba estilo, catálogo o permisos; reemplazarlo no debe cambiar las reglas, los textos ni el estado persistido.

## Fases confianza y servicios externos

El prototipo local debe informar “Guardado en este dispositivo” y su equivalente inglés. El estado local puede borrarse o manipularse. Exportación/importación requiere validación de esquema antes de sustituir datos; un error conserva el estado anterior. Reiniciar requiere confirmación y crea otra ejecución de demo.

El piloto necesita autoridad de servidor para inventario, azar, premios, reposición y canje, además de recuperación autenticada y reglas de conservación/borrado. No importar saldo local manipulable como inventario económico confiable ni afirmar resistencia al reloj por probar una demo local.

Potter DB y HP API son importaciones opcionales revisadas; ninguna apertura o encargo depende de ellas. Decisions API es apoyo solicitado para evaluar alternativas con evidencia; no ha sido ejecutada. No fingir respuestas, acceso, confianza o experimentos. El núcleo no necesita IA en runtime y ningún modelo fija premios, pesos personalizados o cobros.

## Distribución y evidencia

La intención Harry Potter se conserva. El PRD no acredita licencia ni tarifas negociadas: T01 debe documentar materiales, usos y condiciones antes de la distribución o monetización correspondiente. Fan gratuito, composición propia o imagen generada no acreditan autorización. Mantener visible esta incertidumbre sin sustituir el universo elegido ni bloquear la preparación documental o técnica privada por una aprobación imaginada.

No presentar investigación documental como uso real de referentes, entrevistas, demanda, retorno, ventas o rentabilidad. Los escenarios económicos son sensibilidades; las estimaciones excluyen trabajos indicados en el PRD, incluido callejón, rarezas y localización en las tablas anteriores. No inventar resultados de T01–T14.

## Forma de trabajar y terminar

1. Identifica requisito, estado de decisión, dependencias y aceptación antes de editar. Registra cambios de alcance, hipótesis de ensayo y elecciones materiales en `docs/DECISIONS.md`, con fecha y evidencia.
2. Ejecuta las decisiones rutinarias necesarias dentro de la tarea autorizada. Pide aclaración solo ante una elección de producto material no resuelta que impida avanzar; no repetir una aprobación ya recibida.
3. Conserva trabajo ajeno y evita ampliaciones de alcance. Mantén coherentes PRD, decisiones, configuración y comportamiento cuando se autorice un cambio. Señala las diferencias respecto del Word histórico.
4. Verifica el recorrido y los casos adversos adecuados al cambio: transacciones, reintentos, recarga, stock cero, arte ausente, fallos de guardado, versiones y ambos idiomas. Usa pruebas deterministas de dominio y pruebas de interfaz donde comprueben riesgos reales.
5. Ejecuta los comandos reales de compilación, comprobación de tipos y pruebas cuando existan. Registra entorno, versión, comandos, resultado y límites de cobertura; no declarar ejecutadas comprobaciones inexistentes.
6. Entrega distinguiendo documentado, propuesto, implementado, probado y observado con usuarios. Una captura o vídeo no prueba persistencia; una demo local no prueba autoridad de servidor, distribución o continuidad de negocio.
