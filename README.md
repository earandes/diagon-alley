# Colección Mágica · Callejón Diagón

Maqueta móvil jugable local: **Callejón → Weasley → consultar una rana → abrirla → resultado → álbum → Callejón**. Español e inglés, guardado IndexedDB recuperable, bienvenida nueva A13/A18 y arte provisional identificado adaptado a los conceptos de Weasley. Sin cuentas, backend, pagos o publicación.

## Ejecutar

Node **24** y npm. Lockfile incluido.

```sh
npm ci
npm run dev -- --port 5187
```

Abrir <http://127.0.0.1:5187/>. El puerto explícito evita interferir con otros proyectos locales. Guardado asociado al origen/perfil del navegador; cambiar puerto, localhost por 127.0.0.1 o perfil cambia el almacenamiento. Para mover una partida, exportar/importar JSON desde Ajustes.

Empieza con O01/O02/S01/S02 conocidos (4/12), una rana y una unidad de grageas guardada pero no abrible en I1. La rana garantiza identidad nueva entre seis candidatos; se guardan consumo/copia/operación antes del ritual omitible de 1,6 s. Recargar no concede otro regalo. Sin menú inferior fijo: accesos al álbum desde callejón, Weasley y resultado, con retorno al origen y foco. Ajustes permanecen en la cabecera. Con stock cero el álbum sigue accesible. Exportación/restauración validada y reset confirmado crean/sustituyen una demo local sin valor económico.

## Verificar

```sh
npm run typecheck
npm run validate:content
npm test
npm run build
npx playwright install chromium webkit
npm run test:e2e -- --project chromium --project webkit
```

`npm run test:e2e` intenta los tres motores configurados, incluido Firefox; ese motor no arranca su perfil en el Mac de esta entrega y queda pendiente. La CI ejecuta Chromium. No cambiar un perfil pendiente por una afirmación de cobertura de Safari/iPhone.

```sh
npm run preview -- --port 5190
# En otra terminal:
node tools/verification/measure-first-view.mjs
node tools/verification/measure-contrast.mjs
```

## Estado y fuentes

- [PRD v0.19](docs/PRD.md), [decisiones A23–A25](docs/DECISIONS.md), [Word histórico v0.5 intacto](docs/PRD_Coleccion_Magica.docx) e [instrucciones](AGENTS.md).
- [Evidencia y matriz I1-AC01–12](docs/i1-evidence/REPORT.md): implementado/probado y cobertura pendiente separados.
- [Capturas revisadas es/en](docs/i1-evidence/GALLERY.md).
- [Navegación sin menú inferior A27: pruebas y capturas actualizadas](docs/navigation-i1/REPORT.md).
- [Configuración, invariantes, versiones y dependencias](docs/i1-evidence/CONFIGURATION.md).
- [Manifest de arte provisional utilizado](src/content/art-manifest.json).

Dominio puro en `src/domain`; adaptador transaccional en `src/infrastructure`; datos e idiomas independientes en `src/content`/`src/i18n`; presentación raster encuadrado/SVG/DOM/CSS en `src/ui`. Sin arquitectura de expansiones o dependencias de IA/servicios externos.

El recorrido está implementado y comprobado en Chromium/WebKit emulados. **Quedan pendientes lector audible, móvil físico, Firefox, arte final y sesiones A17**: no se declara cierre total de I1, certificación WCAG o validación del atractivo/balance. Autenticación e historial por cuenta A19 y dirección ambiental ampliada A20 se conservan para el producto posterior. La confirmación actual delimita primero este ensayo local.

La adaptación visual A26 integra los conceptos de interior/rana/revelación mediante encuadres de raster y controles HTML. [Evidencia visual v2](docs/visual-i1-v2/REPORT.md). La caja tiene piezas DOM con máscaras; no un rig. C01/O01/O02 usan ilustraciones aportadas; otros cromos usan grabados SVG provisionales. No son assets finales. Otros estudios anteriores permanecen independientes. La procedencia de dibujos/tooling no acredita autorización Harry Potter. T01 sigue pendiente antes de la distribución correspondiente. No hay despliegue ni monetización.
