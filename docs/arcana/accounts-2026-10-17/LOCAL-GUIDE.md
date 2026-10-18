# A76 · Cómo utilizar el ensayo de cuentas

No hay despliegue ni integración en main. Utilizar la rama A76 con servicios y aplicación del proyecto, sin reemplazar volúmenes o cambiar arbitrariamente el namespace de una partida invitada que se quiera conservar.

## Arranque deliberado del entorno

Con la rama A76 y sin otro preview propio en el mismo puerto:

```sh
npm run services:up
npm run build
npm run preview:arcana
```

La URL por defecto es `http://127.0.0.1:5190/`. Estos comandos se documentan para uso deliberado; no se abre navegador ni se reinicia un preview existente durante QA. No cambiar puerto/origen/perfil/namespace de una partida invitada que se quiera vincular sin comprobar primero su sesión. No usar los scripts gráficos históricos del README como excepción a AGENTS: solo `test:browser:local` está permitido en Mac con sus controles; las matrices corresponden a Linux.

## Desde el inicio

Crear cuenta solicita el correo; Tengo el código abre verificación y elección de contraseña. Iniciar sesión recupera el jugador ya vinculado. Jugar como invitado conserva el ensayo temporal actual o crea uno si no existe; no garantiza recuperar acceso si se pierde su cookie antes de vincular.

En este entorno NO se envían correos por Internet: el servidor escribe cada mensaje en `.local/arcana-mail/<namespace>/` con permisos privados. El responsable local puede consultar el archivo del destinatario de ensayo e introducir su código en la interfaz. No copiar tokens o contraseñas a issues, logs, capturas o conversaciones. No hay endpoint público para leer esos mensajes. Las pruebas automatizadas utilizan solo destinatarios ficticios y namespaces UUID propios.

El namespace por defecto del launcher es `arcana-local-trial-v1`; `ARCANA_TRIAL_NAMESPACE` puede haberlo sustituido en un preview anterior. Para vincular una partida existente, abrir su URL/perfil y servidor correspondientes, mantener cookie válida y utilizar Ajustes → Guardar mi partida. No empezar otro invitado como método de recuperación. La cuenta se vincula al mismo jugador; los cromos no se exportan al cliente ni se vuelven a conceder.

## Durante el juego

Ajustes contiene Guardar mi partida o Mi cuenta. Desde Mi cuenta se puede cerrar esta sesión o recuperar acceso. Cerrar sesión no borra cuenta/colección ni cierra todos los dispositivos. Restablecer contraseña invalida todas las sesiones de generaciones anteriores. Sesiones fijas de siete días; volver a entrar recupera el mismo jugador, no crea otro kit.

Abrir una cuenta con otra partida requiere selección explícita. No hay fusión. El invitado anterior sigue en PostgreSQL, pero sin una sesión válida o vínculo no se promete poder recuperarlo. Resolver una operación incierta antes de cambiar de propietario; reautenticarse con la misma cuenta permite recuperar la misma petición/receipt.

Un timeout o error incierto no confirma que se haya rechazado la petición. Comprobar sesión o volver a identificarse como el mismo propietario; no abrir otro invitado para escapar del error. Si la respuesta del reset se pierde, intentar la nueva contraseña o pedir un nuevo código deliberadamente.

## Fuera del alcance técnico local

Dos contextos de navegador comprueban recuperación sin compartir cookies; no son dos dispositivos físicos. Acceso desde Internet/otro dispositivo exige un entorno autorizado posterior con HTTPS, configuración de origen/cookies y correo externo real. El transporte actual es inyectable para esa integración; no se ha contratado ni validado un proveedor. Antes de uso público hacen falta política y limpieza de datos, correo real, respaldo externo y revisión operativa adicional. No habilitar el launcher de ensayo en Internet.
