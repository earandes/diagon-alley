# A70 · El último duelo

17 de octubre de2026. **Implementado y comprobado técnicamente en rama; CI conjunta correcta.** [PR3](https://github.com/earandes/diagon-alley/pull/3). Main y despliegue requieren autorización posterior.

El recorrido está integrado: consultar la amenaza → preparar → confirmar → reconocer al jefe en combate → entender el desenlace → usar el botín → escoger intención y confirmar otra expedición. [Contrato y plan](CONTRACT.md), [recorrido e hipótesis](JOURNEY.md).

## Qué cambia

La preparación presenta al primer rival nominal del snapshot —Hermione/Circe en Descubrimiento— con su formación, afinidades y sinergias efectivas. Las variantes Táctico, Maestría y legacy conservan sus equipos. No se promete quemadura por un único Fuego. Se reutilizan preparación, equipamiento y borrador de grageas; consultar o cancelar no inicia el combate. La cabecera compacta deja equipo y grageas visibles por encima del pie fijo.

La arena identifica a ese mismo adversario. La muestra circe anima piezas del libro de Hermione o del cuenco de Circe y sitúa allí el origen del hechizo confirmado. Anticipación, lanzamiento, contacto y asentamiento usan el reloj A69, sin otra fase mecánica, daño o sorteo. El cuerpo sigue siendo una ilustración plana, no un rig anatómico. Los demás líderes conservan su figura compatible. [Guion](MOTION.md), [recursos y fuentes](ASSETS.md).

El cierre conserva resultado → botín confirmado → acción contextual. Identifica un rival que participó y ofrece después hasta dos hechos propios del BattleLog bajo consulta, sin atribuirles causalmente la victoria. Llave, rana poseída, equipo e intención siguen dependiendo del estado real. Otra expedición continúa siendo una selección y confirmación explícitas.

## Evidencia

[Galería inspeccionada](GALLERY.md): cuatro imágenes Linux seleccionadas, con procedencia y distinción entre cuenta real aislada y fixture de presentación. No se ejecutó navegador, perfil, grabación o matriz gráfica en el Mac. Las correcciones de identidad y preparación se contrastaron con imágenes; no se aprobaron únicamente por aserciones de DOM.

CI Linux [38977202497](https://github.com/earandes/diagon-alley/actions/runs/38977202497) correcta para `0189d3a`; merge ensayado `024e88dd21fbb6274a3756133d80043f49014f81`. Tipos,542unitarios,77integraciones PostgreSQL/Redis, contenido, build y scan correctos localmente y repetidos en esaCI. Todas las regresiones incluidas terminaron correctamente. A70 completa55casos con cinco omisiones intencionadas de la muestra sostenida para evitar multiplicarla por toda la matriz. Sus24recorridos de autoridad cubren ES/EN, ambos paquetes y tres tamaños en Chromium/WebKit. Las fixtures cubren formaciones de3/4/5rivales, controles, estados caídos, reducido, texto ampliado y fallos. [Comandos, cronología y cobertura](QA.md).

Se produjeron cuatro pequeños crops transparentes:13.124B comprimidos, fuentes editables, manifests y exportador CPU reproducible. Sin nuevas dependencias, audio, servicios con créditos o generación en runtime. Dominio, contenido, persistencia y dependencias conservan exactamente los objetos Git de la base. [Compatibilidad](COMPATIBILITY.md), [archivos](CHANGES.md).

## Rendimiento y límites

[Mediciones](PERFORMANCE.md): la ventana del jefe tuvo P95 rAF≈16,8ms y568paints, con ocho montajes/desmontajes comprobados. La regresión genéricaA69 tuvo P95≈33,4ms y no cumple el objetivo20ms; se conserva junto a la variabilidad histórica, sin atribuir causa. Persisten picos de arranque; en la ventana inicialA70 el máximo fue233,3ms. La espera de imágenes se observa por recursos y promesas decode separadamente, sin presentarla como coste puro del decoder/GPU ni sumar intervalos solapados. No se garantiza rendimiento uniforme, físico o ausencia global de fugas.

Primera/repetida, derrota y empate se cubren también mediante proyecciones y fixtures declaradas; no se afirma haber perdido/empatado en los24recorridos ganadores. Respuesta perdida y concurrencia conservan los contratos existentes y sus pruebas, sin operaciones nuevas de presentación. Pausa/ocultación y pérdida de contexto controlada no equivalen a ensayos de driver o segundo plano físico.

Quedan la sesión humana, teléfono físico, lector hablado, percepción de personalidad y comprensión del cierre. H1/H2 y protocolo breve preparados; no realizados. El acabado del objeto y la satisfacción percibida siguen siendo hipótesis, no resultados de las simulaciones. La integración en main y el despliegue quedan fuera de esta entrega.
