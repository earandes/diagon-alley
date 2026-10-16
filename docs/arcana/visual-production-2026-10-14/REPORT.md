# ARCANA · acabado visual e integración local A49/A50

14 octubre 2026. Dirección elegida: **Teatro de alquimia**. Resultado: lote integrado y versión local jugable con autoridad real. Enric respondió «No tengo uno; termina y valida la versión local» sobre backend externo gratuito: Sites queda aplazado; ningún sitio creado/modificado y ningún backend contratado. El objetivo actual es entregar el ensayo local, no simular un deployment completo con archivos estáticos.

## Entrega y fuentes

- **30 magos**: originales individuales, retrato/miniatura/figura del mismo sujeto. **Tres rivales y jefe**, seis escenas y 23 productos/objetos: 63 maestros de producción, con revisiones conservadas.
- **133 recursos activos**: 125 exports raster (7.513.821 bytes), ocho SVG auténticos de Phosphor, fuentes/MIT disponibles. Ilustraciones nuevas hechas con imagegen integrado, sin APIs de pago ni generación durante partidas.
- [Manifest completo](../../../design/arcana/production-v1/MANIFEST.json), [originales y preparación](../../../design/arcana/production-v1/README.md), [inventario reconciliado](ASSET-INVENTORY.json), [fuentes/exports/hash/recortes](../../../design/arcana/production-v1/exports.json).
- [Guía para sustituir temática](../CONTENT-PACKS.md): 263 mensajes es/en, treinta identidades, relatos, marca, paleta, imágenes y tiempos principales en paquete local; código de montaje/animación y tipografía editable. ARCANA activo, sin incorporar temática Harry Potter.
- [Coreografías/estados](CHOREOGRAPHIES.md), [guion para Enric](MANUAL-ENRIC.md), [galería actual](GALERIA.md), [comparación de diseño](../../../design-qa.md).

Original raster no significa pintura por capas/rig. Base/interior del envase son un archivo; tapa/sello/sapo independientes. Seis escenas estáticas, sin personaje o textos funcionales incrustados. Nueve recetas se representan combinando tres maderas y tres núcleos. Cuatro rarezas usan marco ilustrado común + tratamientos CSS, manteniendo campo/rango/estrellas guardados. No se inventan nueve maestros de varitas, cuatro marcos independientes o animación articulada.

## Recorridos y mejoras reales

| Requisito | UI/implementación | Verificación actual | Evidencia | Límite/siguiente acción |
|---|---|---|---|---|
| Entrada y orientación | Aprendiz ilustrado, objetivo, kit y dos Pactos iniciales explicados es/en | UI real + navegador con API local | 39-bienvenida; journey/team-beans | Observar comprensión con Enric; no resultado de investigación |
| Sapo completo | Caja/sello/tapa/base/sapo/carta GSAP; receipt antes; resultado/CTAs inmediatos | Compra y apertura reales, fases vistas, dominio/SQL/browser | 12,40,41,49; opening-visibility/celebration/reduced-final | Montaje no es rig; leve diferencia de perspectiva tapa/base documentada |
| Recuperación e integridad | Mismo ID/key, copia/stock/resultado guardados, fallback DOM | Stock/saldo/retry/recarga/doble/tabs reales; fallos inyectados identificados | Suites domain/integration/trial/PWA | No garantizar cuentas productivas o resistencia del hosting inexistente |
| Cromodex/equipo | Retratos, raridad/estrellas/stats en DOM, filtros, piezas ilustradas | UI real, forja/equipo y es/en; imagen ausente sigue funcional | 16–19,22; commerce/team-beans | Revisión de treinta retratos como assets; no treinta recorridos de premios naturales |
| Grageas | Tarro/cuatro sabores, stock/uso orientados, asignación preduelo | UI/team-beans + dominio/SQL | Compras/confirmación/log de combate | No apertura independiente ni colección de sabores/canje de copias |
| Mapa/arena | Escenas/íconos reales, figuras en Pixi con DOM alternativo, entrada/impacto/derrota | Dos motores, pérdidas WebGL, cinco por lado como fixture; ruta real al jefe | 23–28,35,36; perfiles | Sin observación de diversión/balance ni teléfono físico |
| Resultados/continuación | Resultado guardado y vuelta arriba; objetivo jefe completado | Jefe→Misiones y recarga | hud-results,32 | Bosque desbloqueado todavía no ofrece ruta jugable |
| Forja/bóveda | Ilustración de equipo/botín, confirmación y feedback postreceipt | Cancelar/confirmar/recargar reales en ambos idiomas | 20–22,29–31,37,38; commerce/integration | Canje consume llave; no dupes, destino o última copia |
| Confeti | DOM interno del juego, 28 fragmentos/1,2s, solo presentación pertinente | Descubrimiento/victoria/forja/bóveda; idioma/reload no reinicia; reduced desactiva | 41,49,50; visual-polish | Distinto de partículas de combate y confeti de Codex |
| UX/errores | Equipo fuera de Bazar/álbum; stock/plurales, revelación cerrable, orientación, rechazo definitivo; avisos en Opciones | Capturas actuales inspeccionadas y aserciones de navegador | 45–48; visual-polish; design-qa | Texto ampliado refluye/scroll; no declarar WCAG completo |
| Tema sustituible | Un selector y manifiestos, UI por ID; dominio inmutable | Copia aislada activa otra marca/nombres/color/retrato, ES/EN, build y estado de servidor idéntico | theme-after/validation/build + capturas | Tema neutro fixture; no activar/generar material de otra franquicia |
| Publicación | Local same-origin frontend + /api, Fastify/PG/Redis Docker | Preview compilado y smoke reales | preview.log; script/manual | Sites aplazado; API HTTPS/hosting PG/Redis externo faltan |

