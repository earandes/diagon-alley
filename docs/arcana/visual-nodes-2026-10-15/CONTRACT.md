# A56 · Nodos visuales y rutas variables — contrato previo

15 octubre 2026. Dirección del propietario, no prueba con usuarios. Una región ARCANA; expansión A55 pendiente. Sin publicación.

## Recorrido y aceptación
Estado inicial: grafo fijo, todos los caminos conectados, mapa con desplazamiento y seis iconos monocromos. Equipo lleno bloquea un Pacto. Acción: iniciar expedición, inspeccionar rutas y resolver eventos. Resultado: grafo variable guardado por autoridad, mapa entero visible, eventos reconocibles por silueta/color, decisiones explícitas con resultados guardados. Recargar/reintentar conserva ruta, elección y entrega; cancelar inspección no escribe.

Incluido: generación restringida reproducible, conexiones menos densas, seis SVG propios, disposición ajustada al viewport, previsualización de eventos y elecciones. Excluido: regiones nuevas, nuevos catálogos, precios, pesos, premios base, estadísticas o migración de partidas. Sin dependencias nuevas; PixiJS, Motion gratuito y Playwright instalados. Los recursos son editables/provisionales.

## Revisión de los seis nodos
| Nodo | Problema | Cambio implementable | Invariante |
| --- | --- | --- | --- |
| Duelo | Confirmación sin rival ni botín | Varitas rubí; rivales, botín real de primera/repetida victoria y coste 5 | Combate automático y valores actuales |
| Refugio | Acción automática poco expresiva | Frasco esmeralda; elegir PV o PM y ver recuperación | PV actual 40%; PM 40% es hipótesis de ensayo, sin cambios numéricos de configuración |
| Cofre | Premio opaco antes de aceptar | Cofre ámbar y botín real visible | Entrega fija actual y atómica |
| Pacto | Aliado indistinto y bloqueo a cinco | Retrato violeta, sello temporal; reclutar, pasar si hay tres o reemplazar solo temporal | Nunca consumir/expulsar copias propias; primeros reclutas protegidos |
| Encuentro | Azar obligatorio sin decisión | Dado turquesa; arriesgar o pasar | Mismos pesos/efectos al arriesgar; pasar no sortea ni premia |
| Jefe | Poco diferenciable del Duelo | Torre/corona carmesí; rivales, llave y botín | Desbloqueo y recompensa actuales |

## Generación y persistencia
Permutar IDs completos con sus planes, conservar cantidades, recompensas y claves de primera victoria. Semilla uint32 elegida exclusivamente por autoridad y versión de generador 1 guardadas en la ejecución. Primer Pacto y dos alternativas de segunda etapa conservados; la rama del Cofre conduce a un Pacto para asegurar tres miembros antes de combatir. Resto de posiciones y conexiones variables, todas alcanzables y sin callejones sin salida. Partidas anteriores sin metadatos mantienen su grafo; no se regeneran al cargar.

## Casos de prueba
- ES/EN: abrir/cancelar cada evento no cambia estado; confirmar guarda exactamente una elección; reintento idéntico recupera; misma clave/otra elección da conflicto.
- Varias semillas: grafos válidos diferentes, mismos IDs/planes; recarga conserva grafo. Doble inicio concurrente no crea dos expediciones.
- Pacto completo: pasar o sustituir temporal; intentar sustituir propio rechaza sin escritura. Inicio con un aprendiz siempre tiene ruta de formación.
- Refugio: previsualización PV/PM coincide con guardado, límites y caídos explícitos. Encuentro pasado no genera semilla ni botín.
- Todos los nodos en viewport escritorio, 390/320 y horizontal; ningún scroll en mapa primario. Lista equivalente y paneles detallados pueden desplazarse por accesibilidad.
- Teclado, foco devuelto, movimiento reducido, arte ausente, Pixi quieto sin ticker continuo. Pruebas automáticas técnicas separadas de sesión humana A53 aún pendiente.

Refinamiento visual dentro del alcance: Grageas opcionales plegadas por defecto y rivales representados con los mismos assets del playback; confirmar debe quedar visible antes de abrir detalles. Sesión guiada prevista en ordenador, según corrección de Enric, todavía sin observaciones de resolución.
