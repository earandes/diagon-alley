# A40 — Cromodex, equipamiento y Grageas

12 octubre 2026. Incremento autorizado por el MVP ARCANA, sin nuevas reglas de balance.

Estado inicial: álbum y selección básica disponibles; casos de uso transaccionales de equipar y asignar Grageas ya existen, sin controles completos de presentación.

Recorrido: filtrar por rareza/descubrimiento, inspeccionar cada copia con sus atributos guardados, añadir/quitar del equipo y asignar una varita/escoba poseída. Elegir equipo muestra destino y transferencia por instancia; confirmar invoca el caso existente. Recarga conserva selección/equipo. Cambiar idioma conserva controles seleccionados y no inicia operaciones. La inspección no usa atributos actuales del catálogo para sustituir descubrimientos anteriores.

Antes del duelo, elegir cero o una Gragea disponible por unidad viva. Una instancia no puede asignarse a dos unidades. Mostrar efectos y probabilidades derivados de la tabla pública activa; no sortear en cliente. Cancelar no consume nada. Confirmar envía IDs al caso de avance existente; solo receipt confirmado consume Esencia/Grageas y muestra resultado. Recuperación conserva petición original mediante el controller.

Aceptación es/en: filtros cambian el conjunto visible y tienen resultado vacío; copia revela PV/PM/poder/velocidad y equipo por instancia; desequipar/equipar y recargar persiste; cancelar asignación conserva inventario/revisión; duelo confirmado consume exactamente la unidad seleccionada y log conserva su activación. Formación y HP/PM siguen validados por servidor. No añadir premios, estrellas/rangos, recetas, cuentas o dependencias en este incremento. Arte continúa provisional.

KISS: componentes de álbum/inspección/asignación separados por responsabilidad, puertos y casos existentes reutilizados. Tests de recorrido anteriores a controles nuevos; evidencia posterior en PHASE-4-STATUS.
