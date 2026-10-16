# Prompt: preparar I1 con subagentes

Preparado el 9 de octubre de 2026. Referencia de partida: PRD v0.15, A09–A18 e I1-AC01–12. **Primera ejecución de preparación completada el 9 de octubre de 2026 por instrucción explícita de Enric.** Se coordinaron producto/UX, arte/ilustración y stack/dominio, y después revisión independiente; ajustes técnicos integrados. [Síntesis y entregas](preparacion-i1/SYNTHESIS.md). Solo investigación, documentación y una muestra estática: la aplicación y el prompt de implementación `docs/I1_PROMPT.md` siguen sin ejecutar. Las instrucciones siguientes se conservan como encargo reutilizable.

## Prompt para copiar y ejecutar

Actúa como coordinador de preparación de I1 de Colección Mágica. Crea subagentes especializados para reducir las incertidumbres que afectan a construir y evaluar el recorrido Callejón Diagón → Weasley → detalle de rana → apertura recuperable → colección.

Lee completos `AGENTS.md`, `docs/PRD.md`, `docs/DECISIONS.md` y `docs/I1_PROMPT.md`. Cada especialista debe leer esas mismas fuentes antes de trabajar. Inspecciona el estado actual del repositorio y el concepto `design/concepts/i1/weasley-concept-v1.png`, con su registro de procedencia. El PRD es la referencia principal; instrucciones actuales de Enric prevalecen.

Conserva D02/D09/D10 y A09–A18: fan adulto casual, visita mágica y recuerdo, dirección teatral 2D y acabado detallado elegido, doce identidades, tres rarezas, bienvenida finita y nueva garantizada, ES/EN desde el primer componente y configuración sencilla mediante datos versionados. La asignación experimental y la tabla de bienvenida están elegidas; no volver a elegirlas o modificar sus pesos para este análisis.

Esta fase autoriza investigación, documentación y diseño estático. No implementes la aplicación, instales dependencias, despliegues, publiques, subas a GitHub o crees nuevos chats. Usa subagentes de esta tarea, no tareas independientes. No ejecutes aún `docs/I1_PROMPT.md`. No construyas un lote de ilustraciones. Puedes preparar una muestra visual estática acotada para estudiar integración y recorte, conservando el estilo aprobado; identifica procedencia y arte provisional. Si necesitas generar o editar imágenes, usa la skill y herramienta de imágenes disponibles y las referencias locales observadas. Esa muestra no acredita capas editables, assets finales, accesibilidad funcional ni preferencia de usuarios.

### Coordinación y propiedad de archivos

Crea los especialistas `producto_ux`, `arte_ilustracion`, `stack_dominio` y `revision_qa`. Ejecuta los tres primeros en paralelo si la capacidad lo permite; mantén como máximo tres hijos activos a la vez. El revisor trabaja después de sus entregas y de una síntesis inicial del coordinador. Adapta la concurrencia a la capacidad disponible sin omitir responsabilidades.

Cada especialista escribe únicamente su entrega asignada dentro de `docs/preparacion-i1/`; puede leer las otras. La muestra artística y su procedencia corresponden únicamente a `arte_ilustracion`, bajo `design/preparation/i1/`. El coordinador integra los documentos compartidos y es el único que edita `AGENTS.md`, PRD, DECISIONS, README y prompts. Conserva archivos existentes y evita sobrescrituras de trabajo ajeno.

Cada entrega debe indicar: incertidumbres U y criterios I1-AC afectados; hechos verificados con referencias; recomendación; alternativas y consecuencias; supuestos; evidencia que falta; comportamiento que podremos comprobar y método; dependencia, responsable y siguiente acción. Distingue **documentado**, **recomendado para I1**, **comprobado técnicamente** y **pendiente de observar con usuarios**. Una recomendación entre agentes no es aprobación de producto.

### Subagente 1: producto y UX

Entrega: `docs/preparacion-i1/producto-ux.md`.

Trabaja sobre U02/U03/U06/U07/U20/U23/U24 y A17, solo en lo pertinente a I1. Define el recorrido completo en móvil y escritorio: entrada/regreso, exploración sin gasto, detalle y probabilidades, confirmación, apertura omitible, resultado, álbum y stock agotado. Describe jerarquía visual, acciones, estados vacíos, carga, errores y recuperación. Incluye escena/lista equivalente, foco y etiquetas; no sustituir el callejón por una tienda aislada.

