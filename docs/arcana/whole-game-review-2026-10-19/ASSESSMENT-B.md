# Assessment B · revisión mecánica independiente A91

Método: agente aislado `/root/whole_game_mechanical_b91`; no se ha leído Assessment A ni recibido sus conclusiones. Base indicada: HEAD `753b2a1`. Fecha: 19 de octubre de 2026. El coordinador confirma después que PR #12 se integró a las 17:14:53 UTC en main `86d6a92665f63616034a4fcd668c5df6ffe3e322`, con el mismo árbol `4127d93e346fec2b16d75b63c8eca38f13fdaed1`. No se ha cambiado el checkout. Solo lectura de código/documentación y detector estático. No se han iniciado navegador, servidor, CI, overlays, perfiles ni capturas. Autoría limitada a este archivo y `detector.json`.

## Alcance y procedencia

Se han leído AGENTS.md, HOST-INCIDENT y la guía local Impeccable/critique. La protección del Mac prevalece sobre la petición genérica de overlay de la skill. No hay visualización/inyección de detector y no se presenta una revisión estática como reproducción de un fallo ni observación de jugadores.

El target recursivo contiene58 archivos TSX y36 hojas CSS. Recuento mecánico de ocurrencias de marcado:152 `button`,4 `input`,0 `select`,0 `textarea`,14 `dialog`,35 `details` y1 `progress`; no son botones simultáneos, pantallas, instancias renderizadas ni métricas de carga cognitiva. Hay medidores de vida `meter`, que se cuentan por separado. Muchas opciones usan `map` y muchos estados son excluyentes; el árbol estático no permite inferir el total visible.

Pantallas/estados contrastados en sus consumidores: entrada/acceso/cancelación, Ajustes, mapa/consulta, preparación y synergies, nodos/Pacto/Encuentro, arena y opciones/inspector, cierre/intenciones, colección/filtros/folio/copias/sabores, tienda/libros/forja/bóveda y Halloween. La evaluación visual de composición corresponde a la síntesis con evidencia seleccionada del coordinador; este informe no afirma haber visto esas superficies en movimiento.

## Ejecución única del detector

Comando real:

```sh
.agents/skills/arcana-impeccable/scripts/impeccable detect --json src/arcana/presentation > docs/arcana/whole-game-review-2026-10-19/detector.json
```

Salida 2: findings válidos del programa, no fallo de ejecución. Dos resultados, uno advisory y uno warning. JSON conservado sin reescritura. No se ha repetido el detector para obtener otra salida.

| Regla | Localización | Contraste y decisión |
| --- | --- | --- |
| `bounce-easing` advisory | `reveal-theatre.css:85`, curva0.18/0.8/0.3/1.12,600 ms | Verdadero reconocimiento de una curva con pequeño overshoot. No es prueba de defecto: se aplica al estampado de rareza confirmado, no a todo el HUD. `reveal-theatre.css:178–183` contempla sistema y ajuste reducido. El briefing pide materialidad y momentos excepcionales. Conservar de momento y juzgar en muestra temporal; no sustituir automáticamente todas las curvas por gusto del detector. |
| `side-tab` warning | `seasonal-event.css:287–290`, borde inferior interno3 px en elección activa | Verdadero patrón CSS, falso positivo como diagnóstico global de estilo: señala selección en juego, acompañado por `aria-pressed`, borde, fondo y sello✓ de `SeasonalEvent.tsx:405/432`. No es una tarjeta administrativa con acento decorativo arbitrario. No quitar el marcador sin preservar redundancia y foco. Una posterior unificación del sello puede reducir divergencia, sin urgencia acreditada por esta regla. |

El detector no descubre las inconsistencias de denominadores ni garantiza nombres/foco/recovery. Tampoco detecta por sí solo enunciados largos, objetos visualmente diminutos o coreografías pobres. Dos warnings no equivalen a dos defectos de producto.

## Hallazgos contrastados fuera del detector

### B91-01 · P2 · El Atlas conserva un denominador de30 tras ampliar catálogo a34

**Hecho:** `JourneyCabinet.tsx:27` cuenta todas las identidades distintas propias y en línea48 muestra `{own}/30`. `trial-configuration.ts:26–36` aplica por defecto a87, agrega cuatro criaturas a30 identidades base y versiona catálogo4. `CollectionPanel.tsx:76/134–139` deriva colección/progreso desde su readmodel real. La misma cuenta puede recibir dos mensajes de completitud incompatibles, y el Atlas admitir34/30.

