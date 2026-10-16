# Preparación de I1: stack, arquitectura y dominio

9 de octubre de 2026. Especialista `stack_dominio`. Fuentes de producto leídas completas: `AGENTS.md`, PRD v0.15, `DECISIONS.md`, `I1_PROMPT.md` y encargo de preparación. Inspeccionados el concepto I1-CV01 y su procedencia. Esta entrega es una **recomendación para I1**, sin selección técnica aprobada, aplicación, dependencias instaladas ni pruebas ejecutadas. No modifica A09–A18. Las fuentes técnicas consultadas documentan capacidades; no prueban que nuestra futura implementación las cumpla.

## Recomendación y alcance

Recomiendo una SPA responsive con **React, TypeScript, Vite, IndexedDB mediante `idb` y CSS**. Usar estado React local/reducer, navegación interna sencilla y controles HTML; no introducir router, gestor global, service worker, SSR o motor de animación mientras no exista una necesidad de I1. `idb` resuelve una frontera real: peticiones y finalización de transacciones con promesas; su presencia no sustituye especificar el límite atómico. Backend, autenticación, shiny y motor genérico siguen fuera.

| Alternativa de demo | Beneficio | Coste y consecuencia |
| --- | --- | --- |
| React/TypeScript/Vite + IndexedDB/`idb` + CSS, recomendada | Componentes reutilizables para estados bilingües, álbum, accesibilidad y presentación separada de reglas. Coincide con P01. | Dependencias React y build; exige no confundir estado de UI con autoridad persistida. |
| TypeScript/Vite + DOM nativo + IndexedDB nativo + CSS | Menos runtime de UI y almacenamiento sin wrapper. | Más sincronización manual de estados, foco y traducciones; más superficie propia al montar álbum/errores. Válida si el equipo domina ese enfoque, sin ventaja medida aquí. |

El límite de confianza es idéntico: ambas son locales, manipulables y susceptibles de borrado. No recomiendo una tercera alternativa con servidor para resolver un problema fuera del alcance. Esta comparación no mide bundle, horas o velocidad del equipo.

