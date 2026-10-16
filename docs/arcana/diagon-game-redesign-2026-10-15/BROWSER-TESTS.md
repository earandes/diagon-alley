# QA de navegador del rediseño

15 octubre 2026. Pruebas técnicas con sesiones propias; no son sesiones con Enric ni resultados de investigación con usuarios.

## Aislamiento y contrato

No se ha utilizado, navegado, capturado ni modificado la pestaña propietaria de 127.0.0.1:5194. Playwright Test crea procesos/contextos Chromium/WebKit nuevos, abre únicamente servidores de prueba y obtiene cookies nuevas mediante la entrada real del juego. Los servidores usan namespaces UUID y el límite real de 30 sesiones/hora, sin desactivar la autoridad PostgreSQL/Redis.

Las suites históricas establecen explícitamente la preferencia ARCANA antes de cargar, para conservar sus comprobaciones de nombres y comportamiento. La preferencia solo se inicializa si aún no existe: no deshace cambios posteriores al recargar. Las pruebas nuevas no usan ese override y comprueban el default Diagon Alley.

El helper `changeLanguage` abre Ajustes/Settings en el modal activo o en el header, pulsa Español/English y cierra el menú. No hay cambios de idioma por controles de aplicación que ya no existen. El harness de arena utiliza el GameSettings y CSS de producción, incluidos `game-stage.css`, `game-shell` y header; sus controles técnicos no se distribuyen.

Las adaptaciones conservan los asserts de igualdad exacta de estado servidor, consumos, recuperación, claves idempotentes, offline, versiones, foco, pérdida de WebGL y recursos ausentes. Los filtros del álbum se abren a demanda antes de usarlos. El inspector se pulsa por su nombre accesible en el summary completo, cuya ilustración ahora contiene la acción. La compra sin fondos tiene una comprobación de preflight deshabilitado y otra de rechazo 422 de servidor: ambas conservan estado y no dejan sincronización pendiente.

La comprobación A56 del mapa se expresa respecto a los límites reales de header/mapa/nav, con al menos la mitad del viewport dedicada al mapa, todos los nodos contenidos, sin colisiones y sin scroll horizontal/vertical. Para títulos se mide el texto con Range, evitando tratar su contenedor transparente de ancho completo como una obstrucción. Detectó y motivó dos fixes reales: título solapado con el jefe en 320×640 y header landscape 40px menor que su control 48px; ambos quedaron correctos en el pase focal final. Se sustituye únicamente el antiguo alto fijo `viewport−160`, incompatible con la nueva composición.

## Cobertura nueva A57

16 casos: ocho escenarios por motor. Comprueban default Diagon Alley; ausencia de idiomas fuera de Ajustes; ausencia de formularios convencionales; persistencia de preferencia; swap ARCANA/Diagon y lenguaje sobre expedición guardada sin POST/cambio de estado; cuatro sabores con desbloqueo solo tras activación confirmada propia; conservación de identidad exacta de sabor; páginas de álbum adelante/atrás sin mutar autoridad; apertura normal/omisión/movimiento reducido en es/en; recarga y swap sin segunda apertura.

La configuración `playwright.game-redesign.config.ts` usa 5216/5217 y queda separada de la suite histórica para no mezclar cuotas. Admite `ARCANA_REDESIGN_COMPILED_PREVIEW=1` para probar el build compilado real. PWA usa 5218, sin ocupar 5190 o 5194.

## Comandos y resultados

Resultados de fuentes congeladas y reruns focales explícitos; los logs de corridas intermedias fallidas se conservan separados, sin presentarlos como aceptación final.

| Suite | Comando | Casos distintos | Resultado congelado |
| --- | --- | ---: | --- |
| Histórica + nodos | `npx --no-install playwright test --config playwright.trial.config.ts` |76| **76/76 consolidados**:71pasan en `browser-legacy-frozen.txt`; los5casos pendientes quedan cubiertos por4journeys de `browser-legacy-frozen-targeted.txt` y4mapas de `browser-map-layout-accepted.txt`, con3casos solapados. No se afirma que76pasaran en una sola corrida. |
| Harness/replay/contraste | `npx --no-install playwright test --config playwright.arcana.config.ts` |20| **20/20** en `browser-harness-frozen-final.txt`. |
| A57 compilado | `ARCANA_REDESIGN_COMPILED_PREVIEW=1 npx --no-install playwright test --config playwright.game-redesign.config.ts` |16| **16/16** en 35,5 s sobre el último build 33671: `browser-redesign-compiled-verified.txt`. |
| PWA compilada | `npx --no-install playwright test --config playwright.pwa.config.ts` |12| **12/12** en 9,9 s sobre el mismo build: `browser-pwa-compiled-verified.txt`. El worker se restaura byte a byte; hashes antes/después iguales. |

## Capturas y rendimiento

