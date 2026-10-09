# Evidencia de I1 jugable

10 de octubre de 2026, Europe/Madrid. Implementado: Callejón/escena/lista → Weasley → detalle → uso explícito de una rana → apertura omitible → resultado persistido → álbum/ficha/filtros → Callejón. Español e inglés. A23/A24 confirman stack y bienvenida nueva; A25 delimita demo local sin cuentas/backend. Word v0.5 intacto, SHA256 `7252db26b0ff4146b7ec211dcbd9624ba8e3440f59b3fd55ffea571886b2056c`.

**Entrega funcional comprobada en los perfiles indicados; no cierre total de I1:** lector audible, móvil físico, Firefox, acabado final y evaluación A17 pendientes. No se atribuyen permisos, balance observado, engagement, resistencia económica, pruebas de pérdida eléctrica o supervivencia al borrado del navegador.

## Entorno y comandos

macOS 27.0.1 (26A434), arm64; Node 24.20.0, npm 11.19.0. Versiones exactas y motivo de dependencias en [CONFIGURATION.md](CONFIGURATION.md). Chromium de Playwright 156.0.8078.4 y WebKit de Playwright 27.2 (build 2370), viewport móvil emulado 390×844 y 320×844. WebKit de Playwright no acredita Safari instalado en iPhone. Textos al 200 % mediante raíz CSS y tipografía rem; no prueba pinch zoom de un teléfono.

Instalación previa con npm ci realizada. Comprobaciones finales y salida real en [checks-local.txt](checks-local.txt):

```sh
npm ci --no-fund --no-audit
npm run typecheck
npm run validate:content
npm test
npm run build
npx playwright install chromium webkit
npm run test:e2e -- --project chromium --project webkit
```

Pruebas: 23 casos unitarios y 56 comprobaciones de navegador (28 en Chromium, 28 en WebKit), todas correctas; detalle en el log. TDD: inicialmente fallaron imports antes de existir el dominio; posteriormente se reprodujeron y corrigieron fallos de notificación que interrumpía el ritual, escena sin arte sin altura, desbordamiento de nombres al ampliar texto, carga de configuración inválida y denegación síncrona de almacenamiento. Tickets controlados cubren cada identidad/rango y fixture normal cubre copia repetida; no son observaciones de usuarios ni muestras de sorteo real.

Firefox 157.0 de Playwright (build 1555) no arranca en este Mac: `Could not find profile folder`. Repetido con temporales locales en `.tools/tmp`, mismo fallo antes de cargar la aplicación. **Perfil pendiente por limitación del entorno**, no prueba fallida del dominio ni perfil aprobado. Para reproducir en otro entorno: `npx playwright install firefox` y `npm run test:e2e -- --project firefox`.

## Matriz I1-AC01–12

| Criterio | Estado | Evidencia y límite |
| --- | --- | --- |
| AC01 | Probado automático y revisión de UI | Recorridos es/en: escena y lista, entrar/volver, foco en heading/origen, ficha→álbum y retorno. Sin consumo por navegar. Un único destino. |
| AC02 | Probado automático | Inicialización concurrente real IndexedDB, misma ejecución, cuatro regalos exactos y dos unidades; recarga no concede de nuevo. Grageas 1 pendientes en UI, distinta de rana 0. |
| AC03 | Probado automático y revisión visual | Seis candidatos A18, 40 tickets exactos y porcentajes es/en derivados; versión en detalle; consulta intacta. Confirmación A24 resuelve R1 frente bienvenida. |
| AC04 | Probado automático | Consumo/copia/operación/versiones en agregado con tx.done antes de revelar; 4→5, nuevo, snapshots y tres rangos. Ritual automático/omitible. |
| AC05 | Probado automático en navegador | Doble intención, replay misma clave, conflicto, distinta clave/unidad consumida; dos páginas de mismo contexto serializan gasto único. Protección independiente del botón y de BroadcastChannel. |
| AC06 | Probado automático | Aborto+recarga antes de commit; cierre tras commit; recarga en ritual/cambio de idioma; omisión a 100/350/700/1100/1450 ms con reloj controlado. Resultado idéntico recuperado, sin sorteo adicional. |
| AC07 | Probado automático con fallos inyectados | Excepción después de put exitoso aborta; respuesta perdida tras commit deja UNKNOWN recuperable; aborto nativo en UI y denegación al iniciar muestran errores es/en sin éxito/stock inventados. No cuota física o pérdida eléctrica. |
| AC08 | Probado automático y revisión visual | Doce identidades, regalos, ficha, familia/rareza/filtros, total invariante, rana agotada y acceso al álbum. Repetido cubierto en fixture normal, nunca en la bienvenida nueva. |
| AC09 | Probado automático y revisión de textos | Mensajes completos sin vacíos, mismas claves, plurales, formatos, lang y errores es/en; cambio durante ritual persiste idioma sin tocar resultado. Anuncio anterior se limpia al cambiar idioma. Revisión lingüística con usuarios pendiente. |
| AC10 | Parcialmente probado; lector y móvil físico pendientes | Enter/Tab/foco en DOM, controles 44 px base, etiquetas/forma, reduced-motion, omisión, sin arte, 320/390 y texto 200 %. AX y capturas revisados; no audición VoiceOver/TalkBack ni certificación WCAG. |
| AC11 | Probado automático | Referencias/pesos/textos inválidos, tickets inválidos, incompatibilidad bienvenida; configuración inválida en UI, ficha obsoleta y no rebaja por bundle antiguo; historial inmutable y replay incluso con nuevos datos inválidos. Procedimiento en CONFIGURATION.md. |
| AC12 | Probado automático | Export→import válido, inválido intacto, cancelación intacta y reset nuevo runId; conflictos de revisión/generación ante preferencia concurrente y orden de pestaña antigua. Sin fusión o crédito económico. |

