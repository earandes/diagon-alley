# Skills de diseño instaladas para Diagon Alley

Instalación local pedida por Enric el 10 de octubre de 2026 (A28). Orígenes, SHA upstream, hashes y licencias en [design-sources.json](design-sources.json). No modificar la instalación global.

| Petición              | Skill / herramienta local                                                      | Uso en A28                                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Taste Skill           | [taste-skill](taste-skill/SKILL.md), `design-taste-frontend`, Leonxlnx         | Auditoría previa, lectura del encargo, jerarquía, ritmo y coherencia.                                                                                       |
| Web Design Guidelines | [web-design-guidelines](web-design-guidelines/SKILL.md), Vercel                | Auditoría de `src/ui` e `index.html`; reglas consultadas y snapshot versionado en references.                                                               |
| Awesome Design        | [awesome-design-fantasy](awesome-design-fantasy/SKILL.md), Bergside            | Registro y referencia fantasy; tokens semánticos, estados y criterios de componentes. No instalar las 67 direcciones incompatibles como reglas simultáneas. |
| Image-to-Code         | [image-to-code-skill](image-to-code-skill/SKILL.md), Leonxlnx                  | Extracción de tres conceptos Weasley existentes y comparación con las vistas reales.                                                                        |
| Playwright CLI        | [playwright-cli](playwright-cli/SKILL.md), Microsoft; `@playwright/cli@0.1.22` | Inspección, snapshots, capturas y comprobación visual es/en. Dependencia de desarrollo con lockfile.                                                        |

Los archivos se pueden leer y usar en esta tarea; la detección automática del catálogo de skills estará disponible en un turno siguiente. CLI funciona con Codex, sin instalar otro agente.

## Prioridad y adaptación al proyecto

Leer AGENTS/PRD/DECISIONS primero. Estas guías no aprueban decisiones de producto ni tienen precedencia sobre el encargo. Taste e Image-to-Code se orientan principalmente a marketing; aplicar solo lo pertinente al recorrido jugable. Conservar A11/A12/A26 y ausencia de barra A27.

No seguir sus defaults de regeneración de imágenes, Tailwind, Motion, GSAP, bibliotecas de iconos, dark/light toggle o nueva paleta si contradicen alcance, gasto o dependencias mínimas del proyecto. A28 autoriza herramientas locales, no generación con coste o publicaciones. Conservar símbolos de rareza y SVG provisionales registrados. Reglas/IDs/premios nunca se extraen de una imagen.

Licencias MIT de Taste/Image-to-Code/Awesome y Apache-2.0 de Playwright conservadas en cada carpeta. La fuente Vercel consultada no declara licencia en metadata/repositorio; no atribuirle una licencia inventada. Las licencias de herramientas no autorizan la franquicia o las ilustraciones.

## Uso reproducible

```sh
npm ci
npm run dev -- --port 5193 --strictPort
# Otra terminal, dentro de este proyecto:
npx --no-install playwright-cli -s=diagon-design open http://127.0.0.1:5193/ --browser=chrome --profile=.tools/design-review/profile
npx --no-install playwright-cli -s=diagon-design resize 390 844
npx --no-install playwright-cli -s=diagon-design snapshot
npx --no-install playwright-cli -s=diagon-design run-code --filename=tools/verification/review-design.cli.js
npx --no-install playwright-cli -s=diagon-design close
```

Chrome instalado es requisito de ese comando; la CLI tiene su Playwright de desarrollo (alpha transitivo declarado por upstream), separado del Playwright Test 1.64.0 estable del proyecto. No es dependencia de runtime. Perfil/salidas transitorias excluidos de Git; contextos del recorrido de captura son aislados y desechables. No cerrar sesiones de otros proyectos.

Las actualizaciones se hacen explícitamente por revisión fijada, conservando el manifest. Ver [dirección aplicada](../../docs/design-i1-v3/DESIGN.md) y [evidencia](../../docs/design-i1-v3/REPORT.md).

## ARCANA A52 · herramientas gratuitas (14 octubre 2026)

El PRD ARCANA vigente prevalece sobre las reglas históricas I1 anteriores. Nuevas copias locales: `arcana-impeccable`, `arcana-redesign-skill` (Taste), `arcana-game-feel`, `arcana-game-ui-ux`, `arcana-pixijs-rendering`, `arcana-rpg` y `arcana-game-design-workshop`. [Fuentes/revisiones/licencias](../../tools/arcana/design-tools-sources.json). Se conserva la instalación A28, no se reemplaza su catálogo ni instala globalmente.

Impeccable se instaló manualmente desde la copia oficial del skill, con launcher/contexto/detector reales. Motor descargado con verificación SHA del launcher en `.tools/arcana-design-tools/engine`, mediante `IMPECCABLE_HOME="$PWD/.tools/arcana-design-tools/engine"`. No hooks automáticos o cambios de confianza global. Contexto ejecutado una vez; sistema visual existente A50 conserva autoridad. Detector manual usado sobre los archivos cambiados; resultado y reparación documentados en el informe A52.

Agency es guía de texto en `tools/arcana/design-guides/`, no un equipo de subagentes ejecutado. Workshop tiene el runtime mínimo de economía/contratos en `tools/arcana/game_design_skills_suite` (MIT, biblioteca estándar); su launcher de skill puede usar `GAME_DESIGN_SKILLS_ROOT="$PWD/tools/arcana"`. Simulación específica: `python3 tools/arcana/simulate-balance.py`.

CLI Playwright local0.1.22 ya compatible; reutilizado sin MCP adicional ni instalar navegadores globales. Sesión propia `arcana-feel`, snapshots/capturas reales; no cerrar sesiones ajenas. Motion14.2.0/MIT fijado en package/lock, importación `motion/mini`; sin Motion+, assets con créditos o APIs nuevas. [Diseño vigente](../../DESIGN.md), [contrato](../../docs/arcana/game-feel-2026-10-14/CONTRACT.md).

Adaptación explícita: ignorar defaults de marketing, imagen generada, presets XP/monetización/rareza y motores ajenos. Pixi skill orienta v8.21, proyecto conserva8.22.0 y API v8 existente. Game-feel no añade shake/flash/audio; feedback proporcional y reducido. Sin publicaciones.
