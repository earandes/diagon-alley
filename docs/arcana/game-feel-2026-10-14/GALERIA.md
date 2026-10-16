# Capturas antes/después · A52

14 octubre 2026. Chromium, viewport CSS indicado, es/en, build posterior en5195. Arte visible esperado antes de capturar; capturas de viewport, sin mock ni edición del estado. El antes usa preview5190/A50; después usa el nuevo build. Inicio comparado con50 Coronas/una copia en sesiones distintas. La comparación solo coloca dos screenshots juntos con FFmpeg, sin alterar sus píxeles.

## Inicio, antes a la izquierda / después a la derecha

![Comparación de inicio español, 390×844 por lado](capturas/comparison-map-es.png)

La acción principal pasa a estar visible antes de desplegar detalle del equipo. La identidad ilustrada y reglas se conservan.

| Superficie equivalente | Antes | Después |
|---|---|---|
| Inicio ES390 | [Antes](capturas/before-map-es-390.png) | [Después](capturas/after-map-es-390.png) |
| Inicio EN390 | [Antes](capturas/before-map-en-390.png) | [Después](capturas/after-map-en-390.png) |
| Cromodex ES390 | [Antes](capturas/before-collection-es-390.png) | [Después](capturas/after-collection-es-390.png) |
| Cromodex EN390 | [Antes](capturas/before-collection-en-390.png) | [Después](capturas/after-collection-en-390.png) |
| Bazar ES390, stock0 | [Antes](capturas/before-shop-es-390.png) | [Después](capturas/after-shop-es-390.png) |
| Bazar EN390, stock0 | [Antes](capturas/before-shop-en-390.png) | [Después](capturas/after-shop-en-390.png) |
| Ruta inicial EN390 | [Antes](capturas/before-route-en-390.png) | [Después](capturas/after-route-en-390.png) |

## Recorrido real posterior

| Evidencia | Capturas |
|---|---|
| Guía, tres unidades, PV/PM y aliados temporales tras duelo | [ES390](capturas/after-coven-es-390.png), [EN1280](capturas/after-coven-en-1280.png) |
| Canvas/DOM del mapa y primer nodo | [ES390](capturas/after-route-es-390.png), [EN390](capturas/after-route-en-390.png) |
| Arena con arte real y peanas | [ES390](capturas/after-arena-es-390.png), [EN390](capturas/after-arena-en-390.png) |
| Compra confirmada y stock actualizado | [ES390](capturas/after-purchase-es-390.png), [EN390](capturas/after-purchase-en-390.png) |
| Resultado obtenido, no personaje garantizado | [ES390](capturas/after-reward-es-390.png), [EN390](capturas/after-reward-en-390.png) |
| Copias/rareza/estrellas/estado en equipo | [ES390](capturas/after-owned-es-390.png), [EN390](capturas/after-owned-en-390.png) |
| Taller y coste de la acción principal | [ES1280](capturas/after-workshop-es-1280.png), [EN1280](capturas/after-workshop-en-1280.png) |
| Texto200%, 320px | [ES](capturas/after-text200-es-320.png), [EN](capturas/after-text200-en-320.png) |
| Movimiento reducido, 1280px | [ES](capturas/after-reduced-es-1280.png), [EN](capturas/after-reduced-en-1280.png) |

La colección final tiene dos copias (la identidad extra varía entre sesiones) y60 Coronas: kit50 +duelo20 −compra10. Los screenshots muestran posiciones de scroll distintas según superficie; arena es una ventana de un panel largo y no una lámina de todo el combate. Texto200% usa scroll/reflow, no caben todos los contenidos en un viewport.

[Observaciones de estado/recarga y errores JS](capture-observations.json), [script reproducible](../../../tools/arcana/capture-game-feel.mjs), [pruebas/métricas/límites](REPORT.md). No móvil físico, entrevistas o validación del balance.
