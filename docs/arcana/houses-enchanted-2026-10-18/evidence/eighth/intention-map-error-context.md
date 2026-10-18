# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tactical-intentions-a65.spec.ts >> A65 intention selection preparation activation recovery es arcana
- Location: tests/browser-trial/tactical-intentions-a65.spec.ts:133:5

# Error details

```
Test timeout of 150000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=f2e3]:
  - link "Saltar al contenido" [ref=f2e4] [cursor=pointer]:
    - /url: "#content"
  - banner [ref=f2e5]:
    - heading "El Pasaje Torcido Descubrimiento" [level=1] [ref=f2e6]:
      - text: El Pasaje Torcido
      - generic [ref=f2e7]: Descubrimiento
    - generic [ref=f2e8]:
      - status [ref=f2e9]
      - button "Una noche encantada" [ref=f2e10] [cursor=pointer]
    - button "Ajustes" [ref=f2e13] [cursor=pointer]
  - status [ref=f2e16]: Nodo 1 resuelto. El resultado está confirmado y guardado.
  - generic [ref=f2e17]:
    - strong [ref=f2e18]:
      - generic "Coronas" [ref=f2e20]: "120"
    - generic [ref=f2e21]:
      - generic [ref=f2e22]:
        - generic [ref=f2e24]: Esencia
        - text: 40 / 50
        - meter "Esencia Rúnica" [ref=f2e25]
      - generic [ref=f2e26]: Próximo punto a las 19:27:55.
      - button "Actualizar Esencia" [ref=f2e27] [cursor=pointer]
    - generic [ref=f2e30]:
      - strong [aria-hidden] [ref=f2e32]: "1"
      - generic [ref=f2e33]: 1 Llave de Oro
  - main [active] [ref=f2e34]:
    - status [ref=f2e35]
    - generic [ref=f2e36]:
      - generic:
        - complementary "Siguiente objetivo":
          - generic:
            - heading "Un aliado más en el camino" [level=3]
            - group [ref=f2e37]:
              - generic "Siguiente objetivo" [ref=f2e38] [cursor=pointer]: "?"
            - 'generic "Etapas recorridas: 1 de 7"': 1 / 7
      - region "Resultado de nodo confirmado" [ref=f2e39]:
        - group [ref=f2e40]:
          - generic "Resultado de nodo confirmado" [ref=f2e41] [cursor=pointer]:
            - generic [ref=f2e45]: Paracelso
            - generic [aria-hidden] [ref=f2e49]: ⌄
      - group [ref=f2e50]:
        - generic "Prueba un sabor En esta ruta" [ref=f2e51] [cursor=pointer]:
          - generic [ref=f2e53]:
            - text: Prueba un sabor
            - generic [ref=f2e54]: En esta ruta
          - generic [aria-hidden] [ref=f2e55]: ✦
      - region "Tu Equipo" [ref=f2e56]:
        - heading "Tu Equipo" [level=2] [ref=f2e57]
        - button "Aprendiz de Alquimia" [ref=f2e59] [cursor=pointer]:
          - generic [ref=f2e61]: Copia propia
          - meter "Vida de Aprendiz de Alquimia" [ref=f2e64]
        - button "Paracelso" [ref=f2e66] [cursor=pointer]:
          - generic [ref=f2e68]: Aliado temporal
          - meter "Vida de Paracelso" [ref=f2e71]
        - button "Prepara tu expedición" [ref=f2e72] [cursor=pointer]
        - generic "Casas del equipo" [ref=f2e75]:
          - group [ref=f2e76]:
            - generic "Compañía del León · 1/3" [ref=f2e77] [cursor=pointer]: Compañía del León 1/3
          - group [ref=f2e82]:
            - generic "Orden de la Serpiente · 1/3" [ref=f2e83] [cursor=pointer]: Orden de la Serpiente 1/3
      - button "Ver lista de nodos" [ref=f2e88] [cursor=pointer]
      - generic [ref=f2e91]:
        - generic "Inicio"
        - button "Pacto Mágico · etapa 1, opción 1 · Visitado" [disabled] [ref=f2e93]:
          - generic [aria-hidden] [ref=f2e96]: ✓
          - strong [ref=f2e97]: Pacto Mágico
          - generic [ref=f2e98]: Visitado
        - button "Cofre de Botín · etapa 2, opción 1 · Disponible" [ref=f2e100] [cursor=pointer]:
          - generic [aria-hidden] [ref=f2e103]: ▴
          - strong [ref=f2e104]: Cofre de Botín
          - generic [ref=f2e105]: Disponible
          - generic [ref=f2e106]: Botín de la ruta
        - button "Pacto Mágico · etapa 2, opción 2 · Disponible" [ref=f2e108] [cursor=pointer]:
          - generic [aria-hidden] [ref=f2e111]: ▴
          - strong [ref=f2e112]: Pacto Mágico
          - generic [ref=f2e113]: Disponible
          - generic [ref=f2e114]: Aliado temporal
        - button "Pacto Mágico · etapa 3, opción 1 · Bloqueado" [ref=f2e116] [cursor=pointer]:
          - strong [ref=f2e119]: Pacto Mágico
          - generic [ref=f2e120]: Bloqueado
        - button "Duelo Arcano · etapa 3, opción 2 · Bloqueado" [ref=f2e122] [cursor=pointer]:
          - strong [ref=f2e125]: Duelo Arcano
          - generic [ref=f2e126]: Bloqueado
        - button "Cofre de Botín · etapa 3, opción 3 · Bloqueado" [ref=f2e128] [cursor=pointer]:
          - strong [ref=f2e131]: Cofre de Botín
          - generic [ref=f2e132]: Bloqueado
        - button "Encuentro · etapa 4, opción 1 · Bloqueado" [ref=f2e134] [cursor=pointer]:
          - strong [ref=f2e137]: Encuentro
          - generic [ref=f2e138]: Bloqueado
        - button "Cofre de Botín · etapa 4, opción 2 · Bloqueado" [ref=f2e140] [cursor=pointer]:
          - strong [ref=f2e143]: Cofre de Botín
          - generic [ref=f2e144]: Bloqueado
        - button "Duelo Arcano · etapa 4, opción 3 · Bloqueado" [ref=f2e146] [cursor=pointer]:
          - generic: Vanguardia · iniciativa
          - strong: Duelo Arcano
          - generic [ref=f2e149]: Bloqueado
        - button "Duelo Arcano · etapa 5, opción 1 · Bloqueado" [ref=f2e151] [cursor=pointer]:
          - generic: Fuego · quemadura
          - strong [ref=f2e154]: Duelo Arcano
          - generic [ref=f2e155]: Bloqueado
        - button "Refugio Alquímico · etapa 5, opción 2 · Bloqueado" [ref=f2e157] [cursor=pointer]:
          - strong [ref=f2e160]: Refugio Alquímico
          - generic [ref=f2e161]: Bloqueado
        - button "Refugio Alquímico · etapa 5, opción 3 · Bloqueado" [ref=f2e163] [cursor=pointer]:
          - strong [ref=f2e166]: Refugio Alquímico
          - generic [ref=f2e167]: Bloqueado
        - button "Duelo Arcano · etapa 6, opción 1 · Bloqueado" [ref=f2e169] [cursor=pointer]:
          - generic: Vanguardia · iniciativa
          - strong [ref=f2e172]: Duelo Arcano
          - generic [ref=f2e173]: Bloqueado
        - button "Encuentro · etapa 6, opción 2 · Bloqueado" [ref=f2e175] [cursor=pointer]:
          - strong [ref=f2e178]: Encuentro
          - generic [ref=f2e179]: Bloqueado
        - button "Refugio Alquímico · etapa 6, opción 3 · Bloqueado" [ref=f2e181] [cursor=pointer]:
          - strong [ref=f2e184]: Refugio Alquímico
          - generic [ref=f2e185]: Bloqueado
        - button "Jefe de Zona · etapa 7, opción 1 · Bloqueado" [ref=f2e187] [cursor=pointer]:
          - strong [ref=f2e190]: Jefe de Zona
          - generic [ref=f2e191]: Bloqueado
  - navigation "Navegación principal" [ref=f2e192]:
    - button "Mapa" [ref=f2e193] [cursor=pointer]
    - button "Cromodex" [ref=f2e196] [cursor=pointer]
    - button "Bazar" [ref=f2e199] [cursor=pointer]
    - button "Misiones" [ref=f2e202] [cursor=pointer]
```