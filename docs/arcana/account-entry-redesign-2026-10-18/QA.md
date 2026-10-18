# A79 · QA en curso

Baselinea8948e8. No cambia backend, controlador, propietario o datos. La única defensa adicional de presentación impide volver a submit mientras una autenticación es incierta; Comprobar sesión pasa a ser el único CTA.

Locales:622unitarios, tipos y build correctos antes de la pasada Linux. No gráfico local. Pruebas de navegación A76/A78 usan ahora la ayuda nativa real para localizar alternativas: no force-click, no modificación de open desde script. Se conserva aceptación de dominio/recuperación.

Plan Linux serial:30A76,16A78, nueva A79 con concisión/recuperación/CTA único, más2A75baseline. Tres tamaños, ambos idiomas/packs representativos, ES/EN completos en A76. Buzones/cuentas aislados, unworker, cero retry, siete PNG explícitos como máximo. No pruebas humanas, dispositivo físico o gestor de contraseña real.

La aceptación visual exige revisar las capturas y comparar con A78, no solo pasar un detector. Métricas de altura, botones y palabras son límites de ensayo, no resultados de comprensión humana.

Primera pasada Linux39086671237 (`5ab612c`): tipos/build,622unitarios,99PG/Redis,backup,30A76 y2A75 correctos. A78 se detuvo tras3casos: el helper consultaba `count()` antes de que se montara el control y omitía desplegar su ayuda. Se añade espera de attached antes de inspeccionar ancestros. A79 se detuvo en registro: geometría de botones dentro de details cerrado no representa visibilidad (22palabras,487,6px,helpOpen=false pero4rectángulos). Se cuentan roles accesibles expuestos y se comprueba su visibilidad, manteniendo el límite3. No se relaja aceptación ni se fuerza click. Fallos conservados como evidencia; requiere ejecución nueva del candidato corregido.

Segunda pasada39087125690 SUCCESS, head99dae4a, checkout de integración a2515a3 (baseff23f580):622unitarios,99PG/Redis,30A76,16A78,7A79 y2A75baseline. Cuotas declaradas:30A76/11A78/2A79 skipped, no fallos ni retries. Los dos fallos anteriores eran sincronización/medición del test, no recuperación del producto. Siete capturas inspeccionadas: registro y verificación390, login/reset/incertidumbre1280, reparación390 y texto200%865. Encuadre y etiquetas conservados; ayuda de error larga requiere desplazamiento accesible. Se comprueba defecto visual pequeño: `summary` hereda marco de control y `details` margen40px global, haciendo competir ayuda con CTA. Corrección mínima: quitar marco/fondo y márgenes dentro de `.account-help`, conservar línea de separación, chevron y área44px. Requiere confirmación nueva de este CSS; no se atribuye la segunda pasada al candidato posterior.
