# A62 · Dirección artística e inventario de recursos

15 octubre 2026. Auditoría experta, sin implementación o generación de nuevos assets. Se preserva el cuento teatral ilustrado de Harry Potter/Diagon Alley y su swap ARCANA. **El problema prioritario no es que falten treinta personajes mejores: falta que determinados objetos comuniquen acción, pertenencia y consecuencia con la misma claridad que transmiten ambientación.** La identificación semántica propuesta necesita sesión humana posterior.

## Método y alcance

Lecturas: AGENTS, PRD 1.0.29, DECISIONS, DESIGN, contratos/informes A58/A59/A60 y contrato A62. Se aplican el modo *redesign-preserve* de Taste y la auditoría de `redesign-existing-projects`; Fantasy aporta jerarquía/estados, sin sustituir los tokens existentes. Taste declara su foco en landings/portfolios y no en interfaces de juego: sus defaults de fuentes, monocromía, instalación de librerías, generación de imágenes o anti-SVG no son apropiados para imponerlos sobre el encargo. No se instalan recursos ni se produce arte con créditos. Lectura del diseño: teatro ilustrado para fans casuales, composición centrada en la acción, materiales de latón/papel/tela y movimiento funcional.

Se abren directamente con el visor los cinco escenarios servidos (Callejón, confitería, arena, taller y bóveda), la hoja de treinta retratos v2, la tira A59 a 256/72/44 px y exports individuales de Dumbledore figura, Moody miniatura, caja cerrada, base, rana, gragea tierra, varita Abedul y fachada Gringotts. Son inspecciones actuales de archivos. Una hoja de contacto permite revisar familia/edad/silueta; no demuestra detalle perfecto de cada máscara o atractivo humano.

El script reproducible [art-inventory.py](evidence/art-inventory.py), ejecutado con Pillow 12.3.0 del venv ya instalado, lee bindings, dimensiones, alfa y hashes sin modificar recursos. [Inventario por rol](asset-inventory.json) y [resumen medido](evidence/art-bindings-summary.json). Los tamaños son bytes de archivo, no descarga inicial ni memoria GPU.

### Qué existe realmente

- 165 bindings en `diagon-alley/assets.json`: 132 propios y 33 referencias explícitas `sourcePack:arcana`.
- 158 rutas y 158 hashes únicos; 5.462.634 bytes al contar cada ruta una vez. No son 165 ilustraciones diferentes.
- Siete pares de alias: cuatro figuras rivales/personajes, `scene.boulevard/scene.passage`, `ui.shop/ui.market`, `fx.halo/fx.portal`.
- 90 exports pintados son tres funciones por 30 personajes: retrato 512×640, figura 342×428 y miniatura 96×120. No son 90 personajes o poses.
- Los seis nodos actuales enlazan `art/nodes-a59/*.svg`, no los nodos A56 anteriores.
- Los documentos DESIGN/A59 conservan 126 propios/39 compartidos: ese conteo es antecedente, **no coincide con el binding actual**. No se corrigen documentos históricos en esta fase.
- No se detecta discrepancia entre dimensiones/alfa declarado y raster efectivo. Alfa verdadero incluye transparencias de viñeta incluso en escenas; no garantiza separación en capas.
- `character.dumbledore.historical` sigue en el manifest. No se ha encontrado un consumidor que lo seleccione como retrato activo: disponible en paquete no significa visible en el juego.

## Dirección que conservar

