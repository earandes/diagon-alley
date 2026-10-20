# A92 · Cromodex y suministros

> Actualización del coordinador: los casos propios A92 del candidato6747f81 pasan en CI39323571082 y las imágenes seleccionadas se han inspeccionado. Los apartados inferiores conservan el estado histórico del subrecorrido; el cierre integrado, sus regresiones y límites vigentes se registran en [QA](QA.md), [aceptación](ACCEPTANCE.md) y [galería](GALLERY.md).

## Contrato y elección

U09/U10/U11 implementados en consumidores reales, sin reglas, consumo, dependencias o assets nuevos. U01 usa `collectionCompletion` compartida; U05 usa `CloseButton` independiente de descargas. Conservar A90, snapshots, copias y localización. La recuperación económica sigue en los comandos existentes; la selección visual no concede resultados.

### Variantes consideradas

1. **Portada con retrato + consulta nativa** frente a mantener todos los rasgos, estrellas y etiquetas en cada portada. Elegida la primera: nombre, ilustración, emblema casa/criatura, rareza, copias y acabado conservan contexto breve; ficha nativa contiene rasgos completos, estrellas de la copia seleccionada, relato y procedencia/catálogo. Fuentes y objetivo siguen accesibles en el folio, sin otra pantalla. Las copias se consultan bajo un segundo pliegue y mantienen IDs.
2. **Doblefolio adaptativo4/8** frente a índice nuevo de familias. Elegido el doblefolio: filtros de clasificación existentes bastan; no añade navegación paralela. Capacidad8 cuando el álbum dispone de760px,4 por debajo. Conserva el offset de la página, no su número: al cambiar capacidad, la identidad que ocupaba ese tramo continúa incluida. ResizeObserver solo observa geometría y se desconecta al desmontar; no sondeo por frame. El filtro activo tiene resumen y limpieza deliberada.
3. **Un tarro agregado con navegación de unidades concretas** frente a un botón por cada unidad o asignación implícita sin referencia. Elegido el primero: un objeto ilustrado constante, dos controles de navegación como máximo y hasta cinco accesos de asignación sobre retratos. El stock se expresa ×N; la unidad seleccionada dice TarroN, sin fracción que parezca una tarea. La navegación no consume, compra ni asigna. Cada borrador sigue enviando `beanId` y `unitId` concretos.

## Evidencia → corrección → aceptación

| Hallazgo | Evidencia A91/código inicial | Cambio | Comprobación |
|---|---|---|---|
| U09 | Portada acumulaba retrato, rasgos, acabado, rareza, estrellas, copias y estado | Dos niveles, retrato mayor y datos de copia bajo consulta; acceso a fuente conserva prioridad | Muestra con multirrasgo/encantado/repetido/archivo; ninguna estrella reconstruida por rareza |
| U10 | `available.map` generaba un control por tarro, stock no acotado | Un objeto, navegación y atajos por asignación ya existente; `validBeanAssignments` y `assignBean` intactos | Stock0/1/3/30/100; caído deshabilitado; temporal y duplicado por instancia; consulta/cancelación no cambia inventario |
| U11 | Cuatro cartas para todas las anchuras; hasta9páginas con34 |4/8, contador y limpieza de filtros; vuelta conserva offset, selección y foco |34identidades,35copias declaradas+archivo, filtro/limpieza, retorno, reflujo y ambos idiomas/paquetes |
| U01 consumidor | Denominador incluía archivo de identidades conservadas | Contador principal desde proyección común y archivo separado | Copias/encantado no aumentan descubrimientos, progreso≤100% |
| U05 consumidor | Cierre solo bitmap | X vectorial nativa, no depende de arte | Escape/activación/foco y fallo de descarga |

## Archivos propios

- `src/arcana/presentation/CollectionPanel.tsx`.
- `src/arcana/presentation/BeanAssignments.tsx`.
- `src/arcana/presentation/collection-supplies-model.ts`.
- `src/arcana/presentation/collection-supplies-messages.ts`.
- `src/arcana/presentation/collection-supplies.css`.
- `tests/domain/arcana/collection-supplies-a92.test.ts`.
- `tests/browser-experience-clarity/collection-supplies-a92.html`, `.tsx`, `.spec.ts`.
- `tests/browser-experience-clarity/vite-collection-a92.config.ts`.

No cambios en CSS global, motor, contratos económicos, dominio de asignación, IndexedDB, PostgreSQL o Redis. Dependencias compartidas U01/CloseButton del coordinador; su integración se valida conjuntamente.

## Recursos y movimiento

Reutilizados retratos, miniaturas, reverso, tarro, sellos, rareza y emblemas existentes. Ningún archivo de imagen, audio o renderer nuevo; iconos de navegación SVG inline de trazo homogéneo. No lote, export ni cambio de licencia. Se conserva `useSelectionMotion`160ms al cambiar filtro/página, con cancelación al ocultar, limpieza y reducido; sin animación al conceder recompensas porque estas vistas consultan. El folio y las grageas no crean relojes nuevos. Acabado encantado permanece cosmético.

## Pruebas locales ejecutadas (no gráficas)

1. `npx --no-install vitest run tests/domain/arcana/collection-supplies-a92.test.ts` falló al no existir el módulo (rojo esperado).
2. Tras modelo mínimo:8pruebas puras correctas.
3. Se añadieron3pruebas SSR. Dos fallos de fixture identificados: acabado usaba`kind`en lugar de`id`, y se esperaba`×30`cuando el texto vigente es`30 copias guardadas`. Se corrigió la fixture/expectativa, no las reglas ni la UI para satisfacerla.
4. Última ejecución: `npx --no-install vitest run tests/domain/arcana/collection-supplies-a92.test.ts tests/domain/arcana/collection-goal-a89.test.ts tests/domain/arcana/contextual-preparation.test.ts`: **31tests correctos en3archivos**.

