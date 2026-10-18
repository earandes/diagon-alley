/** Shared credential policy. Count Unicode code points, never trim or normalize. */
export function validPassword(value: string): boolean {
  // Every valid value fits in at most256 UTF16 units; bound work before allocating.
  if (typeof value !== 'string' || value.length > 256) return false;
  const length = [...value].length;
  return length >= 15 && length <= 128 && new TextEncoder().encode(value).byteLength <= 512;
}
