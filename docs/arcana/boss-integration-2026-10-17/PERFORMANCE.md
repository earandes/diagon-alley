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

## Candidato final15b1a99 · CI39021060226 correcta

[Resumen final](evidence/final-boss-summary.json), [JSONcrudo](evidence/final-boss-performance.json). Jefe5×5:570intervalos/546paints cálidos, P95/máximo16,8/33,4ms,0LongTasks cálidas. Arranque712,7ms como límite superior, máximo233,3ms y3LongTasks/máximo172ms; promesa decode acumulada204,9ms. Omisión89ms, texturaspropias7.628.832B, teardown propio0. Mismos límites metodológicos que antes.

24journeysfinalesA71: ChromiumDOM606–965ms/figuras610–967ms; WebKitDOM593–1305ms/figuras598–1308ms. No se sustituyen los límites mayores de intentos anteriores ni se declara causalidad entre ellos.

GenéricoA69 P95: de99ef3 **33,4ms**,8155efc **16,8ms**,15b1a99 **33,4ms**; tres JSON originales conservados (`generic-warm-attempt-1/attempt-2/final.json`). Mismo runtime, variabilidad de entorno/scheduling no aislada. La muestra final vuelve a incumplir objetivo20ms; no se declara resuelto ni se escoge solo el intento favorable. Final510intervalos/482paints;0LongTasks cálidas. No se confunden métricas de ventana del jefe con genérico.

ReferenciasA67 baseline/current terminaron correctamente; JSON originales `final-a67-baseline.json` y `final-a67-current.json`, procedencia artifacta67-validation-evidence deCI39021060226. Son otrafixture y medidas deacciones, no duración humana o benchmark del jefe.
