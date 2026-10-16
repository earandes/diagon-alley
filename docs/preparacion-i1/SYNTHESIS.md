# Preparación de I1: síntesis integrada

> Actualización posterior: A19 / PRD v0.16 incorporan bienvenida visual, cuentas e historial. Esta síntesis describe la preparación local anterior; la ubicación de autenticación en I1 sigue pendiente. Ver [assets y acceso](ASSETS_AND_ACCESS.md).

9 de octubre de 2026. Referencia de producto: PRD v0.15 y D02/D09/D10/A09–A18. **Preparación completada y revisión independiente integrada.** Aplicación sin implementar, dependencias sin instalar y pruebas de aplicación sin ejecutar.

## Conclusión y estado

I1 tiene preparación documental suficiente para comenzar cuando Enric solicite implementarlo. No se ha identificado una nueva decisión material de producto que impida construir el prototipo privado con sustitutos. Stack, idioma inicial, formatos, composición y recursos siguientes son recomendaciones, no aprobaciones por consenso ni comportamiento probado.

La preparación reduce ambigüedad sobre recorrido, contratos, producción y pruebas. Atomicidad, recuperación, accesibilidad y lectura móvil efectiva necesitan implementación y comprobación. Interés, comprensión y curiosidad necesitan personas reales. Retorno, probabilidades normales y economía requieren otras etapas. Esta ejecución no inicia la implementación, publicación o piloto.

## Entregas y evidencia

| Entrega | Qué contiene | Evidencia actual y límite |
| --- | --- | --- |
| [Producto y UX](producto-ux.md) | Recorrido, tres wireframes, detalle/resultado, estados, foco, glosario ES/EN y protocolo A17 | Especificación revisable; no UI operable o traducción editorial final. |
| [Arte e ilustraciones](arte-ilustraciones.md) | Composición móvil, paleta propuesta, seis grupos de assets, pipeline y estimación | Una muestra estática inspeccionada, XML/JSON/hashes y contraste sólido; sin capas de pintura, lote final, QA de app o usuarios. |
| [Stack y dominio](stack-dominio.md) | Dos alternativas, arquitectura mínima, contrato JSON, transacción, versiones e importación/reinicio | Investigación de documentación primaria fechada; no stack instalado, adaptador probado o benchmark. |
| [Muestra SVG](../../design/preparation/i1/mobile-composition-v1.svg), [preview](../../design/preparation/i1/mobile-composition-v1-preview.png) y [manifest](../../design/preparation/i1/manifest-v1.json) | Una lámina Weasley ES/EN de 900×1430, composiciones 390px y ventana de arte 358×220 | Controles dibujados sin comportamiento. C01 es ejemplo guionizado con arte ausente, sin sorteo/guardado; PNG original intacto. |
| [Revisión QA](revision-qa.md) | Hallazgos y matriz verificable de los doce criterios, con métodos es/en | Dos precisiones técnicas corregidas documentalmente; ninguna prueba de app ejecutada. |

## Recomendaciones concretas para construir I1

**Producto y localización.** Páginas sencillas para callejón, tienda, detalle, resultado, álbum y ficha; navegación Callejón/Colección, con retorno al origen y escena/lista equivalente. Consultar nunca gasta. Mantener un único botón explícito de uso en detalle, sin otro diálogo de gasto redundante. Confirmaciones sí para sustitución de datos y reinicio. Los errores distinguen abortado conocido de commit desconocido; no afirmar rana intacta mientras se recupera una operación incierta.

Recomendar P10 como perfil de ensayo: preferencia guardada primero; sin ella, primera preferencia válida de navegador es-* conduce a español, resto inglés. Formatos es-ES/en-GB para presentación, sin cambiar reglas/región comercial. Registrar esta elección rutinaria y versiones al comenzar I1; no declararla ya aprobada o aplicada. Glosario de trabajo disponible, pero nombres/contextos y mensajes concretos necesitan revisión bilingüe. No aprobar un nombre inglés nuevo para la marca como efecto de traducir wireframes.

**Arte.** Mantener referencia A11/A12 con ventana de ambientación y controles/textos en superficie crema fuera del bitmap. El cromo O01 del concepto es un regalo inicial y no es elegible como descubrimiento de bienvenida: no reutilizarlo como recompensa anunciada. La muestra evita ese cromo en el recorte y reserva C01 como placeholder guionizado. El SVG separa texto y formas, pero el PNG embebido sigue compuesto; no proporciona capas o rig.

Paleta de UI candidata: superficie #FFF9EE, texto #302336/#625367 y acción #4D285D. Cobre/turquesa para decoración; contraste matemático sólido no prueba foco, tamaños, lector o estados de la app. Medidas de maqueta no obligan a alturas fijas o texto pequeño. Recursos finales I1-V01–06 siguen ausentes; solo se usan ahora recorte V02 y sustitutos de V04/V06 en documentación. Para comenzar se prevén formas/lista HTML y cartas con nombre/familia/rango, todos identificados y funcionales sin imagen.