Las capturas de `captures/` proceden de puntos de control de los casos A57, con compras, aperturas y progresión reales en cuentas técnicas: bienvenida, ajustes, mapa, swap ARCANA, mostrador, álbum y resultado normal/reducido, en es/en y 1280×900/390×844. Los estados aleatorios son resultados guardados del ensayo, no premios prometidos a jugadores. Son screenshots de QA propia, no una auditoría de la página propietaria.

Los perfiles `opening-budget-*.json` separan FPS de requestAnimationFrame, P95, contador real de renders Pixi, renderer y bytes por URL. La muestra de apertura dura 650 ms y no prueba carga sostenida o un teléfono físico. Las primeras muestras de Vite dev, concurrentes con otras comprobaciones, no se usan como presupuesto de producción: incluyen `@vite/client` y módulos de desarrollo. La medición definitiva se repite en build compilado, con las suites GPU serializadas. El harness registra aparte 30 s por motor/tres tamaños para cinco unidades por lado y parada real al pausar.

Verificación visual final realizada sobre las capturas actualizadas del último pase: `es-frog-result-1280.png` ocupa todo el viewport y centra la carta; `es-sweetshop-1280.png` muestra ambas acciones con texto claro; `es-frog-opening-390.png` conserva el salto de la rana y partículas; `en-collection-390.png` muestra el maletín y álbum paginado. El álbum puede desplazarse; el contrato de no-scroll pertenece al mapa, comprobado en cinco tamaños. Son 38 capturas principales más los checkpoints históricos en `captures/legacy-nodes/`.

El pase A57 final también comprueba geometría nativa de `dialog.reveal` en ambos motores y tamaños, evitando el shrink-to-fit que había dejado el resultado en 536 px. La medición computada de los dos CTA en ambos packs da un mínimo de 10,95:1 después del fix de especificidad y hover. Los JSON `cta-contrast-*.json` contienen colores reales y composición conservadora sobre los extremos de escena; el log rojo anterior se conserva en `browser-redesign-compiled-accepted.txt` y el diagnóstico en `browser-cta-diagnostic.txt`. No se ha debilitado el umbral 4,5:1 para aceptar el diseño.

### Apertura compilada: resultado y límite

Última medición serial del build 33671 con un render explícito por frame, sin traces. Cada fila procede de una única muestra corta 650 ms de una apertura real; incluye compilación/carga inicial del efecto. Los bytes son Resource Timing observados, sensibles a caché/worker y distintos entre motores, sin tratarlos como tamaño descargable universal.

| Motor/idioma | rAF FPS | P95 frame | Máximo frame | Renders reales | Transferencia observada |
| --- | ---: | ---: | ---: | ---: | ---: |
| Chromium es |43,51|16,8ms|199,9ms|30|803040B|
| Chromium en |43,50|33,3ms|183,3ms|30|803040B|
| WebKit es |59,94|32ms|33ms|39|1767774B|
| WebKit en |61,32|30ms|31ms|40|1769661B|

Fuentes: `opening-budget-chromium-redesign-{es,en}.json`, `opening-budget-webkit-redesign-{es,en}.json`. Chromium mantiene un hitch frío 183–200 ms: **no se acredita 60 FPS** durante esa apertura ni se cierra el presupuesto de rendimiento móvil. Se ha eliminado el doble render identificado en FrogMagic, pero no se atribuye a ese arreglo una mejora que estas muestras no demuestran. El modo reducido evita canvas/partículas y presenta resultado persistido estático.

El harness independiente registra tres muestras de 10 s por motor (320/390/1280px, cinco unidades por lado), alrededor de 60 FPS rAF, P95 16,7–19 ms,616–630 draws/10s, diez texturas de arte y 7004160 B decodificados: `arena-profile-final-chromium.json` y `arena-profile-final-webkit.json`. Verifica que pausar detiene el contador. Es evidencia técnica de escritorio con viewport estrecho y estado fixture; no prueba un teléfono físico ni la apertura fría.

Avisos conservados: las corridas anteriores registraron warnings Pixi sobre texturas/samplers BindGroup al desmontar; no se declara su eliminación definitiva. El último stdout de A57 conserva el aviso de NO_COLOR/FORCE_COLOR y del puerto WebSocket auxiliar 24678 ocupado; los servidores de juego aislados 5216/5217 y la suite pasaron. No se ha intervenido en ese proceso ajeno. Las limitaciones físicas/PWA instalada, lector de pantalla y prueba guiada humana permanecen abiertas.

Los 124 casos distintos se consolidan en 76 históricos + 20 harness + 16 A57 + 12 PWA. Los 76 históricos y 20 harness no se repitieron después de los últimos fixes focales de CTA/reveal/FrogMagic, cubiertos por el pase 16 compilado y PWA final. No se presenta el conjunto como una corrida monolítica ni como validación humana.
