# A85 · Comprobación exacta de la apertura

[Resultado](evidence/local/exact-opening-tickets.json), fuente cdc909f. Enumeración del **código real** `drawWizard` con la configuración de ensayo:29tickets de identidad ×100tickets de acabado=2900combinaciones. No usa navegador, cuentas o almacenamiento; no es MonteCarlo ni frecuencia observada de jugadores.

Para cada identidad:100resultados,99normales y1encantado. Todos conservan ID, estadísticas, estrellas y rareza respecto aA84. Hay29identidades distintas, no58. Añadir Harry inicial mantiene el denominador base30; Harry no forma parte de esa tabla ni se promete obtenible como encantado.

Por tanto, dentro de estos tickets equiprobables del contratoRNG:

- Identidad:1/29, exactamente como antes.
- Acabado por apertura:1/100, independiente.
- Identidad concreta y encantado:1/2900≈0,03448%.
- Primera variante: cuantil geométrico `ceil(log(1-q)/log(0.99))`; mediana69, P90230, P95299. No hay garantía o pity.

El proveedor aleatorio de autoridad mantiene su contrato uniforme; esta enumeración comprueba cómo se transforma cada ticket, **no certifica criptografía**. Las grageas mantienen su tabla y no reciben esta variante.

## Reproducir

Node24 desde la raíz, con Vite instalado del lockfile; `createServer({server:{middlewareMode:true},configFile:false})` permite cargar módulosTS mediante `ssrLoadModule` sin escucharHTTP o abrir navegador. Importar `trialConfiguration` y `drawWizard` como en el probe deCOMPATIBILITY. Ejecutar:

```js
const next = trialConfiguration(), old = trialConfiguration('a84');
for (let id = 0; id < 29; id++) {
  const base = drawWizard(old.opening.catalog, old.opening.table, { ticket: () => id });
  let special = 0;
  for (let finish = 0; finish < 100; finish++) {
    let call = 0;
    const wizard = drawWizard(next.opening.catalog, next.opening.table, {
      ticket: total => {
        assert.equal(total, call ? 100 : 29);
        return call++ ? finish : id;
      },
    });
    assert.equal(wizard.id, base.id);
    assert.deepEqual(wizard.stats, base.stats);
    assert.equal(wizard.rarity, base.rarity);
    assert.equal(wizard.stars, base.stars);
    special += Number(!!wizard.finish);
  }
  assert.equal(special, 1);
}
```

El bloque presupone `import assert from 'node:assert/strict'`,29entradas de peso1 y cierre deVite en `finally`. El campo activo está en el perfilA85 de `trial-configuration.ts`; catálogo/tabla3, acabado1. Cambiarlo exige versionar explícitamente, repetir validación y reconfirmar peticiones obsoletas antes de gastar. Las operaciones anteriores conservan su resultado, no se vuelven a sortear.
