# A92 · U01 / U02 · Metas de colección y bóveda

19 octubre 2026. Baseline `86d6a92665f63616034a4fcd668c5df6ffe3e322`. Implementación local en la rama del incremento; sin commit, push, navegador o servicios ejecutados por este subencargo. La validación integrada, el SHA probado y CI los registra el coordinador.

## Evidencia → problema → cambio → aceptación

| Hallazgo | Evidencia contrastada en código | Cambio mínimo | Comprobación |
|---|---|---|---|
| U01 | JourneyCabinet contaba todos los IDs propios y mostraba `/30`; CollectionPanel añadía identidades históricas al total de Cromodex | Proyección pura compartida de identidades vigentes, archivo y obtención aleatoria | Catálogos30/34, identidad archivada, repetido/encantado, starter fuera de tabla; ningún resultado >100% ni mutación |
| U02 | CommercePanel emitía `earnBossKey` siempre que faltaba llave; `victoryReward` da0llaves en repetición y primeras victorias se identifican por levelId+campaña | Orientación desde stock, planes públicos/snapshot y derechos existentes; visita solo probada por receipt | Antes de ganar, con llave, primera victoria reclamada, saldo0 sin prueba de uso, recibo de apertura, versiones y bifurcación histórica |

Son problemas de la proyección y orientación, contrastados por fuente y tests puros/SSR. No se presentan como nuevos recorridos jugados en navegador o con personas.

## U01 · Un universo explícito

`application/client/collection-completion.ts` exporta:

```ts
collectionCompletion(catalog, copies, table?)
// current:    { discovered, total, ratio }
// historical: { discovered, total }
// obtainable: { discovered, total } | null
```

- **Current:** identidades únicas del catálogo vigente recibido. El numerador contiene únicamente IDs con copia propia confirmada dentro de ese catálogo. Incluye el aprendiz del kit, aunque no esté entre los tickets de rana. Con el contenido actual es34, pero ningún número se fija en la vista.
- **Historical:** identidades propias ausentes del catálogo vigente. El total del archivo es el conjunto histórico realmente conservado, no un catálogo histórico completo inventado. Permanecen consultables mediante Cromodex; no aumentan numerador o denominador principal.
- **Obtainable:** subconjunto de identidades con ticket positivo en una tabla de apertura validada y compatible. Actualmente33. Es una fuente concreta de adquisición aleatoria, **no otro porcentaje global ni una sustitución del universo base**. Si no hay tabla fiable se conserva `null`, no se inventa una oportunidad.
- Copias repetidas y acabados encantados tienen la misma identidad base. Temporales, recuerdos de evento, sabores, equipo y combinaciones no pertenecen a este denominador.
- La colección utiliza el catálogo vigente de colección; esto no reemplaza el snapshot táctico de una expedición ni reclasifica copias antiguas.

JourneyCabinet consume la proyección compartida y muestra el archivo por separado únicamente si existe. Sin PublicContent compatible, conserva un contador de IDs propios sin inventar denominador. App pasa el contenido disponible. CollectionPanel integra la misma proyección por su propietario de archivos.

**Política de extensión:** una identidad retirada conserva su copia en archivo; añadir una al catálogo amplía el universo vigente explícitamente. Si en el futuro el catálogo incluyera identidades permanentemente inobtenibles sin kit u otra fuente, habrá que decidir su pertenencia al100% antes de publicarlas. Este incremento no fabrica una fuente para resolver esa futura decisión ni usa propiedad previa como prueba de obtención futura.

## U02 · Una llave posible, no una promesa de repetición

`application/client/vault-guidance.ts` proyecta:

| Estado | Evidencia | Orientación |
|---|---|---|
| ready | goldKeys>0 autoritativo | Acceso a bóveda y confirmación existente de1llave |
| source | Plan público/snapshot con llave y derecho no reclamado cuando corresponde | Consultar ruta; jefe solo si la fuente es un jefe |
| unavailable | Planes conocidos sin fuente restante accesible | Volver a la ruta activa o preparar otra expedición; no prometer otra llave |
| unknown | No hay planes suficientes para determinar fuente | Reconocer límite de información; no inventar llave o visita |

La proyección considera:

- Primeras victorias por `levelId` y versión de campaña, igual que el caso de uso existente; no usa versión de catálogo, desafío o arte para renovar derechos.
- Recompensas conocidas de duelo/jefe y sus derechos; cofres deterministas o encuentros aleatorios públicos se reconocen según su comportamiento real, sin afirmar garantía para una oportunidad aleatoria. El contenido actual solo da la llave en la primera victoria del jefe.
- Una expedición histórica activa puede conservar una fuente distinta de la configuración actual. Solo se consideran sus nodos todavía alcanzables desde las conexiones públicas, no una rama descartada.
- Si una run histórica activa carece de snapshot y su versión no coincide con los planes públicos disponibles, no se declara que sus fuentes estén agotadas: sin otra fuente conocida el resultado es `unknown`.
- Para una futura expedición se consideran las fuentes del contenido vigente en una zona ya accesible. Esto no inicia otra run, selecciona formación ni paga Esencia.
- Saldo0 **no** prueba apertura. `opened` solo procede de un receipt `open-vault` ya disponible en CommercePanel. Sin esa evidencia se dice que no quedan fuentes conocidas, sin declarar la bóveda visitada.

