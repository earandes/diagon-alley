# Gramática visual e interacción propuesta

Objetivo: reconocer personaje, objeto y consecuencia antes de leer una explicación. Conservar los tokens y tipografías actuales de cada pack; no migrar a un tema de landing ni importar otra librería. Es diseño P, no un sistema ya implementado.

## Cuatro familias de controles

| Familia | Material y jerarquía | Interacción/estado | Consumidores |
| --- | --- | --- | --- |
| Acción que confirma | Un sello/emblema con verbo breve y coste próximo; mayor contraste local | Busy inmediato, deshabilitado explicado, error/recuperación; 44 px de comodidad como objetivo | Entrar, iniciar expedición, combatir, comprar/abrir, forjar, abrir bóveda |
| Selección táctica | Retrato/puesto/objeto; contorno localizado y sello persistente de selección | aria-pressed y marca además de color; antes/después sin commit; foco distinto de elegido | Formación, Pacto, portador, encuentro, vínculo |
| Consulta | Libro, lupa, medallón o retrato; volumen secundario | Hover/foco/toque equivalentes, title/label localizados, Escape/retorno | Fuentes, sinergias, equipo, probabilidades, historial |
| Sistema | Icono contenido y etiqueta suficiente; superficie sobria | Visible sin arte, foco con contraste, error contextual, sin confeti | Ajustes, pausa, cierre, recuperación, volver |

No usar un único botón dorado para todas. Los campos de cuenta siguen siendo campos nativos etiquetados; la ambientación la aporta su composición alrededor de un objeto, no disfrazar contraseña como icono.

## Jerarquía por escena

- **Bienvenida:** una identidad, ilustración despejada y acciones verticales; guest principal o continuar según estado. Mantener registro/login disponibles sin competir como tres paneles. Ajustes pequeño pero visible.
- **Preparación:** rival/objetivo arriba o fondo, equipo propio en primer término, objeto de suministros próximo a portadores y un sello de confirmación. Los datos amplios viven en libro/inspector.
- **Mapa:** conexiones antes que decoración; nodo alcanzable, visitado y consultado por patrón/forma. Origen es marcador, no evento. Equipo compacto no debe consumir el área de ruta.
- **Arena:** dos bandos, figura/PV/nombre, actor y objetivo localizados. Cabecera propia y pausa; información táctica consultable. No restaurar cabecera global, Auto y bloque «guardado» permanentes.
- **Cierre:** resultado → premios confirmados → uso del objeto → intención voluntaria. No otra cuadrícula de iguales botones ni preparación0/5 dominante.
- **Colección:** folio ilustrado con índice a demanda; portada no debe parecer una hoja de cálculo. Mantener fuente/objetivo bajo una consulta clara.
- **Comercio:** fachada y objeto explican acción; stock frente a precio no deben confundirse. Libro secundario, recibo recuperable.

## Gramática de atributos, sin cambiar reglas

| Nivel | Posición/forma propuesta | Información |
| --- | --- | --- |
| Identidad | Insignia pequeña junto al nombre o dentro del folio | Casa/naturaleza/profesión/grupo, sin sumar pasivos |
| Personaje en combate | Marca de afinidad pegada a retrato/figura | Afinidad existente y condición |
| Equipo | Estandarte único de vínculo elegido | Tier y contribuyentes reales; tocar abre explicación |
| Ruta | Marcapáginas de intención, sin cifra de potencia | Qué se está intentando, puede abandonarse |
| Colección | Señal discreta de objetivo de adquisición | Fuente/propiedad, independiente de intención táctica |

Se conserva el modelo compartido de snapshot, contribución por identidades distintas y un vínculo elegido. La estética no crea bonos ni multiplica encantados.

## Tipografía y espacio

Títulos editoriales cortos; nombres con salto por palabras, sin partir apellidos como McGonagall. Texto funcional en cuerpo legible con fondo local suficiente. Reservar la ornamentación a contorno y objetos, no cada etiqueta. U08 debe comparar distribución de puestos antes de bajar otra vez el tamaño.

No aprobar tamaños por documento: se comprobarán estilos calculados, texto real y área visible de figura en Linux. Propuesta de ensayo: jerarquía de tres tamaños funcionales dentro de una misma superficie y una acción dominante; no límite obligatorio para accesibilidad o nombres largos.

## Estados compartidos

| Estado | Señal visual y funcional |
| --- | --- |
| Disponible | Objeto reconocible y contorno estable, etiqueta al foco/toque |
| Seleccionado | Sello/encaje + aria-pressed, no solo brillo |
| Foco teclado | Contorno visible adaptado a forma con separación del seleccionado; nunca quitar el cian sin reemplazo contrastado |
| Bloqueado | Forma/cerrojo y razón breve; puede ser consultable sin resolver |
| Operación en curso | Respuesta inmediata local, acción no repetible; conservar el objeto para evitar salto de layout |
| Incierto | Estado persistente con recuperación; no toast que desaparece |
| Confirmado | Consecuencia visible, asentamiento breve y siguiente acción |
| Arte ausente | Silueta/símbolo/texto funcional; objeto sigue operable |
| Reducido | Cambio de estado directo o breve, sin pérdida de actor/objetivo/resultado |

## Responsive y accesibilidad

Ordinary1280×900,390×844 y865×1079; reflujo320 y200% pueden necesitar scroll accesible en inspectores. Mapa/arena no ocultan unidades para caber. Nada de carrusel de combatientes. El orden DOM debe seguir la tarea; diálogo superior recibe foco, cerrar lo devuelve al disparador. Contraste se mide sobre el fondo real, no una muestra aislada de oro/azul. Colores forzados, lector y dispositivo físico siguen pendientes.

## Componentes a compartir con prudencia

Extraer un cierre resiliente y quizá una cabecera de libro si duplicación real lo justifica; no rehacer58 componentes. Definir contrato de selección/consulta sin mezclar gasto. La cascada de36 CSS merece limpieza por consumidor tocado, no una reescritura general. A90 ya corrigió especificidad en lectura: preservar esa evidencia y comprobar el estilo computado después.
