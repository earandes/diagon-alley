# Integración del juego en main · 16 octubre 2026

Enric autoriza subir los cambios a main después de la entrega A63. Esta autorización sustituye la exclusión de push para la integración solicitada; no autoriza desplegar la aplicación. El workflow de GitHub ejecuta comprobaciones, sin despliegue.

## Alcance de la integración

El remoto estaba en I1 (`a88d923`). Para entregar una revisión ejecutable se incorporan también las dependencias locales de A63: núcleo ARCANA, autoridad Fastify/PostgreSQL/Redis, presentación Harry Potter/ARCANA, assets de runtime, originales editables de arte de ambas presentaciones, herramientas y skills locales, pruebas y documentación normativa. No cambian precios/reglas o las decisiones pendientes de A62.

El checkout habitual conserva sus archivos ajenos a esta selección. Se preparó y comprobó el candidato en un worktree aislado; el commit de main debe tener exactamente su árbol seleccionado. Los binarios/cache/modelos de `.tools`, datos de servicios, dist/node_modules y trazas ZIP no forman parte del repositorio. Evidencia gráfica seleccionada A63: galería, vídeos de los tres recorridos, matriz de arena y propuestas A62. Las demás capturas históricas/scratch permanecen en el checkout local, sin borrado ni sustitución. Los informes históricos describen pruebas locales; sus rutas no incluidas no se convierten en evidencia alojada en GitHub.

## Comprobaciones

Instalación limpia con lockfile (`npm ci --no-fund --no-audit`), build/tipos/skin, 395 unitarios, 40 integraciones PostgreSQL/Redis reales y verificación del artefacto. Recorrido A63 compilado en Chromium/WebKit, ES/EN y ambos packs, con foco, recuperación, recarga, primera/repetida y dos pestañas. Los resultados locales se registran en RESULTS.json. La comprobación posterior al push se consulta en GitHub Actions para el SHA publicado.

El escaneo de patrones de credenciales no encontró credenciales privadas ni sesiones de usuario entre los archivos seleccionados; claves/cookies de pruebas no se añaden como trazas. El diff conserva whitespace de licencias y guías importadas y evidencia histórica. Ese aviso no es un fallo de aplicación; no se reescriben fuentes históricas para eliminarlo. Sin migraciones adicionales, alteración de partida habitual o despliegue.

[Entrega A63](../gameplay-increment-2026-10-16/REPORT.md), [galería y vídeos](../gameplay-increment-2026-10-16/GALLERY.md), [garantías y límites](../gameplay-increment-2026-10-16/QA.md). Las pruebas técnicas no sustituyen la sesión humana ni validación física pendiente.