**Stack.** Recomendar React/TypeScript/Vite + IndexedDB mediante `idb` + CSS, frente a TypeScript/DOM/IndexedDB nativos. `idb` es un wrapper acotado para una frontera transaccional; su elección aún no se ha registrado como stack utilizado. Sin router, gestor global, servidor, service worker o engine de animación mientras no resuelvan una necesidad real. Vitest para dominio y Playwright para almacenamiento/recorrido en navegador son herramientas propuestas. Comandos y versiones se fijarán al construir; hoy no existen comandos de build/test de app.

**Arquitectura.** Dominio y transiciones independientes de React, idioma, `Intl`, persistencia y animación; casos de uso específicos de I1 y adaptadores pequeños. Un agregado finito de demo, unidades individuales, copias y operaciones; contadores/descubrimientos derivados. Un object store `records` con demo, generación, configuración activa y versiones históricas es una propuesta mínima, no requisito aprobado de backend. No introducir entidades de taller/vales, event sourcing o motores de variantes por aparecer en la visión del PRD.

**Configurar sin complicar.** Contrato y ejemplos documentales en stack-dominio: catálogo con schema/version, shop, rangos y doce identidades es/en; tabla con id/version/catalogVersion y entries identityId/weight. Mantener pesos A18 14/14/5/5/1/1 y las asignaciones aprobadas. Porcentaje = peso/suma; ningún porcentaje duplicado en UI. Editar archivos y elevar versión; validar referencias, pesos, idiomas y coherencia; conservar versiones previas. No añadir un panel administrativo.

Para la bienvenida, exigir que todos los candidatos declarados sean nuevos y el estado sea compatible con A16. Si no lo es, bloquear gasto con recuperación explícita; no filtrar y renormalizar silenciosamente, lo que alteraría probabilidades anunciadas. Este fallo seguro es propuesta técnica, no regla nueva de aperturas normales.

**Persistencia y versiones.** Leer la generación y demo vigente; recuperar una operación idempotente antes de validar configuración nueva o invocar azar. Si no hay operación, validar petición/unidad/configuración/elegibilidad dentro de la misma transacción; guardar consumo, resultado, copia y operación juntos. Anunciar éxito tras `complete`/`tx.done`, nunca tras una petición aislada. Sin red, timers, arte o hashing asíncrono dentro de la transacción. Ante excepción, el adaptador solicita aborto explícito mientras sea posible y observa la finalización: solo aborto confirmado permite afirmar estado previo; commit completado exige recuperar la operación; desenlace desconocido requiere consulta, sin falso éxito o saldo intacto.

Configuración activa local compartida y versiones inmutables evitan que un bundle antiguo rebaje una publicación. Una ficha v1 frente a configuración activa v2 exige actualizar/reconfirmar sin gastar. Snapshots originales permiten recuperar entregas aun con catálogo actual cambiado o inválido. Importación/reinicio comparan `{storageGeneration, runId, revision}` del resumen confirmado con el estado vigente. La revisión aumenta con toda mutación normal en su misma transacción; generación cambia al sustituir. Si otra pestaña abrió, cambió idioma/preferencias o persistió un marcador desde el resumen, exigir revisión y nueva confirmación. Solo entonces sustituir atómicamente y cambiar generación; una pestaña antigua debe refrescar antes de escribir, incluso si una importación restaura el mismo runId. Un canal entre pestañas solo avisa para releer; no concede copias ni sustituye estas comprobaciones. Toda esta garantía es diseño pendiente de probar.

## Evaluación de producto y decisiones pendientes

No queda una nueva elección material que bloquee la preparación del prototipo privado. Las propuestas rutinarias anteriores se registrarán como elecciones de ensayo al autorizar su implementación; si cambian alcance aprobado, requerirán decisión explícita. La selección final de assets, su producción/coste y cobertura física disponible siguen abiertas y tienen sustitutos o comprobaciones previstas.

Protocolo A17 propuesto: ocho fans adultos casuales, cuatro sesiones es/cuatro en, dos móvil y dos escritorio por idioma. Tarea neutral desde callejón: descubrir contenido de su rana y comprobar dónde se conserva. Después de llegar al álbum, observar hasta dos minutos de exploración natural o hasta que la persona diga que terminó; no pedir otra ficha ni premiarla. Cerrar esa ventana antes de preguntar comprensión/interés. El tiempo es método de observación propuesto, sin espera incorporada a la app.

