# Texto y contenido funcional

Auditoría editorial de código, no lectura humana exhaustiva de cada combinación renderizada. Propuestas pendientes de aprobación/implementación. No se cambia texto de la aplicación en A91.

## Reglas de edición

Una tarea por encabezado, una acción principal con verbo, estado o cantidad próximo al objeto, coste antes de gastar. Datos completos a demanda. Reducir repeticiones, no precisión. Nombres, PV, cantidades, errores y etiquetas de campos permanecen fuera de ilustraciones. ES/EN son mensajes completos con parámetros/plurales, nunca concatenaciones.

Distinguir **persistencia de partida**, **recuperación de acceso** y **recuperación de una operación**. No usar «guardado» para prometer acceso desde otro dispositivo al invitado. La frase de correo local sigue visible donde sea verdadera: el estilo no autoriza prometer envío externo.

## Edición concreta

| Contexto | Actual comprobado o diagnóstico | Propuesta ES / EN | Condición y aceptación |
| --- | --- | --- | --- |
| Introducción Diagon | «completa la Álbum de Cromos» | «Explora, reúne tu equipo y completa tu Álbum de Cromos.» / «Explore, gather your team and complete your Card Album.» | Corregir concordancia; no duplicar el título de bienvenida |
| Identidad EN | «The Diagon Alley» | «Diagon Alley» | Nombre de presentación; ARCANA conserva el suyo |
| Atlas U01 | `{own}/30` fijo | «{owned} de {total} identidades» / «{owned} of {total} identities» | Datos de proyección compartida; archivo fuera del denominador acordado |
| Bóveda antes de primera llave | Orientación genérica de vencer jefe | «Vence al jefe para conseguir tu primera llave.» / «Defeat the boss to earn your first key.» | Solo si ese derecho sigue disponible |
| Bóveda después de gastar llave única | Misma orientación aunque repetir no da llave | «Esta bóveda ya fue abierta.» / «This vault has already been opened.» | Solo si historial lo acredita; CTA «Ver colección / View collection» u otro plan realmente viable, no nueva llave |
| Bóveda sin fuente conocida | Falta contexto de fuente | «No tienes una llave disponible.» / «You have no key available.» | No inferir que se abrió si la llave falta por otro estado; detalle de fuente solo comprobable |
| Sesión cuenta caducada | Acceso queda fuera del aviso | «Vuelve a entrar para continuar con tu partida.» / «Sign in again to continue your game.» | CTA «Volver a entrar / Sign in again» abre acceso existente; no significa que se haya perdido progreso |
| Operación incierta | No confundir con fallo anterior al commit | «Estamos comprobando el resultado.» / «We’re checking the result.» | No afirmar cancelación; botón «Comprobar operación / Check operation» conserva key y dueño |
| Error estacional U04 | `{error}` técnico | «No hay conexión. Tu progreso confirmado se conserva.» / «You’re offline. Your confirmed progress is preserved.» | Solo para offline; no convertir cualquier error en offline ni ofrecer reintento incompatible |
| Edición finalizada | Disponibilidad del servidor | «Esta edición ha terminado.» / «This edition has ended.» | Si expedición iniciada aún puede terminar, añadir detalle específico del plazo, no bloqueo genérico |
| Grageas | Diferenciar stock y asignación | «{count} disponibles» / «{count} available»; «Asignada a {name}» / «Assigned to {name}» | Plural localizado, condición temporal/ordinal en nombre accesible; no fracción de tarea |
| Sabores | Ayuda ya llamada «El secreto de los sabores», no crafting implementado | Alternativa «Descubrir sabores / Discovering flavours» | Mejora de claridad, no defecto de receta existente; explicar que sabor se revela al activar y no se puede seleccionar |
| Error/falta de arte al cerrar | Solo nombre accesible | Símbolo × más «Cerrar / Close» cuando haga falta | Nombre completo accesible, foco y retorno; no mostrar error técnico por cada icono ausente |

Estas frases son ejemplos contextuales, no una tabla de reemplazo global. Los códigos de error necesitan mapeo por causa real y acción permitida. Nunca sustituir «operación incierta» por «inténtalo otra vez» si puede haber commit.

## Glosario de juego

| Concepto | Qué significa / ubicación | Qué no debe sugerir |
| --- | --- | --- |
| Afinidad | Regla táctica del personaje; icono junto a figura | Casa o rareza |
| Casa / grupo | Clasificación de identidad; posibles contribuyentes al vínculo | Varios bonos simultáneos si solo se elige uno |
| Vínculo elegido | Plan de equipo, contribuyentes y tier reales | Poder por cada etiqueta del cromo |
| Intención | Propósito voluntario de run, sin premio | Misión obligatoria o victoria garantizada |
| Objetivo de colección | Una identidad propia que se quiere adquirir | Temporal reclutado o variante encantada como otra identidad base |
| Copia / aliado temporal | Instancia propia / acompañante de run | La misma propiedad o equipamiento persistente |
| Encantado | Acabado especial registrado | Contribución×2 o más potencia |
| Descubierto / repetido | Estado de identidad propia | Rareza mayor o fracaso de la apertura |
| Borrador de gragea | Asignación reversible | Consumo ya realizado o sabor conocido |
| Ensayo | Entorno técnico cuando sea relevante | Una persona nueva o partida que deba crearse para recuperar cuenta |

## Mostrar, consultar, retirar

Visible: acción, coste, existencias, selección, condición necesaria y error accionable. Consultable: tabla exacta, afinidades/equipo detallados, procedencia, versiones, registro y recibo. Retirar de espacio permanente: mensajes técnicos repetidos, explicación del mismo concepto en varias bandas, éxito de guardado ya redundante. No ocultar una operación incierta por parecer «mucho texto».

Prueba editorial posterior: captura de cada estado afectado en ES/EN y ambos packs, nombres largos, plural0/1/varios,200% y320 px, lector y foco. No fijar un máximo universal de palabras para campos, errores o advertencias de gasto.
