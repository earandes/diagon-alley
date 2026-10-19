Method: dual-agent (A: /root/whole_game_design_a91 · B: /root/whole_game_mechanical_b91)

# Informe de diseño y producto A91

**Conclusión:** conservar el mundo ilustrado, la interacción por objetos y los recorridos completos existentes. Priorizar verdad del progreso, recuperación contextual y legibilidad del plan antes de producir más contenido o efectos. Hay18 hallazgos:3 P1,10 P2 y5 P3. No se ha demostrado un bloqueo P0. Esto no es una certificación de ausencia de defectos.

## Qué hemos revisado y qué significa «todo»

Se ha trazado el árbol de renderizado de App y consumidores:8 rutas canónicas,58 archivos TSX,36 CSS y68 superficies/estados significativos, desde bienvenida y credenciales hasta históricos, renderer perdido, error y temporada cerrada. Cada ficha identifica decisión, componentes, jerarquía, estados adversos, mejora y aceptación. Hay otras combinaciones posibles de datos:68 no pretende enumerar un espacio de estados infinito.

Se inspeccionaron15 imágenes existentes seleccionadas, inventarios de361 referencias de arte y16 sonidos, código de las coreografías, localización y contratos de operaciones. **No se ha ejecutado una revisión dinámica nueva.** Las restricciones del Mac impiden usar un navegador alternativo para completar esa parte. [Evidencia y procedencia](EVIDENCE.md).

## Juicio de diseño

La especificidad es alta: faroles, libros, ranas, puestos, tarros, bóveda y figuras tienen funciones del juego; no son meras tarjetas con una textura de fantasía. La separación consultar/confirmar/gastar, los snapshots y la omisión protegen la experiencia. La arena conserva dos bandos y el jefe tiene antesala y actor por piezas; no es un rig corporal completo.

La debilidad transversal es la **gramática entre sistemas**. Afinidad, casa, grupo, vínculo elegido, intención y objetivo de adquisición son válidos pero necesitan posiciones y formas constantes. La solución no consiste en ocultar cifras necesarias: hay que distinguir qué pertenece al personaje, al equipo, a la ruta y a la colección.

Evaluación heurística de Assessment A:30/40. Es juicio experto, no puntuación de usuarios ni índice de conversión. Estado3; correspondencia con el mundo4; control3; consistencia3; prevención3; reconocimiento2; eficiencia3; minimalismo3; recuperación3; ayuda3. El punto más débil es reconocer relaciones sin recordarlas.

| Heurística | Puntuación | Observación principal |
| --- | --- | --- |
| Estado del sistema |3/4| Progreso y bóveda necesitan verdad contextual |
| Correspondencia con el mundo |4/4| Objetos y acciones pertenecen al juego |
| Control y libertad |3/4| Consultar/cancelar separados; mejorar acceso desde recuperación |
| Consistencia |3/4| Gramática afinidad/vínculo/intención y cierres resilientes |
| Prevención de errores |3/4| Gastos explícitos; no prometer fuentes agotadas |
| Reconocimiento frente a recuerdo |2/4| Rutas y sistemas cercanos requieren interpretación |
| Eficiencia |3/4| Stock/colección grandes necesitan otra escala |
| Minimalismo |3/4| Folios acumulan bandas, pero detalles ya están plegados |
| Recuperación |3/4| Infraestructura existe; acción contextual mejorable |
| Ayuda |3/4| Libros útiles; vocabulario y contexto por ajustar |
| Total |30/40| Evaluación experta provisional con límites de ejecución |

Assessment B ejecutó una vez el detector:2 resultados, ninguno aceptado automáticamente como defecto. El pequeño overshoot del sello de rareza y la marca de selección de Halloween pueden ser apropiados; eliminarlos por una regla genérica empeoraría personalidad o claridad. La síntesis resuelve discrepancias y da precedencia a FINDINGS.

## Lo primero que cambiaría

