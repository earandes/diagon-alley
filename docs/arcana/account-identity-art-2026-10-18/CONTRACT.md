# A81 · Identidad y objetos de acceso

18 octubre 2026. Enric plantea emblema del juego y assets propios de iniciar sesión/crear cuenta y pide revisar estilo/temática para aplicarlos. Se autoriza una muestra integrada acotada; no rediseño completo de marca, publicación, main o servicios con créditos. Baselineae8019c, rama/PR7 dependiente de A75. Evidencia A79/A80 intacta.

## Diagnóstico y elección

Hechos: A80 usa ui.map para login, ui.collection para registro y ui.seal para gestión. Son recursos de navegación/selección; ningún emblema del juego está activo en la bienvenida. Los campos/operaciones ya funcionan. Interpretación experta: la metáfora mapa no identifica acceso y una familia de objetos específica puede dar continuidad visual; no es observación humana.

Alternativas: solo un escudo para todas las tareas simplifica producción pero no distingue acciones; tres logos diferentes fragmentan identidad; una familia de emblema+dos objetos distingue función conservando materiales. Se elige la tercera.

- `brand.emblem`: umbral/cromo/estrella, representa Callejón y colección, sin iniciales o texto embebido.
- `account.login`: llave plateada sobre credencial conservada, regreso a lo guardado.
- `account.register`: pluma/folio/cromo en blanco, inscripción de la nueva cuenta.

Una muestra de tres diseños con acabado por paquete (Diagon ciruela/oro, ARCANA esmalte verde/oro). SVG de curvas y materiales editables, coherentes con las props vigentes. No se presentan como dibujo raster, rig corporal ni logotipo oficial de la franquicia. No copiar escudos, marcas o tipografía Harry Potter.

## Recorrido e integración

Emblema junto al nombre de juego solo en la bienvenida, sin cargar el mapa con otra marca/HUD. Objetos de acceso en las acciones existentes de bienvenida y en sus cartas. Gestión puede usar emblema propio en lugar del check de selección; verificar conserva carta existente coherente con correspondencia A80.

Mismos botones, labels, foco, stock y autoridad. Decorativos, no deciden ni anuncian un estado. Ausencia de arte conserva controles/texto. No cambiar autenticación, precios, estadísticas, snapshots o dominio. Actualización explícita de versión de presentación únicamente.

## Producción y aceptación

Fuente reproducible stdlibPython +SVG bajo tools/visual, editables y manifest en design/production/account-symbols-v1; copias runtime en content-packs. Cero gasto, dependencias o configuración global. No Blender/renderer nuevo para producir recursos vectoriales. Se revisa la muestra en contexto antes de ampliar a más recursos; no lote adicional.

1. Tres siluetas/funciones reconocibles, sin depender de letras/color. Verificar a44px y168px en contexto, recorte/transparencia y contraste funcional de los labels independientes.
2. ES/EN y ambos paquetes, móvil390/escritorio1280/intermedio865; sin nuevos controles/texto. Reflujo200%, foco y fallback conservados por regresiones A76–A80.
3. Tipos/build/contenido/unitarios, persistencia pertinente y tests de navegador seriales en CI Linux. Mac sin navegador/captura/grabación. Guard/lock/watchdog originales, un worker y cero retry.
4. Capturas nuevas seleccionadas (bienvenida y dos tareas por paquete/tamaño representativo). Inspección en un lote; corrección conjunta y una confirmación si hay defectos demostrados.
5. Documentar archivos/procedencia/fuentes/peso/licencia/consumidores y actualizar PR7 sin merge. Observación humana del significado, dispositivo físico y permiso de distribución siguen pendientes; la producción no constituye aprobación definitiva de marca.

Contraste con inventario: la llave dorada de bóveda ya existe. La llave de identidad es plateada, con perfil de aro calado distinto y credencial, sin cantidad/coste. Se evita copiar el recurso económico; la distinción semántica percibida sigue siendo hipótesis humana.