| Familia | Observación actual | Decisión recomendada |
|---|---|---|
|Callejón|Perspectiva profunda, ventanas ámbar, sombras violetas, suelo mojado y arquitectura inclinada; escenario narrativo fuerte.|Conservar. Tratar la ruta como una capa de juego sobre la calle, con su propia jerarquía de contraste; no añadir vídeo o regenerar fondo para cada run.|
|Interiores|Confitería, taller, bóveda y arena comparten verdes oscuros, ramas, lámparas y piedra/madera.|Conservar familia pictórica. Diferenciar funciones con composición/objetos, no otra técnica artística.|
|Personajes|Edades, indumentaria y siluetas diferenciadas, volumen y luz lateral cálida; familia v2 sustituye al vector provisional.|Conservar lote. Revisar cada caso donde una UI recorte cabeza, reduzca figura a avatar o esconda condición. No producir otro lote como remedio de layout.|
|Caja/rana|Caja geométrica por piezas y rana pintada tienen objetos reconocibles, material chocolate/oro/violeta.|Conservar arquitectura de apertura. Reducir el contraste de acabado de la caja mediante iluminación/impresión si la secuencia actual lo justifica; no afirmar rig en la rana.|
|Objetos pequeños|SVG de navegación/nodos usa simplificación y gradientes materiales.|Conservar función vectorial. Una iconografía simplificada es compatible con pintura detallada; exigir la misma pincelada a 44 px empeoraría lectura.|
|Rarezas|Emblema, nombre y estrellas, más paleta y grabado en revelación.|Conservar redundancia semántica. El rango no debe confundirse con potencia.|

Paleta ya activa: fondo #101b2c, superficie #172539, tinta #fff0d0, oro #e0b75d, papel #ead7ac, foco #a7e8ed. Cinzel local para títulos, system-ui funcional, cifras tabulares. Es vocabulario elegido, no colores que deban reemplazarse por un preset de Taste. Acentos de nodos/rareza pueden variar porque expresan categorías; mantener superficies y estados consistentes. El oro se reserva para interacción/selección/coste importante, no para iluminar todos los elementos a la vez.

## Problemas de arte y comunicación priorizados

### AR01 · Una hoja repetida no expresa actualizar energía · P1

**Evidencia de código:** `PlayerHud.tsx:31–38` muestra hoja/cifra/barra de energía; `PlayerHud.tsx:61–68` reutiliza la misma hoja en un botón de refresco. La etiqueta accesible sí nombra refrescar. **Interpretación:** visualmente parece otra unidad o recurso, no una acción distinta. No se declara confusión humana observada.

**Propuesta:** integrar una flecha circular de latón alrededor de la hoja para la acción de sincronización, o convertir el indicador entero en consulta de energía con refresco dentro. Conservar cifra/máximo y coste de combate; no ocultar la regeneración tras un icono sin nombre. Nombre localizado y tooltip por foco/toque; no animación giratoria permanente. **Comprobación futura:** indicador y acción diferenciados en ES/EN a 390 px y 1280 px, teclado/foco, estado actualizando/error/reducido y cero gasto por consulta.

### AR02 · El reloj de la carta no basta para explicar un aliado prestado · P1

**Evidencia:** `art/nodes-a59/pact.svg:13–23`: retrato completo y pequeño reloj inferior (diámetro 34 en viewBox 256). El reloj mide ≈5,3 px si el arte se sirve a 40 px; su forma interior tiene aún menos píxeles. `assets.json:44–55` lo denomina correctamente aliado temporal. **Interpretación:** la carta comunica personaje/colección antes que préstamo para esta expedición.

**Propuesta:** conservar retrato como protagonista; sacar un reloj simple fuera del marco, como estado de UI mayor, compartido con puesto temporal y resultado de reclutamiento. En el primer pacto mostrar una sola línea “Solo esta expedición”/“This expedition only”, luego a demanda. No convertirlo en personaje poseído, no simular que una imagen cambia una regla. **Comprobación futura:** el marcador, el popup y el puesto llevan el mismo sello legible a ≥12 px; descripción accesible equivalente; origen temporal sigue claro en reducido y desaturado. La comprensión real se pregunta en sesión posterior sin sugerir la respuesta.

### AR03 · Sobre de Encuentro y sobre de Misiones prometen acciones próximas · P1

