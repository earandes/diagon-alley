# U06–U08 · Mapa y preparación

> Actualización del coordinador: los casos propios A92 del candidato6747f81 pasan en CI39323571082 y las imágenes seleccionadas se han inspeccionado. Los apartados inferiores conservan el estado histórico del subrecorrido; el cierre integrado, sus regresiones y límites vigentes se registran en [QA](QA.md), [aceptación](ACCEPTANCE.md) y [galería](GALLERY.md).

## Contrato previo

Baseline main86d6a92; implementación A92 en rama de trabajo. Solo presentación y proyección visual, sin modificar grafo, reglas, inventario, BattleLog ni operaciones. Consultar sigue sin emitir avance. No navegador local, servicios o CI desde este agente.

Hechos contrastados: MapPanel solo refuerza conexiones inmediatamente disponibles sobre las líneas Pixi; futuras conexiones quedan poco separadas del paisaje (calidad perceptiva pendiente de Linux). El nombre de BossPartyStage usa overflow-wrap:anywhere dentro de cinco columnas móviles; captura histórica A71 muestra apellidos partidos. BossPartyStage no pasa run.bondFocus a su previsualización, aunque el mapa sí: defecto estático comprobado que se cubre con SSR. Afinidad/vínculo/intención existen y no deben parecer el mismo tipo de bono.

## Dos composiciones y elección

A. Estandarte del vínculo sobre la formación y afinidad junto a cada retrato. Conexiones completas mediante soporte oscuro localizado y trazo de estado. Mantiene reconocimiento del plan sin abrir otro panel. Para nombres, puestos3+2 en móvil cuando sean4/5; consume una segunda fila y necesita comprobar altura.

B. Medallón único abre toda la información; fila de cinco puestos con tipografía comprimida. Ahorra altura, pero oculta la distinción táctica y perpetúa apellidos rotos.

Elegida A, con estandarte compacto y consulta nativa existente. No añadir otra pantalla ni frases permanentes de explicación. La prueba Linux debe contrastar el coste vertical de3+2 con altura disponible; no se declara mejor únicamente por CSS. Todas las unidades/PV/PM/equipo continúan presentes; texto ampliado puede desplazar el diálogo de forma accesible.

## Aceptación

- Todos los enlaces públicos del grafo representados; tramo realmente visitado distingue de destino visitado aislado. Disponible/futuro/consultado por patrón y grosor además de color. El resaltado de consulta es estático, sin loops.
- Foco o consulta resalta relaciones conocidas, sin iniciar operaciones ni revelar resultados.
- Afinidad en puesto; vínculo del equipo con etiqueta y detalle; intención conserva recordatorio de ruta separado. Solo cálculos compartidos.
- Modo elegido de vínculo conserva exactitud en la antesala, incluidos históricos sin nuevas reglas.
- Nombres completos por palabras, todas las unidades/PV/PM visibles. Condición, procedencia, equipo y asignación no desaparecen.
- Ambos packs y ES/EN,320/390/865/1280, texto ampliado, teclado/reducido. Composición/animación y medidas reales pendientes de CI coordinada.

## Implementación y comprobaciones

Implementado:

- `map-route-connections.ts`: modelo puro de aristas públicas; solo pares consecutivos realmente visitados se pintan recorridos. La consulta añade énfasis sin cambiar estado o disponibilidad.
- `MapRoutePaths.tsx`/`map-route-clarity-a92.css`: SVG decorativo sobre la misma geometría de `fitMapLayout`, soporte oscuro local y patrones futuro/visitado/disponible/consultado. Sin hit targets, tickers, reloj o azar nuevos. El trazo de confirmación A69 continúa encima, no queda tapado.
- `MapPanel.tsx`: foco y consulta usan el mismo identificador público; inspección y lista mantienen comandos y retorno de foco originales. Se reemplaza el antiguo refuerzo solo de ramas disponibles, sin tocar Pixi.
- `BondBand.tsx`/`HouseInsignia.tsx`/`plan-grammar-a92.css`: etiqueta breve Vínculo/Bond en el estandarte existente. `PreparationSynergies.tsx` distingue Afinidades/Affinities con el detalle existente. No se cambian conteos o bonos.
- `TeamHud.tsx`: afinidad real próxima al retrato y en la consulta. En una run usa la unidad congelada; fuera de run utiliza el mapa público de afinidades o no muestra un dato desconocido. No infiere afinidad desde la clasificación.
- `BossPartyStage.tsx`: corrige `mode={run.bondFocus}` omitido, muestra afinidad con descripción accesible y mantiene condición/objetos. `boss-staging.css` conserva nombres por palabra y distribuye puestos4 en2×2 y5 en3+2 cuando cabe; anchura mínima en rem permite reflujo con texto ampliado. No se ocultan unidades, PV, PM o equipo.

