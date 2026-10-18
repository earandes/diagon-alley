# A82 · Validación

**Cierre:** batería general39115461901 y confirmación39119749580 correctas. Evidencia combinada por objetos/consumidores, no otra batería completa sobre el cierre documental. El resto de este documento conserva la cronología de fallos, correcciones y límites. [Equivalencia](EQUIVALENCE.md).

## Entorno y selección
Mac local: Node24.20.0, sin abrir navegador. LinuxCI: Node24, PostgreSQL16.9, Redis7, Chromium/WebKit con defineSafeConfig original (guard, bloqueo, watchdog, worker1 y retries0). Contextos/namespaces aislados. Capturas nuevas A82 seleccionadas, no vídeo/trazas automáticas. Emulación, no dispositivo físico.

Local: `npm test`624correctas; `npm run typecheck`, `npm run build`, `npm run verify:arcana:build`, `git diff --check` correctos. Build conserva aviso conocido de chunk>500kB; no se afirma mejora de arranque. Impeccable detect layout=[] no acredita calidad visual.

## Primera inspección
CI39115026918, head82b8c82, candidato9bad3493 sobre main937a0a1: tipos/build/unitarios/integración/backup correctos. A82:1correcta,1fallida,4no ejecutadas por maxFailures1. La prueba de composición de390 pasó con ambos paquetes/idiomas y reflujo320/200%; las imágenes mostraron fondo de header heredado y h1 con flex-basis10rem (altura160), problema artístico real no detectado por geometría superficial. Se corrigen background:none y flex:none. También se neutraliza color heredado enhover y se acota el control de Ajustes44×44.

La prueba de entrada falló por leer requests=0 antes del fetch, después de que el mutex ya mostrara Entrando. Se espera explícitamente la petición retenida antes de comprobar una sola entrada; no se añade retry al test ni se relaja su aceptación. El fallo y las capturas se conservan en evidence/review. El run se canceló tras obtener evidencia; no es success ni validación global. Cancelaciones anteriores de preparación tampoco cuentan como éxitos.

## Confirmación
CI39115461901 valida f9082cf con corrección y scopesfull en dos jobs consecutivos. Menú A82:6correctas,0skips,0fallos,0flaky,16,264s. Siete capturas inspeccionadas. Ambos paquetes y ES/EN en390×844,1280×900,865×1079: documento del mismo tamaño, sin scroll ordinario. Ajustes44×44. Título32/56/45px de alto, frente a160px heredados en390 de la revisión. Reflujo320px/200%: ancho320, alto1006 con scroll accesible; la marca puede partirse en este extremo. Altura de acciones76/80px ordinarias. Cancelación/foco/teclado, hover estable, arte ausente, una petición retenida y error recuperable correctos. Reducido efectivo sin transición. No benchmark temporal propio de la pulsación; implementación CSS finita contrastada. Resultado de regresión global todavía pendiente. Se conservan resultados desfavorables y límites históricos.

## Límites
Sin pruebas con persona, móvil físico, lector hablado, gestor de contraseñas real, correo externo o entorno público. No nuevas medicionesGPU/rAF ni afirmación de eliminación global de fugas. Cuentas conservan ensayo local/buzón privado; no se despliega.

## Job check completo
CI39115461901, checkout reald2dc4d823a114dc2d1e90074a76008f75893c2cd, padresmain937a0a1 yheadf9082cf. Jobcheck SUCCESS. Tipos, contenido,624unitarios,99integraciones PG/Redis, build, scanner y copia/restauración correctos.312casos gráficos activos correctos,258omisiones explícitas,0fallos. Desglose encheck-summary.txt. Segundo jobregression sobre el mismo candidato todavía en curso; no se declara CIglobal verde aún.

| Scope | Correctos | Omitidos |
| --- | ---: | ---: |
| A76 cuentas |30|30|
| A82 menú |6|0|
| A78 correcciones |16|11|
| A79 entrada |7|2|
| A80 estilo |3|0|
| A81 símbolos |3|0|
| A75 experiencia |113|175|
| A70 jefe |103|35|
| A68 Halloween |12|0|
| A69 movimiento |19|5|

