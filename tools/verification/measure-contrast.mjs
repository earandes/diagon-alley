import { writeFile } from 'node:fs/promises';
const pairs = [
  ['Texto principal', '#382b39', '#f6ecd9'],
  ['Texto secundario', '#67554c', '#f6ecd9'],
  ['Botón principal', '#fff7e4', '#4d285d'],
  ['Arte provisional', '#6d594e', '#f6ecd9'],
  ['Rareza habitual', '#495f52', '#f9edcf'],
  ['Rareza singular', '#2d666c', '#f9edcf'],
  ['Rareza extraordinaria', '#77402b', '#f9edcf'],
  ['Etiqueta de sección', '#8a452c', '#f6ecd9'],
  ['Foco visible', '#206f73', '#f6ecd9'],
];
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const result = {
  date: new Date().toISOString(),
  method:
    'WCAG relative luminance formula applied to explicit solid CSS text/surface pairs; not a whole-page accessibility audit',
  pairs: pairs.map(([label, text, background]) => {
    const a = luminance(text),
      b = luminance(background);
    return {
      label,
      text,
      background,
      ratio: Math.round(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)) * 100) / 100,
    };
  }),
};
await writeFile('docs/i1-evidence/contrast.json', JSON.stringify(result, null, 2) + '\n');
console.log(result);
