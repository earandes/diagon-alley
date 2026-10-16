# Dirección de movimiento y diez coreografías

Estas fichas son el **diseño previo** a la implementación. [REGISTRO-OPENING](REGISTRO-OPENING.md), [REGISTRO-UI](REGISTRO-UI.md) y [VALIDATION](VALIDATION.md) distinguen lo integrado, lo probado y lo pendiente. Los tiempos siguientes son objetivos orientativos; el rendimiento se mide por separado.

## Gramática: causa, peso y reposo

El papel flexiona y se asienta sin parecer gelatina. Metal y madera recorren distancias cortas con contacto legible. La magia nace de un objeto o actor, recorre una dirección y termina en su objetivo. Un recorte de persona puede trasladarse o inclinarse; no tiene rodillas ni manos articuladas por parecer pintado.

Un evento tiene un foco y, como máximo, dos capas de respuesta. Pendiente y error son estados estables. La intensidad responde a la importancia, no a cuántas partículas se pueden dibujar.

| Nivel | Uso | Movimiento orientativo |
| --- | --- | --- |
| I · Cotidiano | Seleccionar, consultar, cambiar página | 80–180 ms; 1–4 px; escala 0,98→1 |
| II · Táctico | Composición, reclutamiento, condición | 180–420 ms; 6–12 px o sello localizado |
| III · Descubrimiento | Carta nueva, objeto importante | Resolución de 450–900 ms, además de fases materiales justificadas |
| IV · Excepcional | Rareza superior, jefe o recuerdo nuevo | Resolución de 600–1400 ms; sin flash de pantalla completa |

Asentamiento con `cubic-bezier(.16,1,.3,1)` o `power3.out`; lanzamiento breve con aceleración; rebote moderado solo cuando el objeto lo admite. Sin loops nuevos. Movimiento reducido conserva estado, foco y datos, eliminando trayectoria, escala y temblor. Audio no implementado ni activado.

## M01 · Arena con un solo tiempo de presentación

**Problema y evidencia:** el timer React y el ticker Pixi anteriores conservan tiempos distintos. El efecto muestra una trayectoria ambigua y un proyectil desde el objetivo que no existe en el log. Hecho de fuente; no medición de desfase en jugadores.

**Sensación y secuencia:** intención → impulso → contacto → peso. Anticipación 0–18 %: actor retrocede 2 px e inclina unos 2°. Lanzamiento 18–78 %: haz fino curvo del actor al objetivo. Contacto 78–90 %: anillo finito y reacción local de 4–7 px. Asentamiento 90–100 %. Referencia del pack: 650 ms a 1x, 325 ms a 2x para un hechizo. Fallo se desvía sin golpe; curación usa un aro ascendente; quemadura, una brasa breve; agotamiento de PM no fabrica un hechizo. Una caída atenúa e inclina sin ocultar PV.

**Capas, recursos y coste:** figuras actuales con pivote, un `Graphics` local, PV y cifras DOM. Reloj puro común con renderer, sin 60 renders React/s. Máximo un proyectil y un impacto; ocho marcas pequeñas en contacto. No calcula daño, azar ni resultado.

**Control y aceptación:** pausa, inspector y ocultación congelan fase; 2x conserva fracción; omitir llega al resultado confirmado. Reducido o fallo de renderer conserva resultado, controles y registro. Liberar ticker, RAF, observer, listeners y texturas propias. Comprobar actor/objetivo, todos los participantes, ausencia de POST y BattleLog intacto. No shake global ni hit-stop bloqueante en este incremento.

## M02 · Caja → rana → carta → identidad

**Problema y evidencia:** posiciones temporales absolutas mezcladas con duraciones del pack; ritual uniforme y protección parcial frente a remontaje. A58 documentó el tirón del renderer anterior y su mejora mediante Canvas2D.

**Sensación y secuencia:** la caja comprime el sello durante 120–180 ms; el sello cede; tapa y base se separan; la rana comprime, salta, asienta y huye; el dorso ocupa su lugar y gira al frente; marco, nombre, rareza y estrellas cierran. Guía total: 1,8–3,8 s. Un descubrimiento aumenta la resolución según los cuatro rangos existentes; una copia repetida resuelve antes, sin fingir una identidad nueva.