**Estado de evidencia:** defecto de proyección contrastado estáticamente; no reproducido en navegador en A91. El conteo34 se comprueba leyendo los JSON activos, no simulando que esas criaturas se han ganado.

**Problema para jugar:** una meta incorrecta debilita confianza y orientación, especialmente tras incorporar criaturas y al acercarse a completar colección.

**Cambio propuesto:** pasar al Atlas una proyección de completitud común derivada de catálogo efectivo/readmodel; distinguir identidades vigentes y archivo histórico de forma explícita. No limitar el numerador a30 ni cambiar premios/economía para compensar.

**Aceptación:** catálogos30/34; inicial/completa; copia repetida; encantado de identidad ya poseída; identidad histórica archivada. Atlas y Cromodex coinciden sobre el mismo universo definido, sin porcentajes>100% ni confundir archivo con objetivo principal. ES/EN y consulta sin escritura.

### B91-02 · P2 · Algunos cierres vuelven a ser un objeto vacío cuando falta su imagen

**Hecho:** `Artwork.tsx:29` retorna null si falla imagen y fallback. Ajustes, acciones de nodo y paginación tienen fallback visible explícito en CSS. En cambio, el cierre del libro de sabores (`FlavourCabinet.tsx:98–104`) solo contiene `Artwork ui.clear` y aria-label. El cierre de libro comercial (`ShopBook.tsx:66–74`) contiene `Artwork ui.pass` y texto visually-hidden. Búsqueda en las36 hojas CSS no encuentra rescate equivalente para `.folio-close`/`.shop-ledger-close`; sí hay tamaño44 px y decoración base.

**Estado:** riesgo contrastado por rama de render y cascada, no fallo inyectado A91. El control continúa siendo semántico y se puede cerrar con Escape; no se etiqueta como bloqueo total ni falta de accesibilidad de nombre.

**Problema:** a toque/visión queda un marco sin pictograma comprensible justo cuando hay pérdida de arte. Ajustes resuelve el mismo estado mejor y sirve de patrón existente.

**Cambio mínimo propuesto:** símbolo local o palabra breve visible únicamente cuando desaparece el asset; conservar botón, nombre localizado,44 px, Escape y devolución de foco. No pintar texto dentro del asset ni rehacer el libro.

**Aceptación:** fallar ui.clear/ui.pass por separado y simultáneamente con otros assets en contexto Linux aislado; cierre visible, toque/teclado funcionan, foco vuelve al libro, consulta/stock/operación no cambian. Revisar el resto de controles solo-imagen con la misma matriz, sin dar por fallidos todos.

### B91-03 · P3 · Filtro «Ejército» carece de emblema específico y comparte libro con «Todos»

**Hecho:** `ClassificationChoices.tsx:44–47` da `ui.collection` tanto a all como a army; las casas tienen insignias y los tres vínculos mecánicos sus emblemas propios. El nombre visible y aria-pressed desambiguan, por lo que no es fallo funcional. Army es clasificación, no nuevo vínculo mecánico en `BondEmblem.tsx`; respetar esa distinción.

**Problema propuesto:** al pedir reconocimiento mediante objetos y poca lectura, dos categorías diferentes con el mismo objeto dependen más del texto. La necesidad de un asset nuevo debe demostrarse en contexto y no requiere añadir una sinergia.

**Propuesta:** muestra de pequeño emblema editorial de grupo coherente con las familias actuales, sin reutilizar la corona de rareza ni inventar efecto. Alternativa de coste mínimo: monograma o composición del libro distinguible. Validar24 px y filtros con texto ampliado antes de producir variante de pack.

**Aceptación:** reconocible a24 px, ambas presentaciones, nombre legible/foco/estado; no afirmar reconocimiento humano hasta sesión. Prioridad inferior a B91-01/02.

## Cobertura semántica y funcional contrastada

