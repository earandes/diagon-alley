# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: creatures-a87.spec.ts >> A87 creature poses and confirmed bond stay legible, pause exactly and survive skip and swap
- Location: tests/browser-creatures/creatures-a87.spec.ts:159:1

# Error details

```
Test timeout of 180000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - main [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - generic [ref=e7]:
          - heading "Arena de Combate" [level=2] [ref=e8]: Duelo de magos
          - generic [ref=e9]: Ronda 6
        - button "Pausa" [ref=e10] [cursor=pointer]
      - generic [ref=e14]:
        - region "Tu Equipo" [ref=e15]:
          - generic [ref=e16]:
            - heading "Tu Equipo" [level=3] [ref=e17]
            - generic "Vínculos confirmados" [ref=e18]:
              - 'button "Consultar vínculo: Criaturas fantásticas · 4 · II" [ref=e19] [cursor=pointer]':
                - generic [ref=e22]: II
          - generic [ref=e23]:
            - article "Tu Equipo · Unidad 1 · Fawkes" [ref=e24]:
              - 'button "Inspeccionar: Tu Equipo · Unidad 1 · Fawkes" [ref=e25] [cursor=pointer]':
                - generic "Fuera de combate" [ref=e28]: ×
                - strong [ref=e29]: Fawkes
                - generic [ref=e32]:
                  - meter "Vida de Tu Equipo · Unidad 1 · Fawkes" [ref=e33]
                  - generic [ref=e34]:
                    - text: "0"
                    - generic [ref=e35]: /80
            - article "Tu Equipo · Unidad 2 · Buckbeak" [ref=e36]:
              - 'button "Inspeccionar: Tu Equipo · Unidad 2 · Buckbeak" [ref=e37] [cursor=pointer]':
                - generic "Fuera de combate" [ref=e40]: ×
                - strong [ref=e41]: Buckbeak
                - generic [ref=e44]:
                  - meter "Vida de Tu Equipo · Unidad 2 · Buckbeak" [ref=e45]
                  - generic [ref=e46]:
                    - text: "0"
                    - generic [ref=e47]: /95
            - article "Tu Equipo · Unidad 3 · Unicornio" [ref=e48]:
              - 'button "Inspeccionar: Tu Equipo · Unidad 3 · Unicornio" [ref=e49] [cursor=pointer]':
                - generic "Fuera de combate" [ref=e52]: ×
                - strong [ref=e53]: Unicornio
                - generic [ref=e56]:
                  - meter "Vida de Tu Equipo · Unidad 3 · Unicornio" [ref=e57]
                  - generic [ref=e58]:
                    - text: "0"
                    - generic [ref=e59]: /90
            - article "Tu Equipo · Unidad 4 · Dragón galés verde" [ref=e60]:
              - 'button "Inspeccionar: Tu Equipo · Unidad 4 · Dragón galés verde" [ref=e61] [cursor=pointer]':
                - strong [ref=e64]: Dragón galés verde
                - generic [ref=e67]:
                  - meter "Vida de Tu Equipo · Unidad 4 · Dragón galés verde" [ref=e68]
                  - generic [ref=e69]:
                    - text: "45"
                    - generic [ref=e70]: /100
            - article "Tu Equipo · Unidad 5 · Harry Potter" [ref=e71]:
              - 'button "Inspeccionar: Tu Equipo · Unidad 5 · Harry Potter" [ref=e72] [cursor=pointer]':
                - strong [ref=e75]: Harry Potter
                - generic [ref=e79]:
                  - meter "Vida de Tu Equipo · Unidad 5 · Harry Potter" [ref=e80]
                  - generic [ref=e81]:
                    - text: "60"
                    - generic [ref=e82]: /100
          - paragraph [ref=e83]:
            - generic "Fuego II · Quemadura 2 PV/turno del objetivo" [ref=e84]: Fuego II
        - region "Rival" [ref=e85]:
          - generic [ref=e86]:
            - heading "Rival" [level=3] [ref=e87]
            - generic "Vínculos confirmados" [ref=e88]:
              - 'button "Consultar casa: Gryffindor · 4 · II" [ref=e89] [cursor=pointer]':
                - generic [ref=e93]: II
          - generic [ref=e94]:
            - article "Rival · Unidad 1 · Hermione Granger" [ref=e95]:
              - 'button "Inspeccionar: Rival · Unidad 1 · Hermione Granger" [ref=e96] [cursor=pointer]':
                - generic "Fuera de combate" [ref=e99]: ×
                - strong [ref=e100]: Hermione Granger
                - generic [ref=e104]:
                  - meter "Vida de Rival · Unidad 1 · Hermione Granger" [ref=e105]
                  - generic [ref=e106]:
                    - text: "0"
                    - generic [ref=e107]: /90
            - article "Rival · Unidad 2 · Ron Weasley" [ref=e108]:
              - 'button "Inspeccionar: Rival · Unidad 2 · Ron Weasley" [ref=e109] [cursor=pointer]':
                - generic "Fuera de combate" [ref=e112]: ×
                - strong [ref=e113]: Ron Weasley
                - generic [ref=e117]:
                  - meter "Vida de Rival · Unidad 2 · Ron Weasley" [ref=e118]
                  - generic [ref=e119]:
                    - text: "0"
                    - generic [ref=e120]: /90
            - article "Rival · Unidad 3 · Luna Lovegood" [ref=e121]:
              - 'button "Inspeccionar: Rival · Unidad 3 · Luna Lovegood" [ref=e122] [cursor=pointer]':
                - strong [ref=e125]: Luna Lovegood
                - generic [ref=e129]:
                  - meter "Vida de Rival · Unidad 3 · Luna Lovegood" [ref=e130]
                  - generic [ref=e131]:
                    - text: "54"
                    - generic [ref=e132]: /90
            - article "Rival · Unidad 4 · Ginny Weasley" [ref=e133]:
              - 'button "Inspeccionar: Rival · Unidad 4 · Ginny Weasley" [ref=e134] [cursor=pointer]':
                - strong [ref=e137]: Ginny Weasley
                - generic [ref=e141]:
                  - meter "Vida de Rival · Unidad 4 · Ginny Weasley" [ref=e142]
                  - generic [ref=e143]:
                    - text: "90"
                    - generic [ref=e144]: /90
            - article "Rival · Unidad 5 · Arthur Weasley" [ref=e145]:
              - 'button "Inspeccionar: Rival · Unidad 5 · Arthur Weasley" [ref=e146] [cursor=pointer]':
                - strong [ref=e149]: Arthur Weasley
                - generic [ref=e153]:
                  - meter "Vida de Rival · Unidad 5 · Arthur Weasley" [ref=e154]
                  - generic [ref=e155]:
                    - text: "90"
                    - generic [ref=e156]: /90
          - paragraph [ref=e157]:
            - generic "Fuego II · Quemadura 2 PV/turno del objetivo" [ref=e158]: Fuego II
            - generic "Sombras I · +2 iniciativa" [ref=e159]: Sombras I
      - generic [ref=e160]:
        - strong [ref=e161]: Empate
        - button "Continuar" [active] [ref=e162] [cursor=pointer]
      - status [ref=e163]: Empate
  - contentinfo [ref=e164]:
    - text: Declared presentation fixture
    - button "Swap" [ref=e165] [cursor=pointer]
    - button "Reduce" [ref=e166] [cursor=pointer]
```