**Evidencia:** `art/nodes-a59/encounter.svg:13–20` usa sobre sellado; `art/props/letter.svg` representa también sobre/carta sellada. El Encuentro es un riesgo/beneficio estocástico; Misiones es consulta de objetivos. **Interpretación:** las dos funciones pueden parecer correspondencia/encargos, especialmente al reducirse. El símbolo serpenteante del sello de Encuentro es demasiado pequeño para cargar toda la diferencia.

**Propuesta:** conservar la carta como Misiones; para Encuentro, bolsa abierta o reliquia velada con estrella partida y pequeño signo de incertidumbre, dentro de su medallón azul y con el mismo asset en popup/resultado. No recomendar dados genéricos ajenos al mundo o una ilustración hiperdetallada. **Comprobación futura:** seis nodos en 44/56/72 px sin texto y navegación contigua; revisión humana de agrupación y elección sin ayuda. Mantener nombre/ayuda y señal explícita de riesgo; el asset no comunica por sí solo probabilidades exactas.

### AR04 · Jefe genérico y rostro concreto necesitan continuidad · P2

**Evidencia:** `assets.json:72–83` selecciona máscara de amenaza para `node.boss`; `rival.boss.figure` es alias de figura Voldemort. **Interpretación:** ambos son coherentes temáticamente, pero el mapa no anticipa a quién se enfrentará el equipo. **Propuesta:** medallón de amenaza conservado más silueta/miniatura del jefe real en el estado próximo; usarla en preparación/resultado. No cambiar todos los jefes futuros a la misma máscara. **Aceptación:** boss ID↔retrato↔rival coherentes; no hace falta leer nombre para reconocer continuidad, nombre accesible siempre disponible.

### AR05 · El fondo de mapa tiene muchos focos, no faltan más decoraciones · P1 de composición

**Evidencia de archivo:** `art/scene/diagon-alley.webp`, 1536×1024, 445.688 bytes; ventanas amarillas y cartel grande ocupan el área central/derecha. A60 ya añade medallones opacos/doble marco y rutas alcanzables (`map-a60.css:37–99`). **Interpretación:** el siguiente paso no es añadir halos, hojas o partículas a todos los nodos. **Propuesta:** tratamiento local de luminosidad por zona de ruta o una “calle de juego” tranquila; mantener detalle en bordes y profundidad. La composición final se decide en las capturas actuales, no solo en la pintura original. **Aceptación:** todos los estados se reconocen en esquina clara/oscura, sin esconder información, sin scroll ordinario y con ruta como primer plano visual.

## Inventario priorizado de producción y aceptación

Todas las rutas bajo `src/arcana/presentation/content-packs/`, salvo las fuentes de componentes indicadas. El JSON incluye los 165 roles con dimensiones, fuentes, función, política y aceptación; esta tabla agrupa familias para tomar decisiones sin fingir 165 encargos independientes.

