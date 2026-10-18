# A78 · Correcciones de acceso recuperable

18 octubre 2026. Autorización: «resuelve los puntos encontrados». Baseline c7cf5a42 en feature/a76-recoverable-accounts, PR7 sobre feature/a75-experience-fixes. Sin merge, despliegue o publicación. A76 y A77 se conservan como evidencia histórica.

## Resultado buscado

Solicitar código → reconocer destinatario y propósito → introducirlo → corregir o reenviar deliberadamente → guardar/recuperar la misma partida. Desde cualquier Ajustes: consultar la misma identidad, cancelar y regresar; cambiar de propietario explícitamente invalida borradores del contexto anterior.

## Alcance y aceptación

- F01: solicitud aceptada conduce a verify/reset; destinatario visible, reenvío secundario y vuelta editable. No prometer correo externo.
- F02: solicitud de correo incierta ofrece reenvío deliberado, no comprobación de identidad; autenticación incierta conserva comprobación de sesión. Código inválido tiene reparación directa.
- F03: contraseña nueva oculta por defecto al cambiar de tarea.
- F04: resolver sesión vigente al abrir; peticiones antiguas no sustituyen estado vigente ni pisan credenciales en curso.
- F05: cierre reconocible y objetivo completo de44px, también sin arte y con texto ampliado.
- F06: una coordinación para los cinco contextos Ajustes; cancelar conserva contexto/foco; cambiar propietario descarta borradores, nunca operaciones confirmadas.
- F07: error próximo a la acción, visible/localizable en390 y accesible con ampliación.
- F08: política compartida15–128 puntos de código/512bytesUTF8; no truncar, normalizar o recortar contraseñas. Servidor conserva autoridad y KDF.

## Persistencia, recuperación y exclusiones

No cambia esquema, identidad, sesiones, tokens, KDF, inventario, premios, snapshots, economía o combate. Consultar no opera. Se conservan exclusión de operaciones pendientes, key y propietario, recuperación de respuesta perdida, sesiones y buzón privado real de ensayo. No SMTP externo, nuevos assets, dependencias, ritual, recompensas ni cambios de bienvenida H01/H02.

## Plan vivo

1. [implementado; QA en curso] Corregir solicitud/código/contraseña y pruebas de política compartida.
2. [implementado; QA en curso] Unificar coordinación de Ajustes y sesión vigente; proteger borradores.
3. [implementado; QA en curso] Composición móvil/cierre/error y pruebas de recorrido.
4. [en curso; local correcto, CI pendiente] Tipos/build/unitarios/PGRedis; CI Linux serial y evidencia seleccionada.
5. [pendiente] Correcciones de defectos demostrados, documentación y actualización PR7 sin merge.

## Seguridad y evidencia

Sin navegador local. Gráficos solo CI Linux con protecciones originales, un worker y cero reintentos. Baseline visual A77 se compara con capturas nuevas seleccionadas. Automatización no acredita comprensión humana, gestor de contraseñas real o dispositivo físico. No se marca probado antes de ejecutar.
