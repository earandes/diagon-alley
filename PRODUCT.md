# Diagon Alley / ARCANA

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Fans adultos del mundo de Harry Potter que quieren explorar, coleccionar personajes y sabores y disfrutar los descubrimientos. Enric prueba actualmente en ordenador; la web también debe funcionar en tamaños móviles. No hay evidencia de retención o sesiones formativas completadas.

## Product Purpose

Un juego de exploración ramificada, combate automático y colección. El jugador decide una ruta, prepara aliados y objetos, obtiene monedas/botín y descubre personajes mediante ranas de chocolate. Objetivo de producto expresado por Enric el15/10/2026: que apetezca descubrir y seguir jugando. Es una meta a validar, no un resultado demostrado.

## Operating Context

Repositorio local privado, React/TypeScript/Vite con PixiJS/GSAP y autoridad Fastify/PostgreSQL/Redis. Recorridos existentes: Pactos/formación, mapa, arena, recompensas, compra/apertura, colección/equipamiento, taller y jefe/bóveda. Una región jugable; expansión incremental prevista. Documentación normativa en docs/PRD.md y docs/DECISIONS.md; Word históricos intactos.

## Capabilities and Constraints

Instrucción vigente del propietario: Diagon Alley/Harry Potter principal y ARCANA intercambiable por presentación. Conservar IDs, partidas, snapshots, precios, probabilidades y efectos. Colección de sabores basada en activaciones reales ya persistidas; no otorga productos adicionales. Propuestas económicas se documentan y simulan fuera del juego.

Herramientas gratuitas y locales; sin APIs de pago/créditos, publicación, despliegue o push. Elección de ingeniería/diseño y uso de subagentes delegados explícitamente en el mensaje actual. La instalación de una herramienta no acredita calidad final de arte.

## Brand Commitments

Mundo de Harry Potter y juego ilustrado con escenarios, assets y animaciones protagonistas. Poco texto por defecto. Idioma dentro de Ajustes. ARCANA se conserva como temática intercambiable, con el mismo progreso económico.

## Evidence on Hand

Fuentes de arte históricas y ARCANA, manifests, contratos de integridad y pruebas locales anteriores. La investigación de herramientas está en docs/arcana/game-ui-research-2026-10-15/. Revisión actual por código/archivos; acceso del navegador a la pestaña local bloqueado en la investigación. Capturas nuevas y validación humana se registrarán separadamente; no se sustituyen por imágenes de conceptos.

## Product Principles

- Una decisión clara y una consecuencia visible por acción.
- La presentación nunca decide o vuelve a sortear una recompensa.
- El contenido temático se sustituye sin perder propiedad o progreso.
- Mostrar los costes y distinguir temporal/propio/nuevo/duplicado.
- La diversión y el deseo de continuar necesitan observación con personas.

## Accessibility & Inclusion

Español/inglés, texto funcional separado del arte, nombres semánticos, teclado/foco y consulta equivalente a hover. Rarezas/origen/estados con indicadores redundantes. Movimiento reducido propio/sistema y omisión con resultado estático equivalente; arte o WebGL ausentes no bloquean el núcleo. WCAG2.2AA es meta, no certificación.