Prepara wireframes estáticos o descripción precisa de composición con textos ES/EN: una vista del callejón, interior y resultado/colección; muestra expansiones de texto y zonas donde colocar arte. El relato prioriza la rana sin bloquear consulta de regalos o imponer tutorial. No prometer suministro o funcionalidades futuras.

Recomienda una opción de ensayo para idioma inicial y formatos, manteniendo P10 como propuesta hasta que exista una elección autorizada registrada. Prepara glosario ES/EN de navegación, familias, rangos, guardado, errores y productos; nombres oficiales dudosos requieren revisión, no invención de autoridad.

Prepara el protocolo A17: ocho sesiones posteriores con fans adultos casuales, registro de ayudas, explicación de resultado/conservación y exploración de otra ficha antes de sugerirla. Mantén 6/8 y 4/8 como objetivos elegidos. Propón reclutamiento, reparto por idioma y preguntas neutrales. No contactar personas, inventar entrevistas o afirmar que el prototipo engancha. Explica qué no puede medirse con una sola rana nueva: repetidos reales, retorno y balance a lo largo de sesiones.

### Subagente 2: diseño artístico e ilustraciones

Entrega: `docs/preparacion-i1/arte-ilustraciones.md`; muestra y manifest de procedencia, si se producen, bajo `design/preparation/i1/`.

Trabaja sobre U12/U13/U14/U18/U21 y los recursos I1-V01–06. Inspecciona el concepto existente; conserva cuento teatral 2D y su acabado detallado. Concreta propuesta de paleta, recortes, legibilidad y separación de fondo, sujetos, piezas móviles y UI. Coordina composición con producto/UX; no incrustar texto funcional en imágenes.

Prepara como máximo una muestra estática en contexto de móvil que permita revisar un recorte de Weasley con controles ES/EN y espacio para el resultado, usando el concepto o sustitutos identificados. No reabrir el estilo para comparar otros universos o producir una galería. Si no puedes producirla, entrega especificación de composición y la limitación exacta; no presentar un bitmap compuesto como capas o rig.

Entrega manifest de assets: ID, función/vista, ruta si existe, estado actual, provisional o final pendiente, dimensiones/recorte, piezas móviles/pivotes pertinentes, autor/herramienta/modelo si consta, referencia, versión, fuente editable disponible o ausente, permiso conocido o pendiente, texto alternativo o función decorativa, formato final requerido y criterio de sustitución. Diferencia necesario, previsto y realmente usado. Una imagen generada no acredita autorización de distribución.

Estima producción como rango de esfuerzo con supuestos y exclusiones; no inventar horas medidas. Propón un pipeline corto para mantener consistencia y preservar rendimiento, acceso a controles y arte ausente. No generar recursos en cada apertura ni implementar animaciones.

### Subagente 3: stack, arquitectura y dominio

Entrega: `docs/preparacion-i1/stack-dominio.md`.

Trabaja sobre U15/U18/U19/U20 y la configuración A18. Compara como máximo dos o tres alternativas razonables para una demo web local recuperable; evalúa el candidato React/TypeScript/Vite + IndexedDB + CSS. Recomienda una con motivo, dependencias mínimas, costes de complejidad y límites. Consulta documentación primaria actual para afirmaciones sobre librerías, soporte, transacciones y herramientas; cita URLs y fecha. No seleccionar backend del piloto ni instalar el stack en esta fase.

Aplica Clean Code, Clean Architecture, DDD, SOLID, TDD, KISS y YAGNI de forma concreta: dominio y casos de uso separados de UI/almacenamiento/idioma, contratos pequeños y solo capas con responsabilidad. Define unidades, descubrimientos, copias, operaciones y versiones, sin un repositorio genérico por entidad o infraestructura para shiny/tiendas futuras.

Especifica el límite transaccional consumo + resultado + copia + operación; recuperación antes de saldos definitivos; idempotencia y conflictos; doble toque y dos pestañas; fallos antes/después de commit. Define lo necesario para conservar resultados/versiones al cambiar catálogo o pesos, validar importación y reconfirmar una ficha obsoleta. No aceptar saldo manipulable como autoridad económica.

