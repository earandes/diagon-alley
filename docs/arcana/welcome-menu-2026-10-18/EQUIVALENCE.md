# A82 · Candidato, evidencia e integración

Batería general: CI39115461901 SUCCESS, headf9082cf, checkout reald2dc4d8 contra main937a0a1; ambos jobs comprobaron ese mismo merge. Confirmación: CI39119749580 SUCCESS, headce9fb05, checkout real0387153 contra el mismo main.

Entre ambos candidatos solo cambia código en welcome-menu.css: dos reglas exclusivas de bienvenida sin imagen, para ancho de la etiqueta de Ajustes y reserva del emblema. App, FantasyActionButton, GameSettings, Artwork, AccountAccess, dominio, servidor, renderer, dependencias y assets son objetos idénticos. Solo se amplía el test A82; el resto de tests es idéntico. La selección temporal baseline acota la confirmación; no acredita por sí sola la campaña completa. La batería general aporta los scopes inalterados. No se suman repeticiones como cobertura única.

El cierre documental conserva íntegramente código, tests, assets y configuración ejecutable de ce9fb05, con una excepción explícita: a75-phase.json vuelve a full, mismo blob que en la batería general. Futuras modificaciones ejecutan nuevamente los dos jobs completos en serie. No se modifica el guard, bloqueo, watchdog, límite55min/job, worker1 o retries0.

Comprobaciones reproducibles desde la entrega:

```sh
git diff --exit-code ce9fb05 HEAD -- src public tests package.json package-lock.json .github vite.config.ts 'playwright*.config.ts'
git diff --exit-code f9082cf HEAD -- tools/verification/a75-phase.json
node -e "if(require('./tools/verification/a75-phase.json').phase!=='full')process.exit(1)"
```

El manifiesto equivalence.json registra los objetos de los refs probados. Se cotejan también los archivos restantes: las únicas diferencias del cierre son documentación/evidencia y la restauración indicada. La integración conserva la historia de A75 y A76–A82; no hace cherry-pick duplicado. El SHA remoto y el estado de las PR se verifican al completar el merge y se registran en la entrega/PR.

Se evita otra batería idéntica para el cierre documental/merge usando [skip ci], como en entregas documentales previas. Esto no significa que ese SHA haya ejecutado CI ni que tenga una batería full nueva: la aceptación se basa en los dos candidatos y la equivalencia descrita. Si cambia main o cualquier objeto ejecutable, esta prueba de equivalencia deja de bastar y se revisan las comprobaciones afectadas. Sin despliegue.
