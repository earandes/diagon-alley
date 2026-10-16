# Prueba local para Enric · ARCANA A49/A50

Abrir **http://127.0.0.1:5190/** en este Mac. Se dejó el preview con autoridad Fastify/PostgreSQL/Redis funcionando. Es una URL local: no Sites ni enlace accesible desde otro ordenador/teléfono. Si se detuvo:

```sh
cd /Users/enricarandes/work/diagon-alley
npm run services:up
npm run build
ARCANA_TRIAL_NAMESPACE=arcana-visual-a50 npm run preview:arcana
```

No ejecutar otro preview sobre el mismo puerto ocupado. Docker debe seguir activo; PostgreSQL y Redis deben estar disponibles. Conservar los volúmenes y el namespace `arcana-visual-a50`; no usar `down -v`, editar saldos ni borrar datos para repetir.

## Sesión y repetición

«Comenzar ensayo local» / **Start local trial** crea el kit real: aprendiz, varita inicial, escoba inicial, 50 Coronas y Esencia. Conserva la cookie en el navegador habitual para seguir durante siete días. Recargar no concede otro kit. No hay cuenta recuperable: borrar la cookie, su caducidad o usar otro navegador no recupera el acceso a ese jugador. El progreso se guarda en PostgreSQL; la cookie/Redis permiten acceder a la sesión. Mantener backend y datos disponibles.

Para repetir desde cero sin cambiar saldos, usar **otro perfil o ventana privada con cookies nuevas**, comenzar otro ensayo y cerrar esa ventana cuando termine. Para reiniciar otra sesión privada, cerrar todas las ventanas privadas de ese perfil primero. La nueva sesión no reemplaza el progreso del navegador habitual. Existe un límite de 30 sesiones/hora en el launcher local; si se alcanza, esperar su ventana, no quitarlo para probar. Las pruebas automáticas usan namespaces propios y conservan esa regla.

**Ambos idiomas:** ejecutar cada recorrido una vez en español y otra en inglés, desde sesión nueva cuando se indique. ES/EN en la cabecera cambia etiqueta, no monedas, premio, vista o sesión. «Opciones del ensayo local» / **Local trial options** contiene explicación de guardado y «Reducir movimiento» / **Reduce motion**. Preferencia del sistema también se respeta.

## Recorridos

