# A87 · Guion de movimiento propuesto

Fuentes preparadas; ningún consumidor de juego nuevo implementado todavía. Los tiempos son objetivos relativos al evento del relojA69, no medidas de una animación ya integrada. Dos poses pintadas por criatura; no rig corporal. No audio automático.

| Momento | Anticipación → acción → reacción → cierre | Recursos / límite |
|---|---|---|
| Elegir vínculo | El medallón seleccionado se asienta0,98→1en140–180ms; la comparación actualiza contribuyentes/efecto real; confirmar reutiliza receipt/feedback existente | EmblemasSVG; borrador no sana, equipa o guarda por consultar. Reducido estático |
| Tercer contribuyente en Pacto | Comparación anuncia el vínculo efectivo que aparecería; tras commit el sello cambia aI, sin pantalla extra o contador de premio | Auto resuelve por formación antes de confirmar; elección manual conserva renuncia. Sin alerta de victoria futura |
| Fénix | Recoge postura brevemente; cambia a pose de ala elevada/llamada; trazo de pluma dorada hacia el objetivo; impacto registrado y vuelta a reposo | Dos bitmaps, trazo localizado; ningún renacer/curación inventado |
| Hipogrifo | Tensión leve de hombros; pose con garra levantada/beak abierto; dos trazos cortos de zarpazo; reacción del objetivo y retorno | Cuatro extremidades/dos alas preservadas; no desplazamiento largo que tape otro combatiente |
| Unicornio | Cabeza se prepara; pose de cuello bajo/cuerno al frente; arco perla corto, contacto y asentamiento | Dos bitmaps alineados al suelo; no inmortalidad, área o nuevo rayo de regla |
| Dragón | Cuello toma impulso; boca abierta con luz interna; cono estrecho/trazo de aliento a un único objetivo; retorno | El efecto no está pintado en el master, no añade área/quemadura distinta de la afinidad existente |
| AyudaOrden | Identificar ayudante y receptor del evento; línea/cintila corta si cabe sin tapar PV; pulso de curación existente en el receptor; +PV real y cierre | `healed.actorId`receptor, `healerId`origen; nunca atribuir curación al aliado equivocado |
| RemateMortífagos | Perfil de lanzamiento sobrio/curva oscura; énfasis de contacto solo si el registro confirma bono; delta final guardada | No fórmula de daño o umbral duplicada en elrenderer; no flash de pantalla o temblor |
| ProtecciónCriaturas | En contacto, arco/pata breve junto al receptor cuando el evento registra cantidad bloqueada; deltaHPfinal y cierre | Valor bruto amortiguado, sin barra de escudo, 0/1o carga perpetua. No reducir daño de nuevo en replay |
| Abrir criatura | Secuencia actual caja/sello/tapa/rana/carta; nueva ilustración/identidad al resultado; acabado encantado conserva reflexión650ms si existe | Resultado ya confirmado; normal/repetido/nuevo/encantado no vuelve a sortear. No nueva rareza o espera obligatoria |

## Reloj y poses

Mantener anticipación0–0,18; vuelo/acción0,18–0,78; contacto/asentamiento hasta1según el evento existente. Cambio de textura a la posecastdurante acción, retorno afigureal cerrar. Una misma escala de export y contacto elegido por artista evitan el encogimiento/teletransporte de pies; falta verificar que la variación visible sea≤5pxa escala móvil. Sin reloj independiente, setTimeouto AnimatedSpriteen bucle.

Preferir una sola figuraSprite con intercambio de textura ya preparada frente a añadir otroSpritepor unidad para una mezcla ornamental. Cargar únicamente poses de criaturas presentes, junto a la preparación gráfica actual; registrar su coste desde la acción. Si falta la posecast, conservarfigure. No retraso artificial o nueva carga/generación durante el gesto.

Máximo propuesto: una acción en reproducción, hasta3trazos locales reutilizandoGraphicsy4vocesSFXA84; ninguna partícula indefinida o filtro nuevo. Cuatro texturascast342×428adicionales como techo cuando estén presentes las cuatro identidades, no todas las del catálogo al arrancar. DimensionesRGBA son estimación, no memoriaGPUresidente.

Pausa/2x/ocultación/inspector/omisión conservan el reloj y el log; no repetir sonido al cambiar idioma/pack. Reducido/fallo ofrecen resultado estático y registro equivalentes. Sonido voluntario independientemente de reducido, mismo ajusteA84. No seguir animando un actor desmontado.

## Sonido

Una voz de lanzamiento por acción, seleccionada por perfil de criatura o vínculo efectivo, con fallback a afinidad actual. No superponer especie+afiliación+casa+afinidad por cada disparo. Impacto/fallo/curación existentes continúan. Los7cues nuevos son finitos220–340ms, picos numéricos<0,34, sin grabaciones/samplesajenos o música nueva. Falta reproducción real en navegador, lifecycle/errores y escucha humana/física; los números no validan calidad percibida.

## Perfiles y prioridad de lectura

Prioridad propuesta de **una sola identidad de lanzamiento**: especie si el actor es criatura; vínculo efectivo si ese actor contribuye; casa confirmada si existe; afinidad como fallback. No sumar cuatro proyectiles o voces. Un aliado no contribuyente que recibe guardia conserva su lanzamiento ordinario.

| Perfil | Forma/material | Contacto | Coste de ensayo |
|---|---|---|---|
| Orden | Cintila marfil/oro con dos extremos como alas, curva suave | Pulso cálido finito, curación solo con eventohealed real | Hasta2trazosGraphics, sin filtro |
| Mortífagos | Trazo jade oscuro, quiebre angular breve; silueta de máscara solo como emblemaUI | Énfasis de remate únicamente conbono registrado | Un trazo+punta, no oscuridad de pantalla |
| Criaturas | Dos trazos bronce/hoja, lectura física corta | Arco local de guardia sobre receptor si hay cantidadguarded | Hasta3trazos reutilizados |
| Fénix | Pluma ámbar/dorada, ala de posecast elevada | Chispa pequeña, sin resurrección o curación supuesta | Un proyectil y2trazos |
| Hipogrifo | Zarpazo doble marfil/cobre | Dos marcas cortas y retorno al reposo |2trazos, sin moverlo por toda la arena |
| Unicornio | Línea perla con arco fino | Contacto claro y limitado; cuerno visible en posecast | Un proyectil/arco |
| Dragón | Aliento estrecho verde/oro desde mandíbula | Contacto a un objetivo, quemadura solo si el log existente la confirma | ConoGraphic finito, no partículas libres |

Todos son lenguaje visual de hechos del log, no ataques o habilidades nuevas. No inferir una afinidad por el color de la criatura: el inspector mantiene la afinidad real y su símbolo. El reverso del emblema o la intensidad no implica rareza distinta.