El objeto del Atlas conserva acceso a la bóveda/recibos cuando no queda fuente; deja de señalar un jefe como si repitiera su llave. No sustituye ese acceso por un segundo botón idéntico de Cromodex. Con llave prioriza el objeto-llave existente; con fuente usa el icono real del tipo de nodo.

## Persistencia, rendimiento y recuperación

- Ningún esquema, endpoint, inventario, derecho o transacción nuevo. Ambos modelos son de solo lectura; no aceptan saldos enviados por UI ni conceden recompensas.
- `vaultGuidance` no lee receipts. Una prueba instala un getter que falla si intenta consultar el historial.
- CommercePanel reutiliza el receipt histórico que ya mostraba. La búsqueda ahora está memoizada por referencia de receipt/historial/modo y recorre desde el final hasta encontrar la operación pertinente; no copia e invierte todo el array en cada render local.
- La recuperación, cancelación y gasto de la llave permanecen en los casos de uso existentes. Consultar el nuevo mensaje no crea operación. Repetición, respuesta perdida y recarga no reciben una concesión adicional de esta proyección.
- No se cambian costes, botín, probabilidades, Esencia, kit o fuentes maestras. No se añade caché global ni historial duplicado.
- Esta reducción de trabajo es justificable por inspección, **no** una mejora de milisegundos medida. No se ejecutaron perfiles locales.

## Interacción y texto

No se producen nuevos assets, partículas o animaciones. Se reutilizan libro, mapa, llave, cofre e iconos de nodos, con controles semánticos existentes. Las frases son breves y están en `progress-vault-messages.ts`, ES/EN, compartidas por ambos paquetes; no añaden nombres temáticos incompatibles.

Ejemplos de orientación:

- «La primera victoria de este jefe aún puede entregar una llave.»
- «No quedan fuentes de llave disponibles en el contenido actual.»
- «Bóveda visitada. No quedan fuentes de llave disponibles en el contenido actual.» únicamente con receipt.
- «Volver a la ruta» con run activa; «Preparar otra expedición» con run cerrada o ausente.

Navegar a preparación no inicia otra expedición; selección y confirmación continúan siendo explícitas. Los resultados anteriores siguen consultables y no vuelven a celebrarse por actualizar idioma.

## Pruebas ejecutadas por este subencargo

1. RED anterior al código: `npx --no-install vitest run tests/domain/arcana/progress-vault-a92.test.ts --maxWorkers=1` falla por módulo `collection-completion` todavía ausente. No se presenta como un fallo de juego reproducido.
2. GREEN inicial:9casos correctos. Después se añade cobertura adversa de snapshot/rama histórica y SSR de ambos paquetes, y se corrige la fixture para que sus rutas activas no terminen ya en un jefe.
3. Última ejecución tras esos cambios:

```sh
npx --no-install vitest run \
  tests/domain/arcana/progress-vault-a92.test.ts \
  tests/domain/arcana/client-read-models.test.ts \
  tests/domain/arcana/preparation-presentation.test.ts \
  tests/domain/arcana/commerce-preparation-a89.test.ts \
  --maxWorkers=1
```

Resultado tras reforzar el fallback histórico: **4archivos /38casos correctos**,1,19s, Vitest5.0.3.12casos propios A92 y26regresiones existentes. El caso de snapshot ausente tuvo RED propio (esperado `unknown`, recibido `unavailable`;11/12correctos), seguido del cambio mínimo y GREEN. Tras añadir además `validateRun` a las fixtures históricas, la suite propia vuelve a pasar12/12 en629ms; no es una nueva ejecución de las otras26regresiones. Esto prueba modelos y markup SSR, no foco, clics, animación o un dispositivo.

Una comprobación intermedia `npx --no-install tsc --noEmit --pretty false` detectó un error de tipo en el harness de colección que otro agente estaba implementando (`activePack` tratado como función). Se comunicó al coordinador; no se presenta aquella ejecución como tipos superados ni se modificó el archivo ajeno. El resultado final de tipos/build queda en QA integrado.

## Cobertura pendiente del coordinador

- Candidato final: tipos/build/contenido y regresiones integradas.
- CI Linux protegida: Atlas/Cromodex mismo total con archivo; primera victoria→llave→confirmar bóveda→recarga→sin nueva llave; cancelar y respuesta perdida; retorno de foco y teclados; ambos packs/idiomas y viewports acordados.
- PostgreSQL/Redis real para las garantías de los casos de uso existentes y de la recuperación modificada por otros bloques, sin atribuir a SSR persistencia real.
- Revisión seleccionada de composición/200%/320px e información suficiente sin saturación.
- Observación humana y dispositivo físico pendientes: reconocer que archivo no resta ni aumenta progreso base, comprender que la llave única ya no es repetible y encontrar un objetivo voluntario distinto. Los tests no acreditan comprensión o motivación.