| Prioridad / IDs | Recurso activo | Conservar, retocar o sustituir | Especificación si se produce | Aceptación de arte en contexto |
|---|---|---|---|---|
|P1 `ui.energy-refresh` propuesto|`PlayerHud.tsx:61–68` +`arcana/art/icons/currency-essence.svg`|Retocar acción, conservar indicador.|SVG 64×64/viewBox, alpha, flecha con grosor óptico legible a 20 px, pivot.5/.5; reposo/actualizando/error; fuente SVG y CSS. Sin texto incrustado.|No parece otro saldo; tooltip y nombre ES/EN; coste no se mueve ni se tapa.|
|P1 `node.pact`, `ui.temporary`|`diagon-alley/art/nodes-a59/pact.svg`, `arcana/art/ui/temporary.svg`|Retocar sello, conservar familia retrato.|Nodo 256² alpha, 12% margen; sello 64² para 12–20 px efectivos; variantes de estado en DOM/CSS, no un PNG por combinación.|Reloj y borde temporal no requieren leer microdetalle del retrato.|
|P1 `node.encounter`|`diagon-alley/art/nodes-a59/encounter.svg`|Sustituir metáfora, conservar slot y color del medallón.|SVG 256² alpha con silueta única: objeto velado/bolsa; dibujo de 3 planos, sin rótulo; fuente vectorial editable.|No duplica la silueta Misiones; coincide en mapa/evento/resultado.|
|P1 `scene.passage`/`scene.boulevard`|`diagon-alley/art/scene/diagon-alley.webp`|Conservar pintura; retocar tratamiento/crop en UI.|Maestro existente 1536×1024; si hace falta variante 9:16 derivada independiente con focal-point documentado. No escalado deformado. Archivo de composición separado.|Ruta domina sin oscurecer todo el mundo o cubrir el fondo con un panel opaco enorme.|
|P2 seis `node.*`|`diagon-alley/art/nodes-a59/*.svg`|Conservar cuatro siluetas; retocar peso óptico uniforme.|256² alpha; caja óptica 72%±8%, latón/papel/cobre/tinta; 44/56/72 px de prueba; estados en medallón.|Duelo/refugio/cofre/pacto/encuentro/jefe distinguidos en escala de grises y sobre paisaje.|
|P2 `node.boss`/`rival.boss.figure`|Máscara SVG +figura `veil-walker`|Retocar continuidad de identidad.|Miniatura existente 96×120, silueta alpha y marco estado; no otro personaje nuevo. Preparar versión estatua/silueta si aún no descubierto.|Mismo rival en anticipación, arena y cierre; no usar icono genérico como sustituto del retrato en todo.|
|P2 `character.*`30 × 3|`diagon-alley/art/character-illustrated-v2/*/*.webp`|Conservar, corrección por caso probado.|Retrato 512×640 sin alpha; figura 342×428 alpha contain; miniatura 96×120 con alfa y crop facial. Maestros PNG 768×1024, máscaras/crops registrados. No rig.|A 44 px se reconoce rostro/accesorio, en arena figura no flota ni corta cabeza; mismo personaje entre vistas.|
|P2 `toad.box/base/lid/seal/interior`|`diagon-alley/art/frog/*.webp`|Conservar piezas; posible retoque material posterior.|768² alpha, misma cámara/pivotes/canvas; modelo Blender editable y pintura de textura separada. Caja cerrada y piezas encajan sin salto.|Comparar fotogramas antes/tras abrir; no cambiar tamaño/ángulo del envase entre fase cerrada y abierta.|
|P2 `toad.subject`|`diagon-alley/art/frog/chocolate-frog.webp`|Conservar; no producir rig por necesidad de feedback.|1024×683 alpha, recorte proporcional; si futuro rig, separar ojos/cuerpo/patas con pivotes y fuente nueva declarada.|Aterrizaje y salida mantienen peso/sombra y no tapan carta; omisión/reducido conserva resultado.|
|P2 `beans.jar/packet`, 4 `product.bean-*`|Tarro/bolsa Diagon y cuatro grageas compartidas ARCANA|Conservar arte, mejorar cadena de estados.|Tarro 512² alpha; bolsa SVG 512²; sabores 640² alpha; asignado/activado/descubierto como UI con sello propio.|Comprar≠probar; sabor desconocido no parece apagado/deshabilitado sin explicación a demanda.|
|P2 `shopfront.*`|`diagon-alley/art/storefronts-a59/*.webp`|Conservar tres pinturas.|430×574, ratio 215:287, alpha/recorte según manifest; rótulos HTML sobre área reservada. Maestros PNG 768×1024.|Puerta/vecina visibles móvil; mismo destino por imagen y rótulo; fachada no sustituye interior sin transición.|
|P2 `scene.workshop/vault/arena`|`arcana/art/scene/{workshop,vault,arena}.webp`|Conservar coherencia actual; diferenciar función con objetos.|1280×854 alfa viñeta, raster plano; fuentes y focal-point existentes. Capas nuevas solo para transición realmente necesaria.|El taller muestra piezas sobre mesa, bóveda recompensa/cerradura y arena unidades/canal; no tres pantallas idénticas con título distinto.|
|P2 `product.wand-*/core-*/broom-*`|`arcana/art/product/*.webp`|Conservar familias; retocar estado/equipo actual.|640² alpha, orientación diagonal común, 10% margen; core como objeto complementario no segunda varita; variantes seleccionado/equipado en UI.|Propiedad/equipado/mejora posible se distinguen sin interpretar solo color o una lista de nombres.|
|P2 `rarity.*`, `card.frame/back`|Emblemas ARCANA + marcos Diagon|Conservar, jerarquizar.|Rangos 256², marco 512×640; hueco de arte documentado, no texto raster. Estrellas DOM y leyenda ES/EN.|Cuatro rangos diferenciados también sin aura y con efecto omitido; rostro no queda tapado por marco.|
|P2 `currency.crowns`, `product.gold-key`|GaleónSVG 256² + llave WebP 640²|Conservar.|Estados saldo 0/coste visible/insuficiente; sin descuentos nuevos; siluetas 20/32/64 px, numeral separado.|Moneda/llave/energía nunca se sustituyen entre sí o adquieren valor distinto por swap.|
|P2 `ui.map/collection/shop/missions/team/settings`|`diagon-alley/art/props/*.svg`|Conservar familia; ajustar significado puntual.|SVG 512², misma dirección de luz/sombra; 44 px mínimo objetivo de control; nombre corto HTML, foco/activo/deshabilitado.|No todos los emblemas parecen sellos equivalentes; acción principal se distingue de navegación y consulta.|
|P3 `pwa.icon.192/512`|`arcana/art/pwa/icon/*.png`|Retocar identidad instalada, solo si siguiente implementación lo incluye.|192²/512²; máscara OS zona segura; fuente vectorial/raster maestra y export PNG optimizado; no cambiar por swap runtime.|Instalación Diagon usa identidad coherente con default del build; no afirmar que se renombra instalación existente.|
|P3 `fx.*` y SVG `RevealTheatre`|Props FX + `RevealTheatre.tsx`|Conservar límites y revisar redundancia.|SVG 600×520 / demás roles según manifest; capas decorativas alpha; sin texto; normal/reducido/omitido.|Efecto refuerza la carta y no oculta recompensa/CTA; no ticker permanente o GL nuevo.|
|P3 `character.dumbledore.historical` y FX alias|Binding histórico/alias|Retirar del manifest en limpieza posterior si no hay uso, no de archivos históricos.|Inventario de consumidores/compatibilidad antes; no nuevo asset.|No contar alias/recurso no alcanzado como contenido nuevo producido.|