### TDD y comandos ejecutados

1. `npx --no-install vitest run tests/domain/arcana/map-route-clarity-a92.test.ts`: rojo inicial por módulo todavía inexistente; tras añadir el modelo, dos pruebas de preview ES/EN fallaron mostrando que Auto reemplazaba la elección guardada.
2. Después de corregir el consumidor, conjunto acotado de5archivos:25/25verdes.
3. `npx --no-install vitest run tests/domain/arcana/map-route-clarity-a92.test.ts tests/domain/arcana/map-layout.test.ts tests/domain/arcana/map-presentation-a60.test.ts tests/domain/arcana/boss-stage-a71.test.ts tests/domain/arcana/boss-prelude-a70.test.ts tests/domain/arcana/bond-combat-a87.test.ts tests/domain/arcana/contextual-preparation.test.ts`:38/38verdes,7archivos. No navegador ni servicios.
4. `npx --no-install tsc --noEmit`: pasó después de corregir el origen de afinidad; se observaron errores transitorios de archivos concurrentes y se notificaron al coordinador, sin cambiar esos archivos.
5. Prettier dirigido a archivos propios. Detector Impeccable ejecutado una vez sobre los10consumidores visuales:0hallazgos, JSON original `map-preparation-detector.json`. No prueba calidad estética.

### Comprobación Linux preparada, no ejecutada por este agente

`tests/browser-experience-clarity/map-preparation-a92.html` y su harness son fixtures declaradas compatibles con el baseline: importan componentes que ya existían, nunca unidades ganadas ni operaciones reales. Parámetros mode/pack/lang/count/large. Spec con ocho casos por proyecto: toda la adyacencia pública, consulta/foco sin POST/avance, cinco puestos, nombres sin fragmentar la palabra más larga, CTA y callback de preparación sin mutar estado. Capturas opt-in solo Linux y proyecto chromium-390-a92; dos muestras seleccionadas mapa/antesala. URL de fixture por defecto5621, configurable A92_FIXTURE_URL.

El harness tiene un contenedor de mapa declarado para comparación componente a componente; no sustituye la prueba del mapa dentro de App con cabecera y navegación reales. La fixture de antesala conserva la estructura de diálogo real. El coordinador añadirá ambos al build de pruebas y ejecutará la batería protegida.

### Límites y pendientes

No nueva captura ni navegador en este Mac. CSS3+2 es una implementación candidata, no evidencia de mejor encuadre. Falta revisar altura, scroll ordinario del mapa real, nombre/palabra y recursos de cinco puestos dentro del flujo integrado en Linux,320/390/865/1280, ambos packs/idiomas,115%y200%, teclado y reducido. La suite histórica de arena debe comprobar3×3/5×3/5×5 sin cambiar replay. No hay mediciones nuevas rAF/GPU ni pruebas humanas. Si la altura de3+2 compite con la confirmación, corregir composición con evidencia; no ocultar filas o reducir datos para pasar.

No nuevos assets, dependencias, sonidos o reglas. Las líneas SVG son presentación procedural local, no un lote de ilustraciones. No commits/push/servicios ejecutados por el agente.

## Revisión final · consumidor de grageas

El coordinador detectó el mismo riesgo en `BeanAssignments`: su llamada final a `PreparationSynergies` omitía `mode={run.bondFocus}`. Es un defecto dentro U07: una formación con vínculo guardado Mortífagos y tres contribuyentes tanto de Orden como Mortífagos mostraba el grupo elegido por Auto (Orden), aunque el combate conservaría Mortífagos.

