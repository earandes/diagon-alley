# Instrucciones del proyecto Colección Mágica

## Fuentes y estado

Lee `docs/PRD.md` completo y `docs/DECISIONS.md` antes de proponer cambios de producto o implementar un recorrido. El PRD procede de `docs/PRD_Coleccion_Magica.docx`, versión 0.5 del 8 de octubre de 2026. Conserva ese Word como referencia original sin modificarlo salvo petición explícita.

Las instrucciones actuales de Enric prevalecen. Usa el PRD como referencia principal de producto. El PRD describe tanto decisiones como hipótesis; `docs/DECISIONS.md` distingue aprobadas, propuestas e incertidumbres. Una recomendación escrita, una preferencia de un modelo o una implementación experimental no equivalen a aprobación de producto. Si aparece una contradicción material, explícitala y resuélvela con la instrucción más reciente, sin inventar decisiones previas.

Estado actualizado el 8 de octubre de 2026: documentación y repositorio Git inicializado en `main`, con remoto `https://github.com/earandes/diagon-alley.git`; sin código de aplicación, manifiesto de dependencias ni comandos de pruebas. No atribuyas una plataforma o infraestructura implementada al proyecto. Actualiza este estado y documenta los comandos reales cuando existan.

## Identidad y requisitos que se deben conservar

- El marco es el **Callejón Diagón**, con **Weasley como primera tienda jugable**. La entrada debe permitir ir del callejón a la tienda y regresar. No sustituirlo por un universo original ni empezar directamente en una tienda aislada.
- La dirección incluye futuras expansiones por tiendas; no hay segunda tienda, orden, calendario, conexión, acceso o precio elegidos. Los escaparates futuros, si aparecen, deben indicar que no están disponibles.
- Conservar ranas de chocolate, grageas y bromas en la visión. Las ranas pueden entregar cromos de personas u objetos como adaptación del juego; no afirmar que Weasley fabrica todos esos dulces. La caja de bromas está diferida y carece de regla de entrega aprobada.
- La colección conserva descubrimientos y copias, con Personas, Objetos y Sabores y procedencia por tienda. Los objetos obtenidos en cromos comparten identidad con el invento utilizable; no crear una segunda compra para el mismo objeto.
- Incluir rangos y distinta dificultad de obtención desde el prototipo. Los nombres, asignaciones y probabilidades son propuestas. La rareza no aumenta potencia ni exige una pieza rara para el tutorial; distinguir rareza, acceso al producto y dificultad del encargo.
- **Español e inglés desde la primera entrega**, incluidas navegación, catálogo, rarezas, estados vacíos, errores, recuperación y textos accesibles. Ningún recorrido se considera terminado en un único idioma.

## Alcance y decisiones

Trabaja por recorridos completos y pequeños con aceptación verificable: una persona debe poder iniciar una acción, completarla y comprobar su resultado. La propuesta del primer incremento y su alcance están en `docs/DECISIONS.md`. Esta preparación documental no autoriza por sí sola a construir, publicar o monetizar la aplicación.

Para cada incremento, documenta antes de implementarlo: estado inicial, acciones del usuario, resultado observable, estado que debe persistir, recuperación ante los fallos pertinentes, alcance incluido/excluido y recursos necesarios. Formula casos con situación, acción y resultado esperado; indica cómo podremos probarlos en español e inglés. Divide un recorrido demasiado grande sin dejar como entrega final una pantalla desconectada o una animación sin comportamiento comprobable.

Documenta las decisiones nuevas en `docs/DECISIONS.md` con su estado y evidencia. Cuando cambie el alcance, actualiza también las secciones afectadas de `docs/PRD.md`, su versión y una nota de cambio; conserva la diferencia entre aprobado, propuesto y pendiente. El Word queda como referencia histórica. No reescribas el alcance porque una configuración experimental resulte conveniente para implementar.

