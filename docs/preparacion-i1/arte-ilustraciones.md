# Preparación de arte e ilustraciones de I1

9 de octubre de 2026 · especialista `arte_ilustracion` · PRD v0.15.

Estado: **documentado y recomendado para I1**. Una lámina estática producida y revisada visualmente; aplicación, assets finales, animación y pruebas con personas sin implementar o ejecutar. Ninguna propuesta de este documento cambia A09–A18.

## Fuentes y evidencia

Leídos `AGENTS.md`, PRD completo, DECISIONS completo, I1_PROMPT y encargo de incertidumbres. Referencias principales: PRD §§10–14, 19, 22, 26 y 27; DECISIONS A06/A11/A12/A14/A18, I1-V01–06 e I1-AC01–12. Se inspeccionaron visualmente el PNG y [su procedencia](../../design/concepts/i1/weasley-concept-v1-prompt.md).

El [concepto I1-CV01](../../design/concepts/i1/weasley-concept-v1.png) es un PNG RGB de 1536×1024, 2,6 MB aproximadamente: callejón/fachada a la izquierda, interior a la derecha y rana/caja/cromo en primer plano. La luz cálida, madera, cobre, ciruela y detalle teatral responden a A11/A12. Solo existen pintura compuesta y prompt; no capas, rig, pivotes, fuente editable de pintura o exports por asset. El modelo no fue expuesto por la herramienta imagegen. La imagen se generó sin referencias visuales de entrada según el registro local. No se verificó autorización externa de distribución.

**Hallazgo de dominio relevante:** el cromo dibujado en ese concepto contiene O01, orejas extensibles. O01 ya se regala; A13/A18 lo excluyen del resultado de bienvenida. El concepto es ambientación y referencia, nunca evidencia de una apertura ni el resultado anunciado de I1. Recortar su carta y usarla como hallazgo nuevo contradiría la regla aprobada.

## Recomendación de composición

Mantener cuento teatral 2D detallado. Para móvil, usar el arte como una ventana controlada, con textos y acciones en superficie crema debajo; no superponer párrafos a los estantes ni adaptar el panorama completo a una pantalla estrecha. El detalle conserva identidad y calidez, mientras los botones se reconocen sin buscar un objeto pequeño.

Coordinado con `producto_ux`: composición de 390 px, margen16, ventana358×220, cabecera/selector de idioma y salida fuera del bitmap. En una implementación, estas medidas son referencias de composición: alturas de texto intrínsecas, tarjetas apiladas cuando falte ancho y área desplazable; ninguna altura fija debe cortar English, zoom o mensajes de error. La muestra gráfica fija no representa ese reflujo.

Para callejón, preparar una composición vertical dedicada que conserve puerta/fachada y un fragmento de calle reconocible; evita `cover` centrado del panorama, que puede eliminar Weasley. La lista equivalente queda disponible sin localizar una fachada. Para interior, mostrar estantes y calidez sin una entrega ya revelada. Para resultado, reemplazar la zona de contenido con una carta2:3 y nombre/familia/rango/copias/procedencia en texto separado, más acceso a colección y regreso. El resultado funcional lo controla la operación persistida; la ilustración no lo decide.

En escritorio puede ampliarse el escenario y disponerse el panel de datos a su lado. Mantener ancho legible y jerarquía del recorrido; no multiplicar zonas jugables, otras tiendas o gestos.

Alternativas: fondo a pantalla completa da más inmersión, pero complica contraste, enfoque y adaptación del detalle. Solo lista es un sustituto funcional permitido ante arte ausente, pero no basta para comprobar la promesa visual A10/A12. Recomiendo ventana de arte + panel independiente, conservando lista, sin cambiar el estilo aprobado.

## Muestra estática entregada

- [I1-MV01: SVG editable de composición](../../design/preparation/i1/mobile-composition-v1.svg).
- [Preview PNG de la misma lámina](../../design/preparation/i1/mobile-composition-v1-preview.png).
- [Manifest de procedencia y recursos](../../design/preparation/i1/manifest-v1.json).