## Fuentes, edición y licencias

Personajes: [producción v2](../../../design/diagon-alley/illustrated-v2/README.md), `selected-attempts.json`, `runtime-manifest.json`, `export-crops.json`, máscaras y retoque SVG de cicatriz; se conservan intentos y hashes. Modelo/pipeline local existente registrado, no usado para generar en A62. Marcos/props vectoriales son editables; los retratos PNG no son documentos de pintura por capas. Caja con fuente Blender separada; la rana es un sprite recortado con transformaciones de presentación.

Nodos/fachadas: [fuentes A59](../../../design/diagon-alley/annotations-a59/README.md) y `storefronts/production-manifest.json`. La propia escena/fachada generada no acredita permiso de franquicia, publicación o aprobación humana. A62 no importa recursos del referente. `sourcePack` declara recursos compartidos: no tiene sentido reemplazarlos únicamente por venir de ARCANA si su material/color es coherente.

Vectores/CSS A60 fuera de assets.json: [manifest A60](../pokelike-2026-10-15/asset-manifest.json) enlaza `RevealTheatre.tsx`, `ShopBook.tsx`, superficies de mapa/evento. El inventario JSON enumera bindings; no afirma que incluya cada regla CSS/elemento decorativo inline.

## Reglas de producción propuestas

