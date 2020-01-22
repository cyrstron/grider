export class WebWorkerMock implements Worker {
  listeners: {
    [key: string]: EventListener[];
  } = {};

  onmessage: ((this: Worker, e: MessageEvent) => any) | null = null;

  onerror: ((this: AbstractWorker, e: ErrorEvent) => any) | null = null;

  postMessage(
    message: any,
  // _options?: PostMessageOptions | Transferable[]
  ): void {
    message;

    return;
  }

  terminate(): void {
    return;
  }

  addEventListener(
    eventName: string,
    callback: EventListener,
    // _options?: boolean | AddEventListenerOptions,
  ): void {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }

    this.listeners[eventName].push(callback);
  }

  removeEventListener(
    eventName: string,
    callback: EventListener,
  // _options?: boolean | AddEventListenerOptions,
  ): void {
    const listeners = this.listeners[eventName];

    if (!listeners) return;

    this.listeners[eventName] = listeners
      .filter((listener) => listener !== callback);
  }

  dispatchEvent(
    e: Event,
  ): boolean {
    const {type} = e;

    const listeners = this.listeners[type];

    if (!listeners) return true;

    listeners.forEach((listener) => {
      listener(e);
    });

    return false;
  }
}
