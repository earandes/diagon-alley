/** Keep the original offset, not the current page, so a capacity change retains its spread. */
export function albumWindow<T>(entries: readonly T[], offset: number, capacity: 4 | 8) {
  const pages = Math.max(1, Math.ceil(entries.length / capacity));
  const page = Math.max(0, Math.min(Math.floor(offset / capacity), pages - 1));
  return { page, pages, entries: entries.slice(page * capacity, (page + 1) * capacity) };
}
/** Aggregation is visual only: assignment commands still use a particular available unit ID. */
export function beanStockSelection(
  jars: readonly { readonly id: string }[],
  chosen: string | null,
) {
  const found = jars.findIndex((jar) => jar.id === chosen);
  const index = found >= 0 ? found : jars.length ? 0 : -1;
  return { id: jars[index]?.id ?? null, index, count: jars.length };
}
export function adjacentBeanId(
  jars: readonly { readonly id: string }[],
  chosen: string | null,
  direction: -1 | 1,
) {
  const selection = beanStockSelection(jars, chosen);
  if (!selection.id) return null;
  return jars[Math.max(0, Math.min(selection.index + direction, jars.length - 1))].id;
}
