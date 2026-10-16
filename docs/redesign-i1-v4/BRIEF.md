# Rediseño integral de presentación I1: encargo de análisis

10 de octubre de 2026. Estado: análisis y propuesta, sin implementación del rediseño en la demo.

Enric pide revisar toda la aplicación con las cinco skills locales, explicar mejoras y mostrar mocks: más magia, estilo contemporáneo, menos botones e interacción integrada. Esta pasada prepara una dirección revisable. Conserva cuento teatral A11/A12, conceptos A26, ausencia de barra inferior A27, stack A23, alcance I1 A25 y bienvenida A13/A18. No añade cuentas, productos, reposición, nuevas tiendas o un motor de animación.

Lectura de diseño: rediseño de una experiencia de visita y colección para fan adulto casual, con escenario ilustrado continuo y controles tranquilos. Taste se aplica a composición/jerarquía; sus reglas de marketing no sustituyen la interfaz de juego. Diales propuestos: DESIGN_VARIANCE 6, MOTION_INTENSITY 3 ambiental/4 ritual, VISUAL_DENSITY 3; la coreografía implementable sigue siendo 1,6 s después de commit. Los mocks son estáticos salvo navegación de muestra.

Método: leer documentos completos; inspeccionar código y referencias; capturar vistas/estados actuales mediante Playwright CLI en contextos desechables; registrar hallazgos; producir un canvas HTML independiente con pantallas grandes y recorrido de muestra; revisar sus capturas. Reutilizar únicamente arte provisional existente. No generación nueva, servicios de pago o cambios globales. Cualquier dato de muestra se identifica y no toca IndexedDB.

Aceptación de esta entrega: auditoría por vista y estados, prioridades y justificación; anatomía/tokens/estados/ES-EN/accesibilidad de la propuesta; mocks de callejón, interior, detalle, ritual, resultado, álbum, ficha y ajustes; prueba visual a 320/390 y escritorio, sin atribuir persistencia o rendimiento real al canvas; mapa de arte pendiente y siguiente muestra acotada. App/PRD/Word permanecen intactos. No se declara aprobación visual, resultados de usuarios o finalización de I1.