React/TypeScript/Vite, IndexedDB, CSS/GSAP, Kotlin/Spring y PostgreSQL son candidatos del PRD, no decisiones técnicas aprobadas. Cuando se autorice implementar, registra la opción utilizada y su motivo. Evita incorporar dependencias sin una necesidad del incremento.

El catálogo de doce identidades, los cuatro regalos, el taller de invento y sabor, el canje 3:1 y el vale cada 24 horas con reserva tres siguen siendo reglas propuestas. Pueden formar una configuración experimental identificada; no presentarlas como balance validado ni compromisos comerciales. No reutilizar conclusiones de la simulación v0.2 para este modelo.

Pagos, variantes premium, energía, consumo de copias al jugar, PvP, trading, chat y exhibición social quedan fuera del primer prototipo. No introducirlos por iniciativa propia. No prometer suministro, garantías de obtención o premios que el recorrido aún no entregue.

## Integridad del dominio

- Explorar una estantería o ficha y volver no consume unidades. El gasto requiere una acción explícita que diga qué unidad se usa y qué puede entregar.
- Guardar consumo, resultado, copia y registro de operación en una transacción antes de animar o anunciar éxito. Un fallo de guardado no puede mostrar una recompensa confirmada.
- Cada operación conserva ID, unidad, petición, resultado y versiones. Reintentar la misma petición recupera el mismo resultado; reutilizar su clave con otra petición da conflicto. Otra clave para una unidad consumida se rechaza sin nuevo sorteo.
- Omitir, cambiar idioma, recargar o cerrar tras la confirmación conserva la entrega. Recuperar operaciones antes de mostrar saldos como definitivos. Probar también concurrencia entre pestañas en el prototipo local.
- Mantener IDs compartidos entre idiomas y versiones de catálogo, probabilidades y recursos. No reclasificar silenciosamente hallazgos anteriores ni duplicar copias o saldos al añadir tiendas.
- Validar referencias existentes y pesos positivos y coherentes. La probabilidad mostrada por identidad debe corresponder exactamente a la tabla activa; no confundir porcentaje del rango con porcentaje de cada pieza.
- Los regalos conocidos se distinguen del azar. Los resultados guionizados de pruebas se identifican y quedan fuera de estadísticas de sorteo.
- Cuando se implementen: jugar no consume inventos ni sabores; premios únicos por usuario/versión/encargo; canje manual por familia, con destino faltante y protección de la última copia. Cancelar conserva estado y los reintentos no duplican operaciones.

## Localización y accesibilidad

Implementa español e inglés desde el primer componente, incluidos sus estados y etiquetas accesibles; no dejes la localización como adaptación posterior. Usa claves de traducción, mensajes completos con parámetros y plurales, y contenido `es/en` con IDs estables. No concatenar fragmentos ni traducir en runtime mediante una API externa. El cambio de idioma conserva inventario, vista y operación; no cambia reglas, región comercial ni moneda. El criterio de selección inicial de idioma sigue siendo propuesta.

Mantén texto funcional fuera de las imágenes. Actualiza idioma del documento y etiquetas accesibles; formatea números, fechas y probabilidades según la configuración acordada. Comprueba claves ausentes, desbordamientos y estados alternativos en ambos idiomas.

La escena y una lista equivalente ofrecen las mismas acciones. El núcleo debe funcionar con teclado, foco visible y devolución de foco al origen. Anunciar cada resultado una vez. Nombre, familia, rareza y estado no dependen solo de color, sonido, hover o gestos precisos.

Respeta `prefers-reduced-motion` y el ajuste propio. Toda apertura confirmada se puede omitir y tiene resultado estático equivalente. Audio únicamente tras elección explícita. Meta de trabajo WCAG 2.2 AA, pendiente de verificación; controles de 44 × 44 píxeles como objetivo de comodidad, sin atribuirlo al mínimo AA.

## Arte y recursos

El cuento teatral ilustrado 2D por capas, la paleta del PRD y los tiempos de animación son dirección candidata. Antes de producir un lote, validar una muestra en contexto de callejón y Weasley; aceptar arte provisional identificado para la demo.

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
