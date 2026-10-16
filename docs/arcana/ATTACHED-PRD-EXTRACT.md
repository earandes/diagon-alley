# Extracción textual del Word ARCANA v1.0.0

Fuente intacta: ARCANA-PRD-v1.0.0.docx. Extracción de párrafos/tablas en orden XML; no recrea su maquetación. Ante diferencias con el mensaje de Enric, prevalece el mensaje.

DOCUMENTO DE REQUISITOS DE PRODUCTO (PRD)

Proyecto: ARCANA: El Bulevar Oculto

Tipo de Producto: WebApp Roguelike & Auto-Battler Mágico (Canvas / PWA)

Versión: 1.0.0 (Especificación Completa)

1. RESUMEN EJECUTIVO Y VISIÓN DEL PRODUCTO

1.1. Visión

ARCANA: El Bulevar Oculto es una aplicación web responsiva e interactiva que combina el adictivo bucle de exploración ramificada estilo Pokélike (pokelike.xyz / Slay the Spire) con una estética visual cinematográfica de fantasía oscura y un sistema de combate automático (Auto-Battler). Los jugadores arman su equipo de magos legendarios y criaturas mitológicas, equipan varitas e ítems tácticos, y se adentran en un mapa vertical de rutas donde toman decisiones estratégicas (combates automáticos, eventos misteriosos, enfermerías y tiendas) para completar su Cromodex y desentrañar los secretos del Bulevar.

1.2. Propuesta de Valor y Diferenciadores

Cero barreras de entrada: Ejecución instantánea en navegador móvil y escritorio sin descargas ni filtros restrictivos de tiendas de aplicaciones (App Store / Play Store).

Profundidad sin microgestión en combate (Auto-Battler): La estrategia reside al 100% en la preparación previa: composición del equipo, varitas equipadas, afinidades elementales y uso de consumibles con riesgo/recompensa como las Grageas del Azar.

Coleccionismo dinámico: Los cromos no son simples ilustraciones estáticas, sino hechiceros jugables con estadísticas, sinergias y rarezas.

Blindaje legal: Inspirado en el imaginario mágico popular, pero fundamentado íntegramente en el folclore tradicional de dominio público, eliminando cualquier riesgo de infracción de marcas registradas o copyright (Warner Bros. / Wizarding World).

2. MARCO LEGAL Y DE COPYRIGHT (TÉRMINOS PROHIBIDOS VS. PERMITIDOS)

Para garantizar la viabilidad legal y comercial a largo plazo, el juego opera bajo una estricta directriz de nomenclatura:

Concepto en el Universo Popular

Estado Legal

Solución en ARCANA (Permitida y Segura)

 

Callejón Diagon / Knockturn

Marca / Propiedad Intelectual

El Bulevar Oculto, El Pasaje Torcido, La Calzada Alquímica

Harry Potter / Dumbledore / Personajes de Rowling

Copyright y Marca Registrada

Magos Históricos y Mitológicos: Merlín, Morgana Le Fay, Nicolás Flamel, Paracelso, Circe

Ranas de Chocolate con Cromos

Obra protegida

Sapos de Cacao con Cromos Mágicos Arcanos

Grajeas de Todos los Sabores Bertie Bott

Marca Registrada

Grageas del Azar / Judías del Destino (Sabores sorpresa con bufos/debufos)

Gringotts y Bóvedas de Duendes

Creación específica

La Cámara de Obsidiana / Bóvedas Arcanas de los Goblins

Ollivanders / Tienda de Varitas

Marca Registrada

El Taller del Artesano de Varitas

Sortilegios Weasley / Honeydukes

Marcas Registradas

El Emporio de Artilugios, La Confitería Encantada

Quidditch / Escobas (Nimbus, Saeta)

Marcas Registradas

Justa Aérea / Vuelo Deportivo; Modelos originales: Céfiro 2000, Saeta del Viento

Galeones, Sickles, Knuts

Moneda de ficción de la saga

Coronas Mágicas (oro) y Esencia Rúnica (energía)

Hechizos inventados (Expelliarmus, etc.)

Copyright literario

Encantamientos en latín clásico/descriptivos: Desarme Arcano, Chispa Ígnea, Escudo Rúnico, Vórtice Espectral

3. ARQUITECTURA DE PANTALLAS Y FLUJO DE USUARIO (UI / UX)

3.1. Diagrama General del Flujo