Los cuatro sabores siguen exactamente el catálogo de ensayo: Menta restaura 25% PV, Pimienta +30% poder un turno, Tierra −15% iniciativa dos turnos, Jabón falla el primer hechizo. Son consumibles asignados a combate; valores/probabilidades 25% cada uno no se cambian ni se convierten en balance observado. Sapo tiene 29 candidatos con 1/29 por identidad, sin aprendiz en su tabla actual.

## Comandos y resultados

Entorno: Mac, Node 24, dependencias locales fijadas por el proyecto. Servicios reales Docker `arcana-local`: PostgreSQL `127.0.0.1:55432`, Redis `127.0.0.1:56379`; socket Fastify bajo Vite local. No mocks en estos servicios. Las suites crean jugadores/namespace propios; no cambian balance ni credenciales del jugador de Enric.

| Comando real | Resultado | Registro |
|---|---|---|
| `npm run validate:skin` (incluido en build) | 263 mensajes es/en, 30 identidades, 133 archivos, tres relatos válidos | build-final.txt |
| `npm run typecheck` (incluido en build) | Correcto, aplicación y worker | build-final.txt |
| `npm test` | **304** correctos: 281 ARCANA + 23 históricos | unit-all-final.txt |
| `npm run validate:content` | Contenido vigente correcto | content-final.txt |
| `npm run test:integration` | **36** correctos, PostgreSQL/Redis reales | integration-final.txt |
| `npm run test:e2e` | **36** correctos, Chromium/WebKit, UI + autoridad real | browser-final.txt |
| `npm run test:arcana:browser` | **20** correctos, fixtures de clientes/arena/rendimiento/contraste | harness-final.txt |
| `npm run test:pwa` | **12** correctos, Chromium/WebKit, build/worker reales y red cortada/controlada | pwa-final.txt |
| `npm run build` | Correcto, activos finales incluidos | build-final.txt |
| `npm run verify:arcana:build` | Scanner ARCANA correcto; **9.057.054 bytes** totales distribuidos | scanner-final.txt |
| Copiar/activar/validar/compilar `qa-theme` en copia aislada | Correcto; estado autoritativo exactamente igual tras sustituir | theme-validation/build/after.txt |

**68 casos de navegador distintos**: 36 recorridos +20 fixtures +12 PWA. No sumar reejecuciones. Nuevos tests cubren contrato de contenido y caché diferida, celebration/lifecycle/resultados, missing art, rechazo definitivo y textura real. RED/GREEN conservados (`content-pack-*`, `pwa-art-*`).

