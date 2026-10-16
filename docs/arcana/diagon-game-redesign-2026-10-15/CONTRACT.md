# A57 · Rediseño completo Diagon Alley

15 octubre2026. **Implementación autorizada** por el mensaje actual de Enric; sustituye el alcance de investigación de la entrega anterior. Goal activo, elección de ingeniería y diseños delegada; subagentes autorizados. Sin publicación/despliegue/push o gasto adicional.

## Estado inicial y dirección

Interfaz híbrida React/PixiJS con mapa regional, seis nodos, arena, Pactos/formación, compra/apertura, colección/equipo, taller y bóveda conectados a PostgreSQL/Redis. Temática ARCANA activa y fuentes ilustradas estáticas; idiomas visibles en varias ubicaciones. Pruebas A56 son antecedentes. El propietario sigue percibiéndolo como aplicación.

Dirección aprobada ahora: Harry Potter / Diagon Alley como presentación principal, ARCANA intercambiable. Registrar explícitamente la sustitución de A29 solo respecto a presentación/nombres/arte; no restaurar reglas históricas I1. «Callejón de maravillas» es elección inicial de diseño por delegación: índigo, latón, madera y púrpura de dulcería, escenario dominante y navegación mediante objetos. Tres estudios locales comparan composiciones; selección de implementación puede hacerse dentro de la delegación actual, sin repetir la aprobación antigua del lote.

## Recorridos y resultado observable

1. Entrar/recuperar → mapa completo → Pacto/formación → duelo → recompensa → ruta; escenario y HUD común, texto a demanda.
2. Mostrador → compra explícita con precio → abrir rana → secuencia espectacular/omitible → cromo propio → álbum/equipo. Consumo/entrega confirmados antes de secuencia.
3. Asignar Gragea → activación real en combate → sabor descubierto en maletín. Solo cuatro sabores actualmente implementados; otros sabores/efectos son ampliación futura, sin pesos nuevos ni compras falsas.
4. Jefe → llave guardada → bóveda → botín real → siguiente objetivo disponible. Una región; futuras regiones no se fingen jugables.
5. Ajustes → idioma o temática → volver al mismo estado. Idiomas exclusivamente dentro de Ajustes. Swap de presentación no envía operaciones económicas, no recarga partida ni reclasifica copias.

## Conservación y recuperación

IDs compartidos y snapshots históricos intactos. Operaciones idempotentes y atómicas, no éxito optimista. Preferencias de idioma/tema opcionales en almacenamiento local; si falla siguen funcionando en sesión. Movimiento reducido propio/sistema elimina efectos nuevos y permite acceder inmediatamente al resultado estático. Foco/teclado/toque y arte ausente preservados. Registro de sabores derivado de eventos/receipts autoritativos; no saldo o autoridad nueva en cliente.

## Arquitectura y recursos

Mantener React/Pixi8/GSAP/Fastify/PG/Redis: ya cubren escenas, sprites, secuencias y servidor. Se evalúan filtros Pixi8 solo si se usan y miden; no migración de motor por apariencia. Fuentes existentes reutilizadas preservando procedencia; nuevos recursos locales editables y exports con manifest. No imagegen/servicio de créditos. No prometer rig o capas de pintura inexistentes. Derechos de distribución de la temática siguen fuera de esta preparación privada.

## Aceptación

ES/EN; ninguna elección de idioma fuera de Ajustes; botón semántico bajo objeto, coste visible; ambos packs conservan exactamente estado servidor; reload/recovery/skips sin duplicación; cuatro sabores desde activación propia real; mapa normal sin scroll; arena/log persistido; apertura con fases y omisión; comprobación reducida/foco/ausencia de arte. Tipos/build/validadores/unitarios y SQL/Redis reales pertinentes. Browser/capturas/rendimiento cuando las herramientas permitan acceso; no rodear bloqueos. Separar conceptos, capturas reales, emulación, hardware físico y usuarios.

## Loop de ejecución

- [x] Investigación y contexto; goal y tres tareas especializadas.
- [x] Diseño y muestra/kit local con procedencia.
- [x] Pack dual + Ajustes + interfaz de escenas.
- [x] Apertura/efectos + colección de sabores + objetivos.
- [x] Verificación, correcciones y revisión independiente; resultados y límites en REPORT/BROWSER-TESTS.
- [x] Documentación, evidencia y entrega de pendientes explícitos; arte final, apertura fría y observación humana pendientes identificados.