| Familia | Lo que sí consta en código | Límite |
| --- | --- | --- |
| Cuenta/registro/verificación | Diálogo nativo, campos convencionales mínimos, foco de entrada y error, retorno al origen/fallback#content; alert/status localizados. | No se ha verificado entrega externa de correo ni lector real ahora. La forma convencional de los campos es necesaria para autocompletado, no debe eliminarse por parecer formulario. |
| Ajustes | Botonesaria-pressed, fieldsets/legend, idioma/pack exclusivamente aquí, preferencia propia frente sistema; lectura separa tamaño y contraste; cierre/restauración foco. | Colección de preferencias extensa requiere contexto visual para decidir navegación, no se infiere mala UX del número de botones total. Forced-colors activo y zoom real pendientes. |
| Mapa/lista/consulta | `RouteInspection` no recibe callback de comando; coste y relación from/to públicos, consulta bloqueados sin avanzar. H2enfocado al cambiar nodo, Escape/cierre; padre gestiona origen. | No se ha medido mapa en todos los estados A91. Información aleatoria no debe revelarse al simplificar nombres. |
| Formación/Pacto/Encuentro | Objetos/retratos con aria-pressed; instancia e índice en encuentro; propios/temporales, borradores y confirmación separados; disclosure de detalle. | Opciones variables en listas no equivalen a formulario fijo. Necesita ensayo con colección amplia y nombres largos. |
| Grageas | Stock,jarid,portador,draft yprobabilidad desde snapshot; asignación inválida filtrada, sin consumir al seleccionar. | Cada jar se dibuja con map; grandes stocks pueden producir muchos objetos equivalentes. Hipótesis de escalabilidad visual, no fallo reproducido ni motivo para agrupar sacrificando unitId. |
| Arena | MedidoresHP semánticos, nombre y cantidad, actor/objetivo/caído/peligro; opciones en modal, tabtrap, retorno; doblebandoylog confirmado. | Se necesita evidencia temporal para ritmo, impacto y presencia; no se deduce articulación de retrato. |
| Cierre/intenciones | Resultado/rewardconfirmado, hechos acotados, libro compartido,recordatorio con emblema, opciones explícitas. | La evidencia no acredita comprensión de causas ni diversión. |
| Cromodex | Fuentes/porcentaje por readmodel, identidad/copia/finish separados; filtros bajo details; páginas4, historialygoalpropietario. | Al abrir filtro hay9 categorías + 5 rarezas + 3 estados de descubrimiento + 2 acabados. No son19decisiones simultáneas obligatorias; conservar disclosure y estudiar subagrupación antes de quitar funciones. |
| Comercio/libros | `ShopBook`consulta sin comando, precios/confirmación y resultado separados; foco recuperado. `ShopExit` tiene SVG local y label. | Fallbacks iconográficos no uniformes(B91-02). |
| Halloween |2 elecciones, una confirmación tras selección,serverphase,snapshotedición,previewPV/PM, foco;historia visible y 3 objetivos. | El patrón de selección señalado por detector tiene redundancia válida. La longitud en distintos estados necesita captura correspondiente. |

No hay textboxes de configuración general ni checkbox en este árbol: los4 input corresponden a credenciales/rangos de audio. «Tiene apariencia de formulario» debe evaluarse por composición, no transformando botones semánticos en divs clicables. No se recomienda eliminar nombres/costes/errores para lograr un conteo menor de palabras.

## Fuentes efectivas e integridad

`contextual-preparation.ts:24–36` centraliza reglas de run activa desde campaignSnapshot; el fallback histórico explícito conserva reglas vivas sin houseSynergies/bonds retroactivos. `BeanAssignments` usa esa fuente y `validBeanAssignments`; el cálculo de comparación reutiliza motor/equipment-effects. App invalida borrador por identidad de run/nodo/revisión/versiones. Esto es fortaleza existente; una simplificación visual no autoriza utilizar reglas vivas para todo ni importar stock del navegador.

`cromodex` conserva definiciones históricas aparte de las activas y snapshots propios. Por eso el arreglo de B91-01 necesita un universo de completitud explícito, no otro magicnumber34. La consulta de metas no concede propiedad; los temporales no satisfacen adquisición.

## Tecnología y ciclo de vida verificados estáticamente

Versiones instaladas en package.json: React19.3.0, Vite8.3.4, Pixi8.22.0, GSAP3.15.0, Motion14.2.0, Fastify5.12.5,PG8.23.1,Redis6.3.0,idb8.0.4. Son manifiesto del repo, no investigación externa de última versión.

