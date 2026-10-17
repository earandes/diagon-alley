# Referencia ejecutable A73

Commitd13c0d96ed1959ef6edcf61e2486f688484c902f conserva runtime/arteA72 más instrumentación opt-in sin optimización. El código del dominio, contenido, persistencia, reloj y arte es el de4be35f8. Fuente de medición: tests/browser-fluency/fluency-a73.spec.ts yexpedition-a73.spec.ts. Se ejecuta dentro de playwright.boss-a70.config.ts bajo elguard original. No ejecutar enMac.

En checkout Linux aislado de ese commit, con node24/lockfile y servicios PostgreSQL/Redis propios:

```
npm ci --no-fund --no-audit
npm run build
npx playwright install --with-deps chromium webkit
npx playwright test --config playwright.boss-a70.config.ts --grep A73 --project chromium-1280-boss-a70
```

Una batería a la vez; elguard común impide concurrencia. Cero retries y sin vídeo/trazas/capturas automáticas. No cambiar protecciones para acelerar el ensayo. LaCI utiliza su comando completo existente, sin workflows nuevos.

Seis documentos/contextos nuevos: genérico3×3 seed69 yjefe5×5 seed70, tres pares alternados, ventana10s después de art-ready. Caché del contexto nueva; sistema, proceso yshader no purgados. No se denomina arranque frío de máquina. Elguion del jefe alarga estadísticas propias exclusivamente enfixture, sin tocarcampaña.

Cada registro conserva intervalosrAF, LongTasks, métricasacotadas de import/init/decode/geometría/paint/render-submit ydatos propios de escena. Medirrender-submit no mide ejecuciónGPU. Elhook opcional no existe en uso ordinario. Los percentiles del resumidor usan sorted[floor((n-1)*q)], también conserva crudos ysumas; no promedia P95para ocultar una ventana desfavorable.

Cuatro journeysautoritatativos ES/EN×pack recorrenentrada→preparación→mapa→duelo→retorno→jefe→cierre→rana poseída→otra run. La semilla de autoridad no se controla desdecliente; snapshots/logs guardados permiten declarar las condiciones. Usa política técnica de ruta existente, sin fingir comportamiento humano. Los tiempos se estampan en clic real, las respuestas HTTP se identifican aparte y las aserciones dan cotassuperiores hastaDOM/arte. Combatelog es inmutable. No se gasta en cuenta habitual.

Resumen sin navegador:

```
node docs/arcana/fluency-increment-2026-10-17/summarize.mjs RUTA/diagnostic-reference.json
```

Estado: referencia enCI; resultados todavía pendientes. Las mediciones históricasA72 no se presentan como esta nuevaejecución.
