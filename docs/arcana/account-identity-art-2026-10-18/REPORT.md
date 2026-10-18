# A81 · Una familia visual para el juego y las cuentas

Sí tiene sentido disponer de un emblema propio y de objetos que identifiquen entrar/crear cuenta. Se ha implementado una familia común, con tres funciones y dos acabados de presentación.

- **Juego:** umbral con un cromo y estrella. Relaciona Callejón, expedición y colección.
- **Iniciar sesión:** llave plateada junto a una credencial. Se diferencia del recurso dorado de la bóveda.
- **Crear cuenta:** pluma, folio y tintero. Representa inscripción y conservación del avance.

Son SVG ilustrados originales y editables, con oro/papel y acabado ciruela para Diagon o verde para ARCANA. No se han producido personajes, fondos, tipografías o marcas oficiales. [Recursos, procedencia y regeneración](ASSETS.md), [galería en contexto](GALLERY.md).

## Aplicación

El emblema acompaña el nombre del juego en bienvenida; la gestión de cuenta puede usarlo en su cubierta. Registro y login usan sus objetos en botones existentes y cartas, manteniendo los nombres de acción accesibles. Verificación conserva el sobre de A80. No se añade otro HUD al mapa, botón, texto explicativo, pantalla o animación.

Se conserva el folio A80, campos nativos, foco, ayuda y recuperación. Las nuevas imágenes son decorativas y no condicionan ninguna operación. Ausencia de arte conserva labels/títulos/acciones. Las versiones nuevas son exclusivamente de presentación: Diagon4/ARCANA6. No cambia campaña, snapshots, derechos únicos, inventario, reglas, economía, autenticación o propietario.

## Revisión y validación

Primera inspección de siete capturas encontró un recorte del emblema al200% en la cabecera fija. Se corrige altura solo en bienvenida y especificidad del grupo marca; confirmación final muestra el emblema completo sin cambiar mapa.

CI39111152788 SUCCESS, headc9955b4 /checkoutce6cc4a:624unitarios,99PG/Redis,61casos activos de navegador; tipos/build/contenido/scanner/backup correctos. Textos ES/EN, ambos paquetes, tamaños390/865/1280, reflujo200%, foco y fallbacks cubiertos según [QA](QA.md). Siete capturas finales conservadas y comparación seleccionada de la corrección. Ningún navegador/captura del Mac.

SeisSVG suman15.066bytes (7.533por acabado, sin comprimir), fuente y manifest conservados, sin dependencia o servicio nuevo. Es tamaño de archivo, no benchmark de rendimiento. No lote adicional antes de observar esta muestra integrada.

## Entrega y preguntas pendientes

PR7 draft sobre A75, sin main o despliegue. Falta observar si una persona distingue registro/acceso antes de leer, qué asocia al emblema y si relaciona la llave con identidad o con botín. Los labels siguen siendo esenciales, especialmente36px; los tests no prueban el significado percibido. También pendientes dispositivo físico, lector hablado y aprobación final de branding. No se cambia favicon o manifiesto PWA en este alcance.