6/8 exige completar y explicar sin ayuda; registrar sus componentes y todas las ayudas/fallos sin borrar personas del denominador. 4/8 exige que la misma persona abra otra identidad por iniciativa propia y exprese un motivo concreto de seguir coleccionando mediante pregunta neutral posterior. No cuenta una ficha abierta automáticamente o después de sugerirla. Preguntas dirigidas sobre rareza/objetos pueden hacerse después, separadas de estas medidas. Notas manuales anonimizadas; sin contacto, reclutamiento o resultados actuales.

## Hipótesis que necesita comprobar el prototipo

| Hipótesis/riesgo | Cómo se comprobará | Límite |
| --- | --- | --- |
| Visita mágica, recuerdo y curiosidad inicial | A17 y comentarios visuales después de medida espontánea | No prueba demanda o retorno. Placeholder no representa todo el acabado. |
| Persona/objeto, regalo/sorteo, rango/probabilidad | Ambos resultados en tests; observación real y diagnóstico posterior separado | Ocho sorteos no garantizan objetos o extraordinarios; reportar exposición. |
| Atomicidad y recuperación | Abortos antes/después de requests, recarga alrededor de commit y misma operación | No se ha probado navegador o resistencia a pérdida física. |
| Dos pestañas, versiones e import/reset | Páginas mismo contexto/origen, claves iguales/distintas, versiones y generaciones distintas | Dos contextos aislados no prueban concurrencia de la misma demo. |
| Acceso y localización | Recorrido/errores es/en, 320px/reflujo, foco/lector, reduced-motion y arte ausente | La lámina no prueba teclado, lector, botones o rendimiento. |
| Edición sencilla A18 | Datos v1/v2, porcentajes derivados, confirmación obsoleta y replay histórico | No exige migraciones o arquitectura de shiny. |

