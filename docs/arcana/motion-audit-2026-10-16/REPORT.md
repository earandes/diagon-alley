# A69 · Magia con intención

16 de octubre de 2026. Auditoría y propuesta terminadas antes de implementar. La última instrucción autoriza implementar, validar e integrar en main; no desplegar. Base: main `2b9df81` más Halloween A68 pendiente de validación gráfica.

## Qué cambia

1. **Arena:** un reloj de presentación conserva fase y cursor al pausar, acelerar u ocultar. El lanzamiento parte del actor y llega al objetivo; contacto, fallo, curación y quemadura responden únicamente a sucesos confirmados. Se conservan figuras completas y controles DOM.
2. **Apertura:** caja, sello, tapa, rana y carta comparten una secuencia derivada del pack. La rareza modifica intensidad y duración; una copia repetida tiene un cierre más breve. La consulta histórica no vuelve a ejecutar el ritual.
3. **Ruta:** un trazo finito reconoce la conexión realmente confirmada; los nodos disponibles dejan de competir con pulsos repetidos.
4. **Pacto:** el retrato incorporado y su sello reconocen una incorporación confirmada, distintos de la selección provisional.
5. **Condición:** las consecuencias de refugios y encuentros se muestran por unidad con los valores guardados. El refugio utiliza el snapshot exacto capturado antes de confirmar; si no existe, no inventa un antes.
6. **Objetos:** cofre, forja y bóveda reciben un asentamiento material breve después del recibo, sin lluvia genérica de partículas.
7. **Preparación:** los sockets y sinergias responden al cambio real de composición o equipamiento; consultar el equipo permanece estático.
8. **Colección:** cambiar página o filtro tiene una transición local, sin fingir un descubrimiento.
9. **Diálogos y operaciones:** entrada breve y reconocimiento único del resultado confirmado. La respuesta incierta conserva recuperación y no celebra éxito.
10. **Cierre y ambiente:** cierre finito ante un resultado nuevo; el ambiente cede a arena, diálogos y pestaña oculta. Halloween conserva su recuerdo y consulta histórica.

Todo utiliza las ilustraciones y runtimes existentes. No se fabrican poses articuladas desde un retrato plano, no se cambia el BattleLog y no se vuelve a sortear ningún resultado. El historial visual es una caché acotada de sesión: perderla puede repetir una presentación, nunca una concesión económica.

## Documentos y evidencia

- [Inventario de pantallas y estados](SCREENS.md), [auditoría y límites](AUDIT.md).
- [Diez coreografías](MOTION.md), [recursos y fuentes editables](ASSETS.md).
- [Tecnologías y fuentes oficiales](TECHNOLOGY.md), [backlog](BACKLOG.md).
- [Contrato y plan vivo](CONTRACT.md), [validación y presupuestos](VALIDATION.md).
- Registros de [apertura](REGISTRO-OPENING.md), interfaz y QA cuando finalicen.

Comprobación local sin navegador: tipos, 514 unitarios, 76 integraciones PostgreSQL/Redis, build y escaneo del artefacto correctos. CI Linux y sus resultados se añadirán tras ejecutar el candidato. Los tiempos presupuestados son objetivos hasta disponer de medición; no son rendimiento acreditado en móviles físicos. El build mantiene el aviso conocido de chunk principal superior a 500 kB.

## Conservar, rehacer, investigar

Conservar el acabado ilustrado, el núcleo autoritativo, el fallback DOM, Canvas2D de ranas y el stack actual. Rehacer la coordinación temporal y las respuestas visuales descritas. Investigar mediante una sola muestra futura un personaje con piezas/poses reales antes de producir un lote; Rive/Lottie/otro renderer no están justificados para este incremento.

La revisión humana debe comprobar contacto perceptible, comprensión de cambios y equilibrio entre espectáculo y ritmo. La sesión humana, lector de pantalla hablado y dispositivos físicos siguen pendientes; automatizaciones y emulación no los sustituyen.
