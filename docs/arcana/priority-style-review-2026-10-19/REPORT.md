# Revisión de juego y estilo · A90

Method: dual-agent (A: `/root/premerge_design_a` · B: `/root/premerge_design_b`). Assessment A completado antes de incorporar detector. Revisión y corrección autorizadas por Enric; sin merge. Baseline y aceptación en [CONTRACT](CONTRACT.md).

## Veredicto y jerarquía

Las nuevas superficies pertenecen al juego ilustrado: emblemas para compañía, retratos/varitas sobre mesa, tarros sobre portadores, marcapáginas y libro de hechos. No justifican rediseño general, recursos nuevos ni un dashboard. La principal oportunidad es retirar controles secundarios repetidos y corregir señales que describen un estado distinto del real. No se confunde preferencia artística con comprensión humana demostrada.

Se elige agrupar la ayuda de intenciones frente a simplemente atenuar cuatro recuadros. Los tres objetos siguen eligiendo explícitamente; un libro permite comparar todas las alternativas antes de elegir, sin consumir ni guardar. Tres disclosures «Cómo intentarlo» y el «?» se convierten en uno, con etiqueta visible y foco. En el caso seleccionado, ocho controles pasan a cinco, contando tres elecciones, ayuda y abandono. No se añade confirmación ni cambia la operación.

## Superficies revisadas

| Feature/superficie | Evidencia y recursos activos | Decisión |
| --- | --- | --- |
| PM02 guía de expedición | Fuente, geometría y recorrido App A89; nuevo nombre/fallback se prueba en A90. Icono de Pacto/mapa/Esencia vigente. | Corregir S01/S06, conservar repisa real y consulta nativa. No avance tutorial automático. |
| PM03 compañía/cierre/preparación/mapa | PNG declarado y fuente; escudo vectorial, retrato y caldero actuales. | S02/S03/S04. Una elección voluntaria, identidad visual estable y ayuda agrupada. Botín conserva prioridad. |
| PM06 libro de hechos | PNG fixture5×5 y pruebas temporales A89. Escudo/retrato correctos, máximo dos hechos. | Conservar. Resultado y continuar predominan; detalle nativo posterior al replay. No estadísticas permanentes o causalidad inventada. |
| PM11 lectura en Ajustes | Fuente y cohortes de preferencias A89; muestra nueva seleccionada en Linux. Controles nativos y texto funcional. | S07 descubierto en la muestra nueva: tamaños en fila y contraste independiente, sin bloques estirados; sello habitual. Controles nativos accesibles conservados. |
| PM05 Cromodex/inspector/fuente/objetivo | PNG App conectada, dorso/figura, caja y marcapáginas existentes. | S05. Fuente, copia propia/temporal y azar exacto visibles; procedencia técnica a demanda. Objetivo distinto de intención táctica. |
| PM18 mesa/portador/receta | PNG App; retrato y dos varitas, tres cifras comparables, una acción de gasto. | Conservar. No se ocultan valores iguales: muestran la renuncia real y evitan prometer mejoras inexistentes. Detalle a demanda. |
| PM19 tarro/portador/riesgo | PNG fixture, preparación densa ARCANA, flujo conectado A89. | Conservar. Existencias, borrador, caídos y confirmación separados; sin nueva bolsa ni sabor seleccionable. |
| PM01/PM14/PM10/PM22 | Cálculos, persistencia y estudio A89. | No añaden pantallas ni assets. No inventar una interfaz de analítica o nuevas reglas económicas. |

## Hallazgos y correcciones

| ID/severidad | Evidencia → problema | Cambio → aceptación |
| --- | --- | --- |
| S01/P2 | Source: nombre accesible genérico sustituía el objetivo visible | El summary obtiene el nombre de la instrucción visible; conserva nombre localizado cuando es compacto. Prueba ES/EN y teclado. |
| S02/P2 | Source: disponibilidad simula PV máximos de toda la colección al terminar, pero decía «en pie · nivel» | Se informa cantidad de identidades propias disponibles para preparar. Solo las identidades distintas en pie al confirmar contribuyen. No se afirma que ya estén en formación o activas; no se exige incluir toda una colección mayor de cinco. |
| S03/P3 | PNG/source: escudo se sustituía por libro al pasar al recordatorio | Mismo HouseInsignia, tamaño2rem y estado textual. Vínculos y otras intenciones conservan sus imágenes. |
| S04/P3 | PNG: cuatro ayudas con aspecto de botón competían con tres objetos | Un libro «Cómo intentarlo» con todas las explicaciones. Objetos principales, foco cian visible y abandono secundario intactos; no cambio de semántica/commit. |
| S05/P3 | PNG: «tabla4» compite con fuente/azar | Porcentaje exacto en primer plano, versión en ayuda junto a explicación aleatoria. No se omite información ni cambia probabilidad. |
| S06/P2 | Source: imagen ausente + guía oculta + sin marcador deja diana vacía | «Consultar orientación» visible solo si falta imagen, igual a su nombre accesible; icono compacto habitual intacto. Fallback y recuperación por teclado se prueban con error explícito de SVG inline. |
| S07/P2 | PNG nuevo de Ajustes: tamaño apilado y contraste ocupando dos alturas de106px | Grupo de tamaños horizontal, contraste debajo y sello existente. Altura mínima56px ordinaria;320px permite apilar para texto ampliado. Prueba de fila, separación, selección y reflujo. |