La documentación React contempla empezar desde herramientas como Vite para casos que no encajan en un framework completo; ello permite considerar esta SPA, no demuestra cuál es más barata para Enric. [React: crear una aplicación](https://react.dev/learn/creating-a-react-app). Vite ofrece plantillas TypeScript/React y documenta su requisito de Node; al implementar habrá que elegir versiones compatibles y fijarlas en lockfile. [Vite: guía de inicio](https://vite.dev/guide/).

Dependencias propuestas: runtime `react`, `react-dom`, `idb`; desarrollo TypeScript/Vite/plugin React, Vitest para reglas puras y Playwright para persistencia real y recorrido. Sin biblioteca de azar, ORM ni motor de reglas. Validadores acotados que reciben `unknown` y devuelven datos tipados o errores; evitar casts de confianza. Los tipos TypeScript no validan JSON en runtime. [TypeScript: afirmaciones de tipos](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions). Una biblioteca de esquema solo se justifica si reduce duplicación real de catálogo/importación; no es requisito previo.

## Fronteras mínimas de arquitectura

Estructura orientativa, todavía inexistente:

```text
src/
  domain/         modelos, validadores, selección ponderada, invariantes
  application/    inicializar, consultar, abrir, recuperar, exportar/importar/reiniciar
  infrastructure/ indexeddb-store, azar del navegador, carga de JSON
  ui/             callejón, Weasley, detalle, resultado, colección, ajustes
  i18n/           mensajes completos ES/EN, formatos, plurales
  content/        catalog.json, welcome-table.json, manifest de arte separado
tests/
  domain/         reglas deterministas
  browser/        transacciones reales y recorrido ES/EN
```

No crear un paquete por carpeta ni una interfaz por función. El núcleo no importa React, IndexedDB, animación, `Intl` o traducciones de UI. La composición de la aplicación conecta las fronteras. Contrato de persistencia pequeño y específico de I1: consultar snapshot, aplicar apertura con reglas dentro de una transacción, reemplazar demo y recuperar operación. No ofrecer `saveInventory()` separado de `saveOperation()` ni un repositorio por entidad.

Una forma concreta de mantener dominio independiente consiste en que el adaptador transaccional lea los registros, invoque una función síncrona pura que verifica estado/petición y obtiene la transición, escriba el resultado completo y espere commit. La función de reglas recibe un selector de ticket síncrono; lo llama únicamente después de comprobar reintentos, unidad, versiones y elegibilidad. El adaptador convierte errores de almacenamiento a errores del caso de uso; la UI convierte códigos a mensajes ES/EN.

| Principio exigido | Aplicación concreta en I1 |
| --- | --- |
| Clean Code | `ProductUnit`, `OwnedCopy`, `OpeningOperation`, `DemoRun`, `CatalogVersion`; estados y errores explícitos, sin números o textos dispersos. |
| Clean Architecture | Reglas deterministas independientes; adaptador IndexedDB aplica una transición atómica. La UI recibe lectura y resultado confirmado. |
| DDD | Unidad individual con identidad; copia conserva adquisición/procedencia; descubrimiento es tener al menos una copia de una identidad. La apertura es el límite consumo/entrega. |
| SOLID | Contratos acotados para persistencia y ticket aleatorio. Presentación de un resultado no decide ni guarda otra recompensa. |
| TDD | Primero caso que falla para cada invariante; mínimo comportamiento, luego refactorizar. Dobles para decisiones, navegador real para atomicidad/concurrencia. |
| KISS | Una demo actual, dos productos finitos, un álbum; un object store transaccional y snapshots pequeños, sin índices anticipados. |
| YAGNI | Sin servidor, repositorios genéricos, event sourcing, sincronización, plugins de reglas, variantes o infraestructura para futuras tiendas. |

## Estado y snapshots que deben conservarse

Propuesta de modelo, no clases implementadas:

- `DemoRun`: ID aleatorio, versión de esquema, `revision` entera positiva, idioma elegido, preferencias pertinentes, bienvenida concedida, unidades, copias y operaciones. La inicialización concede exactamente cuatro copias conocidas y dos unidades en una única transacción, con marcador de concesión, referencia A16 y revisión inicial 1. Dos pestañas inicializando leen/recomprueban dentro del mismo límite; no conceden dos bienvenidas.
- `ProductUnit`: `unitId`, `runId`, tipo rana/grageas, procedencia Weasley, disponible/consumida y, cuando corresponde, `openingOperationId`. La unidad de grageas existe pero el caso de uso no admite abrirla en I1. El stock se deriva de unidades disponibles; no persistir además un saldo separado.
- `OwnedCopy`: ID de copia, `identityId`, `shopId`, origen regalo/apertura y referencia a concesión/operación. Guardar snapshot de adquisición: familia, rango, nombres/contexto ES/EN y versión del contenido/arte. Un asset ausente conserva representación textual. Arte reemplazable por manifest sin cambiar la copia ni sus reglas.
- `Discovery`: se deriva de copias por `identityId`; total descubierto no es otra fuente persistida de verdad. Su representación histórica usa el snapshot de la primera adquisición. Cambiar catálogo no reclasifica ese descubrimiento; las fichas pendientes usan el catálogo activo. Un cambio de asignación futuro debe distinguir datos actuales e históricos, sin agrupar silenciosamente una copia antigua en otro rango.
- `OpeningOperation`: ID, petición normalizada completa, unidad, resultado, copia entregada, condición de bienvenida nueva, snapshot del resultado ES/EN y versiones de catálogo/tabla/esquema/recursos usadas. Es registro técnico recuperable, no un historial visible nuevo. El resultado confirmado es inmutable.

Una propuesta sencilla de base es un object store `records` con registros `current-run`, `storage-generation`, `active-config`, `catalog:<version>` y `welcome:<version>`. `current-run` contiene el agregado finito con sus copias y operaciones. Todas las mutaciones relevantes tienen scope `records`. Las configuraciones históricas se guardan una vez, por versión inmutable; no descargar una versión histórica para poder recuperar una operación. El export contiene las versiones referenciadas y snapshots necesarios. No hay blobs de arte en ese agregado.

`storage-generation` cambia al importar o reiniciar. Toda orden de escritura lleva la generación observada, fuera de la petición semántica idempotente. Esto evita que una pestaña con el mismo `runId` anterior a una restauración escriba sobre el estado sustituido. Tras cambiar generación debe refrescar lectura antes de cualquier orden; consultar un resultado existente sigue disponible. Cambiar solo idioma no reemplaza el agregado en memoria: leer y modificar exclusivamente esa preferencia dentro de transacción, conservando una apertura concurrente.

`DemoRun.revision` incrementa dentro de la misma transacción en cada mutación normal de estado: apertura, idioma/preferencias, marcador de presentación si se persiste y activación de configuración cuando existe demo vigente. No incrementa por lecturas, consultas de reintento sin mutación o operaciones rechazadas. La pareja `{storageGeneration, runId, revision}` identifica el estado del resumen de sustitución. Comparar solo generación sería insuficiente: otra pestaña puede abrir o cambiar idioma sin importar/reiniciar. Importación y reset incrementan generación y dejan la demo instalada con revisión inicial 1 para esa generación; una revisión exportada no se acepta como token actual de la base destino. Restaurar el mismo archivo o volver al mismo `runId` no provoca equivalencia falsa gracias a la generación diferente. Si un contador agotara su límite entero seguro, fallar sin escritura antes que desbordarlo.

Guardar snapshots es una recomendación para cumplir A18; no es un esquema de backend futuro. Cualquier optimización posterior debe conservar exactamente esos comportamientos.

## Contrato mínimo de configuración JSON

Son **ejemplos documentales**, no archivos de configuración operativos. Formato de versión: enteros positivos separados para esquema y contenido. La tabla apunta a la versión exacta de catálogo. El manifest de arte y mensajes funcionales están en recursos distintos, sin porcentajes duplicados.

Ejemplo parcial de `catalog.json` — al implementar se completan las doce entradas aprobadas y el contenido ES/EN revisado:

```json
{
  "schemaVersion": 1,
  "version": 1,
  "shopId": "weasley",
  "rarities": [
    { "id": "R01", "name": { "es": "Habitual", "en": "Common" } },
    { "id": "R02", "name": { "es": "Singular", "en": "Uncommon" } },
    { "id": "R03", "name": { "es": "Extraordinario", "en": "Extraordinary" } }
  ],
  "identities": [
    {
      "id": "C01",
      "family": "person",
      "rarityId": "R01",
      "name": { "es": "Albus Dumbledore", "en": "Albus Dumbledore" },
      "context": { "es": "Texto revisado pendiente", "en": "Reviewed text pending" },
      "assetId": "I1-C01"
    }
  ]
}
```

`context` anterior es marcador documental; no texto final aprobado. `family` solo acepta `person`, `object` o `flavour`; no confundir estas familias de álbum con las de canje futuro. `shopId` mantiene procedencia compartida y estable entre idiomas. El registro de assets admite estado ausente/provisional; no hacer de una ruta raster una regla económica.

Tabla completa inicial de bienvenida, con A18 intacta:

```json
{
  "schemaVersion": 1,
  "id": "welcome-frog",
  "version": 1,
  "catalogVersion": 1,
  "entries": [
    { "identityId": "C01", "weight": 14 },
    { "identityId": "C02", "weight": 14 },
    { "identityId": "C03", "weight": 5 },
    { "identityId": "O03", "weight": 5 },
    { "identityId": "C04", "weight": 1 },
    { "identityId": "O04", "weight": 1 }
  ]
}
```

La garantía nueva es una invariante explícita del caso de uso de bienvenida, no una cadena de reglas configurable. No crear un campo con scripts o condiciones interpretadas. Catálogo completo inicial: R01 C01/C02/O01/O02/S01/S02; R02 C03/O03/S03; R03 C04/O04/S04. Suma 40; cada porcentaje = peso / 40, no porcentaje del rango. Las distribuciones 70/25/5 y 85/15 son agregados derivados, no listas adicionales que la UI mantenga.

Validar esquema soportado, campos permitidos, IDs únicos, doce identidades iniciales, familias/rangos/referencias, contenido ES/EN no vacío, versiones, tabla no vacía, pesos enteros positivos y suma dentro de un límite numérico explícito. Una propuesta conservadora para tickets enteros de 32 bits es suma ≤ 2^32−1. Nunca sustituir un peso inválido por cero o un texto ausente por una traducción automática. A18 permite ajustar datos; cambiar las doce identidades o los tres rangos como alcance exige decisión y PRD, aunque el formato pudiera admitirlo.

**Elegibilidad sin alterar probabilidades:** en I1, exigir que todos los candidatos de la tabla sean nuevos para el estado inicial compatible A16 y que los regalos estén registrados. Si alguna entrada ya se conoce, bloquear el gasto con estado incompatible; no quitarla y renormalizar silenciosamente. Esta es recomendación técnica de fallo seguro compatible con el prompt, que ya exige rechazar un estado incompatible. No elige una política de aperturas posteriores. Una validación/importación anterior debe evitar normalmente ese caso.

La probabilidad se conserva como fracción peso/suma y se formatea por idioma. A18 puede representarse sin redondeo: 35 %, 12,5 %, 2,5 % (ES) y 35%, 12.5%, 2.5% (EN según formato acordado). Para pesos nuevos que producen decimales periódicos, mantener la fracción y aclarar «aproximadamente» junto al porcentaje redondeado, sin afirmar igualdad exacta de una cifra truncada. Nunca sortear desde el string formateado.

Para el selector se recomienda un ticket entero uniforme `[0, suma)` y acumulados de pesos. Un adaptador síncrono puede usar `crypto.getRandomValues` con rechazo de la cola que produciría sesgo por módulo; el núcleo recibe el ticket y permite selección controlada en pruebas. `getRandomValues` ofrece bytes aleatorios síncronos según la especificación. [Web Cryptography: getRandomValues](https://www.w3.org/TR/webcrypto/#Crypto-method-getRandomValues). Esto no convierte el cliente manipulable en autoridad fiable. No necesita SDK, IA ni simulación en runtime.

### Editar sin cambiar la lógica

1. Conservar los archivos/versiones previos en Git. Editar pesos en la tabla; editar asignación/nombres/contexto en catálogo solo dentro del alcance permitido. Mantener IDs.
2. Incrementar versión de tabla para todo cambio de su contenido. Si cambia catálogo, incrementar también catálogo y tabla, y ajustar `catalogVersion`. La versión de esquema cambia solo si cambia formato, con migración explícita. Una actualización de arte puede usar solo versión de manifest.
3. Ejecutar el validador y pruebas de configuración cuando existan; comprobar suma, candidatos nuevos y porcentajes derivados ES/EN. Revisar diff para no cambiar aprobación A18 por accidente.
4. Cargar los JSON de forma previa a transacciones. Registrar snapshots inmutables y activar la pareja en una transacción corta. La versión de tabla es secuencia de publicación: una pestaña antigua nunca rebaja `active-config`. Misma versión con otro contenido da conflicto; no sobrescribir. Comparar contenido normalizado o huella calculada antes de abrir la transacción, sin esperar hashing dentro de ella.
5. Una ficha conserva pareja de versiones presentada. Al confirmar, comparar con `active-config` leído de la misma base. Si difiere, no consumir: actualizar ficha y requerir nueva confirmación. Sin configuración remota, la actualización entra al cargar una nueva versión de la demo; una pestaña antigua ya abierta puede enterarse del cambio local.
6. Probar otra configuración en nueva demo mediante reinicio confirmado, exportando antes si se desea conservar la anterior. El cambio de archivos no concede otra unidad. El reintento de una operación existente devuelve el snapshot guardado aunque la configuración actual falle o cambie.

Para un rollback intencional, publicar contenido anterior bajo una versión de tabla nueva. No rebajar automáticamente números ni cambiar contenido de una versión ya conocida. Esta política de activación es técnica propuesta, sin panel de administración.

## Transacción de apertura y concurrencia

La especificación IndexedDB describe abortar/revertir una transacción y serializar transacciones de escritura con scope superpuesto; el éxito de una petición aislada no confirma toda la transacción. Su opción `strict` es una indicación de durabilidad, no garantía de conservación frente a todos los fallos físicos. [IndexedDB: transacciones y scheduling](https://w3c.github.io/IndexedDB/#transaction-scheduling). `idb` documenta `tx.done` como finalización satisfactoria y advierte que esperar red u otras tareas dentro de la transacción puede cerrarla prematuramente. [idb: vida de transacciones](https://github.com/jakearchibald/idb#transaction-lifetime), [idb: tx.done](https://github.com/jakearchibald/idb#txdone).

Protocolo propuesto:

1. La UI en la ficha crea/reutiliza una clave de operación, petición semántica `{runId, unitId, kind: welcome-frog, catalogVersion, tableVersion}` y generación de almacenamiento observada. No incluir idioma o duración de animación en la petición. Deshabilitar doble pulsación por comodidad; no usarla como garantía de unicidad.
2. Abrir `readwrite` sobre `records`. Leer generación y demo vigente. Si la generación cambió, detener escritura y actualizar lectura; el cliente podrá consultar/recuperar la operación con la generación actual. Si la demo ya no es la misma, no aplicar una orden antigua a otra demo.
3. Buscar primero operación por clave dentro del estado leído. Si existe, comparar campos semánticos: misma petición devuelve el resultado original; petición distinta da conflicto. **No validar configuración nueva ni llamar al azar antes de ese reintento.** Si la configuración nueva es inválida, aún debe poder recuperarse lo ya confirmado.
4. Sin operación previa, comprobar unidad disponible y perteneciente a la demo; condición de bienvenida todavía no abierta. Una clave diferente para unidad consumida se rechaza sin azar. Leer configuración activa, validar pareja presentada y elegibilidad. Si cambió, devolver ficha obsoleta sin gasto; si no hay nuevos válidos o hay inconsistencia, no gastar.
5. Solo entonces obtener ticket, decidir identidad, construir snapshot y copia. Actualizar unidad consumida, marcador de primera apertura y operación dentro del mismo agregado. Derivar 4→5 copias/descubrimientos desde el estado real. Escribir el agregado una vez; los resultados permanecen internos hasta commit.
6. Escribir junto al agregado `revision + 1`. Esperar finalización de todas las peticiones y `tx.done`; resolver éxito del caso de uso después. La animación y aviso de resultado vienen a continuación. El adaptador observa la finalización desde crear la transacción y maneja rechazos; **no presupone que una excepción de JavaScript o un rechazo async aborte por sí mismo**.

Ante error en lógica o al esperar una petición, el adaptador intenta inmediatamente `tx.abort()` mientras la transacción permita abortar y observa el desenlace de `tx.done`, sin anunciar premio o restaurar un saldo inventado. No suprimir un error de request para continuar con escrituras parciales. Si el aborto se confirma, informar fallo sin entrega y conservar estado previo. Si `abort()` ya no es posible porque la transacción terminó y `tx.done` confirma complete, recuperar la operación guardada y su estado real: un fallo de lógica/presentación posterior no deshace el commit ni demuestra «no guardado». Si el desenlace no es observable por cierre o desconexión, mantener estado desconocido y consultar la operación al recuperar. La especificación distingue los errores en handlers de petición y una transacción ya completada; `abort()` puede fallar para una transacción en commit/finalizada. [IndexedDB: abort()](https://w3c.github.io/IndexedDB/#dom-idbtransaction-abort), [IndexedDB: commit](https://w3c.github.io/IndexedDB/#commit-a-transaction). Esta gestión también corresponde a import/reset; lanzar una excepción capturada no acredita rollback.

Todas las lecturas que validan derecho y todas las escrituras usan **la misma transacción**. Nada de leer unidad desde caché React, generar resultado fuera y hacer dos saves. Dentro solo peticiones IndexedDB y cómputo síncrono corto; fuera carga de JSON, arte, timers, hashing y animación. Solicitar `strict` cuando se use la API compatible y documentar el comportamiento observado; exportación sigue necesaria para conservación voluntaria.

Dos pestañas con claves distintas quedan serializadas por el scope común: la segunda lee la unidad ya consumida y no llama al azar. Con misma clave/petición recupera la primera operación. Esto es diseño apoyado por documentación, todavía **sin prueba técnica de nuestro adaptador**. Mantener abierto un panel no mantiene una transacción viva.

La notificación entre pestañas puede usar BroadcastChannel después de commit para pedir nueva lectura; no envía una copia que la receptora añada. El estándar define esa mensajería entre contextos. [HTML: BroadcastChannel](https://html.spec.whatwg.org/multipage/web-messaging.html#broadcasting-to-other-browsing-contexts). Releer en foco/visibilidad y antes de acciones aunque no llegue notificación; integridad nunca depende del canal. Cambiar idioma modifica solo preferencias actuales, no un snapshot económico obsoleto.

### Recuperación y fallos observables

| Situación | Comportamiento previsto |
| --- | --- |
| Primer arranque o regreso | Abrir base, leer/validar demo y operaciones antes de mostrar stock definitivo. Inicializar solo si no hay demo; nunca recrearla por un error de lectura. |
| Error antes de commit conocido | Intentar aborto explícito y observar finalización; solo un aborto confirmado acredita estado previo sin recompensa. Reintentar misma clave. Puede haber otro ticket si la transacción fue abortada sin resultado confirmado; no mostrar ese ticket fallido. |
| Error de lógica después de escritura, con commit ya completado | Consultar operación confirmada, conservar consumo/copia y recuperar resultado; no mostrar «no guardado» ni conceder un nuevo sorteo. Si no puede conocerse el desenlace, estado desconocido hasta recuperación. |
| Cierre/recarga con commit desconocido para la UI | Leer unidad y operación al volver. Si existe, mismo resultado; si no existe, stock previo. Si almacenamiento es inaccesible, estado desconocido y acciones de gasto detenidas, no «saldo cero». |
| Commit completado y animación interrumpida | Recuperar resultado estático original; no sortear ni consumir. Omitir/cambiar idioma afecta presentación. |
| Configuración inválida tras una entrega | Entrega histórica accesible desde snapshot; nuevas aperturas bloqueadas. No borrar base ni regalar bienvenida como reparación. |
| Upgrade de esquema bloqueado por pestaña | Cerrar conexiones en `versionchange`, informar en ES/EN y recuperar al recargar; no eliminar base para desbloquear. |

La recuperación básica no depende de conservar una petición fallida en `localStorage`: el vínculo unidad→operación permite encontrar el resultado tras perder memoria de UI. Mantener la clave en el intento actual ayuda a retry. No persistir «pendiente» como consumo aparte que deje una unidad retirada sin resultado. La presentación puede conservar un marcador de resultado visto, pero su ausencia solo implica resultado recuperable; no invalida entrega. Una recarga no reinicia el ritual automáticamente si eso distrae de recuperar lo obtenido.

Anunciar resultado una vez por presentación y evitar doble efecto React; la omisión no vuelve a anunciar desde otra vista. Una recarga o una segunda pestaña puede mostrar el resultado existente al recuperarlo. Coordinar con UX qué anuncio corresponde a esa nueva presentación, sin reclamar un «exactamente una vez global» de lector que el navegador no garantiza.

## Exportar, importar y reiniciar

Exportar una lectura consistente en una transacción `readonly`, con formato de archivo identificado, `schemaVersion`, `runId`, idioma, preferencias, unidades, copias, concesión, operaciones y configuraciones referenciadas. Generar/descargar el archivo después de la lectura; no pedir al navegador descargar dentro de una transacción. No incluir imágenes o datos personales de sesiones A17.

Importación propuesta: **sustitución**, no suma ni fusión de inventarios. Validar primero JSON y límites de tamaño, tipos/IDs únicos, versiones soportadas, referencias internas y configuración histórica. Rechazar duplicados antes de convertir arrays a mapas (convertirlos antes ocultaría duplicados). Cada copia referencia concesión o resultado real; unidad consumida y operación apuntan entre sí; no dos aperturas de una unidad ni dos copias de la misma entrega; una bienvenida finita conforme A16 y primera rana nueva conforme A13. No fiarse de contadores exportados: derivarlos desde copias/unidades. Los snapshots de versiones históricas deben ser autosuficientes; rechazar referencias no resolubles, sin consultar porcentajes actuales para reescribirlos.

La validación de coherencia no es autenticación: cualquiera puede fabricar una exportación local coherente. No importar sus saldos como económicos al piloto. El usuario puede borrar almacenamiento; el estándar distingue persistencia de mejor esfuerzo y persistente, y contempla expulsión por presión de almacenamiento. [Storage Standard: persistencia](https://storage.spec.whatwg.org/#persistence). No afirmar continuidad por pedir permiso persistente; para I1 bastan aviso y exportación, sin un nuevo diálogo obligatorio de permisos.

Tras validar y mostrar reemplazo explícito, guardar `{storageGeneration, runId, revision}` del estado que se va a sustituir. En una transacción de escritura, releer la pareja generación/revisión y runId; si otra pestaña abrió, cambió preferencias, activó configuración o sustituyó la demo desde ese resumen, detener reemplazo y pedir revisar el resumen actualizado. Insertar configuraciones históricas inmutables faltantes, rechazar misma versión con contenido distinto, sustituir `current-run` con revisión inicial 1 e incrementar generación conjuntamente. Mantener `active-config` de la aplicación: importar una demo antigua no rebaja la publicación activa. Ante fallo intentar aborto explícito y observar su finalización; un aborto confirmado conserva todo el estado anterior. Si hubo complete o no se conoce el desenlace, recuperar estado real antes de comunicar resultado. Mismo archivo importado dos veces no suma copias; puede restaurar la misma demo con generación diferente, siempre identificada como restauración.

Reset cancelado no escribe nada. Reset confirmado construye nuevo `runId`, revisión inicial 1, unidades/copias/concesión de A16 y nueva generación, sustituidos atómicamente tras comparar `{storageGeneration, runId, revision}` del resumen revisado. No usar `deleteDatabase()` ni borrar historial de configuraciones para reiniciar una demo. Una pestaña antigua no puede inicializar de nuevo o abrir su rana contra el `runId` nuevo. Archivo anterior exportable antes del reemplazo; no es un requisito de que el usuario lo descargue para poder reiniciar.

## Pruebas por comportamiento y evidencia requerida

Plan TDD: caso fallido → mínimo comportamiento → refactor; estas pruebas **no están creadas ni ejecutadas**.

| Área y criterios | Comportamiento y método propuesto |
| --- | --- |
| Configuración, AC03/11 | Enumerar los 40 tickets controlados y comprobar 14/14/5/5/1/1 resultados, fracciones y formato ES/EN; límites 0/13/14/27/28/32/33/37/38/39. No es experimento de engagement ni prueba de azar real. |
| Validación, AC11 | JSON incompleto, duplicados, peso 0/negativo/fraccional/infinito, suma fuera de límite, referencias/familias/rangos/idioma inexistentes: rechazo sin gasto ni RNG. Nuevos pesos válidos cambian nuevas probabilidades derivadas. |
| Dominio, AC02/04/05 | Inicialización única; rana entrega nueva, 4→5; retry mismo resultado y cero llamadas adicionales al selector; conflicto otra petición o unidad consumida cero RNG. Repetidos solo en fixture normal identificada, sin exponer otra apertura al usuario. |
| Persistencia real, AC04/05/07 | Transacción exitosa guarda conjunto y revisión; provocar excepción de lógica después de request exitoso y antes de commit: adaptador aborta explícitamente, espera desenlace y conserva estado previo sin falso éxito. Provocar error posterior a complete: conserva operación y recupera, sin falso «no guardado» ni nuevo RNG. Fallo real de request y desenlace desconocido se distinguen; inyección acotada no equivale a medir cuota llena real. |
| Concurrencia, AC05/12 | Dos páginas del mismo contexto/origen/perfil abren misma unidad simultáneamente, claves iguales y diferentes: un consumo/copia y resultado original. Preferencia concurrente no revierte apertura. Import/reset invalida una orden desde pestaña antigua, incluso restaurando mismo runId. |
| Recuperación, AC06/07 | Recargar antes de commit, commit completado antes de respuesta UI, durante animación; recuperar desde unidad/operación. UI nunca celebra un request exitoso con tx luego abortada. Arte/idioma/omisión no cambia estado. |
| Versiones, AC03/11 | Abrir ficha v1; otra página activa v2; confirmar v1: sin RNG/gasto y requiere reconfirmar. Operación v1 ya guardada se recupera con mismo nombre/rango/snapshot aun con v2 inválida. Bundle antiguo no baja versión activa. |
| Importación/reset, AC12 | Export→restore equivalente; duplicados o links incoherentes rechazo y base idéntica; aborto confirmado en sustitución conserva demo previa; cancelación sin mutación; reset nuevo ID y bienvenida una vez. Mantener resumen abierto mientras otra pestaña abre rana, cambia idioma/preferencias o persiste marcador: revision avanza y sustitución obsoleta se rechaza sin borrar mutación. Restaurar mismo runId genera generación distinta e invalida orden antigua. |
| UI bilingüe, AC01/08/09/10 | Recorrido real y estados en ES/EN, stock rana cero/grageas reservadas, familias/copias/filtros, foco, texto largo/errores, arte ausente, omisión, reduced-motion y selector. Lectores de pantalla manuales, no solo assertions DOM. |

Vitest sirve para las reglas puras; sus pruebas en Node o una base fingida no demuestran IndexedDB de un navegador. Su modo navegador existe, pero para no duplicar infra de I1 recomiendo Playwright para integración. [Vitest: guía](https://vitest.dev/guide/), [Vitest: modo navegador](https://vitest.dev/guide/browser/). Un selector/control de commit de prueba se inyecta mediante composición de tests, sin botón de «premio raro» ni stock extra en la demo.

Perfil recomendado para comprobar viabilidad: Chromium, Firefox y WebKit automatizados; móvil 390×844 y desktop 1280×800, más reflujo a 320 CSS px y ampliación manual. Cada caso de recorrido se ejecuta ES/EN; persistencia común puede parametrizar lengua en los casos que exponen errores. Para dos pestañas, ambas páginas comparten contexto; contextos aislados no prueban concurrencia de una colección.

Playwright ejecuta esos tres motores y perfiles móviles, pero su WebKit no es la aplicación Safari distribuida; emular viewport tampoco prueba un dispositivo físico. [Playwright: navegadores](https://playwright.dev/docs/browsers). Completar manualmente Safari de iPhone y Chrome de Android disponibles, con OS/navegador/versiones y VoiceOver/TalkBack cuando sea posible; escritorio teclado y VoiceOver Safari o lector equivalente. El dispositivo real pendiente se declara, no se infiere de una captura. El perfil es recomendación, no flota acordada ni prueba realizada.

Comandos **previstos**, por definir en `package.json` al construir: `npm run typecheck`, `npm run build`, `npm run test`, `npm run test:e2e`, `npm run validate:content`. No existen hoy; no se ejecutaron. Registrar runtime/lockfile/motores, resultados y límites al implementarlos. Un test determinista que pasa no acredita supervivencia a pérdida eléctrica, cuota real, borrado por OS o autoridad económica.

## Incertidumbres, responsables y siguiente acción

| Incertidumbre | Evidencia actual | Recomendación/estado de preparación | Próxima acción y responsable |
| --- | --- | --- | --- |
| U15 plataforma/dispositivos | P01 y documentación técnica primaria; repo sin aplicación. | Demo web responsive React/TS/Vite recomendada, no seleccionada ni probada. | Ingeniero coordinador registra elección al autorizar implementación y fija versiones/perfil; comprobar navegadores reales. |
| U18 motor/peso/exportación | PRD §14 admite CSS; concepto raster no entrega partes. | CSS primero; duración candidata no validada. `idb` y fuentes consultadas no afectan motion. | Arte entrega manifest; ingeniero implementa ritual sobre commit y mide tamaño, omisión y reduced-motion. GSAP solo si aparece necesidad concreta. |
| U19 recuperación/transición | Protocolo de tx y contrato local documentados; documentación IndexedDB/Storage. | Preparación suficiente para implementar local, atomicidad real pendiente. Piloto servidor diferido. | Ingeniero construye y QA prueba AC04–07/11–12 en navegador. Staff diseña autoridad/autenticación antes de piloto, sin importar saldo como confiable. |
| U20 accesibilidad/errores/rendimiento | Casos especificados, sin interfaz operable ni medición. | Plan de prueba concreto; no cerrado. | UX/QA verifica dispositivos, foco/lector, arte ausente, estados bilingües; registrar budget de recursos medido. |
| U24 configuración A18 | Datos/garantía aprobados; contrato y plan derivados. | Pesos intactos, validator/versionado especificados; balance y comprensión sin observar. | Ingeniero valida 40 tickets y configuración; UX observa A17/rareza. Normal, pity y shiny fuera de I1. |

Dependencias inmediatas: glosario y composición de `producto_ux`, manifest/recortes de `arte_ilustracion`; sus propuestas deben integrar la misma confirmación/versionado. No hay dependencia de APIs externas, permiso comercial para este trabajo privado, backend o arte final para verificar funcionamiento con sustitutos. Atractivo y lectura del acabado detallado sí necesitan una muestra representativa y personas reales.

## Riesgos que la integración debe mantener visibles

1. PRD describe una visión más amplia que I1: no implementar `QuestVersion`, `RewardClaim`, vales o taller solo porque aparezcan en §15. El prompt y A15–A18 limitan esta demo.
2. «Pendiente» en la UI no debe significar una transacción de larga vida ni saldo retirado antes de entrega. «Guardado» solo tras complete, con límites locales explícitos.
3. Filtrar candidatos conocidos sin cambiar ficha violaría correspondencia de probabilidades. Para I1 se recomienda fallo seguro de estado incompatible, sin renormalización tácita.
4. Versionar JSON sin autoridad local compartida no resuelve pestañas con bundles diferentes; tampoco un canal de notificación garantiza integridad.
5. Importar estado parcialmente válido o sobrescribir inventario desde un snapshot obsoleto puede duplicar o perder entrega. Validación cruzada y generación de reemplazo son necesarias.
6. Un wrapper, esquema o revisión de agentes no acredita atomicidad, recuperación, legibilidad, interés o licencia. Recomendación documental ≠ comprobación técnica.

**Resultado:** preparación técnica concreta para comenzar I1 cuando se autorice. No se identifica una nueva decisión material de producto que impida preparar la implementación. Elección de stack sigue recomendada; transacciones, recuperación, formatos y controles se demuestran al construir/probar. Comprensión y curiosidad requieren A17; retorno/balance normal/piloto requieren sus ensayos posteriores.