Es **una única lámina**, 900×1430, con variantes ES/EN lado a lado de una composición móvil Weasley. Muestra consulta de rana, colección4/12, reserva de grageas y zona posterior anotada de resultado. Los controles son formas sin comportamiento. El texto de guardado incluye un asterisco: la maqueta no guarda datos.

El PNG original está embebido una vez en `defs` del SVG; dos instancias `use` permiten verlo por un recorte de visor. El recorte fuente aproximado es x691,2/y19,2/ancho687,36/alto422,4, representado a358×220. No modifica el bitmap, no separa capas de estantería y evita el cromo O01 del primer plano. En el original ese recorte conserva estantes/lámparas/materiales; no entrega un fondo vacío final. La composición de resultado usa C01 como **ejemplo guionizado**, identificado sin sorteo ni guardado, con rectángulo de arte ausente128×192. No se generó un retrato de Dumbledore.

El SVG contiene textos vectoriales editables separados de la imagen, pero la interfaz final necesita controles y texto HTML semánticos; un SVG de maqueta no sustituye al DOM. El preview rasterizado solo permite inspección visual y pierde la separación editable. Los dos no son nuevas alternativas de dirección artística.

Comprobado técnicamente en esta preparación: XML bien formado, dimensiones de fuente/muestra, hashes del manifest y generación de preview mediante `sharp` del runtime bundled, sin instalar dependencias. Se inspeccionó visualmente el preview completo: las dos variantes presentan título, stock, CTA, regreso y etiquetas fuera del arte; la reserva muestra persona/rango sin imagen. No se probó reflujo a320px, teclado, lector, interacción, persistencia ni legibilidad en dispositivo físico. La lámina es más alta que una pantalla de móvil; su lectura presupone desplazamiento en una interfaz futura.

## Paleta y tipografía propuestas

| Uso | Valor propuesto | Criterio |
| --- | --- | --- |
| Arte | Ciruela#4D285D, cobre#D57635, madera#67442F, turquesa#299A9A, crema#F3E3C5 | Mantener referencia del PRD/concepto; no aprobación automática de una paleta final. |
| Superficie de texto | #FFF9EE | Una superficie uniforme separada del escenario. |
| Texto principal/secundario | #302336 / #625367 | No usar cobre o turquesa para cuerpo sobre crema. |
| Acción principal | #4D285D con texto#FFF9EE | Un CTA dominante y sin ornamentación que confunda lectura. |
| Títulos/cuerpo | Georgia o serif local / system-ui | En esta maqueta no se redistribuye fuente; tipografía final y nombres oficiales sujetos a revisión. |

Se calculó contraste matemático de colores sólidos sRGB: ciruela/superficie11,27:1, principal/superficie14,12:1 y secundario/superficie6,79:1. Cobre/superficie3,10:1 y turquesa/superficie3,24:1, por lo que se reservan para decoración. Estos cálculos no son auditoría de la app: estados de foco/deshabilitado, bordes, tamaños reales, fuentes, navegador y lector siguen pendientes. No hay texto sobre el bitmap en la muestra.

Recomiendo cuerpo16/24, metadatos al menos14/20 y títulos22–32 como candidatos. La lámina utiliza metadatos13 y nota documental11 para caber; **no trasladar sus tamaños pequeños como regla de producto**. Probar “Extraordinary”, plurales y textos de recuperación con longitud real, 200% y ancho320. Los controles44×44 son objetivo de comodidad del PRD, no prueba ni afirmación del mínimo AA.

## Recursos necesarios, previstos y usados

El manifest detalla autor/herramienta/modelo conocido, versión, referencias, fuente editable disponible/ausente, permiso pendiente, formatos, crop/pivot cuando aplica y sustitución. `null` en ruta final significa que no existe ese asset; no es una entrega omitida.

