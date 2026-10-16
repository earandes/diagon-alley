# A62 · Qué tomar de PokéLike y qué conservar

15 octubre 2026. Fuente de esta comparación: **observación técnica A60 del 15 octubre 2026**, [POKELIKE-ANALYSIS.md](../pokelike-2026-10-15/POKELIKE-ANALYSIS.md), de [PokéLike v3.4.1](https://pokelike.xyz/) en Chrome y navegador integrado. En A62 no se ha vuelto a jugar el referente ni se presenta la visita anterior como evidencia actual de otra versión. La comparación de nuestra aplicación sí se contrasta con el código vigente y las capturas actuales del coordinador.

Se recorrió inicio→Story / Classic / Kanto→inicial→captura→combates→objetos→centro→preparación→jefe→derrota→menú. Se inspeccionaron tienda/ayudas/logros. No se ganaron jefes, jugaron otras regiones/modos, compraron huevos o canjearon duplicados. Las reglas mostradas son evidencia de comunicación, no prueba de su ejecución/azar/persistencia.

## Matriz de transferencia

| Sistema | Evidencia del referente A60 | Nuestro estado comprobado por código | Adaptar | Conservar / no encaja | Nueva regla o pendiente |
|---|---|---|---|---|---|
| Selección inicial | Tres iniciales, elegir 1; varios pasos previos modo/región/personaje | Kit 1 aprendiz; elegir copias poseídas y 1–5 para explorar | Decisión inicial concreta; selección visual y una acción principal | No selector gratuito de todo el catálogo; no meter cuatro pantallas previas para una región | Iniciales alternativos requerirían regla/kit nuevos |
| Mapa | Origen ✓ no interactivo, bifurcación legible, futuras opciones visibles | Inicio estático fuera del grafo y medallones por estado A60; grafo variable | Hacer legibles consecuencias de próximas ramas, ruta completada y objetivo | Fondo ilustrado regional y mapa central; no franja estrecha idéntica al referente | Mejoras de lectura sin balance; amenazas/ofertas distintas sí necesitan contenido |
| Reclutamiento | Tres candidatos y elección directa, huir | Un candidato por Pacto, mismo perfil; directo si hay espacio | Elegir sobre el personaje, no doble confirmación genérica | Temporal distinto de propiedad permanente | Varias ofertas y descarte se guardan/versionan; no volver a sortear al abrir/cerrar |
| Combate | Auto empieza en nodo ordinario; vuelve al mapa; gana niveles | Auto calculado en servidor, reproducción separada, no XP | Flujo breve, preparación útil y consecuencia evidente | Autoridad/receipt,3–5 miembros, controles de replay; no menú de movimientos falso | Entrada directa solo si coste/riesgo ya se comunican; XP pendiente |
| Objetos | Tres ofertas, equipar o guardar en bolsa visible | Varitas/escobas por instancia, grageas asignadas antes combate | Que el objeto señale portador o lugar real; guardado no puede ser invisible | Reusar inventario y equipo, sin otra bolsa/sistema duplicado | Recompensa de elegir objetos necesitaría tabla/contrato nuevo |
| Curación | Centro cura completa instantáneamente | Refugio elige 40% PV/PM, PV revive/PM solo en pie | Feedback directo y antes/después | Conservar coste de oportunidad PV/PM | Copiar curación completa cambia balance, no es una mejora visual |
| Jefe | Preparar orden, inspeccionar stats/bolsa, FIGHT | Tres rivales más fuertes; formación/gear/grageas antes de 5 energía | Acción principal clara y amenaza contextual | No confundir cambios de playback con decisiones tácticas | Nuestro motor usa primer rival vivo como objetivo; cambios de orden/IA requieren comprobar reglas reales |
| Derrota | Game Over con equipo final, repetir/menú | Run lost/draw, colección permanece, permite nueva run | Enseñar qué se conserva y una siguiente decisión | Sin reinicio de colección o compensación inventada | No se atribuye el+250 observado al perder: causa no aislada |
| Colección | Dex/metas persistentes y modos |30 identidades,29 candidatos sorteables, copias, sabores, equipo | Meta consultable y separación de descubierto/copia | Álbum ilustrado de consulta; gestión de equipo en preparación | No inventar varias generaciones activas o nuevas capacidades por nombre |
| Duplicados | Tienda dice devolución 1000 por Shiny Egg duplicado; legendarios→shards/voucher | Copias formables/equipables; ningún canje | Mostrar utilidad real y futura elección de excedentes | No conversión automática, nueva moneda o descarte de última copia | Reembolso/canje/pity no ejecutados en referente y no implementados aquí |
| Monedas | Precios 2000/10000/200; Amulet Coin muestra 3 por victoria/cap 150 | Rana 10/gragea 5/forja 15–25;20/50 primera,2/5 repetida; cofres 10 | Mostrar fuentes y sumideros y coste en la acción | No trasladar magnitudes, caps, diarios o economía de otro catálogo | Todos los ajustes son escenarios; no convertir valores observados en balance aprobado |
| Objetivos persistentes | Logros con CLAIM y diario 500 mostrado; no reclamados | Misiones es orientador/atlas, no tablero con premios reclamables | Siguiente objetivo apoyado en el estado real | Poco texto, un objetivo visible, no checklist diaria | Logros/premios tienen que definirse/idempotencia; no afirmar existente un sistema de misiones económicas |
| Regiones | Varias regiones con progreso; solo Kanto recorrido | Una campaña real, Bosque futuro desbloqueable sin ruta | Región con habitantes y estrategia propias | Consolidar una región completa antes de ampliar | No se observó victoria→Next Map. Etiqueta pública no demuestra transición jugada |

## La adaptación que importa

PokéLike une adquisición→composición→riesgo→resultado→colección. Copiar sus botones o cantidades no crea ese vínculo. Nuestro equivalente debe ser visible en tres momentos:

1. **Antes:** elijo un aliado/ruta porque cambia mi equipo o el riesgo que puedo afrontar.
2. **Durante:** el combate representa las consecuencias de esa preparación; entiendo una curación, activación o error sin leer un registro largo.
3. **Después:** la recompensa abre un uso inmediato y una intención para otra expedición.

A60 resolvió varias confirmaciones redundantes y el contraste de los nodos. A62 detecta que aún falta contenido táctico contrastado y un cierre que destaque llave/rana y su uso inmediato. Misiones ya orienta correctamente a la bóveda con llave; el problema está en la jerarquía del cierre del mapa, no en ausencia total de destino. El análisis de dominio de esta revisión muestra que la composición inicial más los pactos actuales puede ganar todos los caminos modelados sin compras: [modelo y límites](PROGRESSION.md). Esto aconseja enriquecer decisiones antes de añadir niveles o potencia.

## Lo que no debe copiarse

- Pixelart, recursos, personajes, textos o código del referente.
- Publicidad, consentimiento y elementos que resten espacio al mapa.
- Cantidades monetarias, inflación o escalas de precios de un catálogo distinto.
- Más modos/regiones antes de consolidar el contenido local.
- Una expectativa de muchas estadísticas en pantalla para parecer profundo.
- Diarios/rachas/caducidades como sustituto de motivos para jugar.
- Una devolución o pity que no tenga contrato/versionado propios.

## Incertidumbres que se conservan

El referente no se auditó en móvil físico ni en rendimiento/seguridad/persistencia. No se conocen sus probabilidades exactas por identidad, aislamiento de operaciones, recuperación de compra o condiciones reales de pity. No se probó ningún canje. El aumento de 250 observado al regresar al menú coexistió con un cambio en logros; no se ha identificado su causa. No hay base para afirmar que perder pague 250.

Las recomendaciones sobre interés son interpretación experta. Una siguiente sesión humana debería comprobar si el jugador anticipa una consecuencia, reconoce lo obtenido y formula una nueva intención. El juego necesita esa evidencia posteriormente; su ausencia no bloquea esta revisión experta.
