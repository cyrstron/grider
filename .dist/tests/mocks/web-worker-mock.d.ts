export declare class WebWorkerMock implements Worker {
    listeners: {
        [key: string]: EventListener[];
    };
    onmessage: ((this: Worker, e: MessageEvent) => any) | null;
    onerror: ((this: AbstractWorker, e: ErrorEvent) => any) | null;
    postMessage(message: any): void;
    terminate(): void;
    addEventListener(eventName: string, callback: EventListener): void;
    removeEventListener(eventName: string, callback: EventListener): void;
    dispatchEvent(e: Event): boolean;
}
