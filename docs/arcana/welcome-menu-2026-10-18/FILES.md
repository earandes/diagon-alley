# A82 · Archivos y responsabilidades

- App.tsx: una marca y tres acciones compartidas; handlers, mutex y recuperación conservados.
- FantasyActionButton.tsx: botón nativo, materiales, objeto, etiqueta y flecha.
- welcome-menu.css: composición, marco, respuesta finita y reservas ante arte ausente, limitado a bienvenida.
- accounts.css: retirada de reglas antiguas de la bienvenida; cartas/campos conservados.
- src/main.tsx: carga de la hoja específica después de los estilos de escenario.
- welcome-menu-a82.spec.ts y config: composición/recorridos, idiomas/paquetes, teclado, foco, reflujo, falta real de arte y operación retenida. Solo CI Linux protegido.
- account-symbols-a81.spec.ts: selector del emblema trasladado, mismas garantías de carga y encuadre.
- browser-pwa/shell.spec.ts: nueva identidad única tras recarga offline, sin restaurar el título duplicado.
- .github/workflows/checks.yml: mismos scopes full en dos jobs consecutivos de hasta55min; la cola no se pierde por límite total monolítico.
- a75-phase.json: baseline solo durante confirmación, full restaurado al entregar.
- PRD/DECISIONS/DESIGN/README y este directorio: contrato, estado, evidencia y límites.

Ningún nuevo asset o dependencia. Reutilización de brand.emblem/account.login/account.register/ui.map/ui.settings; fuentes editables/manifiesto A81 conservados. Dominio y backend no cambian en A82. A75–A81 son dependencias previas consolidadas mediante PR7, no implementaciones nuevas de esta tarea.
