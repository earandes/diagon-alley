export class ArcanaClientError extends Error {
  constructor(
    readonly code: string,
    readonly status: number,
    readonly recoverWithSameKey = false,
  ) {
    super(code);
    this.name = 'ArcanaClientError';
  }
}