[ INICIO / ONBOARDING ]        │ (Mago aprendiz + Varita inicial + 50 Coronas)       ▼[ EL MAPA ROGUELIKE DE LA RUTA ] <──────────────┐       │ (Selección de nodo de avance)          │       ├──────────────┬──────────────┬──────────┤       ▼              ▼              ▼          ▼  [ COMBATE      [ TIENDA       [ ENFERMERÍA  [ EVENTO /   AUTO-BATTLER]  DEL CAMINO]    ALQUÍMICA]    COFRE ]       │              │              │          │       └──────────────┴──────────────┴──────────┘                      │                      ▼             [ GANANCIA DE RECURSOS ]             (Coronas, Sapos, Grageas)                      │                      ▼     [ MENÚ GLOBAL: BAZAR / CROMODEX / FORJA ]

3.2. Detalle de Pantallas Principales

Pantalla A: El Mapa de Progresión Roguelike (La Ruta del Bulevar)

Header de Estado Superior:

Saldo de Coronas Mágicas e indicador de Esencia Mágica (Energía).

Insignias de Sinergia Activas: Muestra los bonos acumulados del equipo (ej. Alquimia III, Fuego II).

Banqueta del Equipo Activo: Despliegue de los 3 a 5 miembros activos con barras de salud residual, varitas asignadas y consumibles equipados.

Zona Central (El Árbol de Nodos):

Camino vertical en pergamino con ramificaciones y líneas punteadas interconectadas.

Tipología de Nodos:

⚔️ Duelo Arcano: Combate automático contra criaturas o hechiceros oscuros.

🩹 Refugio Alquímico: Cura el 40% de PV del equipo.

📦 Cofre del Botín: Coronas Mágicas, ingredientes o paquetes de Grageas.

🤝 Pacto Mágico: Reclutamiento temporal de un nuevo mago o criatura.

❓ Encuentro del Azar: Decisiones de texto con riesgo/recompensa.

👑 Jefe de Zona (Cámara Final): Guardián que desbloquea la siguiente localización del mundo.

Barra Inferior de Navegación: Accesos directos a Mapa, Cromodex, Bazar y Misiones.

Pantalla B: La Arena de Combate Automático (Auto-Battler en Columnas)

Columna Izquierda (Tu Equipo): Unidades colocadas sobre peanas rúnicas. Se visualizan barras de vida (PV), nivel, bufos y equipo equipado (Varita y Escoba de soporte).

Columna Derecha (Rival): Hechicero enemigo y sus criaturas/invocaciones.

Resolución Automática: Los hechizos y proyectiles mágicos colisionan en tiempo real en el canal central según el orden de iniciativa. Se incluye botón de aceleración de combate (2x / Auto).

Sinergias de Aquelarre: Activan bonificaciones pasivas según las afinidades elementales compartidas (ej. 2+ unidades de Fuego otorgan daño continuo; 3 unidades de Alquimia otorgan regeneración rúnica).

Pantalla C: La Tienda y Apertura de Sapos de Cacao (Unboxing / Gacha)

Caja Pentagonal de Sapo de Cacao: Al abrirla mediante Coronas Mágicas, estalla en partículas luminosas para revelar un cromo holográfico para la colección.

Tarro de Grageas del Azar: Consumibles de combate comprables en lote.

Pantalla D: El Álbum de Cromos (La Cromodex)

Parrilla de cromos coleccionables clasificados por rareza (Común, Inusual, Épico, Arcano Legendario).

Cartas no descubiertas mostradas como siluetas oscuras con candado.

Inspección detallada de atributos: PV, PM, Poder Arcano, Velocidad y descripción histórica del personaje. Permite equipar al mago directamente en el mazo de combate.

Pantalla E: El Taller de Varitas y Equipamiento

Expositor de varitas con vista interactiva, detalles de madera (Sauce, Saúco, Tejo, Roble), núcleo mitológico (Fibra de Dragón, Crin de Unicornio, Pluma de Fénix) y bonificadores de daño.

Pantalla F: Las Bóvedas de Obsidiana (Recompensas Mayores)

Cámaras acorazadas subterráneas desbloqueables mediante Llaves de Oro (obtenidas al derrotar Jefes de Zona o completar hitos semanales), que otorgan grandes bolsas de Coronas, ingredientes raros y cromos legendarios.

4. DINÁMICAS Y MECÁNICAS DE JUEGO DETALLADAS

