# A66 · Cabecera y Pacto · Entrega local

16 octubre 2026. Implementado y comprobado técnicamente. Sin publicación, despliegue, commit o push. La observación humana sigue pendiente.

## Cambios

- **Identidad del mapa:** había marca DIAGON ALLEY y región Callejón Diagón en franjas consecutivas. Ahora el nombre regional localizado ocupa la cabecera; se conserva la marca en otras vistas. HUD, guía y avance mantienen su función.
- **Ajustes contextual:** al abrir un diálogo, el engranaje inerte del fondo queda oculto. El acceso del nodo sigue permitiendo idioma, mundo y movimiento reducido. Al cerrar se recuperan el acceso y el foco pertinentes.
- **Dos cartas del Pacto:** los retratos rectangulares sobresalían de marcos curvos. Ahora tienen un marco 4:5 con imagen recortada dentro, sin deformación. El sello y el borde distinguen la selección; el foco tiene además contorno accesible.
- **Acciones:** inspección mediante sello «i» de44×44px con nombre accesible específico; estadísticas a demanda. La comparación compartida sigue consultable, con presentación ligera. Pasar no se muestra antes de los tres integrantes que ya exige la regla. Cuando procede, conserva selección provisional y confirmación explícita. Incorporar mantiene una sola acción principal; cerrar cancela el borrador.

No cambian dominio, ofertas fijadas, recursos, reglas, economía, snapshots ni persistencia A65. No se producen assets nuevos ni se añaden dependencias. Se reutilizan personajes ilustrados; animación de selección finita160ms, sin transición con reducido. Se conserva todo el trabajo previo sin reset.

## Evidencia visual

| Superficie | Antes | Después |
|---|---|---|
| Mapa865 | [Captura](evidence/before/map-865.png) | [Captura](evidence/after/chromium-a66-diagon-alley-es-map-865.png) |
| Pacto865 | [Captura](evidence/before/pact-865.png) | [Captura](evidence/after/chromium-a66-diagon-alley-es-pact-865.png) |
| Pacto390 | [Captura](evidence/before/pact-390.png) | [Captura](evidence/after/chromium-a66-diagon-alley-es-pact-390.png) |
| ARCANA/EN865 | — | [Captura](evidence/after/chromium-a66-arcana-en-pact-865.png) |

Referencia inicial capturada antes de editar en namespace aislado `a66-header-pact-5401`. La batería final crea otros namespaces y cuentas aisladas. Las topologías del mapa pueden variar entre cuentas; estas capturas comparan composición y controles, no balance. Capturas finales de la batería en `evidence/after/` y regresiones en `evidence/regression/`. Inspección visual efectuada en capturas reales de DOM e ilustraciones; no mockups. El contorno cian de algunas capturas corresponde a navegación por teclado.

## Comandos y resultados

Node24.20.0, Playwright1.64.0, PostgreSQL/Redis locales reales mediante compose.

| Comprobación | Resultado y evidencia |
|---|---|
| `npm run services:up` | Servicios saludables; [log](evidence/services.txt) |
| `npm run typecheck` | Correcto; [log](evidence/types.txt); también incluido en build final |
| `npm run build` | Correcto, validador de skins y tipos; [log](evidence/build.txt) |
| `npm test -- tests/domain/arcana/node-pact-presentation-a65.test.ts tests/domain/arcana/tactical-run.test.ts tests/domain/arcana/tactical-balance.test.ts` |15 pruebas correctas; [log](evidence/unit.txt) |
| `npx --no-install playwright test --config playwright.header-pact-a66.config.ts` |20 casos correctos en Chromium/WebKit; [log final](evidence/browser-final.txt) |
| Impeccable `detect --json` sobre los cuatro archivos de presentación | Sin hallazgos automáticos; [resultado](evidence/design-detect-final.json) |
| Prettier y `git diff --check` sobre archivos modificados pertinentes | Correctos; [formato](evidence/format-final.txt) |

8 casos A66: ES/EN × Diagon Alley/ARCANA × dos motores; cada caso recorre1280×900,865×1079,390×844. Verifica ausencia de segunda cabecera, visibilidad contextual de engranajes, carta dentro de su marco, diálogo sin desbordamiento ordinario, selección por teclado, inspección sin mutación, Ajustes anidados con Escape y devolución de foco, cancelar sin reclutamiento. ARCANA utiliza movimiento reducido en esta batería.

12 casos A65 reutilizados: selección/cancelación/recarga de oferta fija, reclutamiento único, mapa completo sin scroll, duelo, preparación de gragea, confirmación/consumo y replay. Respuesta perdida y carrera de dos pestañas se reproducen mediante fixtures declaradas de transporte sobre el backend local real; no son observaciones humanas. La prueba de presentación cubre además equipo completo, temporales sustituibles y copias propias protegidas; esos estados completos se verifican en render estático, no se atribuyen a recorrido visual A66.

La primera ejecución se interrumpió con15 casos completados y caída de conexión PostgreSQL. Al continuar, se reiniciaron los servicios y se retiró únicamente el preview huérfano5402 de esta prueba; la ejecución final completa pasó20/20. El log parcial se conserva como evidencia, sin contarlo como aceptación. Advertencias no bloqueantes: puerto WebSocket de desarrollo24678 ocupado y chunk principal grande (~929kB minificado), ya presentes fuera del alcance. No se alteró configuración global.

## Archivos de este ajuste

- `src/arcana/presentation/App.tsx`: identidad regional única e import de estilos.
- `src/arcana/presentation/header-pact.css`: ajustes contextual y marco de snapshots históricos de un candidato.
- `src/arcana/presentation/NodePreparation.tsx`: imagen dentro del marco, información por sello y Pasar contextual.
- `src/arcana/presentation/tactical-a65.css`: cartas, selección, inspección compacta y comparación ligera.
- `tests/browser-trial/header-pact-a66.spec.ts`, `playwright.header-pact-a66.config.ts`: nueva batería aislada.
- `tests/browser-trial/tactical-pacts-a65.spec.ts`: destino de evidencia configurable para no sobrescribir la histórica.
- `tests/domain/arcana/node-pact-presentation-a65.test.ts`: verifica ausencia de Pasar cuando la regla lo prohíbe.
- PRD1.0.32, DECISIONS A66 y DESIGN: alcance e interacción actuales; evidencia previa y Word conservados.

## Límites

No se ha hecho prueba con jugadores, móvil físico, lector de pantalla hablado ni medición nueva de rendimiento. La matriz responsive es emulación de viewport. No se afirma comprensión, diversión o retención. No se repite la suite SQL de integración porque no se modifica ningún contrato/operación del servidor; los recorridos browser sí usan PostgreSQL/Redis reales. El tratamiento visual de snapshots históricos de un solo candidato se revisó por CSS; la matriz visual final usa ofertas A65 de dos candidatos.
