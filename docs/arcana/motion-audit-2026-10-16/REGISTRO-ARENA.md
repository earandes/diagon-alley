# M01 · Arena, reloj y ciclo de vida

## Implementado

- `ReplayClock` conserva cursor y fracción al pausar, cambiar velocidad y ocultar. Solo ordena tiempo de presentación; no genera eventos ni calcula combate.
- `useBattlePlayback` comparte ese reloj con Pixi. React publica cursor/fase/controles, no 60 estados por segundo. El renderer evita mezclar una fase nueva con el frame anterior.
- Lanzamiento dirigido del actor al objetivo, anticipación local, fallo sin impacto, anillo de contacto y respuesta de curación/quemadura. Sin proyectil rival ficticio ni shake global.
- Cifras de impacto con clave por unidad/evento y ventana finita520ms, conservadas durante eventos de contabilidad. Reducido y omisión no mantienen un delta antiguo.
- El renderer no pinta oculto. Mientras el ticker está activo, una actualización React invalida geometría sin someter un segundo frame inmediatamente. Pausa, omisión y mapa conservan paint de estado.
- Figuras vivas a opacidad1 y caídas a0,35; movimiento de entrada breve sin volver a desvanecer retratos que ya estaban presentes en DOM. Pausar antes de cargar texturas conserva todas las figuras.
- Al fallar el renderer se retira la marca de arte listo. El CSS solo oculta el retrato DOM cuando hay rendererWebGL y arte completo. El test comprueba opacidad distinta de cero, no solo presencia del artículo.
- Cada tipo/pack tiene un host DOM propio. Cambio de pack en pausa conserva reloj/log y verifica destrucción del host anterior, texturas0 y un único Canvas nuevo.
- `App` vincula el reconocimiento del mapa al último recibo real del nodo. El snapshot previo de refugio queda en una referencia de presentación; no se reconstruyen porcentajes ni se persiste otro estado económico.

## Pruebas y observabilidad

Seis casos de reloj y uno de permanencia de deltas. RED de módulos ausentes identificado como suite sin assertions, seguido de GREEN. El primer fallo gráfico real fue un paint adicional al ocultar: se corrigió el renderer sin relajar la aserción.

La matriz gráfica actual comprueba sprites renderables además de artículos DOM:3×3,5×3y5×5 en dos motores, tres tamaños y ambos packs/idiomas. Los contadores observan el estado del renderer; no prueban contraste o percepción de cada píxel. La revisión visual seleccionada permanece en [GALLERY](GALLERY.md).

Se conserva la limpieza de ticker, RAF, listeners, ResizeObserver y texturas propias. Treinta ciclos retirados exigen Canvas ausente, contador de texturas cero y ticker detenido. No se afirma ausencia global de fugas GPU o heap. No se ejecuta ninguna matriz o captura local en Mac.

## Límites

No se produce anatomía articulada desde una figura plana, no se añade audio y no se cambia el resultado confirmado. El arranque de Pixi conserva picos que necesitan una muestra atribuible y hardware físico; [PERFORMANCE](PERFORMANCE.md) los mantiene visibles. Las ventanas de inicialización tardía se han revisado por código; no se afirma haber forzado todos sus interleavings en ejecución. La consulta global de Ajustes y lector hablado necesitan observación específica; el inspector de arena sí tiene pausa explícita comprobada.