| ID | Necesario para el acabado final | Sustituto previsto | Realmente usado ahora |
| --- | --- | --- | --- |
| I1-V01 | Callejón y fachada independientes; recorte móvil dedicado | Formas/lista HTML y botónWeasley | Ningún asset; regreso solo indicado en textos de la muestra. |
| I1-V02 | Fondo interior, mostrador y estantes independientes, sin productos incrustados | Panel crema y estantería esquemática | Ventana recortada del PNG compuesto en I1-MV01. No capas ni interior final. |
| I1-V03 | Base/tapa/interior/envase, rana y sombra con alfa y lienzo común | Formas/silueta y resultado estático | Nada producido. La rana del compuesto no es pieza móvil. |
| I1-V04 | Ocho ilustraciones C01–04/O01–04, marco y dorso modulares | Carta2:3 sin arte, nombre/familia/rango externos | PlaceholderC01 y reserva de composición; ningún retrato nuevo o carta final. |
| I1-V05 | S01/S02 iniciales; S03/S04 pueden esperar aI2 | Símbolo de sabor y nombre externo | Nada producido. Mantener doce identidades aunque falten imágenes. |
| I1-V06 | Tres iconos/marcos legibles, etiqueta obligatoria | Círculo/rombo/estrella más nombresA14 | CírculoR01 en el ejemploC01. Rombo/estrella solo propuestos, sin lote. |

La falta de arte no impide construir el recorrido: el núcleo presenta nombre, familia, rango, procedencia, copias y acción. Usar “Ilustración provisional”/“Placeholder artwork” fuera del recurso; para archivo que no cargó, un estado localizado de arte ausente. Evitar afirmar que un placeholder valida el atractivo del acabado detallado.

Alt en app: si nombre y datos ya están junto a carta, imagen decorativa `alt=""`; describir solo contenido que aporte información distinta y revisada. Escena decorativa con título/lista equivalente, no un alt que enumere controles invisibles. Símbolo de rango decorativo cuando su etiqueta está presente; no leer dos veces “círculo Habitual”. La lámina tiene descripción documental propia ES/EN en manifest; no es navegación accesible funcional.

## Pipeline mínimo recomendado

1. Congelar referencia I1-CV01 y briefs por asset_id/identidad. Revisar una vista de callejón/interior y una carta en tamaño real antes del lote; no comparar otro universo/estilo.
2. Elaborar fuente de pintura por capas en herramienta elegida por artista, con fondo vacío y sujetos separados. Repintar regiones ocultas: un recorte del compuesto no las recupera. Registrar tiempo y cambios.
3. Para rana, coordinar base/tapa/interior/rana/sombra en lienzo1024². Definir pivote de bisagra y pies después de tener piezas reales; no atribuir pivotes o rig al PNG existente.
4. Exportar candidatos de carta2:3: máster1024×1536, detalle512×768, miniatura256×384. Escenas1920×1280 y recorte1080×1440; ajustar exports con medición, no cargar el máster por defecto. SVG real para marcos/iconos. Elegir PNG o WebP con transparencia conforme a export y soporte comprobados; no elegir engine por textura.
5. Integrar un solo recurso de prueba con UI y fallback. Medir primera transferencia, decodificación y aparición de controles en dispositivos objetivo; después completar el lote autorizado en otra fase. Objetivo≤1MB de primera vista heredado del PRD es presupuesto **propuesto, sin medir**; el SVG de documentación embebe el máster y no es paquete de app.
6. Cotejar fuente, manifest, identidad, recortes, nombres separados y ausencia de contenido extraño. Reemplazo no altera reglas, traducciones, IDs ni operaciones confirmadas; versión de recurso independiente de tablaA18.

CSS basta como primer candidato para presentación mínima; stack_dominio evalúa su selección. GSAP/Rive no necesarios para esta lámina ni por A12. Ritual1,6s del PRD sigue candidato: definir al implementar y observar luego. Animación solo después del commit; omisión y movimiento reducido llevan al mismo resultado. No generar imágenes en cada apertura ni flashes para extraordinarios.

## Esfuerzo propuesto y límites

