# Bienvenida visual, acceso y primer pack de assets

9 octubre 2026 · PRD v0.16 · A19. Preparación de diseño; aplicación sin implementar.

## Decidido y pendiente

Enric pide que el Callejón Diagón ya se vea como fondo al llegar, que se pueda crear una cuenta/iniciar sesión y después visitar el callejón, y que cada usuario tenga guardado su historial de premios. Se registra como A19, conservando Weasley primero, colección, rarezas, A13–A18 y español/inglés. La propuesta anterior de acceso invitado y guardado local ya no define el producto conectado.

Se ha consultado si cuenta/historial entran en I1 o después de su demo local; sin respuesta registrada. No ejecutar el prompt previo hasta ajustar esa frontera. Recomendación: incluir un pequeño recorrido de acceso real antes del recorrido de apertura conectado. Primero bienvenida → registro/acceso → Callejón → salir/volver a entrar; después Weasley → apertura autoritativa → colección/historial → recuperación. Ambos necesitan aceptación propia; no entregar como acceso terminado una maqueta que solo cambia de pantalla.

Proveedor y método de acceso siguen abiertos. Propongo evaluar un servicio gestionado y evitar contraseñas mantenidas por nosotros; Google y enlace por correo son alternativas, no decisiones aprobadas. La cuenta no garantiza por sí sola inventario confiable: consumo, sorteo, copia y evento del historial deben confirmarse juntos por el servidor, con replay idempotente y aislamiento entre usuarios. IndexedDB puede ser caché, no autoridad del premio. No importar saldos de demo como premios de cuenta. Retención, borrado, recuperación y conflicto entre dispositivos requieren diseño antes de implementar. Pagos, suministro y otros recorridos mantienen su alcance anterior.

## Recursos entregados

Todos están en [design/assets/preparation-v1](../../design/assets/preparation-v1/manifest-v1.json). Textos funcionales fuera de las imágenes. Nuevas imágenes provisionales sin aprobación automática de estilo o permisos; modelo no expuesto por la herramienta. Original I1-CV01 intacto.

| ID | Recurso realmente usado | Estado y entrega final necesaria |
| --- | --- | --- |
| A19-V01 | [Callejón](../../design/assets/preparation-v1/callejon-background-v1.png), 1536×1024 RGB | Fondo exterior completo. Para final: fuentes por planos, fachada/puerta/lámparas separadas, versión vertical dedicada y encuadres comprobados con UI. La silueta de castillo distante generada es una desviación a retirar/revisar; no representa una nueva localización aprobada. |
| A19-V02 | [Caja cerrada](../../design/assets/preparation-v1/frog-box-closed-v1.png), 1374×1145 RGBA | Sprite provisional. Faltan base/tapa/interior independientes, mismo punto de vista, pivote y oclusión. El ensayo usa desvanecimiento, no una tapa simulada como si existiera. |
| A19-V03 | [Rana](../../design/assets/preparation-v1/chocolate-frog-v1.png), 1536×1024 RGBA | Sprite con alfa real, sin rig ni poses. Revisar halo/contorno sobre crema y madera; faltan poses de reposo/salto/aterrizaje o deformaciones expresamente aceptadas. |
| A19-M01 | [Estudio ES/EN](../../design/assets/preparation-v1/motion-study-v1.html) | Maqueta de diseño con bienvenida y visita de muestra, y animación CSS guionizada. No acepta credenciales ni concede/guarda premios. Cromo nativo sin identidad como sustituto; falta ilustración de un candidato válido de bienvenida. |

Los archivos `alley-prompt.md`, `frog-prompt.md` y `box-prompt.md` conservan los prompts y las rutas de generación. El manifest registra dimensiones, hash, herramienta, referencia, formato, pivote propuesto, texto alternativo y entrega pendiente. Nada se genera durante una apertura.

## Movimiento propuesto y muestra

| Momento | Ensayo preparado | Versión de producto y prueba pendiente |
| --- | --- | --- |
| Bienvenida | Callejón completo con panel crema y acciones de acceso separadas | Carga sin bloquear el formulario; fondo ausente conserva acceso. Sin audio automático. |
| Visita | Alternar muestra tras acceso: encuadre se acerca 900 ms | Solo después de autenticación real. Reducido: cambio inmediato; no cámara libre. Duración candidata. |
| Apertura | Caja tiembla/desaparece, rana salta y cromo aparece: 2,3 s | Solo tras confirmación durable. Separar tapa y base antes del ritual final. No atribuir entrega a la animación. |
| Resultado | Omisión muestra el mismo cromo guionizado estático | En producto, el mismo resultado confirmado se conserva con recarga/cierre/cambio de idioma. |

La maqueta tiene reproducción, pausa/continuación, omisión y ajuste reducido, y respeta la preferencia del sistema. Los textos del estudio cambian es/en conservando vista y estado visual; no es una prueba de persistencia de premios. El ajuste propio reducido se comprobó; la pausa y el comportamiento de preferencia del sistema requieren comprobación específica; no se declaran cubiertos por una captura.