La prueba SSR ES/EN se amplió con una run actual cuyo snapshot contiene las reglas de ambos grupos, para no confundir la ausencia deliberada de vínculos de una run histórica sin snapshot con este defecto. La fixture inicial sin snapshot mostró precisamente ese fallback histórico; corregida la fixture, el rojo confirmó `order` frente al `death` esperado. Cambio mínimo: pasar el modo guardado en ese consumidor, sin tocar asignación, stock, reglas efectivas o commit.

Comprobación ejecutada tras la corrección: `npx --no-install vitest run tests/domain/arcana/map-route-clarity-a92.test.ts tests/domain/arcana/commerce-preparation-a89.test.ts`:15/15verdes en2archivos. No navegador/servicios/CI/Git.

Consumidores equivalentes contrastados: TeamHud y propuesta de Pacto ya pasan run.bondFocus; ExpeditionPreparation pasa su borrador bondFocus; BossPartyStage ya fue corregido en este incremento. BossPrelude y BondBand de rivales conservan Auto porque no representan la elección propia y el motor resuelve por defecto el vínculo rival mediante effectiveBondFocus(input.rival, rules.bonds). No se les propaga el modo del jugador.

### Corrección tras inspección Linux

La comparación con el paisaje real en72434bb mostró que aplicar soporte7px a todas las ramas futuras formaba una malla dominante. Se reduce únicamente futuro a4px/opacity0,65 con tinta1,5px; disponible/recorrido/consulta mantienen jerarquía y todos los enlaces. La consulta restituye soporte opaco local. Es una corrección de composición basada en PNG seleccionadas, no prueba de comprensión humana. Requiere nueva comparación sobre el candidato que la incluya.

La prueba de palabras a865px falló realmente en214f7e4. Se amplía3+2 al tramo de media escena de escritorio621–1000px, y2+2 para cuatro. No se reduce fuente ni se permite overflow; se conserva la misma aceptación y se registra geometría antes de exigirla, también cuando falle. Las bandejas de objetos vacías dejan de reservar una fila sin información. Se añade una única captura seleccionada865 para inspeccionar el caso corregido.

## Correcciones de integración posteriores a la primera muestra

La antesala real añade botín y tarro que no figuraban en el primer harness aislado. Sus dos filas de cuatro/cinco puestos compiten con el pie sticky. Los errores de CI y sus cifras se conservan en QA; la nueva fixture usa NodePreparation y BossSupplies reales, stock y botín, no una copia de su markup.

La afinidad pasa a una pieza localizada del retrato, sin una fila propia por integrante. Posición y procedencia mantienen esquinas separadas; texto y aria-describedby permanecen. Retrato60px móvil sin deformación; si falla, su marco conserva altura y el icono no puede tomar el selector de figura. Libro rival y botín comparten la estantería existente para cuatro y cinco; su summary conserva44px de área mínima con relleno local2px4px, sin bajar tipografía o ilustración. No se ocultan datos ni se retira un actor.

La geometría se obtiene de control y footer en una sola lectura síncrona, incluyendo el estado inicial antes de desplazar el diálogo. Se conservan viewport completo y bottom≤footerTop. No se usa una espera de animación para pasar la aserción; las capturas seleccionadas se toman después para documentar composición asentada. El resultado final del candidato f1910b1 se registra en QA al terminar.

### Cinco miembros equipados y borradores

CI39334495446 comprobó otro caso real del harness A85: cinco miembros con varita/escoba y gragea asignada superaban la altura disponible; el tarro terminaba40,81px/41,75px dentro del footer. Se conserva el fallo. BossSupplies es ahora un slot explícito de BossPartyStage; formación, afinidades y tarro comparten una repisa de tres objetos en móvil. Ambos details abiertos recuperan todo el ancho. Props, eventos, equipo y orden semántico permanecen; no display:contents sobre secciones ni posicionamiento superpuesto. El título comercial largo se abrevia visualmente a Grageas/Beans; borrador breve tiene descripción accesible sin consumo. No se reduce la figura60px, nombre, PV/PM o equipo. Pendiente aceptación Linux c6810fc; no presentar análisis estático como resultado de navegador.
