# Candidato comprobado y cierre documental

CI39128171523: **success**, jobs check117677598386 y regression117684588440 correctos. Head`2330f7b18b5a594663efa18cbd1449f7744c503e`; ambos jobs hicieron checkout de`4fea2b08d8416132f40bc127973bb29c44556177`, merge de ese head contra main`ac827a0f16085a354793bfe58e27dc441af267db`.

Se obtuvo el commit real mediante fetch de refs/pull/8/merge. Su árbol y el del head son idénticos: `8c811ef706732ce55c0f9ce81ab57d5c3e569e82`; diff vacío. No se asume equivalencia por aparecer un check verde o por el nombre de rama.

El cierre posterior solo incorpora documentación/evidencia y actualiza estados en PRD, DECISIONS, DESIGN y README. `equivalence.json` registra46objetos de fuente, assets, tests, herramientas, dependencias y configuración del candidato probado. Comprobación desde la entrega:

```sh
git diff --exit-code 2330f7b HEAD -- src public tests tools .github design/audio/a84 package.json package-lock.json index.html vite.config.ts 'playwright*.config.ts' 'tsconfig*.json'
git diff --name-only 2330f7b HEAD
```

La segunda lista debe contener únicamente documentación y evidencia. La producción/audio permanece igual desde e240535; las correcciones posteriores son de fixtures/tests y están incluidas en el pase final completo. No se cambia el guard, bloqueo, watchdog, worker1, reintentos0o límite55min/job. No se restaura una configuración diagnóstica para saltarse comprobaciones: las fases quedan full.

Como en cierres documentales anteriores, se usa `[skip ci]` para no repetir una batería idéntica por añadir sus resultados. Esto **no** significa que el SHA documental haya ejecutado CI ni que sus checks sean otra batería verde. La aceptación técnica se refiere a2330f7b/4fea2b08y a la equivalencia explícita de objetos. Cualquier cambio de código/configuración invalida esta justificación y requiere revisar las comprobaciones afectadas.

PR8 permanece abierta para revisión; no merge ni despliegue. La escucha humana y el dispositivo físico no se sustituyen por esta equivalencia o por render numérico.
