export declare class CtxService {
    worker: Worker;
    messageHandler?: (e: MessageEvent) => void;
    errorHandler?: (e: ErrorEvent) => void;
    constructor(worker: Worker);
    post(message: any): void;
    onMessage(callback: (e: MessageEvent) => void): void;
    onError(callback: (e: ErrorEvent) => void): void;
    close(): void;
    unmount(): void;
    private handleMessage;
    private handleError;
}