**Capas, recursos y coste:** piezas actuales de caja/tapa/sello, rana plana, dorso, marco y retrato. Timeline GSAP con etiquetas derivadas de configuración. Canvas2D conserva dos sprites precocinados y un máximo de 24 destellos durante la fase significativa. Escalar el bitmap no es animación anatómica; patas articuladas requieren una muestra futura de piezas o poses.

**Control y aceptación:** omitir, reducido, recuperación y fallo dejan la misma carta disponible. Idioma, pack y consulta histórica no reinician el ritual. La pestaña oculta pausa; salir limpia la timeline y Canvas. Decodificación fallida no bloquea el resultado ni justifica precargar otra pantalla para esconder la espera. Medir desde acción, red y carga hasta resultado utilizable; fixtures de cuatro rarezas y nuevo/repetido sin modificar probabilidades.

## M03 · La ruta responde a una decisión

**Problema y evidencia:** aristas punteadas eficientes, pero sin reconocimiento direccional del paso confirmado.

**Secuencia:** después del recibo, el último enlace se traza desde el origen al nodo visitado en 180–300 ms. El nodo asienta de 1,04 a 1 y las siguientes opciones quedan estables. El marcador de inicio permanece no interactivo.

**Recursos y tecnología:** un SVG decorativo sobre el layout compartido, o geometría actual equivalente; sin textura nueva ni ticker permanente. Ease-out. Un ID de operación limita la presentación.

**Control y aceptación:** ocultación o reducido asientan directamente; cancelar o consultar no dibuja avance. Coincidencia DOM/canvas, ningún nodo tapado, mapa completo sin scroll y cierre del efecto antes de 300 ms.

## M04 · El retrato se convierte en acompañante

**Problema y evidencia:** selección y confirmación funcionan, pero el resultado queda poco conectado con el equipo.

**Secuencia:** seleccionar eleva la carta 4 px durante unos 140 ms y revierte al elegir otra. Solo tras confirmar, retrato y sello reconocen al candidato incorporado con un asentamiento de unos 220 ms. La procedencia temporal sigue visible. No se presenta reclutamiento durante el borrador.

**Recursos y coste:** retratos y miniaturas actuales, CSS o Motion mini por ID confirmado. No vuelo sobre diálogos o navegación. El traslado animado a un puesto del HUD queda condicionado a una muestra que no invada controles; el mínimo implementable es retrato y sello confirmados.

**Control y aceptación:** cancelar no deja una incorporación visual; reemplazar respeta reglas y copias. Reducido mantiene sello y estado. Idioma, pack o regreso no repiten celebración. En móvil el recibo compacto no cubre retratos; los detalles se consultan a demanda.

## M05 · La condición cambia de forma visible

**Problema y evidencia:** la vista previa es exacta, pero el resultado PV/PM puede parecer un salto numérico sin origen.

**Secuencia:** elección del objeto en 130 ms; confirmar detiene el borrador. Ganancia asciende 4 px y coste se asienta 2 px durante unos 240 ms; después quedan los valores guardados. Signos, recurso y unidad distinguen coste y beneficio, además del color.

**Recursos y coste:** retrato, símbolos PV/PM y diagnósticos del recibo. CSS local; no recalcular efectos en React. En refugio se necesita un snapshot anterior exacto y compatible. Si falta, no se invierte un porcentaje para inventarlo.

**Control y aceptación:** cancelar no anima un cambio confirmado; reducido conserva cifras estáticas. Contrastar antes/después con estado guardado para refugio, tratos, encuentro legacy y decisiones estacionales. Una consulta histórica no vuelve a parecer una curación.

## M06 · Cofre, forja y bóveda tienen materia

**Problema y evidencia:** volver a montar un recibo podía reproducir el pop del objeto y parecer otra concesión.

**Secuencia:** solo un recibo nuevo activa un impulso de 160 ms y asentamiento del objeto de 240 ms. La varita aparece desde su peana; la bóveda devuelve el botín confirmado; el cofre conserva cantidades y procedencia. No fabricar una segunda tirada visual.

