# A85 · Decisión de diseño y límites

## Dos riesgos tratados

**Acceso desigual.** A83 calcula mediana4 aperturas para tres Gryffindor frente28 para cada otra casa, sin Pactos. No se ha vuelto a sortear ni alterado la probabilidad de identidad. Se mantiene el sistema de afinidades que da utilidad a los30 personajes. La casa añade un plan acotado: tres identidades distintas vivas, refuerzo con cuatro; no se muestra un quinto nivel inalcanzable para tres casas. Las copias repetidas siguen siendo utilizables y reciben el efecto si pertenecen a la casa activa, pero no fabrican identidades distintas.

Los tres Pactos actuales ofrecen un miembro distinto de una casa no inicial junto a un especialista anterior. El tema se fija por la firma del grafo, priorizando una casa alternativa que ya lleve la formación inicial; candidatos ya elegidos al empezar se ordenan al final. No añade nodos, integrantes gratuitos permanentes o regalos.128 rutas reales admiten reunir los tres antes del primer duelo, con Harry y temporales. Cada oferta y sus IDs quedan en el snapshot. Cancelar/recargar/idioma no cambia candidatos. Con una copia propia de esa casa puede buscarse el refuerzo de cuatro sin necesitar a Harry encantado o un personaje nuevo.

Esto mejora la oportunidad táctica durante ruta; **no iguala la distribución de casas en la colección propia**. Gryffindor conserva14 identidades, otras cuatro. No se afirma igualdad económica ni se oculta esa diferencia tras un contador. Añadir catálogo o cambiar tablas queda fuera.

**Dominancia del ×2.** El Cromo Encantado es una edición visual de la misma identidad, sin estadísticas, nivel, efecto o contribución extra. No duplica descubrimientos ni amplía el denominador30. Ninguna run usa el acabado como entrada de combate. El deseo de coleccionarlo sigue siendo una hipótesis humana.

## Casas, no una suma de todas las biografías

Casa, escuela y oficio son ejes distintos. Datos versionados para30 personajes, clasificación A83 conservada. Flamel/Fleur: Beauxbatons; Moody/Kingsley: no se inventa casa. Profesor/Auror describen al personaje, no activan otro pasivo. No se etiqueta moralidad binaria, ascendencia, muggle o animal a quienes no corresponden.

Afinidades existentes se mantienen por compatibilidad y cobertura. Cuatro efectos pequeños de casa, solo para quienes están vivos en esa casa al confirmar; se fijan antes del replay y no desaparecen al caer un compañero:

| Casa | Tres identidades | Cuatro identidades | Renuncia |
|---|---|---|---|
| Gryffindor | +2 daño en primer impacto acertado propio | +3 | Menor valor después de la apertura; un fallo no gasta el bono |
| Slytherin | +1 iniciativa base | +2 | No asegura actuar antes; Tierra sigue modulando iniciativa |
| Hufflepuff | +1PV al comenzar cada turno | +2 | No resucita ni supera máximo; sin daño recibido puede aportar cero |
| Ravenclaw | +1daño desde tercer intento con PM | +2 | No mejora la apertura; no hay ataque si faltan PM |

Gryffindor/Ravenclaw añaden daño plano después del efecto de Pimienta. No inventan hechizos, objetivos, quemaduras o curaciones. El evento `house-activated` registra valor, nivel, miembros y beneficiarios. Curación de casa es un evento `healed` con fuente propia. Engine2 solo en reglas nuevas; entrada legacy sigue Engine1. No aumenta premios por tener una sinergia.

## Cromo Encantado

Elección delegada de ensayo: **1% independiente por apertura**, frente a0,5%/0,1% estudiados. Identidad mantiene exactamente su peso anterior1/29. Probabilidad conjunta por identidad elegible1/2900; Harry starter no se promete como variante obtenible. Mediana69, P90230, P95299 aperturas para la primera variante: colas geométricas, sin pity, no horas humanas ni garantía.

Se escoge1% para que una muestra sea posible durante el objetivo base (probabilidad de al menos una en108 aperturas≈66,2%), conservando excepcionalidad cosmética sin potencia. Precios, energía, botines y rarezas/estrellas no cambian. Tabla y catálogo3 permiten rechazar una consulta obsoleta antes de consumir. Nueva tirada solo tras validar gasto y antes del mismo commit; copia/receipt comparten acabado y versión. Ausencia histórica significa normal.

## Composición y arte

Medallones con cuatro siluetas propias, metal cálido y esmalte; nombres de casas HP o compañías ARCANA fuera del SVG. Mapa: objetos compactos bajo el equipo, solo casas representadas, detalle por toque/teclado. Pacto muestra antes→después; preparación usa el mismo cálculo compartido. Inspector de arena conserva activación del log, sin recomputarla desde supervivientes.

Edición encantada: cartón facetado, filete iridiscente, cuatro remaches estrellados y sello central; un reflejo cruza la superficie una vez. Es un acabado de carta, **no un atuendo o retrato alternativo nuevo**. Fuente editable y procedencia en `design/houses-a85/manifest.json`. No sustituye el acabado de las pinturas ni se llama arte definitivo por superar tests.

Colección distingue copias normales/encantadas, filtro de acabado a demanda y selección de instancia en el folio. Preparación conserva la instancia y muestra su sello, sin llevar equipo al álbum. Libro de probabilidades muestra tasa independiente y conjunta.

## Movimiento y sonido

La apertura conserva caja/sello/tapa/rana/giro. Borde0,96→1 y reflejo local650ms con GSAP en la etiqueta `reveal`, no otro reloj; omitir/reducido/fallo devuelve el mismo resultado estático. No flash global, filtro pesado, otra resolución, contexto gráfico o partículas adicionales. Consultar/reload/swap conserva la protección de historial visual.

Trayectorias sobre el reloj de arena existente: Gryffindor recta; Slytherin curva estrecha; Ravenclaw convergencia cruzada; Hufflepuff arco estable. Solo cambia forma/recorrido del mismo evento confirmado. Perfil ausente conserva trazo anterior. Los sonidos A84 siguen afinidades/eventos reales, voluntarios desde Ajustes; una casa no se convierte en un elemento de daño ni activa audio por sí sola.

## Compatibilidad

Nuevo contenido táctico3 y reglas2 con pertenencias congeladas; campaña1 conserva derechos únicos. El perfil A84 sigue ejecutable exclusivamente como referencia interna de ensayos, sin control HTTP público. Runs activas mantienen snapshot; sin snapshot, fallback legacy excluye casas. Cambiar formación en una run toma pertenencia del snapshot, no del catálogo nuevo. Los datos de adquisición anteriores no se reescriben.