## Herramientas: disponibilidad comprobada y uso recomendado

| Herramienta | Estado comprobado en esta sesión | Papel recomendado |
| --- | --- | --- |
| Imagegen integrada | Usada para tres PNG; transparencia inspeccionada en dos | Pintura, variantes y separación de recursos con referencia común; revisión individual antes del lote. No genera SVG, rigs ni permisos. |
| Stitch MCP | `list_projects` respondió; no se creó ni modificó un proyecto | Alternativas de pantallas/estados ES/EN. Mantener A12/A19 como autoridad y sustituir imágenes genéricas. No reutilizar un proyecto ajeno al producto. |
| Figma plugin/MCP | Directorio devuelve Figma disponible, no instalado; sugerido para conectar | Composición editable, componentes, responsive y colaboración. Verificar herramientas concretas de lectura/escritura tras conectar; no asumirlas de antemano. [Documentación oficial](https://developers.figma.com/docs/figma-mcp-server/). |
| Computer use | Navegador integrado disponible y usado en la maqueta. Inventario de apps nativas falló por Mac bloqueado | Operar editores cuando falte API, revisar/exportar visualmente. Krita/Rive nativos no se pudieron verificar. No necesita desbloquearse para esta entrega. |
| CSS / GSAP | Ensayo CSS sin instalar dependencias; GSAP no utilizado | CSS para movimientos sencillos. GSAP si necesitamos una línea de tiempo coordinada, limpieza y variantes reducidas; [matchMedia oficial](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/). No es elección definitiva de stack. |
| Rive | Documentación consultada; búsqueda de plugins no devolvió integración de Rive | Candidato para animación interactiva con máquina de estados y fuente `.riv`; comprobar importación, edición y peso de una muestra antes de elegirlo. [Editor oficial](https://www.rive.app/editor). |
| Krita | Documentación consultada; instalación no comprobada y búsqueda no devolvió plugin | Pintura por capas y poses dibujadas; exportar secuencias para animación. [Manual oficial](https://docs.krita.org/en/user_manual/animation.html). |

Recomendación: imagegen → revisión en contexto → composición en Figma si se conecta → fuentes por capas en un editor de pintura → movimiento CSS/GSAP. Rive se decide después de comprobar que aporta algo a una muestra concreta. MCP primero para operaciones estructuradas; computer use para controles y exportaciones no expuestos. No se instalaron herramientas ni se creó una cuenta externa.

## Criterios del futuro recorrido conectado, en ambos idiomas

| Situación y acción | Resultado comprobable esperado |
| --- | --- |
| Usuario sin sesión abre bienvenida | Ve Callejón de fondo y acceso localizado; no visita la zona autenticada todavía. Con arte ausente sigue pudiendo acceder. |
| Usuario completa registro/acceso | Cuenta real, sesión recuperable y acceso a Callejón/lista equivalente; error mantiene contexto y ofrece reintento, sin falso éxito. |
| Usuario abre su rana, omite y vuelve a entrar | Una sola entrega y copia, vinculadas a su cuenta; historial y colección concuerdan con el registro confirmado. A13/A18 conservadas. |
| Guardado/servidor falla o conexión cae tras confirmar | No anunciar premio sin confirmación; recuperar por ID antes de repetir sorteo o gasto. |
| Dos pestañas/dispositivos usan la misma unidad | Consumo único; replay devuelve resultado idéntico; otra petición para la unidad consumida se rechaza. |
| Usuario B accede a su cuenta | No puede consultar ni modificar colección o historial de A; comprobar autorización del servidor y rutas. |
| Usuario cierra sesión y accede desde otro dispositivo | Recupera premios confirmados; sin mezcla con la cuenta anterior ni nuevos regalos por volver a acceder. |
| Cambia es/en, reduce movimiento o pierde el arte | Misma vista/operación, resultado y acciones equivalentes; teclado y lector de pantalla con anuncio único. |

Campos propuestos del historial: identidad, familia, rareza en la versión obtenida, origen/tienda, fecha localizada y tipo regalo conocido/sorteo/premio. El ID de operación enlaza dominio y auditoría; no hace falta exponerlo como dato principal. Filtros/paginación y textos concretos pendientes. Estos casos son aceptación preparada, no ejecutada contra un backend.

## Evidencia y límites

Se generaron y copiaron tres imágenes, se verificaron formatos/dimensiones y alfa, y se abrió la maqueta en el navegador integrado. Se revisó el encuadre móvil a 390×844 en es/en y se ajustó para conservar la calle visible. Se observaron bienvenida, reproducción, cambio a inglés, vista de visita, omisión y ajuste propio reducido. Sin pruebas de autenticación, persistencia, servidor, usuarios reales o permisos. La nueva dirección A19 no modifica catálogo, rarezas ni cantidades.
