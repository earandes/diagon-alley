# A57 · Diagon Alley jugable

15 octubre 2026. Rediseño **implementado en el repositorio**, por autorización de Enric posterior a la investigación. Trabajo local, coste adicional cero, sin publicar, desplegar, commit o push. [Galería](GALLERY.md), [diseño vigente](../../../DESIGN.md), [contrato previo](CONTRACT.md), [prompt aplicado](PROMPT.md), [investigación y prompt anteriores](../game-ui-research-2026-10-15/REPORT.md).

## Resultado

Diagon Alley es la presentación predeterminada. Ajustes permite cambiar a ARCANA sin recargar, gastar o sustituir la partida. Los nombres, ilustraciones, moneda representada, paleta y escenas dependen del paquete; los IDs y snapshots económicos conservan su significado. Una preferencia ARCANA guardada se respeta: un jugador existente puede necesitar seleccionar Callejón Diagón en Ajustes → Mundo.

El escenario ocupa la composición; atlas, álbum, tienda y carta son accesos ilustrados. Idiomas y movimiento reducido viven dentro de Ajustes. Se conservan etiquetas semánticas, foco y texto breve para precios, estados y errores; retirar texto visible no elimina la información accesible. Las notificaciones de operaciones son sellos compactos con detalle a demanda.

El mostrador permite seleccionar el producto físico y confirmar su precio; la compra sin saldo queda deshabilitada y el servidor mantiene su propia validación. La apertura de rana tiene anticipación, liberación del sello, tapa, salto y escape de rana, giro del cromo y resultado estático. La secuencia empieza después de guardar el receipt, se puede omitir y respeta movimiento reducido. Pixi dibuja una ráfaga finita de partículas con un único render explícito por fotograma; se retiró el listener de render automático que TickerPlugin instala incluso con autoStart=false; no hay sorteo visual ni ticker decorativo permanente.

El álbum utiliza cuatro cartas por página y filtros a demanda. El archivador de viaje conecta mapa, colección y bóveda con los destinos existentes. El maletín registra los cuatro sabores actuales solo desde activaciones propias verificadas en receipts: comprar, seleccionar o mirar una Gragea no cuenta como descubrirla. Las partidas con activaciones válidas anteriores las recuperan automáticamente, sin migración o concesión nueva. [Contrato y pruebas de sabores](FLAVORS.md).

Pactos, preparación, combate automático, recompensas, equipo, taller, jefe y bóveda continúan usando las reglas autoritativas existentes. El mapa mantiene el grafo aleatorio A56, iconos específicos y una región jugable; no se implementan regiones nuevas bajo una mera sustitución de fondo.

## Dirección y producción

Se produjeron tres composiciones locales; el integrador eligió «Callejón de maravillas» dentro de la delegación del encargo. Índigo, ventanas ámbar, latón, madera y púrpura de confitería dan continuidad al escenario. No se presenta esta selección como una votación de Enric. [Conceptos, fuentes y manifests](../../../design/diagon-alley/README.md).

El paquete Diagon contiene162 roles:119 propios y43 compartidos explícitamente con ARCANA. Incluye caja pentagonal con fuente Blender y piezas alineadas, rana raster, objetos, marcos, destellos, moneda propia y30 personajes vectoriales con90 exportaciones WebP. Los roles pueden compartir un mismo archivo: no equivalen a162 ilustraciones distintas. Texto funcional fuera del arte.

**Calidad provisional:** los retratos son una familia vectorial propia más sencilla que una pintura final. Los fondos son raster planos y la rana es un sprite sin rig; la caja sí dispone de geometría/piezas editables. Se reutilizan fuentes históricas documentadas, sin nuevas llamadas a generación con créditos, fotografías de actores o recursos extraídos de juegos comerciales. El software gratuito y el arte propio no acreditan derechos de distribución de la franquicia. Esta entrega privada no se publica.

## Herramientas y arquitectura

Se mantiene React19/TypeScript/Vite, PixiJS8.22, GSAP3.15, Fastify, PostgreSQL y Redis: ya separan escenas, coreografía y autoridad, por lo que otro motor no resuelve la composición. Motion gratuito14.2 ya estaba instalado; las secuencias nuevas usan GSAP/Pixi y CSS, sin Motion+.

