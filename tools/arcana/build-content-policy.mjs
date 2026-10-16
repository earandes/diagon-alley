/** Private Diagon build is explicit; the ARCANA-only export policy stays strict. */
const franchise =
  /\b(?:diagon|knockturn|weasley|dumbledore|gringotts|ollivanders?|nimbus|quidditch|galeones|galleons|sickles|knuts|expelliarmus|bertie bott|harry potter)\b|ranas? de chocolate|avada kedavra|saeta de fuego/gi;
const historicalI1 =
  /magic-i1|coleccion-magica-i1\.json|welcome-table\.json|(?:alley|weasley|frog)-v1\.(?:webp|png)|["'](?:C0[1-4]|O0[1-4]|S0[1-4]|R0[1-3])["']/gi;
export function inspectBuildText(source, policy) {
  if (!['arcana', 'diagon-alley'].includes(policy)) throw Error('Unknown build content policy');
  const stale = source.match(historicalI1);
  if (stale) throw Error(`Historical I1 content: ${[...new Set(stale)].join(', ')}`);
  if (policy === 'arcana') {
    const forbidden = source.match(franchise);
    if (forbidden)
      throw Error(`Prohibited ARCANA-only content: ${[...new Set(forbidden)].join(', ')}`);
  }
}
