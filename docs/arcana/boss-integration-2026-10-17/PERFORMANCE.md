# A72 · Rendimiento sin cambio de runtime

Mismo runtime, assets, guion y fixture que A71. CI Linux39016752481 sobre main de99ef3; [JSON crudos](evidence/main-boss/), [resumen reproducible](evidence/main-boss-summary.json). No se ejecuta perfil local ni se atribuye una diferencia de runner a una mejora/regresión causal.

Fixture declarada seed70 Maestría5×5, estadísticas propias prolongadas para observar replay. Una ventana cálida10s Chromium1280:

| Medida |A71 previo |Main A72 |
|---|---|---|
|Documento nuevo→arte listo, límite superior |719,4ms |700,6ms |
|Arranque máximo rAF |233,3ms |233,4ms |
|Long Tasks arranque / máximo |3/175ms |3/168ms |
|P95/máximo rAF cálido |16,8/33,4ms |16,8/33,4ms |
|Muestras / paints cálidos |593/571 |577/554 |
|Long Tasks cálidas |0 |0 |
|Máximo acumulado promesa decode |207,8ms |203,5ms |
|Texturas propias estimadas |7.628.832B |7.628.832B |
|Omitir→resultado, límite superior |86ms |96ms |

24journeysA71 reales aislados,12por motor: confirmar→DOM619–898ms Chromium/575–2478ms WebKit; figuras625–934/578–2480ms. Incluyen red, guardado y esperas de aserción. El límite superior WebKit es mayor que el de la muestra previa A71; se conserva, no se descarta como ruido demostrado. Código idéntico y una muestra no permiten atribuir causa. No se promete mejora porcentual.

Pausa/omisión/desmontaje y contadores propios verificados por la batería; no prueban ausencia global de fugas. Promesa decode incluye red/scheduling, rAF no mideGPU y dimensionesRGBA no son memoria residente. Los picos de arranque siguen abiertos.

La regresión genéricaA69 y las referenciasA67 están todavía pendientes de terminar en estaCI. No sustituir su resultado por la muestra favorable del jefe. Objetivo genérico anterior20ms incumplido en A71, documentado sin causa aislada. Se registrará el resultado actual al terminar.