Se conservan fallos intermedios y reparación: selector de sello antiguo, carrera de lectura de stock, límite real de 30 sesiones/hora del ensayo alcanzado al compartir namespace entre motores (config de pruebas ahora separa dos gateways/namespaces; regla runtime intacta), y un error de variable color/JSX capturado durante edición del renderer. `harness-during-edit.txt` no es aceptación final; suite y build pasaron después de corregirlo. Macros de captura con un selector de equipamiento demasiado estricto o idioma previo fallaron y se reanudaron en la **misma sesión guardada**, sin tocar saldo. Imágenes todavía cargando y videos de frames grises no se usan como evidencia final.

## Carga, memoria y renderizado

[download-initial.txt](download-initial.txt) combina bytes únicos del shell precacheado con las ilustraciones de bienvenida, por URL, mediante ResourceTiming + cuerpos de CacheStorage. **1.913.697 bytes sin comprimir**, incluidos scripts diferidos del shell, iconos PWA, escena y aprendiz: inferior a objetivo 3 MB/techo 5 MB. No es tiempo de carga en red móvil ni coste de una primera visita a servidor remoto. La medición aislada no interpreta `transferSize=0` de SW/cache como descarga gratuita; cuenta los cuerpos reales.

El **artefacto completo de 9,06 MB** es el catálogo distribuido; no se descarga al entrar. Arte WebP a demanda y lista pública versionada, con solo piezas usadas; API nunca cacheada, sin economía offline o cola nueva de gastos. No se precargan treinta figuras en GPU. Originales de alta resolución/Word/pruebas/temas alternativos quedan fuera del build ARCANA.

Perfiles [Chromium](five-unit-profile-chromium.json)/[WebKit](five-unit-profile-webkit.json): fixture diez unidades, cinco por lado, **diez texturas ilustradas únicas**, con personajes distintos en cada formación. 7.004.160 bytes RGBA decodificados (~6,68 MiB), sin confundir esta estimación con toda la memoria GPU. Heap JS disponible en Chromium, ausente en WebKit; no es memoria total de proceso. Heap Chromium final ~39,6MB (instrumento orientativo); muestras10s por320/390/1280, RAF ~60 y cientos de llamadas reales a `app.render`; pausa detiene el contador. FPS de pantalla se separan de renders reales, que también incluyen layout/carga. [performance-final.txt](performance-final.txt) repite las cuatro comprobaciones de texto/perfil sobre acabado final; no aumenta los 68 casos distintos.

No prueba 60 FPS en móvil físico, memoria GPU real o throttling térmico. Renderer carga/destruye únicamente las texturas de la escena; la última medición sí usa cinco ilustraciones distintas por cada lado, diez en total, como fixture explícito fuera del juego/artefacto.

## Diseño, accesibilidad y capturas

Comparación conjunta normalizada con muestra seleccionada, misma Confitería/stock1 y 390×844, en `comparison-full.png`/`comparison-product.png`. La muestra es dirección artística, no contrato de un Merlín garantizado o maqueta de todas las pantallas. Producción conserva material botánico/oro/madera y titulares serif, sustituyendo textos pintados por DOM y respetando estado real. Se corrigieron densidad, tapa/sapo poco legible y duplicación de figuras en arena; historial en [design-qa.md](../../../design-qa.md).

Capturas actuales inspeccionadas a 320/390/1280, es/en; teclado/foco, texto CSS200%, reduced-motion y fallback DOM. Se examinaron las treinta imágenes de retrato a escala de export, productos y escenas; no se afirma que todos los personajes se obtuvieron naturalmente en la sesión real. La galería distingue capturas intermedias/finales; las láminas de revisión no son assets del juego.

Consola: las sesiones nuevas responden `401` al GET inicial sin cookie, esperado antes de crear ensayo. Macro del recorrido real tras entrada y su continuación: `errors:[]`, sin errores JS nuevos. Abortos de arte/GSAP y errores HTTP inyectados solo corresponden a tests adversos identificados, no a un juego sano sin red. No declarar cumplimiento WCAG, lector audible, zoom nativo o instalación PWA física. Firefox/dispositivos siguen límites históricos, sin prueba nueva en esos motores/hardware.