| Herramienta | Uso efectivo | Licencia registrada |
| --- | --- | --- |
| Impeccable local | Contexto, jerarquía, estados y pasada de detector sobre UI | Apache2.0 |
| Taste/redesign, game-ui-ux, game-feel y Pixi rendering | Composición de juego, HUD, interacción y efectos | MIT / Apache2.0 según paquete |
| Blender portable4.5.9LTS y scripts SVG/Python/WebP | Caja editable, props, retratos, moneda y conceptos locales | BlenderGPL; recursos con procedencia propia/histórica |
| Pixi Filters6.1.5, incorporación exacta | GlowFilter gratuito de la ráfaga de apertura | MIT |
| Cinzel local,125468bytes | Tipografía de títulos, sin petición remota runtime | SILOFL1.1, texto conservado |
| Playwright Test1.64; CLI0.1.22 ya disponible | Flujos, estados, capturas y perfiles mediante Playwright Test | Apache2.0 |

Agency Game/Economy Designer y Game Design Workshop estaban disponibles como guías de la preparación anterior; no se atribuye a sus perfiles una simulación nueva o validación del interés. AssetPack y Penpot fueron alternativas investigadas; no se instalaron al no ser necesarios para este incremento. [Orígenes/revisiones/licencias](../../../tools/arcana/design-tools-sources.json). No se cambió catálogo global de skills/MCP.

## Integridad y pruebas

No se añadieron endpoints económicos, tablas SQL, precios, probabilidades o recompensas. La colección de sabores es una proyección inmutable sobre receipts y asignaciones verificadas. Transacciones, recuperación y consumo siguen en servidor; preferencias visuales son opcionales en almacenamiento local. El swap no cambia contratos persistidos.

[Comparación de56 archivos con referencia A55](authority-comparison.json):46 iguales y10 diferentes. Esa referencia precede A56; sus diferencias **no pueden atribuirse íntegramente a A57**. No existe una captura hash completa justo antes de A57, por lo que no se usa el registro para prometer que todo el dominio está intacto. La evidencia pertinente son las pruebas de estado exacto, reintento, rollback y recuperación. Los Word históricos se conservan.

| Verificación ejecutada | Resultado |
| --- | --- |
| `npm run build` incl. validación Diagon y ambos proyectos TypeScript | Correcto;348 mensajes bilingües,30 personajes,162 roles |
| Validador completo ARCANA | Correcto;348 mensajes bilingües,30 personajes,150 roles |
| `npm test` |339/339,42 archivos |
| `npm run test:integration` contra servicios reales |37/37,8 archivos |
| `npm run verify:arcana:build` | Correcto; histórico I1 excluido; build temático dual privado |
| Detector Impeccable | `[]`; no certifica accesibilidad o calidad artística |
| Navegador final |124 casos distintos correctos por cobertura consolidada:76 recorrido+20 harness+16 A57 compilado+12 PWA; [desglose](BROWSER-TESTS.md) |

Entorno: macOS, Node24.20.0 y npm11.19.0. El build incluye aviso de chunks mayores de500kB; no se oculta cambiando el umbral. El scanner certifica12,15MB distribuidos aproximadamente, no transferencia inicial: los paquetes/ilustraciones se cargan según recorrido.

Logs: [build](build-final.txt), [unitarios](unit-final.txt), [integración](integration-current.txt), [scanner](scanner-final.txt), [RED/GREEN de sabores](FLAVORS.md), [revisión independiente](REVIEW.md). La regresión de76 casos se consolida de71 correctos en la corrida amplia más los5 fallos recuperados en pases focales (cuatro mapas y un recorrido; el pase focal también repite otros tres recorridos). No se afirma una corrida única76/76 o124/124. Las16 de A57 y12 de PWA finales sí pasan en sus respectivas corridas completas. Los fallos intermedios se conservan separados: los resultados finales no se presentan como una primera corrida sin fallos.