Diseña el contrato mínimo de los JSON de catálogo y bienvenida y un procedimiento breve de edición/validación/versionado: la UI calcula porcentajes de la misma tabla del sorteo. Mantén los datos aprobados de A18. No introducir panel administrativo, configuración remota o motor de reglas.

Propón estructura mínima del proyecto y estrategia TDD por comportamiento, con pruebas de dominio, persistencia real y recorrido bilingüe. Identifica qué exige un experimento o implementación posterior para demostrar viabilidad; documentación técnica y esquema de arquitectura no prueban atomicidad real, concurrencia o recuperación. Comandos propuestos se identifican como pendientes, no como comandos ya existentes o ejecutados.

### Subagente 4: revisión independiente de calidad

Entrega: `docs/preparacion-i1/revision-qa.md`.

Lee las tres entregas, fuentes originales y síntesis inicial. Contrasta estados de decisión y detecta contradicciones, ampliaciones de alcance, exceso de arquitectura, arte sin procedencia, limitaciones omitidas y afirmaciones sin evidencia. No implementar ni corregir archivos de otros especialistas.

Revisa I1-AC01–12 mediante matriz situación → acción → resultado → modo de prueba → ES/EN → evidencia actual o pendiente. Incluye transacción y reintento, dos pestañas, recarga, guardar antes de animar, stock cero, versiones distintas, importación inválida, reinicio cancelado, arte ausente, teclado/foco, lector, movimiento reducido y errores/plurales/desbordamiento bilingües. Revisa la edición sencilla de la configuración, sin alterar entregas previas.

Separa preparación suficiente para implementar de comportamiento pendiente de probar. Prioriza hallazgos por su consecuencia en el recorrido; no aprobar por mayoría o cerrar incertidumbres de producto sin usuarios. Comprueba que los objetivos de A17 puedan observarse sin instrucciones inductoras, incentivos extra o resultados guionizados.

### Integración y cierre del coordinador

Produce `docs/preparacion-i1/SYNTHESIS.md` con cuatro grupos: recomendaciones concretas para construir I1; decisiones de producto que aún requieran elección; hipótesis que necesita comprobar el prototipo; cuestiones diferidas hasta piloto/distribución u otros incrementos. No intentar resolver todas las U01–U24 antes de I1.

Incluye matriz incertidumbre → estado previo → evidencia obtenida → estado actual → responsable/próxima acción; decisiones técnicas recomendadas con alternativas; recorrido y estados; assets realmente disponibles y faltantes; contrato de configuración; matriz de pruebas; riesgos materiales y límites; orden de pequeños pasos completos para implementar. Proporciona un siguiente paso concreto por cada incertidumbre restante.

Pide a los especialistas que ajusten sus entregas si la revisión encuentra contradicciones; integra sin cambios paralelos en documentos compartidos. Registra recomendaciones y evidencias en `docs/DECISIONS.md` con estado y fecha. No convertir una recomendación técnica en decisión aprobada ni un diseño estático en comportamiento probado. Actualiza PRD y versión solo ante cambio autorizado de alcance; conserva el Word. Añade al prompt de I1 las recomendaciones identificadas como tales, sin activarlo.

Resuelve elecciones rutinarias de preparación dentro de este encargo. Solo pregunta a Enric si una elección material de producto no resuelta impide avanzar, y haz una pregunta cada vez con recomendación, supuestos y alternativa. Antes de esa pregunta, presenta el resultado concreto y revisable y continúa tareas independientes que no dependan de la respuesta.

Entrega enlaces a los archivos y una síntesis breve: qué quedó definido documentalmente, qué sigue siendo recomendación, qué se podrá comprobar al construir y qué necesita usuarios o evidencia externa. Concluye si I1 está preparado para comenzar y enumera únicamente impedimentos reales. No afirmar que se ha implementado, ejecutado pruebas, aprobado assets finales, validado demanda, obtenido licencia o cerrado un riesgo solo por haberlo analizado. No ejecutar la implementación ni publicar el trabajo al terminar.
