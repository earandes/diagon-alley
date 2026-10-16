# A63 · Animación y game feel

La autoridad confirma primero. Toda coreografía representa estado guardado; ninguna animación decide daño, recompensas o sabores.

| Momento | Anticipación / acción / reacción / cierre | Tiempo y capas | Omitir / reducido / riesgo |
|---|---|---|---|
| Cierre de run | Resultado y objetos confirmados llegan juntos; el destino principal ya es operable | Objetos DOM: opacidad + Y8 px, 340 ms ease-out; sin escalado de escenario | Reducido estático, sin espera. Receipt consultable; no audio ni nuevo canvas |
| Elegir tarro/portador | Selección inmediata; marco y sello cambian; el tarro aparece en portador | DOM/CSS 140 ms ease-out, desplazamiento máximo2 px | Reducido elimina transición/traslación. No consumo hasta combate |
| Abrir inspector | Pausa antes de consultar; ficha estática; Escape devuelve foco | Diálogo nativo, sin ticker de consulta | Sin reanudar Auto por sorpresa; scroll accesible a200% |
| Ataque / daño / cura | BattleLog determina actor/objetivo; proyectil existente; delta local firmado y PV cambian | Pixi existente para acción, DOM 300 ms ease-out para delta, Y5 px. Geometría medida tras layout, no cada frame | Pausa/2x/omitir conservan log. Reducido resultado equivalente, sin shake/flashes |
| Caída | Figura y estado de caído se diferencian por símbolo/condición y PV0 | Misma escena, sin ocultar actor | Permanece inspeccionable; no necesita sonido |
| Desenlace | Neutral al entrar; resultado al finalizar/omitir; anuncio una sola vez | DOM y celebración existente finita | Reducido estático. Fallo renderer conserva controles/registro/resultado |
| Rana ganada | Acción explícita abre unidad poseída, coreografía vigente caja→rana→carta | Pipeline GSAP/Canvas2D existente, sin modificación de arte o tiempos | Omitir/recarga/idioma no vuelven a consumir o sortear. Continuar vuelve al cierre pertinente |

No loops añadidos, filtros GPU nuevos, flashes, shake global o audio. Las animaciones no tienen temporizadores para ocultar latencia. El HUD plegado ofrece datos confirmados, no un saldo anterior. La arena conserva ticker pausado/final y fallback semántico.

La geometría ordinaria se comprueba con DOM y canvas a1280×900,390×844,865×1079. La matriz de 72 imágenes corresponde a dos idiomas × dos packs × dos motores × tres composiciones × tres tamaños; no son72 pruebas de jugadores. Perfil sostenido separado, en [PERFORMANCE.md](PERFORMANCE.md).
