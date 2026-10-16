# A55 — Región ilustrada y equipo que se inspecciona

15 octubre 2026. Enric sigue viendo demasiado texto en after-map; solicita fondo ilustrado del mapa, equipo simple con datos al pasar el cursor, y visión incremental por regiones con fondos, magos/rivales y complejidad distintos. Autoriza comenzar con una sola zona y documentar la expansión futura.

Antes: pergamino opaco Pixi tapa el escenario, roster muestra nombres/estadísticas/equipo siempre, guía duplica títulos y último resultado desplaza la ruta.

Incluido: retirar relleno opaco, usar escena A50 de la zona como fondo real del área de ruta; mantener caminos/estados/nodos accesibles con fallback sin WebGL. Reducir interfaz permanente a región, retratos, estado visual y cifras de recursos. Ficha de miembro por hover, foco o toque, cerrable con Escape/fuera/segundo toque; debe permitir mover el cursor a la ficha y consultar sin gasto. Ayuda y recibo detallado a demanda; recompensas confirmadas representadas por objetos/cifras. Una región realmente jugable.

Futuro aprobado como dirección, no implementado: superar región desbloquea otra, con paisaje propio, magos/rivales/encuentros propios y complejidad creciente. Identidades/escenas sustituibles por paquete temático, compatible con aspiración Harry Potter A50. Este incremento conserva paquete ARCANA: no se ha seleccionado catálogo alternativo ni pedido producirlo ahora. La siguiente zona no puede fingirse jugable, ni repetirse el mapa actual anunciándolo como nuevo. No se aprueban ahora valores de dificultad, economía ni pools definitivos.

Persistencia: inspección/hover/lista/idioma/cancelación no envían comandos. Grafo/adyacencia, combates, reclutas, premios, probabilidades y partidas intactos. Recarga conserva receipt y progreso. No migraciones, servicios nuevos, generaciones con créditos, despliegue o publicación. Reutilizar ilustración existente, registrar procedencia; fondo ausente permite operar.

Aceptación ES/EN: fondo de región visible dentro del mapa; ruta y lista equivalentes; equipo sin nombres/cifras desplegados por defecto, ficha correcta por instancia incluso magos repetidos, hover/foco/touch/Escape/fuera; popup dentro de viewport y hoverable; sin operaciones al inspeccionar; reducido estático, 320/390/1280 y texto200%; confirmar/reintentar/recargar conserva transacciones. Tests RED/GREEN, build, capturas antes/después y límites de evidencia.
