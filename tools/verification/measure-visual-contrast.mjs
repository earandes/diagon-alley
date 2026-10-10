import { writeFile } from 'node:fs/promises';
const pairs = [
  ['Texto principal, superficie más clara', '#f6e8cb', '#482539'],
  ['Texto secundario', '#d2bfae', '#482539'],
  ['Botón principal, extremo más oscuro', '#24130d', '#d59c54'],
  ['Arte provisional', '#d2bfae', '#482539'],
  ['Rareza habitual', '#c5e8c8', '#372331'],
  ['Rareza singular', '#afe1e7', '#372331'],
  ['Rareza extraordinaria', '#ffd396', '#372331'],
  ['Etiqueta de sección', '#f0c680', '#482539'],
  ['Foco visible', '#99e3d7', '#482539'],
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
await writeFile(
  process.argv[2] ?? 'docs/visual-i1-v2/contrast.json',
  JSON.stringify(result, null, 2) + '\n',
);
console.log(result);
