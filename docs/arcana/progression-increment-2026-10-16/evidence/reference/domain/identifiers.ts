/** Shared identifier boundary used by inventory, collection and operation receipts. */
export const validDomainId = (value: unknown): value is string =>
  typeof value === 'string' && /^[a-zA-Z0-9_:-]{1,120}$/.test(value);
