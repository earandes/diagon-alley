# A49 · Plan previo de producción visual, integración y publicación

14 octubre 2026. Estado previo conservado: encargo autorizado; después se eligió dirección en A50 y se completó local bajo A51. No es evidencia de lote, implementación o publicación. Fuentes: mensaje actual, PRD 1.0.18, DECISIONS A49 y auditoría del 14 octubre.

## Recorrido y alcance

Estado inicial observado: aplicación conectada localmente, retratos sustituidos por glyphs/geometría, apertura GSAP de carta sin envase, sin confeti. Huella del código/config/pruebas de la auditoría comprobada: sin cambios al iniciar este trabajo. Datos, IDs y reglas permanecen.

Entrega autorizada: producir assets originales, integrarlos en el juego real, resolver fricción UX, validar con autoridad SQL/Redis y publicar Site nuevo privado. La dirección visual ARCANA no está seleccionada en documentos/manifests actuales. Primero se generan tres muestras comparables; el usuario elige una antes del lote. La autorización de implementar/publicar ya existe y no se pide otra vez por decisiones rutinarias.

Recorridos objetivo: entrar → mapa/pactos → duelo → premio → Confitería/compra/Sapo → revelación → Cromodex/equipo → continuar; forja y llave→bóveda enlazadas al mismo inventario. Grageas se asignan antes del duelo, no se abren aparte. Bosque sigue futuro. Sin audio, canje de duplicados, nuevas monedas/reglas, login productivo o balance elegido.

## Brief de las muestras

Pantalla móvil de Confitería, composición a 390×844; personaje Merlín/Común/una estrella, envase de Sapo y carta como muestra artística, no sorteo observado. Verde profundo/dorado y textos DOM legibles de la identidad existente; un CTA principal y las cuatro rutas actuales. Compactar el HUD, mostrar cantidad y uso de Grageas, separar retrato/texto. Los conceptos raster no sustituyen componentes, no anuncian partida real y sus textos son composición candidata.

Referencias inspeccionadas y a adjuntar a cada generación: capturas 05-confiteria-es y 07-cromo-confirmado-es de la auditoría. No usar ilustraciones históricas de la franquicia.

Direcciones propuestas para comparar, todavía sin aprobación:

- **Teatro de alquimia:** pintura detallada 2D, cálida y material; producto en primer plano sobre mostrador y carta/retrato visible como muestra. Recomendada por continuidad ilustrada, profundidad por piezas y lectura móvil.
- **Gabinete de grabados:** folclore ilustrado con tinta, cobre y papel; escaparate editorial de colección, retrato grabado y caja como objeto artesanal. Mayor definición gráfica; menos volumen/expresividad de personaje.
- **Luz del Bulevar:** gouache digital de fantasía nocturna, color local luminoso y encuadre de producto protagonista; énfasis en personaje/revelación. Mayor efecto escénico; vigilar contraste, halos y consistencia entre treinta identidades.

Cada muestra es una imagen independiente de una pantalla/idea, no una plancha de alternativas. Tras los tres resultados, los números se vinculan al orden en que aparecen en el chat. No producir lote antes de selección.

## Inventario y formato

Inventario estructurado: [ASSET-INVENTORY.json](ASSET-INVENTORY.json), derivado de IDs actuales. Estados iniciales planned; dimensiones/pesos son presupuestos de exportación propuestos que se validarán con arte real.

| Familia | Entrega | Fuente maestra y exportación previstas |
|---|---|---|
| 30 magos | Retrato, miniatura y figura de arena coherentes por identidad | Maestros individuales raster; retrato 512×640 WebP, miniatura 96×120 WebP, figura hasta 384×512 con alpha |
| Rivales/jefe | Tres variaciones de rival y una apariencia de jefe asociadas a posiciones existentes | PNG transparente/derivado optimizado; solo presentación, sin alterar definición de combate |
| Cartas | Dorso; marco/ventana; cuatro tratamientos de rareza; pendiente/repetido | Piezas independientes; HTML para texto, rango y estrellas; no nuevo rango/shiny |
| 6 escenas | Bulevar, Pasaje, arena, Confitería, Taller, Bóveda | Maestros por escena; encuadres móvil/escritorio, fondo/primer plano separados donde se animen |
| Sapo | Envase/caja base, tapa, interior, sello, sapo y sombra | Mismo diseño/perspectiva/registro; alpha, pivotes y dimensiones por pieza |
| Grageas | Tarro y cuatro sabores existentes | Ilustraciones por producto; no introducir resultado persistido de apertura independiente |
| Equipo/botín | Tres maderas, tres núcleos, nueve combinaciones de varita existentes, modelos de escoba, llave/cofre | Assets propios por identidad visual; atributos permanecen DOM |
| Nodos/monedas | Seis tipos de nodo, Coronas, Esencia y estados | Familia coherente; librería/recursos vectoriales auténticos o raster generado, no dibujo que suplante ilustración final |
| Efectos | Confeti; proyectil/impacto; entrada/derrota; feedback de forja/bóveda | Animación procedural sobre assets, partículas visuales sin RNG económico; lifecycle explícito |
| Marca/PWA | Emblema/dorso e iconos derivados seguros | Si cambia acabado del emblema, conservar identidad/nombre; validar máscara y tamaños |

