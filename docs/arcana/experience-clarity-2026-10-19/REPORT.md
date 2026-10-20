# A92 · Metas, recuperación y claridad ilustrada

**Implementado y técnicamente validado en la PR13.** CI[39353793256](https://github.com/earandes/diagon-alley/actions/runs/39353793256) completa correcta sobre `b6c0800` (checkout `135a4fe9`, árbol idéntico). U01–U11/U14 resueltos en los tres recorridos; U12 no fue necesario y U18 quedó acotado. Sin integración en main o despliegue.

## Experiencia integrada

1. **Una meta verdadera.** Atlas y Cromodex derivan su progreso de la misma proyección. Con el contenido actual hay34identidades base, incluidas criaturas y el kit inicial;33pertenecen a la tabla de apertura compatible. Copias y acabados no añaden identidades. El archivo histórico continúa consultable y se cuenta aparte, al igual que progreso estacional/sabores/equipo. Los números proceden del contenido, no de constantes en las vistas.
2. **Una continuación posible.** Gringotts distingue llave poseída, fuente pública con derecho pendiente, fuente agotada y falta de información histórica suficiente. Un saldo de cero llaves no acredita haber abierto la bóveda. Tras gastar el premio único se ofrece volver a la ruta o preparar otra expedición, sin sugerir una repetición que no da llave. Los receipts y el botín continúan consultables.
3. **La misma partida al recuperar acceso.** El aviso abre el acceso existente, conserva propietario/key/petición y no crea otro invitado. Cancelar conserva contexto. Reautenticar al mismo propietario mantiene el inspector; un propietario distinto no recibe su operación. Un resultado nuevo recuperado no debe tapar una autenticación aún sin terminar; una revelación ya abierta conserva sus Ajustes/Cuenta.
4. **Leer y preparar el plan.** Todas las relaciones públicas mantienen su geometría. Soporte oscuro local y patrones distinguen futuro, recorrido, disponible y consulta. La afinidad está junto al retrato; el vínculo elegido es un estandarte, las afinidades se amplían en libro y la intención sigue siendo un recordatorio distinto. No se añaden pasivos. Dos consumidores que mostraban Auto en lugar del vínculo elegido quedan corregidos.
5. **Personajes y objetos antes que metadatos.** Los nombres se distribuyen por palabras con puestos3+2/2+2 en los anchos pertinentes. Los retratos de Cromodex preceden a la consulta de rasgos, estrellas, procedencia y copias. El doblefolio muestra4u8según su ancho real. Una identidad archivada sin arte conserva reverso y reserva4:5. El tarro muestra stock y una unidad concreta, con navegación y asignaciones acotadas, incluso con100unidades.

## Qué se mantuvo

Teatro de alquimia, Diagon Alley principal/ARCANA intercambiable, ES/EN, poco texto por defecto, semántica/foco, reducido, replay y audio voluntario. Reglas, estadísticas, composiciones, precios, probabilidades, regeneración, premios, derechos únicos, campañas, IDs, snapshots, inventario y operaciones no cambian. No hay migración, dependencia, nueva tienda, región, personaje, audio o lote de arte. U12 no hizo falta. U18 se limita a modelos de lectura y cierres necesarios.

El archivo original y las evidencias A91 permanecen intactos. Su incorporación a Git es un commit documental separado, no una auditoría gráfica nueva de A92.

## Decisiones y correcciones contrastadas

- Se eligió estandarte compacto sobre un panel adicional de atributos; consulta nativa sobre tarjetas de metadatos equivalentes; tarro agregado con IDs concretos sobre botones por unidad.
- La primera muestra de rutas tenía soporte demasiado dominante en las ramas futuras. Se redujo solo esa capa, preservando todas las relaciones.
- La prueba a865px detectó nombres aún estrechos en media escena de escritorio. Se redistribuyeron puestos sin reducir fuente ni permitir palabras partidas.
- El archivo sin ilustración perdía su espacio visual. Reutiliza el reverso existente y conserva dimensiones; no cambia la identidad.
- La preparación completa expuso solapamientos reales de footer y Ajustes, y un rótulo rival partía palabras. Se corrigió el reparto de espacio y se probaron palabras enteras/sin colisión, también con cinco equipados/cinco borradores.
- La recuperación expuso prioridad incorrecta de diálogos: admisión visual de apertura separada del receipt, sin retrasar su commit ni desmontar escenas previamente admitidas.
- Se corrigen concordancia, nombre EN y singular/plural de los nuevos contadores. La ayuda sobre sabores ya explica que descubrir no permite elegir; se conserva, junto con los límites reales de invitado y correo de ensayo.

## Evidencia y límites

[Matriz de hallazgos](ACCEPTANCE.md), [QA y fallos conservados](QA.md), [compatibilidad y recursos](COMPATIBILITY.md), [metas/bóveda](PROGRESS-VAULT.md), [recuperación](RECOVERY.md), [mapa/preparación](MAP-PREPARATION.md), [colección/tarro](COLLECTION-SUPPLIES.md).

Las pruebas puras/SSR acreditan proyecciones y contratos, no composición en navegador ni comportamiento humano. Las cuentas conectadas utilizan PostgreSQL/Redis reales aislados y correo local ficticio. Las capturas son muestras declaradas Linux, nunca la cuenta habitual. La colección está capturada en reposo con reducido efectivo; los fotogramas estáticos no prueban animación. Los fixtures no se presentan como contenido ganado.

La CI ejecutó797pruebas unitarias,120conPostgreSQL/Redis reales y743casos de navegador correctos;345omisiones deliberadas no se cuentan como cobertura. Tipos, contenido, build, copia/restauración y regresiones de cuenta, jefe, tienda, Halloween yPWA pasaron. [Resultados y procedencia](evidence/final-ci-b6c0800.json), [galería](GALLERY.md) y [rendimiento](PERFORMANCE.md). Se conservan valores desfavorables: consulta de ruta85,9→162,6ms de mediana en tres pares, y ventanas de arena por encima de20ms; no se presenta A92 como optimización general. Las preferencias y controles visuales no acreditan lector, zoom real, dispositivo físico o comprensión/diversión. [Sesión humana preparada](HUMAN-SESSION.md).

## Entrega

Rama `feature/experience-clarity-a92-ci`; [PR13](https://github.com/earandes/diagon-alley/pull/13), base main. Sin autorización para merge o despliegue. El cierre documental posterior conserva [todos los objetos de código probados](CODE-EQUIVALENCE.json); no se atribuye otra batería a ese commit. Las dependencias y cambios exactos están en [FILES](FILES.md). Como siguiente paso se recomienda la sesión humana breve preparada, antes de ampliar sistemas o producción. No hay economía pendiente implementada ni funciones nuevas fuera del alcance.
