# A75 · Entrega y equivalencia verificable

Producto validado: `6f47559a73db59b20aab6bbe94ee4d8e7f5c39c7`, merge de ensayo `4395489c9f888eb230ba6334f01eabf0b099374a`, árbol común `0d914c647786dfeb5c92eb4a6b06b129a9bc77ea`. CI39064546905 **success** con scopes de QA. A75 completa/E2E pertenecen a6d4dbcb y jefe/Halloween/motion a889886d: los checks pasados se reutilizan por objetos/consumidores iguales, con diferencias y fallos posteriores declarados. No se convierte un job cancelado en verde.

El cierre conserva `src`, `public`, `tests`, package/lock, workflow, configPlaywright y guard del candidato. Solo cambia documentación/evidencia y `a75-phase.json` de tail a **full**. El manifiesto `evidence/delivery-equivalence.json` contiene los objetosGit verificables; source/test siguen siendo los probados. No hay nueva batería atribuida al commit documental.

Se usa `[skip ci]` en ese cierre para evitar repetir todas las matrices sin cambios de producto. No se reduce la batería futura: la selección entregada es full, el guard/bloqueo/watchdog y worker/retries originales permanecen. La restauración se valida por parseo y tipos, sin navegadorMac. La ausencia de un nuevo job gráfico no se comunica como otro check completo verde.

Comprobación independiente desde el HEAD de la PR:

```sh
git diff --exit-code 6f47559 -- src public tests package.json package-lock.json .github/workflows/checks.yml playwright.experience-a75.config.ts tools/verification/playwright-safety.ts
node -e "if(require('./tools/verification/a75-phase.json').phase!=='full')process.exit(1)"
```

El SHA del cierre se obtiene del HEAD remoto de la PR, evitando autorreferencia imposible de un documento a su propio commit. El coordinador coteja después de subir: HEADlocal=HEADremoto, base main937a0a1 y PR6 en feature/a75-experience-fixes. Esa comprobación final queda en la tarea/PR. **No merge a main ni despliegue/publicación.** El goal se cierra tras ese cotejo.

Pendientes humanos y físicos en HUMAN-CHECK. Límites técnicos conservados: sesión de ensayo requiere propietario válido, el mutex de entrada no es una transacción distribuida entre dos entradas vírgenes; fallback histórico explícito; perfilesrAF no sonGPU ni garantizan todos los dispositivos; no mejora de arranque acreditada.