1. Revisar primero una muestra del objeto a su tamaño real, con fondo, HUD y foco; solo después ampliar la familia. Nada de aprobar un contacto grande y descubrir ilegibilidad a 44 px al final.
2. Separar pintura, sombra de contacto, estado semántico, numeral y foco. El asset no determina coste, rango, propiedad o resultado.
3. Iluminación base ámbar arriba/lateral, sombra índigo y materiales limitados latón/papel/madera/tela; permitir el verde/violeta como categoría y magia, sin rim light de todas las paletas en cada objeto.
4. Objetos “jugables” con silueta dominante; ornamento fino va en arte grande. A 44 px una silueta y 1 rasgo distintivo; a 72 px hasta 3 detalles; carta grande admite pintura.
5. Sin texto incrustado. Nombres/coste/cifras/errores breves DOM. ES/EN pueden expandir rótulos, no producir dos imágenes por idioma.
6. No generar arte en runtime o cada apertura; usar exports cacheables y hashes/pivotes/máscaras versionados. Arte ausente conserva acción y semántica.

## Comprobaciones futuras y límites

Revisar cada familia en ES/EN a 1280×900, 911×1079, 390×844 y 320×568; controles 44 px cómodos y texto 200% accesible. Sombreros/coronillas/barbas enteros, lectura de objetos, superficies quietas detrás de mensajes, foco que no se confunda con rareza/selección. Probar hover/foco/toque y estados sin animación. Perfil de rendimiento desde click real incluyendo carga/decode, no solo loop ya activo. No afirmar memoria móvil por el sumatorio de bytes.

No se recomienda producir nuevas regiones en este incremento: primero un recorrido completo con familias coherentes y decisiones claras. La validación estética y la identificación sin ayuda necesitan observación humana posterior. Este documento no declara assets “definitivos” por estar integrados.

## Contraste con pantallas actuales A62

Las imágenes siguientes son capturas nuevas del recorrido técnico del coordinador, no usuarios ni renders de las propuestas. Inspección directa mediante `view_image`:

| Captura | Lo comprobado visualmente | Implicación |
|---|---|---|
|[Entrada 1280](evidence/captures/es-01-entry-1280.png)|El fondo y título ya transmiten el mundo ilustrado; CTA Entrar visible, sin el antiguo bloque azul vacío.|Conservar entrada. No justificar otro vídeo por una anotación anterior ya resuelta.|
|[Preparación 1280](evidence/captures/es-03-preparation-1280.png)|Cinco puestos vacíos, 0/5 y solo Harry disponible, con botón Entrar deshabilitado.|El arte del personaje es suficiente; comunicar incorporación inicial y límite/capacidad sin sugerir obligación de llenar cinco. No conceder otras copias como corrección visual.|
|[Mapa 390](evidence/captures/es-06-map-390.png) y[865](evidence/captures/es-06-map-865.png)|Mapa completo, medallones contrastados y primer destino doblemente marcado; inicio con retrato separado. Nodos lejanos conservan notable peso visual.|A60 resolvió la pérdida de iconos. Ajustar prioridad de próximos frente a lejanos; no rehacer todos los nodos ni decir que siguen siendo invisibles.|
|[Callejón 1280](evidence/captures/es-08-alley-1280.png)|Tres fachadas bien pintadas, rótulos externos; aparecen como tres cuadros frontales sobre la perspectiva de otra calle.|P2: plantear escenario de selección como diorama frontal con suelo común o integración de perspectiva. La presentación actual se puede usar mientras se prioriza el combate.|
|[Confitería 1280](evidence/captures/es-10-sweetshop-1280.png)|Productos, precios y acción única claros; caja/tarro flotan sobre peanas, mostrador real más abajo.|Ajustar escala/línea de apoyo/sombras para que los productos ocupen la mesa. No más cromos ni props decorativos necesarios para ello.|
|[Revelación 390](evidence/captures/es-14-reveal-390.png)|Fleur protagonista, marco completo, corona/nombre/estrellas y acciones por objeto. Magia integrada detrás, no por encima del rostro.|Conservar retrato y estructura de rango. Una captura estática no acredita la secuencia completa o su rendimiento; ver informe de movimiento.|
|[Pacto 1280](evidence/captures/es-node-pact-1280.png)|Retrato grande, reloj, nombre y “Aliado temporal”; Reclutar claro y Pasar inactivo al inicio.|Popup ya supera la anotación antigua. AR02 afecta anticipación y continuidad temporal, no ausencia total de explicación en modal.|
|[Cofre 1280](evidence/captures/es-node-chest-1280.png)|Cofre, monedas/grageas y acción Abrir cofre jerarquizados.|Conservar. Si aparece resultado de obtención, reforzar traslado al inventario en vez de añadir otra confirmación.|
|[Arena 390](evidence/captures/es-arena-duel-early-390.png)|Mucho texto previo, seis paneles altos con figuras pequeñas y navegación atravesando primera fila; el conjunto se extiende a más de una pantalla.|**AR06, P1: recomponer arena antes de producir más personajes.** Llevar condición clave al escenario y ficha a demanda.|
|[Bóveda 1280](evidence/captures/es-09-vault-empty-1280.png)|Puerta circular CSS lisa y enorme frente a otra puerta pintada a la derecha; coste 1 y posesión×0 separados.|**AR07, P1: una sola puerta protagonista del mismo acabado.** Tiene mayor impacto de unidad de arte que otro lote de retratos.|
|[Álbum 1280](evidence/captures/es-15-album-1280.png)|Fondo termina en 900 px y contenido continúa sobre superficie plana; navegación se superpone con etiquetas de cartas en esta posición de captura.|**AR08, P1 de composición:** revisar extensión de escenario, reserva de navegación y primer plano de cartas. Separar defecto de layout del recurso pintado.|

