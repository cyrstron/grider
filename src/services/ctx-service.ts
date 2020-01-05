export class CtxService {
  messageHandler?: (e: MessageEvent) => void;
  errorHandler?: (e: ErrorEvent) => void;

  constructor(
    public worker: Worker,
  ) {
    this.worker.addEventListener('message', this.handleMessage);
    this.worker.addEventListener('error', this.handleError);
  }

  post(message: any): void {
    this.worker.postMessage(message);
  }

  onMessage(callback: (e: MessageEvent) => void): void {
    this.messageHandler = callback;
  }

  onError(callback: (e: ErrorEvent) => void): void {
    this.errorHandler = callback;
  }

  close(): void {
    this.unmount();
    close();
  }

  unmount(): void {
    this.worker.removeEventListener('message', this.handleMessage);
    this.worker.removeEventListener('error', this.handleError);
  }

  private handleMessage = (e: MessageEvent): void => {
    if (e.data === 'terminate') {
      this.close();
      return;
    }

    if (!this.messageHandler) return;

    this.messageHandler(e);
  }

  private handleError = (e: ErrorEvent): void => {
    if (!this.errorHandler) return;

    this.errorHandler(e);
  }
}