**Recursos y coste:** PNG de objetos, llave, sello y peanas actuales; transformación CSS o WAAPI breve. No prometer herramientas trabajando ni tapa articulada donde falta arte separado. Sin partículas genéricas adicionales.

**Control y aceptación:** consultar vuelve estático; error, falta de llave o saldo no celebran éxito. Cancelar conserva recursos; respuesta perdida recupera el mismo objeto; arte ausente conserva nombre y cantidad. La animación no mantiene un saldo antiguo como vigente.

## M07 · Objetos que encajan y formación que responde

**Problema y evidencia:** cambios de equipo y sinergia tienen poco reconocimiento específico.

**Secuencia:** varita, escoba o gragea asientan 4 px→0 en 160 ms. El símbolo de composición responde durante 180 ms cuando cambia el efecto real. Consultar una formación ya guardada permanece estático. El borrador de gragea no se celebra como consumo.

**Recursos y tecnología:** slots, objetos y retratos existentes; firma de cambio y Motion mini/CSS. Comparaciones del dominio compartido; sin duplicar estadísticas o fórmulas. Evitar dos transforms anidados para el mismo gesto.

**Control y aceptación:** cancelar o quitar revierte el borrador sin consumir ni descubrir. Cubrir 1–5 unidades, temporales, duplicados, vacío→equipado y equipamiento diferente. Alquimia 2→3 responde al bono real; 2→2 no finge otro umbral. Reducido elimina el tween.

## M08 · Hojear y reconocer

**Problema y evidencia:** filtro o página cambia de golpe y no tiene una transición local coherente.

**Secuencia propuesta:** salida de hoja de 100 ms y asentamiento de entrada de 3 px/160 ms. El mínimo integrado puede omitir la salida para no retrasar la consulta. No deformar una imagen plana como un libro 3D ni poner una marca de descubrimiento por filtrar.

**Recursos y coste:** grid y retratos actuales; transformación del contenido, sin interceptar botones ni cargar todas las páginas. Un nuevo sabor sigue dependiendo de la activación confirmada.

**Control y aceptación:** primera consulta estática, filtro conserva foco, reducido inmediato. Vacíos y texto ampliado conservan acciones. Cambiar página no reproduce premios ni hallazgos; hover, foco y toque tienen consulta equivalente.

## M09 · Diálogos y operaciones con un ritmo común

**Problema y evidencia:** entradas por montaje y confirmaciones tienen ritmos distintos; una operación incierta necesita estabilidad, no espectáculo.

**Secuencia:** entrada del diálogo en 160 ms, objeto en 180 ms y reconocimiento breve del recibo. Cierre inmediato para devolver foco. Pendiente, offline y error conservan explicación y recuperación, sin una animación de éxito.

**Recursos y coste:** superficies, iconos y sellos actuales; CSS/Motion mini finitos. No tween global sobre toda la aplicación ni shake por cada error. No añadir un spinner que represente un progreso inexistente.

**Control y aceptación:** controles disponibles sin esperar al tween, cancelación inmediata y foco al origen. Una identidad confirmada se anuncia una vez; cambio de idioma o navegación no vuelve a conceder ni animar. Fallo de renderer no elimina semántica DOM.

## M10 · Cierre protagonista y ambiente subordinado

**Problema y evidencia:** cierre montado puede volver a animar botín; ambiente sigue compitiendo con la escena focal.

**Secuencia:** resultado breve, botín asienta en unos 340 ms y orientación por stock actual. Un recuerdo nuevo puede tener su cierre excepcional existente, finito; el histórico permanece estático. El ambiente pausa durante arena, diálogos y pestaña oculta, y vuelve sin salto de lógica.

**Recursos y tecnología:** ilustraciones y objetos actuales, caché visual acotada y CSS de visibilidad/prioridad. Sin más motas, audio automático, premios adicionales o pantalla nueva de misión. Usar botín actualiza la orientación sin iniciar otra expedición.

**Control y aceptación:** victoria inicial, repetida, derrota y empate conservan su cierre correcto. La intención no tapa llave/rana/equipo pendiente. Reducido muestra el mismo resultado y acciones; liberar timers y listeners al salir. Interés por repetir y satisfacción siguen siendo hipótesis para la sesión humana.
