# A75 · Recuperación, decisiones y presencia ilustrada

Implementados F01–F11 en `feature/a75-experience-fixes`, PR6. **A75 pasa en CI 39059090478 sobre head 889886d; regresiones históricas del mismo job todavía pendientes.** No main/despliegue/publicación.113 casos correctos,175 omisiones deliberadas por proyecto,0 fallos/0 reintentos. Merge probado8d38776 y head 889886d comparten árbol7a6e66a4ad74945c59bd2efa8cfe6ba412173f00.

## Qué cambia en los recorridos

**Entrada → preparación → equipamiento → recuperación.** La primera activación excluye otras entradas hasta acabar POST+carga.401 conserva jugador, partida, key y receipt; la salida de recuperación continúa disponible al cerrar el inspector. Error o resultado incierto de equipo se comunica dentro del inspector superior. Otra partida requiere entrada explícita, sin intención pendiente y sin migrar recursos; su preparación no hereda selección anterior.

**Instancia → consumible → combate → colección.** Consultas de una run activa toman sus reglas efectivas, incluidos bonos y probabilidades; nueva expedición toma vigentes y el fallback histórico es explícito. Puesto y procedencia distinguen repetidos en Encuentro y preview sin exponer IDs. Filtros de afinidad/identidad a demanda conservan instancia, equipo y borrador. Duelo/jefe comparten tarro con stock y asignación sin fracción obligatoria. Solo confirmar combate consume; el sabor corresponde a la activación del receipt. El botín nuevo se distingue del tarro consumido.

**Ruta → arena → desenlace → continuación.** Los nodos futuros permiten consulta pública sin resolverlos; el libro identifica etapa/opción y conexiones, con teclado/toque y vuelta de foco. Fallback mapa/lista sigue visible sin imágenes; Ajustes ya tenía el suyo y se conserva. Preferencia propia y protección del sistema se explican por separado. En móvil denso la ilustración usa espacio real restante por peana, conservando diez figuras/nombres/PV, controles, inspector y replay.

## Evidencia y estilo

- Se midió el baseline Linux antes de tocar CSS y se compararon dos alternativas. La primera implementación mostró un ciclo intrínseco de altura, reproducido y corregido; no se ocultó contenido ni se relajó el encaje.
-390×844/5×5: figura propia de una línea pasa~50,8→69,1 px; con dos líneas52,9 px. Huella alfa mediana Diagon~49→66 px, ARCANA~40→54,6 px. La transparencia propia del arte permanece. No rig nuevo o deformación.
- Tres paresAB/BA/AB contra runtimeA73/937a0a1: mediana P95 rAF 16,7 ms en ambas variantes; activación→frame listo mediana317,9 ms referencia y329,7 ms actual. **No se atribuye mejora de arranque** ni se llamaGPU/frío universal a esta fixture.
- Se inspeccionaron PNG seleccionados: equipo separado del filtro, objeto del nodo protagonista, identificación de instancias y error en contexto de equipo. Las hipótesis de comprensión y comodidad siguen pendientes; una captura no acredita animación.
- Sin arte, librerías, audio, reglas o monedas nuevos. Se conservan Teatro de alquimia, ES/EN, ambos packs, reloj/renderer/BattleLog, economía y autoridad.

## Matriz de entrega

Todos vigentes por contraste del baselineA74. Estado común actual: contrastado → implementado → probado en unitarios/A75Linux; falta cerrar regresiones globales, nunca observación humana atribuida.

| Finding | Evidencia principal | Límite explícito |
|---|---|---|
| F01 sesión |401 real y salida tras cerrar inspector, no nueva entrada automática; controlador conserva propietario/receipt |Ensayo cookie no es autenticación productiva; recuperar requiere sesión válida coincidente |
| F02 entrada |POST retenido, doble activación/Enter, error y reintento deliberado, starter-kit único |Exclusión por interfaz; no transacción distribuida de dos entradas vírgenes |
| F03 reglas |Snapshot deliberadamente distinto en bonos/pesos, ES/EN/packs, source inmutable |Histórica sin snapshot y afinidad aún no registrada según fallback documentado, no historia inventada |
| F04 inspector |Error401 y respuesta perdida postCOMMIT, recuperación misma key/1 POST, modal abierto |Offline/storage/mismatch adicional en unitarios, no avería física de IndexedDB |
| F05 instancias |Tres unidades de identidad/PV/PM iguales, puesto/procedencia distintos, selección/preview delID correcto |Fixture de componentes; contratos reales de Encuentro en integración existente |
| F06 arena |72muestras3×3/5×3/5×5 y seisproyectos, texto/reflujo acotado, frames y controles/log |No dispositivo físico, GPU real o juicio humano de personalidad |
| F07 ruta |Consulta/lista/conexiones/foco,0 POST y estado real igual |Solo información pública, nunca semillas/ofertas o premios futuros |
| F08 colección amplia |30 copias, identidad/afinidad/filtro vacío/limpieza/equipo distinto, borrador al swap |Colección declarada de fixture, no ganada en cuenta habitual |
| F09 iconos |404 nativo limitado a ambos iconos, fallback visible/localizado y usable |Ajustes previo conservado, no se reclama como implementación nueva |
| F10 reducido |Sistema×propia4 combinaciones ES/EN, recarga/swap, cambio durante replay |Ocultación sintética no segundo plano físico; no reinicio del log |
| F11 grageas |Stock0/3 fixture y compra/stock real/asignar/mover/quitar/cancelar/consumo/sabor/recarga/receipt real |Premio puede añadir otro tarro; se reconcilia con reward confirmado sin alterar reglas |

## Documentos y límites

[Contrato/plan](CONTRACT.md), [QA](QA.md), [recuperación](RECOVERY.md), [preparación](PREPARATION.md), [mapa/preferencias](MAP-SETTINGS.md), [arena](ARENA-DESIGN.md), [galería](GALLERY.md), [rendimiento](PERFORMANCE.md), [compatibilidad](COMPATIBILITY.md), [assets/movimiento](ASSETS-AND-MOTION.md), [revisión del diff](DIFF-REVIEW.md), [sesión humana pendiente](HUMAN-CHECK.md).

Mac protegido: ningún navegador/captura/perfil local; CI Linux en serie con guard/bloqueo/watchdog/un worker/cero reintentos. Cuenta habitual intacta. Unitarios/build/tipos locales y servicios reales en CI; no se confunden doubles y autoridad. Evidencia histórica/Word conservados. Errores de fixture/inyección/copy/sincronización se corrigieron por causa, con fallos/cancelaciones preservados; no «pasó al repetir». Los perfiles intermedios se conservan, incluidos extremos.

Pendiente: terminar regresiones del candidato, registrar CI final y equivalencia del commit documental, verificar rama/remoto/main sin integrar. Después: lector hablado, dispositivo físico, comprensión, ritmo y motivación con una persona. No certificación WCAG, diversión o retención acreditadas por automatización.
