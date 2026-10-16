# A59 · Callejón, mostradores y bóveda

15 octubre2026. Anotaciones8–12. Implementación de presentación autorizada y revisión visual técnica ejecutada; la coordinación registra las pruebas funcionales de autoridad por separado.

## Decisión de diseño y recorrido

El Callejón es un destino previo con tres escaparates: Dulces del Callejón, Ollivanders y Gringotts. Rótulo, interior visible, objeto característico y picaporte forman cada entrada; los controles son botones semánticos con el nombre completo de la tienda. No son las tres pestañas anteriores. Se reutiliza el paisaje único del shell; las escenas interiores solo aparecen dentro de sus ventanas. No vídeo, generación, servicio externo o nuevo contexto gráfico.

Entrar dirige al interior existente y conserva los enlaces profundos. Cada tienda tiene salida al callejón. Una transición de llegada200ms utiliza opacidad/traslación5px; el ajuste propio y el sistema de movimiento reducido la anulan. Hover/foco permite leer la interacción de puertas sin reproducir animaciones permanentes.

En Confitería, los productos descansan en peanas con realce por selección; se elimina el sello que flotaba sobre el título. El ticket de compra combina moneda, importe y verbo «Comprar»; la etiqueta accesible conserva producto/importe/moneda completos de la localización actual. Romper el sello es otra acción sobre una unidad ya disponible, con stock separado. Seleccionar o mirar no compra. El libro de cromos muestra retratos/nombres/porcentajes derivados de `toadProbabilities`, sin tabla económica nueva.

Gringotts presenta puerta, rueda, cerradura y llave. Con cero llaves mantiene el coste visible y la apertura deshabilitada, junto al objeto mapa para buscar al jefe. Tener una llave habilita la rueda; pulsarla abre la confirmación existente, que continúa llamando al comando actual. Solo el receipt confirmado muestra botín. El libro de botines conserva las probabilidades de `commerceOffers`; el estuche muestra únicamente equipo poseído. Ambos se consultan en modal nativo y devuelven foco al objeto por Escape/cierre. No consumen recursos.

El resultado ofrece preparar equipo; no devuelve al inspector retirado de la colección. La raíz conecta `onPrepare` con la preparación del mapa. Forja conserva maderas/núcleos/recetas y precio del catálogo; no equipamiento automático.

## Integración

- `ShopHub({language,onEnter})`, `ShopPlace = 'confectionery'|'workshop'|'vault'`.
- `SweetshopScene` añade `onStreet?`.
- `CommercePanel` añade `onStreet?`, `onMap?` y reemplaza `onCollection` por `onPrepare`.
- `ShopBook`/`ShopExit`, `shop-messages.ts` y `shop-journey.css` son locales a presentación; no se cambian traducciones compartidas ni JSON de balance.
- Arte existente por `Artwork` y pack activo: escenarios, caja, tarro, varita, llave, cofre, moneda y navegación. Objetos ausentes conservan texto/nombre/coste. La puerta y la encuadernación son geometría/material CSS, no pintura nueva ni rig.

## Garantías y pruebas previstas

No cambian precios, probabilidades, versiones, comandos, snapshots, autoridad SQL/Redis, inventario o claves idempotentes. Compra y canje siguen confirmados por servidor. El libreto no envía comandos. Cancelar la confirmación conserva estado y foco; recuperación/incertidumbre permanece en el diálogo existente.

`tests/browser-trial/shop-journey.spec.ts` añade4casos ES/EN: tres destinos y retorno, enlaces, libros/Escape/foco, consulta sin mutación exacta, bóveda sin llave y objetivo disponible; compras de ambos productos a precio del catálogo y recarga con estado exacto. La coordinación registra su ejecución y resultados en el informe A59.

## Revisión visual ejecutada

`node docs/arcana/annotations-2026-10-15/shop-visual-review.mjs` terminó correctamente contra el servidor técnico aislado5240, con contextos nuevos Chromium. Produjo48capturas ES/EN en1280×900,911×1079 y390×844: callejón, tres interiores, tres libros y confirmación/cancelación de forja. [Capturas y observaciones](after-shops/review.json). Sin ancho de documento superior al viewport en esas48observaciones; seis devoluciones de foco al objeto del libreto correctas; cero `pageerror` observados. Inspección humana técnica de capturas, no sesión de usuario o prueba física.

El primer intento detectó que la cabecera de Ajustes interceptaba el botón de cierre al cambiar a inglés. La raíz corrigió el apilado y el segundo recorrido completo verificó el clic normal, sin forzar interacción. Se corrigieron también rótulos de escaparates desalineados por distinta altura del texto y cabecera de libro fija al desplazar su contenido. La bóveda de estas capturas conserva cero llaves: no se simula un canje ni se afirma haber verificado aquí su resultado. La autoridad del canje con llave corresponde al recorrido funcional coordinado.
