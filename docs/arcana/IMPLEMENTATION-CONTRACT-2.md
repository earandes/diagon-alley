# Contrato previo del segundo bloque ARCANA

11 octubre 2026. Encargo A30, dominio y aplicación sin UI todavía. Los gaps U25/U26 conservan su estado pendiente: este bloque no fija precios, pesos, stats ni reclutamiento para producción.

Estado inicial: Esencia/grafo/PRNG implementados; solo el ensayo histórico es navegable. Se añaden reglas tácticas explícitas del Word y el recorrido de aplicación comprar→consultar unidad→abrir→comprobar copia, por medio de un puerto transaccional. Los precios/tablas/catálogos entran como configuración versionada validada y los tests usan fixtures identificadas.

## Comportamiento y persistencia

- Grageas: al activar Menta cura 25% PV máximo con cap; Pimienta aplica 30% extra solo al primer ataque; Tierra reduce iniciativa 15% durante dos turnos del portador; Jabón provoca fallo del primer hechizo. La activación/efecto vive en dominio; las cifras se mantienen exactas sin decidir un redondeo económico o visual. El contador de turnos avanza al completar turno, no al renderizar o acelerar. Los efectos se seleccionan desde tabla de sabores con pesos positivos y semilla mediante el puerto de tickets; no hay tabla productiva elegida.
- Colección: magos con IDs, cuatro rarezas, atributos y contenido es/en; cada copia conserva identidad/versiones/procedencia. Encontrar duplicado aumenta copias sin aumentar descubrimientos. No alterar snapshots previos con una configuración nueva.
- Inventario: Coronas no negativas y enteras seguras; unidades de Sapo y Grageas con IDs únicos y disponibilidad. Comprar requiere cantidad entera positiva, saldo y versión de precio vista; descuento/unidades/recibo se confirman juntos. Inspección no compra ni abre.
- Apertura: petición identifica unidad y versiones vistas. Tabla válida con referencias/weights, unidad disponible; una transacción consume y crea copia/recibo. Replay de misma clave/petición recupera resultado original sin nuevo ticket, aunque cambie config; otra petición con misma clave da conflicto y otra clave para unidad consumida se rechaza. El dominio no requiere que el resultado sea nuevo: esa garantía anterior no existe en ARCANA.
- Caso de uso: depende de persistencia transaccional y random, sin React/IndexedDB/animación. Fallo de commit rechaza sin éxito y rollback; una respuesta perdida tras commit se recupera por la misma key. Dos escrituras concurrentes se resuelven contra revisión actual. El puerto real se comprobará antes de atribuir durabilidad/aislamiento reales.

## Incluido y excluido

Incluido: modelos mínimos, validación, efectos, catálogo/tabla y casos de uso de compra/apertura. Excluido en este bloque: treinta cromos productivos, precios/pesos productivos, fórmula de combate/sinergias, equipo 3vs3, UI/Cromodex visual, servidor HTTP, autoridad desplegada, forja/bóvedas. No se reduce la aceptación final del goal a este bloque.

## Recursos y aceptación

Sin assets nuevos, dependencias o gasto. Tests RED antes de implementar. Casos: efectos completos y expiración, tickets extremos, versiones/ref inválidas, saldo insuficiente, cantidad inválida/overflow, nuevos/repetidos, replay/conflicto/agotamiento, falla de tx y competencia por unidad; es/en en catálogo/tipos. Los tests en memoria no prueban persistencia real; evidencia separada. Después typecheck/suite completa/build para preservar el ensayo histórico. Los resultados guardados, no la animación, deciden éxito.
