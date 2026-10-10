# I1 · Adaptación visual v2 · 10 octubre 2026

## Implementado

A26 lleva las tres propuestas a la aplicación existente: interior ilustrado, cuatro consultas y lista equivalente, caja pentagonal cerrada, piezas DOM para apertura y revelación del resultado guardado. Callejón detallado reutiliza la preparación previa. Misma rana, seis candidatos, cuatro regalos, inventario, álbum e importación/exportación/reset. No I2, cuentas, reposición, generación nueva ni despliegue.

Rana: ficha y consumo explícito. Grageas: ficha explica una unidad reservada y apertura pendiente. O01/O02: ficha del mismo invento conocido, sin compra/taller. Vuelta devuelve foco, incluida lista expandida. Seleccionar nunca gasta. Nombres, reglas, probabilidades, controles y metadatos en HTML es/en; carteles y nombres pintados se excluyen por encuadre, no se usa la captura completa como interfaz.

Persistencia/dominio no cambian. Presentación rechaza lecturas anteriores a la generación/revisión ya aceptada: una respuesta lenta de foco no revierte el idioma o saldo. Elección de idioma durante inicialización se guarda antes de aceptar su resultado. Estos dos defectos se reprodujeron con pruebas que fallaron antes de corregirlos. La prueba de fases utiliza un inicio de reloj fijo y una pausa futura para evitar retroceder el reloj del runner.

## Recursos y límites

[Manifest actual](../../src/content/art-manifest.json), con IDs I1-V01–06/I1-Cxx conservados, versiones de presentación, hashes de originales/exportaciones, dimensiones, rutas, fuente y permisos. PNG originales intactos; WebP únicamente codifica/comprime con Pillow integrado (quality 85/method 6, mismas dimensiones), sin retocar/cortar raster ni servicios. Reproducir con `tools/visual/encode_runtime_art.py` usando el Python bundled indicado en el registro de entorno.

Interior/caja/C01/O01/O02: regiones de los conceptos aportados. Callejón/rana: raster provisionales previos. Encadre/máscaras en `VisualArt.tsx`; cromo/caja/rana/sombra y UI son elementos DOM separados, no capas de pintura ni rig. Tapa gira/desaparece en 300 ms; anticipación 200; rana 500; cromo 400; asentamiento 200. Ilustración C01 solo se usa para C01. C02/C03/C04/O03/O04: grabados SVG individuales propios editables, **sustitutos de acabado**, no ilustraciones detalladas finales. Sabores conservan símbolo provisional. Cartas mantienen el mismo marco y textos. Arte ausente conserva acciones y entrega.

La adaptación aproxima composición, materiales y jerarquía; no reproduce todos los píxeles ni acredita el acabado final A12. Pendientes pintura por capas, tapa/interior dedicados, poses/contorno de rana, coherencia de acabado entre todas las ilustraciones y revisión de distribución T01. No nuevas dependencias de runtime, tipografía externa, motor 3D, GSAP o audio. `assetVersion` histórico 1 de las operaciones se conserva: manifest de presentación v2 no reescribe configuración de premio ni hallazgos anteriores.

## Verificación ejecutada

Mac arm64, macOS 27.0.1 (26A434), Node 24.20.0, npm 11.19.0. Chromium Playwright 156.0.8078.4 y WebKit empaquetado, emulación 390×844 y 320 px, fuentes al 200 %, movimiento reducido/arte oculto. Herramientas/versiones del lockfile, sin dependencias nuevas. Python/Pillow de `/Users/enricarandes/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3` utilizado solo para codificar recursos, no requerido por CI/app.

- Tipos, validación de contenido, 23 unitarias y build: [salida real](local-checks.txt).
- 82 pruebas de navegador (41 Chromium + 41 WebKit): [salida real](browser-checks.txt). Incluyen IndexedDB real, dos páginas, replay/abort/versiones/reset y recorrido es/en. Fixtures controladas para los seis premios son pruebas, sin estadística de sorteo ni premio forzado en aplicación.
- Revisión de imágenes reales: [galería](GALLERY.md), callejón/interior/detalle/resultado/álbum es/en, 320 px, ampliación y fase de salto. Se corrigieron texto incrustado en miniaturas, máscaras que dejaban fondo y pie de rana duplicado, foco al volver a lista y dos carreras de idioma. CUA comprobó además consultas e idioma en el navegador de la app.
- Peso: [Resource Timing fresco de producción](first-view.json), sin caché, red loopback. Menos de 1 MB; álbum conserva filtros montados pero difiere arte hasta abrirse. Recursos posteriores se cargan al consultar/confirmar. No mide móvil físico ni fluidez/fps.
- [Contraste de pares CSS](contrast.json): 7,38–10,88 para textos/controles seleccionados y foco 8,96. Cálculo de luminancia de superficies sólidas, no auditoría de toda la fotografía/gradientes ni certificación WCAG.

| Criterio | Estado en esta adaptación | Evidencia |
| --- | --- | --- |
| AC01 | Probado automático y revisión visual | Entradas escena/lista, vuelta/foco; cuatro opciones y lista |
| AC02 | Probado automático | Inicialización IndexedDB y consultas sin consumo, progreso 4/12 |
| AC03 | Probado automático y revisión visual | Seis porcentajes/versiones; stock intacto al consultar |
| AC04 | Probado automático | Commit/copia antes de ritual; resultado/álbum 5/12 |
| AC05 | Probado automático | Claves/replay/conflicto; dos páginas reales serializadas |
| AC06 | Probado automático | Reload/close/skip en cinco fases e idioma durante ritual |
| AC07 | Probado automático | Aborto y respuesta perdida; ningún éxito ficticio |
| AC08 | Probado automático y revisión visual | Familias/filtros/fichas/copia/stock cero; seis artes correctas |
| AC09 | Probado automático y revisión visual | ES/EN; fallos, agotado, recuperación; dos carreras reproducidas |
| AC10 | Parcial | Teclado/foco, 320/390, ampliación, reducido, arte ausente comprobados; lector audible y móvil físico pendientes |
| AC11 | Probado automático | Tablas/idiomas inválidos, datos/versiones originales y actualización |
| AC12 | Probado automático | Exportación/restauración válida/inválida, cancelación y reset |

Firefox mantiene el bloqueo de perfil registrado en I1 anterior; no se declara verificado. Móvil físico/lector: ejecutar las mismas consultas/apertura/recarga/álbum con VoiceOver/TalkBack, comprobar lectura única de premio, devolución de foco, pausa/reducido y scroll con zoom; registrar dispositivo/navegador y fallos. Para fluidez, registrar traza y frames en móvil físico durante callejón/ritual bajo condiciones explícitas. A17 sigue sin sesiones de usuarios.

## Git y siguiente paso

Commit español y push normal a main; CI existente sin cambios de permisos/despliegue. SHA/run/conclusión exactos se comunican tras observarlos en la entrega. Otros estudios y trabajo ajeno no integrados se conservan. Word SHA256 `7252db26b0ff4146b7ec211dcbd9624ba8e3440f59b3fd55ffea571886b2056c`, sin modificación.

Siguiente paso pequeño: revisar esta adaptación jugable en un móvil físico y validar la composición; después reemplazar los grabados y máscaras provisionales por una muestra de arte por piezas. No iniciar I2 ni producir lote/generación sin su autorización correspondiente.