La [matriz de aceptación independiente](revision-qa.md#matriz-verificable-i1-ac01–12) define situación, acción, resultado, método, es/en y evidencia pendiente para cada criterio. Guionizados cubren rangos y repetidos técnicamente, sin convertirse en aperturas de usuario ni estadísticas reales de bienvenida. Con una sola rana nueva no se pueden evaluar repetidos reales, frustración longitudinal, completitud, suministro o regreso D1/D7.

## Matriz de incertidumbres y próxima acción

| U | Estado previo | Evidencia obtenida | Estado actual y próxima acción | Responsable |
| --- | --- | --- | --- | --- |
| U01 | Permisos pendientes | Procedencia del concepto/montaje documentada, sin licencia | Diferida a distribución; mapa de materiales/usos T01 antes de ese paso | Enric/distribución |
| U02/U03 | Perfil/promesa elegidos; interés abierto | Wireframes y protocolo A17 operativo | Hipótesis abierta; organizar ocho sesiones tras prototipo fiable | Producto/UX y Enric |
| U04/U05/U08 | Taller, suministro y canje propuestos | Fuera de I1 | Resolver en incrementos propios, con evidencia de utilidad/balance | Producto |
| U06/U07/U24 | Catálogo/rangos/bienvenida elegidos | Texto y datos alineados; límites de una rana explicitados | Comprobar comprensión con I1; balance normal/repetidos se difieren | Producto/QA/ingeniería |
| U09/U10/U11 | Expansiones/oferta/social sin elegir | Fuera de I1 | Reabrir solo ante necesidad/evidencia; no infraestructura anticipada | Producto/Enric |
| U12 | Referencia aceptada; arte final ausente | Lámina SVG/preview es/en observada, sin O01 resultado | Revisar UI real/recortes y muestra de escena/carta antes de lote | Arte/UX |
| U13/U14 | Pipeline/procedencia pendientes | Manifest seis grupos, recortes y fuentes ausentes explícitos | Producir fuente por capas y registrar tiempo/procedencia cuando corresponda | Arte |
| U15/U18 | Web móvil/CSS candidatos | Comparación técnica con fuentes primarias; partes requeridas | Registrar stack al implementar, fijar versiones y comprobar browser/motion/peso | Ingeniería |
| U16/U17 | APIs opcionales; acceso no verificado | Núcleo independiente, sin llamadas nuevas | Diferidas; no bloquean I1 | Ingeniería/producto |
| U19 | Recuperación definida sin código | Contratos/tx/versiones/generación especificados | Preparado documentalmente; pruebas reales AC04–07/11–12 pendientes | Ingeniería/QA |
| U20 | Accesibilidad/rendimiento no probados | Estados, contraste sólido y casos preparados | Probar teclado/lector/reflujo, fallos y arte ausente en app real | UX/QA |
| U21 | Horas/caja sin medir | Arte final I1 estimado 58–106h con exclusiones | Rango orientativo, no compromiso; medir primera escena/carta antes de lote | Arte/ingeniería/Enric |
| U22 | Medición/cohortes pendientes | Registro formativo manual A17 propuesto | Concretar consentimiento/conservación al organizar sesiones; cohortes se difieren | Producto/UX |
| U23 | ES/EN obligatorios; editorial pendiente | Glosario/estados/wireframes es/en | Completar contexto/traducción revisada y verificar ambos idiomas al construir | UX/editorial/QA |

No se cierra una U por consenso de agentes. Las recomendaciones concretan la siguiente acción, manteniendo pendiente la evidencia que su naturaleza exige.

## Cuestiones diferidas a piloto u otros incrementos

Grageas abribles/objetivo (I2), taller (I3), canje (I4), reposición/cuentas/retorno (I5), nuevas tiendas (I6), probabilidades normales, pity, shiny y rangos nuevos. Servidor, autenticación y conservación/borrado antes del piloto; no importar saldo local manipulable como autoridad económica. Materiales/usos y condiciones antes de distribución correspondiente. Ninguno de estos puntos exige resolverlo ahora para construir I1 privado.

## Orden de pequeños pasos completos y cobertura

Cuando Enric solicite implementar:

1. Registrar stack/dispositivos/versiones y preparar datos/traducciones/sustitutos. Completar Callejón → Weasley → regreso + consulta de colección, inicialización única es/en: AC01/02/08/09/10. Es paso intermedio, no entrega final de I1.
2. Completar detalle → confirmación → entrega atómica → resultado → álbum, con stock 1→0 y colección 4→5; probabilidades exactas, operación/versiones y recuperación: AC03–07/11.
3. Integrar cambios de idioma, omisión, reduced-motion y arte ausente sobre ese mismo resultado; verificar foco/anuncios, filtros y estados es/en: AC06/08–11. No dejar animación sin resultado persistido.
4. Completar exportación/importación/reinicio con generación y validación, incluyendo otra pestaña: AC12 y adversos de AC05/07/11.
5. Ejecutar build/tipos/tests creados y recorrido en navegadores objetivo, registrar cobertura real y limitaciones. WebKit de Playwright no es Safari distribuido ni viewport emulado un teléfono físico. Perfil propuesto: motores Chromium/Firefox/WebKit, móvil 390×844/desktop 1280×800 y reflujo320; manuales Safari iPhone/Chrome Android y lector según disponibilidad, sin inventar cobertura.
6. Tras prototipo fiable y muestra representativa, organizar A17. Entrega funcional previa puede declarar observación aún pendiente; no esperar entrevistas para poder construir.

## Riesgos materiales y veredicto de revisión

1. Texto amplio heredado de PRD §§7–10/15/20 no amplía I1: grageas/taller/objetivo/vales y comparación de acabados no se activan. A11/A12 y A15–A18 prevalecen.
2. El concepto O01 no es recompensa nueva; el ejemplo C01 de la muestra es guionizado, no evidencia de sorteo.
3. Requests, caché de UI, snapshots obsoletos o mensajes entre pestañas no sustituyen commit transaccional y lectura de autoridad local.
4. Entrega histórica y edición de tabla deben coexistir sin reclasificación, nuevo stock o cambio silencioso de probabilidades.
5. Muestra, contraste matemático y fuentes técnicas no validan app, demanda, presupuesto o distribución.

La revisión independiente detectó QA-01 (revisión del estado para impedir sustitución concurrente obsoleta) y QA-02 (aborto explícito y certeza de finalización). El especialista corrigió el contrato y los casos de prueba; el revisor comprobó esas precisiones documentalmente. Ambos riesgos de comportamiento siguen pendientes de ejecución en navegador. QA-03 pidió reflejar el estado de ejecución en encargo, registro y prompts. El coordinador actualizó esos documentos y el revisor comprobó su coherencia; queda resuelto documentalmente.

Veredicto: no queda un bloqueo de especificación detectado para empezar I1 privado con sustitutos cuando Enric lo solicite. Registro de stack/versiones, comprobaciones reales y observación A17 son los siguientes pasos, sin reabrir decisiones aprobadas. Esta conclusión no autoriza implementarlo dentro de la fase actual.

Comprobaciones de preparación: documentos y enlaces, JSON/XML del manifest/muestra, hashes de arte y Word, suma/proporciones de tabla A18 y coherencia entre ejemplos documentales. Preview inspeccionado. No se ejecutaron build, tipos o tests de aplicación: no existe código/manifiesto de aplicación. El SVG y su preview son una muestra, no dos alternativas o una interfaz usable. Comprobación documental ejecutada con Python 3.14.2 y bibliotecas estándar (`json`, XML, `hashlib`, `fractions`, base64); todas las comprobaciones pasaron. `git diff --check` pasó. Las filas de decisiones aprobadas se compararon con el comienzo de la preparación y son idénticas. Todo queda local, sin instalación, publicación o subida a GitHub.
