# Cromos con estrellas — A43, contrato previo

12 octubre 2026. Alcance autorizado: revelar cromos holográficos con 1–5 estrellas y mostrar esa información en Cromodex/inspección, en español e inglés. No quinto rango, variante, precio o potencia adicional.

Estado inicial: catálogo y copias tienen cuatro rangos, sin estrellas. Acción: obtener una copia mediante Sapo, verla y recargar. Resultado: estrellas procedentes de la definición seleccionada por servidor, guardadas junto a copia y receipt; UI representa símbolos decorativos con etiqueta completa localizada. Una copia antigua sin estrellas indica “Estrellas no registradas”, sin inferirlas del catálogo vigente.

Decisión de ensayo provisional (U25 sigue abierto): Común 1, Inusual 2, Épico 3 o 4 por identidad explícita, Arcano Legendario 5. Las ocho identidades épicas se alternan 3/4 en su orden actual; JSON guarda el número de cada una, no cálculo en runtime. Los cuatro rangos/30 IDs/stats/precios/pesos no cambian. Catálogo y tabla de sapos aumentan a versión 2; config de ensayo también 2. Ediciones futuras requieren volver a versionar. No se aprueba balance productivo por esta elección.

Persistencia/compatibilidad: `WizardDefinition.stars` es opcional para snapshots históricos, tipo 1|2|3|4|5 cuando presente; catálogo de ensayo vigente lo exige en sus 30 identidades. Validación rechaza cero/seis/fracciones/texto/null/NaN. Snapshot congelado conserva estrellas; coincidencia copia/receipt incluye el campo. Reintento después de cambiar catálogo mantiene número/versiones anteriores, sin sorteo. Ninguna migración reescribe copias o receipts.

Aceptación TDD previa: valores inválidos rechazados; nueva copia/receipt con estrellas, inmutabilidad y datos históricos sin valor conservados; discrepancia copia/receipt rechazada; nueva adquisición con versión cambiada conserva la anterior; catálogo público devuelve todos los números y los cinco valores con cuatro rangos. UI es/en muestra símbolos y etiqueta accesible en revelación/álbum/inspección; cambio de idioma/recarga no altera estado. Persistencia SQL pertinente se verifica además de dobles.

Incluye modelo/snapshot/validación, datos versionados y presentación estática. Excluye nueva rareza, multiplicador, gacha adicional, migración económica, arte nuevo, generación o dependencia. Texto fuera de raster; fallback de GSAP/reducido conserva la misma información.
