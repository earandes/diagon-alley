# A59 · Objetos regionales y celebración

15 octubre2026. Producción local, coste adicional0, sin navegador o modelo GPU durante la autoría. Se aplicaron `arcana-game-feel` y `local-magic-art`; se eligieron SVG originales para seis objetos pequeños, sin Blender o nuevo motor.

## Familia de objetos

- `node.duel`: dos varitas de madera/plata y arco de hechizo luminoso.
- `node.refuge`: caldero de cobre, asas de latón y poción; no entrega una receta nueva.
- `node.chest`: baúl de madera, cierres, monedas y gema.
- `node.pact`: carta-retrato encantada, sello de reloj de arena para origen temporal.
- `node.encounter`: invitación sellada con cinta y lacre violeta.
- `node.boss`: máscara oscura de plata envejecida y humo; también sirve al objetivo de jefe en atlas.

Seis SVG256×256, alfa/pivote0.5/0.5,20297bytes totales. Gradientes pintan madera/cobre/plata/papel y trazos pequeños añaden desgaste, sin filtros animados ni plantillas externas. Siluetas diferentes a44/72px. No hay texto funcional dentro de los assets. Se conservan exactamente162roles del paquete Diagon; solo se sustituyen seis entradas y no se modifica ARCANA.

`create-node-art.py` reproduce SVG, manifiesto con SHA256 y composiciones. `composition.svg/png` muestra objetos grandes; `size-strip.svg/png` muestra tamaños reales72/44px. PNG de revisión renderizados localmente con Sharp/libvips del runtime del escritorio. Son vectores originales de prototipo, no pintura raster final ni arte oficial; permiso de distribución de franquicia sin resolver. El cambio no modifica semilla, nodos, planes, reglas o partidas.

## Celebración

`Celebration` conserva `receiptId`, `reduced`, `enabled` y añade `rarity?: Rarity`, default`common`. La rareza procede del receipt guardado; no se infiere de estrellas ni recalcula probabilidad.

| Rareza | Forma | Color | Máximo partículas | Factor duración |
|---|---|---|---:|---:|
| common | pequeñas hojas rectangulares de foil | crema/oro tenue |8|0.6|
| unusual | hojas curvas | verdiazul |14|0.8|
| epic | estrellas de cuatro puntas | amatista |20|1|
| arcane-legendary | soles de ocho puntas | oro |28|1.25|

Tiempo = presupuesto de paquete ×factor, acotado1800ms. El límite de partículas del paquete puede reducir cada preset. Halo apagado para común; anillo fino para otros y aura tenue para legendario. Solo `transform`/opacidad animados; sin audio, flashes, shake, blur animado o contexto WebGL adicional. Pointer-events:none y recorte local. Se desmonta al terminar.

El recibo se marca presentado incluso cuando se omite/desactiva/reduce el movimiento: desactivar después esa preferencia no provoca una celebración diferida. Un historial compartido por módulo impide repetir por idioma, skin o remontaje. El efecto con StrictMode conserva deadline y receta del mismo burst, sin crear un timer infinito. Cambiar idioma/pack no figura como disparador. El sistema reducido también suprime la capa por CSS.

`celebration-a59.test.ts` cubre cuatro escalas/formas, presupuestos bajos, un único disparo y supresión persistente de omitidos/reducidos. El comportamiento DOM, captura y rendimiento integrado se validan por separado en la fase coordinada de navegador; estos unitarios no demuestran FPS ni sesión humana.
