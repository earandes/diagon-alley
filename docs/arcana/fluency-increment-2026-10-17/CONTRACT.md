# A73 · Fluidez de la expedición · 17 octubre 2026

## Contrato previo

Autorizado: investigación, correcciones justificadas, pruebas, documentación, rama/PR y push a main después de validar. Sin despliegue/publicación, dependencias nuevas, herramientas con créditos o cambios globales. Base comprobada: main4be35f882f98bb20f49998f1f5d9b5fc7c1147ca; árbol rastreado limpio. A70/A71 integrados; CI39021060226 correcta sobre15b1a99, actualización posterior exclusivamente documental. Archivos no rastreados ajenos se conservan.

Recorrido: entrada → preparación → mapa → primer combate → mapa → jefe → cierre → botín → otra preparación explícita. Consultar/cancelar no consume; confirmar sigue guardando la operación antes del replay. No se cambia dominio, contenido, autoridad, snapshots, economía, log o comportamiento de recuperación. Diagon/ARCANA, ES/EN, todas las unidades/PV, teclado/foco, reducido, pausa/Auto/2x/inspector/ocultación/omisión y fallback se conservan.

## Hechos e hipótesis

Histórico, no nueva medida: jefe5×5 cálido P95rAF16,8ms; genérico3×3 alternó33,4/16,8/33,4ms sin cambiar runtime. Picos de arranque≈233ms. No hay causalidad aislada.

Código: React publica fronteras de fase; geometría DOM se mide al cambiar combate/idioma/tamaño. SceneAtmosphere ya se suspende en arena. Cada actualización de escena marca geometría sucia; cada textura resuelta llama paint; Graphics de efectos se reconstruye durante replay. Estos son trabajos existentes, no causas demostradas de las cifras anteriores.

Hipótesis a contrastar: creación del contexto/importación frente a primer upload; geometría redundante por fases; trabajo Graphics y escrituras DOM por frame; influencia de instrumentación/scheduling/software del runner. No asumir GPU, fuga, React o decode como culpable.

## Plan vivo y aceptación

1. Leer fuentes/skills/contratos y registrar estado inicial: hecho.
2. Instrumentación acotada y referencia ejecutable: completadas en fase Linux39026178568, conjunto global cancelado tras guardar artifact.
3. Medición Linux, causas y presupuesto de arranque: primera referencia y decisiones enDIAGNOSIS.
4. Correcciones mínimas con pruebas relevantes: invalidaciones agrupadas/geometría retenida implementadas;560unitarios y78PGRedis correctos; comparación gráfica pendiente.
5. Comparación equivalente y recorrido completo, inspección seleccionada: pendiente.
6. Tipos/build/unitarios/PGRedis y regresiones afectadas: pendiente.
7. Integrar candidato validado, verificar main/CI, documentar límites: pendiente.

Objetivo sostenido: P95rAF≤20ms en ventanas declaradas10s; tres muestras genéricas y tres de jefe, sin elegir solo la favorable. Presupuesto de arranque se elegirá tras medir. Se distinguen click→operación guardada→DOM utilizable→arte listo→coreografía; no se desplaza la espera a otra pantalla. Sin caché ilimitada ni contenido oculto.

Recursos implicados: SceneCanvas, pixi-scenes, BattlePanel/reloj, mapa, carga de assets y harness de medición. Propiedad de recursos por escena; cambio de pack/desmontaje/pérdida de contexto mantiene cleanup y fallback. Fuentes ilustradas intactas inicialmente; cualquier adaptación necesitará evidencia y muestra.

Gráficos exclusivamente Linux bajo guard/lock/watchdog originales, un worker, cero retries, sin vídeo/trazas por defecto. En Mac solo lectura, compilación y pruebas no gráficas; no se usa Chrome/Browser como bypass. Referencia exacta, cachés declaradas, límites superiores de polling y crudos conservados. rAF≠GPU, decode promise≠CPU, dimensionesRGBA≠RAMresidente, counters propios≠ausencia global de fugas.

Entrega técnica requiere mejora reproducible integrada y garantías conservadas. Humana/dispositivo físico quedan pendientes, sin atribuir comprensión/diversión/retención a automatizaciones.

### Actualización del plan · ensayos A/B

Mediciones seriales guardadas: ab-1, ab-2 y ab-3. Coalescer/geometría y decode paralelo reducen trabajo/arranque de forma consistente en parejas. El sostenido genérico permanece33,4ms en runners desfavorables y16,8ms en otro para ambas variantes; causa todavía no aislada. El goal sigue activo. Experimento actual: aislar mipmaps frente a a5, una variable. Preparado después: detener el ticker gráfico durante eventos visualmente estáticos manteniendo reloj/DOM/log y un snapshot al cambiar de evento; aceptación en pruebas y CI pendiente. No se integra un ensayo por haber pasado una muestra favorable.

### Candidato de siluetas