### AR06 · Arena compacta sobre escenario · P1

Evidencia → captura actual de arena 390 y `BattlePanel.tsx:306–410`/estilos de peanas: bustos en una larga lista de fichas, párrafo sobre persistencia y estadísticas permanentes. Problema → el foco cae sobre explicación y tablas de unidades, no sobre la acción entre personajes. Propuesta → dos bandos de figuras con PV visible, identidad y condición; detalles de PM/equipo/afinidad por inspector, controles de replay en una banda y registro equivalente consultable. Resultado esperado → leer quién actúa, recibe daño y cae, manteniendo el contexto de ambos bandos. Comprobación futura → 3–5 unidades por bando, ES/EN, 390×844/1280×900, pausa/2×/omisión/reducido, actores repetidos y retorno de foco; ningún cambio del BattleLog o resultado guardado. La maqueta de 3vs3 no demuestra que 5vs5 quepa: requiere validación propia posterior.

[Propuesta visual anotada de arena](proposals/art-arena.png) ([fuente SVG](proposals/art-arena.svg)). Las cifras/unidades son composición ilustrativa, no resultado de un combate. La propia captura que se compara sí procede del recorrido técnico actual.

### AR07 · Una única cerradura y un único material · P1

Evidencia → captura actual de bóveda y `CommercePanel.tsx:219–250`, `shop-journey.css:502–645`. Problema → la rueda circular CSS intenta ser un objeto acabado junto a la pintura detallada de otra puerta, con dos centros visuales y escalas incompatibles. Propuesta → reencuadrar la puerta pintada del escenario existente como foco e incorporar un hotspot semántico en la cerradura; si necesita apertura física futura, producir una única puerta alpha con ese mismo material y pivote. Coste y llave poseída juntos en la peana, destino al jefe cuando falta. Resultado esperado → lugar reconocible y una acción inequívoca, sin otra pantalla de botones. Comprobación futura → 0/1/múltiples llaves, información y cancelación sin consumo, misma transacción al abrir, reducido, fallo de imagen y ambos idiomas. No se promete que clicar un hotspot equivalga a animar una puerta ya riggeada.

[Propuesta visual anotada de bóveda](proposals/art-vault.png) ([fuente SVG](proposals/art-vault.svg)), reutiliza el bitmap servido, no un render de producción nuevo.