| Tecnología/consumidor | Uso real contrastado | Riesgo/límite a validar después |
| --- | --- | --- |
| React/DOM/CSS | UI semántica,details/dialog,prefs,transiciones/localkeyframes. |36 hojas CSS con capas históricas; A90conserva defecto de especificidad ya corregido. Nuevas refinaciones deben comprobar estilos calculados, no solo clases. |
| PixiJS8 | `scenes/pixi-scenes.ts` crea escena; `SceneCanvas`importdiferido,update,destroy,cambiodepack,webglcontextlost,fallbackDOM. | No atribuir arranque aGPU ni contadores propios a ausencia global de fugas. |
| GSAP | `CardReveal` timeline de caja/sello/tapa/rana/carta y encantado; cleanup/context y commitprevio. | Poses/capas reales vs figuraplana, no rigcorporal; no medir movimiento con PNG. |
| Motion mini | `VisualChoices`,`OperationFeedback`,`useSelectionMotion`; finito, cancelación en desmontaje/preferenciaytaboculta según consumidor. | No agregar otros relojes de combate. |
| Canvas2D | `FrogMagic`, buclerAFfinito,visibilidad y cancelación. | Evaluar frío y uso repetido Linux, sin repetir incidente Mac. |
| Reloj replay | `useBattlePlayback`rAFsolo reproduciendo/visible y sharedclock paraescena/DOM. | Pausa,2x,inspector,ocultaciónyomisión necesitan evidencia temporal. |
| CSSambiente | `SceneAtmosphere`6motes acotados en número por instancia, estadosrunning/hidden, reducido devuelve null. Corrección del coordinador: CSS itera ambiente infinite; no son finitos en duración. | «Siempre animado» no es evidencia de personalidad; limitar simultaneidad con acciones principales. |
| WebAudio | Consentimiento explícito por dosbusesmusic/effects,volumenbajo details, estadosloading/blocked/unavailableyretry. | Sonido no puede ser único indicador; pruebas sintéticas no acreditan calidad percibida ni dispositivos. |

## Pruebas y evidencia actual: no confundir existencia con ejecución nueva

No se han ejecutado tipos/build/tests/browser/servicios para este AssessmentB, porque el encargo es auditoría y no hay código cambiado. Se ha leído la evidencia archivada A90, no consultadoGitHub vivo en este agente.

El repositorio contiene66 archivos*spec.ts, suites de dominio y contratos, workflowLinux en `.github/workflows/checks.yml`, concurrencia serial, permisosread, PG/Redis aislados y artefactos de pruebas. La cantidad de archivos no mide cobertura. El paquete mantiene runner de protección original y smokeMac separado.

A90/QA documenta CI39280235365 sobre19f0b4f,checkout1dfca931 conárbolidéntico:759 unitarias / 120 PostgreSQL/Redis / 549 browser,303 omisiones deliberadas y restauración15 tablas. El coordinador debe conservar la prueba de equivalencia documental y del árbol de integración antes de atribuir esa cobertura al estado actual; no se afirma otra batería aquí.

Los datos archivados distinguen cohorteA75(Chromium16.7–16.8 ms P95 rAF,WebKit21–23 ms) y72 ventanasA69(Chromium16.8–50.1 ms,WebKit31–92 ms). No ocultar extremos conuna media favorable. Objetivo20 ms no universal, rAF noGPU, hostCI no dispositivo físico. No hay prueba nueva de rendimiento A91.

## Validación futura recomendada por riesgo

1. Completar readmodel único de colección y prueba no gráfica de denominadores antes de cambio visual.
2. Fallo selectivo de arte en cierres de libros con pruebas de toque/teclado/foco enLinux. Conservar Escape e informe original.
3. Capturas seleccionadas, no matriz indiscriminada, para grandes stocks/colección y estadosdeayudaabierta; asegurar cabe el objetivo principal sin truncar costo/efecto.
4. Reproducción temporal acotada sobre log conocido: ataque/objetivo/daño, rarezayencantado, pausa / reducido / omisión / pérdida de renderer; no inferir movimiento de staticgoldens.
5. Sesión humana posterior con primera vez,coleccionistayteclado; medir tarea/ayuda/errores, no retención fabricada confixtures.

La ausencia de P0/P1 reproducidos en este examen no acredita todoel juego ni impide que revisión visual detecte otros hallazgos. El resultado es una base mecánica y de riesgos para una síntesis única, no un dictamen de aprobación estética.
