# A85 · Casas alcanzables y Cromo Encantado

19 octubre2026. A85+A86 integrados mediante PR9 en main`1a549eafb33f771293603775a8586d0210c608a3`. CI39167929972 **completa y correcta**, fuente6cf2ac8/checkout0d59c610; árbol idéntico al merge. Documentación posterior no se atribuye otra batería. Sin despliegue.

## Qué cambia

La colección muestra casa, escuela y oficio cuando existen datos. Las casas crean un plan adicional a las afinidades actuales: tres identidades distintas en pie activan el efecto; cuatro lo refuerzan. El equipo sigue limitado a cinco puestos y no se promete un quinto nivel imposible para las casas pequeñas.

En ruta, tres Pactos existentes ofrecen integrantes distintos de una casa no inicial, junto al especialista anterior. La oferta se fija al crear la expedición. El jugador puede construir esa compañía, conservar una afinidad, cambiar un temporal o pasar cuando la formación lo permite. Mapa, comparación de Pacto, preparación y registro explican el mismo conteo. Los miembros propios y temporales contribuyen por igual; los temporales no se convierten en propiedad.

El Cromo Encantado añade un acabado facetado y un reflejo único a una copia confirmada. Se reconoce en apertura, álbum, filtro y selección de copias. **No cuenta doble, no aumenta daño, no es otra rareza ni otra identidad.** No se produjo un atuendo alternativo: se conservan los retratos ilustrados y se añade una fuente SVG editable.

## Por qué esta solución

| Evidencia | Problema | Cambio | Resultado verificable |
|---|---|---|---|
| A83: mediana 4 aperturas para tres Gryffindor propios, 28 para cada otra casa | Una construcción sería mucho más accesible por catálogo/starter | Vía táctica por los tres Pactos existentes, sin cambiar pesos |128 grafos tienen un camino válido que reúne tres distintos antes del primer combate |
| Tres casas solo tienen cuatro identidades | Un nivel5 de identidades exigiría nuevo catálogo o suerte especial | Niveles 3/4 y techoII uniforme | Pruebas de todas las casas con2,3,4,5 miembros; duplicados no inflan conteo |
| ×2 permitiría reducir puestos dedicados a la casa y dominar la copia normal | Ventaja táctica dependiente de un hallazgo excepcional | Variante cosmética | El combate no lee `finish`; copia/receipt guardan el acabado sin alterar estadísticas |
| Motor ya registra objetivos, daño y curación | Cambiar dibujos no debe recalcular resultados | Cuatro perfiles locales en el reloj compartido | Replay y log permanecen confirmados; pausa/omisión/reducido conservan resultado |
| PrimeraCI: medallones tapaban un nodo y foil tapaba cerrar | Regresiones reales de interacción | Reserva geométrica del HUD y marco ceñido al retrato | Clic nativo, comprobación de superposición y cierre, sin forzar eventos |

Las escuelas y profesiones son metadatos; no se apilan automáticamente más pasivos. Los personajes sin casa conservan afinidades y funciones existentes. No se asigna casa desconocida ni se equipara Slytherin con maldad.

## Escenarios de táctica y economía

[Simulación](simulation.json), [1152 muestras](simulation-samples.jsonl), [script](../../../tools/verification/simulate-houses-a85.mjs).32 semillas emparejadas en36 grupos: anterior/nuevo, starter/tres compras controladas al precio real, tres desafíos y tres políticas. Motor y casos de uso reales; transacción en memoria, no cuenta ganada ni comportamiento humano. Sin grageas, condición inicial completa, refugios dePV, encuentros pasados y ruta voraz pública.

- Starter/Descubrimiento:32/32 victorias en todas las políticas, antes y después. Sigue siendo la entrada segura del juego.
- Starter/Táctico: anterior31/32; nuevo cantidad31, afinidad31, casa28. Perseguir una casa no domina siempre.
- Starter/Maestría:0/32 en las muestras declaradas, ambos contenidos; no se afirma que sea imposible para toda estrategia.
- Tres compras/Descubrimiento yTáctico:32/32 en las políticas comparadas.
- Tres compras/Maestría: cantidad15→12, afinidad13→15, casa16→15. Se conserva el empeoramiento de algunos casos. Rival y composición influyen; no hay una política universalmente mejor.

Los premios y precios se conservan; los ingresos pueden variar cuando cambia la victoria o la ruta. El estudio publica monedas, condición y Esencia, sin llamar neutral a esa variación ni convertir simulaciones en diversión o retención.

## Probabilidad y completitud

Tasa delegada de ensayo del 1% independiente por apertura, publicada en libro. Primero se sortea identidad con los 29 pesos intactos; después acabado 1/100. Una identidad encantada elegible tiene probabilidad conjunta1/2900. La primera variante tiene mediana de 69 aperturas, P90 de 230 y P95 de 299 (geométrica, sin garantía ni pity). Aproximadamente 66,2% de recibir alguna en 108 aperturas.

La colección base sigue en 30 identidades. Harry starter no está en esa tabla de 29 y no se promete su variante obtenible. No se crea una completitud obligatoria de variantes, nuevas monedas, canjes o regalos. Las colas no se convierten en horas humanas sin un modelo de ingresos/tiempo.

## Integridad

[Compatibilidad](COMPATIBILITY.md): snapshots históricos, campaña 1, contenido táctico 3, reglas 2/engine 2 solo en expediciones nuevas. Finish/procedencia en snapshot de copia yreceipt, dentro del mismo commit. No se reescriben copias anteriores. Recuperación sin otro sorteo, rollback y concurrencia probados conSQL. La prueba de dos victorias a ambos lados del cambio conserva una sola llave.

## Evidencia y estado

[QA y cronología](QA.md), [comandos](COMMANDS.md), [galería](GALLERY.md), [rendimiento](PERFORMANCE.md), [recursos/coreografía](ASSETS-MOTION.md), [diseño](DESIGN.md), [contrato](CONTRACT.md), [sesión posterior](HUMAN-SESSION.md). Candidato actual: 662 unitarias, 103 integraciones con PostgreSQL/Redis reales, tipos/build/scanner correctos. PrimeraCI39135801556 falló; se conservan causas y límites. Candidato218389c enCI39138141861: A75/A68 pasan, A70 reproduce recorte parcial del tarro en móvil. Candidato5c499b9 cancelado antes de navegador;066037c añade exclusión y prueba de retratos pero reproduce margen de details y carrera de mapa ocupado. Candidato19603c7 supera A70/A68 y conserva dos fallos de solapamiento de9px enMaestría5×5. Candidato cdc909f compacta únicamente los objetos de cinco integrantes en móvil y refuerza la fixture con equipo/grageas completos y pie fiel alApp. CI39146932044 pasaA75/A70/A68; A69 conserva dos fallos densos móviles con34–35px. El siguiente candidato e352a2e comparte libro y botín en un estante, con nueva comprobación de inspector/foco y captura de cajas antes del assertion; CI39150545527 superó `check`, pero la inspección detectó falta de CSS compartido y retratos sin pintar en la fixture densa. Se canceló la regresión antes de abrir navegador, se corrigió la fidelidad y se reforzó decodificación/cajas/acción; CI39153964079 sobre eb0c050 en curso. Sin éxito global atribuido todavía.

No hay navegador local, generación pagada, dependencia nueva o despliegue. Merge autorizado y completado tras CI completa. La distribución desigual de casas en la colección propia permanece; lo corregido es el acceso táctico durante la expedición. Comprensión, lectura de emblemas, espectacularidad y deseo de volver necesitan observación humana. Dispositivo físico y lector hablado no realizados.