Las tres propuestas conservan arte actual y separan texto funcional. Son estudios estáticos rotulados; no están importados por la aplicación, no se ha modificado precio/probabilidad o ninguna partida. Fuente reproducible: [art-proposals.py](evidence/art-proposals.py).


### Cierre, forja y segundo idioma

Se inspeccionan además [mapa EN 390](evidence/captures/en-06-map-390.png), [preparación EN 1280](evidence/captures/en-03-preparation-1280.png), [forja EN 1280](evidence/captures/en-25-workshop-1280.png), [botín bóveda EN 390](evidence/captures/en-24-vault-result-390.png), [cierre de jefe ES 1280](evidence/captures/es-20-boss-receipt-1280.png) y [misiones tras jefe ES 390](evidence/captures/es-21-missions-after-boss-390.png). Los assets mantienen identidad entre idiomas; las rutas concretas difieren porque son expediciones distintas, no porque traducir regenere un grafo.

**AR09, P1 de cierre:** tras el jefe, la captura muestra preparación vacía 0/5 de otra expedición debajo de un panel derecho de victoria/llave/desbloqueo. La jerarquía principal invita a preparar equipo antes de dar protagonismo al cierre. Propuesta: escena única de recompensa con llave y acceso directo a Gringotts; siguiente expedición solo después de una acción explícita. El Bosque permanece futuro, sin fingir otra ruta. El arte de llave/cofre existe y basta; no es un encargo de fondo regional nuevo.

En forja las maderas y núcleos están diferenciados por forma/material y nombres, pero el producto final aparece flotando lejos de la mesa. Mejorar línea de apoyo, sombra de contacto y transición de ensamblaje antes de producir otras nueve pinturas de varitas. En botín móvil conviven puerta cerrada/sin llave y recibo de apertura confirmado: definir qué objeto es pasado confirmado y qué acción vuelve a estar disponible. No eliminar el recibo o esconder el coste para reducir texto.

El inventario se reproduce ejecutando primero `art-inventory.py` y después `art-review.py`, ambos dentro de esta carpeta. El segundo añade las interpretaciones manuales, evidencia de capturas y tres elementos UI inline/propuestos fuera de los 165 bindings; no se confunden con nuevos assets producidos.


[Propuesta anotada de cierre tras jefe](proposals/art-boss-closure.png) ([fuente SVG](proposals/art-boss-closure.svg)): compara el estado actual con llave protagonista, Gringotts como destino principal, rana como acción secundaria y otra expedición como elección posterior. Conserva los valores visibles del receipt de referencia (+50, 1 llave, 1 rana); no entrega nada, no cambia probabilidades y no inicia automáticamente una run. Fuente reproducible: [art-boss-proposal.py](evidence/art-boss-proposal.py). Las propuestas de arena/bóveda/cierre forman un conjunto de composición, no tres nuevos sistemas.


### Inspección de las propuestas renderizadas

Los tres PNG fueron renderizados por el coordinador con Playwright desde un wrapper HTML, después de liberar las mediciones del juego; se inspeccionan directamente con `view_image`. Arena 1560×1120, bóveda 1600×1060 y cierre 1600×1090. No se observa texto cortado, imágenes ausentes o anotaciones superpuestas. La propuesta de bóveda conserva un encuadre deliberadamente parcial de la puerta original: especifica el foco y la eliminación de la esfera CSS, no un nuevo fondo terminado ni una apertura animada. La arena muestra 3vs3 y requiere resolver 5vs5 como aceptación explícita de implementación. El cierre mantiene llave/rana/monedas y los tres niveles de acción sin superponer la preparación vacía. Los nombres y cifras de las maquetas son ilustrativos o proceden del receipt rotulado; no son nuevas concesiones.

Un timeout previo al intentar capturar SVG como documento principal fue una limitación del montaje de inspección; el wrapper renderizó correctamente los mismos SVG sin cambiarlos. No se atribuye al juego. Evidencia del render: `evidence/render-proposals-wrapper.txt`.