SSR comprueba semántica, conteo acotado y ausencia de efectos durante render. No acredita geometría, animación, interacción real, persistencia ni percepción humana. Las pruebas puras conservan IDs y no mutan inputs; los tests económicos existentes deben ejecutarse en la validación conjunta.

## Evidencia gráfica preparada, pendiente de ejecución CI

Harness de componentes reales con datos declarados:34identidades vigentes,3descubiertas,35copias repetidas y una identidad de archivo; no colección ganada ni endpoint público. Run incluye propia, duplicada, caída y temporal; stock de ensayo hasta100. Cuenta y backend ausentes en este harness deliberadamente, por lo que sus tests no acreditan autoridad económica.

Spec preparada para ES/EN×Diagon/ARCANA bajo proyectos del coordinador. Comprueba4/8cartas, contador3/34+archivo, inspección, detalle, selección de copia, retorno y foco, filtro/limpieza, reflujo200%, stock100, jarId concreto, asignar/cambiar/quitar/cancelar, actualización incompatible y stock0. Capturas opt-in solo Linux `ARCANA_CAPTURE_A92=1`, proyectos Chromium390/1280 seleccionados, ES/Diagon.

**No navegador local, capturas, vídeo, perfiles, servicios o CI ejecutados por este subrecorrido.** El coordinador registra el SHA/CI y revisa imágenes antes de declarar aceptación gráfica. Ninguna captura estática demuestra movimiento. Dispositivo físico, lector hablado, comprensión y diversión pendientes de una sesión humana.

## Observación humana posterior

- ¿Se interpreta el emblema de portada como clasificación, sin asumir varios pasivos?
- ¿Se encuentra la ficha/estrella/procedencia y se distingue acabado de rareza?
- ¿Se entiende TarroN como unidad seleccionada y Existencias×N como stock, sin creer que se consume al navegar?
- ¿Se cambia o quita una asignación con facilidad desde el retrato marcado?

### Comprobaciones adicionales de esta rama

- Detector Impeccable, una sola ejecución sobre CollectionPanel/BeanAssignments/CSSpropio: `[]`, exit0. No certifica estilo o accesibilidad.
- `npx --no-install vite build --config tests/browser-experience-clarity/vite-collection-a92.config.ts`: correcto, sin abrir navegador. Fixture genera JS899,80kB y CSS122,69kB sin gzip; aviso de chunk>500kB conservado. No equivale al build del juego ni demuestra rendimiento. Usa imports del helper de fixtures A89 y componentes reales; no se añade al producto.
- No se modificó configuración global o CSS compartido. Arte y sonido intactos.

### Inspección seleccionada posterior de CI72434bb

Se inspeccionaron PNG Linux ya generadas, sin abrir navegador: folio, colección390Diagon/ARCANA y stock100 del artefacto `test-results/a92-ci-72434bb/docs/arcana/accounts-2026-10-17/evidence/linux/a92/`. No había muestra1280 de colección en ese directorio; no se acredita aquí escritorio visual.

Folio: retrato y nombre dominan; ficha y copias son consultas diferenciadas, cierre visible y advertencia de fuente no vigente correcta para el protagonista inicial. Tarro100: objeto único, stock y unidad distintos, caída/temporal reconocibles, borrador y detalle de riesgo presentes. El PNG de tarro es composición de componente, no aceptación de la preparación completa.

**Defecto demostrado y corregido:** identidad de archivo sin asset registrado colapsaba su retrato y el marco encantado quedaba diminuto. Se añadió fallback `card.back` para portadas y folio, y reserva4/5 sobre el contenedor, sin alterar la identidad ni su acabado. Prueba SSR falló antes y pasó después. Última ejecución acotada:32pruebas correctas en3archivos. La nueva evidencia gráfica queda pendiente del siguiente candidato CI del coordinador.

En la muestra ARCANA390 algunos metadatos de las dos primeras cartas se ven incompletos, a diferencia de la tercera. La revisión estática no encontró una regla de ocultación ni una condición por paquete: traducciones, datos y componentes emiten rareza/copias correctamente; `useSelectionMotion` mueve el álbum completo, no textos individuales. No se atribuye una causa o un defecto de producto confirmado a esa imagen aislada. Para el siguiente muestreo se declara movimiento reducido efectivo desde `emulateMedia`, se espera `document.fonts.ready` tras restituir el tamaño y se comprueban presencia/altura de rareza/copias antes de capturar. Esto evita presentar una fase transitoria como reposo, sin retraso arbitrario ni cambios de contenido. No sustituye inspeccionar la siguiente imagen ni probar animación aparte.

### Reflujo ampliado y repisa integrada tras CI39334495446

El caso A85 con texto200% y todas las imágenes ausentes reprodujo404px de ancho sobre390px. Las cartas usan tracks adaptativos respecto a rem y etiquetas/rarezas que envuelven sin recorte. El máximo4/8porpágina se conserva; columnas y cantidad porpágina son decisiones diferentes. Sin reducir fuente o eliminar información. El tarro de jefe ahora ocupa un slot de BossPartyStage, para compartir la repisa móvil con formación y afinidades. Nombre breve Grageas/Beans; cantidad y borrador separados, descripción accesible completa, asignación por IDs intacta. Resultado gráfico del candidato c6810fc pendiente en CI39341168677.
