# Contrato del encargo de I1

9 de octubre de 2026. Preparación para el encargo actual de Enric. Fuentes leídas completas: README, AGENTS, PRD v0.18 y DECISIONS. **Preparado antes del scaffolding. Seguimiento de ejecución en docs/i1-evidence/REPORT.md.** El Word histórico no se modifica.

## Requisitos y decisiones pendientes

El encargo autoriza construir, comprobar, hacer commit en español y push normal a main de una demo local: Callejón → Weasley → consultar rana → confirmar apertura → resultado → álbum → Callejón. Autoriza una CI mínima de tipos, pruebas y build, sin despliegue. No autoriza publicar ni modificar configuración de servicios.

La instrucción actual delimita el ensayo sin cuentas ni backend. A19 sigue siendo dirección del producto conectado posterior; no se implementa en esta demo. Para este ensayo, el ambiente se limita a farol y cartel, y la apertura dura 1,6 s después del commit; la dirección ampliada A20 no añade lechuza, paseante, cámara libre o un ritual de 3–4 s a este encargo. A11/A12 conservan su estado de referencia artística; los sustitutos no aprueban el acabado final.

Decisiones resueltas por Enric el 10 de octubre (A23/A24); se conserva aquí el conflicto consultado:

1. P01/P17 siguen propuestas, sin package.json o aplicación. Se ha solicitado confirmar React/TypeScript/Vite + IndexedDB con idb + CSS. Motivo: componentes para estados bilingües y un adaptador de transacciones pequeño; alternativa razonable, TypeScript/DOM nativo, con más sincronización propia de vistas/foco. Confirmado explícitamente el 10 de octubre de 2026.
2. El encargo pide R1 con ocho candidatos, incluida repetición de O01/O02 (35 % conjunto). A13/A18 y AC03/04/11 exigen bienvenida nueva, seis candidatos con pesos 14/14/5/5/1/1. Se ha solicitado elegir cuál rige el ensayo. No filtrar o renormalizar R1 silenciosamente. Enric confirma mantener A13/A18: seis candidatos, nuevo garantizado, 4→5 descubrimientos.

El catálogo A15, rangos A14 y regalos A16 se conservan en ambas alternativas. C01–C04, O01–O04, S01–S04; O01/O02/S01/S02 una copia conocida cada uno; una rana individual y una unidad de grageas no abrible. Ninguna lectura o navegación consume.

## Estados y comportamiento verificable

| Estado inicial | Acción | Resultado observable y persistencia |
| --- | --- | --- |
| Almacenamiento vacío legible | Entrar en demo | Crear una ejecución y la bienvenida una sola vez; 4/12, cuatro copias, rana 1, grageas 1 pendientes. |
| Almacenamiento inaccesible | Entrar o reintentar | Mensaje localizado y acción de recuperar; no sustituir error por una demo nueva ni inventar stock. |
| Callejón | Entrar mediante botón de escena o lista | Interior Weasley; inventario intacto; recordar origen/foco/posición. |
| Weasley | Consultar rana y volver | Detalle con candidatos, porcentajes derivados de pesos y versiones; ningún gasto. |
| Detalle vigente con rana | Usar una rana | Consumo, copia y operación confirmados en una transacción; después comenzar ritual o resultado estático. |
| Guardado abortado | Reintentar | Sin éxito ficticio; leer operación primero y reutilizar la misma petición. |
| Desenlace desconocido | Recuperar | Consultar unidad/operación; solo celebrar un resultado confirmado. |
| Operación confirmada | Omitir, cambiar idioma, recargar o cerrar | Mismo resultado y versiones, sin nuevo sorteo; al recargar, resultado estático recuperado. |
| Resultado | Visitar álbum/ficha/filtros | Familia, rareza original, origen y copias coherentes; base de doce, filtros no alteran progreso. |
| Rana agotada | Volver o consultar álbum | Colección disponible, gasto bloqueado, ninguna reposición prometida. |
| Ajustes | Exportar | Lectura consistente; JSON identificado con ejecución, preferencias, copias, unidades, operaciones y versiones. |
| Ajustes | Importar inválido | Rechazo localizado, datos anteriores intactos. |
| Resumen de sustitución vigente | Confirmar import/reset | Sustitución atómica; reset crea otra ejecución; comprobar revisión/generación contra cambios concurrentes. |
| Resumen obsoleto | Confirmar sustitución | Rechazar sin borrar una apertura o preferencia concurrente; actualizar resumen. |

## Fronteras y contrato transaccional propuestos

Núcleo puro y síncrono: validar configuración/estado/petición, obtener transición y snapshot de entrega. No importa React, idioma de UI, almacenamiento o animaciones. El azar es una función de ticket inyectable y solo se llama tras descartar reintento, conflicto, unidad consumida y ficha obsoleta. Presentación convierte códigos a mensajes completos es/en.