| Prioridad | Evidencia → problema | Cambio concreto | Resultado esperado y comprobación |
| --- | --- | --- | --- |
| U01 | Atlas `/30`, catálogo vigente34 y archivo histórico | Proyección compartida con universo explícito, no reemplazar30 por34 | Totales coherentes al extender contenido; tests30/34/archivo/repetido/encantado |
| U02 | Tras usar la llave única se sigue orientando a conseguirla del jefe; repetición entrega0 | Mensaje y destino derivados de derechos y stock | Ninguna meta imposible; primera victoria, repetición y consumo sin cambiar premios |
| U03 | Sesión caducada ofrece recuperación/ensayo pero login queda en Ajustes | «Volver a entrar» en contexto, preservando dueño y pending | Recuperar misma partida sin sugerir otra; pruebas de respuesta perdida/cambio de cuenta |
| U04/U05 | Código técnico de temporada y cierres solo-imagen | Mensajes localizados y fallback visible de cerrar | Error comprensible y salida usable sin arte; fallo inyectado Linux/teclado/toque |
| U06–U09 | Caminos débiles, emblemas cercanos y nombres partidos | Trazo local legible, estandarte del plan, puestos y folio en dos niveles | Leer ruta/equipo/condición sin más paneles; comparación visual y tarea humana posterior |

## Qué simplificaría

- Datos repetidos en portada de cromo: retrato/nombre/emblema/rareza-copias primero; procedencia, estrellas y uso bajo consulta sin borrar significado.
- Un tarro por cada unidad en stocks grandes: contador y asignación por portador, manteniendo unitId y recuperación.
- Navegación de álbum desarrollada: cuatro cartas móviles pueden funcionar, pero escritorio necesita otra capacidad o índice. El cajón ya oculta filtros; no tratar sus19 opciones como19 tareas obligatorias.
- Ajustes: un índice corto con estado efectivo; no otra cadena de modales. Los campos convencionales de acceso se conservan porque facilitan credenciales y accesibilidad.

No eliminaría costes, errores, nombres, PV, foco o controles semánticos. No convertiría todos los botones en iconos mudos ni aplicaría el mismo botón ornamental a selección, consulta y gasto.

## Recorrido emocional buscado, todavía hipotético

Curiosidad en la entrada → dominio gradual al preparar → anticipación al leer una rama → tensión legible en combate → satisfacción por una consecuencia real → intención voluntaria para volver. Los valles de experiencia previsibles están en recuperación, inventarios grandes y una meta que ya no es alcanzable. No hay observaciones de jugadores que los cuantifiquen.

Tres perspectivas de inspección, no participantes ficticios: quien empieza necesita distinguir temporal/propio; quien colecciona necesita fuentes y completitud verdaderas; quien juega en móvil con texto ampliado necesita nombres completos, foco y retorno sin perder contexto. Las tareas humanas propuestas comprueban esos riesgos sin explicar la solución.

## Conservar, cambiar, producir e investigar

**Conservar:** estilo Teatro de alquimia, escena de entrada, ranas, dos bandos, antesala, cierre con botín, consultas nativas, ES/EN y swap. Conservar también las correcciones A90 ya resueltas.

**Cambiar primero:** las tres inconsistencias P1 y las salidas/error resilientes. Después, unificar el plan visual entre mapa/preparación/combate y ajustar la colección desarrollada.

**Producción mínima:** únicamente muestra de emblema editorial de Ejército si la gramática lo necesita. Caminos, foco y fallback se resuelven con composición/vector/CSS, sin lote de personajes ni sonidos nuevos.

**Investigar:** ritmo temporal y condiciones de rendimiento desfavorables, escucha voluntaria del loop, comprensión de vínculos y necesidad real de otro índice de Ajustes. No añadir motor, librería o mecánica para responder una duda estética.

Los cambios están descritos por archivo y aceptación en [IMPLEMENTATION](IMPLEMENTATION.md). Ninguno se ha implementado en esta fase. No hace falta decidir todavía precios, probabilidades, nuevas tiendas o recompensas para corregir estos problemas.
