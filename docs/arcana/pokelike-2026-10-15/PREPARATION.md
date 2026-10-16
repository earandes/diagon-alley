# A60 · Formación compacta

Contrato previo a implementación del comentario 10. Estado inicial A59: puestos elegidos, cartas y un inspector permanente a la derecha; mover el cursor cambia el inspector, con cifras, dos ranuras de equipo y explicación de reglas siempre presentes. La selección es un borrador hasta confirmar y el equipamiento ya utiliza comandos explícitos de autoridad.

Se conserva la formación real (1–5, temporales incluidos), las copias/IDs, PV/PM de miembros y reservas, equipamiento por instancia y todos los callbacks actuales. No se añade autoselección, personajes, curación, reglas, precios o guardado nuevo.

La vista principal contendrá puestos compactos, contador, cartas seleccionables y una confirmación. Datos breves al hover/foco; un medallón de inspección por carta abrirá una ficha con equipo solo a demanda, también accesible por toque. Las reglas se consultarán desde un pequeño símbolo de ayuda. Los temporales conservan reloj/silueta y explicación accesible; no se confunden con copias seleccionables.

Aceptación es/en:

- Al entrar sin ruta, ningún cromo está elegido y confirmar continúa deshabilitado. No se invoca ningún comando.
- Elegir cartas cambia solo el borrador. Cancelar conserva formación, inventario y recursos. Confirmar llama al mismo comando de inicio/equipo con IDs propios.
- La vista inicial no contiene inspector, atributos ni equipo visibles. El cursor o foco permite ver condición breve y el control de inspección permite editar equipamiento explícitamente.
- Abrir/cerrar una ficha no escribe; Escape cierra esa ficha y devuelve el foco sin cerrar el padre. Equipar sigue requiriendo una elección explícita y muestra datos del estado confirmado.
- Un aliado temporal ocupa puesto con reloj, no puede elegirse como copia ni equiparse desde el álbum; condición de copias en reserva no se sustituye por sus máximos.
- Grid fluido con objetivos de al menos 44px; sin columna permanente o dependencia exclusiva de hover. Animación de selección breve y cancelada por reducido.

Recursos: se reutilizan retratos y símbolos propios `ui.owned`, `ui.temporary`, `ui.seal`, `ui.map`, productos y tipos de ambos paquetes. Sin generación, dependencias o servicios. Verificación unitaria de semántica inicial y posterior recorrido de navegador aislado; no prueba con usuarios ni afirmación de retención.

Implementado: cartas en una sola zona central, cinco puestos de 44–58px y contador compacto; ficha modal nativa cerrada inicialmente. La selección de carta nunca abre la ficha ni escribe automáticamente. El medallón de información y los puestos llenos permiten inspeccionar; hover/foco sobre la carta proyecta solo PV/PM reales. Equipo permanece exclusivamente dentro de la ficha, con las mismas acciones explícitas. Escape de esa ficha evita propagarse a la preparación y devuelve foco al medallón/puesto de origen. Los temporales son figuras estáticas con reloj y breve «Solo esta ruta», conservando explicación accesible. Las reglas pasan a ayuda a demanda. El sello aparece durante 180ms y queda estático con reducido.

El pequeño símbolo de información es SVG vectorial original dibujado en `ExpeditionPreparation.tsx` (círculo/trazos, Codex, viewBox 32×32, representación 27×27 dentro de objetivo44px, centro16/16, sin recurso externo/licencia nueva). Su nombre funcional es texto localizado separado. Las páginas con una o dos cartas centran sus piezas sin huecos de columnas ficticias.

Verificado: `npx --no-install vitest run tests/domain/arcana/preparation-presentation.test.ts`, **8/8**; `npx --no-install tsc --noEmit`, correcto. Dos casos existentes mostraron RED antes de implementar la ausencia del inspector permanente/controles de consulta (`preparation-red.txt`); GREEN posterior en `preparation-green.txt`. Los dos casos añadidos de reservas comprueban PV/PM guardados y ausencia de mutación, no simulan una recuperación del servidor. Navegador integrado A60**16/16**, con cuatro casos focales ampliados**4/4**sin sumar repeticiones, ES/EN Chromium/WebKit: ficha cerrada inicialmente, selección/consulta sin POST, Escape/retorno de foco, modal padre conservado, PV/PM al foco y ficha390px dentro del viewport. Capturas antes/después y matices del helper de foco en [QA.md](QA.md). Las ranuras de equipo se consultan desde inventario real, pero este pase no añade una prueba nueva de equipar/escribir; la cobertura de autoridad/equipo anterior permanece separada.

Pase final posterior:20casos web distintos sobre compilado por cobertura consolidada, incluidos los cuatro casos de preparación ya existentes y cuatro fixtures de compatibilidad de contenido antiguo. Capturas de preparación recapturadas con el wrapper alineado y animaciones finitas terminadas. Detalles, pasadas fallidas del helper y límites en QA.md; no sumar las repeticiones o atribuir una corrida única20/20.