Estos rangos **no son horas medidas, cotización o plazo**. Suponen un artista competente, referencia aprobada disponible, edición manual, dos rondas acotadas, una tienda y sin permisos cinematográficos/retratos de actores. No suman la maqueta documental como un segundo lote.

| Trabajo final de I1 | Horas de planificación |
| --- | --- |
| Guía breve/plantillas | 4–8 |
| Callejón y fachada con recorte móvil | 8–14 |
| Interior por capas | 8–14 |
| Caja/rana/sombra/piezas | 8–14 |
| Cuatro personas y cuatro objetos | 18–32 |
| Dos sabores de bienvenida | 2–4 |
| Marcos/dorso/rarezas | 4–8 |
| Export, revisión y QA de arte | 6–12 |
| Total alternativo para este I1 | **58–106** |

No incluye dos saboresI2, envase/apertura de grageas, taller, bromas futuras, motor/rig, animación desarrollada, traducción revisada, programación/integración, QA funcional, sesiones de usuarios, licencias, aprobación externa ni coste de modelos/herramientas. Es una estimación nueva de I1 con callejón y rareza; no reemplaza la tabla histórica v0.3 de alcance distinto. Producción con placeholders puede evitar ese lote inicialmente, pero no permite evaluar de igual forma la promesa artística. Registrar tiempos del primer fondo y una carta para corregir U21 antes de comprometer recursos.

## Incertidumbres y pruebas siguientes

| Incertidumbre / criterios | Qué quedó preparado | Qué falta y cómo comprobarlo | Responsable / próxima acción |
| --- | --- | --- | --- |
| U12 / AC01,03,08,10 | Referencia observada y una composición móvil ES/EN con arte separado | Legibilidad y atractivo reales: revisar en320/390/430, zoom, aparato físico; A17 después de app | UX/Visual: revisar muestra y luego una escena/carta representativas, sin reabrir A11/A12. |
| U13 / AC08,10 | Brief, pipeline y criterio de reemplazo | Consistencia de pintura/capas, tiempo de retoque y exports no demostrados | Visual: producir un fondo y una carta cuando se autorice producción; registrar tiempos/defectos antes del lote. |
| U14 / AC10 | Manifest con procedencia local y fuentes ausentes explícitas | IP/uso del arte y fuentes finales; modelo desconocido no se inventa | Staff/Visual: completar condiciones por material enT01 antes de distribución correspondiente; no bloquea preparación privada. |
| U18 / AC06,10 | Piezas/pivotes requeridos y estado estático equivalente definidos | Peso/runtime, separación real y omisión no implementados | Ingeniería/Visual: integrar sustitutos y medir; CSS primero recomendado, añadir engine solo por necesidad probada. |
| U20 / AC09,10 | Texto externo, contraste sólido calculado y acciones visibles propuestas | Reflujo/lector/teclado/foco/artwork ausente, no probados por SVG | UX/QA: recorrer app enES/EN, cortar carga de imágenes y confirmar que todos los resultados/actions se conservan. |
| U21 | Esfuerzo58–106h con alcance/exclusiones explícitos | Tiempo medido, caja, proveedor/disponibilidad y coste final ausentes | Visual/PO/Finance: medir muestra productiva y cotizar antes de presupuesto de lote; no transformar horas en fecha. |

Pruebas concretas posteriores: al bloquear imágenes, consultar rana y confirmar conserva la misma operación/copia; al reemplazar V04 solo cambia el arte; al recuperar una carta de versión previa no se muestra un rango nuevo por asset actualizado; omitir/reducir movimiento revela mismo resultado; idiomas no cargan nuevas ilustraciones ni cambian hallazgo; foco y controles fuera de la escena siguen accesibles. Todas requieren app y persistencia real, no están ejecutadas.

I1 puede prepararse para implementar con estos sustitutos, sin esperar un lote final. La lectura móvil efectiva, accesibilidad, costes observados y reacción emocional permanecen pendientes. Esta entrega reduce ambigüedad de producción y composición; no cierra esas incertidumbres por acuerdo entre agentes.
