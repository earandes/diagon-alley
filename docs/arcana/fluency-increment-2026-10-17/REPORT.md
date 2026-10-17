# A73 · Fluidez de una expedición

Estado: candidato mínimo en comparación Linux; todavía sin integración en main. La evidencia parcial no se presenta como CI global correcta.

## Experiencia conservada

Entrada → preparación explícita → mapa → duelo → mapa → jefe → cierre → uso del botín poseído → otra expedición explícita. No cambia ninguna decisión, regla, coste, premio, composición o operación. Se conservan antesala A71, actor por piezas, reloj A69, ES/EN, paquetes, unidades/PV, controles semánticos, reducido y fallback DOM.

## Cambios elegidos

- Las llegadas de imágenes comparten una invalidación por frame; un ticker activo realiza el dibujo sin un segundo envío síncrono.
- Las fases y variaciones de PV/PM que no alteran geometría no reconstruyen plataformas/puestos. Cambios de arte/orden/posición/tamaño, caída y texturas nuevas sí invalidan.
- Las imágenes pertinentes se solicitan/decodifican a la entrada de la misma escena mientras se inicializa su renderer. No se precarga trabajo en la pantalla anterior ni se añade caché global.
- El ticker gráfico se detiene durante acuses estáticos del log. El reloj compartido, los controles y la proyección de estado siguen funcionando; entrada, hechizo, curación y quemadura conservan movimiento.
- El batch de figuras limita a8 las texturas simultáneas. Pixi divide lotes mayores; ninguna unidad desaparece. Graphics conserva su configuración propia. El GLSL y su coste se observan, no se infieren del atributo de configuración.

No se producen assets nuevos, se altera resolución ni se cambia renderer/dependencias. Los ensayos de mipmaps, autoload y atlas se retiraron: no justificaron su coste. Las fuentes ilustradas permanecen intactas y la evidencia desfavorable se conserva.

## Evidencia disponible

En ab-9, tres parejas del mismo runner genérico3×3: P95rAF33,3–33,4→16,7ms; tras remontar33,3→16,8ms. Jefe5×5:16,8→16,7ms. GLSL32/32→32/8samplers. Esta comparación aísla el límite de batching sobre la variante de atlas, no acredita todavía el candidato mínimo sin atlas ni todo dispositivo.

La corrección de arranque por decode paralelo ya mejoró las tres parejas de ab-3: genérico539–620→456–501ms y jefe685–738→489–494ms. Son cotas superiores hasta arte listo en polling; no tiempos GPU ni CPU pura. El objetivo provisional400ms genérico no se da por alcanzado. Variabilidad, extremos y ventanas sin mejora se conservan.

CI39034798097 compara el candidato mínimo0c0547c frente a referenciad13 con entradas iguales. Resultado pendiente. Después se ejecutarán recorrido completo y regresiones sobre el candidato real antes de integrar.

## Documentos

- [Contrato y plan](CONTRACT.md).
- [Diagnóstico, hipótesis y ensayos descartados](DIAGNOSIS.md).
- [Protocolo ejecutable](REFERENCE.md).
- [Resultados y límites](PERFORMANCE.md).
- [Validación](VALIDATION.md).
- [Compatibilidad y propiedad de recursos](COMPATIBILITY.md).
- [Ensayo de assets retirado](ASSET-ADAPTATION.md).

Pendientes: comparación final, matriz Linux, inspección visual seleccionada, revisión del diff, integración y verificación de main/CI. Humana, dispositivo físico y lector audible no realizados; un benchmark no demuestra comprensión, diversión o retención.