## Reserva visible de Ajustes y emblema ausente
La revisión estática posterior contrasta una colisión de especificidad: el ancho44px compacto prevalecía sobre el fallback nativo width:auto deA75. Se conserva44px con arte, y solo sin imagen se recupera ancho/alto naturales. Si falta el emblema, se reserva su altura para impedir que el título salte bajo la etiqueta de Ajustes. No cambia la composición con recursos presentes.

Dos commits pequeños00a1df5/b9f40e5 añaden estas reglas y la prueba de etiqueta contenida en botón/viewport, separación del título, apertura real de Ajustes, Escape y foco de retorno bajo arte ausente. El candidato generalf9082cf sigue ejecutando su cola sin interrupción; CI39118640332 queda en espera serial para confirmar el ajuste con A76/A78–A82+A75baseline.00a1df5 fue sustituido en la cola antes de ejecutarse; no cuenta como éxito. La selección temporalbaseline se restaurará afull al entregar.

Frente a la batería general solo cambian welcome-menu.css, su test A82 y la selección de QA; App, dominio, servidor, renderer, todas las otras pruebas y assets son objetos idénticos. Se reutilizarán únicamente sus scopes pertinentes, conservando SHA y el límite explícito de combinación de evidencias.

## Batería general completa
[CI39115461901](https://github.com/earandes/diagon-alley/actions/runs/39115461901) SUCCESS sobre f9082cf/d2dc4d8. Check09:28:38–10:05:54UTC (37m16s); regression10:05:57–10:27:56UTC (21m59s), nunca simultáneos. Segunda parte:134casos gráficos correctos,0fallos. E2E56, progresión20, gameplay16, cabecera/Pacto20, intenciones8, PWA12, performancebaseline1/current1. Total446casos activos/258omisiones explícitas. No se suman como casos nuevos los que se repitan en la confirmación posterior. Se conservan tiempos y resultados crudos pertinentes en los resúmenes.

Los dos jobs comprobaron el mismo checkoutd2dc4d8 contra main937a0a1. Este éxito general no se atribuye a b9f40e5: el último ajuste de fallback se confirma separadamente y se compara por archivos/consumidores antes de integrar.

## Corrección de la simulación y confirmación del fallback
CI39118640332 FALLÓ:1correcta/1fallida/4no ejecutadas enA82. Bloquear URLs no afectaba al pequeño SVG incrustado porVite como dataURI; el test esperaba img=0 pero seguía siendo1. No demuestra un fallo del fallback. Resultado en evidence/fallback-review. Se corrige exclusivamente el fixture: las imágenes de entrada apuntan a una URL inexistente interceptada y abortada, provocando un onError real también en las incrustadas. No se modifica inventario, sesiones o código de producto para provocar el fallo.

CI39119749580, headce9fb05: A82 6correctas/0omisiones/0fallos/0flaky (16,645s), incluidos ambos idiomas del fallback, etiqueta contenida en botón/viewport, título separado, abrir/cerrarAjustes y foco. Fuente de aplicación idéntica ab9f40e5. Composición ordinaria igual a la galería f9082cf porque las dos reglas adicionales solo se activan cuando falta arte. Geometría y resultado nuevos en evidence/fallback-confirmation. No se atribuye una imagen estática a una animación ni el fallo de fixture a un defecto de producto.

## Cierre técnico de la confirmación
[CI39119749580](https://github.com/earandes/diagon-alley/actions/runs/39119749580) SUCCESS sobrece9fb05. Tipos/contenido/build/scanner/backup correctos;624unitarios y99integraciones PostgreSQL/Redis.67casos gráficos activos correctos/43omisiones: A76 30/30,A82 6/0,A78 16/11,A79 7/2,A80 3/0,A81 3/0,A75baseline2/0. El jobregression se omite deliberadamente por fasebaseline; sus objetos y consumidores no cambian frente al run general, salvo las dos reglas exclusivas de bienvenida ante arte ausente. No se afirma otra batería full en esteSHA.

Se restaura full como selección entregada. El cierre documental no cambia código, assets, tests o dependencias de ce9fb05, y el selector full es idéntico al de f9082cf. Ver EQUIVALENCE.md y manifest. El merge no necesita repetir una tercera vez los mismos scopes: se conserva evidencia combinada pertinente y se verifica el árbol de main. No se declara CI nueva sobre unSHA documental o de merge que no la haya ejecutado.