## Rendimiento medido

Build compilado, sesiones técnicas nuevas, suites GPU serializadas. Apertura a1280×900, muestra fría de634–667ms: Chromium43,50–43,51FPS y pico183–200ms; WebKit59,94–61,32FPS y pico31–33ms. P95 Chromium16,8–33,3ms y WebKit30–32ms. El objetivo de60FPS **no se cumple de forma uniforme en la apertura fría**. Se eliminó un render duplicado confirmado en el código, pero sigue pendiente investigar el pico inicial; no se atribuye a shaders o carga de recursos sin aislamiento adicional.

En esas sesiones se observaron0,803MB transferidos en Chromium y1,768–1,770MB en WebKit, con caché/service worker registrados por URL. No equivalen a un presupuesto universal de primera visita sin caché ni al peso de todo el contenido. [Perfiles completos](BROWSER-TESTS.md).

Arena: seis muestras de10s, cinco unidades por lado, tres tamaños por motor; aproximadamente60FPS, diez texturas y7,0MB decodificados; pausa detiene draws. La arena usa harness con CSS/renderer reales, no una medición de todo el producto compilado ni un teléfono físico. Permanecen avisos Pixi BindGroup observados durante limpieza; no se presentan como resueltos por la opción releaseGlobalResources=false. No se observaron errores de página o pérdida de operaciones asociada en los casos que pasaron.

## Alcance de evidencia y pendientes

Las sesiones de Playwright tienen cuentas, cookies y namespaces propios. No se accedió a la pestaña5194 del propietario después del bloqueo de la herramienta. Las capturas son estados reales de QA independiente; los conceptos son composiciones; ninguna es una prueba con usuarios. La [sesión guiada preparada para ordenador](SESSION.md) aún no se ha realizado; la hipótesis de que el juego invita a continuar sigue pendiente. No se afirma retención, demanda, rendimiento en teléfono físico, lector de pantalla o conformidad WCAG2.2AA.

Durante la revisión visual se corrigieron también el contraste del CTA del mostrador en reposo y hover (el nuevo assert detectó1,465:1 antes de corregir el estado heredado), el encuadre completo del diálogo nativo de apertura y dos solapamientos a320px/horizontal. Son correcciones comprobadas por geometría/estados y captura, no deducciones del árbol accesible.

La galería usa A55 como referencia histórica anterior y A57 como estado final de cuentas técnicas diferentes; no es una comparación controlada de la misma partida. Las pruebas A56 que escribían en su carpeta de evidencia se redirigieron a A57; esas imágenes A56 regeneradas no se usan como baseline.

## Balance y siguiente producción

Se conservan los escenarios existentes, sin aplicarlos a partidas: [6000 recorridos sintéticos A56](../visual-nodes-2026-10-15/BALANCE.md), [escenarios de colección A52](../game-feel-2026-10-14/balance-scenarios.json). Son sensibilidades anteriores, no experimentos nuevos ni observaciones humanas.

| Decisión pendiente | Comparación siguiente | Estado actual |
| --- | --- | --- |
| Duplicados y evolución | Línea base frente a alternativas de utilidad/coste; medir tiempo a mejora, excedentes y diversidad de equipo | Reglas actuales conservadas; no canje nuevo |
| Nuevos sabores | Cuatro efectos actuales frente a catálogo ampliado; comprobar frecuencia, decisiones y completitud con simulación fuera de partidas | Solo cuatro sabores reales |
| Regiones | Una región frente a campañas con adversarios, paisaje y complejidad propios | [Roadmap](../REGIONS-ROADMAP.md), sin desbloqueos ficticios |
| Interés por continuar | Sesión humana10–15min con objetivos, sin solución anticipada; dudas, ayudas y motivo de siguiente acción | Pendiente, no sustituida por automatización |

Prioridad de producción posterior: validar con Enric la interacción del mostrador/mapa y la coreografía, mejorar pintura/animación articulada si esa dirección se acepta y después ampliar catálogo/regiones con balance separado. La implementación actual hace comprobable ese recorrido; no declara terminado el arte final o la progresión futura.
