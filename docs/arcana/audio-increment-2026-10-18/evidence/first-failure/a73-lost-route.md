# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: browser-fluency/expedition-a73.spec.ts >> A73 complete authoritative expedition fluency en diagon-alley
- Location: tests/browser-fluency/expedition-a73.spec.ts:149:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-expedition-closure="won"]')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('[data-expedition-closure="won"]') with timeout 10000ms
  - waiting for locator('[data-expedition-closure="won"]')

```

```yaml
- link "Skip to content":
  - /url: "#content"
- banner:
  - heading "Diagon Alley" [level=1]
  - status
  - button "An enchanted night"
  - button "Settings"
- status: Node 6 resolved. The result is confirmed and saved.
- strong: "110"
- text: Energy 30 / 50
- meter "Magic energy"
- text: Next point at 11:41:30 AM.
- button "Refresh Energy"
- text: 0 Gold Keys
- main:
  - status
  - region "Expedition ended":
    - heading "Expedition ended" [level=2]
    - paragraph: Diagon Alley
    - paragraph: Last duel · Hermione Granger
    - button "Another expedition Choose your copies and equipment"
    - group: Your journey
  - region "Your next intention":
    - heading "Your next intention" [level=3]
    - button "Choose Try a flavour": Try a flavour
    - group: How to try it
    - group: "?"
- navigation "Main navigation":
  - button "Map"
  - button "Card Album"
  - button "Diagon Alley"
  - button "Missions"
```

Extracto seleccionado del artefacto CI39122556273; el original completo permanece en GitHub. Se omite el volcado repetido del código de la prueba.
