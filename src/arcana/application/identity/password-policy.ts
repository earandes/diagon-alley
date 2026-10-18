/** Shared credential policy. Count Unicode code points, never trim or normalize. */
export function validPassword(value: string): boolean {
  if (typeof value !== 'string') return false;
  const length = [...value].length;
  return length >= 15 && length <= 128 && new TextEncoder().encode(value).byteLength <= 512;
}