Ocho pruebas ES/EN fallaron antes del cambio por S01/S02/S03/S05 y pasan después. S04 se comprueba además por ayuda única y conservación del contenido. S06 requiere navegador permitido: el caso existente de arte ausente solo cubría arena. No se reetiqueta el finding estático como reproducción gráfica anterior.

## Heurística independiente inicial

Puntuación experta orientativa, no métrica de usuarios ni criterio único de aceptación: **31/40**. Estado3, lenguaje3, control4, consistencia3, prevención3, reconocimiento3, eficiencia3, minimalismo3, recuperación3, ayuda3. No se inventa una puntuación posterior para atribuir mejora sin nueva evaluación independiente.

Fortalezas: consulta/gasto separados; figuras y objetos contextualizan las decisiones; máximo tres intenciones y dos hechos evitan acumulación. Personas de contraste: usuario de lector/voz pierde instrucción en S01; coleccionista interpreta disponibilidad como formación en S02; jugador que reconoce escudos debe reaprender el recordatorio en S03. Valle emocional posible: revisar demasiados controles tras la recompensa. Simplificar S04 devuelve protagonismo al siguiente plan, sin ocultar el botín.

## Assets, movimiento y límites

Todos los recursos de A89 se reutilizan. [Inventario de24recursos/consumidores](../priority-increment-2026-10-19/reused-assets.json), fuentes históricas y [movimiento](../priority-increment-2026-10-19/ASSETS-AND-MOTION.md) conservados. S03 reutiliza el escudo activo y S04 el mismo libro. Sin nuevos PNG/SVG/audio, poses, recortes, generación, dependencias, texturas o tickers. Arte ausente mantiene texto y operación. Las capturas no acreditan animación; el reloj, replay, renderer y reducido no se editan.

Detector B inicial: siete TSX, salida0 y `[]`. Detector final sobre los bytes modificados: salida0 y `[]`; se repite por cambio real, no para buscar una muestra favorable. No consola u overlay de navegador ejecutados. Detector limpio no demuestra estilo, contraste completo, comprensión o diversión.

La primera confirmación39277262203 pasó57casos de cuentas/prioridades y39omisiones deliberadas, incluyendo S01–S06. La captura adicional de Ajustes descubrió S07. Se canceló deliberadamente el resto de esa ejecución para corregirlo y validar un único candidato final; no se presenta la cancelación como fallo de producto ni batería completa superada. Captura desfavorable preservada.

Confirmación final: ocho imágenes nuevas inspeccionadas por el coordinador y Assessment A; no nuevo defecto bloqueante en la selección. Los57casos de cuentas/prioridades y114de experienciaA75 pasan sobre19f0b4f/checkout1dfca931 idéntico. CI39280235365 completa correcta:759unitarias,120PG/Redis y549browser, con303omisiones deliberadas. Resultados, SHA y límites en [QA](QA.md). ES/EN×packs/tamaños se comprueba por pruebas, no por una matriz de capturas. Ocho imágenes nuevas explícitas: cinco superficies seleccionadas originales, guía App, lectura y ayuda de compañía escritorio EN/ARCANA. Observación humana, lector real, zoom real y dispositivo físico pendientes.

Questions skipped: Enric ya fijó estilo, concisión y autorización para corregir; no se requiere otra decisión de producto para este lote.

## Entrega

S01–S07 implementados y técnicamente comprobados en la rama, con ocho capturas seleccionadas inspeccionadas y regresión completa correcta. [Galería](GALLERY.md), [archivos y alcance](CHANGES.md), [sesión humana pendiente](HUMAN-CHECK.md). No merge, despliegue o publicación. La aceptación de estilo no declara rendimiento universal: las ventanas A69 conservan extremos hasta92msP95rAF WebKit, frente90ms en la cohorte histórica no pareada; sin atribución causal a A90.