Maestros y prompts: `design/arcana/production-v1/`. Exports usados por Vite: `src/arcana/assets/`. Manifests trazables por asset: ID/identity/usage/path/author/tool/prompt/references/version/provenance/source/dimensions/crop/pivot/variants/alpha/alt es/en/estado. No declarar capas o rig inexistentes. Estado final exige inspección individual y en contexto después de elegir dirección.

## Coreografías propuestas

Sapo, solo tras receipt: 0–250 ms sello; 250–650 tapa; 650–1000 sapo aparece; 1000–1500 carta/retrato; 1500–1900 celebración discreta y estado legible. Tiempo total candidato 1,9 s, ajustable tras muestra; resultado guardado consultable inmediatamente. Texto, estados y CTA «Ver en Cromodex/Continuar» en DOM. Omitir lleva a final; reduced-motion final directo. Recarga recupera receipt/copia sin sorteo ni segunda concesión.

Confeti: una ráfaga ≤1,2 s por presentación pertinente, ligada a ID de receipt; área decorativa y sin interceptar puntero. Idioma/refresco no repiten; cerrar/reduced-motion cancela. No usar confeti de la aplicación Codex como sustituto de confeti del juego.

Arena: entrada breve sin demorar acceso al resultado; feedback de actor/objetivo desde BattleLog, HP/PM reproducidos sin calcular daño. Pausa detiene ticker y partículas; 2x acelera reproducción; omisión estática; pérdida de WebGL no cambia economía. Forja/bóveda: feedback corto después de recibo, sin segundos de espera obligatoria.

Assets ausentes: resultado DOM y acciones siguen disponibles; error de asset nunca anuncia fallo económico ni reinicia operación. Tests de lifecycle, eventos y carreras de carga antes de integración cuando corresponda.

## Mejoras UX incluidas

HUD compacto fuera de mapa/arena; retrato separado de atributos; stock de Sapos/tarros y uso de Grageas visible; formación inicial y temporales explicados; revelación cerrable/CTA; victoria y siguiente paso accesibles sin recorrer toda arena; distinción estado guardado/playback; plurales; objetivo jefe completado; carga solo al cargar/enviar, no tras rechazo definitivo. Navegación/IDs/operaciones e inventario conservados. Todas las cadenas es/en desde el primer cambio.

## Presupuesto técnico propuesto

- Descarga inicial completa: objetivo ≤3 MB, techo 5 MB conforme PRD. Medir red y worker además de archivos; treinta retratos y seis maestros no se descargan al entrar.
- Retrato WebP: objetivo ≤90 KB; miniatura ≤10 KB; figura con alpha ≤140 KB; escena activa optimizada ≤600 KB. Revisar calidad en tamaños reales, no degradar automáticamente para afirmar cumplimiento.
- Texturas decodificadas por escena: objetivo ≤64 MiB estimado con width×height×4 y medido cuando exista instrumento; destruir al salir, sin cargar todo el catálogo en GPU; DPR máximo actual 2.
- PWA actual precachea todos los assets compilados. Requiere revisión al añadir lote: separar shell esencial/arte de demanda con lista pública versionada; API jamás cacheada, economía siempre online. No incumplir offline shell para ahorrar bytes.
- Perfil: cinco unidades por lado, muestras por 320/390/1280, contador de renders/RAF/p95/memoria disponible, sin atribuir Mac a móvil. Objetivo 60 FPS sin darlo por cumplido con tests de existencia de render.

## Criterios de aceptación

