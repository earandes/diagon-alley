/** Coalesce asynchronous resource arrivals into one display frame. No replay time or domain state. */
export class FrameInvalidation {
  private pending: number | null = null;
  constructor(
    private readonly schedule: (draw: () => void) => number,
    private readonly cancel: (id: number) => void,
    private readonly draw: () => void,
  ) {}
  request() {
    if (this.pending !== null) return;
    this.pending = this.schedule(() => {
      this.pending = null;
      this.draw();
    });
  }
  cancelPending() {
    if (this.pending !== null) this.cancel(this.pending);
    this.pending = null;
  }
  flush() {
    this.cancelPending();
    this.draw();
  }
}
