# A60 · Qué adaptar de PokéLike

Revisión directa del 15 de octubre de 2026 de [PokéLike v3.4.1](https://pokelike.xyz/), mediante Chrome solicitado por Enric y un tab independiente del navegador integrado. Es un recorrido técnico del integrador, no una prueba con usuarios ni una medición de retención. No se han copiado código, personajes, gráficos, sonidos o textos de ese juego. El referente puede cambiar después de esta fecha.

## Bucle realmente recorrido

Inicio → Story → Classic → Kanto → personaje → uno de tres iniciales → mapa ramificado → captura → combates automáticos → objetos → centro de curación → preparación → jefe → derrota → Game Over → menú. Se eligió Charmander y después Pikachu entre tres encuentros de captura. No se reprodujeron Tower, Challenges, Nuzlocke, otras regiones, una victoria de jefe o el paso a otro mapa. El nombre de un botón público «Next Map» no acredita haber completado ese recorrido.

| Momento | Observado directamente | Implicación para nuestro juego |
|---|---|---|
| Inicio | Modo, región, personaje y tres iniciales; regiones con progreso/Dex/logros | Elegir compañero es una decisión concreta. Mantener una región auténtica ahora y preparar futuras regiones con habitantes distintos, sin simular contenido ya jugable. |
| Mapa | Inicio completado no interactivo; bifurcaciones, visitas atenuadas, enlaces completados y próximos destinos visibles | Distinguir dónde estoy, dónde puedo ir y qué ofrece cada destino antes de pedir confirmación. |
| Captura | Tres candidatos, selección directa y opción de huir | La acción de reclutar debe estar en el propio personaje, sin un segundo botón genérico de confirmación. Oferta múltiple necesita diseño y balance propios antes de incorporarse. |
| Combate ordinario | Comienza automáticamente; el resultado devuelve al mapa; experiencia y PV se conservan entre encuentros | Conservar nuestro combate automático y eliminar decisiones puramente ceremoniales. No añadir XP sin especificar sus reglas. |
| Objetos | Tres ofertas; elegir uno permite equiparlo, guardarlo en una bolsa visible o cancelar | Una compra/recompensa debe mostrar su próximo uso; no remitir a una bolsa que el jugador no encuentra. |
| Centro | Curación inmediata y feedback, sin formulario intermedio | Mantener nuestro Refugio con elección real PV/PM; no copiar la curación completa gratuita por apariencia. |
| Jefe | Preparación explícita, orden del equipo, inspección de estadísticas, bolsa y acción FIGHT | Preparación compacta, datos a demanda y combate como acción principal. |
| Derrota | Equipo final, Game Over y acciones Play Again/Main Menu | El cierre de una expedición debe explicar el resultado y ofrecer un siguiente destino real. No reiniciar automáticamente una partida. |

En el recorrido técnico el equipo llegó al jefe con dos integrantes; conocer el rival y haber reclutado/preparado otro equipo habría sido una decisión relevante. Esto es un ejemplo observado, no evidencia de la dificultad óptima de ARCANA. El mapa del referente ocupa una franja central estrecha en una pantalla de escritorio grande; no se adopta esa proporción sin adaptación. Nuestro mapa sigue siendo protagonista y se comprueba sin scroll en tamaños ordinarios.

## Monedas y progresión: reglas mostradas y límites

Inspección de tienda, ayudas, logros y HUD; no se gastó moneda, compraron huevos ni reclamaron logros. No se crearon cuentas. Los nombres siguientes describen el referente, no nuevos contratos de nuestro juego.

| Sistema del referente | Información visible | Qué se verificó |
|---|---|---|
| Shiny Egg | 2.000; duplicado devuelve 1.000 | Precio y texto de tienda; no compra ni devolución ejecutada. |
| Legendary Egg | 10.000; base shiny 1%; +0,3 puntos porcentuales por no shiny, reinicio al conseguir shiny | Regla mostrada; no simulación de su implementación ni verificación de azar. |
| Duplicados legendarios | 1 Comet Shard; 20 si shiny; 10 shards permiten elegir mediante voucher | Utilidad y costes expuestos; no canje realizado. |
| Vitaminas | 200 por +1 EV de un atributo; personajes Hall of Fame de Tower/Challenges; reset gratis; sin efecto en Story según ayuda | Separación de progresión por modos visible, no ensayada. |
| Amulet Coin | 3 por batalla ganada con portador, hasta 150 por run | Se eligió guardar el objeto; no se aisló su pago en una victoria posterior. |
| Logros | Primeros gimnasios 100, Elite Four y Champion 500; otras metas y botones CLAIM | Valores y reclamación manual visibles; no afirmar que todos los premios sean automáticos. |
| Diario | Pokésort muestra recompensa 500 y cuenta atrás | No se jugó ni reclamó. |

Al volver al menú tras la derrota se observó un aumento de 250 y un cambio en el contador de logros. No se aisló la operación que lo causó: no se atribuye a perder contra el jefe ni a un logro concreto. No se conservan en este informe datos personales, identidad o contadores de la cuenta del propietario. No se conocen sus garantías transaccionales, sus tablas por identidad o sus reglas de recuperación de compras.

El sistema conecta tres horizontes: decisiones de la ruta, colección persistente y objetivos de modos/logros. Los duplicados visibles tienen un destino claro. Ese vínculo interesa más que copiar cantidades de dinero o introducir otras monedas de inmediato.

## Cambiar, conservar y diferir

**Cambiar ahora (implementado A60):** compra y apertura de rana en una acción explícita con coste; rana ya poseída se abre sin recobro; grageas orientan a preparar el equipo; explicación al lado del frasco; flecha de retorno reconocible; medallones de nodos con contraste y estados; inicio estático separado del primer evento real; pacto directo cuando hay espacio; cofre con acción nombrada y recompensa visual; preparación compacta con inspector a demanda; magia de revelación integrada y distinta por rareza.

**Conservar:** ilustración Harry Potter y Teatro de alquimia, swap ARCANA, español/inglés en Ajustes, combate automático y seis tipos reales de nodo, decisiones PV/PM del refugio y riesgo del encuentro, copias permanentes frente a temporales, servidor como autoridad, guardado antes del espectáculo, omisión/reducido, teclado y errores breves. No sustituirlo por pixel art, publicidad, más paneles o un nuevo motor.

**Diferir como propuestas:** experiencia/niveles durante la run; oferta de varios aliados; regiones y pools de rivales propios; premios por objetivos persistentes; destino económico de duplicados, conversión/pity o mejoras permanentes. Cada cambio necesita reglas, simulación y aprobación de economía. Las copias actuales ya pueden formar equipos y equiparse por separado; aún no hay un canje nuevo ni una promesa de compensación futura.

## Prioridad y prueba humana pendiente

1. Resolver «qué hago después de comprar»: una sola acción principal según el stock y uso real de cada producto.
2. Resolver «dónde voy y qué hará el nodo»: estados legibles, origen sin falsa acción y eventos con consecuencias claras.
3. Resolver «con quién voy»: cinco puestos, elección deliberada y datos/equipo bajo demanda.

La espectacularidad sirve para remarcar un resultado ya confirmado; no compensa un bucle confuso. La siguiente sesión humana debe observar, sin explicar la solución, si se compra/abre una rana, se usa una gragea, se identifica un temporal, se prepara un jefe y se elige un siguiente objetivo. Medir dudas, ayuda y deseo de continuar. A60 no demuestra que la gente se enganche ni sustituye la sesión guiada A53 pendiente.