Pruebas fuente: [dominio](../../tests/domain/opening.test.ts), [contenido](../../tests/domain/content.test.ts), [localización](../../tests/domain/localization.test.ts), [persistencia real](../../tests/browser/persistence.spec.ts) y [recorrido](../../tests/browser/journey.spec.ts). Fixtures de navegador viven en tests, fuera del build de producción; ningún selector de resultado o stock adicional en la aplicación.

## Revisión visual y mediciones

[Callejón, interior, detalle, resultado y álbum en es/en](GALLERY.md), capturas reales de Chromium 390 px; resultado a 320 px, arte ausente/texto 200 % y salto de rana adicionales. Revisión en in-app browser mediante AX y capturas, más inspección de los PNG guardados. Nombres/rareza/cantidad y acciones fuera del dibujo. El full-page screenshot conserva la barra fija a la altura del viewport; capturas `-viewport` muestran la vista real. Para consultar contenido inferior se desplaza el scroll normal. La altura de la barra se mide para reservar espacio al final, también con texto ampliado.

Medición de carga de producción, sin caché, preview local 5190: [first-view.json](first-view.json). Bytes comprimidos y estimación de cabeceras según ResourceTiming; total exacto allí, aproximadamente 90 KB frente a objetivo propuesto 1.000.000 bytes. JS/CSS/HTML, sin fuentes/redes/API externas. El peso descomprimido no se presenta como transferencia. Reproducir después de build: `npm run preview -- --port 5190` y `node tools/verification/measure-first-view.mjs`.

Contraste calculado de pares sólidos explícitos: [contrast.json](contrast.json). Texto principal 11,39:1, texto secundario 6,01:1, botón 11,07:1; rarezas 5,59–7,07:1. `node tools/verification/measure-contrast.mjs`. No auditoría integral WCAG; el contraste del decorado no sustituye comprobar cada control/estado final.

No se midieron fps, latencia o fluidez en móvil físico; no se promete 60 fps. Dos ciclos ambientales lentos independientes (farol/cartel) con pausa, reduced-motion, visibilidad/intersección; sin filtros animados o will-change permanente. Entrada 250 ms; ritual CSS 300+200+500+400+200 ms postcommit, una secuencia; sin sonido o mayor duración por rareza.

## Assets y deuda

[Manifest utilizado](../../src/content/art-manifest.json): I1-V01 Callejón, V02 interior, V03 base/tapa/interior/rana/sombra/cromo, V04 símbolos de Personas/Objetos, V05 Sabores, V06 círculo/rombo/estrella. Fuentes SVG/DOM en `src/ui/Art.tsx`, CSS en `src/ui/styles.css`; metadata accesible/textos en HTML. Autoría manual Codex, provisional, sin imagegen/servicios de pago, logos o semejanzas de actores. Fuentes del sistema sin archivos redistribuidos. No se integran renders/PNG conceptuales preexistentes. Arte final detallado A12, ilustraciones individuales y permisos T01 pendientes; sustituir arte no modifica IDs/reglas/partidas.

Siguiente paso pequeño, sin I2: comprobar este mismo recorrido con lector y un móvil físico, registrar fallos; después revisión del acabado y ocho sesiones A17 con 6/8 comprensión sin ayuda y 4/8 curiosidad. No se han contactado participantes ni observado usuarios.

## Procedimiento pendiente de lector y móvil físico

1. Mantener un origen local seguro (localhost o HTTPS de desarrollo confiable). Para Android conectado, `adb reverse tcp:5187 tcp:5187` permite abrir `http://localhost:5187/` con el servidor actual; para iOS, preparar un origen HTTPS local confiable. Es preparación pendiente, no ejecutada: la URL HTTP de una IP privada no equivale a localhost y puede no disponer de crypto.randomUUID. No publicar ni cambiar hosting/DNS; registrar dispositivo/OS/navegador, red y commit.
2. Con VoiceOver/TalkBack/lector de escritorio: entrar por escena y lista, consultar sin gasto, confirmar, omitir, escuchar un anuncio, cambiar idioma, consultar álbum/filtros/ficha y regresar al control de origen. Verificar orden, nombre, familia/rango/cantidad y errores accesibles. La inspección AX actual no prueba audición.
3. Activar preferencia reducida del sistema y ajuste propio; detener ambiente, quitar arte, ampliar navegador 200 %, recorrer de nuevo y comprobar que los controles se pueden alcanzar sin recortes. Abrir dos pestañas y comprobar apertura única.
4. Recargar/cerrar durante ritual, volver y comparar resultado/export. Probar import inválido/reset cancelado antes de reset confirmado.
5. Medir fluidez/long tasks con herramientas del dispositivo en Callejón y apertura; registrar método, condiciones y archivos, sin extrapolar desde emulación. No marcar AC10 completo si quedan fallos o pasos sin comprobar.

## Git y CI

La entrega incluye aplicación, configuración/manifests, pruebas, evidencia y documentación actualizada. Se conserva la documentación de decisiones previa dentro de las fuentes principales para que A13–A25 se entiendan; estudios, herramientas visuales y assets locales previos se conservan sin incluirlos en el commit de aplicación. CI mínima `.github/workflows/checks.yml`: Node 24, npm ci, tipos/contenido/unitarios/build y Chromium, contents:read, sin deploy o secretos.

Commit/push y run para SHA exacto se verifican tras cerrar esta evidencia y se comunican en la entrega. Este texto no declara por anticipado CI success. Consultar en GitHub Actions o `gh run list --repo earandes/diagon-alley --commit <SHA>`; solo completed/success confirma la CI.
