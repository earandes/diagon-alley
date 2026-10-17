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
