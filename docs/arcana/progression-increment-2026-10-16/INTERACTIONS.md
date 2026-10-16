# A67 · Encuentros: decisiones de interacción

16 octubre2026. Diseño e implementación de presentación; la evidencia de ejecución se registra en QA, por separado de esta especificación. No hay observación humana atribuida.

## Recorrido

Mapa → Encuentro disponible → personaje → dos tratos → previsualizar alcance/portador → confirmar o seguir de largo → condición guardada → continuar.

La invitación regional identifica el Encuentro. El diálogo conserva un solo acceso a Ajustes y cierre reversible de A66. El anfitrión usa un retrato4:5 existente, encuadrado proporcionalmente dentro de un marco del mismo aspecto; nombre proyectado por pack, texto funcional fuera de la pintura. La figura no es un nuevo cromo ni concede una copia.

Dos objetos representan atención individual y formación completa. Cada uno muestra recurso recuperado, porcentaje del máximo y coste en el recurso opuesto. El alcance se distingue por objeto, nombre y composición. El borde/sello y `aria-pressed` identifican la elección; no depende solo del color. No hay preselección silenciosa.

La opción individual descubre los retratos de la formación activa. Elegir portador sigue siendo borrador. Los integrantes caídos permanecen visibles y deshabilitados; el Refugio mantiene su función propia de recuperación. El coste nunca puede dejar a un integrante a0PV. Una opción sin beneficio o condición suficiente queda deshabilitada con razón breve. Siempre se puede elegir pasar o cancelar.

La vista previa exacta de PV/PM antes→después procede de `previewEncounterTrade`, compartido con la autoridad. La presentación no replica aritmética de curación, coste, límite o elegibilidad. Muestra a los afectados y conserva acceso al dato de las reservas sin modificarlo.

«Aceptar trato» es la acción principal del diálogo. «Seguir de largo» selecciona otro borrador y requiere confirmar el avance sin efecto. Cerrar cancela sin visitar. Consultar ayuda, cambiar idioma/mundo o consultar un candidato no compra, gasta, sortea o avanza.

## Identidad de los encuentros

- Sanador: convertir PM en PV; atención individual más intensa frente a recuperación modesta de todo el equipo.
- Erudito: convertir PV en PM; foco intenso sobre un integrante frente a recuperación modesta compartida.

Ambos reutilizan personajes existentes y sus equivalencias de pack. Los efectos son deterministas, fijados por contenido de la nueva expedición. La proporción y costes finales se documentan en el contrato/calibración, sin inferir eficacia por su presentación.

## Detalle y accesibilidad

El sello «i» es un `summary` de44px con nombre localizado. Abre las condiciones completas sin perder contexto. Ratón, foco y toque comparten los mismos controles; no hay información funcional exclusiva de hover. Los controles siguen el orden personaje/ayuda → alternativas → portador si procede → pasar → confirmación del parent. El foco inicial del diálogo debe dirigirse a la primera alternativa disponible o a pasar si no hay tratos viables.

El estado de borrador es una frase breve `aria-live=polite`. No se anuncia resultado antes del receipt. El cierre devuelve foco al nodo. Inventario/condición/resultados históricos siguen en los componentes de recibo existentes; no se introduce otra bolsa ni otra pantalla de misiones.

## Criterios para comprobar

1. Dos alternativas visibles, coste/beneficio correctos y no seleccionados inicialmente.
2. Unidad individual: escoger opción no confirma; escoger retrato no confirma; cancelar conserva estado.
3. Grupo: vista previa exacta sin selector redundante de portador.
4. Caídos, sin beneficio y condición insuficiente tienen razón; pasar permanece disponible.
5. Confirmación única y recuperación muestran exactamente la misma condición y elección.
6. ES/EN, ambos packs y tres viewports sin recorte de anfitrión/objetos; detalles/texto ampliado pueden desplazarse.
7. Teclado y foco, movimiento reducido y asset ausente mantienen las acciones.
