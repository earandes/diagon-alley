# Mejora de diseño I1 con cinco skills · A28

10 octubre 2026. Recorrido y reglas I1 conservados, PRD v0.19 y Word histórico intactos. Implementado: tienda y detalle más compactos, resultado sin marco exterior redundante, filtros adaptativos, tokens semánticos, tema nativo oscuro coherente, enlace para saltar al contenido y ficha del álbum con ilustración visible. Navegación sin menú inferior A27 conservada.

## Instalación y uso real

| Petición              | Fuente instalada y aplicación                                                                                                                                                                                                             |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Taste Skill           | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill), `skills/taste-skill`: lectura contextual, auditoría antes de editar, jerarquía, espaciado, materialidad y control de estados.                                            |
| Web Design Guidelines | [Vercel](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines): reglas descargadas y revisión de App/HTML/CSS/controles. Auditoría por archivo y adaptaciones en [DESIGN.md](DESIGN.md).                    |
| Awesome Design        | [Bergside](https://github.com/bergside/awesome-design-skills): registro consultado, sistema fantasy instalado y aplicado a tokens/componentes/estados/aceptación; su azul/New Rocker no sustituye la dirección del proyecto.              |
| Image-to-Code         | [Leonxlnx](https://github.com/Leonxlnx/taste-skill/tree/main/skills/image-to-code-skill): inspección de las tres imágenes aportadas, extracción de proporciones, paleta, jerarquía, envases y acciones; comparación con pantallas reales. |
| Playwright CLI        | [Microsoft](https://github.com/microsoft/playwright-cli): `@playwright/cli@0.1.22` instalada como devDependency local, CLI ejecutada para snapshots, capturas y recorridos es/en, con perfiles/contextos propios.                         |

Revisiones SHA, hashes y licencias conservados en [manifest](../../.agents/skills/design-sources.json), archivos de skills en [.agents/skills](../../.agents/skills/README.md). Sin instalación global o modificación de MCP. Detectables automáticamente en siguientes turnos; leídas y usadas explícitamente en este trabajo. Solo CLI añade dependencia de desarrollo; la aplicación no añade dependencias de runtime. CLI trae Playwright alpha por contrato upstream; pruebas del repo mantienen 1.64.0 estable.

MIT y Apache-2.0 conservadas donde están declaradas. El repositorio Vercel consultado no declara licencia: no se inventa una. Esta incertidumbre no equivale a licencia de assets/franquicia. Taste/Image-to-Code tienen defaults para marketing y generación: se aplican sus métodos pertinentes con referencias ya aportadas. No se ha generado arte, utilizado servicios de pago, cambiado stack o iniciado I2.

## Comprobaciones ejecutadas

macOS, Node 24.20.0, Vite 8.3.4, Vitest 5.0.3; Playwright Test 1.64.0 Chromium y WebKit en emulación. CLI inspeccionó Chrome 154 headless, identificado por UA en su log. No representa móvil físico ni Safari/iPhone real.

| Comando                                                                                                        | Resultado                                                                                                                                                                                         |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run typecheck`                                                                                            | Correcto                                                                                                                                                                                          |
| `npm run validate:content`                                                                                     | 10 correctas                                                                                                                                                                                      |
| `npm test`                                                                                                     | 23 correctas                                                                                                                                                                                      |
| `npm run build`                                                                                                | Correcto                                                                                                                                                                                          |
| `npm run test:e2e -- --project=chromium --project=webkit`                                                      | 90 correctas, 45 por motor; [log](browser-checks.txt).                                                                                                                                            |
| `npx --no-install playwright-cli -s=diagon-design run-code --filename=tools/verification/review-design.cli.js` | 26 vistas capturadas/revisadas, es/en a 320/390 px, fichas y álbum con texto al 200 %/arte ausente; sin desbordamiento horizontal, sin barra inferior, sin pageerror. [Log real](cli-review.txt). |

Nueva prueba A28 falló antes de implementar por ausencia del enlace para saltar al contenido ([rojo](test-red.txt)). Después protege salto y foco, posiciones de consulta/uso/álbum en viewport 390 × 844 y arte de ficha. Resto de la regresión protege inventario/transacciones, recuperación, idempotencia, dos pestañas y estados adversos es/en. El primer script CLI necesitó esperar el estado de React antes de medir; las capturas se corrigieron esperando además la decodificación/pintado de imágenes SVG. Se revisaron las capturas finales después de esa corrección.

| I1   | Estado / evidencia actual                                                                                        |
| ---- | ---------------------------------------------------------------------------------------------------------------- |
| AC01 | Probado: entrada por escena/lista, vuelta y foco; navegador.                                                     |
| AC02 | Probado: inicialización única, 4/12, stock y regalos; unidad/navegador.                                          |
| AC03 | Probado: consulta sin consumo, seis probabilidades/versiones; contenido/navegador.                               |
| AC04 | Probado: commit/entrega/copia y tres rangos con fixtures; unidad/integración/navegador.                          |
| AC05 | Probado: replay/conflicto/agotado/doble acción y dos pestañas; integración/navegador.                            |
| AC06 | Probado: recargas, omisión, idioma y ritual; navegador.                                                          |
| AC07 | Probado: guardado fallido, recuperación y ausencia de éxito ficticio; integración/navegador.                     |
| AC08 | Probado: fichas/filtros/copias y stock cero; nueva prueba protege arte de ficha.                                 |
| AC09 | Probado automático es/en en estados normales/adversos; revisión visual CLI. Traducción humana externa pendiente. |
| AC10 | Parcial: teclado/foco/reducido/arte ausente/320/390/200 % comprobados; lector audible y móvil físico pendientes. |
| AC11 | Probado: configuración inválida, referencia/versión/resultado previo; contenido/dominio/navegador.               |
| AC12 | Probado: export/import/reset/cancelación; integración/navegador.                                                 |

Matriz y metodología base en [I1](../i1-evidence/REPORT.md). Estas comprobaciones no cierran A17, permisos T01 o acabado final A12. Firefox sigue pendiente según evidencia anterior.

## Capturas y mediciones

Galería real en [screenshots](screenshots/). CLI usa una fixture C02 controlada para comparabilidad; no son estadísticas de sorteos ni una nueva garantía del producto. Revisadas cinco vistas es/en, fichas y ampliación. [Comparación previa tienda](screenshots/before-shop-390.png) / [posterior](screenshots/after-shop-390.png).

![Resultado móvil en español, fixture C02](screenshots/cli-es-result-390.png)

En CLI a 390 × 844, el borde inferior de consulta está en 773,66 px es / 758,91 px en; usar en 760,80 px; álbum desde resultado en 773,81 px es / 733,47 px en. A 320 px: consulta 586,41 px; uso 755,75 px; álbum 788,41 px es / 729,92 px en. Son geometrías observadas de estas condiciones y fixture, no promesa para todo texto/dispositivo. Con ampliación se permite scroll normal, sin recorte.

Primera vista de build: **524.300 bytes transferidos** (objetivo propuesto ≤1 MB), Chromium 156.0.8078.4, contexto fresco y caché vacía, loopback, PerformanceNavigationTiming/ResourceTiming con estimación de cabeceras. [Datos](first-view.json). No es medición de red móvil ni fluidez física.

Contraste calculado de nueve pares CSS explícitos: texto/superficie entre 7,38 y 10,88:1; botón principal 7,42:1; foco 8,96:1. [Datos y método](contrast.json). No es auditoría completa de cada píxel sobre arte ni certificación WCAG. No se ha medido fps en móvil real.

## Pendientes y entrega

Assets existentes permanecen provisionales, con manifest original y mismo contenido/IDs. Arte final por capas y permisos T01 pendientes; no hay nuevos assets producidos. Pendientes lector audible, móvil físico, Firefox y sesiones A17, con procedimiento en la evidencia base. Siguiente paso pequeño: observar la visita y comprensión de las acciones con una persona del perfil, sin iniciar I2.

Commit/push normal a main y CI existente para SHA exacto se verifican y entregan por separado; no hay despliegue o publicación configurados.