| Situación inicial | Pasos en es / en | Resultado esperado | Comprobar persistencia |
|---|---|---|---|
| Perfil nuevo | Comenzar ensayo local / Start local trial | Aprendiz y kit, 50 Coronas, Esencia; objetivo inicial explicado | Recargar: mismo kit y saldo, sin regalo adicional |
| Sesión recién creada | Mapa / Map → Iniciar expedición / Start expedition → dos primeros Pactos → confirmar cada nodo | Aquelarre de tres: aprendiz + dos aliados temporales; efectos/resultados confirmados | Recargar mapa: mismos nodos visitados y formación; temporales pertenecen a esa expedición |
| Tres unidades preparadas | Elegir Duelo / Arcane Duel; si hay tarro, asignarlo antes de Confirmar nodo / Confirm node | Combate guardado antes del replay; nombres/arte/vida separados; resultado y Volver al mapa / Back to map arriba | Recargar o cambiar idioma: mismo combate, vida final y premio; reproducir no gasta otra Esencia |
| Combate guardado | Pausa / Pause; Auto; 2x; Omitir reproducción / Skip playback | Cambia solamente reproducción, puede volver al mapa inmediatamente | Consultar el mismo resultado y saldo; no otra batalla por reproducir |
| ≥10 Coronas | Bazar / Bazaar → Confitería / Sweets → Comprar Sapo de Cacao / Buy Cocoa Toad | −10 Coronas y +1 Sapo disponible; stock visible | Recargar: misma unidad y saldo |
| Sapo disponible | Abrir un Sapo de Cacao / Open a Cocoa Toad | Caja→tapa→sapo→cromo real; nombre/rareza/estrellas y controles disponibles desde confirmación; celebración si nuevo | Ver en Cromodex / View in Chromodex, recargar: una copia adicional del mismo cromo |
| Otro Sapo, movimiento normal | Abrir, pulsar Omitir animación / Skip animation o cambiar ES/EN; repetir en otra sesión recargando durante apertura | Resultado estático equivalente, omitir desaparece al acabar, sin nuevo sorteo | Misma copia/receipt y saldo; ningún cromo extra por idioma, omisión o recarga |
| Movimiento reducido activado en Opciones | Abrir Sapo | Cromo estático, sin confeti ni botón Omitir; imagen aparece cuando carga, texto siempre disponible | Cromodex tras recargar conserva premio |
| ≥5 Coronas | Comprar Grageas del Azar / Buy Chance Beans; volver a Mapa y elegir un duelo; seleccionar tarro antes de confirmar | +1 tarro de cuatro posibles efectos, no apertura independiente; tarro asignado se consume en combate confirmado | Recargar: tarro consumido y sabor/efecto en log del mismo combate, sin segundo consumo |
| Colección con copias | Cromodex / Chromodex → filtros → Inspeccionar copia / Inspect copy → equipo | Retrato y estado de copia, stats/rareza/estrellas; seleccionar hasta cinco copias propias; objetos disponibles para equipar | Guardar equipo, recargar: mismas copias y piezas asignadas |
| ≥15 Coronas y aprendiz | Bazar → Taller / Workshop; Abedul/Birch + Dragón/Dragon → Forjar / Forge → Cancelar / Cancel | Cancelar conserva saldo/objetos y devuelve foco | Recargar confirma ausencia de una pieza nueva |
| Misma receta | Forjar → Confirmar forja / Confirm forge → Cromodex → copia del aprendiz → elegir nueva varita → Guardar varita / Save wand | −15, pieza confirmada ilustrada, asignación conservada; no segunda compra | Recargar: pieza propia, saldo y equipamiento iguales |
| Expedición con formación de tres | Ruta comprobada: `0:0 → 1:0 → 2:1 → 3:0 → 4:0 → 5:1 → 6:0` del Pasaje; confirmar nodos y volver al mapa cuando aparezca arena | Jefe; victoria da Coronas, llave y Sapo según tabla vigente. Misiones refleja completado/desbloqueo | Recargar Misiones: desbloqueo sigue. Bosque desbloqueado aún no tiene ruta jugable |
| Llave de jefe | Bazar → Bóvedas / Vaults → Abrir bóveda / Open vault → Cancelar, luego repetir y Confirmar canje / Confirm exchange | Cancelar no gasta. Confirmar consume una llave y muestra botín real; animación de feedback/celebración breve | Recargar: llave gastada, mismo botín/equipo/tarros. Es canje de llave, **no de duplicados** |
| Lectura confirmada online | DevTools → Network → Offline; intentar gastar; recargar; volver Online | Gasto deshabilitado; shell disponible, no saldo offline autoritativo. Reconectar recupera sesión/intención pendiente | Solo una operación al recuperar respuesta perdida con la misma key; sin compras automáticas nuevas |

Los IDs abreviados `0:0` corresponden a `pasaje:0:0`; en UI se seleccionan los nodos por su posición/tipo, no hay que editar JSON. La ruta evita depender de un premio aleatorio para preparar el kit. Balance/combate observados no garantizan victoria en cualquier otra composición/decisión.

## Casos adicionales sin tocar datos ajenos

- Con 50 Coronas de una sesión nueva, comprar cinco Sapos (sin abrir aún). Una sexta compra debe mostrar rechazo definitivo, sin «Sincronizando…» persistente y sin stock nuevo. Abrir con stock cero se comprueba en suites/dominio cuando el botón no existe en UI.
- Doble pulsación: observar un solo consumo/entrega; usar sesiones propias y consultar después de recargar. No reenviar manualmente una key con otro payload desde herramientas del navegador habitual.
- Dos pestañas del mismo jugador: actuar/recargar en ambas, comparar stock/colección. Las suites comprueban concurrencia y recuperación con PostgreSQL/Redis reales e intenciones IDB; no añadir saldos manuales.
- Arte ausente o WebGL perdido: las suites tienen abortos controlados y pérdida de contexto; deben conservar controles/texto/resultados. La captura sin retrato durante carga no se presenta como arte final revisado.
- Teclado: Tab hasta opciones/navegación, Enter en resumen/botones, Esc cancela diálogos, foco visible y retorno al origen/resultado. Ampliar texto al 200%: permitir scroll, no ocultar navegación por desbordamiento horizontal.

Pendiente de hardware: teléfono físico, zoom nativo, lector audible e instalación PWA física. Las pruebas disponibles son navegadores Chromium/WebKit en Mac con viewport emulado y texto CSS ampliado. No equivalen a WCAG completo ni a Safari/iOS/Android físicos.