## Autoridad y conservación

[authority-unchanged.json](authority-unchanged.json): 57 archivos cotejados con fingerprints actuales de auditoría; únicamente cambia el service worker de presentación. Dominio, casos de uso, configuración económica y backend se conservan. Ambos Word mantienen sus SHA-256 originales. Checkout ajeno intacto; no reset, commit, push o staging general. Build verificado localmente, sin CI remota ni deployment.

## Publicación y operación

Sites no dispone de una provisión PG/Redis verificada para esta arquitectura. El launcher es local HTTP loopback; no es un servidor productivo expuesto. Un Site nuevo privado necesitaría API HTTPS, launcher configurable, PG/Redis persistentes y secretos, cookie Secure/Origin/proxy, aislamiento y disponibilidad. Privacidad del frontend no protege automáticamente una API externa. No reemplazarlo por D1 o saldo local. Sin servidor gratuito existente y con decisión de Enric, queda **aplazado**; no existe URL de Sites verificada.

Se deja `http://127.0.0.1:5190/` con preview y servicios locales. Último smoke del artefacto final: entrada→dos Pactos→duelo→compra→apertura→Cromodex→recarga, estado autoritativo exactamente conservado (`smoke-final.txt`/captura51). Es operable mientras Docker/backend estén disponibles, con cookie de siete días y sin recuperación por cuenta. [Cómo entrar/repetir/conservar](MANUAL-ENRIC.md). El shell offline permite recuperar al reconectar; abrir, forjar y jugar requieren servidor. La actualización PWA espera cierre de clientes previos antes de activar nueva versión; no borrar progreso para actualizar arte.

## Pendientes priorizados

| Problema | Impacto/prioridad | Dependencia | Propuesta | Aceptación |
|---|---|---|---|---|
| Sin hosting real gratuito de API/PG/Redis | P1 para URL online; fuera del cierre local elegido | Servidor/acceso futuro | Configurar launcher HTTPS y Site privado nuevo mismo origen /api si viable | Deployment terminal + URL real, permisos y recorrido completo con autoridad |
| Teléfono/lector/zoom/instalación física sin evidencia | P2, aceptación física pendiente | Hardware y sesión de Enric | Ejecutar guion físico en ambos idiomas | Registrar dispositivo, versión, recorrido y observación real |
| Balance/diversión/comprensión sin usuarios | P3 tras ensayo | Observación con Enric/usuarios | Registrar pasos sin ayuda y razones para continuar | Evidencia separada de tests y afinación aprobada |
| Perspectiva tapa/base y retratos desktop podrían pulirse | P3 | Revisión visual posterior | Afinar registro/escala sin cambiar receipts | Comparación en contexto, alpha/continuidad y lectura conservadas |
| No cuenta recuperable, Bosque futuro, no intercambio de copias | Fuera de alcance, no bug nuevo | Decisiones de producto | Mantener explícito, no añadir durante acabado | Requisitos y aceptación separados si se autorizan |

No quedan P0 observados en recorridos locales cubiertos. Esto no elimina riesgos no ejercitados ni acredita producción/hosting, balance final o accesibilidad física.

## Respuestas para Enric

1. **Sí, hay jugabilidad local accesible hoy**: entrada→pactos/equipo→duelo→premio→colección→continuación, jefe/forja/bóveda. Abrir la URL local y comenzar una sesión nueva.
2. **Puedes comprar/abrir Sapos**, comprar/asignar/usar tarros de Grageas, forjar/equipar varitas y canjear una llave para abrir bóveda. No intercambiar duplicados ni abrir Grageas aparte.
3. **El lote solicitado está integrado**, con confeti y apertura ilustrada completa; fuentes y animación disponibles. No es rig/capas ni animación articulada; ajustes P3 y aceptación física/usuarios quedan explicitados.
4. **Sites necesita backend HTTPS/PG/Redis externo disponible**; Enric ha elegido finalizar local y aplazar esa publicación, sin gasto.
5. **El incremento mínimo para validarlo ya está disponible localmente**. [Guion](MANUAL-ENRIC.md), [cambiar temática](../CONTENT-PACKS.md), [capturas](GALERIA.md).
