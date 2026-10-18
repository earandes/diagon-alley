# A79 · Comparativas seleccionadas

Fuente final: CI39087507256, head28186fa / checkout74ad009, Linux, muestras reducidas y datos ficticios. No son capturas del Mac ni observaciones humanas. Los campos vacíos reciben foco programático conservando la indicación cian.

| Vista | Antes A78 | Después A79 | Lectura de la revisión |
| --- | --- | --- | --- |
| Verificar, 390×844 ES/Diagon | [Antes](../accounts-fixes-2026-10-18/evidence/linux/complete/chromium-390-a78-verify.png) | [Después](evidence/final/chromium-390-a79-verify.png) | Objeto central, contraseña con ojo, una salida y ayuda. 816→604,23 px. |
| Acceso, 1280×900 EN/ARCANA | [Antes](../accounts-fixes-2026-10-18/evidence/linux/complete/chromium-1280-a78-login.png) | [Después](evidence/final/chromium-1280-a79-login.png) | Dos campos, un CTA y una fila de ayuda secundaria. |
| Recuperación, escritorio | [Antes](../accounts-fixes-2026-10-18/evidence/linux/complete/chromium-1280-a78-reset.png) | [Después](evidence/final/chromium-1280-a79-reset.png) | Política breve y detalles a demanda; no filas de acciones equivalentes. |
| Respuesta incierta, escritorio | [Antes](../accounts-fixes-2026-10-18/evidence/linux/complete/chromium-1280-a78-uncertain.png) | [Después](evidence/final/chromium-1280-a79-uncertain.png) | Comprobar sesión sustituye el envío, sin dos CTA. |

Otros estados inspeccionados: [registro móvil](evidence/final/chromium-390-a79-register.png), [código inválido](evidence/final/chromium-390-a79-code-repair.png), [WebKit865 al200%](evidence/final/webkit-865-a79-verify-200.png). La ayuda ampliada y el texto grande pueden desplazarse. Los correos largos son fixtures, no credenciales personales.

`evidence/review` conserva la primera composición correcta: la ayuda todavía heredaba marco y margen global. `evidence/final` confirma su corrección. `evidence/first` conserva la medición incorrecta de botones mediante geometría; QA explica por qué se sustituyó por roles expuestos sin relajar aceptación.

Estas imágenes acreditan composición estática. La navegación/recuperación se acredita mediante las pruebas de QA; la percepción de sencillez sigue siendo una hipótesis para observar con una persona.
