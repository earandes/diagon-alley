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

## CI inicial39243286949 · candidatoaa575ea

Tipos, contenido,739unitarias,120integración ybuild pasaron en Linux antes del navegador. La configuración conjunta registró92casos (A76+A89) y se detuvo en el primero: seleccionar compañía no cambiaba el estado. Resultado:0correctos,1fallido,91no ejecutados/omitidos por límite; no son91casos validados. El artefacto y error se conservaron en `ci-attempt-1.json`.

Causa contrastada: la fixture presentacional declaraba copias `origin:toad` sin receipts de apertura. La primera acción de intención llama `gameSnapshot` y rechaza correctamente ese agregado inválido. Se corrige el origen de la fixture y se añade una comprobación no gráfica previa, sin relajar el dominio ni sustituir la acción por un cambio optimista. La ejecución propia se canceló después de preservar el fallo; no se atribuyen checks completos o regresiones superadas a esa CI.

La revisión paralela detectó ademásR01, una compañía elegida todavía viable desplazada por otra sugerencia al ampliar colección. RED/GREEN registrado en REVIEW-FINDINGS.md. Ambos cambios requieren un candidato posterior; no reintento automático del mismo código.

## Preparación del segundo candidato

Factory compartida de fixtures con receipts de kit/apertura, unidades consumidas y zona desbloqueada coherentes. Nueve tests nuevos ejecutan las mismas invariantes que usa la autoridad antes de browser;8RED anteriores→9GREEN. R01 conserva compañía seleccionada viable y rechaza la realmente inviable. El libro de hechos mantiene nombre visible si falta su imagen, con una aserción dinámica añadida a la cohorte de renderer/arte ausente (todavía pendiente Linux).

`npm run build` correcto: principal1.160,08kB/gzip355,51kB y advertencia500KB conservada. `npm test`:117archivos/749pruebas correctas. Sin navegador local. El siguiente push es un candidato corregido, no un reintento de la misma batería sin cambio.
