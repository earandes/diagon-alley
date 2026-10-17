# A71 · Gesto pintado sobre el reloj compartido

La muestra consume exclusivamente el evento confirmado y el progreso del `ReplayClock`. No crea rAF, ticker, temporizador, sonido, filtro, estado económico ni simulación. `bossActorPose` es una función pura y finita, incluso para un progreso no finito o fuera de rango.

## Secuencia

El evento vigente dura lo que indique el pack; los porcentajes siguientes no añaden una espera. Para650ms serían aproximadamente:

| Fase | Progreso / duración orientativa | Representación |
|---|---|---|
| Anticipación |0–18% /117ms | Recoger brazo/objeto hasta−25% del gesto, ease-out cúbico |
| Extensión |18–42% /156ms | Articular hasta11° Hermione/13° Circe alrededor del pivote registrado |
| Lanzamiento |42–78% /234ms | Mantener gesto y devolver15%; trayecto existente desde el objeto transformado hasta el objetivo real |
| Asentamiento |78–100% /143ms | Volver suavemente a reposo, sin loop |
| Contacto recibido |78–100% del impacto real | Reacción localizada adicional≤3px; caída derivada de `targetHp===0`, no daño inventado |

La compresión de manga2% acompaña la articulación, no transforma todo el retrato. La cabeza y torso conservan la reacción ligera existente; no se llama animación corporal completa. Un clip estático de cintura evita que el borde plano del recorte rote fuera de la peana. El punto de emisión se obtiene del Sprite de brazo ya transformado, no de las coordenadas del antiguo busto/cuerpo completo.

Pausa, inspector y pestaña oculta mantienen la misma muestra;2x modifica el reloj existente. Omitir conserva el resultado guardado y vuelve a una composición final estática. El renderer no vuelve a calcular BattleLog ni concede objetos.

Reducido: brazo estático y estado final equivalente; conserva nombre, PV, controles y registro. Fallo de una capa: no se muestra base sin brazo, se mantiene `actor-rest`. Fallo completo del rol: `Artwork` puede usar la figura original y el DOM conserva las acciones. El renderer genérico sigue siendo recuperable; la carga no bloquea el resultado.

## Observabilidad y límites

`bossActorReady`, `bossActorPose`, `bossActorArmAngle` y `bossActorLayers` describen las capas instaladas y la transformación efectiva del Sprite. Hooks históricos `bossProp*` reportan ahora el mismo brazo/objeto real para conservar la comprobación de pausa/swap A70, no una falsa animación del cuenco separado. La destrucción borra los mapas de capas y las texturas de propiedad del renderer mediante el teardown existente.

TDD ejecutado: tres fallos iniciales por ausencia de `bossActorPose`; después muestreo determinista, anticipación/extensión/reposo, contacto válido/fallo, reducido, caída, extremos/NaN y metadata registrada. La batería protegida del jefe CI38988996115 comprobó fase/transformación efectiva del Sprite, pausa,2x, swap, ocultación simulada, omisión y fallbacks; sus mediciones se conservan en PERFORMANCE.md. No se infiere suavidad, legibilidad humana o ausencia global de fugas a partir de tests puros o PNG CPU.
