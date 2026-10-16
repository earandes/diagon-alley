# A60 · QA de comercio

Entorno: DEV propio 5274/5275, namespaces únicos por ejecución y contextos Playwright nuevos. Nunca se abre 5194/perfil del propietario. No se compila/modifica dist ni se ejecuta GPU/perfil de rendimiento durante esta revisión.

## Cobertura

`playwright.commerce-a60.config.ts`:20 casos distintos, Chromium/WebKit, español/inglés. Doce nuevos A60 y ocho recorridos de tiendas (cuatro de ellos adaptados al nuevo comando). Comprar/abrir atómico, coste exacto y una revisión/receipt/copia; selección/consulta sin gasto; grageas no crean cromo/sabor; objetivo de preparación; unidad antigua sin recobro; offline bloquea gasto; reducido devuelve resultado estático; pérdida de respuesta tras commit recupera por GET de la misma key, un solo POST y misma entrega tras recarga.

Capturas en `commerce-after/`: estado inicial con Comprar y abrir, grageas disponibles, rana antigua poseída y explicación a demanda, por idioma/motor y anchuras 390/865/1280. Se comprueba ausencia de overflow horizontal. No son pruebas en teléfono físico ni observación de personas.

## Corridas

- `commerce-browser-initial.txt`:8/16 correctas; ocho casos nuevos fallaron por helpers: selector de preparación no acotado encontró la sección inerte y modal; setup POST no incluyó Origin. La compra atómica ya se ejecutaba con éxito en los recorridos adaptados. Helpers corregidos, sin debilitar comprobaciones económicas.
- `commerce-browser-hmr-interrupted.txt`: corrida interrumpida durante un cambio simultáneo del integrador que importó node-event-dialog.css antes de crearlo. Log de Vite preservado; no se cuenta como evidencia final de producto.
- `commerce-browser-before-hover-fix.txt`: 20/20 correctas en 48,2 s antes de la inspección visual; no se suma como otra cobertura.
- La inspección de la foto WebKit detectó el CTA de preparación casi ilegible en hover. La comprobación de contraste reprodujo 1,47:1 (`commerce-hover-contrast-red.txt`); corregida la prioridad CSS del CTA.
- `commerce-browser-final.txt`: **20/20 correctas en 54,4 s**, con contraste declarado hover/foco ≥4,5:1. No certificación global WCAG ni suma de repeticiones.
- **40 capturas finales**: ES/EN × Chromium/WebKit × tres anchuras de Comprar y abrir, rana poseída y grageas (36), más cuatro consultas. Inspeccionados ejemplos reales de ambos motores en móvil y escritorio; texto, coste, retorno y popup encajados.

Reglas/autoridad: `commerce-red.txt`7 fallos esperados previos a implementación, `commerce-green.txt`19/19 tras implementación; suite focal 75/75 en `commerce-unit.txt`, integración focal 18/18 SQL/Redis reales en `commerce-integration.txt`; typecheck correcto en `commerce-typecheck.txt`. Los conteos incluyen regresiones históricas y no se suman entre repeticiones.


## Selección de capturas finales

- [Comprar y abrir, ES865](commerce-after/es-buy-open-865-chromium-experience.png)
- [Comprar y abrir, EN390](commerce-after/en-buy-open-390-webkit-experience.png)
- [Unidad poseída, ES865](commerce-after/es-owned-frog-865-chromium-experience.png)
- [Grageas y preparación, EN865](commerce-after/en-beans-865-webkit-experience.png)
- [Explicación, EN390](commerce-after/en-bean-info-webkit-experience.png)

Todos los contextos y los servidores propios5274/5275 cerrados al terminar. No medición FPS durante esta QA.