4.1. Kit de Inicio (Onboarding)

Al acceder por primera vez, el jugador recibe un lote inicial balanceado:

1 Cromo de Mago: Aprendiz de Alquimia (Nivel 1, afinidad Neutra/Alquimia).

1 Varita Básica: Varita de Abedul (+2 Poder Arcano).

1 Escoba de Entrenamiento: Céfiro Cadete (+3 Iniciativa).

50 Coronas Mágicas: Fondo inicial para interactuar con la primera tienda.

4.2. Mecánica Exclusiva: "El Desafío de la Gragea"

Antes de comenzar una ruta o combate, el jugador puede asignar Grageas del Azar a sus unidades. Al arrancar la batalla automática, la gragea se activa al azar generando situaciones tácticas imprevistas:

Sabor Menta Dulce (+): Cura el 25% de PV al instante.

Sabor Pimienta Volcánica (+): +30% de daño en el primer ataque.

Sabor Tierra Podrida (-): Reduce la iniciativa un 15% durante 2 turnos.

Sabor Jabón Rancio (-): El primer hechizo del mago falla.

5. ECONOMÍA DEL JUEGO Y CONTROL DE INFLACIÓN (GATING)

Para evitar que los usuarios agoten el contenido en pocos días, se aplican tres frenos de economía:

Esencia Rúnica (Energía de Combate): Capacidad máxima de 50 puntos. Cada combate consume 5 puntos. Regeneración natural de 1 punto cada 12 minutos (recarga completa en 10 horas).

Rendimiento Decreciente por Repetición (Anti-Grind): La primera victoria en un nivel otorga el 100% de la recompensa (ej. 50 Coronas + 1 Sapo). Las repeticiones otorgan un 10% del valor base (5 Coronas).

Muros de Dificultad por Equipo: Los niveles avanzados exigen estadísticas mínimas de afinidad o equipo para ser superados, requiriendo inversión y planificación previa en el Bazar.

6. GUÍA DE ESTILO EDITORIAL Y COPYWRITING

Tono de voz: Místico, arcano, ligeramente socarrón en las tiendas de bromas y solemne en los enfrentamientos.

Glosario Oficial:

Aquelarre / Sindicato: Agrupaciones elementales y casas de magia.

Poder Arcano: Nivel de daño o efectividad mágica.

Sapos de Cacao: Cajas sorpresa de cromos.

Grageas del Azar: Caramelos sorpresa con efectos de combate.

Coronas Mágicas: Divisa económica principal.

Justa Aérea: Pruebas y disciplinas de vuelo en escoba.

7. HOJA DE RUTA Y EXPANSIÓN FUTURA (ROADMAP)

Fase 1: MVP (Lanzamiento Web Base)

Mundo 1: El Pasaje Torcido (15 nodos ramificados y 1 Jefe Final).

Sistema de combate automático en columnas (3 vs 3).

Álbum con los primeros 30 Cromos de Sabios y Hechiceros mitológicos.

Tienda básica con Sapos de Cacao y Grageas del Azar.

Fase 2: Expansión de Ecosistema y Nuevas Tiendas

Mundo 2: El Bosque de los Susurros: Nueva zona con 20 nodos y nodo especial de Refugio de Bestias para domesticar e incorporar criaturas (Escarbatos, Hipogrifos, Quimeras) al equipo.

El Laboratorio del Sabio (Crafting): Mesa de alquimia para destilar sabores de grageas y forjar ungüentos permanentes para las varitas.

Fase 3: Funcionalidades Sociales Asíncronas

El Zoco de Trueque: Tablón público donde los jugadores pueden ofertar e intercambiar cromos repetidos o grageas raras mediante códigos de intercambio.

La Torre de Desafíos Semanal: Modo infinito con tablas de clasificación para competir por Coronas Mágicas y peanas cosméticas.

8. ESPECIFICACIÓN TÉCNICA SUGERIDA

Frontend: React / Next.js o SvelteKit, integrado con Pixi.js o Phaser 3 para renderizado de mapas en 2.5D, efectos de partículas y fluidez a 60 FPS en navegadores móviles.

Backend: Node.js (TypeScript) o Go, con arquitectura modular y base de datos PostgreSQL.

Lógica de Combate: Determinista del lado del servidor (Server-Side Calculation) mediante semillas aleatorias (seeds) para prevenir trampas e inconsistencias en recompensas.