Un agregado finito contiene ejecución, unidades, copias, operaciones y preferencias. Descubrimientos, stock y número de copias se derivan; no mantener balances duplicados. Cada copia conserva ID estable y snapshot de nombre/contexto/familia/rareza/versiones/procedencia. Los regalos tienen origen conocido y nunca cuentan como azar.

La petición semántica incluye runId, unitId, tipo y versiones; idioma y duración no forman parte de ella. Un token externo de generación evita escribir desde una pestaña anterior a import/reset. La revisión detecta sustituciones basadas en un resumen obsoleto.

Dentro de una transacción de escritura común: leer estado vigente → localizar clave de operación → comparar petición si existe → validar unidad/configuración/ficha → seleccionar → guardar agregado y revisión → esperar finalización. Misma clave/petición devuelve entrega histórica antes de validar configuración nueva. Misma clave/otra petición: conflicto. Otra clave/unidad consumida: rechazo sin azar.

Solo peticiones del almacenamiento y cómputo síncrono dentro de la transacción; sin timers, arte, red o hashing async. Un request exitoso no es un commit. Ante excepción, abortar explícitamente y observar finalización. Si ya hubo commit, recuperar su resultado. Las preferencias se modifican sobre la lectura vigente, sin escribir un inventario cacheado. Avisos entre pestañas son comodidad; la integridad procede de la transacción.

Versiones de catálogo/tabla inmutables por contenido; configuración activa compartida entre pestañas. Ficha antigua exige actualizar y reconfirmar sin consumo. Snapshot histórico recuperable incluso con configuración actual inválida. Importar no suma inventario ni rebaja configuración activa. Validar tamaño, esquema y referencias cruzadas antes de sustituir.

## Matriz de comprobación prevista

Todos los criterios permanecen **pendientes**. Esta matriz prepara casos; no sustituye I1-AC01–12 ni declara pruebas realizadas.

| Criterio | Evidencia automática prevista | Revisión adicional |
| --- | --- | --- |
| AC01 | Recorrido es/en por escena/lista, regreso, stock, foco y scroll | Teclado y capturas móviles. |
| AC02 | Inicialización concurrente y recarga; regalos exactos y stock | Texto de grageas pendientes y prioridad de rana. |
| AC03 | Validación/tickets/porcentajes/versiones; consultar sin gastar | Regla pendiente de resolver; lectura móvil es/en. |
| AC04 | Consumo/copia/operación atómicos y snapshot | Nueva/repetida depende de la decisión de ensayo. |
| AC05 | Misma clave/petición, conflicto, clave distinta, dos páginas del mismo contexto | Dobles de almacenamiento no sustituyen navegador. |
| AC06 | Aborto precommit, recarga postcommit/durante ritual, skip/idioma | Captura de resultado recuperado. |
| AC07 | Fallo de request, excepción tras escritura, desenlace desconocido y recuperación | No afirmar cuota real o resistencia a fallo físico. |
| AC08 | Álbum, fichas, filtros, copias, progreso, agotado | Todos los rangos en fixtures controladas. |
| AC09 | Catálogo/mensajes completos, lang, plurales y estados adversos es/en | Revisión de textos y longitudes. |
| AC10 | Foco, reduced-motion, omisión, arte ausente, 320/390 px | Lector y móvil físico pendientes si no hay acceso. |
| AC11 | Datos inválidos/idioma ausente, versión obsoleta, snapshots inmutables | Editar JSON y elevar versión con procedimiento reproducible. |
| AC12 | Export/import, JSON incoherente, cancel/reset, sustitución concurrente | Recuperar después de cerrar y abrir. |

Verificación prevista: tipos, dominio, integración con IndexedDB de navegador, unas pocas pruebas de recorrido y build. Capturas reales de cinco vistas en es/en a 390 px, reflujo a 320 px y ampliación. Medir recursos transferidos de build sin caché; objetivo ≤1 MB propuesto, no alcanzado todavía. Emulación no prueba móvil físico ni lector. A17 y T01 continúan pendientes.

## Arte y dependencias

Manifest previo a producción: [IMPLEMENTATION_ASSETS.json](IMPLEMENTATION_ASSETS.json). Solo sustitutos SVG/DOM/CSS propios editables, sin generación de imágenes, servicios de pago, fuentes externas, logos o semejanzas de actores. Textos funcionales fuera del dibujo. Sin audio en el ensayo inicial. No producir un lote antes de revisar una muestra integrada.

Dependencias de ejecución propuestas: React/ReactDOM para vistas y idb para finalización/transacciones. Herramientas propuestas: TypeScript, Vite, Vitest y Playwright. Sin router, gestión global de estado, GSAP o backend salvo necesidad actual documentada y dentro de la opción confirmada.
