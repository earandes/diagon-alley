# Validación A89 · registro en curso

## Entorno y alcance

Mac anfitrión: únicamente inspección, builds y pruebas no gráficas. Ningún navegador local, captura, vídeo o perfil. Servicios PostgreSQL/Redis existentes saludables; cuentas, namespaces y esquemas ficticios aislados. No se ha gastado ni reiniciado la partida habitual. Gráficos únicamente CI Linux serial bajo protecciones originales.

## Ejecuciones anteriores al candidato

- `npm run build`: correcto en estado intermedio; tipos y skin correctos, Vite advierte chunk principal mayor de500KB. No se oculta como mejora de carga.
- `npm test`, primera batería:729correctos/6fallidos. Cuatro de PM05 se ejecutaron mientras su componente aún se editaba; dos de A71 esperaban literalmente una etiqueta anterior. Se estabilizaron componentes y se actualizó la aserción a la etiqueta completa de stock/borrador, conservando comprobación de no consumo. No se atribuye un arreglo a repetir sin cambio.
-39focales: un fallo real de contrato de presentación, hechos ordinarios emitían markers de jefe. Se separó BattleFacts genérico y wrapper BossBattleFacts;39correctos tras corrección. El cierre evita duplicar hechos por el receipt anidado.
- `npm test`, batería posterior:116archivos/735pruebas correctas. Archivo local de salida `/tmp/arcana-a89-unit-second.log`; no se suman baterías solapadas.
- `npm run test:integration`:20archivos/120pruebas correctas con PostgreSQL/Redis reales. Incluye concurrencia, propietario, recuperación y nuevas intenciones/prefijo inmutable de receipts. Salida local `/tmp/arcana-a89-integration-first.log`.
- Detector estático Impeccable sobre guía, intención, preferencias, hechos y CSS propio:[]findings. No acredita calidad artística ni accesibilidad completa; requiere evidencia en contexto.

## Comprobación final local no gráfica

- `npm run build`: correcto, incluye validación de skin/tipos. Chunk principal1.160,01kB/gzip355,48kB; Pixi269,91kB, advertencia500KB conservada.
- `npm test`:116archivos/739pruebas correctas, después de la prioridad histórica de hechos y cuatro regresiones SSR nuevas.
- `npm run test:integration`:20archivos/120pruebas correctas en ejecución final, incluido test concurrente actualizado.
- `python3 tools/arcana/economy-study-a89.py --self-test`: correcto. Nueve hashes de fuentes activas y hashes de entrada/modelo cotejados con resultados.
- `git diff --check`: correcto antes de preparar candidato.

## Candidato y CI

Pendiente registrar SHA de rama, ejecución Linux y evidencia seleccionada. Los resultados anteriores no se presentan como una batería ejecutada sobre un SHA futuro. Los tests nuevos declaran fixtures; su economía y catálogo no se presentan como obtenidos por una persona. Completitud humana, retención, diversión, lector y dispositivo físico siguen pendientes.

Incidencia de entrega: primer push rechazado por scope OAuth insuficiente para workflows. Se retiró exclusivamente la modificación propia de workflow, se conserva el original y se integra la batería en configuración ya ejecutada. El rechazo no corresponde a defecto del juego ni a CI fallida. La PR no se creó en ese intento porque la rama no existía aún remotamente.