Geometría de atlas sobre fuentes intactas, sin nuevas ilustraciones. No es un recorte destructivo o reducción de calidad; conserva marco lógico/guardas. Contrato técnico y costes en ASSET-ADAPTATION. Ensayo78267f5 en Linux todavía pendiente. La aceptación incluye inspección de dos PNG seleccionados y regresiones antes de considerar integración. La fase de diagnóstico no sustituye la matriz completa.

### Plan vigente · aislamiento de shader (ensayo9)

1. Referencia, cuatro recorridos y riesgo funcional de callbacks: comprobados; error Illegal invocation corregido en9ff y comprobado después.
2. Coalescer, geometría, decode paralelo y ticker estático: implementados y pruebas de dominio/presentación disponibles. Reducen trabajo; la aceptación gráfica final sigue pendiente.
3. Ocho ensayos A/B seriados conservados. Mipmaps y autoload se retiraron por falta de beneficio. El atlas aún es experimental: no alcanza el objetivo y añade complejidad/interpolación diferente.
4. Ensayo9 en CI39034276488 sobree5aa2af: capacidad máxima de batching8, referencia78267f5, tres parejas AB/BA/AB. Mide shader real, envío nativo acotado y efectos sobre todos los actores. No integra todavía.
5. Si se identifica una solución suficiente, retirar experimentos sin valor y repetir comparación del candidato mínimo frente a referencia inicial, además de recorrido/regresiones Linux. No se ejecutan baterías simultáneas.
6. Revisar documentación/diff, comprobar candidato real, integrar con historia conservada y verificar main/CI. Pendiente.

El sostenido genérico sigue incumpliendo20ms en los ensayos desfavorables. El presupuesto de arranque tampoco se da por alcanzado. No se declara completo el goal ni se realiza push a main por una muestra parcial.

### Plan tras comparación10

El candidato mínimo0c cumple los presupuestos declarados en las tres muestras de este runner (detalleDIAGNOSIS), conservando una pareja genérica de arranque desfavorable. Ensayo11 sobred03c93c aísla el uso inmediato de imágenes resueltas; se exige≤20ms en cada ventana actual después de guardar todos los datos. El baseline0c mantiene las otras correcciones, sin atlas. No se repite el lote de arte.

La configuración final vuelve a `full` y separa explícitamente A/B mediante ARCANA_A73_DIAGNOSTIC=1 para Linux. No reduce ni cambia la matriz original, guard, worker, retries, timeout o watchdog. La matriz funcional conserva los cuatro recorridos A73 y todas las regresiones A70/A71; no duplica el A/B ya comprobado del mismo código. Pendientes ensayo11, matriz global, integración y verificación.

### Plan vigente tras ensayo12

Candidato83d4e48 cumple en este runner los presupuestos; añade un presupuesto de dos admisiones de fuentes por paint, no un límiteGPU. Coste de34–96msfrente al envío simultáneo medido y aceptado como compromiso de ensayo para evitar picos167–183ms. Los actoresDOM permanecen visibles y ninguna operación espera texturas. Último contraste contra referencia iniciald13 todavía pendiente; después restaurarphasefull, ejecutar matriz/regresiones, revisar e integrar. Goal activo.

### Candidato de aceptación

ca9cc86 supera el contraste aislado de Graphics: todas las parejas mejoran arranque y picos, samplers usados8 ypresupuestos mantenidos. Siguiente fase compara el conjunto contra d13; añade un caso de ciclo de vida para huecos concretos de reducido/resize/carga oculta. No más modificaciones de renderer si esa aceptación y matriz pasan. Goal/main siguen pendientes.

### Plan vigente ·aceptación16 y matriz

Pasos1–5completados en su parte diagnóstica:16ensayos acotados de hipótesis diferentes, fallos/costes conservados, runtimeca9congelado.562unitarios/81archivos y78PGRedis/13archivos, tipos/build/contenido/scanner correctos enCI16. Presupuestos20msP95/100msmáximo/400G550JreadyFrameAt pasan; definición y límites enPERFORMANCE. Artefuente intacto.

Paso6en curso: CI39038639396, candidatoeb5ce91enphasefull, matriz original más4recorridosA73 ycaso de ciclo de vida; sin repetir A/B ya probado. Inspección seleccionadaPNG16hecha, captura estática no acredita movimiento. Paso7pendiente: revisar diff/equivalencia yCI antes de integrar/push/verificar main. Goal activo.

### Cierre técnico de validación

Paso6completado: CI39038639396success, merge8541ee2c,268gráficos correctos/40skip,562unitarios y78PGRedisreales. PresupuestosA73declarados cumplidos; ventanas cortasA69ycasos noarena desfavorables conservados. Galería ycrudos actuales revisados. Paso7: commit documental, comparación de objetos, integraciónff-only/push yverificaciónSHAremoto/PR/CI; su registro está enINTEGRATION. No se marca goal completo antes de esas verificaciones.