1. Cada identidad tiene retrato propio inspeccionado, misma identidad en cartas/arena; textos/atributos no dependen de bitmap.
2. Las seis escenas/objetos existentes están integrados en el recorrido; sin botones de funciones futuras inventadas.
3. Apertura completa envase→sapo→carta usa recibo confirmado y cuenta una copia; skip/reload/idioma/fallo de imagen conservan resultado.
4. Confeti único, limitado y reducido; no intercepta acciones ni revive por refresco/unmount.
5. Mejoras UX verificables en ambos idiomas, teclado, foco, 320/390/escritorio y texto ampliado.
6. Casos económicos/persistencia/recovery/tabs/stock/saldo/forja/bóveda y PWA mantienen contratos; pruebas pertinentes RED/GREEN de cambios, servicios reales además de doubles.
7. Tipos/content/dominio/integración/browser/PWA/build/scanner correctos. QA visual con capturas actuales y límites físicos explícitos.
8. URL privada con API/PG/Redis reales, sesiones HTTPS y aislamiento; deployment terminal y smoke desde URL. No publicar frontend desconectado.

## Publicación: comprobación inicial y plan

Sites respondió a listado completo: ningún ARCANA registrado. Capacidades inspeccionadas cubren static/Worker, variables, privado y D1/R2; no hay provisión PG/Redis comprobada. No hay manifest/deploy/.env ni variables ARCANA/Sites/PGHOST/REDIS_URL/DATABASE_URL configuradas para hosting en este proyecto/sesión. Esto no prueba inexistencia de recursos en otras cuentas: solo falta una ruta configurada/verificada para este encargo.

El launcher conecta PG `127.0.0.1:55432`, Redis `127.0.0.1:56379`; el gateway exige HTTP loopback. Hace falta launcher HTTPS configurado, secretos, cookie Secure, Origin y proxy acotado. Preferencia: frontend Sites y `/api` mismo origen a backend externo disponible sin gasto; PG/Redis no se sustituyen por D1. Privacidad del Site no protege por sí sola una API externa.

No crear Site ahora: primero dirección elegida, arte integrado y validación. Al publicar, utilizar source/manifest del nuevo Site y credenciales por canal seguro; no empujar todo el checkout ajeno al remoto original ni reinicializar en starter. Reutilizar ID y reconciliar respuestas inciertas.

Si falta infraestructura gratuita verificable, completar trabajo local independiente tras la elección visual y pedir solo recurso/acceso indispensable. No comprar servicios, crear túnel público o cambiar autoridad por conveniencia. Disponibilidad/sesión temporal y persistencia se documentan; no prometer cuenta recuperable.

## Estado al preparar la ideación

Documentado: alcance, inventario, coreografías/presupuestos propuestos, aceptación y límites iniciales de hosting. Pendiente: selección visual, lote de producción, código, QA nuevo y publicación. Las pruebas de la auditoría son baseline previo, no evidencia de trabajo A49 todavía.

Ideación ejecutada después del plan: tres PNG independientes guardados/inspeccionados, 853×1844, con referencias actuales adjuntas a cada llamada. Orden visible 1 Teatro de alquimia, 2 Gabinete de grabados, 3 Luz del Bulevar. [Muestras/evaluación/prompts/manifest](../../../design/arcana/concepts-2026-10-14/README.md). Recomendación 1; Selección recibida el 14 octubre: Enric elige 1. A50 añade contenido/arte/animaciones sustituibles; [contrato y guía](../CONTENT-PACKS.md). La puerta de selección queda satisfecha; continuar producción e integración conservando ARCANA activo.


## Cierre de este plan previo

A50 selecciona Teatro de alquimia; A51 cambia entrega a local validada sin servidor externo/Sites. Alcance/criterios se implementaron conforme [informe](REPORT.md), [coreografías reales](CHOREOGRAPHIES.md), [guion](MANUAL-ENRIC.md) y [manifest](../../../design/arcana/production-v1/MANIFEST.json). La ruta de exports realmente usada es `src/arcana/presentation/content-packs/arcana/art/`, sustituyendo la organización inicialmente propuesta. Entrada medida1,91MB, catálogo diferido9,06MB; PWA no precachea todo el arte. Direcciones/formatos/tiempos de las secciones iniciales son planificación histórica, no la evidencia final. Fuentes y manifests disponibles; no rig/capas inexistentes. Publicación y aceptación física/usuarios no se declaran cerradas.
