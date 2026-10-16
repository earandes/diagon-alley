# A67 · Recursos de Encuentros

16 octubre2026. Se reutiliza el arte vigente; no se generan imágenes, cargan servicios externos, instalan herramientas o añaden dependencias. Las filas indican consumidores implementados, no aceptación estética humana.

| ID / función | Fuente y archivo activo | Uso / dimensiones | Estado y aceptación |
|---|---|---|---|
| encounter.host | `character.<npcId>.portrait`, resuelto por `Artwork` y content-pack activo | Maestro/export vigente512×640, marco4:5 de88–112px de ancho | Reutilizado. Cabeza/silueta completas según crop vigente, sin deformar, nombre legible fuera del bitmap. Ausencia no bloquea trato. |
| encounter.single | `character.<wizardId>.thumbnail` del destinatario propuesto o primer integrante en pie | Retrato individual38×48px dentro de caja56–70×48–58px, `object-fit:contain` | Reutilizado. Distinto a equipo por imagen y nombre, visible a390px. No anuncia incorporación/copia nueva. |
| encounter.team | Tres `character.<wizardId>.thumbnail` de la formación activa | Tres retratos29×37px solapados, misma caja que single | Reutilizado. Representa alcance del trato, no cambiar formación. |
| encounter.health | `ui.health` |23px junto a cifras PV | Reutilizado. Nombre/recurso y signo fuera del arte conservan función con imagen ausente. |
| encounter.mana | `currency.essence` |23px junto a cifras PM | Alias visual reutilizado para PM igual que Refugio vigente; las letras PM/MP evitan confundir con energía global. No crea moneda. |
| encounter.member | `character.<wizardId>.thumbnail` | Export96×120, selección40×50px y preview28×35px | Reutilizado. Copias duplicadas conservan unidad/estado separado por ID. Texto y condición accesibles. |
| encounter.selected | `ui.seal` |27px opción,20px portador,22px pasar | Reutilizado. Sello + borde + `aria-pressed`; no dependencia exclusiva de color. |
| encounter.pass | `ui.pass` |24px más acción localizada | Reutilizado. Distinto de cancelar: avanza solo después de confirmar. |
| encounter.info | DOM/CSS editable en `EncounterPreparation.tsx` / `encounter-a67.css` | Sello tipográfico «i», área44×44px | Mismo patrón A66. Información y condiciones fuera de la ilustración. |

Fuentes, herramientas, procedencias/licencias y transformaciones de recursos existentes conservadas en `design/diagon-alley/illustrated-v2/`, `design/diagon-alley/annotations-a59/`, manifests y packs previos. Reutilización no acredita permisos de distribución de franquicia. Sin activos nuevos ni raster rotulado con datos funcionales.

No hay nuevo fondo, personaje, rig o animación raster. Los marcos/objetos son HTML/CSS proporcional. La verificación en contexto y capturas finales se enlazan desde el informe del incremento, sin usar este inventario como sustituto de la prueba.
