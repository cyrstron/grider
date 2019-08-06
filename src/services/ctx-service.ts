export class CtxService {
  messageHandler?: (e: MessageEvent) => void;
  errorHandler?: (e: ErrorEvent) => void;

  constructor(
    public worker: Worker,
  ) {
    this.worker.addEventListener('message', this.handleMessage);
    this.worker.addEventListener('error', this.handleError);
  }

  post(message: any) {
    this.worker.postMessage(message);
  }

  onMessage(callback: (e: MessageEvent) => void) {
    this.messageHandler = callback;
  }

  onError(callback: (e: ErrorEvent) => void) {
    this.errorHandler = callback;
  }

  close() {
    this.unmount();
    close();
  }

  unmount() {
    this.worker.removeEventListener('message', this.handleMessage);
    this.worker.removeEventListener('error', this.handleError);
  }

  private handleMessage = (e: MessageEvent) => {
    if (e.data === 'terminate') {
      this.close();
      return;
    }

    if (!this.messageHandler) return;

    this.messageHandler(e);
  }

  private handleError = (e: ErrorEvent) => {
    if (!this.errorHandler) return;

    this.errorHandler(e);
  }
}
